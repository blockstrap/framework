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
    // EMPTY OBJECT
    var security = {};
    
    // FUNCTIONS FOR OBJECT
    security.salt = function(modules, callback, salt)
    {
        if(!salt) salt = $.fn.blockstrap.settings.id;
        var keys = [];
        if($.isPlainObject(modules))
        {
            var count = 0;
            var key_count = Object.keys(modules).length;
            if(key_count === count)
            {
                callback(salt, keys);
            }
            else
            {
                $.each(modules, function(k, v)
                {
                    count++;
                    keys.push(k);

                    if($.isArray($.fn.blockstrap.settings.store))
                    {
                        $.each($.fn.blockstrap.settings.store, function(store_index, store_key)
                        {
                            if(store_key === k)
                            {
                                $.fn.blockstrap.data.save('keys', store_key, v, function()
                                {

                                });
                            }
                        });
                    }

                    salt = CryptoJS.SHA3(salt+k+blockstrap_functions.slug(v), { outputLength: 512 });
                    if(count >= key_count && callback)
                    {
                        callback(salt.toString(), keys);
                    }
                })
            }
        }
        else
        {
            callback(salt, keys);
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {security:security});
})
(jQuery);


