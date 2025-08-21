
import React, { useState } from "react";
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";

// reactstrap components
import { FormGroup, Input, Row, Col, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

const Step3 = React.forwardRef((props, ref) => {
  const [country, setCountryCode] = useState();
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const myform = new FormData();

  myform.set('quantity', quantity);
  myform.set("price", price);

  React.useImperativeHandle(ref, () => ({
    isValidated: undefined,
    state: { myform }
  }));
  return (
    <>
      <form>
        <Row className="justify-content-center">
          <Col sm="12">
            <h5 className="info-text">Price and Stock</h5>
          </Col>
          <Col sm="5">
            <InputGroup
              className="input-group-focus">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="tim-icons icon-single-02" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                name="price"
                placeholder="Total Price ..."
                type="text"
                onChange={(e) => setPrice(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col sm="5">
            <InputGroup
              className="input-group-focus">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="tim-icons icon-single-02" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                name="# In Stock"
                placeholder="# In Stock"
                type="text"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </InputGroup>
          </Col>
                    <Col sm="5">
            <InputGroup
              className="input-group-focus">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="tim-icons icon-single-02" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                name="country"
                placeholder="Country Code"
                type="text"
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col sm="5">
            <InputGroup
              className="input-group-focus">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="tim-icons icon-single-02" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                name="discount"
                placeholder="Discount %"
                type="text"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </form>
    </>
  );
});

export default Step3;
