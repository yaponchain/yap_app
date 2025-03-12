import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./list.html";

import "../../../components/header/header.js";
import "../../../components/footer/footer.js";
import { approveNFTForProtocol, createLoanProposal } from "../../../components/contracts/contracts.js";

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
  Session.set("approve", null);
});

Template.App_borrow_list.helpers({
  item() {
    const list = Session.get("list")?.items;
    const project = list?.find(
      // @ts-ignore
      (item) => item?.contractAddress === FlowRouter.getParam("contract")
    );
    const token = project?.items?.find(
      // @ts-ignore
      (item) => item?.tokenId === FlowRouter.getParam("token")
    );
    const item = {
      contractAddress: project?.contractAddress,
      verified: project?.verified,
      name: project?.name,
      image: project?.image,
      ercStandard: project?.ercStandard,
      token: { ...token },
    };

    Session.set("item", item);

    return item;
  },
  validateImage(image) {
    const img = image?.includes("api.nad.domains");

    return img ? false : true;
  },
  valdiateApprove() {
    return Session.get("approve");
  },
  validateLoading() {
    return Session.get("loading");
  }
});

Template.App_borrow_list.events({
  "click #approve"(event) {
    event.preventDefault();
    const item = Session.get("item");
    const wallet = sessionStorage.getItem("wallet");

    if (!item || !wallet) return;
    Session.set("loading", true);
    approveNFTForProtocol(item.contractAddress, item.token.tokenId).then(
      (result) => {
        if (result?.success) {
          Session.set("approve", true);
          Session.set("loading", null);
        }else if(result?.error){
          Session.set("loading", null);
          if(result.detail.code == 'ACTION_REJECTED'){
            console.log("User rejected the approve");
          }else{
            console.log("Error approving NFT");
          }
        }else{
          Session.set("loading", null);
          console.log("Error approving NFT");
        }
      }
    );
  },
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
    const token = $("span.current").text();
    const wallet = sessionStorage.getItem("wallet");

    if (!item || !principal || !repay || !days || !token) return;

    Session.set("loading", true);
    createLoanProposal(
      [item.contractAddress],
      [item.token.tokenId],
      principal,
      days,
      apr
    ).then((result) => {
      if(result.success){
        Meteor.call(
          "terms.create",
          wallet,
          { principal, token, apr, repay, days},
          item,
          result?.proposalId,
          (error, result) => {
            if (error) {
              Session.set("loading", null);
              console.log("Error ====>", error);
            } else {
              Session.set("loading", null);
              console.log("Result ====>", result);
              Session.set("list", null);
              sessionStorage.removeItem("list");
              FlowRouter.go("/borrow");
            }
          }
        );
      }else if(result.error){
        Session.set("loading", null);
        if(result.detail.code == 'ACTION_REJECTED'){
          console.log("User rejected the create");
        }else{
          console.log("Error creating loan proposal");
        }
      }
    }).catch((error) => {
      console.error("Error creating loan proposal:", error);
    });
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
    document.getElementById("principal").focus();
  },
  "focusout #days"(event) {
    event.preventDefault();
    // @ts-ignore
    const principal = parseFloat($("#principal").val());
    // @ts-ignore
    const repay = parseFloat($("#repay").val());
    // @ts-ignore
    const apr = parseInt($("#apr").val());
    const days = parseInt(event.target.value);

    if (!principal || (!apr && !repay) || !days) return;

    if(principal && apr && days){
      const repay = principal + principal * (apr / 100) * (days / 365);
      $("#repay").val(repay.toFixed(2));
    }

    if(principal && repay && days){
      const apr = (repay - principal) / (principal * (days / 365)) * 100;
      $("#apr").val(apr.toFixed(2));
    }
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
