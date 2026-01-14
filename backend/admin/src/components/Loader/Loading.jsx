import React from "react";

//import "./loading.css";
/*
    <div id="pageloader-overlay" className="visible incoming">
      <div className="loader-wrapper-outer">
        <div className="loader-wrapper-inner">
          <div className="loader">
          </div>
        </div>
      </div>
    </div>
    */
const Loader = () => (
  <>

                  <div
                    className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                      top: 0,
                      left: 0,
                      background: 'rgba(0,0,0,1)',
                      zIndex: 999
                    }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
  </>
);

export default Loader;
