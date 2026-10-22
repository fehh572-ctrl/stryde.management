import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, CheckCircle2, PhoneCall, Database } from "lucide-react";
import { EditorialReveal, EDITORIAL_EASE } from "./MotionPrimitives";
import { StrydeLogo } from "./StrydeLogo";
import { useDiagnosticBooking } from "../context/DiagnosticBookingContext";

const FAQ_ITEMS = [
  {
    q: "À qui s'adresse précisément l'accompagnement Stryde ?",
    a: "Stryde accompagne exclusivement les influenceurs, créateurs de contenu, infopreneurs, formateurs en ligne et dirigeants développant une marque personnelle. Que vous ayez déjà une audience établie à mieux monétiser ou une offre solide manquant de visibilité organique structurée, nous construisons le système complet qui relie l'attention à la conversion.",
  },
  {
    q: "Pourquoi demandez-vous un test de positionnement avant l'appel téléphonique ?",
    a: "Chaque créateur et infopreneur possède un point de friction différent : pour certains, les vues sont présentes mais le site ne convertit pas ; pour d'autres, l'offre est excellente mais les hooks organiques ou les Ads peinent à retenir l'attention. Vos réponses dans notre portail dédié (site internet, âge, objectif, organique, Ads) nous permettent d'auditer votre présence en amont afin que l'appel aille droit au but.",
  },
  {
    q: "Est-ce que vous dénaturez la personnalité du créateur avec vos scripts ?",
    a: "Au contraire. Une bonne stratégie éditoriale n'enferme jamais un créateur dans un texte robotique : elle clarifie sa pensée, élimine les longueurs dès les 3 premières secondes et structure l'argumentation autour de ses vraies convictions et de son vocabulaire naturel.",
  },
  {
    q: "Intervenez-vous uniquement sur l'organique ou aussi sur les publicités (Ads) ?",
    a: "Nous opérons sur les deux leviers en synergie. L'organique nous sert de laboratoire créatif pour identifier les angles, sujets et accroches qui génèrent naturellement le plus d'engagement. Nous amplifions ensuite ces contenus validés en acquisition payante (Meta, YouTube, TikTok) vers votre tunnel de conversion.",
  },
  {
    q: "Comment se déroule l'appel de découverte une fois le test rempli ?",
    a: "Il s'agit d'un appel téléphonique direct de 30 minutes à l'horaire que vous sélectionnez à la fin du diagnostic. Nous passons en revue votre positionnement actuel, les opportunités immédiates sur votre contenu et votre tunnel, puis nous vous présentons en toute transparence le format d'accompagnement pertinent si nous pouvons réellement accélérer vos résultats.",
  },
];

