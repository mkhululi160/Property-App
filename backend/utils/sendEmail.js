import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent: ${info.messageId}`);
  return info;
};

export const sendWelcomeEmail = async (user) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to PropertyApp!</h2>
      <p>Hello ${user.name},</p>
      <p>Thank you for registering with PropertyApp. We're excited to help you find your dream property!</p>
      <a href="${process.env.FRONTEND_URL}/properties"
         style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Browse Properties
      </a>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Welcome to PropertyApp',
    message,
  });
};

export const sendBookingConfirmation = async (booking, property, user) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Booking Confirmed!</h2>
      <p>Hello ${user.name},</p>
      <p>Your viewing for <strong>${property.title}</strong> has been scheduled.</p>
      <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${booking.timeSlot}</p>
      <a href="${process.env.FRONTEND_URL}/my-bookings"
         style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View My Bookings
      </a>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Booking Confirmed - PropertyApp',
    message,
  });
};

export const sendPaymentConfirmation = async (payment, property, user) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Payment Successful!</h2>
      <p>Hello ${user.name},</p>
      <p>Your payment of $${payment.amount} for ${property.title} has been processed.</p>
      <p><strong>Payment ID:</strong> ${payment._id}</p>
      <p><strong>Date:</strong> ${new Date(payment.paidAt).toLocaleDateString()}</p>
      <a href="${payment.receiptUrl}" target="_blank">Download Receipt</a>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Payment Confirmation - PropertyApp',
    message,
  });
};

export default sendEmail;