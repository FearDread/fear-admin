import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button, Input, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Modal, Button as RSButton, Message, useToaster } from "rsuite";
import { useSelector, useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTable";
import normalizeCells from "../../components/ReactTable/NormalizeCells";
import Loader from "../../components/Loader/Loading";
import StatCard from "../../components/common/StatCard";
import { selectSortedProducts, selectProducts, selectViewMode, selectSearchTerm, selectFilters, setSearchTerm, setViewMode, fetchProducts, selectLoading, selectError, deleteProduct, setFilters, clearError } from "../../features/products/slice.js";
import { fetchCategories, selectAllCategories } from "../../features/categories/slice.js";

/* -------------------------------------------------------------------------
   Constants + helpers (outside the component so they are not rebuilt on render)
   ---------------------------------------------------------------------- */

const LOW_STOCK_THRESHOLD = 10;

const STOCK_STATUS = {
    inStock: { color: "success", icon: "fa-check-circle", label: "In Stock" },
    lowStock: { color: "warning", icon: "fa-exclamation-triangle", label: "Low Stock" },
    outOfStock: { color: "danger", icon: "fa-times-circle", label: "Out of Stock" },
};

const GAP = { gap: 8 }; // Bootstrap 4 has no `gap-*` utilities

// Inline placeholder: a relative image path breaks as soon as the route changes
const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#141922'/><text x='50%' y='54%' fill='#8b94a1' font-size='12' text-anchor='middle' font-family='sans-serif'>No image</text></svg>"
)}`;

const showPlaceholder = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER_IMG;
};

const quantityOf = (product) => Number(product.quantity) || 0;
const priceOf = (product) => Number(product.price) || 0;
const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;
const productTitle = (product) => product.title || product.name || "Untitled";
const productImage = (product) => product.images?.[0]?.url || PLACEHOLDER_IMG;

// `category` and `brand` may arrive as plain strings or as populated objects
const labelOf = (value) => (value && typeof value === "object" ? value.title || value.name || "" : value || "");
const categoryTitle = (product) => labelOf(product.category) || "Uncategorized";
const categoryIdOf = (product) =>
    (product.category && typeof product.category === "object" ? product.category._id || product.category.id : undefined) ?? product.categoryId;

// One rule for the table, the grid and the statistics, so the numbers always agree
const getStockKey = (product) => {
    const quantity = quantityOf(product);
    if (quantity <= 0) return "outOfStock";
    if (quantity < LOW_STOCK_THRESHOLD) return "lowStock";
    return "inStock";
};

const truncate = (text, max) => (text && text.length > max ? `${text.slice(0, max)}...` : text);

// react-table v6 filters by exact match unless told otherwise
const includesFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().includes(String(filter.value).toLowerCase());
const startsWithFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().startsWith(String(filter.value).toLowerCase());

/* -------------------------------------------------------------------------
   Page
   ---------------------------------------------------------------------- */

const ProductList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toaster = useToaster();

    // Redux state
    const error = useSelector(selectError);
    const loading = useSelector(selectLoading);
    const products = useSelector(selectSortedProducts); // what the list shows
    const allProducts = useSelector(selectProducts); // unfiltered, for statistics
    const viewMode = useSelector(selectViewMode);
    const searchTerm = useSelector(selectSearchTerm);
    const filters = useSelector(selectFilters);
    const categories = useSelector(selectAllCategories);

    // Local state
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const notify = useCallback(
        (type, content, placement = "topEnd") =>
            toaster.push(<Message showIcon type={type} closable>{content}</Message>, { placement, duration: 4000 }),
        [toaster]
    );

    // Initial load. Failures land in the slice's `error` state, which the effect below reports.
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            notify("error", <><strong>Error!</strong> {error}</>);
            dispatch(clearError());
        }
    }, [error, notify, dispatch]);

    /* ----- Actions ----- */

    const handleEditProduct = useCallback((id) => navigate(`/admin/product/edit/${id}`), [navigate]);
    const handleViewProduct = useCallback((id) => navigate(`/admin/product/view/${id}`), [navigate]);

    const confirmDelete = useCallback((product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    }, []);

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProduct(null);
    };

    // Close only on success, so a failed delete does not look like it worked
    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        try {
            await dispatch(deleteProduct({ id: selectedProduct._id })).unwrap();
            notify("success", <strong>Product removed successfully!</strong>, "topCenter");
            closeDeleteModal();
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    /* ----- Filters ----- */

    const handleCategoryFilter = (categoryId) => {
        setCategoryFilter(categoryId);
        dispatch(setFilters({ ...filters, categoryId: categoryId === "all" ? null : categoryId }));
    };

    const handleClearFilters = () => {
        dispatch(setSearchTerm(""));
        setCategoryFilter("all");
        dispatch(setFilters({ ...filters, categoryId: null })); // keep any other filters intact
    };

    /* ----- Derived data ----- */

    const filteredProducts = useMemo(() => {
        const term = searchTerm?.toLowerCase();
        const selected = categoryFilter === "all" ? null : categories?.find((c) => c._id === categoryFilter);

        return (products || []).filter((product) => {
            if (categoryFilter !== "all") {
                const matchesId = categoryIdOf(product) === categoryFilter;
                const matchesTitle = selected && categoryTitle(product) === selected.title;
                if (!matchesId && !matchesTitle) return false;
            }
            if (!term) return true;
            return [productTitle(product), labelOf(product.brand), categoryTitle(product), product._id].some((field) => String(field || "").toLowerCase().includes(term));
        });
    }, [products, searchTerm, categoryFilter, categories]);

    const statistics = useMemo(() => {
        const counts = { inStock: 0, lowStock: 0, outOfStock: 0 };
        (allProducts || []).forEach((product) => {
            counts[getStockKey(product)] += 1;
        });
        return { total: (allProducts || []).length, ...counts };
    }, [allProducts]);

    /* ----- Table ----- */

    // Plain values here so ReactTable can sort and filter them; JSX lives in each column's Cell.
    const tableData = useMemo(
        () =>
            filteredProducts.map((product) => {
                const stockKey = getStockKey(product);
                return {
                    id: product._id,
                    product,
                    imageUrl: productImage(product),
                    title: productTitle(product),
                    description: product.description || "",
                    category: categoryTitle(product),
                    price: priceOf(product),
                    quantity: quantityOf(product),
                    stockKey,
                    status: STOCK_STATUS[stockKey].label,
                    brand: labelOf(product.brand) || "N/A",
                };
            }),
        [filteredProducts]
    );

    const columns = useMemo(
        () => normalizeCells([
            {
                Header: "Image",
                id: "image",
                accessor: "imageUrl",
                sortable: false,
                filterable: false,
                width: 90,
                Cell: ({ original }) => (
                    <img
                        src={original.imageUrl}
                        alt={original.title}
                        onError={showPlaceholder}
                        style={{ width: 50, height: 50, objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)" }}
                    />
                ),
            },
            {
                Header: "Product",
                accessor: "title",
                filterMethod: includesFilter,
                Cell: ({ original }) => (
                    <div className="d-flex flex-column">
                        <span className="text-white font-weight-bold">{original.title}</span>
                        {original.description && <small className="text-light-2" style={{ fontSize: 11 }}>{truncate(original.description, 50)}</small>}
                    </div>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                filterMethod: includesFilter,
                Cell: ({ value }) => <Badge color="primary" pill className="px-3">{value}</Badge>,
            },
            {
                Header: "Price",
                accessor: "price",
                filterMethod: includesFilter,
                Cell: ({ value }) => <span className="text-success font-weight-bold">{formatPrice(value)}</span>,
            },
            {
                Header: "Stock",
                accessor: "quantity",
                filterMethod: includesFilter,
                Cell: ({ original }) => <Badge color={STOCK_STATUS[original.stockKey].color} pill>{original.quantity} units</Badge>,
            },
            {
                Header: "Status",
                accessor: "status",
                filterMethod: startsWithFilter,
                Cell: ({ original }) => {
                    const status = STOCK_STATUS[original.stockKey];
                    return (
                        <Badge color={status.color} pill className="px-3">
                            <i className={`fa ${status.icon} mr-2`} aria-hidden="true"></i>
                            {status.label}
                        </Badge>
                    );
                },
            },
            {
                Header: "Brand",
                accessor: "brand",
                filterMethod: includesFilter,
                Cell: ({ value }) => <span className="text-light-1">{value}</span>,
            },
            {
                Header: "Actions",
                id: "actions",
                accessor: (row) => row.product,
                sortable: false,
                filterable: false,
                Cell: ({ value: product }) => (
                    <div className="d-flex" style={GAP}>
                        <Button color="info" size="sm" className="btn-round" title="View product" aria-label={`View ${productTitle(product)}`} onClick={() => handleViewProduct(product._id)}>
                            <i className="fa fa-eye" aria-hidden="true"></i>
                        </Button>
                        <Button color="primary" size="sm" className="btn-round" title="Edit product" aria-label={`Edit ${productTitle(product)}`} onClick={() => handleEditProduct(product._id)}>
                            <i className="fa fa-edit" aria-hidden="true"></i>
                        </Button>
                        <Button color="danger" size="sm" className="btn-round" title="Delete product" aria-label={`Delete ${productTitle(product)}`} onClick={() => confirmDelete(product)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </Button>
                    </div>
                ),
            },
        ]),
        [handleViewProduct, handleEditProduct, confirmDelete]
    );

    // Show loader only on the very first fetch
    if (loading && (!products || products.length === 0)) {
        return <Loader />;
    }

    const hasFilters = Boolean(searchTerm) || categoryFilter !== "all";

    return (
        <>
            <div className="container-fluid">
                <Row className="mb-4">
                    <StatCard icon="fa-shopping-bag" tone="primary" label="Total Products" value={statistics.total} />
                    <StatCard icon="fa-check-circle" tone="success" label="In Stock" value={statistics.inStock} />
                    <StatCard icon="fa-exclamation-triangle" tone="warning" label="Low Stock" value={statistics.lowStock} />
                    <StatCard icon="fa-times-circle" tone="danger" label="Out of Stock" value={statistics.outOfStock} />
                </Row>

                <Row>
                    <Col md="12">
                        <Card className="media-object">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <div>
                                    <CardTitle tag="h4" className="mb-0">
                                        <i className="fa fa-shopping-bag mr-2" aria-hidden="true"></i>
                                        All Products
                                    </CardTitle>
                                    <small className="text-light-2">Manage your product inventory</small>
                                </div>
                                <div className="d-flex align-items-center" style={GAP}>
                                    <div className="btn-group mr-2">
                                        <Button color={viewMode === "list" ? "info" : "secondary"} size="sm" onClick={() => dispatch(setViewMode("list"))} className="btn-round" aria-label="List view">
                                            <i className="fa fa-list" aria-hidden="true"></i>
                                        </Button>
                                        <Button color={viewMode === "grid" ? "info" : "secondary"} size="sm" onClick={() => dispatch(setViewMode("grid"))} className="btn-round" aria-label="Grid view">
                                            <i className="fa fa-th" aria-hidden="true"></i>
                                        </Button>
                                    </div>
                                    <Button color="primary" size="sm" onClick={() => navigate("/admin/product/new")} className="btn-round">
                                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                        Add Product
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* position-relative so the loading overlay covers this card, not the page */}
                            <CardBody className="position-relative">
                                {/* Search and filter */}
                                <Row className="mb-4">
                                    <Col md="5">
                                        <div className="position-relative">
                                            <Input
                                                type="text"
                                                placeholder="Search products, brands..."
                                                value={searchTerm || ""}
                                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                                style={{ paddingLeft: 35 }}
                                                aria-label="Search products"
                                            />
                                            <i className="fa fa-search" aria-hidden="true" style={{ position: "absolute", left: 12, top: 12, color: "rgba(255,255,255,0.5)" }}></i>
                                        </div>
                                    </Col>
                                    <Col md="3">
                                        <UncontrolledDropdown>
                                            <DropdownToggle caret color="light" className="w-100 text-left">
                                                <i className="fa fa-filter mr-2" aria-hidden="true"></i>
                                                {categoryFilter === "all" ? "All Categories" : categories?.find((c) => c._id === categoryFilter)?.title || "Category"}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleCategoryFilter("all")}>All Categories</DropdownItem>
                                                <DropdownItem divider />
                                                {categories?.map((category) => (
                                                    <DropdownItem key={category._id} onClick={() => handleCategoryFilter(category._id)}>
                                                        <i className="fa fa-tag mr-2" aria-hidden="true"></i>
                                                        {category.title}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col md="4" className="text-right">
                                        <div className="d-flex justify-content-end align-items-center" style={GAP}>
                                            <Badge color="light" className="px-3">Total: {statistics.total}</Badge>
                                            <Badge color="info" className="px-3">Filtered: {tableData.length}</Badge>
                                            {hasFilters && (
                                                <Button color="secondary" size="sm" onClick={handleClearFilters}>
                                                    <i className="fa fa-times mr-2" aria-hidden="true"></i>
                                                    Clear
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                {/* Table or grid */}
                                {viewMode === "list" ? (
                                    tableData.length > 0 ? (
                                        <div className="table-responsive">
                                            <ReactTable
                                                data={tableData}
                                                filterable
                                                resizable={false}
                                                columns={columns}
                                                defaultPageSize={10}
                                                showPaginationTop
                                                showPaginationBottom
                                                className="-striped -highlight"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fa fa-shopping-bag" aria-hidden="true" style={{ fontSize: 64, opacity: 0.3 }}></i>
                                            <p className="text-light-2 mt-3">{hasFilters ? "No products match your filters" : "No products found. Create your first product!"}</p>
                                            {!hasFilters && (
                                                <Button color="primary" onClick={() => navigate("/admin/product/new")} className="btn-round mt-3">
                                                    <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                                    Create First Product
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <Row>
                                        {filteredProducts.map((product) => {
                                            const status = STOCK_STATUS[getStockKey(product)];
                                            return (
                                                <Col md="3" lg="2" key={product._id} className="mb-4">
                                                    <Card className="product-card h-100">
                                                        <div className="position-relative">
                                                            <img src={productImage(product)} onError={showPlaceholder} className="card-img-top" alt={productTitle(product)} style={{ height: 200, objectFit: "cover" }} />
                                                            <Badge color={status.color} className="position-absolute" style={{ top: 10, right: 10 }}>{status.label}</Badge>
                                                        </div>
                                                        <CardBody>
                                                            <h6 className="text-white mb-2">{productTitle(product)}</h6>
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <Badge color="primary" pill>{categoryTitle(product)}</Badge>
                                                                <Badge color="light" pill>{quantityOf(product)} units</Badge>
                                                            </div>
                                                            <div className="text-success font-weight-bold mb-3">{formatPrice(priceOf(product))}</div>
                                                            <div className="d-flex justify-content-between" style={GAP}>
                                                                <Button color="info" size="sm" className="btn-round flex-fill" aria-label={`View ${productTitle(product)}`} onClick={() => handleViewProduct(product._id)}>
                                                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                                                </Button>
                                                                <Button color="primary" size="sm" className="btn-round flex-fill" aria-label={`Edit ${productTitle(product)}`} onClick={() => handleEditProduct(product._id)}>
                                                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                                                </Button>
                                                                <Button color="danger" size="sm" className="btn-round flex-fill" aria-label={`Delete ${productTitle(product)}`} onClick={() => confirmDelete(product)}>
                                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                                </Button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                )}

                                {/* Loading overlay for refetches */}
                                {loading && products && products.length > 0 && (
                                    <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ top: 0, left: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Delete confirmation */}
            <Modal open={showDeleteModal} onClose={closeDeleteModal} size="xs" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-exclamation-triangle mr-2 text-danger" aria-hidden="true"></i>
                        Delete Product?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ color: "rgba(255,255,255,0.7)" }}>
                        Are you sure you want to delete &quot;<strong style={{ color: "white" }}>{selectedProduct && productTitle(selectedProduct)}</strong>&quot;? This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleDeleteProduct} appearance="primary" color="red">
                        <i className="fa fa-trash mr-2" aria-hidden="true"></i>
                        Yes, Delete It
                    </RSButton>
                    <RSButton onClick={closeDeleteModal} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductList;