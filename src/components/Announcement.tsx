import { useState } from 'react';
import { CloseIcon } from './Icons';

const STORAGE_KEY = 'brio.announcement.dismissed';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1');

  if (dismissed) return null;

  return (
    <div className="announce" role="region" aria-label="Announcement">
      <p className="announce__text">
        Free shipping on orders over <strong>KSh 3,500</strong> · Use code <strong>BRIO10</strong> for 10% off your first order
      </p>
      <button
        type="button"
        className="announce__close"
        aria-label="Dismiss announcement"
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, '1');
          setDismissed(true);
        }}
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}