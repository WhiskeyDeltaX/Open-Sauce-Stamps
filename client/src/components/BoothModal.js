import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { UserDataContext } from '../contexts/UserDataContext';

function BoothModal({ show, onHide, stamp }) {
  const { userData } = useContext(UserDataContext);

  if (!userData.fullName && !userData.email) {
    onHide(); // Close modal if user data is not present
  }

  if (!stamp) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Exhibit Not Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>Exhibit not found.</Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Exhibit Information</Modal.Title>
      </Modal.Header>
      <Modal.Body className="booth-container p-3">
        <h2>{stamp.exhibitName}</h2>
        <h5 className="text-muted">by {stamp.maker}</h5>
        {(stamp.youtubeLink.includes("watch?") || stamp.youtubeLink.includes(".be/")) && <div className="responsive-iframe-container">
          <div className="responsive-iframe pt-3 pb-3">
            <iframe src={stamp.youtubeLink} allowFullScreen title={stamp.exhibitName}></iframe>
          </div>
        </div>}
        <p className="text-center">{stamp.channelName}</p>
        <p className="mb-2 text description-title">Description</p>
        <p className="text">{stamp.description}</p>
        <div style={{maxWidth: "200px", margin: "20px auto 0"}}>
          <img src={`https://stamps.opensauce.community/staticapi/qr-codes/${stamp.qrCode}.png`} alt="Exhibit QR Code"
              style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" href={stamp.makerWebsite} target="_blank">Visit Exhibitor Page</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BoothModal;
