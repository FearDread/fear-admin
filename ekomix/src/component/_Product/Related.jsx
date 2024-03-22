import React from "react";
import {
    Col,
    Row,
    Container
} from "reactstrap";
import ProductCard from "./Card";

const RelatedProducts = (products) => {

    return (
        <>
        <div class="section related-products">
            <Container>
                <div class="col-md-8">
                    <h2 class="title">You may also like</h2>
                </div>
                <Row>
                {products &&
                    products.map((product) => (
                    <Col md="6" lg="3">
                          <ProductCard key={product._id} product={product} />
                    </Col>
                 ))}
                </Row>
            </Container>
        </div>
        </>
    )
}

export default RelatedProducts;
