import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserDataContext } from '../contexts/UserDataContext';
import { Container, Form, Button, Card, ToggleButtonGroup, ToggleButton, Alert } from 'react-bootstrap';
import banner from '../os-banner.jpg';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { registerUser, loginUser } from '../services/UsersService';

function LoginPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Redirect to stamps page if userData is already present
  if (userData.fullName || userData.email) {
    return <Navigate to="/stamps" />;
  }

  const handleToggle = (val) => {
    setMode(val);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (mode === 'register') {
        const user = await registerUser(fullName, email);
        console.log("User registered returned:", user);
        setUserData({ fullName: user.full_name, email: user.email, stamps: [] });
      } else {
        const user = await loginUser(email);
        console.log("User returned:", user);
        setUserData({ fullName: user.full_name, email: user.email, stamps: user.stamps });
      }

      const collectStamp = localStorage.getItem('CollectStamp');
      localStorage.setItem('CollectStamp', "");

      if (collectStamp && collectStamp != "null") {
        navigate(`/collect/${collectStamp}`);
      } else {
        navigate('/stamps');
      }
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.detail) {
        const detail = error.response?.data?.detail;
        console.log("Details", detail);

        if (error.response?.status === 422) {
          setError('Invalid Name or Email');
        } else if (Array.isArray(detail)) {
          setError('An error occurred');
        } else {
          setError(detail || 'An error occurred');
        }
      } else {
        setError('Invalid Name or Email');
      }
    }
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
            <ToggleButtonGroup type="radio" name="mode" value={mode} onChange={handleToggle} className="mb-3"
                style={{width: "100%", padding: "10px 20px 10px"}}>
              <ToggleButton id="tbg-radio-1" value="login">
                Log In
              </ToggleButton>
              <ToggleButton id="tbg-radio-2" value="register">
                Register
              </ToggleButton>
            </ToggleButtonGroup>
            <Form className="login-form">
              {mode === 'register' && (
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </Form.Group>
              )}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              {error && <Alert variant="danger" style={{width: "100%"}}>{error}</Alert>}
              <p className="text-muted mb-4 mt-2">
                Digital prizes will be distributed via email.
              </p>
              <Button variant="primary" onClick={handleSubmit} disabled={!email || (mode === 'register' && !fullName)}>
                {mode === 'register' ? 'Register' : 'Log In'}
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
      <PrivacyPolicyModal show={showPrivacyModal} handleClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}

export default LoginPage;
