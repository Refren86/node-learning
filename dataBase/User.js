const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    cars: [
      {
        type: Types.ObjectId,
        ref: 'Car',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
