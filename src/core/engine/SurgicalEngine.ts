import { CandidateProfile, FitmentStatus, SystemicAssessment } from '../../types/medical';

export class SurgicalEngine {
  public static validate(candidate: CandidateProfile) {
    const results: any[] = [];
    const surgical = candidate.assessment.systemic.surgery;

    surgical.pastOperations.forEach((op) => {
      results.push(this.validateOperation(op));
    });

    if (candidate.assessment.systemic.surgery.herniaHistory) {
      results.push({
        parameter: 'Hernia History',
        value: 'Detected',
        status: FitmentStatus.UNFIT_PERMANENT,
        reason: 'Any evidence of recurrence is rejectable.',
        gazetteReference: 'Para 5(g)'
      });
    }

    return results;
  }

  private static validateOperation(op: any) {
    let status = FitmentStatus.FIT;
    let requiredWeeks = 0;
    let permanentUnfit = false;
    let reason = 'Healed well';

    const type = op.type.toLowerCase();
    if (type.includes('ligament') || type.includes('meniscus')) {
      permanentUnfit = true;
      reason = 'Ligament/Meniscus surgery is a permanent disqualification.';
    }

    if (type.includes('hernia')) {
      requiredWeeks = 52;
    } else if (type.includes('cholecystectomy')) {
      requiredWeeks = 12;
    } else {
      requiredWeeks = op.method === 'LAPAROSCOPIC' ? 12 : 52;
    }

    if (permanentUnfit) {
      status = FitmentStatus.UNFIT_PERMANENT;
    } else if (op.weeksSince < requiredWeeks) {
      status = FitmentStatus.UNFIT_TEMPORARY;
      reason = `Insufficient recovery time. Required: ${requiredWeeks} weeks.`;
    }

    return {
      parameter: `Surgical: ${op.type}`,
      value: `${op.method} - ${op.weeksSince} wks`,
      limit: permanentUnfit ? 'PERMANENT UNFIT' : `${requiredWeeks} wks`,
      status,
      reason,
      gazetteReference: 'Para 12(c)'
    };
  }
}
