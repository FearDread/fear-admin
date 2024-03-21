import React from "react";
import PageHeader from "../_Header/PageHeader";

const Product = () => {


    return (
<>

<div class="wrapper">
    <PageHeader page="product" />
    <div class="section">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-6">
                    <div class="carousel slide">
                        <ol class="mt-5 carousel-indicators">
                            <li class=""></li>
                            <li class="active"></li>
                            <li class=""></li>
                        </ol>
                        <div class="carousel-inner">
                            <div class="justify-content-center carousel-item"><img alt="..." class="d-block" src="index.htmlstatic/media/shirt.cab37b31.png" /></div>
                            <div class="justify-content-center carousel-item active"><img alt="..." class="d-block" src="index.htmlstatic/media/shorts.60ab417c.png" /></div>
                            <div class="justify-content-center carousel-item"><img alt="..." class="d-block" src="index.htmlstatic/media/tshirt.4b010bd4.png" /></div>
                        </div>
                        <a class="carousel-control-prev" data-slide="prev" href="#pablo" role="button">
                            <button type="button" name="button" class="btn-icon btn-round btn btn-warning btn-sm"><i class="tim-icons icon-minimal-left"></i></button>
                        </a>
                        <a class="carousel-control-next" data-slide="next" href="#pablo" role="button">
                            <button type="button" name="button" class="btn-icon btn-round btn btn-warning btn-sm"><i class="tim-icons icon-minimal-right"></i></button>
                        </a>
                    </div>
                </div>
                <div class="mx-auto col-md-12 col-lg-6">
                    <h2 class="title">Givenchy</h2>
                    <div class="stats stats-right">
                        <div class="stars text-warning">
                            <i class="fas fa-star"></i><i class="fas fa-star ml-1"></i><i class="fas fa-star ml-1"></i><i class="fas fa-star ml-1"></i><i class="far fa-star ml-1"></i>
                            <p class="d-inline ml-1">(76 customer reviews)</p>
                        </div>
                    </div>
                    <br />
                    <h2 class="main-price">$3,390</h2>
                    <h5 class="category">Description</h5>
                    <p class="description">
                        Eres' daring 'Grigri Fortune' swimsuit has the fit and coverage of a bikini in a one-piece silhouette. This fuchsia style is crafted from the label's sculpting peau douce fabric and has flattering cutouts through
                        the torso and back. Wear yours with mirrored sunglasses on vacation.
                    </p>
                    <br />
                    <div class="pick-size row">
                        <div class="col-md-4 col-lg-4">
                            <label>Quantity</label>
                            <div class="input-group">
                                <div class="input-group-btn">
                                    <button type="button" class="btn-round btn-simple btn btn-warning"><i class="tim-icons icon-simple-delete"></i></button>
                                </div>
                                <input id="myNumber" type="text" class="input-number form-control" value="2" />
                                <div class="input-group-btn">
                                    <button type="button" class="btn-round btn-simple btn btn-warning"><i class="tim-icons icon-simple-add"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4">
                            <label>Select color</label>
                            <div class="react-select react-select-warning css-2b097c-container">
                                <div class="react-select__control css-yk16xz-control">
                                    <div class="react-select__value-container css-1hwfws3">
                                        <div class="react-select__placeholder css-1wa3eu0-placeholder">Select...</div>
                                        <div class="css-1g6gooi">
                                            <div class="react-select__input" style="display: inline-block;">
                                                <input
                                                    autocapitalize="none"
                                                    autocomplete="off"
                                                    autocorrect="off"
                                                    id="react-select-2-input"
                                                    spellcheck="false"
                                                    tabindex="0"
                                                    type="text"
                                                    aria-autocomplete="list"
                                                    value=""
                                                    style="box-sizing: content-box; width: 19px; background: 0px center; border: 0px; font-size: inherit; opacity: 1; outline: 0px; padding: 0px; color: inherit;"
                                                />
                                                <div
                                                    style="
                                                        position: absolute;
                                                        top: 0px;
                                                        left: 0px;
                                                        visibility: hidden;
                                                        height: 0px;
                                                        overflow: scroll;
                                                        white-space: pre;
                                                        font-size: 14px;
                                                        font-family: poppins, sans-serif;
                                                        font-weight: 400;
                                                        font-style: normal;
                                                        letter-spacing: normal;
                                                        text-transform: none;
                                                    "
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="react-select__indicators css-1wy0on6">
                                        <span class="react-select__indicator-separator css-1okebmr-indicatorSeparator"></span>
                                        <div aria-hidden="true" class="react-select__indicator react-select__dropdown-indicator css-tlfecz-indicatorContainer">
                                            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-19bqh2r">
                                                <path
                                                    d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4">
                            <label>Select size</label>
                            <div class="react-select react-select-warning css-2b097c-container">
                                <div class="react-select__control css-yk16xz-control">
                                    <div class="react-select__value-container css-1hwfws3">
                                        <div class="react-select__placeholder css-1wa3eu0-placeholder">Select...</div>
                                        <div class="css-1g6gooi">
                                            <div class="react-select__input" style="display: inline-block;">
                                                <input
                                                    autocapitalize="none"
                                                    autocomplete="off"
                                                    autocorrect="off"
                                                    id="react-select-3-input"
                                                    spellcheck="false"
                                                    tabindex="0"
                                                    type="text"
                                                    aria-autocomplete="list"
                                                    value=""
                                                    style="box-sizing: content-box; width: 19px; background: 0px center; border: 0px; font-size: inherit; opacity: 1; outline: 0px; padding: 0px; color: inherit;"
                                                />
                                                <div
                                                    style="
                                                        position: absolute;
                                                        top: 0px;
                                                        left: 0px;
                                                        visibility: hidden;
                                                        height: 0px;
                                                        overflow: scroll;
                                                        white-space: pre;
                                                        font-size: 14px;
                                                        font-family: poppins, sans-serif;
                                                        font-weight: 400;
                                                        font-style: normal;
                                                        letter-spacing: normal;
                                                        text-transform: none;
                                                    "
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="react-select__indicators css-1wy0on6">
                                        <span class="react-select__indicator-separator css-1okebmr-indicatorSeparator"></span>
                                        <div aria-hidden="true" class="react-select__indicator react-select__dropdown-indicator css-tlfecz-indicatorContainer">
                                            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-19bqh2r">
                                                <path
                                                    d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div class="justify-content-start row">
                        <button class="ml-3 btn btn-warning">Add to Cart &nbsp;<i class="tim-icons icon-cart"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="testimonials-1 section-image">
            <div class="container">
                <div class="row">
                    <div class="ml-auto mr-auto text-center col-md-6">
                        <h2 class="title">Not convinced yet?</h2>
                        <h4 class="description">You need more information? Check what other persons are saying about our product. They are very happy with their purchase.</h4>
                    </div>
                </div>
                <div class="mt-5 row">
                    <div class="col-md-4">
                        <div class="card-testimonial card">
                            <div class="card-avatar">
                                <a href="#pablo"><img alt="..." class="img img-raised" src="index.htmlstatic/media/michael.660d3e04.jpg" /></a>
                            </div>
                            <div class="card-body"><p class="card-description">The networking at Web Summit is like no other European tech conference.</p></div>
                            <div class="icon icon-primary"><i class="fa fa-quote-right"></i></div>
                            <div class="card-footer">
                                <h4 class="card-title">Michael Elijah</h4>
                                <p class="category">@michaelelijah</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-testimonial card">
                            <div class="card-avatar">
                                <a href="#pablo"><img alt="..." class="img img-raised" src="index.htmlstatic/media/olivia.2dcd9e1f.jpg" /></a>
                            </div>
                            <div class="card-body"><p class="card-description">The connections you make at Web Summit are unparalleled, we met users all over the world.</p></div>
                            <div class="icon icon-primary"><i class="fa fa-quote-right"></i></div>
                            <div class="card-footer">
                                <h4 class="card-title">Olivia Harper</h4>
                                <p class="category">@oliviaharper</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-testimonial card">
                            <div class="card-avatar">
                                <a href="#pablo"><img alt="..." class="img img-raised" src="index.htmlstatic/media/james.2cc29671.jpg" /></a>
                            </div>
                            <div class="card-body"><p class="card-description">Web Summit will increase your appetite, your inspiration, and your network.</p></div>
                            <div class="icon icon-primary"><i class="fa fa-quote-right"></i></div>
                            <div class="card-footer">
                                <h4 class="card-title">James Logan</h4>
                                <p class="category">@jameslogan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="section related-products">
        <div class="container">
            <div class="col-md-8"><h2 class="title">You may also like</h2></div>
            <div class="row">
                <div class="col-md-6 col-lg-3">
                    <div class="card-product card">
                        <div class="card-image">
                            <a href="#pablo"><img alt="..." class="img rounded" src="index.htmlstatic/media/bag.f2e19ce2.png" /></a>
                        </div>
                        <div class="card-body">
                            <h6 class="category text-warning">Trending</h6>
                            <h4 class="card-title"><a href="#pablo" class="text-white card-link">Dolce &amp; Gabbana</a></h4>
                            <div class="card-description">Dolce &amp; Gabbana's 'Greta' tote has been crafted in Italy from hard-wearing red textured-leather.</div>
                            <div class="card-footer">
                                <div class="price-container"><span class="price">€1,459</span></div>
                                <button id="tooltip320714545" class="btn-simple btn-icon btn-round pull-right btn btn-warning"><i class="tim-icons icon-heart-2"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card-product card">
                        <div class="card-image">
                            <a href="#pablo"><img alt="..." class="img rounded" src="index.htmlstatic/media/tshirt.4b010bd4.png" /></a>
                        </div>
                        <div class="card-body">
                            <h6 class="category text-warning">Popular</h6>
                            <h4 class="card-title"><a href="#pablo" class="text-white card-link">Balmain</a></h4>
                            <div class="card-description">Balmain's mid-rise skinny jeans are cut with stretch to ensure they retain their second-skin fit but move comfortably.</div>
                            <div class="card-footer">
                                <div class="price-container"><span class="price">€459</span></div>
                                <button id="tooltip449471879" class="btn-simple btn-icon btn-round pull-right btn btn-warning"><i class="tim-icons icon-heart-2"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card-product card">
                        <div class="card-image">
                            <a href="#pablo"><img alt="..." class="img rounded" src="index.htmlstatic/media/shirt.cab37b31.png" /></a>
                        </div>
                        <div class="card-body">
                            <h6 class="category text-warning">Popular</h6>
                            <h4 class="card-title"><a href="#pablo" class="text-white card-link">Balenciaga</a></h4>
                            <div class="card-description">Balenciaga's black textured-leather wallet is finished with the label's iconic 'Giant' studs. This is where you can...</div>
                            <div class="card-footer">
                                <div class="price-container"><span class="price">€559</span></div>
                                <button id="tooltip300524105" class="btn-simple btn-icon btn-round pull-right btn btn-warning"><i class="tim-icons icon-heart-2"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card-product card">
                        <div class="card-image">
                            <a href="#pablo"><img alt="..." class="img rounded" src="index.htmlstatic/media/jeans.bc94d7e2.png" /></a>
                        </div>
                        <div class="card-body">
                            <h6 class="category text-warning">Trending</h6>
                            <h4 class="card-title"><a href="#pablo" class="text-white card-link">Dolce &amp; Gabbana</a></h4>
                            <div class="card-description">Dolce &amp; Gabbana's 'Greta' tote has been crafted in Italy from hard-wearing red textured-leather.</div>
                            <div class="card-footer">
                                <div class="price-container"><span class="price">€ 1,359</span></div>
                                <button id="tooltip755498009" class="btn-simple btn-icon btn-round pull-right btn btn-warning"><i class="tim-icons icon-heart-2"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    </div>
    </>
    )
}

export default Product;




