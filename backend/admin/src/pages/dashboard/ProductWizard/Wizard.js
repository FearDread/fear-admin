import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactWizard from "react-bootstrap-wizard";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { Col, Card, CardBody, Row } from "reactstrap";

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
 * Wizard step configuration
 */
const wizardSteps = [
  {
    stepName: "info",
    stepIcon: "tim-icons icon-single-02",
    component: Step1,
    stepProps: {
      title: "Basic Information",
      subtitle: "Enter product title, description, and category"
    }
  },
  {
    stepName: "images",
    stepIcon: "tim-icons icon-camera-18",
    component: Step2,
    stepProps: {
      title: "Product Media",
      subtitle: "Upload product images and media files"
    }
  },
  { 
    stepName: "pricing",
    stepIcon: "tim-icons icon-coins",
    component: Step3,
    stepProps: {
      title: "Price & Stock",
      subtitle: "Set pricing, stock quantity, and discount"
    }
  }
];

/**
 * Modern Product Wizard Component
 * Uses FeatureFactory for state management
 */
const Wizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
   * Process and submit wizard data
   */
  const handleFinish = async (wizardState) => {
    try {
      setIsSubmitting(true);

      // Extract data from wizard steps
      const infoData = wizardState.info?.state?.data || {};
      const imageData = wizardState.images?.state?.data || {};
      const pricingData = wizardState.pricing?.state?.data || {};

      // Prepare product payload
      const productData = {
        // Step 1 - Basic Info
        title: infoData.title,
        slug: infoData.title?.toLowerCase().replace(/\s+/g, "-"),
        description: infoData.description,
        category: infoData.category,
        brand: infoData.brand,
        tags: infoData.tags ? infoData.tags.split(",").map(t => t.trim()) : [],

        // Step 2 - Images
        images: imageData.images || [],

        // Step 3 - Pricing
        price: parseFloat(pricingData.price) || 0,
        quantity: parseInt(pricingData.quantity) || 0,
        countryCode: pricingData.country,
        discount: parseFloat(pricingData.discount) || 0,

        // Additional metadata
        status: "active",
        createdAt: new Date().toISOString()
      };

      // Validate required fields
      const validation = validateProductData(productData);
      if (!validation.isValid) {
        showErrorAlert(validation.error);
        setIsSubmitting(false);
        return;
      }

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
      await dispatch(createProduct(formData)).unwrap();

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

    if (!data.quantity || data.quantity < 0) {
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

  /**
   * Handle wizard navigation
   */
  const handleStepChange = (stepName) => {
    console.log(`Navigated to step: ${stepName}`);
  };

  /**
   * Enhance steps with additional props
   */
  const enhancedSteps = wizardSteps.map(step => ({
    ...step,
    component: React.forwardRef((props, ref) => {
      const StepComponent = step.component;
      return (
        <StepComponent
          ref={ref}
          {...props}
          {...step.stepProps}
          categories={categories}
          brands={brands}
        />
      );
    })
  }));

  return (
    <>
      <div className="container-fluid">
         <Row>
        <Col className="mr-auto ml-auto" md="10">
          <Card className="animated-border-box-glow">
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

              {/* Wizard */}
              <ReactWizard
                steps={wizardSteps}
                navSteps
                validate
                title="Product Creation Wizard"
                description="Complete all steps to add your product"
                headerTextCenter
                finishButtonClick={handleFinish}
                finishButtonClasses="btn-wd btn-success btn-round"
                nextButtonClasses="btn-wd btn-primary btn-round"
                previousButtonClasses="btn-wd btn-secondary btn-round"
                finishButtonText={isSubmitting ? "Creating..." : "Create Product"}
                progressbar
                color="primary"
                onStepChange={handleStepChange}
              />

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