import axios from "axios";
import BASE_API_URL from "../../variables/"



// Create Product
export const createBrand = (data) => async (dispatch) => {
    dispatch({type: types.NEW_BRAND_REQUEST});
    await axios.post(API_BASE_URL + `/product/new`, productData,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        console.log("Product response :: ", response);
        dispatch({ type: NEW_PRODUCT_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: NEW_PRODUCT_FAIL, payload: error.message });
    });
  }