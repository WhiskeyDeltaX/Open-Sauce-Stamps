import React, { useContext } from 'react';
import { useParams, useNavigate, Navigate  } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { UserDataContext } from '../contexts/UserDataContext';
import { getStampById } from '../services/MockService';

function BoothPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stamp = getStampById(id);
  const { userData } = useContext(UserDataContext);

  // Redirect to stamps page if userData is already present
  if (!userData.fullName && !userData.email) {
    return <Navigate to="/" />;
  }
  
  if (!stamp) {
    return <Container className="mt-4">Exhibit not found.</Container>;
  }

  // Function to handle back navigation
  const handleBackClick = () => {
    navigate('/stamps'); // Navigate to the Stamps Page
  };

  return (
    <Container className="mt-4 booth-container">
      <Card className="card">
        <Card.Body className="card-body">
          <Card.Title>{stamp.exhibitName}</Card.Title>
          <Card.Text className="text-muted">by {stamp.maker}</Card.Text>
          <div className="responsive-iframe-container">
            <div className="responsive-iframe mb-4">
              <iframe src={stamp.youtubeLink} allowFullScreen title={stamp.exhibitName} ></iframe>
            </div>
          </div>
          <Card.Text>{stamp.channelName}</Card.Text>
          <Card.Subtitle className="mb-2 text description-title">Description</Card.Subtitle>
          <Card.Text className="text">{stamp.description}</Card.Text>
          <div className="buttons">
            <Button onClick={handleBackClick} variant="secondary">Back to Stamps</Button>
            <Button variant="primary" href={`https://www.youtube.com/channel/${stamp.channelName}`} target="_blank">Learn More</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BoothPage;
