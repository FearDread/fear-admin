import React from "react";

// reactstrap components
import { UncontrolledCarousel } from "reactstrap";

const carouselItems = [
  {
    src:
      "",
    altText: "Slide 1",
    caption: ""
  },
  {
    src:
    "", 
    altText: "Slide 2",
    caption: ""
  },
  {
    src:
    "",
    altText: "Slide 3",
    caption: ""
  }
];

class Carousel extends React.Component {
  render() {
    return (
      <>
        <UncontrolledCarousel items={carouselItems} />
      </>
    );
  }
}

export default Carousel