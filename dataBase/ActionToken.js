const { model, Schema, Types } = require('mongoose');

// "_" in beginning means it's reference field
const actionTokenSchema = new Schema({
  _userId: {
    type: Types.ObjectId,
    ref: 'User'
  },
  token: String,
  tokenType: String,
}, {
  timestamps: true
})

module.exports = model('actionToken', actionTokenSchema);