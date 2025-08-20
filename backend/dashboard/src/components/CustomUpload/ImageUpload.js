import React, { useState } from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

import { Button } from "reactstrap";

import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";

const ImageUpload = ({
  avatar,
  addBtnColor,
  addBtnClasses,
  changeBtnColor,
  changeBtnClasses,
  removeBtnColor,
  removeBtnClasses,
  submit,
  sendImages
}) => {
  const [file, setFile] = React.useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    avatar ? defaultAvatar : defaultImage
  );
  const fileInput = React.useRef(null);
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
    sendImages(images)
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  // eslint-disable-next-line
  const handleSubmit = (e) => {
    e.preventDefault();
    // file is the file/image uploaded
    // in this function you can save the image (file) on form submit
    // you have to call it yourself
  };
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
  };
  return (
    <div className="fileinput text-center">
      <input type="file" multiple onChange={createProductImagesChange} ref={fileInput} />
      <div className={"thumbnail" + (avatar ? " img-circle" : "")}>
        {imagesPreview && imagesPreview.map((image, index) => (
          <img
            key={index}
            src={image}
            className="add-product-img"
            alt="Product Preview"
          />
        ))}

      </div>
      <div>
        {file === null ? (
          <Button
            color={addBtnColor}
            className={addBtnClasses}
            onClick={() => handleClick()}
          >
            {avatar ? "Add Photo" : "Select image"}
          </Button>
        ) : (
          <span>
            <Button
              color={changeBtnColor}
              className={changeBtnClasses}
              onClick={() => handleClick()}
            >
              Change
            </Button>
            {avatar ? <br /> : null}
            <Button
              color={removeBtnColor}
              className={removeBtnClasses}
              onClick={() => handleRemove()}
            >
              <i className="fa fa-times" /> Remove
            </Button>
          </span>
        )}
      </div>
    </div>
  );
};

ImageUpload.defaultProps = {
  avatar: false,
  removeBtnClasses: "btn-round",
  removeBtnColor: "danger",
  addBtnClasses: "btn-round",
  addBtnColor: "primary",
  changeBtnClasses: "btn-round",
  changeBtnColor: "primary"
};

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  removeBtnClasses: PropTypes.string,
  removeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link"
  ]),
  addBtnClasses: PropTypes.string,
  addBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link"
  ]),
  changeBtnClasses: PropTypes.string,
  changeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link"
  ])
};

export default ImageUpload;
