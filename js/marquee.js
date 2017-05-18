/**

 * ============================================== Marquee Manager =============================================== *

 * Author: Conrad Feyt
 * Email: conrad.feyt@gmail.com
 * Version: 1.5
 * Tested only on modern browsers


 // Structure //

 *********************************** - marque-container - *************************************
 *                                                                                            *
 *   ******************************* ******************************************************   *
 *   *                             * *                                                    *   *
 *   * - marquee-content-sibling - * *                 - marquee-content -                *   *
 *   *                             * *                                                    *   *
 *   ******************************* ******************************************************   *
 *                                                                                            *
 **********************************************************************************************

 // Usage //

 Only need to call the createMarquee() function,
 if desired, pass through the following paramaters:

 $1 duration:                   controls the speed at which the marquee moves

 $2 padding:                    right margin between consecutive marquees.

 $3 marquee_class:             the actual div or span that will be used to create the marquee -
 multiple marquee items may be created using this item's content.
 This item will be removed from the dom

 $4 container_class:           the container div in which the marquee content will animate.

 $5 marquee-content-sibling :   (optional argument) a sibling item to the marqueed item  that
 affects the end point position and available space inside the
 container.

 $6 hover:                     Boolean to indicate whether pause on hover should is required.

 Eg:
 createMarquee({
          duration: 20000,
          padding: 10,
          marquee_class: '.marquee',
          container_class: '.marq-contaniner',
          sibling_class: 'marq-sibling',
          hover: true
        });

 * ============================================================================================================== *

 **/


var marqueeSpawned = [];
var marqueeHovered = false;


if(document.hasFocus()) {
    var focused = true;
} else {
    var focused = false;
}



function marqueeObj (newElement) {
    this.el = newElement;
    this.counter = 0;
    this.getPosition = getCurrentPosition;
    this.name = "";
    this.timeLeft = 0;
    this.currentPos = 0;
    this.distanceLeft = 0;
    this.totalDistance = 0;
    this.contentWidth = 0;
    this.endPoint = 0;
    this.duration = 0;
    this.hovered = false;
    this.padding = 0;
}


function getCurrentPosition() {
    this.currentPos = parseInt($(this.name).css('left'));
    return this.currentPos;
}

function createMarquee(settings) {


    var defaults = {
        duration: 20000,
        padding: 10,
        marquee_class: '.marquee',
        container_class: '.container',

        sibling_class: 0,
        hover: true
    };

    var config = $.extend({}, defaults, settings);


    if($(config.marquee_class).width() == 0){
        console.error('FATAL: marquee css or children css not correct. Width is either set to 0 or the element is collapsing. Make sure overflow is set on the marquee, and the children are postitioned relatively');
        return;
    }

    if(typeof $(config.marquee_class) === 'undefined'){
        console.error('FATAL: marquee class not valid');
        return;
    }

    if(typeof $(config.container_class) === 'undefined'){
        console.error('FATAL: marquee container class not valid');
        return;
    }

    if(config.sibling_class != 0 && typeof $(config.sibling_class) === 'undefined'){
        console.error('FATAL: sibling class container class not valid');
        return;
    }


    var config = $.extend({}, defaults, settings);

    var marqueeContent =  $(config.marquee_class).html()
    var containerWidth = $(config.container_class).width();
    var contentWidth = $(config.marquee_class).width();

    if (config.sibling_class == 0) {
        var widthToIgnore = 0;
    } else {
        var widthToIgnore = $(config.sibling_class).width();
    }

    var spawnAmount = Math.ceil(containerWidth / contentWidth);
    //init vars from input


    $(config.marquee_class).remove();

    if(spawnAmount<=2){
        spawnAmount =3;
    } else {
        spawnAmount++
    }

    var totalContentWidth = (contentWidth + config.padding)*spawnAmount;

    var endPoint = -(totalContentWidth - containerWidth);

    var totalDistance =  containerWidth - endPoint;


    //initialise positions counters, content

    for (i = 0; i < spawnAmount; i++) {

        if(config.hover == true){


            var newElement = $('<div class="marquee-' + (i+1) + '">' + marqueeContent + '</div>')
                .mouseenter(function() {


                    if ((focused == true) && (marqueeHovered == false)){
                        marqueeHovered = true;

                        for (var key in marqueeSpawned){
                            marqueeSpawned[key].el.clearQueue().stop();
                            marqueeSpawned[key].hovered = true;
                        }


                    }

                })
                .mouseleave(function() {


                    if ((focused == true) && (marqueeHovered == true)){

                        for (var key in marqueeSpawned){
                            marqueeManager(marqueeSpawned[key]);
                        }

                        marqueeHovered = false;
                    }
                });

        } else {

            var newElement = $('<div class="marquee-' + (i+1) + '">' + marqueeContent + '</div>') ;

        }

        marqueeSpawned[i] = new marqueeObj(newElement);

        $(config.container_class).append(newElement);

        marqueeSpawned[i].currentPos = (widthToIgnore + (contentWidth*i))+(config.padding*i);  //initial positioning
        marqueeSpawned[i].name = '.marquee-'+(i+1);

        marqueeSpawned[i].totalDistance = totalDistance;
        marqueeSpawned[i].containerWidth = containerWidth;
        marqueeSpawned[i].contentWidth = contentWidth;
        marqueeSpawned[i].endPoint = endPoint;
        marqueeSpawned[i].duration = config.duration;
        marqueeSpawned[i].padding = config.padding;

        marqueeSpawned[i].el.css('left', marqueeSpawned[i].currentPos+config.padding +'px'); //setting left according to postition

        if (focused == true){
            marqueeManager(marqueeSpawned[i]);
        }

    }
}


