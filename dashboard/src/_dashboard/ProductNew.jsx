import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Product from "_redux/actions/product"
import * as Category from "_redux/category/actions";
import { NEW_PRODUCT_RESET } from "_redux/types/product";
import Loader from "components/Loader/Loading";
import ReactBSAlert from "react-bootstrap-sweetalert";
import ImageUpload from "components/CustomUpload/ImageUpload.js";
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

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [brand , setBrand] = useState("")
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [alert, setAlert] = React.useState(null);
  const fileInputRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const { loading, success } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.cat);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const successAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize="" >
        Product Added to Store!
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
    history.push("/admin/products");
  };

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
          
    myForm.set("title", title);
    myForm.set("slug", title);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("quantity", quantity);
    myForm.set("brand", brand);
    
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });
    myForm.set("useaaaaaar", user._id);
    
    dispatch(Product.create(myForm));
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

  useEffect(() => {
    if (success) {
      successAlert();
      dispatch({ type: NEW_PRODUCT_RESET })
    }
  }, [dispatch, success, successAlert]);

  useEffect(() => {

    dispatch(Category.list());
    console.log("categories = ", categories);
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
                      <CardTitle tag="h4">Add New Product</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Label sm="2">Title</Label>
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
                        <Label sm="2">Description</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input 
                              type="description" 
                              autoComplete="off"
                              name="description"
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
                              name="quantity"
                              required
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
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
                              name="category"
                              placeholder="Choose Category"
                              onChange={handleCategoryChange} >
                              {categories.map((cate, key) => (
                                <option key={cate._id} value={cate._id}>
                                  {cate.title}
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
                        <Label sm="2">Brand</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input
                              name="brand"
                              value={brand}
                              placeholder="ex: DC Comics"
                              onChange={(e) => setBrand(e.target.value)}
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
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={createProductImagesChange}
                            multiple
                            ref={fileInputRef} />
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
                        <br />
                        <ImageUpload />
                      </Col>
                      </Row>
                      <Button
                        variant="contained"
                        type="submit"
                        onClick={createProductSubmitHandler}
                        disabled={loading ? true : false}>
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
