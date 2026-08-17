// A small, dependency-free translator for the interface chrome: headings,
// labels, buttons, and the handful of messages this file itself generates.
//
// What is deliberately NOT translated: profile labels and paths (they are the
// user's own data), and error messages the Rust backend returns (e.g. "quit
// this profile's Claude Desktop before deleting it"). Backend errors are
// generated server-side from data the frontend does not have a copy of, and
// giving them the same translation treatment would mean teaching Rust six
// languages too — a larger project than the interface chrome this covers.

export type Locale = "en" | "id" | "ja" | "de" | "es" | "pt";

export const SUPPORTED_LOCALES: Locale[] = ["en", "id", "ja", "de", "es", "pt"];

// Each language names itself, the way a language picker conventionally does —
// a person looking for their own language reads it in that language, not in
// whichever one happened to be selected before.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ja: "日本語",
  de: "Deutsch",
  es: "Español",
  pt: "Português",
};

type Dict = Record<string, string>;

const en: Dict = {
  "header.eyebrow": "Profile cabinet",
  "header.lede": "Keep each coding agent workspace separate and ready to open.",
  "tabs.profiles": "Profiles",
  "tabs.general": "General",
  "profiles.eyebrow": "Your workspaces",
  "profiles.heading": "Profiles",
  "add.eyebrow": "Make room for another sign-in",
  "add.heading": "Add a profile",
  "add.helper": "Choose a label you will recognize. Account details stay inside the app itself.",
  "add.appLabel": "App",
  "add.labelLabel": "Profile label",
  "add.labelPlaceholder": "e.g. Work",
  "add.submit": "Add profile",
  "add.errorNoLabel": "Enter a label for this profile.",
  "add.errorNoApp": "No supported app was found to add a profile to.",
  "profile.default": "Default",
  "profile.sameAccount": "same account",
  "profile.rename": "Rename",
  "profile.delete": "Delete",
  "profile.renameAriaLabel": "New label for {label}",
  "profile.save": "Save",
  "profile.cancel": "Cancel",
  "profile.deleteConfirm": 'Delete "{label}" and all {size} in {path}? This cannot be undone.',
  "profile.deleteConfirmButton": "Delete permanently",
  "profile.keepIt": "Keep it",
  "general.startup.eyebrow": "Startup",
  "general.startup.heading": "Launch at login",
  "general.startup.helper":
    "Start Agent Profiles automatically when you sign in. This only starts the tray; no profile is opened for you.",
  "general.startup.toggle": "Start Agent Profiles at login",
  "general.language.eyebrow": "Preferences",
  "general.language.heading": "Language",
  "general.language.helper": "Choose the language Agent Profiles' interface is shown in.",
  "general.language.label": "Interface language",
  "general.update.eyebrow": "Updates",
  "general.update.heading": "Automatic updates",
  "general.update.helper":
    "Checks husniadil/agent-profiles on GitHub for a new release, then downloads and installs it without asking — no dialogs, no prompts. Off until you turn it on.",
  "general.update.toggle": "Automatically download and install updates",
  "general.update.checkNow": "Check for updates now",
  "general.update.status.checking": "Checking for updates…",
  "general.update.status.upToDate": "You're on the latest version.",
  "general.update.status.installing": "Installing version {version}… Agent Profiles will restart.",
  "general.update.status.error": "Could not check for updates: {error}",
  "general.update.unavailable":
    "Automatic updates are only available in an installed build, not this development build.",
};

