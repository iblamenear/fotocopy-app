import mongoose, { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema({
  id: String,
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
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'courier'],
    default: 'user',
  },
  phone: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  cart: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent Mongoose OverwriteModelError by checking if the model exists
// In development, we want to overwrite it to pick up schema changes
if (process.env.NODE_ENV === 'development' && models.User) {
  delete models.User;
}

const User = models.User || model('User', UserSchema);

export default User;
// Force schema refresh
