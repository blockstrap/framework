/*
 * 
 *  Blockstrap v0.6.0.0
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 *  -- Including this file in the HTML header is the only requirement
 *  -- Everything else, including the loading of dependencies is handled here
 *  
 */

(function($) 
{
    var accounts = {};
    
    accounts.access = function(account_id, tx, chain, standard, from)
    {
        var fields = [];
        var account = accounts.get(account_id, true);
        var account_chains = JSON.parse(JSON.stringify(account.blockchains));
        var is_tx = false;
        if($.isPlainObject(tx) && tx.to && tx.from && tx.amount)
        {
            is_tx = true;
        }
        var keys = account.keys;
        var data = account.data;
        if(
            typeof account.blockchains != 'undefined'
            && typeof account.blockchains[chain] != 'undefined'
        ){
            account = account.blockchains[chain];
            account.keys = keys;
            account.data = data;
        }
        else if(
            chain == 'all'
            && typeof account.blockchains != 'undefined'
        ){
            $.each(account_chains, function(chain, blockchain)
            {
                if(chain != 'multi') account = account_chains[chain];
            });
            account.keys = keys;
            account.data = data;
        }
        if($.isArray(account.keys))
        {
            $.each(account.keys, function(k, v)
            {
                var group_css = '';   
                var type = 'text';
                var key_array = v.split('_');
                var this_key = key_array[1];
                var value = account[this_key];
                var label = blockstrap_functions.unslug(this_key);
                var attributes = false;
                // TODO: HARD-CODED FIX THAT SHOULD BE DEALT WITH BY PATCH?
                if(this_key == 'blockchain' || this_key == 'currency')
                {
                    value = account.code;
                    type = 'hidden';
                    group_css = 'hidden';
                }
                if(this_key == 'password')
                {
                    type = 'password';
                    value = '';
                }
                else if(account[this_key])
                {
                    type = 'hidden';
                    group_css = 'hidden';
                }
                else if(typeof account.data != 'undefined' && account.data['wallet_'+this_key])
                {
                    value = account.data['wallet_'+this_key];
                    attributes = [
                        {
                            key: "readonly",
                            value: "readonly"
                        }
                    ];
                }
                else if($.fn.blockstrap.core.option('wallet_question_'+blockstrap_functions.slug(account.name), false) && this_key == 'answer')
                {
                    fields.push({
                        css: group_css,
                        inputs: {
                            id: 'wallet_question',
                            type: 'text',
                            label: {
                                css: 'col-xs-3',
                                text: 'Question'
                            },
                            wrapper: {
                                css: 'col-xs-9'
                            },
                            css: 'ignore',
                            value: $.fn.blockstrap.core.option('wallet_question_'+blockstrap_functions.slug(account.name), false),
                            attributes: [
                                {
                                    key: 'readonly',
                                    value: 'readonly'
                                }
                            ]
                        }
                    });
                }
                fields.push({
                    css: group_css,
                    inputs: {
                        id: v,
                        type: type,
                        label: {
                            css: 'col-xs-3',
                            text: label
                        },
                        wrapper: {
                            css: 'col-xs-9'
                        },
                        value: value,
                        attributes: attributes
                    }
                });
            })
        }
        if(is_tx === true)
        {
            fields.push({
                inputs: {
                    id: 'msg',
                    type: 'text',
                    label: {
                        css: 'col-xs-3',
                        text: 'OP_Return'
                    },
                    wrapper: {
                        css: 'col-xs-9'
                    },
                    placeholder: 'Optional Message to Encode on Chain'
                }
            });
        }
        var options = {
            css: 'form-horizontal',
            objects: [
                {
                    id: 'verify-ownership',
                    fields: fields
                }
            ],
            data: [
                {
                    key: "autocomplete",
                    value: "off"
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
                        id: "submit-verification",
                        css: 'btn-primary pull-right btn-split',
                        text: 'Submit',
                        attributes: [
                            {
                                key: 'data-account-id',
                                value: account_id
                            },
                            {
                                key: 'data-chain',
                                value: chain
                            },
                            {
                                key: 'data-standard',
                                value: standard
                            },
                            {
                                key: 'data-from',
                                value: from
                            },
                            {
                                key: 'data-form-id',
                                value: 'verify-ownership'
                            }
                        ]
                    }
                ]
            }
        };
        var intro = '';
        if(is_tx === true)
        {
            options.buttons.forms[1].id = 'submit-payment';
            options.buttons.forms[1].attributes.push({
                key: 'data-to-address',
                value: tx.to
            });
            options.buttons.forms[1].attributes.push({
                key: 'data-from-address',
                value: tx.from
            });
            options.buttons.forms[1].attributes.push({
                key: 'data-to-amount',
                value: tx.amount
            });
            options.buttons.forms[1].attributes.push({
                key: 'data-to-blockchain',
                value: account.code
            });
            var amount = parseInt(tx.amount) / 100000000;
            var fee = $.fn.blockstrap.settings.blockchains[account.code].fee;
            amount = amount + ' ' + account.type;
            intro = '<p class="left">Please confirm you want to send ' + amount + ' to ' + tx.to + '</p><p>Please also note that there is a network mining fee of ' + fee + ' ' + account.type + ' applied to this transaction to ensure that it is propergated throughout the network quickly.</p>';
        }
        var form = $.fn.blockstrap.forms.process(options);
        $.fn.blockstrap.core.modal('Verify Ownership of ' + account.name, intro + form);
    }
    
    accounts.address = function(key, account_id)
    {
        var accounts = [];
        var address = false;
        if(account_id) accounts.push($.fn.blockstrap.accounts.get(account_id));
        else accounts = $.fn.blockstrap.accounts.get();
        if($.isArray(accounts))
        {
            $.each(accounts, function(k, account)
            {
                if(account.address == key)
                {
                    address = account;
                }
            });
        }
        return address;
    }
    
    accounts.balances = function()
    {
        var balances = {};
        var accounts = $.fn.blockstrap.accounts.get();
        if($.isArray(accounts))
        {
            $.each(accounts, function(k, v)
            {
                $.each(v.blockchains, function(k, v)
                {
                    var balance = 0;
                    if(v.balance) balance = parseInt(v.balance);
                    if(balances[v.code])
                    {
                        balances[v.code].balance = parseInt(balances[v.code].balance) + balance;
                        balances[v.code].count++;
                        balances[v.code].name = v.type;
                    }
                    else
                    {
                        balances[v.code] = {};
                        balances[v.code].balance = parseInt(balance);
                        balances[v.code].count = 1;
                        balances[v.code].name = v.type;
                    }
                });
            });
            $.each(balances, function(blockchain, obj)
            {
                var this_balance = balances[blockchain].balance;
                balances[blockchain].balance = parseInt(this_balance) / 100000000;
            });
            return balances;
        }
    }
    
    accounts.get = function(id, raw, get_widgets)
    {
        var accounts = false;
        var usd_rates = 0;
        if(
            typeof $.fn.blockstrap.settings.exchange != 'undefined'
            && typeof $.fn.blockstrap.settings.exchange.usd != 'undefined'
        ){ 
            usd_rates = $.fn.blockstrap.settings.exchange.usd;
        }
        if(typeof raw == 'undefined') raw = false;
        else raw = true;
        if(typeof get_widgets == 'undefined') get_widgets = false;
        else get_widgets = true;
        if(localStorage)
        {
            if(id && localStorage.getItem('nw_accounts_'+id))
            {
                var this_account = localStorage.getItem('nw_accounts_'+id);
                if(blockstrap_functions.json(this_account)) this_account = $.parseJSON(this_account);
                if((typeof this_account.keys != 'undefined' && this_account.keys) || get_widgets)
                {
                    var tx_total = 0;
                    var usd_total = 0;
                    $.each(this_account.blockchains, function(chain, obj)
                    {
                        if(typeof usd_rates[chain] == 'undefined') usd_rates[chain] = 0;
                        usd_total = usd_total + (usd_rates[chain] * this_account.blockchains[chain].balance);
                        this_account.usd_total = usd_total;
                        tx_total = tx_total + this_account.blockchains[chain].tx_count;
                        this_account.tx_total = tx_total;
                        this_account.blockchains[chain].id = this_account.id;
                        this_account.blockchains[chain].name = this_account.name;
                        this_account.blockchains[chain].display_balance = parseFloat(this_account.blockchains[chain].balance / 100000000).toFixed(8);
                    });
                    this_account.usd_total = parseFloat(this_account.usd_total / 100000000).toFixed(2);
                    this_account = $.fn.blockstrap.core.apply_filters('accounts_get', this_account);
                    if(raw) return this_account;
                    else return this_account.blockchains;
                }
            }
            else
            {
                $.each(localStorage, function(key, account)
                {
                    if(key.substring(0, 12) === 'nw_accounts_')
                    {
                        var tx_total = 0;
                        var usd_total = 0;
                        if(!$.isArray(accounts)) accounts = [];
                        if(blockstrap_functions.json(account)) account = $.parseJSON(account);
                        if((typeof account.keys != 'undefined' && account.keys && typeof account.blockchains != 'undefined') || get_widgets)
                        {
                            $.each(account.blockchains, function(chain, obj)
                            {
                                if(typeof usd_rates[chain] == 'undefined') usd_rates[chain] = 0;
                                usd_total = usd_total + (usd_rates[chain] * account.blockchains[chain].balance);
                                account.usd_total = usd_total;
                                tx_total = tx_total + account.blockchains[chain].tx_count;
                                account.tx_total = tx_total;
                                account.blockchains[chain].id = account.id;
                                account.blockchains[chain].name = account.name;
                                account.blockchains[chain].display_balance = parseFloat(account.blockchains[chain].balance / 100000000).toFixed(8);
                            });
                            account.usd_total = parseFloat(account.usd_total / 100000000).toFixed(2);
                            accounts.push(account);
                        }
                    }
                });
            }
            accounts = $.fn.blockstrap.core.apply_filters('accounts_get', accounts);
            return accounts;
        }
    }
    
    accounts.new = function(blockchain, name, password, keys, callback, existing_account)
    {
        if(blockchain && name && password && keys && callback && ($.isArray(blockchain) || $.isPlainObject($.fn.blockstrap.settings.blockchains[blockchain])))
        {
            var key = '';
            var slug = blockstrap_functions.slug(name);
            $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
            {
                if(!salt)
                {
                    $.fn.blockstrap.core.loader('close');
                    $.fn.blockstrap.core.modal('Error', 'No salt set for this device');
                }
                else
                {
                    $.fn.blockstrap.data.find('accounts', slug, function(account)
                    {
                        if(account && typeof existing_account == 'undefined')
                        {
                            $.fn.blockstrap.core.loader('close');
                            $.fn.blockstrap.core.modal('Warning', 'This account already exists');
                        }
                        else
                        {
                            var type = 'single';
                            var data = false;
                            if($.isArray(blockchain)) type = 'hd';
                            if($.isPlainObject(keys))
                            {
                                if(keys.wallet_question)
                                {
                                    if(!$.isPlainObject(data)) data = {};
                                    data.wallet_question = keys.wallet_question;
                                }
                                if(keys.wallet_blockchain)
                                {
                                    delete keys.wallet_blockchain;
                                }
                                var values = keys;
                                keys = [];
                                $.each(values, function(k, v)
                                {
                                    keys.push(k);
                                    key_obj = CryptoJS.SHA3(salt+key+k+v, { outputLength: 512 });
                                    key = key_obj.toString();
                                });
                            }
                            else if(keys)
                            {
                                key = keys;
                            }
                            
                            var blockchains = {};
                            var chains = blockchain;
                            var pw_obj = CryptoJS.SHA3(salt+password, { outputLength: 512 });
                            var pw = pw_obj.toString();
                            
                            if(type === 'single')
                            {
                                chains = [];
                                chains.push(blockchain);
                            }
                            $.each(chains, function(k, blockchain)
                            {
                                var address_keys = $.fn.blockstrap.blockchains.keys(key+blockchain, blockchain, 1);
                                var blockchain_name =  $.fn.blockstrap.settings.blockchains[blockchain].blockchain;
                                var address = address_keys.pub;
                                blockchains[blockchain] = {
                                    type: blockchain_name,
                                    address: address,
                                    code: blockchain,
                                    tx_count: 0,
                                    balance: 0,
                                    display_balance: "0.00000000",
                                    ts: 0
                                };
                            })
                            
                            if(keys == key) keys = false;
                            
                            var account = {
                                id: slug,
                                blockchains: blockchains,
                                name: name,
                                password: pw,
                                keys: keys,
                                tx_total: 0,
                                usd_total: "0.00",
                                txs: []
                            };
                            if(data) account.data = data;
                            
                            if(typeof existing_account != 'undefined')
                            {
                                var merged_chains = $.extend(
                                    {}, 
                                    existing_account.blockchains, 
                                    account.blockchains
                                );
                                existing_account.blockchains = merged_chains;
                                slug = existing_account.id;
                                account = existing_account;
                            }
                            $.fn.blockstrap.data.save('accounts', slug, account, function()
                            {
                                var this_account = $.fn.blockstrap.accounts.get(slug, true, true);
                                $.fn.blockstrap.accounts.update(this_account, function(account)
                                {
                                    if(!account && $.isPlainObject(this_account)) account = this_account;
                                    $.fn.blockstrap.core.apply_actions('accounts_new', function()
                                    {
                                        callback(account);
                                    }, account);
                                });
                            });
                        }
                    });
                }
            });
        }
        else
        {
            $.fn.blockstrap.core.loader('close');
            if($.isPlainObject($.fn.blockstrap.settings.blockchains[blockchain]))
            {
                $.fn.blockstrap.core.modal('Warning', 'Missing device requirements');
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Blockchain not supported');
            }
        }
    }
    
    accounts.poll = function(wait, callback, loop, loop_delay)
    {
        var delay = 0;
        var now = new Date().getTime();
        if(
            typeof $.fn.blockstrap.settings.cache != 'undefined'
            && $.fn.blockstrap.settings.cache
            && typeof $.fn.blockstrap.settings.cache.accounts != 'undefined'
        ){
            delay = $.fn.blockstrap.settings.cache.accounts;
        }
        var polls = localStorage.getItem('nw_blockstrap_polls');
        if(blockstrap_functions.json(polls)) polls = $.parseJSON(polls);
        if(!$.isPlainObject(polls)) polls = {};
        if(!polls.accounts) polls.accounts = now;
        if(typeof wait != 'undefined' && wait)
        {
            delay = wait;
        }   
        if(polls.accounts + delay >= now)
        {
            $.fn.blockstrap.accounts.updates(0, function(txs)
            {
                if($.isArray(txs) && blockstrap_functions.array_length(txs) > 0)
                {
                    var title = '1 New Transaction';
                    var content = '<p>A new transaction has taken place.</p>';
                    if(blockstrap_functions.array_length(txs) > 1)
                    {
                        title = blockstrap_functions.array_length(txs) + ' New Transactions';
                        content = '<p>New transactions have taken place.</p>';
                    }
                    if($.isArray(txs))
                    {
                        $.each(txs, function(k, tx)
                        {
                            var value = tx.value;
                            var val = '' + parseInt(tx.value) / 100000000;
                            var blockchain = $.fn.blockstrap.settings.blockchains[tx.blockchain].blockchain;
                            var amount = '<strong>' + val + '</strong> ' + blockchain;
                            var context = amount + ' <strong>recieved</strong>';
                            var base = $.fn.blockstrap.settings.base_url;
                            var url = base + '?txid=' + tx.txid + '#transaction';
                            if(value < 0) context = '<strong>' + val.substring(1) + '</strong> ' + blockchain + ' <strong>sent</strong>';
                            content+= '<p class="break-word">' + context + ':<br /><a href="' + url + '">' + tx.txid + '</a></p>';
                        });
                    }
                    $.fn.blockstrap.core.refresh(function()
                    {
                        $.fn.blockstrap.core.modal(title, content);
                        if(callback) callback();
                        else if(typeof loop != 'undefined' && typeof loop_delay != 'undefined')
                        {
                            setTimeout(function()
                            {
                                $.fn.blockstrap.accounts.poll(wait, callback, loop, loop_delay);
                            }, loop_delay);
                        }
                    }, $.fn.blockstrap.core.page());
                }
                else
                {
                    if(callback) callback();
                    else if(typeof loop != 'undefined' && typeof loop_delay != 'undefined')
                    {
                        setTimeout(function()
                        {
                            $.fn.blockstrap.accounts.poll(wait, callback, loop, loop_delay);
                        }, loop_delay);
                    }
                }
            });
        }
        else
        {
            if(callback) callback();
            else if(typeof loop != 'undefined' && typeof loop_delay != 'undefined')
            {
                setTimeout(function()
                {
                    $.fn.blockstrap.accounts.poll(wait, callback, loop, loop_delay);
                }, loop_delay);
            }
        }
    }
    
    accounts.prepare = function(to, account_id, amount, chain, standard)
    {
        var from = account_id;
        if(typeof standard == 'undefined') standard = true;
        if(to && !$.fn.blockstrap.blockchains.validate(to))
        {
            $.fn.blockstrap.core.modal('Warning', to + ' is not a valid address');
        }
        else if(to && account_id && amount)
        {
            var account = $.fn.blockstrap.accounts.get(account_id, true);
            if(!standard)
            {
                var accounts = $.fn.blockstrap.accounts.get(false, true);
                $.each(accounts, function(k, acc)
                {
                    if(typeof acc.addresses != 'undefined')
                    {
                        $.each(acc.addresses[0].chains, function(chain, addresses)
                        {
                            $.each(addresses, function(a, address)
                            {
                                if(address == account_id)
                                {
                                    account = acc;
                                    account_id = acc.id;
                                }
                            });
                        });
                    }
                });
            }
            if(!account)
            {
                $.fn.blockstrap.core.modal('Warning', account_id + ' is not a valid account');
            }
            else
            {
                var tx = {
                    to: to,
                    from: account_id,
                    amount: amount
                };
                $.fn.blockstrap.accounts.access(account_id, tx, chain, standard, from);
            }
        }
    }
    
    accounts.remove = function(collection, key, element, confirm, chain)
    {
        if(typeof chain == 'undefined') chain = false;
        if(localStorage)
        {
            var item = localStorage.getItem('nw_' + collection + '_' + key);
            if(item && blockstrap_functions.json(item))
            {
                var item_object = $.parseJSON(item);
                var pw = item_object.password;
                var pw_value = $('#confirm-modal #confirm-pw').val();
                var salted = localStorage.getItem('nw_blockstrap_salt');
                var salt = $.parseJSON(salted);
                var password_object = CryptoJS.SHA3(salt+pw_value, { outputLength: 512 });
                var password = password_object.toString();
                if(!confirm || confirm && confirm == password)
                {
                    $('#confirm-modal').modal('hide');
                    
                    if(chain && collection == 'accounts')
                    {
                        // Just remove this one blockchain from account...
                        var raw_account = $.fn.blockstrap.accounts.get(key, true);
                        if(
                            typeof raw_account.blockchains != 'undefined'
                            && typeof raw_account.blockchains[chain] != 'undefined'
                        ){
                            delete raw_account.blockchains[chain];
                        }
                        $.fn.blockstrap.data.save(collection, key, raw_account, function()
                        {
                            $.fn.blockstrap.core.refresh(function()
                            {
                                $.fn.blockstrap.core.loader('close');
                            }, $.fn.blockstrap.core.page());
                        });
                    }
                    else
                    {
                        if(chain && collection == 'contacts')
                        {
                            var new_chains = [];
                            var chain_key = 0;
                            $.each(item_object.blockchains, function(k, c)
                            {
                                if(c.code == chain)
                                {
                                    chain_key = k;
                                }
                                else
                                {
                                    new_chains.push(c);
                                }
                            });
                            item_object.blockchains = new_chains;
                            $.fn.blockstrap.data.save('contacts', key, item_object, function()
                            {
                                $($.fn.blockstrap.element).find('#' + element).find('td:eq(1)').find('.cell p:eq('+chain_key+')').hide(350, function()
                                {
                                    var this_element = $(this);
                                    $(this_element).remove();
                                    $.fn.blockstrap.core.refresh(function()
                                    {
                                        $.fn.blockstrap.core.loader('close');
                                    }, $.fn.blockstrap.core.page());
                                })
                            });
                        }
                        else
                        {
                            localStorage.removeItem('nw_' + collection + '_' + key);

                            $($.fn.blockstrap.element).find('#' + element).hide(350, function()
                            {
                                var this_element = $(this);
                                $(this_element).remove();
                                $.fn.blockstrap.core.refresh(function()
                                {
                                    $.fn.blockstrap.core.loader('close');
                                }, $.fn.blockstrap.core.page());
                            })
                        }
                    }
                }
                else
                {
                    $.fn.blockstrap.core.modal('Warning', 'Incorrect password provided');
                }
            }
            else
            {
                $.fn.blockstrap.core.loader('close');
            }
        }
    }
    
    accounts.total = function(rate, prefix)
    {
        var grand_total = 0;
        var exchange_rates = $.fn.blockstrap.settings.exchange;
        var balances = accounts.balances();
        if($.isPlainObject(balances))
        {
            $.each(balances, function(code, blockchain)
            {
                var total = (parseFloat(blockchain.balance) * 100000000) * parseFloat(exchange_rates[rate][code]);
                grand_total = grand_total + total;
            });
        }
        var new_total = (parseInt(grand_total) / 100000000).toFixed(2);
        if(prefix) return prefix + ' ' + new_total;
        else return new_total;
    }
    
    accounts.tx = function(txid, account_id)
    {
        var accounts = [];
        var transaction = false;
        if(account_id) accounts.push($.fn.blockstrap.accounts.get(account_id));
        else accounts = $.fn.blockstrap.accounts.get();
        if($.isArray(accounts))
        {
            $.each(accounts, function(k, account)
            {
                var txs = account.txs;
                if($.isPlainObject(txs))
                {
                    $.each(txs, function(k, tx)
                    {
                        if(tx.txid == txid)
                        {
                            transaction = tx;
                        }
                    });
                }
            });
        }
        return transaction;
    }
    
    accounts.txs = function(account_id)
    {
        var transactions = [];
        if(account_id) accounts.push($.fn.blockstrap.accounts.get(account_id));
        else accounts = $.fn.blockstrap.accounts.get();
        if($.isArray(accounts))
        {
            $.each(accounts, function(k, account)
            {
                var txs = account.txs;
                if($.isPlainObject(txs))
                {
                    $.each(txs, function(k, tx)
                    {
                        transactions.push(tx);
                    });
                }
            });
        }
        transactions.sort(function(a,b) 
        { 
            return parseFloat(b.time) - parseFloat(a.time) 
        });
        return transactions;
    }
    
    accounts.update = function(the_account, callback, force_refresh, page, chain)
    {
        var current_account = JSON.parse(JSON.stringify(the_account));
        if(typeof page == 'undefined') page = 0;
        if(typeof chain == 'undefined') chain = false;
        else page = parseInt(page);
        var usd_rates = 0;
        if(
            typeof $.fn.blockstrap.settings.exchange != 'undefined'
            && typeof $.fn.blockstrap.settings.exchange.usd != 'undefined'
        ){ 
            usd_rates = $.fn.blockstrap.settings.exchange.usd;
        }
        if($.isPlainObject(the_account))
        {
            var ts = 0;
            var now = new Date().getTime();
            var cache_time = $.fn.blockstrap.settings.cache.accounts;
            if(the_account.ts) ts = account.ts;
            if(blockstrap_functions.vars('refresh')) ts = 0;
            if(force_refresh) ts = 0;
            if(typeof cache_time == 'undefined') cache_time = 0;
            if(ts + cache_time < now)
            {
                var chain_count = 0;
                var total_chains = blockstrap_functions.array_length(current_account.blockchains);
                
                if(chain)
                {
                    $.each(current_account.blockchains, function(k, temp_chain)
                    {
                        if(k != chain)
                        {
                            delete current_account.blockchains[k];
                            total_chains = blockstrap_functions.array_length(current_account.blockchains);
                        }
                    });
                }
                $.each(current_account.blockchains, function(k, chain)
                {
                    var current_balance = chain.balance;
                    var current_tx_count = blockstrap_functions.array_length(chain.txs);
                    $.fn.blockstrap.api.address(chain.address, chain.code, function(results)
                    {
                        chain_count++;
                        if(
                            results.tx_count > 50
                            && $.fn.blockstrap.core.api() == 'sochain'
                        ){
                            $.fn.blockstrap.core.modal('Warning', 'The sochain API Service does not support TX pagination and has a hard limit of 50 transactions, which will cause problems with this ('+results.address+') address.');
                            if(callback) callback(false);
                            else return false;
                        }
                        else if(
                            results.tx_count > 200
                            && $.fn.blockstrap.core.api() == 'blockr'
                        ){
                            $.fn.blockstrap.core.modal('Warning', 'The blockr API Service does not support TX pagination and has a hard limit of 200 transactions, which will cause problems with this ('+results.address+') address.');
                            if(callback) callback(false);
                            else return false;
                        }
                        else if(
                            (
                            results.tx_count 
                            && results.tx_count > current_tx_count
                            )
                            ||
                            (
                            results.balance 
                            && results.balance != current_balance
                            )
                        ){
                            chain.balance = results.balance;
                            chain.display_balance = parseFloat(chain.balance / 100000000).toFixed(8);
                            chain.tx_count = results.tx_count;
                            chain.ts = now;
                            
                            the_account.tx_total = the_account.tx_total + (chain.tx_count - current_tx_count);
                            the_account.usd_total = parseFloat(parseFloat(the_account.usd_total) + parseFloat((usd_rates[chain.code] * chain.balance - current_balance) / 100000000)).toFixed(2);

                            $.fn.blockstrap.api.transactions(
                                chain.address, 
                                chain.code, 
                                function(transactions)
                            {
                                if(!$.isPlainObject(chain.txs)) chain.txs = {};
                                if($.isArray(transactions))
                                {
                                    $.each(transactions, function(k, transaction)
                                    {
                                        var got_tx = false;
                                        chain.txs['txid_'+transaction.txid] = transaction;
                                        $.each(the_account.txs, function(k, v)
                                        {
                                            if(v.txid == transaction.txid) got_tx = true;
                                        });
                                        if(!got_tx)
                                        {
                                            the_account.txs.push({
                                                ts: now,
                                                address: chain.address,
                                                chain: chain.code,
                                                tx: transaction,
                                                txid: transaction.txid
                                            });
                                        }
                                    });
                                }
                                
                                // TODO: Update account one by one?
                                the_account.blockchains[k] = JSON.parse(JSON.stringify(chain));
                                
                                if(blockstrap_functions.array_length(chain.txs) < chain.tx_count)
                                {
                                    // Paginate?
                                    page++;
                                    accounts.update(the_account, callback, force_refresh, page);
                                }
                                else
                                {
                                    if(total_chains <= chain_count)
                                    {
                                        delete the_account.blockchains[k].txs;
                                        $.fn.blockstrap.data.save('accounts', the_account.id, the_account, function(updated_account)
                                        {
                                            if(callback) callback(the_account);
                                            else return the_account;
                                        });
                                    }
                                }
                            }, false, false, 25, (page * 25));
                        }
                        else
                        {
                            if(total_chains <= chain_count)
                            {
                                if(callback) callback(false);
                                else return false;
                            }
                        }

                    }, $.fn.blockstrap.core.api('blockstrap'))
                })
            }
            else
            {
                if(callback) callback(false);
                else return false;
            }
        }
        else
        {
            if(callback) callback(false);
            else return false;
        }
    }
    
    accounts.updates = function(index, callback, old_txs, old_tx_count)
    {
        if(!index) index = 0;
        var accounts = $.fn.blockstrap.accounts.get();
        var account_length = blockstrap_functions.array_length(accounts);
        if($.isArray(accounts) && account_length > 0)
        {
            var account = accounts[index];
            var current_tx_count = blockstrap_functions.array_length(account.txs);
            index++;
            $.fn.blockstrap.accounts.update(account, function(obj)
            {
                if(typeof old_txs == 'undefined' || !old_txs)
                {
                    var new_txs = [];
                }
                else if($.isArray(old_txs))
                {
                    var new_txs = old_txs;
                }
                if(typeof old_tx_count == 'undefined' || !old_tx_count)
                {
                    var new_tx_count = 0;
                }
                else if(old_tx_count)
                {
                    var new_tx_count = old_tx_count;
                }
                if(blockstrap_functions.array_length(obj.txs) > current_tx_count)
                {
                    new_tx_count = blockstrap_functions.array_length(obj.txs) - current_tx_count;
                    if($.isArray(obj.txs))
                    {
                        $.each(obj.txs, function(key, tx)
                        {
                            new_txs.push(tx.tx);
                        });
                    }
                    new_txs.sort(function(a,b) 
                    { 
                        return parseFloat(b.time) + parseFloat(a.time) 
                    });
                }
                if(index >= account_length)
                {
                    if(callback) callback(new_txs.slice(0, new_tx_count));
                }
                else
                {
                    $.fn.blockstrap.accounts.updates(index, callback, new_txs, new_tx_count);
                }
            });
        }
        else
        {
            if(callback) callback();
        }
    }
    
    accounts.verify = function(account, fields, callback, password, chain, type, from, show_seed)
    {
        if(typeof from == 'undefined') from = false;
        if(typeof show_seed == 'undefined') show_seed = false;
        else show_seed = true;
        $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
        {
            var key = '';
            var original = false;
            if($.isArray(fields))
            {
                if(typeof account.original != 'undefined')
                {
                    original = account.original;
                }
                $.each(fields, function(k, v)
                {
                    if(v.id == 'wallet_blockchain' && type == 'hd')
                    {
                        v.value = [];
                        var chains = JSON.parse(JSON.stringify($.fn.blockstrap.settings.blockchains));
                        delete chains.multi;
                        $.each(chains, function(chain, obj)
                        {
                            v.value.push(chain);
                        });
                    }
                        
                    // TODO: Remove this hardcoded hack?
                    if(v.id == 'wallet_currency' && original)
                    {
                        v.value = original;
                    }
                    key_obj = CryptoJS.SHA3(salt+key+v.id+v.value, { outputLength: 512 });
                    key = key_obj.toString();
                });
            };
            if(key)
            {
                var old_addresses = false;
                var raw_keys = $.fn.blockstrap.blockchains.keys(key+account.code, account.code, 1, false, true);
                var keys = raw_keys;
                var raw_account = $.fn.blockstrap.accounts.get(account.id, true);
                if(blockstrap_functions.array_length(raw_account.addresses) > 0)
                {
                    old_addresses = raw_account.addresses[0].chains[account.code];
                }
                var index = blockstrap_functions.array_length(old_addresses);
                if(
                    typeof from != 'undefined'
                    && from
                    && typeof raw_account.addresses != 'undefined'
                    && typeof raw_account.addresses[0] != 'undefined'
                    && typeof raw_account.addresses[0].chains != 'undefined'
                    && typeof raw_account.addresses[0].chains[account.code] != 'undefined'
                ){
                    var must_be_latest = true;
                    $.each(raw_account.addresses[0].chains[account.code], function(k, add)
                    {
                        if(add == from)
                        {
                            must_be_latest = false;
                            if(k > 0)
                            {
                                keys = $.fn.blockstrap.blockchains.keys(key+account.code, account.code, 1, [k]);
                            }
                        }
                    });
                    if(must_be_latest === true)
                    {
                        keys = $.fn.blockstrap.blockchains.keys(key+account.code, account.code, 1, [index]);
                    }
                }
                else if(
                    typeof raw_account.addresses != 'undefined'
                    && typeof raw_account.addresses[0] != 'undefined'
                    && typeof raw_account.addresses[0].chains != 'undefined'
                    && typeof raw_account.addresses[0].chains[account.code] != 'undefined'
                ){
                    keys = $.fn.blockstrap.blockchains.keys(key+account.code, account.code, 1, [index]);
                }
                if(
                    (keys.pub === account.address && !from)
                    ||
                    (from && keys.pub === from)
                ){
                    var seed = false;
                    if(show_seed === true) seed = key;
                    if(callback) callback(true, keys, raw_keys.raw, seed);
                    else return true;
                }
                else
                {
                    keys = $.fn.blockstrap.blockchains.keys(key, account.code, 1, false, true);
                    var v5address = keys.raw.getAddress().toString();
                    if(v5address == account.address)
                    {
                        if(callback) callback(true, keys, keys.raw, seed);
                        else return true;
                    }
                    else
                    {
                        if(callback) 
                        {
                            callback(false, false, false, false);
                        }
                        else
                        {
                            $.fn.blockstrap.core.loader('close');
                            $.fn.blockstrap.core.modal('Warning', 'Credentials do not match');
                        }
                    }
                }
            }
            else
            {
                if(callback)
                {
                    callback(false, false, false, false);
                }
                else
                {
                    $.fn.blockstrap.core.loader('close');
                    $.fn.blockstrap.core.modal('Error', 'Unable to construct keys');
                }
            }
        });
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {accounts:accounts});
})
(jQuery);

