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
    var filters = {};
    
    // FUNCTIONS FOR OBJECT
    filters.bootstrap = function(neuroware, data)
    {
        var snippet = neuroware.snippets[data.type];
        var html = Mustache.render(snippet, data);
        return html;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.neuroware, {filters:filters});
})
(jQuery);


