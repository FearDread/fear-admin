// features/products/ProductEdit.jsx
import React, { useEffect, useState, useCallback } from 'react';
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
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';
import {
  fetchProduct,
  updateProduct,
  selectCurrentProduct,
  selectLoading,
  selectError,
  selectSuccess,
  selectUpdateSuccess,
  clearError,
  resetStatus,
} from '../../features/products/slice';
import Loader from '../../components/Loader/Loading';

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  comparePrice: '',
  sku: '',
  quantity: '',
  weight: '',
  brand: '',
  category: '',
  isActive: true,
  isFeatured: false,
  tags: '',
  images: [],
};

const toForm = (product) => ({
  title:        product.title        ?? '',
  description:  product.description  ?? '',
  price:        product.price        ?? '',
  comparePrice: product.comparePrice ?? '',
  sku:          product.sku          ?? '',
  quantity:     product.quantity     ?? '',
  weight:       product.weight       ?? '',
  brand:        product.brand || product.brandName || '',
  category:     product.category || product.categoryName || '',
  isActive:     product.isActive     !== false,
  isFeatured:   product.isFeatured   === true,
  tags:         Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags ?? ''),
  images:       product.images       ?? [],
});

export const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector(selectCurrentProduct);
  const loading  = useSelector(selectLoading);
  const error    = useSelector(selectError);
  const success  = useSelector(selectSuccess);
  const updateSuccess = useSelector(selectUpdateSuccess);

  const [form, setForm]             = useState(EMPTY_FORM);
  const [isDirty, setIsDirty]       = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Populate form when product loads
  useEffect(() => {
    if (id) dispatch(fetchProduct({id}));
    return () => dispatch(resetStatus());
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setForm(toForm(product));
      setIsDirty(false);
    }
  }, [product]);

  // Auto-navigate after successful save
  /*
  useEffect(() => {

    if (success) {
      const timer = setTimeout(() => {
        navigate(`/admin/product/view/${id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, id, navigate]);
*/
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setIsDirty(true);
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const addImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setNewImageUrl('');
    setIsDirty(true);
  };

  const removeImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
    setIsDirty(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.title?.trim())                    errors.title    = 'Title is required';
    if (!form.price || isNaN(Number(form.price))) errors.price   = 'Valid price is required';
    if (form.quantity !== '' && isNaN(Number(form.quantity))) errors.quantity = 'Quantity must be a number';
    if (form.comparePrice !== '' && isNaN(Number(form.comparePrice))) errors.comparePrice = 'Must be a valid number';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...form,
      price:        Number(form.price),
      comparePrice: form.comparePrice !== '' ? Number(form.comparePrice) : undefined,
      quantity:     form.quantity     !== '' ? Number(form.quantity)     : undefined,
      weight:       form.weight       !== '' ? Number(form.weight)       : undefined,
      tags:         form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    dispatch(updateProduct({ id, data: payload }));
  };

  const handleDiscard = () => {
    if (product) {
      setForm(toForm(product));
      setIsDirty(false);
      setFormErrors({});
      dispatch(clearError());
    }
  };

  if (loading && !product) return <Loader />;

  return (
    <div className="container-fluid">

      {/* Page Header */}
      <Row className="mb-4">
        <Col md="12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="text-white mb-1">
                <i className="fa fa-pencil mr-2 text-primary"></i>
                Edit Product
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
                <span
                  className="text-light-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/product/view/${id}`)}
                >
                  {product?.title || 'Product'}
                </span>
                <i className="fa fa-angle-right mx-2"></i>
                Edit
              </small>
            </div>
            <div className="d-flex" style={{ gap: '8px' }}>
              <Button
                color="secondary"
                size="sm"
                className="btn-round"
                onClick={() => navigate(`/admin/product/view/${id}`)}
                disabled={loading}
              >
                <i className="fa fa-eye mr-2"></i>
                View
              </Button>
              {isDirty && (
                <Button
                  color="warning"
                  size="sm"
                  className="btn-round"
                  onClick={handleDiscard}
                  disabled={loading}
                >
                  <i className="fa fa-undo mr-2"></i>
                  Discard
                </Button>
              )}
              <Button
                color="primary"
                size="sm"
                className="btn-round"
                onClick={handleSubmit}
                disabled={loading || !isDirty}
              >
                {loading ? (
                  <><i className="fa fa-spinner fa-spin mr-2"></i>Saving…</>
                ) : (
                  <><i className="fa fa-save mr-2"></i>Save Changes</>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Alert color="danger" className="mb-4" toggle={() => dispatch(clearError())}>
          <i className="fa fa-exclamation-circle mr-2"></i>
          {typeof error === 'string' ? error : 'An error occurred while saving.'}
        </Alert>
      )}
      {updateSuccess && (
        <Alert color="success" className="mb-4">
          <i className="fa fa-check-circle mr-2"></i>
          Product saved successfully! Redirecting…
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Row>
          {/* Left Column */}
          <Col lg="8">

            {/* Basic Info */}
            <Card className="media-object mb-4">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="fa fa-cube mr-2"></i>
                  Basic Information
                </CardTitle>
                <small className="text-light-2">Core product details</small>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label className="text-light-1">
                    Title <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Product title"
                    invalid={!!formErrors.title}
                    className="form-control"
                  />
                  {formErrors.title && (
                    <div className="text-danger small mt-1">
                      <i className="fa fa-exclamation-triangle mr-1"></i>
                      {formErrors.title}
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label className="text-light-1">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your product…"
                    rows={5}
                    className="form-control"
                  />
                </FormGroup>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label className="text-light-1">Brand</Label>
                      <Input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        placeholder="Brand name"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="text-light-1">Category</Label>
                      <Input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label className="text-light-1">
                    Tags
                    <small className="text-light-2 ml-2">(comma separated)</small>
                  </Label>
                  <Input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. electronics, featured, sale"
                    className="form-control"
                  />
                  {form.tags && (
                    <div className="d-flex flex-wrap mt-2" style={{ gap: '6px' }}>
                      {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                        <Badge key={idx} color="secondary" pill className="px-2">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </FormGroup>
              </CardBody>
            </Card>

            {/* Pricing & Inventory */}
            <Card className="media-object mb-4">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="fa fa-dollar mr-2"></i>
                  Pricing & Inventory
                </CardTitle>
                <small className="text-light-2">Manage pricing and stock</small>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label className="text-light-1">
                        Price (USD) <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        invalid={!!formErrors.price}
                        className="form-control"
                      />
                      {formErrors.price && (
                        <div className="text-danger small mt-1">
                          <i className="fa fa-exclamation-triangle mr-1"></i>
                          {formErrors.price}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="text-light-1">Compare-at Price</Label>
                      <Input
                        type="number"
                        name="comparePrice"
                        value={form.comparePrice}
                        onChange={handleChange}
                        placeholder="Original / strike-through price"
                        min="0"
                        step="0.01"
                        invalid={!!formErrors.comparePrice}
                        className="form-control"
                      />
                      {formErrors.comparePrice && (
                        <div className="text-danger small mt-1">
                          <i className="fa fa-exclamation-triangle mr-1"></i>
                          {formErrors.comparePrice}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="text-light-1">SKU</Label>
                      <Input
                        type="text"
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="Stock keeping unit"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label className="text-light-1">Quantity</Label>
                      <Input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        invalid={!!formErrors.quantity}
                        className="form-control"
                      />
                      {formErrors.quantity && (
                        <div className="text-danger small mt-1">
                          <i className="fa fa-exclamation-triangle mr-1"></i>
                          {formErrors.quantity}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label className="text-light-1">Weight (kg)</Label>
                      <Input
                        type="number"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        placeholder="0.0"
                        min="0"
                        step="0.01"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Inline stock indicator */}
                {form.quantity !== '' && (
                  <div className="d-flex align-items-center mt-1" style={{ gap: '8px' }}>
                    <i className="fa fa-info-circle text-info"></i>
                    {Number(form.quantity) === 0 ? (
                      <Badge color="danger" pill>Out of Stock</Badge>
                    ) : Number(form.quantity) < 10 ? (
                      <Badge color="warning" pill>Low Stock</Badge>
                    ) : (
                      <Badge color="success" pill>In Stock</Badge>
                    )}
                    <small className="text-light-2">{form.quantity} units</small>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Images */}
            <Card className="media-object mb-4">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="fa fa-image mr-2"></i>
                  Images
                </CardTitle>
                <small className="text-light-2">Add image URLs for this product</small>
              </CardHeader>
              <CardBody>
                <div className="d-flex mb-3" style={{ gap: '8px' }}>
                  <Input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    placeholder="https://example.com/image.jpg"
                    className="form-control"
                  />
                  <Button
                    color="primary"
                    className="btn-round"
                    onClick={addImageUrl}
                    style={{ flexShrink: 0 }}
                  >
                    <i className="fa fa-plus mr-2"></i>
                    Add
                  </Button>
                </div>

                {form.images.length > 0 ? (
                  <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                    {form.images.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img
                          src={img.url}
                          alt={`product-img-${idx}`}
                          style={{
                            width: '90px',
                            height: '90px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: idx === 0 ? '2px solid #007bff' : '2px solid rgba(255,255,255,0.1)',
                          }}
                        />
                        {idx === 0 && (
                          <Badge
                            color="primary"
                            pill
                            style={{ position: 'absolute', top: 4, left: 4, fontSize: '9px' }}
                          >
                            Main
                          </Badge>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            background: 'rgba(220,53,69,0.85)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          <i className="fa fa-times text-white" style={{ fontSize: '10px' }}></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-4 rounded"
                    style={{ border: '2px dashed rgba(255,255,255,0.12)' }}
                  >
                    <i className="fa fa-image" style={{ fontSize: '32px', opacity: 0.2 }}></i>
                    <p className="text-light-2 mb-0 mt-2 small">No images added yet</p>
                  </div>
                )}
              </CardBody>
            </Card>

          </Col>

          {/* Right Column */}
          <Col lg="4">

            {/* Status & Visibility */}
            <Card className="media-object mb-4">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="fa fa-toggle-on mr-2"></i>
                  Status & Visibility
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div
                  className="d-flex justify-content-between align-items-center p-3 mb-3 rounded"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div>
                    <p className="text-white mb-0 font-weight-bold">Active</p>
                    <small className="text-light-2">Show this product in the store</small>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <Badge color={form.isActive ? 'success' : 'secondary'} pill className="px-2">
                      {form.isActive ? 'On' : 'Off'}
                    </Badge>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="isActiveSwitch"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                      />
                      <label className="custom-control-label" htmlFor="isActiveSwitch"></label>
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center p-3 rounded"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div>
                    <p className="text-white mb-0 font-weight-bold">Featured</p>
                    <small className="text-light-2">Highlight on the homepage</small>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <Badge color={form.isFeatured ? 'warning' : 'secondary'} pill className="px-2">
                      {form.isFeatured ? 'On' : 'Off'}
                    </Badge>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="isFeaturedSwitch"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                      />
                      <label className="custom-control-label" htmlFor="isFeaturedSwitch"></label>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Summary */}
            <Card className="media-object mb-4">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="fa fa-line-chart mr-2"></i>
                  Summary
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="mb-3 pb-3 border-bottom border-light-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-light-2">Price</span>
                    <span className="text-success font-weight-bold">
                      {form.price ? `$${Number(form.price).toFixed(2)}` : '—'}
                    </span>
                  </div>
                </div>
                <div className="mb-3 pb-3 border-bottom border-light-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-light-2">Stock</span>
                    <span className="text-white font-weight-bold">{form.quantity !== '' ? form.quantity : '—'}</span>
                  </div>
                </div>
                <div className="mb-3 pb-3 border-bottom border-light-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-light-2">Images</span>
                    <Badge color="info" pill>{form.images.length}</Badge>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-light-2">Unsaved changes</span>
                    <Badge color={isDirty ? 'warning' : 'secondary'} pill>
                      {isDirty ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Actions */}
            <Card className="media-object">
              <CardBody>
                <Button
                  color="primary"
                  block
                  className="btn-round mb-2"
                  onClick={handleSubmit}
                  disabled={loading || !isDirty}
                >
                  {loading ? (
                    <><i className="fa fa-spinner fa-spin mr-2"></i>Saving…</>
                  ) : (
                    <><i className="fa fa-save mr-2"></i>Save Changes</>
                  )}
                </Button>
                <Button
                  color="secondary"
                  block
                  className="btn-round mb-2"
                  onClick={() => navigate(`/admin/product/view/${id}`)}
                  disabled={loading}
                >
                  <i className="fa fa-eye mr-2"></i>
                  View Product
                </Button>
                <Button
                  color="light"
                  block
                  className="btn-round"
                  onClick={() => navigate('/admin/products')}
                  disabled={loading}
                >
                  <i className="fa fa-arrow-left mr-2"></i>
                  Back to Products
                </Button>
              </CardBody>
            </Card>

          </Col>
        </Row>
      </form>
    </div>
  );
};

export default ProductEdit;