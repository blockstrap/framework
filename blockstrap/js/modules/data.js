/*
 * 
 *  Blockstrap v0.5.0.2
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var data = {};
    
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
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {data:data});
})
(jQuery);
