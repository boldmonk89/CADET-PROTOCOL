import { MedicalAuditAgent } from './lib/medical-audit-agent';

const agent = new MedicalAuditAgent();

const masterCandidate = {
  name: "Karan God-Mode",
  service_branch: "AFCAT_male_flying", // Flying requirements are strict
  height: 160,          // Below 162.5 for AFCAT Flying -> FAIL
  chest_unexpanded: 76, // Below 77 -> FAIL
  chest_expanded: 79,   // Expansion 3cm < 5cm -> FAIL
  sitting_height: 98,   // Above 96 -> FAIL
  
  // Computer Vision Data
  "VIS-001": 12,        // Knock Knee 12cm > 8cm -> FAIL
  "VIS-003": 0.05,      // Flat Foot Ratio 0.05 < 0.1 -> FAIL
  
  // Medical History
  "QST-001": "YES",     // Epilepsy -> CRITICAL FAIL
  "QST-004": "YES",     // Metal Rod in-situ -> CRITICAL FAIL
  surgery_type: "Cardiac",       // Cardiac -> PERMANENT FAIL
  surgery_weeks_ago: 104,        // Even after 2 years cardiac is fail
  
  // Self Tests
  "SAT-001": "FAIL",    // Hearing 610cm -> FAIL
  bp_systolic: 160,     // BP > 140 -> FAIL
  bp_diastolic: 100
};

const report = agent.performComprehensiveAudit(masterCandidate);

console.log("🎖️ --- THE FINAL EXHAUSTIVE MILITARY AUDIT --- 🎖️\n");
console.log(`Candidate: ${masterCandidate.name} | Unit: ${masterCandidate.service_branch}`);
console.log(`STATUS: ${report.overallStatus}`);
console.log(`TOTAL REJECTIONS: ${report.totalViolations}`);
console.log("\n--- THE AUDIT LOG (PER AFMS 2024-25 GAZETTE) ---");
report.criticalFindings.forEach((log: any, i: number) => {
  console.log(`${i+1}. [${log.parameter}] ${log.status} -> ${log.reason}`);
});
if (report.referralHospital) {
  console.log("\n🏥 REFERRAL FOR APPEAL (AMB):");
  console.log(`${report.referralHospital.name}`);
  console.log(`${report.referralHospital.address}`);
}
console.log("\n⚠️ DISCLAIMER:");
console.log(report.disclaimer);
