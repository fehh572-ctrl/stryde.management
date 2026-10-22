export interface DiagnosticPayload {
  profileType: string;
  ageRange: string;
  exactAge: string;
  hasNoWebsite: boolean;
  websiteUrl: string;
  primaryPlatform: string;
  mainObjective: string;
  organicMaturity: string;
  audienceSize: string;
  adsMaturity: string;
}

export interface CallBookingPayload {
  selectedDateIso: string;
  selectedDateLabel: string;
  selectedTime: string;
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  notes: string;
}

export interface ComputedDiagnosticResult {
  dossierId: string;
  globalScore: number;
  axes: {
    label: string;
    score: number;
    insight: string;
  }[];
  pillarFocus: string;
  recommendedProgram: "Programme Summit" | "Programme Fondation";
  keyRecommendation: string;
  actionSteps: string[];
  displaySite: string;
  displayAge: string;
}

export interface StoredLeadDossier {
  id: string;
  createdAt: string;
  status: "diagnostic_completed" | "call_booked";
  answers: DiagnosticPayload;
  analysis: ComputedDiagnosticResult;
  booking?: CallBookingPayload;
}

const STORAGE_KEY = "stryde_backend_dossiers_v1";

function readDossiersFromStore(): StoredLeadDossier[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeDossiersToStore(items: StoredLeadDossier[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

function generateDossierId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `STR-2026-${num}`;
}

export function computeBackendDiagnostic(
  answers: DiagnosticPayload,
  existingId?: string
): ComputedDiagnosticResult {
  const hasSite = !answers.hasNoWebsite && answers.websiteUrl.trim().length > 0;

  // 1. Score Écosystème Web & Tunnel
  let ecosystemScore = hasSite ? 74 : 38;
  if (hasSite && answers.websiteUrl.includes("http")) ecosystemScore += 6;

  // 2. Score Maturité Organique
  let organicScore = 52;
  if (answers.organicMaturity.includes("rodé")) organicScore = 84;
  else if (answers.organicMaturity.includes("régulier")) organicScore = 71;
  else if (answers.organicMaturity.includes("Audience présente")) organicScore = 64;
  else organicScore = 44;

  // Audience size bonus
  if (answers.audienceSize === "200k+") organicScore = Math.min(94, organicScore + 10);
  else if (answers.audienceSize === "50k – 200k") organicScore = Math.min(92, organicScore + 6);

  // 3. Score Synergie Ads
  let adsScore = 48;
  if (answers.adsMaturity.includes("actives")) adsScore = 82;
  else if (answers.adsMaturity.includes("Prêt à transformer")) adsScore = 74;
  else if (answers.adsMaturity.includes("quelques") || answers.adsMaturity.includes("Quelques"))
    adsScore = 58;
  else adsScore = 45;

  // 4. Score Clarté Positionnement
  let positioningScore = hasSite ? 68 : 54;
  if (answers.mainObjective.includes("offre")) positioningScore = 59;
  if (answers.profileType.includes("Infopreneur") || answers.profileType.includes("Influenceur")) {
    positioningScore += 6;
  }

  const globalScore = Math.round(
    positioningScore * 0.28 + organicScore * 0.32 + ecosystemScore * 0.22 + adsScore * 0.18
  );

  const isSummitFit =
    answers.audienceSize === "50k – 200k" ||
    answers.audienceSize === "200k+" ||
    answers.adsMaturity.includes("actives") ||
    answers.organicMaturity.includes("rodé");

  const recommendedProgram: "Programme Summit" | "Programme Fondation" = isSummitFit
    ? "Programme Summit"
    : "Programme Fondation";

  let pillarFocus = "Architecture Éditoriale & Pont de Conversion";
  let keyRecommendation =
    "Structurer vos piliers sur " +
    answers.primaryPlatform +
    " autour de scripts à double intention (rétention haute + pré-qualification naturelle vers l'appel).";

  if (!hasSite) {
    pillarFocus = "Écosystème de Capture & Positionnement Signature";
    keyRecommendation =
      "Déployer une architecture web concise orientée VSL afin de transformer l'attention générée sur " +
      answers.primaryPlatform +
      " en rendez-vous qualifiés.";
  } else if (!answers.adsMaturity.includes("100 % Organique")) {
    pillarFocus = "Synergie Creative-First (Organique × Paid Media)";
    keyRecommendation =
      "Isoler vos formats organiques à plus forte rétention sur " +
      answers.primaryPlatform +
      " pour alimenter des campagnes d'acquisition à coût par appel maîtrisé.";
  } else if (answers.mainObjective.includes("offre")) {
    pillarFocus = "Repositionnement d'Offre & Mécanisme Propriétaire";
    keyRecommendation =
      "Clarifier votre angle différenciant pour aligner chaque prise de parole organique avec votre accompagnement principal.";
  }

  const actionSteps = [
    hasSite
      ? `Audit de conversion de votre page actuelle (${answers.websiteUrl.trim()}) avant l'appel.`
      : `Conception d'un tunnel sobre sans friction adapté à votre audience ${answers.primaryPlatform}.`,
    `Création d'une matrice de hooks et trames narratives sur ${answers.primaryPlatform} (${answers.audienceSize}).`,
    isSummitFit
      ? "Déploiement d'une boucle d'amplification hybride Organique × Retargeting Ads."
      : "Mise en place d'un rythme éditorial hebdomadaire tenable et orienté prise de RDV.",
  ];

  return {
    dossierId: existingId || generateDossierId(),
    globalScore,
    axes: [
      {
        label: "Positionnement & Angle",
        score: positioningScore,
        insight: "Alignement promesse éditoriale / avatar cible",
      },
      {
        label: "Rétention Organique",
        score: organicScore,
        insight: `${answers.primaryPlatform} • ${answers.audienceSize}`,
      },
      {
        label: "Tunnel & Site Internet",
        score: ecosystemScore,
        insight: hasSite ? "Site actif à optimiser" : "Architecture de capture à créer",
      },
      {
        label: "Potentiel Scale Ads",
        score: adsScore,
        insight: answers.adsMaturity,
      },
    ],
    pillarFocus,
    recommendedProgram,
    keyRecommendation,
    actionSteps,
    displaySite: hasSite ? answers.websiteUrl.trim() : "À créer / En structuration",
    displayAge: answers.exactAge
      ? `${answers.exactAge} ans (${answers.ageRange})`
      : answers.ageRange,
  };
}

/**
 * Simulated async backend endpoint: POST /api/diagnostics
 */
export async function submitDiagnosticToBackend(
  answers: DiagnosticPayload,
  existingDossierId?: string
): Promise<StoredLeadDossier> {
  await new Promise((resolve) => setTimeout(resolve, 650));

  const analysis = computeBackendDiagnostic(answers, existingDossierId);
  const all = readDossiersFromStore();
  const existingIndex = all.findIndex((d) => d.id === analysis.dossierId);

  const record: StoredLeadDossier = {
    id: analysis.dossierId,
    createdAt:
      existingIndex >= 0 ? all[existingIndex].createdAt : new Date().toISOString(),
    status: existingIndex >= 0 ? all[existingIndex].status : "diagnostic_completed",
    answers,
    analysis,
    booking: existingIndex >= 0 ? all[existingIndex].booking : undefined,
  };

  if (existingIndex >= 0) {
    all[existingIndex] = record;
  } else {
    all.unshift(record);
  }
  writeDossiersToStore(all);
  return record;
}

/**
 * Simulated async backend endpoint: POST /api/bookings
 */
export async function confirmCallBookingInBackend(
  dossierId: string,
  answers: DiagnosticPayload,
  booking: CallBookingPayload
): Promise<StoredLeadDossier> {
  await new Promise((resolve) => setTimeout(resolve, 520));

  const all = readDossiersFromStore();
  const idx = all.findIndex((d) => d.id === dossierId);
  const analysis =
    idx >= 0 ? all[idx].analysis : computeBackendDiagnostic(answers, dossierId);

  const updated: StoredLeadDossier = {
    id: analysis.dossierId,
    createdAt: idx >= 0 ? all[idx].createdAt : new Date().toISOString(),
    status: "call_booked",
    answers,
    analysis,
    booking,
  };

  if (idx >= 0) {
    all[idx] = updated;
  } else {
    all.unshift(updated);
  }
  writeDossiersToStore(all);
  return updated;
}

/**
 * Fetch booked time slots on a specific date to prevent double booking
 */
export function getBookedTimesForDate(dateIso: string, excludeDossierId?: string): string[] {
  const all = readDossiersFromStore();
  return all
    .filter(
      (d) =>
        d.status === "call_booked" &&
        d.booking?.selectedDateIso === dateIso &&
        d.id !== excludeDossierId
    )
    .map((d) => d.booking!.selectedTime);
}

/**
 * Admin Back-Office queries
 */
export function listAllBackendDossiers(): StoredLeadDossier[] {
  return readDossiersFromStore();
}

export function deleteBackendDossier(id: string): StoredLeadDossier[] {
  const next = readDossiersFromStore().filter((d) => d.id !== id);
  writeDossiersToStore(next);
  return next;
}
