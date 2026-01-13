import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Wizard = () => {

}

export default Wizard;

/*
import { useHistory } from "react-router-dom";
import ReactWizard from "react-bootstrap-wizard";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { Col } from "reactstrap";
import * as ProductActions from "_redux/product/actions"
import * as CatActions from "_redux/category/actions";
import * as BrandActions from "_redux/brand/actions";
import { NEW_PRODUCT_RESET } from "_redux/product/types";
// wizard steps
import Step1 from "./WizardSteps/Step1.js";
import Step2 from "./WizardSteps/Step2.js";
import Step3 from "./WizardSteps/Step3.js";

var steps = [
  {
    stepName: "info",
    stepIcon: "tim-icons icon-single-02",
    component: Step1,
  },
  {
    stepName: "images",
    stepIcon: "tim-icons icon-settings-gear-63",
    component: Step2,
  },
  {
    stepName: "pricing",
    stepIcon: "tim-icons icon-delivery-fast",
    component: Step3,
  } 
];

const Wizard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  const { success } = useSelector((state) => state.product)
  const hideAlert = () => { setAlert(null); };
  const finishButtonClick = (state) => {
    const formData = new FormData();

    formData.set('title', state['info'].myform.get('title'))
    formData.set("slug", state['info'].myform.get('title').toLowerCase().replace(" ", "-"));
    formData.set("description", state['info'].myform.get('description'));
    formData.set("category", state['info'].myform.get('category'));
    formData.set("tags", state['info'].myform.get('category'));
    formData.set("brand", state['info'].myform.get('brand'));

    const images = 
    formData.set("images", state['images'].myform.get('images'));

    formData.set("quantity", state['pricing'].myform.get('quantity'));
    formData.set("price", state['pricing'].myform.get('price'));

    dispatch(ProductActions.create(formData));
  };

  const successAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => {
          dispatch({ type: NEW_PRODUCT_RESET });
          history.push("/admin/products");
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize="" >
        Product Added to Store!
      </ReactBSAlert>
    );
  };

  useEffect(() => {
    if (success) {
      successAlert();
    }

  }, [success]);

  useEffect(() => {
    dispatch({ type: NEW_PRODUCT_RESET })
    dispatch(CatActions.list());
    dispatch(BrandActions.list());
  }, [dispatch]);

  return (
    <>
      <div className="content">
        {alert}
        <Col className="mr-auto ml-auto" md="10">
          <ReactWizard
            steps={steps}
            navSteps
            validate
            title="Add Your Product"
            description="This information will include title and product description"
            headerTextCenter
            finishButtonClick={finishButtonClick}
            finishButtonClasses="btn-wd btn-info"
            nextButtonClasses="btn-wd btn-info"
            previousButtonClasses="btn-wd"
            progressbar
            color="blue"
          />
        </Col>
      </div>
    </>
  );
};

export default Wizard;
*/