import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
import ImageUpload from "components/CustomUpload/ImageUpload.js";
import Loader from "components/Loader/Loading.js";
import * as BlogActions from "../_redux/blog/actions";
import * as CatActions from "../_redux/category/actions";
import { NEW_BLOG_RESET } from "_redux/blog/types";

const BlogNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [likes , setLikes] = useState("")
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fileInputRef = useRef();
  const { categories } = useSelector((state) => state.cat);
  const { user } = useSelector((state) => state.auth);
  const { success, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(CatActions.list());
  }, [dispatch]);

  useEffect(() => {
    console.log('success = ', success);

  }, [success, loading]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  
  const createBlog = (e) => {
    e.preventDefault();
    const myForm = new FormData();
          
    myForm.set("title", title);
    myForm.set("author", author);
    myForm.set("description", description);
    myForm.set("category", category);
    
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });
    myForm.set("user", user._id);
    
    dispatch(BlogActions.create(myForm));
  };

  const imagesChange = (e) => {
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
  
  const toastSuccess = () => {
    toast.success("Blog Added Successfullly!");
  }

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
                      <CardTitle tag="h4">Add Blog Post</CardTitle>
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
                        <Label sm="2">Author</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input
                              name="author"
                              required
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="2">Description</Label>
                        <Col sm="10">
                          <FormGroup>
                            <ReactQuill
                              theme="snow"
                              className="mt-3"
                              name="description"
                              onChange={setDescription}
                              value={description}
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
                        <Label sm="2">Publish to blog?</Label>
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
                            onChange={imagesChange}
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
                        onClick={createBlog}
                        disabled={loading ? true : false}>
                          SUBMIT BLOG
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

export default BlogNew;
