import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserDataContext } from '../contexts/UserDataContext';
import { Container, Card, Button } from 'react-bootstrap';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import LoadingSpinner from './LoadingSpinner';
import StampsService from '../services/StampsService';
import Stamp from './Stamp';
import { getAllStamps } from '../services/MockService';

function StampsPage() {
  const _stamps = localStorage.getItem('Stamps') || null;

  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [stamps, setStamps] = useState(_stamps ? JSON.parse(_stamps) : []);
  const [isLoading, setIsLoading] = useState(_stamps ? false : true);
  const [error, setError] = useState(null);

  const fetchStamps = async () => {
    if (!_stamps) {
      setIsLoading(true);
    }

    setError(null);

    try {
      let data = await StampsService.getStamps();

      if (!Array.isArray(data)) {
        data = getAllStamps();
      }

      localStorage.setItem('Stamps', JSON.stringify(data));
      setStamps(data);
    } catch (error) {
      setError('Failed to fetch stamps.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStamps();
  }, []);

  console.log("Stamps?", stamps);

  // Redirect to stamps page if userData is already present
  if (!userData.fullName && !userData.email) {
    console.log("Navigating stamp to /");
    return <Navigate to="/" />;
  }

  const handleDeleteData = () => {
    setUserData({ fullName: "", email: "", stamps: [] });
    navigate('/');
  }

  if (isLoading) {
    return (<LoadingSpinner />);
  }

  return (
    <Container className="p-5 stamp-container">
      <h1 className="mb-3">My Stamp Collection</h1>
      <p className="text-muted stamp-top-info">Scan the QR codes at participating exhibition booths to claim a stamp!</p>
      <div className="row stamps p-3">
        {stamps.map((stamp) => (
          <Card className="mt-5 card" key={stamp.uuid}>
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
