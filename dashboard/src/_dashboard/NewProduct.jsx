import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { createProduct, clearErrors } from "_actions/productAction";
import { NEW_PRODUCT_RESET } from "_constants/productsConstatns";

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
import {
  Avatar,
  FormControl,
  Select,
  TextField,
  MenuItem
} from "@material-ui/core";
import ImageUpload from "components/CustomUpload/ImageUpload.js";
import Loader from "components/Loader/Loading";

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  //const alert = useAlert();

  const { loading, error, success } = useSelector(
    (state) => state.addNewProduct
  );
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
  const [toggle, setToggle] = useState(false);

  // togle handler =>
  const toggleHandler = () => {
    console.log("toggle");
    setToggle(!toggle);
  };

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
    if (error) {
      //alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      //alert.success("Product Created Successfully");
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
              <Col md="6" className="centered-form">
                <Form
                  encType="multipart/form-data"
                  onSubmit={createProductSubmitHandler}>
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Add New Product</CardTitle>
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
                        <label>Product Info</label>
                        <TextField
                          variant="outlined"
                          label="Product info"
                          value={info}
                          required
                          onChange={(e) => setInfo(e.target.value)} />
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
                      <FormControl>
                      <label>Select Category</label>
                      <Select
                        variant="outlined"
                        fullWidth
                        value={category}
                        onChange={handleCategoryChange}
                        inputProps={{
                          name: "category",
                          id: "category-select",
                        }}> 
                        {!category && (
                          <MenuItem value="">
                            <em>Choose Category</em>
                          </MenuItem>
                        )}
                        {categories.map((cate) => (
                          <MenuItem key={cate} value={cate}>
                            {cate}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormGroup className={`has-label`}>
                      <label>Product Description</label>
                      <TextField
                          label="Product Description"
                          multiline
                          rows={1}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)} />
                      </FormGroup>
                    <FormGroup>
                      <CardTitle tag="h4">Avatar</CardTitle>
                        <ImageUpload
                          avatar
                          addBtnColor="default"
                          changeBtnColor="default"
                          name="avatar"
                          accept="image/*"
                          onChange={createProductImagesChange}
                          multiple
                          ref={fileInputRef}
                        />
                        <label htmlFor="avatar-input">
                        <Button
                          variant="contained"
                          color="default"
                          onClick={handleImageUpload}
                        >
                          Upload Images
                        </Button>
                        </label>
                          <Avatar>
                            {imagesPreview && imagesPreview.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt="Product Preview"
                              />
                          ))}
                          </Avatar>
                        <Button
                          variant="contained"
                          fullWidth
                          type="submit"
                          disabled={loading ? true : false}
                        >
                          Create
                        </Button>
                      </FormGroup> 
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
