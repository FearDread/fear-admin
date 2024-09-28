import React from "react";
import { Row, Col } from "reactstrap";
import { ReactComponent as CogWheel } from "../../assets/img/spinner.svg";
import "../../assets/css/loading.css";

const CogWheelLoader = () => (
  <div class="content">
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
