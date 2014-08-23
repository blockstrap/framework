/*
 * 
 *  Blockstrap v0.5
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECTS
    var forms = {};
    
    forms.input = function(options)
    {
        var defaults = {
            label: false
        };
        return '<p>Input coming soon!</p>';
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {forms:forms});
})
(jQuery);
