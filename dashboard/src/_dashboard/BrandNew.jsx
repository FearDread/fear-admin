import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
//import { createBrand, clearErrors } from "../_redux/actions/brand.jsx";
import * as Brand from "../_redux/actions/brand";
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
import Loader from "components/Loader/Loading.js";

const BrandNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(false);                                          
  const { success, loading } = useSelector((state) => state.brand);

  
  const handleSubmitBrand = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('title', title);
    myForm.set("isActive", isActive ? isActive : false);

    dispatch(Brand.create(myForm));
  }

  useEffect(() => {
    if (success) {
      history.push("/admin/brands")
    }

  }, [dispatch, success]);

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
                      <CardTitle tag="h4">Add New Brand</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Label sm="2">Brand Name</Label>
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
                        <Label sm="2">Set Active</Label>
                        <Col className="checkbox-radios" sm="10">
                          <FormGroup check>
                            <Label check>
                            <Input type="checkbox" name="isActive" onChange={(setIsActive(true))} />
                              <span className="form-check-sign" />
                              Active
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                            <Input type="checkbox" name="isActive" onChange={(setIsActive(false))}/>
                              <span className="form-check-sign" />
                              Disabled
                            </Label>
                          </FormGroup>
                        </Col>

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

export default BrandNew;
