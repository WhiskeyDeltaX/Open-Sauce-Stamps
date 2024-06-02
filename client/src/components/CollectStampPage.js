// src/components/CollectStampPage.js

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { UserDataContext } from '../contexts/UserDataContext';
import { Container, Card, Button } from 'react-bootstrap';
import { collectStamp } from '../services/StampsService';

function CollectStampPage() {
  const { uuid } = useParams();
  const { userData, setUserData } = useContext(UserDataContext);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [stamp, setStamp] = useState(null);
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false);

  useEffect(() => {
    async function handleCollect() {
      try {
        const stampData = await collectStamp(userData.email, uuid);

        if (!userData.stamps || !userData.stamps[stampData.uuid]) {
          setAlreadyUnlocked(false);
          setMessage(`Congratulations on collecting a new stamp: ${stampData.exhibitName}!`);
          setUserData({
            ...userData,
            stamps: {
              ...userData.stamps,
              [stampData.uuid]: { collected: new Date().toISOString() }
            }
          });
        } else {
          setAlreadyUnlocked(true);
          setMessage('You have already claimed this stamp.');
          console.log("Stamp already unlocked.");
        }
        
        setStamp(stampData);
      } catch (error) {
        setMessage('This stamp is invalid.');
        setAlreadyUnlocked(false);
        console.error(error);
      }
    }

    handleCollect();
  }, [uuid]);

  // Redirect to stamps page if userData is already present
  if (!userData.fullName && !userData.email) {
    console.log("Navigating stamp to /");
    localStorage.setItem('CollectStamp', uuid);
    return <Navigate to="/" />;
  }

  return (
    <Container className="mt-5 stamp-collection-container">
      <Card>
        <Card.Header as="h5">{stamp ? (!alreadyUnlocked ? "New Stamp Unlocked" : "Stamp Already Collected") : "Issue With Stamp"}</Card.Header>
        <Card.Body>
          {stamp ? (
            <>
              <Card.Title className="text-center h1" style={{fontWeight: "bold"}}>{!alreadyUnlocked ? "Congratulations" : "Here it is again"}!</Card.Title>
              <div className="stamp-img text-center" style={{ cursor: 'pointer', margin: "10px auto 20px" }}>
                <img src={`https://stamps.opensauce.community/staticapi/stamp-icons/${stamp.uuid}.jpg`} alt="Exhibit"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
              </div>
              <Card.Text className="text-center h5">{stamp.exhibitName}</Card.Text>
              <Card.Subtitle className="mb-5 text-muted text-center">by {stamp.maker}</Card.Subtitle>
              <Card.Text>{message}</Card.Text>
              <Card.Text>{stamp.description}</Card.Text>
            </>
          ) : (
            <Card.Text>{message}</Card.Text>
          )}
          <div className="text-center">
            <Button variant="primary" onClick={() => navigate('/stamps')}>
              Return to Collection
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CollectStampPage;
