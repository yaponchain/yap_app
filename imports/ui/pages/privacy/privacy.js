import { Template } from "meteor/templating";

import "./privacy.html";

import "../../components/header/header.js";
import "../../components/footer/footer.js";

Template.App_privacy.onCreated(function () {});

Template.App_privacy.onRendered(function () {
    $("html, body").animate({ scrollTop: 0 }, "fast");
});

Template.App_privacy.onDestroyed(function () {});

Template.App_privacy.helpers({});

Template.App_privacy.events({});
