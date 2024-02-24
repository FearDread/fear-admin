import React from "react";
import { ReactComponent as CogWheel } from "../../assets/img/spinner.svg";
import "../../assets/css/loading.css";

const CogWheelLoader = () => (
  <div className="cog-loader">
    <CogWheel className="spinner" />
  </div>
);

export default CogWheelLoader;
