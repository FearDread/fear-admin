

const Notify = (ref, props) => {
    props = { stat, place, message, delay };

    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: delay
    };

    ref.current.notificationAlert(options);
  };

  export default Notify;