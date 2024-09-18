import { React, useEffect, useState } from "react";
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
import { crud } from "../_redux/actions/crud";
import Loader from "components/Loader/Loading.js";

const CategoryNew = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [success, error, loading] = useSelector((state) => state.category);

  const handleSubmitBrand = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('title', title);

    dispatch(crud.create('category', myForm));
    //dispatch(createBrand(myForm));
  }

  useEffect(() => {
    if (success) {
      dispatch(crud.resetAction('create'));
    }
      dispatch(crud.resetState());
  }, [success]);

  useEffect(() => {
    if (success) {
      toast.success("Category Added Successfullly!");
    }
    if (error) {
      toast.error("Something Went Wrong!");
    }
  }, [ success, error, loading ]);

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
                      <Row>
                        <Button
                          onClick={handleSubmitBrand}>
                          SUBMIT
                        </Button>
                      </Row>
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
