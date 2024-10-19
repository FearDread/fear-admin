import React from "react";
import { ReactComponent as CricketBall } from "../../Assets/Loader/LoaderBlack.svg";
import "./Loader.css";

const CricketBallLoader = () => (
  <div className="cricket-ball-loader">
    <CricketBall className="spinner" />
  </div>
);

export default CricketBallLoader;
