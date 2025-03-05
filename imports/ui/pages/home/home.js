// @ts-ignore
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './home.html';

import '../../components/header/header.js';
import '../../components/footer/footer.js';
import sal from 'sal.js';

Template.App_home.onCreated(function() {
});

Template.App_home.onRendered(function() {
    // @ts-ignore
    sal({
        threshold: 0.1,
        once: true,
    });
    // @ts-ignore
    $('.slick-activation-01').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        cssEase: 'linear',
        adaptiveHeight: true,
        prevArrow: '<button class="slide-arrow prev-arrow"><i class="feather-arrow-left"></i></button>',
        nextArrow: '<button class="slide-arrow next-arrow"><i class="feather-arrow-right"></i></button>',
        responsive: [{
                breakpoint: 1124,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 868,
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

    // @ts-ignore
    $('.slick-activation-02').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        cssEase: 'linear',
        adaptiveHeight: true,
        prevArrow: '<button class="slide-arrow prev-arrow"><i class="feather-arrow-left"></i></button>',
        nextArrow: '<button class="slide-arrow next-arrow"><i class="feather-arrow-right"></i></button>',
        responsive: [{
                breakpoint: 1124,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 868,
                settings: {
                    slidesToShow: 1,
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

    // @ts-ignore
    $('.slick-activation-04').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        cssEase: 'linear',
        adaptiveHeight: true,
    });

    // @ts-ignore
    $('.slick-activation-05').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 2,
        dots: true,
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

    // @ts-ignore
    $('.slick-activation-06').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        cssEase: 'linear',
        adaptiveHeight: true,
        prevArrow: '<button class="slide-arrow prev-arrow"><i class="feather-arrow-left"></i></button>',
        nextArrow: '<button class="slide-arrow next-arrow"><i class="feather-arrow-right"></i></button>',
        responsive: [{
                breakpoint: 1399,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

    // @ts-ignore
    $('.slick-activation-07').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 2,
        dots: true,
        arrows: false,
        cssEase: 'linear',
        adaptiveHeight: true,
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

    // @ts-ignore
    $('.slick-activation-08').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        dots: true,
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
                breakpoint: 993,
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

    // @ts-ignore
    $('.slick-activation-09').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        cssEase: 'linear',
        adaptiveHeight: true,
    });

    // @ts-ignore
    $('.slider-activation-banner-3').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        cssEase: 'linear',
        adaptiveHeight: true,
        // autoplay: true,
        autoplaySpeed: 2000,
            responsive: [{
            breakpoint: 1599,
            settings: {
                dots: true,
                arrows: false,
            }
        }
        ]
    });
    // @ts-ignore
    $('.slider-activation-banner-5').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        cssEase: 'linear',
        adaptiveHeight: true,
        // autoplay: true,
        autoplaySpeed: 2000,
            responsive: [{
            breakpoint: 1599,
            settings: {
                dots: true,
                arrows: false,
            }
        }
        ]
    });
    // @ts-ignore
    $('.slider-activation-banner-4').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        cssEase: 'linear',
        adaptiveHeight: true,
        // autoplay: true,
        autoplaySpeed: 2000,
    });

    // @ts-ignore
    $('.top-seller-slick-activation').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        dots: false,
        arrows: false,
        cssEase: 'linear',
        adaptiveHeight: true,
        autoplay: false,
        autoplaySpeed: 2000,
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
                breakpoint: 993,
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
});

Template.App_home.helpers({
    connectedAddress() {
        const address = Session.get("wallet");

        return address ? true : false;
    },
});

Template.App_home.events({
    "click .connectbtn"(event) {
      event.preventDefault();
      // @ts-ignore
      $('#connectWalletModal').modal('show');
    },
});