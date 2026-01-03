import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * CheckoutSteps Component
 * Displays a progress indicator for checkout process
 * 
 * @param {string} currentStep - Current step identifier ('cart', 'details', 'shipping', 'payment', 'review')
 * @param {array} customSteps - Optional custom steps configuration
 * @param {boolean} allowNavigation - Whether to allow clicking on previous steps
 */
const CheckoutSteps = ({ 
  currentStep = 'cart', 
  customSteps = null,
  allowNavigation = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Default checkout steps
  const defaultSteps = [
    {
      id: 'cart',
      label: 'Cart',
      icon: 'bx-cart',
      path: '/cart',
      step: 1,
    },
    {
      id: 'details',
      label: 'Details',
      icon: 'bx-user-circle',
      path: '/checkout/details',
      step: 2,
    },
    {
      id: 'shipping',
      label: 'Shipping',
      icon: 'bx-cube',
      path: '/checkout/shipping',
      step: 3,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: 'bx-credit-card',
      path: '/checkout/payment',
      step: 4,
    },
    {
      id: 'review',
      label: 'Review',
      icon: 'bx-check-circle',
      path: '/checkout/review',
      step: 5,
    },
  ];

  // Use custom steps if provided, otherwise use default
  const steps = customSteps || defaultSteps;

  // Find current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Determine if step is active, completed, or current
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStepIndex) {
      return 'completed'; // Previous steps
    } else if (stepIndex === currentStepIndex) {
      return 'current'; // Current step
    } else {
      return 'upcoming'; // Future steps
    }
  };

  // Handle step click
  const handleStepClick = (e, step, stepIndex) => {
    e.preventDefault();

    // Only allow navigation to current or previous steps
    if (!allowNavigation) {
      return;
    }

    const status = getStepStatus(stepIndex);
    
    // Can only click on completed steps or current step
    if (status === 'completed' || status === 'current') {
      navigate(step.path);
    }
  };

  // Get step classes
  const getStepClasses = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    const classes = ['step-item'];

    if (status === 'completed' || status === 'current') {
      classes.push('active');
    }

    if (status === 'current') {
      classes.push('current');
    }

    return classes.join(' ');
  };

  // Check if step is clickable
  const isStepClickable = (stepIndex) => {
    if (!allowNavigation) return false;
    const status = getStepStatus(stepIndex);
    return status === 'completed' || status === 'current';
  };

  return (
    <div className="card bg-transparent rounded-0 shadow-none">
      <div className="card-body">
        <div className="steps steps-light">
          {steps.map((step, index) => (
            <Link
              key={step.id}
              className={getStepClasses(index)}
              to={step.path}
              onClick={(e) => handleStepClick(e, step, index)}
              style={{ 
                cursor: isStepClickable(index) ? 'pointer' : 'default',
                opacity: getStepStatus(index) === 'upcoming' ? 0.6 : 1,
              }}
              title={
                isStepClickable(index) 
                  ? `Go to ${step.label}` 
                  : getStepStatus(index) === 'upcoming'
                    ? 'Complete previous steps first'
                    : step.label
              }
            >
              <div className="step-progress">
                <span className="step-count">
                  {getStepStatus(index) === 'completed' ? (
                    <i className="bx bx-check"></i>
                  ) : (
                    step.step
                  )}
                </span>
              </div>
              <div className="step-label">
                <i className={`bx ${step.icon}`}></i>
                {step.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

CheckoutSteps.propTypes = {
  currentStep: PropTypes.oneOf(['cart', 'details', 'shipping', 'payment', 'review']),
  customSteps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      step: PropTypes.number.isRequired,
    })
  ),
  allowNavigation: PropTypes.bool,
};

export default CheckoutSteps;