import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { createProduct, clearErrors } from "_redux/actions/product";
import { NEW_PRODUCT_RESET } from "_redux/types/product";
import Loader from "components/Loader/Loading";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
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
  const [isCategory, setIsCategory] = useState(false);
  const fileInputRef = useRef();

  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.product);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsCategory(true);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

 const categories = [
   "Comics",
   "Coins",
   "Sports Cards",
   "Toys",
   "Misc..",
 ];

  useEffect(() => {
    if (success) {
      history.push("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, history, success]);
  
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
            <h1 className="text-center">Add New Product</h1>
            <br />
            <Row>
              <Col md="6" className="centered-form">
                <Form
                  encType="multipart/form-data"
                  onSubmit={createProductSubmitHandler}>
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className={`has-labe`}>
                        <label>Product Name</label>
                        <Input
                          name="Product Name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Product Description</label>
                        <Input
                          cols="80"
                          value={description}
                          placeholder="Here can be your description"
                          rows="4"
                          type="textarea"
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup className={`has-label`}>
                        <label>Price</label>
                        <Input
                          name="price"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup className={`has-label`}>
                        <label>Stock</label>
                        <Input
                          name="stock"
                          required
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Select Category</label>
                        <Input
                          type="select"
                          placeholder="Choose Category"
                          value={category}
                          onChange={handleCategoryChange}
                        >
                        {categories.map((cate) => (
                          <option key={cate} value={cate}>
                            {cate}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    <FormGroup className={`has-label`}>
                      <label>Product Info</label>
                      <Input
                          cols="80"
                          value={info}
                          placeholder="Here can be your extra information"
                          rows="4"  
                          type="textarea"
                          onChange={(e) => setInfo(e.target.value)}
                        />
                    </FormGroup>

                    </CardBody>
                    <Button
                          variant="contained"
                          type="submit"
                          disabled={loading ? true : false}
                        >
                          SUBMIT PRODUCT
                    </Button>
                  </Card>
                </Form>
              </Col>
            <Col md="6">
            <FormGroup>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Add Image</CardTitle>
                </CardHeader>
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
                        <Button
                            variant="contained"
                            onClick={handleImageUpload}
                          >
                            Upload Images
                        </Button>
                    </Card>
                </FormGroup>   
            </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}
export default NewProduct;
