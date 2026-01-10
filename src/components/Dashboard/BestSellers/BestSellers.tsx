import './BestSellers.css';

interface Product {
  name: string;
  sold: string;
  price: string;
  status: string;
  availability: string;
}

const BestSellers = () => {
  const products: Product[] = [
    { 
      name: 'StrideMax Sneakers', 
      sold: '15,982 products sold', 
      price: '$1,099', 
      status: 'In Stock',
      availability: '2,669 Products Available'
    },
    { 
      name: 'SoundSphere Elite', 
      sold: '7,633 products sold', 
      price: '$109', 
      status: 'Out Of Stock',
      availability: 'Available from 20, Jul 2024'
    },
    { 
      name: 'CarryOn Deluxe', 
      sold: '4,672 products sold', 
      price: '$179', 
      status: 'In Stock',
      availability: '537 Products Available'
    },
    { 
      name: 'CommuPhone X', 
      sold: '2,721 products sold', 
      price: '$89', 
      status: 'In Stock',
      availability: '1,245 Products Available'
    },
    { 
      name: 'ZenSeat Lounge', 
      sold: '1,523 products sold', 
      price: '$89', 
      status: 'In Stock',
      availability: '354 Products Available'
    },
  ];

  return (
    <div className="best-sellers">
      <div className="widget-header">
        <h3 className="widget-title">New Best Sellers</h3>
      </div>
      <div className="products-list">
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <div className="product-avatar">
              <div className="product-placeholder">
                {product.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="product-details">
              <div className="product-name">{product.name}</div>
              <div className="product-sold">{product.sold}</div>
              <div className="product-availability">{product.availability}</div>
            </div>
            <div className="product-right">
              <div className="product-price">{product.price}</div>
              <div className={`product-status ${product.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
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

