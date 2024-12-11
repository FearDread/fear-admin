import React, { useState, useEffect } from "react";
import {
    Button,
    Label,
    FormGroup,
    Input,
    UncontrolledTooltip
  } from "reactstrap";

export const TaskRow = ({props}) => {
    useEffect(() => {
        console.log('task = ', props);
    }, [])


    return (
        <>
        <tr>
        <td>
          <FormGroup check>
            <Label check>
              <Input defaultValue="" type="checkbox"x />
              <span className="form-check-sign">
                <span className="check" />
              </span>
            </Label>
          </FormGroup>
        </td>
        <td>
          <p className="text-muted">
            {props.task}
          </p>
        </td>
        <td className="td-actions text-right">
          <Button 
            color="link"
            id="tooltip786630859"
            title=""
            type="button"
          >
            <i className="tim-icons icon-pencil" />
          </Button>
          <UncontrolledTooltip
            delay={0}
            target="tooltip786630859"
          >
            Edit Task
          </UncontrolledTooltip>
        </td>
      </tr>
</>      

    )
}