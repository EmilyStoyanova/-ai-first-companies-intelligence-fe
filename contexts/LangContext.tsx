"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "bg" | "en";

const translations = {
  bg: {
    // App
    appName: "Companies Intelligence",

    appTagline: "Data Enrich",

    // Auth
    login: "Вход",
    register: "Регистрация",
    email: "Имейл",
    password: "Парола",
    tenantName: "Име на фирмата",
    tenantNamePlaceholder: "напр. Людогорие Софт",
    signIn: "Влезте",
    createAccount: "Създайте акаунт",
    signingIn: "Влизане…",
    creating: "Създаване…",

    // Dashboard
    dashboard: "Табло",
    uploadTitle: "Качете CSV или Excel файл",
    uploadSubtitle: 'Файлът трябва да съдържа колона с домейни (напр. firma.bg, company.com). Имената на фирми не се поддържат.',
    uploadNoDomains: 'Файлът не съдържа валидни домейни. Всеки ред трябва да е домейн (напр. firma.bg), а не име на фирма.',
    chooseFile: "Изберете файл",
    forceRecrawl: "Принудително прекопиране",
    uploadProcess: "Качи & Обработи",
    uploading: "Качване…",
    batches: "Партиди",

    // Table headers
    file: "Файл",
    status: "Статус",
    progress: "Прогрес",
    count: "Брой",
    created: "Създадено",
    actions: "Действия",

    // Statuses
    processing: "Обработка",
    done: "Готово",
    failed: "Грешка",
    pending: "Изчакване",
    crawling: "Сканиране",

    // Actions
    view: "Преглед",
    delete: "Изтрий",
    download: "Изтегли",

    // Modal
    domain: "Домейн",
    name: "Име",
    score: "Резултат",
    emails: "Имейли",
    team: "Екип",
    personalized: "Персонализация",
    noCompanies: "Няма компании в тази партида.",
    showing: "Показване",
    of: "от",
    prev: "← Назад",
    next: "Напред →",

    // Empty / messages
    noBatches: "Все още няма партиди. Качете файл по-горе, за да започнете.",
    loading: "Зареждане…",
    confirmDelete: "Изтрийте",
    confirmDeleteMsg:
      "Това премахва партидата и нейните асоциации. Действието не може да бъде отменено.",
    batchDeleted: "Партидата е изтрита.",
    downloadFailed: "Изтеглянето неуспешно: ",
    deleteFailed: "Изтриването неуспешно: ",

    // Notifications
    verifiedBanner: "Вашият имейл е потвърден успешно.",
    registeredBanner: "Добре дошли! Изпратен е имейл за потвърждение на",
    checkInbox: ". Моля проверете входящата кутия.",
    invalidLink:
      "Тази връзка за потвърждение е невалидна или вече е използвана.",

    // Dashboard headings
    enrichmentEngine: "Domain Enrichment Engine",
    uploadDomains: "Качи домейни",
    selectFileOrDrag: "Изберете файл или го плъзнете тук",
    batchHistory: "История на партидите",
    batchId: "Партида",
    date: "Дата",
    totalDomains: "Общо домейни",
    loadingBatches: "Зареждане на партиди…",
    success: "Успех",
    logout: "Изход",
    firmographics: "Фирмография",
    techStack: "Технологии",
    contacts: "Контакти",

    // Persona search
    personaSearch: "Търсене по персона",
    personaSearchSubtitle: "Открийте организации по категория и местоположение",
    personaLabel: "Категория / персона",
    personaPlaceholder: "напр. детски градини, зъболекари, автосервизи",
    locationLabel: "Област / Град",
    locationPlaceholder: "напр. област Ловеч, гр. Варна",
    keywordsLabel: "Допълнителни ключови думи (незадължително)",
    keywordsPlaceholder: "напр. частни, общински",
    maxResultsLabel: "Максимален брой резултати",
    searchStart: "Търси & Обработи",
    searching: "Търсене…",
    searchSuccess: "Търсенето е стартирано! Резултатите ще се появят в таблицата.",
    uploadTab: "Качи CSV",
    personaTab: "Търсене по персона",
    sourcePersona: "Персона",
    sourceUpload: "CSV файл",

    // Candidates tab
    resultsTab: "Резултати",
    candidatesTab: "Всички кандидати",
    candidateKept: "Включен",
    candidateFiltered: "Филтриран от AI",
    candidateBlocked: "Блокиран",
    candidateExcluded: "Изключен",
    excludeBtn: "Изключи",
    includeBtn: "Добави",
    candidateTitle: "Заглавие",
    noCandidates: "Няма данни за кандидати. Само резултати от търсене по персона показват кандидати.",

    // Re-enrich
    reEnrich: "Обогати",
    reEnriching: "Обогатяване…",
    reEnrichDone: (n: number) => `Обновени ${n} компании`,

    // Language toggle
    langToggle: "EN",

    // Settings / tenant profile
    settings: "Настройки",
    settingsTitle: "Профил за имейл кампании",
    settingsSubtitle: "Тези данни се използват като подател на персонализираните B2B писма.",
    settingsSave: "Запази",
    settingsSaving: "Запазване…",
    settingsSaved: "Настройките са запазени.",
    settingsFailed: "Грешка при запазване.",
    companyWebsite: "Уебсайт на фирмата",
    companyWebsitePlaceholder: "напр. https://ludogoriesoft.com",
    contactPersonName: "Име и фамилия",
    contactPersonNamePlaceholder: "напр. Севделин Димитров",
    contactPersonTitle: "Позиция",
    contactPersonTitlePlaceholder: "напр. Търговски директор",
    contactPersonPhone: "Телефон",
    contactPersonPhonePlaceholder: "напр. +359 887 810 738",
    senderSection: "Данни за подател",
    accountSection: "Акаунт",

    // Review panel
    reviewProfile: "Профил",
    reviewContact: "Контакти",
    reviewTeam: "Екип",
    reviewServices: "Услуги",
    reviewHistory: "История",
    reviewAiEmail: "AI Имейл",
    reviewFounded: "Основана",
    reviewIndustry: "Индустрия",
    reviewDescription: "Описание",
    reviewLocation: "Локация",
    reviewPhones: "Телефони",
    reviewSocialLinks: "Социални мрежи",
    reviewEmailSubject: "Тема",
    reviewOpeningLine: "Начало",
    reviewValueProp: "Стойност",
    reviewFullMessage: "Пълен имейл",
    reviewCopy: "Копирай",
    reviewCopied: "Копирано!",
    reviewNoData: "Няма данни",
    reviewPosition: "Позиция",
  },
  en: {
    // App
    appName: "Companies Intelligence",

    appTagline: "Data Enrich",

    // Auth
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    tenantName: "Company Name",
    tenantNamePlaceholder: "e.g. Acme Corp",
    signIn: "Sign In",
    createAccount: "Create Account",
    signingIn: "Signing in…",
    creating: "Creating…",

    // Dashboard
    dashboard: "Dashboard",
    uploadTitle: "Upload a CSV or Excel file",
    uploadSubtitle: 'File must contain a column with domains (e.g. firma.bg, company.com). Company names are not supported.',
    uploadNoDomains: 'No valid domains found in the file. Each row must be a domain (e.g. firma.bg), not a company name.',
    chooseFile: "Choose File",
    forceRecrawl: "Force re-crawl",
    uploadProcess: "Upload & Process",
    uploading: "Uploading…",
    batches: "Batches",

    // Table headers
    file: "File",
    status: "Status",
    progress: "Progress",
    count: "Count",
    created: "Created",
    actions: "Actions",

    // Statuses
    processing: "Processing",
    done: "Done",
    failed: "Failed",
    pending: "Pending",
    crawling: "Crawling",

    // Actions
    view: "View",
    delete: "Delete",
    download: "Download",

    // Modal
    domain: "Domain",
    name: "Name",
    score: "Score",
    emails: "Emails",
    team: "Team",
    personalized: "Personalized",
    noCompanies: "No companies in this batch yet.",
    showing: "Showing",
    of: "of",
    prev: "← Prev",
    next: "Next →",

    // Empty / messages
    noBatches: "No batches yet. Upload a file above to get started.",
    loading: "Loading…",
    confirmDelete: "Delete",
    confirmDeleteMsg:
      "This removes the batch and its company associations. This action cannot be undone.",
    batchDeleted: "Batch deleted.",
    downloadFailed: "Download failed: ",
    deleteFailed: "Delete failed: ",

    // Notifications
    verifiedBanner: "Your email has been verified successfully.",
    registeredBanner: "Welcome! A confirmation email has been sent to",
    checkInbox: ". Please check your inbox.",
    invalidLink: "That confirmation link is invalid or has already been used.",

    // Dashboard headings
    enrichmentEngine: "Domain Enrichment Engine",
    uploadDomains: "Upload Domains",
    selectFileOrDrag: "Select file or drag it here",
    batchHistory: "Batch History",
    batchId: "Batch ID",
    date: "Date",
    totalDomains: "Total Domains",
    loadingBatches: "Loading batches…",
    success: "Success",
    logout: "Logout",
    firmographics: "Firmographics",
    techStack: "Tech Stack",
    contacts: "Contacts",

    // Persona search
    personaSearch: "Persona Search",
    personaSearchSubtitle: "Discover organizations by category and location",
    personaLabel: "Category / Persona",
    personaPlaceholder: "e.g. kindergartens, dentists, auto repair shops",
    locationLabel: "Oblast / City",
    locationPlaceholder: "e.g. Lovech oblast, Varna city",
    keywordsLabel: "Additional keywords (optional)",
    keywordsPlaceholder: "e.g. private, municipal",
    maxResultsLabel: "Max results",
    searchStart: "Search & Process",
    searching: "Searching…",
    searchSuccess: "Search started! Results will appear in the table below.",
    uploadTab: "Upload CSV",
    personaTab: "Persona Search",
    sourcePersona: "Persona",
    sourceUpload: "CSV file",

    // Candidates tab
    resultsTab: "Results",
    candidatesTab: "All Candidates",
    candidateKept: "Included",
    candidateFiltered: "Filtered by AI",
    candidateBlocked: "Blocked",
    candidateExcluded: "Excluded",
    excludeBtn: "Exclude",
    includeBtn: "Add",
    candidateTitle: "Title",
    noCandidates: "No candidate data. Only persona search batches show candidates.",

    // Re-enrich
    reEnrich: "Re-enrich",
    reEnriching: "Enriching…",
    reEnrichDone: (n: number) => `Updated ${n} companies`,

    // Language toggle
    langToggle: "БГ",

    // Settings / tenant profile
    settings: "Settings",
    settingsTitle: "Campaign Email Profile",
    settingsSubtitle: "These details are used as the sender of personalized B2B outreach emails.",
    settingsSave: "Save",
    settingsSaving: "Saving…",
    settingsSaved: "Settings saved.",
    settingsFailed: "Failed to save settings.",
    companyWebsite: "Website",
    companyWebsitePlaceholder: "e.g. https://ludogoriesoft.com",
    contactPersonName: "Full Name",
    contactPersonNamePlaceholder: "e.g. John Smith",
    contactPersonTitle: "Position",
    contactPersonTitlePlaceholder: "e.g. Sales Director",
    contactPersonPhone: "Phone",
    contactPersonPhonePlaceholder: "e.g. +359 887 810 738",
    senderSection: "Sender Details",
    accountSection: "Account",

    // Review panel
    reviewProfile: "Profile",
    reviewContact: "Contact",
    reviewTeam: "Team",
    reviewServices: "Services",
    reviewHistory: "History",
    reviewAiEmail: "AI Email",
    reviewFounded: "Founded",
    reviewIndustry: "Industry",
    reviewDescription: "Description",
    reviewLocation: "Location",
    reviewPhones: "Phones",
    reviewSocialLinks: "Social Links",
    reviewEmailSubject: "Subject",
    reviewOpeningLine: "Opening",
    reviewValueProp: "Value",
    reviewFullMessage: "Full Email",
    reviewCopy: "Copy",
    reviewCopied: "Copied!",
    reviewNoData: "No data",
    reviewPosition: "Position",
  },
} as const;

export type Translations = (typeof translations)[Lang];

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("bg");
  const toggleLang = () => setLang((l) => (l === "bg" ? "en" : "bg"));

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
