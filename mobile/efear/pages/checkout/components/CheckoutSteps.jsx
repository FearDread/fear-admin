import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * CheckoutSteps — eFear design system progress indicator.
 *
 * @param {string}  currentStep    - Active step id: 'cart' | 'details' | 'shipping' | 'payment' | 'review'
 * @param {array}   customSteps    - Optional custom step definitions
 * @param {boolean} allowNavigation - Allow clicking completed steps to go back
 */
const CheckoutSteps = ({
  currentStep    = 'cart',
  customSteps    = null,
  allowNavigation = true,
}) => {
  const navigate = useNavigate();

  const defaultSteps = [
    { id: 'cart',     label: 'Cart',     step: 1, path: '/cart' },
    { id: 'details',  label: 'Details',  step: 2, path: '/checkout/details' },
    { id: 'shipping', label: 'Shipping', step: 3, path: '/checkout/shipping' },
    { id: 'payment',  label: 'Payment',  step: 4, path: '/checkout/payment' },
    { id: 'review',   label: 'Review',   step: 5, path: '/checkout/review' },
  ];

  const steps           = customSteps || defaultSteps;
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const getStatus = (index) => {
    if (index < currentStepIndex)  return 'done';
    if (index === currentStepIndex) return 'active';
    return 'upcoming';
  };

  const handleClick = (e, step, index) => {
    e.preventDefault();
    if (!allowNavigation) return;
    if (getStatus(index) === 'done') navigate(step.path);
  };

  return (
    <div className="co-steps">
      {steps.map((step, index) => {
        const status = getStatus(index);
        return (
          <div
            key={step.id}
            className={`co-step ${status}`}
            onClick={(e) => handleClick(e, step, index)}
            title={
              status === 'done'
                ? `Go back to ${step.label}`
                : status === 'upcoming'
                  ? 'Complete previous steps first'
                  : step.label
            }
            role={status === 'done' && allowNavigation ? 'button' : undefined}
            tabIndex={status === 'done' && allowNavigation ? 0 : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick(e, step, index);
            }}
          >
            <div className="co-step-num">
              {status === 'done' ? '✓' : step.step}
            </div>
            <span className="co-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

CheckoutSteps.propTypes = {
  currentStep: PropTypes.oneOf(['cart', 'details', 'shipping', 'payment', 'review']),
  customSteps: PropTypes.arrayOf(
    PropTypes.shape({
      id:    PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      path:  PropTypes.string.isRequired,
      step:  PropTypes.number.isRequired,
    })
  ),
  allowNavigation: PropTypes.bool,
};

export default CheckoutSteps;