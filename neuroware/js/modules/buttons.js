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
    var buttons = {};
    
    // FUNCTIONS FOR OBJECT
    buttons.page = function(button, e)
    {
        var slug = false;
        var id = $(button).attr('id');
        var href = $(button).attr('href');
        var slugs = href.split('#');
        if(slugs[0] === "")
        {
            slug = slugs[1];
            $($.fn.neuroware.element).find('.btn-page.active').removeClass('active').addClass('activated');
            $(button).addClass('active loading');
            if($.fn.neuroware.settings.data_base && $.fn.neuroware.settings.html_base)
            {
                e.preventDefault();
                $.fn.neuroware.data.find('data', slug, function(results)
                {
                    var data = results;
                    var refresh = neuroware_functions.vars('refresh');
                    if(refresh === true || !data)
                    {
                        $.fn.neuroware.templates.get('themes/'+$.fn.neuroware.settings.theme+'/'+$.fn.neuroware.settings.data_base+slug, 'json', function(data)
                        {
                            if(data.status)
                            {
                                $(button).removeClass('loading active');
                                $($.fn.neuroware.element).find('.activated').removeClass('activated').addClass('active');
                            }
                            else
                            {
                                var filtered_data = $.fn.neuroware.core.filter(data);
                                $.fn.neuroware.data.put(slug, filtered_data);
                                $.fn.neuroware.data.save('data', slug, data, function()
                                {
                                    $.fn.neuroware.data.find('html', slug, function(results)
                                    {
                                        var html = results;
                                        if(refresh === true || !html)
                                        {
                                            $.fn.neuroware.templates.get('themes/'+$.fn.neuroware.settings.theme+'/'+$.fn.neuroware.settings.html_base+slug, 'html', function(content)
                                            {
                                                if(content.status && content.status === 404)
                                                {
                                                    $(button).removeClass('loading');
                                                    $($.fn.neuroware.element).find('.activated').removeClass('activated').addClass('active');
                                                }
                                                else
                                                {
                                                    $.fn.neuroware.data.save('html', slug, content, function()
                                                    {
                                                        $('#'+$.fn.neuroware.settings.content_id).hide('slide', {direction:'left'}, 500);
                                                        var paged_html = Mustache.render(content, filtered_data);
                                                        $('#'+$.fn.neuroware.settings.content_id).html(paged_html).show('slide', {direction:'right'}, 500);
                                                        $(button).removeClass('loading');
                                                        if(history.pushState) 
                                                        {
                                                            if(slug === $.fn.neuroware.settings.slug_base)
                                                            {
                                                                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, $.fn.neuroware.settings.base_url);
                                                            }
                                                            else
                                                            {
                                                                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, '#'+slug);
                                                            }
                                                            $($.fn.neuroware.element).find('.activated').removeClass('activated');
                                                            $.fn.neuroware.core.new();
                                                        }
                                                        else
                                                        {
                                                            $.fn.neuroware.core.new();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else
                                        {                                            
                                            // THIS RUNS FIVE TIMES MUST BE FUNCTIONALIZED ASAP
                                            
                                            $('#'+$.fn.neuroware.settings.content_id).hide('slide', {direction:'left'}, 500);
                                            var paged_html = Mustache.render(html, filtered_data);                                            
                                            $('#'+$.fn.neuroware.settings.content_id).html(paged_html).show('slide', {direction:'right'}, 500);
                                            $(button).removeClass('loading');
                                            if(history.pushState) 
                                            {
                                                if(slug === $.fn.neuroware.settings.slug_base)
                                                {
                                                    history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, $.fn.neuroware.settings.base_url);
                                                }
                                                else
                                                {
                                                    history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, '#'+slug);
                                                }
                                                $($.fn.neuroware.element).find('.activated').removeClass('activated');
                                                $.fn.neuroware.core.new();
                                            }
                                            else
                                            {
                                                $.fn.neuroware.core.new();
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                    else
                    {
                        var filtered_data = $.fn.neuroware.core.filter(data);
                        $.fn.neuroware.data.put(slug, filtered_data);
                        $.fn.neuroware.data.find('html', slug, function(results)
                        {
                            var html = results;
                            if(refresh === true || !html)
                            {
                                $.fn.neuroware.templates.get('themes/'+$.fn.neuroware.settings.theme+'/'+$.fn.neuroware.settings.html_base+slug, 'html', function(content)
                                {
                                    if(content.status && content.status === 404)
                                    {
                                        $(button).removeClass('loading');
                                        $($.fn.neuroware.element).find('.activated').removeClass('activated').addClass('active');
                                    }
                                    else
                                    {
                                        $('#'+$.fn.neuroware.settings.content_id).hide('slide', {direction:'left'}, 500);
                                        var paged_html = Mustache.render(content, filtered_data);                                            
                                        $('#'+$.fn.neuroware.settings.content_id).html(paged_html).show('slide', {direction:'right'}, 500);
                                        $(button).removeClass('loading');
                                        if(history.pushState) 
                                        {
                                            if(slug === $.fn.neuroware.settings.slug_base)
                                            {
                                                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, $.fn.neuroware.settings.base_url);
                                            }
                                            else
                                            {
                                                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, '#'+slug);
                                            }
                                            $($.fn.neuroware.element).find('.activated').removeClass('activated');
                                            $.fn.neuroware.core.new();
                                        }
                                        else
                                        {
                                            $.fn.neuroware.core.new();
                                        }
                                    }
                                });
                            }
                            else
                            {

                                // THIS RUNS FIVE TIMES MUST BE FUNCTIONALIZED ASAP

                                $('#'+$.fn.neuroware.settings.content_id).hide('slide', {direction:'left'}, 500);
                                var paged_html = Mustache.render(html, filtered_data);                                            
                                $('#'+$.fn.neuroware.settings.content_id).html(paged_html).show('slide', {direction:'right'}, 500);
                                $(button).removeClass('loading');
                                if(history.pushState) 
                                {
                                    if(slug === $.fn.neuroware.settings.slug_base)
                                    {
                                        history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, $.fn.neuroware.settings.base_url);
                                    }
                                    else
                                    {
                                        history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, '#'+slug);
                                    }
                                    $($.fn.neuroware.element).find('.activated').removeClass('activated');
                                    $.fn.neuroware.core.new();
                                }
                                else
                                {
                                    $.fn.neuroware.core.new();
                                }
                            }
                        });
                    }
                });
            }
        }
    }
    buttons.reset = function(button, e)
    {
        if(e) e.preventDefault();
        if(localStorage)
        {
            $.each(localStorage, function(k, v)
            {
                var check = k.substring(0, 3);
                if(check === 'nw_')
                {
                    localStorage.removeItem(k);
                }
            });
            $.fn.neuroware.settings.info.storage = {
                local: {
                    used: '' + ((JSON.stringify(localStorage).length * 2) / 1000000) + ' MB',
                    remaining: '' + ((2490000 - (JSON.stringify(localStorage).length * 2)) / 1000000) + ' MB'
                }
            };
            alert('Device Reset | '+$.fn.neuroware.settings.info.storage.local.remaining+' Local Storage Remaining');
        }
    }
    buttons.filter = function(button, e)
    {
        e.preventDefault();
        var col = false;
        var table = $(button).attr('data-table');
        var header_padding = '10px 10px';
        var body_padding = '20px 10px';
        var all_button = $(button).parent().find('.btn-filter-all');
        var these_buttons = $(button).parent().find('.btn-filter');
        var active_buttons = $(button).parent().find('.btn.active').length;
        if($(button).attr('data-col') && $(button).attr('data-col') !== '*')
        {
            col = parseInt($(button).attr('data-col'));
        }
        if(!$(all_button).hasClass('active') && active_buttons === 1)
        {
            $(these_buttons).removeClass('active');
            $(all_button).trigger('click');
        }
        else if(col && $(all_button).hasClass('active'))
        {
            $(these_buttons).addClass('active');
            $(all_button).removeClass('active');
            $(button).removeClass('active');
            $($.fn.neuroware.element).find('table#'+table+' thead tr th:nth-child('+col+')').each(function(i)
            {
                $(this).animate({'padding':0, 'width':0}, 350);
                $($.fn.neuroware.element).find('table#'+table+' thead tr th:nth-child('+col+') .cell').hide(350);
            });
            $($.fn.neuroware.element).find('table#'+table+' tbody tr td:nth-child('+col+')').each(function(i)
            {
                $(this).animate({'padding':0, 'width':0}, 350);
                $($.fn.neuroware.element).find('table#'+table+' tbody tr td:nth-child('+col+') .cell').hide(350);
            });
        }
        else if(col)
        {
            if($(button).hasClass('active'))
            {
                $(button).removeClass('active');
                $($.fn.neuroware.element).find('table#'+table+' thead tr th:nth-child('+col+')').each(function(i)
                {
                    $(this).animate({'padding':0, 'width':0}, 350);
                    $($.fn.neuroware.element).find('table#'+table+' thead tr th:nth-child('+col+') .cell').hide(350);
                });
                $($.fn.neuroware.element).find('table#'+table+' tbody tr td:nth-child('+col+')').each(function(i)
                {
                    $(this).animate({'padding':0, 'width':0}, 350);
                    $($.fn.neuroware.element).find('table#'+table+' tbody tr td:nth-child('+col+') .cell').hide(350);
                });
            }
            else
            {
                $(button).addClass('active');
                $($.fn.neuroware.element).find('table#'+table+' thead tr th').each(function(i)
                {
                    if(!$(this).hasClass('ribbon'))
                    {
                        $(this).animate({'padding':header_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                    }
                });
                $($.fn.neuroware.element).find('table#'+table+' tbody tr td').each(function(i)
                {
                    if(!$(this).hasClass('ribbon'))
                    {
                        $(this).animate({'padding':body_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                    }
                });
                $($.fn.neuroware.element).find('table#'+table+' thead tr th:nth-child('+col+') .cell').show(350)
                $($.fn.neuroware.element).find('table#'+table+' tbody tr td:nth-child('+col+') .cell').show(350);
            }
        }
        else if(!col && !$(all_button).hasClass('active'))
        {
            $(these_buttons).removeClass('active');
            $(all_button).addClass('active');
            $($.fn.neuroware.element).find('table#'+table+' thead tr th').each(function(i)
            {
                if(!$(this).hasClass('ribbon'))
                {
                    $(this).animate({'padding':header_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                }
            });
            $($.fn.neuroware.element).find('table#'+table+' tbody tr td').each(function(i)
            {
                if(!$(this).hasClass('ribbon'))
                {
                    $(this).animate({'padding':body_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                }
            });
            $($.fn.neuroware.element).find('table#'+table+' thead tr th .cell').show(350);
            $($.fn.neuroware.element).find('table#'+table+' tbody tr td .cell').show(350);
        }
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.neuroware, {buttons:buttons});
})
(jQuery);