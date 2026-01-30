interface Activity {
  title: string;
  description: string;
  time: string;
}

const RecentActivity = () => {
  const activities: Activity[] = [
    { title: 'New Order Received', description: 'New order #12345 of amount $450.00 is created by jane doe.', time: 'Today 02:25' },
    { title: 'Payment Processed', description: 'Payment of $320.50 has been processed successfully.', time: 'Today 01:15' },
    { title: 'Product Updated', description: 'StrideMax Sneakers inventory has been updated.', time: 'Yesterday 11:30' },
    { title: 'New Customer', description: 'New customer registration: Alice Smith', time: 'Yesterday 09:45' },
  ];

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">Recent Activity</h3>
        <button type="button" className="bg-transparent border-none text-[var(--accent-primary)] text-[0.85rem] font-medium cursor-pointer transition-colors hover:text-[var(--accent-secondary)]">
          View All
        </button>
      </div>
      <div className="flex flex-col gap-5 mt-4 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex gap-4 md:gap-3 p-4 md:p-3 rounded-lg bg-[var(--bg-tertiary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            <div className="shrink-0 flex items-start pt-1">
              <div className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_8px_var(--accent-hover)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.95rem] md:text-[0.9rem] font-semibold text-[var(--text-primary)] mb-2">{activity.title}</div>
              <div className="text-[0.85rem] md:text-[0.8rem] text-[var(--text-secondary)] leading-relaxed mb-2">{activity.description}</div>
              <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-muted)]">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
