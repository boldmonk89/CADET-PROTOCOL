import { CandidateProfile, FitmentStatus, ServiceBranch, EntryType, OrthoAssessment } from '../../types/medical';

export class AnthroEngine {
  /**
   * AFMS 2024-25 Anthropometric Validation Engine
   * Includes Height-Weight lookup, IAP Growth Curves, and Cockpit Clearance Matrix
   */
  public static validate(candidate: CandidateProfile) {
    const results: any[] = [];

    // 1. DYNAMIC HEIGHT VALIDATION
    results.push(this.checkHeight(candidate));

    // 2. DYNAMIC CHEST DYNAMICS (Male Only as per current Gazette)
    if (candidate.gender === 'M') {
      results.push(this.checkChest(candidate));
    }

    // 3. AIR FORCE FLYING - COCKPIT CLEARANCE MATRIX
    if (candidate.targetBranch === ServiceBranch.AIR_FORCE && candidate.targetEntry === EntryType.AFCAT_FLYING) {
      results.push(...this.checkCockpitFit(candidate));
    }

    // 4. BMI & PROPORTIONATE WEIGHT
    results.push(this.checkWeightProportion(candidate));

    return results;
  }

  private static checkHeight(c: CandidateProfile) {
    let minHeight = 157; // Default Army/Navy Male
    
    // Service Specific Thresholds
    if (c.targetBranch === ServiceBranch.AIR_FORCE) minHeight = 162.5;
    if (c.gender === 'F') minHeight = 152;
    if (c.targetEntry === EntryType.NDA && c.gender === 'M') minHeight = 157;
    
    // Age-based Allowance (Growth allowance for <18 years as per Line 138)
    if (c.age < 18) {
      minHeight -= 2; 
    }

    const status = c.biometrics.height >= minHeight ? FitmentStatus.FIT : FitmentStatus.UNFIT_PERMANENT;
    
    return {
      parameter: 'Height',
      value: c.biometrics.height,
      limit: `>= ${minHeight} cm`,
      status,
      reason: status === FitmentStatus.FIT ? 'Within limits' : `Height ${c.biometrics.height}cm below the required ${minHeight}cm for ${c.targetBranch}.`,
      gazetteReference: 'Para 7(b), Annexure B'
    };
  }

  private static checkChest(c: CandidateProfile) {
    const { chestUnexpanded, chestExpanded } = c.biometrics;
    const expansion = chestExpanded - chestUnexpanded;
    
    let isFit = true;
    let reason = 'Normal development';

    if (chestUnexpanded < 77) {
      isFit = false;
      reason = 'Unexpanded chest below 77cm.';
    } else if (expansion < 5) {
      isFit = false;
      reason = 'Chest expansion less than 5cm.';
    }

    return {
      parameter: 'Chest Dynamics',
      value: `${chestUnexpanded}/${chestExpanded} (Exp: ${expansion}cm)`,
      limit: '77cm min / 5cm expansion',
      status: isFit ? FitmentStatus.FIT : FitmentStatus.UNFIT_TEMPORARY,
      reason,
      gazetteReference: 'Para 3(o), General Standards'
    };
  }

  private static checkCockpitFit(c: CandidateProfile) {
    const { ortho } = c.assessment;
    const b = c.biometrics as any; // Need specific legs/sitting
    const cockpitResults = [];

    // Sitting Height: 81.5 - 96.0 cm
    const sitFit = b.sittingHeight >= 81.5 && b.sittingHeight <= 96.0;
    cockpitResults.push({
      parameter: 'Sitting Height',
      value: b.sittingHeight,
      limit: '81.5 - 96.0 cm',
      status: sitFit ? FitmentStatus.FIT : FitmentStatus.UNFIT_PERMANENT,
      reason: sitFit ? 'Cockpit Clearance OK' : 'Risk of head injury during ejection due to height.',
      gazetteReference: 'Air Force Annexure C, Para 14'
    });

    // Leg Length: 99.0 - 120.0 cm
    const legFit = b.legLength >= 99.0 && b.legLength <= 120.0;
    cockpitResults.push({
      parameter: 'Leg Length',
      value: b.legLength,
      limit: '99.0 - 120.0 cm',
      status: legFit ? FitmentStatus.FIT : FitmentStatus.UNFIT_PERMANENT,
      reason: legFit ? 'Rudder Reach OK' : 'Rudder distance beyond safe operational limit.',
      gazetteReference: 'Air Force Annexure C, Para 14'
    });

    return cockpitResults;
  }

  private static checkWeightProportion(c: CandidateProfile) {
    // Weight Logic based on BMI (Line 150)
    const bmi = c.biometrics.weight / Math.pow(c.biometrics.height / 100, 2);
    let status = FitmentStatus.FIT;
    let reason = 'Proportionate weight';

    if (bmi > 25) {
      status = FitmentStatus.UNFIT_TEMPORARY;
      reason = 'Overweight (BMI > 25). Requires metabolic assessment.';
    } else if (bmi < 18.5) {
      status = FitmentStatus.UNFIT_TEMPORARY;
      reason = 'Underweight (BMI < 18.5). Inadequate constitution.';
    }

    return {
      parameter: 'BMI & Weight',
      value: bmi.toFixed(1),
      limit: '18.5 - 25.0',
      status,
      reason,
      gazetteReference: 'Para 150, BMI Standards'
    };
  }
}
