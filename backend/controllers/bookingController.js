import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { sendBookingConfirmation } from '../utils/sendEmail.js';

export const createBooking = async (req, res) => {
  try {
    const { propertyId, bookingDate, timeSlot, message, attendees, bookingType } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const existingBooking = await Booking.findOne({
      property: propertyId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const booking = new Booking({
      property: propertyId,
      user: req.user._id,
      bookingDate,
      timeSlot,
      message,
      attendees: attendees || 1,
      bookingType: bookingType || 'viewing',
    });

    const createdBooking = await booking.save();

    await createdBooking.populate('property', 'title address images price');
    await createdBooking.populate('user', 'name email');

    await sendBookingConfirmation(createdBooking, property, req.user);

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title address images price propertyType bedrooms bathrooms')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = req.body.status || booking.status;
    if (req.body.status === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancellationReason = req.body.reason;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason;
    await booking.save();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};