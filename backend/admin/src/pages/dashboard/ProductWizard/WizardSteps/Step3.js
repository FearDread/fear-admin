import React, { useState, useImperativeHandle } from "react";
import {
  Input,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  FormGroup,
  Label,
  FormFeedback,
  Card,
  CardBody,
  Button
} from "reactstrap";

/**
 * Modern Step 3 - Price & Stock
 * Works with react-step-wizard
 */
const Step3 = React.forwardRef((props, ref) => {
  const { 
    title, 
    subtitle, 
    onFinish,
    nextStep, 
    previousStep, 
    currentStep, 
    totalSteps,
    firstStep,
    lastStep,
    goToStep 
  } = props;

  // Form state
  const [formData, setFormData] = useState({
    price: "",
    quantity: "",
    country: "",
    discount: ""
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState(false);

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
      case "price":
        const priceNum = parseFloat(value);
        if (!value || isNaN(priceNum) || priceNum <= 0) {
          error = "Price must be greater than 0";
        } else if (priceNum > 1000000) {
          error = "Price seems unreasonably high";
        }
        break;

      case "quantity":
        const qtyNum = parseInt(value);
        if (value === "" || isNaN(qtyNum) || qtyNum < 0) {
          error = "Quantity must be 0 or greater";
        } else if (qtyNum > 100000) {
          error = "Quantity seems unreasonably high";
        }
        break;

      case "country":
        if (!value || value.length !== 2) {
          error = "Enter valid 2-letter country code (e.g., US, GB)";
        } else if (!/^[A-Z]{2}$/i.test(value)) {
          error = "Country code must contain only letters";
        }
        break;

      case "discount":
        if (value) {
          const discNum = parseFloat(value);
          if (isNaN(discNum) || discNum < 0 || discNum > 100) {
            error = "Discount must be between 0 and 100";
          }
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
   * Validate all required fields
   */
  const validateAll = () => {
    const fields = ["price", "quantity", "country"];
    let isValid = true;

    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    if (formData.discount) {
      const discountValid = validateField("discount", formData.discount);
      if (!discountValid) {
        isValid = false;
      }
    }

    const allTouched = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return isValid;
  };

  /**
   * Handle finish button click
   */
  const handleFinishClick = async () => {
    setIsValidating(true);
    
    if (validateAll()) {
      if (onFinish) {
        await onFinish();
      }
    }
    
    setIsValidating(false);
  };

  /**
   * Calculate final price with discount
   */
  const getFinalPrice = () => {
    if (!formData.price || errors.price) return null;
    
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount) || 0;
    
    return {
      original: price,
      discount: discount,
      discountAmount: price * (discount / 100),
      final: price * (1 - discount / 100),
      savings: price * (discount / 100)
    };
  };

  const priceInfo = getFinalPrice();

  /**
   * Expose validation and state to parent (Wizard)
   */
  useImperativeHandle(ref, () => ({
    isValidated: () => validateAll(),
    state: {
      data: formData
    }
  }));

  return (
    <>
      <div className="text-center mb-4">
        <h5 className="info-text text-white">
          <i className="fa fa-dollar mr-2"></i>
          {title || "Price & Stock"}
        </h5>
        <p className="text-light-2 small">
          {subtitle || "Set pricing, stock quantity, and discount"}
        </p>
      </div>

      <Row className="justify-content-center mt-4">
        {/* Price */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Price <span className="text-danger">*</span>
            </Label>
            <InputGroup className={errors.price && touched.price ? "has-danger" : ""}>
              <InputGroupText>
                <i className="fa fa-dollar" />
              </InputGroupText>
              <Input
                name="price"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange("price")}
                onBlur={handleBlur("price")}
                invalid={!!(errors.price && touched.price)}
                className="form-control-rounded"
              />
              {errors.price && touched.price && (
                <FormFeedback>{errors.price}</FormFeedback>
              )}
            </InputGroup>
            <small className="text-light-2">
              Enter product price in USD
            </small>
          </FormGroup>
        </Col>

        {/* Quantity */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Stock Quantity <span className="text-danger">*</span>
            </Label>
            <InputGroup className={errors.quantity && touched.quantity ? "has-danger" : ""}>
              <InputGroupText>
                <i className="fa fa-cubes" />
              </InputGroupText>
              <Input
                name="quantity"
                placeholder="0"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange("quantity")}
                onBlur={handleBlur("quantity")}
                invalid={!!(errors.quantity && touched.quantity)}
                className="form-control-rounded"
              />
              {errors.quantity && touched.quantity && (
                <FormFeedback>{errors.quantity}</FormFeedback>
              )}
            </InputGroup>
            <small className="text-light-2">
              Available units in stock
            </small>
          </FormGroup>
        </Col>

        {/* Country Code */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Country Code <span className="text-danger">*</span>
            </Label>
            <InputGroup className={errors.country && touched.country ? "has-danger" : ""}>
              <InputGroupText>
                <i className="fa fa-globe" />
              </InputGroupText>
              <Input
                name="country"
                placeholder="US"
                type="text"
                maxLength="2"
                value={formData.country}
                onChange={handleChange("country")}
                onBlur={handleBlur("country")}
                invalid={!!(errors.country && touched.country)}
                className="form-control-rounded text-uppercase"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.country && touched.country && (
                <FormFeedback>{errors.country}</FormFeedback>
              )}
            </InputGroup>
            <small className="text-light-2">
              Example: US, GB, CA, AU, DE
            </small>
          </FormGroup>
        </Col>

        {/* Discount */}
        <Col sm="10" md="5">
          <FormGroup>
            <Label className="text-light-1">
              Discount % <span className="text-light-2">(optional)</span>
            </Label>
            <InputGroup className={errors.discount && touched.discount ? "has-danger" : ""}>
              <InputGroupText>
                <i className="fa fa-percent" />
              </InputGroupText>
              <Input
                name="discount"
                placeholder="0"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleChange("discount")}
                onBlur={handleBlur("discount")}
                invalid={!!(errors.discount && touched.discount)}
                className="form-control-rounded"
              />
              {errors.discount && touched.discount && (
                <FormFeedback>{errors.discount}</FormFeedback>
              )}
            </InputGroup>
            <small className="text-light-2">
              Promotional discount (0-100%)
            </small>
          </FormGroup>
        </Col>
      </Row>

      {/* Price Summary Card */}
      {priceInfo && (
        <Row className="justify-content-center mt-4">
          <Col sm="10">
            <Card className="bg-primary-light border-primary">
              <CardBody>
                <h6 className="text-primary mb-3">
                  <i className="fa fa-calculator mr-2"></i>
                  Price Summary
                </h6>
                
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-light-1">Original Price:</span>
                    <span className="font-weight-bold text-white h5 mb-0">
                      ${priceInfo.original.toFixed(2)}
                    </span>
                  </div>
                  
                  {priceInfo.discount > 0 && (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-light-1">
                          Discount ({priceInfo.discount}%):
                        </span>
                        <span className="text-danger font-weight-semibold">
                          -${priceInfo.discountAmount.toFixed(2)}
                        </span>
                      </div>
                      
                      <hr className="my-2 border-light-2" />
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-success font-weight-bold h6 mb-0">
                          Final Price:
                        </span>
                        <span className="text-success font-weight-bold h4 mb-0">
                          ${priceInfo.final.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-center">
                        <small className="text-success">
                          <i className="fa fa-check-circle mr-1"></i>
                          You save ${priceInfo.savings.toFixed(2)}!
                        </small>
                      </div>
                    </>
                  )}
                </div>

                {formData.quantity && !errors.quantity && (
                  <div className="mt-3 pt-3 border-top border-light-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-light-1">
                        <i className="fa fa-box mr-2"></i>
                        Total Stock Value:
                      </span>
                      <span className="font-weight-bold text-info">
                        ${(priceInfo.final * parseInt(formData.quantity)).toFixed(2)}
                      </span>
                    </div>
                    <small className="text-light-2">
                      {formData.quantity} units × ${priceInfo.final.toFixed(2)}
                    </small>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

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
              Pricing Guidelines
            </h6>
            <ul className="text-light-2 small mb-0">
              <li>Set competitive prices based on market research</li>
              <li>Ensure stock quantity reflects actual inventory</li>
              <li>Use country code for region-specific pricing (ISO 3166-1 alpha-2)</li>
              <li>Discounts are optional but can boost sales significantly</li>
              <li>Consider profit margins when setting discount percentages</li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Navigation Buttons - react-step-wizard style */}
      <Row className="justify-content-center mt-5">
        <Col sm="10">
          <div className="d-flex justify-content-between">
            <Button
              color="secondary"
              className="btn-round"
              onClick={previousStep}
              style={{ minWidth: '120px' }}
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Previous
            </Button>

            <Button
              color="success"
              className="btn-round"
              onClick={handleFinishClick}
              disabled={isValidating}
              style={{ minWidth: '150px' }}
            >
              {isValidating ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  Validating...
                </>
              ) : (
                <>
                  <i className="fa fa-check mr-2"></i>
                  Create Product
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
});

Step3.displayName = "Step3";

export default Step3;