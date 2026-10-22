import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  PhoneCall,
  Menu,
  X,
  ArrowUpRight,
  Layers,
  Sparkles,
  Megaphone,
  Compass,
} from "lucide-react";
import { StrydeLogo } from "./StrydeLogo";
import { useDiagnosticBooking } from "../context/DiagnosticBookingContext";
import { EDITORIAL_EASE } from "./MotionPrimitives";

export const Navbar: React.FC = () => {
  const { openDiagnosticPage } = useDiagnosticBooking();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pillars = [
    {
      title: "Stryde Organique",
      desc: "Piliers éditoriaux, psychologie des hooks et rétention longue durée.",
      href: "#organique",
      icon: Layers,
      isExternalPortal: false,
    },
    {
      title: "Stryde Infopreneuriat",
      desc: "Alignement contenu → offre, VSL éducatives et tunnels sans friction.",
      href: "#infopreneuriat",
      icon: Sparkles,
      isExternalPortal: false,
    },
    {
      title: "Stryde Summit (Organique × Ads)",
      desc: "Amplification publicitaire chirurgicale de vos meilleurs contenus.",
      href: "#summit",
      icon: Megaphone,
      isExternalPortal: false,
    },
    {
      title: "Portail Test & Appel Stratégique",
      desc: "Accédez à l'espace dédié pour évaluer votre positionnement et réserver.",
      href: "#/diagnostic",
      icon: Compass,
      isExternalPortal: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Wealthsimple-style Announcement Bar */}
      <div className="bg-[#021B3A] text-white px-4 py-2.5 text-center border-b border-white/10">
        <p className="text-xs sm:text-[13px] font-medium tracking-[-0.01em] text-white/90">
          Accompagnement stratégique 2026 pour influenceurs et infopreneurs.{" "}
          <button
            type="button"
            onClick={() => openDiagnosticPage()}
            className="underline decoration-[#7FE0EE] underline-offset-4 font-semibold text-[#7FE0EE] hover:text-white transition-colors ml-1 cursor-pointer"
          >
            Passer le test & réserver un appel
          </button>
        </p>
      </div>

      {/* Main Sticky Navigation Bar */}
      <nav
        aria-label="Navigation principale"
        className="bg-white/92 backdrop-blur-md border-b border-[#EBE9E3] transition-colors"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[74px] flex items-center justify-between gap-6">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-10">
            <a href="#" className="focus:outline-none">
              <StrydeLogo layout="horizontal" theme="dark" />
            </a>

            <div className="hidden lg:flex items-center gap-7">
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 py-2 text-[15px] font-medium text-[#191919] hover:text-[#358298] transition-colors cursor-pointer"
                >
                  <span>Ce que nous proposons</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180 text-[#4FA3B8]" : "text-[#5C5C5C]"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                      className="absolute left-0 top-full pt-2 w-[540px]"
                    >
                      <div className="rounded-3xl bg-white border border-[#E5E2DC] shadow-[0_24px_60px_rgba(2,27,58,0.12)] p-4 grid grid-cols-2 gap-2">
                        {pillars.map((item) => {
                          const Icon = item.icon;
                          return item.isExternalPortal ? (
                            <button
                              key={item.title}
                              type="button"
                              onClick={() => {
                                setDropdownOpen(false);
                                openDiagnosticPage();
                              }}
                              className="group p-3.5 rounded-2xl hover:bg-[#FAF9F6] transition-colors flex items-start gap-3 text-left cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-xl bg-[#021B3A] text-[#7FE0EE] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[#191919] flex items-center gap-1">
                                  <span>{item.title}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-[#4FA3B8]" />
                                </div>
                                <p className="text-xs text-[#5C5C5C] leading-relaxed mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </button>
                          ) : (
                            <a
                              key={item.title}
                              href={item.href}
                              onClick={() => setDropdownOpen(false)}
                              className="group p-3.5 rounded-2xl hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
                            >
                              <div className="w-9 h-9 rounded-xl bg-[#021B3A] text-[#7FE0EE] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[#191919] flex items-center gap-1">
                                  <span>{item.title}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-[#4FA3B8]" />
                                </div>
                                <p className="text-xs text-[#5C5C5C] leading-relaxed mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a
                href="#manifeste"
                className="text-[15px] font-medium text-[#191919] hover:text-[#358298] transition-colors"
              >
                Notre vision
              </a>
              <a
                href="#summit"
                className="text-[15px] font-medium text-[#191919] hover:text-[#358298] transition-colors"
              >
                Méthode Summit
              </a>
              <a
                href="#programmes"
                className="text-[15px] font-medium text-[#191919] hover:text-[#358298] transition-colors"
              >
                Accompagnements
              </a>
              <a
                href="#faq"
                className="text-[15px] font-medium text-[#191919] hover:text-[#358298] transition-colors"
              >
                Questions
              </a>
            </div>
          </div>

          {/* Right: Dedicated Off-Homepage Portal Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => openDiagnosticPage()}
              className="text-sm font-semibold text-[#191919] hover:text-[#021B3A] px-4 py-2.5 rounded-full hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              Test de positionnement
            </button>

            <button
              type="button"
              onClick={() => openDiagnosticPage()}
              className="inline-flex items-center gap-2 rounded-full bg-[#021B3A] hover:bg-[#0A2C58] text-white text-sm font-semibold px-5 py-2.5 transition-all shadow-xs cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#7FE0EE]" />
              <span>Prendre RDV</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl text-[#191919] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
              className="lg:hidden overflow-hidden bg-white border-b border-[#EBE9E3] px-5 pb-6 pt-2 space-y-4"
            >
              <div className="space-y-1">
                {pillars
                  .filter((p) => !p.isExternalPortal)
                  .map((p) => (
                    <a
                      key={p.title}
                      href={p.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 text-base font-medium text-[#191919] border-b border-[#F3F0EA]"
                    >
                      {p.title}
                    </a>
                  ))}
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-base font-medium text-[#191919]"
                >
                  Questions fréquentes
                </a>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openDiagnosticPage();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#021B3A] text-white text-sm font-semibold py-3.5 px-6 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#7FE0EE]" />
                  <span>Passer le test & Prendre RDV (Appel)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
