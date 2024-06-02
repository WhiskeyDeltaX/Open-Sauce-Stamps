import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import BoothModal from './BoothModal';
import stampImage from "../no_collected_stamp.png"

function Stamp({ userData, stamp }) {
  const [modalShow, setModalShow] = useState(false);

  const unlocked = userData.stamps && userData.stamps[stamp.uuid];

  let stampUrl = `https://stamps.opensauce.community/staticapi/stamp-icons/${stamp.uuid}.jpg`;

  if (!unlocked) {
    stampUrl = stampImage;
  }

  return (
    <div className="stamp">
      <div className="stamp-body">
        <div className="stamp-img" style={{ cursor: 'pointer' }}>
          <img src={stampUrl} alt="Exhibit"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', opacity: unlocked ? "1.0" : "0.4" }} />
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
        <Button onClick={() => setModalShow(true)} variant="secondary" className="flex-grow-1" style={{ maxWidth: "300px" }}>
          More Information
        </Button>
      </div>
      {modalShow && <BoothModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        stamp={stamp}
      />}
    </div>
  );
}

export default Stamp;
