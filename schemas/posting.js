const mongoose = require('mongoose');

const { Schema } = mongoose;
const postingSchema = new Schema({
  accountEmail: {
    type: String,
  },
  accountName: {
    type: String,
  },
  accountGrade: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  pastPrice: {
    type: Number,
  },
  predictPrice: {
    type: Number,
  },
  buyState: {
    type: Number,
  },
  sellState: {
    type: Number,
  },
  middleState: {
    type: Number,
  },
  plusHit: {
    type: String,
  },
  plusMiss: {
    type: String,
  },
  minusHit: {
    type: String,
  },
  minusMiss: {
    type: String,
  },
  standardUnit: {
    type: String,
  },
  differenceRate: {
    type: Number,
  },
  pointForAdd: {
    type: Number,
  },

  content: {
    type: String,
    // required: true,
  },
  predictDay: String,
  predictCompany: String,
  warrantLink: String,
  warrantImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('posting', postingSchema);