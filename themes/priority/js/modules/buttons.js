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
    var buttons = {};
    
    buttons.new = function()
    {
        
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {buttons:buttons});
})
(jQuery);