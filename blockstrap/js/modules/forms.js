/*
 * 
 *  Blockstrap v0.6.0.0
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var forms = {};
    
    forms.get = function(callback)
    {
        if($.fn.blockstrap.snippets.forms)
        {
            return $.fn.blockstrap.snippets.forms;
        }
        else
        {
            return false;
        }
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
    
    forms.process = function(data, form)
    {
        if(!form) form = forms.get();
        var html = Mustache.render(form, data);
        return $.fn.blockstrap.templates.filter(html);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {forms:forms});
})
(jQuery);
