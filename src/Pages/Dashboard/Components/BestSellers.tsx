interface Product {
  name: string;
  sold: string;
  price: string;
  status: string;
  availability: string;
}

const BestSellers = () => {
  const products: Product[] = [
    { name: 'StrideMax Sneakers', sold: '15,982 products sold', price: '$1,099', status: 'In Stock', availability: '2,669 Products Available' },
    { name: 'SoundSphere Elite', sold: '7,633 products sold', price: '$109', status: 'Out Of Stock', availability: 'Available from 20, Jul 2024' },
    { name: 'CarryOn Deluxe', sold: '4,672 products sold', price: '$179', status: 'In Stock', availability: '537 Products Available' },
    { name: 'CommuPhone X', sold: '2,721 products sold', price: '$89', status: 'In Stock', availability: '1,245 Products Available' },
    { name: 'ZenSeat Lounge', sold: '1,523 products sold', price: '$89', status: 'In Stock', availability: '354 Products Available' },
  ];

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">New Best Sellers</h3>
      </div>
      <div className="flex flex-col gap-5 mt-4 overflow-y-auto">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-start gap-4 md:gap-3 p-4 md:p-3 rounded-lg bg-[var(--bg-tertiary)] transition-colors hover:bg-[var(--bg-hover)] flex-wrap md:flex-nowrap"
          >
            <div className="shrink-0">
              <div className="w-12 h-12 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--text-primary)] font-semibold text-sm md:text-[0.85rem]">
                {product.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.95rem] md:text-[0.9rem] font-semibold text-[var(--text-primary)] mb-2">{product.name}</div>
              <div className="text-[0.85rem] md:text-[0.8rem] text-[var(--text-tertiary)] mb-1">{product.sold}</div>
              <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-muted)]">{product.availability}</div>
            </div>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto md:mt-0 mt-2 flex-row md:flex-col justify-between md:justify-start">
              <div className="text-base md:text-[0.95rem] font-semibold text-[var(--success)]">{product.price}</div>
              <div
                className={`text-xs py-1 px-3 rounded-xl font-medium ${
                  product.status === 'In Stock'
                    ? 'bg-emerald-500/20 text-[var(--success)]'
                    : 'bg-red-500/20 text-[var(--error)]'
                }`}
              >
                {product.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
