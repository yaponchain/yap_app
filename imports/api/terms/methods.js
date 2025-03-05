import { Meteor } from "meteor/meteor";
import { Terms } from "./terms.js";

Meteor.methods({
  async "terms.create"(wallet, terms, project) {
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
      status: "pending",
      createdAt: new Date(),
    });

    console.log("Term ====>", term);

    return { success: true, term: term };
  },
});
