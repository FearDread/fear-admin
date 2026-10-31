import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button, Input, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Modal, Form, Button as RSButton, useToaster, Message, Toggle } from "rsuite";
import ReactTable from "../../components/ReactTable/ReactTable";
import normalizeCells from "../../components/ReactTable/NormalizeCells";
import Loader from "../../components/Loader/Loading";
import StatCard from "../../components/common/StatCard";
import { useSelector, useDispatch } from "react-redux";
import { selectSortedBrands, selectBrandsSearchTerm, selectBrandsFilters, setSearchTerm, fetchBrands, updateBrand, deleteBrand, selectBrandsLoading, selectBrandsError, selectAllBrands, setFilters, clearError, selectFeaturedBrands, customCreateBrand } from "../../features/brands/slice.js";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;

/* -------------------------------------------------------------------------
   Constants + helpers (outside the component so they are not rebuilt on render)
   ---------------------------------------------------------------------- */

const BRAND_STATUS = {
    active: { color: "success", icon: "fa-check-circle", label: "Active" },
    inactive: { color: "danger", icon: "fa-times-circle", label: "Inactive" },
};

const EMPTY_FORM = { name: "", tagline: "", website: "", slug: "", isActive: true, isFeatured: false, verified: false };

const GAP = { gap: 8 }; // Bootstrap 4 has no `gap-*` utilities

