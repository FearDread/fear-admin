import Link from 'next/link';
import type { Product } from './ProductCard';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  const renderStars = (rating = 5) =>
    [...Array(rating)].map((_, i) => <i key={i} className="bx bxs-star text-white" />);

  const productId = product._id ?? product.id;
  const thumbnail =
    (product.images?.[0] && product.images[0].url) || '/assets/images/products/placeholder.png';

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="bottom-product-img">
          <Link href={`/product/${productId}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              width="100"
              alt={product.title || 'Product'}
              style={{ maxHeight: 100, objectFit: 'contain' }}
            />
          </Link>
        </div>
        <div className="ms-10" style={{ marginLeft: 10 }}>
          <h6 className="mb-0 fw-light mb-1">{product.title || product.name || 'Product Name'}</h6>
          <div className="rating font-12">{renderStars(product.rating)}</div>
          <p className="mb-0 text-white">
            <strong>${product.price?.toFixed(2) || '0.00'}</strong>
          </p>
        </div>
      </div>
      <hr />
    </>
  );
};

export default ProductListItem;
