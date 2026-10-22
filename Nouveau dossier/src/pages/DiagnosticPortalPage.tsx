import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, FileCheck2, ShieldCheck, Lock } from "lucide-react";
import { StrydeLogo } from "../components/StrydeLogo";
import { PositioningDiagnosticFlow } from "../components/PositioningDiagnosticFlow";
import { useDiagnosticBooking } from "../context/DiagnosticBookingContext";
import { EDITORIAL_EASE } from "../components/MotionPrimitives";

export const DiagnosticPortalPage: React.FC = () => {
  const { returnHome } = useDiagnosticBooking();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#191919] flex flex-col">
      {/* Clean Distraction-Free Onboarding Top Bar (Wealthsimple /get-started style) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E6E0]">
        <div className="max-w-[1140px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => returnHome()}
            className="cursor-pointer focus:outline-none"
          >
            <StrydeLogo layout="horizontal" theme="dark" />
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[#5C5C5C]">
            <Lock className="w-3.5 h-3.5 text-[#358298]" />
            <span>Portail de pré-qualification & prise de rendez-vous</span>
          </div>

          <button
            type="button"
            onClick={() => returnHome()}
            className="inline-flex items-center gap-2 rounded-full bg-[#F3F0EA] hover:bg-[#E7E3DA] text-[#191919] text-xs sm:text-sm font-semibold px-4 py-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#021B3A]" />
            <span>Retour à l'accueil</span>
          </button>
        </div>
      </header>

      {/* Main Dedicated Onboarding Container */}
      <main className="flex-1 py-12 sm:py-16 px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
          className="max-w-[960px] mx-auto space-y-10"
        >
          {/* Header Intro */}
          <div className="max-w-[700px] space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#358298]">
              <span className="w-2 h-2 rounded-full bg-[#4FA3B8]" />
              Étape préalable à votre appel stratégique
            </span>
            <h1 className="font-editorial text-[34px] sm:text-[46px] leading-[1.08] tracking-[-0.025em] text-[#191919]">
              Diagnostic de positionnement Stryde.
            </h1>
            <p className="text-base sm:text-lg text-[#4F4F4F] leading-relaxed">
              Répondez à ces 5 questions rapides (profil & âge, site internet, objectif, organique
              et Ads). Notre système génère immédiatement votre synthèse et débloque le calendrier
              d'appel téléphonique.
            </p>
          </div>

          {/* Interactive Backend-Connected Flow */}
          <PositioningDiagnosticFlow />

          {/* Clean Reassurances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E6E3DC]">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#358298] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[#191919]">Moins de 60 secondes</div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed mt-0.5">
                  Un format direct conçu pour qualifier votre écosystème sans perte de temps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileCheck2 className="w-5 h-5 text-[#358298] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[#191919]">Audit préparé en amont</div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed mt-0.5">
                  Vos réponses sont transmises à notre back-office avant votre appel téléphonique.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#358298] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[#191919]">Confidentialité stricte</div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed mt-0.5">
                  Vos données et objectifs restent strictement confidentiels au sein de Stryde.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
