// Esempio di props + state + conditional rendering in React + TypeScript.

import { useState } from 'react';
import './ProfileCard.css';

// ------------------------------------------definizione contratto
interface ProfileCardProps {
  // -------------obbligatorio
  name: string;
  role: string;
  isOnline: boolean;
  // --------------opzionale
  details?: string;
}

const ProfileCard = ({
  // ----------- destructuring
  name,
  role,
  isOnline,
  // ----------- defoult value
  details = "Nessun dettaglio disponibile"
}: ProfileCardProps) => {
  // ------------------------------------------react hook useState
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="profile-card">
      {/* -----------------------------------------classi dinamiche */}
      <div className={`status ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? '● Online' : '○ Offline'}
      </div>
      <h2 className="name">{name}</h2>
      <p className="role">{role}</p>
      {/* -------------------------------------------event handler */}
      <button className="btn" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Nascondi dettagli' : 'Mostra dettagli'}
      </button>

      {showDetails && (
        <div className="details">
          {details}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
