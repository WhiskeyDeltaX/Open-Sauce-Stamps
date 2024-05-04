import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserDataContext } from '../contexts/UserDataContext';
import { Container, Form, Button, Card } from 'react-bootstrap';
import banner from '../os-banner.jpg';
import PrivacyPolicyModal from './PrivacyPolicyModal';

function LoginPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Redirect to stamps page if userData is already present
  if (userData.fullName || userData.email) {
    console.log("Navigating / to stamps")
    return <Navigate to="/stamps" />;
  }

  const handleLogin = () => {
    setUserData({ fullName, email, stamps: [] });
    navigate('/stamps');
  };

  return (
    <div className="login-page">
      <Container className="p-5 login-container">
        <Card className="mt-5">
          <Card.Body>
            <h1 className="mb-3">Open Sauce '24 Stamp Hunt</h1>
            <p className="mb-4 text-muted">
              This app will help you keep track of the QR codes you've scanned for the Open Sauce 2024 Stamp Hunt.
            </p>
            <Form className="login-form">
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              <p className="text-muted mb-4">
                Digital prizes will be distributed via email.
              </p>
              <Button variant="primary" onClick={handleLogin} disabled={!email || !fullName}>
                Get Started
              </Button>
            </Form>
            <p className="mt-4">
              <Button variant="link" onClick={() => setShowPrivacyModal(true)} className="mt-3 privacy-policy">
                Read the Privacy Policy
              </Button>
            </p>
            <div className="d-flex align-items-center justify-content-center">
              <p className="mt-4 text-muted" style={{ maxWidth: "400px" }}>
                Open Sauce is a registered trademark of William Osman, we think. This stamp hunt is an exhibitor-created activity and is not partnered with Open Sauce.
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <p className="mt-4 text-muted" style={{ maxWidth: "400px" }}>
                Programmed by WhiskeyDelta
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <img src={banner} alt="Decorative" className="bottom-image" />
      <PrivacyPolicyModal show={showPrivacyModal}
        handleClose={() => setShowPrivacyModal(false)} />
    </div >
  );
}

export default LoginPage;
