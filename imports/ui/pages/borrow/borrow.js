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
  const wallet = sessionStorage.getItem("wallet");

  Meteor.subscribe("terms.all", wallet);

  const list = sessionStorage.getItem("list")
    ? JSON.parse(sessionStorage.getItem("list"))
    : null;
  const time = 5 * 60 * 1000;

  if (
    ((!list || list.wallet != wallet) && wallet) ||
    (Date.now() - parseInt(list?.time, 10) > time && wallet)
  ) {
    console.log("List ====> LIST UPDATED");
    Meteor.call("monad.nfts", wallet, (error, result) => {
      if (error) {
        console.log("Error ====>", error);
      } else if (result?.length) {
        Session.set("list", {
          wallet: wallet,
          items: result,
          time: Date.now(),
        });
        sessionStorage.setItem(
          "list",
          JSON.stringify({
            wallet: wallet,
            items: result,
            time: Date.now(),
          })
        );
      } else {
        console.log("Result ====>", result);
      }
    });
  } else {
    Session.set("list", list);
  }
});

Template.App_borrow.onRendered(function () {

});

Template.App_borrow.onDestroyed(function () {});

Template.App_borrow.helpers({
  list() {
    const list = Session.get("list")
      ? Session.get("list")
      : JSON.parse(sessionStorage.getItem("list"));
    const terms = Session.get("terms");

    let filteredItems = { items: [] };
    if (list?.items?.length) {
      list.items.map((item) => {
        let project = {
          contractAddress: item.contractAddress,
          ercStandard: item.ercStandard,
          image: item.image,
          name: item.name,
          verified: item.verified,
          items: [],
        };

        item.items.map((token) => {
          let term = false;
          terms.map((t) => {
            if (
              t.project.token.contractAddress === token.contractAddress &&
              t.project.token.tokenId === token.tokenId &&
              t.status === "pending"
            ) {
              term = true;
            }
          });

          if (!term) {
            project.items.push(token);
          }
        });
        filteredItems.items.push(project);
      });
    }

    return filteredItems || [];
  },
  validateImage(image) {
    const img = image?.includes("api.nad.domains");

    return img ? false : true;
  },
  find_terms() {
    let terms = find_terms();
    Session.set("terms", terms);
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

    if (contract && token) {
      FlowRouter.go(`/borrow/${contract}/${token}`);
    }
  },
});

const find_terms = () => {
  return Terms.find().fetch();
};
