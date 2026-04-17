import { MedicalAuditAgent } from './lib/medical-audit-agent';

const agent = new MedicalAuditAgent();

const mockCandidate = {
  name: "Cadet Karan",
  branch: "NAVY",
  observations: {
    "ENT": ["Hearing distance 500cm"],
    "CARDIOVASCULAR": ["Pulse Rate 35 bpm"],
    "DERMATOLOGICAL": ["Small Vitiligo patch"]
  },
  history: {
    familyHistory: {
      epilepsy: true, // Genetic rejection
      diabetes: false,
      mentalIllness: false
    },
    traumaHistory: {
      hasFractures: true,
      hasImplantInSitu: true, // ROD still inside! Permanent Unfit
      weeksAgo: 52
    }
  }
};

console.log("🎖️ --- CADET PROTOCOL: HOLISTIC MEDICAL AUDIT v2.0 --- 🎖️\n");
const report = agent.performHolisticAudit(mockCandidate);

console.log(`FINAL STATUS: ${report.finalStatus === 'FIT' ? '✅ FIT' : '❌ UNFIT'}`);
console.log("\nDETAILED AUDIT LOG:");
report.findings.forEach((f: any, i: number) => {
  console.log(`${i+1}. [${f.system}] ${f.condition} -> ${f.reason}`);
});

if (report.referralHospital) {
  console.log("\n--------------------------------------------------");
  console.log(`🏥 AMB REFERRAL: ${report.referralHospital.name}`);
  console.log(`📍 ADDRESS: ${report.referralHospital.address}`);
  console.log("--------------------------------------------------");
}
