import React, {useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { Card, CardBody, Row, Col } from "reactstrap";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import * as EventActions from "../_redux/event/actions";
import Loader from "components/Loader/Loading.js";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const [allEvents, setAllEvents] = React.useState(events);
  const [alert, setAlert] = React.useState(null);


  const selectedEvent = (event) => {
    window.alert(event.title);
  };

  const addNewEventAlert = (slotInfo) => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={(e) => submitNewEvent(e, slotInfo)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
      />
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const eventColors = (event, start, end, isSelected) => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  };

const getCurrentEvents = () => {
  dispatch(EventActions.list());
  setAllEvents(events);
}

const submitNewEvent = (e, slotInfo) => {
  var newEvent = {    
    title: e,
    start: slotInfo.start,
    end: slotInfo.end
  }

  events.push(newEvent);

  setAlert(null);
  setAllEvents(events);

  dispatch(EventActions.create(newEvent));
}

useEffect(() => {

  dispatch(EventActions.list());

}, [dispatch])

  return (
    <>
      <div className="content">
        {alert}
        <Row>
          <Col className="ml-auto mr-auto" md="10">
            <Card className="card-calendar">
              <CardBody>
                <BigCalendar
                  selectable
                  localizer={localizer}
                  events={events}
                  defaultView="month"
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  defaultDate={new Date()}
                  onSelectEvent={(event) => selectedEvent(event)}
                  onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
                  eventPropGetter={eventColors}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Calendar;
