import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DiagnosticPayload,
  CallBookingPayload,
  ComputedDiagnosticResult,
} from "../backend/diagnosticBackend";

export type AppViewRoute = "home" | "diagnostic" | "admin";

export type DiagnosticAnswers = DiagnosticPayload;
export type CallBookingDetails = CallBookingPayload;

interface DiagnosticBookingContextValue {
  activeRoute: AppViewRoute;
  openDiagnosticPage: (initialStep?: number) => void;
  openAdminBackend: () => void;
  returnHome: (sectionAnchor?: string) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  answers: DiagnosticAnswers;
  updateAnswers: (patch: Partial<DiagnosticAnswers>) => void;
  booking: CallBookingDetails;
  updateBooking: (patch: Partial<CallBookingDetails>) => void;
  backendResult: ComputedDiagnosticResult | null;
  setBackendResult: React.Dispatch<React.SetStateAction<ComputedDiagnosticResult | null>>;
  isBooked: boolean;
  setIsBooked: React.Dispatch<React.SetStateAction<boolean>>;
  resetFlow: () => void;
}

export function getUpcomingBusinessDays(
  count = 6
): { iso: string; dayShort: string; dayNum: string; monthShort: string; fullLabel: string }[] {
  const days: {
    iso: string;
    dayShort: string;
    dayNum: string;
    monthShort: string;
    fullLabel: string;
  }[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const monthNames = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];

  while (days.length < count) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      const iso = cursor.toISOString().split("T")[0];
      const dayShort = dayNames[dow];
      const dayNum = String(cursor.getDate()).padStart(2, "0");
      const monthShort = monthNames[cursor.getMonth()];
      days.push({
        iso,
        dayShort,
        dayNum,
        monthShort,
        fullLabel: `${dayShort} ${dayNum} ${monthShort}`,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

const DEFAULT_ANSWERS: DiagnosticAnswers = {
  profileType: "",
  ageRange: "",
  exactAge: "",
  hasNoWebsite: false,
  websiteUrl: "",
  primaryPlatform: "Instagram",
  mainObjective: "",
  organicMaturity: "",
  audienceSize: "10k – 50k",
  adsMaturity: "",
};

const upcomingDays = getUpcomingBusinessDays(6);

const DEFAULT_BOOKING: CallBookingDetails = {
  selectedDateIso: upcomingDays[0]?.iso ?? "",
  selectedDateLabel: upcomingDays[0]?.fullLabel ?? "",
  selectedTime: "11:00",
  fullName: "",
  email: "",
  countryCode: "+33",
  phone: "",
  notes: "",
};

function parseRouteFromHash(): AppViewRoute {
  const hash = window.location.hash;
  if (hash.startsWith("#/diagnostic")) return "diagnostic";
  if (hash.startsWith("#/admin")) return "admin";
  return "home";
}

const DiagnosticBookingContext = createContext<DiagnosticBookingContextValue | undefined>(
  undefined
);

export const DiagnosticBookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeRoute, setActiveRoute] = useState<AppViewRoute>(() => parseRouteFromHash());
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<DiagnosticAnswers>(DEFAULT_ANSWERS);
  const [booking, setBooking] = useState<CallBookingDetails>(DEFAULT_BOOKING);
  const [backendResult, setBackendResult] = useState<ComputedDiagnosticResult | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseRouteFromHash();
      setActiveRoute(next);
      if (next !== "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const openDiagnosticPage = (initialStep?: number) => {
    if (typeof initialStep === "number") {
      setCurrentStep(initialStep);
    }
    window.location.hash = "#/diagnostic";
    setActiveRoute("diagnostic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAdminBackend = () => {
    window.location.hash = "#/admin";
    setActiveRoute("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const returnHome = (sectionAnchor?: string) => {
    if (sectionAnchor) {
      window.location.hash = sectionAnchor;
      setActiveRoute("home");
      requestAnimationFrame(() => {
        const el = document.querySelector(sectionAnchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
      setActiveRoute("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateAnswers = (patch: Partial<DiagnosticAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  };

  const updateBooking = (patch: Partial<CallBookingDetails>) => {
    setBooking((prev) => ({ ...prev, ...patch }));
  };

  const resetFlow = () => {
    setAnswers(DEFAULT_ANSWERS);
    setBooking(DEFAULT_BOOKING);
    setBackendResult(null);
    setCurrentStep(1);
    setIsBooked(false);
  };

  return (
    <DiagnosticBookingContext.Provider
      value={{
        activeRoute,
        openDiagnosticPage,
        openAdminBackend,
        returnHome,
        currentStep,
        setCurrentStep,
        answers,
        updateAnswers,
        booking,
        updateBooking,
        backendResult,
        setBackendResult,
        isBooked,
        setIsBooked,
        resetFlow,
      }}
    >
      {children}
    </DiagnosticBookingContext.Provider>
  );
};

export const useDiagnosticBooking = (): DiagnosticBookingContextValue => {
  const ctx = useContext(DiagnosticBookingContext);
  if (!ctx) {
    throw new Error("useDiagnosticBooking must be used within DiagnosticBookingProvider");
  }
  return ctx;
};
