import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  PhoneCall,
  Calendar,
  Trash2,
  Database,
  Globe,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StrydeLogo } from "../components/StrydeLogo";
import { useDiagnosticBooking } from "../context/DiagnosticBookingContext";
import {
  listAllBackendDossiers,
  deleteBackendDossier,
  StoredLeadDossier,
} from "../backend/diagnosticBackend";

export const AdminBackendPage: React.FC = () => {
  const { returnHome, openDiagnosticPage } = useDiagnosticBooking();
  const [dossiers, setDossiers] = useState<StoredLeadDossier[]>(() => listAllBackendDossiers());

  const handleDelete = (id: string) => {
    const updated = deleteBackendDossier(id);
    setDossiers(updated);
  };

  const handleExportCsv = () => {
    const headers = [
      "ID Dossier",
      "Statut",
      "Nom",
      "Email",
      "Telephone",
      "Date Appel",
      "Heure Appel",
      "Profil",
      "Age",
      "Site Internet",
      "Plateforme",
      "Audience",
      "Objectif",
      "Organique",
      "Ads",
      "Score Global",
      "Programme Recommande",
    ];
    const rows = dossiers.map((d) => [
      d.id,
      d.status === "call_booked" ? "Appel confirme" : "Diagnostic seul",
      d.booking?.fullName ?? "-",
      d.booking?.email ?? "-",
      d.booking ? `${d.booking.countryCode} ${d.booking.phone}` : "-",
      d.booking?.selectedDateLabel ?? "-",
      d.booking?.selectedTime ?? "-",
      d.answers.profileType,
      d.analysis.displayAge,
      d.analysis.displaySite,
      d.answers.primaryPlatform,
      d.answers.audienceSize,
      d.answers.mainObjective,
      d.answers.organicMaturity,
      d.answers.adsMaturity,
      `${d.analysis.globalScore}/100`,
      d.analysis.recommendedProgram,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "Stryde-Dossiers-Positionnement.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bookedCount = dossiers.filter((d) => d.status === "call_booked").length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#191919] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#021B3A] text-white border-b border-white/10">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => returnHome()}
              className="cursor-pointer focus:outline-none"
            >
              <StrydeLogo layout="horizontal" theme="light" />
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono-data text-xs text-[#7FE0EE]">
              <Database className="w-3.5 h-3.5" />
              Back-Office • Tests & Appels
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {dossiers.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#7FE0EE]" />
                <span>Exporter CSV</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => returnHome()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#021B3A] text-xs font-semibold px-4 py-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour au site</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1240px] w-full mx-auto py-12 px-5 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#358298]">
              Administration Stryde
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#191919] mt-1">
              Dossiers de positionnement & rendez-vous
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white border border-[#E5E2DC] px-4 py-2.5 text-xs">
              <span className="text-[#5C5C5C]">Tests complétés : </span>
              <strong className="font-mono-data text-[#021B3A]">{dossiers.length}</strong>
            </div>
            <div className="rounded-2xl bg-white border border-[#E5E2DC] px-4 py-2.5 text-xs">
              <span className="text-[#5C5C5C]">Appels planifiés : </span>
              <strong className="font-mono-data text-[#358298]">{bookedCount}</strong>
            </div>
          </div>
        </div>

        {dossiers.length === 0 ? (
          <div className="rounded-[28px] bg-white border border-[#E5E2DC] p-12 text-center space-y-4">
            <p className="font-editorial text-2xl text-[#191919]">
              Aucun test de positionnement enregistré pour le moment.
            </p>
            <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">
              Dès qu'un visiteur complète le diagnostic sur le portail dédié, ses réponses et son
              créneau d'appel s'affichent automatiquement ici.
            </p>
            <button
              type="button"
              onClick={() => openDiagnosticPage(1)}
              className="inline-flex items-center gap-2 rounded-full bg-[#021B3A] text-white text-sm font-semibold px-6 py-3 cursor-pointer"
            >
              Tester le parcours prospect
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {dossiers.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-[#E5E2DC] p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFECE6]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono-data text-xs font-bold text-[#021B3A] bg-[#EAF2F5] px-3 py-1 rounded-full">
                      {item.id}
                    </span>
                    {item.status === "call_booked" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Appel confirmé : {item.booking?.selectedDateLabel} à{" "}
                        {item.booking?.selectedTime}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        Diagnostic rempli (en attente de créneau)
                      </span>
                    )}
                    <span className="font-mono-data text-xs text-[#358298] font-semibold">
                      Score : {item.analysis.globalScore}/100 ({item.analysis.recommendedProgram})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label="Supprimer le dossier"
                    className="text-xs text-[#8C8C8C] hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#666666]">
                      Prospect & Contact
                    </div>
                    {item.booking ? (
                      <>
                        <div className="font-semibold text-[#191919]">{item.booking.fullName}</div>
                        <div className="text-[#4F4F4F]">{item.booking.email}</div>
                        <div className="inline-flex items-center gap-1.5 font-mono-data font-semibold text-[#021B3A]">
                          <PhoneCall className="w-3.5 h-3.5 text-[#358298]" />
                          {item.booking.countryCode} {item.booking.phone}
                        </div>
                      </>
                    ) : (
                      <div className="text-[#767676] italic">Coordonnées non finalisées</div>
                    )}
                    <div className="text-xs text-[#5C5C5C] pt-1">
                      {item.answers.profileType} • {item.analysis.displayAge}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#666666]">
                      Écosystème & Audience
                    </div>
                    <div className="inline-flex items-center gap-1.5 font-medium text-[#021B3A] break-all">
                      <Globe className="w-3.5 h-3.5 text-[#358298] shrink-0" />
                      {item.analysis.displaySite}
                    </div>
                    <div className="text-[#4F4F4F]">
                      Canal : <strong>{item.answers.primaryPlatform}</strong> (
                      {item.answers.audienceSize})
                    </div>
                    <div className="text-xs text-[#5C5C5C]">
                      Organique : {item.answers.organicMaturity}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#666666]">
                      Objectif & Ads
                    </div>
                    <div className="font-semibold text-[#191919]">{item.answers.mainObjective}</div>
                    <div className="text-xs text-[#4F4F4F]">Ads : {item.answers.adsMaturity}</div>
                    {item.booking && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#358298] pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        RDV : {item.booking.selectedDateLabel} • {item.booking.selectedTime}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
