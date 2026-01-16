import React from "react";

const ReactActions = ({ index, onEdit, onDelete }) => {
  if (typeof onEdit !== 'function') {
    //console.warn("Missing edit callback");
  }

  if (typeof onDelete !== 'function') {
    //console.warn("Missing delete callback");
  }

  const isNeutral = index < 5;

  return (
    <div key={index} className="actions-right">
      <button
      key={index}
        onClick={onEdit}
        className={`btn btn-warning btn-sm btn-icon btn-link like ${
          isNeutral ? "btn-neutral" : ""
        }`}
        aria-label="Edit"
      >
        <i className="tim-icons icon-pencil" />
      </button>{" "}
      <button
      key={index}
        onClick={onDelete}
        className={`btn btn-danger btn-sm btn-icon btn-link like ${
          isNeutral ? "btn-neutral" : ""
        }`}
        aria-label="Delete"
      >
        <i className="tim-icons icon-simple-remove" />
      </button>
    </div>
  );
};

export default ReactActions;