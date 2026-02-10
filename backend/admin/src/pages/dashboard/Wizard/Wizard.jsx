import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StepWizard from "react-step-wizard";
import { Col, Card, CardBody, Row, Button } from "reactstrap";
import {
  Modal,
  Button as RSButton,
  useToaster,
  Message
} from "rsuite";
// Product Steps
import ProductStep1 from "./ProductSteps/Step1";
import ProductStep2 from "./ProductSteps/Step2";
import ProductStep3 from "./ProductSteps/Step3";

// Blog Steps
import BlogStep1 from "./BlogSteps/Step1";
import BlogStep2 from "./BlogSteps/Step2";
import BlogStep3 from "./BlogSteps/Step3";
import {
  clearError as clearProductError,
  selectLoading as selectProductLoading,
  selectError as selectProductError,
  selectSuccess as selectProductSuccess,
  customCreateProduct
} from "../../../features/products/slice.js";
import {
  clearError as clearBlogError,
  selectLoading as selectBlogLoading,
  selectError as selectBlogError,
  selectSuccess as selectBlogSuccess,
  customCreatePost
} from "../../../features/blog/slice.js";
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

const WIZARD_CONFIGS = {
  product: {
    steps: [
      { name: 'Basic Info', icon: 'fa-info-circle', component: ProductStep1 },
      { name: 'Images', icon: 'fa-camera', component: ProductStep2 },
      { name: 'Pricing', icon: 'fa-dollar', component: ProductStep3 }
    ],
    title: 'Create New Product',
    icon: 'fa-shopping-bag',
    subtitle: 'Follow the steps to add a new product to your store',
    successMessage: 'Product created successfully!',
    redirectPath: '/admin/products'
  },
  blog: {
    steps: [
      { name: 'Content', icon: 'fa-edit', component: BlogStep1 },
      { name: 'Media', icon: 'fa-image', component: BlogStep2 },
      { name: 'Settings', icon: 'fa-cog', component: BlogStep3 }
    ],
    title: 'Create New Blog Post',
    icon: 'fa-newspaper',
    subtitle: 'Follow the steps to publish a new blog post',
    successMessage: 'Blog post created successfully!',
    redirectPath: '/admin/blog'
  }
};

const WizardNav = ({ currentStep, goToStep, steps }) => {
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
    </div>
  );
};

