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
  Input,
  FormGroup,
  Label
} from "reactstrap";
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


const Calendar = () => {
  const dispatch = useDispatch();

  // Redux state from FeatureFactory
  const events = useSelector(selectAllEvents);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  // Local state
  const [alert, setAlert] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [eventColor, setEventColor] = useState("default");

  // Event color options
  const EVENT_COLORS = {
    default: { bg: "#7934f3", label: "Default" },
    azure: { bg: "#00bcd4", label: "Azure" },
    green: { bg: "#4caf50", label: "Success" },
    orange: { bg: "#ff9800", label: "Warning" },
    red: { bg: "#f44336", label: "Danger" },
    rose: { bg: "#e91e63", label: "Rose" }
  };

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
   * Handle errors
   */
  useEffect(() => {
    if (error) {
      showErrorAlert(error);
    }
  }, [error]);

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
    showEventDetailsAlert(event);
  }, []);

  /**
   * Handle slot selection (create new event)
   */
  const handleSelectSlot = useCallback((slotInfo) => {
    showAddEventAlert(slotInfo);
  }, [eventColor]);

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
   * Show add event alert
   */
  const showAddEventAlert = (slotInfo) => {
    let eventTitle = "";
    let eventDescription = "";
    let selectedColor = eventColor;

    setAlert(
      <Card
        custom
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Create New Event"
        onConfirm={() => handleCreateEvent(eventTitle, eventDescription, selectedColor, slotInfo)}
        onCancel={hideAlert}
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="secondary"
        confirmBtnText="Create Event"
        cancelBtnText="Cancel"
      >
        <div className="text-left">
          {/* Event Title */}
          <FormGroup>
            <Label className="text-white">Event Title *</Label>
            <Input
              type="text"
              placeholder="Enter event title..."
              onChange={(e) => eventTitle = e.target.value}
              autoFocus
            />
          </FormGroup>

          {/* Event Description */}
          <FormGroup>
            <Label className="text-white">Description</Label>
            <Input
              type="textarea"
              rows="3"
              placeholder="Enter event description..."
              onChange={(e) => eventDescription = e.target.value}
            />
          </FormGroup>

          {/* Event Color */}
          <FormGroup>
            <Label className="text-white">Color</Label>
            <div className="d-flex gap-2">
              {Object.entries(EVENT_COLORS).map(([key, { bg, label }]) => (
                <div
                  key={key}
                  onClick={() => selectedColor = key}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: bg,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: selectedColor === key ? "3px solid white" : "2px solid transparent",
                    transition: "all 0.2s"
                  }}
                  title={label}
                />
              ))}
            </div>
          </FormGroup>

          {/* Event Details */}
          <div className="bg-dark-light p-3 rounded mt-3">
            <p className="text-light-2 mb-2">
              <i className="fa fa-calendar mr-2"></i>
              <strong>Start:</strong> {moment(slotInfo.start).format("MMM DD, YYYY h:mm A")}
            </p>
            <p className="text-light-2 mb-0">
              <i className="fa fa-calendar mr-2"></i>
              <strong>End:</strong> {moment(slotInfo.end).format("MMM DD, YYYY h:mm A")}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  /**
   * Show event details alert
   */
  const showEventDetailsAlert = (event) => {
    const duration = moment(event.end).diff(moment(event.start), "minutes");
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    setAlert(
      <Card
        custom
        style={{ display: "block", marginTop: "-100px" }}
        title={
          <div className="d-flex align-items-center justify-content-center">
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: EVENT_COLORS[event.color]?.bg || EVENT_COLORS.default.bg,
                borderRadius: "50%",
                marginRight: "10px"
              }}
            />
            {event.title}
          </div>
        }
        onConfirm={hideAlert}
        confirmBtnBsStyle="primary"
        confirmBtnText="Close"
        customButtons={
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              color="info"
              onClick={() => handleEditEvent(event)}
              className="btn-round"
            >
              <i className="fa fa-edit mr-2"></i>
              Edit
            </Button>
            <Button
              color="danger"
              onClick={() => handleDeleteEventConfirm(event)}
              className="btn-round"
            >
              <i className="fa fa-trash mr-2"></i>
              Delete
            </Button>
          </div>
        }
      >
        <div className="text-left mt-3">
          {event.description && (
            <div className="mb-3 p-3 bg-dark-light rounded">
              <p className="text-light-2 mb-0">{event.description}</p>
            </div>
          )}

          <div className="mb-2">
            <i className="fa fa-calendar text-primary mr-2"></i>
            <strong className="text-white">Start:</strong>{" "}
            <span className="text-light-2">
              {moment(event.start).format("MMM DD, YYYY h:mm A")}
            </span>
          </div>

          <div className="mb-2">
            <i className="fa fa-calendar text-primary mr-2"></i>
            <strong className="text-white">End:</strong>{" "}
            <span className="text-light-2">
              {moment(event.end).format("MMM DD, YYYY h:mm A")}
            </span>
          </div>

          <div className="mb-2">
            <i className="fa fa-clock-o text-primary mr-2"></i>
            <strong className="text-white">Duration:</strong>{" "}
            <span className="text-light-2">
              {hours > 0 && `${hours}h `}
              {minutes > 0 && `${minutes}m`}
              {hours === 0 && minutes === 0 && "Less than 1 minute"}
            </span>
          </div>

          {event.color && (
            <div className="mb-2">
              <i className="fa fa-palette text-primary mr-2"></i>
              <strong className="text-white">Label:</strong>{" "}
              <Badge 
                style={{ 
                  backgroundColor: EVENT_COLORS[event.color]?.bg,
                  color: "white"
                }}
                className="ml-2"
              >
                {EVENT_COLORS[event.color]?.label || "Default"}
              </Badge>
            </div>
          )}

          {event.createdAt && (
            <div className="mb-2">
              <i className="fa fa-info-circle text-primary mr-2"></i>
              <strong className="text-white">Created:</strong>{" "}
              <span className="text-light-2">
                {moment(event.createdAt).format("MMM DD, YYYY h:mm A")}
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  /**
   * Show edit event alert
   */
  const handleEditEvent = (event) => {
    let eventTitle = event.title;
    let eventDescription = event.description || "";
    let selectedColor = event.color || "default";

    setAlert(
      <Card
        custom
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Edit Event"
        onConfirm={() => handleUpdateEvent(event, eventTitle, eventDescription, selectedColor)}
        onCancel={hideAlert}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="secondary"
        confirmBtnText="Update Event"
        cancelBtnText="Cancel"
      >
        <div className="text-left">
          <FormGroup>
            <Label className="text-white">Event Title *</Label>
            <Input
              type="text"
              defaultValue={event.title}
              onChange={(e) => eventTitle = e.target.value}
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label className="text-white">Description</Label>
            <Input
              type="textarea"
              rows="3"
              defaultValue={event.description}
              onChange={(e) => eventDescription = e.target.value}
            />
          </FormGroup>

          <FormGroup>
            <Label className="text-white">Color</Label>
            <div className="d-flex gap-2">
              {Object.entries(EVENT_COLORS).map(([key, { bg, label }]) => (
                <div
                  key={key}
                  onClick={() => selectedColor = key}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: bg,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: selectedColor === key || event.color === key ? "3px solid white" : "2px solid transparent",
                    transition: "all 0.2s"
                  }}
                  title={label}
                />
              ))}
            </div>
          </FormGroup>
        </div>
      </Card>
    );
  };

  /**
   * Show delete confirmation
   */
  const handleDeleteEventConfirm = (event) => {
    setAlert(
      <Card
        warning
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Delete Event?"
        onConfirm={() => handleDeleteEvent(event)}
        onCancel={hideAlert}
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="secondary"
        confirmBtnText="Yes, Delete It"
        cancelBtnText="Cancel"
      >
        <p className="text-light-2">
          Are you sure you want to delete "<strong>{event.title}</strong>"? This action cannot be undone.
        </p>
      </Card>
    );
  };

  /**
   * Create new event
   */
  const handleCreateEvent = async (title, description, color, slotInfo) => {
    if (!title || title.trim() === "") {
      showErrorAlert("Event title is required");
      return;
    }

    try {
      const newEvent = {
        title: title.trim(),
        description: description?.trim() || "",
        start: slotInfo.start.toISOString(),
        end: slotInfo.end.toISOString(),
        color: color || "default",
        allDay: slotInfo.slots && slotInfo.slots.length === 1,
        createdAt: new Date().toISOString()
      };

      await dispatch(createEvent(newEvent)).unwrap();
      
      hideAlert();
      showSuccessAlert("Event created successfully!");
      
      // Refresh events
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to create event:", err);
      showErrorAlert(err.message || "Failed to create event");
    }
  };

  /**
   * Update event
   */
  const handleUpdateEvent = async (event, newTitle, newDescription, newColor) => {
    if (!newTitle || newTitle.trim() === "") {
      showErrorAlert("Event title is required");
      return;
    }

    try {
      const updatedEvent = {
        ...event,
        title: newTitle.trim(),
        description: newDescription?.trim() || "",
        color: newColor,
        updatedAt: new Date().toISOString()
      };

      await dispatch(updateEvent({
        id: event.id || event._id,
        data: updatedEvent
      })).unwrap();

      hideAlert();
      showSuccessAlert("Event updated successfully!");
      
      // Refresh events
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to update event:", err);
      showErrorAlert(err.message || "Failed to update event");
    }
  };

  /**
   * Delete event
   */
  const handleDeleteEvent = async (event) => {
    try {
      await dispatch(deleteEvent(event.id || event._id)).unwrap();
      
      hideAlert();
      showSuccessAlert("Event deleted successfully!");
      
      // Refresh events
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to delete event:", err);
      showErrorAlert(err.message || "Failed to delete event");
    }
  };

  /**
   * Show success alert
   */
  const showSuccessAlert = (message) => {
    setAlert(
      <Card
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={hideAlert}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        timeout={2000}
      >
        <i className="fa fa-check-circle" style={{ fontSize: "48px", color: "#4caf50" }}></i>
        <p className="text-light-2 mt-3">{message}</p>
      </Card>
    );
  };

  /**
   * Show error alert
   */
  const showErrorAlert = (message) => {
    setAlert(
      <Card
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => {
          hideAlert();
          dispatch(clearError());
        }}
        confirmBtnBsStyle="danger"
        confirmBtnText="OK"
      >
        <i className="fa fa-exclamation-triangle" style={{ fontSize: "48px", color: "#f44336" }}></i>
        <p className="text-light-2 mt-3">{message}</p>
      </Card>
    );
  };

  /**
   * Hide alert
   */
  const hideAlert = () => {
    setAlert(null);
  };

  /**
   * Handle view change
   */
  const handleViewChange = (newView) => {
    setView(newView);
  };

  /**
   * Handle navigation
   */
  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  // Show loader while fetching initial data
  if (loading && (!events || events.length === 0)) {
    return <Loader />;
  }

  return (
    <>
      {alert}
      
      <div className="container-fluid">
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
    </>
  );
};

export default Calendar;