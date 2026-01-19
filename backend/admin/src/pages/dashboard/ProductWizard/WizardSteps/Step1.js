import React, { useState, useImperativeHandle, useEffect } from "react";
import {
  Input,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  FormGroup,
  Label,
  FormFeedback
} from "reactstrap";

/**
 * Modern Step 1 - Basic Information
 * Uses controlled components with validation
 */
const Step1 = React.forwardRef((props, ref) => {
  const { categories = [], brands = [], title, subtitle } = props;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    tags: ""
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  /**
   * Handle input blur for validation
   */
  const handleBlur = (field) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, formData[field]);
  };

  /**
   * Validate individual field
   */
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "title":
        if (!value || value.trim().length < 3) {
          error = "Title must be at least 3 characters";
        } else if (value.length > 100) {
          error = "Title must not exceed 100 characters";
        }
        break;

      case "description":
        if (!value || value.trim().length < 10) {
          error = "Description must be at least 10 characters";
        } else if (value.length > 1000) {
          error = "Description must not exceed 1000 characters";
        }
        break;

      case "category":
        if (!value) {
          error = "Please select a category";
        }
        break;

      case "brand":
        if (!value) {
          error = "Please select a brand";
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  /**
   * Validate all fields
   */
  const validateAll = () => {
    const fields = ["title", "description", "category", "brand"];
    let isValid = true;

    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    // Mark all as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return isValid;
  };

  /**
   * Expose validation and state to parent (Wizard)
   */
  useImperativeHandle(ref, () => ({
    isValidated: () => validateAll(),
    state: {
      data: formData
    }
  }));

  /**
   * Character count helper
   */
  const getCharCount = (field, max) => {
    const current = formData[field]?.length || 0;
    const remaining = max - current;
    const percentage = (current / max) * 100;
    
    let color = "text-success";
    if (percentage > 80) color = "text-warning";
    if (percentage > 95) color = "text-danger";

    return (
      <small className={`${color} float-right`}>
        {current}/{max} characters
      </small>
    );
  };

  return (
    <>
      <div className="text-center mb-4">
        <h5 className="info-text text-white">
          <i className="fa fa-info-circle mr-2"></i>
          {title || "Basic Information"}
        </h5>
        <p className="text-light-2 small">
          {subtitle || "Enter product title, description, and category"}
        </p>
      </div>

      <Row className="justify-content-center mt-4">
        {/* Product Title */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Product Title <span className="text-danger">*</span>
            </Label>
            <InputGroup className={errors.title && touched.title ? "has-danger" : ""}>
                <InputGroupText>
                  <i className="fa fa-tag" />
                </InputGroupText>
              <Input
                name="title"
                placeholder="Enter product title..."
                type="text"
                value={formData.title}
                onChange={handleChange("title")}
                onBlur={handleBlur("title")}
                invalid={!!(errors.title && touched.title)}
                className="form-control-rounded"
              />
              {errors.title && touched.title && (
                <FormFeedback>{errors.title}</FormFeedback>
              )}
            </InputGroup>
            {getCharCount("title", 100)}
          </FormGroup>
        </Col>

        {/* Category */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Category <span className="text-danger">*</span>
            </Label>
            <InputGroup className={errors.category && touched.category ? "has-danger" : ""}>

                <InputGroupText>
                  <i className="fa fa-folder-open" />
                </InputGroupText>

              <Input
                type="select"
                name="category"
                value={formData.category}
                onChange={handleChange("category")}
                onBlur={handleBlur("category")}
                invalid={!!(errors.category && touched.category)}
                className="form-control-rounded"
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </Input>
              {errors.category && touched.category && (
                <FormFeedback>{errors.category}</FormFeedback>
              )}
            </InputGroup>
          </FormGroup>
        </Col>

        {/* Brand */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Brand <span className="text-danger">*</span>
            </Label>
            <InputGroup className={errors.brand && touched.brand ? "has-danger" : ""}>

                <InputGroupText>
                  <i className="fa fa-certificate" />
                </InputGroupText>

              <Input
                type="select"
                name="brand"
                value={formData.brand}
                onChange={handleChange("brand")}
                onBlur={handleBlur("brand")}
                invalid={!!(errors.brand && touched.brand)}
                className="form-control-rounded"
              >
                <option value="">Select Brand...</option>
                {brands.map((brand) => (
                  <option key={brand._id || brand.id} value={brand.title}>
                    {brand.title}
                  </option>
                ))}
              </Input>
              {errors.brand && touched.brand && (
                <FormFeedback>{errors.brand}</FormFeedback>
              )}
            </InputGroup>
          </FormGroup>
        </Col>

        {/* Tags */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Tags <span className="text-light-2">(optional)</span>
            </Label>
            <InputGroup>
                <InputGroupText>
                  <i className="fa fa-tags" />
                </InputGroupText>
              <Input
                name="tags"
                placeholder="Separate tags with commas..."
                type="text"
                value={formData.tags}
                onChange={handleChange("tags")}
                className="form-control-rounded"
              />
            </InputGroup>
            <small className="text-light-2">
              Example: electronics, smartphone, wireless
            </small>
          </FormGroup>
        </Col>

        {/* Description */}
        <Col sm="10">
          <FormGroup>
            <Label className="text-light-1">
              Product Description <span className="text-danger">*</span>
            </Label>
            <InputGroup className={errors.description && touched.description ? "has-danger" : ""}>

                <InputGroupText>
                  <i className="fa fa-align-left" />
                </InputGroupText>

              <Input
                type="textarea"
                name="description"
                value={formData.description}
                placeholder="Provide a detailed description of your product..."
                rows="5"
                onChange={handleChange("description")}
                onBlur={handleBlur("description")}
                invalid={!!(errors.description && touched.description)}
                className="form-control-rounded"
                style={{ minHeight: "120px" }}
              />
              {errors.description && touched.description && (
                <FormFeedback>{errors.description}</FormFeedback>
              )}
            </InputGroup>
            {getCharCount("description", 1000)}
          </FormGroup>
        </Col>
      </Row>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
        <Row className="justify-content-center mt-3">
          <Col sm="10">
            <div className="alert alert-warning">
              <i className="fa fa-exclamation-triangle mr-2"></i>
              <strong>Please fix the following errors:</strong>
              <ul className="mb-0 mt-2">
                {Object.entries(errors)
                  .filter(([key, value]) => value && touched[key])
                  .map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
              </ul>
            </div>
          </Col>
        </Row>
      )}

      {/* Help Text */}
      <Row className="justify-content-center mt-4">
        <Col sm="10">
          <div className="bg-dark-light p-3 rounded">
            <h6 className="text-primary mb-2">
              <i className="fa fa-lightbulb-o mr-2"></i>
              Tips for Better Product Listings
            </h6>
            <ul className="text-light-2 small mb-0">
              <li>Use descriptive, keyword-rich titles to improve searchability</li>
              <li>Provide detailed descriptions highlighting key features and benefits</li>
              <li>Select the most accurate category and brand for your product</li>
              <li>Add relevant tags to help customers find your product</li>
            </ul>
          </div>
        </Col>
      </Row>
    </>
  );
});

Step1.displayName = "Step1";

export default Step1;