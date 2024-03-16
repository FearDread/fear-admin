import React, { useState  } from "react";
import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
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
const useStyles = makeStyles((theme) => ({

}));

const MyCard = ({ review }) => {
  const classes = useStyles();

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
    <Col className="mr-auto" md="7">
    <Card className="card-product card-dark">
      <CardHeader>

        <CardTitle tag="h4">Example</CardTitle>
      </CardHeader>
    <CardBody>
      <CardImg
          alt="..."
          className="product-img"
        />

      </CardBody>
      </Card>
      </Col>
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

