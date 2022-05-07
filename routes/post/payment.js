require("dotenv").config();
const router = require('express').Router()
const crypto = require('crypto');
const Razorpay = require("razorpay");
const { Booking } = require('../../models/users')
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/orders", async (req, res) => {
    try {
        const options = {
            amount: req.body.price, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${req.body.receipt}`,
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");
        await Booking.updateOne({ _id: req.body.receipt }, { status: "complete" })
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            amount, currency
        } = req.body;

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature) return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        const captureResponse = await instance.payments.capture(
            razorpayPaymentId,
            amount,
            currency
        );

        return res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            captureResponse
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

module.exports = router