import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label
} from "reactstrap";
import Rating from "@material-ui/lab/Rating";
import { addItemToCart } from "../../_store/actions/cartAction";
import logo from "assets/img/ekomix/logo.png";


const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  //const truncated = product.description.split(" ").slice(0, 5).join(" ") + "...";
  //const nameTruncated = product.name.split(" ").slice(0, 3).join(" ") + "...";
  
  const addTocartHandler = (id , qty) => {
    dispatch(addItemToCart(id , qty))
  }

  return (
    <>
      <Link to={`/product/${product._id}`}>
        <Card className="card-product card-home">
          <div className="card-image">
            <img alt="..." class="img rounded" src={product.images[0] ? product.images[0].url : logo} />
          </div>
          <div class="card-body">
            <h6 class="category text-warning">Popular</h6>
            <h4 class="card-title">{product.name}</h4>
            <div class="card-description"><span>{product.description}</span></div>
            <div class="card-footer">
              <div class="price-container">
                <span class="price">${product.price}</span>
              </div>
              <Rating
                name="rating"
                value={product.ratings}
                precision={0.1}
                readOnly
                size="small"
                style={{ color: "#ed1c24", marginRight: 8, fontWeight: "400" }}
              />
                <button id="tooltip449471879" class="btn-simple btn-icon btn-round pull-right btn btn-warning">
                  <i class="tim-icons icon-heart-2"></i>
                </button>
                <Button
                  onClick={() => addTocartHandler(product._id, 1)} >
                  Add to Cart
                </Button>
            </div>
          </div>
        </Card>
      </Link>
    </>
  );
}

export default ProductCard;