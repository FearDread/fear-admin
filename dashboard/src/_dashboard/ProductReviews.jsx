import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import {
  getAllreviews,
  clearErrors,
  deleteProductReview,
} from "_actions/productAction";


import {
  Avatar,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "reactstrap"
import { DELETE_REVIEW_RESET } from "_constants/productsConstatns";


function ProductReviews() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);
  const { error, reviews, loading } = useSelector(
    (state) => state.getAllReview
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteReview
  );

  const [productId, setProductId] = useState("");

  // togle handler =>
  const toggleHandler = () => {
    console.log("toggle");
    setToggle(!toggle);
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllreviews(productId)); // when in input box string lenght goes ===24 then automatically search occures
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      history.push("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, alert, deleteError, isDeleted, productId, history]);

  // to close the sidebar when the screen size is greater than 1000px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggle]);

  // delet review from given prodcuts reviews =>
  const deleteReviewHandler = (reviewId) => {
 
    dispatch(deleteProductReview(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllreviews(productId)); // get this product reviews
  };
  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 230,
      flex: 0.5,
      headerClassName: "column-header",
    },
    {
      field: "user",
      headerName: "User",
      flex: 0.8,
      magin: "0 auto",
      headerClassName: "column-header hide-on-mobile",
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 0.8,
    },
    {
      field: "recommend",
      headerName: "Recommend",
      minWidth: 100,
      flex: 1,
      headerClassName: "column-header hide-on-mobile",
      cellClassName: (params) => {
        return params.getValue(params.id, "recommend") === true
          ? "greenColor"
          : "redColor"; // if rating of review greater then class green else red
      },
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 200,
      flex: 0.5,
      headerClassName: "column-header hide-on-mobile",
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor"; // if rating of review greater then class green else red
      },
    },

    {
      field: "actions",
      flex: 1,
      headerName: "Actions",
      minWidth: 230,
      headerClassName: "column-header1",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <div 
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon className="iconbtn" style={{ marginLeft: "1rem" }} />
            </div>
          </>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        user: item.name,
        comment: item.comment,
        rating: item.ratings,
        recommend: item.recommend ? "Yes" : "No",
      });
    });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="All Reviews" />

          <div className={classes.updateUser1}>
            <div
              className={
                !toggle ? `${classes.firstBox_01}` : `${classes.toggleBox_01}`
              }
            >
              <Sidebar />
            </div>

            <div className={classes.secondBox_01}>
              <div className={classes.navBar_01}>
                <Navbar toggleHandler={toggleHandler} />
              </div>
              <div className={classes.formSection}>
                <form
                  className={`${classes.form}`}
                  onSubmit={productReviewsSubmitHandler}
                >
                  <Avatar className={classes.avatar}>
                    <StarRateIcon />
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h1"
                    className={classes.heading}
                  >
                    All Reviews
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    className={`${classes.nameInput} ${classes.textField}`}
                    label="Product Id"
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Star
                            style={{
                              fontSize: 20,
                              color: "#414141",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    id="createProductBtn"
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.loginButton}
                    disabled={
                      loading ? true : false || productId === "" ? true : false
                    }
                  >
                    Search
                  </Button>
                </form>

                {reviews && reviews.length > 0 ? (
                  <div className="productListContainer">
                    <h4 id="productListHeading">ALL PRODUCTS</h4>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      autoHeight
                      disableSelectionOnClick
                      className="productListTable"
                    />
                  </div>
                ) : (
                  <h1 className={classes.heading_02}>No Reviews Found</h1>
                )}
              </div>
              ;
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductReviews;
