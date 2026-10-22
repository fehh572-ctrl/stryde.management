import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Sparkles,
  Check,
  PhoneCall,
  Play,
  Compass,
  TrendingUp,
  Megaphone,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { EditorialReveal, EDITORIAL_EASE } from "./MotionPrimitives";
import { useDiagnosticBooking } from "../context/DiagnosticBookingContext";
import { FuturisticMountainVisual } from "./FuturisticMountainVisual";

const SCRIPT_ANATOMY = [
  {
    id: "hook",
    time: "00:00 – 00:03",
    label: "Hook visuel & verbal",
    title: "Capter la bonne audience dès la première seconde",
    detail:
      "Formulation d'une tension précise qui filtre immédiatement les simples curieux pour ne retenir que votre avatar acheteur.",
  },
  {
    id: "shift",
    time: "00:04 – 00:22",
    label: "Rupture de croyance",
    title: "Déconstruire le mythe dominant de votre niche",
    detail:
      "Positionne naturellement votre autorité d'infopreneur ou de créateur sans posture arrogante ni promesse artificielle.",
  },
  {
    id: "mechanism",
    time: "00:23 – 00:50",
    label: "Mécanisme concret",
    title: "Apporter une clarté immédiatement actionnable",
    detail:
      "Structure narrative rythmée (micro-boucles d'attention) maintenant la rétention haute sur Reels, Shorts, TikTok et YouTube.",
  },
  {
    id: "bridge",
    time: "00:51 – Fin",
    label: "Pont vers l'écosystème",
    title: "Transition fluide vers votre site ou appel",
    detail:
      "Un appel à l'action contextuel qui invite naturellement les profils qualifiés vers votre diagnostic et vos offres.",
  },
];

const SUMMIT_TABS = [
  {
    id: "audit",
    code: "01",
    label: "Audit Positionnement & Angles",
    icon: Compass,
    headline: "Trouver la zone où vous êtes sans concurrence frontale",
    description:
      "Nous analysons vos contenus passés, la maturité de votre audience et l'architecture de votre site pour définir 3 à 4 piliers éditoriaux propriétaires.",
    deliverables: [
      "Cartographie complète de l'avatar et des niveaux de conscience",
      "Refonte du positionnement bio, promesse centrale et angle différenciant",
      "Alignement direct entre sujets de vidéos et offres à forte marge",
    ],
  },
  {
    id: "content",
    code: "02",
    label: "Ingénierie de Contenu & Scripts",
    icon: TrendingUp,
    headline: "Ne plus jamais tourner face caméra sans plan de rétention",
    description:
      "Chaque publication suit une architecture éprouvée : hooks testés, rythme narratif maîtrisé et équilibre calculé entre portée virale et profondeur d'expertise.",
    deliverables: [
      "Banque sur mesure de structures d'accroches et trames de scripts",
      "Relecture stratégique et retour sur le montage / rythme visuel",
      "Système de recyclage intelligent Long Format ↔ Formats Courts",
    ],
  },
  {
    id: "ads",
    code: "03",
    label: "Amplification Organique × Ads",
    icon: Megaphone,
    headline: "Transformer vos meilleurs Reels & vidéos en moteurs d'acquisition",
    description:
      "Au lieu de deviner quelles publicités tourner, nous identifions les contenus organiques qui convertissent déjà et les déployons en acquisition payante.",
    deliverables: [
      "Sélection par la donnée des concepts organiques à plus fort taux d'engagement",
      "Déclinaisons créatives orientées conversion (hooks publicitaires dédiés)",
      "Retargeting éditorial vers le test de positionnement et la prise de RDV",
    ],
  },
];

