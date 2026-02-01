import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = () => {
  const data = [
    { name: 'Jan', sales: 4000, trend: 4200 },
    { name: 'Feb', sales: 3000, trend: 3800 },
    { name: 'Mar', sales: 5000, trend: 4800 },
    { name: 'Apr', sales: 4500, trend: 4600 },
    { name: 'May', sales: 6000, trend: 5800 },
    { name: 'Jun', sales: 5500, trend: 5600 },
    { name: 'Jul', sales: 7000, trend: 6800 },
    { name: 'Aug', sales: 6500, trend: 6600 },
    { name: 'Sep', sales: 8000, trend: 7800 },
    { name: 'Oct', sales: 7500, trend: 7600 },
    { name: 'Nov', sales: 9000, trend: 8800 },
    { name: 'Dec', sales: 8500, trend: 8600 },
  ];

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] md:text-base font-semibold text-[var(--text-primary)] m-0">Sales</h3>
      </div>
      <div className="flex-1 min-h-[250px] md:min-h-[200px] sm:min-h-[180px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
            <YAxis stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
            />
            <Bar dataKey="sales" fill="var(--accent-primary)" radius={[8, 8, 0, 0]} />
            <Line type="monotone" dataKey="trend" stroke="var(--warning)" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
