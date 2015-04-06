/*
 * 
 *  Blockstrap v0.5.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var templates = {};
    var template_data = {};
    
    templates.bootstrap = function(type)
    {
        var snippet = $.fn.blockstrap.snippets[type];
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
    
    templates.filter = function(html, placeholders, replacements)
    {
        if(!placeholders && !replacements)
        {
            var raw_name = localStorage.getItem('nw_keys_your_name');
            var name = raw_name;

            if(blockstrap_functions.json(raw_name)) name = $.parseJSON(raw_name);
            // ADDRESS INFO
            var add_blockchain = 'Bitcoin';
            var key = blockstrap_functions.vars('key');
            var account = false;
            if($.isPlainObject($.fn.blockstrap.accounts))
            {
                var account = $.fn.blockstrap.accounts.address(key);
            }
            if(!account)
            {
                account = {};
                account.tx_count = 0;
                account.receievd = 0;
                account.balance = 0;
                account.blockchain = false;
            }
            if(account.blockchain && $.fn.blockstrap.settings.blockchains[account.blockchain])
            {
                add_blockchain = $.fn.blockstrap.settings.blockchains[account.blockchain].blockchain;
            }
            
            // TX INFO
            var tx = false;
            var tx_blockchain = 'Bitcoin';
            var txid = blockstrap_functions.vars('txid');
            
            if($.isPlainObject($.fn.blockstrap.accounts))
            {
                tx = $.fn.blockstrap.accounts.tx(txid);
            }
            if(tx.blockchain && $.fn.blockstrap.settings.blockchains[tx.blockchain])
            {
                tx_blockchain = $.fn.blockstrap.settings.blockchains[tx.blockchain].blockchain;
            }
            else
            {
                txid = '';
                tx = {
                    size: 0,
                    time: 0,
                    block: '',
                    input: 0,
                    output: 0,
                    fees: 0,
                    tx_count: 0
                };
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
                parseInt(tx.input) / 100000000 + ' ' + tx_blockchain,
                parseInt(tx.output) / 100000000 + ' ' + tx_blockchain,
                parseInt(tx.fees) / 100000000 + ' ' + tx_blockchain,
                account.tx_count,
                parseInt(account.balance) / 100000000 + ' ' + add_blockchain
            ];
        }
        // TODO: FIX HACK PART TWO
        if(placeholders && replacements)
        {
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
        else
        {
            return html;
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
    
    templates.render = function(slug, callback, refresh, cancel_ready)
    {
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        var data_url = bs.settings.theme_base + bs.settings.theme + '/' + bs.settings.data_base + slug;
        var html_url = bs.settings.theme_base + bs.settings.theme + '/' + bs.settings.html_base + slug;
        bs.core.get(data_url, 'json', function(data)
        {
            if(typeof data.status == 'undefined' || data.status != 404)
            {
                template_data = $.extend({}, template_data, data);
                var filtered_data = $.fn.blockstrap.core.filter(template_data);
                $.fn.blockstrap.core.get(html_url, 'html', function(content)
                {
                    if(content)
                    {
                        var rendered_html = Mustache.render(content, filtered_data);
                        var paged_html = templates.filter(rendered_html);
                        if(refresh === true || slug == bs.settings.page_base)
                        {
                            $(bs.element).html('');
                            $(bs.element).append(paged_html);
                            if(!cancel_ready) bs.core.ready();
                            if(callback) callback(paged_html);
                        }
                        else
                        {
                            if($(bs.element).find('#' + bs.settings.content_id).length > 0)
                            {
                                $(bs.element).find('#' + bs.settings.content_id).html(paged_html);
                                if(!cancel_ready) bs.core.ready();
                                if(callback) callback(paged_html);
                            }
                            else
                            {
                                $(bs.element).html('');
                                $(bs.element).append(paged_html);
                                if(!cancel_ready) bs.core.ready();
                                if(callback) callback(paged_html);
                            }
                        }
                    }
                    else
                    {
                        if(callback) callback(false);
                    }
                });
            }
            else
            {
                if(callback) callback(false);
            }
        });
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {templates:templates});
})
(jQuery);
