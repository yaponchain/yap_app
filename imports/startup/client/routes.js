import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/borrow/borrow.js';
import '../../ui/pages/borrow/list/list.js';
import '../../ui/pages/terms/terms.js';
import '../../ui/pages/lend/lend.js';
import '../../ui/pages/loan/loan.js';
import '../../ui/pages/profile/profile.js';
import '../../ui/pages/about/about.js';
import '../../ui/pages/privacy/privacy.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    this.render('App_body', 'App_home');
  },
});

FlowRouter.route('/borrow', {
  name: 'App.borrow',
  action() {
    this.render('App_body', 'App_borrow');
  },
});

FlowRouter.route('/borrow/:contract/:token', {
  name: 'App.borrow.list',
  action() {
    this.render('App_body', 'App_borrow_list');
  },
});

FlowRouter.route('/terms/:contract/:token/:id', {
  name: 'App.terms',
  action() {
    this.render('App_body', 'App_terms');
  },
});

FlowRouter.route('/lend', {
  name: 'App.lend',
  action() {
    this.render('App_body', 'App_lend');
  },
});

FlowRouter.route('/loan', {
  name: 'App.loan',
  action() {
    this.render('App_body', 'App_loan');
  },
});

FlowRouter.route('/profile', {
  name: 'App.profile',
  action() {
    this.render('App_body', 'App_profile');
  },
});

FlowRouter.route('/about', {
  name: 'App.about',
  action() {
    this.render('App_body', 'App_about');
  },
});

FlowRouter.route('/privacy', {
  name: 'App.about',
  action() {
    this.render('App_body', 'App_privacy');
  },
});

FlowRouter.route('*', {
  action() {
    FlowRouter.go('/');
  },
});
