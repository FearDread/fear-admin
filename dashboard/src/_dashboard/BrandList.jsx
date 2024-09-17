import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBrands, resetErrors } from "../_redux/actions/brand.jsx";
import {
  deleteABrand,
  getBrands,
  resetState,
} from "../features/brand/brandSlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Brandlist = () => {
  const [open, setOpen] = useState(false);
  const [brandId, setbrandId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(getBrands());
  }, []);

  const brands = useSelector((state) => state.brands);

  return (
    <>
    {loading ? (
      <Loader />
    ) : (
    <>
      <div className="content">
        <Row>
          <Col className="mb-5" md="12">

            <Card>
              <CardHeader>
                <CardTitle tag="h5">All Brands</CardTitle>
              </CardHeader>
                <CardBody>

                  <SortingTable
                      thead={tableHeader}
                      tbody={tableRows}
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

export default Brandlist;