const PORTFOLIO_PROFILES = [
  {
    id: "infopreneur",
    label: "Infopreneur",
    subtitle: "Priorité conversion & appels qualifiés",
    mix: [
      { name: "Autorité & Preuve de méthode", pct: 42, color: "#021B3A" },
      { name: "Hooks découverte organique", pct: 24, color: "#358298" },
      { name: "Creative Ads & Retargeting", pct: 20, color: "#5CB6CB" },
      { name: "Ponts VSL & Qualification", pct: 14, color: "#90DCEB" },
    ],
  },
  {
    id: "influenceur",
    label: "Influenceur",
    subtitle: "Priorité expansion & lancement d'offre",
    mix: [
      { name: "Autorité & Preuve de méthode", pct: 30, color: "#021B3A" },
      { name: "Hooks découverte organique", pct: 44, color: "#358298" },
      { name: "Creative Ads & Retargeting", pct: 12, color: "#5CB6CB" },
      { name: "Ponts VSL & Qualification", pct: 14, color: "#90DCEB" },
    ],
  },
  {
    id: "hybride",
    label: "Scale Hybride",
    subtitle: "Synergie intensive Organique × Paid",
    mix: [
      { name: "Autorité & Preuve de méthode", pct: 32, color: "#021B3A" },
      { name: "Hooks découverte organique", pct: 22, color: "#358298" },
      { name: "Creative Ads & Retargeting", pct: 32, color: "#5CB6CB" },
      { name: "Ponts VSL & Qualification", pct: 14, color: "#90DCEB" },
    ],
  },
];

const FONDATION_PHASES = [
  {
    month: "Mois 01",
    title: "Positionnement & Architecture d'Offre",
    cadence: "2 à 3 formats ciblés / sem.",
    focus:
      "Clarification de votre mécanisme unique, refonte de votre profil/site et création de votre matrice de 30 angles éditoriaux.",
    bars: [38, 52, 68, 84],
  },
  {
    month: "Mois 02",
    title: "Système Organique & Rétention",
    cadence: "3 à 4 formats calibrés / sem.",
    focus:
      "Optimisation fine des 3 premières secondes, structuration narrative des scripts et installation de la boucle vers le pré-diagnostic.",
    bars: [54, 70, 86, 94],
  },
  {
    month: "Mois 03",
    title: "Autonomie & Amplification Sélective",
    cadence: "Système stabilisé & prévisible",
    focus:
      "Identification des contenus champions, déploiement de vos premières campagnes de retargeting et consolidation des appels entrants.",
    bars: [68, 82, 92, 100],
  },
];

