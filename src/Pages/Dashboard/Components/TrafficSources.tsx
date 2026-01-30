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
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">Traffic Sources</h3>
      </div>
      <div className="flex flex-col gap-5 mt-4">
        {sources.map((source, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-[0.85rem] text-[var(--text-primary)] font-medium">{source.name}</span>
              <span className="text-[0.85rem] md:text-[0.8rem] text-[var(--text-tertiary)]">{source.percentage}</span>
            </div>
            <div className="w-full h-2 rounded bg-[var(--bg-tertiary)] overflow-hidden">
              <div
                className="h-full rounded transition-[width] duration-300"
                style={{
                  width: `${getBarWidth(source.value)}%`,
                  backgroundColor: source.color,
                }}
              />
            </div>
            <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-muted)] self-end">{source.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSources;
