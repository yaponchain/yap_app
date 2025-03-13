import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Session } from "meteor/session";
import moment from "moment";

import { Terms } from "/imports/api/terms/terms";

import "./terms.html";

import "../../components/header/header.js";
import "../../components/footer/footer.js";
import {
  createCounterOffer,
  acceptOriginalProposal,
  rejectCounterOffer,
  acceptCounterOffer,
  repayLoan,
  simulateInterest,
  calculateInterest,
} from "../../components/contracts/contracts.js";

Template.App_terms.onCreated(function () {});

Template.App_terms.onRendered(function () {
  $("html, body").animate({ scrollTop: 0 }, "fast");
  // @ts-ignore
  $("#principal").mask("###,###,###,##0.00", { reverse: true });
  // @ts-ignore
  $("#repay").mask("###,###,###,##0.00", { reverse: true });
  // @ts-ignore
  $("#days").mask("000");
  // @ts-ignore
  $("#apr").mask("##0.00", { reverse: true });
});

Template.App_terms.onDestroyed(function () {
  Session.set("detail", null);
});

Template.App_terms.helpers({
  detail() {
    // @ts-ignore
    const detail = Terms.findOne({ _id: FlowRouter.getParam("id") });
    Session.set("detail", detail);
    return detail;
  },
  proposals() {
    const detail = Session.get("detail");

    if (detail?.proposals.length > 1) {
      const proposals = detail.proposals.filter(
        (proposal) =>
          proposal.wallet !== detail.owner && proposal.status === "pending"
      );
      return proposals;
    } else {
      return [];
    }
  },
  validateLoading() {
    return Session.get("loading");
  },
  validateWallet() {
    const detail = Session.get("detail");
    const wallet = sessionStorage.getItem("wallet");

    if (detail?.owner === wallet || !wallet) {
      return true;
    }
  },
  validateCounterOffer(proposal) {
    const wallet = sessionStorage.getItem("wallet");

    if (proposal.status == "pending" && proposal.wallet != wallet) {
      return true;
    }
  },
  validateLoan() {
    const detail = Session.get("detail");

    if (detail?.status == "loaned") {
      const proposal = detail.proposals.find(
        (proposal) => proposal.status == "loaned"
      );

      return moment(proposal?.updatedAt)
        .add(proposal?.term?.days, "days")
        .format("DD/MM/YYYY HH:mm");
    } else {
      return false;
    }
  },
  normalize_date(date) {
    return moment(date).format("DD/MM/YYYY HH:mm");
  },
});

