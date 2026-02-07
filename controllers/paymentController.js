const mongoose = require('mongoose');
const razorpay = require("../config/razorpay");
const calculateOrderAmount = require("../utils/calculateOrderAmount");
const paymentIntentModel = require("../models/paymentIntent");
const crypto = require("crypto");
const decreaseStock = require("../utils/decreaseStock");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderData } = req.body;

    const sanitizedItems = orderData.items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const amount = await calculateOrderAmount(sanitizedItems);

    let lockedItems = [];
    for (const item of sanitizedItems) {
      const product = await productModel.findById(item.product);
      const discountedPrice = Math.round(
        product.price - (product.price * product.discount) / 100,
      );

      lockedItems.push({
        product: product._id,
        name: product.productName,
        image: product.images[0],
        price: discountedPrice,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      });
    }


    const order = await razorpay.orders.create({
      amount: amount.total * 100, // paise
      currency: "INR",
      receipt: `rept_${Date.now()}`,
    });

    await paymentIntentModel.create({
      razorpayOrderId: order.id,
      amount: amount.total,
      items: lockedItems,
      pricing: {
        subTotal: amount.subTotal,
        tax: amount.tax,
        shipping: amount.shipping,
        total: amount.total,
      },
      shippingAddress: {
        fullName: orderData.shippingAddress.fullName,
        email: orderData.shippingAddress.email,
        phone: orderData.shippingAddress.phone,
        addressLine: orderData.shippingAddress.addressLine,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        pincode: orderData.shippingAddress.pincode,
        country: orderData.shippingAddress.country,
      },
      user: req.id,
    });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const paymentIntent = await paymentIntentModel.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session)

    if (!paymentIntent) {
      await session.abortTransaction()
      session.endSession()
      return res
        .status(400)
        .json({ success: false, message: "payment intent not found" });
    }

    // 3️⃣ Fetch Razorpay order
     const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id)
    if (paymentIntent.amount * 100 !== razorpayOrder.amount) {
      await session.abortTransaction()
      session.endSession()
      return res
        .status(400)
        .json({ success: false, message: "Amount mismatched" });
    }


    await decreaseStock(paymentIntent.items,session);

    const order = await orderModel.create([
      {
      user: paymentIntent.user,
      orderId: `ORD-${Date.now()}`,
      items: paymentIntent.items,
      pricing: paymentIntent.pricing,
      shippingAddress: paymentIntent.shippingAddress,
      payment: {
        method: "RAZORPAY",
        status: "paid",
        razorpay: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      },
    }],{session});

    await paymentIntentModel.deleteOne({
       razorpayOrderId: razorpay_order_id
    },{session})
    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({ success: true, message: "Order placed" });
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCODOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction()
    const { orderData } = req.body;

    const sanitizedItems = orderData.items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const pricing = await calculateOrderAmount(sanitizedItems);

    let orderItems = [];

    for (const item of sanitizedItems) {
      const product = await productModel.findById(item.product);
      const discountedPrice = Math.round(
        product.price - (product.price * product.discount) / 100,
      );

      orderItems.push({
        product: product._id,
        name: product.productName,
        image: product.images[0],
        price: discountedPrice,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      });
    }

    await decreaseStock(sanitizedItems,session);

    const order = await orderModel.create([
      {
      user: req.id,
      orderId: `ORD-${Date.now()}`,
      items: orderItems,
      pricing,
      shippingAddress: orderData.shippingAddress,
      payment: {
        method: "COD",
      },
    }],{session});

    await session.commitTransaction();
    session.endSession()
    return res.status(200).json({ success: true, message: "Order placed" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession()
    return res.status(500).json({ success: false, message: error.message });
  }
};
