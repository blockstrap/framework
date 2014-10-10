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
    var tests = {};
    
    tests.message = function(data)
    {
        var content = 'Testing Test Plugin!';
        if(data.content) content = data.content;
        alert(content);
        return false;
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {tests:tests});
})
(jQuery);
