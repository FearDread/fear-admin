// BlogSteps/Step1.js
import React, { useState, useImperativeHandle } from "react";
import {
  Input,
  Row,
  Col,
  FormGroup,
  Label,
  FormFeedback,
  Button
} from "reactstrap";

const BlogStep1 = React.forwardRef((props, ref) => {
  const { 
    categories = [], 
    nextStep,
    previousStep,
    currentStep,
    totalSteps,
    firstStep
  } = props;

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    content: "",
    category: "",
    tags: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "title":
        if (!value || value.trim().length < 5) {
          error = "Title must be at least 5 characters";
        } else if (value.length > 200) {
          error = "Title must not exceed 200 characters";
        }
        break;

      case "excerpt":
        if (!value || value.trim().length < 20) {
          error = "Excerpt must be at least 20 characters";
        } else if (value.length > 500) {
          error = "Excerpt must not exceed 500 characters";
        }
        break;

      case "content":
        if (!value || value.trim().length < 50) {
          error = "Content must be at least 50 characters";
        }
        break;

      case "category":
        if (!value) {
          error = "Please select a category";
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

  const validateAll = () => {
    const fields = ["title", "excerpt", "content", "category"];
    let isValid = true;

    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    const allTouched = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return isValid;
  };

  const handleNextClick = () => {
    if (validateAll()) {
      nextStep();
    }
  };

  useImperativeHandle(ref, () => ({
    isValidated: () => validateAll(),
    state: {
      data: formData
    }
  }));

  const getCharCount = (field, max) => {
    const current = formData[field]?.length || 0;
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
          <i className="fa fa-edit mr-2"></i>
          Blog Content
        </h5>
        <p className="text-light-2 small">
          Write your blog post title, excerpt, and content
        </p>
      </div>

      <Row className="justify-content-center mt-4">
        {/* Title */}
        <Col sm="10">
          <FormGroup>
            <Label className="text-light-1">
              Post Title <span className="text-danger">*</span>
            </Label>
            <Input
              name="title"
              placeholder="Enter an engaging title for your blog post..."
              type="text"
              value={formData.title}
              onChange={handleChange("title")}
              onBlur={handleBlur("title")}
              invalid={!!(errors.title && touched.title)}
              className="form-control"
            />
            {errors.title && touched.title && (
              <FormFeedback>{errors.title}</FormFeedback>
            )}
            {getCharCount("title", 200)}
          </FormGroup>
        </Col>

        {/* Subtitle */}
        <Col sm="10" md="6">
          <FormGroup>
            <Label className="text-light-1">
              Subtitle <span className="text-light-2">(optional)</span>
            </Label>
            <Input
              name="subtitle"
              placeholder="Add a subtitle..."
              type="text"
              value={formData.subtitle}
              onChange={handleChange("subtitle")}
              className="form-control"
            />
            <small className="text-light-2">A brief subtitle or tagline</small>
          </FormGroup>
        </Col>

        {/* Category */}
        <Col sm="10" md="4">
          <FormGroup>
            <Label className="text-light-1">
              Category <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              name="category"
              value={formData.category}
              onChange={handleChange("category")}
              onBlur={handleBlur("category")}
              invalid={!!(errors.category && touched.category)}
              className="form-control"
            >
              <option value="">Select Category...</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.title}
                </option>
              ))}
            </Input>
            {errors.category && touched.category && (
              <FormFeedback>{errors.category}</FormFeedback>
            )}
          </FormGroup>
        </Col>

        {/* Excerpt */}
        <Col sm="10">
          <FormGroup>
            <Label className="text-light-1">
              Excerpt <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              name="excerpt"
              value={formData.excerpt}
              placeholder="Write a brief summary of your blog post (shown in previews)..."
              rows="3"
              onChange={handleChange("excerpt")}
              onBlur={handleBlur("excerpt")}
              invalid={!!(errors.excerpt && touched.excerpt)}
              className="form-control"
            />
            {errors.excerpt && touched.excerpt && (
              <FormFeedback>{errors.excerpt}</FormFeedback>
            )}
            {getCharCount("excerpt", 500)}
          </FormGroup>
        </Col>

        {/* Content */}
        <Col sm="10">
          <FormGroup>
            <Label className="text-light-1">
              Content <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              name="content"
              value={formData.content}
              placeholder="Write your blog post content here..."
              rows="12"
              onChange={handleChange("content")}
              onBlur={handleBlur("content")}
              invalid={!!(errors.content && touched.content)}
              className="form-control"
              style={{ minHeight: "300px" }}
            />
            {errors.content && touched.content && (
              <FormFeedback>{errors.content}</FormFeedback>
            )}
            <small className="text-light-2">
              {formData.content ? `${formData.content.split(/\s+/).length} words, ${Math.ceil(formData.content.split(/\s+/).length / 200)} min read` : '0 words'}
            </small>
          </FormGroup>
        </Col>

        {/* Tags */}
        <Col sm="10">
          <FormGroup>
            <Label className="text-light-1">
              Tags <span className="text-light-2">(optional)</span>
            </Label>
            <Input
              name="tags"
              placeholder="technology, programming, web development"
              type="text"
              value={formData.tags}
              onChange={handleChange("tags")}
              className="form-control"
            />
            <small className="text-light-2">
              Separate tags with commas for better discoverability
            </small>
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
              Content Writing Tips
            </h6>
            <ul className="text-light-2 small mb-0">
              <li>Write compelling titles that grab attention and include keywords</li>
              <li>Create a concise excerpt that summarizes your main points</li>
              <li>Break content into short paragraphs for better readability</li>
              <li>Use headings, bullet points, and formatting to organize content</li>
              <li>Add relevant tags to improve searchability and categorization</li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Navigation */}
      <Row className="justify-content-center mt-5">
        <Col sm="10">
          <div className="d-flex justify-content-between">
            <Button
              color="secondary"
              className="btn-round"
              onClick={firstStep}
              disabled={currentStep === 1}
              style={{ minWidth: '120px', visibility: currentStep === 1 ? 'hidden' : 'visible' }}
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Previous
            </Button>

            <div className="text-center">
              <small className="text-light-2">
                Step {currentStep} of {totalSteps}
              </small>
            </div>

            <Button
              color="primary"
              className="btn-round"
              onClick={handleNextClick}
              style={{ minWidth: '120px' }}
            >
              Next
              <i className="fa fa-arrow-right ml-2"></i>
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
});

BlogStep1.displayName = "BlogStep1";

export default BlogStep1;