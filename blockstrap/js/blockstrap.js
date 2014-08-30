/*
 * 
 *  Blockstrap v0.5
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 *  -- Please note that Blockstrap is required by all Neuroware Products
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
        // SET DEFAULTS
        var $this = this;
        var plugin_name = 'blockstrap';
        var defaults = {
            v: '1.0.2.9',
            salt: '',
            autoload: true,
            id: plugin_name,
            theme: 'default',
            less: false,
            default_data: 'data/index.json',
            default_html: 'html/index.html',
            html_base: 'html/',
            data_base: 'data/',
            core_base: 'blockstrap/',
            dependency_base: 'js/dependencies/',
            module_base: 'js/modules/',
            slug_base: 'dashboard',
            base_url: '',
            content_id: 'main-content',
            navigation_id: 'navigation',
            css: ['font-awesome'],
            filters: [
                'bootstrap', 
                'got', 
                'setup', 
                'get', 
                'avatars', 
                'accounts',
                'contacts',
                'balances',
                'total'
            ],
            store: ['app_url', 'your_name'],
            modules: [
                'forms',
                'accounts',
                'contacts',
                'data', 
                'api', 
                'security', 
                'theme',
                'buttons', 
                'styles', 
                'templates',
                'filters',
                'btc'
            ],
            dependencies: [
                'sonic', 
                'crypto',
                'swipe', 
                'effects', 
                'steps',
                'bootstrap.min', 
                'bootstrap-switch.min',
                'mustache', 
                'tables',
                'qrcode',
                'bootstrap-filestyle.min',
                'bitcoinjs',
                'tx',
                'sha3'
            ],
            bootstrap: [
                'lists', 
                'jumbotrons', 
                'panels', 
                'tables', 
                'modals', 
                'forms', 
                'bars'
            ],
            styles: {
                content_bg: '#DDD',
                header_bg: '#475862'
            },
            tests: {
                api: {
                    address: '1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k',
                    transaction: '06032a172f88ba823785f87341eab26ee7a2eb2de9d2f105220d6580e3affc16',
                    transactions: '1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k',
                    addresses: '1121cQLqCsDsLPAkJW5ddTCREZ7Bp4ufrk&addresses=12higDjoCCNXSA95xZMWUdPvXNmkAduhWv',
                    block: '15968',
                    relay: '0100000001ec71e2ceac8476bea21fbc4a97062c000f07def6c8ef8d9171fb1a5e113418e0010000008c493046022100e6f39b4393794ef03b0f9dc71395e0835a211015b42ab4329cb6a6c1c8b3c6ea022100f1ccae451f35e5c5ad25a8f7e7b5e778bafc4dc69dd560fab1cbadbb88767916014104e1934263e84e202ebffca95246b63c18c07cd369c4f02de76dbd1db89e6255dacb3ab1895af0422e24e1d1099e80f01b899cfcdf9b947575352dbc1af57466b5ffffffff0210270000000000001976a914652c453e3f8768d6d6e1f2985cb8939db91a4e0588ace065f81f000000001976a914cf0dfe6e0fa6ea5dda32c58ff699071b672e1faf88ac00000000',
                    unspents: '1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k'
                }
            },
            currencies: {
                btc: {
                    currency: "Bitcoin",
                    api: "https://mainnet.helloblock.io/v1/",
                    fee: 0.0001
                },
                ltc: {
                    currency: "Litecoin",
                    api: "https://mainnet.helloblock.io/v1/"
                }
            },
            cache: {
                api: {
                    address: 60000 // 1 Minute
                },
                accounts: 60000 // 2 Minutes = 120000
            },
            exchange: {
                btc: 500,
                ltc: 5
            }, // WHY USE MAPS TERMINOLOGY ALL OF A SUDDEN ...?
            maps: {
                styles: {
                    elements: {
                        content_bg: '#main-content',
                        header_bg: 'header'
                    },
                    rules: {
                        content_bg: 'background',
                        header_bg: 'background'
                    }
                },
                apis: {
                    btc: {
                        functions: {
                            to: {
                                address: 'addresses/',
                                addresses: 'addresses?addresses=',
                                transaction: 'transactions/',
                                transactions: 'addresses/$call/transactions?limit=100',
                                block: 'blocks/',
                                relay: 'transactions/',
                                relay_param: 'rawTxHex',
                                unspents: 'addresses/$call/unspents?limit=100'
                            },
                            from: {
                                address: {
                                    key: 'address',
                                    address: 'address',
                                    hash: 'hash160',
                                    tx_count: 'confirmedTxsCount',
                                    received: 'confirmedReceivedValue',
                                    balance: 'confirmedBalance'
                                },
                                addresses: {
                                    key: 'addresses',
                                    address: 'address',
                                    hash: 'hash160',
                                    tx_count: 'confirmedTxsCount',
                                    received: 'confirmedReceivedValue',
                                    balance: 'confirmedBalance'
                                },
                                transaction: {
                                    key: 'transaction',
                                    txid: 'txHash',
                                    size: 'size',
                                    block: 'blockHeight',
                                    time: 'blockTime',
                                    input: 'totalInputsValue',
                                    output: 'totalOutputsValue',
                                    fees: 'fees'
                                },
                                transactions: {
                                    key: 'transactions',
                                    txid: 'txHash',
                                    size: 'size',
                                    block: 'blockHeight',
                                    time: 'blockTime',
                                    input: 'totalInputsValue',
                                    output: 'totalOutputsValue',
                                    fees: 'fees'
                                },
                                block: {
                                    key: 'block',
                                    height: 'blockHeight',
                                    hash: 'blockHash',
                                    prev: 'prevBlockHash',
                                    tx_count: 'txsCount',
                                    time: 'blockTime'
                                },
                                relay: {
                                    txid: 'txHash',
                                    inner: 'transaction'
                                },
                                unspents: {
                                    key: 'unspents',
                                    txid: 'txHash',
                                    index: 'index',
                                    value: 'value',
                                    script: 'scriptPubKey'
                                }
                            }
                        }
                    }
                }
            }
        };

        // PLUGIN CONSTRUCTOR
        function Plugin(element, options)
        {
            // MERGE DEFAULT AND PLUGIN OPTIONS
            $.fn.blockstrap.settings = $.extend({}, defaults, options);
            if($.fn.blockstrap.settings.salt && localStorage)
            {
                localStorage.setItem('nw_blockstrap_salt', $.fn.blockstrap.settings.salt);
            }
            $.fn.blockstrap.settings.vars = blockstrap_functions.vars();
            if(blockstrap_functions.vars('less')) $.fn.blockstrap.settings.less = true;
            if(!$.fn.blockstrap.settings.base_url)
            {
                $.fn.blockstrap.settings.base_url = window.location.href.split('#')[0];
                $.fn.blockstrap.settings.base_url = $.fn.blockstrap.settings.base_url.split('?')[0];
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
            if(attributes['id'])
            {
                $.fn.blockstrap.settings['id'] = attributes['id'];
            }
            if(attributes['defaultData'])
            {
                $.fn.blockstrap.settings['default_data'] = attributes['defaultData'];
            }
            if(attributes['defaultHtml'])
            {
                $.fn.blockstrap.settings['default_html'] = attributes['defaultHtml'];
            }
            if(attributes['dataBase'])
            {
                $.fn.blockstrap.settings['data_base'] = attributes['dataBase'];
            }
            if(attributes['htmlBase'])
            {
                $.fn.blockstrap.settings['html_base'] = attributes['htmlBase'];
            }
            if(attributes['slugBase'])
            {
                $.fn.blockstrap.settings['slug_base'] = attributes['slugBase'];
            }
            if(attributes['contentId'])
            {
                $.fn.blockstrap.settings['content_id'] = attributes['contentId'];
            }
            if(attributes['filters'])
            {
                $.fn.blockstrap.settings['filters'] = attributes['filters'].split(', ');
            }
            if(attributes['dependencies'])
            {
                $.fn.blockstrap.settings['dependencies'] = attributes['dependencies'].split(', ');
            }
            if(attributes['modules'])
            {
                $.fn.blockstrap.settings['modules'] = attributes['modules'].split(', ');
            }
            if(attributes['bootstrap'])
            {
                $.fn.blockstrap.settings['bootstrap'] = attributes['bootstrap'].split(', ');
            }
            if(attributes['styles'])
            {
                $.fn.blockstrap.settings['styles'] = $.extend({}, $.fn.blockstrap.settings.styles, $.fn.blockstrap.core.stringed(attributes['styles'].split(', ')));
            }
            
            // LOAD DEPENDENCIES FIRST
            if($.isArray($.fn.blockstrap.settings.dependencies))
            {
                blockstrap_functions.include($.fn.blockstrap, 0, $.fn.blockstrap.settings.dependencies, function()
                {
                    // THEN LOAD MODULES
                    if($.isArray($.fn.blockstrap.settings.modules))
                    {
                        $.fn.blockstrap.core.css(function()
                        {
                            blockstrap_functions.include($.fn.blockstrap, 0, $.fn.blockstrap.settings.modules, function()
                            {
                                // RESET IF REQUIRED
                                if(blockstrap_functions.vars('reset') === true)
                                {
                                    $.fn.blockstrap.buttons.reset(false, false);
                                }
                                
                                
                                blockstrap_functions.update($.fn.blockstrap.settings.v, function()
                                {
                                    // INJECT LESS.css EARLY IF REQUIRED
                                    $.fn.blockstrap.data.find('inc', 'less', function(less)
                                    {
                                        var refresh = blockstrap_functions.vars('refresh');
                                        if(!less || refresh === true) 
                                        {
                                            $('head').append('<link rel="stylesheet/less" type="text/css" href="'+$.fn.blockstrap.settings.core_base+'less/blockstrap.less">');
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
                                                            $.fn.blockstrap.data.save('inc', 'less', less_styles, function()
                                                            {

                                                            });
                                                        }
                                                    }
                                                })
                                            });
                                        }
                                        else
                                        {
                                            $('head').append('<style id="nw-css">'+less+'</style>');
                                        }
                                    });


                                    // ADD TEMPLATES
                                    $.fn.blockstrap.snippets = {};                            
                                    var snippet_count = 0;
                                    var snippet_limit = 0;
                                    if($.isArray($.fn.blockstrap.settings.bootstrap))
                                    {
                                        snippet_limit = $.fn.blockstrap.settings.bootstrap.length;
                                    }
                                    if($.isArray($.fn.blockstrap.settings.bootstrap))
                                    {
                                        $.each($.fn.blockstrap.settings.bootstrap, function(k, v)
                                        {
                                            $.fn.blockstrap.data.find('boot', v, function(results)
                                            {
                                                var refresh = blockstrap_functions.vars('refresh');
                                                if(refresh === true || !results)
                                                {
                                                    $.fn.blockstrap.templates.get($.fn.blockstrap.settings.core_base+'html/bootstrap/'+v, 'html', function(html)
                                                    {                                        
                                                        $.fn.blockstrap.data.save('boot', v, html, function(results)
                                                        {
                                                            $.fn.blockstrap.snippets[v] = html;
                                                            snippet_count++;
                                                            if(snippet_count >= snippet_limit)
                                                            {
                                                                // INITIATE CORE
                                                                $.fn.blockstrap.core.init();
                                                            }
                                                        })

                                                    });
                                                }
                                                else
                                                {
                                                    $.fn.blockstrap.snippets[v] = results;
                                                    snippet_count++;
                                                    if(snippet_count >= snippet_limit)
                                                    {
                                                        // INITIATE CORE
                                                        $.fn.blockstrap.core.init();
                                                    }
                                                }
                                            });
                                        });
                                    }
                                    else
                                    {
                                        // INITIATE CORE
                                        $.fn.blockstrap.core.init();
                                    }
                                }) 
                            });
                        })
                    };
                }, true);
            }
            $.ajax({
                url: $.fn.blockstrap.settings.core_base + 'html/' + 'loading.html',
                dataType: 'HTML',
                type: 'GET',
                complete: function(results)
                {
                    if($($.fn.blockstrap.element).find('#'+$.fn.blockstrap.settings.content_id).length < 1)
                    {
                        if(results && results.responseText && results.responseText === '404')
                        {

                        }
                        else
                        {
                            var loading = results.responseText;
                            $($.fn.blockstrap.element).append(loading);
                        }
                    }
                }
            });
        }
        
        // PREVENT DUPLICATES
        $.fn[plugin_name] = function(options)
        {
            this.each(function()
            {
                if(!$.data(this, "plugin_"+plugin_name))
                {
                    $.data(this, "plugin_"+plugin_name, new plugin(this, options));
                }
            });
            return this;
        };

        // CORE FUNCTIONS
        $.fn.blockstrap.core = {
            new: function()
            {
                /* 

                THESE FUNCTIONS NEED TO RUN EVERY TIME
                NEW HTML IS LOADED INTO THE DOM

                */
                $.fn.blockstrap.accounts.updates(0, function()
                {
                    $.fn.blockstrap.core.table();
                    $.fn.blockstrap.core.forms();

                    // Not handling lack of these being activated ...
                    $.fn.blockstrap.theme.new();
                    $.fn.blockstrap.buttons.new();
                    //$.fn.blockstrap.templates.filter();
                });
            },
            resize: function()
            {
                /* 

                THESE FUNCTIONS NEED TO RUN EVERY TIME
                DOCUMENT IS RESIZED - NEEDS TIMER

                */
                $.fn.blockstrap.core.table();
            },
            init: function()
            {
                // Check for login credentials...?
                if(!$.fn.blockstrap.security.logged_in())
                {
                    $.fn.blockstrap.templates.render('../../../blockstrap/html/bootstrap/login', function()
                    {
                        $.fn.blockstrap.styles.set();
                        $.fn.blockstrap.core.modals();
                        $.fn.blockstrap.core.buttons();
                        $($.fn.blockstrap.element).animate({'opacity':1}, 600, function()
                        {
                            $.fn.blockstrap.core.loading();
                            $.fn.blockstrap.core.new();
                            $(window).resize(function(e)
                            {
                                $.fn.blockstrap.core.resize();
                            })
                        });
                    });
                }
                else
                {
                    $.fn.blockstrap.accounts.updates(0, function()
                    {
                        $.fn.blockstrap.templates.render('index', function()
                        {
                            //$.fn.blockstrap.accounts.balances(true, function()
                            //{
                                $.fn.blockstrap.styles.set();
                                $.fn.blockstrap.core.modals();
                                $.fn.blockstrap.core.buttons();
                                $($.fn.blockstrap.element).animate({'opacity':1}, 600, function()
                                {
                                    $.fn.blockstrap.core.loading();
                                    $.fn.blockstrap.core.new();
                                    $(window).resize(function(e)
                                    {
                                        $.fn.blockstrap.core.resize();
                                    })
                                });
                                var run_tests = false;
                                var tests = blockstrap_functions.vars('tests');
                                if(tests) run_tests = true;
                                $.fn.blockstrap.core.tests(run_tests);
                                if(window.location.hash)
                                {
                                    $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.navigation_id).find('#' + blockstrap_functions.slug(window.location.hash)).trigger('click');
                                }
                            //});
                        });
                    });
                }
            },
            cache: function(key, value, variable, callback, time_to_live)
            {
                if(!time_to_live) time_to_live = 60000; // 1 Minute
                key = key+'_'+variable;
                
                var now = new Date().getTime();
                var val = localStorage.getItem(key);
                if(blockstrap_functions.json(val))
                {
                    val = $.parseJSON(localStorage.getItem(key));
                }
                var time = time_to_live;
                if(val && val.ts) time = val.ts + time_to_live;
                if(value && time < now)
                {
                    var obj = {
                        value: value,
                        ts: now
                    };
                    localStorage.setItem(key, JSON.stringify(obj));
                    if(callback) callback(true);
                    else return true;
                }
                else
                {
                    if(time < now)
                    {
                        if(callback) callback(false);
                        else return false;
                    }
                    else
                    {
                        if($.isPlainObject(val) && val.value) return val.value;
                        else if(callback) callback(false);
                        else return false;
                    }
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
            modal: function(title, content, id)
            {
                var selector = $('#default-modal');
                if(id) selector = $('#'+id);
                $(selector).find('.modal-title').html(title);
                $(selector).find('.modal-body').html(content);
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
                    });
                    $($.fn.blockstrap.element).on('shown.bs.modal', '.modal', function(i)
                    {
                        var this_form = $(this).find('form');
                        if($(this_form).find('input').length > 0)
                        {
                            var input = $(this_form).find('input[type!=hidden]:first');
                            $(input).focus();
                        }
                        $(this).find('.qr-holder').each(function()
                        {
                            $(this).qrcode({
                                render: 'image',
                                text: $(this).attr('data-content')
                            });
                        })
                    });
                }
            },
            confirm: function(title, content, callback)
            {
                $.fn.blockstrap.core.modal(title, content, 'confirm-modal');
                $('#confirm-modal .modal-footer .btn-success').on('click', function()
                {
                    $(this).addClass('loading');
                    callback(true);
                });
            },
            forms: function()
            {
                // PERHAPS FORMS NEEDS ITS OWN MODULE...?
                var backup = '';
                if($.isPlainObject(localStorage))
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
                        else if(key.substring(0, 14) == 'nw_blockstrap_')
                        {
                            if(!$.isArray(objs['nw_blockstrap']))
                            {
                                objs['nw_blockstrap'] = [];
                            }
                            objs['nw_blockstrap'].push(obj);
                        }
                        else if(key.substring(0, 8) == 'nw_keys_')
                        {
                            if(!$.isArray(objs['nw_keys']))
                            {
                                objs['nw_keys'] = [];
                            }
                            objs['nw_keys'].push(obj);
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
                    if($(this).find('option').length < 1)
                    {
                        var select = $(this);
                        var currencies = $.fn.blockstrap.settings.currencies;
                        if($.isPlainObject(currencies))
                        {
                            $(select).append('<option value="">-- Select Currency --</option>');
                            $.each(currencies, function(currency, v)
                            {
                                $(select).append('<option value="'+currency+'">'+v.currency+'</option>');
                            });
                        }
                    }
                });
                $($.fn.blockstrap.element).find('.bs-account-select').each(function(i)
                {
                    if($(this).find('option').length < 1)
                    {
                        var select = $(this);
                        var accounts = $.fn.blockstrap.accounts.get();
                        if($.isArray(accounts))
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
                    $(this).find('input[type="submit"]').trigger('click');
                });
                $($.fn.blockstrap.element).on('submit', '#search-form', function(e)
                {
                    e.preventDefault();
                    $.fn.blockstrap.core.modal('Warning', 'Search functionality will be available in the next major update');
                });
            },
            css: function(callback)
            {
                var core_css = $.fn.blockstrap.settings.core_base + 'css/';
                $.isArray($.fn.blockstrap.settings.css)
                {
                    var files = Object.keys($.fn.blockstrap.settings.css).length;
                    $.each($.fn.blockstrap.settings.css, function(k, v)
                    {
                        $('head').append('<link rel="stylesheet" type="text/css" href="'+core_css+v+'.css">');
                        if((k+1) >= files)
                        {
                            callback();
                        }
                    })
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
                    $(element).find('#loader-canvas').html(blockstrap_loader.canvas);
                    blockstrap_loader.play();
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
            filter: function(data)
            {
                $.each(data, function(k, v)
                { 
                    if($.isPlainObject(v) && v.func && $.isFunction($.fn.blockstrap.filters[v.func]))
                    {
                        data[k] = $.fn.blockstrap.filters[v.func]($.fn.blockstrap, v);
                    }
                    else if($.isPlainObject(v) || $.isArray(v))
                    {
                        data[k] = $.fn.blockstrap.core.filter(v);
                    }
                });
                return data;
            },
            buttons: function()
            {
                $($.fn.blockstrap.element).on('click', '.btn-page', function(e)
                {
                    $.fn.blockstrap.buttons.page(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.btn-reset-device', function(e)
                {
                    $.fn.blockstrap.buttons.reset(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.bs-setup', function(e)
                {
                    $(this).addClass('loading');
                    $.fn.blockstrap.buttons.setup(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#create-account', function(e)
                {
                    $(this).addClass('loading');
                    $.fn.blockstrap.buttons.account(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#create-contact', function(e)
                {
                    $(this).addClass('loading');
                    $.fn.blockstrap.buttons.contact(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.bs-toggle', function(e)
                {
                    $.fn.blockstrap.buttons.toggle(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.btn-remove', function(e)
                {
                    $.fn.blockstrap.buttons.remove(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.btn-logout', function(e)
                {
                    $.fn.blockstrap.buttons.logout(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.btn-login', function(e)
                {
                    $.fn.blockstrap.buttons.login(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#create-login-credentials', function(e)
                {
                    $.fn.blockstrap.buttons.credentials(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#set-credentials', function(e)
                {
                    $(this).addClass('loading');
                    $.fn.blockstrap.buttons.set(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#more-security', function(e)
                {
                    $.fn.blockstrap.buttons.more(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.btn-access', function(e)
                {
                    $.fn.blockstrap.buttons.access(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#submit-verification', function(e)
                {
                    $.fn.blockstrap.buttons.verify(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.btn-print', function(e)
                {
                    $.fn.blockstrap.buttons.print(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#send-money', function(e)
                {
                    $.fn.blockstrap.buttons.prepare(this, e);
                });
                $($.fn.blockstrap.element).on('click', '#submit-payment', function(e)
                {
                    $.fn.blockstrap.buttons.send(this, e);
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
            reset: function(reload)
            {
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
                    $.fn.blockstrap.settings.info.storage = {
                        local: {
                            used: '' + ((JSON.stringify(localStorage).length * 2) / 1000000) + ' MB',
                            remaining: '' + ((2490000 - (JSON.stringify(localStorage).length * 2)) / 1000000) + ' MB'
                        }
                    };
                    if(reload)
                    {
                        location.reload();
                    }
                    else
                    {
                        var remaining = $.fn.blockstrap.settings.info.storage.local.remaining;
                        $.fn.blockstrap.core.modal('Device Reset', remaining + ' Local Storage Remaining');
                    }
                }
            },
            tests: function(run)
            {
                if(!run) run = false;
                if(run)
                {
                    $.fn.blockstrap.api.address($.fn.blockstrap.settings.tests.api.address, 'btc', function(results)
                    {
                        console.log('address', results);
                    });
                    $.fn.blockstrap.api.transactions($.fn.blockstrap.settings.tests.api.transactions, 'btc', function(results)
                    {
                        console.log('transactions', results);
                    });
                    $.fn.blockstrap.api.addresses($.fn.blockstrap.settings.tests.api.addresses, 'btc', function(results)
                    {
                        console.log('addresses', results);
                    });
                    $.fn.blockstrap.api.transaction($.fn.blockstrap.settings.tests.api.transaction, 'btc', function(results)
                    {
                        console.log('transaction', results);
                    });
                    $.fn.blockstrap.api.block($.fn.blockstrap.settings.tests.api.block, 'btc', function(results)
                    {
                        console.log('block', results);
                    });
                    $.fn.blockstrap.api.relay($.fn.blockstrap.settings.tests.api.relay, 'btc', function(results)
                    {
                        console.log('relay', results);
                    });
                    $.fn.blockstrap.api.relay($.fn.blockstrap.settings.tests.api.unspents, 'btc', function(results)
                    {
                        console.log('unspents', results);
                    });
                }
            }
        };        

        Plugin();
    })
    (jQuery, window, document);
};

/*
 
CORE FUNCTIONS 
 
*/
var blockstrap_js_files = {};
var blockstrap_outputted = false;
var blockstrap_functions = {
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
    vars: function(variable)
    {
        if(!variable) variable = false;
        if(variable)
        {
            
            return $.fn.blockstrap.settings.vars[variable];
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
    exists: function(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
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
    include: function(blockstrap, start, files, callback, dependency)
    {
        var head = document.getElementsByTagName('head')[0];
        var refresh = blockstrap_functions.vars('refresh');
        var limit = files.length;
        
        if(!dependency) dependency = false;
        if(!start) start = 0;
        
        if($.isArray(files))
        {
            var js = '';
            var file_name = files[start];
            var js_file = localStorage.getItem('nw_js_'+file_name);

            if(!js_file || refresh)
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

                        localStorage.setItem('nw_js_'+file_name, js);

                        if(start >= limit)
                        {
                            callback();
                        }
                        else
                        {
                            start++;
                            blockstrap_functions.include(blockstrap, start, files, callback, dependency);
                        }
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
                if(start >= limit)
                {
                    callback();
                }
                else
                {
                    blockstrap_functions.include(blockstrap, start, files, callback, dependency);
                }
            }
        }
    },
    update: function(version, callback)
    {
        var current_version_array = version.split('.');
        $.fn.blockstrap.data.find('blockstrap', 'version', function(results)
        {
            var stored_version_array = false;
            if(results) stored_version_array = results.split('.');
            if($.isArray(stored_version_array))
            {
                $.each(stored_version_array, function(k, v)
                {
                    if(parseInt(current_version_array[k]) > parseInt(v))
                    {
                        $.fn.blockstrap.settings.vars.refresh = true;
                    }
                    if(k >= ($(current_version_array).length - 1))
                    {
                        $.fn.blockstrap.data.save('blockstrap', 'version', version, function(results)
                        {
                            callback();
                        });
                    }
                })
            }
            else
            {
                $.fn.blockstrap.settings.vars.refresh = true;
                $.fn.blockstrap.data.save('blockstrap', 'version', version, function(results)
                {
                    callback();
                });
            }
        })
    }
};
var blockstrap_js_scripts;
window.onload = function()
{
    blockstrap_functions.initialize();
}