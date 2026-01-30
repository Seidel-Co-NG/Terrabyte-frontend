import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] md:text-base font-semibold text-[var(--text-primary)] m-0">Social Visitors</h3>
      </div>
      <div className="flex-1 min-h-[300px] md:min-h-[250px] sm:min-h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis type="number" domain={[0, 1500]} stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
            <YAxis type="category" dataKey="name" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
            />
            <Bar dataKey="visitors" radius={[0, 8, 8, 0]}>
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
