/*
 * 
 *  Blockstrap v0.1.1
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
        $.fn.blockstrap.data.find('data', slug, function(results)
        {
            var data = results;
            var refresh = blockstrap_functions.vars('refresh');
            if(refresh === true || !data)
            {
                templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.data_base+slug, 'json', function(data)
                {
                    var filtered_data = $.fn.blockstrap.core.filter(data);
                    $.fn.blockstrap.data.put(slug, filtered_data);
                    $.fn.blockstrap.data.save('data', slug, data, function()
                    {
                        $.fn.blockstrap.data.find('html', slug, function(results)
                        {
                            var html = results;
                            var refresh = blockstrap_functions.vars('refresh');
                            if(refresh === true || !html)
                            {
                                templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.html_base+slug, 'html', function(content)
                                {
                                    var paged_html = Mustache.render(content, filtered_data);
                                    $($.fn.blockstrap.element).append(paged_html);
                                    $.fn.blockstrap.data.save('html', slug, paged_html, callback);
                                });
                            }
                            else
                            {
                                var paged_html = Mustache.render(html, filtered_data);
                                $($.fn.blockstrap.element).append(paged_html);
                                if(callback) callback();
                            }
                        });
                    });
                });
            }
            else
            {
                var filtered_data = $.fn.blockstrap.core.filter(data);
                $.fn.blockstrap.data.put(slug, filtered_data);
                $.fn.blockstrap.data.find('html', slug, function(results)
                {
                    var html = results;
                    var refresh = blockstrap_functions.vars('refresh');
                    if(refresh === true || !html)
                    {
                        templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.html_base+slug, 'html', function(content)
                        {
                            var paged_html = Mustache.render(content, filtered_data);
                            $($.fn.blockstrap.element).append(paged_html);
                            $.fn.blockstrap.data.save('html', slug, paged_html, callback);
                        });
                    }
                    else
                    {
                        var paged_html = Mustache.render(html, filtered_data);
                        $($.fn.blockstrap.element).append(paged_html);
                        if(callback) callback();
                    }
                });
            }
        });
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {templates:templates});
})
(jQuery);
