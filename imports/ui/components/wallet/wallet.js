import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { detectWallets, connectWallet, disconnectWallet } from "./wallet_connector.js";

import "./wallet.html";

  Template.wallet.helpers({
    connectedAddress() {
      const address = Session.get("wallet");

      return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
    },
  });
  
  Template.wallet.events({
    "click #connectbtn"(event) {
      event.preventDefault();
      $('#connectWalletModal').modal('show');
    },
    "click #disconnectbtn"(event) {
      event.preventDefault();
      disconnectWallet();
    },
  });