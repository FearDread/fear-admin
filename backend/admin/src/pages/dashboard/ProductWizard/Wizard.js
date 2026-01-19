import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StepWizard from "react-step-wizard";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { Col, Card, CardBody, Row, Button } from "reactstrap";

// Import Feature Factory actions
import { 
  createProduct, 
  clearError,
  selectLoading,
  selectError,
  selectSuccess
} from "../../../features/products/slice";

import {
  fetchCategories,
  selectAllCategories
} from "../../../features/categories/slice";

import {
  fetchBrands,
  selectAllBrands
} from "../../../features/brands/slice";

// Import wizard steps
import Step1 from "./WizardSteps/Step1.js";
import Step2 from "./WizardSteps/Step2.js";
import Step3 from "./WizardSteps/Step3.js";

/**
 * Custom Navigation Component
 */
const WizardNav = ({ 
  currentStep, 
  totalSteps, 
  nextStep, 
  previousStep, 
  goToStep,
  firstStep,
  lastStep,
  isSubmitting
}) => {
  const steps = [
    { name: 'Basic Info', icon: 'fa-info-circle' },
    { name: 'Images', icon: 'fa-camera' },
    { name: 'Pricing', icon: 'fa-dollar' }
  ];

  return (
    <div className="wizard-navigation mb-4">
      {/* Progress Steps */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className="text-center flex-fill"
              style={{ cursor: index < currentStep ? 'pointer' : 'default' }}
              onClick={() => index < currentStep && goToStep(index + 1)}
            >
              <div 
                className={`wizard-step-icon mx-auto mb-2 ${
                  index + 1 === currentStep 
                    ? 'active' 
                    : index < currentStep 
                    ? 'completed' 
                    : ''
                }`}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  borderColor: index + 1 <= currentStep ? '#7934f3' : 'rgba(255,255,255,0.3)',
                  backgroundColor: index + 1 <= currentStep ? '#7934f3' : 'transparent',
                  color: index + 1 <= currentStep ? 'white' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease'
                }}
              >
                {index < currentStep ? (
                  <i className="fa fa-check"></i>
                ) : (
                  <i className={`fa ${step.icon}`}></i>
                )}
              </div>
              <small 
                className={`d-block ${
                  index + 1 === currentStep ? 'text-primary' : 'text-light-2'
                }`}
                style={{ fontSize: '0.85rem' }}
              >
                {step.name}
              </small>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className="flex-fill mx-3"
                style={{
                  height: '2px',
                  backgroundColor: index < currentStep ? '#7934f3' : 'rgba(255,255,255,0.2)',
                  marginTop: '-20px',
                  transition: 'all 0.3s ease'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          color="secondary"
          className="btn-round"
          onClick={previousStep}
          disabled={currentStep === 1}
          style={{ minWidth: '120px' }}
        >
          <i className="fa fa-arrow-left mr-2"></i>
          Previous
        </Button>

        <div className="text-center text-light-2">
          <small>Step {currentStep} of {totalSteps}</small>
        </div>

        {!lastStep ? (
          <Button
            color="primary"
            className="btn-round"
            onClick={nextStep}
            style={{ minWidth: '120px' }}
          >
            Next
            <i className="fa fa-arrow-right ml-2"></i>
          </Button>
        ) : (
          <Button
            color="success"
            className="btn-round"
            disabled={isSubmitting}
            style={{ minWidth: '120px' }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2"></span>
                Creating...
              </>
            ) : (
              <>
                <i className="fa fa-check mr-2"></i>
                Create Product
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Modern Product Wizard Component
 * Uses FeatureFactory for state management
 */
const Wizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wizardRef = useRef(null);
  
  // Refs for each step
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);

  // Local state
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardInstance, setWizardInstance] = useState(null);

  // Redux state from FeatureFactory slices
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const categories = useSelector(selectAllCategories);
  const brands = useSelector(selectAllBrands);

  /**
   * Fetch required data on mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCategories()).unwrap(),
          dispatch(fetchBrands()).unwrap()
        ]);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        showErrorAlert("Failed to load categories and brands");
      }
    };

    fetchData();
    
    // Cleanup
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  /**
   * Handle successful product creation
   */
  useEffect(() => {
    if (success && isSubmitting) {
      setIsSubmitting(false);
      showSuccessAlert();
    }
  }, [success, isSubmitting]);

  /**
   * Handle errors
   */
  useEffect(() => {
    if (error && isSubmitting) {
      setIsSubmitting(false);
      showErrorAlert(error);
    }
  }, [error, isSubmitting]);

  /**
   * Handle step change
   */
  const onStepChange = (stats) => {
    setCurrentStep(stats.activeStep);
  };

  /**
   * Validate current step before moving forward
   */
  const validateStep = (stepNumber) => {
    const refs = [step1Ref, step2Ref, step3Ref];
    const currentRef = refs[stepNumber - 1];

    if (currentRef.current?.isValidated) {
      return currentRef.current.isValidated();
    }
    
    return true; // If no validation function, allow proceeding
  };

  /**
   * Custom next step handler with validation
   */
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      wizardInstance?.nextStep();
    }
  };

  /**
   * Collect all wizard data
   */
  const collectWizardData = () => {
    const step1Data = step1Ref.current?.state?.data || {};
    const step2Data = step2Ref.current?.state?.data || {};
    const step3Data = step3Ref.current?.state?.data || {};

    return {
      info: step1Data,
      images: step2Data,
      pricing: step3Data
    };
  };

  /**
   * Process and submit wizard data
   */
  const handleFinish = async () => {
    try {
      // Validate final step
      if (!validateStep(3)) {
        return;
      }

      setIsSubmitting(true);

      // Collect all data
      const wizardData = collectWizardData();
      const { info, images, pricing } = wizardData;

      console.log('Collected Wizard Data:', wizardData);

      // Prepare product payload
      const productData = {
        // Step 1 - Basic Info
        title: info.title,
        slug: info.title?.toLowerCase().replace(/\s+/g, "-"),
        description: info.description,
        category: info.category,
        brand: info.brand,
        tags: info.tags ? info.tags.split(",").map(t => t.trim()) : [],

        // Step 2 - Images
        images: images.images || [],

        // Step 3 - Pricing
        price: parseFloat(pricing.price) || 0,
        quantity: parseInt(pricing.quantity) || 0,
        countryCode: pricing.country?.toUpperCase(),
        discount: parseFloat(pricing.discount) || 0,

        // Calculate final price
        finalPrice: pricing.price && pricing.discount 
          ? parseFloat(pricing.price) * (1 - parseFloat(pricing.discount) / 100)
          : parseFloat(pricing.price) || 0,

        // Additional metadata
        status: "active",
        inStock: parseInt(pricing.quantity) > 0,
        createdAt: new Date().toISOString()
      };

      // Validate required fields
      const validation = validateProductData(productData);
      if (!validation.isValid) {
        showErrorAlert(validation.error);
        setIsSubmitting(false);
        return;
      }

      console.log('Final Product Data:', productData);

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(productData).forEach(key => {
        if (key === 'images' && Array.isArray(productData.images)) {
          productData.images.forEach(image => {
            formData.append('images', image);
          });
        } else if (key === 'tags' && Array.isArray(productData.tags)) {
          formData.append('tags', JSON.stringify(productData.tags));
        } else {
          formData.append(key, productData[key]);
        }
      });

      // Dispatch create action
      await dispatch(createProduct(productData)).unwrap();

    } catch (err) {
      console.error("Product creation failed:", err);
      setIsSubmitting(false);
      showErrorAlert(err.message || "Failed to create product");
    }
  };

  /**
   * Validate product data before submission
   */
  const validateProductData = (data) => {
    if (!data.title || data.title.trim().length < 3) {
      return { isValid: false, error: "Product title must be at least 3 characters" };
    }

    if (!data.description || data.description.trim().length < 10) {
      return { isValid: false, error: "Product description must be at least 10 characters" };
    }

    if (!data.category) {
      return { isValid: false, error: "Please select a category" };
    }

    if (!data.brand) {
      return { isValid: false, error: "Please select a brand" };
    }

    if (!data.price || data.price <= 0) {
      return { isValid: false, error: "Price must be greater than 0" };
    }

    if (data.quantity === undefined || data.quantity < 0) {
      return { isValid: false, error: "Quantity must be 0 or greater" };
    }

    if (!data.images || data.images.length === 0) {
      return { isValid: false, error: "Please upload at least one product image" };
    }

    return { isValid: true };
  };

  /**
   * Show success alert
   */
  const showSuccessAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => {
          hideAlert();
          navigate("/admin/products");
        }}
        confirmBtnBsStyle="success"
        confirmBtnText="View Products"
        btnSize=""
      >
        <div className="text-center">
          <i className="fa fa-check-circle" style={{ fontSize: '48px', color: '#04b962' }}></i>
          <p className="mt-3">Product has been added to your store successfully!</p>
        </div>
      </ReactBSAlert>
    );
  };

  /**
   * Show error alert
   */
  const showErrorAlert = (errorMessage) => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={hideAlert}
        confirmBtnBsStyle="danger"
        confirmBtnText="Try Again"
        btnSize=""
      >
        <div className="text-center">
          <i className="fa fa-exclamation-triangle" style={{ fontSize: '48px', color: '#f43643' }}></i>
          <p className="mt-3">{errorMessage}</p>
        </div>
      </ReactBSAlert>
    );
  };

  /**
   * Hide alert
   */
  const hideAlert = () => {
    setAlert(null);
    dispatch(clearError());
  };

  return (
    <>
      {alert}
      
      <div className="container-fluid">
        <Row>
          <Col className="mr-auto ml-auto" md="10">
            <Card className="media-object">
              <CardBody>
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="text-white font-weight-bold">
                    <i className="fa fa-magic mr-2"></i>
                    Create New Product
                  </h2>
                  <p className="text-light-2">
                    Follow the steps to add a new product to your store
                  </p>
                </div>

                {/* Wizard Container */}
                <Card className="media-object">
                  <CardBody>
                    <StepWizard
                      ref={wizardRef}
                      instance={setWizardInstance}
                      onStepChange={onStepChange}
                      nav={
                        <WizardNav 
                          isSubmitting={isSubmitting}
                        />
                      }
                    >
                      {/* Step 1 - Basic Information */}
                      <Step1
                        ref={step1Ref}
                        categories={categories}
                        brands={brands}
                        title="Basic Information"
                        subtitle="Enter product title, description, and category"
                      />

                      {/* Step 2 - Product Images */}
                      <Step2
                        ref={step2Ref}
                        title="Product Media"
                        subtitle="Upload product images and media files"
                      />

                      {/* Step 3 - Pricing */}
                      <Step3
                        ref={step3Ref}
                        title="Price & Stock"
                        subtitle="Set pricing, stock quantity, and discount"
                        onFinish={handleFinish}
                      />
                    </StepWizard>
                  </CardBody>
                </Card>

                {/* Loading Overlay */}
                {(loading || isSubmitting) && (
                  <div 
                    className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ 
                      top: 0, 
                      left: 0, 
                      background: 'rgba(0,0,0,0.7)',
                      zIndex: 9999,
                      borderRadius: '0.25rem'
                    }}
                  >
                    <div className="text-center">
                      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p className="text-white">
                        {isSubmitting ? "Creating your product..." : "Loading..."}
                      </p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Wizard;