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
  async "terms.loan"(id, wallet, proposal, loan) {
    if (!id || !wallet || !proposal || !loan) {
      throw new Meteor.Error(
        "loan-problem",
        "Data required to create the proposal not provided."
      );
    }

    const term = await Terms.updateAsync(
      {
        _id: id,
        "proposals.wallet": wallet,
        "proposals.id": proposal,
      },
      {
        $set: {
          "proposals.$.status": "loaned",
          "proposals.$.updatedAt": new Date(),
          loan: loan,
          status: "loaned",
          updatedAt: new Date(),
        },
      }
    );

    /* const t = await Terms.findOneAsync({ _id: id });

    t?.proposals?.forEach(async (proposal, index) => {
      if (proposal.wallet !== wallet && proposal.id !== id) {
        const status = `proposals.${index}.status`;
        const updated = `proposals.${index}.updatedAt`;
        await Terms.updateAsync(
          { _id: id },
          { $set: { [status]: "canceled", [updated]: new Date() } }
        );
      }
    }); */

    console.log("Term updated ====>", term);

    return { success: true, term: term };
  },
  async "terms.reject"(id, wallet, proposal) {
    if (!id || !wallet || !proposal) {
      throw new Meteor.Error(
        "reject-problem",
        "Data required to create the proposal not provided."
      );
    }

    const term = await Terms.updateAsync(
      {
        _id: id,
        "proposals.wallet": wallet,
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

    console.log("Term updated ====>", term);

    return { success: true, term: term };
  },
  async "terms.repay"(id, wallet, proposal) {
    if (!id || !wallet || !proposal) {
      throw new Meteor.Error(
        "repay-problem",
        "Data required to create the proposal not provided."
      );
    }

    const term = await Terms.updateAsync(
      {
        _id: id,
        "proposals.wallet": wallet,
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

    console.log("Term updated ====>", term);

    return { success: true, term: term };
  },
});
