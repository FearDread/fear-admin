import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Card,
  CardHeader, 
  CardBody, 
  CardTitle, 
  Row, 
  Col 
} from "reactstrap";
import Loader from "components/Loader/Loading.js";
import * as BlogActions from "../_redux/blog/actions"; 
import logo from "assets/img/FEAR/logo.png";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";

const tableHeader = [
  { Header: "Photo", accessor: "images" },
  { Header: "Title", accessor: "title" },
  { Header: "Category", accessor: "category" },
  { Header: "Post", accessor: "description" },
  { Header: "# Likes", accessor: "likes" }
];

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(BlogActions.list());
  }, [ dispatch ]);

  const displayBlogs = () => {
    let dataTable = [];

    blogs && blogs.forEach((item, key) => {
      item.isActive = (item.isActive) ? "Active" : "Disabled";
      
      dataTable.push({
        avatar: (
          <img 
            src={item.images[0] ? item.images[0].url : logo} 
            className="avatar"/>),
        title: item.title,
        category: item.category,
        description: item.description,
        likes: item.likes,
        actions: ( ReactTableActions( key, (() => {
            console.log("edit item ::", item);
          }), (() => {
            dispatch(BlogActions.remove(item._id));
          })
        )) 
      })
    })
    return dataTable;
  }

  return (
    <>
    {loading ? (
      <>
        <div className="content">
          <Loader />
        </div>
      </>
    ) : (
    <>
      <div className="content">
        <Row>
          <Col className="mb-5" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Blog Posts</CardTitle>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={displayBlogs()}
                  filterable
                  resizable={false}
                  columns={tableHeader}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />  
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      </>
      )}
    </>
  );
};

export default BlogList;
