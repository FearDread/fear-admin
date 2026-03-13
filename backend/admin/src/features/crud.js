import { useState } from "react";
import {
  Input as RSInput,
  Button as RSButton,
  useToaster,
  Message,
} from "rsuite";
/**
 * CrudFactory - Generic CRUD Handler using Promise then/catch pattern
 * 
 * A reusable factory for creating CRUD handlers across different entities
 * Uses promise chaining instead of async/await for better error propagation control
 */

export const CrudFactory = ({
  entity,
  actions,
  selectors,
  toaster,
  dispatch,
}) => {
    const [loading, setLoading] = useState(false);
    
  return (method, { formValue, selectedItem, callbacks = {} }) => {
    const operationMap = {
      CREATE: {
        action: actions.create,
        message: `${entity} created successfully`,
        requiresSelection: false,
      },
      UPDATE: {
        action: actions.update,
        message: `${entity} updated successfully`,
        requiresSelection: true,
      },
      DELETE: {
        action: actions.delete,
        message: `${entity} deleted successfully`,
        requiresSelection: true,
      },
    };

    const operation = operationMap[method];

    // Validation checks
    if (!operation) {
      const error = new Error(`Invalid operation: ${method}`);
      toaster.push(
        <Message showIcon type="error" closable>
          <strong>Error!</strong> {error.message}
        </Message>,
        { placement: 'topEnd', duration: 3000 }
      );
      return Promise.reject(error);
    }

    if (operation.requiresSelection && !selectedItem) {
      const error = new Error(`No ${entity.toLowerCase()} selected`);
      toaster.push(
        <Message showIcon type="warning" closable>
          <strong>Warning!</strong> {error.message}
        </Message>,
        { placement: 'topEnd', duration: 3000 }
      );
      return Promise.reject(error);
    }

    // Set loading state
    dispatch(setLoading(true));

    // Prepare payload
    const payload = method === 'DELETE' 
      ? selectedItem._id 
      : { ...formValue, ...(selectedItem?._id && { id: selectedItem._id }) };

    // Execute operation with promise chain
    return dispatch(operation.action(payload))
      .unwrap()
      .then((result) => {
        // Success handling
        toaster.push(
          <Message showIcon type="success" closable>
            <strong>Success!</strong> {operation.message}
          </Message>,
          { placement: 'topCenter', duration: 3000 }
        );

        // Execute success callback
        if (callbacks.onSuccess) {
          callbacks.onSuccess(result);
        }

        // Refresh data if fetchAll action exists
        if (actions.fetchAll) {
          return dispatch(actions.fetchAll())
            .unwrap()
            .then(() => result)
            .catch((fetchError) => {
              console.warn('Failed to refresh data:', fetchError);
              // Don't fail the whole operation if refresh fails
              return result;
            });
        }

        return result;
      })
      .catch((error) => {
        // Error handling
        const errorMessage = error.message || 
          `Failed to ${method.toLowerCase()} ${entity.toLowerCase()}`;

        toaster.push(
          <Message showIcon type="error" closable>
            <strong>Error!</strong> {errorMessage}
          </Message>,
          { placement: 'topEnd', duration: 5000 }
        );

        // Execute error callback if provided
        if (callbacks.onError) {
          callbacks.onError(error);
        }

        // Re-throw error for upstream handling
        throw error;
      })
      .finally(() => {
        // Always clear loading state
        dispatch(setLoading(false));

        // Execute finally callback if provided
        if (callbacks.onFinally) {
          callbacks.onFinally();
        }
      });
  };
};

export default CrudFactory;