Template.App_terms.events({
  "click #accept"(event) {
    event.preventDefault();
    // @ts-ignore
    const termId = FlowRouter.getParam("id");
    const proposalId = Session.get("detail")?.proposals[0]?.id;
    // @ts-ignore
    const principal = Session.get("detail")?.proposals[0]?.term?.principal;
    const wallet = sessionStorage.getItem("wallet");

    if (!termId || !proposalId || !principal || !wallet) return;

    Session.set("loading", true);
    acceptOriginalProposal(proposalId, principal)
      .then((result) => {
        if (result.success) {
          Meteor.call(
            "terms.loan",
            termId,
            wallet,
            proposalId,
            result?.loanId,
            (error, result) => {
              if (error) {
                Session.set("loading", null);
                console.log("Error ====>", error);
              } else {
                Session.set("loading", null);
                console.log("Result ====>", result);
              }
            }
          );
        } else if (result.error) {
          Session.set("loading", null);
          if (result.detail.code == "ACTION_REJECTED") {
            console.log("User rejected the create");
          } else {
            console.log("Error creating loan proposal");
          }
        }
      })
      .catch((error) => {
        console.error("Error creating loan proposal:", error);
      });
  },
  "click #reject"(event) {
    event.preventDefault();
    const proposalId = event.currentTarget.getAttribute("data-id");
    const wallet = event.currentTarget.getAttribute("data-wallet");
    // @ts-ignore
    const termId = FlowRouter.getParam("id");

    if (!proposalId || !wallet || !termId) return;

    Session.set("loading", true);
    rejectCounterOffer(proposalId)
      .then((result) => {
        if (result.success) {
          Meteor.call(
            "terms.reject",
            termId,
            wallet,
            proposalId,
            (error, result) => {
              if (error) {
                Session.set("loading", null);
                console.log("Error ====>", error);
              } else {
                Session.set("loading", null);
                console.log("Result ====>", result);
              }
            }
          );
        } else if (result.error) {
          Session.set("loading", null);
          if (result.detail.code == "ACTION_REJECTED") {
            console.log("User rejected the create");
          } else {
            console.log("Error creating loan proposal");
          }
        }
      })
      .catch((error) => {
        console.error("Error creating loan proposal:", error);
      });
  },
  "click #counter"(event) {
    event.preventDefault();
    const proposalId = event.currentTarget.getAttribute("data-id");
    const wallet = event.currentTarget.getAttribute("data-wallet");
    // @ts-ignore
    const termId = FlowRouter.getParam("id");

    if (!proposalId || !wallet || !termId) return;

    Session.set("loading", true);
    acceptCounterOffer(proposalId)
      .then((result) => {
        if (result.success) {
          Meteor.call(
            "terms.loan",
            termId,
            wallet,
            proposalId,
            result?.loanId,
            (error, result) => {
              if (error) {
                Session.set("loading", null);
                console.log("Error ====>", error);
              } else {
                Session.set("loading", null);
                console.log("Result ====>", result);
              }
            }
          );
        } else if (result.error) {
          Session.set("loading", null);
          if (result.detail.code == "ACTION_REJECTED") {
            console.log("User rejected the create");
          } else {
            console.log("Error creating loan proposal");
          }
        }
      })
      .catch((error) => {
        console.error("Error creating loan proposal:", error);
      });
  },
  "click #create"(event) {
    event.preventDefault();
    // @ts-ignore
    const termId = FlowRouter.getParam("id");
    const proposalId = Session.get("detail")?.proposals[0]?.id;
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

    if (!termId || !proposalId || !principal || !repay || !days || !token)
      return;

    Session.set("loading", true);
    createCounterOffer(proposalId, principal, days, apr, 1)
      .then((result) => {
        if (result.success) {
          Meteor.call(
            "terms.proposal",
            termId,
            wallet,
            { principal, token, apr, repay, days },
            result?.counterProposalId,
            (error, result) => {
              if (error) {
                Session.set("loading", null);
                console.log("Error ====>", error);
              } else {
                Session.set("loading", null);
                console.log("Result ====>", result);
                $("#principal").val("");
                $("#repay").val("");
                $("#days").val("");
                $("#apr").val("");
              }
            }
          );
        } else if (result.error) {
          Session.set("loading", null);
          if (result.detail.code == "ACTION_REJECTED") {
            console.log("User rejected the create");
          } else {
            console.log("Error creating loan proposal");
          }
        }
      })
      .catch((error) => {
        console.error("Error creating loan proposal:", error);
      });
  },
  "click #repay"(event) {
    event.preventDefault();
    // @ts-ignore
    const termId = FlowRouter.getParam("id");
    const proposalId = Session.get("detail")?.proposals?.filter(
      (proposal) => proposal.status == "loaned"
    )[0]?.id;
    const loanId = Session.get("detail")?.loan;
    // @ts-ignore
    const repay = Session.get("detail")?.proposals?.filter(
      (proposal) => proposal.status == "loaned"
    )[0]?.term?.repay;
    const wallet = sessionStorage.getItem("wallet");

    if (!termId || !proposalId || !loanId || !repay || !wallet) return;

    Session.set("loading", true);
    calculateInterest(loanId).then((calcResult) => {
      if(calcResult.success){
        repayLoan(loanId, calcResult.interest)
        .then((result) => {
          if (result.success) {
            Meteor.call(
              "terms.repay",
              termId,
              wallet,
              proposalId,
              (error, result) => {
                if (error) {
                  Session.set("loading", null);
                  console.log("Error ====>", error);
                } else {
                  Session.set("loading", null);
                  console.log("Result ====>", result);
                }
              }
            );
          } else if (result.error) {
            Session.set("loading", null);
            if (result.detail.code == "ACTION_REJECTED") {
              console.log("User rejected the create");
            } else {
              console.log("Error creating loan proposal");
            }
          }
        })
        .catch((error) => {
          Session.set("loading", null);
          console.error("Error creating loan proposal:", error);
        });
      }else{
        Session.set("loading", null);
        console.error("Error calculating interest:", calcResult);
      }
    }).catch((error) => {
      Session.set("loading", null);
      console.error("Error calculating interest:", error);
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

    simulateInterest(principal, apr, days).then((repay) => {
      if (repay.success) {
        $("#repay").val(repay.interest.toFixed(4));
      }
    });
  },
  "focusout #apr"(event) {
    event.preventDefault();
    // @ts-ignore
    const principal = parseFloat($("#principal").val());
    const apr = parseInt(event.target.value);
    // @ts-ignore
    const days = parseInt($("#days").val());

    if (!principal || !apr || !days) return;

    simulateInterest(principal, apr, days).then((repay) => {
      if (repay.success) {
        $("#repay").val(repay.interest.toFixed(4));
      }
    });
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

    if (!principal || !apr || !days) return;

    simulateInterest(principal, apr, days).then((repay) => {
      if (repay.success) {
        $("#repay").val(repay.interest.toFixed(4));
      }
    });
  },
});
