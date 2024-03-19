import React from "react";
import { ReactComponent as CogWheel } from "../../assets/img/spinner.svg";
import "../../assets/css/loading.css";

const CogWheelLoader = () => (
  <div class="content">
    <div className="cog-loader">
      <CogWheel className="spinner" />
    </div>
  </div>
);

export default CogWheelLoader;
