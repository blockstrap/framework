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
    
    templates.filter = function(html, placeholders, replacements)
    {
        if(!placeholders || !replacements)
        {
            var raw_name = localStorage.getItem('nw_keys_your_name');
            var name = raw_name;

            if(blockstrap_functions.json(raw_name)) name = $.parseJSON(raw_name);
            
            // ADDRESS INFO
            var add_currency = 'Bitcoin';
            var key = blockstrap_functions.vars('key');
            var account = $.fn.blockstrap.accounts.address(key);
            if(!account)
            {
                account = {};
                account.tx_count = 0;
                account.receievd = 0;
                account.balance = 0;
                account.currency = false;
            }
            if($.fn.blockstrap.settings.currencies[account.currency])
            {
                add_currency = $.fn.blockstrap.settings.currencies[account.currency].currency;
            }
            
            // TX INFO
            var tx_currency = 'Bitcoin';
            var txid = blockstrap_functions.vars('txid');
            var tx = $.fn.blockstrap.accounts.tx(txid);
            if($.fn.blockstrap.settings.currencies[tx.currency])
            {
                tx_currency = $.fn.blockstrap.settings.currencies[tx.currency].currency;
            }

            var placeholders = [
                'urls.root', 
                'user.name',
                'vars.txid',
                'vars.key',
                'tx.size',
                'tx.time',
                'tx.block',
                'tx.input',
                'tx.output',
                'tx.fees',
                'address.tx_count',
                'address.balance'
            ];
            var replacements = [
                $.fn.blockstrap.settings.base_url,
                name,
                txid,
                key,
                tx.size + ' (Bytes)',
                tx.time,
                tx.block,
                parseInt(tx.input) / 100000000 + ' ' + tx_currency,
                parseInt(tx.output) / 100000000 + ' ' + tx_currency,
                parseInt(tx.fees) / 100000000 + ' ' + tx_currency,
                account.tx_count,
                parseInt(account.balance) / 100000000 + ' ' + add_currency
            ];
        }
        for(var i = 0; i < placeholders.length; i++) 
        {
            if(!html)
            {
                html = $($.fn.blockstrap.element).html();
                html = html.split('{{' + placeholders[i] + '}}').join(replacements[i]);
                $($.fn.blockstrap.element).html(html);
                $.fn.blockstrap.core.loader('close');
            }
            else
            {
                html = html.split('{{' + placeholders[i] + '}}').join(replacements[i]);
                if(i >= (placeholders.length - 1)) return html;
            }
        }
    }
    
    templates.bootstrap = function(type)
    {
        var snippet = localStorage.getItem('nw_boot_'+type);
        if(snippet)
        {
            if(blockstrap_functions.json(snippet)) snippet = $.parseJSON(snippet);
            return snippet;
        }
        else
        {
            return false;
        }
    }
    
    templates.process = function(data, html)
    {
        var results = '';
        if(data && html)
        {
            data = $.fn.blockstrap.core.filter(data);
            html = templates.filter(Mustache.render(html, data));
            results = html;
        }
        return results;
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
                    $.fn.blockstrap.data.save('data', slug, data, function()
                    {
                        $.fn.blockstrap.data.find('html', slug, function(results)
                        {
                            var html = results;
                            if(!html || refresh)
                            {
                                templates.get('themes/' + $.fn.blockstrap.settings.theme + '/' + $.fn.blockstrap.settings.html_base + slug, 'html', function(content)
                                {
                                    var paged_html = templates.filter(Mustache.render(content, filtered_data));
                                    
                                    if(force_refresh && slug === 'index')
                                    {
                                        $($.fn.blockstrap.element).html('');
                                        $($.fn.blockstrap.element).append(paged_html);
                                        $.fn.blockstrap.core.loader('open');
                                    }
                                    else if(force_refresh)
                                    {
                                        $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.content_id).html(paged_html);
                                    }
                                    else if(slug === 'index')
                                    {
                                        $($.fn.blockstrap.element).html('');
                                        $($.fn.blockstrap.element).append(paged_html);
                                        $.fn.blockstrap.core.loader('open');
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
                                var paged_html = templates.filter(Mustache.render(html, filtered_data));
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
                
                if(slug === 'index') $($.fn.blockstrap.element).html('');
                
                $.fn.blockstrap.data.find('html', slug, function(results)
                {
                    var html = results;
                    if(!html)
                    {
                        templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.html_base+slug, 'html', function(content)
                        {
                            var paged_html = templates.filter(Mustache.render(content, filtered_data));
                            $($.fn.blockstrap.element).append(paged_html);
                            $.fn.blockstrap.core.loader('open');
                            $.fn.blockstrap.data.save('html', slug, content, callback);
                        });
                    }
                    else
                    {
                        var paged_html = templates.filter(Mustache.render(html, filtered_data));
                        $($.fn.blockstrap.element).append(paged_html);
                        $.fn.blockstrap.core.loader('open');
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
