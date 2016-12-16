'use strict';

// modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  postedOn: Date,
  rating: Number,
  Review: String
});

var userSchema = new Schema({
  fullName: String,
  emailAddress: String,
  hashedPassword: String
});

var courseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
    {
      stepNumber: Number,
      title: String,
      description: String
    }
  ],
  reviews: [
    { type: Schema.Types.ObjectId, ref: 'Review' }
  ]
});

var Review = mongoose.model('Review', reviewSchema);
var User = mongoose.model('User', userSchema);
var Course = mongoose.model('Course', courseSchema);

module.exports.Review = Review;
module.exports.User = User;
module.exports.Course = Course;
