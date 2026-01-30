const Marquee = () => {
  const announcements = [
    'Welcome to our platform! Get started with our services today.',
    'New features available: Buy Data, Airtime, Electricity, and more!',
    'Special offer: Get 5% bonus on your first wallet funding.',
    'API Documentation now available for developers.',
  ];

  return (
    <div className="w-full bg-[var(--accent-hover)] border border-[var(--accent-hover)] rounded-lg py-3 px-4 md:py-2.5 md:px-3 overflow-hidden mb-6 md:mb-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {announcements.map((announcement, index) => (
          <span key={index} className="inline-block text-[var(--accent-primary)] text-sm md:text-[0.8rem] font-medium mr-12 md:mr-8">
            {announcement}
            <span className="mx-6 md:mx-4 text-[var(--accent-primary)] opacity-50">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
