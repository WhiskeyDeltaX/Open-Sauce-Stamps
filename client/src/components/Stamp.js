import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderImg from '../placeholder-square.png';
import { Button } from 'react-bootstrap';
import BoothModal from './BoothModal';

function Stamp({ stamp }) {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  const handleImageClick = () => {
    navigate(`/booth/${stamp.id}`);
  };

  return (
    <div className="stamp">
      <div className="stamp-body">
        <div className="stamp-img" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
          <img src={placeholderImg} alt="Exhibit"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
        </div>
        <div className='stamp-no-mobile'>
          <div className="stamp-text">
              <p className="stamp-name">{stamp.exhibitName}</p>
              <p>Booth: {stamp.boothNumber}</p>
              <p>{stamp.description}</p>
          </div>
        </div>
        <div className='stamp-mobile'>
          <div className="stamp-text">
            <p className="stamp-name">{stamp.exhibitName}</p>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center w-100">
        <Button onClick={() => setModalShow(true)} variant="secondary" className="flex-grow-1" style={{maxWidth: "300px"}}>
          More Information
        </Button>
      </div>
      <BoothModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        stamp={stamp}
      />
    </div>
  );
}

export default Stamp;
