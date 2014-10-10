/*
 * 
 *  Blockstrap v0.5
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 *  -- Including this file in the HTML header is the only requirement
 *  -- Everything else, including the loading of dependencies is handled here
 *  
 */

// HARD-CODED / REMOVE LATER
var bs_theme_config = 'config.default';
//var bs_theme_config = 'config';

var blockstrap_loader;
var blockstrap_core = function()
{
    /* 
    
    DONE LIKE THIS SO JQUERY CAN BE INJECTED FIRST IF REQUIRED
    
    */
    ;(function($, window, document, undefined)
    {
        // GLOBAL VARS
        var $this = this;
        var init_bs = false;
        var resize_time = new Date();
        var resize_timeout = false;
        
        // PREVENT DUPLICATES
        $.fn.blockstrap = function(options)
        {
            this.each(function()
            {
                if(!$.data(this, "plugin_blockstrap"))
                {
                    $.data(this, "plugin_blockstrap", new plugin(this, options));
                }
            });
            return this;
        };
        
        // IN-ESCAPABLE INCLUDES
        $.fn.blockstrap.defaults = function()
        {
            var defaults = {
                dependencies: [
                    'crypto',
                    'sha3',
                    'mustache'
                ],
                modules: [
                    'templates',
                    'theme'
                ]
            }
            var modules = $.fn.blockstrap.settings.modules;
            var dependencies = $.fn.blockstrap.settings.dependencies;
            var d_length = blockstrap_functions.array_length(dependencies);
            var m_length = blockstrap_functions.array_length(modules);
            if(!$.isArray($.fn.blockstrap.settings.dependencies))
            {
                $.fn.blockstrap.settings.dependencies = [];
            }
            if(!$.isArray($.fn.blockstrap.settings.modules))
            {
                $.fn.blockstrap.settings.modules = [];
            }
            $.each(defaults.dependencies, function(k, dependency)
            {
                if($.inArray(dependency, dependencies) < 0 || d_length < 1)
                {
                    $.fn.blockstrap.settings.dependencies.push(dependency);
                }   
            });
            $.each(defaults.modules, function(k, module)
            {
                if($.inArray(module, modules) < 0 || m_length < 1)
                {
                    $.fn.blockstrap.settings.modules.push(module);
                }
            });
        }
        
        // CORE FUNCTIONS
        $.fn.blockstrap.core = {
            ago: function(time)
            {
                var date = new Date();;
                if(time) date = new Date(time * 1000);
                return jQuery.timeago(date)
            },
            boot: function(bootstrap, key, html, index, callback)
            {
                var snippet_limit = blockstrap_functions.array_length(bootstrap);
                if(key && html)
                {
                    $.fn.blockstrap.snippets[key] = html;
                }
                if(index >= snippet_limit - 1)
                {
                    if(callback) callback();
                }
                else
                {
                    $.fn.blockstrap.core.bootstrap(index + 1, bootstrap, callback);
                }
            },
            bootstrap: function(index, bootstrap, callback)
            {
                var html = false;
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                var key = bootstrap[index];
                var url = bs.settings.core_base + 'html/bootstrap/' + key;
                bs.core.get(url, 'html', function(html)
                {
                    bs.core.boot(bootstrap, key, html, index, callback);
                });
            },
            buttons: function()
            {
                var bs = $.fn.blockstrap;
                var button_ids = bs.settings.buttons.ids;
                var button_classes = bs.settings.buttons.classes;
                if($.isArray(button_ids))
                {
                    $.each(button_ids, function(k, id_name)
                    {
                        var key = id_name;
                        var id_name = '#' + key;
                        key = key.replace(/-/g, '_');
                        $(bs.element).on('click', id_name, function(e)
                        {
                            bs.buttons[key](this, e);
                        });
                    });
                }
                if($.isArray(button_classes))
                {
                    $.each(button_classes, function(k, class_name)
                    {
                        var key = class_name;
                        class_name = '.btn-' + key;
                        key = key.replace(/-/g, '_');
                        $(bs.element).on('click', class_name, function(e)
                        {
                            if($.isPlainObject(bs.buttons))
                            {
                                if($.isFunction(bs.buttons[key]))
                                {
                                    bs.buttons[key](this, e);
                                }
                            }
                            else if($.isPlainObject(bs.theme))
                            {
                                if($.isFunction(bs.theme.buttons[key]))
                                {
                                    bs.theme.buttons[key](this, e);
                                }
                            }
                        });
                    });
                }
            },
            confirm: function(title, content, callback)
            {
                $('#confirm-modal form, #confirm-modal .btn-success').unbind();
                $.fn.blockstrap.core.modal(title, content, 'confirm-modal');
                $('#confirm-modal form').bind('submit', function()
                {
                    callback(true);
                });
                $('#confirm-modal .btn-success').bind('click', function()
                {
                    callback(true);
                });
            },
            css: function(callback)
            {
                var theme = $.fn.blockstrap.settings.theme;
                var core_css = $.fn.blockstrap.settings.core_base + 'css/';
                var theme_css = $.fn.blockstrap.settings.theme_base + theme + '/css/';
                $.isArray($.fn.blockstrap.settings.css)
                {
                    var files = Object.keys($.fn.blockstrap.settings.css).length;
                    $.each($.fn.blockstrap.settings.css, function(k, v)
                    {
                        $.ajax({
                            url: theme_css+v+'.css',
                            error: function()
                            {
                                $.ajax({
                                    url: core_css+v+'.css',
                                    error: function()
                                    {
                                        if((k+1) >= files)
                                        {
                                            callback();
                                        }
                                    },
                                    success: function(res)
                                    {
                                        if(res != '404')
                                        {
                                            $('head').append('<link rel="stylesheet" type="text/css" href="'+core_css+v+'.css">');
                                        }
                                        if((k+1) >= files)
                                        {
                                            callback();
                                        }
                                    }
                                });
                            },
                            success: function(res)
                            {
                                if(res == '404')
                                {
                                    $.ajax({
                                        url: core_css+v+'.css',
                                        error: function()
                                        {
                                            if((k+1) >= files)
                                            {
                                                callback();
                                            }
                                        },
                                        success: function(res)
                                        {
                                            if(res != '404')
                                            {
                                                $('head').append('<link rel="stylesheet" type="text/css" href="'+core_css+v+'.css">');
                                            }
                                            if((k+1) >= files)
                                            {
                                                callback();
                                            }
                                        }
                                    });
                                }
                                else
                                {
                                    $('head').append('<link rel="stylesheet" type="text/css" href="'+theme_css+v+'.css">');
                                    if((k+1) >= files)
                                    {
                                        callback();
                                    }
                                }
                            }
                        });
                        
                        /*
                        $('head').append('<link rel="stylesheet" type="text/css" href="'+core_css+v+'.css">');
                        if((k+1) >= files)
                        {
                            callback();
                        }
                        */
                    })
                }
            },
            defaults: function()
            {
                if(!$.isPlainObject($.fn.blockstrap.data))
                {
                    var data_functions = {
                        find: function(col, key, callback)
                        {
                            if(callback) callback(false);
                        },
                        save: function(col, key, value, callback)
                        {
                            if(callback) callback(value);
                        }
                    }
                    $.fn.blockstrap.data = data_functions;
                }
                if(!$.isPlainObject($.fn.blockstrap.security))
                {
                    var security_functions = {
                        logged_in: function()
                        {
                            return true;
                        }
                    }
                    $.fn.blockstrap.security = security_functions;
                }
            },
            filter: function(data)
            {
                var filters = false;
                var bs = $.fn.blockstrap;
                if($.isPlainObject(bs.filters))
                {
                    filters = $.fn.blockstrap.filters;
                }
                if($.isPlainObject(bs.theme) && $.isPlainObject(bs.theme.filters))
                {
                    filters = $.extend({}, filters, bs.theme.filters);
                }
                if(filters)
                {
                    $.each(data, function(k, v)
                    { 
                        if($.isPlainObject(v) && v.func && $.isFunction(filters[v.func]))
                        {
                            data[k] = filters[v.func]($.fn.blockstrap, v);
                        }
                        else if($.isPlainObject(v) || $.isArray(v))
                        {
                            data[k] = $.fn.blockstrap.core.filter(v);
                        }
                    });
                    return data;
                }
                else
                {
                    return data;
                }
            },
            forms: function()
            {
                // PERHAPS FORMS NEEDS ITS OWN MODULE...?
                var backup = '';
                if(localStorage)
                {
                    var objs = {};
                    $.each(localStorage, function(key, value)
                    {
                        var obj = value;
                        if(blockstrap_functions.json(value))
                        {
                            obj = $.parseJSON(value);
                        }
                        if(key.substring(0, 12) == 'nw_accounts_')
                        {
                            if(!$.isArray(objs['nw_accounts']))
                            {
                                objs['nw_accounts'] = [];
                            }
                            objs['nw_accounts'].push(obj);
                        }
                        else if(key.substring(0, 14) == 'nw_contacts_')
                        {
                            if(!$.isArray(objs['nw_blockstrap']))
                            {
                                objs['nw_blockstrap'] = [];
                            }
                            objs['nw_contacts'].push(obj);
                        }
                        else if(key.substring(0, 14) == 'nw_blockstrap_')
                        {
                            var key_array = key.split('_blockstrap_');
                            if(!$.isPlainObject(objs['nw_blockstrap']))
                            {
                                objs['nw_blockstrap'] = {};
                            }
                            objs['nw_blockstrap'][key_array[1]] = obj;
                        }
                        else if(key.substring(0, 8) == 'nw_keys_')
                        {
                            var key_array = key.split('_keys_');
                            if(!$.isPlainObject(objs['nw_keys']))
                            {
                                objs['nw_keys'] = {};
                            }
                            objs['nw_keys'][key_array[1]] = obj;
                        }
                    });
                }
                var backup = JSON.stringify(objs);
                $($.fn.blockstrap.element).find('textarea.data-backup').val(backup);
                $($.fn.blockstrap.element).find('input.filestyle').each(function(i)
                {
                    var input = $(this);
                    $(this).filestyle({
                        iconName: 'glyphicon-inbox'
                    });
                    $(this).on('change', function(i)
                    {
                        $.fn.blockstrap.core.image(this, function(img)
                        {
                            $(input).attr('data-img', img);
                        });
                    });
                });
                $($.fn.blockstrap.element).find("input.switch").each(function()
                {
                    $(this).bootstrapSwitch();
                    $(this).on('switchChange.bootstrapSwitch', function(event, state) {
                        $(this).val(state);
                    });
                });
                $($.fn.blockstrap.element).on('change', '.bs-dobs', function(i)
                {
                    var field = $(this).parent().find('input[type="hidden"]');
                    var day = $(this).parent().find('.bs-dob-day').val();
                    var month = $(this).parent().find('.bs-dob-month').val();
                    var year = $(this).parent().find('.bs-dob-year').val();
                    $(field).val(day + '_' + month + '_' + year);
                });
                $($.fn.blockstrap.element).on('change', '#access-account', function(i)
                {
                    var value = $(this).val();
                    var account_id = $(this).attr('data-account-id');
                    if(value === 'print')
                    {
                        // DEFINITELY NOT CORE MATERIAL
                        // DIRTY HACK FOR ADAMS DEMO
                        var modal = $(this).parent().parent().parent().parent().parent().parent().parent();
                        var title = $(modal).find('.modal-title').html();
                        var contents = $(modal).find('.modal-body').html();
                        $.fn.blockstrap.core.print(title + contents);
                    }
                    else if(value === 'access')
                    {
                        $.fn.blockstrap.accounts.access(account_id);
                    }
                });
                $($.fn.blockstrap.element).find('.bs-currency-select').each(function(i)
                {
                    var select = $(this);
                    var currencies = $.fn.blockstrap.settings.currencies;
                    $(select).html('');
                    if($.isPlainObject(currencies))
                    {
                        $(select).append('<option value="">-- Select Currency --</option>');
                        $.each(currencies, function(currency, v)
                        {
                            $(select).append('<option value="'+currency+'">'+v.currency+'</option>');
                        });
                    }
                });
                $($.fn.blockstrap.element).find('.bs-account-select').each(function(i)
                {
                    var select = $(this);
                    var accounts = $.fn.blockstrap.accounts.get();
                    $(select).html('');
                    if($.isArray(accounts))
                    {
                        if(blockstrap_functions.array_length(accounts) === 1)
                        {
                            $(select).append('<option value="' + accounts[0].id + '">' + accounts[0].name + ' (' + accounts[0].currency.type + ')</option>');
                        }
                        else
                        {
                            $(select).append('<option value="">-- Select Account --</option>');
                            $.each(accounts, function(k, account)
                            {
                                $(select).append('<option value="' + account.id + '">' + account.name + ' (' + account.currency.type + ')</option>');
                            });
                        }
                    }
                });
                $($.fn.blockstrap.element).on('submit', '#blockstrap-login', function(e)
                {
                    e.preventDefault();
                    $(this).find('button[type="submit"]').trigger('click');
                });
                $($.fn.blockstrap.element).on('submit', '#verify-ownership', function(e)
                {
                    e.preventDefault();
                    $(this).find('button[type="submit"]').trigger('click');
                });
                $($.fn.blockstrap.element).on('submit', '#search-form', function(e)
                {
                    e.preventDefault();
                    $.fn.blockstrap.core.modal('Warning', 'Search functionality will be available in the next major update');
                });
            },
            get: function(file, extension, callback)
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
            },
            image: function(input, callback)
            {
                if(input.files && input.files[0]) 
                {
                    var reader = new FileReader();
                    reader.onload = function(e) 
                    {
                        var image = e.target.result;
                        callback(image);

                    };       
                    reader.readAsDataURL(input.files[0]);
                }
            },
            init: function()
            {
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                
                $.fn.blockstrap.core.publicize(function()
                {
                    // CALLBACK UPON COMPLETION
                    var init_callback = function(nav)
                    {
                        bs.core.modals();
                        bs.core.buttons();
                        bs.core.ready();

                        if($.isPlainObject(bs.styles))
                        {
                            bs.styles.set();
                        }

                        if(nav)
                        {
                            bs.core.nav(nav);
                        }

                        // SMOOTHER FADE-IN
                        $(bs.element).animate({'opacity':1}, 600, function()
                        {
                            bs.core.loading();
                            $(window).resize(function(e)
                            {
                                bs.core.resize();
                            })
                        });
                    }

                    // RESET IF REQUIRED
                    if($bs.vars('reset') === true)
                    {
                        bs.core.reset(true);
                    }
                    else if(!init_bs)
                    {
                        init_bs = true;
                        // CHECK FOR LOGIN STATUS
                        if(!bs.security.logged_in())
                        {
                            var url = '../../../blockstrap/html/bootstrap/login';
                            bs.templates.render(url, function()
                            {
                                init_callback();
                            });
                        }
                        else
                        {
                            if($.isPlainObject(bs.accounts))
                            {
                                setInterval(function()
                                {
                                    bs.accounts.poll();
                                }, bs.settings.cache.accounts);
                            }
                            if(window.location.hash)
                            {
                                bs.core.refresh(function()
                                {
                                    init_callback(window.location.hash);
                                }, $bs.slug(window.location.hash), false);
                            }
                            else
                            {
                                bs.templates.render(bs.settings.page_base, function()
                                {
                                    init_callback();
                                }, true);
                            }
                            var run_tests = false;
                            var tests = $bs.vars('tests');
                            if(tests || bs.settings.test === true) run_tests = true;
                            bs.core.tests(run_tests);
                        }
                    }                                    
                });
            },
            less: function(callback)
            {
                var use_less = true;
                if($.fn.blockstrap.settings.less === false) use_less = false;
                if(use_less)
                {
                    var less = localStorage.getItem('nw_inc_less');
                    if(blockstrap_functions.json(less)) less = $.parseJSON(less);
                    var refresh = blockstrap_functions.vars('refresh');
                    var storage = $.fn.blockstrap.settings.storage;
                    var store = true;
                    if(storage.less === false) store = false;
                    if(!less || refresh === true || store === false) 
                    {
                        $('head').append('<link rel="stylesheet/less" type="text/css" href="' + $.fn.blockstrap.settings.theme_base + $.fn.blockstrap.settings.theme + '/less/blockstrap.less">');
                        blockstrap_functions.js('js-blockstrap-less', $.fn.blockstrap.settings.core_base+'js/less.js', function()
                        {
                            var less_styles = false;
                            $('style').each(function()
                            {
                                // less-blockstrap
                                var id = $(this).attr('id');
                                var string_to_count = 'less-blockstrap';
                                var string_length = string_to_count.length;
                                if(id)
                                {
                                    var check = id.substring(0, 5);
                                    var double_check = id.substring((id.length - string_length), id.length);
                                    if(check === 'less:' && double_check === 'less-blockstrap')
                                    {
                                        less_styles = $(this).html();
                                    }
                                    if(less_styles)
                                    {
                                        if(store)
                                        {
                                            localStorage.setItem('nw_inc_less', JSON.stringify(less_styles));
                                        }
                                        if(callback) callback();
                                    }
                                }
                            })
                        });
                    }
                    else
                    {
                        $('head').append('<style id="nw-css">'+less+'</style>');
                        if(callback) callback();
                    }
                }
                else
                {
                    if(callback) callback();
                }
            },
            loaded: function()
            {
                var theme = localStorage.getItem('nw_blockstrap_theme');
                if(blockstrap_functions.json(theme)) theme = $.parseJSON(theme);
                if(theme != $.fn.blockstrap.settings.theme)
                {
                    localStorage.setItem(
                        'nw_blockstrap_theme',
                        JSON.stringify($.fn.blockstrap.settings.theme)
                    );
                }
                    $.fn.blockstrap.core.defaults();
                    $.fn.blockstrap.core.init();
            },
            loader: function(force_state, element)
            {
                var original_element = element;
                if(!element) element = $($.fn.blockstrap.element).find('#loading-blockstrap');
                if(force_state && force_state === 'open')
                {
                    $($.fn.blockstrap.element).removeClass('loading');
                }
                else if(force_state && force_state === 'close')
                {
                    $($.fn.blockstrap.element).addClass('loading');
                }
                if($(element).length < 1)
                {
                    var loader = '<div class="loading-elements" id="loading-blockstrap" style="opacity: 1; z-index: 0">';
                        loader+= '<a class="loading-elements" id="loader-wrapper" style="opacity: 1;">';
                            loader+'<span id="logo"><span>( loading )</span></span>';
                        loader+= '</a>';
                        loader+= '<span class="loading-elements" id="loader-canvas" style="opacity: 1;"><canvas class="sonic" height="400" width="400"></canvas></span>';
                    loader+= '</div>';
                    $($.fn.blockstrap.element).prepend(loader);
                    if(original_element) element = original_element;
                    else element = $($.fn.blockstrap.element).find('#loading-blockstrap');
                    
                    // IS SONIC LOADER AVAILABLE ...?
                    if($.isPlainObject(blockstrap_loader))
                    {
                        $(element).find('#loader-canvas').html(blockstrap_loader.canvas);
                        blockstrap_loader.play();
                    }
                }
                if(!$($.fn.blockstrap.element).hasClass('loading'))
                {
                    $($.fn.blockstrap.element).addClass('loading');
                    $(element).css({'opacity':1, 'z-index': 9999998});
                    $(element).find('#loader-wrapper').css({'opacity':0});
                    $(element).find('#loader-wrapper').animate({'opacity':1}, 350);
                }
                else
                {
                    $($.fn.blockstrap.element).find('.loading').removeClass('loading');
                    $(element).find('#loader-wrapper').animate({'opacity':0}, 350, function()
                    {
                        $(element).css({'opacity':0, 'z-index': 0});
                        $($.fn.blockstrap.element).removeClass('loading');
                    });
                }
            },
            loading: function()
            {
                var loaders = $($.fn.blockstrap.element).find('.loading-elements');
                $(loaders).animate({'opacity':1}).delay(0).animate({'opacity':0}, 600, function(e)
                {
                    if($(this).hasClass('loading')) $(this).removeClass('loading');
                    $($.fn.blockstrap.element).removeClass('loading');
                    $(loaders).css({'opacity':1});
                })
            },
            modal: function(title, content, id)
            {
                var selector = $('#default-modal');
                if(id) selector = $('#'+id);
                if(title) $(selector).find('.modal-title').html(title);
                if(content) $(selector).find('.modal-body').html(content);
                $(selector).modal('show');
            },
            modals: function(action)
            {
                if(action)
                {
                    if(action === 'close_all')
                    {
                        $($.fn.blockstrap.element).find('.modal').each(function(i)
                        {
                            $(this).modal('hide');
                        });
                    }
                }
                else
                {
                    $($.fn.blockstrap.element).on('show.bs.modal', '.modal', function(i)
                    {
                        var this_id = $(this).attr('id');
                        var this_form = $(this).find('form');
                        $($.fn.blockstrap.element).find('.modal').each(function(i)
                        {
                            if($(this).attr('id') != this_id)
                            {
                                $(this).modal('hide');
                            }
                        });
                        $(this_form).find('label.hidden-label').each(function(i)
                        {
                            var wrapper = $(this).parent();
                            $(wrapper).hide(0);
                        })
                        $(this).find('.qr-holder').each(function()
                        {
                            if($(this).find('img').length > 0)
                            {
                                $(this).find('img').remove();
                            }
                            $(this).qrcode({
                                render: 'image',
                                text: $(this).attr('data-content')
                            });
                        });
                        if($(this).find('.form-control').length > 0)
                        {
                            var input = $(this).find('.form-control[type!=hidden]:first');
                            $(input).focus();
                        }
                    });
                    $($.fn.blockstrap.element).on('shown.bs.modal', '.modal', function(i)
                    {
                        // .on('show.bs.modal') usually works best...
                        if($(this).find('.form-control').length > 0)
                        {
                            var input = $(this).find('.form-control[type!=hidden]:first');
                            $(input).focus();
                        }
                    });
                    $($.fn.blockstrap.element).on('show.bs.modal', '#new-account-modal', function(i)
                    {
                        if($(this).find('#more-security').html() == 'Less Security')
                        {
                            $(this).find('#more-security').trigger('click');
                        }
                    });
                }
            },
            nav: function(slug)
            {
                var nav = $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.navigation_id);
                var mnav = $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.mobile_nav_id);
                $(nav).find('.active').removeClass('active');
                $(mnav).find('.active').removeClass('active');
                if(slug.charAt(0) != '#') slug = '#' + slug;
                $(nav).find(slug).addClass('active');
                $(mnav).find(slug).addClass('active');
            },
            page: function()
            {
                if(window.location.hash)
                {
                    var slug_array = window.location.hash.split('#');
                    $.fn.blockstrap.settings.page = slug_array[1];
                }
                else
                {
                    $.fn.blockstrap.settings.page = $.fn.blockstrap.settings.page_base;
                }
                return $.fn.blockstrap.settings.page;
            },
            plugins: function(index, plugins, callback)
            {
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                if(!index) index = 0;
                if($.isArray(plugins))
                {
                    var plugin = plugins[index];
                    var plugin_url = 'plugins/' + plugin + '/' + plugin + '.js';
                    $.getScript(plugin_url, function(plugin_js)
                    {
                        if(index >= $bs.array_length(plugins) - 1)
                        {
                            if(callback) callback();
                        }
                        else
                        {
                            bs.core.plugins(index + 1, plugins, callback);
                        }
                    });
                }
            },
            print: function(contents)
            {
                var mywindow = window.open('', 'my div', 'height=500,width=400');
                mywindow.document.write('<html><head><title>my div</title>');
                mywindow.document.write('<style>.btn { display: none; }</style>');
                mywindow.document.write('</head><body >');
                mywindow.document.write(contents);
                mywindow.document.write('</body></html>');
                mywindow.print();
                mywindow.close();
                return true;
            },
            publicize: function(callback)
            {
                var bs = $.fn.blockstrap;
                var public = bs.settings.public;
                var security = bs.settings.security;
                if(public === true)
                {
                    if(!$.isPlainObject(bs.data) || !$.isFunction(bs.data.item))
                    {
                        bs.core.modal('Warning', 'Data Module Required for Publication Mode');
                    }
                    else
                    {
                        bs.data.find('blockstrap', 'salt', function(salt)
                        {
                            if(salt)
                            {
                                var obj = CryptoJS.SHA3(salt, { outputLength: 512 });
                                var hash = obj.toString().substring(0, 32);
                                if(!security && hash != security)
                                {
                                    var content = '<p>In order to determine that you are the administrator of this application, you will need to add a hash of your salt to the configuration files unders settings > security.</p><p>Please add the following hash: <strong>' + hash + '</strong></p>';
                                    bs.core.modal('Warning', content);
                                }
                                else
                                {
                                    if(security)
                                    {
                                        $.fn.blockstrap.settings.role = 'admin';
                                    }
                                    else
                                    {
                                        $.fn.blocksytrap.settings.role = 'user';
                                    }
                                    if(callback) callback();
                                }
                            }
                            else
                            {
                                if(security)
                                {
                                    $.fn.blockstrap.settings.role = 'user';
                                }
                                if(callback) callback();
                            }
                        });
                    }
                }
                else
                {
                    if(callback) callback();
                }
            },
            ready: function()
            {
                /* 

                THESE FUNCTIONS NEED TO RUN EVERY TIME
                NEW HTML IS LOADED INTO THE DOM
                
                TODO: Make tables and forms optional...?

                */
                $.fn.blockstrap.core.table();
                $.fn.blockstrap.core.forms();
                $.fn.blockstrap.core.page();

                // TODO: 
                // Handle inactive modules?
                if($.isPlainObject($.fn.blockstrap.theme))
                {
                    if($.isFunction($.fn.blockstrap.theme.new))
                    {
                        $.fn.blockstrap.theme.new();
                    }
                }
                if($.isPlainObject($.fn.blockstrap.buttons))
                {
                    if($.isFunction($.fn.blockstrap.buttons.new))
                    {
                        $.fn.blockstrap.buttons.new();
                    }
                }
            },
            refresh: function(callback, slug)
            {
                var bs = $.fn.blockstrap;
                if(!slug) slug = bs.settings.page_base;
                bs.templates.render(bs.settings.page_base, function()
                {
                    if(slug != bs.settings.page_base)
                    {
                        bs.templates.render(slug, function()
                        {
                            if(callback) callback();
                        }, false);
                    }
                    else
                    {
                        if(callback) callback();
                    }
                }, true);
            },
            reset: function(reload)
            {
                var bs = $.fn.blockstrap;
                if(reload !== false) reload = true;
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
                    bs.settings.info.storage = {
                        local: {
                            used: '' + ((JSON.stringify(localStorage).length * 2) / 1000000) + ' MB',
                            remaining: '' + ((2490000 - (JSON.stringify(localStorage).length * 2)) / 1000000) + ' MB'
                        }
                    };
                    if(reload)
                    {
                        bs.templates.render(bs.settings.page_base, function()
                        {
                            bs.core.ready();
                            bs.core.loader('close');
                        }, true);
                    }
                    else
                    {
                        var remaining = bs.settings.info.storage.local.remaining;
                        bs.core.modal('Device Reset', remaining + ' Local Storage Remaining');
                    }
                }
            },
            resize: function(delay)
            {
                if(!delay) delay = 200;
                resize_time = new Date();
                if(resize_timeout === false) 
                {
                    resize_timeout = true;
                    setTimeout($.fn.blockstrap.core.resized, delay);
                }
            },
            resized: function(delay)
            {
                if(!delay) delay = 200;
                if(new Date() - resize_time < delay) 
                {
                    setTimeout($.fn.blockstrap.core.resized, delay);
                } 
                else 
                {
                    resize_timeout = false;
                    /* 

                    THESE FUNCTIONS NEED TO RUN EVERY TIME
                    THE WINDOW IS RESIZED - TODO: NEEDS TIMER

                    */
                    $.fn.blockstrap.core.table();
                }   
            },
            salt: function(modules, callback, salt)
            {
                if(!salt) salt = $.fn.blockstrap.settings.id;
                var keys = [];
                if($.isPlainObject(modules))
                {
                    var count = 0;
                    var key_count = Object.keys(modules).length;
                    if(key_count === count)
                    {
                        callback(salt, keys);
                    }
                    else
                    {
                        $.each(modules, function(k, v)
                        {
                            count++;
                            keys.push(k);

                            if($.isArray($.fn.blockstrap.settings.store))
                            {
                                $.each($.fn.blockstrap.settings.store, function(store_index, store_key)
                                {
                                    if(store_key === k)
                                    {
                                        $.fn.blockstrap.data.save('keys', store_key, v, function()
                                        {

                                        });
                                    }
                                });
                            }

                            salt = CryptoJS.SHA3(salt+k+blockstrap_functions.slug(v), { outputLength: 512 });
                            if(count >= key_count && callback)
                            {
                                callback(salt.toString(), keys);
                            }
                        })
                    }
                }
                else
                {
                    callback(salt, keys);
                }
            },
            settings: function(element)
            {
                $.fn.blockstrap.settings.vars = blockstrap_functions.vars();
                if(blockstrap_functions.vars('less'))
                {
                    $.fn.blockstrap.settings.less = true;
                }
                if(!$.fn.blockstrap.settings.base_url)
                {
                    var base_url = window.location.href.split('#')[0];
                    $.fn.blockstrap.settings.base_url = base_url.split('?')[0];
                }
                $.fn.blockstrap.settings.info = {};

                // ESTABLISH DEFAULT ELEMENT
                if($(element).attr('src') || !element)
                {
                    element = $('#blockstrap');
                }
                $.fn.blockstrap.element = element;
                $($.fn.blockstrap.element).addClass('blockstrap-wrapper loading');

                // DATA ATTRIBUTES
                var attributes = $($.fn.blockstrap.element).data();
                
                $.each(attributes, function(key, value)
                {
                    if(typeof value == 'string')
                    {
                        var first_char = value.charAt(0);
                        var last_char = value.charAt(value.length - 1);
                        if(first_char == '[' && last_char == ']')
                        {
                            var keys = value.substr(1, value.length - 2);
                            $.fn.blockstrap.settings[key] = keys.split(', ');
                        }
                        else
                        {
                            $.fn.blockstrap.settings[key] = value;
                        }
                    }
                    else
                    {
                        $.fn.blockstrap.settings[key] = value;
                    }
                });
            },
            stringed: function(styles)
            {
                if($.isArray(styles))
                {
                    var style = {};
                    $.each(styles, function(k, v)
                    {
                        var css = v.split(', ');
                        var valued = new String(css).replace('[', '');
                        var value = valued.replace(']', '');
                        var values = value.split(': ');
                        style[values[0]] = values[1];
                    });
                    return style;
                }
            },
            table: function()
            {
                $($.fn.blockstrap.element).find('table.data-table').each(function(i)
                {
                    if($(this).hasClass('dataTable'))
                    {
                        // May need to redraw...?
                    }
                    else
                    {
                        var dom = 'tlip';
                        var order_by = 1;
                        var order = 'asc';
                        var search = false;
                        var header_cells = $(this).find('thead tr th');
                        var body_cells = $(this).find('tbody tr td');
                        if($(this).attr('data-search')) search = true;
                        if($(this).attr('data-dom')) dom = $(this).attr('data-dom');
                        if($(this).attr('data-order')) order = $(this).attr('data-order');
                        if($(this).attr('data-order-by')) order_by = parseInt($(this).attr('data-order-by'));
                        $.fn.blockstrap.core.table[$(this).attr('id')] = $(this).DataTable({
                            searching: search,
                            dom: dom,
                            order: [ order_by, order ],
                            fnDrawCallback: function(oSettings)
                            {
                                $(header_cells).each(function(i)
                                {
                                    $(this).attr('data-width', $(this).width());
                                })
                            }
                        });
                    }
                });
            },
            tests: function(run)
            {
                if(!run) run = false;
                var bs = $.fn.blockstrap;
                var set = bs.settings;
                if(run)
                {
                    bs.api.address(set.tests.api.address, 'btc', function(results)
                    {
                        console.log('address', results);
                    });
                    bs.api.transactions(set.tests.api.transactions, 'btc', function(results)
                    {
                        console.log('transactions', results);
                    });
                    bs.api.addresses(set.tests.api.addresses, 'btc', function(results)
                    {
                        console.log('addresses', results);
                    });
                    bs.api.transaction(set.tests.api.transaction, 'btc', function(results)
                    {
                        console.log('transaction', results);
                    });
                    bs.api.block(set.tests.api.block, 'btc', function(results)
                    {
                        console.log('block', results);
                    });
                    bs.api.relay(set.tests.api.relay, 'btc', function(results)
                    {
                        console.log('relay', results);
                    });
                    bs.api.unspents(set.tests.api.unspents, 'btc', function(results)
                    {
                        console.log('unspents', results);
                    });
                }
            }
        };        

        // PLUGIN CONSTRUCTOR
        function plugin(element, options, defaults)
        {
            // MERGE DEFAULT AND PLUGIN OPTIONS
            var settings = $.extend({}, defaults, options);
            $.fn.blockstrap.plugins = {};
            
            // THEN GET CONFIG FILE
            $.fn.blockstrap.core.get('themes/config', 'json', function(results)
            {
                if($.isPlainObject(results))
                {
                    $.fn.blockstrap.settings = $.extend({}, settings, results);
                    // NOW NEED TO GET THEME SPECIFIC OPTIONS AND MERGE WITH THESE
                    
                    var current_theme = $.fn.blockstrap.settings.theme;
                    $.fn.blockstrap.core.get('themes/'+current_theme+'/config', 'json', function(results)
                    {
                        if($.isPlainObject(results))
                        {
                            $.fn.blockstrap.settings = $.extend(
                                {}, 
                                $.fn.blockstrap.settings, 
                                results
                            );
                            
                            $.fn.blockstrap.core.settings(element);
                            $.fn.blockstrap.defaults();

                            var bs = $.fn.blockstrap;
                            var $bs = blockstrap_functions;
                            var dependencies = $.fn.blockstrap.settings.dependencies;
                            var modules = $.fn.blockstrap.settings.modules;
                            var bootstrap = $.fn.blockstrap.settings.bootstrap;
                            var plugins = $.fn.blockstrap.settings.plugins;

                            // LOADING SCREEN
                            // TODO: REMOVE FROM CORE...?
                            // BETTER PLACED IN THEMES...?
                            $.ajax({
                                url: $.fn.blockstrap.settings.core_base + 'html/' + 'loading.html',
                                dataType: 'HTML',
                                type: 'GET',
                                complete: function(results)
                                {
                                    var element = $.fn.blockstrap.element;
                                    var id = $.fn.blockstrap.settings.content_id;
                                    if($(element).find('#' + id).length < 1)
                                    {
                                        if(results)
                                        {
                                            if(results.responseText && results.responseText === '404')
                                            {
                                                // Do nothing!
                                            }
                                            else
                                            {
                                                var loading = results.responseText;
                                                $($.fn.blockstrap.element).append(loading);
                                            }
                                        }
                                    }
                                }
                            });

                            // UPDATE CORE IF REQUIRED
                            $bs.update(bs.settings.v, function()
                            {
                                // USE LESS.css ...?
                                bs.core.less(function()
                                {
                                    // INSERT CSS
                                    bs.core.css(function()
                                    {
                                        if($.isArray(dependencies))
                                        {
                                            // INCLUDE JS DEPENDENCIES
                                            $bs.include(bs, 0, dependencies, function()
                                            {
                                                if($.isArray(modules))
                                                {
                                                    // INCLUDE JS MODULES
                                                    $bs.include(bs, 0, modules, function()
                                                    {
                                                        $.fn.blockstrap.snippets = {};
                                                        if($.isArray(bootstrap))
                                                        {
                                                            // INCLUDE BOOTSTRAP COMPONENTS
                                                            bs.core.bootstrap(0, bootstrap, function()
                                                            {
                                                                if($.isArray(plugins))
                                                                {
                                                                    // FINISH WITH PLUGINS
                                                                    bs.core.plugins(0, plugins, function()
                                                                    {
                                                                        bs.core.loaded(); 
                                                                    });
                                                                }
                                                                else
                                                                {
                                                                    bs.core.loaded(); 
                                                                }
                                                            })
                                                        }
                                                        else
                                                        {
                                                            if($.isArray(plugins))
                                                            {
                                                                // FINISH WITH PLUGINS
                                                                bs.core.plugins(0, plugins, function()
                                                                {
                                                                    bs.core.loaded(); 
                                                                });
                                                            }
                                                            else
                                                            {
                                                                bs.core.loaded();
                                                            }
                                                        }
                                                    });
                                                }
                                                else
                                                {
                                                    if($.isArray(plugins))
                                                    {
                                                        // FINISH WITH PLUGINS
                                                        bs.core.plugins(0, plugins, function()
                                                        {
                                                            bs.core.loaded(); 
                                                        });
                                                    }
                                                    else
                                                    {
                                                        bs.core.loaded();
                                                    }
                                                }
                                            }, true);
                                        }
                                        else
                                        {
                                            if($.isArray(modules))
                                            {
                                                // INCLUDE JS MODULES
                                                $bs.include(bs, 0, modules, function()
                                                {
                                                    $.fn.blockstrap.snippets = {};
                                                    if($.isArray(bootstrap))
                                                    {
                                                        // INCLUDE BOOTSTRAP COMPONENTS
                                                        bs.core.bootstrap(0, bootstrap, function()
                                                        {
                                                            if($.isArray(plugins))
                                                            {
                                                                // FINISH WITH PLUGINS
                                                                bs.core.plugins(0, plugins, function()
                                                                {
                                                                    bs.core.loaded(); 
                                                                });
                                                            }
                                                            else
                                                            {
                                                                bs.core.loaded();
                                                            }
                                                        })
                                                    }
                                                    else
                                                    {
                                                        if($.isArray(plugins))
                                                        {
                                                            // FINISH WITH PLUGINS
                                                            bs.core.plugins(0, plugins, function()
                                                            {
                                                                bs.core.loaded(); 
                                                            });
                                                        }
                                                        else
                                                        {
                                                            bs.core.loaded();
                                                        }
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                if($.isArray(plugins))
                                                {
                                                    // FINISH WITH PLUGINS
                                                    bs.core.plugins(0, plugins, function()
                                                    {
                                                        bs.core.loaded(); 
                                                    });
                                                }
                                                else
                                                {
                                                    bs.core.loaded();
                                                }
                                            }
                                        }
                                    });
                                });
                            });
                        }
                    });
                }
            });
        }                     
        
        $.ajax({
            url: 'defaults.json',
            dataType: 'json',
            success: function(defaults)
            {
                // CONSTRUCT PLUGIN AFTER
                // FIRST COLLECTING DEFAULTS
                plugin(false, false, defaults);
            }
        });
    })
    (jQuery, window, document);
};

