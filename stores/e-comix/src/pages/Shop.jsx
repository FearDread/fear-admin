import React, {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import BannerSub from "../components/Banner/BannerSub"
import DetailedItem from "../components/Product/DetailedItem";
import SuperItem from "../components/Product/SuperItem";
import Loader from "../components/Loader/Loader";
import {
  addRating,
  getAProduct,
  getAllProducts,
} from "../features/products/slice";

const Shop = (props) => {
  const dispatch = useDispatch();
  const [grid, setGrid] = useState(4);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  //filter state
  const [tag, setTag] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setminPrice] = useState(null);
  const [maxPrice, setmaxPrice] = useState(null);
  const [sort, setSort] = useState(null);
  
  //query state
  //const products = useSelector((state) => state?.crud?.product);
  const products = useSelector((state) => state?.product?.product);
  const [searchParams, setSearchParams] = useSearchParams();


  const getProducts = () => {
    let params = {};

    searchParams.forEach((value, prop) => {
      params[prop] = value;
    })

    if (params && params !== undefined) {
      //dispatch(cruds.search( 'product', params ));
    } else {
      //dispatch(cruds.list( 'product' ));
    }
  };

  useEffect(() => {
    //getProducts();
        dispatch(getAllProducts());
    //console.log('products = ', products);
  }, [])

  useEffect(() => {
    let newBrands = [];
    let category = [];
    let newtags = [];

    for (let index = 0; index < products?.result?.length; index++) {
      const item = products?.result[index];

      newBrands.push(item.brand);
      category.push(item.category);
      newtags.push(item.tags);
    }

    setBrands(newBrands);
    setCategories(category);
    setTags(newtags);
  }, [products]);

  return (
    <>
      {(!products) ? (
        <>
          <main className="float-start w-100 total-body home-body mt-0">
            <section className="float-start w-100">
              <Loader />
            </section>
          </main>
        </>
    ) : (
      <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">

        <section className="shop-page float-start w-100">
          <div className="listing-page-div">
            <div className="container">
              <div className="row gx-lg-5">
                <div className="col-lg-3">
                  <div className="accordion mt-4 list-serach-acd" id="accordionPanelsStayOpenExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" >
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                          <span> Categoires </span>
                        </button>
                      </h2>
                      <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                        <div className="accordion-body">
                          <div className="form-check corm-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                              <label className="form-check-label" for="flexCheckDefault">
                                Action & Adventure
                              </label>
                          </div>

                          <div className="form-check corm-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault2" />
                              <label className="form-check-label" for="flexCheckDefault2">
                                Art of Comics
                              </label>
                          </div>

                          <div className="form-check corm-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault3" />
                              <label className="form-check-label" for="flexCheckDefault3">
                                Biographies & History
                              </label>
                          </div>

                          <div className="form-check corm-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault4" />
                              <label className="form-check-label" for="flexCheckDefault4">
                                Fantasy Novels
                              </label>
                          </div>

                          <div className="form-check corm-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault5" />
                              <label className="form-check-label" for="flexCheckDefault5">
                                Science Fiction
                              </label>
                          </div>

                          <div className="form-check corm-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault6" />
                              <label className="form-check-label" for="flexCheckDefault6">
                                Superhero Comics
                              </label>
                          </div>




                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" >
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo">
                          Price
                        </button>
                      </h2>
                      <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show">
                        <div className="accordion-body">
                          <div className="row row-cols-1 row-cols-lg-2">
                            <div className="col">
                              <div className="form-group po">
                                <input type="text" className="form-control" placeholder="Min" />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-group po">
                                <input type="text" className="form-control" placeholder="Max" />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>


                    <div className="accordion-item mt-4">
                      <h2 className="accordion-header">
                        <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapsefour">
                          Customer Ratings
                        </button>
                      </h2>
                      <div id="panelsStayOpen-collapsefour" className="accordion-collapse collapse show">
                        <div className="accordion-body">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault11" />
                              <label className="form-check-label rt-icon" for="flexCheckDefault11">
                                <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                              </label>
                          </div>

                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault12" />
                              <label className="form-check-label rt-icon" for="flexCheckDefault8">
                                <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i> <i className="far fa-star"></i>
                              </label>
                          </div>

                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault13" />
                              <label className="form-check-label rt-icon" for="flexCheckDefault13">
                                <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                <i className="far fa-star"></i> <i className="far fa-star"></i>
                              </label>
                          </div>

                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault14" />
                              <label className="form-check-label rt-icon" for="flexCheckDefault14">
                                <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="far fa-star"></i>
                                <i className="far fa-star"></i> <i className="far fa-star"></i>
                              </label>
                          </div>

                        </div>
                      </div>
                    </div>


                    <div className="accordion-item mt-4">
                      <h2 className="accordion-header">
                        <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapsesix">

                          Popular Tag
                        </button>
                      </h2>
                      <div id="panelsStayOpen-collapsesix" className="accordion-collapse collapse show">
                        <div className="accordion-body">

                          <ul className="d-flex pol-btn align-items-center">
                            <li>
                              <a href="shop.html#" className="btn"> Batman </a>
                              <a href="shop.html#" className="btn"> Binzz </a>
                              <a href="shop.html#" className="btn"> DargonbalZ </a>
                              <a href="shop.html#" className="btn"> Super Mario </a>

                              <a href="shop.html#" className="btn"> Haulk </a>
                            </li>
                          </ul>

                        </div>
                      </div>
                    </div>



                    <input type="submit" className="btn submit-btn" value="Filter" />
                  </div>
                </div>

                <div className="col-lg-9 mt-5 mt-lg-0">
                  <div className="d-flex justify-content-between align-items-center righty">
                    <h6 className="ashow">Showing<b> 1–12 </b>  of <b>41</b>Results </h6>
                    <div className="right-section-btn d-flex align-items-center">



                      <div className="dropdown">
                        <button className="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                          Default sorting
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          <li><a className="dropdown-item" href="shop.html#">popularity</a></li>
                          <li><a className="dropdown-item" href="shop.html#">latest</a></li>
                          <li><a className="dropdown-item" href="shop.html#">low to high</a></li>
                          <li><a className="dropdown-item" href="shop.html#">high to low</a></li>

                        </ul>
                      </div>
                    </div>
                  </div>

                  <div id="products" className="mt-4 righty">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-lg-5">
                      {products && products.slice(0, 9).map((item) => {
                        return (
                          <DetailedItem {...item} />
                        )
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )}
  </>
  )
}

export default Shop;



