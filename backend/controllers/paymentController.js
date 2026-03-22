import stripe from '../config/stripe.js';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { sendPaymentConfirmation } from '../utils/sendEmail.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, paymentType, propertyId, bookingId, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        userId: req.user._id.toString(),
        propertyId,
        bookingId,
        paymentType,
      },
    });

    const payment = new Payment({
      user: req.user._id,
      property: propertyId,
      booking: bookingId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency,
      paymentType,
      status: 'pending',
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId })
        .populate('property', 'title address price')
        .populate('user', 'name email');

      if (payment) {
        payment.status = 'succeeded';
        payment.paidAt = new Date();
        payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
        await payment.save();

        if (payment.booking) {
          await Booking.findByIdAndUpdate(payment.booking, {
            paymentStatus: 'paid',
            paymentId: payment._id,
          });
        }

        if (payment.property && payment.user) {
          await sendPaymentConfirmation(payment, payment.property, payment.user);
        }

        res.json({ success: true, payment });
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('property', 'title address images price')
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};