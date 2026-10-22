import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  UserCheck,
  Target,
  TrendingUp,
  Megaphone,
  PhoneCall,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  useDiagnosticBooking,
  getUpcomingBusinessDays,
} from "../context/DiagnosticBookingContext";
import {
  submitDiagnosticToBackend,
  confirmCallBookingInBackend,
  getBookedTimesForDate,
} from "../backend/diagnosticBackend";
import { EDITORIAL_EASE } from "./MotionPrimitives";

const PROFILE_OPTIONS = [
  {
    value: "Influenceur / Créateur",
    subtitle: "Audience active sur YouTube, Instagram, TikTok ou Podcast",
  },
  {
    value: "Infopreneur / Formateur",
    subtitle: "Programmes en ligne, accompagnements, cohortes ou masterminds",
  },
  {
    value: "Coach / Consultant B2B",
    subtitle: "Offres haute valeur, conseil stratégique ou mentorat",
  },
  {
    value: "Fondateur Personal Brand",
    subtitle: "Dirigeant développant sa visibilité pour nourrir son entreprise",
  },
];

const AGE_RANGES = ["18 – 24 ans", "25 – 30 ans", "31 – 39 ans", "40 ans et +"];

const PLATFORMS = ["Instagram", "YouTube", "TikTok", "LinkedIn", "Podcast / Multi-canal"];

const OBJECTIVES = [
  {
    value: "Convertir mon audience actuelle en clients",
    tag: "Monétisation & Tunnel",
    desc: "Structurer le passage entre mes vues organiques et mes appels de vente ou offres.",
  },
  {
    value: "Refondre ma stratégie éditoriale & rétention",
    tag: "Contenu & Scripts",
    desc: "Élever la qualité des hooks, le storytelling et l'autorité perçue de chaque vidéo.",
  },
  {
    value: "Structurer ou repositionner mon offre phare",
    tag: "Positionnement",
    desc: "Clarifier mon angle unique sur mon marché pour sortir de la guerre de l'attention.",
  },
  {
    value: "Amplifier mes contenus gagnants en Paid / Ads",
    tag: "Croissance Hybride",
    desc: "Connecter un système organique solide à des campagnes d'acquisition maîtrisées.",
  },
];

const ORGANIC_OPTIONS = [
  {
    value: "Au ressenti, sans architecture éditoriale fixe",
    detail: "Publications irrégulières ou sujets choisis au jour le jour",
  },
  {
    value: "Audience présente, mais conversion faible",
    detail: "Les vues sont là, mais génèrent peu de demandes qualifiées",
  },
  {
    value: "Contenu régulier, besoin d'un cap supérieur",
    detail: "Base saine qui plafonne faute de direction créative et narrative",
  },
  {
    value: "Système organique rodé prêt à scaler",
    detail: "Recherche d'optimisation fine du taux de rétention et de conversion",
  },
];

const AUDIENCE_SIZES = ["< 10k abonnés", "10k – 50k", "50k – 200k", "200k+"];

const ADS_OPTIONS = [
  {
    value: "100 % Organique (0 € investi en Ads)",
    badge: "Organique pur",
  },
  {
    value: "Quelques posts boostés ou tests ponctuels",
    badge: "Phase d'exploration",
  },
  {
    value: "Campagnes Meta / YouTube / TikTok actives",
    badge: "Acquisition active",
  },
  {
    value: "Prêt à transformer mes meilleurs Reels/Vidéos en Ads",
    badge: "Prêt pour l'hybride",
  },
];

const TIME_SLOTS = ["09:30", "11:00", "14:00", "16:00", "18:00"];

