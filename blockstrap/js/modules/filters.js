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
    var filters = {};
    
    filters.accounts = function(blockstrap, data)
    {
        var accounts = [];
        if(localStorage)
        {
            $.each(localStorage, function(key, account)
            {
                if(key.substring(0, 12) === 'nw_accounts_')
                {
                    var this_account = $.parseJSON(account);
                    if(typeof this_account.keys != 'undefined' && this_account.keys)
                    {
                        if(typeof this_account.id != 'undefined')
                        {
                            var account = $.fn.blockstrap.accounts.get(this_account.id);
                            account.blockchains = [];
                            if(typeof this_account.blockchains != 'undefined')
                            {
                                $.each(this_account.blockchains, function(chain, obj)
                                {
                                    if(
                                        typeof this_account.contracts != 'undefined'
                                        && typeof this_account.contracts[chain] != 'undefined'
                                        && $.isPlainObject(this_account.contracts[chain])
                                    ){
                                        obj.contracts = [];
                                        $.each(this_account.contracts[chain], function(k, contract)
                                        {
                                            contract.account_id = this_account.id;
                                            contract.contract_id = k;
                                            if(typeof contract.tx_count == 'undefined')
                                            {
                                                contract.tx_count = 0;
                                            }
                                            if(typeof contract.balance == 'undefined')
                                            {
                                                contract.balance = 0;
                                            }
                                            var decimal_places = 8;
                                            var minimum_unit = 100000000;
                                            contract.display_balance = parseFloat(contract.balance / minimum_unit).toFixed(decimal_places);
                                            obj.contracts.push(contract);
                                        });
                                    }   
                                    else
                                    {
                                        obj.contracts = false;
                                    }
                                    account.blockchains.push(obj);
                                });
                                accounts.push(account);
                            }
                        }
                    }
                }
            });
        }
        return accounts;
    }
    
    filters.avatars = function(blockstrap, data)
    {
        var photo = blockstrap.data.option('your_photo');
        if(!photo && data.default) photo = data.default;
        var image = '<img class="avatar" src="'+photo+'" />';
        return image;
    }
    
    filters.balances = function(blockstrap, data)
    {
        var data = [];
        var balances = blockstrap.accounts.balances();
        if($.isPlainObject(balances))
        {
            $.each(balances, function(k, v)
            {
                data.push({
                    code: k,
                    blockchain: v.name,
                    count: v.count,
                    balance: v.balance
                });
            });
        }
        return data;
    }
    
    filters.bootstrap = function(blockstrap, data)
    {
        var snippet = blockstrap.snippets[data.type];
        var html = Mustache.render(snippet, data);
        return html;
    }
    
    filters.contacts = function(blockstrap, data)
    {
        var contacts = [];
        if(localStorage)
        {
            $.each(localStorage, function(key, contact)
            {
                if(key.substring(0, 12) === 'nw_contacts_')
                {
                    contacts.push($.parseJSON(contact));
                }
            });
        }
        return contacts;
    }
    
    filters.get = function(blockstrap, data)
    {
        if(data.collection && data.key)
        {
            var obj = localStorage.getItem('nw_'+data.collection+'_'+data.key);
            if(blockstrap_functions.json(obj)) return $.parseJSON(obj);
            else return obj;
        }
        else return false;
    }
    
    filters.got = function(blockstrap, data)
    {
        if(data.collection && data.key)
        {
            var obj = localStorage.getItem('nw_'+data.collection+'_'+data.key);
            if(obj) return true;
            else return false;
        }
        else return false;
    }
    
    filters.last = function(blockstrap, data)
    {
        var html = '';
        var type = 'tx';
        var alternative = false;
        if(data.html) html = data.html;
        if(data.type) type = data.type;
        if(data.alternative) alternative = data.alternative;
        if(type == 'tx')
        {
            var latest = 0;
            var accounts = $.fn.blockstrap.accounts.get();
            if($.isArray(accounts) && blockstrap_functions.array_length(accounts) > 0)
            {
                $.each(accounts, function(k, account)
                {
                    if($.isArray(account.txs) && blockstrap_functions.array_length(account.txs) > 0)
                    {
                        $.each(account.txs, function(key, tx)
                        {
                            if(tx.tx && tx.tx.time && tx.tx.time > latest) latest = tx.tx.time;
                        });
                    };
                });
                if(latest > 0)
                {
                    var ago = $.fn.blockstrap.core.ago(latest);
                    var placeholders = ['ago'];
                    var replacements = [ago];
                    return $.fn.blockstrap.templates.filter(html, placeholders, replacements);
                }
                else
                {
                    return alternative;
                }
            }
            else if(alternative)
            {
                return alternative;
            }
        }
        else
        {
            return data;
        }
    }
    
    filters.plugin = function(blockstrap, data)
    {
        if(data.name && data.call && data.data)
        {
            if(blockstrap.plugins[data.name] && $.isFunction(blockstrap.plugins[data.name][data.call]))
            {
                return blockstrap.plugins[data.name][data.call](data.data);
            }
            else return data;
        }
        else return data;
    } 
    
    filters.settings = function(blockstrap, data)
    {
        return blockstrap.settings;
    }
    
    filters.send = function(blockstrap, data)
    {
        return 'send form here';
    }
    
    filters.setup = function(blockstrap, data)
    {
        if(data.step)
        {
            var step = parseInt(data.step) - 1;
            return blockstrap.core.filter(blockstrap_setup_steps[step]);
        }
        else return data;
    }
    
    filters.total = function(blockstrap, data)
    {
        var rate = 'usd';
        var prefix = 'US$';
        if(data.rate) rate = data.rate;
        if(data.prefix) prefix = data.prefix;
        return blockstrap.accounts.total(rate, prefix);
    }
    
    filters.txs = function(blockstrap, data)
    {
        var txs = [];
        var items = [];
        var id = false;
        var limit = 7;
        if(data.id) id = data.id;
        if(data.limit) limit = parseInt(data.limit);
        var accounts = $.fn.blockstrap.accounts.get();
        if(id)
        {
            accounts = [];
            accounts.push($.fn.blockstrap.accounts.get(id));
        }
        if(blockstrap_functions.array_length(accounts) > 0)
        {
            $.each(accounts, function(key, account)
            {
                if(account.keys)
                {
                    if(account.txs && blockstrap_functions.array_length(account.txs) > 0)
                    {
                        $.each(account.txs, function(k, transaction)
                        {
                            transaction.tx.address = transaction.address;
                            txs.push(transaction.tx);
                        });
                    }
                }
            });
            var pre_sorted_txs = JSON.parse(JSON.stringify(txs));
            txs.sort(function(a,b) 
            { 
                return parseInt(b.time) - parseInt(a.time) 
            });
            $.each(txs.slice(0, limit), function(k, tx)
            {
                var css = 'from';
                var address = false;
                var txc = tx.blockchain;
                var value = parseInt(tx.value) / 100000000;
                var verb = 'to';
                if(tx.value < 0)
                {
                    value = Math.abs(value);
                    css = 'to';
                    verb = 'from';
                }
                var base = $.fn.blockstrap.settings.base_url;
                var intro = value + ' ' + $.fn.blockstrap.settings.blockchains[txc].blockchain;
                var html = '<a href="' + base + '?txid=' + tx.txid +'#transaction">' + intro + '</a>';
                var this_address = tx.address;
                $.each(localStorage, function(k, v)
                {
                    var values = v;
                    if(blockstrap_functions.json(values))
                    {
                        values = $.parseJSON(values);
                    }
                    if(
                        typeof values.id != 'undefined'
                    )
                    {
                        this_account = $.fn.blockstrap.accounts.get(values.id);
                        if(
                            typeof this_account != 'undefined'
                            && typeof this_account.blockchains != 'undefined'
                            && typeof this_account.blockchains[tx.blockchain] != 'undefined'
                            && typeof this_account.blockchains[tx.blockchain].address != 'undefined'
                            && this_account.blockchains[tx.blockchain].address == this_address
                        ){
                            this_address = this_account.blockchains[tx.blockchain].name;
                        }
                    }
                });
                address = '<a href="' +base+ '?key='+tx.address+'#address">' + this_address + '</a>';
                html+= ' '+verb+' ' + address;
                items.push({
                    css: css,
                    html: html,
                    buttons: [
                        {
                            href: '',
                            css: 'btn-disabled disabled btn-xs pull-right',
                            text: $.fn.blockstrap.core.ago(tx.time)
                        }
                    ]
                });
            });
            var lists = $.fn.blockstrap.templates.bootstrap('lists');
            var html = $.fn.blockstrap.templates.process({
                objects: [
                    {
                        items: items,
                        missing: '<p>You do not have any transactions yet.</p><p>You may want to create a new <a href="#accounts" class="btn-page">account</a> or <a href="#" data-target="#send-modal" data-toggle="modal">send</a> some to one of your <a href="#contacts" class="btn-page">contacts</a>.</p>'
                    }
                ]
            }, lists);
            return html;
        }
        var lists = $.fn.blockstrap.templates.bootstrap('lists');
        var html = $.fn.blockstrap.templates.process({
            objects: [
                {
                    items: items,
                    missing: '<p>You do not have any transactions yet.</p><p>You may want to create a new <a href="#accounts" class="btn-page">account</a> or <a href="#" data-target="#send-modal" data-toggle="modal">send</a> some to one of your <a href="#contacts" class="btn-page">contacts</a>.</p>'
                }
            ]
        }, lists);
        return html;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {filters:filters});
})
(jQuery);