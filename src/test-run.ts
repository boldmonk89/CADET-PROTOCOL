import { MedicalAuditAgent } from './lib/medical-audit-agent.ts';

const agent = new MedicalAuditAgent();

console.log('--- CADET PROTOCOL: SYSTEM DRY RUN (ALPHA-01) ---');
console.log('Candidate: Aditya | Age: 19 | Gender: MALE | Scheme: NDA\n');

// 1. Simulating Carry Angle (High Angle Test)
const shoulder = { x: 10, y: 50, z: 0 };
const elbow = { x: 10, y: 30, z: 0 };
const wrist = { x: 5, y: 15, z: 0 }; // Deliberate wide angle
const carryResult = agent.evaluateCarryAngle(shoulder, elbow, wrist, 'MALE');

console.log(`[ORTHO] Carry Angle: ${carryResult.angle}°`);
console.log(`STATUS: ${carryResult.status.toUpperCase()} | NOTE: ${carryResult.note}\n`);

// 2. Simulating BMI/Weight Check (Overweight Test)
const weightResult = agent.evaluateWeight(170, 82, 'age_18_20');
console.log(`[ANTHRO] Weight Check: 82kg at 170cm (Age 18-20)`);
console.log(`STATUS: ${weightResult.status.toUpperCase()} | IDEAL RANGE: ${weightResult.range[0]}-${weightResult.range[1]}kg\n`);

// 3. Simulating Vision Check (Pilot Entry Test)
const visionResult = agent.evaluateVision(-1.5, 0.5, 'IAF_FLYING');
console.log(`[VISION] Pilot Entry Check (Myopia: -1.5D)`);
console.log(`STATUS: ${visionResult.status.toUpperCase()} | NOTE: ${visionResult.note}\n`);

// 4. Final System Verdict
const isFit = carryResult.status === 'Fit' && weightResult.status === 'Fit' && visionResult.status === 'Fit';
console.log('------------------------------------------------');
console.log(`FINAL CADET PROTOCOL VERDICT: ${isFit ? 'FIT' : 'UNFIT / REJECTION LIKELY'}`);
console.log('------------------------------------------------');
