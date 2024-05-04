import React, { useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserDataContext } from '../contexts/UserDataContext';
import { Container, Card, Button } from 'react-bootstrap';
import { getAllStamps } from '../services/MockService';
import Stamp from './Stamp';

function StampsPage() {
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const stamps = getAllStamps();

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
      <h2>Scan the QR codes at participating exhibition booths to claim a stamp!</h2>
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
      <div className="d-flex align-items-center justify-content-center">
        <Button onClick={handleDeleteData} variant="secondary">Delete Login Data</Button>
      </div>
    </Container>
  );
}

export default StampsPage;
