import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Badge,
  ButtonGroup,
} from "reactstrap";
import { 
  Modal, 
  Form, 
  Input, 
  Button as RSButton,
  ButtonToolbar,
  SelectPicker,
  Message,
  useToaster
} from "rsuite";
import moment from "moment";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  selectAllEvents,
  selectLoading,
  selectError,
  selectSuccess,
  clearError
} from "../../features/events/slice";
import Loader from "../../components/Loader/Loading";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const Calendar = () => {
  const dispatch = useDispatch();
  const toaster = useToaster();

  // Redux state from FeatureFactory
  const events = useSelector(selectAllEvents);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  // Local state for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form state
  const [formValue, setFormValue] = useState({
    title: '',
    description: '',
    color: 'default'
  });
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  // Event color options
  const EVENT_COLORS = {
    default: { bg: "#7934f3", label: "Default" },
    azure: { bg: "#00bcd4", label: "Azure" },
    green: { bg: "#4caf50", label: "Success" },
    orange: { bg: "#ff9800", label: "Warning" },
    red: { bg: "#f44336", label: "Danger" },
    rose: { bg: "#e91e63", label: "Rose" }
  };

  const colorOptions = Object.entries(EVENT_COLORS).map(([key, { label }]) => ({
    label,
    value: key
  }));

  /**
   * Fetch events on mount
   */
  useEffect(() => {
    dispatch(fetchEvents());

    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  /**
   * Handle errors with toast notifications
   */
  useEffect(() => {
    if (error) {
      toaster.push(
        <Message showIcon type="error" closable>
          <strong>Error!</strong> {error}
        </Message>,
        { placement: 'topEnd', duration: 5000 }
      );
      dispatch(clearError());
    }
  }, [error, toaster, dispatch]);

  /**
   * Handle success with toast notifications
   */
  useEffect(() => {
    if (success) {
      toaster.push(
        <Message showIcon type="success" closable>
          <strong>Success!</strong> Operation completed successfully
        </Message>,
        { placement: 'topEnd', duration: 3000 }
      );
    }
  }, [success, toaster]);

  /**
   * Transform events for BigCalendar
   */
  const calendarEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
      title: event.title || event.name || "Untitled Event"
    }));
  }, [events]);

  /**
   * Calculate statistics
   */
  const statistics = useMemo(() => {
    const now = moment();
    const thisMonth = events.filter(e => 
      moment(e.start).month() === now.month() &&
      moment(e.start).year() === now.year()
    );
    const upcoming = events.filter(e => moment(e.start).isAfter(now));
    const past = events.filter(e => moment(e.end).isBefore(now));
    
    return {
      total: events.length,
      thisMonth: thisMonth.length,
      upcoming: upcoming.length,
      past: past.length
    };
  }, [events]);

  /**
   * Handle event selection (click)
   */
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  }, []);

  /**
   * Handle slot selection (create new event)
   */
  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedSlot(slotInfo);
    setFormValue({
      title: '',
      description: '',
      color: 'default'
    });
    setShowCreateModal(true);
  }, []);

  /**
   * Event styling
   */
  const eventStyleGetter = useCallback((event) => {
    const backgroundColor = EVENT_COLORS[event.color]?.bg || EVENT_COLORS.default.bg;

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        padding: "4px 8px",
        fontSize: "0.85rem",
        fontWeight: "500"
      }
    };
  }, []);

  /**
   * Create new event
   */
  const handleCreateEvent = async () => {
    if (!formValue.title || formValue.title.trim() === "") {
      toaster.push(
        <Message showIcon type="warning">
          Event title is required
        </Message>,
        { placement: 'topEnd' }
      );
      return;
    }

    try {
      const newEvent = {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || "",
        start: selectedSlot.start.toISOString(),
        end: selectedSlot.end.toISOString(),
        color: formValue.color || "default",
        allDay: selectedSlot.slots && selectedSlot.slots.length === 1,
        createdAt: new Date().toISOString()
      };

      await dispatch(createEvent(newEvent)).unwrap();
      
      setShowCreateModal(false);
      toaster.push(
        <Message showIcon type="success">
          Event created successfully!
        </Message>,
        { placement: 'topEnd' }
      );
      
      // Refresh events
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to create event:", err);
      toaster.push(
        <Message showIcon type="error">
          {err.message || "Failed to create event"}
        </Message>,
        { placement: 'topEnd' }
      );
    }
  };

  /**
   * Open edit modal
   */
  const handleOpenEditModal = () => {
    setFormValue({
      title: selectedEvent.title,
      description: selectedEvent.description || '',
      color: selectedEvent.color || 'default'
    });
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  /**
   * Update event
   */
  const handleUpdateEvent = async () => {
    if (!formValue.title || formValue.title.trim() === "") {
      toaster.push(
        <Message showIcon type="warning">
          Event title is required
        </Message>,
        { placement: 'topEnd' }
      );
      return;
    }

    try {
      const updatedEvent = {
        ...selectedEvent,
        title: formValue.title.trim(),
        description: formValue.description?.trim() || "",
        color: formValue.color,
        updatedAt: new Date().toISOString()
      };

      await dispatch(updateEvent({
        id: selectedEvent.id || selectedEvent._id,
        data: updatedEvent
      })).unwrap();

      setShowEditModal(false);
      toaster.push(
        <Message showIcon type="success">
          Event updated successfully!
        </Message>,
        { placement: 'topEnd' }
      );
      
      // Refresh events
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to update event:", err);
      toaster.push(
        <Message showIcon type="error">
          {err.message || "Failed to update event"}
        </Message>,
        { placement: 'topEnd' }
      );
    }
  };

  /**
   * Open delete confirmation
   */
  const handleOpenDeleteModal = () => {
    setShowDetailsModal(false);
    setShowDeleteModal(true);
  };

  /**
   * Delete event
   */
  const handleDeleteEvent = async () => {
    try {
      await dispatch(deleteEvent(selectedEvent.id || selectedEvent._id)).unwrap();
      
      setShowDeleteModal(false);
      toaster.push(
        <Message showIcon type="success">
          Event deleted successfully!
        </Message>,
        { placement: 'topEnd' }
      );
      
      // Refresh events
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to delete event:", err);
      toaster.push(
        <Message showIcon type="error">
          {err.message || "Failed to delete event"}
        </Message>,
        { placement: 'topEnd' }
      );
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  // Calculate event duration
  const getEventDuration = (event) => {
    const duration = moment(event.end).diff(moment(event.start), "minutes");
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours === 0 && minutes === 0) return "Less than 1 minute";
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`;
  };

  // Show loader while fetching initial data
  if (loading && (!events || events.length === 0)) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-fluid ">
        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col lg="3" md="6">
            <Card className="card-stats media-object">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center circle-1 bg-primary-light2">
                      <i className="fa fa-calendar text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Events</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.total}
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
                    <div className="icon-big text-center circle-1 bg-success-light2">
                      <i className="fa fa-calendar-check-o text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">This Month</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.thisMonth}
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
                    <div className="icon-big text-center circle-1 bg-info-light2">
                      <i className="fa fa-arrow-right text-info"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Upcoming</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.upcoming}
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
                      <i className="fa fa-history text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Past Events</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.past}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Calendar Card */}
        <Row>
          <Col md="12">
            <Card className="media-object">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <div>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-calendar mr-2"></i>
                    Event Calendar
                  </CardTitle>
                  <small className="text-light-2">
                    Click on a date to create a new event, or click an event to view details
                  </small>
                </div>
                <ButtonGroup>
                  <Button
                    color={view === "month" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleViewChange("month")}
                  >
                    Month
                  </Button>
                  <Button
                    color={view === "week" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleViewChange("week")}
                  >
                    Week
                  </Button>
                  <Button
                    color={view === "day" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleViewChange("day")}
                  >
                    Day
                  </Button>
                  <Button
                    color={view === "agenda" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleViewChange("agenda")}
                  >
                    Agenda
                  </Button>
                </ButtonGroup>
              </CardHeader>
              <CardBody style={{ minHeight: "600px" }}>
                <BigCalendar
                  selectable
                  localizer={localizer}
                  events={calendarEvents}
                  view={view}
                  date={date}
                  onView={handleViewChange}
                  onNavigate={handleNavigate}
                  defaultView="month"
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  eventPropGetter={eventStyleGetter}
                  style={{ height: "550px" }}
                  popup
                  tooltipAccessor={(event) => event.title}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Legend */}
        <Row>
          <Col md="12">
            <Card className="media-object">
              <CardHeader>
                <CardTitle tag="h4" className="mb-0">
                  <i className="fa fa-palette mr-2"></i>
                  Event Labels
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="d-flex flex-wrap gap-3">
                  {Object.entries(EVENT_COLORS).map(([key, { bg, label }]) => (
                    <div key={key} className="d-flex align-items-center">
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: bg,
                          borderRadius: "4px",
                          marginRight: "8px"
                        }}
                      />
                      <span className="text-light-1">{label}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Create Event Modal */}
      <Modal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        size="md"
        theme="dark"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-plus-circle mr-2"></i>
            Create New Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Event Title *</ControlLabel>
              <FormControl name="title" placeholder="Enter event title..." />
            </FormGroup>
            
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl 
                name="description" 
                rows={3} 
                accepter={Textarea}
                placeholder="Enter event description..."
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Color Label</ControlLabel>
              <FormControl
                name="color"
                accepter={SelectPicker}
                data={colorOptions}
                block
                placeholder="Select color"
                renderMenuItem={(label, item) => (
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: EVENT_COLORS[item.value]?.bg,
                        borderRadius: "3px",
                        marginRight: "8px"
                      }}
                    />
                    {label}
                  </div>
                )}
                renderValue={(value, item) => (
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: EVENT_COLORS[value]?.bg,
                        borderRadius: "3px",
                        marginRight: "8px"
                      }}
                    />
                    {item?.label}
                  </div>
                )}
              />
            </FormGroup>

            {selectedSlot && (
              <div 
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.05)", 
                  padding: "15px", 
                  borderRadius: "8px",
                  marginTop: "15px"
                }}
              >
                <p style={{ marginBottom: "10px", color: "rgba(255,255,255,0.7)" }}>
                  <i className="fa fa-calendar mr-2"></i>
                  <strong>Start:</strong> {moment(selectedSlot.start).format("MMM DD, YYYY h:mm A")}
                </p>
                <p style={{ marginBottom: "0", color: "rgba(255,255,255,0.7)" }}>
                  <i className="fa fa-calendar mr-2"></i>
                  <strong>End:</strong> {moment(selectedSlot.end).format("MMM DD, YYYY h:mm A")}
                </p>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleCreateEvent} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Create Event
          </RSButton>
          <RSButton onClick={() => setShowCreateModal(false)} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>

      {/* Event Details Modal */}
      <Modal 
        open={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        size="md"
                className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <div className="d-flex align-items-center">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: EVENT_COLORS[selectedEvent?.color]?.bg || EVENT_COLORS.default.bg,
                  borderRadius: "50%",
                  marginRight: "10px"
                }}
              />
              {selectedEvent?.title}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              {selectedEvent.description && (
                <div 
                  style={{ 
                    marginBottom: "20px", 
                    padding: "15px", 
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "8px"
                  }}
                >
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)" }}>
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <i className="fa fa-calendar text-primary mr-2"></i>
                <strong style={{ color: "white" }}>Start:</strong>{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  {moment(selectedEvent.start).format("MMM DD, YYYY h:mm A")}
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <i className="fa fa-calendar text-primary mr-2"></i>
                <strong style={{ color: "white" }}>End:</strong>{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  {moment(selectedEvent.end).format("MMM DD, YYYY h:mm A")}
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <i className="fa fa-clock-o text-primary mr-2"></i>
                <strong style={{ color: "white" }}>Duration:</strong>{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  {getEventDuration(selectedEvent)}
                </span>
              </div>

              {selectedEvent.color && (
                <div style={{ marginBottom: "15px" }}>
                  <i className="fa fa-palette text-primary mr-2"></i>
                  <strong style={{ color: "white" }}>Label:</strong>{" "}
                  <Badge 
                    style={{ 
                      backgroundColor: EVENT_COLORS[selectedEvent.color]?.bg,
                      color: "white",
                      marginLeft: "8px"
                    }}
                  >
                    {EVENT_COLORS[selectedEvent.color]?.label || "Default"}
                  </Badge>
                </div>
              )}

              {selectedEvent.createdAt && (
                <div style={{ marginBottom: "15px" }}>
                  <i className="fa fa-info-circle text-primary mr-2"></i>
                  <strong style={{ color: "white" }}>Created:</strong>{" "}
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    {moment(selectedEvent.createdAt).format("MMM DD, YYYY h:mm A")}
                  </span>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <RSButton onClick={handleOpenEditModal} appearance="primary" color="blue">
              <i className="fa fa-edit mr-2"></i>
              Edit
            </RSButton>
            <RSButton onClick={handleOpenDeleteModal} appearance="primary" color="red">
              <i className="fa fa-trash mr-2"></i>
              Delete
            </RSButton>
            <RSButton onClick={() => setShowDetailsModal(false)} appearance="subtle">
              Close
            </RSButton>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>

      {/* Edit Event Modal */}
      <Modal 
        open={showEditModal} 
        onClose={() => setShowEditModal(false)}
        size="md"
                className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-edit mr-2"></i>
            Edit Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Event Title *</ControlLabel>
              <FormControl name="title" placeholder="Enter event title..." />
            </FormGroup>
            
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl 
                name="description" 
                rows={3} 
                accepter={Textarea}
                placeholder="Enter event description..."
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Color Label</ControlLabel>
              <FormControl
                name="color"
                accepter={SelectPicker}
                data={colorOptions}
                block
                placeholder="Select color"
                renderMenuItem={(label, item) => (
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: EVENT_COLORS[item.value]?.bg,
                        borderRadius: "3px",
                        marginRight: "8px"
                      }}
                    />
                    {label}
                  </div>
                )}
                renderValue={(value, item) => (
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: EVENT_COLORS[value]?.bg,
                        borderRadius: "3px",
                        marginRight: "8px"
                      }}
                    />
                    {item?.label}
                  </div>
                )}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleUpdateEvent} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Update Event
          </RSButton>
          <RSButton onClick={() => setShowEditModal(false)} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>

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
            Delete Event?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Are you sure you want to delete "<strong style={{ color: "white" }}>{selectedEvent?.title}</strong>"? 
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleDeleteEvent} appearance="primary" color="red">
            <i className="fa fa-trash mr-2"></i>
            Yes, Delete It
          </RSButton>
          <RSButton onClick={() => setShowDeleteModal(false)} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Calendar;