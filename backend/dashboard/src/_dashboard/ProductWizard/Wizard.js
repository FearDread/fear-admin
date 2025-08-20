import React from "react";
// react plugin used to create a form with multiple steps
import ReactWizard from "react-bootstrap-wizard";

// reactstrap components
import { Col } from "reactstrap";

// wizard steps
import Step1 from "./WizardSteps/Step1.js";
import Step2 from "./WizardSteps/Step2.js";
import Step3 from "./WizardSteps/Step3.js";

var steps = [
  {
    stepName: "info",
    stepIcon: "tim-icons icon-single-02",
    component: Step1,
    stepProps: {
      title: "",
      category: null,
      brand: "",
      description:"",
      quantity: 0
    }
  },
  {
    stepName: "images",
    stepIcon: "tim-icons icon-settings-gear-63",
    component: Step2,
    state: {
      images: []
    }
  },
  {
    stepName: "pricing",
    stepIcon: "tim-icons icon-delivery-fast",
    component: Step3,
    state: {
      price: 0,
      discount: null,
      tax: 0,
    }
  }
];

const Wizard = () => {
    const finishButtonClick = (state) => {
    const formData = new FormData();
      
    formData.set('title', state['info'].myform.get('title'))
    formData.set("slug", state['info'].myform.get('title').toLowerCase());
    
    formData.set("price", state['pricing'].myform.get('price'));
    formData.set("description", state['info'].myform.get('description'));
    formData.set("category", state['info'].myform.get('category'));
    formData.set("quantity", state['pricing'].myform.get('quantity'));
    formData.set("brand", state['info'].myform.get('brand'));


    console.log(formData.get('title'));
     console.log(formData.get('price  '));
  };
  return (
    <>
      <div className="content">
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
