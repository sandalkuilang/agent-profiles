//! Settings that belong to the app as a whole rather than to one profile or
//! one app it manages — language and the auto-update switch. Kept in their
//! own file, one level above the per-app roots produced by [`crate::paths`],
//! because neither setting has anything to do with any particular app.

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

/// Every language the interface has been translated into, in the order the
/// General tab offers them. The frontend owns the actual translations; this
/// list exists so a language written by an old version, or edited by hand,
/// can be recognised as invalid rather than silently accepted.
pub const SUPPORTED_LANGUAGES: &[&str] = &["en", "id", "ja", "de", "es", "pt"];

const DEFAULT_LANGUAGE: &str = "en";

/// Picks a supported language, falling back to English for anything this
/// build does not have a translation for — including a code a future version
/// once wrote that this version no longer recognises.
pub fn normalize_language(language: &str) -> &'static str {
    SUPPORTED_LANGUAGES
        .iter()
        .find(|&&candidate| candidate == language)
        .copied()
        .unwrap_or(DEFAULT_LANGUAGE)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(default)]
pub struct Settings {
    pub language: String,
    /// Off until turned on, the same convention as Launch at login: a switch
    /// that downloads and installs something without being asked is not a
    /// default a person should wake up to.
    pub auto_update: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            language: DEFAULT_LANGUAGE.to_string(),
            auto_update: false,
        }
    }
}

impl Settings {
    fn file(root: &Path) -> PathBuf {
        root.join("settings.json")
    }

    /// A settings file that cannot be read or parsed is treated exactly like
    /// one that has never been written: default settings, not a startup
    /// failure over a preference this app can happily do without.
    pub fn load(root: &Path) -> Self {
        let raw = match std::fs::read(Self::file(root)) {
            Ok(raw) => raw,
            Err(_) => return Self::default(),
        };
        let mut settings = serde_json::from_slice::<Settings>(&raw).unwrap_or_default();
        settings.language = normalize_language(&settings.language).to_string();
        settings
    }

    pub fn save(&self, root: &Path) -> Result<()> {
        std::fs::create_dir_all(root)?;
        std::fs::write(Self::file(root), serde_json::to_string_pretty(self)?)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_missing_file_loads_as_defaults() {
        let dir = tempfile::tempdir().unwrap();
        let settings = Settings::load(dir.path());
        assert_eq!(settings, Settings::default());
        assert_eq!(settings.language, "en");
        assert!(!settings.auto_update);
    }

    #[test]
    fn saved_settings_survive_a_reload() {
        let dir = tempfile::tempdir().unwrap();
        let settings = Settings {
            language: "ja".into(),
            auto_update: true,
        };
        settings.save(dir.path()).unwrap();
        assert_eq!(Settings::load(dir.path()), settings);
    }

    #[test]
    fn a_corrupt_file_loads_as_defaults_rather_than_failing_startup() {
        let dir = tempfile::tempdir().unwrap();
        std::fs::write(dir.path().join("settings.json"), b"{ not json").unwrap();
        assert_eq!(Settings::load(dir.path()), Settings::default());
    }

    #[test]
    fn a_language_this_build_no_longer_recognises_falls_back_to_english() {
        let dir = tempfile::tempdir().unwrap();
        std::fs::write(
            dir.path().join("settings.json"),
            br#"{"language":"klingon","auto_update":true}"#,
        )
        .unwrap();
        let settings = Settings::load(dir.path());
        assert_eq!(settings.language, "en");
        // The rest of the file is still honoured — only the one bad field falls back.
        assert!(settings.auto_update);
    }

    #[test]
    fn every_supported_language_round_trips() {
        for &language in SUPPORTED_LANGUAGES {
            let dir = tempfile::tempdir().unwrap();
            let settings = Settings {
                language: language.into(),
                auto_update: false,
            };
            settings.save(dir.path()).unwrap();
            assert_eq!(Settings::load(dir.path()).language, language);
        }
    }
}
