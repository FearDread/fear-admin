import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../components/Common/BreadCrumb";
import Meta from "../components/Meta/Meta";
import BlogCard from "../components/Cards/BlogCard";
import Container from "../components/Common/Container";
import Loader from "../components/Loader/Loader";
import moment from "moment";
import { cruds } from "@feardread/crud-service";


const Blog = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const { result, loading } = useSelector((state) => state?.crud?.blog);
  const dispatch = useDispatch();
  
  const getblogs = () => {
    dispatch(cruds.all('blog'));
  };


  useEffect(() => {
    getblogs();
    console.log('blogs = ', result);
  }, []);



  return (

    <>
      <Meta title={"Blogs"} />
      <BreadCrumb title="Blogs" />
      { (loading) ? (
      <>
        <Loader />
      </>
        ) : (
      <>
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Find By Categories</h3>
              <div>
                <ul className="ps-0">
                  <li>Watch</li>
                  <li>Tv</li>
                  <li>Camera</li>
                  <li>Laptop</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="row">
              {result &&
                result?.map((item, index) => {
                  return (
                    <div className="col-6 mb-3" key={index}>
                      <BlogCard
                        id={item?._id}
                        title={item?.title}
                        description={item?.description}
                        image={item?.images[0]?.url}
                        date={moment(item?.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>
      </>
    )}
    </>
  );
};

export default Blog;
