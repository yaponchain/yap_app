import { Meteor } from "meteor/meteor";
import { Terms } from "./terms.js";

Meteor.methods({
  async "terms.create"(wallet, terms, project, proposal) {
    if (!wallet || !terms || !project) {
      throw new Meteor.Error(
        "terms-problem",
        "Data required to create the term not provided."
      );
    }

    const term = await Terms.insertAsync({
      wallet: wallet,
      term: terms,
      project: project,
      proposal: proposal,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("Term ====>", term);

    return { success: true, term: term };
  },
});
