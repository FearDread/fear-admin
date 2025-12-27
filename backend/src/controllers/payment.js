const Razorpay = require("razorpay");
const paypal = require("@paypal/checkout-server-sdk");
const Payment = require("../models/payment");
const methods = require("./crud");

const instance = new Razorpay({
  key_id: "rzp_test_HSSeDI22muUrLR",
  key_secret: "sRO0YkBxvgMg0PvWHJN16Uf7",
});

// Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_HSSeDI22muUrLR",
  key_secret: "sRO0YkBxvgMg0PvWHJN16Uf7",
});

// PayPal environment setup
const paypalEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "YOUR_PAYPAL_CLIENT_SECRET";
  
  // Use sandbox for testing, live for production
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  // For production: return new paypal.core.LiveEnvironment(clientId, clientSecret);
};

const paypalClient = () => {
  return new paypal.core.PayPalHttpClient(paypalEnvironment());
};

exports.checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    const option = {
      amount: amount * 100,
      currency: "INR",
    };
    const order = await razorpayInstance.orders.create(option);
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
      error: error.message,
    });
  }
};

exports.paymentVerification = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    
    // Verify signature for security
    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", "sRO0YkBxvgMg0PvWHJN16Uf7")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    
    if (generatedSignature === razorpaySignature) {
      res.json({
        success: true,
        razorpayOrderId,
        razorpayPaymentId,
        verified: true,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// ============ PAYPAL METHODS ============

const createPayPalOrder = async (req, res) => {
  try {
    const { amount, currency = "USD" } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
      }],
    });
    
    const order = await paypalClient().execute(request);
    
    res.json({
      success: true,
      orderId: order.result.id,
      order: order.result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating PayPal order",
      error: error.message,
    });
  }
};

const capturePayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    const capture = await paypalClient().execute(request);
    
    res.json({
      success: true,
      captureId: capture.result.id,
      status: capture.result.status,
      capture: capture.result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error capturing PayPal order",
      error: error.message,
    });
  }
};

const crud = methods.crudController( Payment );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}