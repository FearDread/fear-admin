import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createBrand, clearErrors } from "../_redux/actions/brand.jsx";

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

const BrandNew = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const getBrandId = location.pathname.split("/")[3];
  const newBrand = useSelector((state) => state.brand);
  const {
    success,
    error,
    loading,
    createdBrand,
    brandName,
    updatedBrand,
  } = newBrand;
  
  const handleSubmitBrand = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('title', title)

    dispatch(createBrand(myForm));
  }

  useEffect(() => {
      dispatch(clearErrors());
  }, []);

  useEffect(() => {
    if (success) {
      toast.success("Brand Added Successfullly!");
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
      );
};

export default Addbrand;
