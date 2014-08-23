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
    
    forms.get = function()
    {
        if(localStorage && localStorage.getItem('nw_boot_forms'))
        {
            var raw_forms = localStorage.getItem('nw_boot_forms');
            if(blockstrap_functions.json(raw_forms))
            {
                return $.parseJSON(raw_forms);
            }
            else
            {
                return raw_forms;
            }
        }
        else
        {
            return false;
        }
    }
    
    forms.process = function(data, form)
    {
        if(!form) form = forms.get();
        var html = Mustache.render(form, data);
        return $.fn.blockstrap.templates.filter(html);
    }
    
    forms.input = function(options)
    {
        var defaults = {
            label: false,
            type: 'text'
        };
        var field = $.extend({}, defaults, options);
        var settings = {
            objects: [
                {
                    fields_only: true,
                    fields: [
                        {
                            inputs: field
                        }
                    ]
                }
            ]
        };
        return forms.process(settings);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {forms:forms});
})
(jQuery);
