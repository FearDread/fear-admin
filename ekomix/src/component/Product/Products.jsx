import React, { useEffect } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { useRouteMatch } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { clearErrors, getProduct, getAdminProducts } from "../../_store/actions/productAction";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InventoryIcon from "@mui/icons-material/Inventory";

import ProductCard from "../_Product/Card";
import { 
  Container,
  Col,
  Row
 } from "reactstrap";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";

const categories = [
  "Cricket Kits",
  "Batting Gloves",
  "Batting Pads",
  "Bats",
  "Bags",
  "Helmets",
  "Balls",
  "Stumps",
  "Shoes",
  "Clothing",
  "Accessories",
];

import { CRUD_API } from "@feardread/crud-service";

function Products() {
  const match = useRouteMatch();
  let keyword = match.params.keyword;
  const dispatch = useDispatch();
  /*
  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
    // filterdProductCount,
  } = useSelector((state) => state.products);
   */
  const { loading, result, pagination } = useSelector((state) => state.crud.list);
  const alert = useAlert();

  const [currentPage, setCurrentPage] = React.useState();
  const [price, setPrice] = React.useState([0, 100000]); // initial limit from min=0 to max=100000
  const [category, setCategory] = React.useState("");
  const [ratings, setRatings] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  useEffect(() => {


      dispatch(clearErrors());


   // dispatch(getAdminProducts());
    dispatch(CRUD_API.all('product'));
    //dispatch(getProduct(keyword, currentPage, price, category, ratings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, keyword, currentPage, price, ratings, category]);

  const setCurrentPageNoHandler = (e) => {
    setCurrentPage(e); // e is the clicked page value
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  const handleCategoryChange = (category) => {
    setCategory(category);
    setSelectedCategory(category);
    // Perform any additional actions or filtering based on the selected category
  };



  const [selectedRating, setSelectedRating] = React.useState("all");

  const handleRatingChange = (event) => {
    setRatings(event.target.value);
    setSelectedRating(event.target.value);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="PRODUCTS --Ecart" />
          {result === undefined || result.length === 0 ? (
            <>
              <div
                className="emptyCartContainer "
                style={{ marginTop: "5rem", background: "white" }}
              >
                <InventoryIcon className="cartIcon" />

                <Typography variant="h5" component="h1" className="cartHeading">
                  Product Not Found
                </Typography>
                <Typography variant="body" className="cartText">
                  Nothin' to see here.
                </Typography>
                <Typography variant="body" className="cartText">
                  There is no product with this name
                </Typography>

                <Button
                  className="shopNowButton"
                  onClick={() => window.location.reload()}
                  style={{ width: "7rem" }}
                >
                  Refresh
                </Button>
              </div>
            </>
          ) : (
            <div className="productPage">
              <div className="prodcutPageTop">
                <div className="filterBox">
                  <div className="priceFilter">
                    <Typography
                      style={{
                        fontSize: "18px",
                        padding: "5px",
                        fontWeight: 700,
                        color: "#414141",
                      }}
                    >
                      Price
                    </Typography>
                    <div className="priceSlider">
                      <Slider
                        value={price}
                        onChange={priceHandler}
                        min={0}
                        max={100000}
                        step={100}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                      />
                    </div>
                    <div className="priceSelectors">
                      <div className="priceSelector">
                        <Select
                          value={price[0]}
                          onChange={(e) =>
                            setPrice([+e.target.value, price[1]])
                          }
                          className="priceOption"
                          IconComponent={ArrowDropDownIcon}
                          renderValue={(selected) =>
                            selected !== "" ? selected : "min"
                          }
                        >
                          <MenuItem value={5000} className="menu_item">
                            5000
                          </MenuItem>
                          <MenuItem value={10000} className="menu_item">
                            10000
                          </MenuItem>
                        </Select>
                        <span className="toText">to</span>
                        <Select
                          value={price[1]}
                          onChange={(e) =>
                            setPrice([price[0], +e.target.value])
                          }
                          className="priceOption"
                          IconComponent={ArrowDropDownIcon}
                          renderValue={(selected) =>
                            selected !== "" ? selected : "max"
                          }
                        >
                          <MenuItem value={50000} className="menu_item">
                            50000
                          </MenuItem>
                          <MenuItem value={20000} className="menu_item">
                            20000
                          </MenuItem>
                          {/* Add more options as per your requirement */}
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="filter_divider"></div>
                  <div className="categoriesFilter">
                    <Typography
                      style={{
                        fontSize: "18px",
                        padding: "10px",
                        fontWeight: 700,
                        color: "#414141",
                      }}
                    >
                      Categories
                    </Typography>
                    <ul className="categoryBox">
                      {categories.map((category, index) => (
                        <li className="category-link" key={index}>
                          <label
                            htmlFor={`category-${index}`}
                            className="category-label"
                          >
                            <input
                              type="checkbox"
                              id={`category-${index}`}
                              className="category-checkbox"
                              value={category}
                              checked={category === selectedCategory}
                              onChange={() => handleCategoryChange(category)}
                            />
                            {category}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="filter_divider"></div>
                  {/* Ratings */}
                  <div className="ratingsFilter">
                    <Typography
                      style={{
                        fontSize: "18px",
                        padding: "10px",
                        fontWeight: 700,
                        color: "#414141",
                      }}
                    >
                      Ratings Above
                    </Typography>
                    <RadioGroup
                      value={selectedRating}
                      onChange={handleRatingChange}
                      row
                      className="ratingsBox"
                    >
                      <FormControlLabel
                        value="4"
                        control={<Radio />}
                        label="4★ & above"
                      />
                      <FormControlLabel
                        value="3"
                        control={<Radio />}
                        label="3★ & above"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="2★ & above"
                      />
                    </RadioGroup>
                  </div>
                  <div className="filter_divider"></div>
                </div>
              <Container>
                <Row className="product-container">
                  {result && result.map((product) => (
                      <Col md="4">
                      <ProductCard key={product._id} product={product} />
                      </Col>
                    ))}
                </Row>
                </Container>
              </div>
                <div className="paginationBox">
                  <Pagination
                    activePage={1}
                    itemsCountPerPage={10}
                    totalItemsCount={result.length}
                    onChange={setCurrentPageNoHandler}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                  />
                </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Products;