export const FaqAndFooter: React.FC = () => {
  const { openDiagnosticPage, openAdminBackend } = useDiagnosticBooking();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <>
      {/* =====================================================================
          EDITORIAL NEWSLETTER BAND (WEALTHSIMPLE TLDR CADENCE)
          ===================================================================== */}
      <section className="bg-white border-t border-[#ECEAE3] py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-[1160px] mx-auto rounded-[32px] bg-[#EBF3F5] border border-[#D4E4EA] p-8 sm:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <EditorialReveal className="lg:col-span-7 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#358298]">
                La Note Stryde • Hebdomadaire
              </span>
              <h2 className="font-editorial text-[30px] sm:text-[40px] leading-[1.1] tracking-[-0.025em] text-[#191919]">
                Une dose hebdomadaire de stratégie de contenu, de psychologie d’audience et de
                clarté éditoriale.
              </h2>
              <p className="text-sm sm:text-base text-[#46545B]">
                Conçue pour les influenceurs et infopreneurs qui préfèrent comprendre les
                mécaniques durables plutôt que courir après chaque tendance éphémère.
              </p>
            </EditorialReveal>

            <EditorialReveal delay={0.1} className="lg:col-span-5">
              {subscribed ? (
                <div className="rounded-2xl bg-white border border-[#4FA3B8]/40 p-5 flex items-center gap-3 text-[#021B3A]">
                  <CheckCircle2 className="w-5 h-5 text-[#358298] shrink-0" />
                  <div className="text-sm font-medium">
                    Inscription confirmée. Vous recevrez notre prochaine édition stratégique mardi.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="email"
                      required
                      placeholder="Entrez votre adresse e-mail"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 rounded-full bg-white border border-[#C8DCE3] px-5 py-3.5 text-sm text-[#191919] placeholder:text-[#7E8C93] focus:outline-none focus:border-[#021B3A]"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#021B3A] hover:bg-[#092C58] text-white text-sm font-semibold px-6 py-3.5 transition-all shrink-0 cursor-pointer"
                    >
                      <span>S'inscrire</span>
                      <ArrowRight className="w-4 h-4 text-[#7FE0EE]" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#5B6B73] pl-2">
                    Aucun spam. Désinscription en un clic à tout moment.
                  </p>
                </form>
              )}
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FAQ ACCORDION SECTION
          ===================================================================== */}
      <section id="faq" className="bg-white pb-24 sm:pb-32 px-5 sm:px-8">
        <div className="max-w-[860px] mx-auto">
          <EditorialReveal className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#358298]">
              Questions fréquentes
            </span>
            <h2 className="font-editorial text-[34px] sm:text-[44px] leading-[1.08] tracking-[-0.025em] text-[#191919] mt-2">
              Tout savoir avant de passer le test.
            </h2>
          </EditorialReveal>

          <div className="divide-y divide-[#E6E3DC] border-y border-[#E6E3DC]">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.q} className="py-5 sm:py-6">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-6 text-left group cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-semibold text-[#191919] group-hover:text-[#021B3A] transition-colors">
                      {item.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full border border-[#DFDDD7] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "rotate-45 bg-[#021B3A] text-white border-[#021B3A]"
                          : "text-[#191919]"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: EDITORIAL_EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3.5 pr-8 text-sm sm:text-[15px] leading-[1.68] text-[#525252]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          ARCHITECTURAL DARK NAVY FOOTER (STRYDE BRAND SIGNATURE)
          ===================================================================== */}
      <footer className="bg-[#021B3A] text-white pt-20 pb-14 px-5 sm:px-8">
        <div className="max-w-[1240px] mx-auto">
          {/* Pre-Footer Callout Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-16 border-b border-white/12">
            <div className="space-y-2 max-w-[600px]">
              <h3 className="font-editorial text-3xl sm:text-4xl text-white">
                Prêt à structurer votre prochain palier ?
              </h3>
              <p className="text-sm sm:text-base text-white/75">
                Complétez votre test de positionnement sur notre portail dédié puis choisissez
                directement votre créneau d’appel téléphonique.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openDiagnosticPage()}
              className="inline-flex items-center gap-2.5 self-start md:self-auto rounded-full bg-[#7FE0EE] hover:bg-white text-[#021B3A] text-sm font-bold px-7 py-4 transition-all cursor-pointer shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Passer le test & Prendre RDV</span>
            </button>
          </div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 py-14 border-b border-white/12">
            <div className="lg:col-span-4 space-y-5">
              <StrydeLogo layout="stacked" theme="light" className="items-start" />
              <p className="text-sm text-white/70 leading-relaxed max-w-[300px]">
                Agence de stratégie de contenu, de positionnement et d’acquisition dédiée aux
                influenceurs et infopreneurs francophones.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7FE0EE]">
                Ce que nous proposons
              </div>
              <ul className="space-y-2.5 text-sm text-white/80">
                <li>
                  <a href="#organique" className="hover:text-white transition-colors">
                    Stryde Organique & Scripts
                  </a>
                </li>
                <li>
                  <a href="#infopreneuriat" className="hover:text-white transition-colors">
                    Stryde Infopreneuriat & Tunnels
                  </a>
                </li>
                <li>
                  <a href="#summit" className="hover:text-white transition-colors">
                    Synergie Organique × Ads
                  </a>
                </li>
                <li>
                  <a href="#programmes" className="hover:text-white transition-colors">
                    Accompagnements Summit & Fondation
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7FE0EE]">
                Parcours client
              </div>
              <ul className="space-y-2.5 text-sm text-white/80">
                <li>
                  <a href="#manifeste" className="hover:text-white transition-colors">
                    Notre vision éditoriale
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openDiagnosticPage()}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Portail Test de positionnement
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openDiagnosticPage()}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Réserver un appel stratégique
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Questions fréquentes
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7FE0EE]">
                Informations & Accès
              </div>
              <ul className="space-y-2.5 text-sm text-white/80">
                <li>France • Belgique • Suisse • Canada</li>
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={() => openAdminBackend()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7FE0EE] hover:text-white transition-colors cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Espace Back-Office</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Line */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/55">
            <div>© {new Date().getFullYear()} Stryde Agency. Tous droits réservés.</div>
            <div className="max-w-[540px] sm:text-right">
              Stryde garantit une communication authentique, sans témoignages fictifs ni promesses
              de revenus standardisées. Les résultats dépendent de l’exécution conjointe.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
