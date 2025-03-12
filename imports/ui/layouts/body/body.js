import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './body.html';


//CSS
import '../../templates/css/vendor/bootstrap.min.css';
import '../../templates/css/vendor/slick.css';
import '../../templates/css/vendor/slick-theme.css';
import '../../templates/css/vendor/nice-select.css';
import '../../templates/css/plugins/feature.css';
import '../../templates/css/plugins/jquery-ui.min.css';
import '../../templates/css/vendor/odometer.css';
import '../../templates/css/style.css';

//JS
import '../../templates/js/vendor/jquery.nice-select.min.js';
import '../../templates/js/vendor/jquery-ui.js';
import '../../templates/js/vendor/modernizer.min.js';
import '../../templates/js/vendor/feather.min.js';
import '../../templates/js/vendor/slick.min.js';
import '../../templates/js/vendor/bootstrap.min.js';
//import '../../templates/js/vendor/sal.min.js';
import '../../templates/js/vendor/particles.js';
import '../../templates/js/vendor/jquery.style.swicher.js';
import '../../templates/js/vendor/js.cookie.js';
import '../../templates/js/vendor/count-down.js';
//import '../../templates/js/vendor/isotop.js';
import '../../templates/js/vendor/imageloaded.js';
import '../../templates/js/vendor/backtoTop.js';
import '../../templates/js/vendor/odometer.js';
import '../../templates/js/vendor/jquery-appear.js';
import '../../templates/js/vendor/scrolltrigger.js';
import '../../templates/js/vendor/jquery.custom-file-input.js';
import '../../templates/js/vendor/savePopup.js';
import '../../templates/js/vendor/vanilla.tilt.js';
import '../../templates/js/main.js';

Template.App_body.onCreated(function() {
    $('body').addClass('template-color-1 with-particles');
    Meteor.subscribe("terms.newest");
    Meteor.subscribe("terms.latest");
    Meteor.subscribe("collections.top");
});

Template.App_body.onRendered(function() {
    
});