import { Meteor } from "meteor/meteor";
import { Terms } from "./terms.js";
import moment from "moment";

Meteor.methods({
  async "terms.create"(wallet, terms, project, proposal) {
    if (!wallet || !terms || !project) {
      throw new Meteor.Error(
        "terms-problem",
        "Data required to create the term not provided."
      );
    }

    const term = await Terms.insertAsync({
      owner: wallet,
      project: project,
      proposals: [
        {
          id: proposal,
          wallet: wallet,
          term: terms,
          status: "pending",
          createdAt: new Date(),
        },
      ],
      status: "pending",
      createdAt: new Date(),
    });

    console.log("Term ====>", term);

    return { success: true, term: term };
  },
  async "terms.proposal"(id, wallet, terms, proposal) {
    if (!id || !wallet || !terms || !proposal) {
      throw new Meteor.Error(
        "proposal-problem",
        "Data required to create the proposal not provided."
      );
    }

    const term = await Terms.updateAsync(id, {
      $push: {
        proposals: {
          wallet: wallet,
          term: terms,
          id: proposal,
          status: "pending",
          expireAt: moment().add(1, "days").toDate(),
          createdAt: new Date(),
        },
      },
    });

    console.log("Term ====>", term);

    return { success: true, term: term };
  },
  async "terms.loan"(id, lender, proposal, loan) {
    if (!id || !lender || !proposal || !loan) {
      throw new Meteor.Error(
        "loan-problem",
        "Data required to create the proposal not provided."
      );
    }

    console.log("Loan create data ====>", id, lender, proposal, loan);

    const term = await Terms.updateAsync(
      {
        _id: id,
        "proposals.id": proposal,
      },
      {
        $set: {
          "proposals.$.status": "loaned",
          "proposals.$.updatedAt": new Date(),
          loan: loan,
          lender: lender,
          status: "loaned",
          updatedAt: new Date(),
        },
      }
    );

    console.log("Loan create updated ====>", term);

    return { success: true, term: term };
  },
  async "terms.reject"(id, wallet, proposal) {
    if (!id || !wallet || !proposal) {
      throw new Meteor.Error(
        "reject-problem",
        "Data required to create the proposal not provided."
      );
    }

    console.log("Proposal reject data ====>", id, wallet, proposal);

    const term = await Terms.updateAsync(
      {
        _id: id,
        "proposals.id": proposal,
      },
      {
        $set: {
          "proposals.$.status": "rejected",
          "proposals.$.updatedAt": new Date(),
          updatedAt: new Date(),
        },
      }
    );

    console.log("Term reject updated ====>", term);

    return { success: true, term: term };
  },
  async "terms.repay"(id, wallet, proposal) {
    if (!id || !wallet || !proposal) {
      throw new Meteor.Error(
        "repay-problem",
        "Data required to create the proposal not provided."
      );
    }

    console.log("Proposal repay data ====>", id, wallet, proposal);

    const term = await Terms.updateAsync(
      {
        _id: id,
        "proposals.id": proposal,
      },
      {
        $set: {
          "proposals.$.status": "repaid",
          "proposals.$.updatedAt": new Date(),
          status: "repaid",
          updatedAt: new Date(),
        },
      }
    );

    console.log("Term repay updated ====>", term);

    return { success: true, term: term };
  },
});
