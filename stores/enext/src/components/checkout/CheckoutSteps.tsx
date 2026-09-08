'use client';

import { useRouter } from 'next/navigation';

export type CheckoutStepId = 'cart' | 'details' | 'shipping' | 'payment' | 'review';

interface StepDef {
  id: CheckoutStepId;
  label: string;
  step: number;
  path: string;
}

interface CheckoutStepsProps {
  currentStep: CheckoutStepId;
  customSteps?: StepDef[] | null;
  allowNavigation?: boolean;
}

const DEFAULT_STEPS: StepDef[] = [
  { id: 'cart', label: 'Cart', step: 1, path: '/cart' },
  { id: 'details', label: 'Details', step: 2, path: '/checkout/details' },
  { id: 'shipping', label: 'Shipping', step: 3, path: '/checkout/shipping' },
  { id: 'payment', label: 'Payment', step: 4, path: '/checkout/payment' },
  { id: 'review', label: 'Review', step: 5, path: '/checkout/review' },
];

/**
 * CheckoutSteps — eFear design system progress indicator.
 * Converted from CRA: `useNavigate` → `useRouter` (next/navigation), PropTypes → TS.
 */
export default function CheckoutSteps({
  currentStep,
  customSteps = null,
  allowNavigation = true,
}: CheckoutStepsProps) {
  const router = useRouter();
  const steps = customSteps ?? DEFAULT_STEPS;
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const getStatus = (index: number): 'done' | 'active' | 'upcoming' => {
    if (index < currentStepIndex) return 'done';
    if (index === currentStepIndex) return 'active';
    return 'upcoming';
  };

  const handleClick = (step: StepDef, index: number) => {
    if (!allowNavigation) return;
    if (getStatus(index) === 'done') router.push(step.path);
  };

  return (
    <div className="co-steps">
      {steps.map((step, index) => {
        const status = getStatus(index);
        const clickable = status === 'done' && allowNavigation;
        return (
          <div
            key={step.id}
            className={`co-step ${status}`}
            onClick={() => handleClick(step, index)}
            title={
              status === 'done'
                ? `Go back to ${step.label}`
                : status === 'upcoming'
                  ? 'Complete previous steps first'
                  : step.label
            }
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick(step, index);
            }}
          >
            <div className="co-step-num">{status === 'done' ? '✓' : step.step}</div>
            <span className="co-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
