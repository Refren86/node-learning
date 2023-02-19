const { model, Schema, Types } = require('mongoose');

// "_" in beginning means it's reference field
const authSchema = new Schema({
  _userId: {
    type: Types.ObjectId,
    ref: 'User'
  },
  accessToken: String,
  refreshToken: String,
}, {
  timestamps: true
})

module.exports = model('auth', authSchema)