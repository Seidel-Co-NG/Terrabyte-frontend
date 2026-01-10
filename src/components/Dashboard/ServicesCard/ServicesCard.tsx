import { 
  FiDatabase,
  FiPhone,
  FiZap,
  FiTv,
  FiMessageSquare,
  FiGift,
  FiKey,
  FiRefreshCw
} from 'react-icons/fi';
import './ServicesCard.css';

interface Service {
  name: string;
  icon: React.ReactNode;
  link: string;
}

const ServicesCard = () => {
  const services: Service[] = [
    { name: 'Buy Data', icon: <FiDatabase />, link: '/services/buy-data' },
    { name: 'Buy Airtime', icon: <FiPhone />, link: '/services/buy-airtime' },
    { name: 'Buy Electricity', icon: <FiZap />, link: '/services/buy-electricity' },
    { name: 'Buy Cable TV', icon: <FiTv />, link: '/services/buy-cable-tv' },
    { name: 'Bulk SMS', icon: <FiMessageSquare />, link: '/services/bulk-sms' },
    { name: 'Bonus To Wallet', icon: <FiGift />, link: '/services/bonus-to-wallet' },
    { name: 'Buy Pins', icon: <FiKey />, link: '/services/buy-pins' },
    { name: 'Airtime To Cash', icon: <FiRefreshCw />, link: '/services/airtime-to-cash' }
  ];

  return (
    <div className="services-card">
      <div className="widget-header">
        <h3 className="widget-title">Services</h3>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <a 
            key={index} 
            href={service.link} 
            className="service-item"
            onClick={(e) => {
              e.preventDefault();
              // You can add navigation logic here, e.g., using React Router
              console.log(`Navigate to: ${service.link}`);
            }}
          >
            <div className="service-icon-wrapper">
              <div className="service-icon">{service.icon}</div>
            </div>
            <div className="service-name">{service.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ServicesCard;

