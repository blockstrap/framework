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

var blockstrap_defaults = false;

if(typeof bs_loaded_this_file_already == 'undefined')
{
    var bs_loaded_this_file_already = false;
}

function bs_widget_switch(callback)
{
    var scripts = document.getElementsByTagName( "script" );
    for ( var i = 0; i < scripts.length; ++ i )
    {
        if ( scripts[i].src.slice(-9) == "widget.js" )
        {
            var script = $(scripts[i]);
            var data = $(script).data();
            var widget_label = $(script).text();
            $(script).addClass('to-be-removed');
            if(
                typeof data.type != 'undefined'
                && data.type.substring(0, 3) == 'btn'
            ){
                var type_array = data.type.split('-');
                var type = type_array[1];
                var chain = '';
                var address = '';
                var salt = '';
                var bip = '';
                var qr = '';
                var txs = '';
                var balance = '';
                var group = '';
                var amount = '';
                var label = '';
                var loading = '';
                var html = '';
                if(typeof data.chain != 'undefined') chain = ' data-chain="'+data.chain+'"';
                if(typeof data.address != 'undefined') address = ' data-address="'+data.address+'"';
                if(typeof data.salt != 'undefined') salt = ' data-salt="'+data.salt+'"';
                if(typeof data.bip != 'undefined') bip = ' data-bip="'+data.bip+'"';
                if(typeof data.qr != 'undefined') qr = ' data-qr="'+data.qr+'"';
                if(typeof data.txs != 'undefined') txs = ' data-txs="'+data.txs+'"';
                if(typeof data.balance != 'undefined') balance = ' data-balance="'+data.balance+'"';
                if(typeof data.group != 'undefined') group = ' data-group="'+data.group+'"';
                if(typeof data.amount != 'undefined') amount = ' data-amount="'+data.amount+'"';
                if(typeof data.label != 'undefined') label = ' data-label="'+data.label+'"';
                if(typeof data.loading != 'undefined') loading = ' data-loading="'+data.loading+'"';
                if(typeof data.html != 'undefined') html = ' data-html="'+data.html+'"';
                var widget_html = '<a href="#" class="btn btn-primary btn-bs-widget bs-'+type+'" target="_blank"';
                widget_html+= chain+''+address+''+salt+''+bip+''+qr+''+txs+''+balance+''+group+''+amount+''+label+''+loading+''+html+'>';
                widget_html+= widget_label+'</a>';
                $(script).after(widget_html);
            }
        }
        if(i >= scripts.length - 1)
        {
            $('script.to-be-removed').remove();
            callback();
        }
    }
}

function bs_widgets_init()
{
    if(
        typeof $.fn.blockstrap != 'undefined'
        && typeof $.fn.blockstrap.widgets != 'undefined'
        && typeof $.fn.blockstrap.widgets.init != 'undefined'
    )
    {
        if(typeof bs_widget_init == 'undefined' || !bs_widget_init)
        {
            $.fn.blockstrap.widgets.init();
        }
    }
}

if(!bs_loaded_this_file_already)
{
    bs_loaded_this_file_already = true;
    document.addEventListener('DOMContentLoaded', function()
    {
        if(
            typeof $ != 'undefined'
            && typeof $.fn != 'undefined'
        ){
            bs_widget_switch(function()
            {
                bs_widgets_init();
            });
        }
        else
        {
            /* TODO - "ASSUMES" IT NEEDS TO LOAD EVERYTHING */
            var t = document.getElementsByTagName('head')[0];
            var s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('src', 'options.js');
            s.setAttribute('id', 'blockstrap-options');
            s.onload = function()
            {
                var jq = document.createElement('script');
                jq.setAttribute('type', 'text/javascript');
                jq.setAttribute('src', 'blockstrap/js/dependencies/jquery.min.js');
                jq.setAttribute('id', 'jquery');
                jq.onload = function()
                {
                    var s2 = document.createElement('script');
                    s2.setAttribute('type', 'text/javascript');
                    s2.setAttribute('src', 'blockstrap/js/widget.options.js');
                    s2.setAttribute('id', 'blockstrap-widget-options');
                    s2.onload = function()
                    {
                        var s3 = document.createElement('script');
                        s3.setAttribute('type', 'text/javascript');
                        s3.setAttribute('src', 'blockstrap/js/blockstrap.js');
                        s3.setAttribute('id', 'blockstrap-core');
                        s3.onload = function()
                        {
                            blockstrap_functions.initialize();
                            var $bs = blockstrap_functions;
                            var bs = $.fn.blockstrap;
                            $bs.update(bs.settings.v, function(saved_version, this_version, refresh)
                            {
                                if($.isArray(bs.settings.dependencies))
                                {
                                    $bs.include(bs, 0, bs.settings.dependencies, function()
                                    {
                                        if($.isArray(bs.settings.modules))
                                        {
                                            $bs.include(bs, 0, bs.settings.modules, function()
                                            {
                                                bs.core.loaded(saved_version, this_version, refresh); 
                                                bs_widget_switch(function()
                                                {
                                                    bs_widgets_init();
                                                });
                                            });
                                        }
                                    }, true);
                                }
                            });
                        }
                        t.appendChild(s3);
                    }
                    t.appendChild(s2);
                }
                t.appendChild(jq);
            }
            t.appendChild(s);
        }

    }, false);
}