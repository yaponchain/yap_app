import { Meteor } from 'meteor/meteor';
import { Terms } from '../terms.js';

Meteor.publish('terms.all', function (wallet) {
  const terms = Terms.find({wallet: wallet});
  
  return terms;
});