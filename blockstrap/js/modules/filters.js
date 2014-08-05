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
    filters.bootstrap = function(blockstrap, data)
    {
        var snippet = blockstrap.snippets[data.type];
        var html = Mustache.render(snippet, data);
        return html;
    }
    filters.got = function(blockstrap, data)
    {
        if(data.collection && data.key)
        {
            return localStorage.getItem('nw_'+data.collection+'_'+data.key);
        }
        else return false;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {filters:filters});
})
(jQuery);


