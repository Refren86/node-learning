const { Schema, model, Types } = require('mongoose');

const security = require('../helpers/security');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String
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
    versionKey: false, // removes __v key
    timestamps: true,
    toJSON: { virtuals: true }, // enables virtual fields
    toObject: { virtuals: true },
  }
);

// virtual fields (works on every find method)
userSchema.virtual('fullName').get(function() {
  return `${this.name} Doe`
})

// for schema
userSchema.statics = {
  testStatic() {
    console.log('static');
  },

  async createWithHashPassword(userObject = {}) {
    const hashedPassword = await security.hashPassword(userObject.password);
    return this.create({ ...userObject, password: hashedPassword });
  }
};

// for single record
userSchema.methods = {
  testMethod() {
    console.log('method');
  },

  async comparePasswords(purePassword) {
    await security.comparePasswords(this.password, purePassword)
  }
};

module.exports = model('User', userSchema);