export const PositioningDiagnosticFlow: React.FC = () => {
  const {
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
    returnHome,
  } = useDiagnosticBooking();

  const [stepError, setStepError] = useState<string | null>(null);
  const [isProcessingBackend, setIsProcessingBackend] = useState(false);

  const businessDays = useMemo(() => getUpcomingBusinessDays(6), []);

  const reservedSlotsForSelectedDay = useMemo(() => {
    return getBookedTimesForDate(booking.selectedDateIso, backendResult?.dossierId);
  }, [booking.selectedDateIso, backendResult?.dossierId, isBooked]);

  const totalSteps = 6;

  const validateAndNext = async () => {
    setStepError(null);
    if (currentStep === 1) {
      if (!answers.profileType || !answers.ageRange) {
        setStepError("Veuillez sélectionner votre profil et votre tranche d'âge pour continuer.");
        return;
      }
    } else if (currentStep === 2) {
      if (!answers.hasNoWebsite && !answers.websiteUrl.trim()) {
        setStepError(
          "Indiquez l'adresse de votre site/tunnel ou cochez « Je n'ai pas encore de site »."
        );
        return;
      }
    } else if (currentStep === 3) {
      if (!answers.mainObjective) {
        setStepError("Sélectionnez votre objectif prioritaire pour les 90 prochains jours.");
        return;
      }
    } else if (currentStep === 4) {
      if (!answers.organicMaturity) {
        setStepError("Précisez votre situation actuelle sur la partie organique.");
        return;
      }
    } else if (currentStep === 5) {
      if (!answers.adsMaturity) {
        setStepError("Indiquez votre utilisation actuelle de la publicité payante (Ads).");
        return;
      }

      // Submit answers asynchronously to Stryde backend engine
      setIsProcessingBackend(true);
      try {
        const storedDossier = await submitDiagnosticToBackend(answers, backendResult?.dossierId);
        setBackendResult(storedDossier.analysis);
        setCurrentStep(6);
      } finally {
        setIsProcessingBackend(false);
      }
      return;
    }

    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  const handleConfirmCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError(null);
    if (!booking.fullName.trim() || !booking.email.trim() || !booking.phone.trim()) {
      setStepError(
        "Veuillez renseigner votre nom, votre e-mail et le numéro auquel vous appeler."
      );
      return;
    }

    setIsProcessingBackend(true);
    try {
      const dossierId = backendResult?.dossierId || `STR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const updated = await confirmCallBookingInBackend(dossierId, answers, booking);
      setBackendResult(updated.analysis);
      setIsBooked(true);
    } finally {
      setIsProcessingBackend(false);
    }
  };

  const handleDownloadIcs = () => {
    const cleanDate = booking.selectedDateIso.replace(/-/g, "");
    const [hourStr, minStr] = booking.selectedTime.split(":");
    const startHour = String(Number(hourStr)).padStart(2, "0");
    const endMinutesTotal = Number(hourStr) * 60 + Number(minStr) + 30;
    const endHour = String(Math.floor(endMinutesTotal / 60)).padStart(2, "0");
    const endMin = String(endMinutesTotal % 60).padStart(2, "0");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Stryde//Appel Strategique//FR",
      "BEGIN:VEVENT",
      `DTSTART:${cleanDate}T${startHour}${minStr}00`,
      `DTEND:${cleanDate}T${endHour}${endMin}00`,
      `SUMMARY:Appel Stratégique Stryde (${backendResult?.dossierId ?? "Dossier"})`,
      `DESCRIPTION:Appel téléphonique avec ${booking.fullName} (${booking.countryCode} ${booking.phone}). Axe prioritaire: ${backendResult?.pillarFocus ?? ""}`,
      "LOCATION:Appel téléphonique direct",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Appel-Strategique-Stryde.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isBooked && backendResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
        className="rounded-[28px] bg-white border border-[#021B3A]/10 p-6 sm:p-10 shadow-[0_24px_70px_rgba(2,27,58,0.08)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E6E0]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#021B3A] text-[#7FE0EE] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono-data text-xs font-semibold uppercase tracking-[0.14em] text-[#358298]">
                Dossier {backendResult.dossierId} enregistré • Appel confirmé
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#191919] mt-0.5">
                Votre appel stratégique est planifié.
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={resetFlow}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5C5C] hover:text-[#021B3A] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Nouveau diagnostic
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-7">
          <div className="rounded-2xl bg-[#FAF9F6] border border-[#E6E3DC] p-5 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5C5C5C]">
              Détails de l'appel téléphonique
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#021B3A]">
              <Calendar className="w-4 h-4 text-[#4FA3B8]" />
              <span>
                {booking.selectedDateLabel} à {booking.selectedTime} (Heure de Paris)
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#191919]">
              <PhoneCall className="w-4 h-4 text-[#4FA3B8]" />
              <span>
                Appel direct au{" "}
                <strong className="font-mono-data">
                  {booking.countryCode} {booking.phone}
                </strong>
              </span>
            </div>
            <p className="text-xs text-[#5C5C5C] leading-relaxed pt-1">
              Votre dossier de pré-diagnostic (<strong className="text-[#191919]">{backendResult.dossierId}</strong>) a été transmis à notre équipe. Un stratège Stryde vous appellera directement à l'heure choisie.
            </p>
          </div>

          <div className="rounded-2xl bg-[#021B3A] text-white p-5 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7FE0EE]">
              <Sparkles className="w-3.5 h-3.5" />
              Synthèse transmise ({backendResult.recommendedProgram})
            </div>
            <div className="font-editorial text-lg text-white">
              {backendResult.pillarFocus}
            </div>
            <p className="text-xs text-white/75 leading-relaxed">
              {backendResult.keyRecommendation}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="inline-flex items-center gap-2 rounded-full bg-[#021B3A] hover:bg-[#082A54] text-white text-sm font-semibold px-6 py-3 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#7FE0EE]" />
              Ajouter à mon agenda (.ics)
            </button>
            <button
              type="button"
              onClick={() => returnHome()}
              className="inline-flex items-center gap-2 rounded-full bg-[#F3F0EA] hover:bg-[#E7E3DA] text-[#191919] text-sm font-semibold px-6 py-3 transition-colors cursor-pointer"
            >
              Retour à l'accueil Stryde
            </button>
          </div>

          <span className="text-xs text-[#5C5C5C]">
            Durée prévue : 30 minutes • Sans engagement commercial forcé
          </span>
        </div>
      </motion.div>
    );
  }

  const stepMeta = [
    { num: 1, label: "Profil & Âge", icon: UserCheck },
    { num: 2, label: "Site web", icon: Globe },
    { num: 3, label: "Objectif", icon: Target },
    { num: 4, label: "Organique", icon: TrendingUp },
    { num: 5, label: "Ads", icon: Megaphone },
    { num: 6, label: "Appel RDV", icon: PhoneCall },
  ];

  return (
    <div className="rounded-[28px] bg-white border border-[#021B3A]/10 shadow-[0_24px_70px_rgba(2,27,58,0.07)] overflow-hidden p-6 sm:p-10">
      {/* Top Progress Header */}
      <div className="pb-6 border-b border-[#ECEAE4]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#021B3A]">
            <span className="w-2 h-2 rounded-full bg-[#4FA3B8]" />
            {currentStep < 6
              ? `Test de positionnement • Étape ${currentStep}/5`
              : `Rapport ${backendResult?.dossierId ?? ""} • Planification d'appel`}
          </span>
          <span className="text-xs font-mono-data text-[#5C5C5C]">
            {Math.round((currentStep / totalSteps) * 100)}% complété
          </span>
        </div>

        {/* Stepper Pills */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {stepMeta.map((s) => {
            const Icon = s.icon;
            const active = currentStep === s.num;
            const done = currentStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (done && !isProcessingBackend) {
                    setStepError(null);
                    setCurrentStep(s.num);
                  }
                }}
                disabled={!done && !active}
                className={`group flex flex-col items-start p-2 sm:px-3 sm:py-2 rounded-xl border text-left transition-all ${
                  active
                    ? "bg-[#021B3A] border-[#021B3A] text-white"
                    : done
                    ? "bg-[#EBF3F5] border-[#4FA3B8]/40 text-[#021B3A] cursor-pointer hover:border-[#021B3A]/40"
                    : "bg-[#FAF9F6] border-[#E8E6E0] text-[#8C8C8C] cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      active ? "text-[#7FE0EE]" : done ? "text-[#358298]" : "text-[#9A9A9A]"
                    }`}
                  />
                  <span className="hidden md:inline truncate">{s.label}</span>
                  <span className="md:hidden font-mono-data">0{s.num}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Body */}
      <div className="py-6 min-h-[300px]">
        {isProcessingBackend ? (
          <div className="h-[280px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#021B3A] text-[#7FE0EE] flex items-center justify-center shadow-md">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="font-editorial text-2xl text-[#191919]">
                {currentStep === 5
                  ? "Analyse de votre positionnement en cours..."
                  : "Enregistrement de votre créneau d'appel..."}
              </div>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
                Calcul des indices éditoriaux, structuration du dossier et vérification des disponibilités.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#191919]">
                    Quel est votre profil actuel et votre âge ?
                  </h3>
                  <p className="text-sm text-[#5C5C5C] mt-1">
                    Ces éléments permettent d'adapter l'angle éditorial et le positionnement de
                    votre marque personnelle avant notre appel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROFILE_OPTIONS.map((opt) => {
                    const selected = answers.profileType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateAnswers({ profileType: opt.value })}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          selected
                            ? "bg-[#021B3A] border-[#021B3A] text-white shadow-sm"
                            : "bg-[#FAF9F6] hover:bg-[#F3F0EA] border-[#E5E2DC] text-[#191919]"
                        }`}
                      >
                        <div className="font-semibold text-sm">{opt.value}</div>
                        <div
                          className={`text-xs mt-1 leading-relaxed ${
                            selected ? "text-white/75" : "text-[#5C5C5C]"
                          }`}
                        >
                          {opt.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5C5C5C] mb-2.5">
                    Votre tranche d'âge
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {AGE_RANGES.map((range) => {
                      const active = answers.ageRange === range;
                      return (
                        <button
                          key={range}
                          type="button"
                          onClick={() => updateAnswers({ ageRange: range })}
                          className={`py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            active
                              ? "bg-[#021B3A] text-white border-[#021B3A]"
                              : "bg-white hover:bg-[#FAF9F6] text-[#191919] border-[#DFDDD7]"
                          }`}
                        >
                          {range}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-[#5C5C5C]">Âge précis (optionnel) :</span>
                    <input
                      type="number"
                      min={16}
                      max={85}
                      placeholder="Ex : 27"
                      value={answers.exactAge}
                      onChange={(e) => updateAnswers({ exactAge: e.target.value })}
                      className="w-24 rounded-xl border border-[#DFDDD7] bg-[#FAF9F6] px-3 py-1.5 text-sm text-[#191919] focus:outline-none focus:border-[#021B3A]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#191919]">
                    Où renvoyez-vous votre audience aujourd'hui ?
                  </h3>
                  <p className="text-sm text-[#5C5C5C] mt-1">
                    Indiquez votre site internet, page de vente ou tunnel actuel afin que nous
                    analysions la cohérence contenu → conversion.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5C5C5C]">
                    Site internet, tunnel ou lien principal
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#5C5C5C] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled={answers.hasNoWebsite}
                      placeholder="https://votresite.com ou lien de votre offre..."
                      value={answers.websiteUrl}
                      onChange={(e) =>
                        updateAnswers({ websiteUrl: e.target.value, hasNoWebsite: false })
                      }
                      className="w-full rounded-2xl border border-[#D8D5CE] bg-[#FAF9F6] pl-11 pr-4 py-3.5 text-sm text-[#191919] placeholder:text-[#8E8E8E] focus:outline-none focus:bg-white focus:border-[#021B3A] disabled:opacity-50"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={answers.hasNoWebsite}
                      onChange={(e) =>
                        updateAnswers({
                          hasNoWebsite: e.target.checked,
                          websiteUrl: e.target.checked ? "" : answers.websiteUrl,
                        })
                      }
                      className="w-4 h-4 rounded accent-[#021B3A]"
                    />
                    <span className="text-xs sm:text-sm text-[#4A4A4A]">
                      Je n'ai pas encore de site internet ou mon nouveau tunnel est en refonte
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5C5C5C] mb-2.5">
                    Plateforme principale actuelle
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((plat) => {
                      const active = answers.primaryPlatform === plat;
                      return (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => updateAnswers({ primaryPlatform: plat })}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                            active
                              ? "bg-[#021B3A] text-white border-[#021B3A]"
                              : "bg-[#FAF9F6] text-[#191919] border-[#DFDDD7] hover:bg-[#F3F0EA]"
                          }`}
                        >
                          {plat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#191919]">
                    Quel est votre objectif prioritaire à 90 jours ?
                  </h3>
                  <p className="text-sm text-[#5C5C5C] mt-1">
                    Choisissez le levier qui aura le plus fort impact sur votre activité.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OBJECTIVES.map((obj) => {
                    const active = answers.mainObjective === obj.value;
                    return (
                      <button
                        key={obj.value}
                        type="button"
                        onClick={() => updateAnswers({ mainObjective: obj.value })}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          active
                            ? "bg-[#021B3A] border-[#021B3A] text-white"
                            : "bg-[#FAF9F6] hover:bg-[#F3F0EA] border-[#E5E2DC] text-[#191919]"
                        }`}
                      >
                        <span
                          className={`inline-block text-[11px] font-semibold uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full mb-2 ${
                            active
                              ? "bg-[#4FA3B8]/25 text-[#7FE0EE]"
                              : "bg-white text-[#358298] border border-[#4FA3B8]/30"
                          }`}
                        >
                          {obj.tag}
                        </span>
                        <div className="font-semibold text-sm">{obj.value}</div>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            active ? "text-white/75" : "text-[#5C5C5C]"
                          }`}
                        >
                          {obj.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#191919]">
                    Où en est votre stratégie de contenu organique ?
                  </h3>
                  <p className="text-sm text-[#5C5C5C] mt-1">
                    Évaluons ensemble la maturité actuelle de vos publications organiques.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {ORGANIC_OPTIONS.map((item) => {
                    const active = answers.organicMaturity === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => updateAnswers({ organicMaturity: item.value })}
                        className={`w-full p-4 rounded-2xl border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1 transition-all cursor-pointer ${
                          active
                            ? "bg-[#021B3A] border-[#021B3A] text-white"
                            : "bg-[#FAF9F6] hover:bg-[#F3F0EA] border-[#E5E2DC] text-[#191919]"
                        }`}
                      >
                        <span className="font-semibold text-sm">{item.value}</span>
                        <span
                          className={`text-xs ${active ? "text-[#7FE0EE]" : "text-[#5C5C5C]"}`}
                        >
                          {item.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5C5C5C] mb-2">
                    Taille d'audience cumulée actuelle
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AUDIENCE_SIZES.map((sz) => {
                      const active = answers.audienceSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => updateAnswers({ audienceSize: sz })}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            active
                              ? "bg-[#021B3A] text-white border-[#021B3A]"
                              : "bg-white text-[#191919] border-[#DFDDD7] hover:bg-[#FAF9F6]"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#191919]">
                    Quelle place occupent les Ads dans votre acquisition ?
                  </h3>
                  <p className="text-sm text-[#5C5C5C] mt-1">
                    Dernière étape avant de générer votre diagnostic personnalisé et d'ouvrir le calendrier d'appel.
                  </p>
                </div>

                <div className="space-y-3">
                  {ADS_OPTIONS.map((ad) => {
                    const active = answers.adsMaturity === ad.value;
                    return (
                      <button
                        key={ad.value}
                        type="button"
                        onClick={() => updateAnswers({ adsMaturity: ad.value })}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          active
                            ? "bg-[#021B3A] border-[#021B3A] text-white"
                            : "bg-[#FAF9F6] hover:bg-[#F3F0EA] border-[#E5E2DC] text-[#191919]"
                        }`}
                      >
                        <span className="font-semibold text-sm">{ad.value}</span>
                        <span
                          className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full ${
                            active
                              ? "bg-[#4FA3B8]/25 text-[#7FE0EE]"
                              : "bg-white text-[#358298] border border-[#DFDDD7]"
                          }`}
                        >
                          {ad.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 6 && backendResult && (
              <motion.form
                key="step-6"
                onSubmit={handleConfirmCall}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                className="space-y-7"
              >
                {/* Backend Computed Diagnostic Card */}
                <div className="rounded-2xl bg-[#021B3A] text-white p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7FE0EE]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Diagnostic généré • Réf. {backendResult.dossierId}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-mono-data text-xs text-white">
                      Score d'alignement :{" "}
                      <strong className="text-[#7FE0EE]">{backendResult.globalScore}/100</strong>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-xl sm:text-2xl text-white">
                      Priorité identifiée : {backendResult.pillarFocus}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed">
                      {backendResult.keyRecommendation}
                    </p>
                  </div>

                  {/* 4 Computed Sub-Scores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    {backendResult.axes.map((ax) => (
                      <div
                        key={ax.label}
                        className="rounded-xl bg-white/[0.06] border border-white/10 p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white/90">{ax.label}</span>
                          <span className="font-mono-data text-[#7FE0EE] font-semibold">
                            {ax.score}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            style={{ width: `${ax.score}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-[#4FA3B8] to-[#9AF0FC]"
                          />
                        </div>
                        <div className="text-[11px] text-white/65 truncate">{ax.insight}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phone Call Calendar Picker */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#021B3A] mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-[#4FA3B8]" />
                        1. Choisissez le jour de l'appel
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {businessDays.map((d) => {
                          const selected = booking.selectedDateIso === d.iso;
                          return (
                            <button
                              key={d.iso}
                              type="button"
                              onClick={() =>
                                updateBooking({
                                  selectedDateIso: d.iso,
                                  selectedDateLabel: d.fullLabel,
                                })
                              }
                              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                selected
                                  ? "bg-[#021B3A] text-white border-[#021B3A]"
                                  : "bg-[#FAF9F6] hover:bg-[#F3F0EA] text-[#191919] border-[#E5E2DC]"
                              }`}
                            >
                              <div
                                className={`text-[11px] uppercase ${
                                  selected ? "text-[#7FE0EE]" : "text-[#5C5C5C]"
                                }`}
                              >
                                {d.dayShort}
                              </div>
                              <div className="font-bold text-base leading-tight mt-0.5">
                                {d.dayNum}
                              </div>
                              <div
                                className={`text-[11px] ${
                                  selected ? "text-white/75" : "text-[#5C5C5C]"
                                }`}
                              >
                                {d.monthShort}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#021B3A] mb-2.5">
                        <Clock className="w-3.5 h-3.5 text-[#4FA3B8]" />
                        2. Créneau horaire (30 min • Appel téléphonique)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const taken = reservedSlotsForSelectedDay.includes(slot);
                          const selected = booking.selectedTime === slot && !taken;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={taken}
                              onClick={() => updateBooking({ selectedTime: slot })}
                              className={`py-2.5 px-2 rounded-xl border font-mono-data text-xs font-medium transition-all ${
                                taken
                                  ? "bg-[#EFECE6] text-[#A3A3A3] border-[#E5E2DC] line-through cursor-not-allowed"
                                  : selected
                                  ? "bg-[#021B3A] text-white border-[#021B3A] cursor-pointer"
                                  : "bg-white hover:bg-[#FAF9F6] text-[#191919] border-[#DFDDD7] cursor-pointer"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Contact & Phone Inputs */}
                  <div className="space-y-3.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#021B3A]">
                      <PhoneCall className="w-3.5 h-3.5 text-[#4FA3B8]" />
                      3. Vos coordonnées pour l'appel
                    </label>
                    <input
                      type="text"
                      placeholder="Votre prénom et nom *"
                      value={booking.fullName}
                      onChange={(e) => updateBooking({ fullName: e.target.value })}
                      className="w-full rounded-xl border border-[#D8D5CE] bg-[#FAF9F6] px-4 py-3 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#021B3A]"
                    />
                    <input
                      type="email"
                      placeholder="Adresse e-mail professionnelle *"
                      value={booking.email}
                      onChange={(e) => updateBooking({ email: e.target.value })}
                      className="w-full rounded-xl border border-[#D8D5CE] bg-[#FAF9F6] px-4 py-3 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#021B3A]"
                    />
                    <div className="flex gap-2">
                      <select
                        aria-label="Indicatif téléphonique"
                        value={booking.countryCode}
                        onChange={(e) => updateBooking({ countryCode: e.target.value })}
                        className="rounded-xl border border-[#D8D5CE] bg-[#FAF9F6] px-3 py-3 text-sm font-medium text-[#191919] focus:outline-none focus:border-[#021B3A]"
                      >
                        <option value="+33">FR +33</option>
                        <option value="+32">BE +32</option>
                        <option value="+41">CH +41</option>
                        <option value="+1">CA +1</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="6 12 34 56 78 (pour l'appel) *"
                        value={booking.phone}
                        onChange={(e) => updateBooking({ phone: e.target.value })}
                        className="flex-1 rounded-xl border border-[#D8D5CE] bg-[#FAF9F6] px-4 py-3 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#021B3A]"
                      />
                    </div>
                  </div>
                </div>

                {stepError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-medium text-red-700">
                    {stepError}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#ECEAE4]">
                  <button
                    type="button"
                    onClick={() => {
                      setStepError(null);
                      setCurrentStep(5);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#5C5C5C] hover:text-[#021B3A] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Modifier mes réponses
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 rounded-full bg-[#021B3A] hover:bg-[#0A2B56] text-white text-sm font-semibold px-7 py-3.5 shadow-sm transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#7FE0EE]" />
                    Confirmer mon appel le {booking.selectedDateLabel} à {booking.selectedTime}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}

        {stepError && currentStep < 6 && !isProcessingBackend && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-medium text-red-700">
            {stepError}
          </div>
        )}
      </div>

      {/* Bottom Step Navigation for Quiz Steps 1..5 */}
      {currentStep < 6 && !isProcessingBackend && (
        <div className="flex items-center justify-between gap-4 pt-5 border-t border-[#ECEAE4]">
          <button
            type="button"
            onClick={() => {
              setStepError(null);
              setCurrentStep((prev) => Math.max(1, prev - 1));
            }}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
              currentStep === 1
                ? "text-[#B5B5B5] cursor-not-allowed"
                : "text-[#5C5C5C] hover:text-[#021B3A] cursor-pointer"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>

          <button
            type="button"
            onClick={validateAndNext}
            className="inline-flex items-center gap-2 rounded-full bg-[#021B3A] hover:bg-[#092952] text-white text-sm font-semibold px-7 py-3 transition-all cursor-pointer group"
          >
            <span>
              {currentStep === 5 ? "Générer mon diagnostic & choisir mon créneau" : "Continuer"}
            </span>
            <ArrowRight className="w-4 h-4 text-[#7FE0EE] transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};
