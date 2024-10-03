import React, { useState  } from "react";
import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  Col,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label
} from "reactstrap";

const MyCard = ({ review }) => {
  const [helpful, setHelpful] = useState(10);
  const [unhelpful, setUnHelpful] = useState(5);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [unhelpfulClicked, setUnhelpfulClicked] = useState(false);

  const helpfulHandler = (type) => {
    if (type === "up" && !helpfulClicked) {
      setHelpful(helpful + 1);
      setHelpfulClicked(true);

      if (unhelpfulClicked) {
        setUnHelpful(unhelpful - 1);
        setUnhelpfulClicked(false);
      }
    } else if (type === "down" && !unhelpfulClicked) {
      setUnHelpful(unhelpful + 1);
      setUnhelpfulClicked(true);

      if (helpfulClicked) {
        setHelpful(helpful - 1);
        setHelpfulClicked(false);
      }
    }
  };

  function formateDate(dateString){
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
    return formattedDate;
  }

return (
  <>
      <Link to={`/product/${product._id}`}>
        <Card className="card-product card-home">
          <div className="card-image">
            <img alt="..." class="img rounded" src={product.images[0] && product.images[0].url ? product.images[0].url : ''} />
          </div>
          <div class="card-body">
            <h6 class="category text-warning">Popular</h6>
            <h4 class="card-title">{nameTruncated}</h4>
            <div class="card-description"><span>{truncated}</span></div>
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
export default MyCard;
  /*
    <div className={classes.cardRoot}>
      <div className={classes.cardheader}>
        <Avatar
          alt="User Avatar"
          src={review.avatar || "https://i.imgur.com/JSW6mEk.png"}
          className={classes.avatar}
        />
        <Typography variant="body1" className={classes.subHeadings}>
          {review.name}
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ marginLeft: "12rem" }}
          className={classes.bodyText}
        >
          {formateDate(review.createdAt)}
        </Typography>
      </div>
      <div>
        <Rating
          value={4}
          precision={0.5}
          size="midium"
          readOnly
          className={classes.star}
        />
      </div>
      <Typography variant="h6" className={classes.title}>
        {review.title}
      </Typography>
      <Typography variant="body1" className={classes.commentTxt}>
        {review.comment}
      </Typography>
      <Typography variant="body1" className={classes.recommend}>
        Would you recommend this product?{" "}
        <span className={review.recommend ? classes.yes : classes.no}>
          {review.recommend ? "Yes!" : "No!"}
        </span>
      </Typography>
      <div className={classes.helpful}>
        <Typography
          variant="body2"
          color="textSecondary "
          className={classes.subHeadings}
        >
          Helpful?
        </Typography>
        <ThumbUpIcon
          className={`${classes.thumbIcon} ${
            helpfulClicked ? classes.clicked : ""
          }`}
          onClick={() => helpfulHandler("up")}
        />
        <Typography>{helpful}</Typography>
        <ThumbDownIcon
          className={`${classes.thumbIcon} ${
            unhelpfulClicked ? classes.clicked : ""
          }`}
          onClick={() => helpfulHandler("down")}
        />
        <Typography>{unhelpful}</Typography>
      </div>
    </div>
  );
};
*/

