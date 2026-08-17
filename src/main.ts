import "./styles.css";

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { applyTranslations, getLocale, LOCALE_LABELS, setLocale, SUPPORTED_LOCALES, t } from "./i18n";

type ProfileView = {
  id: string;
  app_id: string;
  label: string;
  path: string;
  is_default: boolean;
  shares_account: boolean;
};

type AppView = {
  id: string;
  label: string;
  unavailable: string | null;
  profiles: ProfileView[];
};

const appsElement = document.querySelector<HTMLDivElement>("#apps");
const countElement = document.querySelector<HTMLSpanElement>("#profile-count");
const errorElement = document.querySelector<HTMLDivElement>("#error");
const addForm = document.querySelector<HTMLFormElement>("#add-profile-form");
const labelInput = document.querySelector<HTMLInputElement>("#new-label");
const appSelect = document.querySelector<HTMLSelectElement>("#new-app");
const addErrorElement = document.querySelector<HTMLDivElement>("#add-error");

if (
  !appsElement ||
  !countElement ||
  !errorElement ||
  !addForm ||
  !labelInput ||
  !appSelect ||
  !addErrorElement
) {
  throw new Error("Agent Profiles management window is missing required elements");
}

const appsContainer = appsElement;
const profileCount = countElement;
const errorBox = errorElement;
const profileForm = addForm;
const profileLabelInput = labelInput;
const profileAppSelect = appSelect;
const addErrorBox = addErrorElement;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function showError(error: unknown): void {
  errorBox.textContent = errorMessage(error);
  errorBox.hidden = false;
}

function clearError(): void {
  errorBox.textContent = "";
  errorBox.hidden = true;
}

/// Adding a profile reports next to the form rather than in the page banner.
/// The banner sits above the profile list, which on any populated window is far
/// enough above the form to be scrolled out of sight — a refused label then
/// looks like a button that did nothing at all.
function showAddError(error: unknown): void {
  addErrorBox.textContent = errorMessage(error);
  addErrorBox.hidden = false;
}

function clearAddError(): void {
  addErrorBox.textContent = "";
  addErrorBox.hidden = true;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = -1;
  do {
    value /= 1024;
    unit += 1;
  } while (value >= 1024 && unit < units.length - 1);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

function makeTextElement(tag: "h3" | "h4" | "p" | "span", className: string, text: string): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function profileCard(profile: ProfileView, position: number): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "profile-card";

  const index = makeTextElement("span", "profile-index", String(position).padStart(2, "0"));
  const content = document.createElement("div");
  content.className = "profile-content";
  const title = document.createElement("div");
  title.className = "profile-title";
  title.append(makeTextElement("h3", "profile-label", profile.label));
  if (profile.is_default) {
    title.append(makeTextElement("span", "status-badge status-default", t("profile.default")));
  }
  if (profile.shares_account) {
    title.append(makeTextElement("span", "status-badge status-warning", t("profile.sameAccount")));
  }
  content.append(title);
  // The path is ellipsised to keep rows one line tall, so the full value has to
  // stay reachable — it is the only thing distinguishing two similar profiles.
  const path = makeTextElement("p", "profile-path", profile.path);
  path.title = profile.path;
  content.append(path);

  const actions = document.createElement("div");
  actions.className = "profile-actions";

  const renameButton = document.createElement("button");
  renameButton.className = "button button-quiet";
  renameButton.type = "button";
  renameButton.textContent = t("profile.rename");
  renameButton.addEventListener("click", () => startRename(profile, content));
  actions.append(renameButton);

  // The Default profile is the app's own existing installation, so its directory
  // is never ours to delete. Its label is still just a label.
  if (!profile.is_default) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "button button-danger";
    deleteButton.type = "button";
    deleteButton.textContent = t("profile.delete");
    deleteButton.addEventListener("click", () => startDelete(profile, content));
    actions.append(deleteButton);
  }

  item.append(index, content, actions);
  return item;
}

