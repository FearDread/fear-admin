import React, { useState } from "react";

export const Blog = () => {

    return (
        <>
            <section className="py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-9">
                            <div className="blog-right-sidebar p-3">
                                <div className="card">
                                    <img src="assets/images/posts/01.png" className="card-img-top" alt="" />
                                    <div className="card-body">
                                        <div className="list-inline">	<a href="javascript:;" className="list-inline-item"><i className='bx bx-user me-1'></i>By Admin</a>
                                            <a href="javascript:;" className="list-inline-item"><i className='bx bx-comment-detail me-1'></i>16 Comments</a>
                                            <a href="javascript:;" className="list-inline-item"><i className='bx bx-calendar me-1'></i>November 5, 2021</a>
                                        </div>
                                        <h4 className="mt-4">Post Title Here</h4>
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>	<a href="single.html" className="btn btn-light btn-ecomm">Read More <i className='bx bx-chevrons-right' ></i></a>
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="assets/images/posts/02.png" className="card-img-top" alt="" />
                                    <div className="card-body">
                                        <div className="list-inline">	<a href="javascript:;" className="list-inline-item"><i className='bx bx-user me-1'></i>By Admin</a>
                                            <a href="javascript:;" className="list-inline-item"><i className='bx bx-comment-detail me-1'></i>16 Comments</a>
                                            <a href="javascript:;" className="list-inline-item"><i className='bx bx-calendar me-1'></i>November 5, 2021</a>
                                        </div>
                                        <h4 className="mt-4">Post Title Here</h4>
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>	<a href="single.html" className="btn btn-light btn-ecomm">Read More <i className='bx bx-chevrons-right' ></i></a>
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="assets/images/posts/03.png" className="card-img-top" alt="" />
                                    <div className="card-body">
                                        <div className="list-inline">	<a href="javascript:;" className="list-inline-item"><i className='bx bx-user me-1'></i>By Admin</a>
                                            <a href="javascript:;" className="list-inline-item"><i className='bx bx-comment-detail me-1'></i>16 Comments</a>
                                            <a href="javascript:;" className="list-inline-item"><i className='bx bx-calendar me-1'></i>November 5, 2021</a>
                                        </div>
                                        <h4 className="mt-4">Post Title Here</h4>
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>	<a href="single.html" className="btn btn-light btn-ecomm">Read More <i className='bx bx-chevrons-right' ></i></a>
                                    </div>
                                </div>
                                <hr />

                                { /* <Navigation5 /> */ }
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <div className="blog-left-sidebar p-3">
                                <form>
                                    <div className="position-relative blog-search mb-3">
                                        <input type="text" className="form-control form-control-lg rounded-0 pe-5" placeholder="Serach posts here..." />
                                        <div className="position-absolute top-50 end-0 translate-middle"><i className='bx bx-search fs-4 text-white'></i>
                                        </div>
                                    </div>
                                    <div className="blog-categories mb-3">
                                        <h5 className="mb-4">Blog Categories</h5>
                                        <div className="list-group list-group-flush"> <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Fashion</a>
                                            <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Electronis</a>
                                            <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Accessories</a>
                                            <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Kitchen & Table</a>
                                            <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Furniture</a>
                                        </div>
                                    </div>
                                    <div className="blog-categories mb-3">
                                        <h5 className="mb-4">Recent Posts</h5>
                                        <div className="d-flex align-items-center">
                                            <img src="assets/images/gallery/05.png" width="75" alt="" />
                                            <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
                                                <p className="mb-0">March 15, 2021</p>
                                            </div>
                                        </div>
                                        <div className="my-3 border-bottom"></div>
                                        <div className="d-flex align-items-center">
                                            <img src="assets/images/gallery/07.png" width="75" alt="" />
                                            <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
                                                <p className="mb-0">March 15, 2021</p>
                                            </div>
                                        </div>
                                        <div className="my-3 border-bottom"></div>
                                        <div className="d-flex align-items-center">
                                            <img src="assets/images/gallery/16.png" width="75" alt="" />
                                            <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
                                                <p className="mb-0">March 15, 2021</p>
                                            </div>
                                        </div>
                                        <div className="my-3 border-bottom"></div>
                                        <div className="d-flex align-items-center">
                                            <img src="assets/images/gallery/01.png" width="75" alt="" />
                                            <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
                                                <p className="mb-0">March 15, 2021</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog-categories mb-3">
                                        <h5 className="mb-4">Popular Tags</h5>
                                        <div className="tags-box">	<a href="javascript:;" className="tag-link">Cloths</a>
                                            <a href="javascript:;" className="tag-link">Electronis</a>
                                            <a href="javascript:;" className="tag-link">Furniture</a>
                                            <a href="javascript:;" className="tag-link">Sports</a>
                                            <a href="javascript:;" className="tag-link">Men Wear</a>
                                            <a href="javascript:;" className="tag-link">Women Wear</a>
                                            <a href="javascript:;" className="tag-link">Laptops</a>
                                            <a href="javascript:;" className="tag-link">Formal Shirts</a>
                                            <a href="javascript:;" className="tag-link">Topwear</a>
                                            <a href="javascript:;" className="tag-link">Headphones</a>
                                            <a href="javascript:;" className="tag-link">Bottom Wear</a>
                                            <a href="javascript:;" className="tag-link">Bags</a>
                                            <a href="javascript:;" className="tag-link">Sofa</a>
                                            <a href="javascript:;" className="tag-link">Shoes</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Blog;