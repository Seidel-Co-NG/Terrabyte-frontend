import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './SocialVisitors.css';

const SocialVisitors = () => {
  const data = [
    { name: 'Facebook', visitors: 1200, color: '#a855f7' },
    { name: 'Instagram', visitors: 950, color: '#3b82f6' },
    { name: 'Dribbble', visitors: 800, color: '#f97316' },
    { name: 'Twitter', visitors: 650, color: '#fbbf24' },
    { name: 'Chrome', visitors: 1100, color: '#10b981' },
    { name: 'Pinterest', visitors: 500, color: '#ef4444' },
    { name: 'Reddit', visitors: 400, color: '#06b6d4' },
  ];

  return (
    <div className="social-visitors">
      <div className="widget-header">
        <h3 className="widget-title">Social Visitors</h3>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis 
              type="number"
              domain={[0, 1500]}
              stroke="var(--text-tertiary)"
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="var(--text-tertiary)"
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
            />
            <Bar 
              dataKey="visitors" 
              radius={[0, 8, 8, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SocialVisitors;

