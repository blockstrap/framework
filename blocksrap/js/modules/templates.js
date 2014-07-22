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
    var templates = {};
    
    // FUNCTIONS FOR OBJECT
    templates.get = function(file, extension, callback)
    {
        $.ajax({
            url: file + '.' + extension,
            dataType: extension,
            success: function(results)
            {
                if(callback) callback(results, file, extension);
            },
            error: function(results)
            {
                if(callback) callback(results, file, extension);
            }
        });
    };
    templates.render = function(slug, callback)
    {
        $.fn.neuroware.data.find('data', slug, function(results)
        {
            var data = results;
            var refresh = neuroware_functions.vars('refresh');
            if(refresh === true || !data)
            {
                templates.get('themes/'+$.fn.neuroware.settings.theme+'/'+$.fn.neuroware.settings.data_base+slug, 'json', function(data)
                {
                    var filtered_data = $.fn.neuroware.core.filter(data);
                    $.fn.neuroware.data.put(slug, filtered_data);
                    $.fn.neuroware.data.save('data', slug, data, function()
                    {
                        $.fn.neuroware.data.find('html', slug, function(results)
                        {
                            var html = results;
                            var refresh = neuroware_functions.vars('refresh');
                            if(refresh === true || !html)
                            {
                                templates.get('themes/'+$.fn.neuroware.settings.theme+'/'+$.fn.neuroware.settings.html_base+slug, 'html', function(content)
                                {
                                    var paged_html = Mustache.render(content, filtered_data);
                                    $($.fn.neuroware.element).append(paged_html);
                                    $.fn.neuroware.data.save('html', slug, paged_html, callback);
                                });
                            }
                            else
                            {
                                var paged_html = Mustache.render(html, filtered_data);
                                $($.fn.neuroware.element).append(paged_html);
                                if(callback) callback();
                            }
                        });
                    });
                });
            }
            else
            {
                var filtered_data = $.fn.neuroware.core.filter(data);
                $.fn.neuroware.data.put(slug, filtered_data);
                $.fn.neuroware.data.find('html', slug, function(results)
                {
                    var html = results;
                    var refresh = neuroware_functions.vars('refresh');
                    if(refresh === true || !html)
                    {
                        templates.get('themes/'+$.fn.neuroware.settings.theme+'/'+$.fn.neuroware.settings.html_base+slug, 'html', function(content)
                        {
                            var paged_html = Mustache.render(content, filtered_data);
                            $($.fn.neuroware.element).append(paged_html);
                            $.fn.neuroware.data.save('html', slug, paged_html, callback);
                        });
                    }
                    else
                    {
                        var paged_html = Mustache.render(html, filtered_data);
                        $($.fn.neuroware.element).append(paged_html);
                        if(callback) callback();
                    }
                });
            }
        });
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.neuroware, {templates:templates});
})
(jQuery);