function render(apps: AppView[]): void {
  appsContainer.replaceChildren();

  const available = apps.filter((app) => app.unavailable === null);
  profileCount.textContent = String(
    available.reduce((total, app) => total + app.profiles.length, 0),
  );

  // Nothing installed is the only case worth explaining. With one app working,
  // the other's absence is not an error — it is simply not installed.
  if (available.length === 0) {
    for (const app of apps) {
      appsContainer.append(makeTextElement("p", "helper", app.unavailable ?? ""));
    }
    // Clear the picker on the way out. Returning early used to leave whichever
    // options the last render built, so submitting the form after the only
    // installed app disappeared would create a profile directory for an app
    // that is no longer there to launch it.
    renderAppChoices([]);
    return;
  }

  for (const app of available) {
    const group = document.createElement("section");
    group.className = "app-group";
    // A heading only earns its space once there is a second app to tell apart.
    if (available.length > 1) {
      group.append(makeTextElement("h4", "app-heading", app.label));
    }
    const list = document.createElement("ul");
    list.className = "profile-list";
    app.profiles.forEach((profile, index) => list.append(profileCard(profile, index + 1)));
    group.append(list);
    appsContainer.append(group);
  }

  renderAppChoices(available);
}

// The picker is only a question when there is more than one answer.
function renderAppChoices(available: AppView[]): void {
  const previous = profileAppSelect.value;
  profileAppSelect.replaceChildren();
  for (const app of available) {
    const option = document.createElement("option");
    option.value = app.id;
    option.textContent = app.label;
    profileAppSelect.append(option);
  }
  if (available.some((app) => app.id === previous)) {
    profileAppSelect.value = previous;
  }
  const picker = profileAppSelect.closest(".app-picker") as HTMLElement | null;
  if (picker) picker.hidden = available.length < 2;
  // With nothing to add a profile to, the whole section goes: a heading over an
  // empty space reads as something failing to load, and the form beneath it is a
  // control that could only fail.
  const section = profileForm.closest("section") as HTMLElement | null;
  if (section) section.hidden = available.length === 0;
}

/// Rename and delete both used to call `window.prompt` / `window.confirm`.
/// Tauri's webview does not implement either one, so both actions silently did
/// nothing. Everything below is drawn in the page instead.
function startRename(profile: ProfileView, content: HTMLElement): void {
  if (content.querySelector(".inline-panel")) return;

  const panel = document.createElement("form");
  panel.className = "inline-panel";

  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 80;
  input.value = profile.label;
  input.setAttribute("aria-label", t("profile.renameAriaLabel", { label: profile.label }));

  const save = document.createElement("button");
  save.type = "submit";
  save.className = "button button-primary";
  save.textContent = t("profile.save");

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "button button-quiet";
  cancel.textContent = t("profile.cancel");
  cancel.addEventListener("click", () => panel.remove());

  panel.append(input, save, cancel);
  panel.addEventListener("submit", async (event) => {
    event.preventDefault();
    const label = input.value.trim();
    if (!label || label === profile.label) {
      panel.remove();
      return;
    }
    try {
      await invoke("rename_profile", { appId: profile.app_id, id: profile.id, label });
      clearError();
      await loadProfiles();
    } catch (error) {
      showError(error);
    }
  });

  content.append(panel);
  input.focus();
  input.select();
}

async function startDelete(profile: ProfileView, content: HTMLElement): Promise<void> {
  if (content.querySelector(".inline-panel")) return;

  let size: number;
  try {
    size = await invoke<number>("profile_size_bytes", { appId: profile.app_id, id: profile.id });
  } catch (error) {
    showError(error);
    return;
  }

  const panel = document.createElement("div");
  panel.className = "inline-panel inline-panel-danger";
  panel.append(
    makeTextElement(
      "p",
      "helper",
      t("profile.deleteConfirm", { label: profile.label, size: formatBytes(size), path: profile.path }),
    ),
  );

  const confirm = document.createElement("button");
  confirm.type = "button";
  confirm.className = "button button-danger";
  confirm.textContent = t("profile.deleteConfirmButton");
  confirm.addEventListener("click", async () => {
    try {
      await invoke("delete_profile", { appId: profile.app_id, id: profile.id });
      clearError();
      await loadProfiles();
    } catch (error) {
      showError(error);
    }
  });

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "button button-quiet";
  cancel.textContent = t("profile.keepIt");
  cancel.addEventListener("click", () => panel.remove());

  panel.append(confirm, cancel);
  content.append(panel);
  confirm.focus();
}

