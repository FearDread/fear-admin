import { 
  Button
 } from "reactstrap";
import classNames from "classnames";

const ReactActions = ( item, key, type ) => {
  if ( !type || type === null ) {
    type = "No Type";
  }
  return (
      <div className="actions-right">
      <Button
        onClick={() => {
          //let obj = item[key];
          console.log("edit item :: " + type + " :: ", item);
        }}
        color="warning"
        size="sm"
        className={classNames("btn-icon btn-link like", {
          "btn-neutral": key < 5
        })}>
        <i className="tim-icons icon-pencil" />
      </Button>{" "}
      <Button
        onClick={() => {
          console.log("remove item :: " + type + " :: ", item);
        }}
        color="danger"
        size="sm"
        className={classNames("btn-icon btn-link like", {
          "btn-neutral": key < 5
        })}>
        <i className="tim-icons icon-simple-remove" />
      </Button>{" "}
    </div>
    )
}

export default ReactActions;