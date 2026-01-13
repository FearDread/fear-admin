import React, { useState, useImperativeHandle } from "react";

// reactstrap components
import { Row, Col, Input } from "reactstrap";

import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";
import ImageUpload from "components/CustomUpload/ImageUpload.js";

const Step2 = React.forwardRef((props, ref) => {
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);


  const handleImages = (files) => {
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
  }
  const myform = new FormData();
  images && images.forEach((currImg) => {
    myform.append("images", currImg);
  });

  useImperativeHandle(ref, () => ({
    isValidated: undefined,
    state: { myform }
  }));

  return (
    <>
      <h5 className="info-text">Upload Product Media (Fileinput)</h5>
      <Row className="justify-content-center">
        <Col className="text-center" lg="10">
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
