import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useDiagnosticBooking } from "../context/DiagnosticBookingContext";
import { Interactive3DStrydeLogo } from "./Interactive3DStrydeLogo";
import { EDITORIAL_EASE } from "./MotionPrimitives";

export const HeroSection: React.FC = () => {
  const { openDiagnosticPage } = useDiagnosticBooking();

  return (
    <section className="relative bg-white pt-10 pb-20 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-32 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="space-y-7 max-w-[1060px]">
          {/* Horizontal Row: Headline on the left + 3D Stryde Token directly to its right across all viewports */}
          <div className="flex flex-row items-center justify-between gap-4 sm:gap-10 lg:gap-14">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
              className="font-editorial text-[36px] sm:text-[54px] lg:text-[66px] leading-[1.03] tracking-[-0.03em] text-[#191919] font-normal"
            >
              Plus d’impact, <br />
              <span className="italic font-normal text-[#021B3A]">
                une vraie stratégie.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.1, ease: EDITORIAL_EASE }}
              className="shrink-0 flex items-center justify-end"
            >
              <Interactive3DStrydeLogo />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: EDITORIAL_EASE }}
            className="text-lg sm:text-[19px] leading-[1.6] text-[#4F4F4F] max-w-[560px]"
          >
            Stryde repense l’intégralité de votre stratégie de contenu. Nous alignons votre
            positionnement, votre rétention organique et votre acquisition pour transformer
            votre audience en croissance durable.
          </motion.p>

          {/* Primary & Secondary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EDITORIAL_EASE }}
            className="flex flex-wrap items-center gap-3.5 pt-1"
          >
            <button
              type="button"
              onClick={() => openDiagnosticPage()}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#021B3A] hover:bg-[#092C58] text-white text-[15px] font-semibold px-7 py-4 transition-all shadow-[0_12px_30px_rgba(2,27,58,0.18)] cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#7FE0EE]" />
              <span>Passer le test & prendre RDV</span>
              <ArrowRight className="w-4 h-4 text-[#7FE0EE] transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <a
              href="#organique"
              className="inline-flex items-center gap-2 rounded-full bg-[#F3F0EA] hover:bg-[#E9E5DC] text-[#191919] text-[15px] font-semibold px-6 py-4 transition-colors"
            >
              <span>Découvrir notre approche</span>
            </a>
          </motion.div>

          {/* Clean Architectural Pillars Footnote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.26, ease: EDITORIAL_EASE }}
            className="pt-5 border-t border-[#ECEAE4] grid grid-cols-3 gap-4 max-w-[560px]"
          >
            <div>
              <div className="font-mono-data text-xs font-semibold text-[#358298]">01</div>
              <div className="text-xs sm:text-sm font-semibold text-[#191919] mt-0.5">
                Positionnement
              </div>
              <div className="text-[11px] text-[#666666]">Angle unique & offre</div>
            </div>
            <div>
              <div className="font-mono-data text-xs font-semibold text-[#358298]">02</div>
              <div className="text-xs sm:text-sm font-semibold text-[#191919] mt-0.5">
                Contenu Organique
              </div>
              <div className="text-[11px] text-[#666666]">Scripts, hooks & rétention</div>
            </div>
            <div>
              <div className="font-mono-data text-xs font-semibold text-[#358298]">03</div>
              <div className="text-xs sm:text-sm font-semibold text-[#191919] mt-0.5">
                Amplification Ads
              </div>
              <div className="text-[11px] text-[#666666]">Synergie acquisition</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
