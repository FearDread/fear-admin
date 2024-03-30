import React from "react";
import {
    Col,
    Card,
} from "reactstrap";
import defaultImg from "../../assets/img/james.jpg";

const TestimonialCard = (...props) => {
    return (
        <Col md="3" className="testimonial-col" style={{ display: "inline-block" }}>
            <Card className="card-testimonial">
            <div className="card-avatar">
                <a href={props.href || "/about"}>
                    <img alt="..." className="img img-raised" src={props.img || defaultImg} />
                </a>
            </div>
            <div className="card-body">
                <p className="card-description">The networking at Web Summit is like no other European tech conference.</p>
            </div>
            <div className="icon icon-primary"><i className="fa fa-quote-right"></i></div>
            <div className="card-footer">
                <h4 className="card-title">Michael Elijah</h4>
                <p className="category">@michaelelijah</p>
            </div>
            </Card>
        </Col>
    )
}

export default TestimonialCard;
