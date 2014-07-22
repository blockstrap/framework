/*
 * 
 *  Neuroware Core v0.1.1 - http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 *  -- Please note that Neuroware Core is required by all Neuroware Products
 *  -- Including this file in the HTML header is the only requirement
 *  -- Everything else, including the loading of dependencies is handled here
 *  
 */

// INCLUDE LATEST VERSION OF jQUERY FROM GOOGLE CDN
var neuroware_jquery_url = 'http://code.jquery.com/jquery-latest.min.js';

var neuroware_core = function()
{
    /* 
    
    DONE LIKE THIS SO JQUERY CAN BE INJECTED FIRST IF REQUIRED
    
    */
    ;(function($, window, document, undefined)
    {
        // SET DEFAULTS
        var $this = this;
        var plugin_name = 'neuroware';
        var defaults = {
            v: '1.0.2.2',
            salt: '',
            autoload: true,
            id: plugin_name,
            theme: 'default',
            less: false,
            default_data: 'data/index.json',
            default_html: 'html/index.html',
            html_base: 'html/',
            data_base: 'data/',
            core_base: 'neuroware/',
            dependency_base: 'js/dependencies/',
            module_base: 'js/modules/',
            slug_base: 'dashboard',
            base_url: '',
            content_id: 'main-content',
            css: ['font-awesome'],
            filters: ['bootstrap'],
            modules: ['filters', 'data', 'api', 'security', 'buttons', 'styles', 'templates'],
            dependencies: ['sonic', 'swipe', 'effects', 'bootstrap.min', 'mustache', 'tables'],
            bootstrap: ['lists', 'jumbotrons', 'panels', 'tables', 'modals', 'forms', 'bars'],
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
            $.fn.neuroware.settings = $.extend({}, defaults, options);
            if($.fn.neuroware.settings.salt && localStorage) localStorage.setItem('nw_neuroware_salt', $.fn.neuroware.settings.salt);
            $.fn.neuroware.settings.vars = neuroware_functions.vars();
            if(neuroware_functions.vars('less')) $.fn.neuroware.settings.less = true;
            if(!$.fn.neuroware.settings.base_url)
            {
                $.fn.neuroware.settings.base_url = window.location.href.split('#')[0];
            }
            $.fn.neuroware.settings.info = {};

            // ESTABLISH DEFAULT ELEMENT
            if($(element).attr('src') || !element)
            {
                element = $('#neuroware');
            }
            $.fn.neuroware.element = element;
            $($.fn.neuroware.element).addClass('neuroware-wrapper loading');

            // DATA ATTRIBUTES
            var attributed_options = $($.fn.neuroware.element).data();
            if(attributed_options['id']) $.fn.neuroware.settings['id'] = attributed_options['id'];
            if(attributed_options['defaultData']) $.fn.neuroware.settings['default_data'] = attributed_options['defaultData'];
            if(attributed_options['defaultHtml']) $.fn.neuroware.settings['default_html'] = attributed_options['defaultHtml'];
            if(attributed_options['dataBase']) $.fn.neuroware.settings['data_base'] = attributed_options['dataBase'];
            if(attributed_options['htmlBase']) $.fn.neuroware.settings['html_base'] = attributed_options['htmlBase'];
            if(attributed_options['slugBase']) $.fn.neuroware.settings['slug_base'] = attributed_options['slugBase'];
            if(attributed_options['contentId']) $.fn.neuroware.settings['content_id'] = attributed_options['contentId'];
            if(attributed_options['filters']) $.fn.neuroware.settings['filters'] = attributed_options['filters'].split(', ');
            if(attributed_options['dependencies']) $.fn.neuroware.settings['dependencies'] = attributed_options['dependencies'].split(', ');
            if(attributed_options['modules']) $.fn.neuroware.settings['modules'] = attributed_options['modules'].split(', ');
            if(attributed_options['bootstrap']) $.fn.neuroware.settings['bootstrap'] = attributed_options['bootstrap'].split(', ');
            if(attributed_options['styles']) $.fn.neuroware.settings['styles'] = $.extend({}, $.fn.neuroware.settings.styles, $.fn.neuroware.core.stringed(attributed_options['styles'].split(', ')));
            
            // LOAD DEPENDENCIES FIRST
            if($.isArray($.fn.neuroware.settings.dependencies))
            {
                neuroware_functions.include($.fn.neuroware, 0, $.fn.neuroware.settings.dependencies, function()
                {
                    // THEN LOAD MODULES
                    if($.isArray($.fn.neuroware.settings.modules))
                    {
                        $.fn.neuroware.core.css(function()
                        {
                            neuroware_functions.include($.fn.neuroware, 0, $.fn.neuroware.settings.modules, function()
                            {
                                // RESET IF REQUIRED
                                if(neuroware_functions.vars('reset') === true)
                                {
                                    $.fn.neuroware.buttons.reset(false, false);
                                }
                                
                                neuroware_functions.update($.fn.neuroware.settings.v, function()
                                {
                                    // INJECT LESS.css EARLY IF REQUIRED
                                    $.fn.neuroware.data.find('inc', 'less', function(less)
                                    {
                                        var refresh = neuroware_functions.vars('refresh');
                                        if(!less || refresh === true) 
                                        {
                                            $('head').append('<link rel="stylesheet/less" type="text/css" href="'+$.fn.neuroware.settings.core_base+'less/neuroware.less">');
                                            neuroware_functions.js('js-neuroware-less', $.fn.neuroware.settings.core_base+'js/less.js', function()
                                            {
                                                var less_styles = false;
                                                $('style').each(function()
                                                {
                                                    // less-neuroware
                                                    var id = $(this).attr('id');
                                                    if(id)
                                                    {
                                                        var check = id.substring(0, 5);
                                                        var double_check = id.substring((id.length - 14), id.length);
                                                        if(check === 'less:' && double_check === 'less-neuroware')
                                                        {
                                                            less_styles = $(this).html();
                                                        }
                                                        if(less_styles)
                                                        {
                                                            $.fn.neuroware.data.save('inc', 'less', less_styles, function()
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
                                    $.fn.neuroware.snippets = {};                            
                                    var snippet_count = 0;
                                    var snippet_limit = 0;
                                    if($.isArray($.fn.neuroware.settings.bootstrap))
                                    {
                                        snippet_limit = $.fn.neuroware.settings.bootstrap.length;
                                    }
                                    if($.isArray($.fn.neuroware.settings.bootstrap))
                                    {
                                        $.each($.fn.neuroware.settings.bootstrap, function(k, v)
                                        {
                                            $.fn.neuroware.data.find('boot', v, function(results)
                                            {
                                                var refresh = neuroware_functions.vars('refresh');
                                                if(refresh === true || !results)
                                                {
                                                    $.fn.neuroware.templates.get($.fn.neuroware.settings.core_base+'html/bootstrap/'+v, 'html', function(html)
                                                    {                                        
                                                        $.fn.neuroware.data.save('boot', v, html, function(results)
                                                        {
                                                            $.fn.neuroware.snippets[v] = html;
                                                            snippet_count++;
                                                            if(snippet_count >= snippet_limit)
                                                            {
                                                                // INITIATE CORE
                                                                $.fn.neuroware.core.init();
                                                            }
                                                        })

                                                    });
                                                }
                                                else
                                                {
                                                    $.fn.neuroware.snippets[v] = results;
                                                    snippet_count++;
                                                    if(snippet_count >= snippet_limit)
                                                    {
                                                        // INITIATE CORE
                                                        $.fn.neuroware.core.init();
                                                    }
                                                }
                                            });
                                        });
                                    }
                                    else
                                    {
                                        // INITIATE CORE
                                        $.fn.neuroware.core.init();
                                    }
                                }) 
                            });
                        })
                    };
                }, true);
            }
            $.ajax({
                url: $.fn.neuroware.settings.core_base + 'html/' + 'loading.html',
                dataType: 'HTML',
                type: 'GET',
                complete: function(results)
                {
                    if($($.fn.neuroware.element).find('#'+$.fn.neuroware.settings.content_id).length < 1)
                    {
                        if(results && results.responseText && results.responseText === '404')
                        {

                        }
                        else
                        {
                            var loading = results.responseText;
                            $($.fn.neuroware.element).append(loading);
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
        $.fn.neuroware.core = {
            new: function()
            {
                /* 

                THESE FUNCTIONS NEED TO RUN EVERY TIME
                NEW HTML IS LOADED INTO THE DOM

                */
                $.fn.neuroware.core.table();
                $.fn.neuroware.core.form();
                $.fn.neuroware.buttons.new();
            },
            resize: function()
            {
                /* 

                THESE FUNCTIONS NEED TO RUN EVERY TIME
                DOCUMENT IS RESIZED - NEEDS TIMER

                */
                $.fn.neuroware.core.table();
            },
            init: function()
            {
                $.fn.neuroware.styles.set();
                $.fn.neuroware.templates.render('index', function()
                {
                    $($.fn.neuroware.element).animate({'opacity':1}, 600, function()
                    {
                        $.fn.neuroware.core.loading();
                        $.fn.neuroware.core.buttons();
                        $.fn.neuroware.core.new();
                        $(window).resize(function(e)
                        {
                            $.fn.neuroware.core.resize();
                        })
                    });
                    var run_tests = false;
                    var tests = neuroware_functions.vars('tests');
                    if(tests) run_tests = true;
                    $.fn.neuroware.core.tests(run_tests);
                });
            },
            css: function(callback)
            {
                var core_css = $.fn.neuroware.settings.core_base + 'css/';
                $.isArray($.fn.neuroware.settings.css)
                {
                    var files = Object.keys($.fn.neuroware.settings.css).length;
                    $.each($.fn.neuroware.settings.css, function(k, v)
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
                $($.fn.neuroware.element).find('.loading-elements').animate({'opacity':1}).delay(0).animate({'opacity':0}, 600, function(e)
                {
                    if($(this).hasClass('loading')) $(this).removeClass('loading');
                    $($.fn.neuroware.element).removeClass('loading');
                    $($.fn.neuroware.element).find('.loading-elements').css({'opacity':1});
                })
            },
            table: function()
            {
                $($.fn.neuroware.element).find('table.data-table').each(function(i)
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
                        $.fn.neuroware.core.table[$(this).attr('id')] = $(this).DataTable({
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
                $($.fn.neuroware.element).find('textarea.data-backup').val(JSON.stringify($.fn.neuroware.data.get('index')));
            },
            filter: function(data)
            {
                $.each(data, function(k, v)
                {
                    if($.isPlainObject(v) && v.func && $.isFunction($.fn.neuroware.filters[v.func]))
                    {
                        data[k] = $.fn.neuroware.filters[v.func]($.fn.neuroware, v);
                    }
                    else if($.isPlainObject(v) || $.isArray(v))
                    {
                        data[k] = $.fn.neuroware.core.filter(v);
                    }
                });
                return data;
            },
            buttons: function()
            {
                $($.fn.neuroware.element).on('click', '.btn-page', function(e)
                {
                    $.fn.neuroware.buttons.page(this, e);
                });
                $($.fn.neuroware.element).on('click', '.btn-filter', function(e)
                {
                    $.fn.neuroware.buttons.filter(this, e);
                });
                $($.fn.neuroware.element).on('click', '.btn-reset-device', function(e)
                {
                    $.fn.neuroware.buttons.reset(this, e);
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
                    $.fn.neuroware.api.address($.fn.neuroware.settings.tests.api.address, 'btc', function(results)
                    {
                        console.log('address', results);
                    });
                    $.fn.neuroware.api.transactions($.fn.neuroware.settings.tests.api.transactions, 'btc', function(results)
                    {
                        console.log('transactions', results);
                    });
                    $.fn.neuroware.api.addresses($.fn.neuroware.settings.tests.api.addresses, 'btc', function(results)
                    {
                        console.log('addresses', results);
                    });
                    $.fn.neuroware.api.transaction($.fn.neuroware.settings.tests.api.transaction, 'btc', function(results)
                    {
                        console.log('transaction', results);
                    });
                    $.fn.neuroware.api.block($.fn.neuroware.settings.tests.api.block, 'btc', function(results)
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
var neuroware_js_files = {};
var neuroware_outputted = false;
var neuroware_functions = {
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
            
            return $.fn.neuroware.settings.vars[variable];
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
        if(!neuroware_outputted) 
        {
            neuroware_outputted = true;
            if(typeof(jQuery) === 'undefined') 
            {
                neuroware_functions.js('js-neuroware-jquery', neuroware_jquery_url, function()
                {
                    neuroware_core();
                });
            } 
            else 
            {
                neuroware_core();
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
        return name;
    },
    include: function(neuroware, start, files, callback, dependency)
    {
        var head = document.getElementsByTagName('head')[0];
        var neuroware_js_scripts = document.createElement("script");
        var results = false;
        if(localStorage)
        {
            var obj = localStorage.getItem('nw_inc_js');
            if(neuroware_functions.json(obj)) results = $.parseJSON(obj);
            else results = localStorage.getItem('nw_inc_js');
        }
        var refresh = neuroware_functions.vars('refresh');
        if(refresh === true || !results)
        {
            if(!dependency) dependency = false;
            if(!files) return false;
            if(!start) start = 0;
            var limit = files.length;
            if($.isArray(files))
            {
                // INCLUDE CORE
                var filename = neuroware.settings.core_base + neuroware.settings.dependency_base + files[start] + '.js';
                if(!dependency)
                {
                    filename = neuroware.settings.core_base + neuroware.settings.module_base + files[start] + '.js';
                }
                $.ajax({
                    url: filename,
                    type: 'GET',
                    dataType: 'HTML',
                    complete: function(results)
                    {
                        var js = '';
                        if(results.responseText && results.responseText !== '404' && results.status === 200) js+= results.responseText+"\n";
                        var theme_filename = 'themes/'+neuroware.settings.theme+'/js/dependencies/' + files[start] + '.js';
                        if(!dependency)
                        {
                            theme_filename = 'themes/'+neuroware.settings.theme+'/js/modules/' + files[start] + '.js';
                        }
                        $.ajax({
                            url: theme_filename,
                            type: 'GET',
                            dataType: 'HTML',
                            complete: function(results)
                            {
                                if(results.responseText && results.responseText !== '404' && results.status === 200) js+= results.responseText+"\n";
                                neuroware_js_files[neuroware_functions.slug(files[start])] = js;
                                start++;
                                if(start < limit)
                                {
                                    neuroware_functions.include(neuroware, start, files, callback, dependency);
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
                                        $.each(neuroware_js_files, function(k, v)
                                        {
                                            if(count > 0) key+='_'+k;
                                            else key+=k;
                                            count++;
                                            text+=v+"\n";
                                            if(count >= Object.keys(neuroware_js_files).length)
                                            {
                                                neuroware_js_scripts.setAttribute('type', 'text/javascript');
                                                neuroware_js_scripts.setAttribute('id', key);
                                                neuroware_js_scripts.text = text;
                                                head.appendChild(neuroware_js_scripts);  
                                                $.fn.neuroware.data.save('inc', 'js', text, function(results)
                                                {
                                                    $.fn.neuroware.data.find('inc', 'js', function(results)
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
                neuroware_js_scripts.setAttribute('type', 'text/javascript');
                neuroware_js_scripts.setAttribute('id', 'nw-js');
                neuroware_js_scripts.text = results;
                head.appendChild(neuroware_js_scripts);
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
        $.fn.neuroware.data.find('neuroware', 'version', function(results)
        {
            var stored_version_array = false;
            if(results) stored_version_array = results.split('.');
            if($.isArray(stored_version_array))
            {
                $.each(stored_version_array, function(k, v)
                {
                    if(parseInt(current_version_array[k]) > parseInt(v))
                    {
                        $.fn.neuroware.settings.vars.refresh = true;
                    }
                    if(k >= ($(current_version_array).length - 1))
                    {
                        $.fn.neuroware.data.save('neuroware', 'version', version, function(results)
                        {
                            callback();
                        });
                    }
                })
            }
            else
            {
                $.fn.neuroware.settings.vars.refresh = true;
                $.fn.neuroware.data.save('neuroware', 'version', version, function(results)
                {
                    callback();
                });
            }
        })
    }
};
var neuroware_js_scripts;
window.onload = function()
{
    neuroware_functions.initialize();
}