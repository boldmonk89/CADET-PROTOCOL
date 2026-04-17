import { AuditVerdict, FitmentStatus } from '../types/medical';

export class ReportGenerator {
  /**
   * Generates a High-Fidelity Branded Military Report (PDF/HTML ready)
   */
  public static generateBrandedReport(verdict: AuditVerdict): string {
    const timestamp = new Date().toLocaleString();
    
    return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Inter', 'Roboto', sans-serif; color: #1a1a1a; padding: 40px; }
  .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; }
  .logo { font-size: 28px; font-weight: bold; letter-spacing: 2px; color: #1e3a8a; }
  .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
               font-size: 80px; color: rgba(0,0,0,0.03); z-index: -1; white-space: nowrap; font-weight: bold; }
  .status-fit { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block; }
  .status-unfit { background: #fee2e2; color: #991b1b; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block; }
  table { width: 100%; border-collapse: collapse; margin-top: 30px; }
  th { background: #f8fafc; text-align: left; padding: 12px; border: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase; }
  td { padding: 12px; border: 1px solid #e2e8f0; font-size: 13px; }
  .signature-section { margin-top: 50px; float: right; text-align: center; width: 250px; }
  .sig-img { width: 150px; border-bottom: 1px solid #000; }
  .footer { margin-top: 100px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
</style>
</head>
<body>
  <div class="watermark">CADET PROTOCOL OFFICIAL</div>
  
  <div class="header">
    <div class="logo">CADET PROTOCOL</div>
    <div class="subtitle">AFMS MEDICAL AUDIT ENGINE | VERSION 2024.2.1</div>
    <div style="margin-top: 10px;"><strong>REPORT ID:</strong> CP-AUDIT-${verdict.candidateId}-${Date.now()}</div>
  </div>

  <div style="margin-top: 30px;">
    <h3>1. CANDIDATE & SERVICE PROFILE</h3>
    <p><strong>CANDIDATE:</strong> ${verdict.candidateId} | <strong>TIMESTAMP:</strong> ${timestamp}</p>
    <div>
      <strong>FINAL VERDICT:</strong> 
      <span class="${verdict.overallStatus === FitmentStatus.FIT ? 'status-fit' : 'status-unfit'}">
        ${verdict.overallStatus}
      </span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Found</th>
        <th>Standard</th>
        <th>Verdict</th>
        <th>Clinical Reasoning</th>
      </tr>
    </thead>
    <tbody>
      ${verdict.findings.map(f => `
        <tr>
          <td>${f.parameter}</td>
          <td>${f.value}</td>
          <td>${f.limit}</td>
          <td style="font-weight:bold; color: ${f.status === FitmentStatus.FIT ? '#166534' : '#991b1b'}">${f.status}</td>
          <td>${f.reason}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="margin-top: 40px;">
    <h3>2. COMMAND HOSPITAL REFERRAL (AMB)</h3>
    <p>In accordance with AFMS Policy, the candidate is directed to:</p>
    <div style="background: #f1f5f9; padding: 15px; border-radius: 5px;">
      <strong>CENTER:</strong> ${verdict.referral.hospitalId}<br>
      <strong>PRIORITY:</strong> ${verdict.referral.priority}<br>
      <strong>MAPPING SPECIALISTS:</strong> ${verdict.referral.specialistRequired.join(', ')}
    </div>
  </div>

  <div class="signature-section">
    <img src="https://i.ibb.co/zH7j7pP/sign.png" class="sig-img" alt="Official Signature"><br>
    <strong>SENIOR MEDICAL OFFICER</strong><br>
    <span style="font-size: 10px;">Military Board Audit Cell</span>
  </div>

  <div style="clear: both;"></div>

  <div class="footer">
    THIS DOCUMENT IS COMPUTATIONALLY GENERATED BASED ON AFMS GAZETTE 2024-25. 
    REPRODUCTION WITHOUT AUTHORIZATION IS PROHIBITED.
  </div>
</body>
</html>
`;
  }
}
