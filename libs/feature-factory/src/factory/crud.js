import { Message } from "rsuite";

/**
 * CrudFactory - Generic CRUD Handler using Promise then/catch pattern
 *
 * A reusable factory for creating CRUD handlers across different entities.
 * Designed to work with FeatureFactory slices (index.js) and the API layer (api.js).
 * Uses promise chaining instead of async/await for better error propagation control.
 *
 * @param {string}   entity        - Display name of the entity (e.g. "User", "Product")
 * @param {Object}   actions       - Async thunk actions from FeatureFactory (create, update, delete, fetchAll)
 *                                   Optionally includes a `setLoading` synchronous slice action
 * @param {Object}   selectors     - Redux selectors for the entity slice (reserved for future use)
 * @param {Object}   toaster       - RSuite toaster instance for push notifications
 * @param {Function} dispatch      - Redux dispatch function
 * @returns {Function}             - CRUD handler: (method, { formValue, selectedItem, callbacks }) => Promise
 */
export const CrudFactory = ({
  entity,
  actions,
  selectors,
  toaster,
  dispatch,
}) => {
  // Validation — fail fast if required dependencies are missing
  if (!entity || typeof entity !== "string") {
    throw new Error("CrudFactory: `entity` must be a non-empty string");
  }
  if (!actions || typeof actions !== "object") {
    throw new Error("CrudFactory: `actions` must be an object of thunk action creators");
  }
  if (typeof dispatch !== "function") {
    throw new Error("CrudFactory: `dispatch` must be a Redux dispatch function");
  }
  if (!toaster || typeof toaster.push !== "function") {
    throw new Error("CrudFactory: `toaster` must be a valid RSuite toaster instance");
  }

  /**
   * Internal helper — dispatches setLoading if the slice exposes it.
   * Falls back silently when the slice manages loading via extraReducers only.
   */
  const setLoading = (isLoading) => {
    if (typeof actions.setLoading === "function") {
      dispatch(actions.setLoading(isLoading));
    }
  };

  /**
   * Internal helper — pushes a standardised RSuite toast message.
   */
  const pushToast = (type, message) => {
    toaster.push(
      `<Message showIcon type={type} closable>
        <strong>${type === "success" ? "Success!" : type === "warning" ? "Warning!" : "Error!"}</strong>${" "}
        ${message}
      </Message>`,
      {
        placement: type === "success" ? "topCenter" : "topEnd",
        duration: 3000,
      }
    );
  };

  /**
   * Returned CRUD handler
   *
   * @param {"CREATE"|"UPDATE"|"DELETE"} method
   * @param {Object}   options
   * @param {Object}   options.formValue      - Form data for CREATE / UPDATE
   * @param {Object}   options.selectedItem   - Currently selected entity (requires ._id)
   * @param {Object}   [options.callbacks]    - Optional lifecycle hooks: onSuccess, onError, onFinally
   * @returns {Promise}
   */
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

    // Guard — unknown method
    if (!operation) {
      const error = new Error(`CrudFactory: Invalid operation "${method}". Expected CREATE, UPDATE, or DELETE.`);
      return Promise.reject(error);
    }

    // Guard — action creator missing from the slice
    if (typeof operation.action !== "function") {
      const error = new Error(
        `CrudFactory: No action creator found for "${method}" on entity "${entity}". ` +
        `Ensure FeatureFactory was initialised with the corresponding operation enabled.`
      );
      return Promise.reject(error);
    }

    // Guard — selection required but absent
    if (operation.requiresSelection && !selectedItem?._id) {
      const error = new Error(`No ${entity.toLowerCase()} selected`);
      pushToast("warning", error.message);
      return Promise.reject(error);
    }

    // Signal loading start (slice may also handle this via extraReducers pending)
    setLoading(true);

    // Build payload:
    //   DELETE  → bare _id string
    //   CREATE  → formValue only
    //   UPDATE  → formValue merged with the existing _id
    const payload =
      method === "DELETE"
        ? selectedItem._id
        : { ...formValue, ...(selectedItem?._id && { id: selectedItem._id }) };

    // Execute operation with promise chain
    return dispatch(operation.action(payload))
      .unwrap()
      .then((result) => {
        pushToast("success", operation.message);

        if (typeof callbacks.onSuccess === "function") {
          callbacks.onSuccess(result);
        }

        // Refresh list after mutation — swallows refresh failures to keep UX stable
        if (typeof actions.fetchAll === "function") {
          return dispatch(actions.fetchAll())
            .unwrap()
            .then(() => result)
            .catch((fetchError) => {
              console.warn(`CrudFactory: Failed to refresh ${entity} list after ${method}:`, fetchError);
              return result;
            });
        }

        return result;
      })
      .catch((error) => {
        const errorMessage =
          error.message || `Failed to ${method.toLowerCase()} ${entity.toLowerCase()}`;

        pushToast("error", errorMessage);

        if (typeof callbacks.onError === "function") {
          callbacks.onError(error);
        }

        // Re-throw so callers can chain their own .catch()
        throw error;
      })
      .finally(() => {
        // Signal loading end regardless of outcome
        setLoading(false);

        if (typeof callbacks.onFinally === "function") {
          callbacks.onFinally();
        }
      });
  };
};

export default CrudFactory;