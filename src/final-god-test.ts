import { MedicalAuditAgent } from './core/MedicalAuditAgent';
import { ReportGenerator } from './services/ReportGenerator';
import { ServiceBranch, EntryType, CandidateProfile } from './types/medical';
import * as fs from 'fs';

async function run() {
  const agent = new MedicalAuditAgent();

  const candidate: CandidateProfile = {
    id: "CADET-7789",
    name: "Aditya Singh",
    age: 19,
    gender: 'M',
    targetBranch: ServiceBranch.AIR_FORCE,
    targetEntry: EntryType.AFCAT_FLYING,
    biometrics: {
      height: 161,             
      weight: 85,              
      bmi: 32.8,
      chestUnexpanded: 76,     
      chestExpanded: 78,       
      waistCircumference: 95,
      sittingHeight: 98.5,     
      legLength: 121,          
    } as any,
    assessment: {
      ortho: {
        spinal: { scoliosisAngle: 18, details: 'Lumbar' }, 
        limbs: { 
          carryAngleLeft: 18.5, 
          carryAngleRight: 18.2, 
          interMalleolarDistance: 9.5, 
          interCondylarDistance: 0,
          isthmusRatio: 0.05,
          polydactyly: false,
          syndactyly: false,
          shorteningLimit: 0
        },
        joints: { hyperlaxity: true, historyOfDislocation: false, reducedROM: [] }
      },
      ent: {
        hearing: { distanceLeft: 500, distanceRight: 500 }, 
        ear: { tympanicMembrane: 'INTACT', otitisMediaHistory: false, mastoidScar: false, vertigoTinnitus: false },
        noseThroat: { dnsSeverity: 'NONE', nasalPolyp: false, tonsillitis: false, stammering: false }
      },
      systemic: {
        cardio: { pulseRate: 35, bpSystolic: 150, bpDiastolic: 100, murmurs: false, historyOfCyanosis: false },
        neuro: { epilepsyHistory: false, familyEpilepsy: true, fitsHistory: false, tremors: false },
        surgery: {
          pastOperations: [
            { type: 'Hernia', method: 'OPEN', date: '2024-01-01', weeksSince: 12, isComplicationFree: true } 
          ],
          herniaHistory: true,
          varicoceleGrade: 3,
          hemorrhoids: false
        }
      },
      vision: {}
    }
  };

  const verdict = await agent.performFullAudit(candidate);
  const brandedHtml = ReportGenerator.generateBrandedReport(verdict);

  fs.writeFileSync('Audit_Report_Aditya.html', brandedHtml);
  console.log("✅ Branded Report Generated: Audit_Report_Aditya.html");
}

run();
