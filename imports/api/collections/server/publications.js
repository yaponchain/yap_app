import { Meteor } from 'meteor/meteor';
import { Collections } from '../collections.js';

Meteor.publish('collections.top', function () {
  const collections = Collections.find({}, {limit: 4});
  
  return collections;
});