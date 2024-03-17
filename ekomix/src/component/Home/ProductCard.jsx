import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@material-ui/core";

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
import { FitScreen } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {dispalyMoney  ,generateDiscountedPrice} from "../DisplayMoney/DisplayMoney"
import { addItemToCart } from "../../_store/actions/cartAction";
import { useDispatch } from "react-redux";
const useStyles = makeStyles((theme) => ({

}));

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
    let discountPrice = generateDiscountedPrice(product.price);
    discountPrice = dispalyMoney(discountPrice);
  const oldPrice = dispalyMoney(product.price);
  
  const truncated =
    product.description
      .split(" ")
      .slice(0, 5)
      .join(" ") + "...";
      const  nameTruncated = product.name.split(" ").slice(0, 3).join(" ") + "...";


      const addTocartHandler = (id , qty) => {
        dispatch(addItemToCart(id , qty))
      }

  return (
    <>
    <Col className="md-6">
      <Link
        className="product-card"
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
      <CardActionArea>
          <CardMedia className={classes.media} image={product.images[0] && product.images[0].url ? product.images[0].url : ''} />
          <CardContent>
            <Typography
              gutterBottom
              color="black"
              fontWeight="bold"
              style={{ fontWeight: "700" }}
            >
              {nameTruncated}
            </Typography>
            <Box display="flex" alignItems="center">
              <Rating
                name="rating"
                value={product.ratings}
                precision={0.1}
                readOnly
                size="small"
                style={{ color: "#ed1c24", marginRight: 8, fontWeight: "400" }}
              />
              <Typography variant="body2" color="textSecondary">
                ({product.numOfReviews})
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              component="div"
              className={classes.description}
            >
              {truncated}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" className={classes.oldPrice}>
                {oldPrice}
              </Typography>
              <Typography variant="body1" className={classes.finalPrice}>
                {discountPrice}
              </Typography>
        <Box display="flex" justifyContent="center" p={2}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => addTocartHandler(product._id, 1)}
        >
          Add to Cart
        </Button>
        </Box>
      </Box>
      </CardContent>
      </CardActionArea>
      </Link>
      </Col>
    </>
  );
}

export default ProductCard;
/*
    <Card className={classes.root}>
      <Link
        className="productCard"
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >

    </Card>
  );
};

export default ProductCard;
*/