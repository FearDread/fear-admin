import React, { useState, useEffect, useMemo } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Button,
    Badge,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { Modal, Button as RSButton } from "rsuite";
import { useSelector, useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTable";
import Loader from "../../components/Loader/Loading";
import {
    selectAllHipcomic,
    selectSortedHipcomic,
    selectHipcomicStats,
    selectHipcomicPublishers,
    selectViewMode,
    selectSearchTerm,
    selectFilters,
    selectSorting,
    selectLoading,
    selectError,
    setViewMode,
    setSearchTerm,
    setFilters,
    clearFilters,
    setSorting,
    clearError,
    fetchHipcomic,
    deleteHipcomicItem,
} from "../../features/hipcomics/slice.js";

const GRID_PAGE_SIZE = 60;

const SORT_OPTIONS = [
    { key: "series", label: "Series A–Z", sortBy: "series", sortOrder: "asc" },
    { key: "fmv", label: "FMV: high to low", sortBy: "fmv", sortOrder: "desc" },
    { key: "grade", label: "Grade: high to low", sortBy: "gradeNumeric", sortOrder: "desc" },
];

/* ----------------------------------------------------------------- helpers */

const money = (n) => (n == null ? "—" : `$${Number(n).toFixed(2)}`);

const prettyPublisher = (slug) =>
    slug
        ? slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
            .replace(/\bDc\b/, "DC")
        : "Unknown";

const gradeColor = (n) => {
    if (n == null) return "secondary";
    if (n >= 9.4) return "success";
    if (n >= 8) return "info";
    if (n >= 6) return "warning";
    return "danger";
};

/** Cover art isn't part of the export, so show the issue number unless an image URL exists. */
const Cover = ({ item, width, height, fontSize }) => {
    if (item.image) {
        return (
            <img
                src={item.image}
                alt={item.title}
                className="rounded"
                style={{ width, height, objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)" }}
            />
        );
    }
    return (
        <div
            className="rounded d-flex flex-column justify-content-center align-items-center text-white"
            style={{
                width,
                height,
                background: "linear-gradient(135deg, rgba(23,85,255,0.35), rgba(255,255,255,0.08))",
                border: "2px solid rgba(255,255,255,0.2)",
                fontSize,
                fontWeight: 700,
                lineHeight: 1.1,
            }}
        >
            <span>{item.issue ? `#${item.issue}` : <i className="fa fa-book"></i>}</span>
        </div>
    );
};

/* --------------------------------------------------------------- component */

const HipcomicList = () => {
    const dispatch = useDispatch();

    // Redux state
    const error = useSelector(selectError);
    const loading = useSelector(selectLoading);
    const allItems = useSelector(selectAllHipcomic);
    const items = useSelector(selectSortedHipcomic);
    const stats = useSelector(selectHipcomicStats);
    const publisherSlugs = useSelector(selectHipcomicPublishers);
    const viewMode = useSelector(selectViewMode);
    const searchTerm = useSelector(selectSearchTerm);
    const filters = useSelector(selectFilters);
    const sorting = useSelector(selectSorting);

    // Local state
    const [gridLimit, setGridLimit] = useState(GRID_PAGE_SIZE);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const publisherFilter = filters.publisherSlug || "all";
    const filtersActive = Boolean(searchTerm) || publisherFilter !== "all";
    const activeSort =
        SORT_OPTIONS.find((o) => o.sortBy === sorting?.sortBy && o.sortOrder === sorting?.sortOrder) ||
        SORT_OPTIONS[0];

    const columns = useMemo(
        () => [
            { Header: "Cover", accessor: "avatar", sortable: false, filterable: false },
            { Header: "Comic", accessor: "title", sortable: true },
            { Header: "Publisher", accessor: "publisher", sortable: true },
            { Header: "Grade", accessor: "grade", sortable: true },
            { Header: "FMV", accessor: "fmv", sortable: true },
            { Header: "Key Issue", accessor: "key", sortable: true },
            { Header: "Actions", accessor: "actions", sortable: false, filterable: false },
        ],
        []
    );

    useEffect(() => {
        dispatch(fetchHipcomic());
        if (!sorting?.sortBy) {
            dispatch(setSorting({ sortBy: SORT_OPTIONS[0].sortBy, sortOrder: SORT_OPTIONS[0].sortOrder }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        setGridLimit(GRID_PAGE_SIZE);
    }, [searchTerm, publisherFilter, sorting?.sortBy, sorting?.sortOrder]);

    /* ------------------------------------------------------------- handlers */

    const handleView = (item) => {
        if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
    };

    const confirmDelete = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            // The slice's delete reducer removes the item from state by `id`
            await dispatch(deleteHipcomicItem({ id: selectedItem.id ?? selectedItem._id })).unwrap();
        } catch (err) {
            console.log("error deleting comic ::", err);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handlePublisherFilter = (slug) => {
        dispatch(setFilters({ ...filters, publisherSlug: slug === "all" ? null : slug }));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    /* ------------------------------------------------------------- derived */

    const tableData = useMemo(
        () =>
            items.map((item) => ({
                avatar: <Cover item={item} width="50px" height="50px" fontSize="13px" />,
                title: (
                    <div className="d-flex flex-column">
                        <span className="text-white font-weight-bold">
                            {item.title || item.series || "Untitled"}
                        </span>
                        <small className="text-light-2" style={{ fontSize: "11px" }}>
                            ID …{item.hipcomicId?.slice(-6)}
                        </small>
                    </div>
                ),
                publisher: (
                    <Badge color="primary" pill className="px-3">
                        {prettyPublisher(item.publisherSlug)}
                    </Badge>
                ),
                grade: item.grade ? (
                    <Badge color={gradeColor(item.gradeNumeric)} pill className="px-3">
                        {item.grade}
                    </Badge>
                ) : (
                    <span className="text-light-1">N/A</span>
                ),
                fmv: <span className="text-success font-weight-bold">{money(item.fmv)}</span>,
                key: item.keyIssue ? (
                    <Badge color="warning" pill className="px-3">
                        <i className="fa fa-key mr-2"></i>
                        Key
                    </Badge>
                ) : (
                    <span className="text-light-1">—</span>
                ),
                actions: (
                    <div className="d-flex gap-2">
                        <Button
                            color="info"
                            size="sm"
                            className="btn-round"
                            onClick={() => handleView(item)}
                            title="View on HipComic"
                        >
                            <i className="fa fa-eye"></i>
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            className="btn-round"
                            onClick={() => confirmDelete(item)}
                            title="Remove from database"
                        >
                            <i className="fa fa-trash"></i>
                        </Button>
                    </div>
                ),
            })),
        [items]
    );

    if (loading && (!allItems || allItems.length === 0)) {
        return <Loader />;
    }

    /* -------------------------------------------------------------- render */

    const statCards = [
        { label: "Total Comics", value: stats.total, icon: "fa-book", tone: "primary" },
        { label: "Collection FMV", value: money(stats.totalValue), icon: "fa-usd", tone: "success" },
        { label: "Key Issues", value: stats.keyIssues, icon: "fa-key", tone: "warning" },
        { label: "No FMV", value: stats.unpriced, icon: "fa-question-circle", tone: "danger" },
    ];

    const errorText = typeof error === "string" ? error : error?.message;

    return (
        <>
            <div className="container-fluid">
                <Row className="mb-4">
                    {statCards.map((stat) => (
                        <Col lg="3" md="6" key={stat.label}>
                            <Card className="card-stats media-object">
                                <CardBody>
                                    <Row>
                                        <Col xs="5">
                                            <div className={`icon-big text-center circle-1 bg-${stat.tone}-light2`}>
                                                <i className={`fa ${stat.icon} text-${stat.tone}`}></i>
                                            </div>
                                        </Col>
                                        <Col xs="7">
                                            <div className="numbers">
                                                <p className="card-category text-light-2">{stat.label}</p>
                                                <CardTitle tag="h3" className="text-white">
                                                    {stat.value}
                                                </CardTitle>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row>
                    <Col md="12">
                        <Card className="media-object">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <div>
                                    <CardTitle tag="h4" className="mb-0">
                                        <i className="fa fa-book mr-2"></i>
                                        HipComic Collection
                                    </CardTitle>
                                    <small className="text-light-2">Comics imported from your HipComic collection</small>
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <div className="btn-group mr-2">
                                        <Button
                                            color={viewMode === "list" ? "info" : "secondary"}
                                            size="sm"
                                            onClick={() => dispatch(setViewMode("list"))}
                                            className="btn-round"
                                        >
                                            <i className="fa fa-list"></i>
                                        </Button>
                                        <Button
                                            color={viewMode === "grid" ? "info" : "secondary"}
                                            size="sm"
                                            onClick={() => dispatch(setViewMode("grid"))}
                                            className="btn-round"
                                        >
                                            <i className="fa fa-th"></i>
                                        </Button>
                                    </div>
                                    <Button
                                        color="primary"
                                        size="sm"
                                        onClick={() => dispatch(fetchHipcomic())}
                                        className="btn-round"
                                    >
                                        <i className="fa fa-refresh mr-2"></i>
                                        Refresh
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardBody>
                                {/* Search and Filter Section */}
                                <Row className="mb-4">
                                    <Col md="4">
                                        <div className="position-relative">
                                            <Input
                                                type="text"
                                                placeholder="Search title, series, publisher..."
                                                value={searchTerm}
                                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                                className="form-control-rounded"
                                                style={{ paddingLeft: "35px" }}
                                            />
                                            <i
                                                className="fa fa-search"
                                                style={{
                                                    position: "absolute",
                                                    left: "12px",
                                                    top: "12px",
                                                    color: "rgba(255,255,255,0.5)",
                                                }}
                                            ></i>
                                        </div>
                                    </Col>
                                    <Col md="2">
                                        <UncontrolledDropdown>
                                            <DropdownToggle caret color="light" className="w-100 text-left">
                                                <i className="fa fa-filter mr-2"></i>
                                                {publisherFilter === "all" ? "All Publishers" : prettyPublisher(publisherFilter)}
                                            </DropdownToggle>
                                            <DropdownMenu style={{ maxHeight: "320px", overflowY: "auto" }}>
                                                <DropdownItem onClick={() => handlePublisherFilter("all")}>
                                                    All Publishers
                                                </DropdownItem>
                                                <DropdownItem divider />
                                                {publisherSlugs.map((slug) => (
                                                    <DropdownItem key={slug} onClick={() => handlePublisherFilter(slug)}>
                                                        <i className="fa fa-tag mr-2"></i>
                                                        {prettyPublisher(slug)}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col md="2">
                                        <UncontrolledDropdown>
                                            <DropdownToggle caret color="light" className="w-100 text-left">
                                                <i className="fa fa-sort mr-2"></i>
                                                {activeSort.label}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {SORT_OPTIONS.map((opt) => (
                                                    <DropdownItem
                                                        key={opt.key}
                                                        onClick={() => dispatch(setSorting({ sortBy: opt.sortBy, sortOrder: opt.sortOrder }))}
                                                    >
                                                        {opt.label}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col md="4" className="text-right">
                                        <div className="d-flex justify-content-end align-items-center gap-2">
                                            <Badge color="light" className="px-3">
                                                Total: {allItems?.length || 0}
                                            </Badge>
                                            <Badge color="info" className="px-3">
                                                Filtered: {items.length}
                                            </Badge>
                                            {filtersActive && (
                                                <Button color="secondary" size="sm" onClick={handleClearFilters}>
                                                    <i className="fa fa-times mr-2"></i>
                                                    Clear
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                {/* Error Display */}
                                {errorText && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <i className="fa fa-exclamation-triangle mr-2"></i>
                                        {errorText}
                                        <button type="button" className="close" onClick={() => dispatch(clearError())}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                )}

                                {/* Comics Table/Grid */}
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
                                                showPaginationBottom={true}
                                                className="-striped -highlight"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fa fa-book" style={{ fontSize: "64px", opacity: 0.3 }}></i>
                                            <p className="text-light-2 mt-3">
                                                {filtersActive
                                                    ? "No comics match your filters"
                                                    : "No comics found. Run the HipComic import to fill this list."}
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <Row>
                                            {items.slice(0, gridLimit).map((item) => (
                                                <Col md="3" lg="2" key={item.id || item._id || item.hipcomicId} className="mb-4">
                                                    <Card className="product-card h-100">
                                                        <div className="position-relative">
                                                            <Cover item={item} width="100%" height="200px" fontSize="32px" />
                                                            {item.grade && (
                                                                <Badge
                                                                    color={gradeColor(item.gradeNumeric)}
                                                                    className="position-absolute"
                                                                    style={{ top: "10px", right: "10px" }}
                                                                >
                                                                    {item.grade}
                                                                </Badge>
                                                            )}
                                                            {item.keyIssue && (
                                                                <Badge
                                                                    color="warning"
                                                                    className="position-absolute"
                                                                    style={{ top: "10px", left: "10px" }}
                                                                >
                                                                    <i className="fa fa-key"></i>
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <CardBody>
                                                            <h6 className="text-white mb-2">{item.title || item.series}</h6>
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <Badge color="primary" pill>
                                                                    {prettyPublisher(item.publisherSlug)}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-success font-weight-bold mb-3">{money(item.fmv)}</div>
                                                            <div className="d-flex justify-content-between gap-2">
                                                                <Button
                                                                    color="info"
                                                                    size="sm"
                                                                    className="btn-round flex-fill"
                                                                    onClick={() => handleView(item)}
                                                                    title="View on HipComic"
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </Button>
                                                                <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    className="btn-round flex-fill"
                                                                    onClick={() => confirmDelete(item)}
                                                                    title="Remove from database"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </Button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                        {items.length > gridLimit && (
                                            <div className="text-center">
                                                <Button
                                                    color="secondary"
                                                    className="btn-round"
                                                    onClick={() => setGridLimit((n) => n + GRID_PAGE_SIZE)}
                                                >
                                                    Show more ({items.length - gridLimit} remaining)
                                                </Button>
                                            </div>
                                        )}
                                        {items.length === 0 && (
                                            <div className="text-center py-5">
                                                <i className="fa fa-book" style={{ fontSize: "64px", opacity: 0.3 }}></i>
                                                <p className="text-light-2 mt-3">No comics match your filters</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Loading Overlay */}
                                {loading && allItems && allItems.length > 0 && (
                                    <div
                                        className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                                        style={{ top: 0, left: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }}
                                    >
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

            {/* Delete Confirmation Modal */}
            <Modal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                size="xs"
                className="rs-theme-dark"
            >
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-exclamation-triangle mr-2 text-danger"></i>
                        Remove Comic?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ color: "rgba(255,255,255,0.7)" }}>
                        Remove "<strong style={{ color: "white" }}>{selectedItem?.title}</strong>" from your
                        database? It stays in your HipComic collection, and re-running the import will add it back.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleDelete} appearance="primary" color="red">
                        <i className="fa fa-trash mr-2"></i>
                        Yes, Remove It
                    </RSButton>
                    <RSButton onClick={() => setShowDeleteModal(false)} appearance="subtle">
                        Cancel
                    </RSButton>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default HipcomicList;