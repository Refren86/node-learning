const { model, Schema, Types } = require('mongoose');

// "_" in beginning means it's reference field
const oldPasswordSchema = new Schema(
  {
    _userId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    password: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('oldPassword', oldPasswordSchema);
