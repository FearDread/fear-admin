import React, { useState, useImperativeHandle } from "react";

// reactstrap components
import { Row, Col, Input } from "reactstrap";

// core components
import ImageUpload from "components/CustomUpload/ImageUpload.js";

const Step2 = React.forwardRef((props, ref) => {
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const myform = new FormData();
  const handleImages = (images) => {
    setImages(images);
  }

  images && images.forEach((currImg) => {
    myform.append("images", currImg);
  });

  useImperativeHandle(ref, () => ({
    isValidated: undefined,
    state: {
      myform
    }
  }));

  return (
    <>
      <h5 className="info-text">Upload Product Media (Fileinput)</h5>
      <Row className="justify-content-center">
        <Col className="text-center" lg="10">
          {imagesPreview && imagesPreview.map((image, index) => (
            <img
              key={index}
              src={image}
              className="add-product-img"
              alt="Product Preview"
            />
          ))}
          <ImageUpload
            changeBtnClasses="btn-simple"
            addBtnClasses="btn-simple"
            removeBtnClasses="btn-simple"
            sendImages={handleImages}
          />
        </Col>
      </Row>
    </>
  );
});

export default Step2;