(function($) 
{
    var api = {};
    var api_timeout = 15000;
    var active_requests = {};
    var apis = $.fn.blockstrap.settings.apis;
    var blockchains = $.fn.blockstrap.settings.blockchains;
    var api_key = $.fn.blockstrap.core.option('key', false);
    var api_service = $.fn.blockstrap.core.api('blockstrap');
    
    if($.fn.blockstrap.settings.cache && $.fn.blockstrap.settings.cache.api && $.fn.blockstrap.settings.cache.api.timeout)
    {
        api_timeout = $.fn.blockstrap.settings.cache.api.timeout;
    }
    
    api.address = function(hash, blockchain, callback, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var api_url = api.url('address', hash, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_address', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var address = {
                        address: 'N/A',
                        hash: 'N/A',
                        tx_count: 0,
                        blockchain: blockchain,
                        received: 0,
                        balance: 0,
                    }
                    if(results)
                    {
                        address = api.results(address, results, blockchain, 'address', callback);               
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_address', function()
                        {
                            callback(address);
                        }, address);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return address;
                    }
                }
            }, 'GET', false, blockchain, 'address');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_address', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.addresses = function(hashes, blockchain, callback, service)
    {
        var hashed_url = '';
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        if($.isArray(hashes))
        {
            var delimiter = '&addresses=';
            var map = api.map(blockchain);
            if(map.from.addresses.delimiter) delimiter = map.from.addresses.delimiter;
            
            $.each(hashes, function(k, hash)
            {
                if(k === 0) hashed_url+= hash;
                else hashed_url+= delimiter + hash;
            });

            var api_url = api.url('addresses', hashed_url, blockchain);
            if(api_url)
            {
                api.request(api_url, function(results)
                {
                    var addresses = [];
                    if(results)
                    {
                        $.each(results, function(k, v)
                        {
                            var address = {
                                address: 'N/A',
                                hash: 'N/A',
                                tx_count: 0,
                                blockchain: blockchain,
                                received: 0,
                                balance: 0
                            }
                            address = api.results(address, results[k], blockchain, 'addresses');
                            addresses.push(address);
                        })
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_addresses', function()
                        {
                            callback(addresses);
                        }, addresses);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return addresses;
                    }
                }, 'GET', false, blockchain, 'addresses');
            }
            else if(callback)
            {
                $.fn.blockstrap.core.apply_actions('api_addresses', function()
                {
                    callback(false);
                });
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    
    api.balance = function(hash, blockchain, callback, service)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        api.address(hash, blockchain, function(address)
        {
            if(address && address.balance) 
            {
                if(api_service !== original_service)
                {
                    api_service = original_service;
                }
                $.fn.blockstrap.core.apply_actions('api_balance', function()
                {
                    callback(address.balance);
                }, address.balance);
            }
            else 
            {
                if(api_service !== original_service)
                {
                    api_service = original_service;
                }
                $.fn.blockstrap.core.apply_actions('api_balance', function()
                {
                    callback(0);
                });
            }
        }, service);
    }
    
    api.block = function(height, blockchain, callback, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var api_url = api.url('block', height, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_block', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var block = {
                        blockchain: blockchain,
                        height: 'N/A',
                        hash: 'N/A',
                        prev: 'N/A',
                        next: 'N/A',
                        tx_count: 0,
                        time: 0
                    };
                    if(results)
                    {
                        block = api.results(block, results, blockchain, 'block');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_block', function()
                        {
                            callback(block);
                        }, block);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return block;
                    }
                }
            }, 'GET', false, blockchain, 'block');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_block', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.dnkey = function(id, blockchain, callback, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var api_url = api.url('dnkey', id, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_dnkey', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var dnkeys = {
                        blockchain: blockchain,
                        dnkeys: false
                    };
                    if(results)
                    {
                        dnkeys = api.results(dnkeys, results, blockchain, 'dnkey');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_dnkey', function()
                        {
                            callback(dnkeys);
                        }, dnkeys);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return dnkeys;
                    }
                }
            }, 'GET', false, blockchain, 'dnkey');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_dnkey', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.dnkeys = function(id, blockchain, callback, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var api_url = api.url('dnkeys', id, blockchain);
        if(api_url && blockchain == 'multi')
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_dnkeys', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var dnkeys = {
                        blockchain: blockchain,
                        dnkeys: false
                    };
                    if(results)
                    {
                        dnkeys = api.results(dnkeys, results, blockchain, 'dnkeys');
                    }
                    $.each(dnkeys.dnkeys, function(chain, obj)
                    {
                        $.each($.fn.blockstrap.settings.blockchains, function(this_chain, values)
                        {
                            if(values.lib == chain)
                            {
                                dnkeys.dnkeys[this_chain] = obj;
                                delete dnkeys.dnkeys[chain];
                            }   
                        });
                    });
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_dnkeys', function()
                        {
                            callback(dnkeys);
                        }, dnkeys);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return dnkeys;
                    }
                }
            }, 'GET', false, blockchain, 'dnkeys');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_dnkeys', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.map = function(blockchain)
    {
        if(!blockchain) blockchain = 'btc';
        if(typeof apis[blockchain] == 'undefined') blockchain = 'defaults';
        if(typeof apis[blockchain][api_service] == 'undefined')
        {
            if(typeof apis['defaults'][api_service] != 'undefined')
            {
                return apis['defaults'][api_service].functions;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return apis[blockchain][api_service].functions;
        }
    }
    
    api.market = function(blockchain, stat, callback, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var api_url = api.url('market', stat, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    if(api_service !== original_service)
                    {
                        api_service = original_service;
                    }
                    $.fn.blockstrap.core.apply_actions('api_market', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var market = {
                        price_usd_now: 0,
                        tx_count_24hr: 0,
                        sent_usd_24hr: 0,
                        sent_coins_24hr: 0,
                        coins_discovered: 0,
                        marketcap: 0
                    };
                    if(results)
                    {
                        market = api.results(market, results, blockchain, 'market');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_market', function()
                        {
                            callback(market);
                        }, market);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return market;
                    }
                }
            }, 'GET', false, blockchain, 'market');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_market', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.request = function(url, callback, type, data, blockchain, call, username, password)
    {
        if(!type) type = 'GET';
        if(!blockchain) blockchain = 'btc';
        var map = api.map(blockchain);
        var headers = false;
        if(
            $.isPlainObject(blockchains[blockchain]) 
            && $.isPlainObject(blockchains[blockchain].auth) 
            && $.isPlainObject(blockchains[blockchain].auth[api_service])
        ){
            var auth = blockchains[blockchain].auth[api_service];
            if(
                !username 
                && typeof auth.username != 'undefined'
            ){
                username = auth.username;
            }
            if(
                !password 
                && typeof auth.password != 'undefined'
            ){
                password = auth.password;
            }
            if(username && password)
            {
                headers = {
                    'Authorization': 'Basic ' + btoa(username + ':' + password)
                }
            }
        }
        $.ajax({
            url: url,
            type: type,
            dataType: 'JSON',
            data: data,
            async: true,
            headers: headers,
            success: function(results)
            {
                var extra_key = false;
                var key_to_call = false;
                if(
                    typeof map.from[call] != 'undefined'
                    && typeof map.from[call].key != 'undefined'
                ){
                    if(map.from[call].key.indexOf(".") > -1)
                    {
                        var key_array = map.from[call].key.split('.');
                        if(blockstrap_functions.array_length(key_array) == 2)
                        {
                            if(key_array[0] == '')
                            {
                                key_to_call = key_array[1];
                            }
                            else
                            {
                                key_to_call = key_array[0];
                                extra_key = key_array[1];
                                if(extra_key === '0') extra_key = 0;
                            }
                        }
                    }
                    var data = false;
                    if(
                        results 
                        && key_to_call 
                        || 
                        (
                        results
                        && typeof results.data != 'undefined'
                        && typeof map.from[call] != 'undefined'
                        && typeof map.from[call].key != 'undefined'
                        && typeof results.data[map.from[call].key] != 'undefined'
                        )
                    ){
                        if(key_to_call)
                        {
                            if(extra_key || extra_key === 0)
                            {
                                data = results.data[key_to_call][extra_key];
                            }
                            else
                            {
                                data = results.data[key_to_call];
                            }
                        }
                        else
                        {
                            if(call)
                            {
                                data = results.data[map.from[call].key];
                            }
                            else
                            {
                                data = results.data;
                            }
                        }
                    }
                    else if(
                        typeof results.data != 'undefined' 
                        && !map.from[call].key
                    ){
                        data = results.data;
                    }
                    else
                    {
                        data = results;
                    }
                    if(callback) callback(data);
                }
                else
                {
                    if(callback) callback(results);
                }
            },
            error: function()
            {
                if(callback) callback(false)
            },
            timeout: api_timeout // 15 Seconds
        })
    }
    
    api.relay = function(hash, blockchain, callback, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var request_data = {};
        var map = api.map(blockchain);
        request_data[map.to.relay_param] = hash;
        
        var api_url = api.url('relay', hash, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_relay', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var data = false;
                    var tx = false;
                    if(results)
                    {
                        if(results.data)
                        {
                            if(
                                map.from.relay.inner
                                && typeof results.data[map.from.relay.inner] != 'undefined'
                                && typeof results.data[map.from.relay.inner][map.from.relay.txid] != 'undefined'
                            ){
                                data = results.data[map.from.relay.inner][map.from.relay.txid];
                            }
                            else if(
                                map.from.relay.txid
                                && typeof results.data[map.from.relay.txid] != 'undefined'
                            ){
                                data = results.data[map.from.relay.txid];
                            }
                            if(data)
                            {
                                tx = {
                                    blockchain: blockchain,
                                    txid: data
                                }
                            }
                        }
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_relay', function()
                        {
                            callback(tx);
                        }, tx);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return tx;
                    }
                }
            }, 'POST', request_data, blockchain, 'relay');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_relay', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.results = function(defaults, results, blockchain, request, callback)
    {
        var clean_results = false;
        var map = api.map(blockchain);
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        
        if(!$.isPlainObject(results))
        {
            var original_results = results;
            results = {};
            results[request] = {};
            results[request][blockchain] = original_results;
        }
        
        if(
            defaults && results 
            && blockchain && request 
            && $.isPlainObject(defaults) 
            && $.isPlainObject(results) 
            && typeof map.from != 'undefined' 
            && typeof map.from[request] != 'undefined' 
        ){
            var result_count = 0;
            var number_of_results = $bs.array_length(defaults);
            $.each(defaults, function(field_name, field_value)
            {
                result_count++;
                if(
                    typeof map.from[request][field_name] != 'undefined' 
                ){
                    var this_map = map.from[request][field_name];
                    var result = results[map.from[request][field_name]];
                    var arrayed_result = bs.core.string_to_array(this_map);
                    if(arrayed_result && $bs.array_length(arrayed_result) === 4)
                    {
                        if(
                            (
                                arrayed_result[1] == '+'
                                || arrayed_result[1] == '-'
                                || arrayed_result[1] == '*'
                                || arrayed_result[1] == '/'
                            )
                            &&
                            (
                                arrayed_result[3] == 'int'
                                || arrayed_result[3] == 'float'
                            )
                        ){
                            var parse_type = arrayed_result[3];
                            if(
                                typeof results[arrayed_result[0]] != 'undefined'
                                && typeof results[arrayed_result[2]] != 'undefined'
                            ){
                                var res_01 = results[arrayed_result[0]];
                                var res_02 = results[arrayed_result[2]];
                                if(parse_type == 'float')
                                {
                                    res_01 = parseFloat(results[arrayed_result[0]]);
                                    res_02 = parseFloat(resultsq[arrayed_result[2]]);
                                    res_01 = res_01 * 100000000;
                                    res_02 = res_02 * 100000000;
                                }
                                else if(parse_type == 'int')
                                {
                                    res_01 = parseInt(results[arrayed_result[0]]);
                                    res_02 = parseInt(results[arrayed_result[2]]);
                                }
                                result = res_01 + res_02;
                                if(arrayed_result[1] == '-')
                                {
                                    result = res_01 - res_02;
                                }
                                else if(arrayed_result[1] == '*')
                                {
                                    if(parse_type == 'int')
                                    {
                                        result = parseInt(res_01 * res_02);
                                    }
                                    else
                                    {
                                        result = res_01 * res_02;
                                    }
                                }
                                else if(arrayed_result[1] == '/')
                                {
                                    result = res_01 / res_02;
                                }
                                defaults[field_name] = result;
                            }
                        }
                    }
                    else if(arrayed_result && $bs.array_length(arrayed_result) === 2)
                    {
                        var parse_type = arrayed_result[1];
                        if(
                            arrayed_result[1] == 'int'
                            || arrayed_result[1] == 'float'
                            || arrayed_result[1] == 'hextohash'
                            || arrayed_result[1] == 'utctoepoch'
                            || arrayed_result[1] == 'count'
                            || arrayed_result[1] == 'lowercase'
                        ){
                            if(parse_type == 'float')
                            {
                                res_01 = parseFloat(results[arrayed_result[0]]).toPrecision(8);
                                res_01 = parseInt((res_01 * 100000000));
                            }
                            else if(parse_type == 'int')
                            {
                                res_01 = parseInt(results[arrayed_result[0]]);
                            }
                            else if(parse_type == 'hextohash')
                            {
                                var address = results[arrayed_result[0]];
                                var hash = bitcoin.Address.fromBase58Check(address);
                                res_01 = hash;
                            }
                            else if(parse_type == 'utctoepoch')
                            {
                                var date = new Date(results[arrayed_result[0]]);
                                var epoch = date.getTime() / 1000;
                                res_01 = epoch;
                            }
                            else if(parse_type == 'count')
                            {
                                var obj = results[arrayed_result[0]];
                                var count = $bs.array_length(obj);
                                res_01 = count;
                            }
                            else if(parse_type == 'lowercase')
                            {
                                res_01 = results[arrayed_result[0]].toLowerCase();
                            }
                            defaults[field_name] = res_01;
                        }
                    }       
                    else
                    {
                        if(
                            typeof map.from[request][field_name] != 'undefined' 
                            && typeof results[map.from[request][field_name]] != 'undefined' 
                        ){
                            defaults[field_name] = results[map.from[request][field_name]];
                        }
                        else
                        {
                            defaults[request] = results;
                        }
                    }
                }
            });
        }
        return defaults;
    }
    
    api.service = function(api_service, chain)
    {
        var bs = $.fn.blockstrap;
        if(typeof bs.settings.blockchains[chain].api != 'undefined')
        {
            return bs.settings.blockchains[chain].api;
        }
        else return api_service;
    }
    
    api.settings = function(chain, provider, direction, key)
    {
        var result = false;
        var bs = $.fn.blockstrap.settings;
        if(
            typeof chain != 'undefined'
            && typeof provider != 'undefined'
            && typeof direction != 'undefined'
            && typeof key != 'undefined'
        ){
            if(
                typeof bs.apis.defaults[provider] != 'undefined'
                && typeof bs.apis.defaults[provider].functions != 'undefined'
                && typeof bs.apis.defaults[provider].functions[direction] != 'undefined'
                && typeof bs.apis.defaults[provider].functions[direction][key] != 'undefined'
            ){
                return bs.apis.defaults[provider].functions[direction][key];
            }
            else
            {
                if(
                    typeof bs.apis[chain] != 'undefined'
                    && typeof bs.apis[chain][provider] != 'undefined'
                    && typeof bs.apis[chain][provider].functions != 'undefined'
                    && typeof bs.apis[chain][provider].functions[direction] != 'undefined'
                    && typeof bs.apis[chain][provider].functions[direction][key] != 'undefined'
                ){
                    return bs.apis[chain][provider].functions[direction][key];
                }
                else
                {
                    return result;
                }
            }
        }
        else
        {
            return result;
        }
    }
    
    api.transaction = function(txid, blockchain, callback, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var api_url = api.url('transaction', txid, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_transaction', function()
                    {
                        callback(results);
                    }, results)
                }
                else
                {
                    var map = api.map(blockchain);
                    var now = new Date().getTime();
                    var transaction = {
                        blockchain: blockchain,
                        txid: 'N/A',
                        size: 'N/A',
                        block: 'N/A',
                        time: parseInt(now / 1000),
                        input: 0,
                        output: 0,
                        value: 0,
                        fees: 0
                    }
                    if(results)
                    {
                        transaction = api.results(transaction, results, blockchain, 'transaction');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_transaction', function()
                        {
                            callback(transaction);
                        }, transaction);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return transaction;
                    }
                }
            }, 'GET', false, blockchain, 'transaction');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_transaction', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.transactions = function(address, blockchain, callback, service, return_raw, count, skip)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        var api_url = api.url('transactions', address, blockchain);
        
        // Hack for BS API Pagination
        if(typeof count != 'undefined' && parseInt(count) > 0 )
        {
            if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] == 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[0];
                api_url+= '&'+key+'='+count;
            }
            else if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[0];
                api_url+= '&'+key+'='+count;
            }
        }
        if(typeof count != 'undefined' && parseInt(skip) > 0 )
        {
            if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] == 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[1];
                api_url+= '&'+key+'='+skip;
            }
            else if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[1];
                api_url+= '&'+key+'='+skip;
            }
        }
            
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_transactions', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var transactions = [];
                    var map = api.map(blockchain);
                    var now = new Date().getTime();
                    if(results)
                    {
                        $.each(results, function(k, v)
                        {
                            var transaction = {
                                blockchain: blockchain,
                                txid: 'N/A',
                                size: 'N/A',
                                block: 'N/A',
                                time: parseInt(now / 1000),
                                input: 0,
                                output: 0,
                                value: 0,
                                fees: 0
                            };
                            transaction = api.results(
                                transaction, 
                                results[k], 
                                blockchain, 
                                'transactions'
                            );
                            transactions.push(transaction);
                        });
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_transactions', function()
                        {
                            callback(transactions);
                        }, transactions);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return transactions;
                    }
                }
            }, 'GET', false, blockchain, 'transactions');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_transactions', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.unspents = function(address, blockchain, callback, confirms, service, return_raw)
    {
        var original_service = JSON.parse(JSON.stringify(api_service));
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api_service = api.service(api_service, blockchain);
        if(!confirms) confirms = 0;
        
        var api_url = api.url('unspents', address, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_unspents', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var unspents = [];
                    var map = api.map(blockchain);
                    if(results)
                    {
                        var reverse = false;
                        if(
                            typeof map.from.unspents.reverse_array != 'undefined' 
                            && map.from.unspents.reverse_array === true
                        ){
                            reverse = true;
                        }
                        $.each(results, function(k, v)
                        {
                            var unspent = {
                                txid: 'N/A',
                                index: 0,
                                value: 0,
                                script: 'N/A'
                            }
                            var confirmations = 0;
                            unspent = api.results(unspent, results[k], blockchain, 'unspents');
                            if(confirmations >= confirms) unspents.push(unspent);
                        });
                        if(reverse) unspents = unspents.reverse();
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        $.fn.blockstrap.core.apply_actions('api_unspents', function()
                        {
                            callback(unspents);
                        }, unspents);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return unspents;
                    }
                }
            }, 'GET', false, blockchain, 'unspents');
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_unspents', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.url = function(action, key, blockchain)
    {
        var url = false;
        if(!blockchain) blockchain = 'btc';
        if(apis == 'undefined')
        {
            apis = $.fn.blockstrap.settings.apis;
        }
        if(
            blockchain != 'multi'
            &&
            (
            (
            typeof apis[blockchain] == 'undefined' 
            || typeof apis[blockchain][api_service] == 'undefined'
            || typeof apis[blockchain][api_service].functions.to[action] == 'undefined'    
            || apis[blockchain][api_service].functions.to[action] == ""
            )
            &&
            (
            typeof apis['defaults'] == 'undefined' 
            || typeof apis['defaults'][api_service] == 'undefined'
            || typeof apis['defaults'][api_service].functions.to[action] == 'undefined'  
            || apis['defaults'][api_service].functions.to[action] == ""
            || typeof $.fn.blockstrap.settings.blockchains[blockchain] == 'undefined'
            || typeof $.fn.blockstrap.settings.blockchains[blockchain].apis[api_service] == 'undefined'
            )
            )
        ){
            if(action == 'addresses') key = 'multiple-addresses';
            var text = '<p class="'+key+blockchain+action+'">Please note that the selected API "<strong>'+api_service+'</strong>" used for "<strong>'+key+'</strong>" is either not mapped to the "<strong>'+blockchain+'</strong>" blockchain or does not support the required "<strong>'+action+'</strong>" function.</p>';
            if(
                $('#default-modal').find('h4.modal-title').text() != 'API Warning'
                && $('#default-modal').find('.modal-body').find('.'+key+blockchain+action).length < 1
            ){
                $.fn.blockstrap.core.modal('API Warning', text);
                return false;
            }
            else if(
                $('#default-modal').find('h4.modal-title').text() == 'API Warning'
                && $('#default-modal').find('.modal-body').find('.'+key+blockchain+action).length < 1
            ){
                var current_text = $('#default-modal').find('.modal-body').html();
                $.fn.blockstrap.core.modal('API Warning', current_text+text);
                return false;
            }
            else
            {
                return false;
            }
        }
        else if(
            blockchain != 'multi'
            &&
            (
            typeof apis[blockchain] != 'undefined' 
            && typeof apis[blockchain][api_service] != 'undefined'
            && typeof apis[blockchain][api_service].functions.to[action] != 'undefined'
            )
        ){
            url = blockchains[blockchain].apis[api_service] + apis[blockchain][api_service].functions.to[action] + key;
            if(apis[blockchain][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis[blockchain][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        else if( blockchain != 'multi')
        {
            url = blockchains[blockchain].apis[api_service] + apis['defaults'][api_service].functions.to[action] + key;
            if(apis['defaults'][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis['defaults'][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        else
        {
            api_service = $.fn.blockstrap.core.api('blockstrap');
            blockchains = $.fn.blockstrap.settings.blockchains;
            apis = $.fn.blockstrap.settings.apis;
            if(blockchain == 'multi') api_service = 'blockstrap';
            url = blockchains[blockchain].apis[api_service] + apis['defaults'][api_service].functions.to[action] + key;
            if(apis['defaults'][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis['defaults'][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        if(api_key)
        {
            if(url.indexOf("?") > -1)
            {
                url+='&api_key='+api_key;
            }
            else
            {
                url+='?api_key='+api_key;
            }
        }
        var app_id = 'framework';
        if(typeof $.fn.blockstrap.settings.app_id != 'undefined')
        {
            app_id = $.fn.blockstrap.settings.app_id;
        }
        else
        {
            app_id = $.fn.blockstrap.settings.id;
        }
        if(api_service == 'blockstrap')
        {
            app_id+= '_v'+blockstrap_functions.slug($.fn.blockstrap.settings.v);
            if(action == 'stats' || action == 'addresses')
            {
                if(url.indexOf("?") > -1)
                {
                    url+= '&app_id='+app_id;
                }
                else
                {
                    url+= '?app_id='+app_id;
                }
            }
            else
            {
                if(url.indexOf("?") > -1)
                {
                    url+= '&app_id='+app_id;
                }
                else
                {
                    url+= '?app_id='+app_id;
                }
            }
        }
        return url;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {api:api});
})
(jQuery);

(function($) 
{
    var blockchains = {};
    var temp_blockchain_validation = [
        {
            "code": "btc",
            "starts": ['1', '3']
        },
        {
            "code": "ltc",
            "starts": ['L']
        },
        {
            "code": "dash",
            "starts": ['X']
        },
        {
            "code": "doge",
            "starts": ['D']
        },
        {
            "code": "btct",
            "starts": ['m', 'n']
        },
        {
            "code": "ltct",
            "starts": ['m, n']
        },
        {
            "code": "dasht",
            "starts": ['y']
        },
        {
            "code": "doget",
            "starts": ['n']
        }
    ];
    
    blockchains.check = function(address)
    {
        try 
        {
            var decoded_hex = Crypto.util.base64ToBytes(address);
        } 
        catch(error) 
        {
            // if decoding fails, assume invalid address
            return false;
        }
        var decoded = bitcoin.Script.fromHex(decoded_hex).toBuffer();
        if (decoded.length != 25) {
            return false;
        }
        // IF PASSING THIS FAR RETURN BACK FIRST CHARACTER OF ADDRESS
        // THIS CAN THEN BE USED FOR TEMPORARY BLOCKCHAIN VERIFICATION
        return address.charAt(0);
    }
    
    blockchains.decode = function(script_pub_key)
    {
        var str = '';
        var op_return = bitcoin.Script.fromHex(script_pub_key).toASM();
        var op_array = op_return.split('OP_RETURN ');
        if(blockstrap_functions.array_length(op_array) == 2)
        {
            var hex = op_array[1];
            for (var i = 0; i < hex.length; i += 2)
            {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
        }
        return str;
    }
    
    blockchains.key = function(code)
    {
        var bs = $.fn.blockstrap;
        if(!code) code = 'btc';
        if(
            !$.isPlainObject(bs.settings.blockchains) 
            || !$.isPlainObject(bs.settings.blockchains[code]) 
            || typeof bs.settings.blockchains[code].lib == 'undefined'
        ){
            code = 'btc';
        }
        if(
            $.isPlainObject(bs.settings.blockchains[code]) 
            && typeof bs.settings.blockchains[code].lib != 'undefined'
        ){
            return bs.settings.blockchains[code].lib;
        }
        else
        {
            return 'bitcoin';
        }
    }
    
    blockchains.keys = function(secret, blockchain, number_of_keys, indexes, raw)
    {
        var keys = {};
        var is_array = false;
        var secrets = secret;
        var blockchain_key = blockchains.key(blockchain);
        var blockchain_obj = bitcoin.networks[blockchain_key];
        if(typeof raw == 'undefined') raw = false;
        if(typeof number_of_keys != 'undefined' && parseInt(number_of_keys) > 1)
        {
            keys = [];
            is_array = true;
        }
        try
        {
            if(is_array)
            {
                for (i = 0; i < parseInt(number_of_keys); i++) 
                {
                    var hash = bitcoin.crypto.sha256(secrets);
                    var raw_keys = bitcoin.HDNode.fromSeedBuffer(hash, blockchain_obj);
                    keys.push({
                        pub: raw_keys.pubKey.getAddress(blockchain_obj).toString(),
                        hex: raw_keys.pubKey.toHex(),
                        priv: raw_keys.privKey.toWIF(blockchain_obj)
                    });
                    secrets = CryptoJS.SHA3(secrets + raw_keys.privKey.toWIF(blockchain_obj), { outputLength: 512 }).toString();
                }
                if(raw) keys.raw = raw_keys;
                return keys;
            }
            else
            {
                var hash = bitcoin.crypto.sha256(secrets);
                var raw_keys = bitcoin.HDNode.fromSeedBuffer(hash, blockchain_obj);
                if(typeof indexes != 'undefined' && $.isArray(indexes))
                {
                    $.each(indexes, function(k, index)
                    {
                        raw_keys = raw_keys.derive(index);
                    });
                }
                keys.pub = raw_keys.pubKey.getAddress(blockchain_obj).toString();
                keys.priv = raw_keys.privKey.toWIF(blockchain_obj);
                if(raw) keys.raw = raw_keys;
                return keys;
            }
        }
        catch(error)
        {
            if(is_array)
            {
                keys.push({
                    pub: false,
                    priv: false
                });
                if(raw) keys.raw = false;
                return keys;
            }
            else
            {
                keys.pub = false;
                keys.priv = false;
                if(raw) keys.raw = false;
                return keys;
            }
        }
    }
    
    blockchains.raw = function(return_to, private_keys, inputs, outputs, this_fee, amount_to_send, data, sign_tx, script)
    {
        tx = new bitcoin.TransactionBuilder();
        
        if(typeof sign_tx == 'undefined') sign_tx = true;
        
        var fee = 0;
        var balance = 0;
        var total = 0;
        var input_index = 0;
        var key = false;
        var inputs_to_sign = [];
        var debug = false;
        
        if(typeof private_keys == 'string')
        {
            key = bitcoin.ECKey.fromWIF(private_keys);
        }
        else if($.isArray(private_keys))
        {
            var redeem_script = script;
        }
        
        if(this_fee) fee = this_fee;
        if(amount_to_send) total = amount_to_send;
        
        if(debug)
        {
            console.log('inputs', inputs);
            console.log('outputs', outputs);
        }
        $.each(inputs, function(i, o)
        {
            if(balance <= (amount_to_send + fee))
            {
                balance+= o.value;
                tx.addInput(o.txid, o.n);
                inputs_to_sign.push(input_index);
                input_index++;
            }
        });
        $.each(outputs, function(i, o)
        {
            tx.addOutput(o.address, o.value)
        });
        if(balance >= (total + fee))
        {
            var change = balance - (total + fee);
            if(change > 0)
            {
                tx.addOutput(return_to, change);
            }
        }
        
        if(typeof data == 'string' && data)
        {
            var op = Crypto.util.base64ToBytes(btoa(data));
            var op_out = bitcoin.Script.fromHex(op).toBuffer();
            var op_return = bitcoin.Script.fromChunks(
            [
                bitcoin.opcodes.OP_RETURN,
                op_out
            ]);
            tx.addOutput(op_return, 0);
            // TODO - REMOVE THIS FLAKEY BIT...?
            if(tx.tx.outs[1].value === 0) tx.tx.outs[1].type = "nulldata";
            else if(tx.tx.outs[2].value === 0) tx.tx.outs[2].type = "nulldata";
        }
        $.each(inputs_to_sign, function(k)
        {
            if(sign_tx)
            {
                if($.isArray(private_keys))
                {
                    $.each(private_keys, function(private_key, key)
                    {
                        tx.sign(k, bitcoin.ECKey.fromWIF(key), bitcoin.Script.fromHex(redeem_script));
                    });
                }
                else
                {
                    tx.sign(k, key);
                }
            }
        });

        var built = tx.build();
        var raw = built.toHex();
        
        if(debug)
        {
            console.log('raw', raw);
            return false;
        }
        else return raw;
    }
    
    blockchains.send = function(
        to_address, 
        to_amount, 
        from_address, 
        keys, 
        callback, 
        blockchain,
        data
    ){
        var available_balance = 0;
        var private_key = keys.priv;
        if(!blockchain) blockchain = 'btc';
        var fee = $.fn.blockstrap.settings.blockchains[blockchain].fee * 100000000;
        $.fn.blockstrap.api.balance(from_address, blockchain, function(balance)
        {
            if(
                (
                    blockchain != $.fn.blockstrap.blockchains.which(to_address)
                    || blockchain != $.fn.blockstrap.blockchains.which(from_address)
                )
                &&
                (
                    blockchain == 'ltct'
                    && 
                    (
                        $.fn.blockstrap.blockchains.which(to_address) != 'btct'
                        || $.fn.blockstrap.blockchains.which(from_address) != 'btct'
                    )
                )
            ){
                $.fn.blockstrap.core.loader('close');
                var content = 'Incompatible addresses. Please ensure you are sending to and from the same blockchain.';
                $.fn.blockstrap.core.modal('Warning', content);
                return false;
            }
            else if(balance - fee >= to_amount)
            {
                $.fn.blockstrap.api.unspents(keys.pub, blockchain, function(unspents)
                {
                    if($.isArray(unspents))
                    {
                        var inputs = [];
                        var outputs = [{
                            'address': to_address,
                            'value': to_amount
                        }];
                        $.each(unspents, function(k, unspent)
                        {
                            inputs.push({
                                txid: unspent.txid,
                                n: unspent.index,
                                script: unspent.script,
                                value: unspent.value,
                            });
                            //available_balance = available_balance + unspent.value;
                        });
                        var raw_transaction = blockchains.raw(
                            from_address, 
                            private_key, 
                            inputs, 
                            outputs, 
                            fee, 
                            to_amount,
                            data
                        );
                        $.fn.blockstrap.api.relay(raw_transaction, blockchain, function(tx)
                        {
                            if(tx && tx.txid)
                            {
                                if(callback) callback(tx);
                            }
                            else
                            {
                                $.fn.blockstrap.core.loader('close');
                                if(callback) callback(false);
                            }
                        });
                    }
                    else
                    {
                        $.fn.blockstrap.core.loader('close');
                        if(callback) callback(false);
                    }
                });
            }
            else
            {
                var content = 'Insufficient funds to relay transaction.';
                $.fn.blockstrap.core.modal('Warning', content);
                if(callback) callback(false);
            }
        });
    }
    
    blockchains.supported = function(blockchain)
    {
        if(
            typeof blockchain != 'undefined'
            && typeof $.fn.blockstrap.settings.blockchains != 'undefined'
            && $.isPlainObject($.fn.blockstrap.settings.blockchains)
        ){
            if(typeof index == 'undefined') index = 0;
            var bc_count = 0;
            var chains = $.fn.blockstrap.settings.blockchains;
            if(typeof chains[blockchain] != 'undefined') return true;
            else return false;
        }
        else
        {
            return false;
        }
    }
    
    blockchains.validate = function(address)
    {
        if($.isPlainObject(address) && typeof address.address != 'undefined')
        {
            address = address.address;
        }
        try 
        {
            var results = blockchains.check(address);
            return results;
        } 
        catch(e) 
        {
            return false;
        }
    }
    
    blockchains.which = function(address)
    {
        try 
        {
            var key = blockchains.validate(address);
        } 
        catch(error) 
        {
            // if decoding fails, assume invalid address
            return false;
        }
        // TODO: NEED PROPER CHECKSUM HANDLING HERE
        // LATEST VERSION OF BITCOINJS-LIB SEEMED TO BE MISSING IT :-(
        // FOR NOW - WE WILL USE A HACKY CHECK ON ADDRESSES
        var blockchain = false;
        if($.isArray(temp_blockchain_validation))
        {
            $.each(temp_blockchain_validation, function(k, coin)
            {
                $.each(coin.starts, function(index, character)
                {
                    if(character == key) blockchain = coin.code;
                });
            });
        }
        return blockchain;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {blockchains:blockchains});
})
(jQuery);

(function($) 
{
    var buttons = {};
    
    window.onpopstate = function(event) 
    {
        if($.isPlainObject(event.state) && event.state.slug)
        {
            // HARDCODED HACK FOR NOW
            var bs = $.fn.blockstrap;
            var slug = event.state.slug;
            if(slug == bs.settings.page_base) slug = bs.settings.slug_base;
            var nav = $(bs.element).find('#' + bs.settings.navigation_id);
            bs.core.nav(slug);
            $.fn.blockstrap.buttons.page($(nav).find('#'+slug));
        }
    }
    
    buttons.access = function(button, e)
    {
        e.preventDefault();
        var account_id = $(button).attr('data-key');
        var chain = $(button).attr('data-chain');
        var blockchain = $.fn.blockstrap.settings.blockchains[chain].blockchain;
        $.fn.blockstrap.data.find('accounts', account_id, function(raw_account)
        {
            if(chain == 'all' && typeof raw_account.blockchains != 'undefined')
            {
                $.fn.blockstrap.accounts.access(account_id, false, 'all');
            }
            else if(
                typeof raw_account.blockchains != 'undefined'
                && typeof raw_account.blockchains[chain] != 'undefined'
            ){
                var account = raw_account.blockchains[chain];
                var title = 'Public Key:';
                if(account.address) title = title + ' ' + account.address;
                var intro = '<p>You are trying to access the ' + blockchain + ' blockchain. To see the private key belonging to this address, please use the select box below the QR code and follow the relevant instructions.</p><p>The QR code below is your ' + blockchain + ' Address - ' + account.address + '</p>';
                var qr_code = '<p class="qr-holder" data-content="'+account.address+'"></p>';
                var form = $.fn.blockstrap.forms.process({
                    objects: [
                        {
                            css: 'form-horizontal',
                            fields: [
                                {
                                    selects: {
                                        id: 'access-account',
                                        label: {
                                            text: 'How to process this...?',
                                            css: 'col-xs-4'
                                        },
                                        wrapper: {
                                            css: 'col-xs-8'
                                        },
                                        values: [
                                            {
                                                value: '',
                                                text: '-- Select an Option --'
                                            },
                                            {
                                                value: 'print',
                                                text: 'Print Public Key'
                                            },
                                            {
                                                value: 'access',
                                                text: 'Access Private Key'
                                            }
                                        ],
                                        attributes: [
                                            {
                                                key: 'data-account-id',
                                                value: account_id
                                            },
                                            {
                                                key: 'data-chain',
                                                value: chain
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                });
                $.fn.blockstrap.core.modal(title, intro + qr_code + form);
            }
        });
    }
    
    buttons.add_contact_address = function(button, e)
    {
        e.preventDefault();
        var id = $(button).attr('data-key');
        var contact = $.fn.blockstrap.contacts.get(id);
        var current_blockchains = JSON.parse(JSON.stringify(contact.blockchains));
        var current_blockchain_count = blockstrap_functions.array_length(current_blockchains);
        var available_blockchains = JSON.parse(JSON.stringify($.fn.blockstrap.settings.blockchains));
        delete available_blockchains.multi;
        var available_blockchain_count = blockstrap_functions.array_length(available_blockchains);
        var title = 'Warning';
        var contents = '<p>You already have all available blockchains.</p><p>Please edit the contact if you wish to specify a new address for a particular blockchain.</p>';
        if(current_blockchain_count < available_blockchain_count)
        {
            title = 'Add New Blockchain';
            contents = '<p>Please use the form below to add a new blockchain for this contact:</p>';
            var fields = [];
            $.each(available_blockchains, function(chain, blockchain)
            {
                var add_this_chain = true;
                $.each(current_blockchains, function(k, this_chain)
                {
                    if(this_chain.code == chain) add_this_chain = false;
                });
                if(add_this_chain === true)
                {
                    fields.push({
                        inputs: {
                            id: chain + "_address",
                            label: {
                                text: chain.toUpperCase() + " Address",
                                css: "col-xs-3"
                            },
                            type: "text",
                            wrapper: {
                                css: "col-xs-9"
                            }
                        }
                    });
                }
            });
            var form = $.fn.blockstrap.forms.process({
                objects: [
                    {
                        id: "add-contacts-blockchain",
                        css: "form-horizontal bs",
                        data: [
                            {
                                key: 'data-function',
                                value: 'add_blockchain_contact'
                            },
                            {
                                key: 'data-contact-id',
                                value: id
                            }
                        ],
                        fields: fields,
                        buttons: {
                            forms: [
                                {
                                    css: "btn-success pull-right",
                                    text: "Add"
                                }
                            ]
                        }
                    }
                ]               
            });
            $.fn.blockstrap.core.modal(title, contents + form);
        }
        else
        {
            $.fn.blockstrap.core.modal(title, contents);
        }
    }
    
    buttons.cancel = function(button, mobile, menu, elements)
    {
        if(mobile && !menu) $(elements).css({'opacity':1});
        if(menu)
        {
            if($('#menu-toggle').hasClass('open')) $('#menu-toggle').trigger('click');
            if($('#sidebar-toggle').hasClass('open')) $('#sidebar-toggle').trigger('click');
        }
        $(button).removeClass('loading');
        $($.fn.blockstrap.element).find('.activated').removeClass('activated').addClass('active');
    }
    
    buttons.check_all_inactive = function(button, e)
    {
        e.preventDefault();
        var table = $(button).parent().parent().find('table.table');
        $(table).find('.btn-check_inactive').each(function(i)
        {
            $(this).trigger('click');
        });
    }
    
    buttons.check_inactive = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var id = $(button).attr('data-id');
        var address = $(button).attr('data-address');
        var chain = $(button).attr('data-chain');
        var send_button = $(button).parent().parent().find('.btn-send_inactive');
        var send_href = $(send_button).attr('href');
        var wrapper = $(button).parent().parent().find('td.balance');
        var fee = bs.settings.blockchains[chain].fee * 100000000;
        $(button).addClass('loading');
        bs.api.balance(address, chain, function(balance)
        {
            $(button).removeClass('loading');
            var new_href = send_href.replace('[[amount]]', balance - fee);
            var html = parseFloat(parseInt(balance) / 100000000).toFixed(8);
            $(send_button).attr('href', new_href);
            $(wrapper).text(html);
        });
    }
    
    buttons.create_account = function(button, e)
    {
        e.preventDefault();
        var wallet = {};
        var options = {};
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form'));
        $.fn.blockstrap.core.loader('open');
        if($(form).length > 0)
        {
            $(form).find('.form-group').each(function(i)
            {
                var value = $(this).find('input').val();
                var setup_type = $(this).find('input').attr('data-setup-type');
                if($(this).find('input').hasClass('ignore'))
                {
                    var repeat_id = $(this).find('input').attr('data-repeat-id');
                    var repeat_val = $('#'+repeat_id).val();
                    if(repeat_val && repeat_val != value)
                    {
                        $.fn.blockstrap.core.modal('Warning', 'Repeating Mismatch');
                        continue_salting = false;
                        wallet.cancel = true;
                    }
                }
                else if(setup_type === 'option')
                {
                    if($(this).find('input').attr('id'))
                    {
                        if($(this).find('input').attr('id') == 'wallet_question')
                        {
                            $(this).find('input').attr('id', $(this).find('input').attr('id')+'_'+blockstrap_functions.slug($(form).find('input#wallet_name').val()));
                        }
                        options[$(this).find('input').attr('id')] = value;
                    }
                    else
                    {
                        options[$(this).find('select').attr('id')] = value;
                    }
                }
                else if(value) 
                {
                    wallet[$(this).find('input').attr('id')] = value;
                }
                else
                {
                    if($(this).find('select').length > 0 && !$(this).find('select').hasClass('extra-fields'))
                    {
                        value = $(this).find('select').val();
                        if(value)
                        {
                            wallet[$(this).find('select').attr('id')] = value;
                        }
                    }
                    else if(!value && !$(this).find('select').hasClass('extra-fields'))
                    {
                        if($(this).find('input').hasClass('ignore') || $(this).find('input').hasClass('optional') || $(this).find('input').hasClass('switch'))
                        {
                            // Move along...
                            
                        }
                        else
                        {
                            var label = false;
                            if($(this).find('label').html()) label = $(this).find('label').html();
                            if(label) $.fn.blockstrap.core.modal('Error', 'Value for "'+label+'" Required');
                            else $.fn.blockstrap.core.modal('Error', 'Value Required');
                            $.fn.blockstrap.core.loader('close');
                            return false;
                        }
                    }
                }
            });
        }
        
        if(
            wallet 
            && wallet.wallet_blockchain
            && wallet.wallet_name 
            && wallet.wallet_password 
            && !wallet.cancel
        )
        {
            
            $.fn.blockstrap.data.find('blockstrap', 'options', function(current_options)
            {
                var merged_options = $.extend({}, current_options, options);
                $.fn.blockstrap.data.save('blockstrap', 'options', merged_options, function()
                {

                });
            });
            
            // TODO: Re-evaluate this?
            if(wallet.wallet_blockchain == 'hd')
            {
                wallet.wallet_blockchain = [];
                var chains = $.fn.blockstrap.settings.blockchains;
                delete chains.multi;
                $.each(chains, function(chain, obj)
                {
                    wallet.wallet_blockchain.push(chain);
                });
            }
            
            $.fn.blockstrap.accounts.new(
                wallet.wallet_blockchain, 
                wallet.wallet_name,
                wallet.wallet_password,
                wallet,
                function(account)
                {
                    $.fn.blockstrap.core.refresh(function()
                    {
                        $.fn.blockstrap.core.ready();
                        $.fn.blockstrap.core.loader('close');
                    }, $.fn.blockstrap.core.page());
                }
            )
        }
        else
        {
            $.fn.blockstrap.core.loader('close');
            if(!wallet.cancel)
            {
                $.fn.blockstrap.core.modal('Error', 'Missing wallet requirements');
                return false;
            }
        }
    }
    
    buttons.create_contact = function(button, e)
    {
        e.preventDefault();
        var dnkeys = false;
        var contact = {};
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form'));
        $(button).addClass('loading');
        $.fn.blockstrap.core.loader('open');
        $.fn.blockstrap.core.modals('close_all');
        if($(form).length > 0)
        {
            $(form).find('.form-group').each(function(i)
            {
                var value = $(this).find('input').val();
                if(value && !$(this).find('input').hasClass('optional')) 
                {
                    contact[$(this).find('input').attr('id')] = value;
                }
                else
                {
                    if($(this).find('select').length > 0 && !$(this).find('select').hasClass('extra-fields') || $(this).find('.optional').length > 0)
                    {
                        value = $(this).find('select').val();
                        if(value && $(this).find('.optional').length < 1)
                        {
                            contact[$(this).find('select').attr('id')] = value;
                        }
                        else if(!value && $(this).find('input.optional').val())
                        {
                            value = $(this).find('input.optional').val();
                            contact[$(this).find('input.optional').attr('id')] = value;
                        }
                    }
                    else if(value && $(this).find('input').length > 0)
                    {
                        contact[$(this).find('input').attr('id')] = value;
                    }
                }
            });
        }
        if(
            contact 
            && contact.contact_name
            && contact.contact_address 
            && contact.contact_blockchain 
        )
        {
            $.fn.blockstrap.contacts.new(
                contact.contact_name, 
                contact.contact_address,
                contact.contact_blockchain,
                contact,
                function(contact)
                {
                    $(button).removeClass('loading');
                    /* NEED TO RESET THE INDEX HTML AND DATA */
                    $.fn.blockstrap.templates.render('contacts', function()
                    {
                        $.fn.blockstrap.core.ready();
                        $.fn.blockstrap.core.loader('close');
                    }, $.fn.blockstrap.core.page());
                }
            )
        }
        else if(
            contact 
            && contact.contact_name 
            && contact.contact_dnk
        ){
            var func = 'dnkey';
            var chain = 'multi';
            if(contact.contact_blockchain)
            {
                chain = contact.contact_blockchain;
            }
            if(chain == 'multi')
            {
                func = 'dnkeys';
            }
            $.fn.blockstrap.api[func](
                contact.contact_dnk, 
                chain, 
                function(results)
                {
                    dnkeys = results.dnkeys;
                    if(dnkeys)
                    {
                        $.fn.blockstrap.contacts.new(
                            contact.contact_name, 
                            dnkeys,
                            contact.chain,
                            contact,
                            function(contact)
                            {
                                $(button).removeClass('loading');
                                /* NEED TO RESET THE INDEX HTML AND DATA */
                                $.fn.blockstrap.templates.render('contacts', function()
                                {
                                    $.fn.blockstrap.core.ready();
                                    $.fn.blockstrap.core.loader('close');
                                }, $.fn.blockstrap.core.page());
                            }
                        )
                    }
                    else
                    {
                        $(button).removeClass('loading');
                        $.fn.blockstrap.core.loader('close');
                        $.fn.blockstrap.core.modal('Error', 'No DNKeys associated with this ID.');
                        $(button).removeClass('loading');
                        return false;
                    }
                }, 
                $.fn.blockstrap.core.api('blockstrap')
            );
        }
        else
        {
            $(button).removeClass('loading');
            $.fn.blockstrap.core.loader('close');
            $.fn.blockstrap.core.modal('Error', 'Missing contact requirements');
            $(button).removeClass('loading');
            return false;
        }
    }
    
    buttons.create_credentials = function(button, e)
    {
        e.preventDefault();
        $('#login-credentials-modal').modal('show');
    }
    
    buttons.edit = function(button, e)
    {
        e.preventDefault();
        var key = $(button).attr('data-key');
        var element = $(button).attr('data-element');
        var collection = $(button).attr('data-collection');
        var obj = localStorage.getItem('nw_' + collection + '_' + key);
        if(blockstrap_functions.json(obj)) obj = $.parseJSON(obj);
        if($.isPlainObject(obj))
        {
            var dnk = '';
            var title = 'Edit Contact Details';
            if(obj.data.contact_dnk) dnk = obj.data.contact_dnk;
            var contact_fields = [
                {
                    inputs: {
                        id: "name",
                        label: {
                            text: "Name",
                            css: "col-xs-3"
                        },
                        type: "text",
                        value: obj.name,
                        wrapper: {
                            css: "col-xs-9"
                        }
                    }
                },
                {
                    inputs: {
                        id: "dnk",
                        label: {
                            text: "DNKey ID",
                            css: "col-xs-3"
                        },
                        type: "text",
                        value: dnk,
                        wrapper: {
                            css: "col-xs-9"
                        }
                    }
                }
            ];
            fields = contact_fields;
            if(collection == 'accounts')
            {
                fields = account_fields;
            }
            else
            {
                if($.isArray(obj.blockchains))
                {
                    $.each(obj.blockchains, function(k, blockchain)
                    {
                        if($.isArray(blockchain.addresses))
                        {
                            $.each(blockchain.addresses, function(key, address)
                            {
                                fields.push({
                                    inputs: {
                                        id: "blockchains."+k+".addresses."+key+".key",
                                        label: {
                                            text: blockchain.code.toUpperCase() + " Address",
                                            css: "col-xs-3"
                                        },
                                        type: "text",
                                        value: address.key,
                                        wrapper: {
                                            css: "col-xs-9"
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            }
            var form = $.fn.blockstrap.forms.process({
                objects: [
                    {
                        id: "edit-" + collection,
                        css: "form-horizontal",
                        fields: fields,
                        buttons: {
                            forms: [
                                {
                                    id: "edit-object",
                                    css: "btn-success pull-right",
                                    text: "Save",
                                    attributes: [
                                        {
                                            key: "data-key",
                                            value: key
                                        },
                                        {
                                            key: "data-collection",
                                            value: collection
                                        },
                                        {
                                            key: "data-element",
                                            value: element
                                        },
                                        {
                                            key: "data-form-id",
                                            value: "edit-" + collection
                                        }
                                    ]       
                                }
                            ]
                        }
                    }
                ]               
            });
            $.fn.blockstrap.core.modal(title, form);
        }
    }
    
    buttons.edit_object = function(button, e)
    {
        e.preventDefault();
        var key = $(button).attr('data-key');
        var new_key = key;
        var element = $(button).attr('data-element');
        var collection = $(button).attr('data-collection');
        var form_id = $(button).attr('data-form-id');
        var form = $($.fn.blockstrap.element).find('form#' + form_id);
        var obj = JSON.parse(localStorage.getItem('nw_' + collection + '_' + key));
        $(form).find('.form-group').each(function(i)
        {
            var input = $(this).find('input');
            var value = $(input).val();
            var id = $(input).attr('id');
            if(id.indexOf('dnk') > -1)
            {
                obj.data.contact_dnk = value;
            }
            else if(id.indexOf('name') > -1)
            {
                obj[id] = value;
                new_key = blockstrap_functions.slug(value);
            }
            else if(id.indexOf('.') > -1)
            {
                var ids = id.split('.');
                var address = value;
                if(
                    $.fn.blockstrap.blockchains.validate(address)
                    && 
                    (
                        $.fn.blockstrap.blockchains.which(address) == obj[ids[0]][ids[1]].code
                        ||
                        (
                            $.fn.blockstrap.blockchains.which(address) == 'btct'
                            && obj[ids[0]][ids[1]].code == 'ltct'
                        )
                    )
                ){
                    obj[ids[0]][ids[1]][ids[2]][ids[3]].key = address;
                }
                else
                {
                    if(address != obj[ids[0]][ids[1]][ids[2]][ids[3]].key)
                    {
                        $.fn.blockstrap.core.modal('Warning', 'Not a valid address');
                        return false;
                    }
                }
            }
            else
            {
                obj[id] = value;
            }
            if(new_key !== key) 
            {
                localStorage.removeItem('nw_' + collection + '_' + key);
                obj.id = new_key;
                key = new_key;
            }
            if(i >= $(form).find('.form-group').length - 1)
            {
                $.fn.blockstrap.data.save(collection, key, obj, function()
                {
                    $.fn.blockstrap.core.refresh(function()
                    {
                        $.fn.blockstrap.core.modal('Success', 'Edits Saved');
                    }, $.fn.blockstrap.core.page());
                });
            }
        });
    }
    
    buttons.hidden_toggler = function(button, e)
    {
        e.preventDefault();
        var id = $(button).attr('data-id');
        var css = $(button).attr('data-class');
        var speed = 0;
        if($(button).attr('data-speed')) speed = parseInt($(button).attr('data-speed'));
        if(css)
        {
            $('textarea.'+css).toggle(speed);
        }
        else
        {
            $('textarea#'+id).toggle(speed);
        }
    }
    
    buttons.import = function(button, e)
    {
        e.preventDefault();
        var title = 'Import Device Data';
        var form = $.fn.blockstrap.forms.process({
            objects: [
                {
                    id: "import-device-data",
                    fields_only: false,
                    fields: [
                        {
                            areas: [
                                {
                                    id: "import-data",
                                    style: "display: none;",
                                    placeholder: "Enter the JSON export data you would like to import"
                                }
                            ]
                        },
                        {
                            css: "hidden",
                            inputs: [
                                {
                                    id: "import_file",
                                    type: "file"
                                }
                            ]
                        }
                    ],
                    buttons: {
                        forms: [
                            {
                                type: "submit",
                                css: "btn-primary pull-right btn-hidden_toggler",
                                id: "submit-import",
                                text: "Submit"
                            },
                            {
                                css: "btn-default pull-right btn-hidden_toggler",
                                text: "Copy & Paste",
                                attributes: [
                                    {
                                        key: "data-id",
                                        value: "import-data"
                                    }
                                ]
                            },
                            {
                                css: "btn-primary pull-right",
                                id: "import-file",
                                text: "Import File"
                            }
                        ]
                    }
                }
            ]
        });
        var content = '<p>Import data specifically exported via the backup functionality of this wallet. Either click copy and paste and manually insert the information in the textarea then click submit, or click to import a file instead.</p>' + form;
        $.fn.blockstrap.core.modal(title, content);
    }
    
    buttons.import_file = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        $(bs.element).find('input#import_file').trigger('click');
    }
    
    buttons.login = function(button, e)
    {
        e.preventDefault();
        var form_id = $(button).attr('data-form');
        var username_id = $(button).attr('data-field-username');
        var password_id = $(button).attr('data-field-password');
        var form = $('form#'+form_id);
        var username = $(form).find('#'+username_id).val();
        var password = $(form).find('#'+password_id).val();
        $.fn.blockstrap.security.login(username, password, function()
        {
            if($.fn.blockstrap.security.logged_in) location.reload();
        });
    }
    
    buttons.logout = function(button, e)
    {
        e.preventDefault();
        $.fn.blockstrap.security.logout();
    }
    
    buttons.more_security = function(button, e)
    {
        e.preventDefault();
        var form_id = $(button).attr('data-form-id');
        var hidden_class = $(button).attr('data-hidden-class');
        var form = $('form#'+form_id);
        $(form).find('.'+hidden_class).parent().each(function(i)
        {
            if($(this).css('display') === 'none')
            {
                $(this).show(350);
                $(button).text('Less');
                $(button).removeClass('btn-default').addClass('btn-danger');
            }
            else
            {
                $(this).hide(350);
                $(button).text('More');
                $(button).removeClass('btn-danger').addClass('btn-default');
            }
        });
    }
    
    buttons.new_chain = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        var chains = JSON.parse(JSON.stringify(bs.settings.blockchains));
        delete chains.multi;
        var chain_count = $bs.array_length(chains);
        var account_id = $(button).attr('data-id');
        var account = bs.accounts.get(account_id, true);
        var current_chain_count = $bs.array_length(account.blockchains);
        var default_address = false;
        var default_chain = false;
        var title = 'Warning';
        var contents = '<p>This account currently has all available blockchains being used.</p>';
        contents+= '<p>If you would like to change an address, please <strong>Switch Keys</strong> using the individual recycle action icons.</p>';
        if(current_chain_count < chain_count)
        {
            title = 'Select New Blockchain';
            contents = '<p>Please select the blockchain you would like to add to your account.<p>';
            contents+= '<p>The password must match the password used to generate this account.<p>';
            var chains_available = [];
            $.each(chains, function(chain, obj)
            {
                $.each(account.blockchains, function(this_chain, this_obj)
                {
                    if(this_chain == chain) 
                    {
                        delete chains[chain];
                    }
                    else
                    {
                        default_address = this_obj.address;
                        default_chain = this_chain;
                    }
                });
            });
            chains_available.push({
                value: 'all',
                text: 'All Available Blockchains'
            });
            $.each(chains, function(chain, obj)
            {
                chains_available.push({
                    value: chain,
                    text: obj.blockchain
                });
            });
            var fields = [
                {
                    selects: {
                        label: {
                            css: 'col-xs-3',
                            text: 'Blockchain'
                        },
                        id: 'blockchain',
                        values: chains_available,
                        wrapper: {
                            css: 'col-xs-9'
                        }
                    }
                }
            ];
            if($.isArray(account.keys))
            {
                $.each(account.keys, function(k, v)
                {
                    var group_css = '';   
                    var type = 'text';
                    var key_array = v.split('_');
                    var this_key = key_array[1];
                    var value = account[this_key];
                    // TODO: HARD-CODED FIX THAT SHOULD BE DEALT WITH BY PATCH?
                    if(this_key == 'blockchain' || this_key == 'currency')
                    {
                        value = account.code;
                        type = 'hidden';
                        group_css = 'hidden';
                    }
                    if(this_key == 'password')
                    {
                        type = 'password';
                        value = '';
                    }
                    else if(account[this_key])
                    {
                        type = 'hidden';
                        group_css = 'hidden';
                    }
                    fields.push({
                        css: group_css,
                        inputs: {
                            id: v,
                            type: type,
                            label: {
                                css: 'col-xs-3',
                                text: blockstrap_functions.unslug(this_key)
                            },
                            wrapper: {
                                css: 'col-xs-9'
                            },
                            value: value
                        }
                    });
                })
            }
            var form = $.fn.blockstrap.forms.process({
                id: "add-new-blockchain",
                css: "form-horizontal bs",
                data: [
                    {
                        key: 'data-function',
                        value: 'add_blockchain'
                    },
                    {
                        key: 'data-account-id',
                        value: account_id
                    },
                    {
                        key: 'data-default-address',
                        value: default_address
                    },
                    {
                        key: 'data-default-chain',
                        value: default_chain
                    }
                ],
                objects: [
                    {
                        fields: fields
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
                            id: "submit-new-chain",
                            css: 'btn-success pull-right btn-split',
                            text: 'Confirm',
                            type: 'submit'
                        }
                    ]
                }
            });
            bs.core.modal(title, contents + form);
        }
        else
        {
            bs.core.modal(title, contents);
        }
    }
    
    buttons.page = function(button, e)
    {
        var menu = false;
        var mobile = false;
        var slug = false;
        var id = $(button).attr('id');
        var href = $(button).attr('href');
        var slugs = href.split('#');
        var effect = 'slide';
        var direction = 'left';
        var reverse_direction = 'right';
        var elements = '#sidebar, #navigation';
        var now = new Date().getTime();
        var bs = $.fn.blockstrap;
        
        if($(button).attr('data-elements')) elements = $(button).attr('data-elements');
        if($(button).attr('data-effect')) effect = $(button).attr('data-effect');
        if($(button).hasClass('up')) 
        {
            direction = 'up';
            reverse_direction = 'down';
        }
        
        if(direction == 'up') $.fn.blockstrap.core.loader('open');
        
        // PRIME EXAMPLE OF WHY THIS WHOLE FUNCTION IS NASTY AS ROTTEN EGGS
        if($('#mobile-footer').css('display') === 'block') mobile = true;
        if($('#menu-toggle').hasClass('open') || $('#sidebar-toggle').hasClass('open')) menu = true;
        if(slugs[0] === "" && href)
        {
            slug = slugs[1];   
            $(button).addClass('loading');
            $.fn.blockstrap.core.nav(slug);
            var data_url = 'themes/'+bs.settings.theme+'/'+bs.settings.data_base+slug;
            var html_url = 'themes/'+bs.settings.theme+'/'+bs.settings.html_base+slug;
            if(mobile && !menu) $(elements).css({'opacity':0});
            if(menu)
            {
                $.fn.blockstrap.core.loader('open');
            }
            if($.fn.blockstrap.settings.data_base && $.fn.blockstrap.settings.html_base)
            {
                if(typeof e != 'undefined') e.preventDefault();
                bs.core.get(data_url, 'json', function(data)
                {
                    if(typeof data.status != 'undefined')
                    {
                        buttons.cancel(button, mobile, menu, elements);
                    }
                    else
                    {
                        var filtered_data = $.fn.blockstrap.core.filter(data);
                        
                        bs.core.get(html_url, 'html', function(content)
                        {
                            if(content.status && content.status === 404)
                            {
                                buttons.cancel(button, mobile, menu, elements);
                            }
                            else
                            {
                                buttons.process(
                                    slug, 
                                    content, 
                                    filtered_data, 
                                    button, 
                                    effect, 
                                    direction, 
                                    reverse_direction, 
                                    mobile, 
                                    menu, 
                                    elements
                                );
                            }
                        });
                    }
                });
            }
        }
        else
        {
            if(!href) e.preventDefault();
        }
    }
    
    buttons.print = function(button, e)
    {
        e.preventDefault();
        var print_id = $(button).attr('data-print-id');
        var print_class = $(button).attr('data-print-class');
        var print_title = $(button).attr('data-print-title');
        var contents = $('#'+print_id).html();
        if(print_class) contents = $('#'+print_id).find('.'+print_class).html();
        if(print_title) contents = '<h3>'+print_title+'</h3>'+contents;
        $.fn.blockstrap.core.print(contents);
    }
    
    buttons.process = function(slug, content, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements)
    {
        $("html, body").animate({ scrollTop: 0 }, 350);
        if(direction == 'up' || menu === true) $.fn.blockstrap.core.loader('close');
        
        var url_key = $(button).attr('data-key');
        var url_value = $(button).attr('data-value');
        
        if(history.pushState) 
        {
            var refresh = '';
            if(location.search.indexOf('refresh=true') > -1) refresh = '?refresh=true';
            var url = $.fn.blockstrap.settings.base_url;
            var slug_to_add = url + refresh + '#' + slug;
            if(slug === $.fn.blockstrap.settings.slug_base)
            {
                slug_to_add = url + refresh;
            }
            if(url_key && url_value)
            {
                var new_url = JSON.parse(JSON.stringify(slug_to_add));
                if(slug_to_add.indexOf("?") > -1)
                {
                    new_url = slug_to_add.replace('?', '?' + url_key + '=' + url_value + '&');
                }
                else
                {
                    new_url = slug_to_add.replace('#', '?' + url_key + '=' + url_value + '#');
                }
                slug_to_add = JSON.parse(JSON.stringify(new_url));
            }
            history.pushState({slug:slug}, document.getElementsByTagName("title")[0].innerHTML, slug_to_add);
        }
        
        $('#'+$.fn.blockstrap.settings.content_id).hide(effect, {direction:direction}, 500, function()
        {
            var paged_html = $.fn.blockstrap.templates.filter(Mustache.render(content, filtered_data));
            $('#'+$.fn.blockstrap.settings.content_id).html(paged_html).show(effect, {direction:reverse_direction}, 500, function()
            {
                if(mobile && !menu) $(elements).css({'opacity':1});
                if(menu)
                {
                    if($('#menu-toggle').hasClass('open')) $('#menu-toggle').trigger('click');
                    if($('#sidebar-toggle').hasClass('open')) $('#sidebar-toggle').trigger('click');
                }
            });
            var nav = $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.navigation_id);
            var mnav = $($.fn.blockstrap.element).find('#' + $.fn.blockstrap.settings.mobile_nav_id);
            $(nav).find('.loading').removeClass('loading');
            $(mnav).find('.loading').removeClass('loading');

            $($.fn.blockstrap.element).find('.activated').removeClass('activated');
            $.fn.blockstrap.core.ready();
        });
    }
    
    buttons.refresh = function(button, e)
    {
        e.preventDefault();
        var collection = $(button).attr('data-collection');
        var chain = $(button).attr('data-chain');
        var key = $(button).attr('data-key');
        if(collection == 'accounts')
        {
            $.fn.blockstrap.core.loader('open');
            var account = $.fn.blockstrap.accounts.get(key, true);
            $.fn.blockstrap.accounts.update(account, function()
            {
                $.fn.blockstrap.core.refresh(function()
                {
                    $.fn.blockstrap.core.loader('close');
                }, $.fn.blockstrap.core.page());
            }, true, 0, chain);
        }
    }      
    
    buttons.remove = function(button, e)
    {
        e.preventDefault();
        var chain = '';
        var key = $(button).attr('data-key');
        var element = $(button).attr('data-element');
        var collection = $(button).attr('data-collection');
        var confirm = $(button).attr('data-confirm');
        if($(button).attr('data-chain')) chain = $(button).attr('data-chain');
        if(confirm)
        {
            var form = $.fn.blockstrap.forms.process({
                objects: [
                    {
                        fields: [
                            {
                                inputs: {
                                    label: 'Password',
                                    type: 'password',
                                    id: 'confirm-pw',
                                    placeholder: 'Type your password to allow account removal'
                                }
                            }
                        ]
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
                            id: "submit-pw",
                            css: 'btn-success pull-right btn-split',
                            text: 'Confirm',
                            type: 'submit',
                            attributes: [
                                {
                                    key: 'data-chain',
                                    value: chain
                                }
                            ]
                        }
                    ]
                }
            });
            var text = '<p>Please confirm removal of this account. You will not be able to use any of the coins on the account unless you can accurately re-create them or first back-up the private key. We hope you understand the risks. Please type the account password below and then press confirm to remove account.</p><p>'+form+'</p>';
            var text = '<p>Please confirm removal of this account. You will not be able to use any of the coins on the account unless you can accurately re-create them or first back-up the private key. We hope you understand the risks. Please type the account password below and then press confirm to remove account.</p><p>'+form+'</p>';
            $($.fn.blockstrap.element).find('#confirm-modal .modal-footer').hide();
            $.fn.blockstrap.core.confirm('Confirmation Required', text, function()
            {
                $($.fn.blockstrap.element).find('#confirm-modal .modal-footer').show();
                $.fn.blockstrap.accounts.remove(collection, key, element, confirm, chain);
            });
        }
        else
        {
            $.fn.blockstrap.accounts.remove(collection, key, element, false, chain);
        }
    }
    
    buttons.reset = function(button, e)
    {
        if(e)
        {
            var bs = $.fn.blockstrap;
            var password = $.parseJSON(localStorage.getItem('nw_keys_your_password'));
            var form = $.fn.blockstrap.forms.input({
                id: 'password',
                type: 'password',
                label: 'Password',
                placeholder: 'Confirm your user password',
                attributes: [
                    {
                        key: 'data-pw',
                        value: password
                    }
                ]
            });
            e.preventDefault();
            $(bs.element).find('#confirm-modal .modal-footer').show();
            bs.core.confirm('Confirm Device Reset', '<p>Please confirm that you want to completely remove all of the information from this device? If you have any coins stored, please ensure you first back-up the private keys or make a back-up of the wallet first.</p><p>'+form+'</p>', function(confirmed)
            {
                if(confirmed)
                {
                    bs.core.loader('open');
                    var pw = CryptoJS.SHA3($('#confirm-modal').find('input#password').val(), { outputLength: 512 }).toString();
                    $(bs.element).on('hidden.bs.modal', '#confirm-modal', function()
                    {
                        if(confirmed && pw == password)
                        {
                            bs.core.reset(true);
                            location.reload();
                        }
                        else
                        {
                            bs.core.loader('close');
                            bs.core.modal('Warning', 'The provided password does not match your user device password.');
                        }
                    });
                    bs.core.modals('close_all');
                }
            });
        }
    }
    
    buttons.save_salt = function(button, e)
    {
        e.preventDefault();
        var new_data = {};
        var ts = Date.now();
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form-id'));
        var data = $.parseJSON($(form).find('#data').val());
        new_data.nw_keys = data.nw_keys;
        new_data.nw_blockstrap = data.nw_blockstrap;
        var blob = new Blob([JSON.stringify(new_data)], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'blockstrap-salt-backup-'+ts+'.txt');
        $.fn.blockstrap.core.modals('close_all');
    }
    
    buttons.save_wallet = function(button, e)
    {
        e.preventDefault();
        var ts = Date.now();
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form-id'));
        var data = $(form).find('#data').val();
        var blob = new Blob([data], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'blockstrap-wallet-backup-'+ts+'.txt');
        $.fn.blockstrap.core.modals('close_all');
    }
    
    buttons.see_all = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var id = $(button).attr('data-id');
        var account = bs.accounts.get(id, true);
        var title = 'Warning';
        var contents = 'You do not have any inactive addresses';
        if(
            typeof account.addresses != 'undefined'
            && $.isArray(account.addresses)
            && typeof account.addresses[0].chains != 'undefined'
            && $.isPlainObject(account.addresses[0].chains)
        ){
            title = 'Inactive Addresses';
            contents = '<p>The following addresses belonging to this account are inactive and no longer checked automatically:</p>';
            contents+= '<table class="table table-striped table-bordered table-hover">';
            $.each(account.addresses[0].chains, function(chain, addresses)
            {
                var current_address = account.blockchains[chain].address
                var blockchain = bs.settings.blockchains[chain].blockchain;
                contents+= '<thead>';
                    contents+= '<tr><th>'+blockchain+' Addresses</th><th>Balance</th><th>Actions</th></tr>';
                contents+= '</thead>';
                contents+= '<tbody>';
                        $.each(addresses, function(key, this_address)
                        {
                            contents+= '<tr>';
                                contents+= '<td><a href="http://api.blockstrap.com/v0/'+chain+'/address/id/'+this_address+'" target="_blank">'+this_address+'</a></td>';
                                contents+= '<td class="balance">N/A</td>';
                                contents+= '<td><a href="#" class="btn btn-xs btn-primary pull-right btn-check_inactive" data-id="'+id+'" data-chain="'+chain+'" data-address="'+this_address+'">Check</a><a href="?from='+this_address+'&amount=[[amount]]&chain='+chain+'&key='+current_address+'#send" class="btn btn-xs btn-success pull-right btn-send_inactive" data-id="'+id+'" data-chain="'+chain+'" data-address="'+this_address+'">Send</a></td>';
                            contents+= '</tr>';
                        });
                contents+= '</tbody>';
            });
            contents+= '</table>';
            contents+= '<p><a href="#" class="btn btn-primary btn-check_all_inactive" data-id="'+id+'">check all</a></p>';
            bs.core.modal(title, contents);
        }
        else
        {
            bs.core.modal(title, contents);
        }
    }
    
    buttons.send_money = function(button, e)
    {
        e.preventDefault();
        var standard = true;
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form-id'));
        var to = $(form).find('#to').val();
        var from = $(form).find('#from').val();
        var from_chain = $(form).find('#from_account_chain').val();
        var chain = $(form).find('#from option:selected').attr('data-chain');
        var amount = parseFloat($(form).find('#amount').val()) * 100000000;
        if(from_chain && !chain) 
        {
            chain = from_chain;
            standard = false;
        }
        if(!to) $.fn.blockstrap.core.modal('Warning', 'Missing address to send payment to');
        else if(!from) $.fn.blockstrap.core.modal('Warning', 'Missing account to use to send from');
        else if(!amount) $.fn.blockstrap.core.modal('Warning', 'You have not provided the amount you want to send');
        else
        {
            $.fn.blockstrap.accounts.prepare(to, from, amount, chain, standard);
        }
    }
    
    buttons.setup = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        var href = $(button).attr('href');
        var steps = parseInt($(button).attr('data-steps'));
        var current_step = parseInt($(button).attr('data-step'));
        var next_step = current_step + 1;
        var form_string = $(button).attr('data-forms');
        var forms = form_string.split(', ');
        var data_url = 'themes/' + bs.settings.theme + '/' + bs.settings.data_base + bs.settings.page_base;
        var html_url = 'themes/' + bs.settings.theme + '/' + bs.settings.html_base + bs.settings.page_base;
        
        $(button).addClass('loading');
        if($.isArray(forms))
        {
            var wallet = false;
            var modules = {};
            var options = {};
            var continue_salting = true;
            var errors = [];
            
            bs.core.loader('open');
            
            $.each(forms, function(form_index, form_id)
            {
                var form = $('form#'+form_id);
                $(form).find('#temp_un').remove();
                $(form).find('#temp_pw').remove();
                if($(form).length > 0)
                {
                    $(form).find('.form-group').each(function(i)
                    {
                        var setup_type = $(this).find('input').attr('data-setup-type');
                        if(!setup_type) setup_type = $(this).find('select').attr('data-setup-type');
                        if((!$(this).find('input').val() && setup_type == 'module') || ((!$(this).find('input').val() && !$(this).find('select').val()) && setup_type == 'wallet' && $(this).find('select').attr('id') !== 'extra_salty_wallet'))
                        {
                            if($(this).find('input').hasClass('optional') && !value)
                            {
                                // Move along...
                            }
                            else
                            {
                                var label = false;
                                var error = 'Value Required';
                                if($(this).find('label').html()) label = $(this).find('label').html();
                                if(label) error = 'Value for "'+label+'" Required';
                                continue_salting = false;
                                errors.push(error);
                            }
                        }
                        else
                        {
                            var value = $(this).find('input').val();
                            var image = $(this).find('input').attr('data-img');
                            if(!value) value = $(this).find('select').val();
                            
                            if(value === 'true' || value === true || $(this).find('.bootstrap-switch').hasClass('bootstrap-switch-on')) value = true;
                            else if((value === 'false' || value === false || !value) && ($(this).find('input').hasClass('switch') || $(this).find('input').attr('type') === 'file'))
                            {
                                value = false;
                                $(this).find('input.switch').removeAttr('checked');
                            }
                            
                            if(image)
                            {
                                value = image;
                            }
                            else if($(this).find('input.hidden-input').val())
                            {
                                value = $(this).find('input.hidden-input').val();
                                var hidden_setup_type = $(this).find('input.hidden-input').attr('data-setup-type');
                                if(hidden_setup_type === 'module')
                                {
                                    modules[$(this).find('input.hidden-input').attr('id')] = value;
                                }
                            }
                            
                            if($(this).find('input').hasClass('ignore'))
                            {
                                var repeat_id = $(this).find('input').attr('data-repeat-id');
                                var repeat_val = $('#'+repeat_id).val();
                                if(repeat_val && repeat_val != value)
                                {
                                    errors.push('Repeating Password Mismatch');
                                    continue_salting = false;
                                    wallet.cancel = true;
                                }
                            }
                            else if(setup_type === 'module')
                            {
                                modules[$(this).find('input').attr('id')] = value;
                            }
                            else if(setup_type === 'option')
                            {
                                if($(this).find('input').attr('id'))
                                {
                                    if($(this).find('input').attr('id') == 'wallet_question')
                                    {
                                        $(this).find('input').attr('id', $(this).find('input').attr('id')+'_'+blockstrap_functions.slug($(form).find('input#wallet_name').val()));
                                    }
                                    options[$(this).find('input').attr('id')] = value;
                                }
                                else
                                {
                                    options[$(this).find('select').attr('id')] = value;
                                }
                            }
                            else if(setup_type === 'wallet')
                            {
                                if(!wallet) wallet = {};
                                if(!value && $(this).find('select').attr('id') !== 'extra_salty_wallet')
                                {
                                    value = $(this).find('select').val();
                                    wallet[$(this).find('select').attr('id')] = value;
                                }
                                else if($(this).find('select').attr('id') !== 'extra_salty_wallet')
                                {
                                    if($(this).find('input').attr('id'))
                                    {
                                        wallet[$(this).find('input').attr('id')] = value;
                                    }
                                    else
                                    {
                                        wallet[$(this).find('select').attr('id')] = value;
                                    }
                                }
                            }
                            else
                            {
                                if($(this).find('select').length < 1)
                                {
                                    bs.core.modal('Error', 'Setup Type Missing');
                                }
                            }
                        }
                    });
                }
            });
            
            bs.data.find('blockstrap', 'options', function(current_options)
            {
                var merged_options = $.extend({}, current_options, options);
                bs.data.save('blockstrap', 'options', merged_options, function()
                {

                });
            });
            
            // TODO: Re-evaluate this?
            if(wallet.wallet_blockchain == 'hd')
            {
                wallet.wallet_blockchain = [];
                var chains = $.fn.blockstrap.settings.blockchains;
                delete chains.multi;
                $.each(chains, function(chain, obj)
                {
                    wallet.wallet_blockchain.push(chain);
                });
            }
            
            if(
                wallet 
                && wallet.wallet_blockchain
                && wallet.wallet_name 
                && wallet.wallet_password
                && !wallet.cancel
            )
            {
                bs.accounts.new(
                    wallet.wallet_blockchain, 
                    wallet.wallet_name,
                    wallet.wallet_password,
                    wallet,
                    function(account)
                    {
                        // INSTALL CONFIGURED CONTACTS IF AVAILABLE
                        if($.isArray(bs.settings.contacts))
                        {
                            var contacts = bs.settings.contacts;
                            $.each(contacts, function(k, contact)
                            {
                                bs.contacts.new(
                                    contact.name, 
                                    contact.blockchains,
                                    false,
                                    contact,
                                    function()
                                    {
                                        // And then?
                                    },
                                    true // TODO: FIX THIS DIRTY HACK !!!
                                );
                            });
                        }
                        
                        /* NEED TO RESET THE INDEX HTML AND DATA */
                        bs.templates.render(bs.settings.page_base, function()
                        {
                            $("html, body").animate({ scrollTop: 0 }, 350, function()
                            {
                                bs.core.loader('close');
                            });
                        }, true);
                    }
                )
            }
            else if(continue_salting)
            {
                var saved_salt = bs.settings.id;
                if(localStorage.getItem('nw_blockstrap_salt'))
                {
                    saved_salt = localStorage.getItem('nw_blockstrap_salt');
                    if($bs.json(saved_salt)) saved_salt = $.parseJSON(saved_salt);
                }
                bs.core.salt(modules, function(salt, keys)
                {
                    bs.data.find('blockstrap', 'keys', function(stored_keys)
                    {
                        var new_keys = $.merge($.merge([], stored_keys), keys);
                        bs.data.save('blockstrap', 'keys', new_keys, function()
                        {
                            bs.data.save('blockstrap', 'salt', salt, function()
                            {
                                $("html, body").animate({ scrollTop: 0 }, 350);
                                if(current_step >= steps)
                                {
                                    /* NEED TO RESET THE INDEX HTML AND DATA */
                                    bs.templates.render(bs.settings.page_base, function()
                                    {
                                        
                                    }, true);
                                }
                                else
                                {
                                    bs.core.get(data_url, 'json', function(results)
                                    { 
                                        res = {};
                                        if($.isPlainObject(results))
                                        {
                                            res = results;
                                            res.user = false;
                                        }
                                        res.setup = {};
                                        res.setup.func = 'setup';
                                        res.setup.step = next_step;
                                        var data = bs.core.filter(res);
                                        bs.core.get(html_url, 'html', function(html)
                                        { 
                                            var page = Mustache.render(html, data);
                                            var paged = bs.templates.filter(page);
                                            $(bs.element).html('');
                                            $(bs.element).append(paged);
                                            $(bs.element).addClass('loading');
                                            $(bs.element).find('#blockstrap-loader').css({'opacity': 1, 'z-index': 9999999});
                                            bs.core.ready();
                                            $.fn.blockstrap.core.loader('close');
                                        });
                                    });
                                }
                            });
                        });
                    });
                }, saved_salt);
            }
            else
            {
                bs.core.loader('close');
                $(button).removeClass('loading');
                var title = 'Error';
                var contents = '';
                if(blockstrap_functions.array_length(errors) > 0)
                {
                    $.each(errors, function(k, error)
                    {
                        contents+= '<p>'+error+'</p>';
                    });
                    bs.core.modal(title, contents);
                }
            }
        }
    }
    
    buttons.submit_import = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        var value = $(bs.element).find('form#import-device-data #import-data').val();
        var error_title = 'Error Importing';
        var error_content = 'Unable to import the data.';
        if($bs.json(value))
        {
            var accounts = false;
            var bs_bits = false;
            var contacts = false;
            var keys = false;
            value = $.parseJSON(value);
            if($.isArray(value.nw_accounts)) accounts = value.nw_accounts;
            if($.isPlainObject(value.nw_blockstrap)) bs_bits = value.nw_blockstrap;
            if($.isArray(value.nw_contacts)) contacts = value.nw_contacts;
            if($.isPlainObject(value.nw_keys)) keys = value.nw_keys;
            var account_len = $bs.array_length(accounts);
            var bs_bits_len = $bs.array_length(bs_bits);
            var contacts_len = $bs.array_length(contacts);
            var keys_len = $bs.array_length(keys);
            var total_len = account_len + bs_bits_len + contacts_len + keys_len;
            if(keys != false && bs_bits != false)
            {
                if($.isArray(accounts))
                {
                    $.each(accounts, function(k, v)
                    {
                        localStorage.setItem('nw_accounts_' + v.id, JSON.stringify(v));
                    });
                }
                if($.isPlainObject(bs_bits))
                {
                    $.each(bs_bits, function(k, v)
                    {
                        localStorage.setItem('nw_blockstrap_' + k, JSON.stringify(v));
                    });
                }
                if($.isArray(contacts))
                {
                    $.each(contacts, function(k, v)
                    {
                        localStorage.setItem('nw_contacts_' + v.id, JSON.stringify(v));
                    });
                }
                if($.isPlainObject(keys))
                {
                    $.each(keys, function(k, v)
                    {
                        localStorage.setItem('nw_keys_' + k, JSON.stringify(v));
                    });
                }
                location.reload();
            }
            else
            {
                error_content+= ' Missing vital Blockstrap attributes.';
                $.fn.blockstrap.core.modal(error_title, error_content);
            }
        }
        else
        {
            error_content+= ' This is not even valid JSON data.';
            $.fn.blockstrap.core.modal(error_title, error_content);
        }
    }
    
    buttons.submit_payment = function(button, e)
    {
        e.preventDefault();
        var fields = [];
        var account = false;
        var op_return_data = false;
        var form_id = $(button).attr('data-form-id');
        var standard = $(button).attr('data-standard');
        var from = $(button).attr('data-from');
        var from_address = $(button).attr('data-from');
        var account_id = $(button).attr('data-account-id');
        var chain = $(button).attr('data-chain');
        var blockchain = $(button).attr('data-to-blockchain');
        var to_address = $(button).attr('data-to-address');
        var to_amount = parseInt($(button).attr('data-to-amount'));
        var form = $('form#'+form_id);
        var raw_accounts = $.fn.blockstrap.accounts.get(account_id, true);
        if(standard == 'false') standard = false;
        else standard = true;
        if(
            typeof raw_accounts.blockchains != 'undefined'
            && typeof raw_accounts.blockchains[chain] != 'undefined'
        ){
            account = raw_accounts.blockchains[chain];
        }
        var balance = account.balance;
        var fee = $.fn.blockstrap.settings.blockchains[blockchain].fee * 100000000;
        var from_address = account.address;
        var change = balance - (to_amount + fee);
        var current_tx_count = account.tx_count;
        if(balance < to_amount + fee && standard)
        {
            $.fn.blockstrap.core.modal('Warning', 'You do not have sufficient funds');
        }
        else
        {
            if(!standard && from)
            {
                from_address = from;
            }
            $.fn.blockstrap.core.loader('open');
            $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
            {
                $(form).find('.form-group').each(function(i)
                {
                    var input = $(this).find('input');
                    var value = $(input).val();
                    var id = $(input).attr('id');
                    if(!$(input).hasClass('ignore'))
                    {
                        var use_op_return = false;
                        var blockchain_settings = $.fn.blockstrap.settings.blockchains;
                        if(
                            typeof blockchain_settings[blockchain] != 'undefined'
                            && blockchain_settings[blockchain].op_return === true
                        ){
                            use_op_return = true;
                        }
                        if(id != 'msg')
                        {
                            fields.push({
                                id: id,
                                value: value
                            });
                        }
                        else if(use_op_return === true)
                        {
                            var op_limit = 0;
                            if(
                                typeof blockchain_settings[blockchain] != 'undefined'
                                && typeof blockchain_settings[blockchain].op_limit != 'undefined'
                            ){
                                op_limit = blockchain_settings[blockchain].op_limit;
                            }
                            var m = encodeURIComponent(value).match(/%[89ABab]/g);
                            var value_len = value.length + (m ? m.length : 0);
                            if(value_len < (op_limit - 1))
                            {
                                op_return_data = value;
                            }
                            else
                            {
                                op_return_data = null;
                            }
                        }
                        else if(value)
                        {
                            op_return_data = null;
                        }
                    }
                });
                $.fn.blockstrap.accounts.verify(account, fields, function(verified, keys)
                {
                    if(verified === true && op_return_data != null)
                    {
                        $.fn.blockstrap.blockchains.send(to_address, to_amount, from_address, keys, function(tx)
                        {
                            var saved_account = $.fn.blockstrap.accounts.get(account_id, true);
                            if(tx && typeof tx.txid != 'undefined')
                            {
                                setTimeout(function()
                                {
                                    $.fn.blockstrap.accounts.update(saved_account, function()
                                    {
                                        $.fn.blockstrap.core.refresh(function()
                                        {
                                            $.fn.blockstrap.core.modals('close_all');
                                            $.fn.blockstrap.core.loader('close');
                                            var title = 'Sent ' + parseInt(to_amount) / 100000000 + ' ' + saved_account.blockchains[chain].type + ' to ' + to_address;
                                            var base = $.fn.blockstrap.settings.base_url;
                                            var content = '<p>Transaction ID: ' + tx.txid + '</p><p>You can <a href="' + base + '?txid=' + tx.txid + '#transaction">verify</a> your transaction using our internal explorer, or via a third-party service such as <a href="https://blockchains.io/' + blockchain + '/transaction/' + tx.txid + '">this</a>.</p>';
                                            content+='<p>Please note that a '+(fee / 100000000)+' '+$.fn.blockstrap.settings.blockchains[blockchain].blockchain+' mining fee was also added to the transaction.</p>';
                                            $.fn.blockstrap.core.modal(title, content);
                                        }, $.fn.blockstrap.core.page());
                                    });
                                }, 6000);
                            }
                            else
                            {
                                var title = 'Warning';
                                var content = 'Unable to relay transaction.';
                                $.fn.blockstrap.core.modal(title, content);
                                $.fn.blockstrap.core.loader('close');
                            }
                        }, blockchain, op_return_data);
                    }
                    else
                    {
                        if(op_return_data == null)
                        {
                            var title = 'Warning';
                            var content = 'Message too long!';
                            $.fn.blockstrap.core.modal(title, content);
                            $.fn.blockstrap.core.loader('close');
                        }
                        if(!verified)
                        {
                            var title = 'Warning';
                            var contents = 'Unable to verify ownership';
                            $.fn.blockstrap.core.modal(title, contents);
                            $.fn.blockstrap.core.loader('close');
                        }
                    }
                }, false, chain, raw_accounts.type, from_address);
            });
        }
    } 
    
    buttons.submit_verification = function(button, e)
    {
        e.preventDefault();
        var account = false;
        var fields = [];
        var form_id = $(button).attr('data-form-id');
        var account_id = $(button).attr('data-account-id');
        var standard = $(button).attr('data-standard');
        var from_address = $(button).attr('data-from');
        var chain = $(button).attr('data-chain');
        var form = $('form#'+form_id);
        var raw_accounts = $.fn.blockstrap.accounts.get(account_id, true);
        var account_chains = JSON.parse(JSON.stringify(raw_accounts.blockchains));
        if(
            typeof raw_accounts.blockchains != 'undefined'
            && typeof raw_accounts.blockchains[chain] != 'undefined'
        ){
            account = raw_accounts.blockchains[chain];
        }
        else if(
            chain == 'all'
            && typeof raw_accounts.blockchains != 'undefined'
        ){
            $.each(account_chains, function(chain, blockchain)
            {
                if(chain != 'multi') account = account_chains[chain];
            });
        }
        $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
        {
            $(form).find('.form-group').each(function(i)
            {
                var input = $(this).find('input');
                var value = $(input).val();
                var id = $(input).attr('id');
                if(!$(input).hasClass('ignore'))
                {
                    fields.push({
                        id: id,
                        value: value
                    });
                }
            });
            $.fn.blockstrap.accounts.verify(account, fields, function(verified, keys, raw, seed)
            {
                var private_key = keys.priv;
                var address = keys.pub;
                var title = 'Private Key for '+address;
                if(verified === true && chain == 'all' && seed)
                {
                    title = 'Master Seed used for '+account.name;
                    contents = '<p><strong>The master seed for this account:</strong></p>';
                    contents+= '<pre><code>'+seed+'</code></pre>';
                    contents+= '<p>All of the private keys that are only ever generated inline for this account at the moment they are needed use the following master-seed and are <a href="https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki" target="_blank">BIP32</a> compliant. However, please note that we add the blockchain shortcode to the end of the seed for each blockchain, as follows:</p>';
                    $.each(account_chains, function(chain, blockchain)
                    {
                        var these_keys = $.fn.blockstrap.blockchains.keys(seed+chain, chain, 1, false, true);
                        var this_public_key = these_keys.pub;
                        var this_private_key = these_keys.priv;
                        var extended_private_key = these_keys.raw.toString();
                        var public_keys = these_keys.raw.neutered();
                        var extended_public_key = public_keys.toString();
                        contents+= '<hr><span class="alert alert-info alert-block"><strong>' + $.fn.blockstrap.settings.blockchains[chain].blockchain + '</strong></span><pre><code><small>var '+chain+'_keys = bitcoinjslib.HDNode.fromSeedBuffer('+seed+chain+', bitcoinjslib.networks[' + $.fn.blockstrap.settings.blockchains[chain].lib + '])</small></code></pre><span class="alert alert-success alert-block"><pre><code><strong>Public Key</strong>:<br />' + this_public_key + '<br /><br /><strong>Private Key</strong>:<br />' + this_private_key + '</code></pre></span><span class="alert alert-warning alert-block"><pre><code><strong>Extended Public Key</strong>:<br />'+ extended_public_key +'<br /><br /><strong>Extended Private Key</strong>:<br />'+ extended_private_key +'</code></pre></span>';
                    });
                    contents+= '<hr><span class="alert alert-danger alert-block">Please note that if you use the <strong>switch address</strong> functionality available by clicking the recycle icon button from the actions column on the accounts table we then use the BIP32 HD <strong>dervived</strong> method to generate new addresses based upon the number of old addresses stored within the account. This can be (as is done manually) by the wallet when using the switch functionality, but can also be done externally by third-parties using the <strong>extended keys</strong> listed above</span>';
                    $.fn.blockstrap.core.modal(title, contents);
                }
                else if(verified === true)
                {
                    var intro = '<span class="alert alert-info alert-block">'+private_key+'<br /><span class="small">(QR code below)</span></span>';
                    var qr_code = '<p class="qr-holder" data-content="'+private_key+'"></p>';
                    var print = '<p style="text-align: center"><a href="#" class="btn btn-danger btn-print" data-print-id="default-modal" data-print-class="modal-body" data-print-title="Private Key for '+address+'">PRINT THIS KEY</a></p>';
                    $.fn.blockstrap.core.modal(title, intro + qr_code + print);
                    $('#default-modal').find('.qr-holder').each(function()
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
                }
                else
                {
                    var title = 'Warning';
                    var contents = 'Unable to verify ownership';
                    $.fn.blockstrap.core.modal(title, contents);
                }
            }, false, chain, raw_accounts.type, from_address, true);
        });
    }
    
    buttons.sign = function(button, e)
    {
        e.preventDefault();
        var account_id = $(button).attr('data-key');
        var chain = $(button).attr('data-chain');
        var blockchain = $.fn.blockstrap.settings.blockchains[chain].blockchain;
        var account = $.fn.blockstrap.accounts.get(account_id, true);
        var fields = [];
        if($.isArray(account.keys))
        {
            $.each(account.keys, function(k, v)
            {
                var group_css = '';   
                var type = 'text';
                var key_array = v.split('_');
                var this_key = key_array[1];
                var value = account[this_key];
                // TODO: HARD-CODED FIX THAT SHOULD BE DEALT WITH BY PATCH?
                if(this_key == 'blockchain' || this_key == 'currency')
                {
                    value = account.code;
                    type = 'hidden';
                    group_css = 'hidden';
                }
                if(this_key == 'password')
                {
                    type = 'password';
                    value = '';
                }
                else if(account[this_key])
                {
                    type = 'hidden';
                    group_css = 'hidden';
                }
                fields.push({
                    css: group_css,
                    inputs: {
                        id: v,
                        type: type,
                        label: {
                            css: 'col-xs-3',
                            text: blockstrap_functions.unslug(this_key)
                        },
                        wrapper: {
                            css: 'col-xs-9'
                        },
                        value: value
                    }
                });
            })
        }
        fields.push({
            areas: {
                id: 'message',
                placeholder: 'The message to sign'
            }
        });            
        var contents = '<p>Please verify owenrship of the address before signing the message with its keys.</p>';
        var form = $.fn.blockstrap.forms.process({
            id: "sign-messages",
            css: "form-horizontal bs",
            data: [
                {
                    key: 'data-function',
                    value: 'sign_message'
                },
                {
                    key: 'data-account-id',
                    value: account_id
                },
                {
                    key: 'data-chain',
                    value: chain
                }
            ],
            objects: [
                {
                    fields: fields
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
                        id: "sign-messagr",
                        css: 'btn-success pull-right btn-split',
                        text: 'Sign',
                        type: 'submit'
                    }
                ]
            }
        });
        $.fn.blockstrap.core.modal('Sign Message with '+blockchain, contents + form);
    }
    
    buttons.switch = function(button, e)
    {
        e.preventDefault();
        var account_id = $(button).attr('data-key');
        var chain = $(button).attr('data-chain');
        var blockchain = $.fn.blockstrap.settings.blockchains[chain].blockchain;
        var account = $.fn.blockstrap.accounts.get(account_id, true);
        var fields = [];
        if($.isArray(account.keys))
        {
            $.each(account.keys, function(k, v)
            {
                var group_css = '';   
                var type = 'text';
                var key_array = v.split('_');
                var this_key = key_array[1];
                var value = account[this_key];
                // TODO: HARD-CODED FIX THAT SHOULD BE DEALT WITH BY PATCH?
                if(this_key == 'blockchain' || this_key == 'currency')
                {
                    value = account.code;
                    type = 'hidden';
                    group_css = 'hidden';
                }
                if(this_key == 'password')
                {
                    type = 'password';
                    value = '';
                }
                else if(account[this_key])
                {
                    type = 'hidden';
                    group_css = 'hidden';
                }
                fields.push({
                    css: group_css,
                    inputs: {
                        id: v,
                        type: type,
                        label: {
                            css: 'col-xs-3',
                            text: blockstrap_functions.unslug(this_key)
                        },
                        wrapper: {
                            css: 'col-xs-9'
                        },
                        value: value
                    }
                });
            })
        }
        fields.push({
            selects: {
                id: 'transfer-funds',
                label: {
                    css: 'col-xs-3',
                    text: 'Transfer Funds'
                },
                wrapper: {
                    css: 'col-xs-9'
                },
                values: [
                    {
                        value: 'yes',
                        text: 'Transfer to Next Address'
                    },
                    {
                        value: 'no',
                        text: 'Do not transfer funds'
                    }
                ]
            }
        });
        var contents = '<p>Please verify owenrship before switching addresses:</p>';
        var form = $.fn.blockstrap.forms.process({
            id: "switch-addresses",
            css: "form-horizontal bs",
            data: [
                {
                    key: 'data-function',
                    value: 'switch_addresses'
                },
                {
                    key: 'data-account-id',
                    value: account_id
                },
                {
                    key: 'data-chain',
                    value: chain
                }
            ],
            objects: [
                {
                    fields: fields
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
                        id: "switch-address",
                        css: 'btn-success pull-right btn-split',
                        text: 'Confirm',
                        type: 'submit'
                    }
                ]
            }
        });
        $.fn.blockstrap.core.modal('Switch Addresses on '+blockchain, contents + form);
    }
    
    buttons.toggle = function(button, e)
    {
        e.preventDefault();
        var type = $(button).attr('data-toggle');
        var state = 'input';
        var options = '';
        if($(button).parent().find('select').length > 0)
        {
            state = 'select';
        }
        
        // MAY NEED TO MAKE MORE MODULE IF MORE THAN ONE TYPE
        // THIS WAS ONLY MEANT AS A PLACEHOLDER FOR DEMO DAY
        if(type === 'contacts')
        {
            var contacts = $.fn.blockstrap.contacts.get();
            if($.isArray(contacts) && state == 'input')
            {
                var input = $(button).parent().find('input');
                var select_id = $(input).attr('id');
                var select_class = $(input).attr('class');
                var select_placeholder = $(input).attr('placeholder');
                var select_type = $(input).attr('type');
                var select = '<select id="'+select_id+'" class="'+select_class+'" type="'+select_type+'" placeholder="'+select_placeholder+'">';
                $.each(contacts, function(key, contact)
                {
                    var value = '';
                    var text = '';
                    var blockchains = contact.blockchains;
                    if($.isArray(blockchains))
                    {
                        $.each(blockchains, function(blockchain_key, blockchain)
                        {
                            var addresses = blockchain.addresses;
                            if($.isArray(addresses))
                            {
                                $.each(addresses, function(address_key, address)
                                {
                                    value = address.key;
                                    text = contact.name +': '+ blockchain.blockchain;
                                    if(value && text)
                                    {
                                        options+= '<option value="' + value + '">' + text + '</option>';
                                    }
                                });
                            }
                        });
                    }
                });
                if(options)
                {
                    var default_option = '<option value="">-- Select Contact--</option>';
                    options+= '<option value="bs-toggle">-- Enter Manually --</option>';
                    $(button).css({'display':'none'});
                    $(input).after(select+default_option+options+'</select>');
                    $(input).remove();
                    $(button).parent().find('select').on('change', function()
                    {
                        if($(this).val() == 'bs-toggle')
                        {
                            var select = $(button).parent().find('select');
                            var input_id = $(select).attr('id');
                            var input_class = $(select).attr('class');
                            var input_placeholder = $(select).attr('placeholder');
                            var input_type = $(select).attr('type');
                            var input = '<input id="'+input_id+'" class="'+input_class+'" type="'+input_type+'" placeholder="'+input_placeholder+'">';
                            $(select).after(input);
                            $(select).remove();
                            $(button).css({'display':'block'});
                        }
                    });
                }
            }
            else if(state == 'input')
            {
                $.fn.blockstrap.core.modal('Reminder', 'You do not yet have any contacts');
            }
        }
    }
    
    buttons.verify = function(button, e)
    {
        e.preventDefault();
        var title = 'Verify Signed Message';
        var contents = '<p>Use this form to verify a signed message:</p>';
        var chains_available = [];
        $.each($.fn.blockstrap.settings.blockchains, function(chain, blockchain)
        {
            if(chain != 'multi')
            {
                chains_available.push({
                    value: chain,
                    text: blockchain.blockchain
                });
            }
        });
        var form = $.fn.blockstrap.forms.process({
            id: "verify-messages",
            css: "form-horizontal bs",
            data: [
                {
                    key: 'data-function',
                    value: 'verify_message'
                }
            ],
            objects: [
                {
                    fields: [
                        {
                            inputs: {
                                id: 'address',
                                type: 'text',
                                label: {
                                    css: 'col-xs-3',
                                    text: 'Address'
                                },
                                wrapper: {
                                    css: 'col-xs-9'
                                }
                            }
                        },
                        {
                            selects: {
                                id: 'chain',
                                type: 'text',
                                label: {
                                    css: 'col-xs-3',
                                    text: 'Blockchain'
                                },
                                wrapper: {
                                    css: 'col-xs-9'
                                },
                                values: chains_available
                            }
                        },
                        {
                            areas: {
                                id: 'signature',
                                placeholder: 'Signed signature to verify'
                            }
                        },
                        {
                            areas: {
                                id: 'message',
                                placeholder: 'Message used to generate signature'
                            }
                        }
                    ]
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
                        id: "verify-message",
                        css: 'btn-success pull-right btn-split',
                        text: 'Verify',
                        type: 'submit'
                    }
                ]
            }
        });
        $.fn.blockstrap.core.modal('Verify a Signed Message', contents + form);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {buttons:buttons});
})
(jQuery);

(function($) 
{
    var contacts = {};
    
    contacts.get = function(id)
    {
        var contacts = false;
        if(localStorage)
        {
            $.each(localStorage, function(key, contact)
            {
                if(key.substring(0, 12) === 'nw_contacts_')
                {
                    if(!$.isArray(contacts)) contacts = [];
                    if(id && key == 'nw_contacts_' + id) contacts.push($.parseJSON(contact));
                    else if(!id) contacts.push($.parseJSON(contact));
                }
            });
        }
        if(id) return $.fn.blockstrap.core.apply_filters('contacts_get', contacts[0]);
        else return $.fn.blockstrap.core.apply_filters('contacts_get', contacts);
    }
    
    contacts.new = function(name, address, blockchain, fields, callback, ignore_errors)
    {
        if(typeof ignore_errors == 'undefined') ignore_errors = false;
        else ignore_errors = true;
        var addresses = address;
        if(!$.isPlainObject(address) && !$.fn.blockstrap.blockchains.validate(address))   
        {
            if(!ignore_errors)
            {
                $.fn.blockstrap.core.modal('Error', 'This is not a valid address!');
            }
            $.fn.blockstrap.core.apply_actions('contacts_new', function()
            {
                callback();
            });
        }
        else
        {
            if(!$.isPlainObject(address))   
            {
                addresses = {};
                addresses[blockchain] = [];
                addresses[blockchain].push(address);
            }
            if(name && fields)
            {
                var id = blockstrap_functions.slug(name);
                $.fn.blockstrap.data.find('contacts', id, function(contact)
                {
                    if(contact)
                    {
                        $.fn.blockstrap.core.loader('close');
                        if(!ignore_errors)
                        {
                            $.fn.blockstrap.core.modal('Warning', 'This contact already exists');
                        }
                    }
                    else 
                    {
                        var blockchains_to_save = [];
                        $.each(addresses, function(chain, obj)
                        {
                            var address = obj[0];
                            var blockchain = chain;
                            if(!$.fn.blockstrap.blockchains.supported(blockchain))
                            {
                                // NOTHING
                            }
                            else if(
                                $.fn.blockstrap.blockchains.which(address) != blockchain
                                &&
                                (
                                    blockchain == 'ltct'
                                    && $.fn.blockstrap.blockchains.which(address) != 'btct'
                                )
                            ){
                                var which = $.fn.blockstrap.blockchains.which(address);
                                if(which)
                                {
                                    var blockchains = $.fn.blockstrap.settings.blockchains;
                                    var blockchain_name = blockchains[which].blockchain;
                                    var blockchain_selected = blockchains[blockchain].blockchain;
                                    $.fn.blockstrap.core.loader('close');
                                    if(!ignore_errors)
                                    {
                                        $.fn.blockstrap.core.modal('Warning', 'This address does not match the blockchain you selected. You selected '+blockchain_name+' but the address you entered appears to be for '+blockchain_selected+'. This is not 100% accurate, and could be an internal problem.');
                                    }
                                    return false;
                                }
                            }
                            else if(
                                $.fn.blockstrap.blockchains.which(address) == blockchain
                                ||
                                (
                                    $.fn.blockstrap.blockchains.which(address) != blockchain
                                    && blockchain == 'ltct'
                                    && $.fn.blockstrap.blockchains.which(address) == 'btct'
                                )
                            ){
                                blockchains_to_save.push({
                                    code: blockchain,
                                    blockchain: $.fn.blockstrap.settings.blockchains[blockchain].blockchain,
                                    addresses: [
                                        {
                                            key: address
                                        }
                                    ]
                                });
                            }
                        });

                        var data = {};
                        if($.isPlainObject(fields))
                        {
                            $.each(fields, function(k, v)
                            {
                                if(v !== name && v !== address && v !== blockchain)
                                {
                                    data[k] = v;
                                }
                            });
                        };

                        var contact = {
                            id: id,
                            name: name,
                            blockchains: blockchains_to_save,
                            data: data,
                            tx_to: 0,
                            tx_from: 0
                        };
                        $.fn.blockstrap.data.save('contacts', id, contact, function()
                        {
                            $.fn.blockstrap.core.apply_actions('contacts_new', function()
                            {
                                callback(contact);
                            }, contact);
                        });
                    }
                });
            }
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {contacts:contacts});
})
(jQuery);

(function($) 
{
    var data = {};
    
    data.find = function(collection, key, callback)
    {
        if(localStorage && localStorage.getItem(data.item(collection, key)))
        {
            var obj = localStorage.getItem(data.item(collection, key));
            if(blockstrap_functions.json(obj)) obj = $.parseJSON(obj);
            callback(obj);
        }
        else
        {
            callback(false);
        }
    };
    
    data.item = function(collection, key)
    {
        return 'nw_' + collection + '_' + key;
    };
    
    data.option = function(key)
    {
        var value = false;
        var options = localStorage.getItem('nw_blockstrap_options');
        if(blockstrap_functions.json(options)) options = $.parseJSON(options);
        if(options)
        {
            $.each(options, function(k, v)
            {
                if(k == key) value = v;
            });
        }
        return value
    }
    
    data.save = function(collection, key, value, callback)
    {
        if(localStorage)
        {
            var simple = false;
            if(value === 'true' || value === 'false') simple = true;
            if(value === 'true') value = true;
            else if(value === 'false') value = false;
            var results = JSON.stringify(value);
            if(simple === true) results = value;
            localStorage.setItem(data.item(collection, key), results);
            callback(value);
        }
        else
        {
            callback(false);
        }
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {data:data});
})
(jQuery);

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
                            var account = $.fn.blockstrap.accounts.get(this_account.id, true);
                            account.blockchains = [];
                            if(typeof this_account.blockchains != 'undefined')
                            {
                                $.each(this_account.blockchains, function(chain, obj)
                                {
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
                if(account.txs && blockstrap_functions.array_length(account.txs) > 0)
                {
                    $.each(account.txs, function(k, transaction)
                    {
                        transaction.tx.address = transaction.address;
                        txs.push(transaction.tx);
                    });
                }
            });
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
                        this_account = $.fn.blockstrap.accounts.get(values.id, true);
                        if(
                            typeof this_account.blockchains != 'undefined'
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

(function($) 
{
    var forms = {};
    
    forms.add_blockchain = function(form, vars)
    {
        if(
            typeof vars.accountId != 'undefined'
            && typeof vars.defaultAddress != 'undefined'
            && typeof vars.defaultChain != 'undefined'
        ){
            var account = false;
            var new_chains = [];
            var account_id = vars.accountId;
            var default_address = vars.defaultAddress;
            var default_chain = vars.defaultChain;
            var new_chain = $(form).find('select#blockchain').val();
            var raw_accounts = $.fn.blockstrap.accounts.get(account_id, true);
            var current_chains = raw_accounts.blockchains;
            var available_chains = JSON.parse(JSON.stringify($.fn.blockstrap.settings.blockchains));
            delete available_chains.multi;
            if(
                typeof raw_accounts.blockchains != 'undefined'
                && typeof raw_accounts.blockchains[default_chain] != 'undefined'
            ){
                account = raw_accounts.blockchains[default_chain];
                account.id = raw_accounts.id;
                account.name = raw_accounts.name;
                account.password = raw_accounts.password;
            }
            var fields = [];
            if(new_chain == 'all')
            {
                $.each(current_chains, function(chain, obj)
                {
                    delete available_chains[chain];
                });
                $.each(available_chains, function(chain, obj)
                {
                    new_chains.push(chain);
                });
            }
            else
            {
                new_chains.push(new_chain);
            }
            $.fn.blockstrap.core.loader('open');
            $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
            {
                $.each(raw_accounts.keys, function(k, key)
                {
                    var input = $(form).find('#'+key);
                    var value = $(input).val();
                    var id = $(input).attr('id');
                    fields.push({
                        id: id,
                        value: value
                    });
                });
                $.fn.blockstrap.accounts.verify(account, fields, function(verified, keys)
                {
                    var title = 'Error';
                    var contents = 'Password mis-match!';
                    if(verified === true)
                    {
                        var private_key = keys.priv;
                        var address = keys.pub;
                        if(address == default_address)
                        {
                            $.fn.blockstrap.accounts.new(
                                new_chains, 
                                account.name, 
                                account.password, 
                                keys, 
                                function()
                                {
                                    $.fn.blockstrap.core.refresh(function()
                                    {
                                        $.fn.blockstrap.core.loader('close');
                                    }, $.fn.blockstrap.core.page());
                                }, 
                                raw_accounts
                            )
                        }
                        else
                        {
                            $.fn.blockstrap.core.loader('close');
                            $.fn.blockstrap.core.modal(title, contents);
                        }
                    }
                    else
                    {
                        $.fn.blockstrap.core.loader('close');
                        $.fn.blockstrap.core.modal(title, contents);
                    }
                })
            })
        }
    }
    
    forms.add_blockchain_contact = function(form, vars)
    {
        if(
            typeof vars.contactId != 'undefined'
        ){
            var contact_id = vars.contactId;
            var contact = $.fn.blockstrap.contacts.get(contact_id);
            var current_blockchains = JSON.parse(JSON.stringify(contact.blockchains));
            var current_blockchain_count = blockstrap_functions.array_length(JSON.parse(JSON.stringify(contact.blockchains)));
            var new_blockchains = current_blockchains;
            $(form).find('input').each(function(i)
            {
                var id = $(this).attr('id');
                var meta = id.split('_');
                var chain = meta[0];
                var address = $(this).val();
                var which = $.fn.blockstrap.blockchains.which(address);
                if(chain && address && which && (chain == which || (chain == 'ltct' && which == 'btct')))
                {
                    $.fn.blockstrap.core.loader('open');
                    new_blockchains.push({
                        blockchain: $.fn.blockstrap.settings.blockchains[chain].blockchain,
                        code: chain,
                        addresses: [
                            {
                                key: address
                            }
                        ]
                    });
                }
                else if(chain && address && which && which != chain)
                {
                    $.fn.blockstrap.core.modal('Warning', 'Address does not match blockchain');
                }
            });
            if(blockstrap_functions.array_length(new_blockchains) > current_blockchain_count)
            {
                contact.blockchains = new_blockchains;
                $.fn.blockstrap.data.save('contacts', contact_id, contact, function()
                {
                    $.fn.blockstrap.core.refresh(function()
                    {
                        $.fn.blockstrap.core.loader('close');
                        $.fn.blockstrap.core.modal('Success', 'Contact Updated');
                    }, $.fn.blockstrap.core.page());
                });
            }
        }
    }
    
    forms.get = function(callback)
    {
        if($.fn.blockstrap.snippets.forms)
        {
            return $.fn.blockstrap.snippets.forms;
        }
        else
        {
            return false;
        }
    }
    
    forms.input = function(options)
    {
        var defaults = {
            label: false,
            type: 'text'
        };
        var field = $.extend({}, defaults, options);
        var settings = {
            objects: [
                {
                    fields_only: true,
                    fields: [
                        {
                            inputs: field
                        }
                    ]
                }
            ]
        };
        return forms.process(settings);
    }
    
    forms.process = function(data, form)
    {
        if(!form) form = forms.get();
        var html = Mustache.render(form, data);
        return $.fn.blockstrap.templates.filter(html);
    }
    
    forms.settings_form = function(form, vars)
    {
        var avatar = false;
        var title = 'Success';
        var contents = 'Your settings have been updated';
        var api = $(form).find('#api_service').val();
        if($(form).find('#your_photo').attr('data-img'))
        {
            avatar = $(form).find('#your_photo').attr('data-img');
        }
        $.fn.blockstrap.data.find('blockstrap', 'options', function(options)
        {
            var update_api = false;
            var store_photo = false;
            var current_api = options.api_service;
            var current_photo = options.your_photo;
            var use_photo_in_salt = options.photo_salt;
            if(avatar != current_photo && use_photo_in_salt != true && use_photo_in_salt != 'true')
            {
                store_photo = true;
            }
            if(api != current_api)
            {
                update_api = true;
            }
            if(avatar == current_photo && api == current_api)
            {
                title = 'Warning';
                contents = 'There is nothing new to update';
            }
            else if(avatar != current_photo && !store_photo)
            {
                title = 'Warning';
                contents = 'You cannot update your avatar as it is being used as part of the salting process!';
            }
            if(update_api)
            {
                options.api_service = api;
            }
            if(store_photo)
            {
                options.your_photo = avatar;
                if($($.fn.blockstrap.element).find('#sidebar .avatar').length > 0)
                {
                    $($.fn.blockstrap.element).find('#sidebar .avatar').attr('src', avatar);
                }
            }
            if(update_api || store_photo)
            {
                $.fn.blockstrap.data.save('blockstrap', 'options', options, function()
                {

                });
            }
            $.fn.blockstrap.core.modal(title, contents);
        });
    }
    
    forms.sign_message = function(form, vars)
    {
        if(
            typeof vars.accountId != 'undefined'
            && typeof vars.chain != 'undefined'
        ){
            var account_id = vars.accountId;
            var chain = vars.chain;
            var message = $(form).find('#message').val();
            var account = $.fn.blockstrap.accounts.get(account_id, true);
            var this_account = account.blockchains[chain];
            var blockchain_key = $.fn.blockstrap.blockchains.key(chain);
            var blockchain_obj = bitcoin.networks[blockchain_key];
            var fields = [];
            $.each(account.keys, function(k, key)
            {
                var input = $(form).find('#'+key);
                var value = $(input).val();
                var id = $(input).attr('id');
                fields.push({
                    id: id,
                    value: value
                });
            });
            this_account.id = account.id;
            this_account.name = account.name;
            this_account.password = account.password;
            $.fn.blockstrap.accounts.verify(this_account, fields, function(verified, keys, raw_keys)
            {
                var title = 'Error';
                var contents = 'Credentials mis-match!';
                if(verified === true)
                {
                    var signature = bitcoin.Message.sign(raw_keys.privKey, message, blockchain_obj);
                    var msg = signature.toString('base64');
                    title = 'Success';
                    contents = '<p>Successfully encrypted message as follows:</p><pre><code>'+msg+'</code></pre>';
                }
                $.fn.blockstrap.core.modal(title, contents);
            });
        }
    }
    
    forms.switch_addresses = function(form, vars)
    {
        if(
            typeof vars.accountId != 'undefined'
            && typeof vars.chain != 'undefined'
        ){
            var account_id = vars.accountId;
            var chain = vars.chain;
            var transfer = $(form).find('#transfer-funds').val();
            var the_account = $.fn.blockstrap.accounts.get(account_id, true);
            var account = JSON.parse(JSON.stringify(the_account));
            // THIS IS FOR FORM TO PROCESS AFTER GETTING KEY ...?
            if(typeof account.addresses == 'undefined')
            {
                account.addresses = [{chains:{}}];
            }
            if(typeof account.addresses[0].chains[chain] == 'undefined')
            {
                account.addresses[0].chains[chain] = [];
            }
            var current_address = account.blockchains[chain].address;
            var old_address_count = blockstrap_functions.array_length(account.addresses[0].chains[chain]);
            account.addresses[0].chains[chain].push(account.blockchains[chain].address);
            var fields = [];
            $.each(account.keys, function(k, key)
            {
                var input = $(form).find('#'+key);
                var value = $(input).val();
                var id = $(input).attr('id');
                if(id == 'wallet_currency' && !value)
                {
                    value = chain;
                }
                fields.push({
                    id: id,
                    value: value
                });
            });
            var this_account = account.blockchains[chain];
            this_account.id = account.id;
            this_account.name = account.name;
            this_account.password = account.password;
            $.fn.blockstrap.accounts.verify(this_account, fields, function(verified, keys)
            {
                var title = 'Error';
                var contents = 'Password mis-match!';   
                if(verified === true)
                {
                    $.fn.blockstrap.core.loader('open');
                    $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
                    {
                        var key = '';
                        var original = false;
                        if($.isArray(fields))
                        {
                            if(typeof account.original != 'undefined')
                            {
                                original = account.original;
                            }
                            $.each(fields, function(k, v)
                            {
                                if(v.id == 'wallet_blockchain' && type == 'hd')
                                {
                                    v.value = [];
                                    var chains = $.fn.blockstrap.settings.blockchains;
                                    delete chains.multi;
                                    $.each(chains, function(chain, obj)
                                    {
                                        v.value.push(chain);
                                    });
                                }

                                // TODO: Remove this hardcoded hack?
                                if(v.id == 'wallet_currency' && original)
                                {
                                    v.value = original;
                                }
                                key_obj = CryptoJS.SHA3(salt+key+v.id+v.value, { outputLength: 512 });
                                key = key_obj.toString();
                            });
                        };
                        if(key)
                        {   
                            var keys = $.fn.blockstrap.blockchains.keys(
                                key+this_account.code, 
                                this_account.code, 
                                1
                            );
                            var keysv5 = $.fn.blockstrap.blockchains.keys(
                                key, 
                                this_account.code, 
                                1
                            );
                            if(old_address_count > 0)
                            {
                                keys = $.fn.blockstrap.blockchains.keys(
                                    key+this_account.code, 
                                    this_account.code, 
                                    1,
                                    [old_address_count]
                                );
                            }
                            if(
                                keys.pub === this_account.address
                                || keysv5.pub === this_account.address
                            ){
                                if(keysv5.pub === this_account.address)
                                {
                                    keys = keysv5;
                                }
                                $.fn.blockstrap.api.balance(
                                    current_address, 
                                    chain, 
                                    function(balance)
                                    {
                                        var now = new Date().getTime();
                                        var fee = $.fn.blockstrap.settings.blockchains[this_account.code].fee;
                                        var next_key = $.fn.blockstrap.blockchains.keys(
                                            key+this_account.code, 
                                            this_account.code, 
                                            1,
                                            [blockstrap_functions.array_length(
                                                account.addresses[0].chains[this_account.code]
                                            )]
                                        );
                                        account.blockchains[this_account.code].address = next_key.pub;
                                        account.blockchains[this_account.code].balance = 0;
                                        account.blockchains[this_account.code].tx_count = 0;
                                        account.blockchains[this_account.code].txs = {};
                                        account.blockchains[this_account.code].ts = now;
                                        account.blockchains[this_account.code].display_balance = "0.00000000";
                                        if(balance > fee && transfer != 'no')
                                        {
                                            $.fn.blockstrap.api.unspents(current_address, chain, function(unspents)
                                            {
                                                if($.isArray(unspents) && blockstrap_functions.array_length(unspents) > 0)
                                                {
                                                    var total = 0;
                                                    var inputs = [];
                                                    var fee = $.fn.blockstrap.settings.blockchains[chain].fee * 100000000;

                                                    $.each(unspents, function(k, unspent)
                                                    {
                                                        inputs.push({
                                                            txid: unspent.txid,
                                                            n: unspent.index,
                                                            script: unspent.script,
                                                            value: unspent.value,
                                                        });
                                                        total = total + unspent.value
                                                    });

                                                    var amount_to_send = total - fee;
                                                    
                                                    var outputs = [{
                                                        address: next_key.pub,
                                                        value: amount_to_send
                                                    }];

                                                    var raw_tx = $.fn.blockstrap.blockchains.raw(
                                                        next_key.pub,
                                                        keys.priv,
                                                        inputs,
                                                        outputs,
                                                        fee,
                                                        amount_to_send
                                                    );

                                                    $.fn.blockstrap.api.relay(raw_tx, chain, function(results)
                                                    {
                                                        if(typeof results.txid != 'undefined')
                                                        {
                                                            setTimeout(function()
                                                            { 
                                                                $.fn.blockstrap.data.save('accounts', account.id, account, function(account)
                                                                {
                                                                    $.fn.blockstrap.accounts.update(
                                                                        account, 
                                                                        function(results)
                                                                        {
                                                                            $.fn.blockstrap.core.refresh(
                                                                                function()
                                                                                {
                                                                                    $.fn.blockstrap.core.loader('close');
                                                                                }, 
                                                                                $.fn.blockstrap.core.page()
                                                                            );
                                                                        }, 
                                                                        true, 
                                                                        0, 
                                                                        account.code
                                                                    );
                                                                });
                                                            }, 5000);
                                                        }
                                                        else
                                                        {
                                                            var title = 'Error';
                                                            var contents = 'Unable to relay raw transaction';
                                                            $.fn.blockstrap.core.loader('close');
                                                            $.fn.blockstrap.core.modal(title, contents);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else
                                        {
                                            $.fn.blockstrap.data.save('accounts', account.id, account, function(account)
                                            {
                                                $.fn.blockstrap.accounts.update(
                                                    account, 
                                                    function(results)
                                                    {
                                                        $.fn.blockstrap.core.refresh(
                                                            function()
                                                            {
                                                                $.fn.blockstrap.core.loader('close');
                                                            },
                                                            $.fn.blockstrap.core.page()
                                                        );
                                                    }, 
                                                    true, 
                                                    0, 
                                                    chain
                                                );
                                            });
                                        }
                                    }
                                );
                            }
                            else
                            {
                                var title = 'Warning';
                                var contents = 'Unable to re-verify ownership';
                                $.fn.blockstrap.core.loader('close');
                                $.fn.blockstrap.core.modal(title, contents);
                            }
                        }
                    })
                }
                else
                {
                    var title = 'Warning';
                    var contents = 'Unable to verify ownership';
                    $.fn.blockstrap.core.loader('close');
                    $.fn.blockstrap.core.modal(title, contents);
                }
            });
        }
    }
    
    forms.verify_message = function(form, vars)
    {
        var address = $(form).find('#address').val();
        var chain = $(form).find('#chain').val();
        var signature = $(form).find('#signature').val();
        var message = $(form).find('#message').val();
        var title = 'Warning';
        var contents = 'All four fields required';
        if(address && chain && message && signature)
        {
            var blockchain_key = $.fn.blockstrap.blockchains.key(chain);
            var blockchain_obj = bitcoin.networks[blockchain_key];
            var verification = bitcoin.Message.verify(address, signature, message, blockchain_obj);
            if(verification === true)
            {
                title = 'Success';
                contents = 'The signature matches the address';
            }
            else
            {
                contents = 'The signature does not match the address and (or) message';
            }
        }
        $.fn.blockstrap.core.modal(title, contents);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {forms:forms});
})
(jQuery);

(function($) 
{
    var html = {};
    
    html.form = function()
    {
        return '{{#objects}}{{^fields_only}}<form id="{{id}}" class="{{css}}">{{/fields_only}}{{#fields}}<div class="form-group {{css}}">{{#inputs}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<input type="{{type}}" id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" value="{{value}}" autocomplete="off"{{#attributes}} {{key}}="{{value}}"{{/attributes}} />{{#icon}}{{#href}}<a id="{{id}}" class="{{css}}" href="{{href}}" {{#attributes}}{{key}}="{{value}}"{{/attributes}}>{{/href}}{{#glyph}}<span class="glyphicon glyphicon-{{glyph}}"></span>{{/glyph}}{{#href}}</a>{{/href}}{{/icon}}{{#wrapper.css}}</div>{{/wrapper.css}}{{/inputs}}{{#areas}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<textarea id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" style="{{style}}">{{value}}</textarea>{{#wrapper.css}}</div>{{/wrapper.css}}{{/areas}}{{#selects}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<select id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" autocomplete="off"{{#attributes}} {{key}}="{{value}}"{{/attributes}}>{{#values}}<option value="{{value}}">{{text}}</option>{{/values}}</select>{{#wrapper.css}}</div>{{/wrapper.css}}{{/selects}}</div>{{/fields}}{{#buttons}}<div class="actions">{{#forms}}<button type="{{type}}" id="{{id}}" class="btn {{css}}" {{#attributes}}{{key}}="{{value}}"{{/attributes}}>{{text}}</button>{{/forms}}</div>{{/buttons}}{{^fields_only}}</form>{{/fields_only}}{{/objects}}';
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {html:html});
})
(jQuery);

(function($) 
{   
    var multisig = {};
    
    multisig.address = function(seed, chain, keys, required)
    {
        var key_pairs = multisig.generate(seed, chain, keys, required);
        var index = blockstrap_functions.array_length(key_pairs) - 1;
        if(typeof key_pairs[index].address != 'undefined') return key_pairs[index].address;
        else return false;
    }
    
    multisig.decode = function(script, chain)
    {
        var keys = [];
        var script = bitcoin.Script.fromHex(script);
        var blockchain_key = $.fn.blockstrap.blockchains.key(chain);
        var blockchain_obj = bitcoin.networks[blockchain_key];
        var chunks = script.chunks;
        chunks = chunks.slice(1, blockstrap_functions.array_length(chunks) - 2);
        $.each(chunks, function(k, key)
        {
            keys.push({
                address: bitcoin.ECPubKey.fromBuffer(key).getAddress(blockchain_obj).toString(),
                key: bitcoin.ECPubKey.fromBuffer(key).toHex()
            });
        });
        return keys;
    }
    
    multisig.generate = function(seed, chain, keys, required)
    {
        if(typeof keys == 'undefined')
        {
            keys = 3;
        }
        if(typeof required == 'undefined' || !parseInt(required))
        {
            required = 2;
        }
        if(typeof seed == 'undefined' || !seed && typeof keys == 'number')
        {
            hashed_seed = CryptoJS.SHA3(navigator.userAgent + Date.now(), { outputLength: 512 }).toString();
            seed = CryptoJS.SHA3(hashed_seed, { outputLength: 512 }).toString();
        }
        else if(typeof keys == 'number')
        {
            seed = CryptoJS.SHA3(seed, { outputLength: 512 }).toString();
            hashed_seed = seed;
        }
        if(typeof chain == 'undefined' || !chain)
        {
            var chain = 'btc';
        }
        var address = false;
        var key_pairs = keys;
        var lib = $.fn.blockstrap.settings.blockchains[chain].lib;
        if(typeof keys == 'number')
        {
            key_pairs = $.fn.blockstrap.blockchains.keys(seed, chain, keys);
        }
        if($.isArray(key_pairs))
        {
            var keys = [];
            $.each(key_pairs, function(k, obj)
            {
                var key = bitcoin.ECPubKey.fromHex(obj.hex);
                keys.push(key);
            });
            var redeem_script = bitcoin.scripts.multisigOutput(required, keys); // 2 of 3
            var script_pub_key = bitcoin.scripts.scriptHashOutput(redeem_script.getHash());
            var lib = $.fn.blockstrap.settings.blockchains[chain].lib;
            address = bitcoin.Address.fromOutputScript(script_pub_key, bitcoin.networks[lib]).toString();
            key_pairs.push({
                seed: hashed_seed,
                script: redeem_script.toHex(),
                address: address
            });
            return key_pairs;
        }
        else
        {
            return false;
        }
    }
    
    multisig.publicize = function(keys)
    {
        var public_keys = [];
        if($.isArray(keys))
        {
            $.each(keys, function(k, key)
            {
                public_keys.push(bitcoin.ECPubKey.fromHex(key));
            });
        }
        return public_keys;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {multisig:multisig});
})
(jQuery);

(function($) 
{
    var security = {};
    
    security.logged_in = function()
    {
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(login_status))
        {
            login_status = $.parseJSON(login_status);
            if(login_status.logged_in && login_status.logged_in === true) return true;
            else return false;
        }
        else
        {
            return true;
        }
    }
    
    security.login = function(username, password, callback)
    {
        var now = new Date().getTime();
        var un = blockstrap_functions.slug(username);
        var salt = localStorage.getItem('nw_blockstrap_salt');
        var pw = CryptoJS.SHA3(password, { outputLength: 512 }).toString();
        var check = localStorage.getItem('nw_keys_your_password');
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(check))
        {
            check = $.parseJSON(check);
        }
        if(!blockstrap_functions.json(login_status))
        {
            if(check === pw)
            {
                login_status = {};
                login_status.username = un;
                login_status.password = pw;
                login_status = JSON.stringify(login_status);
            }
        }
        if(blockstrap_functions.json(login_status))
        {
            login_status = $.parseJSON(login_status);
            if(
                typeof login_status.username == 'undefined'
                && typeof login_status.password == 'undefined'
                && check === pw
            ){
                login_status.username = un;
                login_status.password = pw;
            }
            if(login_status.username === un && login_status.password === pw)
            {
                if(login_status.logged_in !== true)
                {
                    login_status.ts = now;
                    login_status.logged_in = true;
                    localStorage.setItem('nw_blockstrap_login', JSON.stringify(login_status));
                }
                if(callback) callback();
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Invalid Credentials');
            }
        }
        else
        {
            $.fn.blockstrap.core.modal('Error', 'Unacceptable Credentials');
        }
    }
    
    security.logout = function()
    {
        var now = new Date().getTime();
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(!blockstrap_functions.json(login_status))
        {
            login_status = {};
        }
        else
        {
            login_status = $.parseJSON(login_status);
        }
        login_status.ts = now;
        login_status.logged_in = false;
        localStorage.setItem('nw_blockstrap_login', JSON.stringify(login_status));
        location.reload();
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {security:security});
})
(jQuery);

(function($) 
{
    var styles = {};
    
    styles.element = function(key)
    {
        var map = styles.map('elements');
        var element = '#' + $.fn.blockstrap.settings.id + ' ' + map[key];
        return element;
    };
    
    styles.map = function(type)
    {
        return $.fn.blockstrap.settings.styles[type];
    }
    
    styles.rule = function(key, value)
    {
        var map = styles.map('rules');
        var rule = map[key] + ': ' + value;
        return rule;
    };
    
    styles.set = function(id, index)
    {
        if(!index) index = 0;
        if(!id) id = 'blockstrap-styles';

        var style = document.createElement('style');
        style.id = id;
        style.setAttribute("type", "text/css");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);
        var tag = document.getElementById(id);
        var sheet = tag.sheet ? tag.sheet : tag.styleSheet;
        var styles = $.fn.blockstrap.settings.styles.vars;
        if($.isPlainObject(styles))
        {
            $.each(styles, function(k, v)
            {
                var rule = $.fn.blockstrap.styles.rule(k, v);
                var element = $.fn.blockstrap.styles.element(k);
                if(sheet.insertRule) 
                {
                    sheet.insertRule(element + ' { ' + rule + ' !important }', index);
                    index++
                }
                else 
                {
                    sheet.addRule(element, rule, index);
                    index++
                }                        
            });
        }
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {styles:styles});
})
(jQuery);

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
            // ADDRESS INFO
            var add_blockchain = 'Bitcoin';
            blockstrap_functions.vars(); // TODO: NEED TO REFRESH THIS :-(
            var key = blockstrap_functions.vars('key');
            var from = blockstrap_functions.vars('from');
            var chain = blockstrap_functions.vars('chain');
            if(parseInt(blockstrap_functions.vars('amount')) > 0)
            {
                amount = parseFloat(parseInt(blockstrap_functions.vars('amount')) / 100000000).toFixed(8);
            }
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
                'vars.from',
                'vars.chain',
                'vars.amount',
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
                from,
                chain,
                amount,
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
            if(typeof data.status == 'undefined' || (data.status != 404 && data.status != 0))
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

(function($) 
{
    var widgets = {};   
    var polls = {};

    widgets.accounts = function()
    {
        $('body').on('click', '.bs-account-remove', function(e)
        {
            e.preventDefault();
            var button = this;
            var id = $(button).attr('data-id');
            localStorage.removeItem('nw_accounts_' + id);
            $('#wrapper-'+id).hide(350, function(e)
            {
                $(this).remove();
            });
        });
        $('body').on('click', '.bs-account-key', function(e)
        {
            e.preventDefault();
            var button = this;
            var name = $(button).attr('data-name');
            var address = $(button).attr('data-address');
            var app_salt = $(button).attr('data-salt');
            var chain = $(button).attr('data-chain');
            var data = {
                objects: [
                    {
                        id: 'bs-access-account',
                        fields: [
                            {
                                inputs: [
                                    {
                                        type: 'password',
                                        id: 'password',
                                        placeholder: 'Enter your password here'
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'name',
                                        value: name
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'address',
                                        value: address
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'salt',
                                        value: app_salt
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'chain',
                                        value: chain
                                    }
                                ]
                            }
                        ],
                        buttons: {
                            forms: {
                                type: 'submit',
                                css: 'btn-success',
                                text: 'Access Keys'
                            }
                        }
                    }
                ]               
            };
            var form = widgets.form(data);
            $.fn.blockstrap.core.modal('Confirm Ownership', form);
        });
        $('body').on('click', '.bs-account-send', function(e)
        {
            e.preventDefault();
            var button = this;
            var name = $(button).attr('data-name');
            var address = $(button).attr('data-address');
            var app_salt = $(button).attr('data-salt');
            var chain = $(button).attr('data-chain');
            var data = {
                objects: [
                    {
                        id: 'bs-account-send',
                        fields: [
                            {
                                inputs: [
                                    {
                                        type: 'text',
                                        id: 'send_to',
                                        placeholder: 'Which address to send the coins to?'
                                    },
                                    {
                                        type: 'text',
                                        id: 'send_amount',
                                        placeholder: 'How much to send them?'
                                    },
                                    {
                                        type: 'password',
                                        id: 'password',
                                        placeholder: 'Enter your password here'
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'name',
                                        value: name
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'address',
                                        value: address
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'salt',
                                        value: app_salt
                                    },
                                    {
                                        type: 'hidden',
                                        id: 'chain',
                                        value: chain
                                    }
                                ]
                            }
                        ],
                        buttons: {
                            forms: {
                                type: 'submit',
                                css: 'btn-success',
                                text: 'Send Coins'
                            }
                        }
                    }
                ]               
            };
            var form = widgets.form(data);
            $.fn.blockstrap.core.modal('Send Coins', form);
        });
        $('body').on('submit', '#bs-access-account', function(e)
        {
            e.preventDefault();
            var form = this;
            var pw = $(form).find('input#password').val();
            var name = $(form).find('input#name').val();
            var address = $(form).find('input#address').val();
            var app_salt = $(form).find('input#salt').val();
            var chain = $(form).find('input#chain').val();
            var salt = $.parseJSON(localStorage.getItem('nw_blockstrap_salt'));
            var object_salt = CryptoJS.SHA3(app_salt + salt, { outputLength: 512 }).toString();
            var seed = CryptoJS.SHA3(object_salt + name + pw, { outputLength: 512 }).toString();
            var keys = $.fn.blockstrap.blockchains.keys(seed+chain, chain);
            var title = 'Error';
            var contents = 'Incorrect credentials';
            if(keys.pub == address)
            {
                title = 'Recover Keys';
                contents = widgets.html('keys', keys);
            }
            $.fn.blockstrap.core.modal(title, contents);
            widgets.qr();
        });
        $('body').on('submit', '#bs-account-send', function(e)
        {
            e.preventDefault();
            var form = this;
            var pw = $(form).find('input#password').val();
            var name = $(form).find('input#name').val();
            var address = $(form).find('input#address').val();
            var app_salt = $(form).find('input#salt').val();
            var chain = $(form).find('input#chain').val();
            var send_to = $(form).find('input#send_to').val();
            var send_amount = $(form).find('input#send_amount').val();
            var salt = $.parseJSON(localStorage.getItem('nw_blockstrap_salt'));
            var object_salt = CryptoJS.SHA3(app_salt + salt, { outputLength: 512 }).toString();
            var seed = CryptoJS.SHA3(object_salt + name + pw, { outputLength: 512 }).toString();
            var keys = $.fn.blockstrap.blockchains.keys(seed+chain, chain);
            var title = 'Error';
            var contents = 'Incorrect credentials';
            if(keys.pub == address)
            {
                var contents = 'Insufficient funds for sending.';
                $.fn.blockstrap.api.unspents(keys.pub, chain, function(unspents)
                {
                    if($.isArray(unspents) && blockstrap_functions.array_length(unspents) > 0)
                    {
                        var total = 0;
                        var inputs = [];
                        var fee = $.fn.blockstrap.settings.blockchains[chain].fee * 100000000;
                        var amount = parseFloat(send_amount * 100000000);

                        $.each(unspents, function(k, unspent)
                        {
                            if(total < amount + fee)
                            {
                                inputs.push({
                                    txid: unspent.txid,
                                    n: unspent.index,
                                    script: unspent.script,
                                    value: unspent.value,
                                });
                                total = total + unspent.value;
                            }
                        });

                        var outputs = [{
                            address: send_to,
                            value: amount
                        }];

                        var amount_to_send_back = total - fee;

                        var raw_tx = $.fn.blockstrap.blockchains.raw(
                            keys.pub,
                            keys.priv,
                            inputs,
                            outputs,
                            fee,
                            amount
                        );

                        $.fn.blockstrap.api.relay(raw_tx, chain, function(results)
                        {
                            var title = 'Error';
                            var contents = 'Unable to relay transaction.';
                            if(typeof results.txid != 'undefined' && results.txid)
                            {
                                title = 'Success';
                                var url = 'http://api.blockstrap.com/v0/'+chain+'/transaction/id/'+results.txid;
                                contents = 'Your <a href="'+url+'">transaction</a> has been relayed.';
                                $.fn.blockstrap.core.modal(title, contents);
                            }
                            else
                            {
                                $.fn.blockstrap.core.modal(title, contents);
                            }
                        });
                    }
                    else
                    {
                        $.fn.blockstrap.core.modal(title, contents);
                    }
                });
            }
            else
            {
                $.fn.blockstrap.core.modal(title, contents);
            }
        });
        $('body').on('click', '.bs-accounts-modal', function(e)
        {
            e.preventDefault();
            var button = this;
            var all = $(button).attr('data-all');
            var app_salt = $(button).attr('data-salt');
            var title = 'Error';
            var default_contents = 'You do not have any accouunts saved in localStorage yet.';
            var contents = default_contents;
            var accounts = $.fn.blockstrap.accounts.get(false, true, true);
            
            if(all && all == 'true') all = true;
            else all = false;
            
            if($.isArray(accounts))
            {
                $.each(accounts, function(k, account)
                {
                    if(typeof account.keys != 'undefined' && (account.keys == false || all == true))
                    {
                        if(contents == default_contents)
                        {
                            contents = '<p>These are the accounts currently stored within your browser:</p>';
                            title = 'Current Accounts';
                        }
                        $.each(account.blockchains, function(chain, obj)
                        {
                            var blockchain = $.fn.blockstrap.settings.blockchains[chain].blockchain;
                            var key_button = '<a href="#" class="btn btn-primary bs-account-key btn-xs" data-name="'+obj.name+'" data-address="'+obj.address+'" data-chain="'+chain+'" data-salt="'+app_salt+'">Keys</a>';
                            var send_button = '<a href="#" class="btn btn-success bs-account-send btn-xs" data-name="'+obj.name+'" data-address="'+obj.address+'" data-chain="'+chain+'" data-salt="'+app_salt+'">Send</a>';
                            var remove_button = '<a href="#" class="btn btn-danger bs-account-remove btn-xs" data-id="'+blockstrap_functions.slug(obj.name)+'">Remove</a>';
                            var buttons = key_button + ' ' + send_button + ' ' + remove_button;
                            contents+= '<div id="wrapper-'+blockstrap_functions.slug(obj.name)+'">';
                            contents+= '<p><hr><strong>'+obj.name+'</strong> ('+blockchain+')<br /><br />'+buttons+'</p>';
                            contents+= '<p class="small"><strong>Address</strong>: '+obj.address+'</p>';
                            contents+= '<p><strong>TXs</strong>: <span class="bs-txs">'+obj.tx_count+'</span> | <strong>Balance</strong>: <span class="bs-balance">'+parseFloat(obj.balance / 100000000).toFixed(8)+'</span></p>';
                            contents+= '</div>';
                            widgets.update('accounts', account, function()
                            {
                                widgets.poll(60, 'acc_' + blockstrap_functions.slug(obj.name), function()
                                {
                                    widgets.update('accounts', account, false, 0, chain);
                                }, true);
                            }, 0, chain);
                        });
                    }
                });
            }
            $.fn.blockstrap.core.modal(title, contents);
        });
    }
    
    widgets.addresses = function()
    {
        $('body').on('click', '.bs-check-address', function(e)
        {
            e.preventDefault();
            var button = this;
            var bs = $.fn.blockstrap;
            var chain = $(button).attr('data-chain');
            var address = $(button).attr('data-address');
            var element = false;
            if($(button).attr('data-element'))
            {
                element = $('#'+$(button).attr('data-element'));
            }
            var blockchain = bs.settings.blockchains[chain].blockchain;
            if(chain && address)
            {
                bs.api.address(address, chain, function(results)
                {
                    var title = 'Unsued Address';
                    var content = 'This address has not yet been used.';
                    if(
                        typeof results.balance != 'undefined'
                        && typeof results.tx_count != 'undefined'
                        && results.tx_count > 0
                    ){
                        title = 'Existing Address';
                        var word = 'transactions';
                        if(results.tx_count = 1) word = 'transaction';
                        content = 'This address has '+results.tx_count+' transactions with a balance of '+parseInt(results.balance / 100000000).toFied(8)+ ' ' + blockchain;
                    }
                    if(element) 
                    {
                        $(element).find('.alert').text(content).show(350);
                        $(element).show(350);
                    }
                    else bs.core.modal(title, content);
                });
            }
        });
    }
    
    widgets.donate = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var chain = $(button).attr('data-chain');
        var address = $(button).attr('data-address');
        var qr = $(button).attr('data-qr');
        var bip = $(button).attr('data-bip');
        var label = $(button).attr('data-label');
        var amount = parseFloat($(button).attr('data-amount')).toFixed(8);
        var title = 'Error';
        var content = 'Missing required data attributes!';
        if(qr == 'true') qr = true;
        else qr = false;
        if(bip == 'true') bip = true;
        else bip = false;
        if(chain && address)
        {
            var blockchain = bs.settings.blockchains[chain].blockchain;
            title = 'Send ' + blockchain + ' to ' + address;
            if(amount && amount > 0)
            {
                title = 'Send ' + amount + ' ' + blockchain + ' to ' + address;
            }
        }
        if(qr || bip && chain && address)
        {
            if(qr && bip)
            {
                if(chain == 'doget') chain = 'doge';
                else if(chain == 'dasht') chain = 'dash';
                else if(chain == 'btct') chain = 'btc';
                else if(chain == 'ltct') chain = 'ltc';
                var qr = widgets.html('qr', {content:address});
                var bip_chain = bs.settings.blockchains[chain].lib;
                var bip_url = bip_chain + ':' + address +  '';
                if(amount && amount > 0) bip_url+= '?amount=' + amount;
                if(label)
                {
                    if(amount > 0 && label) bip_url+= '&';
                    else bip_url+= '?';
                    bip_url+= 'label='+label;
                }
                var bip = '<a href="'+bip_url+'" class="btn btn-success btn-block">Desktop QT</a>';
                content = qr + '<p class="clearfix"></p>' + bip;
            }
            else if(qr)
            {
                var qr = widgets.html('qr', {content:address});
                content = qr;
            }
            else if(bip)
            {
                var bip = 'And then?';
                content = bip;
            }
        }
        bs.core.modal(title, content);
        if(qr)
        {
            widgets.qr();
        }
    }
    
    widgets.donations = function()
    {
        $('body').on('click', '.bs-donate', function(e)
        {
            widgets.donate(this, e);
        });
        $('.bs-donate').each(function(i)
        {
            var button = this;
            var address = $(button).attr('data-address');
            var chain = $(button).attr('data-chain');
            var group = $(button).attr('data-group');
            var balance = $(button).attr('data-balance');
            var txs = $(button).attr('data-txs');
            var loading = $(button).attr('data-loading');
            var inject = $(button).attr('data-inject');
            if(balance == 'true') balance = true;
            else balance = false;
            if(txs == 'true') txs = true;
            else txs = false;
            if(inject == 'true') inject = true;
            else inject = false;
            if(chain && address)
            {
                if(inject && $('#default-modal').length < 1)
                {
                    var modal = widgets.html('modal');
                    $('body').append(modal);
                }
                if(group)
                {
                    // UPDATE RELEVANT LABELS
                    if(balance || txs)
                    {
                        if(loading)
                        {
                            $('.'+group+'-balance-'+address).addClass('loading').text(loading);
                            $('.'+group+'-txs-'+address).addClass('loading').text(loading);
                        }
                        $.fn.blockstrap.api.address(address, chain, function(results)
                        {
                            if(typeof results.balance != 'undefined' && balance)
                            {
                                $('.'+group+'-balance-'+address).text(parseInt(results.balance / 100000000).toFixed(8));
                            }
                            if(typeof results.tx_count != 'undefined' && txs)
                            {
                                $('.'+group+'-txs-'+address).text(results.tx_count);
                            }
                        });
                    }
                }
            }
        });
    }
    
    widgets.form = function(data)
    {
        var template = $.fn.blockstrap.html.form();
        var html = Mustache.render(template, data);
        return html;
    }
    
    widgets.generate = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var chain = $(button).attr('data-chain');
        var salt = $(button).attr('data-salt');
        var random = $(button).attr('data-random');
        var callback = $(button).attr('data-callback');
        var print = $(button).attr('data-print');
        var save = $(button).attr('data-save');
        var more = $(button).attr('data-more');
        var check = $(button).attr('data-check');
        var deterministic = $(button).attr('data-deterministic');
        var title = 'Warning';
        var content = 'No object salt set on element!';
        if(deterministic == 'false') deterministic = false;
        else deterministic = true;
        if(random == 'false') random = false;
        else random = true;
        if(print == 'false') print = false;
        else print = true;
        if(save == 'false') save = false;
        else save = true;
        if(more == 'false') more = false;
        else more = true;
        if(check == 'false') check = false;
        else check = true;
        if(chain && salt)
        {
            var blockchain = bs.settings.blockchains[chain].blockchain;
            title = 'Generate Keys for ' + blockchain + ' Blockchain';
            content = widgets.html('new_account', {chain: chain, deterministic: deterministic, random: random, callback: callback, print: print, save: save, more: more, check: check, salt: salt});
        }
        else if(!chain)
        {
            content = 'No specific blockchain selected';
        }
        bs.core.modal(title, content);
    }
    
    widgets.generations = function()
    {
        $('body').on('click', '.bs-generate', function(e)
        {
            widgets.generate(this, e);
        });
        $('body').on('submit', '#setup-deterministic-salt', function(e)
        {
            e.preventDefault();
            var form = this;
            var keys = {};
            var inputs = $(form).find('input');
            $.each(inputs, function(i)
            {
                var input = this;
                var id = $(input).attr('id');
                var value = $(input).val();
                if(id == 'your_password_repeat')
                {
                    
                }
                else
                {
                    keys[id] = value;
                }
            });
            $.fn.blockstrap.core.salt(keys, function(salt, keys)
            {
                $.fn.blockstrap.data.save('blockstrap', 'salt', salt, function()
                {
                    window.location.reload();
                });
            }, $.fn.blockstrap.settings.id);
        });
        $('body').on('submit', '.bs-new-account', function(e)
        {
            e.preventDefault();
            var form = this;
            var bs = $.fn.blockstrap;
            var button = $(form).find('button[type="submit"]');
            var chain = $(form).attr('data-chain');
            var app_salt = $(form).attr('data-salt');
            var callback = $(form).attr('data-callback');
            var print = $(form).attr('data-print');
            var save = $(form).attr('data-save');
            var more = $(form).attr('data-more');
            var check = $(form).attr('data-check');
            var name = $(form).find('input[name="name"]').val();
            var salt = $(form).find('input[name="salt"]').val();
            var pass = $(form).find('input[name="pass"]').val();
            var password = $(form).find('input[name="password"]').val();
            var title = 'Warning';
            var content = 'All form fields required!';
            if(!callback) callback = 'bs_default_generate_callback';
            if(save && save == 'false') save = false;
            else save = true;
            if(print && print == 'false') print = false;
            else print = true;
            if(chain && name && salt && pass && password)
            {
                if(pass != password)
                {
                    content = 'Password miss-match!';
                    bs.core.modal(title, content);
                }
                else
                {
                    $(button).addClass('loading');
                    var object_salt = CryptoJS.SHA3(app_salt + salt, { outputLength: 512 }).toString();
                    var seed = CryptoJS.SHA3(object_salt + name + pass, { outputLength: 512 }).toString();
                    var keys = bs.blockchains.keys(seed+chain, chain);
                    var fn = window[callback];
                    if(typeof fn == 'function')
                    {
                        fn(keys, chain, object_salt, seed, button, print, save, more, check, name, password, salt);
                    }
                }
            }
            else
            {
                bs.core.modal(title, content);
            }
        });
        $('body').on('click', '.bs-print-keys', function(e)
        {
            e.preventDefault();
            var modal = $('#default-modal');
            var title = 'Keys-'+ Date.now();
            var contents = $(modal).find('.modal-body').html();
            $.fn.blockstrap.core.print(title, contents);
        });
        $('body').on('click', '.bs-save-keys', function(e)
        {
            e.preventDefault();
            var button = this;
            var chain = $(button).attr('data-chain');
            var name = $(button).attr('data-name');
            var password = $(button).attr('data-password');
            var final_seed = $(button).attr('data-seed');
            var set_salt = $(button).attr('data-salt');
            var salt = localStorage.getItem('nw_blockstrap_salt');
            if(blockstrap_functions.json(salt))
            {
                salt = $.parseJSON(salt);
            }
            else
            {
                localStorage.setItem('nw_blockstrap_salt', JSON.stringify(set_salt));
            }
            $.fn.blockstrap.accounts.new(chain, name, password, final_seed, function(account)
            {
                var title = 'Error';
                var contents = 'Unable to save generated address to localStorage';
                if(typeof account.name != 'undefined')
                {
                    title = 'Successfully Saved to LocalStorage';
                    contents = '<p>We have saved '+account.name+' to localStorage, you will need the <strong>final_seed</strong> in order to re-use this account elsewhere. The final seed is:</p><pre><code>'+final_seed+'</code></pre><p><span class="alert alert-danger alert-block">LOSS OF THIS SEED COULD RESULT IN LOSS OF CONTROL</span></p>';
                }
                $.fn.blockstrap.core.modal(title, contents);
            });
        });
        $('body').on('click', '.bs-generate-user-salt', function(e)
        {
            e.preventDefault();
            var button = this;
            var random = false;
            if($(button).hasClass('random')) random = true;
            if(random)
            {
                var random_number = Math.random() * (999 - 1) + 999;
                var ts = Date.now();
                var random_time = random_number * ts;
                var ua = navigator.userAgent;
                var hash = CryptoJS.SHA3(random_number + ts + random_time + ua, { outputLength: 512 }).toString();
                $(button).parent().parent().find('input').val(hash);
                $(button).parent().find('.bs-generate-user-salt').hide(350);
            }
            else
            {
                var data = {
                    objects: [
                        {
                            id: 'setup-deterministic-salt',
                            fields: [
                                {
                                    inputs: [
                                        {
                                            type: 'text',
                                            id: 'your_name',
                                            placeholder: 'Your full name'
                                        },
                                        {
                                            type: 'text',
                                            id: 'your_username',
                                            placeholder: 'A memorable username'
                                        },
                                        {
                                            type: 'password',
                                            id: 'your_password',
                                            placeholder: 'Your password - cannot be changed or recovered later'
                                        },
                                        {
                                            type: 'password',
                                            id: 'your_password_repeat',
                                            placeholder: 'Please repeat your password'
                                        },
                                        {
                                            type: 'text',
                                            id: 'your_dob',
                                            placeholder: 'Your date of birth DD_MM_YYYY'
                                        },
                                        {
                                            type: 'text',
                                            id: 'your_city',
                                            placeholder: 'Your city of birth'
                                        },
                                        {
                                            type: 'text',
                                            id: 'app_url',
                                            placeholder: 'Place you want to create salt from',
                                            value: window.location.href
                                        }
                                    ]
                                }
                            ],
                            buttons: {
                                forms: {
                                    type: 'submit',
                                    css: 'btn-success',
                                    text: 'Create Salt'
                                }
                            }
                        }
                    ]               
                };
                var form = widgets.form(data);
                var intro = '<p>We first need to generate a personal salt for you using the form below:</p>';
                $.fn.blockstrap.core.modal('Generate Personal Salt', intro + form);
            }
        });
    }
    
    widgets.html = function(type, options)
    {
        if(type == 'modal')
        {
            var id = 'default-modal';
            if(typeof options.id != 'undefined')
            {
                id = options.id;
            }
            return '<div id="'+id+'" class="modal fade" style="display: none;" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><h4 class="modal-title"></h4></div><div class="modal-body no-footer"></div></div></div></div>';
        }
        else if(type == 'keys')
        {
            if(typeof options.pub != 'undefined' && typeof options.priv != 'undefined')
            {
                return '<div class="row"><div class="col-sm-6"><span class="alert alert-success alert-block">Public Key</span><div class="qr-wrapper" data-content="'+options.pub+'"></div><pre><code><p class="small"><strong>keys.pub</strong> = '+options.pub+'</p></code></pre></div><div class="col-sm-6"><span class="alert alert-danger alert-block">Private Key</span><div class="qr-wrapper" data-content="'+options.priv+'"></div><pre><code><p class="small"><strong>keys.priv</strong> = '+options.priv+'</p></code></pre></div></div>';
            }
        }
        else if(type == 'new_account')
        {
            var chain = 'btc';
            var app_salt = '';
            var salt_button = ''
            
            var callback = '';
            if(typeof options.callback != 'undefined' && options.callback) callback = options.callback;
            
            var print = true;
            var save = true;
            var more = true;
            var check = true;
            if(typeof options.print != 'undefined' && options.print === false) print = false;
            if(typeof options.save != 'undefined' && options.save === false) save = false;
            if(typeof options.more != 'undefined' && options.more === false) more = false;
            if(typeof options.check != 'undefined' && options.check === false) check = false;
            
            if((typeof options.deterministic != 'undefined' && options.deterministic === true) && (typeof options.random != 'undefined' && options.random))
            {
                salt_button = '<div class="input-buttons"><a href="#" class="btn btn-success bs-generate-user-salt input-button btn-xs pull-right">Deterministic</a> <a href="#" class="btn btn-danger bs-generate-user-salt input-button btn-xs pull-right random">Random</a></div>';
            }
            else if(typeof options.deterministic != 'undefined' && options.deterministic === true)
            {
                salt_button = '<div class="input-buttons"><a href="#" class="btn btn-success bs-generate-user-salt input-button btn-xs pull-right">Deterministic</a></div>';
            }
            else if(typeof options.random != 'undefined' && options.random)
            {
                salt_button = '<div class="input-buttons"><a href="#" class="btn btn-danger bs-generate-user-salt input-button btn-xs pull-right random">Random</a></div>';
            }
            
            var salt = '';
            var raw_salt = localStorage.getItem('nw_blockstrap_salt');
            if(raw_salt) salt = localStorage.getItem('nw_blockstrap_salt');
            if(blockstrap_functions.json(salt))
            {
                salt = $.parseJSON(salt);
                salt_button = '';
            }
            if(typeof options.chain != 'undefined') chain = options.chain;
            if(typeof options.salt != 'undefined') app_salt = options.salt;
            return '<form class="bs-new-account form-horizontal" data-chain="'+chain+'" data-salt="'+app_salt+'" data-callback="'+callback+'" data-print="'+print+'" data-save="'+save+'" data-more="'+more+'" data-check="'+check+'"><div class="form-group"><label for="name" class="control-label col-sm-3">Account Name</label><div class="col-sm-9"><input type="text" class="form-control" name="name" id="name" placeholder="This name gets used as part of the hashing process..." autocomplete="off" /></div></div><div class="form-group"><label class="control-label col-sm-3" for="salt">Your Unique Salt</label><div class="col-sm-9"><input type="text" class="form-control" placeholder="Type Salt or Click to Generate New" value="'+salt+'" name="salt" id="salt" autocomplete="off" />'+salt_button+'</div></div><div class="form-group"><label class="control-label col-sm-3" for="pass">Password</label><div class="col-sm-9"><input type="password" class="form-control" name="pass" id="pass" placeholder="Add a password for extra hashing strength!" autocomplete="off" /></div></div><div class="form-group"><label class="control-label col-sm-3">&nbsp;</label><div class="col-sm-9"><input type="password" class="form-control" placeholder="Repeat your password to be sure you typed it correctly..." name="password" id="password" autocomplte="off" /></div></div><div class="form-group"><button type="submit" class="btn btn-primary pull-right">Submit</button></div></form>';
        }
        else if(type == 'qr')
        {
            var content = '';
            if(typeof options.content != 'undefined')
            {
                content = options.content;
            }
            return '<div class="qr-wrapper" data-content="'+content+'"></div>';
        }
    }
    
    widgets.init = function()
    {
        widgets.accounts();
        widgets.addresses();
        widgets.donations();
        widgets.generations();
        widgets.modals();
        widgets.options();
        widgets.payments();
        widgets.toggles();
    }
    
    widgets.modals = function()
    {
        $('body').on('hide.bs.modal', '.modal', function()
        {
            $('.loading').removeClass('loading');
        });
    }
    
    widgets.options = function()
    {
        $('body').on('submit', 'form.bs-widget-options', function(e)
        {
            e.preventDefault();
            var form = this;
            var id = $(form).attr('data-id');
            var button = $('#'+id);
            var type = $(form).attr('data-type');
            if(type == 'generate')
            {
                var salt = $(form).find('input[name="salt"]').val();
                var chain = $(form).find('select[name="chain"]').val();
                $(button).attr('data-chain', chain);
                if(salt) $(button).attr('data-salt', salt);
                $(button).trigger('click');
            }
            else if(type == 'request')
            {
                var salt = $(form).find('input[name="salt"]').val();
                var currency = $(form).find('select[name="currency"]').val();
                var amount = parseFloat($(form).find('input[name="amount"]').val());
                $(button).attr('data-currency', currency);
                if(salt) $(button).attr('data-salt', salt);
                if(amount) $(button).attr('data-amount', amount);
                $(button).trigger('click').addClass('loading');
            }
        });
    }
    
    widgets.payments = function()
    {
        $('body').on('click', '.bs-request', function(e)
        {
            widgets.request(this, e);
        });
    }
    
    widgets.poll = function(seconds_delay, id, fn, clear, remove)
    {
        if(typeof remove != 'undefined' && remove == true)
        {
            clearInterval(polls[id]);
        }
        else
        {
            if(typeof seconds_delay == 'undefined' || seconds_delay < 1) seconds_delay = 30;
            if(typeof clear != 'undefined' && clear == true)
            {
                clearInterval(polls[id]);
            }
            polls[id] = setInterval(function() {
                fn();
            }, seconds_delay * 1000); // 60 * 1000 milsec
        }
    }
    
    widgets.qr = function(obj, content)
    {
        if(obj && contnt)
        {
            if($(obj).find('img').length > 0)
            {
                $(obj).find('img').remove();   
            }
            $(obj).qrcode({
                render: 'image',
                text: content
            });
        }
        else
        {
            $('.qr-wrapper').each(function(i)
            {
                var obj = this;
                if($(obj).find('img').length < 1)
                {
                    $(obj).qrcode({
                        render: 'image',
                        text: $(obj).attr('data-content')
                    });
                }
            });
        }
    }
    
    widgets.request = function(button, e)
    {
        $(button).addClass('loading');
        e.preventDefault();
        var poll = 0;
        var bs = $.fn.blockstrap;
        var salt = $(button).attr('data-salt');
        var currency = $(button).attr('data-currency');
        var chains = $(button).attr('data-chains');
        var amount = parseFloat($(button).attr('data-amount'));
        var amounts = $(button).attr('data-amounts');
        var addresses = $(button).attr('data-addresses');
        var callback = $(button).attr('data-callback');
        var qr = $(button).attr('data-qr');
        var bip = $(button).attr('data-bip');
        var title = $(button).attr('data-title');
        var description = $(button).attr('data-description');
        var modal_title = 'Error';
        var contents = 'Missing required options';
        if($(button).attr('data-poll')) poll = parseInt($(button).attr('data-poll'));
        if(!callback || typeof window[callback] != 'function')
        {
            callback = 'bs_default_payment_callback';
        }
        if(!description || description == 'false')
        {
            description = $(button).text();
        }
        if(!title) title = 'Payment Request';
        if(typeof poll != 'number' || poll < 1) poll = 60;
        if(!qr || qr == 'false') qr = false;
        else qr = true;
        if(!bip || bip == 'false') bip = false;
        else bip = true;
        if(salt && chains && addresses && callback)
        {
            bs.api.market('multi', '?currency='+currency, function(stats)
            {
                if(
                    typeof stats.data != 'undefined'
                    && typeof stats.data.markets != 'undefined'
                ){
                    var markets = stats.data.markets;
                    var blockchains = [];
                    var chain_array = chains.replace(/ /g, '').split(',');
                    var address_array = addresses.replace(/ /g, '').split(',');
                    var costs = {};
                    var one_btc = markets.btc.fiat_now;
                    var one_ltc = markets.ltc.fiat_now;
                    var one_dash = markets.dash.fiat_now;
                    var one_doge = markets.doge.fiat_now;
                    costs.btc = parseInt(parseFloat(amount / one_btc) * 100000000).toFixed(8);
                    costs.ltc = parseInt(parseFloat(amount / one_ltc) * 100000000).toFixed(8);
                    costs.doge = parseInt(parseFloat(amount / one_doge) * 100000000).toFixed(8);
                    costs.dash = parseInt(parseFloat(amount / one_dash) * 100000000).toFixed(8);
                    $.each(chain_array, function(k, chain)
                    {
                        var ts = Date.now();
                        var fee = parseFloat(bs.settings.blockchains[chain].fee) * 100000000;
                        var blockchain = bs.settings.blockchains[chain].blockchain;
                        var seed = CryptoJS.SHA3(salt + address_array[k] + ts, { outputLength: 512 }).toString();
                        var keys = bs.blockchains.keys(seed+chain, chain);
                        var cost_chain = chain;
                        if(chain == 'btct') cost_chain = 'btc';
                        if(chain == 'ltct') cost_chain = 'ltc';
                        if(chain == 'dasht') cost_chain = 'dash';
                        if(chain == 'doget') cost_chain = 'doge';
                        var display_cost = parseFloat(parseFloat(costs[cost_chain] / 100000000).toFixed(8) + parseFloat(fee / 100000000).toFixed(8)).toFixed(8);
                        var ts = Date.now();
                        var poll_id = 'bs_request_'+ts;
                        blockchains.push({
                            chain: chain,
                            blockchain: blockchain,
                            address: keys.pub,
                            key: keys.priv,
                            cost: parseInt(costs[cost_chain]),
                            fee: fee,
                            url: bs.settings.blockchains[cost_chain].lib + ':' + keys.pub + '?amount=' + display_cost + '&label=' + title,
                            display_cost: display_cost,
                            route: address_array[k],
                            ts: ts,
                            id: poll_id
                        });
                        widgets.poll(poll, poll_id, function()
                        {
                            $.fn.blockstrap.api.unspents(keys.pub, chain, function(unspents)
                            {
                                if($.isArray(unspents) && blockstrap_functions.array_length(unspents) > 0)
                                {
                                    var total = 0;
                                    var inputs = [];
                                    var fee = $.fn.blockstrap.settings.blockchains[chain].fee * 100000000;

                                    $.each(unspents, function(k, unspent)
                                    {
                                        if(total < amount + fee)
                                        {
                                            inputs.push({
                                                txid: unspent.txid,
                                                n: unspent.index,
                                                script: unspent.script,
                                                value: unspent.value,
                                            });
                                            total = total + unspent.value;
                                        }
                                    });

                                    var outputs = [{
                                        address: address_array[k],
                                        value: total - fee
                                    }];

                                    var raw_tx = $.fn.blockstrap.blockchains.raw(
                                        keys.pub,
                                        keys.priv,
                                        inputs,
                                        outputs,
                                        fee,
                                        total - fee,
                                        JSON.stringify({
                                            cost: parseInt(costs[cost_chain])
                                        })
                                    );

                                    $.fn.blockstrap.api.relay(raw_tx, chain, function(results)
                                    {
                                        var title = 'Error';
                                        var contents = 'Unable to relay transaction.';
                                        if(typeof results.txid != 'undefined' && results.txid)
                                        {
                                            setTimeout(function () {
                                                $.fn.blockstrap.api.transaction(results.txid+'?showtxnio=1', chain, function(tx)
                                                {
                                                    contents = 'Relayed transaction but unable to confirm it';
                                                    if(typeof tx.id != 'undefined')
                                                    {
                                                        if(callback && typeof window[callback] == 'function')
                                                        {
                                                            window[callback](tx, chain);
                                                            $.each(blockchains, function(k, blockchain)
                                                            {
                                                                widgets.poll(false, blockchain.id, false, false, true);
                                                            });
                                                        }
                                                        else
                                                        {
                                                            $.fn.blockstrap.core.modal(title, 'Invalid callback!');
                                                        }
                                                    }
                                                    else
                                                    {
                                                        $.fn.blockstrap.core.modal(title, contents);
                                                    }
                                                }, $.fn.blockstrap.core.api('blockstrap'), true);
                                            }, 10000);
                                        }
                                        else
                                        {
                                            $.fn.blockstrap.core.modal(title, contents);
                                        }
                                    });
                                }
                            });
                        }, true, false);
                    });
                    var amount_to_send = currency.toUpperCase() + ' ' + amount;
                    var contents = '<p><span class="alert alert-danger alert-block">PLEASE NOTE THAT THIS PAYMENT ADDRESS IS ONLY VALID FOR THIS SESSION. DO NOT CLOSE THIS UNTIL WE DISPLAY PAYMENT CONFIRMATION</span></p>';
                    contents+= '<p><span class="alert alert-warning alert-block">Please make payment for <strong>'+amount_to_send+'</strong> to either of the addresses below:</span></p>';
                    contents+= '<div class="row">';
                    $.each(blockchains, function(k, blockchain)
                    {
                        contents+= '<div class="col-sm-6">';
                            contents+= '<hr>';
                            contents+= '<p><strong>'+blockchain.blockchain+'</strong> Address: <small>'+blockchain.address+'</small></p>';
                            contents+= '<p><div class="qr-wrapper" id="qr-'+blockchain.chain+'-'+blockchain.address+'" data-content="'+blockchain.address+'"></div></p>';
                            contents+= '<p class="small">Send <strong>'+blockchain.display_cost+'</strong> '+blockchain.blockchain+'</p>';
                            contents+= '<div class="row">';
                                contents+= '<div class="col-sm-6">';
                                    contents+= '<p><a href="'+blockchain.url+'" class="btn btn-success btn-block">Desktop QT</a></p>';
                                contents+= '</div>';
                                contents+= '<div class="col-sm-6">';
                                    contents+= '<p><a href="'+blockchain.url+'" class="btn btn-primary btn-block qr-toggle" data-primary="'+blockchain.address+'" data-secondary="'+blockchain.url+'" data-id="qr-'+blockchain.chain+'-'+blockchain.address+'">BIP21 QR</a></p>';
                                contents+= '</div>';
                            contents+= '</div>';
                        contents+= '</div>';
                    });
                    contents+= '</div>';
                    contents+= '<hr><p class="small">No private keys are stored anywhere. Everything is generated deterministically specifically for this payment request, so the addresses are only checked and re-routed as and when this window is open.</p>';
                    modal_title = title;
                    bs.core.modal(modal_title, contents);
                    widgets.qr();
                }
            }, 'blockstra[', true);
        }
        else
        {
            bs.core.modal(modal_title, contents);
        }
    }
    
    widgets.toggles = function()
    {
        $('body').on('click', '.bs-toggle', function(e)
        {
            e.preventDefault();
            var button = this;
            var id = $(button).attr('data-id');
            $('#'+id).toggle(350);
        });
        $('body').on('click', '.qr-toggle', function(e)
        {
            e.preventDefault();
            var button = this;
            var primary = $(button).attr('data-primary');
            var secondary = $(button).attr('data-secondary');
            var id = $(button).attr('data-id');
            var wrapper = $('#'+id);
            var current_content = $(wrapper).attr('data-content');
            $(wrapper).find('img').remove();
            if(current_content == primary)
            {
                $(button).text('Address QR');
                $(wrapper).attr('data-content', secondary);
            }
            else
            {
                $(button).text('BIP21 QR');
                $(wrapper).attr('data-content', primary);
            }
            widgets.qr();
        });
    }
    
    widgets.update = function(type, acc, callback, page, chain)
    {
        if(typeof page == 'undefined') page = 0;
        else page = parseInt(page);
        var this_account = JSON.parse(JSON.stringify(acc));
        if(typeof this_account.blockchains != 'undefined')
        {
            var account = this_account.blockchains[chain];
            if(typeof account.address != 'undefined')
            {
                var now = new Date().getTime();
                var current_balance = account.balance;
                var current_tx_count = account.tx_count;
                $.fn.blockstrap.api.address(account.address, account.code, function(results)
                {
                    if(
                        (
                        results.tx_count 
                        && results.tx_count > current_tx_count
                        )
                        ||
                        (
                        results.balance 
                        && results.balance != current_balance
                        )
                    ){
                        account.balance = results.balance;
                        account.tx_count = results.tx_count;
                        account.ts = now;
                        $.fn.blockstrap.api.transactions(
                            account.address, 
                            account.code, 
                            function(transactions)
                        {
                            if(!$.isArray(this_account.txs)) this_account.txs = [];
                            if($.isArray(transactions))
                            {
                                var temp_txs = [];
                                $.each(transactions, function(k, transaction)
                                {
                                    var got_tx = false;
                                    $.each(this_account.txs, function(k, v)
                                    {
                                        if(v.txid == transaction.txid) got_tx = true;
                                    });
                                    if(!got_tx)
                                    {
                                        temp_txs.push(transaction);
                                        this_account.txs.push({
                                            ts: now,
                                            address: account.address,
                                            chain: account.code,
                                            tx: transaction,
                                            txid: transaction.txid
                                        });
                                    }
                                });
                            }
                            if(blockstrap_functions.array_length(this_account.txs) < account.tx_count)
                            {
                                // Paginate?
                                page++;
                                widgets.update(type, account, callback, page, chain);
                            }
                            else
                            {
                                $.fn.blockstrap.data.save('accounts', account.id, this_account, function(updated_account)
                                {
                                    var name = updated_account.name;
                                    var id = blockstrap_functions.slug(name);
                                    var wrapper = $('#wrapper-'+id);
                                    $(wrapper).find('.bs-balance').text(parseFloat(updated_account.blockchains[chain].balance / 100000000).toFixed(8));
                                    $(wrapper).find('.bs-txs').text(updated_account.blockchains[chain].tx_count);
                                    if(callback) callback(updated_account);
                                    else return updated_account;
                                });
                            }
                        }, false, false, 25, (page * 25));
                    }
                    else
                    {
                        if(callback) callback(false);
                        else return false;
                    }
                });
            }
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {widgets:widgets});
})
(jQuery);

/*

DEFAULT CALLBACK FUNCTIONS

*/
function bs_default_generate_callback(keys, chain, object_salt, seed, button, print, save, more, check, name, password, salt)
{
    var bs = $.fn.blockstrap;
    var blockchain = bs.settings.blockchains[chain].blockchain;
    var title = 'Successfully Generated Key Pair for ' + blockchain;
    content = bs.widgets.html('keys', keys);
    
    if(print == 'false' || !print) print = false;
    else print = true;
    
    if(save == 'false' || !save) save = false;
    else save = true;
    
    if(more == 'false' || !more) more = false;
    else more = true;
    
    if(check == 'false' || !check) check = false;
    else check = true;
    
    content+= '<div class="dont-print">';
    if(more && check)
    {
        content+= '<div id="alerts" style="display: none;"><span class="alert alert-warning alert-block"></span></div>';
        content+= '<hr><p> ----- <a href="#" class="bs-toggle btn btn-success btn-xs" data-id="key-info">more info</a> <a href="#" class="bs-toggle btn btn-success btn-xs bs-check-address" data-element="alerts" data-chain="'+chain+'" data-address="'+keys.pub+'">check address</a> ----- </p><hr>';
        content+= '<div id="key-info" style="display:none">';
        content+= '<hr><p><strong>These were the hashes that were used to generate the above keys:</strong></p><hr>';
        content+= '<p><strong>Object Salt:</strong><br><pre><code>'+object_salt+'<hr><p>Example JS Source Code:</p><p><strong>var seed = object_salt + name + password;<br>var final_seed = CryptoJS.SHA3(seed, {outputLength:512}).toString();</strong></p></code></pre></p>';
        content+= '<hr><p><strong>Final Seed:</strong><br><pre><code>'+seed+'<hr><p>Example JS Source Code:</p><p><strong>var keys = $.fn.blockstrap.blockchains.keys(final_seed, chain);</strong></p></code></pre></p>';
        content+= '<hr></div>';
    }
    else if(more)
    {
        content+= '<hr><p> ----- <a href="#" class="bs-toggle btn btn-success btn-xs" data-id="key-info">more info</a> ----- </p><hr>';
        content+= '<div id="key-info" style="display:none">';
        content+= '<hr><p><strong>These were the hashes that were used to generate the above keys:</strong></p><hr>';
        content+= '<p><strong>Object Salt:</strong><br><pre><code>'+object_salt+'<hr><p>Example JS Source Code:</p><p><strong>var seed = object_salt + name + password;<br>var final_seed = CryptoJS.SHA3(seed, {outputLength:512}).toString();</strong></p></code></pre></p>';
        content+= '<hr><p><strong>Final Seed:</strong><br><pre><code>'+seed+'<hr><p>Example JS Source Code:</p><p><strong>var keys = $.fn.blockstrap.blockchains.keys(final_seed, chain);</strong></p></code></pre></p>';
        content+= '<hr></div>';
    }
    else if(check)
    {
        content+= '<div id="alerts" style="display: none;"><span class="alert alert-warning alert-block"></span></div>';
        content+= '<hr><p> ----- <a href="#" class="bs-toggle btn btn-success btn-xs bs-check-address" data-element="alerts" data-chain="'+chain+'" data-address="'+keys.pub+'">check address</a> ----- </p><hr>';
    }
    
    if(print && save)
    {
        content+= '<div class="row"><div class="col-xs-6"><a href="#" class="btn btn-warning btn-block bs-print-keys">PRINT KEYS</a></div><div class="col-xs-6"><a href="#" class="btn btn-primary btn-block bs-save-keys" data-chain="'+chain+'" data-name="'+name+'" data-password="'+password+'" data-seed="'+seed+'" data-salt="'+salt+'">SAVE KEYS</a></div></div>';
    }
    else if(print)
    {
        content+= '<div class="row"><div class="col-xs-12"><a href="#" class="btn btn-warning btn-block bs-print-keys">PRINT KEYS</a></div></div>';
    }
    else if(save)
    {
        content+= '<div class="row"><div class="col-xs-12"><a href="#" class="btn btn-primary btn-block bs-save-keys" data-chain="'+chain+'" data-name="'+name+'" data-password="'+password+'" data-seed="'+seed+'" data-salt="'+salt+'">SAVE KEYS</a></div></div>';
    }
    content+= '</div>';
    bs.core.modal(title, content, 'default-modal', function()
    {
        bs.widgets.qr();
        $(button).removeClass('loading');
    });
}
function bs_default_payment_callback(tx, chain)
{
    var bs = $.fn.blockstrap;
    var collected = tx.outputs[0].value + tx.fees;
    var cost = 0;
    if(
        typeof tx.outputs != 'undefined'
        && typeof tx.outputs[1] != 'undefined'
        && typeof tx.outputs[1].script_pub_key_object != 'undefined'
        && typeof tx.outputs[1].script_pub_key_object.cost != 'undefined'
    ){
        cost = tx.outputs[1].script_pub_key_object.cost;
    }
    var title = 'Thank you for your payment';
    var contents = '<span class="alert alert-danger alert-block">Unfortunately, you did not send the full amount!</span>';
    if(collected == cost)
    {
        contents = '<span class="alert alert-success alert-block">Thank you for sending the exact amount!</span>';
    }
    else if(collected > cost)
    {
        contents = '<span class="alert alert-success alert-block">Thank you for sending the full amount!</span>';
    }
    var url = 'http://api.blockstrap.com/v0/'+chain+'/transaction/id/'+tx.id+'?showtxnio=1';
    contents+= '<hr><p>This is just a demo and shows the default callback. You can replace this callback with your own and already have the data from this <a href="'+url+'">API URL</a> in the <code>callback(tx)</code> function.</p>';
    $.fn.blockstrap.core.modal(title, contents);
}

