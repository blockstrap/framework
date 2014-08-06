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
    var data = {};
    if(localStorage)
    {
        $.fn.blockstrap.settings.info.storage = {
            local: {
                used: '' + ((JSON.stringify(localStorage).length * 2) / 1000000) + ' MB',
                remaining: '' + ((2490000 - (JSON.stringify(localStorage).length * 2)) / 1000000) + ' MB'
            }
        };
    }
    
    // FUNCTIONS FOR OBJECT
    data.get = function(key)
    {
        if(!key) key = 'index';
        return $.fn.blockstrap.data[key];
    };
    data.put = function(key, value)
    {
        $.fn.blockstrap.data[key] = value;
    };
    data.item = function(collection, key)
    {
        return 'nw_' + collection + '_' + key;
    };
    data.find = function(collection, key, callback)
    {
        if(localStorage && localStorage.getItem(data.item(collection, key)))
        {
            var obj = localStorage.getItem(data.item(collection, key));
            if(obj && blockstrap_functions.json(obj))
            {
                var json = $.parseJSON(obj);
                callback(json);
            }
            else
            {
                callback(obj);
            }
        }
        else
        {
            callback(false);
        }
    };
    data.save = function(collection, key, value, callback)
    {
        if(localStorage)
        {
            var results = localStorage.setItem(data.item(collection, key), JSON.stringify(value));
            callback(results);
        }
        else
        {
            callback(false);
        }
    };
    data.size = function(callback)
    {
        callback()
    };    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {data:data});
})
(jQuery);
