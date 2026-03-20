// features/products/ProductView.jsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Badge,
  Button,
} from 'reactstrap';

import {
  fetchProduct,
  toggleFeatured,
  selectCurrentProduct,
  selectLoading,
  selectError,
} from '../../features/products/slice';

import Loader from '../../components/Loader/Loading';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (id) dispatch(fetchProduct({id}));
  }, [dispatch, id]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStockBadge = (quantity) => {
    if (quantity === 0) return { color: 'danger', label: 'Out of Stock', icon: 'fa-times-circle' };
    if (quantity < 10) return { color: 'warning', label: 'Low Stock', icon: 'fa-exclamation-triangle' };
    return { color: 'success', label: 'In Stock', icon: 'fa-check-circle' };
  };

  if (loading && !product) return <Loader />;

  if (error) {
    return (
      <div className="container-fluid">
        <Card className="media-object">
          <CardBody className="text-center py-5">
            <i className="fa fa-exclamation-circle text-danger" style={{ fontSize: '64px', opacity: 0.7 }}></i>
            <h4 className="text-white mt-3">Failed to load product</h4>
            <p className="text-light-2">{error}</p>
            <Button color="primary" className="btn-round mt-2" onClick={() => navigate('/admin/products')}>
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Products
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!product) return null;

  const stockBadge = getStockBadge(product.quantity);

  return (
    <div className="container-fluid">

      {/* Page Header */}
      <Row className="mb-4">
        <Col md="12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="text-white mb-1">
                <i className="fa fa-cube mr-2 text-primary"></i>
                Product Details
              </h4>
              <small className="text-light-2">
                <span
                  className="text-light-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/admin/products')}
                >
                  Products
                </span>
                <i className="fa fa-angle-right mx-2"></i>
                {product.title}
              </small>
            </div>
            <div className="d-flex" style={{ gap: '8px' }}>
              <Button
                color="secondary"
                size="sm"
                className="btn-round"
                onClick={() => navigate('/admin/products')}
              >
                <i className="fa fa-arrow-left mr-2"></i>
                Back
              </Button>
              <Button
                color="primary"
                size="sm"
                className="btn-round"
                onClick={() => navigate(`/admin/product/edit/${product._id || product.id}`)}
              >
                <i className="fa fa-pencil mr-2"></i>
                Edit Product
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stat Badges Row */}
      <Row className="mb-4">
        <Col lg="3" md="6">
          <Card className="card-stats media-object">
            <CardBody>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center circle-1 bg-primary-light2">
                    <i className="fa fa-dollar text-primary"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category text-light-2">Price</p>
                    <CardTitle tag="h3" className="text-white">
                      {formatCurrency(product.price)}
                    </CardTitle>
                    {product.comparePrice && (
                      <p className="mb-0">
                        <span className="text-light-2" style={{ textDecoration: 'line-through' }}>
                          {formatCurrency(product.comparePrice)}
                        </span>
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card className="card-stats media-object">
            <CardBody>
              <Row>
                <Col xs="5">
                  <div className={`icon-big text-center circle-1 bg-${stockBadge.color}-light2`}>
                    <i className={`fa ${stockBadge.icon} text-${stockBadge.color}`}></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category text-light-2">Quantity</p>
                    <CardTitle tag="h3" className="text-white">
                      {product.quantity ?? 0}
                    </CardTitle>
                    <p className="mb-0">
                      <Badge color={stockBadge.color} pill className="px-2">
                        {stockBadge.label}
                      </Badge>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card className="card-stats media-object">
            <CardBody>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center circle-1 bg-info-light2">
                    <i className="fa fa-tag text-info"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category text-light-2">SKU</p>
                    <CardTitle tag="h5" className="text-white" style={{ wordBreak: 'break-all' }}>
                      {product.sku || '—'}
                    </CardTitle>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card className="card-stats media-object">
            <CardBody>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center circle-1 bg-warning-light2">
                    <i className="fa fa-star text-warning"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category text-light-2">Featured</p>
                    <CardTitle tag="h3" className="text-white">
                      {product.isFeatured ? 'Yes' : 'No'}
                    </CardTitle>
                    <p className="mb-0">
                      <Button
                        color={product.isFeatured ? 'warning' : 'secondary'}
                        size="sm"
                        className="btn-round"
                        onClick={() => dispatch(toggleFeatured(product._id || product.id))}
                      >
                        <i className={`fa fa-star${product.isFeatured ? '' : '-o'} mr-1`}></i>
                        {product.isFeatured ? 'Unfeature' : 'Feature'}
                      </Button>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        {/* Left — Image & Meta */}
        <Col lg="4">
          {/* Product Image */}
          <Card className="media-object mb-4">
            <CardBody className="text-center p-3">
              {product.images?.length > 0 || product.image ? (
                <img
                  src={product.images?.[0].url || product.image}
                  alt={product.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: '280px', objectFit: 'cover', width: '100%' }}
                />
              ) : (
                <div
                  className="d-flex flex-column align-items-center justify-content-center rounded"
                  style={{ height: '280px', background: 'rgba(255,255,255,0.05)' }}
                >
                  <i className="fa fa-image" style={{ fontSize: '64px', opacity: 0.2 }}></i>
                  <small className="text-light-2 mt-2">No image available</small>
                </div>
              )}
              {product.images?.length > 1 && (
                <div className="d-flex mt-2" style={{ gap: '6px', overflowX: 'auto' }}>
                  {product.images.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`${product.title} ${idx + 2}`}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Meta Info */}
          <Card className="media-object">
            <CardHeader>
              <CardTitle tag="h5" className="mb-0">
                <i className="fa fa-info-circle mr-2"></i>
                Meta Info
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="mb-3 pb-3 border-bottom border-light-3">
                <div className="d-flex justify-content-between align-items-start">
                  <span className="text-light-2">Created</span>
                  <span className="text-white text-right">{formatDate(product.createdAt)}</span>
                </div>
              </div>
              <div className="mb-3 pb-3 border-bottom border-light-3">
                <div className="d-flex justify-content-between align-items-start">
                  <span className="text-light-2">Updated</span>
                  <span className="text-white text-right">{formatDate(product.updatedAt)}</span>
                </div>
              </div>
              <div className="mb-3 pb-3 border-bottom border-light-3">
                <div className="d-flex justify-content-between align-items-start">
                  <span className="text-light-2">Product ID</span>
                  <code className="text-info small">{(product._id || product.id)?.substring(0, 10)}…</code>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-light-2">Status</span>
                  <Badge color={product.isActive !== false ? 'success' : 'danger'} pill className="px-3">
                    {product.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Right — Details */}
        <Col lg="8">
          {/* Core Details */}
          <Card className="media-object mb-4">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                <i className="fa fa-cube mr-2"></i>
                {product.title}
              </CardTitle>
              <small className="text-light-2">Product Information</small>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Title</p>
                  <p className="text-white mb-0 font-weight-bold">{product.title || '—'}</p>
                </Col>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Brand</p>
                  <p className="text-white mb-0">{product.brand || product.brandName || '—'}</p>
                </Col>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Category</p>
                  <p className="text-white mb-0">{product.category || product.categoryName || '—'}</p>
                </Col>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">SKU</p>
                  <code className="text-info">{product.sku || '—'}</code>
                </Col>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Price</p>
                  <p className="text-success mb-0 font-weight-bold">{formatCurrency(product.price)}</p>
                </Col>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Compare Price</p>
                  <p className="text-white mb-0">{product.comparePrice ? formatCurrency(product.comparePrice) : '—'}</p>
                </Col>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Quantity</p>
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <span className="text-white font-weight-bold">{product.quantity ?? 0}</span>
                    <Badge color={stockBadge.color} pill className="px-2">
                      {stockBadge.label}
                    </Badge>
                  </div>
                </Col>
                <Col md="6" className="mb-3">
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Weight</p>
                  <p className="text-white mb-0">{product.weight ? `${product.weight} kg` : '—'}</p>
                </Col>
              </Row>

              {product.description && (
                <>
                  <hr />
                  <p className="text-light-2 mb-1 extra-small-font text-uppercase">Description</p>
                  <p className="text-light-1" style={{ lineHeight: '1.7' }}>{product.description}</p>
                </>
              )}
            </CardBody>
          </Card>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <Card className="media-object mb-4">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="fa fa-list-ul mr-2"></i>
                  Variants
                  <Badge color="info" pill className="ml-2">{product.variants.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-secondary text-white">
                      <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant, idx) => (
                        <tr key={variant._id || variant.id || idx}>
                          <td className="text-white">{variant.name || variant.title || `Variant ${idx + 1}`}</td>
                          <td><code className="text-info small">{variant.sku || '—'}</code></td>
                          <td className="text-success">{variant.price ? formatCurrency(variant.price) : '—'}</td>
                          <td>
                            <Badge color={getStockBadge(variant.quantity ?? 0).color} pill>
                              {variant.quantity ?? 0}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <Card className="media-object">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="fa fa-tags mr-2"></i>
                  Tags
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                  {product.tags.map((tag, idx) => (
                    <Badge key={idx} color="secondary" pill className="px-3 py-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductView;