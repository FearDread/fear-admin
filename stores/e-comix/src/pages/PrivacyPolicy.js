import React from "react";
import Breadcrumbs from "../components/Common/Breadcrumbs";
import Meta from "../components/Meta/Meta";

const PrivacyPolicy = () => {
  return (
    <>
      <Meta title={"Privacy Policy"} />
      <main className="float-start w-100 total-body home-body mt-0">
        <Breadcrumbs crumbs={{link:"/", crumb:"Privacy Policy"}} />
        <section className="about-hisotry float-start w-100 position-relative">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-2 g-5 mt-0 align-items-center">
              <div className="col position-relative">
                <div className="policy">

                </div>
              </div>
            </div>
            </div>
        </section>
      </main>
    </>
  );
};

export default PrivacyPolicy;

