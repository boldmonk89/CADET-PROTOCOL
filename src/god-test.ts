import { MedicalAuditAgent } from './lib/medical-audit-agent';

const agent = new MedicalAuditAgent();

const godCandidate = {
  name: 'Cadet Karan',
  branch: 'AIR_FORCE',
  entry: 'FLYING',
  biometrics: {
    chestUnexpanded: 76,  // Fails (Min 77)
    chestExpanded: 80,    // Fails expansion (4cm < 5cm)
    sittingHeight: 98.5   // Fails (Max 96)
  },
  visionBiometrics: {
    interMalleolarDistance: 9.5 // Fails (Max 8cm)
  },
  surgeries: [
    { type: 'Hernia', method: 'OPEN', weeksSince: 10 } // Fails (Needs 52 for OPEN)
  ],
  history: {
    familyHistory: { epilepsy: true }
  }
};

const report = agent.performGlobalMedicalAudit(godCandidate);

console.log("🎖️ --- CADET PROTOCOL: GOD MODE AUDIT --- 🎖️\n");
console.log(`STATUS: ${report.status}`);
console.log(`TOTAL VIOLATIONS: ${report.totalFindings}`);
console.log("------------------------------------------");
report.auditLog.forEach((log: any, i: number) => {
  console.log(`${i+1}. [${log.system}] ${log.reason}`);
});
console.log("------------------------------------------");
if (report.referralHospital) {
  console.log(`🏥 FOR APPEAL: ${report.referralHospital.name} (${report.referralHospital.location})`);
}
