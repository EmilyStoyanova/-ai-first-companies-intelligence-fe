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
    tenantName: "Организация",
    signIn: "Влезте",
    createAccount: "Създайте акаунт",
    signingIn: "Влизане…",
    creating: "Създаване…",

    // Dashboard
    dashboard: "Табло",
    uploadTitle: "Качете CSV или Excel файл",
    uploadSubtitle: 'Файлът трябва да съдържа колона "domain" или "website".',
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

    // Language toggle
    langToggle: "EN",
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
    tenantName: "Organization Name",
    signIn: "Sign In",
    createAccount: "Create Account",
    signingIn: "Signing in…",
    creating: "Creating…",

    // Dashboard
    dashboard: "Dashboard",
    uploadTitle: "Upload a CSV or Excel file",
    uploadSubtitle: 'The file should contain a "domain" or "website" column.',
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

    // Language toggle
    langToggle: "БГ",
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
