import './Marquee.css';

const Marquee = () => {
  const announcements = [
    'Welcome to our platform! Get started with our services today.',
    'New features available: Buy Data, Airtime, Electricity, and more!',
    'Special offer: Get 5% bonus on your first wallet funding.',
    'API Documentation now available for developers.',
  ];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {announcements.map((announcement, index) => (
          <span key={index} className="marquee-item">
            {announcement}
            <span className="marquee-separator">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;