const id: Dict = {
  "header.eyebrow": "Lemari profil",
  "header.lede": "Jaga setiap ruang kerja agen coding tetap terpisah dan siap dibuka.",
  "tabs.profiles": "Profil",
  "tabs.general": "Umum",
  "profiles.eyebrow": "Ruang kerja Anda",
  "profiles.heading": "Profil",
  "add.eyebrow": "Siapkan tempat untuk akun lain",
  "add.heading": "Tambah profil",
  "add.helper": "Pilih label yang mudah Anda kenali. Detail akun tetap berada di dalam aplikasi itu sendiri.",
  "add.appLabel": "Aplikasi",
  "add.labelLabel": "Label profil",
  "add.labelPlaceholder": "mis. Kerja",
  "add.submit": "Tambah profil",
  "add.errorNoLabel": "Masukkan label untuk profil ini.",
  "add.errorNoApp": "Tidak ditemukan aplikasi yang didukung untuk ditambahkan profilnya.",
  "profile.default": "Default",
  "profile.sameAccount": "akun yang sama",
  "profile.rename": "Ganti nama",
  "profile.delete": "Hapus",
  "profile.renameAriaLabel": "Label baru untuk {label}",
  "profile.save": "Simpan",
  "profile.cancel": "Batal",
  "profile.deleteConfirm": 'Hapus "{label}" beserta seluruh {size} di {path}? Tindakan ini tidak dapat dibatalkan.',
  "profile.deleteConfirmButton": "Hapus permanen",
  "profile.keepIt": "Batalkan",
  "general.startup.eyebrow": "Saat aktif",
  "general.startup.heading": "Jalankan saat masuk",
  "general.startup.helper":
    "Jalankan Agent Profiles secara otomatis saat Anda masuk (login). Ini hanya menjalankan ikon baki sistem; tidak ada profil yang dibuka secara otomatis.",
  "general.startup.toggle": "Jalankan Agent Profiles saat masuk",
  "general.language.eyebrow": "Preferensi",
  "general.language.heading": "Bahasa",
  "general.language.helper": "Pilih bahasa tampilan antarmuka Agent Profiles.",
  "general.language.label": "Bahasa antarmuka",
  "general.update.eyebrow": "Pembaruan",
  "general.update.heading": "Pembaruan otomatis",
  "general.update.helper":
    "Memeriksa rilis baru di husniadil/agent-profiles pada GitHub, lalu mengunduh dan memasangnya tanpa bertanya — tanpa dialog, tanpa konfirmasi. Nonaktif sampai Anda mengaktifkannya.",
  "general.update.toggle": "Unduh dan pasang pembaruan secara otomatis",
  "general.update.checkNow": "Periksa pembaruan sekarang",
  "general.update.status.checking": "Memeriksa pembaruan…",
  "general.update.status.upToDate": "Anda sudah menggunakan versi terbaru.",
  "general.update.status.installing": "Memasang versi {version}… Agent Profiles akan dimulai ulang.",
  "general.update.status.error": "Tidak dapat memeriksa pembaruan: {error}",
  "general.update.unavailable":
    "Pembaruan otomatis hanya tersedia pada build terpasang, bukan pada build pengembangan ini.",
};

const ja: Dict = {
  "header.eyebrow": "プロファイル収納",
  "header.lede": "各コーディングエージェントのワークスペースを分けて、すぐ開ける状態に保ちます。",
  "tabs.profiles": "プロファイル",
  "tabs.general": "一般",
  "profiles.eyebrow": "あなたのワークスペース",
  "profiles.heading": "プロファイル",
  "add.eyebrow": "別のサインイン用の場所を用意",
  "add.heading": "プロファイルを追加",
  "add.helper": "見分けやすいラベルを選んでください。アカウント情報はアプリ内にとどまります。",
  "add.appLabel": "アプリ",
  "add.labelLabel": "プロファイルのラベル",
  "add.labelPlaceholder": "例: 仕事用",
  "add.submit": "プロファイルを追加",
  "add.errorNoLabel": "このプロファイルのラベルを入力してください。",
  "add.errorNoApp": "プロファイルを追加できる対応アプリが見つかりませんでした。",
  "profile.default": "デフォルト",
  "profile.sameAccount": "同じアカウント",
  "profile.rename": "名前を変更",
  "profile.delete": "削除",
  "profile.renameAriaLabel": "{label} の新しいラベル",
  "profile.save": "保存",
  "profile.cancel": "キャンセル",
  "profile.deleteConfirm": "「{label}」と{path}内のすべてのデータ（{size}）を削除しますか? この操作は取り消せません。",
  "profile.deleteConfirmButton": "完全に削除",
  "profile.keepIt": "残す",
  "general.startup.eyebrow": "起動",
  "general.startup.heading": "ログイン時に起動",
  "general.startup.helper":
    "サインイン時にAgent Profilesを自動的に起動します。起動するのはトレイのみで、プロファイルが自動的に開かれることはありません。",
  "general.startup.toggle": "ログイン時にAgent Profilesを起動する",
  "general.language.eyebrow": "環境設定",
  "general.language.heading": "言語",
  "general.language.helper": "Agent Profilesの画面表示に使用する言語を選択します。",
  "general.language.label": "表示言語",
  "general.update.eyebrow": "アップデート",
  "general.update.heading": "自動アップデート",
  "general.update.helper":
    "GitHub上のhusniadil/agent-profilesで新しいリリースを確認し、確認なしでダウンロードとインストールを行います — ダイアログや確認は表示されません。オンにするまでは無効です。",
  "general.update.toggle": "アップデートを自動でダウンロード・インストールする",
  "general.update.checkNow": "今すぐアップデートを確認",
  "general.update.status.checking": "アップデートを確認しています…",
  "general.update.status.upToDate": "最新バージョンです。",
  "general.update.status.installing": "バージョン {version} をインストールしています… Agent Profilesが再起動します。",
  "general.update.status.error": "アップデートを確認できませんでした: {error}",
  "general.update.unavailable":
    "自動アップデートはインストール済みのビルドでのみ利用でき、この開発ビルドでは利用できません。",
};

