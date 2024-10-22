import React from "react";
import ReactBSAlert from "react-bootstrap-sweetalert";

const setAlert = () => {
  return (null);
}

const hideAlert = () => {
  return (null);
}

export const basicAlert = () => {
    return (
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      />
    );
};

export const titleAndTextAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        It's pretty, isn't it?
      </ReactBSAlert>
    );
};

export const successAlert = ( props ) => {
    if ( typeof props.success_cb )
    return (
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Good job!"
        onConfirm={() => props.success_cb()}
        onCancel={() => props.hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        You clicked the button!
      </ReactBSAlert>
    );
};

export const confirmDelete = ( props ) => {
    const { _id, entity, deleteHandler, hideAlert } = props;
    if ( !_id, entity ) {
        console.log('missing entity and or its _id');
        return;
    }
    return (
    <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => deleteHandler(_id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        Your sure you want to delete this ${entity}?
      </ReactBSAlert>
    )
};

export const htmlAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="HTML example"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        You can use <b>bold</b> text,{" "}
        <a href="https://www.creative-tim.com/">links</a> and other HTML tags
      </ReactBSAlert>
    );
};

export const warningWithConfirmMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this imaginary file!
      </ReactBSAlert>
    );
};
  
export const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => cancelDetele()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this imaginary file!
      </ReactBSAlert>
    );
};

export const autoCloseAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Auto close alert!"
        onConfirm={() => hideAlert()}
        showConfirm={false}
      >
        I will close in 2 seconds.
      </ReactBSAlert>
    );
    setTimeout(() => {
      setAlert(null);
    }, 2000);
};

export const inputAlert = () => {
    setAlert(
      <ReactBSAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={(e) => inputConfirmAlert(e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        btnSize=""
      />
    );
};

export const inputConfirmAlert = () => {
    return (
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
        title="You entered: "
      >
        <b>''</b>
      </ReactBSAlert>
    );
};

export const successDelete = () => {
    return (
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Your imaginary file has been deleted.
      </ReactBSAlert>
    );
};

export const cancelDetele = () => {
    return (
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Your imaginary file is safe :)
      </ReactBSAlert>
    );
};

export default { confirmDelete }