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
    Meteor.subscribe("terms.newest");
    Meteor.subscribe("terms.latest");
    Meteor.subscribe("collections.top");
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

    Meteor.setTimeout(() => {
        // @ts-ignore
    $('.slick-activation-03').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 2,
        dots: false,
        arrows: true,
        cssEase: 'linear',
        adaptiveHeight: true,
        prevArrow: '<button class="slide-arrow prev-arrow"><i class="feather-arrow-left"></i></button>',
        nextArrow: '<button class="slide-arrow next-arrow"><i class="feather-arrow-right"></i></button>',
        responsive: [{
                breakpoint: 1399,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                }
            }
        ]
    });
    }, 1000);
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
        //let terms = find_terms({status:"active"}, {sort: {createdAt: -1}, limit: 10});
        let terms = find_terms({},{});
        Session.set("latest_terms", terms);
    },
    latest_terms() {
        const terms = Session.get("latest_terms");
        return terms?.length >= 5 ? terms : [];
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