const de: Dict = {
  "header.eyebrow": "Profilschrank",
  "header.lede": "Halten Sie jeden Coding-Agent-Arbeitsbereich getrennt und startbereit.",
  "tabs.profiles": "Profile",
  "tabs.general": "Allgemein",
  "profiles.eyebrow": "Ihre Arbeitsbereiche",
  "profiles.heading": "Profile",
  "add.eyebrow": "Platz für eine weitere Anmeldung schaffen",
  "add.heading": "Profil hinzufügen",
  "add.helper":
    "Wählen Sie eine Bezeichnung, die Sie wiedererkennen. Kontodetails bleiben in der jeweiligen App selbst.",
  "add.appLabel": "App",
  "add.labelLabel": "Profilbezeichnung",
  "add.labelPlaceholder": "z. B. Arbeit",
  "add.submit": "Profil hinzufügen",
  "add.errorNoLabel": "Geben Sie eine Bezeichnung für dieses Profil ein.",
  "add.errorNoApp": "Keine unterstützte App gefunden, der ein Profil hinzugefügt werden kann.",
  "profile.default": "Standard",
  "profile.sameAccount": "gleiches Konto",
  "profile.rename": "Umbenennen",
  "profile.delete": "Löschen",
  "profile.renameAriaLabel": "Neue Bezeichnung für {label}",
  "profile.save": "Speichern",
  "profile.cancel": "Abbrechen",
  "profile.deleteConfirm": '„{label}" und alle {size} unter {path} löschen? Dies kann nicht rückgängig gemacht werden.',
  "profile.deleteConfirmButton": "Endgültig löschen",
  "profile.keepIt": "Behalten",
  "general.startup.eyebrow": "Start",
  "general.startup.heading": "Beim Anmelden starten",
  "general.startup.helper":
    "Startet Agent Profiles automatisch, wenn Sie sich anmelden. Dabei wird nur das Symbol in der Menüleiste gestartet; es wird kein Profil für Sie geöffnet.",
  "general.startup.toggle": "Agent Profiles beim Anmelden starten",
  "general.language.eyebrow": "Einstellungen",
  "general.language.heading": "Sprache",
  "general.language.helper": "Wählen Sie die Sprache der Agent Profiles-Oberfläche.",
  "general.language.label": "Sprache der Oberfläche",
  "general.update.eyebrow": "Updates",
  "general.update.heading": "Automatische Updates",
  "general.update.helper":
    "Prüft husniadil/agent-profiles auf GitHub auf eine neue Version und lädt sie dann ohne Rückfrage herunter und installiert sie — kein Dialog, keine Aufforderung. Standardmäßig ausgeschaltet, bis Sie es aktivieren.",
  "general.update.toggle": "Updates automatisch herunterladen und installieren",
  "general.update.checkNow": "Jetzt nach Updates suchen",
  "general.update.status.checking": "Suche nach Updates…",
  "general.update.status.upToDate": "Sie verwenden die neueste Version.",
  "general.update.status.installing": "Version {version} wird installiert… Agent Profiles wird neu gestartet.",
  "general.update.status.error": "Updates konnten nicht geprüft werden: {error}",
  "general.update.unavailable":
    "Automatische Updates sind nur in einer installierten Version verfügbar, nicht in diesem Entwicklungs-Build.",
};

