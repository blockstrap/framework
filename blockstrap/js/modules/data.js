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
    data.item = function(collection, key)
    {
        return 'nw_' + collection + '_' + key;
    };
    data.option = function(key)
    {
        var value = false;
        var options = localStorage.getItem('nw_blockstrap_options');
        if(blockstrap_functions.json(options)) options = $.parseJSON(options);
        if(options)
        {
            $.each(options, function(k, v)
            {
                if(k == key) value = v;
            });
        }
        return value
    }
    data.find = function(collection, key, callback)
    {
        if(localStorage && localStorage.getItem(data.item(collection, key)))
        {
            var obj = localStorage.getItem(data.item(collection, key));
            if(blockstrap_functions.json(obj)) obj = $.parseJSON(obj);
            callback(obj);
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
            var simple = false;
            if(value === 'true' || value === 'false') simple = true;
            if(value === 'true') value = true;
            else if(value === 'false') value = false;
            var results = JSON.stringify(value);
            if(simple === true) results = value;
            localStorage.setItem(data.item(collection, key), results);
            callback(value);
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
