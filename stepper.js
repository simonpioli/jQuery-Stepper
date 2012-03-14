/*
 * jQuery Stepper Modified by Simon Pioli
 *
 * http://www.simonpioli.com
 * http://www.11outof10.com
 *
 * Original by Andrei Eftimie - http://designpunct.com/projects/jquery.stepper.js
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
 
(function($){
    $.fn.stepper = function(options) {
    
      var defaults = {
          step: 1,          // Step size
          defaultValue: "", // Default stepper value. If input is empty, it will be given this value as a starting value
          min: 0,           // Default minimum value. Stepper won't go below this value. If null, not enforced.
          max: null,        // Default maximum value. Stepper won't go above this value. If null, not enforced.
          values: [],       // List of allowed numbers. If enforced, step, min, max are all ignored.
                            // Default Value will be number at index 0.
          location: "inside"
      };
      
      var options = $.extend(defaults, options);
      return this.each(function() {
           // Element
           var $input = $(this);
           if (!$input.parent().is('.stepper')){
                $input.wrap('<span class="stepper cf"/>');
           }
             
           // Context
           var $context = $input.parent();
           // If the input has a size, we need to hug it horizontally so we don't have the buttons far away 
           if ($input.attr("size")){
               $context.css("zoom","1");
           }
           // init
           if ($input.val() == '') $input.val(options.defaultValue);
           
           // Plus / minus triggers
           $context[options.location==='inside'?'prepend':'append']('<div style="width:1em;" class="arrows"><a class="stepper-plus" href="#">&and;</a><a class="stepper-minus" href="#">&or;</a></div>')
           var $plus = $('.stepper-plus', $context);
           var $minus = $('.stepper-minus', $context);
           var $buttons = $plus.add($minus);
           $(".arrows", $context).css("position", options.location === 'inside' ? 'absolute' : 'static');
           $input.css("float", options.location === 'inside' ? "none" : "left"); 
           $(".arrows", $context).css("float", options.location === 'inside' ? 'none' : 'left');
             
           // Adding events on the buttons
           $buttons.click(function(event){
              el = event.target;
              var dis = $input.attr('disabled'); //Checks if input is disabled
              if (dis == undefined) {
              	go($(el).is('.stepper-plus')?'up':'down');
              	return false;
              }else{
              	return false;
              }
           });
             
           // We should also work with the up / down arrow keys
           $input.bind('keypress', function(event){
              switch (event.keyCode){
                  case 38:
                      go('up');
                      break;
                  case 40:
                      go('down');
                      break;
                  default:
                      break;
              }
           });
             
           // Public function
           // Should be used whenever we change the value (programatically or through events)
           function go(where){
               var values_length = options.values.length;
               // We need to handle floating point numbers 
               var value = $input.val();
               value = value && ~value.indexOf(".") ? parseFloat(value) : parseInt($input.val());
               var index =  0;
               switch (where){
                   case 'up':
                       if (values_length > 0){
                          index = $.inArray(value, options.values);
                          if (!!~index && index < values_length-1){
                             value = options.values[index+1];
                          } else if (isNaN(value)){
                             value = options.values[0];
                          }
                       } else {
                          value = isNaN(value)? options.step : value + options.step;
                       } 
                       if (values_length === 0 && options.max!==null) {
                          if (value > options.max) value = options.max;
                       }
                       $input.val(value);
                       break;
                   case 'down':
                       if (values_length > 0){
                          index = $.inArray(value, options.values);
                          if (!!~index && index > 0){
                             value = options.values[index-1];
                          } else if (isNaN(value)){
                             value = options.values[0];
                          }
                       } else {
                           value = isNaN(value)? 0 - options.step : value - options.step;
                       } 
                       if (values_length === 0 && options.min !== null) {
                           if (value < options.min) value = options.min;
                        }
                       $input.val(value);
                       break;
                   default:
                       break;  
               }
               $input.change();
           }
      });
    };
})(jQuery);