const es: Dict = {
  "header.eyebrow": "Archivador de perfiles",
  "header.lede": "Mantén cada espacio de trabajo de tu agente de código separado y listo para abrir.",
  "tabs.profiles": "Perfiles",
  "tabs.general": "General",
  "profiles.eyebrow": "Tus espacios de trabajo",
  "profiles.heading": "Perfiles",
  "add.eyebrow": "Haz sitio para otro inicio de sesión",
  "add.heading": "Añadir un perfil",
  "add.helper": "Elige una etiqueta que reconozcas fácilmente. Los datos de la cuenta permanecen dentro de la propia app.",
  "add.appLabel": "App",
  "add.labelLabel": "Etiqueta del perfil",
  "add.labelPlaceholder": "p. ej. Trabajo",
  "add.submit": "Añadir perfil",
  "add.errorNoLabel": "Introduce una etiqueta para este perfil.",
  "add.errorNoApp": "No se encontró ninguna app compatible a la que añadir un perfil.",
  "profile.default": "Predeterminado",
  "profile.sameAccount": "misma cuenta",
  "profile.rename": "Renombrar",
  "profile.delete": "Eliminar",
  "profile.renameAriaLabel": "Nueva etiqueta para {label}",
  "profile.save": "Guardar",
  "profile.cancel": "Cancelar",
  "profile.deleteConfirm": '¿Eliminar «{label}» y los {size} que ocupa en {path}? Esta acción no se puede deshacer.',
  "profile.deleteConfirmButton": "Eliminar definitivamente",
  "profile.keepIt": "Conservar",
  "general.startup.eyebrow": "Inicio",
  "general.startup.heading": "Iniciar al iniciar sesión",
  "general.startup.helper":
    "Inicia Agent Profiles automáticamente al iniciar sesión. Esto solo inicia el icono de la bandeja del sistema; no se abre ningún perfil por ti.",
  "general.startup.toggle": "Iniciar Agent Profiles al iniciar sesión",
  "general.language.eyebrow": "Preferencias",
  "general.language.heading": "Idioma",
  "general.language.helper": "Elige el idioma en el que se muestra la interfaz de Agent Profiles.",
  "general.language.label": "Idioma de la interfaz",
  "general.update.eyebrow": "Actualizaciones",
  "general.update.heading": "Actualizaciones automáticas",
  "general.update.helper":
    "Comprueba si hay una nueva versión de husniadil/agent-profiles en GitHub y, si la hay, la descarga e instala sin preguntar — sin cuadros de diálogo ni confirmaciones. Desactivado hasta que lo actives.",
  "general.update.toggle": "Descargar e instalar actualizaciones automáticamente",
  "general.update.checkNow": "Buscar actualizaciones ahora",
  "general.update.status.checking": "Buscando actualizaciones…",
  "general.update.status.upToDate": "Tienes la última versión.",
  "general.update.status.installing": "Instalando la versión {version}… Agent Profiles se reiniciará.",
  "general.update.status.error": "No se pudo comprobar si hay actualizaciones: {error}",
  "general.update.unavailable":
    "Las actualizaciones automáticas solo están disponibles en una versión instalada, no en esta versión de desarrollo.",
};

