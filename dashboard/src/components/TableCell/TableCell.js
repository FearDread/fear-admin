import React, { useState, useEffect } from "react";

const TableCell = (props) => {

    if (props.cell === "avatar") {
        return (
            <td className="text-center">
            <div className="photo">
              <img
                alt="..."
                src={require(props.avatar.url)}
              />
            </div>
          </td>
        )
    } else {
        return (
            <td>{props.value}</td>
        )
    }

}

export default TableCell;