export const ProductShowcases: React.FC = () => {
  const { openDiagnosticPage } = useDiagnosticBooking();
  const [activeScriptIdx, setActiveScriptIdx] = useState(0);
  const [activeFunnelStep, setActiveFunnelStep] = useState(2);
  const [summitTab, setSummitTab] = useState(0);
  const [portfolioIdx, setPortfolioIdx] = useState(0);
  const [fondationIdx, setFondationIdx] = useState(0);

  const funnelSteps = [
    {
      step: "01 • Découverte",
      title: "Contenu court polarisant",
      meta: "Reels • TikTok • Shorts",
      desc: "Attire une audience ciblée autour d'un constat fort lié à votre expertise.",
    },
    {
      step: "02 • Profondeur",
      title: "Contenu long & preuve de compétence",
      meta: "YouTube • Carrousel • Lettre",
      desc: "Installe la confiance et démontre la solidité de votre méthode sans vendre brutalement.",
    },
    {
      step: "03 • Qualification",
      title: "Test de positionnement & filtrage",
      meta: "Portail dédié Stryde",
      desc: "Identifie les objectifs, le site et la maturité du prospect avant tout échange.",
    },
    {
      step: "04 • Conversion",
      title: "Appel stratégique préparé",
      meta: "Rendez-vous téléphonique",
      desc: "Des interlocuteurs déjà convaincus par votre contenu et alignés avec votre offre.",
    },
  ];

  const currentSummit = SUMMIT_TABS[summitTab];
  const currentPortfolio = PORTFOLIO_PROFILES[portfolioIdx];
  const currentFondation = FONDATION_PHASES[fondationIdx];

  return (
    <div className="space-y-0">
      {/* =====================================================================
          PART A: TWO WEALTHSIMPLE-STYLE DUAL EDITORIAL CARDS
          ===================================================================== */}
      <section className="bg-white py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Stryde Organique */}
          <EditorialReveal
            id="organique"
            className="rounded-[32px] bg-[#F3F0EA] border border-[#E5E1D8] p-7 sm:p-11 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#021B3A]">
                <Layers className="w-4 h-4 text-[#4FA3B8]" />
                Stryde Organique
              </div>

              <h3 className="font-editorial text-[32px] sm:text-[40px] leading-[1.09] tracking-[-0.025em] text-[#191919] mt-3">
                La stratégie éditoriale la plus structurée pour les créateurs exigeants.
              </h3>

              <p className="text-[16px] leading-[1.6] text-[#4F4F4F] mt-4">
                Fini le syndrome de la page blanche et les vidéos qui plafonnent sans explication.
                Nous concevons vos piliers éditoriaux, vos accroches et vos trames narratives pour
                maximiser la rétention tout en respectant votre voix.
              </p>
            </div>

            {/* Interactive Script Anatomy Widget inside Card */}
            <div className="mt-8 rounded-2xl bg-white border border-[#E4E0D7] p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EFECE6]">
                <span className="text-xs font-semibold uppercase tracking-[0.09em] text-[#021B3A] flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-[#4FA3B8] text-[#4FA3B8]" />
                  Anatomie d'un script Stryde
                </span>
                <span className="font-mono-data text-[11px] text-[#358298]">
                  Cliquez pour explorer
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 my-3.5">
                {SCRIPT_ANATOMY.map((item, idx) => {
                  const selected = activeScriptIdx === idx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveScriptIdx(idx)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#021B3A] border-[#021B3A] text-white"
                          : "bg-[#FAF9F6] hover:bg-[#F3F0EA] border-[#E7E4DC] text-[#191919]"
                      }`}
                    >
                      <div
                        className={`font-mono-data text-[10px] ${
                          selected ? "text-[#7FE0EE]" : "text-[#6E6E6E]"
                        }`}
                      >
                        {item.time}
                      </div>
                      <div className="text-xs font-semibold truncate mt-0.5">{item.label}</div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={SCRIPT_ANATOMY[activeScriptIdx].id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                  className="rounded-xl bg-[#FAF9F6] border border-[#ECE9E2] p-3.5"
                >
                  <div className="text-sm font-semibold text-[#021B3A]">
                    {SCRIPT_ANATOMY[activeScriptIdx].title}
                  </div>
                  <p className="text-xs text-[#555555] leading-relaxed mt-1">
                    {SCRIPT_ANATOMY[activeScriptIdx].detail}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 pt-3 border-t border-[#EFECE6] flex items-center justify-between">
                <span className="text-xs text-[#5C5C5C]">YouTube • Instagram • TikTok • LinkedIn</span>
                <button
                  type="button"
                  onClick={() => openDiagnosticPage()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#021B3A] hover:text-[#358298] cursor-pointer"
                >
                  <span>Auditer mon contenu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </EditorialReveal>

          {/* Card 2: Stryde Infopreneuriat */}
          <EditorialReveal
            id="infopreneuriat"
            delay={0.1}
            className="rounded-[32px] bg-[#EAF2F5] border border-[#D4E4EA] p-7 sm:p-11 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#021B3A]">
                <Sparkles className="w-4 h-4 text-[#358298]" />
                Stryde Infopreneuriat
              </div>

              <h3 className="font-editorial text-[32px] sm:text-[40px] leading-[1.09] tracking-[-0.025em] text-[#191919] mt-3">
                Le chemin le plus direct entre votre audience et vos accompagnements.
              </h3>

              <p className="text-[16px] leading-[1.6] text-[#455259] mt-4">
                Une audience massive sans écosystème de conversion laisse l’essentiel de sa valeur
                sur la table. Nous bâtissons le pont éditorial entre vos contenus gratuits, votre
                site web et vos appels de vente qualifiés.
              </p>
            </div>

            {/* Interactive Value Bridge Widget inside Card */}
            <div className="mt-8 rounded-2xl bg-white border border-[#D6E5EB] p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EDF3F5]">
                <span className="text-xs font-semibold uppercase tracking-[0.09em] text-[#021B3A]">
                  Chaîne de conversion éditoriale
                </span>
                <span className="font-mono-data text-[11px] text-[#358298]">
                  4 étapes intégrées
                </span>
              </div>

              <div className="space-y-2 my-3.5">
                {funnelSteps.map((st, i) => {
                  const isSelected = activeFunnelStep === i;
                  return (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => setActiveFunnelStep(i)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#021B3A] border-[#021B3A] text-white"
                          : "bg-[#F7FAFB] hover:bg-[#EDF4F7] border-[#E1ECF0] text-[#191919]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">{st.title}</span>
                        <span
                          className={`font-mono-data text-[10px] px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-[#4FA3B8]/25 text-[#7FE0EE]"
                              : "bg-white text-[#358298]"
                          }`}
                        >
                          {st.meta}
                        </span>
                      </div>
                      {isSelected && (
                        <p className="text-xs text-white/80 mt-1.5 leading-relaxed">{st.desc}</p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#455259]">Formations • Coaching • Masterminds</span>
                <button
                  type="button"
                  onClick={() => openDiagnosticPage()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#021B3A] hover:text-[#358298] cursor-pointer"
                >
                  <span>Faire le test positionnement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </section>

      {/* =====================================================================
          PART B: WEALTHSIMPLE DARK LUXURY SECTION — STRYDE SUMMIT (FRAMELESS 3D MOUNTAINS)
          ===================================================================== */}
      <section
        id="summit"
        className="bg-[#02162E] text-white py-24 sm:py-32 px-5 sm:px-8 relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -top-40 right-0 w-[620px] h-[620px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4FA3B8 0%, rgba(2,22,46,0) 70%)",
          }}
        />

        <div className="max-w-[1240px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Side: Dark Editorial Controls */}
            <div className="lg:col-span-6 space-y-7">
              <EditorialReveal>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7FE0EE]">
                  <span className="w-2 h-2 rounded-full bg-[#7FE0EE]" />
                  Stryde Active Growth
                </span>

                <h2 className="font-editorial text-[36px] sm:text-[48px] leading-[1.06] tracking-[-0.025em] text-white font-normal mt-3">
                  Accélérez comme un média de référence, sans diluer votre image.
                </h2>

                <p className="text-base sm:text-lg text-white/75 leading-relaxed mt-4">
                  Lorsque l’organique valide un angle et que la publicité l’amplifie auprès de
                  milliers de profils similaires, votre croissance cesse d’être aléatoire.
                </p>
              </EditorialReveal>

              {/* Tab Switcher */}
              <div className="space-y-2.5 pt-2">
                {SUMMIT_TABS.map((t, index) => {
                  const Icon = t.icon;
                  const active = summitTab === index;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSummitTab(index)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        active
                          ? "bg-white/10 border-[#7FE0EE]/50 shadow-sm"
                          : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            active
                              ? "bg-[#7FE0EE] text-[#021B3A]"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono-data text-[11px] text-[#7FE0EE]">
                            PHASE {t.code}
                          </div>
                          <div className="font-semibold text-sm sm:text-base text-white">
                            {t.label}
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          active ? "text-[#7FE0EE] translate-x-0.5" : "text-white/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openDiagnosticPage()}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-[#EBF4F6] text-[#021B3A] text-sm font-semibold px-7 py-3.5 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#021B3A]" />
                  <span>Évaluer mon potentiel Organique × Ads</span>
                </button>
              </div>
            </div>

            {/* Right Side: 100% Frameless Dark Futuristic 3D Kinetic Stryde Connected Mountains */}
            <div className="lg:col-span-6 space-y-4">
              {/* Unframed floating 3D mountain monument synced with active Summit phase */}
              <FuturisticMountainVisual
                variant="dark"
                activePeak={summitTab as 0 | 1 | 2}
                className="h-[280px] sm:h-[330px] w-full"
              />

              {/* Clean Unboxed Phase Blueprint Directly Below */}
              <div className="px-2 sm:px-4 pt-2 border-t border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSummit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                    className="space-y-4 pt-4"
                  >
                    <span className="inline-block font-mono-data text-xs uppercase tracking-[0.14em] text-[#7FE0EE]">
                      Livrable & Méthodologie • Phase {currentSummit.code}
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl text-white">
                      {currentSummit.headline}
                    </h3>
                    <p className="text-sm text-white/75 leading-relaxed">
                      {currentSummit.description}
                    </p>

                    <ul className="space-y-2.5 pt-2">
                      {currentSummit.deliverables.map((deliv) => (
                        <li
                          key={deliv}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#4FA3B8]/25 text-[#7FE0EE] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PART C: WEALTHSIMPLE PORTFOLIOS CADENCE — INTERACTIVE PORTFOLIO CARDS
          ===================================================================== */}
      <section id="programmes" className="bg-white py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-[1240px] mx-auto space-y-24">
          {/* Format 1: Programme Summit + Interactive Content Allocation Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <EditorialReveal className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#358298]">
                Accompagnements Stryde
              </span>
              <h2 className="font-editorial text-[34px] sm:text-[46px] leading-[1.08] tracking-[-0.025em] text-[#191919]">
                Le programme Summit. Direction éditoriale complète, croissance long terme, zéro dispersion.
              </h2>
              <p className="text-base sm:text-lg text-[#4F4F4F] leading-relaxed">
                Conçu pour les influenceurs établis et les infopreneurs souhaitant déléguer la
                réflexion stratégique : positionnement d’autorité, architecture des scripts
                hebdomadaires, optimisation du site/tunnel et pilotage des créatives Ads.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  "Direction éditoriale dédiée",
                  "Scripts & hooks haute rétention",
                  "Optimisation tunnel & VSL",
                  "Creative Strategy Meta / YouTube Ads",
                ].map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] px-4 py-3 text-xs sm:text-sm font-medium text-[#191919]"
                  >
                    <Check className="w-4 h-4 text-[#358298] shrink-0" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openDiagnosticPage()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#021B3A] hover:bg-[#0A2C58] text-white text-sm font-semibold px-7 py-3.5 transition-all cursor-pointer"
                >
                  <span>Vérifier l'éligibilité via le test</span>
                  <ArrowRight className="w-4 h-4 text-[#7FE0EE]" />
                </button>
              </div>
            </EditorialReveal>

            {/* Wealthsimple-Inspired Interactive Allocation Card */}
            <EditorialReveal delay={0.1} className="lg:col-span-6 order-1 lg:order-2">
              <div className="rounded-[32px] bg-[#F3F0EA] border border-[#E5E1D8] p-6 sm:p-9 shadow-xs">
                <div className="rounded-3xl bg-white border border-[#E5E1D8] p-6 sm:p-7 shadow-[0_18px_50px_rgba(2,27,58,0.06)] space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFECE6]">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#358298]">
                        <BarChart3 className="w-3.5 h-3.5" />
                        Répartition Éditoriale Cible
                      </div>
                      <div className="font-editorial text-2xl text-[#191919] mt-0.5">
                        {currentPortfolio.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Profile Switcher */}
                  <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-[#FAF9F6] border border-[#E6E3DC]">
                    {PORTFOLIO_PROFILES.map((prof, idx) => {
                      const active = portfolioIdx === idx;
                      return (
                        <button
                          key={prof.id}
                          type="button"
                          onClick={() => setPortfolioIdx(idx)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? "bg-[#021B3A] text-white shadow-xs"
                              : "text-[#5C5C5C] hover:text-[#191919]"
                          }`}
                        >
                          {prof.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Animated Allocation Bars */}
                  <div className="space-y-4 pt-1">
                    {currentPortfolio.mix.map((row) => (
                      <div key={row.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-[#191919]">{row.name}</span>
                          <span className="font-mono-data font-semibold text-[#021B3A]">
                            {row.pct}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#F3F0EA] overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{ width: `${row.pct}%` }}
                            transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
                            style={{ backgroundColor: row.color }}
                            className="h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#5C5C5C]">
                    <span>Calibré sur mesure lors de l'audit initial</span>
                    <span className="font-mono-data text-[#021B3A] font-semibold">100% aligné</span>
                  </div>
                </div>
              </div>
            </EditorialReveal>
          </div>

          {/* Format 2: Programme Fondation + Interactive 90-Day Sprint Planner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <EditorialReveal className="lg:col-span-6">
              <div className="rounded-[32px] bg-[#EAF2F5] border border-[#D4E4EA] p-6 sm:p-9 shadow-xs">
                <div className="rounded-3xl bg-white border border-[#D6E5EB] p-6 sm:p-7 shadow-[0_18px_50px_rgba(2,27,58,0.06)] space-y-6">
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#EDF3F5]">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#358298]">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Trajectoire 90 Jours
                      </div>
                      <div className="font-editorial text-2xl text-[#191919] mt-0.5">
                        {currentFondation.title}
                      </div>
                    </div>
                  </div>

                  {/* Month Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {FONDATION_PHASES.map((ph, idx) => {
                      const active = fondationIdx === idx;
                      return (
                        <button
                          key={ph.month}
                          type="button"
                          onClick={() => setFondationIdx(idx)}
                          className={`py-2.5 px-3 rounded-xl border font-mono-data text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? "bg-[#021B3A] text-[#7FE0EE] border-[#021B3A]"
                              : "bg-[#F7FAFB] hover:bg-[#EDF4F7] text-[#191919] border-[#DCE9EE]"
                          }`}
                        >
                          {ph.month}
                        </button>
                      );
                    })}
                  </div>

                  {/* Clean Geometric Progression Columns */}
                  <div className="rounded-2xl bg-[#F7FAFB] border border-[#E1ECF0] p-5">
                    <div className="flex items-end justify-between gap-3 h-28 px-2">
                      {currentFondation.bars.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                        >
                          <motion.div
                            initial={false}
                            animate={{ height: `${val}%` }}
                            transition={{ duration: 0.48, ease: EDITORIAL_EASE }}
                            className="w-full max-w-[54px] rounded-t-xl bg-gradient-to-t from-[#021B3A] to-[#4FA3B8]"
                          />
                          <span className="font-mono-data text-[10px] text-[#5C6B73]">
                            Sem. {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="inline-block rounded-full bg-[#EAF2F5] px-3 py-1 text-xs font-semibold text-[#021B3A]">
                      Rythme : {currentFondation.cadence}
                    </div>
                    <p className="text-xs sm:text-sm text-[#4F5D65] leading-relaxed">
                      {currentFondation.focus}
                    </p>
                  </div>
                </div>
              </div>
            </EditorialReveal>

            <EditorialReveal delay={0.1} className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#358298]">
                Accompagnements Stryde
              </span>
              <h2 className="font-editorial text-[34px] sm:text-[46px] leading-[1.08] tracking-[-0.025em] text-[#191919]">
                Le programme Fondation. Clair, structuré, et calibré selon votre rythme de publication.
              </h2>
              <p className="text-base sm:text-lg text-[#4F4F4F] leading-relaxed">
                Idéal pour poser des bases irréprochables : refonte de votre positionnement,
                création de votre matrice de sujets à fort potentiel, méthodologie d'écriture de
                hooks et mise en place de votre parcours de prise de rendez-vous.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openDiagnosticPage()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F3F0EA] hover:bg-[#E7E2D8] text-[#191919] text-sm font-semibold px-7 py-3.5 transition-colors cursor-pointer"
                >
                  <span>Découvrir quel programme me correspond</span>
                  <ArrowRight className="w-4 h-4 text-[#021B3A]" />
                </button>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CLEAN WEALTHSIMPLE-STYLE CALLOUT BAND TO EXTERNAL DIAGNOSTIC PORTAL
          ===================================================================== */}
      <section className="bg-[#FAF9F6] border-t border-[#ECEAE3] py-20 sm:py-28 px-5 sm:px-8">
        <EditorialReveal className="max-w-[780px] mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E5E2DC] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#021B3A]">
            <PhoneCall className="w-3.5 h-3.5 text-[#4FA3B8]" />
            Appel découverte sur qualification
          </span>

          <h2 className="font-editorial text-[36px] sm:text-[50px] leading-[1.07] tracking-[-0.025em] text-[#191919]">
            Passez votre diagnostic de positionnement et planifiez votre appel.
          </h2>

          <p className="text-base sm:text-lg text-[#4F4F4F] leading-relaxed">
            Accédez à notre espace dédié en dehors de l’accueil pour renseigner votre situation
            (site internet, âge, objectif, organique, Ads) et choisir directement l’horaire de
            votre appel téléphonique.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => openDiagnosticPage()}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#021B3A] hover:bg-[#0A2C58] text-white text-[15px] font-semibold px-8 py-4 shadow-[0_14px_34px_rgba(2,27,58,0.18)] transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#7FE0EE]" />
              <span>Accéder au test & prendre RDV</span>
              <ArrowRight className="w-4 h-4 text-[#7FE0EE] transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </EditorialReveal>
      </section>
    </div>
  );
};
