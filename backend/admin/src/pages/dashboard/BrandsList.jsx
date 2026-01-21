
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   Col } from "reactstrap";
import Loader from "components/Loader/Loading.js";
import * as BrandActions from "../_redux/brand/actions"; 
import * as BrandTypes from "../_redux/brand/types";
import logo from "assets/img/FEAR/logo.png";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";
import ReactBSAlert from "react-bootstrap-sweetalert";


const Brandlist = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { brands, loading } = useSelector((state) => state.brand);
  const [ alert, setAlert ] = useState(null);

const tableHeader = [
  { Header: "Logo", accessor: "avatar" },
  { Header: "Brand Name", accessor: "title" },
  { Header: "Is Active", accessor: "isActive" },
  { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
]
  const handleRemove = (id) => {
    const nBrands = brands.filter((brand) => brand._id !== id);
    
    brands = nBrands;
  };
  const deleteBrandHandler = (id) => {
    dispatch(BrandActions.remove(id));
    dispatch({ type: BrandTypes.DELETE_BRAND_RESET });
    hideAlert()
  };

  const confirmDelete = (_id) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => deleteBrandHandler(_id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize="">
        Your sure you want to delete this brand?
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };


  useEffect(() => {
    dispatch(BrandActions.list());
  }, [ dispatch ]);

  const displayBrands = () => {
    let dataTable = [];

    brands && brands.forEach((item, key) => {
      item.isActive = (item.isActive) ? "Active" : "Disabled";
      
      dataTable.push({
        avatar: (
          <img 
            src={item.avatar ? item.avatar.url : logo} 
            className="avatar"/>),
        title: item.title,
        isActive: item.isActive,
        actions: ( ReactTableActions( key, (() => {
                    history.push("/admin/brand/edit/" + item._id);
                }),
                (() => { 
                  confirmDelete(item._id, "brand", deleteBrandHandler, hideAlert)
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
                  <CardTitle tag="h5">Store Brands</CardTitle>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={displayBrands()}
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

export default Brandlist;