import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as BrandActions from "_redux/brand/actions";
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
import { NEW_BRAND_RESET } from "_redux/brand/types";

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

    dispatch(BrandActions.create(myForm));
  }

  useEffect(() => {
    if (success) {
      history.push("/admin/brands")
    }

  }, [ success, history ]);

  useEffect(() => {
    dispatch({ type: NEW_BRAND_RESET })
  }, [dispatch])

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
                            <Input type="checkbox" name="isActive" onChange={(e) => setIsActive(true)} />
                              <span className="form-check-sign" />
                              Active
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                            <Input type="checkbox" name="isActive" onChange={(e) => setIsActive(false)} />
                              <span className="form-check-sign" />
                              Disabled
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button onClick={handleSubmitBrand}>
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

export default BrandNew;
