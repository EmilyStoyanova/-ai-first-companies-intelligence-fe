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
    logout: "Изход",
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
    logout: "Logout",
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
