
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   Col } from "reactstrap";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";
import Loader from "components/Loader/Loading.js";
import * as Category from "_redux/category/actions";
import * as CategoryTypes from "_redux/category/types";
import ReactBSAlert from "react-bootstrap-sweetalert";

function CategoryList () {
  const history = useHistory();
  const dispatch = useDispatch();
  const [ alert, setAlert ] = useState(null);
  const { categories, loading } = useSelector((state) => state.cat);


    const deleteCategoryHandler = (id) => {
      dispatch(Category.remove(id));
      dispatch({type: CategoryTypes.DELETE_CATEGORY_RESET});
      hideAlert()
    };
  
    const confirmDelete = (_id) => {
      setAlert( 
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => deleteCategoryHandler(_id)}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
          btnSize="">
          Your sure you want to delete this category?
        </ReactBSAlert>
      );
    };
  
    const hideAlert = () => {
      setAlert(null);
    };

  useEffect(() => {
    dispatch(Category.list());
  }, [dispatch]);

  const tableHeader = [
    { Header: "Category", accessor: "title" },
    { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
  ]

  const displayCategroies = () => {
    let dataTable = [];

    categories && categories.forEach((item, key) => {
      dataTable.push({
        title: item.title,
                  actions: ( 
                    ReactTableActions( key, (() => {
                      history.push("/admin/category/edit/" + item._id);
                    }),
                    (() => {
                      confirmDelete(item._id, "category", deleteCategoryHandler, hideAlert);
                    })
                  ))
      })
    })
    return dataTable;
  }

  return (
      <>
      {loading ? (
        <Loader />
      ) : (
      <>
        <div className="content">
          {alert}
          <Row>
            <Col className="mb-5" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Product Categories</CardTitle>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={displayCategroies()}
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
}


export default CategoryList;
