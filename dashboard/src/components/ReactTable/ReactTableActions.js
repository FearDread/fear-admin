import { Button } from "reactstrap";
import classNames from "classnames";

const ReactActions = ( key, _ecb, _dcb ) => {
  if ( typeof _ecb !== 'function' ) {
    console.log("missing edit callback");
  }
  return (
      <div className="actions-right">
      <Button
        onClick={_ecb}  
        color="warning"
        size="sm"
        className={classNames("btn-icon btn-link like", {
          "btn-neutral": key < 5
        })}>
        <i className="tim-icons icon-pencil" />
      </Button>{" "}
      <Button
        onClick={_dcb}
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