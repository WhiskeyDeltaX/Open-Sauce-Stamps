import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PrivacyPolicyModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Privacy Policy for Open Sauce</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div class="container">
          <h5>Effective Date</h5>
          <p>May 6th, 2024</p>

          <h5>Welcome</h5>
          <p>Welcome to the unofficial Open Sauce QR Code Hunt (the “Hunt”). The organizers of this Hunt (“we,” “us,” or “our”) are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this Privacy Policy or our practices with regard to your personal information, please contact us at <a href="mailto:help@opensauce.community">help@opensauce.community</a>.</p>
          <div class="explanation">
            <p>This section introduces the purpose of the Privacy Policy and provides contact information for any questions or concerns.</p>
          </div>

          <h5>Scope</h5>
          <p>This Privacy Policy applies to all information collected through our web application (stamps.opensauce.community; the "App") and/or any related services, sales, marketing, or events (collectively referred to as the "Services").</p>
          <div class="explanation">
            <p>This section explains where and how the Privacy Policy applies, including the web app and related services.</p>
          </div>

          <h5>Information Collection</h5>
          <p>We collect personal information that you voluntarily provide to us when registering on the App.</p>
          <ul>
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Data Collected from QR Code Scanning: This includes the booths you visit and the stamps you collect.</li>
          </ul>
          <div class="explanation">
            <p>This section lists the types of information collected from users, such as name, email, and QR code scanning data.</p>
          </div>

          <h5>Usage of Information</h5>
          <p>We use personal information collected via our App for a variety of business purposes:</p>
          <ul>
            <li>Provide and Manage Our Services: We use your information to maintain your account, provide support, and ensure security.</li>
            <li>Email Communications: We may use your email to communicate updates, security alerts, Services, and Hunt prizes.</li>
          </ul>
          <div class="explanation">
            <p>This section describes how the collected information is used, such as managing services and sending email communications.</p>
          </div>

          <h5>Information Sharing</h5>
          <p>We only share information with your consent, to comply with laws, or to fulfill obligations of the Services offered. Otherwise, your data will not be shared and will be deleted one week after Open Sauce 2024.</p>
          <div class="explanation">
            <p>This section explains when your information might be shared and assures that data will be deleted after a specific period.</p>
          </div>

          <h5>Data Security</h5>
          <p>We have implemented appropriate security measures to protect the personal information we receive through the App. No person(s), organizations, or their affiliates will have access to any of the information provided through the App.</p>
          <div class="explanation">
            <p>This section outlines the security measures taken to protect your personal information.</p>
          </div>

          <h5>Cookies and Tracking</h5>
          <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.</p>
          <div class="explanation">
            <p>This section mentions the use of cookies and other tracking technologies to store information.</p>
          </div>

          <h5>Your Privacy Rights</h5>
          <p>You have rights with respect to your personal information, including the right to access, correct, or delete the information we hold about you.</p>
          <div class="explanation">
            <p>This section informs you of your rights regarding your personal information.</p>
          </div>

          <h5>Children's Privacy</h5>
          <p>The Services are not intended for use by children under the age of 13. We do not knowingly collect data from children under 13.</p>
          <div class="explanation">
            <p>This section states that the services are not for children under 13 and that no data is knowingly collected from them.</p>
          </div>

          <h5>Policy Changes</h5>
          <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>
          <div class="explanation">
            <p>This section explains that the privacy policy may be updated and how you will know if it has been changed.</p>
          </div>

          <h5>Contact Us</h5>
          <p>If you have questions or comments about this policy, you may email us at <a href="mailto:help@opensauce.community">help@opensauce.community</a>.</p>
          <div class="explanation">
            <p>This section provides contact information for any questions or comments about the policy.</p>
          </div>

          <p>Thank you for participating in our Hunt.</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrivacyPolicyModal;