async function loadProfiles(): Promise<void> {
  try {
    const apps = await invoke<AppView[]>("list_apps");
    render(apps);
    clearError();
  } catch (error) {
    showError(error);
  }
}

async function addProfile(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const label = profileLabelInput.value.trim();
  if (!label) {
    showAddError(t("add.errorNoLabel"));
    profileLabelInput.focus();
    return;
  }
  const appId = profileAppSelect.value;
  if (!appId) {
    showAddError(t("add.errorNoApp"));
    return;
  }

  try {
    await invoke("add_profile", { appId, label });
    profileLabelInput.value = "";
    clearAddError();
    await loadProfiles();
  } catch (error) {
    showAddError(error);
  }
}

// A refusal is about the label as it was submitted. The moment it is edited the
// verdict is stale, and leaving it on screen invites the reader to believe the
// new label was rejected too.
profileLabelInput.addEventListener("input", clearAddError);
profileAppSelect.addEventListener("change", clearAddError);

// A desktop app has no business offering "Reload" or "Inspect Element" on
// right-click. Keep the caret menu inside text fields, where it is useful.
document.addEventListener("contextmenu", (event) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest("input, textarea")) return;
  event.preventDefault();
});

// ---------------------------------------------------------------------------
// Tabs: Profiles and General. Two sections of one window rather than two
// windows, so the tray's "Manage Profiles…" keeps opening to one place.
// ---------------------------------------------------------------------------

const tabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".tab-button"));

function selectTab(button: HTMLButtonElement): void {
  for (const candidate of tabButtons) {
    const selected = candidate === button;
    candidate.setAttribute("aria-selected", String(selected));
    const panelId = candidate.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (panel) panel.hidden = !selected;
  }
}

for (const button of tabButtons) {
  button.addEventListener("click", () => selectTab(button));
}

// ---------------------------------------------------------------------------
// General tab: language and autostart.
// ---------------------------------------------------------------------------

type AutostartState = { offered: boolean; enabled: boolean };

const autostartSection = document.querySelector<HTMLElement>("#autostart-section");
const autostartToggle = document.querySelector<HTMLInputElement>("#autostart");

// The operating system owns this setting, so the checkbox is refreshed from it
// rather than remembered here — the user may have changed it in System Settings.
async function loadAutostart(): Promise<void> {
  if (!autostartSection || !autostartToggle) return;
  try {
    const state = await invoke<AutostartState>("autostart_state");
    autostartSection.hidden = !state.offered;
    autostartToggle.checked = state.enabled;
  } catch (error) {
    autostartSection.hidden = true;
    showError(error);
  }
}

autostartToggle?.addEventListener("change", async () => {
  const wanted = autostartToggle.checked;
  try {
    await invoke("set_autostart", { enabled: wanted });
    clearError();
  } catch (error) {
    showError(error);
  }
  // Re-read rather than trusting the click: if the OS refused, the checkbox must
  // show what is actually true, not what the user asked for.
  await loadAutostart();
});

type GeneralSettings = {
  language: string;
  auto_update: boolean;
  auto_update_offered: boolean;
};

const languageSelect = document.querySelector<HTMLSelectElement>("#language-select");
const autoUpdateSection = document.querySelector<HTMLElement>("#auto-update-section");
const autoUpdateToggle = document.querySelector<HTMLInputElement>("#auto-update");
const updateStatus = document.querySelector<HTMLParagraphElement>("#update-status");
const checkUpdatesButton = document.querySelector<HTMLButtonElement>("#check-updates");

