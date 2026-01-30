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

  const getPercentageValue = (percentage: string) => parseFloat(percentage.replace('%', ''));

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">Browser Statistics</h3>
      </div>
      <div className="flex flex-col gap-5 mt-4 overflow-y-auto">
        {browsers.map((browser, index) => (
          <div
            key={index}
            className="flex items-center gap-4 md:gap-3 p-4 md:p-3 rounded-lg bg-[var(--bg-tertiary)] transition-colors hover:bg-[var(--bg-hover)] flex-wrap md:flex-nowrap"
          >
            <div className="shrink-0">
              <div
                className="w-10 h-10 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-[0.85rem]"
                style={{ backgroundColor: browser.color }}
              >
                {browser.name[0]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.95rem] md:text-[0.9rem] font-semibold text-[var(--text-primary)] mb-1">{browser.name}</div>
              <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-tertiary)] mb-1">{browser.company}</div>
              <div className="text-[0.85rem] md:text-[0.8rem] text-[var(--text-muted)]">{browser.sales}</div>
            </div>
            <div className="shrink-0 w-full md:w-auto flex justify-center mt-2 md:mt-0">
              <div className="relative w-[60px] h-[60px] md:w-[50px] md:h-[50px]">
                <svg className="w-[60px] h-[60px] md:w-[50px] md:h-[50px]" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke={browser.color}
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={2 * Math.PI * 25 * (1 - getPercentageValue(browser.percentage) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs md:text-[0.7rem] font-semibold text-[var(--text-primary)]">
                  {browser.percentage}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserStatistics;
