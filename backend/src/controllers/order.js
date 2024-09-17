const Order = require("../models/order");
const methods = require("./crud");

exports.getMyOrders = async (req, res) => {
    const { _id } = req.user;
    try {
      const orders = await Order.find({ user: _id })
        .populate("user")
        .populate("orderItems.product")
        .populate("orderItems.color");
      res.json({
        orders,
      });
    } catch (error) {
      throw new Error(error);
    }
};
  
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const orders = await Order.findById(id);
      orders.orderStatus = req.body.status;
      await orders.save();
      res.json({
        orders,
      });
    } catch (error) {
      throw new Error(error);
    }
};
  
exports.getMonthWiseOrderIncome = async (req, res) => {
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
      d.setMonth(d.getMonth() - 1);
      endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    }
    const data = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$month",
          },
          amount: { $sum: "$totalPriceAfterDiscount" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(data);
};
  
exports.getYearlyTotalOrder = async (req, res) => {
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
      d.setMonth(d.getMonth() - 1);
      endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    }
    const data = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: 1 },
          amount: { $sum: "$totalPriceAfterDiscount" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(data);
};

const crud = methods.crudController( Order );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}