const Wizard = ( props ) => {
  const { type } = props || 'product';
  const config = WIZARD_CONFIGS[type];
  const toaster = useToaster();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wizardRef = useRef(null);
  const stepRefs = useRef([]);
  stepRefs.current = config.steps.map((_, i) => stepRefs.current[i] || React.createRef());
  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardInstance, setWizardInstance] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Redux state
  const currentUser = useSelector(selectCurrentUser);
  const categories = useSelector(selectAllCategories);
  const brands = useSelector(selectAllBrands);
  // Dynamic selectors based on type
  const loading = useSelector(type === 'product' ? selectProductLoading : selectBlogLoading);
  const error = useSelector(type === 'product' ? selectProductError : selectBlogError);
  const success = useSelector(type === 'product' ? selectProductSuccess : selectBlogSuccess);

  useEffect(() => {
    const fetchData = async () => {
      const promises = [dispatch(fetchCategories()).unwrap()];
      
      if (type === 'product') {
        promises.push(dispatch(fetchBrands()).unwrap());
      }
      
      await Promise.all(promises)
        .then((result) => {
          console.log('fetch data result : ', result);
        })
        .catch((err) => {
          console.error("Failed to fetch initial data:", err);
          showErrorAlert("Failed to load required data");
        });
    };
    
    fetchData();
    
    return () => {
      if (type === 'product') {
        dispatch(clearProductError());
      } else {
        dispatch(clearBlogError());
      }
    };
  }, [dispatch, type]);

  useEffect(() => {
    if (success && isSubmitting) {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      toaster.push(
        <Message showIcon type="success" closable>
          <strong>Success!</strong> {config.successMessage}
        </Message>,
        { placement: 'topEnd', duration: 3000 }
      );
    }
  }, [success, isSubmitting, toaster, config.successMessage]);

  useEffect(() => {
    if (error && isSubmitting) {
      setIsSubmitting(false);
      showErrorAlert(error);
    }
  }, [error, isSubmitting]);

  const onStepChange = (stats) => {
    setCurrentStep(stats.activeStep);
  };

  const validateStep = (stepNumber) => {
    const currentRef = stepRefs.current[stepNumber - 1];
    if (currentRef.current?.isValidated) {
      return currentRef.current.isValidated();
    }
    return true;
  };

  const collectWizardData = () => {
    return stepRefs.current.reduce((acc, ref, index) => {
      const stepData = ref.current?.state?.data || {};
      acc[`step${index + 1}`] = stepData;
      return acc;
    }, {});
  };

  const handleFinish = () => {
    if (!validateStep(config.steps.length)) return;

    setIsSubmitting(true);
    const wizardData = collectWizardData();
    
    if (type === 'product') {
      handleProductSubmit(wizardData);
    } else if (type === 'blog') {
      handleBlogSubmit(wizardData);
    }
  };

  const formatData = (data) => { 
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data.images)) {
        data.images.forEach(image => {
          formData.append('images', image);
        });
      } else if (key === 'tags' && Array.isArray(data.tags)) {
        formData.append('tags', JSON.stringify(data.tags));
      } else {
        formData.append(key, data[key]);
      }
    });

    return formData;
  }

  const handleProductSubmit = (wizardData) => {
    const { step1: info, step2: images, step3: pricing } = wizardData;

    const productData = {
      userId: currentUser._id,
      title: info.title,
      slug: info.title?.toLowerCase().replace(/\s+/g, "-"),
      description: info.description,
      category: info.category,
      brand: info.brand,
      tags: info.tags ? info.tags.split(",").map(t => t.trim()) : [],
      images: images.images || [],
      price: parseFloat(pricing.price) || 0,
      quantity: parseInt(pricing.quantity) || 0,
      countryCode: pricing.country?.toUpperCase(),
      discount: parseFloat(pricing.discount) || 0,
      finalPrice: pricing.price && pricing.discount
        ? parseFloat(pricing.price) * (1 - parseFloat(pricing.discount) / 100)
        : parseFloat(pricing.price) || 0,
      status: "active",
      inStock: parseInt(pricing.quantity) > 0,
      createdAt: new Date().toISOString()
    };

    const validation = validateProductData(productData);
    if (!validation.isValid) {
      showErrorAlert(validation.error);
      setIsSubmitting(false);
      return;
    }

    dispatch(customCreateProduct(productData));
  };

  const handleBlogSubmit = (wizardData) => {
    const { step1: content, step2: images, step3: settings } = wizardData;
    const blogData = {
      author: currentUser._id,
      authorName: currentUser.name || currentUser.username,
      title: content.title,
      slug: content.title?.toLowerCase().replace(/\s+/g, "-"),
      subtitle: content.subtitle,
      excerpt: content.excerpt,
      content: content.content,
      category: content.category,
      tags: content.tags ? content.tags.split(",").map(t => t.trim()) : [],
      featuredImage: images.featuredImage || null,
      //TODO: change this back to media.images || [] 
      images: images.images || [],
      published: settings.published || false,
      status: settings.published ? "published" : "draft",
      featured: settings.featured || false,
      allowComments: settings.allowComments !== false,
      visibility: settings.visibility || "public",
      seo: {
        metaTitle: settings.metaTitle || content.title,
        metaDescription: settings.metaDescription || content.excerpt,
        metaKeywords: content.tags ? content.tags.split(",").map(t => t.trim()) : []
      },
      publishedAt: settings.published ? new Date().toISOString() : null,
      createdAt: new Date().toISOString()
    };
    const validation = validateBlogData(blogData);
    if (!validation.isValid) {
      showErrorAlert(validation.error);
      setIsSubmitting(false);
      return;
    }
    const formData = formatData(blogData);
    console.log('blog data = ', blogData);
    dispatch(customCreatePost(blogData));
  };

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

  const validateBlogData = (data) => {
    if (!data.title || data.title.trim().length < 5) {
      return { isValid: false, error: "Blog title must be at least 5 characters" };
    }
    if (!data.content || data.content.trim().length < 50) {
      return { isValid: false, error: "Blog content must be at least 50 characters" };
    }
    if (!data.category) {
      return { isValid: false, error: "Please select a category" };
    }
    if (!data.excerpt || data.excerpt.trim().length < 20) {
      return { isValid: false, error: "Excerpt must be at least 20 characters" };
    }
    return { isValid: true };
  };

  const showErrorAlert = (errorMessage) => {
    toaster.push(
      <Message showIcon type="error" closable>
        <strong>Error!</strong> {errorMessage}
      </Message>,
      { placement: 'topEnd', duration: 5000 }
    );
  };

  const hideAlert = () => {
    setShowSuccessModal(false);
    if (type === 'product') {
      dispatch(clearProductError());
    } else {
      dispatch(clearBlogError());
    }
    navigate(config.redirectPath);
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
                    <i className={`fa ${config.icon} mr-2`}></i>
                    {config.title}
                  </h2>
                  <p className="text-light-2">
                    {config.subtitle}
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
                          steps={config.steps}
                        />
                      }
                    >
                      {config.steps.map((step, index) => {
                        const StepComponent = step.component;
                        return (
                          <StepComponent
                            key={index}
                            ref={stepRefs.current[index]}
                            categories={categories}
                            brands={brands}
                            currentUser={currentUser}
                            onFinish={index === config.steps.length - 1 ? handleFinish : undefined}
                          />
                        );
                      })}
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
                        {isSubmitting ? `Creating your ${type}...` : "Loading..."}
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
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-check-circle text-success mr-2"></i>
            Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            {config.successMessage}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={hideAlert} appearance="primary" color="blue">
            <i className="fa fa-check mr-2"></i>
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