// Inline placeholder: a relative image path breaks as soon as the route changes
const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#141922'/><text x='50%' y='54%' fill='#8b94a1' font-size='12' text-anchor='middle' font-family='sans-serif'>No logo</text></svg>"
)}`;

const showPlaceholder = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER_IMG;
};

const slugify = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const brandId = (brand) => brand._id || brand.id;
const brandName = (brand) => brand.name || brand.title || "Untitled";
const brandLogo = (brand) => brand.avatar?.url || brand.logo?.url || PLACEHOLDER_IMG;
const brandProducts = (brand) => brand.productCount ?? brand.products?.length ?? brand.stats?.productCount ?? 0;
// The API and the form have used both `active` and `isActive`; accept either
const isBrandActive = (brand) => (brand.active ?? brand.isActive) !== false;
const getBrandStatus = (brand) => (isBrandActive(brand) ? BRAND_STATUS.active : BRAND_STATUS.inactive);

const truncate = (text, max) => (text && text.length > max ? `${text.slice(0, max)}...` : text);

// react-table v6 filters by exact match unless told otherwise
const includesFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().includes(String(filter.value).toLowerCase());
const startsWithFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().startsWith(String(filter.value).toLowerCase());

/** Shared fields for the add and edit modals. */
const BrandFormFields = ({ formValue, setFormValue, slugHint }) => (
    <Form fluid formValue={formValue} onChange={setFormValue}>
        <FormGroup>
            <ControlLabel>Brand Name *</ControlLabel>
            <FormControl name="name" placeholder="Enter brand name..." />
        </FormGroup>
        <FormGroup>
            <ControlLabel>Tagline</ControlLabel>
            <FormControl name="tagline" placeholder="Brand tagline or slogan..." />
        </FormGroup>
        <FormGroup>
            <ControlLabel>Website</ControlLabel>
            <FormControl name="website" placeholder="https://www.example.com" />
        </FormGroup>
        <FormGroup>
            <ControlLabel>Slug</ControlLabel>
            <FormControl name="slug" placeholder={slugHint} />
        </FormGroup>
        <FormGroup className="button-flex-row">
            <Col md={3}>
                <FormGroup>
                    <ControlLabel>Active Status</ControlLabel>
                    <div className="mt-2">
                        <Toggle checked={formValue.isActive} onChange={(checked) => setFormValue((prev) => ({ ...prev, isActive: checked }))} checkedChildren="Active" unCheckedChildren="Inactive" />
                    </div>
                </FormGroup>
            </Col>
            <Col md={3}>
                <FormGroup>
                    <ControlLabel>Featured</ControlLabel>
                    <div className="mt-2">
                        <Toggle checked={formValue.isFeatured} onChange={(checked) => setFormValue((prev) => ({ ...prev, isFeatured: checked }))} checkedChildren="Featured" unCheckedChildren="Normal" />
                    </div>
                </FormGroup>
            </Col>
            <Col md={3}>
                <FormGroup>
                    <ControlLabel>Verified</ControlLabel>
                    <div className="mt-2">
                        <Toggle checked={formValue.verified} onChange={(checked) => setFormValue((prev) => ({ ...prev, verified: checked }))} checkedChildren="Verified" unCheckedChildren="Unverified" />
                    </div>
                </FormGroup>
            </Col>
        </FormGroup>
    </Form>
);

/* -------------------------------------------------------------------------
   Page
   ---------------------------------------------------------------------- */

const BrandList = () => {
    const dispatch = useDispatch();
    const toaster = useToaster();

    // Redux state
    const error = useSelector(selectBrandsError);
    const loading = useSelector(selectBrandsLoading);
    const brands = useSelector(selectSortedBrands);
    const allBrands = useSelector(selectAllBrands);
    const searchTerm = useSelector(selectBrandsSearchTerm);
    const filters = useSelector(selectBrandsFilters);
    const featuredBrands = useSelector(selectFeaturedBrands);

    // Local state
    const [viewMode, setViewMode] = useState("list");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [formValue, setFormValue] = useState(EMPTY_FORM);

    const notify = useCallback(
        (type, content, placement = "topEnd") =>
            toaster.push(<Message showIcon type={type} closable>{content}</Message>, { placement, duration: 4000 }),
        [toaster]
    );

    // Initial load. Failures land in the slice's `error` state, which the effect below reports.
    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            notify("error", <><strong>Error!</strong> {error}</>);
            dispatch(clearError());
        }
    }, [error, notify, dispatch]);

    /* ----- Derived data ----- */

    // featuredBrands may hold ids or brand objects; normalise to a Set of ids
    const featuredIds = useMemo(
        () => new Set((featuredBrands || []).map((entry) => (entry && typeof entry === "object" ? brandId(entry) : entry))),
        [featuredBrands]
    );
    const isFeatured = useCallback((brand) => Boolean(brand.isFeatured) || featuredIds.has(brandId(brand)), [featuredIds]);

    const filteredBrands = useMemo(() => {
        const term = searchTerm?.toLowerCase();
        return (brands || []).filter((brand) => {
            if (statusFilter === "active" && !isBrandActive(brand)) return false;
            if (statusFilter === "inactive" && isBrandActive(brand)) return false;
            if (!term) return true;
            return [brand.name, brand.title, brand.slug, brandId(brand)].some((field) => field?.toLowerCase().includes(term));
        });
    }, [brands, searchTerm, statusFilter]);

    const statistics = useMemo(() => {
        const list = allBrands || [];
        const active = list.filter(isBrandActive).length;
        return { total: list.length, active, inactive: list.length - active, featured: list.filter(isFeatured).length };
    }, [allBrands, isFeatured]);

    /* ----- Modal handlers ----- */

    const resetModals = useCallback(() => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedBrand(null);
        setFormValue(EMPTY_FORM);
    }, []);

    const handleOpenAddModal = useCallback(() => {
        setFormValue(EMPTY_FORM); // never reuse values left over from an edit
        setShowAddModal(true);
    }, []);

    const handleOpenEditModal = useCallback((brand) => {
        setSelectedBrand(brand);
        setFormValue({
            name: brand.name || brand.title || "",
            tagline: brand.tagline || "",
            slug: brand.slug || "",
            website: brand.website || brand.contactInfo?.website || "",
            isActive: isBrandActive(brand),
            isFeatured: Boolean(brand.isFeatured),
            verified: Boolean(brand.verified),
        });
        setShowEditModal(true);
    }, []);

    const handleOpenDeleteModal = useCallback((brand) => {
        setSelectedBrand(brand);
        setShowDeleteModal(true);
    }, []);

    /* ----- Create / update / delete ----- */

    const buildBrandData = () => {
        const name = formValue.name?.trim();
        if (!name) {
            notify("warning", "Brand name is required.");
            return null;
        }
        return {
            name,
            title: name,
            tagline: formValue.tagline?.trim() || "",
            slug: formValue.slug?.trim() || slugify(name), // the form promises auto-generation
            website: formValue.website?.trim() || "",
            active: formValue.isActive,
            isActive: formValue.isActive,
            isFeatured: formValue.isFeatured,
            verified: formValue.verified,
        };
    };

    // Each handler closes its modal only on success, so a failed request keeps the user's input.
    const handleCreate = async () => {
        const data = buildBrandData();
        if (!data) return;
        try {
            await dispatch(customCreateBrand(data)).unwrap();
            notify("success", <strong>Brand created!</strong>, "topCenter");
            resetModals();
            dispatch(fetchBrands());
        } catch (err) {
            console.error("Failed to create brand:", err);
        }
    };

    const handleUpdate = async () => {
        const data = buildBrandData();
        if (!data || !selectedBrand) return;
        try {
            await dispatch(updateBrand({ id: brandId(selectedBrand), data })).unwrap();
            notify("success", <strong>Brand updated!</strong>, "topCenter");
            resetModals();
            dispatch(fetchBrands());
        } catch (err) {
            console.error("Failed to update brand:", err);
        }
    };

    const handleDelete = async () => {
        if (!selectedBrand) return;
        try {
            await dispatch(deleteBrand({ id: brandId(selectedBrand) })).unwrap();
            notify("success", <strong>Brand removed successfully!</strong>, "topCenter");
            resetModals();
            dispatch(fetchBrands());
        } catch (err) {
            console.error("Failed to remove brand:", err);
        }
    };

    /* ----- Filters ----- */

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        dispatch(setFilters({ ...filters, active: status === "all" ? undefined : status === "active" }));
    };

    const handleClearFilters = () => {
        dispatch(setSearchTerm(""));
        setStatusFilter("all");
        dispatch(setFilters({ ...filters, active: undefined })); // keep any other filters intact
    };

    /* ----- Table ----- */

    // Plain values here so ReactTable can sort and filter them; JSX lives in each column's Cell.
    const tableData = useMemo(
        () =>
            filteredBrands.map((brand) => ({
                id: brandId(brand),
                brand,
                logoUrl: brandLogo(brand),
                name: brandName(brand),
                slug: brand.slug || "",
                status: getBrandStatus(brand).label,
                productCount: brandProducts(brand),
                featured: isFeatured(brand) ? "Featured" : "",
            })),
        [filteredBrands, isFeatured]
    );

    const columns = useMemo(
        () => normalizeCells([
            {
                Header: "Logo",
                id: "logo",
                accessor: "logoUrl",
                sortable: false,
                filterable: false,
                width: 90,
                Cell: ({ original }) => (
                    <img
                        src={original.logoUrl}
                        alt={original.name}
                        onError={showPlaceholder}
                        style={{ width: 50, height: 50, objectFit: "contain", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "white", padding: 5 }}
                    />
                ),
            },
            {
                Header: "Brand Name",
                accessor: "name",
                filterMethod: includesFilter,
                Cell: ({ original }) => (
                    <div className="d-flex flex-column">
                        <span className="text-white font-weight-bold">{original.name}</span>
                        {original.slug && <small className="text-light-2" style={{ fontSize: 11 }}>/{original.slug}</small>}
                    </div>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                filterMethod: startsWithFilter,
                Cell: ({ original }) => {
                    const status = getBrandStatus(original.brand);
                    return (
                        <Badge color={status.color} pill className="px-3">
                            <i className={`fa ${status.icon} mr-2`} aria-hidden="true"></i>
                            {status.label}
                        </Badge>
                    );
                },
            },
            {
                Header: "Products",
                accessor: "productCount",
                filterMethod: includesFilter,
                Cell: ({ original }) => (
                    <span className="text-light-1">
                        <i className="fa fa-shopping-bag mr-2" aria-hidden="true"></i>
                        {original.productCount} {original.productCount === 1 ? "product" : "products"}
                    </span>
                ),
            },
            {
                Header: "Featured",
                accessor: "featured",
                filterMethod: includesFilter,
                Cell: ({ value }) =>
                    value ? (
                        <span className="text-warning"><i className="fa fa-star mr-2" aria-hidden="true"></i>Featured</span>
                    ) : (
                        <span className="text-light-2">-</span>
                    ),
            },
            {
                Header: "Actions",
                id: "actions",
                accessor: (row) => row.brand,
                sortable: false,
                filterable: false,
                Cell: ({ value: brand }) => (
                    <div className="d-flex" style={GAP}>
                        <Button color="primary" size="sm" className="btn-round" title="Edit brand" aria-label={`Edit ${brandName(brand)}`} onClick={() => handleOpenEditModal(brand)}>
                            <i className="fa fa-edit" aria-hidden="true"></i>
                        </Button>
                        <Button color="danger" size="sm" className="btn-round" title="Delete brand" aria-label={`Delete ${brandName(brand)}`} onClick={() => handleOpenDeleteModal(brand)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </Button>
                    </div>
                ),
            },
        ]),
        [handleOpenEditModal, handleOpenDeleteModal]
    );

    // Show loader only on the very first fetch
    if (loading && (!brands || brands.length === 0)) {
        return <Loader />;
    }

    const hasFilters = Boolean(searchTerm) || statusFilter !== "all";

    return (
        <>
            <div className="container-fluid">
                <Row className="mb-4">
                    <StatCard icon="fa-tag" tone="primary" label="Total Brands" value={statistics.total} />
                    <StatCard icon="fa-check-circle" tone="success" label="Active" value={statistics.active} />
                    <StatCard icon="fa-times-circle" tone="danger" label="Inactive" value={statistics.inactive} />
                    <StatCard icon="fa-star" tone="warning" label="Featured" value={statistics.featured} />
                </Row>

                <Row>
                    <Col md="12">
                        <Card className="media-object">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <div>
                                    <CardTitle tag="h4" className="mb-0">
                                        <i className="fa fa-tag mr-2" aria-hidden="true"></i>
                                        All Brands
                                    </CardTitle>
                                    <small className="text-light-2">Manage your store brands</small>
                                </div>
                                <div className="d-flex align-items-center" style={GAP}>
                                    <div className="btn-group mr-2">
                                        <Button color={viewMode === "list" ? "info" : "secondary"} size="sm" onClick={() => setViewMode("list")} className="btn-round" aria-label="List view">
                                            <i className="fa fa-list" aria-hidden="true"></i>
                                        </Button>
                                        <Button color={viewMode === "grid" ? "info" : "secondary"} size="sm" onClick={() => setViewMode("grid")} className="btn-round" aria-label="Grid view">
                                            <i className="fa fa-th" aria-hidden="true"></i>
                                        </Button>
                                    </div>
                                    <Button color="primary" size="sm" onClick={handleOpenAddModal} className="btn-round">
                                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                        Add Brand
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* position-relative so the loading overlay covers this card, not the page */}
                            <CardBody className="position-relative">
                                {/* Search and filter */}
                                <Row className="mb-4">
                                    <Col md="6">
                                        <div className="position-relative">
                                            <Input
                                                type="text"
                                                placeholder="Search brands..."
                                                value={searchTerm || ""}
                                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                                style={{ paddingLeft: 35 }}
                                                aria-label="Search brands"
                                            />
                                            <i className="fa fa-search" aria-hidden="true" style={{ position: "absolute", left: 12, top: 12, color: "rgba(255,255,255,0.5)" }}></i>
                                        </div>
                                    </Col>
                                    <Col md="3">
                                        <UncontrolledDropdown>
                                            <DropdownToggle caret color="light" className="w-100 text-left">
                                                <i className="fa fa-filter mr-2" aria-hidden="true"></i>
                                                {statusFilter === "all" ? "All Status" : statusFilter === "active" ? "Active" : "Inactive"}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleStatusFilter("all")}>All Status</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => handleStatusFilter("active")}>
                                                    <i className="fa fa-check-circle text-success mr-2" aria-hidden="true"></i>
                                                    Active
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleStatusFilter("inactive")}>
                                                    <i className="fa fa-times-circle text-danger mr-2" aria-hidden="true"></i>
                                                    Inactive
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col md="3" className="text-right">
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
                                            <i className="fa fa-tag" aria-hidden="true" style={{ fontSize: 64, opacity: 0.3 }}></i>
                                            <p className="text-light-2 mt-3">{hasFilters ? "No brands match your filters" : "No brands found. Create your first brand!"}</p>
                                            {!hasFilters && (
                                                <Button color="primary" onClick={handleOpenAddModal} className="btn-round mt-3">
                                                    <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                                    Create First Brand
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <Row>
                                        {filteredBrands.map((brand) => {
                                            const status = getBrandStatus(brand);
                                            return (
                                                <Col md="4" lg="3" key={brandId(brand)} className="mb-4">
                                                    <Card className="brand-card h-100">
                                                        <div className="position-relative" style={{ padding: 20, backgroundColor: "white" }}>
                                                            <img src={brandLogo(brand)} onError={showPlaceholder} className="card-img-top" alt={brandName(brand)} style={{ height: 120, objectFit: "contain" }} />
                                                            <Badge color={status.color} className="position-absolute" style={{ top: 10, right: 10 }}>{status.label}</Badge>
                                                            {isFeatured(brand) && (
                                                                <Badge color="warning" className="position-absolute" style={{ top: 10, left: 10 }}>
                                                                    <i className="fa fa-star mr-1" aria-hidden="true"></i>
                                                                    Featured
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <CardBody>
                                                            <h6 className="text-white mb-2">{brandName(brand)}</h6>
                                                            {brand.description && (
                                                                <p className="text-light-2 mb-3" style={{ fontSize: 12, minHeight: 40 }}>{truncate(brand.description, 80)}</p>
                                                            )}
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <Badge color="light" pill>
                                                                    <i className="fa fa-shopping-bag mr-1" aria-hidden="true"></i>
                                                                    {brandProducts(brand)}
                                                                </Badge>
                                                                {brand.slug && <small className="text-light-2">/{brand.slug}</small>}
                                                            </div>
                                                            <div className="d-flex justify-content-between" style={GAP}>
                                                                <Button color="primary" size="sm" className="btn-round flex-fill" aria-label={`Edit ${brandName(brand)}`} onClick={() => handleOpenEditModal(brand)}>
                                                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                                                </Button>
                                                                <Button color="danger" size="sm" className="btn-round flex-fill" aria-label={`Delete ${brandName(brand)}`} onClick={() => handleOpenDeleteModal(brand)}>
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
                                {loading && brands && brands.length > 0 && (
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

            {/* Add brand */}
            <Modal open={showAddModal} onClose={resetModals} size="md" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                        Add New Brand
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BrandFormFields formValue={formValue} setFormValue={setFormValue} slugHint="brand-slug (leave empty to auto-generate)" />
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleCreate} appearance="primary">
                        <i className="fa fa-check mr-2" aria-hidden="true"></i>
                        Create Brand
                    </RSButton>
                    <RSButton onClick={resetModals} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>

            {/* Edit brand */}
            <Modal open={showEditModal} onClose={resetModals} size="md" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-edit mr-2" aria-hidden="true"></i>
                        Edit Brand
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BrandFormFields formValue={formValue} setFormValue={setFormValue} slugHint="brand-slug" />
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleUpdate} appearance="primary">
                        <i className="fa fa-check mr-2" aria-hidden="true"></i>
                        Update Brand
                    </RSButton>
                    <RSButton onClick={resetModals} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>

            {/* Delete confirmation */}
            <Modal open={showDeleteModal} onClose={resetModals} size="xs" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-exclamation-triangle mr-2 text-danger" aria-hidden="true"></i>
                        Delete Brand?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ color: "rgba(255,255,255,0.7)" }}>
                        Are you sure you want to delete &quot;<strong style={{ color: "white" }}>{selectedBrand && brandName(selectedBrand)}</strong>&quot;? This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleDelete} appearance="primary" color="red">
                        <i className="fa fa-trash mr-2" aria-hidden="true"></i>
                        Yes, Delete It
                    </RSButton>
                    <RSButton onClick={resetModals} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default BrandList;