// admin BRAND request :
export const getBrands = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_BRAND_REQUEST });
  
      const response = await axios.get(API_BASE_URL + "/brand/all");
  
      dispatch({ type: ADMIN_BRAND_SUCCESS, payload: response.data.result });
    } catch (error) {
      dispatch({ type: ADMIN_BRAND_FAIL, payload: error });
    }
  };