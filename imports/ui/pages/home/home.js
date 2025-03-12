// @ts-ignore
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import sal from 'sal.js';

import { Terms } from '/imports/api/terms/terms';
import { Collections } from '/imports/api/collections/collections';

import '../../components/header/header.js';
import '../../components/footer/footer.js';

import './home.html';

Template.App_home.onCreated(function() {
});

Template.App_home.onRendered(function() {
    // @ts-ignore
    sal({
        threshold: 0.1,
        once: true,
    });

    const tilt = document.querySelectorAll(".tilt");

    VanillaTilt.init(tilt, {
        reverse: true,
        max: 3,
        speed: 400,
        // glare: true,
        reset: true,
        perspective: 500,
        transition: true,
        "max-glare": 0.75,
        "glare-prerender": false,
        gyroscope: true,
        gyroscopeMinAngleX: -45,
        gyroscopeMaxAngleX: 45,
        gyroscopeMinAngleY: -45,
        gyroscopeMaxAngleY: 45
    });
});

Template.App_home.helpers({
    connectedAddress() {
        const address = Session.get("wallet");

        return address ? true : false;
    },
    find_newest_terms() {
        //let terms = find_terms({status:pending}, {sort: {createdAt: -1}, limit: 5});
        let terms = find_terms({},{});
        Session.set("newest_terms", terms);
    },
    newest_terms() {
        const terms = Session.get("newest_terms");
        return terms//?.length >= 5 ? terms : [];
    },
    find_latest_terms() {
        let terms = find_terms({status:"loaned"}, {sort: {createdAt: -1}, limit: 5});
        //let terms = find_terms({},{});
        Session.set("latest_terms", terms);
    },
    latest_terms() {
        const terms = Session.get("latest_terms");
        return terms//?.length >= 5 ? terms : [];
    },
    find_top_collections() {
        let collections = Collections.find({},{limit: 4}).fetch();
        Session.set("top_collections", collections);
    },
    top_collections() {
        const collections = Session.get("top_collections");
        return collections;
    },
});

Template.App_home.events({
    "click .connectbtn"(event) {
      event.preventDefault();
      // @ts-ignore
      $('#connectWalletModal').modal('show');
    },
    "click .terms"(event) {
        event.preventDefault();
        const contract = event.currentTarget.getAttribute("data-contract");
        const token = event.currentTarget.getAttribute("data-token");
        const term = event.currentTarget.getAttribute("data-term");

        if (contract && token && term) {
            FlowRouter.go(`/terms/${contract}/${token}/${term}`);
        }
    }
});

const find_terms = (query, options) => {
    return Terms.find(query, options).fetch();
}