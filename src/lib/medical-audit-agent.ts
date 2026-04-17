import checklist from '../data/home_audit_checklist.json';
import hospitals from '../data/military_hospitals.json';

export class MedicalAuditAgent {
  /**
   * THE ULTIMATE AUDITOR (Dynamic Data-Driven Engine)
   * This engine processes THE ENTIRE home_audit_checklist.json automatically.
   */
  performComprehensiveAudit(candidateData: any) {
    const findings: any[] = [];
    let isFit = true;
    const auditStatus: any = {};

    // 1. Iterate through ALL categories defined in the checklist
    checklist.cadet_protocol_audit.categories.forEach((category: any) => {
      auditStatus[category.category_id] = { name: category.category_name, criteria: [] };

      category.criteria.forEach((criterion: any) => {
        const userValue = candidateData[criterion.id] || candidateData[criterion.parameter.toLowerCase().replace(/ /g, '_')];
        let result: any = { id: criterion.id, parameter: criterion.parameter, status: 'PASS' };

        // --- DYNAMIC LOGIC MAPPING ---

        // A. Height Check (Service Specific)
        if (criterion.id === 'BIO-001' && userValue) {
          const service = candidateData.service_branch || 'NDA_male';
          const threshold = (criterion.rejection_thresholds as any)[service]?.min_cm || 157;
          if (userValue < threshold) {
            result.status = 'FAIL';
            result.reason = `Height ${userValue}cm is below ${service} requirement of ${threshold}cm.`;
          }
        }

        // B. Chest Expansion (77/5 Rule)
        if (criterion.id === 'BIO-004' && candidateData.chest_unexpanded) {
          const unexp = candidateData.chest_unexpanded;
          const exp = candidateData.chest_expanded;
          if (unexp < 77) {
            result.status = 'FAIL';
            result.reason = `Unexpanded chest ${unexp}cm < 77cm.`;
          } else if (exp - unexp < 5) {
            result.status = 'FAIL';
            result.reason = `Expansion ${exp - unexp}cm < 5cm requirement.`;
          }
        }

        // C. Computer Vision Simulation (Inter-malleolar/Condylar)
        if (criterion.id === 'VIS-001' && userValue > 8) {
          result.status = 'FAIL';
          result.reason = `Knock Knee gap ${userValue}cm > 8cm limit.`;
        }

        // D. Surgical History (Type Based Waiting Period)
        if (criterion.id === 'QST-003' && userValue === true) {
          const weeksSince = candidateData.surgery_weeks_ago;
          const type = candidateData.surgery_type;
          // Logic from 130k text: Cardiac/Brain = Permanent. Abdominal = 24-52 weeks.
          if (type === 'Cardiac' || type === 'Brain') {
            result.status = 'PERMANENT_FAIL';
            result.reason = `${type} surgery is a permanent disqualification.`;
          } else if (weeksSince < 24) {
            result.status = 'TEMP_FAIL';
            result.reason = `Surgery recovery period (${weeksSince} weeks) is less than the mandatory 24 weeks.`;
          }
        }

        // E. Critical History (Epilepsy/Implants)
        if (criterion.severity === 'CRITICAL' && (userValue === true || userValue === 'YES')) {
          result.status = 'FAIL';
          result.reason = `Critical Rejection: ${criterion.parameter} confirmed in history.`;
        }

        // F. Self-Tests (Hearing 610cm / BP 140/90)
        if (criterion.id === 'SAT-001' && (userValue === false || userValue === 'FAIL')) {
          result.status = 'FAIL';
          result.reason = "Failed hearing whisper test at 610cm.";
        }
        if (criterion.id === 'SAT-008' && candidateData.bp_systolic > 140) {
          result.status = 'FAIL';
          result.reason = `Hypertension: Systolic ${candidateData.bp_systolic} > 140.`;
        }

        if (result.status !== 'PASS') {
          isFit = false;
          findings.push(result);
        }
        auditStatus[category.category_id].criteria.push(result);
      });
    });

    const referral = !isFit ? this.getReferral(candidateData.service_branch) : null;

    return {
      overallStatus: isFit ? 'FIT' : 'UNFIT',
      totalViolations: findings.length,
      detailedAudit: auditStatus,
      criticalFindings: findings,
      referralHospital: referral,
      disclaimer: checklist.cadet_protocol_audit.global_logic.disclaimer
    };
  }

  private getReferral(branch: string = 'ARMY') {
    // Branch mapping to hospital registry
    const service = branch.includes('Navy') ? 'NAVY' : branch.includes('AirForce') ? 'AIR_FORCE' : 'ARMY';
    return hospitals.find(h => h.branch === service) || hospitals[0];
  }
}
