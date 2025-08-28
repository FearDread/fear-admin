import DetailedItem from './DetailedItem';

export const ProductGrid = ({ products, gridSize = 3, className = '' }) => (
  <div className={className}>
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-lg-5">
      {products.map((product) => (
        <DetailedItem {...product} key={product._id || product.id} />
      ))}
    </div>
  </div>
);

export default ProductGrid;