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
            v: '1.0.2.4',
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
            css: ['font-awesome'],
            filters: ['bootstrap', 'got', 'setup'],
            store: ['app_url', 'your_name'],
            modules: [
                'filters', 
                'data', 
                'api', 
                'security', 
                'buttons', 
                'styles', 
                'templates'
            ],
            dependencies: [
                'sonic', 
                'swipe', 
                'effects', 
                'steps',
                'bootstrap.min', 
                'bootstrap-switch.min',
                'mustache', 
                'tables',
                'crypto'
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
                    address: '1121cQLqCsDsLPAkJW5ddTCREZ7Bp4ufrk',
                    transaction: '06032a172f88ba823785f87341eab26ee7a2eb2de9d2f105220d6580e3affc16',
                    transactions: '1121cQLqCsDsLPAkJW5ddTCREZ7Bp4ufrk',
                    addresses: '1121cQLqCsDsLPAkJW5ddTCREZ7Bp4ufrk&addresses=12higDjoCCNXSA95xZMWUdPvXNmkAduhWv',
                    block: '15968'
                }
            },
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
                $.fn.blockstrap.core.table();
                $.fn.blockstrap.core.form();
                $.fn.blockstrap.buttons.new();
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
                $.fn.blockstrap.templates.render('index', function()
                {
                    $.fn.blockstrap.styles.set();
                    $($.fn.blockstrap.element).animate({'opacity':1}, 600, function()
                    {
                        $.fn.blockstrap.core.loading();
                        $.fn.blockstrap.core.buttons();
                        $.fn.blockstrap.core.forms();
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
                });
            },
            modal: function(title, content)
            {
                $('#default-modal').find('.modal-title').html(title);
                $('#default-modal').find('.modal-body').html(content);
                $('#default-modal').modal('show');
            },
            forms: function()
            {
                $($.fn.blockstrap.element).find("input.switch").each(function()
                {
                    $(this).bootstrapSwitch();
                    $(this).on('switchChange.bootstrapSwitch', function(event, state) {
                        $(this).val(state);
                    });
                });
                $('body').on('change', '.bs-dobs', function(i)
                {
                    var field = $(this).parent().find('input[type="hidden"]');
                    var day = $(this).parent().find('.bs-dob-day').val();
                    var month = $(this).parent().find('.bs-dob-month').val();
                    var year = $(this).parent().find('.bs-dob-year').val();
                    $(field).val(day + '_' + month + '_' + year);
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
                $($.fn.blockstrap.element).find('.loading-elements').animate({'opacity':1}).delay(0).animate({'opacity':0}, 600, function(e)
                {
                    if($(this).hasClass('loading')) $(this).removeClass('loading');
                    $($.fn.blockstrap.element).removeClass('loading');
                    $($.fn.blockstrap.element).find('.loading-elements').css({'opacity':1});
                })
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
            form: function()
            {
                $($.fn.blockstrap.element).find('textarea.data-backup').val(JSON.stringify($.fn.blockstrap.data.get('index')));
            },
            filter: function(data)
            {
                $.each(data, function(k, v)
                {
                    var data_key = k;
                    if(v && v.body && v.body.type && v.body.objects)
                    {
                        $.each(v.body.objects, function(k, obj_v)
                        {
                            var object_key = k;
                            if(obj_v.fields)
                            {
                                $.each(obj_v.fields, function(k, field_v)
                                {
                                    var field_key = k;
                                    if(
                                        field_v.inputs 
                                        && field_v.inputs.value 
                                        && field_v.inputs.value === '{{urls.root}}')
                                    {
                                        v.body.objects[object_key].fields[field_key].inputs.value = $.fn.blockstrap.settings.base_url;
                                    }
                                });
                            }
                        });
                    }
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
                $($.fn.blockstrap.element).on('click', '.btn-filter', function(e)
                {
                    $.fn.blockstrap.buttons.filter(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.btn-reset-device', function(e)
                {
                    $.fn.blockstrap.buttons.reset(this, e);
                });
                $($.fn.blockstrap.element).on('click', '.bs-setup', function(e)
                {
                    $.fn.blockstrap.buttons.setup(this, e);
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
        var name = slug.replace('-', '_');
        name = name.replace('.', '_');
        return name.toLowerCase();
    },
    include: function(blockstrap, start, files, callback, dependency)
    {
        var head = document.getElementsByTagName('head')[0];
        var blockstrap_js_scripts = document.createElement("script");
        var results = false;
        if(localStorage)
        {
            var obj = localStorage.getItem('nw_inc_js');
            if(blockstrap_functions.json(obj)) results = $.parseJSON(obj);
            else results = localStorage.getItem('nw_inc_js');
        }
        var refresh = blockstrap_functions.vars('refresh');
        if(refresh === true || !results)
        {
            if(!dependency) dependency = false;
            if(!files) return false;
            if(!start) start = 0;
            var limit = files.length;
            if($.isArray(files))
            {
                // INCLUDE CORE
                var filename = blockstrap.settings.core_base + blockstrap.settings.dependency_base + files[start] + '.js';
                if(!dependency)
                {
                    filename = blockstrap.settings.core_base + blockstrap.settings.module_base + files[start] + '.js';
                }
                $.ajax({
                    url: filename,
                    type: 'GET',
                    dataType: 'HTML',
                    complete: function(results)
                    {
                        var js = '';
                        if(results.responseText && results.responseText !== '404' && results.status === 200) js+= results.responseText+"\n";
                        var theme_filename = 'themes/'+blockstrap.settings.theme+'/js/dependencies/' + files[start] + '.js';
                        if(!dependency)
                        {
                            theme_filename = 'themes/'+blockstrap.settings.theme+'/js/modules/' + files[start] + '.js';
                        }
                        $.ajax({
                            url: theme_filename,
                            type: 'GET',
                            dataType: 'HTML',
                            complete: function(results)
                            {
                                if(results.responseText && results.responseText !== '404' && results.status === 200) js+= results.responseText+"\n";
                                blockstrap_js_files[blockstrap_functions.slug(files[start])] = js;
                                start++;
                                if(start < limit)
                                {
                                    blockstrap_functions.include(blockstrap, start, files, callback, dependency);
                                }
                                else
                                {
                                    if(dependency)
                                    {
                                        callback();
                                    }
                                    else
                                    {
                                        var key = '';
                                        var text = '';
                                        var count = 0;
                                        $.each(blockstrap_js_files, function(k, v)
                                        {
                                            if(count > 0) key+='_'+k;
                                            else key+=k;
                                            count++;
                                            text+=v+"\n";
                                            if(count >= Object.keys(blockstrap_js_files).length)
                                            {
                                                blockstrap_js_scripts.setAttribute('type', 'text/javascript');
                                                blockstrap_js_scripts.setAttribute('id', key);
                                                blockstrap_js_scripts.text = text;
                                                head.appendChild(blockstrap_js_scripts);  
                                                $.fn.blockstrap.data.save('inc', 'js', text, function(results)
                                                {
                                                    $.fn.blockstrap.data.find('inc', 'js', function(results)
                                                    {
                                                        callback(results);
                                                    });
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })

                    }
                });
            }
        }
        else
        {
            if(dependency)
            {
                blockstrap_js_scripts.setAttribute('type', 'text/javascript');
                blockstrap_js_scripts.setAttribute('id', 'nw-js');
                blockstrap_js_scripts.text = results;
                head.appendChild(blockstrap_js_scripts);
                callback(results);
            }
            else
            {
                callback(results);
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