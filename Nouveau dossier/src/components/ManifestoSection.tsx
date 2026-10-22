import React from "react";
import { motion } from "framer-motion";
import { EditorialReveal, EDITORIAL_EASE } from "./MotionPrimitives";
import { StrydeMountainMark } from "./StrydeLogo";

export const ManifestoSection: React.FC = () => {
  return (
    <section
      id="manifeste"
      className="bg-[#FAF9F6] border-y border-[#ECEAE3] py-24 sm:py-32 px-5 sm:px-8"
    >
      <div className="max-w-[780px] mx-auto text-center">
        {/* Wealthsimple-inspired Geometric Stacked Emblem built from Stryde's Summit Geometry */}
        <EditorialReveal className="flex justify-center mb-8">
          <div className="relative inline-flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
              className="w-20 h-20 rounded-3xl bg-[#021B3A] shadow-[0_18px_40px_rgba(2,27,58,0.16)] flex flex-col items-center justify-center border border-[#4FA3B8]/30"
            >
              <StrydeMountainMark className="w-12 h-6" glossy />
              <div className="mt-2 flex flex-col gap-1 w-9">
                <span className="h-[2px] w-full rounded-full bg-[#7FE0EE]/85" />
                <span className="h-[2px] w-7 mx-auto rounded-full bg-[#4FA3B8]/65" />
                <span className="h-[2px] w-5 mx-auto rounded-full bg-[#4FA3B8]/40" />
              </div>
            </motion.div>
          </div>
        </EditorialReveal>

        {/* Monumental Centered Serif Headline */}
        <EditorialReveal delay={0.08}>
          <h2 className="font-editorial text-[36px] sm:text-[48px] md:text-[54px] leading-[1.08] tracking-[-0.025em] text-[#191919] font-normal">
            Bienvenue dans la nouvelle ère <br className="hidden sm:inline" />
            de la stratégie de contenu.
          </h2>
        </EditorialReveal>

        {/* Wealthsimple-cadence Manifesto Paragraph */}
        <EditorialReveal delay={0.16}>
          <p className="mt-6 text-lg sm:text-[20px] leading-[1.65] text-[#454545] font-normal">
            Pourquoi existons-nous ? Parce que nous savions qu’il existait une voie plus juste
            entre courir après les vues éphémères et s’épuiser à produire sans retour. Chez{" "}
            <strong className="font-semibold text-[#021B3A]">Stryde</strong>, nous aidons les
            influenceurs et les infopreneurs à clarifier leur positionnement, structurer une
            ligne éditoriale magnétique, élever la rétention de chaque format et relier
            naturellement leur contenu organique à leurs offres.
          </p>
        </EditorialReveal>

        {/* Clean Institutional Fine Print (Exact Wealthsimple transparency aesthetic, zero fake claims) */}
        <EditorialReveal delay={0.22}>
          <p className="mt-8 text-xs sm:text-[13px] leading-relaxed text-[#767676] max-w-[600px] mx-auto">
            Chaque accompagnement débute par un diagnostic méthodologique individuel évaluant
            votre écosystème actuel (site internet, audience organique, offres et acquisition
            payante) avant tout appel stratégique.
          </p>
        </EditorialReveal>
      </div>
    </section>
  );
};
