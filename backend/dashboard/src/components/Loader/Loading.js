import React from "react";
import { Row, Col } from "reactstrap";
import { ReactComponent as CogWheel } from "../../assets/img/spinner.svg";
import "./loading.css";

const CogWheelLoader = () => (
  <div className="content loading-container">
    <Row>
      <Col className="mb-5" md="12">
        <div className="cog-loader">
          <CogWheel className="spinner" />
        </div>
      </Col>
    </Row>
  </div>
);

export default CogWheelLoader;