const pt: Dict = {
  "header.eyebrow": "Arquivo de perfis",
  "header.lede": "Mantenha cada espaço de trabalho de agente de código separado e pronto para abrir.",
  "tabs.profiles": "Perfis",
  "tabs.general": "Geral",
  "profiles.eyebrow": "Seus espaços de trabalho",
  "profiles.heading": "Perfis",
  "add.eyebrow": "Abra espaço para outro login",
  "add.heading": "Adicionar um perfil",
  "add.helper": "Escolha um rótulo que você reconheça facilmente. Os dados da conta permanecem dentro do próprio aplicativo.",
  "add.appLabel": "App",
  "add.labelLabel": "Rótulo do perfil",
  "add.labelPlaceholder": "ex.: Trabalho",
  "add.submit": "Adicionar perfil",
  "add.errorNoLabel": "Digite um rótulo para este perfil.",
  "add.errorNoApp": "Nenhum aplicativo compatível foi encontrado para adicionar um perfil.",
  "profile.default": "Padrão",
  "profile.sameAccount": "mesma conta",
  "profile.rename": "Renomear",
  "profile.delete": "Excluir",
  "profile.renameAriaLabel": "Novo rótulo para {label}",
  "profile.save": "Salvar",
  "profile.cancel": "Cancelar",
  "profile.deleteConfirm": 'Excluir "{label}" e todos os {size} em {path}? Isso não pode ser desfeito.',
  "profile.deleteConfirmButton": "Excluir permanentemente",
  "profile.keepIt": "Manter",
  "general.startup.eyebrow": "Inicialização",
  "general.startup.heading": "Iniciar ao entrar",
  "general.startup.helper":
    "Inicia o Agent Profiles automaticamente quando você entra na sua conta. Isso apenas inicia o ícone na bandeja; nenhum perfil é aberto automaticamente.",
  "general.startup.toggle": "Iniciar o Agent Profiles ao entrar",
  "general.language.eyebrow": "Preferências",
  "general.language.heading": "Idioma",
  "general.language.helper": "Escolha o idioma em que a interface do Agent Profiles é exibida.",
  "general.language.label": "Idioma da interface",
  "general.update.eyebrow": "Atualizações",
  "general.update.heading": "Atualizações automáticas",
  "general.update.helper":
    "Verifica se há uma nova versão de husniadil/agent-profiles no GitHub e, se houver, baixa e instala sem perguntar — sem caixas de diálogo, sem confirmações. Desativado até que você o ative.",
  "general.update.toggle": "Baixar e instalar atualizações automaticamente",
  "general.update.checkNow": "Verificar atualizações agora",
  "general.update.status.checking": "Verificando atualizações…",
  "general.update.status.upToDate": "Você está na versão mais recente.",
  "general.update.status.installing": "Instalando a versão {version}… O Agent Profiles será reiniciado.",
  "general.update.status.error": "Não foi possível verificar atualizações: {error}",
  "general.update.unavailable":
    "As atualizações automáticas estão disponíveis apenas em uma versão instalada, não nesta versão de desenvolvimento.",
};

const DICTIONARIES: Record<Locale, Dict> = { en, id, ja, de, es, pt };

const DEFAULT_LOCALE: Locale = "en";

function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as string[]).includes(value);
}

let current: Locale = DEFAULT_LOCALE;

export function getLocale(): Locale {
  return current;
}

/// Falls back to English rather than throwing, so a locale this build has
/// never heard of — an old preference file, a language dropped later — never
/// leaves the window blank where a translation should be.
export function setLocale(locale: string): void {
  current = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

/// Looks the key up in the active language, then English, then finally
/// returns the key itself — a visibly wrong string on screen is a bug report;
/// a blank one is just confusing.
export function t(key: string, vars?: Record<string, string | number>): string {
  const template = DICTIONARIES[current][key] ?? en[key] ?? key;
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.split(`{${name}}`).join(String(value)),
    template,
  );
}

/// Applies the active language to every element carrying one of the
/// `data-i18n*` markers, anywhere under `root`. Safe to call again after the
/// language changes, or after new elements (a profile card, an inline panel)
/// are inserted — nothing here assumes it runs exactly once.
export function applyTranslations(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-aria-label]").forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (key) el.setAttribute("aria-label", t(key));
  });
  if (root === document) {
    document.documentElement.lang = current;
  }
}
