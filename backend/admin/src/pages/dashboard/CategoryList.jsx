import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button, Input, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Modal, Form, Input as RSInput, Button as RSButton, useToaster, Message, SelectPicker, Toggle } from "rsuite";
import { useSelector, useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTable";
import normalizeCells from "../../components/ReactTable/NormalizeCells";
import Loader from "../../components/Loader/Loading";
import StatCard from "../../components/common/StatCard";
import { fetchCategories, updateCategory, deleteCategory, selectAllCategories, selectLoading, selectError, setSearchTerm, selectSearchTerm, selectFilters, setFilters, clearError, createCustomCat } from "../../features/categories/slice.js";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;
const Textarea = React.forwardRef((props, ref) => <RSInput {...props} as="textarea" ref={ref} />);

/* -------------------------------------------------------------------------
   Constants + helpers (outside the component so they are not rebuilt on render)
   ---------------------------------------------------------------------- */

const CATEGORY_STATUS = {
    active: { color: "success", icon: "fa-check-circle", label: "Active" },
    inactive: { color: "danger", icon: "fa-times-circle", label: "Inactive" },
};

const DEFAULT_ICON = "fa-tag";
const DEFAULT_COLOR = "#7934f3";

const EMPTY_FORM = { title: "", description: "", slug: "", parent: null, icon: DEFAULT_ICON, color: DEFAULT_COLOR, isActive: true, isFeatured: false };

const ICON_OPTIONS = [
    { label: "Tag", value: "fa-tag" },
    { label: "Folder", value: "fa-folder" },
    { label: "Star", value: "fa-star" },
    { label: "Heart", value: "fa-heart" },
    { label: "Bookmark", value: "fa-bookmark" },
    { label: "Shopping Bag", value: "fa-shopping-bag" },
    { label: "Laptop", value: "fa-laptop" },
    { label: "Mobile", value: "fa-mobile" },
    { label: "Camera", value: "fa-camera" },
    { label: "Book", value: "fa-book" },
    { label: "Music", value: "fa-music" },
    { label: "Film", value: "fa-film" },
    { label: "Gamepad", value: "fa-gamepad" },
    { label: "Coffee", value: "fa-coffee" },
];

const COLOR_OPTIONS = [
    { label: "Purple", value: "#7934f3" },
    { label: "Cyan", value: "#00bcd4" },
    { label: "Green", value: "#4caf50" },
    { label: "Orange", value: "#ff9800" },
    { label: "Red", value: "#f44336" },
    { label: "Pink", value: "#e91e63" },
    { label: "Deep Purple", value: "#9c27b0" },
    { label: "Indigo", value: "#3f51b5" },
    { label: "Teal", value: "#009688" },
    { label: "Brown", value: "#795548" },
];

const GAP = { gap: 8 }; // Bootstrap 4 has no `gap-*` utilities

const slugify = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const truncate = (text, max) => (text && text.length > max ? `${text.slice(0, max)}...` : text);

const categoryId = (category) => category._id || category.id;
const categoryTitle = (category) => category.title || category.name || "Untitled";
const isCategoryActive = (category) => (category.isActive ?? category.active) !== false;
const getCategoryStatus = (category) => (isCategoryActive(category) ? CATEGORY_STATUS.active : CATEGORY_STATUS.inactive);
const itemCountOf = (category) => category.itemCount ?? category.productCount ?? 0;
// `parent` may be an id or a populated category; the picker needs the id
const parentIdOf = (category) => (category.parent && typeof category.parent === "object" ? categoryId(category.parent) : category.parent) || null;
// Older records only have `url` ("/category/some-slug")
const slugOf = (category) => category.slug || (category.url ? category.url.replace(/^\/?category\//, "") : "");

// react-table v6 filters by exact match unless told otherwise
const includesFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().includes(String(filter.value).toLowerCase());
const startsWithFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().startsWith(String(filter.value).toLowerCase());

const IconTile = ({ icon, color, size = 40, iconSize = 20, radius = 8 }) => (
    <div className="d-flex align-items-center justify-content-center mx-auto" style={{ width: size, height: size, borderRadius: radius, backgroundColor: color || DEFAULT_COLOR }}>
        <i className={`fa ${icon || DEFAULT_ICON}`} aria-hidden="true" style={{ fontSize: iconSize, color: "white" }}></i>
    </div>
);

const ColorSwatch = ({ color }) => (
    <span style={{ display: "inline-block", width: 16, height: 16, backgroundColor: color, borderRadius: 3, marginRight: 8 }} />
);

/** Shared fields for the add and edit modals. */
const CategoryFormFields = ({ formValue, setFormValue, parentOptions, slugHint }) => (
    <Form fluid formValue={formValue} onChange={setFormValue}>
        <FormGroup>
            <ControlLabel>Category Title *</ControlLabel>
            <FormControl name="title" placeholder="Enter category name..." />
        </FormGroup>
        <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl name="description" rows={3} accepter={Textarea} placeholder="Enter category description..." />
        </FormGroup>
        <Row>
            <Col md={12}>
                <FormGroup>
                    <ControlLabel>Slug</ControlLabel>
                    <FormControl name="slug" placeholder={slugHint} />
                </FormGroup>
            </Col>
            <Col md={12}>
                <FormGroup>
                    <ControlLabel>Parent Category</ControlLabel>
                    <FormControl name="parent" accepter={SelectPicker} data={parentOptions} block searchable placeholder="Select parent category (optional)" />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <FormGroup>
                    <ControlLabel>Icon</ControlLabel>
                    <FormControl
                        name="icon"
                        accepter={SelectPicker}
                        data={ICON_OPTIONS}
                        block
                        cleanable={false}
                        placeholder="Select icon"
                        renderMenuItem={(label, item) => (
                            <div className="d-flex align-items-center">
                                <i className={`fa ${item.value} mr-2`} aria-hidden="true"></i>
                                {label}
                            </div>
                        )}
                        renderValue={(value, item) => (
                            <div className="d-flex align-items-center">
                                <i className={`fa ${value} mr-2`} aria-hidden="true"></i>
                                {item?.label}
                            </div>
                        )}
                    />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <ControlLabel>Color</ControlLabel>
                    <FormControl
                        name="color"
                        accepter={SelectPicker}
                        data={COLOR_OPTIONS}
                        block
                        cleanable={false}
                        placeholder="Select color"
                        renderMenuItem={(label, item) => (
                            <div className="d-flex align-items-center">
                                <ColorSwatch color={item.value} />
                                {label}
                            </div>
                        )}
                        renderValue={(value, item) => (
                            <div className="d-flex align-items-center">
                                <ColorSwatch color={value} />
                                {item?.label}
                            </div>
                        )}
                    />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <FormGroup>
                    <ControlLabel>Active Status</ControlLabel>
                    <div className="mt-2">
                        <Toggle checked={formValue.isActive} onChange={(checked) => setFormValue((prev) => ({ ...prev, isActive: checked }))} checkedChildren="Active" unCheckedChildren="Inactive" />
                    </div>
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <ControlLabel>Featured</ControlLabel>
                    <div className="mt-2">
                        <Toggle checked={formValue.isFeatured} onChange={(checked) => setFormValue((prev) => ({ ...prev, isFeatured: checked }))} checkedChildren="Featured" unCheckedChildren="Normal" />
                    </div>
                </FormGroup>
            </Col>
        </Row>
    </Form>
);

/* -------------------------------------------------------------------------
   Page
   ---------------------------------------------------------------------- */

const CategoryList = () => {
    const dispatch = useDispatch();
    const toaster = useToaster();

    // Redux state
    const error = useSelector(selectError);
    const loading = useSelector(selectLoading);
    const categories = useSelector(selectAllCategories);
    const searchTerm = useSelector(selectSearchTerm);
    const filters = useSelector(selectFilters);

    // Local state
    const [viewMode, setViewMode] = useState("list");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formValue, setFormValue] = useState(EMPTY_FORM);

    const notify = useCallback(
        (type, content, placement = "topEnd") =>
            toaster.push(<Message showIcon type={type} closable>{content}</Message>, { placement, duration: 4000 }),
        [toaster]
    );

    // Initial load. Failures land in the slice's `error` state, which the effect below reports.
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // The old effect cleared the error without ever showing it
    useEffect(() => {
        if (error) {
            notify("error", <><strong>Error!</strong> {error}</>);
            dispatch(clearError());
        }
    }, [error, notify, dispatch]);

    /* ----- Derived data ----- */

    const filteredCategories = useMemo(() => {
        const term = searchTerm?.toLowerCase();
        return (categories || []).filter((category) => {
            if (statusFilter === "active" && !isCategoryActive(category)) return false;
            if (statusFilter === "inactive" && isCategoryActive(category)) return false;
            if (!term) return true;
            return [category.title, category.name, category.description, category.slug].some((field) => field?.toLowerCase().includes(term));
        });
    }, [categories, searchTerm, statusFilter]);

    const statistics = useMemo(() => {
        const list = categories || [];
        const active = list.filter(isCategoryActive).length;
        return { total: list.length, active, inactive: list.length - active, featured: list.filter((c) => c.isFeatured === true).length };
    }, [categories]);

    const parentOptions = useMemo(
        () =>
            (categories || [])
                .filter((category) => !selectedCategory || categoryId(category) !== categoryId(selectedCategory)) // a category cannot be its own parent
                .map((category) => ({ label: categoryTitle(category), value: categoryId(category) })),
        [categories, selectedCategory]
    );

    /* ----- Modal handlers ----- */

    const resetModals = useCallback(() => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedCategory(null);
        setFormValue(EMPTY_FORM);
    }, []);

    const handleOpenAddModal = useCallback(() => {
        setSelectedCategory(null);
        setFormValue(EMPTY_FORM); // never reuse values left over from an edit
        setShowAddModal(true);
    }, []);

    // Takes just the category: the grid view used to call this with the wrong arguments and crashed
    const handleOpenEditModal = useCallback((category) => {
        setSelectedCategory(category);
        setFormValue({
            title: categoryTitle(category),
            description: category.description || "",
            slug: slugOf(category),
            parent: parentIdOf(category),
            icon: category.icon || DEFAULT_ICON,
            color: category.color || DEFAULT_COLOR,
            isActive: isCategoryActive(category),
            isFeatured: Boolean(category.isFeatured),
        });
        setShowEditModal(true);
    }, []);

    const handleOpenDeleteModal = useCallback((category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    }, []);

    /* ----- Create / update / delete ----- */

    const buildCategoryData = () => {
        const title = formValue.title?.trim();
        if (!title || title.length < 2) {
            notify("warning", "Category title must be at least 2 characters");
            return null;
        }
        const slug = formValue.slug?.trim() || slugify(title);
        return {
            title,
            description: formValue.description?.trim() || "", // an emptied description now stays empty
            slug,
            url: `/category/${slug}`,
            parent: formValue.parent || null,
            isActive: formValue.isActive,
            isFeatured: formValue.isFeatured,
            icon: formValue.icon,
            color: formValue.color,
        };
    };

    // Each handler closes its modal only on success, so a failed request keeps the user's input.
    const handleCreate = async () => {
        const data = buildCategoryData();
        if (!data) return;
        try {
            await dispatch(createCustomCat(data)).unwrap();
            notify("success", <strong>Category created successfully!</strong>, "topCenter");
            resetModals();
            dispatch(fetchCategories());
        } catch (err) {
            console.error("Failed to create category:", err);
        }
    };

    const handleUpdate = async () => {
        const data = buildCategoryData();
        if (!data || !selectedCategory) return;
        try {
            await dispatch(updateCategory({ id: categoryId(selectedCategory), ...data })).unwrap();
            notify("success", <strong>Category updated successfully!</strong>, "topCenter");
            resetModals();
            dispatch(fetchCategories());
        } catch (err) {
            console.error("Failed to update category:", err);
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        try {
            await dispatch(deleteCategory({ id: categoryId(selectedCategory) })).unwrap();
            notify("success", <strong>Category removed successfully!</strong>, "topCenter");
            resetModals();
            dispatch(fetchCategories());
        } catch (err) {
            console.error("Failed to remove category:", err);
        }
    };

    /* ----- Filters ----- */

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        dispatch(setFilters({ ...filters, isActive: status === "all" ? undefined : status === "active" }));
    };

    const handleClearFilters = () => {
        dispatch(setSearchTerm(""));
        setStatusFilter("all");
        dispatch(setFilters({ ...filters, isActive: undefined })); // keep any other filters intact
    };

    /* ----- Table ----- */

    // Plain values here so ReactTable can sort and filter them; JSX lives in each column's Cell.
    const tableData = useMemo(
        () =>
            filteredCategories.map((category) => ({
                id: categoryId(category),
                category,
                icon: category.icon || DEFAULT_ICON,
                color: category.color || DEFAULT_COLOR,
                title: categoryTitle(category),
                slug: category.slug || "",
                description: category.description || "",
                status: getCategoryStatus(category).label,
                items: itemCountOf(category),
                featured: category.isFeatured ? "Featured" : "",
            })),
        [filteredCategories]
    );

    const columns = useMemo(
        () => normalizeCells([
            {
                Header: "Icon",
                id: "icon",
                accessor: "icon",
                sortable: false,
                filterable: false,
                width: 80,
                Cell: ({ original }) => <IconTile icon={original.icon} color={original.color} />,
            },
            {
                Header: "Category",
                accessor: "title",
                filterMethod: includesFilter,
                Cell: ({ original }) => (
                    <div className="d-flex flex-column">
                        <span className="text-white font-weight-bold">{original.title}</span>
                        {original.slug && <small className="text-light-2" style={{ fontSize: 11 }}>/{original.slug}</small>}
                    </div>
                ),
            },
            {
                Header: "Description",
                accessor: "description",
                sortable: false,
                filterMethod: includesFilter,
                Cell: ({ value }) =>
                    value ? <span className="text-light-1" style={{ fontSize: 12 }}>{truncate(value, 60)}</span> : <span className="text-light-2">No description</span>,
            },
            {
                Header: "Status",
                accessor: "status",
                filterMethod: startsWithFilter,
                Cell: ({ original }) => {
                    const status = getCategoryStatus(original.category);
                    return (
                        <Badge color={status.color} pill className="px-3">
                            <i className={`fa ${status.icon} mr-2`} aria-hidden="true"></i>
                            {status.label}
                        </Badge>
                    );
                },
            },
            {
                Header: "Items",
                accessor: "items",
                filterMethod: includesFilter,
                Cell: ({ value }) => (
                    <span className="text-light-1">
                        <i className="fa fa-folder-open mr-2" aria-hidden="true"></i>
                        {value} {value === 1 ? "item" : "items"}
                    </span>
                ),
            },
            {
                Header: "Featured",
                accessor: "featured",
                filterMethod: includesFilter,
                Cell: ({ value }) =>
                    value ? (
                        <Badge color="warning" pill>
                            <i className="fa fa-star mr-1" aria-hidden="true"></i>
                            Featured
                        </Badge>
                    ) : (
                        <span className="text-light-2">-</span>
                    ),
            },
            {
                Header: "Actions",
                id: "actions",
                accessor: (row) => row.category,
                sortable: false,
                filterable: false,
                Cell: ({ value: category }) => (
                    <div className="d-flex" style={GAP}>
                        <Button color="primary" size="sm" className="btn-round" title="Edit category" aria-label={`Edit ${categoryTitle(category)}`} onClick={() => handleOpenEditModal(category)}>
                            <i className="fa fa-edit" aria-hidden="true"></i>
                        </Button>
                        <Button color="danger" size="sm" className="btn-round" title="Delete category" aria-label={`Delete ${categoryTitle(category)}`} onClick={() => handleOpenDeleteModal(category)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </Button>
                    </div>
                ),
            },
        ]),
        [handleOpenEditModal, handleOpenDeleteModal]
    );

    // Show loader only on the very first fetch
    if (loading && (!categories || categories.length === 0)) {
        return <Loader />;
    }

    const hasFilters = Boolean(searchTerm) || statusFilter !== "all";

    return (
        <>
            <div className="container-fluid">
                <Row className="mb-4">
                    <StatCard icon="fa-folder" tone="primary" label="Total Categories" value={statistics.total} />
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
                                        <i className="fa fa-folder mr-2" aria-hidden="true"></i>
                                        All Categories
                                    </CardTitle>
                                    <small className="text-light-2">Manage your content categories</small>
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
                                        Add Category
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
                                                placeholder="Search categories..."
                                                value={searchTerm || ""}
                                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                                style={{ paddingLeft: 35 }}
                                                aria-label="Search categories"
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
                                            <i className="fa fa-folder" aria-hidden="true" style={{ fontSize: 64, opacity: 0.3 }}></i>
                                            <p className="text-light-2 mt-3">{hasFilters ? "No categories match your filters" : "No categories found. Create your first category!"}</p>
                                            {!hasFilters && (
                                                <Button color="primary" onClick={handleOpenAddModal} className="btn-round mt-3">
                                                    <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                                    Create First Category
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <Row>
                                        {filteredCategories.map((category) => {
                                            const status = getCategoryStatus(category);
                                            return (
                                                <Col md="4" lg="3" key={categoryId(category)} className="mb-4">
                                                    <Card className="category-card h-100">
                                                        <CardBody className="text-center">
                                                            <div className="mb-3">
                                                                <IconTile icon={category.icon} color={category.color} size={80} iconSize={36} radius={16} />
                                                            </div>
                                                            <h6 className="text-white mb-2">{categoryTitle(category)}</h6>
                                                            {category.description && (
                                                                <p className="text-light-2 mb-3" style={{ fontSize: 12, minHeight: 40 }}>{truncate(category.description, 60)}</p>
                                                            )}
                                                            <div className="d-flex justify-content-center align-items-center mb-3" style={GAP}>
                                                                <Badge color={status.color} pill>{status.label}</Badge>
                                                                {category.isFeatured && (
                                                                    <Badge color="warning" pill>
                                                                        <i className="fa fa-star mr-1" aria-hidden="true"></i>
                                                                        Featured
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="mb-3">
                                                                <Badge color="light" pill>
                                                                    <i className="fa fa-folder-open mr-1" aria-hidden="true"></i>
                                                                    {itemCountOf(category)} items
                                                                </Badge>
                                                            </div>
                                                            <div className="d-flex justify-content-between" style={GAP}>
                                                                <Button color="primary" size="sm" className="btn-round flex-fill" aria-label={`Edit ${categoryTitle(category)}`} onClick={() => handleOpenEditModal(category)}>
                                                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                                                </Button>
                                                                <Button color="danger" size="sm" className="btn-round flex-fill" aria-label={`Delete ${categoryTitle(category)}`} onClick={() => handleOpenDeleteModal(category)}>
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
                                {loading && categories && categories.length > 0 && (
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

            {/* Add category */}
            <Modal open={showAddModal} onClose={resetModals} size="md" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                        Add New Category
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CategoryFormFields formValue={formValue} setFormValue={setFormValue} parentOptions={parentOptions} slugHint="category-slug (leave empty to auto-generate)" />
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleCreate} appearance="primary">
                        <i className="fa fa-check mr-2" aria-hidden="true"></i>
                        Create Category
                    </RSButton>
                    <RSButton onClick={resetModals} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>

            {/* Edit category */}
            <Modal open={showEditModal} onClose={resetModals} size="md" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-edit mr-2" aria-hidden="true"></i>
                        Edit Category
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CategoryFormFields formValue={formValue} setFormValue={setFormValue} parentOptions={parentOptions} slugHint="category-slug" />
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleUpdate} appearance="primary">
                        <i className="fa fa-check mr-2" aria-hidden="true"></i>
                        Update Category
                    </RSButton>
                    <RSButton onClick={resetModals} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>

            {/* Delete confirmation */}
            <Modal open={showDeleteModal} onClose={resetModals} size="xs" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-exclamation-triangle mr-2 text-danger" aria-hidden="true"></i>
                        Delete Category?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ color: "rgba(255,255,255,0.7)" }}>
                        Are you sure you want to delete &quot;<strong style={{ color: "white" }}>{selectedCategory && categoryTitle(selectedCategory)}</strong>&quot;? This action cannot be undone.
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

export default CategoryList;