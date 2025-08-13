

export const Banner = () => {

    return (
        <>
                <section className="banner-two">
            <div className="banner-two__shape-left d-none d-lg-block wow bounceInLeft" data-wow-duration="1s"
                data-wow-delay=".5s">
                <img src="assets/images/shape/vape1.png" alt="shape">
            </div>
            <div className="banner-two__shape-right d-none d-lg-block wow bounceInRight" data-wow-duration="1s"
                data-wow-delay=".1s">
                <img className="sway_Y__animation " src="assets/images/shape/vape2.png" alt="shape">
            </div>
            <div className="swiper banner-two__slider">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <div className="slide-bg" data-background="assets/images/banner/banner-two-image1.jpg"></div>
                        <div className="container">
                            <div className="banner-two__content">
                                <h4 data-animation="fadeInUp" data-delay="1s"><img src="assets/images/icon/fire.svg"
                                        alt="icon"> GET <span className="primary-color">25% OFF</span> NOW</h4>
                                <h1 data-animation="fadeInUp" data-delay="1.3s">Find everything <br>
                                    for <span className="primary-color">vaping</span></h1>
                                <p className="mt-40" data-animation="fadeInUp" data-delay="1.5s">Sell globally in minutes
                                    with localized currencies languages, and <br> experie in
                                    every
                                    market. only a variety of vaping
                                    products</p>
                                <div className="banner-two__info mt-30" data-animation="fadeInUp" data-delay="1.7s">
                                    <span className="mb-10">Starting Price</span>
                                    <h3>$99.00</h3>
                                </div>
                                <div className="btn-wrp mt-65">
                                    <a href="shop.html" className="btn-one" data-animation="fadeInUp"
                                        data-delay="1.8s"><span>Shop
                                            Now</span></a>
                                    <a className="btn-one-light ml-20" href="shop-single.html" data-animation="fadeInUp"
                                        data-delay="1.9s"><span>View Details</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="slide-bg" data-background="assets/images/banner/banner-two-image2.jpg"></div>
                        <div className="container">
                            <div className="banner-two__content">
                                <h4 data-animation="fadeInUp" data-delay="1s"><img src="assets/images/icon/fire.svg"
                                        alt="icon"> GET <span className="primary-color">25% OFF</span> NOW</h4>
                                <h1 data-animation="fadeInUp" data-delay="1.3s">Find everything <br>
                                    for <span className="primary-color">vaping</span></h1>
                                <p className="mt-40" data-animation="fadeInUp" data-delay="1.5s">Sell globally in minutes
                                    with localized currencies languages, and <br> experie in
                                    every
                                    market. only a variety of vaping
                                    products</p>
                                <div className="banner-two__info mt-30" data-animation="fadeInUp" data-delay="1.7s">
                                    <span className="mb-10">Starting Price</span>
                                    <h3>$99.00</h3>
                                </div>
                                <div className="btn-wrp mt-65">
                                    <a href="shop.html" className="btn-one" data-animation="fadeInUp"
                                        data-delay="1.8s"><span>Shop
                                            Now</span></a>
                                    <a className="btn-one-light ml-20" href="shop-single.html" data-animation="fadeInUp"
                                        data-delay="1.9s"><span>View
                                            Details</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="slide-bg" data-background="assets/images/banner/banner-two-image3.jpg"></div>
                        <div className="container">
                            <div className="banner-two__content">
                                <h4 data-animation="fadeInUp" data-delay="1s"><img src="assets/images/icon/fire.svg"
                                        alt="icon"> GET <span className="primary-color">25% OFF</span> NOW</h4>
                                <h1 data-animation="fadeInUp" data-delay="1.3s">Find everything <br>
                                    for <span className="primary-color">vaping</span></h1>
                                <p className="mt-40" data-animation="fadeInUp" data-delay="1.5s">Sell globally in minutes
                                    with localized currencies languages, and <br> experie in
                                    every
                                    market. only a variety of vaping
                                    products</p>
                                <div className="banner-two__info mt-30" data-animation="fadeInUp" data-delay="1.7s">
                                    <span className="mb-10">Starting Price</span>
                                    <h3>$99.00</h3>
                                </div>
                                <div className="btn-wrp mt-65">
                                    <a href="shop.html" className="btn-one" data-animation="fadeInUp"
                                        data-delay="1.8s"><span>Shop
                                            Now</span></a>
                                    <a className="btn-one-light ml-20" href="shop-single.html" data-animation="fadeInUp"
                                        data-delay="1.9s"><span>View
                                            Details</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner-two__arry-btn">
                <button className="arry-prev mb-15 banner-two__arry-prev"><i className="fa-light fa-chevron-left"></i></button>
                <button className="arry-next active banner-two__arry-next"><i
                        className="fa-light fa-chevron-right"></i></button>
            </div>
        </section>
        
        </>
    )
}