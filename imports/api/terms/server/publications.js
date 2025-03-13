import { Meteor } from 'meteor/meteor';
import { Terms } from '../terms.js';

Meteor.publish('terms.owner', function (wallet) {
  const terms = Terms.find({owner: wallet});
  
  return terms;
});

Meteor.publish('terms.newest', function () {
  const terms = Terms.find({status:"pending"}, {sort: {createdAt: -1}, limit: 5});
  
  return terms;
});

Meteor.publish('terms.latest', function () {
  const terms = Terms.find({status:"loaned"}, {sort: {createdAt: -1}, limit: 10});
  
  return terms;
});

Meteor.publish('terms.lends', function () {
  const terms = Terms.find({status:"pending"}, {sort: {createdAt: -1}});
  
  return terms;
});

Meteor.publish('terms.loans', function () {
  const terms = Terms.find({status:"loaned"}, {sort: {createdAt: -1}});
  
  return terms;
});