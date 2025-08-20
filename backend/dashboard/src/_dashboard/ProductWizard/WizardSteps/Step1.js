import React, { useImperativeHandle, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import classnames from "classnames";
import {
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import { verifyEmail, verifyNumber, verifyLength } from "../../../_utils/validation";

const Step1 = React.forwardRef((props, ref) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState(0);
  const [brand, setBrand] = useState("")
  const categories = useSelector((state) => state.cat.categories);
  const { brands } = useSelector((state) => state.brand);
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const myform = new FormData();

  myform.set('title', title);
  myform.set("description", description);
  myform.set("category", category);
  myform.set("brand", brand);
  myform.set("tags", tags);
  
  useImperativeHandle(ref, () => ({
    isValidated: undefined,
    state: { myform },
  }));
  return (
    <>
      <h5 className="info-text">
        Let's start with the basic information (with validation)
      </h5>
      <Row className="justify-content-center mt-5">
        <Col sm="5">
          <InputGroup
            className="input-group-focus">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-single-02" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name="title"
              placeholder="Product Title ..."
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputGroup>
          <InputGroup
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-email-85" />
              </InputGroupText>
            </InputGroupAddon>
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
          </InputGroup>
        </Col>
        <Col sm="5">
          <InputGroup >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-caps-small" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="select"
              name="brand"
              placeholder="Choose Category"
              onChange={handleBrandChange} >
              {brands.map((b, key) => (
                <option key={b._id} value={b.title}>
                  {b.title}
                </option>
              ))}
            </Input>
          </InputGroup>
          <InputGroup
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-mobile" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name="tags"
              placeholder="Tags, List, ..."
              type="tags"
              onChange={(e) => setTags(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col sm="10">
          <InputGroup
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-square-pin" />
              </InputGroupText>
            </InputGroupAddon>
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
          </InputGroup>
        </Col>
      </Row>
    </>
  );
});

export default Step1;
