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
    var buttons = {};
    
    // FUNCTIONS FOR OBJECT
    buttons.process = function(slug, content, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements)
    {
        $('#'+$.fn.blockstrap.settings.content_id).hide(effect, {direction:direction}, 500);
        var paged_html = Mustache.render(content, filtered_data);
        $('#'+$.fn.blockstrap.settings.content_id).html(paged_html).show(effect, {direction:reverse_direction}, 500, function()
        {
            if(mobile && !menu) $(elements).css({'opacity':1});
            if(menu)
            {
                if($('#menu-toggle').hasClass('open')) $('#menu-toggle').trigger('click');
                if($('#sidebar-toggle').hasClass('open')) $('#sidebar-toggle').trigger('click');
            }
        });
        $(button).removeClass('loading');
        if(history.pushState) 
        {
            if(slug === $.fn.blockstrap.settings.slug_base)
            {
                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, $.fn.blockstrap.settings.base_url);
            }
            else
            {
                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, '#'+slug);
            }
            $($.fn.blockstrap.element).find('.activated').removeClass('activated');
            $.fn.blockstrap.core.new();
        }
        else
        {
            $.fn.blockstrap.core.new();
        }
    }
    buttons.cancel = function(button, mobile, menu, elements)
    {
        if(mobile && !menu) $(elements).css({'opacity':1});
        if(menu)
        {
            if($('#menu-toggle').hasClass('open')) $('#menu-toggle').trigger('click');
            if($('#sidebar-toggle').hasClass('open')) $('#sidebar-toggle').trigger('click');
        }
        $(button).removeClass('loading');
        $($.fn.blockstrap.element).find('.activated').removeClass('activated').addClass('active');
    }
    buttons.page = function(button, e)
    {
        var menu = false;
        var mobile = false;
        var slug = false;
        var id = $(button).attr('id');
        var href = $(button).attr('href');
        var slugs = href.split('#');
        var effect = 'slide';
        var direction = 'left';
        var reverse_direction = 'right';
        var elements = '#sidebar, #navigation';
        if($(button).attr('data-elements')) elements = $(button).attr('data-elements');
        if($(button).attr('data-effect')) effect = $(button).attr('data-effect');
        if($(button).hasClass('up')) 
        {
            direction = 'up';
            reverse_direction = 'down';
        }
        if($('#mobile-footer').css('display') === 'block') mobile = true;
        if($('#menu-toggle').hasClass('open') || $('#sidebar-toggle').hasClass('open')) menu = true;
        if(slugs[0] === "")
        {
            slug = slugs[1];
            $($.fn.blockstrap.element).find('.btn-page.active').removeClass('active').addClass('activated');
            $(button).addClass('active loading');
            if(mobile && !menu) $(elements).css({'opacity':0});
            if($.fn.blockstrap.settings.data_base && $.fn.blockstrap.settings.html_base)
            {
                e.preventDefault();
                $.fn.blockstrap.data.find('data', slug, function(results)
                {
                    var data = results;
                    var refresh = blockstrap_functions.vars('refresh');
                    if(refresh === true || !data)
                    {
                        $.fn.blockstrap.templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.data_base+slug, 'json', function(data)
                        {
                            if(data.status)
                            {
                                buttons.cancel(button, mobile, menu, elements);
                            }
                            else
                            {
                                var filtered_data = $.fn.blockstrap.core.filter(data);
                                $.fn.blockstrap.data.put(slug, filtered_data);
                                $.fn.blockstrap.data.save('data', slug, data, function(res)
                                {
                                    $.fn.blockstrap.data.find('html', slug, function(results)
                                    {
                                        var html = results;
                                        if(refresh === true || !html)
                                        {
                                            $.fn.blockstrap.templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.html_base+slug, 'html', function(content)
                                            {
                                                if(content.status && content.status === 404)
                                                {
                                                    buttons.cancel(button, mobile, menu, elements);
                                                }
                                                else
                                                {
                                                    $.fn.blockstrap.data.save('html', slug, content, function()
                                                    {
                                                        buttons.process(slug, content, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
                                                    });
                                                }
                                            });
                                        }
                                        else
                                        {                                            
                                            buttons.process(slug, html, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
                                        }
                                    });
                                });
                            }
                        });
                    }
                    else
                    {
                        var filtered_data = $.fn.blockstrap.core.filter(data);
                        $.fn.blockstrap.data.put(slug, filtered_data);
                        $.fn.blockstrap.data.find('html', slug, function(results)
                        {
                            var html = results;
                            if(refresh === true || !html)
                            {
                                $.fn.blockstrap.templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.html_base+slug, 'html', function(content)
                                {
                                    if(content.status && content.status === 404)
                                    {
                                        buttons.cancel(button, mobile, menu, elements);
                                    }
                                    else
                                    {
                                        buttons.process(slug, content, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
                                    }
                                });
                            }
                            else
                            {
                                buttons.process(slug, html, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
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
            console.log(localStorage);
            $.fn.blockstrap.settings.info.storage = {
                local: {
                    used: '' + ((JSON.stringify(localStorage).length * 2) / 1000000) + ' MB',
                    remaining: '' + ((2490000 - (JSON.stringify(localStorage).length * 2)) / 1000000) + ' MB'
                }
            };
            alert('Device Reset | ' + $.fn.blockstrap.settings.info.storage.local.remaining + ' Local Storage Remaining');
            location.reload();
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
            $($.fn.blockstrap.element).find('table#'+table+' thead tr th:nth-child('+col+')').each(function(i)
            {
                $(this).animate({'padding':0, 'width':0}, 350);
                $($.fn.blockstrap.element).find('table#'+table+' thead tr th:nth-child('+col+') .cell').hide(350);
            });
            $($.fn.blockstrap.element).find('table#'+table+' tbody tr td:nth-child('+col+')').each(function(i)
            {
                $(this).animate({'padding':0, 'width':0}, 350);
                $($.fn.blockstrap.element).find('table#'+table+' tbody tr td:nth-child('+col+') .cell').hide(350);
            });
        }
        else if(col)
        {
            if($(button).hasClass('active'))
            {
                $(button).removeClass('active');
                $($.fn.blockstrap.element).find('table#'+table+' thead tr th:nth-child('+col+')').each(function(i)
                {
                    $(this).animate({'padding':0, 'width':0}, 350);
                    $($.fn.blockstrap.element).find('table#'+table+' thead tr th:nth-child('+col+') .cell').hide(350);
                });
                $($.fn.blockstrap.element).find('table#'+table+' tbody tr td:nth-child('+col+')').each(function(i)
                {
                    $(this).animate({'padding':0, 'width':0}, 350);
                    $($.fn.blockstrap.element).find('table#'+table+' tbody tr td:nth-child('+col+') .cell').hide(350);
                });
            }
            else
            {
                $(button).addClass('active');
                $($.fn.blockstrap.element).find('table#'+table+' thead tr th').each(function(i)
                {
                    if(!$(this).hasClass('ribbon'))
                    {
                        $(this).animate({'padding':header_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                    }
                });
                $($.fn.blockstrap.element).find('table#'+table+' tbody tr td').each(function(i)
                {
                    if(!$(this).hasClass('ribbon'))
                    {
                        $(this).animate({'padding':body_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                    }
                });
                $($.fn.blockstrap.element).find('table#'+table+' thead tr th:nth-child('+col+') .cell').show(350)
                $($.fn.blockstrap.element).find('table#'+table+' tbody tr td:nth-child('+col+') .cell').show(350);
            }
        }
        else if(!col && !$(all_button).hasClass('active'))
        {
            $(these_buttons).removeClass('active');
            $(all_button).addClass('active');
            $($.fn.blockstrap.element).find('table#'+table+' thead tr th').each(function(i)
            {
                if(!$(this).hasClass('ribbon'))
                {
                    $(this).animate({'padding':header_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                }
            });
            $($.fn.blockstrap.element).find('table#'+table+' tbody tr td').each(function(i)
            {
                if(!$(this).hasClass('ribbon'))
                {
                    $(this).animate({'padding':body_padding, 'width': parseInt($(this).attr('data-width'))}, 350);
                }
            });
            $($.fn.blockstrap.element).find('table#'+table+' thead tr th .cell').show(350);
            $($.fn.blockstrap.element).find('table#'+table+' tbody tr td .cell').show(350);
        }
    };
    buttons.check = function()
    {
        var hash = false;
        if(window.location.href.split('#').length === 2) 
        {
            hash = window.location.href.split('#')[1];
        }
        if(hash)
        {
            $($.fn.blockstrap.element).find('.btn-page').each(function()
            {
                if($(this).attr('href') === '#'+hash)
                {
                    if($('#mobile-footer').css('display') === 'block')
                    {
                        if($(this).parent().attr('id') === 'mobile-footer')
                        {
                            $(this).trigger('click');
                            return false;
                        }
                    }
                    else
                    {
                        $(this).trigger('click');
                        return false;
                    }
                }
            })
        }
    }
    
    // THIS NEEDS TO BE MORE GENERIC
    // PLACEHOLDER FUNCTION FOR NOW
    buttons.next = function(button, e)
    {
        e.preventDefault();
        var href = $(button).attr('href');
        if($('form#blockstrap-setup-step1').length > 0)
        {
            var modules = {};
            var continue_salting = true;
            $('form#blockstrap-setup-step1').find('.form-group').each(function(i)
            {
                if(!$(this).find('input').val())
                {
                    var label = false;
                    if($(this).find('label').html()) label = $(this).find('label').html();
                    if(label) $.fn.blockstrap.core.modal('Error', 'Value for "'+label+'" Required');
                    else $.fn.blockstrap.core.modal('Error', 'Value Required');
                    continue_salting = false;
                }
                else
                {
                    modules[$(this).find('input').attr('id')] = $(this).find('input').val();
                }
            });
            if(continue_salting)
            {
                $.fn.blockstrap.security.salt(modules, function(salt, keys)
                {
                    $.fn.blockstrap.data.save('blockstrap', 'keys', keys, function()
                    {
                        $.fn.blockstrap.data.save('blockstrap', 'salt', salt, function()
                        {
                            /* NEED TO RESET THE INDEX HTML AND DATA */
                            $.fn.blockstrap.templates.render('index', function()
                            {
                                location.reload();
                            }, true);
                        });
                    });
                });
            }
        }
    }
    
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {buttons:buttons});
})
(jQuery);