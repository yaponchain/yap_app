import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/borrow/borrow.js';
import '../../ui/pages/borrow/list/list.js';
import '../../ui/pages/terms/terms.js';

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

FlowRouter.route('*', {
  action() {
    FlowRouter.go('/');
  },
});
