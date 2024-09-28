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
import * as CatActions from "../_redux/category/actions";
import { NEW_CATEGORY_RESET } from "_redux/category/types";
import Loader from "components/Loader/Loading.js";

const CategoryNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [title, setTitle] = useState("");
  //const [cat, loading] = useSelector((state) => state.categories);
  const { success, loading } = useSelector((state) => state.cat);

  const handleSubmitCategory = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('title', title);

    dispatch(CatActions.create(myForm));
  }

  useEffect(() => {
    if( success ) {
      dispatch({type: NEW_CATEGORY_RESET});
      history.push('/admin/categories');
    }
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
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
                      <CardTitle tag="h4">Add Default Category</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Label sm="2">Category Name</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input 
                              type="name"
                              autoComplete="off"
                              name="title"
                              required
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        </Row>
                        <Button
                          onClick={handleSubmitCategory}>
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

export default CategoryNew;
