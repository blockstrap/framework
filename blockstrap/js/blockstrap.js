/*
 * 
 *  Blockstrap v0.6.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 *  -- Including this file in the HTML header is the only requirement
 *  -- Everything else, including the loading of dependencies is handled here
 *  
 */

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
        var test_results = '';
        var bs_hooks = {};
        var bs_vars = {};
        var full_results = {};
        
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
        
        $.fn.blockstrap.plugins = {};
        $.fn.blockstrap.patches = {};
        
        // IN-ESCAPABLE INCLUDES
        $.fn.blockstrap.defaults = function()
        {
            if(typeof $.fn.blockstrap.settings.install === 'undefined')
            {
                $.fn.blockstrap.settings.install = true;
            }
            if($.fn.blockstrap.settings.install === false)
            {
                $.fn.blockstrap.settings.cache = false;
            }
            if($.fn.blockstrap.settings.cascade === true && $.fn.blockstrap.settings.install != false)
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
        }
        
        // CORE FUNCTIONS
        $.fn.blockstrap.core = {
            ago: function(time)
            {
                var date = new Date();
                if(time) date = new Date(time * 1000);
                return jQuery.timeago(date)
            },
            add_action: function(hook, key, bs_module, bs_function, vars)
            {
                if(typeof bs_hooks[hook] == 'undefined') bs_hooks[hook] = {};
                if(typeof bs_vars[hook] == 'undefined') bs_vars[hook] = {};
                if(bs_module.indexOf(".") > -1)
                {
                    var bs_module_array = bs_module.split('.');
                    bs_hooks[hook][key] = $.fn.blockstrap[bs_module_array[0]][bs_module_array[1]][bs_function];
                }
                else
                {
                    bs_hooks[hook][key] = $.fn.blockstrap[bs_module][bs_function];
                }
                bs_vars[hook][key] = vars;
            },
            add_commas: function(num)
            {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            add_filter: function(hook, key, bs_module, bs_function, vars)
            {
                if(typeof bs_hooks[hook] == 'undefined') bs_hooks[hook] = {};
                if(typeof bs_vars[hook] == 'undefined') bs_vars[hook] = {};
                if(bs_module.indexOf(".") > -1)
                {
                    var bs_module_array = bs_module.split('.');
                    bs_hooks[hook][key] = $.fn.blockstrap[bs_module_array[0]][bs_module_array[1]][bs_function];
                }
                else
                {
                    bs_hooks[hook][key] = $.fn.blockstrap[bs_module][bs_function];
                }
                bs_vars[hook][key] = vars;
            },
            api: function(default_service)
            {
                api = 'spinal';
                if(typeof $.fn.blockstrap.settings.default_api != 'undefined')
                {
                    api = $.fn.blockstrap.settings.default_api;
                }
                if(typeof default_service != 'undefined') api = default_service;
                if(
                    typeof $.fn.blockstrap.api != 'undefined'
                    && typeof $.fn.blockstrap.api.api_service != 'undefined'
                ){
                    api = $.fn.blockstrap.api.api_service;
                }
                if($.fn.blockstrap.core.option('api_service'))
                {
                    api = $.fn.blockstrap.core.option('api_service');
                    if(
                        typeof $.fn.blockstrap.api != 'undefined'
                        && typeof $.fn.blockstrap.api.api_service != 'undefined'
                    ){
                        $.fn.blockstrap.api.api_service = api;
                    }
                }
                return api;
            },
            apis: function(property, api_provider)
            {
                var result = false;
                var api = $.fn.blockstrap.core.api();
                if(typeof api_provider != 'undefined' && api_provider)
                {
                    api = api_provider;
                }
                if(
                    typeof $.fn.blockstrap.settings.keys != 'undefined'
                    && typeof $.fn.blockstrap.settings.keys.apis[api] != 'undefined'
                    && typeof $.fn.blockstrap.settings.keys.apis[api][property] != 'undefined'
                ){
                    result = $.fn.blockstrap.settings.keys.apis[api][property];
                }
                else if(
                    typeof $.fn.blockstrap.settings.keys != 'undefined'
                    && typeof $.fn.blockstrap.settings.apis != 'undefined'
                    && typeof $.fn.blockstrap.settings.apis.defaults[api] != 'undefined'
                    && typeof $.fn.blockstrap.settings.apis.defaults[api][property] != 'undefined'
                ){
                    result = $.fn.blockstrap.settings.apis.defaults[api][property];
                }
                return result;
            },
            apply_actions: function(hook, callback, options)
            {
                if(
                    typeof bs_hooks[hook] != 'undefined' 
                    && $.isPlainObject(bs_hooks[hook])
                ){
                    $.each(bs_hooks[hook], function(key, func)
                    {
                        func(bs_vars[hook][key], callback, options);
                    });
                }
                else if(typeof callback == 'function')
                {
                    callback();
                }
            },
            apply_filters: function(hook, defaults, options)
            {
                var results = defaults;
                if(
                    typeof bs_hooks[hook] != 'undefined' 
                    && $.isPlainObject(bs_hooks[hook])
                ){
                    $.each(bs_hooks[hook], function(key, func)
                    {
                        results = func(bs_vars[hook][key], options);
                    });
                }
                return results;
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

                $('.bs.installing').attr('data-loading-content','Now Installing ' + (index + 1) + ' of  '+blockstrap_functions.array_length(bootstrap)+' Bootstrap Snippets');

                var store = false;
                var refresh = blockstrap_functions.vars('refresh');
                var snippet = localStorage.getItem('nw_boot_'+key);
                var cache = $.fn.blockstrap.settings.cache;
                if(cache.bootstrap === true) store = true;

                if(snippet && store && refresh !== true)
                {
                    bs.core.boot(bootstrap, key, snippet, index, callback);
                }
                else
                {
                    bs.core.get(url, 'html', function(html)
                    {
                        if(store === true)
                        {
                            localStorage.setItem('nw_boot_'+key, html);
                        }
                        bs.core.boot(bootstrap, key, html, index, callback);
                    });
                }
            },
            buttons: function(classes, ids)
            {
                var bs = $.fn.blockstrap;
                var button_ids = bs.settings.buttons.ids;
                var button_classes = bs.settings.buttons.classes;
                if(typeof classes != 'undefined' && $.isArray(classes))
                {
                    button_classes = classes;
                }
                if(typeof ids != 'undefined' && $.isArray(ids))
                {
                    button_ids = ids;
                }
                if($.isArray(button_ids))
                {
                    $.each(button_ids, function(k, id_name)
                    {
                        var key = id_name;
                        var id_name = '#' + key;
                        key = key.replace(/-/g, '_');
                        $(bs.element).on('click', id_name, function(e)
                        {
                            if($.isPlainObject(bs.buttons) && $.isFunction(bs.buttons[key]))
                            {
                                bs.buttons[key](this, e);
                            }
                            else if($.isPlainObject(bs.theme) && $.isFunction(bs.theme.buttons[key]))
                            {
                                bs.theme.buttons[key](this, e);
                            }
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
                            if($.isPlainObject(bs.buttons) && $.isFunction(bs.buttons[key]))
                            {
                                bs.buttons[key](this, e);
                            }
                            else if($.isPlainObject(bs.theme) && $.isFunction(bs.theme.buttons[key]))
                            {
                                bs.theme.buttons[key](this, e);
                            }
                        });
                    });
                }
            },
            confirm: function(title, content, confirmed_callback, cancel_callback)
            {
                $('#confirm-modal form, #confirm-modal .btn-success, #confirm-modal .btn-danger').unbind();
                $.fn.blockstrap.core.modal(title, content, 'confirm-modal');
                $('#confirm-modal form').bind('submit', function()
                {
                    if(confirmed_callback) confirmed_callback(true);
                });
                $('#confirm-modal .btn-success').bind('click', function()
                {
                    if(confirmed_callback) confirmed_callback(true);
                });
                $('#confirm-modal .btn-danger').bind('click', function()
                {
                    if(cancel_callback) cancel_callback(false);
                });
                $($.fn.blockstrap.element).on('hide.bs.modal', '#confirm-modal', function()
                {
                    if(cancel_callback) cancel_callback(false);
                });
            },
            css: function(callback, files)
            {
                var skin = false;
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                var theme = $.fn.blockstrap.settings.theme;
                var core_css = $.fn.blockstrap.settings.core_base + 'css/';
                var theme_css = $.fn.blockstrap.settings.theme_base + theme + '/css/';
                var css_files = $.fn.blockstrap.settings.css;
                var install = $.fn.blockstrap.settings.install;
                if(typeof files != 'undefined' && $.isArray(files)) css_files = files;
                if(css_files && $.isArray(css_files) && install === true)
                {
                    var file_len = Object.keys(css_files).length;
                    $.each(css_files, function(k, v)
                    {
                        var called = false;   
                        var css = localStorage.getItem('nw_inc_css_'+v);
                        if(blockstrap_functions.json(css)) css = $.parseJSON(css);
                        var refresh = blockstrap_functions.vars('refresh');
                        var cache = bs.settings.cache;
                        var store = true;
                        if(typeof cache != 'undefined' && cache.css === false) store = false;
                        if(!css || refresh === true || store === false) 
                        {
                            // FETCH CSS?
                            blockstrap_functions.exists(theme_css+v+'.css', function(success)
                            {
                                if(success === true)
                                {
                                    blockstrap_functions.get_css(theme_css+v+'.css', store, v);
                                    if((k+1) >= file_len)
                                    {
                                        if(!called)
                                        {
                                            called = true;
                                            callback();
                                        }
                                    }
                                }
                                else
                                {
                                    blockstrap_functions.exists(core_css+v+'.css', function(success)
                                    {
                                        if(success === true)
                                        {
                                            blockstrap_functions.get_css(core_css+v+'.css', store, v);
                                            if((k+1) >= file_len)
                                            {
                                                if(!called)
                                                {
                                                    called = true;
                                                    callback();
                                                }
                                            }
                                        }
                                    });
                                }
                            })
                        }
                        else
                        {
                            var styleSheet = document.createElement("link");
                            for(var key in css) 
                            {
                                styleSheet.setAttribute(key, css[key]);
                            }
                            var head = document.getElementsByTagName("head")[0];
                            head.appendChild(styleSheet);
                            if((k+1) >= file_len)
                            {
                                if(!called)
                                {
                                    called = true;
                                    callback();
                                }
                            }
                        }
                    });
                    if(typeof $.fn.blockstrap.settings.skin != 'undefined' && $.fn.blockstrap.settings.skin)
                    {
                        skin = $.fn.blockstrap.settings.skin;
                        var skin_url = $.fn.blockstrap.settings.theme_base + theme + '/skins/' + skin + '/css/styles.css';
                        blockstrap_functions.get_css(skin_url, true, skin);
                    }
                }
                else
                {
                    callback();
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
            filters: function(page)
            {
                if(page == 'send' && $('form#payment-form input#from_account').val() != 'false')
                {
                    var from = '';
                    var form = $('#main-content form#payment-form');
                    var select = $(form).find('select#from');
                    if($(form).find('input#from_account').val())
                    {
                        from = $(form).find('input#from_account').val();
                        var input = '<input type="text" readonly="readonly" value="'+from+'" id="'+$(select).attr('id')+'" class="'+$(select).attr('class')+'" />';
                        $(select).parent().html(input);
                    }
                    var to = $(form).find('#to');
                    var amount = $(form).find('#amount');
                    $(to).attr('readonly', 'readonly');
                    $(to).parent().find('.btn-toggle').remove();
                    $(amount).attr('readonly', 'readonly');
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
                        else if(key.substring(0, 12) == 'nw_contacts_')
                        {
                            if(!$.isArray(objs['nw_contacts']))
                            {
                                objs['nw_contacts'] = [];
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
                $($.fn.blockstrap.element).on('change', 'input#import_file', function(i)
                {
                    $.fn.blockstrap.core.txt(this, function(txt)
                    {
                        $($.fn.blockstrap.element).find('textarea#import-data').val(txt);
                        $($.fn.blockstrap.element).find('button#submit-import').trigger('click');
                    });
                });
                $($.fn.blockstrap.element).on('change', '#access-account', function(i)
                {
                    var value = $(this).val();
                    var account_id = $(this).attr('data-account-id');
                    var chain = $(this).attr('data-chain');
                    if(value === 'print')
                    {
                        // DEFINITELY NOT CORE MATERIAL
                        // DIRTY HACK FOR ADAMS DEMO
                        var modal = $(this).parent().parent().parent().parent().parent().parent().parent();
                        var title = $(modal).find('.modal-title').text();
                        var contents = $(modal).find('.modal-body').html();
                        $.fn.blockstrap.core.print(title, contents);
                    }
                    else if(value === 'access')
                    {
                        $.fn.blockstrap.accounts.access(account_id, false, chain);
                    }
                    else if(value === 'import')
                    {
                        var account = $.fn.blockstrap.accounts.get(account_id, false)[chain];
                        var fee = $.fn.blockstrap.settings.blockchains[chain].fee;
                        var options = {
                            css: 'form-horizontal bs',
                            objects: [
                                {
                                    id: 'import-key',
                                    fields: [
                                        {
                                            inputs: {
                                                id: 'private-key',
                                                type: 'text',
                                                label: {
                                                    css: 'col-xs-3',
                                                    text: 'Private Key'
                                                },
                                                wrapper: {
                                                    css: 'col-xs-9'
                                                },
                                                placeholder: 'Private Key to Transfer Funds From'
                                            }
                                        },
                                        {
                                            inputs: {
                                                id: 'to-address',
                                                type: 'text',
                                                label: {
                                                    css: 'col-xs-3',
                                                    text: 'Address'
                                                },
                                                wrapper: {
                                                    css: 'col-xs-9'
                                                },
                                                value: account.address,
                                                placeholder: 'Need to Send Funds Somewhere'
                                            }
                                        },
                                        {
                                            hiddens: {
                                                id: 'chain',
                                                value: chain
                                            }
                                        }
                                    ]
                                }
                            ],
                            data: [
                                {
                                    key: "autocomplete",
                                    value: "off"
                                },
                                {
                                    key: "data-function",
                                    value: "import_key"
                                }
                            ],
                            buttons: {
                                forms: [
                                    {
                                        id: 'cancel-verification',
                                        css: 'btn-danger pull-right btn-split',
                                        text: 'Cancel',
                                        type: 'button',
                                        attributes: [
                                            {
                                                key: 'data-dismiss',
                                                value: 'modal'
                                            }
                                        ]
                                    },
                                    {
                                        type: "submit",
                                        id: "submit-import-key",
                                        css: 'btn-primary pull-right btn-split',
                                        text: 'Transfer Funds'
                                    }
                                ]
                            }
                        };
                        var form = $.fn.blockstrap.forms.process(options);
                        var intro = '<p>Please note that since we do not store private keys anywhere we cannot actually import the keys. Instead, <strong>what this function really does</strong> is that it first checks the balance of the address belonging to the private key and then sends the balance (minus the network fee) to the address specified below.</p><p><strong>Again, please be warned</strong> that using this function will remove all of the available funds from the address belonging to the imported private key and transfer those funds to the specified address below:</p>';
                        $.fn.blockstrap.core.modal('Import Private Key', intro + form);
                    }
                });
                $($.fn.blockstrap.element).on('change', '#api_service', function(i)
                {
                    var value = $(this).val();
                    $.fn.blockstrap.api.api_service = value;
                });
                $($.fn.blockstrap.element).find('.bs-blockchain-select').each(function(i)
                {
                    var select = $(this);
                    var hd = false;
                    var prepend = false;
                    var blockchains = $.fn.blockstrap.settings.blockchains;
                    if($(select).hasClass('hd')) hd = true;
                    if($(select).hasClass('prepend')) prepend = true;
                    $(select).html('');
                    if($.isPlainObject(blockchains))
                    {
                        if(prepend === true && hd === true)
                        {
                            $(select).append('<option value="hd">-- HD (All Chains) --</option>');
                        }
                        else
                        {
                            $(select).append('<option value="">-- Select Blockchain --</option>');
                        }
                        $.each(blockchains, function(blockchain, v)
                        {
                            if(typeof v.private == 'undefined')
                            {
                                if(typeof v.apis[$.fn.blockstrap.core.api()] != 'undefined')
                                {
                                    $(select).append('<option value="'+blockchain+'">'+v.blockchain+'</option>');
                                }
                            }
                        });
                        if(prepend === false && hd === true)
                        {
                            $(select).append('<option value="hd">-- HD (All Chains) --</option>');
                        }
                    }
                });
                $($.fn.blockstrap.element).find('.bs-insert-salt').each(function(i)
                {
                    var input = this;
                    $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
                    {
                        $(input).val(salt);
                    });
                });
                $($.fn.blockstrap.element).find('.bs-api-select').each(function(i)
                {
                    var select = $(this);
                    var apis = $.fn.blockstrap.settings.apis.available;
                    var current_api = $.fn.blockstrap.core.api();
                    $(select).html('');
                    if(typeof apis != 'undefined' && $.isPlainObject(apis))
                    {
                        $.each(apis, function(service, name)
                        {
                            var selected = '';
                            if(service == current_api) selected = 'selected="selected"';
                            $(select).append('<option value="' + service + '" '+selected+'>' + name + '</option>');
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
                        $(select).append('<option value="">-- Select Account --</option>');
                        $.each(accounts, function(k, account)
                        {
                            $.each(account.blockchains, function(code, chain)
                            {
                                $(select).append('<option value="' + account.id + '" data-chain="' + code +'">' + account.name + ' (' + chain.type + ')</option>');
                            });
                        });
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
                $($.fn.blockstrap.element).find('form').each(function(i)
                {
                    var form = $(this);
                    $(form).find('input[type="pass"]:eq(0)').before('<input type="text" tabindex="-2" style="display: none;" id="temp_un" /><input type="password" tabindex="-1" style="display: none;" id="temp_pw" />');
                    $(form).find('input[type="pass"]').on('focus', function()
                    {
                        $(this).attr('type', 'password');
                        setTimeout(function()
                        {
                            $(form).find('input#temp_un').remove();
                            $(form).find('input#temp_pw').remove();
                        }, $.fn.blockstrap.core.timeouts('remove_temp_password'));
                    });
                    if($(this).find('[type="submit"]').length < 1)
                    {
                        $(form).find('input').keypress(function(e) 
                        {
                            // Enter pressed?
                            if(e.which == 10 || e.which == 13) 
                            {
                                if(
                                    $(form).attr('id') == 'blockstrap-setup-step1-left'
                                    || $(form).attr('id') == 'blockstrap-setup-step1-right'
                                    || $(form).attr('id') == 'blockstrap-setup-step2-left'
                                    || $(form).attr('id') == 'blockstrap-setup-step2-right'
                                ){
                                    $($.fn.blockstrap.element).find('#next-step').trigger('click');
                                }
                                else
                                {
                                    $(form).submit();
                                }
                            }
                        });
                    }
                });
                $($.fn.blockstrap.element).on('submit', '#search-form', function(e)
                {
                    e.preventDefault();
                    var results = {
                        accounts: [],
                        contacts: []
                    };
                    var bs = $.fn.blockstrap;
                    var form = this;
                    var term = $(form).find('#search-term').val();
                    var title = 'No Results';
                    var contents = 'We were unable to fnd any results matching your search';
                    var accounts = bs.accounts.get();
                    var contacts = bs.contacts.get();
                    $.each(accounts, function(k, account)
                    {
                        if(
                            account.id.indexOf(term.toLowerCase()) > -1
                        ){
                            results.accounts.push(account);
                        }
                        else
                        {
                            var pushed = false;
                            $.each(account.blockchains, function(chain, blockchain)
                            {
                                if(!pushed && blockchain.address.indexOf(term) > -1)
                                {
                                    pushed = true;
                                    results.accounts.push(account);
                                }
                            });
                        }
                    });
                    $.each(contacts, function(k, contact)
                    {
                        if(
                            contact.id.indexOf(term.toLowerCase()) > -1
                        ){
                            results.contacts.push(contact);
                        }
                        else
                        {
                            var pushed = false;
                            $.each(contact.blockchains, function(key, blockchain)
                            {
                                if(!pushed && blockchain.addresses[0].key.indexOf(term) > -1)
                                {
                                    pushed = true;
                                    results.contacts.push(contact);
                                }
                            });
                        }
                    });
                    if(
                        blockstrap_functions.array_length(results.accounts) > 0
                        || blockstrap_functions.array_length(results.contacts) > 0
                    ){
                        title = 'Results';
                        contents = '';
                        if(blockstrap_functions.array_length(results.accounts))
                        {
                            contents+= '<p>The following accounts match your search:</p>';
                            $.each(results.accounts, function(k, result)
                            {
                                contents+= '<p><strong>'+result.name+'</strong>:<br />';
                                $.each(result.blockchains, function(chain, blockchain)
                                {
                                    if(blockchain.address.indexOf(term) > -1)
                                    {
                                        contents+= blockchain.type+' Address: <code>'+blockchain.address+'</code><br />';
                                    }
                                    else
                                    {
                                        contents+= blockchain.type+' Address: '+blockchain.address+'<br />';
                                    }
                                });
                                contents+= '</p>';
                            });
                        }
                        if(blockstrap_functions.array_length(results.contacts))
                        {
                            contents+= '<p>The following contacts match your search:</p>';
                            $.each(results.contacts, function(k, result)
                            {
                                contents+= '<p><strong>'+result.name+'</strong>:<br />';
                                $.each(result.blockchains, function(key, blockchain)
                                {
                                    if(blockchain.addresses[0].key.indexOf(term) > -1)
                                    {
                                        contents+= blockchain.blockchain+' Address: <code>'+blockchain.addresses[0].key+'</code><br />';
                                    }
                                    else
                                    {
                                        contents+= blockchain.blockchain+' Address: '+blockchain.addresses[0].key+'<br />';
                                    }
                                });
                                contents+= '</p>';
                            });
                        }
                    }
                    bs.core.modal(title, contents);
                });
                // TODO - DEAL WITH THIS PROPERLY
                if($('#blockstrap-login').length > 0)
                {
                    setTimeout(function()
                    {
                        $('#blockstrap-login #login-username').val('');
                        $('#blockstrap-login #login-password').val('');
                    }, $.fn.blockstrap.core.timeouts('clear_forms'));
                }
            },
            get: function(file, extension, callback, skip, cached)
            {
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                var saved_file = localStorage.getItem('nw_inc_file_'+file+'_'+extension);
                if($bs.json(saved_file)) saved_file = $.parseJSON(saved_file);
                var refresh = $bs.vars('refresh');
                var store = true;
                var cache = bs.settings.cache;
                if(typeof cache != 'undefined' && cache[extension] === false)
                {
                    store = false;
                }
                if(refresh === true) cached = false;
                if(!saved_file || refresh === true || store === false || skip === true)
                {
                    if(typeof cache == 'undefined') cache = true;
                    if(typeof skip == 'undefined' || !skip)
                    {
                        $.ajax({
                            url: file + '.' + extension,
                            dataType: extension,
                            cache: cached,
                            async: false,
                            success: function(results)
                            {
                                if(store === true)
                                {
                                    localStorage.setItem('nw_inc_file_'+file+'_'+extension, JSON.stringify(results));
                                }
                                if(callback) callback(results, file, extension);
                            },
                            error: function(results)
                            {
                                if(callback) callback(results, file, extension);
                            }
                        });
                    }
                    else
                    {
                        if(callback) callback({}, file, extension);
                    }
                }
                else
                {
                    if(callback) callback(saved_file, file, extension);
                }
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
                // TODO: WHY SLOW THINGS DOWN
                // NEED TO WAIT FOR MARKET STATS?
                // MANUAL INSTALL NEEDS TIME FOR INCLUDES TOO?
                setTimeout(function()
                {
                    
                    var bs = $.fn.blockstrap;
                    var $bs = blockstrap_functions;
                    bs.core.apply_actions('init', function()
                    {
                        $.fn.blockstrap.core.publicize(function()
                        {
                            // CALLBACK UPON COMPLETION
                            var init_callback = function(nav)
                            {
                                bs.core.modals();
                                bs.core.buttons();

                                // START OF BETTER CORE FORMS CLASS...?
                                $($.fn.blockstrap.element).on('submit', 'form.bs', function(e)
                                {
                                    e.preventDefault();
                                    var form = this;
                                    var func = $(form).attr('data-function');
                                    var vars = $(form).data();
                                    if(typeof func != 'undefined' && typeof $.fn.blockstrap.forms[func] == 'function')
                                    {
                                        $.fn.blockstrap.forms[func](form, vars);
                                    }
                                });

                                if($.isPlainObject(bs.styles))
                                {
                                    bs.styles.set();
                                }

                                if(nav)
                                {
                                    bs.core.nav(nav);
                                }

                                bs.core.loader('close');

                                bs.core.apply_actions('init_callback', function()
                                {
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
                                    if(typeof bs.accounts != 'undefined' && $.isPlainObject(bs.accounts))
                                    {
                                        if(
                                            typeof bs.settings.cache == 'undefined'
                                            || bs.settings.cache == false
                                        ){
                                            bs.settings.cache = {};
                                            bs.settings.cache.accounts = 60000;
                                        }
                                        if(
                                            (
                                                typeof bs.settings.account_poll != 'undefined'
                                                && bs.settings.account_poll != false
                                            )
                                            ||
                                            typeof bs.settings.account_poll == 'undefined'
                                        ){
                                            bs.accounts.poll(0, function(poll)
                                            {
                                                setTimeout(function()
                                                {
                                                    bs.accounts.poll(0, false, true, bs.settings.cache.accounts);
                                                }, bs.settings.cache.accounts);
                                            });
                                        }
                                    }
                                    if(window.location.hash)
                                    {
                                        $.fn.blockstrap.core.refresh(function()
                                        {
                                            init_callback(window.location.hash.substring(1));
                                            $('.bs.loading').removeClass('loading');
                                        }, $bs.slug(window.location.hash));
                                    }
                                    else
                                    {
                                        $.fn.blockstrap.core.refresh(function()
                                        {
                                            init_callback();
                                            $('.bs.loading').removeClass('loading');
                                        }, bs.settings.page_base);
                                    }
                                    var run_tests = false;
                                    var tests = $bs.vars('tests');
                                    if(tests || bs.settings.test === true) run_tests = true;
                                    bs.core.tests(run_tests);
                                }
                            } 
                        });
                    });
                }, $.fn.blockstrap.core.timeouts('delayed_init'));
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
                    var cache = $.fn.blockstrap.settings.cache;
                    var store = true;
                    if(cache.less === false) store = false;
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
            loaded: function(saved_version, this_version, refresh)
            {
                $.fn.blockstrap.core.upgrade(saved_version, this_version, refresh, function()
                {
                    if($($.fn.blockstrap.element).length < 1)
                    {
                        return false;
                    }
                    else
                    {
                        $.fn.blockstrap.core.defaults();
                        $.fn.blockstrap.core.init();
                    }
                });
            },
            loader: function(state)
            {
                $.fn.blockstrap.core.modals('close_all');
                var element = $($.fn.blockstrap.element);
                if(typeof $.fn.blockstrap.settings.loader_id != 'undefined')
                {
                    element = $('#'+$.fn.blockstrap.settings.loader_id);
                }
                if(state && state === 'open')
                {
                    $(element).addClass('loading');
                }
                else
                {
                    $(element).removeClass('loading');
                    $(element).removeClass('installing');
                    $($.fn.blockstrap.element).attr('data-loading-content', 'LOADING');
                }
                    
            },
            loading: function(text, add_loading_class)
            {
                if(typeof add_loading_class == 'undefined' || add_loading_class)
                {
                    add_loading_class = true;
                }
                else
                {
                    add_loading_class = false;
                }
                $($.fn.blockstrap.element).attr('data-loading-content', text);
                if(add_loading_class)
                {
                    $($.fn.blockstrap.element).addClass('loading');
                }
            },
            modal: function(title, content, id, callback)
            {
                var perform_callback = true;
                var selector = $('#default-modal');
                if(id) selector = $('#'+id);
                if(title) $(selector).find('.modal-title').html(title);
                if(content) $(selector).find('.modal-body').html(content);
                $(selector).on('show.bs.modal', function()
                {
                    $(selector).find('input[type="password"]').val('');
                    if(callback) 
                    {
                        perform_callback = false;
                        callback();
                    }
                });
                $(selector).on('shown.bs.modal', function()
                {
                    $(selector).find('input[type="password"]').val('');
                });
                if($(selector).css('display') == 'none')
                {
                    $(selector).modal('show');
                }
                if(typeof callback != 'undefined' && callback && perform_callback)
                {
                    callback();
                }
            },
            modals: function(action)
            {
                if(action)
                {
                    if(action === 'close_all')
                    {
                        var space = $.fn.blockstrap.element;
                        if(!space ||space.length < 1) space = 'body';
                        $(space).find('.modal').each(function(i)
                        {
                            $(this).modal('hide');
                        });
                        $('body').removeClass('modal-open');
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
                if(slug == $.fn.blockstrap.settings.page_base) slug = $.fn.blockstrap.settings.slug_base;
                var nav = $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.navigation_id);
                var mnav = $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.mobile_nav_id);
                $(nav).find('.active').removeClass('active');
                $(mnav).find('.active').removeClass('active');
                var original_slug = JSON.parse(JSON.stringify(slug));
                if(slug.charAt(0) != '#') slug = '#' + $.fn.blockstrap.core.apply_filters('nav_slug', slug, slug);
                $(nav).find(slug).addClass('active');
                $(mnav).find(slug).addClass('active');
                $.fn.blockstrap.core.apply_actions('core_nav_complete', function()
                {
                    
                }, original_slug);
            },
            option: function(key, default_value)
            {
                if(!default_value) default_value = false;
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                var options = localStorage.getItem('nw_blockstrap_options');
                if($bs.json(options)) options = $.parseJSON(options);
                if(
                    $.isPlainObject(options) 
                    && typeof options[key] != 'undefined'
                ){
                    default_value = options[key];
                }
                else if(!default_value && typeof bs.settings[key] != 'undefined')
                {
                    default_value = bs.settings[key];
                }   
                return default_value;
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
            patch: function(version, callback)
            {
                var file = $.fn.blockstrap.settings.core_base+'patches/'+version+'/patch-'+version+'.js';
                $.getScript(file, function(patch_js)
                {
                    $.fn.blockstrap.patches['patch'+version].init(callback)
                });
            },
            plugins: function(index, plugins, callback)
            {
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                if(!index) index = 0;
                
                $('.bs.installing').attr('data-loading-content','Now Installing ' + (index + 1) + ' of  '+blockstrap_functions.array_length(plugins)+' Plugins');
                
                var install = $.fn.blockstrap.settings.install;
                
                if(install === false)
                {
                    if(callback) callback();
                }
                else if($.isArray(plugins))
                {
                    var plugin = plugins[index];
                    var plugin_url = 'plugins/' + plugin + '/' + plugin + '.js';
                    
                    if(plugin.indexOf('plugins/') > -1)
                    {
                        plugin_url = plugin + '.js';
                    }
                    
                    // Need to cache plugin?
                    var plug = localStorage.getItem('nw_inc_plugin_'+plugin);
                    if(blockstrap_functions.json(plug)) plug = $.parseJSON(plug);
                    var refresh = blockstrap_functions.vars('refresh');
                    var cache = bs.settings.cache;
                    var store = true;
                    if(typeof cache != 'undefined' && cache.plugins === false) store = false;
                    if(!plug || refresh === true || store === false) 
                    {
                        $.getScript(plugin_url, function(plugin_js)
                        {
                            if(store === true && plugin_js)
                            {
                                localStorage.setItem('nw_inc_plugin_'+plugin, JSON.stringify(plugin_js));
                            }
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
                    else
                    {
                        var head = document.getElementsByTagName('head')[0];
                        var new_script = document.createElement("script");
                        new_script.setAttribute('type', 'text/javascript');
                        new_script.setAttribute('id', plugin);
                        new_script.text = plug;
                        head.appendChild(new_script);
                        if(index >= $bs.array_length(plugins) - 1)
                        {
                            if(callback) callback();
                        }
                        else
                        {
                            bs.core.plugins(index + 1, plugins, callback);
                        }
                    }
                }
            },
            print: function(title, contents)
            {
                var mywindow = window.open('', title, 'height=500,width=400');
                mywindow.document.write('<html><head><title>'+title+'</title>');
                mywindow.document.write('<style>.btn, .dont-print { display: none; }</style>');
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
                                    $.fn.blockstrap.core.add_action(
                                        'init_callback', 
                                        'update_security',
                                        'security', 
                                        'update', 
                                        hash
                                    );
                                    if(callback) callback();
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
                
                var page = $.fn.blockstrap.core.page();
                $.fn.blockstrap.core.nav(page);
                $.fn.blockstrap.core.filters(page);

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
                $.fn.blockstrap.core.apply_actions('ready'); 
            },
            refresh: function(callback, slug)
            {
                var bs = $.fn.blockstrap;
                bs.core.modals('close_all');
                if(!slug) slug = bs.settings.page_base;
                slug = bs.core.apply_filters('core_refresh_slug', slug, slug);
                bs.templates.render(bs.settings.page_base, function()
                {
                    if(slug != bs.settings.page_base)
                    {
                        bs.templates.render(slug, function()
                        {
                            bs.core.ready();
                            bs.core.loader('close');
                            if(callback) callback();
                        }, false, true);
                    }
                    else
                    {
                        bs.core.ready();
                        bs.core.loader('close');
                        if(callback) callback();
                    }
                }, true, true);
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
                    if(reload)
                    {
                        bs.templates.render(bs.settings.page_base, function()
                        {
                            bs.core.loader('close');
                        }, true);
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
                                        if(k == 'your_password') 
                                        {
                                            safe_v = CryptoJS.SHA3(v, { outputLength: 512 }).toString();
                                        }
                                        else
                                        {
                                            safe_v = v;
                                        }
                                        $.fn.blockstrap.data.save('keys', store_key, safe_v, function()
                                        {
                                            
                                        });
                                    }
                                });
                            }
                            salt = CryptoJS.SHA3(
                                salt + k.toLowerCase() + blockstrap_functions.slug(v).toLowerCase(), 
                                { outputLength: 512 }
                            );
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

                if($($.fn.blockstrap.element).length > 0)
                {
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
                                if(key.indexOf(".") > -1)
                                {
                                    key_array = key.split('.');
                                    if(blockstrap_functions.array_length(key_array) == 2)
                                    {
                                        $.fn.blockstrap.settings[key_array[0]][key_array[1]] = keys.split(', ');
                                    }
                                }
                                else
                                {
                                    $.fn.blockstrap.settings[key] = keys.split(', ');
                                }
                            }
                            else
                            {
                                if(key.indexOf(".") > -1)
                                {
                                    key_array = key.split('.');
                                    if(blockstrap_functions.array_length(key_array) == 2)
                                    {
                                        $.fn.blockstrap.settings[key_array[0]][key_array[1]] = value;
                                    }
                                }
                                else
                                {
                                    $.fn.blockstrap.settings[key] = value;
                                }
                            }
                        }
                        else
                        {
                            $.fn.blockstrap.settings[key] = value;
                        }
                    });
                }
            },
            string_to_array: function(string)
            {
                var arrayed_string = false;
                if(typeof string == 'string')
                {
                    var first_char = string.charAt(0);
                    var last_char = string.charAt(string.length - 1);
                    if(first_char == '[' && last_char == ']')
                    {
                        var keys = string.substr(1, string.length - 2);
                        arrayed_string = keys.split(', ');
                    }
                }
                return arrayed_string;
            },
            string_to_hex: function(string, pad)
            {
                var hex, i;
                var result = "";
                for (i=0; i < string.length; i++) 
                {
                    hex = string.charCodeAt(i).toString(16);
                    if(!pad)
                    {
                        result += hex;
                    }
                    else
                    {
                        result += ("000"+hex).slice(-4);
                    }
                }
                return result;
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
            test_results: function(expected, given, index, total, title, api_service, chain_count, chain_total)
            {
                var bs = $.fn.blockstrap;
                if(typeof full_results[api_service] == 'undefined')
                {
                    full_results[api_service] = {};
                    full_results[api_service].passed = 0;
                    full_results[api_service].failed = 0;
                    full_results[api_service].blockchains = 0;
                    full_results[api_service].addresses = false;
                    full_results[api_service].markets = false;
                    full_results[api_service].paginate = false;
                    full_results[api_service].results = '';
                }
                if($.isPlainObject(expected) || $.isArray(expected))
                {
                    var ex = expected;
                    var give = given;
                    var provided_results = {};
                    if($.isPlainObject(expected))
                    {
                        expected = [];
                        expected.push(ex);
                        given = [];
                        given.push(give);
                    }
                    $.each(expected, function(key, result)
                    {
                        var details = '';
                        var passed = true;
                        var expected_count = 0;
                        var expected_total = blockstrap_functions.array_length(result);
                        $.each(result, function(field, value)
                        {
                            expected_count++;
                            if(typeof given[key] == 'undefined' || given[key][field] != value) 
                            {
                                if(typeof given[key] == 'undefined') 
                                {
                                    passed = false;
                                    if(expected_count >= expected_total)
                                    {
                                        details+= ' - <small>FUNCTION MISSING</small>';
                                    }
                                }
                                else
                                {
                                    passed = false;
                                    details+= '<br /><small>';
                                    details+= value + ' expected for <strong>' +field+ '</strong>, ';
                                    details+= given[key][field] + ' provided instead';
                                    details+= '</small>';
                                }
                            }
                        });
                        if(passed === true && typeof provided_results[api_service] == 'undefined')
                        {
                            full_results[api_service].passed++;
                            full_results[api_service].results+= '<hr />';
                            full_results[api_service].results+= '<p class="break-word text-success left-aligned">';
                            full_results[api_service].results+= '<strong class="black">API Request using '+$.fn.blockstrap.settings.apis.available[api_service]+':</strong><br />'+title;
                            full_results[api_service].results+= ': <strong>PASSED</strong></p>';
                            provided_results[api_service] = true;
                        }
                        else if(typeof provided_results[api_service] == 'undefined')
                        {
                            full_results[api_service].failed++;
                            full_results[api_service].results+= '<hr />';
                            full_results[api_service].results+= '<p class="break-word text-danger left-aligned">';
                            full_results[api_service].results+= '<strong class="black">API Request using '+$.fn.blockstrap.settings.apis.available[api_service]+':</strong><br />'+title;
                            full_results[api_service].results+= ': <strong>FAILED</strong>'+details+'</p>';
                            provided_results[api_service] = true;
                        }
                    });
                    if(index >= total && chain_count >= chain_total)
                    {
                        if($('#default-modal').find('.test-results').length < 1)
                        {
                            $.each(bs.settings.blockchains, function(blockchain, values)
                            {
                                if(blockchain != 'multi')
                                {
                                    $.each(values.apis, function(provider, url)
                                    {
                                        if(typeof full_results[provider] != 'undefined')
                                        {
                                            full_results[provider].blockchains++;
                                            var relay = $.fn.blockstrap.api.settings(
                                                blockchain, 
                                                provider, 
                                                'to', 
                                                'relay'
                                            );
                                            if(
                                                typeof relay != 'undefined'
                                                && relay
                                            ){
                                                full_results[provider].relay = true;
                                            }
                                            var op_returns = $.fn.blockstrap.api.settings(
                                                blockchain, 
                                                provider, 
                                                'to', 
                                                'op_returns'
                                            );
                                            if(
                                                typeof op_returns != 'undefined'
                                                && op_returns
                                            ){
                                                full_results[provider].op_returns = true;
                                            }
                                            var dnkeys = $.fn.blockstrap.api.settings(
                                                blockchain, 
                                                provider, 
                                                'to', 
                                                'dnkeys'
                                            );
                                            if(
                                                typeof dnkeys != 'undefined'
                                                && dnkeys
                                            ){
                                                full_results[provider].dnkeys = true;
                                            }
                                        }
                                    });
                                }
                            });
                        }

                        provided_results = {};
                        test_result_content = $.fn.blockstrap.core.test_results_table(full_results) + '<a href="#" class="btn-hidden_toggler btn btn-success btn-block" data-id="full-results">FULL RESULTS</a><div style="display: none" id="full-results">';
                        $.each(bs.settings.blockchains, function(blockchain, values)
                        {
                            if(blockchain != 'multi')
                            {
                                $.each(values.apis, function(provider, url)
                                {
                                    if(
                                        typeof full_results[provider] != 'undefined'
                                        && typeof provided_results[provider] == 'undefined'
                                    ){
                                        test_result_content+= full_results[provider].results;
                                        provided_results[provider] = true;
                                    }
                                });
                            }
                        });
                        test_result_content+= '</div>';
                        $.fn.blockstrap.core.modal('Test Results', test_result_content);
                        $('#blockstrap').removeClass('loading');
                    }
                }
            },
            test_results_table: function(results)
            {
                var html = '';
                var sortable = [];
                $.each(results, function(k, v)
                {
                    sortable.push({
                        provider: k,
                        results: v
                    });
                });
                sortable.sort(function(a, b) 
                { 
                    return parseFloat(a.results.blockchains) - parseFloat(b.results.blockchains) 
                });
                sortable.reverse();
                results = {};
                $.each(sortable, function(k, v)
                {
                    results[v.provider] = v.results;
                });
                var headers = ['Provider', 'Pass', 'Fail', 'Chains', 'TX Relay', 'OP Return', 'DN Key'];
                html+= '<table class="table table-striped test-results">';
                    html+= '<thead>';
                        html+= '<tr>';
                            $.each(headers, function(k, title)
                            {
                                html+= '<th>'+title+'</th>';
                            });
                        html+= '</tr>';
                    html+= '</thead>';
                    html+= '<tbody>';
                        $.each(results, function(provider, these_results)
                        {
                            html+= '<tr>';
                                html+= '<td><strong>'+$.fn.blockstrap.settings.apis.available[provider]+'</strong></td>';
                                if(these_results.failed > 0)
                                {
                                    html+= '<td><span class="label label-success">'+these_results.passed+'</span></td>';
                                    html+= '<td><span class="label label-danger">'+these_results.failed+'</span></td>';
                                }
                                else
                                {
                                    html+= '<td><span class="label label-success">'+these_results.passed+'</span></td>';
                                    html+= '<td><span class="label label-success">'+these_results.failed+'</span></td>';
                                }
                                html+= '<td><strong>'+these_results.blockchains+'</strong></td>';
                                html+= '<td>';
                                    if(these_results.relay === true)
                                    {
                                        html+= '<span class="label label-success">YES</span>';   
                                    }
                                    else
                                    {
                                        html+= '<span class="label label-danger">NO</span>';
                                    }
                                html+= '</td>';
                                html+= '<td>';
                                    if(these_results.op_returns === true)
                                    {
                                        html+= '<span class="label label-success">YES</span>';   
                                    }
                                    else
                                    {
                                        html+= '<span class="label label-danger">NO</span>';
                                    }
                                html+= '</td>';
                                html+= '<td>';
                                    if(these_results.dnkeys === true)
                                    {
                                        html+= '<span class="label label-success">YES</span>';   
                                    }
                                    else
                                    {
                                        html+= '<span class="label label-danger">NO</span>';
                                    }
                                html+= '</td>';
                            html+= '</tr>';
                        });
                    html+= '</tbody>';
                html+= '</table>';
                return html;
            },
            tests: function(run)
            {
                if(!run) run = false;
                var bs = $.fn.blockstrap;
                var set = false;
                var chain_count = 0;
                var chain_total = 0;
                if(typeof bs.settings.tests !== 'undefined')
                {
                    set = bs.settings.tests.api;
                }
                else
                {
                    run = false;
                }
                if(
                    run 
                    && typeof bs.settings.blockchains != 'undefined' 
                    && typeof bs.settings.blockchains.btc != 'undefined' 
                    && typeof bs.settings.blockchains.btc.apis != 'undefined'
                ){
                    chain_total = blockstrap_functions.array_length(bs.settings.blockchains.btc.apis);
                    for (i = 0; i < blockstrap_functions.array_length(bs.settings.blockchains.btc.apis); i++) 
                    {
                        var this_chain = bs.settings.blockchains.btc.apis[i];
                    }
                    $.each(bs.settings.blockchains.btc.apis, function(api_service, api_url)
                    {
                        var this_count = 0;
                        var test_count = 5; // TODO - REMOVE THIS "MANUAL" VARIABLE
                        chain_count++;
                        bs.api.address(set.address.request, 'btc', function(results)
                        {
                            this_count++;
                            bs.core.test_results(
                                set.address.results, 
                                results, 
                                this_count, 
                                test_count,
                                'api.address('+set.address.request+', btc)',
                                api_service,
                                chain_count,
                                chain_total
                            );
                        }, api_service);
                        bs.api.block(set.block.request, 'btc', function(results)
                        {
                            this_count++;
                            bs.core.test_results(
                                set.block.results, 
                                results, 
                                this_count, 
                                test_count,
                                'api.block('+set.block.request+', btc)',
                                api_service,
                                chain_count,
                                chain_total
                            );
                        }, api_service);
                        bs.api.transaction(set.transaction.request, 'btc', function(results)
                        {
                            this_count++;
                            bs.core.test_results(
                                set.transaction.results, 
                                results, 
                                this_count, 
                                test_count,
                                'api.transaction('+set.transaction.request+', btc)',
                                api_service,
                                chain_count,
                                chain_total
                            );
                        }, api_service);
                        bs.api.transactions(set.transactions.request, 'btc', function(results)
                        {
                            this_count++;
                            bs.core.test_results(
                                set.transactions.results, 
                                results, 
                                this_count, 
                                test_count,
                                'api.transactions('+set.transactions.request+', btc)',
                                api_service,
                                chain_count,
                                chain_total
                            );
                        }, api_service);
                        bs.api.unspents(set.unspents.request, 'btc', function(results)
                        {
                            this_count++;
                            bs.core.test_results(
                                set.unspents.results, 
                                results, 
                                this_count, 
                                test_count,
                                'api.unspents('+set.unspents.request+', btc)',
                                api_service,
                                chain_count,
                                chain_total
                            );
                        }, 0, api_service);
                    });
                }
            },
            timeouts: function(type_or_value)
            {
                var required_value = parseInt(JSON.parse(JSON.stringify(type_or_value)));
                var required_type = JSON.parse(JSON.stringify(type_or_value));
                var default_value = 1000;
                if(typeof $.fn.blockstrap.settings.timeouts != 'undefined')
                {
                    if(typeof $.fn.blockstrap.settings.timeouts[required_type] != 'undefined')
                    {
                        required_value = $.fn.blockstrap.settings.timeouts[required_type];
                    }
                    else if(typeof $.fn.blockstrap.settings.timeouts.default != 'undefined')
                    {
                        required_value = $.fn.blockstrap.settings.timeouts.default;
                    }
                }
                if(required_value <= 0)
                {
                    required_value = default_value;
                }
                return required_value;
            },
            txt: function(input, callback)
            {
                if(input.files && input.files[0]) 
                {
                    var reader = new FileReader();
                    reader.onload = function(e) 
                    {
                        var image = e.target.result;
                        callback(image);
                    };       
                    reader.readAsText(input.files[0]);
                }
            },
            upgrade: function(saved_version, this_version, refresh, callback)
            {
                var settings = $.fn.blockstrap.settings;
                var $bs = blockstrap_functions;
                if(typeof saved_version == 'undefined') saved_version = 0;
                if(typeof this_version == 'undefined') this_version = 1;
                if(typeof refresh == 'undefined') refresh = false;
                // TODO: FUNCTIONALIZE THIS
                if(/^[0-9\.]+$/.test(saved_version) && /^[0-9\.]+$/.test(this_version)) 
                {
                    var current_version_array = this_version.split('.');
                    var stored_version_array = saved_version.split('.');
                    if(
                        $.isArray(stored_version_array)
                        && $.isArray(current_version_array)
                        && blockstrap_functions.array_length(current_version_array) > 3
                        && blockstrap_functions.array_length(stored_version_array) > 3
                        && stored_version_array[0] < 1
                        && stored_version_array[1] < 6
                    )
                    {
                        $.fn.blockstrap.core.patch('0600', function()
                        {
                            
                        });
                    }
                    if(
                        $.isArray(stored_version_array)
                        && $.isArray(current_version_array)
                        && blockstrap_functions.array_length(current_version_array) > 3
                        && blockstrap_functions.array_length(stored_version_array) > 3
                        && stored_version_array[0] < 1
                        && stored_version_array[1] < 5
                    )
                    {
                        $.fn.blockstrap.core.patch('0501', function()
                        {
                            $.fn.blockstrap.core.patch('0502', callback);
                        });
                    }
                    else if(
                        $.isArray(stored_version_array)
                        && $.isArray(current_version_array)
                        && blockstrap_functions.array_length(current_version_array) > 3
                        && blockstrap_functions.array_length(stored_version_array) > 3
                        && stored_version_array[1] == 5
                        && stored_version_array[2] == 0
                        && stored_version_array[3] == 1
                    ){
                        $.fn.blockstrap.core.patch('0502', callback);
                    }
                    else
                    {
                        callback();
                    }
                }
                else
                {
                    callback();
                }
            }
        };        

        // TODO - DIRTY DIRTY HACK
        var is_loaded = false;
        
        // PLUGIN CONSTRUCTOR
        function plugin(element, options, defaults, store, force_skip)
        {
            if(!is_loaded)
            {
                is_loaded = true;
                // ACCOUNT FOR ORIGINAL SETTINGS IF THIS IS LOADED MANUALLY FOR SECOND TIME
                var old_settngs = {};
                if(typeof $.fn.blockstrap.settings != 'undefined')
                {
                    old_settings = $.fn.blockstrap.settings;
                }

                // MERGE DEFAULT AND PLUGIN OPTIONS
                var settings = $.extend(old_settings, defaults, options);

                var skip = false;
                if(settings.skip_config) skip = true;
                if(force_skip === true) skip = true

                if(typeof $.fn.blockstrap.settings.install === 'undefined')
                {
                    $.fn.blockstrap.settings.install = true;
                }

                // THEN GET CONFIG FILE
                $.fn.blockstrap.core.get('themes/config', 'json', function(results)
                {
                    if($.isPlainObject(results))
                    {
                        $.fn.blockstrap.settings = $.extend({}, settings, results);

                        // MERGE WITH HTML ATTRBUTE OPTIONS
                        $.fn.blockstrap.core.settings(element);

                        if($.fn.blockstrap.settings.skip_config) skip = true;

                        // NOW NEED TO GET THEME SPECIFIC OPTIONS AND MERGE WITH THESE
                        var current_theme = $.fn.blockstrap.settings.theme;
                        $.fn.blockstrap.core.get('themes/'+current_theme+'/config', 'json', function(results)
                        {
                            if($.isPlainObject(results))
                            {   

                                var set = $.extend(
                                    {}, 
                                    $.fn.blockstrap.settings, 
                                    results
                                );

                                $.fn.blockstrap.settings = set;

                                $.fn.blockstrap.defaults();

                                // ONE LAST SECRET CONFIG THAT CAN OVER-RIDE EVERTYHING AND IS NOT STORED IN REPO
                                // THE EXACT LOCATION OF THIS FILE CAN ULTIMATELY BE DEFINED BY PREVIOUS CONFIG FILES
                                var secret_config = 'secret';
                                $.fn.blockstrap.core.get(secret_config, 'json', function(results)
                                {
                                    if($.isPlainObject(results))
                                    {
                                        $.fn.blockstrap.settings = $.extend(
                                            {}, 
                                            $.fn.blockstrap.settings, 
                                            results
                                        );
                                    }

                                    if($($.fn.blockstrap.element).length < 1)
                                    {
                                        // ENSURE THAT ELEMENT EXPECTED IS AVAILABLE
                                        return false;
                                    }
                                    else
                                    {
                                        if(store)
                                        {
                                            localStorage.setItem('nw_inc_config', JSON.stringify($.fn.blockstrap.settings));
                                        }

                                        var bs = $.fn.blockstrap;
                                        var $bs = blockstrap_functions;
                                        var dependencies = $.fn.blockstrap.settings.dependencies;
                                        var modules = $.fn.blockstrap.settings.modules;
                                        var bootstrap = $.fn.blockstrap.settings.bootstrap;
                                        var plugins = $.fn.blockstrap.settings.plugins;
                                        
                                        if($.fn.blockstrap.settings.install === false)
                                        {
                                            dependencies = false;
                                            modules = false;
                                            plugins = false;
                                        }
                                        
                                        if(plugins)
                                        {
                                            $.each(plugins, function(k, plugin)
                                            {
                                                var plugin_key = plugin;
                                                var plugin_url = '../../../../plugins/' + plugin + '/';
                                                if(plugin.indexOf('plugins/') > -1)
                                                {
                                                    var plugin_array = plugin.split('/');
                                                    plugin_key = plugin_array[plugin_array.length -1];
                                                    plugin = plugin.substring(0, (plugin.length - (plugin_key.length + 1)));
                                                    plugin_url = '../../../../../plugins/' + plugin + '/';
                                                }
                                                if(
                                                    typeof $.fn.blockstrap.settings.plugin != 'undefined'
                                                    && typeof $.fn.blockstrap.settings.plugin.dependencies != 'undefined'
                                                    && typeof $.fn.blockstrap.settings.plugin.dependencies[plugin_key] != 'undefined'
                                                    && $.isArray($.fn.blockstrap.settings.plugin.dependencies[plugin_key])
                                                ){
                                                    var plugin_dependencies = $.fn.blockstrap.settings.plugin.dependencies[plugin_key];
                                                    $.each(plugin_dependencies, function(pk, dependency)
                                                    {
                                                        if(modules && $.isArray(modules))
                                                        {
                                                            dependencies.push(plugin_url + 'js/dependencies/' + dependency);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        
                                        if($.fn.blockstrap.settings.vars)
                                        {
                                            var vars = $.fn.blockstrap.settings.vars;
                                            if(typeof vars.skin != 'undefined' && vars.skin)
                                            {
                                                $.fn.blockstrap.settings.skin = vars.skin;
                                            }
                                        }

                                        // UPDATE CORE IF REQUIRED
                                        $bs.update(bs.settings.v, function(saved_version, this_version, refresh)
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
                                                        $('.bs.installing').attr('data-loading-content','Now Installing 1 of '+$bs.array_length(dependencies)+' Dependencies');
                                                        $bs.include(bs, 0, dependencies, function()
                                                        {
                                                            if($.isArray(modules))
                                                            {
                                                                // INCLUDE JS MODULES
                                                                $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(modules)+' Modules');
                                                                $bs.include(bs, 0, modules, function()
                                                                {
                                                                    if($.fn.blockstrap.settings.vars)
                                                                    {
                                                                        var vars = $.fn.blockstrap.settings.vars;
                                                                        if(typeof vars.skin != 'undefined' && vars.skin)
                                                                        {
                                                                            $.fn.blockstrap.settings.skin = vars.skin;
                                                                            var theme = $.fn.blockstrap.settings.theme;
                                                                            var theme_base = $.fn.blockstrap.settings.theme_base;
                                                                            var language = theme_base + theme + '/skins/' + vars.skin + '/js/languages';
                                                                            var skin_plugin = theme_base + theme + '/skins/' + vars.skin + '/js/' + vars.skin;
                                                                            $.getScript(language + '.js', function(js)
                                                                            {

                                                                            });
                                                                            $.getScript(skin_plugin + '.js', function(js)
                                                                            {

                                                                            });
                                                                        }
                                                                    }
                                                                    $.fn.blockstrap.snippets = {}; 
                                                                    if($.isArray(bootstrap))
                                                                    {
                                                                        // INCLUDE BOOTSTRAP COMPONENTS
                                                                        $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(bootstrap)+' Bootstrap Snippets');
                                                                        bs.core.bootstrap(0, bootstrap, function()
                                                                        {
                                                                            if($.isArray(plugins))
                                                                            {
                                                                                // FINISH WITH PLUGINS
                                                                                $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(plugins)+' Plugins');
                                                                                bs.core.plugins(0, plugins, function()
                                                                                {
                                                                                    bs.core.loaded(saved_version, this_version, refresh); 
                                                                                });
                                                                            }
                                                                            else
                                                                            {
                                                                                bs.core.loaded(saved_version, this_version, refresh); 
                                                                            }
                                                                        })
                                                                    }
                                                                    else
                                                                    {
                                                                        if($.isArray(plugins))
                                                                        {
                                                                            // FINISH WITH PLUGINS
                                                                            $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(plugins)+' Plugins');
                                                                            bs.core.plugins(0, plugins, function()
                                                                            {
                                                                                bs.core.loaded(saved_version, this_version, refresh); 
                                                                            });
                                                                        }
                                                                        else
                                                                        {
                                                                            bs.core.loaded(saved_version, this_version, refresh);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            else
                                                            {
                                                                if($.isArray(plugins))
                                                                {
                                                                    // FINISH WITH PLUGINS
                                                                    $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(plugins)+' Plugins');
                                                                    bs.core.plugins(0, plugins, function()
                                                                    {
                                                                        bs.core.loaded(saved_version, this_version, refresh); 
                                                                    });
                                                                }
                                                                else
                                                                {
                                                                    bs.core.loaded(saved_version, this_version, refresh);
                                                                }
                                                            }
                                                        }, true);
                                                    }
                                                    else
                                                    {
                                                        if($.isArray(modules))
                                                        {
                                                            // INCLUDE JS MODULES
                                                            $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(modules)+' Modules');
                                                            if($.fn.blockstrap.settings.vars)
                                                            {
                                                                var vars = $.fn.blockstrap.settings.vars;
                                                                if(typeof vars.skin != 'undefined' && vars.skin)
                                                                {
                                                                    $.fn.blockstrap.settings.skin = vars.skin;
                                                                    var theme = $.fn.blockstrap.settings.theme;
                                                                    var theme_base = $.fn.blockstrap.settings.theme_base;
                                                                    var language = theme_base + theme + '/skins/' + vars.skin + '/js/languages';
                                                                    var skin_plugin = theme_base + theme + '/skins/' + vars.skin + '/js/' + vars.skin;
                                                                    $.getScript(language + '.js', function(js)
                                                                    {

                                                                    });
                                                                    $.getScript(skin_plugin + '.js', function(js)
                                                                    {

                                                                    });
                                                                }
                                                            }
                                                            $bs.include(bs, 0, modules, function()
                                                            {
                                                                $.fn.blockstrap.snippets = {};
                                                                if($.isArray(bootstrap))
                                                                {
                                                                    // INCLUDE BOOTSTRAP COMPONENTS
                                                                    $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(bootstrap)+' Bootstrap Snippets');
                                                                    bs.core.bootstrap(0, bootstrap, function()
                                                                    {
                                                                        if($.isArray(plugins))
                                                                        {
                                                                            // FINISH WITH PLUGINS
                                                                            $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(plugins)+' Plugins');
                                                                            bs.core.plugins(0, plugins, function()
                                                                            {
                                                                                bs.core.loaded(saved_version, this_version, refresh); 
                                                                            });
                                                                        }
                                                                        else
                                                                        {
                                                                            bs.core.loaded(saved_version, this_version, refresh);
                                                                        }
                                                                    })
                                                                }
                                                                else
                                                                {
                                                                    if($.isArray(plugins))
                                                                    {
                                                                        // FINISH WITH PLUGINS
                                                                        $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(plugins)+' Plugins');
                                                                        bs.core.plugins(0, plugins, function()
                                                                        {
                                                                            bs.core.loaded(saved_version, this_version, refresh); 
                                                                        });
                                                                    }
                                                                    else
                                                                    {
                                                                        bs.core.loaded(saved_version, this_version, refresh);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                        else
                                                        {
                                                            $.fn.blockstrap.snippets = {};
                                                            if(typeof plugins == 'undefined') plugins = false;
                                                            if($.isArray(bootstrap))
                                                            {
                                                                // INCLUDE BOOTSTRAP COMPONENTS
                                                                $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(bootstrap)+' Bootstrap Snippets');
                                                                bs.core.bootstrap(0, bootstrap, function()
                                                                {
                                                                    if($.isArray(plugins))
                                                                    {
                                                                        // FINISH WITH PLUGINS
                                                                        $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(plugins)+' Plugins');
                                                                        bs.core.plugins(0, plugins, function()
                                                                        {
                                                                            bs.core.loaded(saved_version, this_version, refresh); 
                                                                        });
                                                                    }
                                                                    else
                                                                    {
                                                                        bs.core.loaded(saved_version, this_version, refresh);
                                                                    }
                                                                })
                                                            }
                                                            else
                                                            {
                                                                if($.isArray(plugins))
                                                                {
                                                                    // FINISH WITH PLUGINS
                                                                    $('.bs.installing').attr('data-loading-content','Now Installing 1 of  '+$bs.array_length(plugins)+' Plugins');
                                                                    bs.core.plugins(0, plugins, function()
                                                                    {
                                                                        bs.core.loaded(saved_version, this_version, refresh); 
                                                                    });
                                                                }
                                                                else
                                                                {
                                                                    bs.core.loaded(saved_version, this_version, refresh);
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }, skip, false);
                            }
                        }, skip, false);
                    }
                }, skip, false);
            }
        }
        
        if(typeof blockstrap_defaults == 'undefined')
        {
            var bs = $.fn.blockstrap;
            var $bs = blockstrap_functions;
            var config = localStorage.getItem('nw_inc_config');
            if(blockstrap_functions.json(config)) config = $.parseJSON(config);
            
            var refresh = blockstrap_functions.vars('refresh');
            var store = true;
            var cache = false;
            if(typeof bs.settings != 'undefined' && bs.settings && typeof bs.settings.cache != 'undefined')
            {
                cache = bs.settings.cache;
                if(cache.config === false) store = false;
            }
            if(typeof $.fn.blockstrap.settngs == 'undefined')
            {
                $.fn.blockstrap.settings = {};
            }
            if(typeof $.fn.blockstrap.settings.install == 'undefined')
            {
                $.fn.blockstrap.settings.install = true;
            }
            if($.fn.blockstrap.settings.install === false)
            {
                config = false;
            }
            
            var theme = localStorage.getItem('nw_blockstrap_theme');
            if(blockstrap_functions.json(theme)) theme = $.parseJSON(theme);

            if(config && $.fn.blockstrap.settings.theme != config.theme)
            {
                localStorage.setItem(
                    'nw_blockstrap_theme',
                    JSON.stringify(config.theme)
                );
                refresh = true;
            }
            
            if(!config || refresh === true || store === false)
            {
                $.ajax({
                    url: 'defaults.json',
                    dataType: 'json',
                    cache: false,
                    async: false,
                    success: function(defaults)
                    {
                        // CONSTRUCT PLUGIN AFTER
                        // FIRST COLLECTING DEFAULTS
                        blockstrap_functions.check(defaults, function(passed)
                        {
                            if(passed) plugin(false, false, defaults, store); 
                            else alert('Your browser does not support the minimum requirements - please learn more at https://github.com/blockstrap/framework/tree/master/docs/en - either that or you may have private browsing activated, which would also prevent Blockstrap from working.');
                        });
                    }
                }).fail(function(jqxhr, settings, exception)
                {
                    alert('It seems this browser is unable to load files via AJAX under the current environment. This is usually only a problem when opening Blockstrap without a web-server. It\'s typically a Chrome issue. Try using Firefox, Safari, or even Internet Explorer.');
                });
            }
            else
            {
                var skip = true;
                blockstrap_functions.check(config, function(passed)
                {
                    if(passed) plugin(false, false, config, store, skip); 
                    else alert('Your browser does not support the minimum requirements - please learn more at https://github.com/blockstrap/framework/tree/master/docs/en - either that or you may have private browsing activated, which would also prevent Blockstrap from working.');
                });
            }
        }
        else
        {
            if(blockstrap_functions.json(blockstrap_defaults))
            {
                blockstrap_defaults = $.parseJSON(blockstrap_defaults);
            }
            $.fn.blockstrap.settings = blockstrap_defaults;
            blockstrap_functions.check(blockstrap_defaults, function()
            {
                var element = false;
                $.fn.blockstrap.settings.vars = blockstrap_functions.vars();
                if($('#'+$.fn.blockstrap.settings.id).length > 0)
                {
                    element = $('#'+$.fn.blockstrap.settings.id);
                }
                plugin(element, false, blockstrap_defaults); 
            });
        }
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
    check: function(options, callback)
    {
        try 
        {
            var mod = 'nw';
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            if(callback) callback(true);
            else return true;
        } 
        catch(e) 
        {
            if(callback) callback(false);
            else return false;
        }
    },
    exists: function(url, callback)
    {
        try
        {    
            var http = new XMLHttpRequest();
            http.open("GET", url, false);
            http.onreadystatechange = function()
            {
                if(this.status == 404)
                {
                    callback(false);
                }
                else if(this.readyState==4)
                {
                    var msg = this.responseText;
                    if(msg == '404') 
                    {
                        callback(false);
                    }
                    else
                    {
                        callback(true);
                    }
                }
                else
                {
                    callback(false);
                }
            }
            http.send(null);
        }
        catch(err)
        {
            callback(false);
        }
    },
    get_css: function(attributes, store, id)
    {
        if(typeof attributes === "string") 
        {
            var href = attributes;
            attributes = {
                href: href,
                rel: 'stylesheet'
            };
        }
        if(!attributes.rel) 
        {
            attributes.rel = "stylesheet"
        }
        var styleSheet = document.createElement("link");
        for(var key in attributes) 
        {
            styleSheet.setAttribute(key, attributes[key]);
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(styleSheet); 
        if(store === true)
        {
            localStorage.setItem('nw_inc_css_'+id, JSON.stringify(attributes));
        }
    },
    include: function(blockstrap, start, files, callback, dependency)
    {
        var head = document.getElementsByTagName('head')[0];
        var refresh = blockstrap_functions.vars('refresh');
        var cache = blockstrap.settings.cache;
        var limit = files.length;
        var install = blockstrap.settings.install;
        
        if(!dependency) dependency = false;
        if(!start) start = 0;
        
        var include_type = 'Modules';
        if(dependency) include_type = 'Dependencies';
        
        $('.bs.installing').attr('data-loading-content','Now Installing ' + (start + 1) + ' of  '+blockstrap_functions.array_length(files)+' ' + include_type);
        if(install === false)
        {
            callback();
        }
        else if($.isArray(files) && files[start])
        {
            var js = '';
            var file_name = files[start];
            var js_file = localStorage.getItem('nw_js_'+file_name);
            var store = true;
            if(blockstrap_functions.json(js_file)) js_file = $.parseJSON(js_file);
            if(!dependency)
            {
                if(typeof cache != 'undefined' && cache.modules === false) store = false;
            }
            else
            {
                if(typeof cache != 'undefined' && cache.dependencies === false) store = false;
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
                    }).fail(function(jqxhr, settings, exception)
                    {
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
                    var theme_filename = blockstrap.settings.theme_base + blockstrap.settings.theme+'/js/dependencies/' + file_name + '.js';
                    if(!dependency)
                    {
                        theme_filename = blockstrap.settings.theme_base + blockstrap.settings.theme+'/js/modules/' + file_name + '.js';
                    }
                    $.getScript(theme_filename, function(theme_js)
                    {
                        if(theme_js != '404')
                        {
                            js+= "\n" + theme_js;
                        }
                        if(store === true && file_name != 'bitcoinjs-lib')
                        {
                            localStorage.setItem('nw_js_'+file_name, js);
                        }   
                        start++;
                        blockstrap_functions.include(blockstrap, start, files, callback, dependency);
                    }).fail(function(jqxhr, settings, exception)
                    {
                        start++;
                        if(store === true && file_name != 'bitcoinjs-lib')
                        {
                            localStorage.setItem('nw_js_'+file_name, js);
                        }   
                        blockstrap_functions.include(blockstrap, start, files, callback, dependency);
                    });
                }).fail(function(jqxhr, settings, exception)
                {
                    var theme_filename = blockstrap.settings.theme_base + blockstrap.settings.theme+'/js/dependencies/' + file_name + '.js';
                    if(!dependency)
                    {
                        theme_filename = blockstrap.settings.theme_base + blockstrap.settings.theme+'/js/modules/' + file_name + '.js';
                    }
                    $.getScript(theme_filename, function(theme_js)
                    {
                        if(theme_js != '404')
                        {
                            js+= "\n" + theme_js;
                        }

                        if(store === true && file_name != 'bitcoinjs-lib')
                        {
                            localStorage.setItem('nw_js_'+file_name, js);
                        }
                        
                        start++;
                        blockstrap_functions.include(blockstrap, start, files, callback, dependency);
                    }).fail(function(jqxhr, settings, exception)
                    {
                        start++;
                        if(store === true && file_name != 'bitcoinjs-lib')
                        {
                            localStorage.setItem('nw_js_'+file_name, js);
                        }
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
                $ = jQuery;
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
        if(slug != 'undefined' && slug)
        {
            var name = slug.replace(/ /g, '_');
            name = name.replace(/-/g, '_');
            name = name.replace(/'/g, '');
            name = name.replace(/"/g, '');
            name = name.replace(/#/g, '');
            return name.toLowerCase();
        }
        else
        {
            return false;
        }
    },
    unslug: function(slug)
    {
        var name = slug.replace(/_/g, ' ');
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
    update: function(version, callback)
    {
        var results = localStorage.getItem('nw_blockstrap_v');
        if(results) results = $.parseJSON(results);
        if(/^[0-9\.]+$/.test(version) && /^[0-9\.]+$/.test(results)) 
        {
            var current_version_array = version.split('.');
            var stored_version_array = results.split('.');
            if($.isArray(stored_version_array))
            {
                $.each(stored_version_array, function(k, v)
                {
                    if(parseInt(current_version_array[k]) > parseInt(v))
                    {
                        $.fn.blockstrap.settings.vars.refresh = true;
                    }
                    if(k >= (blockstrap_functions.array_length(stored_version_array) - 1))
                    {
                        localStorage.setItem('nw_blockstrap_v', JSON.stringify(version));
                        callback(results, version, $.fn.blockstrap.settings.vars.refresh);
                    }
                })
            }
            else
            {
                $.fn.blockstrap.settings.vars.refresh = true;
                localStorage.setItem('nw_blockstrap_v', JSON.stringify(version));
                callback(results, version, true);
            }
        }
        else
        {
            if(version != results) 
            {
                $.fn.blockstrap.settings.vars.refresh = true;
                localStorage.setItem('nw_blockstrap_v', JSON.stringify(version));
                callback(results, version, true);
            }
            else
            {
                callback(results, version, false);
            }
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
            if(
                typeof $.fn.blockstrap.settings == 'undefined' 
                || typeof $.fn.blockstrap.settings == null 
                || !$.fn.blockstrap.settings
                || typeof $.fn.blockstrap.settings.vars == 'undefined'
                || typeof $.fn.blockstrap.settings.vars[variable] == 'undefined'
            ){
                return false;
            }
            else
            {
                return $.fn.blockstrap.settings.vars[variable];
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
            $.fn.blockstrap.settings.vars = vars;
            return vars;
        }
    }
};
var blockstrap_js_scripts;
document.addEventListener('DOMContentLoaded', function()
{
    //blockstrap_functions.initialize();
});
blockstrap_functions.initialize();