import React from "react";
import {
    Col,
    Card,
} from "reactstrap";

const TestimonialCard = (data) => {
    return (
        <Col md="3" style="display:inline-block">
            <Card className="card-testimonial">
            <div class="card-avatar">
                <a href="">
                    <img alt="..." class="img img-raised" src="index.htmlstatic/media/michael.660d3e04.jpg" />
                </a>
            </div>
            <div class="card-body">
                <p class="card-description">The networking at Web Summit is like no other European tech conference.</p>
            </div>
            <div class="icon icon-primary"><i class="fa fa-quote-right"></i></div>
            <div class="card-footer">
                <h4 class="card-title">Michael Elijah</h4>
                <p class="category">@michaelelijah</p>
            </div>
            </Card>
        </Col>
    )
}

export default TestimonialCard;
