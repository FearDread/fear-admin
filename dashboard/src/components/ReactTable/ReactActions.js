
const ReactActions = ( data ) => {
    
    return (
        <div className="actions-right">
        {/* use this button to add a like kind of action */}
        <Button
          onClick={() => {
            let obj = data.find((o) => o.id === i);
            alert(
              "You've clicked LIKE button on \n{ \nName: " +
                obj.name +
                ", \nposition: " +
                obj.position +
                ", \noffice: " +
                obj.office +
                ", \nage: " +
                obj.age +
                "\n}."
            );
          }}
          color="info"
          size="sm"
          className={classNames("btn-icon btn-link like", {
            "btn-neutral": i < 5
          })}
        >
          <i className="tim-icons icon-heart-2" />
        </Button>{" "}
        {/* use this button to add a edit kind of action */}
        <Button
          onClick={() => {
            let obj = data.find((o) => o.id === i);
            alert(
              "You've clicked EDIT button on \n{ \nName: " +
                obj.name +
                ", \nposition: " +
                obj.position +
                ", \noffice: " +
                obj.office +
                ", \nage: " +
                obj.age +
                "\n}."
            );
          }}
          color="warning"
          size="sm"
          className={classNames("btn-icon btn-link like", {
            "btn-neutral": i < 5
          })}
        >
          <i className="tim-icons icon-pencil" />
        </Button>{" "}
        {/* use this button to remove the data row */}
        <Button
          onClick={() => {
            var newdata = data;
            newdata.find((o, i) => {
              if (o.id === i) {
                // here you should add some custom code so you can delete the data
                // from this component and from your server as well
                data.splice(i, 1);
                console.log(data);
                return true;
              }
              return false;
            });
            console.log('remove data ')
            //setData(newdata);
          }}
          color="danger"
          size="sm"
          className={classNames("btn-icon btn-link like", {
            "btn-neutral": i < 5
          })}
        >
          <i className="tim-icons icon-simple-remove" />
        </Button>{" "}
      </div>
    )
}

export default ReactActions;