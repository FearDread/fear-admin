import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StepWizard from "react-step-wizard";
import { Col, Card, CardBody, Row, Button } from "reactstrap";

import {
  clearError,
  selectLoading,
  selectError,
  selectSuccess,
  customCreateProduct
} from "../../../features/products/slice.js";
import {
  fetchCategories,
  selectAllCategories
} from "../../../features/categories/slice.js";
import {
  fetchBrands,
  selectAllBrands
} from "../../../features/brands/slice.js";
import {
  selectCurrentUser
} from "../../../features/user/slice.js";
import {
  Modal,
  Button as RSButton,
} from "rsuite";
import Step1 from "./ProductSteps/Step1.js";
import Step2 from "./ProductSteps/Step2.js";
import Step3 from "./ProductSteps/Step3.js";
import ReactAlert from "../../../components/ReactAlert/ReactAlert";

const WizardNav = ({
  currentStep,
  goToStep,
}) => {
  const steps = [
    { name: 'Basic Info', icon: 'fa-info-circle' },
    { name: 'Images', icon: 'fa-camera' },
    { name: 'Pricing', icon: 'fa-dollar' }
  ];

  return (
    <div className="wizard-navigation mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className="text-center flex-fill"
              style={{ cursor: index < currentStep ? 'pointer' : 'default' }}
              onClick={() => index < currentStep && goToStep(index + 1)}
            >
              <div
                className={`wizard-step-icon mx-auto mb-2 ${index + 1 === currentStep
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
                className={`d-block ${index + 1 === currentStep ? 'text-primary' : 'text-light-2'
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
    </div>
  );
};

const Wizard = ({ steps }) => {
  const wizardType = steps || 'product';

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
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const categories = useSelector(selectAllCategories);
  const brands = useSelector(selectAllBrands);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const productSteps = [
    Step1,
    Step2,
    Step3
  ]
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(fetchCategories()).unwrap(),
        dispatch(fetchBrands()).unwrap()
      ])
        .then((result) => {
          console.log('fetch data result : ', result);
        })
        .catch((err) => {
          console.error("Failed to fetch initial data:", err);
          showErrorAlert("Failed to load categories and brands");
        });
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
  const handleFinish = () => {

    if (!validateStep(3)) return;

    setIsSubmitting(true);

    const wizardData = collectWizardData();
    const { info, images, pricing } = wizardData;

    console.log('Collected Wizard Data:', wizardData);

    // Prepare product payload
    const productData = {
      // current user 
      userId: currentUser._id,
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

    const formData = new FormData();

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
    const result = dispatch(customCreateProduct(formData));
    console.log('product creation result = ', result);

    //console.error("Product creation failed:", err);
    setIsSubmitting(false);
    showSuccessAlert();
    //showErrorAlert(err.message || "Failed to create product");
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
    setShowSuccessModal(true);
  };

  /**
   * Show error alert
   */
  const showErrorAlert = (errorMessage) => {

  };

  /**
   * Hide alert
   */
  const hideAlert = () => {
    setShowSuccessModal(false);
    dispatch(clearError());
    navigate('/admin/products');
  };

  return (
    <>
      <div className="container-fluid">
        <Row>
          <Col className="mr-auto ml-auto" md="10">
            <Card className="media-object">
              <CardBody>
                <div className="text-center mb-4">
                  <h2 className="text-white font-weight-bold">
                    <i className="fa fa-magic mr-2"></i>
                    Create New Product
                  </h2>
                  <p className="text-light-2">
                    Follow the steps to add a new product to your store
                  </p>
                </div>

                <Card className="media-object">
                  <CardBody>
                    <StepWizard
                      ref={wizardRef}
                      instance={setWizardInstance}
                      onStepChange={onStepChange}
                      nav={
                        <WizardNav
                          isSubmitting={isSubmitting}
                          lastStep={step3Ref}
                        />
                      }
                    >
                      <Step1
                        ref={step1Ref}
                        categories={categories}
                        brands={brands}
                        title="Basic Information"
                        subtitle="Enter product title, description, and category"
                      />
                      <Step2
                        ref={step2Ref}
                        title="Product Media"
                        subtitle="Upload product images and media files"
                      />
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
      {/* Success Confirmation Modal */}
      <Modal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        size="xs"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            You have successfully added new product to catelog!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={hideAlert} appearance="primary" color="blue">
            <i className="fa fa-trash mr-2"></i>
            OK
          </RSButton>
          <RSButton onClick={() => setShowSuccessModal(false)} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Wizard;