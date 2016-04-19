/*
 * 
 *  Blockstrap v0.6.0.1
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
        var content = 'If you see this it means the tests plugin has been loaded and the message functionality has been used. API Tests will now be running and a new modal window should open soon with the results. Please be patient whilst we run the API tests.';
        if(
            typeof data != 'undefined' 
            && $.isPlainObject(data) 
            && data.content
        ){
            content = data.content;
        }
        alert(content);
        return false;
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {tests:tests});
})
(jQuery);
