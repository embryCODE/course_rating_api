'use strict';

// modules
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// setup reviews
var reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: Date,
  rating: {
    type: Number,
    required: [true, 'A rating is required.'],
    min: [1, 'A minimum rating of "1" is required.'],
    max: [5, '"5" is the maximum rating.']
  },
  Review: String
});

reviewSchema.pre('save', function(next) {
  Math.round(this.rating);
  next();
});

// setup users
var userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true
  },
  emailAddress: {
    type: String,
    required: [true, 'An email address is required.'],
    unique: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
      },
      message: 'Email address must be in a valid format.'
    }
  },
  hashedPassword: String
});

// store user's password as a hash
userSchema.pre('save', function(next) {
  bcrypt.hash(this.hashedPassword, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    this.hashedPassword = hash;
  });
  next();
});

// setup courses
var courseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'A title is required.']
  },
  description: {
    type: String,
    required: [true, 'A description is required.']
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: {
    type: [{
      stepNumber: Number,
      title: {
        type: String,
        required: [true, 'Step must have a title.']
      },
      description: {
        type: String,
        required: [true, 'Step must have a description.']
      }
    }],
    required: [true, 'At least one step is required.']
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

// create virtual overallRating field in courses
courseSchema.virtual('overallRating').get(function() {
  var ratingsTotal = 0;
  var result = 0;
  if (this.reviews) {
    for (var i = 0; i < this.reviews.length; i++) {
      ratingsTotal += this.reviews[i].rating;
    }
    result = Math.round(ratingsTotal / this.reviews.length);
  }
  return result;
});

courseSchema.set('toJSON', {
  virtuals: true
});

var Review = mongoose.model('Review', reviewSchema);
var User = mongoose.model('User', userSchema);
var Course = mongoose.model('Course', courseSchema);

module.exports.Review = Review;
module.exports.User = User;
module.exports.Course = Course;
