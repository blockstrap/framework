/*
 * 
 *  Neuroware v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECT
    var security = {};
    
    // FUNCTIONS FOR OBJECT
    security.salt = function(modules, callback)
    {
        var salt = '';
        if($.isPlainObject(modules))
        {
            var count = 0;
            var key_count = Object.keys(modules).length;
            $.each(modules, function(k, v)
            {
                count++;
                salt = CryptoJS.SHA3(salt+k+blockstrap_functions.slug(v), { outputLength: 512 });
                if(count >= key_count && callback)
                {
                    callback(salt.toString());
                }
            })
        }
        else if(callback) callback;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {security:security});
})
(jQuery);


