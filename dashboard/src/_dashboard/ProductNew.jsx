import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createProduct, clearErrors } from "_redux/actions/product";
import { NEW_PRODUCT_RESET } from "_redux/types/product";
import Loader from "components/Loader/Loading";
import ReactBSAlert from "react-bootstrap-sweetalert";

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

import ImageUpload from "components/CustomUpload/ImageUpload.js";

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [info , setInfo] = useState("")
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isCategory, setIsCategory] = useState(true);
  const [alert, setAlert] = React.useState(null);
  const fileInputRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const { loading, categories, error, success } = useSelector((state) => state.product);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsCategory(true);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

 const defaultCategories = [
   "Comics",
   "Coins",
   "Sports Cards",
   "Toys",
   "Misc..",
 ];

  useEffect(() => {
    if (success) {
      console.log("success ::");
      history.push("/admin/dashboard");

      successAlert();
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, history, success]);

  const successAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Product Added to Store!
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    
    const myForm = new FormData();
          
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", stock);
    myForm.set("info", info);
    
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });
    
    myForm.set("user", user._id);
    
    console.log('product for data ::', myForm.getAll());
    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : ( 
        <>
          <div className="content">
            <Row>
              <Col md="12">
                <Form className="form-horizontal"
                  encType="multipart/form-data"
                  onSubmit={createProductSubmitHandler}>
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Add New Product</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Label sm="2">Product Name</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input type="name" autoComplete="off"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="2">Description</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input type="description" autoComplete="off"
                          cols="100"
                          value={description}
                          placeholder="Here can be your description"
                          rows="4"
                          type="textarea"
                          onChange={(e) => setDescription(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="2">Initial Price</Label>
                        <Col sm="10">
                          <FormGroup>
                          <Input
                          name="price"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="2">Stock Available</Label>
                        <Col sm="10">
                          <FormGroup>
                          <Input
                          name="stock"
                          required
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                        />

                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="2">Select Category</Label>
                        <Col sm="10">
                          <FormGroup>
                          <Input
                          type="select"
                          placeholder="Choose Category"
                          value={category}
                          onChange={handleCategoryChange}
                        >
                        {defaultCategories.map((cate) => (
                          <option key={cate} value={cate}>
                            {cate}
                          </option>
                        ))}
                      </Input>

                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                      <Label sm="2">Publish to store?</Label>
                    <Col className="checkbox-radios" sm="10">
                      <FormGroup check>
                        <Label check>
                          <Input type="checkbox" />
                          <span className="form-check-sign" />
                          Publish
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input type="checkbox" />
                          <span className="form-check-sign" />
                          Private
                        </Label>
                      </FormGroup>
                      </Col>
                      </Row>
                      <Row>
                        <Label sm="2">Product Info</Label>
                        <Col sm="10">
                          <FormGroup>
                          <Input
                          cols="180"
                          value={info}
                          placeholder="Here can be your extra information"
                          rows="4"  
                          type="textarea"
                          onChange={(e) => setInfo(e.target.value)}
                        />
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>

                
                <CardHeader>
                  <CardTitle tag="h4">Drag or click here to add Images!</CardTitle>
                </CardHeader>
                
                <CardBody>
                  <Row>
                  <Col>
                
                  <div class="form-group">
                    <label class="control-label">Upload File</label>
                         <div class="preview-zone hidden">
                            <div class="box box-solid">
                                      <div class="box-header with-border">
                    <div><b>Preview</b></div>
                    <div class="box-tools pull-right">
                    </div>
                  </div>
                  <div class="box-body"></div>
                </div>
               </div>
                <div class="dropzone-wrapper">
                <div class="dropzone-desc">
                  <i class="glyphicon glyphicon-download-alt"></i>
                  <p>Choose an image file or drag it here.</p>
                </div>
                <Input type="file" name="img_logo" class="dropzone" />
                </div>
                </div>

                  <Input
                          type="file"
                          accept="image/*"
                          onChange={createProductImagesChange}
                          multiple
                          ref={fileInputRef}

                        />

                        <CardBody>
                            {imagesPreview && imagesPreview.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                className="add-product-img"
                                alt="Product Preview"
                              />
                          ))}
                        </CardBody>
                        <Button className="hidden"
                            variant="contained"
                            onClick={handleImageUpload}
                          >
                          
                        </Button>
                        <br />
                                }
                  <ImageUpload />
                  </Col>
                  </Row>
                  <Button
                      onClick={createProductSubmitHandler}
                          variant="contained"
                          type="submit"
                          disabled={loading ? true : false}
                        >
                          SUBMIT PRODUCT
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
}
export default NewProduct;
