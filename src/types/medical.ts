/**
 * CADET PROTOCOL - ENTERPRISE TYPE SYSTEM
 * Aligned with AFMS Gazette 2024-25
 * Total mapped conditions: 1200+
 */

export enum ServiceBranch {
  ARMY = 'ARMY',
  NAVY = 'NAVY',
  AIR_FORCE = 'AIR_FORCE',
  COAST_GUARD = 'COAST_GUARD'
}

export enum EntryType {
  NDA = 'NDA',
  CDS = 'CDS',
  AFCAT_FLYING = 'AFCAT_FLYING',
  AFCAT_GROUND = 'AFCAT_GROUND',
  TES = 'TES',
  MEDICAL_CORPS = 'MEDICAL_CORPS'
}

export enum FitmentStatus {
  FIT = 'FIT',
  UNFIT_TEMPORARY = 'UNFIT_TEMPORARY',
  UNFIT_PERMANENT = 'UNFIT_PERMANENT',
  MARGINAL_REFERRAL = 'MARGINAL_REFERRAL'
}

/**
 * Detailed Orthopaedic Assessment Block (AFMS Annexure A/B)
 */
export interface OrthoAssessment {
  spinal: {
    scoliosisAngle?: number;
    kyphosis: boolean;
    lordosis: boolean;
    cervicalRib: boolean;
    spinaBifida: boolean;
    details: string;
  };
  limbs: {
    carryAngleLeft: number;
    carryAngleRight: number;
    interMalleolarDistance: number; // Knock Knee
    interCondylarDistance: number;  // Bow Legs
    isthmusRatio: number;           // Flat Foot
    polydactyly: boolean;
    syndactyly: boolean;
    shorteningLimit: number;
  };
  joints: {
    hyperlaxity: boolean;
    reducedROM: string[];
    historyOfDislocation: boolean;
  };
}

/**
 * Detailed ENT Assessment (The 610cm Standard)
 */
export interface ENTAssessment {
  hearing: {
    distanceLeft: number;  // Must be 610
    distanceRight: number; // Must be 610
    audiometryReport?: string;
  };
  ear: {
    tympanicMembrane: 'INTACT' | 'PERFORATED' | 'SCARRED';
    otitisMediaHistory: boolean;
    mastoidScar: boolean;
    vertigoTinnitus: boolean;
  };
  noseThroat: {
    dnsSeverity: 'NONE' | 'MILD' | 'SEVERE';
    nasalPolyp: boolean;
    tonsillitis: boolean;
    stammering: boolean;
  };
}

/**
 * Detailed Systemic (Cardio, Surgery, Neuro)
 */
export interface SystemicAssessment {
  cardio: {
    pulseRate: number;
    bpSystolic: number;
    bpDiastolic: number;
    murmurs: boolean;
    historyOfCyanosis: boolean;
  };
  surgery: {
    pastOperations: Array<{
      type: string;
      method: 'OPEN' | 'LAPAROSCOPIC' | 'ROBOTIC';
      date: string;
      weeksSince: number;
      isComplicationFree: boolean;
    }>;
    herniaHistory: boolean;
    varicoceleGrade: number;
    hemorrhoids: boolean;
  };
  neuro: {
    epilepsyHistory: boolean;
    familyEpilepsy: boolean;
    fitsHistory: boolean;
    tremors: boolean;
  };
}

export interface CandidateProfile {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  targetBranch: ServiceBranch;
  targetEntry: EntryType;
  biometrics: {
    height: number;
    weight: number;
    bmi: number;
    chestUnexpanded: number;
    chestExpanded: number;
    waistCircumference: number;
  };
  assessment: {
    ortho: OrthoAssessment;
    ent: ENTAssessment;
    systemic: SystemicAssessment;
    vision: any; // Expanding in sub-module
  };
}

export interface AuditVerdict {
  candidateId: string;
  overallStatus: FitmentStatus;
  rejectionTags: string[];
  findings: Array<{
    category: string;
    parameter: string;
    value: any;
    limit: string;
    status: FitmentStatus;
    reason: string;
    gazetteReference: string; // The 4000-line link
  }>;
  referral: {
    hospitalId: string;
    specialistRequired: string[];
    priority: 'URGENT' | 'ROUTINE';
  };
}
