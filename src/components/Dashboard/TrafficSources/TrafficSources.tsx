import './TrafficSources.css';

interface TrafficSource {
  name: string;
  percentage: string;
  value: string;
  color: string;
}

const TrafficSources = () => {
  const sources: TrafficSource[] = [
    { name: 'Direct', percentage: '7.64%', value: '45%', color: '#10b981' },
    { name: 'Paid', percentage: '12.75%', value: '21%', color: '#ef4444' },
    { name: 'Social', percentage: '21.85%', value: '18%', color: '#10b981' },
    { name: 'Referral', percentage: '14.95%', value: '16%', color: '#10b981' },
  ];

  const getBarWidth = (value: string) => {
    return parseInt(value.replace('%', ''));
  };

  return (
    <div className="traffic-sources">
      <div className="widget-header">
        <h3 className="widget-title">Traffic Sources</h3>
      </div>
      <div className="sources-list">
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <div className="source-header">
              <span className="source-name">{source.name}</span>
              <span className="source-percentage">{source.percentage}</span>
            </div>
            <div className="source-bar-container">
              <div 
                className="source-bar" 
                style={{ 
                  width: `${getBarWidth(source.value)}%`,
                  backgroundColor: source.color
                }}
              />
            </div>
            <div className="source-value">{source.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSources;

