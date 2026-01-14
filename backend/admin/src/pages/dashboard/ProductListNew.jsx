import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/Loader/Loading";

// slice exports
import {
  fetchProducts,
  selectAllProducts,
  selectLoading,
} from "../../features/products/slice";

const ProductList = () => {
  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid">
      {/* Stats */}
      <div className="row mt-3">
        <div className="col-12 col-lg-3">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h5>Total Products</h5>
              <h3>{products.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-dark text-white">
              Recent Products
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.sku}</td>
                      <td>${product.price}</td>
                      <td>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;