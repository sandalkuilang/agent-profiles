//! Checks `husniadil/agent-profiles` on GitHub for a newer release and, when
//! the switch on the General tab is on, downloads and installs it without
//! showing anything — no dialog asking permission, no progress window, no
//! "restart now?" prompt. The endpoint is configured in `tauri.conf.json`
//! (`plugins.updater.endpoints`) against `releases/latest/download/latest.json`,
//! which GitHub only ever resolves to a published, non-draft release — a
//! release still sitting as a draft is invisible to this exactly as it is to
//! a browser.

use crate::runtime::AppState;
use anyhow::{anyhow, Result};
use std::time::Duration;
use tauri::{AppHandle, Manager};
use tauri_plugin_updater::UpdaterExt;

/// How often the app checks while it keeps running. A tray app is typically
/// never quit, so "check on launch" alone could mean days between checks; this
/// is not so tight that it hammers GitHub, and not so loose that a release
/// takes a week to reach anyone.
const CHECK_INTERVAL: Duration = Duration::from_secs(6 * 60 * 60);

/// A first check waits this long after launch, so it never competes with the
/// window and tray finding their feet on startup.
const INITIAL_DELAY: Duration = Duration::from_secs(30);

/// Registering an updater against a development build would check for an
/// update to a binary that was never installed anywhere — there is nothing
/// for `download_and_install` to replace, and no reason to ask a debug build
/// to relaunch itself. Same reasoning `autostart_is_offered` uses for the
/// login item, and the same shape of answer.
pub fn is_offered() -> bool {
    !cfg!(debug_assertions)
}

#[derive(Debug, Clone, PartialEq, serde::Serialize)]
#[serde(tag = "status", rename_all = "snake_case")]
pub enum Outcome {
    /// Auto-update is off, or this is a development build.
    NotOffered,
    UpToDate,
    /// Downloaded, installed, and a restart onto the new version was requested.
    Installed {
        version: String,
    },
}

/// Checks once, and installs silently when a newer release exists.
///
/// Ends by asking the app to restart, so the moment this returns
/// `Installed`, the process is on its way out. Everything callers might
/// still want to do — updating a status line, say — has to happen before
/// they inspect the result, not after.
pub async fn check_and_install(app: &AppHandle) -> Result<Outcome> {
    let updater = app
        .updater()
        .map_err(|error| anyhow!("updater is not available: {error}"))?;
    let Some(update) = updater.check().await? else {
        return Ok(Outcome::UpToDate);
    };
    let version = update.version.clone();
    // No progress callback, no confirmation: this is the "silent" half of the
    // request. `on_before_exit` (the updater's own hook) is skipped because
    // this app already owns exiting cleanly through `request_restart` below.
    update
        .download_and_install(|_chunk, _total| {}, || {})
        .await?;
    app.request_restart();
    Ok(Outcome::Installed { version })
}

/// A check gated on this being a build the updater is offered for at all,
/// used by both the periodic loop and a person's own "Check for updates now".
async fn checked_by(
    app: &AppHandle,
    wants_check: impl FnOnce() -> Result<bool>,
) -> Result<Outcome> {
    if !is_offered() {
        return Ok(Outcome::NotOffered);
    }
    if !wants_check()? {
        return Ok(Outcome::NotOffered);
    }
    check_and_install(app).await
}

/// The periodic background loop's check: silent, and only when the switch on
/// the General tab is on.
async fn check_if_enabled(app: &AppHandle) -> Result<Outcome> {
    checked_by(app, || {
        let state = app
            .try_state::<AppState>()
            .ok_or_else(|| anyhow!("Agent Profiles state is not available"))?;
        let settings = state
            .settings
            .lock()
            .map_err(|_| anyhow!("settings are unavailable"))?;
        Ok(settings.auto_update)
    })
    .await
}

/// A person clicking "Check for updates now" is its own consent for that one
/// check — it runs whether or not the automatic switch is on, the same way a
/// browser's "Check for updates" button does not first ask whether background
/// updates are enabled.
pub async fn manual_check(app: &AppHandle) -> Result<Outcome> {
    checked_by(app, || Ok(true)).await
}

/// Runs `check_if_enabled` on a schedule for as long as the app is alive. A
/// tray app has no natural "screen the user is looking at" moment to check
/// on, unlike a browser tab regaining focus, so time is the only signal
/// available.
pub fn spawn_periodic_checks(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        tokio::time::sleep(INITIAL_DELAY).await;
        loop {
            if let Err(error) = check_if_enabled(&app).await {
                eprintln!("auto-update check failed: {error}");
            }
            tokio::time::sleep(CHECK_INTERVAL).await;
        }
    });
}
