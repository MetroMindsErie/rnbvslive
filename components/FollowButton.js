import React from 'react';

const FollowButton = () => {
  const handleFollow = () => {
    // Open sharing dialog or follow options
    if (navigator.share) {
      navigator.share({
        title: 'R&B Versus Live',
        text: 'Check out R&B Versus Live!',
        url: window.location.href,
      })
      .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support navigator.share
      window.open('https://twitter.com/intent/tweet?text=Check%20out%20R%26B%20Versus%20Live!&url=' + 
        encodeURIComponent(window.location.href), 
        '_blank'
      );
    }
  };

  return (
    <div className="follow-button-container">
      <button className="follow-button" onClick={handleFollow}>
        <div className="follow-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>
          </svg>
        </div>
        <span className="follow-text">Follow</span>
      </button>
    </div>
  );
};

export default FollowButton;
