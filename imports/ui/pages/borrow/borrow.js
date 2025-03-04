import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Session } from "meteor/session";

import "./borrow.html";

import "../../components/header/header.js";
import "../../components/footer/footer.js";

Template.App_borrow.onCreated(function () {
  const list = Session.get("list");
  const wallet = Session.get("wallet");
    console.log("List ====>", list);
    console.log("Wallet ====>", wallet);
  if (!list && wallet) {
    Meteor.call(
      "monad.nfts",
      wallet,
      (error, result) => {
        if (error) {
          console.log("Error ====>", error);
        } else {
          console.log("Result ====>", result);
          Session.set("list", result);
        }
      }
    );
  }
});

Template.App_borrow.onRendered(function () {});

Template.App_borrow.onDestroyed(function () {});

Template.App_borrow.helpers({
  list() {
    return Session.get("list") || [];
  },
  validateImage(image) {
    const img = image?.includes('api.nad.domains');

    return img ? false : true;
  },
});

Template.App_borrow.events({
  "click .list": function (event) {
    event.preventDefault();
    FlowRouter.go("/borrow/list");
  },
});
