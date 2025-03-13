import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./lend.html";

import "../../components/header/header.js";
import "../../components/footer/footer.js";
import { Terms } from "/imports/api/terms/terms";

Template.App_lend.onCreated(function () {});

Template.App_lend.onRendered(function () {});

Template.App_lend.onDestroyed(function () {});

Template.App_lend.helpers({
  find_lend_terms() {
    let terms = Terms.find(
      { status: "pending" },
      { sort: { createdAt: -1 } }
    ).fetch();
    Session.set("lend_terms", terms);
  },
  lend_terms() {
    return Session.get("lend_terms");
  },
});

Template.App_lend.events({
  "click .terms"(event) {
    event.preventDefault();
    const contract = event.currentTarget.getAttribute("data-contract");
    const token = event.currentTarget.getAttribute("data-token");
    const term = event.currentTarget.getAttribute("data-term");

    if (contract && token && term) {
      FlowRouter.go(`/terms/${contract}/${token}/${term}`);
    }
  },
});
