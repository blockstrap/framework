/*
 * 
 *  Blockstrap v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECT
    var theme = {};
    
    // FUNCTIONS FOR OBJECT
    theme.new = function()
    {
        // DO NOT USE THIS UNLESS YOU REALLY NEED TOO
        // AND EVEN THEN - REALLY THINK ABOUT IT ...
        // UNLESS OF COURSE IT IS SPECIFIC TO THIS THEME
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {theme:theme});
})
(jQuery);