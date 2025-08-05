import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Label,
  Row,
  Col
} from "reactstrap";
import * as TaskActions from "../_redux/task/actions";
import { NEW_TASK_RESET } from "_redux/task/types";
import Loader from "components/Loader/Loading.js";

const TaskNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [task, setTask] = useState("");
  const { success, loading } = useSelector((state) => state.cat);
  const { user } = useSelector((state) => state.auth);

  const handleSubmitTask = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('task', task);
    myForm.set('createdBy', user._id)

    dispatch(TaskActions.create(myForm));
  }

  useEffect(() => {
    if( success ) {
      dispatch({type: NEW_TASK_RESET});
      history.push('/admin/dashboard');
    }
  }, [success, history]);

  return (
    <>
      {loading ? (
        <div className="content">
        <Loader />
        </div>
      ) : ( 
        <>
          <div className="content">
            <Row>
              <Col md="12">
                <Form 
                  className="form-horizontal"
                  encType="multipart/form-data">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Add Task</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Label sm="2">Task</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input 
                              type="name"
                              autoComplete="off"
                              name="task"
                              required
                              value={task}
                              onChange={(e) => setTask(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        </Row>
                        <Button
                          onClick={handleSubmitTask}>
                          SUBMIT
                        </Button>

                  </CardBody>
                </Card>
              </Form>
            </Col>
          </Row>
        </div>
      </>
      )}
    </>
      );
};

export default TaskNew;
