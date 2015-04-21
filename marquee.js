 /**

* ============================================== Marquee Manager =============================================== *

* Author: Conrad Feyt
* Email: conrad.feyt@gmail.com
* Version: 1.1
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
  
Only need to call the createMarquee() function and pass through the following paramaters:


    $1 duration:                   controls the speed at which the marquee moves

    $2 padding:                    right margin between consecutive marquees. 

    $3 marquee-content:            the actual div or span that will be used to create the marquee - 
                                   multiple marquee items may be created using this item's content. 
                                   This item will be removed from the dom

    $4 marque-container:           the container div in which the marquee content will animate. 

    $5 marque-container:           Boolean to indicate whether pause on hover should is required. 

    $6 marquee-content-sibling :   (optional argument) a sibling item to the marqueed item  that 
                                   affects the end point position and available space inside the 
                                   container. 

  Eg:  createMarquee(30000, 15, $('.marquee-content'), $('.marquee-contaniner'), true, $('.marquee-content-sibling'));

* ============================================================================================================== *

**/


  var marqueeSpawned = [];
  
  function marqueeObj (newElement) {
    this.el = newElement;
    this.counter = 0;
    this.getPosition = getCurrentPosition;
    this.name = "";
    this.timeLeft = 0;
    this.currentPos = 0;
    this.distanceLeft = 0;
    this.totalLength = 0;
    this.contentWidth = 0;
    this.endPoint = 0;
    this.duration = 0;
    this.hovered = false;
  }


  function getCurrentPosition() {
    this.currentPos = parseInt($(this.name).css('margin-left'));
    return this.currentPos;
  }

  function createMarquee(settings) {

      var defaults = {
        duration: 20000,
        padding: 10,
        marquee_class: '.marquee',
        container_class: '.marquee-contaniner',
        sibling_class: 0,
        hover: true
      };

      var config = $.extend({}, defaults, settings);

      var marqueeContent =  $(config.marquee_class).html()
      var containerWidth = $(config.container_class).width();
      var contentWidth = $(config.marquee_class).width();

      if (config.sibling_class == 0) { 
        var widthToIgnore = 0;
      } else {
        var widthToIgnore = $(config.sibling_class).width();
      }

      var endPoint = -(contentWidth - widthToIgnore);
      var totalLength =  containerWidth - endPoint;

      var spawnAmount = Math.ceil(containerWidth / contentWidth);
      //init vars from input



      console.log(config);

      $(config.marquee_class).remove();

      if(spawnAmount<2){
          spawnAmount =2;
      }

      //initialise positions counters, content 

      for (i = 0; i < spawnAmount; i++) {

          if(config.hover == true){

            var newElement = $('<div class="marquee-' + (i+1) + '">' + marqueeContent + '</div>')        
            .mouseenter(function() {

                for (var key in marqueeSpawned){
                  marqueeSpawned[key].el.clearQueue().stop();
                  marqueeSpawned[key].hovered = true;
                }

            })
            .mouseleave(function() {

                for (var key in marqueeSpawned){
                  marqueeManager(marqueeSpawned[key]);   
                } 

            });

          } else {

            var newElement = $('<div class="marquee-' + (i+1) + '">' + marqueeContent + '</div>') ;   

          }

          marqueeSpawned[i] = new marqueeObj(newElement);

          $(config.container_class).append(newElement);

          marqueeSpawned[i].currentPos = (widthToIgnore + (contentWidth*i))+(config.padding*i);  //initial positioning
          marqueeSpawned[i].name = '.marquee-'+(i+1); 

          marqueeSpawned[i].totalLength = totalLength;  
          marqueeSpawned[i].containerWidth = containerWidth;  
          marqueeSpawned[i].contentWidth = contentWidth;  
          marqueeSpawned[i].endPoint = endPoint;  
          marqueeSpawned[i].duration = config.duration;  

          $(marqueeSpawned[i].name).css('margin-left', marqueeSpawned[i].currentPos+config.padding +'px'); //setting margin according to postition

          
          marqueeManager(marqueeSpawned[i]);

      }
  }

  function marqueeManager(marqueed_el) {
        
        if (marqueed_el.hovered == false) { 

            if (marqueed_el.counter > 0) {  //this is not the first loop
              
                marqueed_el.timeLeft = marqueed_el.duration;
                marqueed_el.el.css('margin-left', marqueed_el.containerWidth +'px'); //setting margin according to postition
                marqueed_el.currentPos = marqueed_el.containerWidth; //setting margin according to postition

            } else {    // this is the first loop
              
              marqueed_el.timeLeft = (((marqueed_el.totalLength - (marqueed_el.containerWidth - marqueed_el.getPosition()))/ marqueed_el.totalLength)) * marqueed_el.duration;
            }

        } else {
              marqueed_el.hovered = false;
              marqueed_el.currentPos = parseInt(marqueed_el.el.css('margin-left'));
              marqueed_el.distanceLeft = marqueed_el.totalLength - (marqueed_el.containerWidth - marqueed_el.getPosition());
              marqueed_el.timeLeft = (((marqueed_el.totalLength - (marqueed_el.containerWidth - marqueed_el.currentPos))/ marqueed_el.totalLength)) * marqueed_el.duration;
        }

    marqueeAnim(marqueed_el);
  }

  function marqueeAnim (marqueeObject){
    marqueeObject.counter++
    marqueeObject.el.clearQueue().animate({'marginLeft': marqueeObject.endPoint+'px'}, marqueeObject.timeLeft, 'linear', function(){marqueeManager(marqueeObject)});
  }



