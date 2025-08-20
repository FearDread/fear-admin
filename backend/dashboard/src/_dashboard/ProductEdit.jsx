import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Loader from "components/Loader/Loading";
import ReactBSAlert from "react-bootstrap-sweetalert";
import {
  Button,
  Card,
  Label,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";
import * as ProductActions from "_redux/product/actions"
import * as CatActions from "_redux/category/actions";
import * as BrandActions from "_redux/brand/actions";
import ImageUpload from "components/CustomUpload/ImageUpload.js";



function ProductEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const [quantity, setQuantity] = useState();
  const [brand , setBrand] = useState()
  const [images, setImages] = useState();
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isCategory, setIsCategory] = useState(false);
  const fileInputRef = useRef();
  const [alert, setAlert] = React.useState(null);
  const { user } = useSelector((state) => state.auth);
  const { loading, product, success } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.cat);
  const { brands } = useSelector((state) => state.brand);
  
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsCategory(true);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const hideAlert = () => { setAlert(null); };

  const successAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => {
          history.push("/admin/products");
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize="" >
        Product Updated
      </ReactBSAlert>
    );
  };

  
  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
    
    const myForm = new FormData();
    
    myForm.set("title", title ? title : product.title);
    myForm.set("price", price ? price : product.price);
    myForm.set("slug", title ? title.toLowerCase() : product.title.toLowerCase());
    myForm.set("description", description ? description : product.description);
    myForm.set("category", category ? category : product.category);
    myForm.set("quantity", quantity ? quantity : product.quantity);
    myForm.set("brand", brand ? brand : product.brand);
    
    if ( images ) {
      images.forEach((currImg) => {
        myForm.append("images", currImg);
      });
    }
    myForm.set("user", user._id);

    dispatch(ProductActions.update(id, myForm));
  };

  const updateProductImagesChange = (e) => {
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
    }
  }, [success]);

  useEffect(() => {
    dispatch(ProductActions.read(id));
    dispatch(CatActions.list());
    dispatch(BrandActions.list());
  }, [dispatch]);

  useEffect(() => {
    if (product && product.images) {
      setImages(product.images);
    }
  },[]);

  return (
    <>
      {loading || !product ? (
        <Loader />
      ) : ( 
        <>
        {alert  }
          <div className="content">
            <Row>
              <Col md="12">
                <Form 
                  className="form-horizontal"
                  encType="multipart/form-data">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Update Product - {product.title}</CardTitle>
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
                              value={product.title}
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
                              autoComplete="off"
                              name="description"
                              cols="100"
                              value={product.description}
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
                              value={product.price}
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
                              value={product.quantity}
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
                              defaultValue={product.category}
                              onChange={handleCategoryChange} >
                              {categories.map((cate, key) => (
                                <option key={cate._id} value={cate.title}>
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
                              type="select"
                              name="brand"
                              placeholder="Choose Category"
                              defaultValue={product.brand}
                              onChange={handleBrandChange} >
                              {brands.map((b, key) => (
                                <option key={b._id} value={b.title}>
                                  {b.title}
                                </option>
                              ))}
                            </Input>
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
                            onChange={updateProductImagesChange}
                            multiple
                            ref={fileInputRef} />
                        <CardBody>
                            {product.images && product.images.map((image, index) => (
                              <img
                                key={index}
                                src={image.url}
                                className="add-product-img"
                                alt="Product Preview"
                              />
                          ))}
                        </CardBody>
                        <br />
                      </Col>
                      </Row>
                      <Button
                        variant="contained"
                        type="submit"
                        onClick={updateProductSubmitHandler}
                        disabled={loading ? true : false}>
                          UPDATE PRODUCT
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
export default ProductEdit;