//--------------------------------------------------------------------------------

var marqueed_el1 = document.getElementsByClassName("marquee-1");
var marqueed_el2 = document.getElementsByClassName("marquee-2");
var marqueed_el3 = document.getElementsByClassName("marquee-3");


console.log(marqueed_el1);

function marqueeManager(marqueed_el1) {

    if (marqueed_el1.hovered == false) {

        if (marqueed_el1.counter > 0) {  //this is not the first loop

            marqueed_el1.timeLeft = marqueed_el1.duration;
            marqueed_el1.el.css('left', marqueed_el1.containerWidth +'px'); //setting margin
            marqueed_el1.currentPos = marqueed_el1.containerWidth;
            marqueed_el1.distanceLeft = marqueed_el1.totalDistance - (marqueed_el1.containerWidth - marqueed_el1.getPosition());

        } else {    // this is the first loop

            marqueed_el1.timeLeft = (((marqueed_el1.totalDistance - (marqueed_el1.containerWidth - marqueed_el1.getPosition()))/ marqueed_el1.totalDistance)) * marqueed_el1.duration;
        }

    } else {
        marqueed_el1.hovered = false;
        marqueed_el1.currentPos = parseInt(marqueed_el1.el.css('left'));
        marqueed_el1.distanceLeft = marqueed_el1.totalDistance - (marqueed_el1.containerWidth - marqueed_el1.getPosition());
        marqueed_el1.timeLeft = (((marqueed_el1.totalDistance - (marqueed_el1.containerWidth - marqueed_el1.currentPos))/ marqueed_el1.totalDistance)) * marqueed_el1.duration;
    }

    marqueeAnim(marqueed_el1);
}

function marqueeManager(marqueed_el2) {

    if (marqueed_el2.hovered == false) {

        if (marqueed_el2.counter > 0) {  //this is not the first loop

            marqueed_el2.timeLeft = marqueed_el2.duration;
            marqueed_el2.el.css('left', marqueed_el2.containerWidth +'px'); //setting margin
            marqueed_el2.currentPos = marqueed_el2.containerWidth;
            marqueed_el2.distanceLeft = marqueed_el2.totalDistance - (marqueed_el2.containerWidth - marqueed_el2.getPosition());

        } else {    // this is the first loop

            marqueed_el2.timeLeft = (((marqueed_el2.totalDistance - (marqueed_el2.containerWidth - marqueed_el2.getPosition()))/ marqueed_el2.totalDistance)) * marqueed_el2.duration;
        }

    } else {
        marqueed_el2.hovered = false;
        marqueed_el2.currentPos = parseInt(marqueed_el2.el.css('left'));
        marqueed_el2.distanceLeft = marqueed_el2.totalDistance - (marqueed_el2.containerWidth - marqueed_el2.getPosition());
        marqueed_el2.timeLeft = (((marqueed_el2.totalDistance - (marqueed_el2.containerWidth - marqueed_el2.currentPos))/ marqueed_el2.totalDistance)) * marqueed_el2.duration;
    }

    marqueeAnim(marqueed_el2);
}

function marqueeManager(marqueed_el3) {

    if (marqueed_el3.hovered == false) {

        if (marqueed_el3.counter > 0) {  //this is not the first loop

            marqueed_el3.timeLeft = marqueed_el3.duration;
            marqueed_el3.el.css('left', marqueed_el3.containerWidth +'px'); //setting margin
            marqueed_el3.currentPos = marqueed_el3.containerWidth;
            marqueed_el3.distanceLeft = marqueed_el3.totalDistance - (marqueed_el3.containerWidth - marqueed_el3.getPosition());

        } else {    // this is the first loop

            marqueed_el3.timeLeft = (((marqueed_el3.totalDistance - (marqueed_el3.containerWidth - marqueed_el3.getPosition()))/ marqueed_el3.totalDistance)) * marqueed_el3.duration;
        }

    } else {
        marqueed_el3.hovered = false;
        marqueed_el3.currentPos = parseInt(marqueed_el3.el.css('left'));
        marqueed_el3.distanceLeft = marqueed_el3.totalDistance - (marqueed_el3.containerWidth - marqueed_el3.getPosition());
        marqueed_el3.timeLeft = (((marqueed_el3.totalDistance - (marqueed_el3.containerWidth - marqueed_el3.currentPos))/ marqueed_el3.totalDistance)) * marqueed_el3.duration;
    }

    marqueeAnim(marqueed_el3);
}



//----------------------------------------------------------------------------------

function marqueeAnim (marqueeObject){
    marqueeObject.counter++
    marqueeObject.el.clearQueue().animate({'left': marqueeObject.endPoint+'px'}, marqueeObject.timeLeft, 'linear', function(){marqueeManager(marqueeObject)});
}


window.onfocus = function(){
    focused = true;
    for (var key in marqueeSpawned){
        marqueeManager(marqueeSpawned[key]);
    }
};


window.onblur = function(){
    focused = false;
    for (var key in marqueeSpawned){
        marqueeSpawned[key].el.clearQueue().stop();
        marqueeSpawned[key].hovered = true;
    }
};


/**
 * Created by ccole on 5/15/2017.
 */
