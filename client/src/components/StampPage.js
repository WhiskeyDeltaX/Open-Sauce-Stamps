import React, { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserDataContext } from '../contexts/UserDataContext';
import { Container, Card, Button } from 'react-bootstrap';
import { getAllStamps } from '../services/MockService';
import Stamp from './Stamp';
import PrivacyPolicyModal from './PrivacyPolicyModal';

function StampsPage() {
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const stamps = getAllStamps();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Redirect to stamps page if userData is already present
  if (!userData.fullName && !userData.email) {
    console.log("Navigating stamp to /");
    return <Navigate to="/" />;
  }

  const handleDeleteData = () => {
    setUserData({ fullName: "", email: "", stamps: [] });
    navigate('/');
  }

  return (
    <Container className="p-5 stamp-container">
      <h1 className="mb-3">My Stamp Collection</h1>
      <p className="text-muted stamp-top-info">Scan the QR codes at participating exhibition booths to claim a stamp!</p>
      <div className="row stamps p-3">
        {stamps.map((stamp) => (
          <Card className="mt-5 card" key={stamp.id}>
            <Card.Body>
              <div>
                <Stamp stamp={stamp} />
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="d-flex align-items-center justify-content-center flex-column">
        <Button onClick={handleDeleteData} variant="secondary">Delete Login Data</Button>
        <Button variant="link" onClick={() => setShowPrivacyModal(true)} className="mt-3 privacy-policy">
          Read the Privacy Policy
        </Button>
      </div>
      <PrivacyPolicyModal show={showPrivacyModal}
        handleClose={() => setShowPrivacyModal(false)} />
    </Container>
  );
}

export default StampsPage;
