import { CandidateProfile, FitmentStatus, OrthoAssessment } from '../../types/medical';

export class OrthoEngine {
  public static validate(candidate: CandidateProfile) {
    const results: any[] = [];
    const ortho = candidate.assessment.ortho;

    results.push(...this.validateSpine(ortho));
    results.push(...this.validateLimbs(ortho, candidate.gender));
    results.push(...this.validateJoints(ortho));
    results.push(...this.validateCongenital(ortho));

    return results;
  }

  private static validateSpine(ortho: OrthoAssessment) {
    const spineLogs = [];
    if (ortho.spinal.scoliosisAngle) {
      const isLumbar = ortho.spinal.details.toLowerCase().includes('lumbar');
      const limit = isLumbar ? 10 : 15;
      const status = ortho.spinal.scoliosisAngle <= limit ? FitmentStatus.FIT : FitmentStatus.UNFIT_PERMANENT;
      spineLogs.push({
        parameter: `Scoliosis (${isLumbar ? 'Lumbar' : 'Dorsal'})`,
        value: `${ortho.spinal.scoliosisAngle} deg`,
        limit: `<= ${limit} deg`,
        status,
        reason: status === FitmentStatus.FIT ? 'Asymptomatic within limits' : `Angle exceeds the ${limit} degree limit.`,
        gazetteReference: 'Para 7(c), Navy Annexure B'
      });
    }
    return spineLogs;
  }

  private static validateLimbs(ortho: OrthoAssessment, gender: string) {
    const limbLogs = [];
    const maxCarryVal = gender === 'M' ? 15 : 20;
    const avgCarry = (ortho.limbs.carryAngleLeft + ortho.limbs.carryAngleRight) / 2;
    const carryStatus = avgCarry <= maxCarryVal ? FitmentStatus.FIT : FitmentStatus.UNFIT_PERMANENT;
    limbLogs.push({
      parameter: 'Carry Angle',
      value: `${avgCarry} deg`,
      limit: `<= ${maxCarryVal} deg`,
      status: carryStatus,
      reason: carryStatus === FitmentStatus.FIT ? 'Normal' : 'Cubitus Valgus detected.',
      gazetteReference: 'Para 7(j)'
    });
    if (ortho.limbs.interMalleolarDistance > 8) {
      limbLogs.push({
        parameter: 'Knock Knee',
        value: `${ortho.limbs.interMalleolarDistance} cm`,
        limit: '<= 8 cm',
        status: FitmentStatus.UNFIT_PERMANENT,
        reason: 'Exceeds 8cm limit.',
        gazetteReference: 'Para 5(b)'
      });
    }
    return limbLogs;
  }

  private static validateJoints(ortho: OrthoAssessment) {
    const jointLogs = [];
    if (ortho.joints.hyperlaxity) {
      jointLogs.push({
        parameter: 'Joint Hyperlaxity',
        value: 'Detected',
        status: FitmentStatus.UNFIT_PERMANENT,
        reason: 'Systemic hyper-mobility risk.',
        gazetteReference: 'Para 7(f)(i)'
      });
    }
    return jointLogs;
  }

  private static validateCongenital(ortho: OrthoAssessment) {
    const logs = [];
    if (ortho.limbs.polydactyly || ortho.limbs.syndactyly) {
      logs.push({
        parameter: 'Digital Deformities',
        value: 'Detected',
        status: FitmentStatus.MARGINAL_REFERRAL,
        reason: 'Requires SMB specialist review.',
        gazetteReference: 'Para 7(f)'
      });
    }
    return logs;
  }
}
