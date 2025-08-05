
//Add new Review
export const newReview = (reviewData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_REVIEW_REQUEST });
  
      const config = { headers: { "Content-Type": "application/json" } };
  
      const { data } = await axios.put("/review/new", reviewData, config);
      console.log("review data =", reviewData);
      dispatch({ type: NEW_REVIEW_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({ type: NEW_REVIEW_FAIL, payload: error.message });
    }
  };
  
 // get all review of product admin ==>
 export const getAllreviews  = (productId) => async (dispatch) =>{

    try {
       dispatch({type : ALL_REVIEW_REQUEST})

       const { data } = await axios.get(API_BASE_URL + `/product/reviews?id=${productId}`);
       console.log('review data = ', data);
       dispatch({type : ALL_REVIEW_SUCCESS , payload : data.reviews})
    } catch (error) {
       dispatch({type : ALL_REVIEW_FAIL , payload : error.message})
    }
}

// delete product review
export const deleteProductReview = (reviewId , productId) => async (dispatch) =>{
  try {
 dispatch({type : DELETE_REVIEW_REQUEST})

   const { data } = await axios.delete(
     `/api/v1/product/reviews/delete?id=${reviewId}&productId=${productId}`
   );

    dispatch({ type: DELETE_REVIEW_SUCCESS, payload: data.success });
  } catch (error) {
     dispatch({type : DELETE_REVIEW_FAIL , payload : error.message})
  }

}