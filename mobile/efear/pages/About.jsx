import React from 'react';
import { Link } from 'react-router-dom';
import PopularBrands from "../components/common/PopularBrands";
import aboutImg from "../assets/images/about/01.png";
export const About = () => {
    return (
        <>
            <section className="py-3 border-bottom d-none d-md-flex">
                <div className="container">
                    <div className="page-breadcrumb d-flex align-items-center">
                        <h3 className="breadcrumb-title pe-3">About Us</h3>
                        <div className="ms-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="javascript:;">
                                            <i className="bx bx-home-alt"></i> Home
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">About Us</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-0 py-lg-4">
                <div className="container">
                    <h3>Our Story</h3>
                    <div className="card card-body bg-dark-2">
                    <h4>Welcome to the Void (With Better Graphics)</h4>
                    <p> We started this business because someone once told us "following your dreams doesn't pay the bills." Well, joke's on them—we're still broke, but now we get to read comics while doing it.
                        Our Origin Story (Tragically Less Interesting Than Batman's)</p>
                    <p>
                        Founded in a dimly lit basement that may or may not have violated several building codes, our shop emerged from a simple question: "What if we could lose money doing something we actually enjoy?" Turns out, we could. We really, really could.
                        After years of hoarding graphic novels and e-books like a literary dragon with questionable taste, we realized our collection had become large enough to either start a business or seek professional help. We chose the path with fewer feelings.
                    </p>
                    <h4>What We Do</h4>
                    <p>We sell comic books and e-books. Revolutionary, we know. Someone should write a comic about it. (Please don't.)
                        Our carefully curated selection ranges from mainstream superhero fare to independent titles so obscure that even their creators have forgotten about them. We've got everything from capes and tights to existential dread in panel form—because sometimes you want to escape reality, and sometimes you want reality to punch you in the face with better artwork.
                        Our Promise</p>

                    <p>
                        Fast shipping: Your comics will arrive before the heat death of the universe (probably)
                        Quality products: No coffee stains. Those are our copies.
                        Customer service: We'll respond to your emails faster than DC responds to fan criticism
                        Honest recommendations: If a book is terrible, we'll tell you. Then sell it to you anyway because capitalism.</p>

                    <h3>Why Choose Us?</h3>
                    <p>
                        Listen, you're already here reading this. The hard part is over. At this point, you're pot-committed. Plus, we need to make rent, and our landlord has made it very clear that "exposure" is not legal tender.
                        Our Team
                        We're a small operation, which is a fancy way of saying we can't afford to hire anyone else. But what we lack in manpower, we make up for in caffeine addiction and the sinking feeling that we should have gotten real jobs.
                        Contact Us
                        Have questions? Concerns? Existential crises you'd like to share? We're here for approximately 60% of those things.

                        Disclaimer: No comic book characters were harmed in the making of this website. Our dignity, however, didn't make it.
                    </p>
                </div>
                </div>
            </section>



            <section className="py-4">
                <div className="container">
                    <h4>What makes us different</h4>
                    <hr />
                    <div className="row row-cols-1 row-cols-lg-3">
                        <div className="col d-flex">
                            <div className="card rounded-0 shadow-none w-100">
                                <div className="card-body">
                                    <img src="assets/images/icons/delivery.png" width="60" alt="" />
                                    <h5 className="my-3">FREE SHIPPING</h5>
                                    <p className="mb-0">We'll bring it to your door for free. Because if we charged you shipping, you'd probably just steal it from a neighbor's porch anyway.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col d-flex">
                            <div className="card rounded-0 shadow-none w-100">
                                <div className="card-body">
                                    <img src="assets/images/icons/money-bag.png" width="60" alt="" />
                                    <h5 className="my-3">100% MONEY BACK GUARANTEE</h5>
                                    <p className="mb-0">Regret your life choices? Us too. Send it back within 30 days, no judgment. We've seen worse decisions, trust us.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col d-flex">
                            <div className="card rounded-0 shadow-none w-100">
                                <div className="card-body">
                                    <img src="assets/images/icons/support.png" width="60" alt="" />
                                    <h5 className="my-3">ONLINE SUPPORT 24/7</h5>
                                    <p className="mb-0">Can't sleep at 3 AM? Neither can our support team—misery loves company. We're here to answer your questions or just listen to you complain about life.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-0 py-lg-4 bg-dark-2">
                <div className="container">
                    <h2 className="text-center page-haeding"> Here's What we Offer </h2>
                    <div className="row align-items-center mt-5 mt-lg-0">
                        <div className="col-lg-3">
                            <div className="comon-shape">
                                <h5 className="text-center"> Competitive Pricing </h5>
                            </div>

                            <div className="comon-shape">
                                <h5 className="text-center"> High Value Collections </h5>
                            </div>

                        </div>
                        <div className="col-lg-6">
                            <figure className="text-center">
                                <img alt="about" className='about-img-center' src={aboutImg} />
                            </figure>
                        </div>
                        <div className="col-lg-3">
                            <div className="comon-shape">
                                <h5 className="text-center"> All Comics come with board and sleve! </h5>
                            </div>

                            <div className="comon-shape">
                                <h5 className="text-center"> Mint ( NM ) Quality! </h5>
                            </div>

                        </div>
                    </div>

                    <Link to="/shop" className="btn btn-light btn-ecom mx-auto mt-5 d-table">  <span> <i className="far fa-gem"></i> Shop NOW! </span> </Link>
                </div>

            </section>
            <PopularBrands />
        </>
    );
}

export default About;