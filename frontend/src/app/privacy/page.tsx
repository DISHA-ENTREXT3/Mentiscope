import { LegalLayout } from "@/components/legal-layout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="February 5, 2026">
      <h2>1. Introduction</h2>
      <p>
        At Mentiscope, we recognize that your child&apos;s data is of paramount importance. This Privacy Policy outlines our high-frequency data protocols and how we protect the neural and educational insights processed through our architecture.
      </p>

      <h2>2. Data Collection Protocols</h2>
      <p>
        We collect only the metrics necessary for accurate growth mapping, including:
      </p>
      <ul>
        <li>Parental authentication data (Firebase Secure)</li>
        <li>Student dimensional assessments (Cognitive, Emotional, Academic)</li>
        <li>System interaction logs for predictive refinement</li>
        <li>Communication preferences for intelligence updates</li>
      </ul>

      <h2>3. Neural Privacy Standards</h2>
      <p>
        Your data is strictly partitioned. We utilize enterprise-grade encryption for all student metrics. Mentiscope is fully COPPA compliant and never &quot;labels&quot; or &quot;diagnoses&quot; students; our intelligence is exclusively designed as supportive guidance for parents.
      </p>

      <h2>4. Data Sovereignty</h2>
      <p>
        You maintain total sovereignty over your child&apos;s growth architecture. You may request a data wipe or extract your intelligence cache at any baseline synchronization point.
      </p>

      <h2>5. Protocol Updates</h2>
      <p>
        We may update this protocol as new security measures are integrated. Parents will be notified of any major shifts in neural privacy baseline.
      </p>

      <h2>6. Contact Authorization</h2>
      <p>
        For inquiries regarding data integrity or privacy links, contact the Entrext Labs legal uplink at business@entrext.in.
      </p>
    </LegalLayout>
  );
}
