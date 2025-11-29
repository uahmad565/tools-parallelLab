import './PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 10, 2024</p>

        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Parallel Lab Tools. We are committed to protecting your privacy and ensuring 
            transparency about how we handle your data. This Privacy Policy explains our practices 
            regarding the collection, use, and disclosure of information.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Data We Do NOT Collect</h2>
          <p>
            Parallel Lab Tools is built with privacy as a core principle. We want to be clear about what 
            we DO NOT do:
          </p>
          <ul>
            <li><strong>We do NOT store your uploaded files</strong> - Files are processed in real-time and immediately deleted</li>
            <li><strong>We do NOT store generated schemas</strong> - All output is sent directly to your browser</li>
            <li><strong>We do NOT require user registration</strong> - No accounts, no login, no passwords</li>
            <li><strong>We do NOT track individual users</strong> - No cookies, no fingerprinting, no personal data</li>
            <li><strong>We do NOT share data with third parties</strong> - Your data stays between you and our server</li>
            <li><strong>We do NOT use analytics tracking</strong> - No Google Analytics, no user behavior tracking</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. How We Process Your Data</h2>
          <p>When you use our CSV to C# Schema Generator:</p>
          <ol>
            <li><strong>Upload</strong>: Your CSV file is uploaded to our server via HTTPS</li>
            <li><strong>Processing</strong>: The file is analyzed in real-time using streaming (never fully loaded into memory)</li>
            <li><strong>Generation</strong>: C# schema is generated and sent back to your browser</li>
            <li><strong>Deletion</strong>: The uploaded file is immediately deleted from our server</li>
          </ol>
          <p className="highlight">
            <strong>⏱️ Typical lifecycle: 2-5 seconds</strong> - Your file exists on our server only during processing.
          </p>
        </section>

        <section className="privacy-section">
          <h2>4. Technical Details</h2>
          <h3>Temporary Storage</h3>
          <p>
            Files are temporarily stored in server memory during processing only. No permanent 
            storage is used. Files are automatically deleted when:
          </p>
          <ul>
            <li>Processing completes successfully</li>
            <li>An error occurs during processing</li>
            <li>The request is cancelled</li>
            <li>The connection is lost</li>
          </ul>

          <h3>Data Transmission</h3>
          <p>
            All data transmission between your browser and our server uses standard HTTPS encryption.
            SignalR connections use WebSocket with TLS when available, falling back to secure long polling.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. Server Logs</h2>
          <p>
            Our server maintains minimal technical logs for debugging and performance monitoring:
          </p>
          <ul>
            <li>Timestamp of requests</li>
            <li>File size (not content)</li>
            <li>Processing time</li>
            <li>Error messages (if any)</li>
          </ul>
          <p>
            These logs do NOT contain your file contents, generated schemas, or any personal information. 
            Logs are automatically purged after 7 days.
          </p>
        </section>

        <section className="privacy-section">
          <h2>6. Your Rights</h2>
          <p>Since we don't collect or store personal data, there's nothing to delete, access, or modify. 
          You are in complete control:</p>
          <ul>
            <li><strong>No account needed</strong> - Use tools anonymously</li>
            <li><strong>No data retention</strong> - Nothing to request deletion of</li>
            <li><strong>Complete privacy</strong> - Your files never leave temporary processing</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>7. Cookies and Tracking</h2>
          <p>
            Parallel Lab Tools does NOT use cookies for tracking. The only technical cookies used are:
          </p>
          <ul>
            <li><strong>Session cookies</strong> - For SignalR WebSocket connections (automatically deleted when you close the browser)</li>
          </ul>
          <p>We do not use cookies for advertising, analytics, or user tracking.</p>
        </section>

        <section className="privacy-section">
          <h2>8. Third-Party Services</h2>
          <p>
            Parallel Lab Tools is self-hosted and does not rely on third-party services for:
          </p>
          <ul>
            <li>Analytics (we don't track you)</li>
            <li>CDNs (assets served directly)</li>
            <li>Cloud storage (no file storage)</li>
            <li>External APIs (processing is local)</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>9. Data Security</h2>
          <p>We implement industry-standard security measures:</p>
          <ul>
            <li><strong>HTTPS/TLS encryption</strong> - All communications are encrypted</li>
            <li><strong>Secure WebSocket</strong> - SignalR uses encrypted connections</li>
            <li><strong>No data persistence</strong> - Files deleted immediately after processing</li>
            <li><strong>Input validation</strong> - File type and size validation</li>
            <li><strong>Docker isolation</strong> - Backend runs in isolated containers</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>10. Children's Privacy</h2>
          <p>
            Parallel Lab Tools is designed for professional software developers. We do not knowingly 
            collect information from anyone under the age of 13. If you believe we have inadvertently 
            collected such information, please contact us immediately.
          </p>
        </section>

        <section className="privacy-section">
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page 
            with an updated "Last Updated" date. Continued use of Parallel Lab Tools after changes constitutes 
            acceptance of the updated policy.
          </p>
        </section>

        <section className="privacy-section">
          <h2>12. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our privacy practices, 
            please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> <a href="mailto:privacy@devtoolsmith.dev">privacy@devtoolsmith.dev</a></p>
            <p><strong>Support:</strong> <a href="mailto:support@devtoolsmith.dev">support@devtoolsmith.dev</a></p>
          </div>
        </section>

        <div className="privacy-summary">
          <h3>🔒 In Summary</h3>
          <p>
            <strong>Your privacy is paramount.</strong> We process your files in real-time, generate schemas, 
            and immediately delete everything. No storage, no tracking, no data collection. What happens 
            in Parallel Lab Tools, stays in Parallel Lab Tools - for about 2 seconds, then it's gone forever.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;


