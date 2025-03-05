import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { disconnectWallet } from "./wallet_connector.js";

import "./wallet.html";

Template.wallet.onCreated(function () {
  // @ts-ignore
  const ethProvider = window.ethereum || window.backpack || window.haha;
  ethProvider?.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      Session.set("wallet", accounts[0]);
      sessionStorage.setItem("wallet", accounts[0]);
      Session.set("list", null);
      sessionStorage.removeItem("list");
      window.location.reload();
    } else {
      sessionStorage.removeItem("wallet");
      Session.set("wallet", null);
      Session.set("provider", null);
    }
  });
  ethProvider?.on("chainChanged", () => window.location.reload());
});

Template.wallet.helpers({
  connectedAddress() {
    const address_session = sessionStorage.getItem("wallet");
    Session.set("wallet", address_session);
    const address = Session.get("wallet");

    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  },
});

Template.wallet.events({
  "click #connectbtn"(event) {
    event.preventDefault();
    // @ts-ignore
    $("#connectWalletModal").modal("show");
  },
  "click #disconnectbtn"(event) {
    event.preventDefault();
    disconnectWallet();
  },
});
