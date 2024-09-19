
const ReactActions = ( item, key ) => {
    
    return (
      <div className="actions-right">
      <Button
        onClick={() => {
                  let obj = item[key];
                  console.log("Clickded row :: ", obj);
                  //let obj = data.find((o) => o.id === i);
                  alert("edit action :: " + key);
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
          console.log('remove data ')
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