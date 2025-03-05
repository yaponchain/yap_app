import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./list.html";

import "../../../components/header/header.js";
import "../../../components/footer/footer.js";

Template.App_borrow_list.onCreated(function () {});

Template.App_borrow_list.onRendered(function () {
  // @ts-ignore
  $("#principal").mask("###,###,###,##0.00", { reverse: true });
  // @ts-ignore
  $("#repay").mask("###,###,###,##0.00", { reverse: true });
  // @ts-ignore
  $("#days").mask("000");
  // @ts-ignore
  $("#apr").mask("##0.00", { reverse: true });
});

Template.App_borrow_list.onDestroyed(function () {
  Session.set("item", null);
});

Template.App_borrow_list.helpers({
  item() {
    const list = Session.get("list")?.items;
    const project = list.find(
      // @ts-ignore
      (item) => item.contractAddress === FlowRouter.getParam("contract")
    );
    const token = project?.items.find(
      // @ts-ignore
      (item) => item.tokenId === FlowRouter.getParam("token")
    );
    const item = {
      contractAddress: project.contractAddress,
      verified: project.verified,
      name: project.name,
      image: project.image,
      ercStandard: project.ercStandard,
      token: { ...token },
    };

    Session.set("item", item);

    return item;
  },
  validateImage(image) {
    const img = image?.includes("api.nad.domains");

    return img ? false : true;
  },
});

Template.App_borrow_list.events({
  "click #create"(event) {
    event.preventDefault();
    const item = Session.get("item");
    // @ts-ignore
    const principal = parseFloat($("#principal").val());
    // @ts-ignore
    const repay = parseFloat($("#repay").val());
    // @ts-ignore
    const days = parseInt($("#days").val());
    // @ts-ignore
    const apr = parseFloat($("#apr").val());
    const token = $("span.current").text()
    const wallet = sessionStorage.getItem("wallet");

    if (!item || !principal || !repay || !days || !token) return;

    Meteor.call(
      "terms.create",
      wallet,
      { principal, token, apr, repay, days },
      item,
      (error, result) => {
        if (error) {
          console.log("Error ====>", error);
        } else {
          console.log("Result ====>", result);
          FlowRouter.go("/borrow");
        }
      }
    );
  },
  "focusout #principal"(event) {
    event.preventDefault();
    const principal = parseFloat(event.target.value);
    // @ts-ignore
    const apr = parseInt($("#apr").val());
    // @ts-ignore
    const days = parseInt($("#days").val());

    if (!principal || !apr || !days) return;

    const repay = principal + principal * (apr / 100) * (days / 365);
    $("#repay").val(repay.toFixed(2));
  },
  "focusout #apr"(event) {
    event.preventDefault();
    // @ts-ignore
    const principal = parseFloat($("#principal").val());
    const apr = parseInt(event.target.value);
    // @ts-ignore
    const days = parseInt($("#days").val());

    if (!principal || !apr || !days) return;

    const repay = principal + principal * (apr / 100) * (days / 365);
    $("#repay").val(repay.toFixed(2));
  },
  "focusout #days"(event) {
    event.preventDefault();
    // @ts-ignore
    const principal = parseFloat($("#principal").val());
    // @ts-ignore
    const apr = parseInt($("#apr").val());
    const days = parseInt(event.target.value);

    if (!principal || !apr || !days) return;

    const repay = principal + principal * (apr / 100) * (days / 365);
    $("#repay").val(repay.toFixed(2));
  },
  "focusout #repay"(event) {
    event.preventDefault();
    const repay = parseFloat(event.target.value);
    // @ts-ignore
    const apr = parseInt($("#apr").val());
    // @ts-ignore
    const days = parseInt($("#days").val());

    if (!apr || !repay || !days) return;

    const principal = repay / (1 + (apr / 100) * (days / 365));
    $("#principal").val(principal.toFixed(2));
  },
});
