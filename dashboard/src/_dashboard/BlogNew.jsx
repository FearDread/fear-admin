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
import { suppressDeprecationWarnings } from "moment";

const BlogNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [section, setSection] = useState("");
  const [likes , setLikes] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const { categories } = useSelector((state) => state.cat);
  const { user } = useSelector((state) => state.auth);
  const { sections } = useSelector((state) => state.sections);
  const { success, loading } = useSelector((state) => state.blog);

  const fileInputRef = useRef();

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };
  
  const createBlog = (e) => {
    e.preventDefault();
    const myForm = new FormData();
          
    myForm.set("title", title);
    myForm.set("author", author);
    myForm.set("section", section);
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

  useEffect(() => {
    dispatch(CatActions.list());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      history.push("/admin/blogs");
      dispatch({type: NEW_BLOG_RESET});
    }
  }, [dispatch, history, success]);

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
                        <Label sm="2">Select Section</Label>
                        <Col sm="10">
                          <FormGroup>
                            <Input
                              type="select"
                              name="category"
                              placeholder="Choose Category"
                              onChange={handleSectionChange} >
                              {sections.map((sec, key) => (
                                <option key={key} value={sec.title}>
                                  {sec.title}
                                </option>
                              ))}
                            </Input>
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
                                <option key={cate._id} value={cate.title}>
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