/*
 
CORE FUNCTIONS 

THESE ARE ALSO REQUIRED BEFORE RELEVANT MODULES HAVE BEEN LOADED

NONETHELESS - THIS SHOULD BE AS SHORT AS POSSIBLE

PERHAPS ONE DAY EVEN NON-EXISTENT :-)
 
*/
var blockstrap_js_files = {};
var blockstrap_outputted = false;
var blockstrap_functions = {
    array_length: function(obj)
    {
        length = 0;
        if(obj) length = Object.keys(obj).length;
        return length;
    },
    exists: function(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    },
    include: function(blockstrap, start, files, callback, dependency)
    {
        var head = document.getElementsByTagName('head')[0];
        var refresh = blockstrap_functions.vars('refresh');
        var storage = blockstrap.settings.storage;
        var limit = files.length;
        
        if(!dependency) dependency = false;
        if(!start) start = 0;
        
        if($.isArray(files) && files[start])
        {
            var js = '';
            var file_name = files[start];
            var js_file = localStorage.getItem('nw_js_'+file_name);
            var store = true;
            
            if(blockstrap_functions.json(js_file)) js_file = $.parseJSON(js_file);
            
            if(!dependency)
            {
                if(storage.modules === false) store = false;
            }
            else
            {
                if(storage.dependencies === false) store = false;
            }
            
            if(blockstrap.settings.cascade === false)
            {
                if(!js_file || refresh === true)
                {
                    $.getScript(file_name + '.js', function(js)
                    {
                        if(store === true)
                        {
                            localStorage.setItem('nw_js_'+file_name, js);
                        }
                        start++;
                        blockstrap_functions.include(
                            blockstrap, 
                            start, 
                            files, 
                            callback, 
                            dependency
                        );
                    });
                }
                else
                {
                    start++;
                    var new_script = document.createElement("script");
                    new_script.setAttribute('type', 'text/javascript');
                    new_script.setAttribute('id', file_name);
                    new_script.text = js_file;
                    head.appendChild(new_script);
                    blockstrap_functions.include(
                        blockstrap, 
                        start, 
                        files, 
                        callback, 
                        dependency
                    );
                }
            }
            else if(!js_file || refresh || store === false)
            {
                // INCLUDE CORE
                var filename = blockstrap.settings.core_base + blockstrap.settings.dependency_base + file_name + '.js';
                if(!dependency)
                {
                    filename = blockstrap.settings.core_base + blockstrap.settings.module_base + file_name + '.js';
                }
                $.getScript(filename, function(core_js)
                {

                    if(core_js != '404')
                    {
                        js+= "\n" + core_js;
                    }
                    
                    var theme_filename = 'themes/'+blockstrap.settings.theme+'/js/dependencies/' + file_name + '.js';
                    if(!dependency)
                    {
                        theme_filename = 'themes/'+blockstrap.settings.theme+'/js/modules/' + file_name + '.js';
                    }
                    $.getScript(theme_filename, function(theme_js)
                    {
                        if(theme_js != '404')
                        {
                            js+= "\n" + theme_js;
                        }

                        if(store === true)
                        {
                            localStorage.setItem('nw_js_'+file_name, js);
                        }
                        
                        start++;
                        blockstrap_functions.include(blockstrap, start, files, callback, dependency);
                    });
                });

            }
            else
            {
                start++;
                var new_script = document.createElement("script");
                new_script.setAttribute('type', 'text/javascript');
                new_script.setAttribute('id', file_name);
                new_script.text = js_file;
                head.appendChild(new_script);
                blockstrap_functions.include(blockstrap, start, files, callback, dependency);
            }
        }
        else
        {
            if(callback) callback();
        }
    },
    initialize: function()
    {
        if(!blockstrap_outputted) 
        {
            blockstrap_outputted = true;
            if(typeof(jQuery) === 'undefined') 
            {
                blockstrap_functions.js(
                    'js-blockstrap-jquery', 
                    'blockstrap/js/dependencies/jquery.min.js', 
                    function()
                    {
                        blockstrap_core();
                    }
                );
            } 
            else 
            {
                blockstrap_core();
            }
        }
    },
    js: function(id, src, callback)
    {
        var t = document.getElementsByTagName('head')[0];
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', src);
        s.setAttribute('id', id);
        s.onload = function()
        {
            callback();
        }
        t.appendChild(s);
    },
    json: function(string)
    {
        try
        {
            var json = $.parseJSON(string);
            if(json) return true;
            else return false;
        }
        catch(error)
        {
            return false;
        }
    },
    slug: function(slug)
    {
        var name = slug.replace(/ /g, '_');
        name = name.replace(/-/g, '_');
        name = name.replace(/'/g, '');
        name = name.replace(/"/g, '');
        name = name.replace(/#/g, '');
        return name.toLowerCase();
    },
    unslug: function(slug)
    {
        var name = slug.replace(/_/g, ' ');
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
    update: function(version, callback)
    {
        var current_version_array = version.split('.');
        var results = localStorage.getItem('nw_blockstrap_v');
        var stored_version_array = false;
        if(results) stored_version_array = $.parseJSON(results).split('.');
        if($.isArray(stored_version_array))
        {
            $.each(stored_version_array, function(k, v)
            {
                if(parseInt(current_version_array[k]) > parseInt(v))
                {
                    $.fn.blockstrap.settings.vars.refresh = true;
                    callback();
                }
                if(k >= (blockstrap_functions.array_length(stored_version_array) - 1))
                {
                    localStorage.setItem('nw_blockstrap_v', JSON.stringify(version));
                    callback();
                }
            })
        }
        else
        {
            $.fn.blockstrap.settings.vars.refresh = true;
            localStorage.setItem('nw_blockstrap_v', JSON.stringify(version));
            callback();
        }
    },
    vars: function(variable)
    {
        var bs = $.fn.blockstrap;
        if(!variable) variable = false;
        if(variable == 'refresh' && $.isPlainObject(bs.settings) && bs.settings.refresh === true)
        {
            return true;
        }
        else if(variable)
        {
            if($.fn.blockstrap.settings.vars[variable])
            {
                return $.fn.blockstrap.settings.vars[variable];
            }
            else
            {
                return false;
            }
        }
        else
        {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            var original_vars = vars;
            vars = {};
            for(var i=0;i<original_vars.length;i++) 
            {
                var pair = original_vars[i].split("=");
                var value = pair[1];
                if(value === 'false') value = false;
                if(value === 'true') value = true;
                vars[pair[0]] = value;
            }
            return vars;
        }
    }
};
var blockstrap_js_scripts;
window.onload = function()
{
    blockstrap_functions.initialize();
}