import './BrowserStatistics.css';

interface Browser {
  name: string;
  company: string;
  sales: string;
  percentage: string;
  color: string;
}

const BrowserStatistics = () => {
  const browsers: Browser[] = [
    { name: 'Chrome', company: 'Google, Inc', sales: '15,255 Sales', percentage: '80.45%', color: '#a855f7' },
    { name: 'Edge', company: 'Microsoft Corp, Inc', sales: '13,865 Sales', percentage: '72.86%', color: '#3b82f6' },
    { name: 'Firefox', company: 'Mozilla, Inc', sales: '11,253 Sales', percentage: '47.24%', color: '#f97316' },
    { name: 'Safari', company: 'Apple Corp, Inc', sales: '7,346 Sales', percentage: '22.98%', color: '#10b981' },
    { name: 'Opera', company: 'Opera, Inc', sales: '9,453 Sales', percentage: '28.04%', color: '#fbbf24' },
  ];

  const getPercentageValue = (percentage: string) => {
    return parseFloat(percentage.replace('%', ''));
  };

  return (
    <div className="browser-statistics">
      <div className="widget-header">
        <h3 className="widget-title">Browser Statistics</h3>
      </div>
      <div className="browsers-list">
        {browsers.map((browser, index) => (
          <div key={index} className="browser-item">
            <div className="browser-icon">
              <div className="browser-placeholder" style={{ backgroundColor: browser.color }}>
                {browser.name[0]}
              </div>
            </div>
            <div className="browser-details">
              <div className="browser-name">{browser.name}</div>
              <div className="browser-company">{browser.company}</div>
              <div className="browser-sales">{browser.sales}</div>
            </div>
            <div className="browser-progress">
              <div className="progress-circle-container">
                <svg className="progress-circle" width="60" height="60">
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke={browser.color}
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 25}`}
                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - getPercentageValue(browser.percentage) / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                  />
                </svg>
                <div className="progress-percentage">{browser.percentage}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserStatistics;