if (languageSelect) {
  for (const locale of SUPPORTED_LOCALES) {
    const option = document.createElement("option");
    option.value = locale;
    // A language names itself in its own script, the way a language picker
    // conventionally reads — not translated into whichever locale is active.
    option.textContent = LOCALE_LABELS[locale];
    languageSelect.append(option);
  }
}

/// The backend is the source of truth for language and the auto-update switch,
/// the same way the operating system is for Launch at login: settings.json can
/// be edited by hand, and a stored copy on this side would drift from it.
function applyGeneralSettings(settings: GeneralSettings): void {
  setLocale(settings.language);
  if (languageSelect) languageSelect.value = getLocale();
  applyTranslations();
  // Hidden rather than disabled in a development build, the same choice made
  // for Launch at login: there is no installed binary for either one to act
  // on, so offering a control that can only fail would be worse than no
  // control at all.
  if (autoUpdateSection) autoUpdateSection.hidden = !settings.auto_update_offered;
  if (autoUpdateToggle) autoUpdateToggle.checked = settings.auto_update;
}

async function loadGeneralSettings(): Promise<void> {
  try {
    const settings = await invoke<GeneralSettings>("general_settings");
    applyGeneralSettings(settings);
  } catch (error) {
    showError(error);
  }
}

languageSelect?.addEventListener("change", async () => {
  const language = languageSelect.value;
  try {
    const settings = await invoke<GeneralSettings>("set_language", { language });
    applyGeneralSettings(settings);
    clearError();
    // Profile cards were built with the previous language's strings baked in
    // as text content, not as `data-i18n` markers — re-rendering is simpler
    // than hand-updating every "Default" badge and button already on screen.
    await loadProfiles();
  } catch (error) {
    showError(error);
  }
});

autoUpdateToggle?.addEventListener("change", async () => {
  const wanted = autoUpdateToggle.checked;
  try {
    const settings = await invoke<GeneralSettings>("set_auto_update", { enabled: wanted });
    applyGeneralSettings(settings);
    clearError();
  } catch (error) {
    showError(error);
    await loadGeneralSettings();
  }
});

type UpdateOutcome =
  | { status: "not_offered" }
  | { status: "up_to_date" }
  | { status: "installed"; version: string };

function renderUpdateOutcome(outcome: UpdateOutcome): void {
  if (!updateStatus) return;
  if (outcome.status === "up_to_date") {
    updateStatus.textContent = t("general.update.status.upToDate");
  } else if (outcome.status === "installed") {
    updateStatus.textContent = t("general.update.status.installing", { version: outcome.version });
  } else {
    updateStatus.textContent = "";
  }
}

checkUpdatesButton?.addEventListener("click", () => {
  void (async () => {
    if (updateStatus) updateStatus.textContent = t("general.update.status.checking");
    try {
      const outcome = await invoke<UpdateOutcome>("check_for_updates_now");
      renderUpdateOutcome(outcome);
    } catch (error) {
      if (updateStatus) {
        updateStatus.textContent = t("general.update.status.error", { error: errorMessage(error) });
      }
    }
  })();
});

profileForm.addEventListener("submit", addProfile);

// Closing the window only hides it, so the page keeps whatever it was last
// showing. An error like "quit this profile's Claude Desktop before deleting it"
// is a verdict about one moment — by the time the window is reopened the user has
// very likely done exactly that. Start every visit from freshly loaded state.
void listen("window-shown", () => {
  clearError();
  clearAddError();
  void loadProfiles();
  void loadAutostart();
  void loadGeneralSettings();
});

async function init(): Promise<void> {
  // General settings first, so the interface is already in the right
  // language by the time profile cards render their first "Default" badge.
  await loadGeneralSettings();
  await loadProfiles();
  await loadAutostart();
}

void init();
