import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: false, // Optional because guest checkout might be allowed in future or for legacy orders
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [{
    fileName: String,
    fileSize: String,
    pageCount: Number,
    serviceType: String,
    settings: {
      color: String,
      paperSize: String,
      copies: Number,
      binding: String,
    },
    price: Number,
  }],
  delivery: {
    method: String,
    price: Number,
  },
  payment: {
    method: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired'],
      default: 'pending',
    },
    transactionId: String,
    paymentType: String,
    transactionTime: Date,
    paymentDetails: {
      bank: String,
      vaNumber: String,
      billKey: String,
      billerCode: String,
      issuer: String,
      acquirer: String,
    },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (process.env.NODE_ENV === 'development' && models.Order) {
  delete models.Order;
}

const Order = models.Order || model('Order', OrderSchema);

export default Order;
