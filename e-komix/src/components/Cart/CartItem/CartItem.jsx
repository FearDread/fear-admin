import React  from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Input,
} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import {
  dispalyMoney,
  generateDiscountedPrice,

} from "../DisplayMoney/DisplayMoney";


function CartItem({
  deleteCartItems,
  item,
  decreaseQuantity,
  increaseQuantity,
  length,
}) {
  const classes = useStyles();

  /// calculate price after discount

  let finalPrice = generateDiscountedPrice(item.price);
  let discountedPrice = item.price - finalPrice;
  discountedPrice = dispalyMoney(discountedPrice);
  let total = finalPrice * item.quantity;
  total = dispalyMoney(total);
  finalPrice = dispalyMoney(finalPrice);

  return (
    <Card className={length < 2 ? classes.root11 : classes.roots11}>
      <CardMedia
        className={classes.media}
        image={item.image}
        title={item.name}
      />
      <CardContent className={classes.content}>
        <div className={classes.contentTop}>
          <div className={classes.cartHeader}>
            <Typography variant="subtitle1" className={classes.title}>
              {item.name}
            </Typography>

            <IconButton
              aria-label="delete"
              className={classes.cartDeleteIcon}
              onClick={() => deleteCartItems(item.productId)}
            >
              <DeleteIcon />
            </IconButton>
          </div>

          <div className={classes.priceItem}>
            <Typography className={classes.cartSubHeadings} variant="body2">
              Price:
            </Typography>
            <Typography variant="subtitle1" className={classes.itemPrice}>
              {finalPrice}
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color="black"
              className={classes.itemOldPrice}
            >
              <del>{discountedPrice}</del>
            </Typography>
          </div>
        </div>
        <div className={classes.contentBottom}>
          <div className="prod_details_additem">
            <h5>QTY:</h5>
            <div className="additem">
              <IconButton
                onClick={() => decreaseQuantity(item.productId, item.quantity)}
                className="additem_decrease"
              >
                <RemoveIcon />
              </IconButton>
              <Input
                readOnly
                type="number"
                value={item.quantity}
                className="input"
              />
              <IconButton
                onClick={() =>
                  increaseQuantity(item.productId, item.quantity, item.stock)
                }
                className="additem_increase"
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>

          <div className={classes.priceItem}>
            <Typography variant="body2" className={classes.cartSubHeadings}>
              TOTAL:
            </Typography>
            <Typography variant="subtitle1" className={classes.price}>
              {total}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItem;
