import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PrivacyPolicyModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Privacy Policy for Open Sauce</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Effective Date:</strong> [Insert Date]</p>
        <p>Welcome to Open Sauce ("we", "us", "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy policy or our practices with regard to your personal information, please contact us at [Insert Contact Information].</p>
        <p>This privacy policy applies to all information collected through our mobile application, "Open Sauce" (the "App"), and/or any related services, sales, marketing, or events (we refer to them collectively in this privacy policy as the "Services").</p>
        
        <h5>1. Information We Collect</h5>
        <p>We collect personal information that you voluntarily provide to us when registering on the App, expressing an interest in obtaining information about us or our products and services, when participating in activities on the App or otherwise contacting us.</p>
        <ul>
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Data Collected from QR Code Scanning: This includes the booths you visit and the stamps you collect.</li>
        </ul>
        
        <h5>2. How We Use Your Information</h5>
        <p>We use personal information collected via our App for a variety of business purposes described below:</p>
        <ul>
          <li>To Provide and Manage Our Services: We use your information to maintain your account, provide you with support, and ensure the security of our services.</li>
          <li>For Email Communications: We may use your email address to communicate with you about updates, security alerts, and account management issues.</li>
          <li>To Deliver and Facilitate Delivery of Services to the User: We may use your information to provide you with the requested service.</li>
        </ul>
        
        <h5>3. Will Your Information Be Shared With Anyone?</h5>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data on the following basis:</p>
        <ul>
          <li>Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
          <li>Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
          <li>Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
        </ul>
        
        <h5>4. How Do We Keep Your Information Safe?</h5>
        <p>We aim to protect your personal information through a system of organizational and technical security measures. We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
        
        <h5>5. Do We Use Cookies and Other Tracking Technologies?</h5>
        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.</p>
        
        <h5>6. What Are Your Privacy Rights?</h5>
        <p>You have rights with respect to your personal information, including the right to access, correct, or delete the information we hold about you.</p>
        
        <h5>7. Children's Privacy</h5>
        <p>The Services are not intended for use by children under the age of 13. We do not knowingly collect data from children under 13.</p>
        
        <h5>8. Changes to This Privacy Policy</h5>
        <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>
        
        <h5>9. How to Contact Us</h5>
        <p>If you have questions or comments about this policy, you may email us at [Insert Email Address] or by post to:
        </p>
        <p>[Insert Your Company's Name]</p>
        <p>[Insert Your Company's Address]</p>
        <p>We thank you for using Open Sauce.</p>
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
