/*
 * 
 *  Blockstrap v0.6.0.1
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
            var amount = '';
            var raw_name = localStorage.getItem('nw_keys_your_name');
            var name = raw_name;
            if(blockstrap_functions.json(raw_name)) name = $.parseJSON(raw_name);
            blockstrap_functions.vars();
            
            // ADDRESS INFO
            var archived = '';
            var address_url = '';
            var address_hidden = '';
            var current_account = false;
            var add_blockchain = 'Bitcoin';
            var address_received = 0;
            var key = blockstrap_functions.vars('key');
            var from = blockstrap_functions.vars('from');
            var chain = blockstrap_functions.vars('chain');
            var current_txs = '<ul class="list-group"><li class="list-group-item"><div class="list-item-content">No transactions found in localStorage</div><a class="btn btn-xs disabled pull-right" href="">N/A</a></li></ul>';
            if(!key) key = '';
            if(parseInt(blockstrap_functions.vars('amount')) > 0)
            {
                amount = parseFloat(parseInt(blockstrap_functions.vars('amount')) / 100000000).toFixed(8);
            }
            var account = false;
            if($.isPlainObject($.fn.blockstrap.accounts))
            {
                var current_account = $.fn.blockstrap.accounts.address(key);
            }
            var account = {
                tx_count: 0,
                received: 0,
                balance: 0,
                blockchain: false
            }
            var key_name = $.fn.blockstrap.core.apis('key_name');
            if(account.blockchain && $.fn.blockstrap.settings.blockchains[account.blockchain])
            {
                add_blockchain = $.fn.blockstrap.settings.blockchains[account.blockchain].blockchain;
            }
            if(current_account)
            {
                account.tx_count = current_account.tx_count;
                account.balance = current_account.balance;
                account.blockchain = current_account.code;
                if(typeof current_account.receievd != 'undefined' && current_account.receievd)
                {
                    account.received = parseInt(current_account.received) / 100000000 + ' ' + add_blockchain;
                }
                var api_provider = $.fn.blockstrap.core.api();
                var base_api_url = $.fn.blockstrap.settings.blockchains[account.blockchain].apis[api_provider];
                var address_slugs = $.fn.blockstrap.settings.apis.defaults[api_provider].functions.to.address;
                address_url = base_api_url + address_slugs + key;
                var api_key = $.fn.blockstrap.core.apis('key');
                if(api_key)
                {
                    if($.isArray(api_key))
                    {
                        api_key = api_key[Math.floor(Math.random()*api_key.length)];
                    }
                    address_url+= '?showtxnio=1&'+key_name+'=' + api_key;
                }
                var available_txs = $.fn.blockstrap.accounts.txs(current_account.id);
                if($.isArray(available_txs) && blockstrap_functions.array_length(available_txs) > 0)
                {
                    current_txs = '<ul class="list-group">';
                        $.each(available_txs, function(i)
                        {
                            if(available_txs[i].address == key)
                            {
                                current_txs+= '<li class="list-group-item"><div class="list-item-content">TXID:</div><a class="btn btn-xs pull-right" href="?txid=' + available_txs[i].txid + '#transaction">' + available_txs[i].txid + '</a></li>';
                            }
                        });
                    current_txs+= '</ul>';
                    if(account.tx_count < 1)
                    {
                        key+= ' (ARCHIVED)';
                        account.tx_count = 'N/A';
                    }
                }
            }
            else if(key && $.fn.blockstrap.core.page() != 'send')
            {
                key = 'N/A';
                address_hidden = 'hidden';
                account.tx_count = 'N/A';
            }
            
            // TX INFO
            var tx_url = '';
            var tx_hidden = '';
            var current_tx = false;
            var tx_blockchain = 'Bitcoin';
            var txid = blockstrap_functions.vars('txid');
            var tx = {
                size: 0,
                time: 0,
                block: '',
                input: 0,
                output: 0,
                fees: 0,
                tx_count: 0
            };
            
            if($.isPlainObject($.fn.blockstrap.accounts))
            {
                current_tx = $.fn.blockstrap.accounts.tx(txid);
                if(!current_tx) 
                {
                    txid = 'N/A';
                    tx_hidden = 'hidden';
                }
            }
            
            if(txid && txid != 'N/A' && typeof current_tx.tx != 'undefined' && typeof current_tx.tx.blockchain != 'undefined')
            {
                tx_blockchain = $.fn.blockstrap.settings.blockchains[current_tx.tx.blockchain].blockchain;
                if(typeof typeof current_tx.tx.size != 'undefined') tx.size = current_tx.tx.size;
                if(typeof current_tx.tx.time != 'undefined') tx.time = current_tx.tx.time;
                if(typeof current_tx.tx.input != 'undefined') tx.input = current_tx.tx.input;
                if(typeof current_tx.tx.output != 'undefined') tx.output = current_tx.tx.output;
                if(typeof current_tx.tx.fees != 'undefined') tx.fees = current_tx.tx.fees;
                if(typeof current_tx.tx.block != 'undefined' && current_tx.tx.block) tx.block = current_tx.tx.block;
                else
                {
                    tx.block = 'N/A';
                }
                var api_provider = $.fn.blockstrap.core.api();
                var base_api_url = $.fn.blockstrap.settings.blockchains[current_tx.tx.blockchain].apis[api_provider];
                var tx_slugs = $.fn.blockstrap.settings.apis.defaults[api_provider].functions.to.transaction;
                tx_url = base_api_url + tx_slugs + txid;
                var api_key = $.fn.blockstrap.core.apis('key');
                if(api_key)
                {
                    if($.isArray(api_key))
                    {
                        api_key = api_key[Math.floor(Math.random()*api_key.length)];
                    }
                    tx_url+= '?showtxnio=1&'+key_name+'=' + api_key;
                }
            }
            
            var app_salt = CryptoJS.SHA3((new Date).getTime() + '_' + navigator.userAgent, { outputLength: 512 }).toString();
            if(
                typeof $.fn.blockstrap.settings.app != 'undefined'
                && typeof $.fn.blockstrap.settings.app.salt != 'undefined'
            ){
                var seed_to_use_for_salt = $.fn.blockstrap.settings.app.salt;
                if(
                    typeof $.fn.blockstrap.settings.app.use_ua != 'undefined'
                    && $.fn.blockstrap.settings.app.use_ua === true
                ){
                    seed_to_use_for_salt+= '_' + navigator.userAgent;
                }
                if(
                    typeof $.fn.blockstrap.settings.app.use_domain != 'undefined'
                    && $.fn.blockstrap.settings.app.use_domain === true
                ){
                    seed_to_use_for_salt+= '_' + window.location.hostname;
                }
                app_salt = CryptoJS.SHA3(seed_to_use_for_salt, { outputLength: 512 }).toString();
            }
            
            var accounts = false;
            var contacts = false; 
            if(typeof $.fn.blockstrap.accounts != 'undefined')
            {
                accounts = $.fn.blockstrap.accounts.get();
            }
            if(typeof $.fn.blockstrap.contacts != 'undefined')
            {
                contacts = $.fn.blockstrap.contacts.get();
            }
            
            var account_count = blockstrap_functions.array_length(accounts);
            var contact_count = blockstrap_functions.array_length(contacts);
            if(account_count > 1 || account_count < 1) account_count = '' + account_count + ' accounts';
            else account_count = '' + account_count + ' account';
            if(contact_count > 1 || contact_count < 1) contact_count = '' + contact_count + ' contacts';
            else contact_count = '' + contact_count + ' contact';
            
            var placeholders = [
                'urls.root', 
                'urls.tx',
                'urls.address',
                'user.name',
                'user.api',
                'user.accounts',
                'user.contacts',
                'vars.txid',
                'vars.key',
                'vars.txs',
                'vars.from',
                'vars.chain',
                'vars.amount',
                'vars.archived',
                'tx.size',
                'tx.time',
                'tx.block',
                'tx.input',
                'tx.output',
                'tx.fees',
                'address.tx_count',
                'address.balance',
                'address.hidden',
                'tx.hidden',
                'salt'
            ];
            var replacements = [
                $.fn.blockstrap.settings.base_url,
                tx_url,
                address_url,
                name,
                $.fn.blockstrap.settings.apis.available[$.fn.blockstrap.core.api()],
                account_count,
                contact_count,
                txid,
                key,
                current_txs,
                from,
                chain,
                amount,
                archived,
                tx.size + ' (Bytes)',
                tx.time,
                tx.block,
                parseInt(tx.input) / 100000000 + ' ' + tx_blockchain,
                parseInt(tx.output) / 100000000 + ' ' + tx_blockchain,
                parseInt(tx.fees) / 100000000 + ' ' + tx_blockchain,
                account.tx_count,
                parseInt(account.balance) / 100000000 + ' ' + add_blockchain,
                address_hidden,
                tx_hidden,
                app_salt
            ];
        }
        
        // TODO: FUNCTIONALIZE THIS!!!
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
            if(typeof data.status == 'undefined' || (data.status != 404 && data.status != 0))
            {
                template_data = $.extend({}, template_data, data);
                var filtered_data = $.fn.blockstrap.core.filter(template_data);
                filtered_data = $.fn.blockstrap.core.apply_filters('templates_render', filtered_data, filtered_data);
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
