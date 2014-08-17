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
    
    templates.filter = function(placeholders, replacements)
    {
        if(!placeholders || !replacements && $.isArray(placeholders) && $.isArray(replacements))
        {
            var raw_name = localStorage.getItem('nw_keys_your_name');
            var name = raw_name;

            if(blockstrap_functions.json(raw_name)) name = $.parseJSON(raw_name);

            var placeholders = ['urls.root', 'user.name'];
            var replacements = [
                $.fn.blockstrap.settings.base_url,
                name
            ];
        }
        for(var i = 0; i < placeholders.length; i++) 
        {
            var html = $($.fn.blockstrap.element).html();
            html = html.split('{{' + placeholders[i] + '}}').join(replacements[i]);
            $($.fn.blockstrap.element).html(html);
            $.fn.blockstrap.core.loader('close');
        }
    }
    
    templates.render = function(slug, callback, force_refresh)
    {
        $.fn.blockstrap.data.find('data', slug, function(results)
        {
            var data = results;
            var refresh = blockstrap_functions.vars('refresh');
            if(force_refresh) refresh = true;
            if(refresh === true || !data)
            {
                templates.get('themes/' + $.fn.blockstrap.settings.theme + '/' + $.fn.blockstrap.settings.data_base + slug, 'json', function(data)
                {
                    var filtered_data = $.fn.blockstrap.core.filter(data);
                    $.fn.blockstrap.data.put(slug, filtered_data);
                    $.fn.blockstrap.data.save('data', slug, data, function()
                    {
                        $.fn.blockstrap.data.find('html', slug, function(results)
                        {
                            var html = results;
                            if(!html || refresh)
                            {
                                templates.get('themes/' + $.fn.blockstrap.settings.theme + '/' + $.fn.blockstrap.settings.html_base + slug, 'html', function(content)
                                {
                                    var paged_html = Mustache.render(content, filtered_data);
                                    
                                    if(force_refresh && slug === 'index')
                                    {
                                        $($.fn.blockstrap.element).html('');
                                        $($.fn.blockstrap.element).append(paged_html);
                                    }
                                    else if(force_refresh)
                                    {
                                        $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.content_id).html(paged_html);
                                    }
                                    else
                                    {
                                        $($.fn.blockstrap.element).append(paged_html);
                                    }
                                    $.fn.blockstrap.data.save('html', slug, content, callback);
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
                    if(!html)
                    {
                        templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.html_base+slug, 'html', function(content)
                        {
                            var paged_html = Mustache.render(content, filtered_data);
                            $($.fn.blockstrap.element).append(paged_html);
                            $.fn.blockstrap.data.save('html', slug, content, callback);
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
