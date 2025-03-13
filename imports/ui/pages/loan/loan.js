import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Terms } from "/imports/api/terms/terms";

import "./loan.html";

import "../../components/header/header.js";
import "../../components/footer/footer.js";

Template.App_loan.onCreated(function () {});

Template.App_loan.onRendered(function () {});

Template.App_loan.onDestroyed(function () {});

Template.App_loan.helpers({
  find_loan_terms() {
    let terms = Terms.find(
      { status: "loaned" },
      { sort: { createdAt: -1 } }
    ).fetch();
    Session.set("loan_terms", terms);
  },
  loan_terms() {
    return Session.get("loan_terms");
  },
});

Template.App_loan.events({
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
