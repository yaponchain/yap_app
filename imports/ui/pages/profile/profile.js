import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Session } from "meteor/session";
import { disconnectWallet } from "../../components/wallet/wallet_connector.js";
import { Terms } from "/imports/api/terms/terms";

import "./profile.html";

Template.App_profile.onCreated(function () {
  const address = Session.get("wallet");

  if (!address) {
    window.location.href = "/";
  }
});

Template.App_profile.onRendered(function () {});

Template.App_profile.onDestroyed(function () {});

Template.App_profile.helpers({
  connectedAddress() {
    const address = Session.get("wallet");

    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  },
  find_lend_terms() {
    const wallet = Session.get("wallet");
    if (wallet) {
      let terms = Terms.find(
        { status: "loaned", lender: wallet },
        { sort: { createdAt: -1 } }
      ).fetch();
      Session.set("lended_terms", terms);
    }
  },
  lend_terms() {
    return Session.get("lended_terms");
  },
  find_loan_terms() {
    const wallet = Session.get("wallet");
    if (wallet) {
      let terms = Terms.find(
        { status: "loaned", owner: wallet },
        { sort: { createdAt: -1 } }
      ).fetch();
      Session.set("loaned_terms", terms);
    }
  },
  loan_terms() {
    return Session.get("loaned_terms");
  },
});

Template.App_profile.events({
  "click #disconnectbtn"(event) {
    event.preventDefault();
    disconnectWallet();
    window.location.href = "/";
  },
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
