import "../pages/AwarenessHub.css";

import antiRagging from "../assets/cllg2.jpg";
import posh from "../assets/cllg3.jpg";
import conduct from "../assets/cllg1.jpg";
import discipline from "../assets/cllg4.jpg";


function AwarenessHub() {
  return (
    <div className="awareness">

      {/* Page Header */}
      <section className="awareness-header">
        <h1>Awareness Hub</h1>
        <p>Know your rights, safety resources, and campus policies.</p>
      </section>

      {/* Campus Policies */}
      <section className="section">
        <h2>📜 Campus Policies</h2>

        {/* Anti-Ragging Policy */}
        <div className="policy-row">
          <div className="policy-content">
            <h3>Anti-Ragging Policy</h3>
            <p>
              The institution follows a zero-tolerance policy towards ragging in
              any form, in accordance with UGC regulations and Supreme Court directives.
            </p>

            <strong>What constitutes ragging?</strong>
            <ul>
              <li>Physical or psychological harm</li>
              <li>Verbal abuse, teasing, or humiliation</li>
              <li>Forced participation in activities against one’s will</li>
              <li>Acts violating dignity or self-respect</li>
            </ul>

            <strong>Preventive Measures:</strong>
            <ul>
              <li>Anti-Ragging Committee & Squad</li>
              <li>Awareness programs and orientations</li>
              <li>Surprise checks in hostels and campus areas</li>
              <li>Mandatory affidavits from students and parents</li>
            </ul>

            <strong>Complaint & Action:</strong>
            <ul>
              <li>Confidential reporting by students</li>
              <li>Immediate inquiry</li>
              <li>Strict disciplinary action including suspension or FIR</li>
            </ul>
          </div>

          <div className="policy-image">
            <img src={antiRagging} alt="Anti Ragging Policy" />
          </div>
        </div>

        {/* POSH Policy */}
        <div className="policy-row">
          <div className="policy-content">
            <h3>Sexual Harassment Prevention Policy (POSH)</h3>
            <p>
              The institution ensures a safe and inclusive environment as per the
              Sexual Harassment of Women at Workplace Act, 2013.
            </p>

            <strong>Sexual Harassment includes:</strong>
            <ul>
              <li>Unwelcome physical contact or advances</li>
              <li>Sexually coloured remarks or jokes</li>
              <li>Showing pornographic material</li>
              <li>Unwelcome verbal or non-verbal conduct</li>
            </ul>

            <strong>Internal Complaints Committee (ICC):</strong>
            <ul>
              <li>Dedicated ICC for redressal</li>
              <li>Written or online complaint filing</li>
              <li>Strict confidentiality maintained</li>
            </ul>

            <strong>Redressal Mechanism:</strong>
            <ul>
              <li>Time-bound investigation</li>
              <li>Fair and unbiased inquiry</li>
              <li>Protection against victimization</li>
            </ul>
          </div>

          <div className="policy-image">
            <img src={posh} alt="POSH Policy" />
          </div>
        </div>

        {/* Code of Conduct */}
        <div className="policy-row">
          <div className="policy-content">
            <h3>Code of Conduct for Students & Staff</h3>
            <p>
              The Code of Conduct ensures discipline, integrity, and mutual respect
              across the campus.
            </p>

            <strong>Students are expected to:</strong>
            <ul>
              <li>Maintain academic honesty</li>
              <li>Respect faculty and peers</li>
              <li>Follow campus rules</li>
              <li>Avoid misconduct or indiscipline</li>
            </ul>

            <strong>Staff are expected to:</strong>
            <ul>
              <li>Maintain professional ethics</li>
              <li>Treat students fairly</li>
              <li>Avoid discrimination or harassment</li>
            </ul>

            <strong>Prohibited Conduct:</strong>
            <ul>
              <li>Cheating or plagiarism</li>
              <li>Substance abuse on campus</li>
              <li>Violence or harassment</li>
              <li>Misuse of institutional property</li>
            </ul>
          </div>

          <div className="policy-image">
            <img src={conduct} alt="Code of Conduct" />
          </div>
        </div>

        {/* Disciplinary Guidelines */}
        <div className="policy-row">
          <div className="policy-content">
            <h3>Disciplinary Action Guidelines</h3>
            <p>The institution ensures fair and transparent disciplinary procedures.</p>

            <strong>Possible actions include:</strong>
            <ul>
              <li>Warning or written apology</li>
              <li>Fines or community service</li>
              <li>Suspension or expulsion (for serious offenses)</li>
            </ul>

            <p>Disciplinary measures depend on the nature and severity of the misconduct.</p>
          </div>

          <div className="policy-image">
            <img src={discipline} alt="Disciplinary Guidelines" />
          </div>
        </div>

      </section>

      {/* Helpline Details */}
      <section className="section light">
        <h2>📞 Helpline & Emergency Contacts</h2>
        <div className="helplines">
          <p><strong>Campus Security:</strong> +91 98765 43210</p>
          <p><strong>Women Safety Helpline:</strong> 181</p>
          <p><strong>Police Emergency:</strong> 112</p>
          <p><strong>Student Counseling Cell:</strong> counseling@college.edu</p>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="section">
        <h2>🛡️ Safety Tips</h2>
        <ul>
          <li>Report suspicious activities immediately.</li>
          <li>Use well-lit paths while moving at night.</li>
          <li>Save emergency contacts on your phone.</li>
          <li>Do not hesitate to seek help from authorities.</li>
          <li>Support peers and promote a safe campus culture.</li>
        </ul>
      </section>

    </div>
  );
}

export default AwarenessHub;
