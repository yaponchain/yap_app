import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Session } from "meteor/session";
import moment from "moment";

import "./borrow.html";

import "../../components/header/header.js";
import "../../components/footer/footer.js";
import { Terms } from "/imports/api/terms/terms";

Template.App_borrow.onCreated(function () {
  const list = sessionStorage.getItem("list") ? JSON.parse(sessionStorage.getItem("list")) : null;
  const wallet = sessionStorage.getItem("wallet");
  const time = 5 * 60 * 1000;
  
  if (((!list || list.wallet != wallet) && wallet) || ((Date.now() - parseInt(list?.time, 10) > time) && wallet)) {
    console.log("List ====> LIST UPDATED");
    Meteor.call(
      "monad.nfts",
      wallet,
      (error, result) => {
        if (error) {
          console.log("Error ====>", error);
        } else if(result?.length) {
          Session.set("list", {wallet:wallet, items:result, time:Date.now()});
          sessionStorage.setItem("list", JSON.stringify({wallet:wallet, items:result, time:Date.now()}));
        }else {
          console.log("Result ====>", result);
        }
      }
    );
  }else{
    Session.set("list", list);
  }

  Meteor.subscribe("terms.all", wallet);
});

Template.App_borrow.onRendered(function () {
  const terms = Terms.find().fetch();
  Session.set("terms", terms);
});

Template.App_borrow.onDestroyed(function () {});

Template.App_borrow.helpers({
  list() {
    const list = Session.get("list") ? Session.get("list") : JSON.parse(sessionStorage.getItem("list"));
    return list || [];
  },
  validateImage(image) {
    const img = image?.includes('api.nad.domains');

    return img ? false : true;
  },
  terms() {
    const terms = Session.get("terms");
    return terms;
  },
  normalize_date(date) {
    return moment(date).format("DD/MM/YYYY HH:mm");
  },
});

Template.App_borrow.events({
  "click .list": function (event) {
    event.preventDefault();
    const contract = event.currentTarget.getAttribute("data-contract");
    const token = event.currentTarget.getAttribute("data-token");
    
    if(contract && token) {
      FlowRouter.go(`/borrow/${contract}/${token}`);
    }
  },
});
