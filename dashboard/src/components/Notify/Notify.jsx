import NotificationAlert from "react-notification-alert";
export const _notify = (opts) => {
    notificationAlertRef.current.notificationAlert(opts);
}
const Notify = (props) => {
    const notificationAlertRef = React.useRef(null);
    const [ options ] = React.useState({});
    
    options = {
      place: props.place,
      message: (
        <div>
          <div>
            {props.message}
          </div>
        </div>
      ),
      type: props.type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: props.delay
    };

    useEffect(() => {
        _notify(options);
    }, [options]);

    return (
        <>
          <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
          </div>
        </>
    )
  };

  export default Notify;