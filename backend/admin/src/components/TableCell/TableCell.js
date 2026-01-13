import React, { useState, useEffect } from "react";

const TableCell = (props) => {

    if (props.cell === "avatar") {
        return (
            <div className="photo">
              <img
                alt="..."
                src={require(props.avatar.url)}
              />
            </div>

        )
    } else {
        return (
            {props.value}
        )
    }

}

export default TableCell;