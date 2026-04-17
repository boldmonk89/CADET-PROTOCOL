import { CandidateProfile, AuditVerdict, FitmentStatus } from '../types/medical';
import { AnthroEngine } from './engine/AnthroEngine';
import { OrthoEngine } from './engine/OrthoEngine';
import { SurgicalEngine } from './engine/SurgicalEngine';
import hospitals from '../data/military_hospitals.json';

export class MedicalAuditAgent {
  /**
   * CORE COORDINATOR: CADET PROTOCOL MEDICAL INTELLIGENCE
   * Orchestrates multi-system medical validation engines.
   */
  public async performFullAudit(candidate: CandidateProfile): Promise<AuditVerdict> {
    console.log(`[AUDIT_INIT] Starting Comprehensive Audit for: ${candidate.id}...`);

    const allFindings: any[] = [];
    const rejectionTags: string[] = [];

    // --- EXECUTION PIPELINE ---

    // 1. Anthropometric Validation
    const anthroLogs = AnthroEngine.validate(candidate);
    allFindings.push(...anthroLogs);

    // 2. Orthopaedic & Spinal Scrutiny
    const orthoLogs = OrthoEngine.validate(candidate);
    allFindings.push(...orthoLogs);

    // 3. Surgical & Trauma History Check
    const surgicalLogs = SurgicalEngine.validate(candidate);
    allFindings.push(...surgicalLogs);

    // --- AGGREGATION & DECISION LOGIC ---

    let finalStatus = FitmentStatus.FIT;

    // Check for any Permanent or Temporary rejections
    allFindings.forEach(log => {
      if (log.status === FitmentStatus.UNFIT_PERMANENT) {
        finalStatus = FitmentStatus.UNFIT_PERMANENT;
        rejectionTags.push(log.parameter);
      } else if (log.status === FitmentStatus.UNFIT_TEMPORARY && finalStatus !== FitmentStatus.UNFIT_PERMANENT) {
        finalStatus = FitmentStatus.UNFIT_TEMPORARY;
        rejectionTags.push(log.parameter);
      }
    });

    const referral = this.coordinateReferral(candidate);

    const verdict: AuditVerdict = {
      candidateId: candidate.id,
      overallStatus: finalStatus,
      rejectionTags,
      findings: allFindings,
      referral: {
        hospitalId: referral.name,
        specialistRequired: this.mappingSpecialists(allFindings),
        priority: finalStatus === FitmentStatus.UNFIT_PERMANENT ? 'ROUTINE' : 'URGENT'
      }
    };

    console.log(`[AUDIT_COMPLETE] Result: ${verdict.overallStatus} | Violations: ${verdict.rejectionTags.length}`);
    return verdict;
  }

  private coordinateReferral(candidate: CandidateProfile) {
    // Advanced Routing: Finding Branch-Specific Command Hospital
    return hospitals.find(h => h.branch === candidate.targetBranch) || hospitals[0];
  }

  private mappingSpecialists(findings: any[]) {
    const specialists = new Set<string>();
    findings.forEach(f => {
      if (f.status !== FitmentStatus.FIT) {
        if (f.parameter.includes('Height') || f.parameter.includes('Chest')) specialists.add('Anthropometry Officer');
        if (f.parameter.includes('Scoliosis') || f.parameter.includes('Knee') || f.parameter.includes('Limb')) specialists.add('Orthopaedic Surgeon');
        if (f.parameter.includes('Surgical')) specialists.add('General Surgeon');
      }
    });
    return Array.from(specialists);
  }
}
