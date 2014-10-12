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
    var accounts = {};
    
    accounts.access = function(account_id, tx)
    {
        var fields = [];
        var account = accounts.get(account_id);
        var is_tx = false;
        if($.isPlainObject(tx) && tx.to && tx.from && tx.amount)
        {
            is_tx = true;
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
                if(this_key == 'currency')
                {
                    value = account[this_key].code;
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
        var options = {
            css: 'form-horizontal',
            objects: [
                {
                    id: 'verify-ownership',
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
                        id: "submit-verification",
                        css: 'btn-primary pull-right btn-split',
                        text: 'Submit',
                        attributes: [
                            {
                                key: 'data-account-id',
                                value: account_id
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
            var amount = parseInt(tx.amount) / 100000000;
            var fee = $.fn.blockstrap.settings.currencies[account.currency.code].fee;
            amount = amount + ' ' + account.currency.type;
            intro = '<p>Please confirm you want to send ' + amount + ' to ' + tx.to + '</p><p>Please also note that there is a network mining fee of ' + fee + ' ' + account.currency.type + ' applied to this transaction to ensure that it is propergated throughout the network quickly.</p>';
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
                var balance = 0;
                if(v.balance) balance = parseInt(v.balance);
                if(balances[v.currency.code])
                {
                    balances[v.currency.code].balance = parseInt(balances[v.currency.code].balance) + balance;
                    balances[v.currency.code].count++;
                    balances[v.currency.code].name = v.currency.type;
                }
                else
                {
                    balances[v.currency.code] = {};
                    balances[v.currency.code].balance = parseInt(balance);
                    balances[v.currency.code].count = 1;
                    balances[v.currency.code].name = v.currency.type;
                }
            });
            $.each(balances, function(currency, obj)
            {
                var this_balance = balances[currency].balance;
                balances[currency].balance = parseInt(this_balance) / 100000000;
            });
            return balances;
        }
    }
    
    accounts.get = function(id)
    {
        var accounts = false;
        if(localStorage)
        {
            if(id && localStorage.getItem('nw_accounts_'+id))
            {
                var this_account = localStorage.getItem('nw_accounts_'+id);
                if(blockstrap_functions.json(this_account)) this_account = $.parseJSON(this_account);
                return this_account;
            }
            else
            {
                $.each(localStorage, function(key, account)
                {
                    if(key.substring(0, 12) === 'nw_accounts_')
                    {
                        if(!$.isArray(accounts)) accounts = [];
                        if(blockstrap_functions.json(account)) account = $.parseJSON(account);
                        accounts.push(account);
                    }
                });
            }
            return accounts;
        }
    }
    
    accounts.new = function(currency, name, password, keys, callback)
    {
        if(currency && name && password && keys && callback && $.isPlainObject($.fn.blockstrap.settings.currencies[currency]))
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
                        if(account)
                        {
                            $.fn.blockstrap.core.loader('close');
                            $.fn.blockstrap.core.modal('Warning', 'This account already exists');
                        }
                        else
                        {
                            var data = false;
                            if($.isPlainObject(keys))
                            {
                                if(keys.wallet_question)
                                {
                                    if(!$.isPlainObject(data)) data = {};
                                    data.wallet_question = keys.wallet_question;
                                }
                                var values = keys;
                                keys = [];
                                $.each(values, function(k, v)
                                {
                                    keys.push(k);
                                    key_obj = CryptoJS.SHA3(salt+key+k+v, { outputLength: 512 });
                                    key = key_obj.toString();
                                });
                            };
                            var address_keys = $.fn.blockstrap.currencies.keys(key, currency);
                            var address = address_keys.pub;
                            var pw_obj = CryptoJS.SHA3(salt+password, { outputLength: 512 });
                            var pw = pw_obj.toString();
                            var currency_name =  $.fn.blockstrap.settings.currencies[currency].currency;
                            var account = {
                                id: slug,
                                currency: {
                                    type: currency_name,
                                    code: currency
                                },
                                name: name,
                                password: pw,
                                keys: keys,
                                address: address,
                                tx_count: 0,
                                balance: 0,
                                ts: 0,
                                txs: {}
                            };
                            if(data) account.data = data;
                            $.fn.blockstrap.data.save('accounts', slug, account, function()
                            {
                                var this_account = $.fn.blockstrap.accounts.get(slug);
                                $.fn.blockstrap.accounts.update(this_account, function(account)
                                {
                                    callback(account);
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
            if($.isPlainObject($.fn.blockstrap.settings.currencies[currency]))
            {
                $.fn.blockstrap.core.modal('Warning', 'Missing device requirements');
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Currency not supported');
            }
        }
    }
    
    accounts.poll = function(wait, callback)
    {
        var now = new Date().getTime();
        var delay = $.fn.blockstrap.settings.cache.accounts;
        var polls = localStorage.getItem('nw_blockstrap_polls');
        if(blockstrap_functions.json(polls)) polls = $.parseJSON(polls);
        if(!$.isPlainObject(polls)) polls = {};
        if(!polls.accounts) polls.accounts = now;
        if(wait)
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
                            var currency = $.fn.blockstrap.settings.currencies[tx.currency].currency;
                            var amount = '<strong>' + val + '</strong> ' + currency;
                            var context = amount + ' <strong>recieved</strong>';
                            var base = $.fn.blockstrap.settings.base_url;
                            var url = base + '?txid=' + tx.txid + '#transaction';
                            if(value < 0) context = '<strong>' + val.substring(1) + '</strong> ' + currency + ' <strong>sent</strong>';
                            content+= '<p class="break-word">' + context + ':<br /><a href="' + url + '">' + tx.txid + '</a></p>';
                        });
                    }
                    $.fn.blockstrap.core.refresh(function()
                    {
                        $.fn.blockstrap.core.modal(title, content);
                        if(callback) callback();
                    }, $.fn.blockstrap.core.page(), false, true);
                }
                else
                {
                    if(callback) callback();
                }
            });
        }
    }
    
    accounts.prepare = function(to, account_id, amount)
    {
        if(to && !$.fn.blockstrap.currencies.validate(to))
        {
            $.fn.blockstrap.core.modal('Warning', to + ' is not a valid address');
        }
        else if(to, account_id, amount)
        {
            var tx = {
                to: to,
                from: account_id,
                amount: amount
            };
            $.fn.blockstrap.accounts.access(account_id, tx);
        }
    }
    
    accounts.remove = function(collection, key, element, confirm)
    {
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
            $.each(balances, function(code, currency)
            {
                var total = (parseFloat(currency.balance) * 100000000) * parseFloat(exchange_rates[rate]);
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
    
    accounts.update = function(account, callback, force_refresh)
    {
        if($.isPlainObject(account))
        {
            var ts = 0;
            var now = new Date().getTime();
            var cache_time = $.fn.blockstrap.settings.cache.accounts;
            if(account.ts) ts = account.ts;
            if(blockstrap_functions.vars('refresh')) ts = 0;
            if(force_refresh) ts = 0;
            if(ts + cache_time < now)
            {
                var current_tx_count = account.tx_count;
                $.fn.blockstrap.api.address(account.address, account.currency.code, function(results)
                {
                    if(results.tx_count && results.tx_count > current_tx_count)
                    {
                        account.balance = results.balance;
                        account.tx_count = results.tx_count;
                        account.ts = now;
                    }
                    $.fn.blockstrap.data.save('accounts', account.id, account, function(obj)
                    {
                        var txs = blockstrap_functions.array_length(obj.txs);
                        if(obj.tx_count > current_tx_count)
                        {
                            $.fn.blockstrap.api.transactions(account.address, account.currency.code, function(transactions)
                            {
                                if(!$.isPlainObject(obj.txs)) obj.txs = {};
                                if($.isArray(transactions))
                                {
                                    $.each(transactions, function(k, transaction)
                                    {
                                        obj.txs['txid_'+transaction.txid] = transaction;
                                    });
                                }
                                $.fn.blockstrap.data.save('accounts', obj.id, obj, function(updated_account)
                                {
                                    if(callback) callback(obj);
                                    else return obj;
                                });
                            });
                        }
                        else
                        {
                            if(callback) callback(obj);
                            else return obj;
                        }
                    });
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
    
    accounts.updates = function(index, callback)
    {
        if(!index) index = 0;
        var accounts = $.fn.blockstrap.accounts.get();
        var account_length = blockstrap_functions.array_length(accounts);
        if($.isArray(accounts))
        {
            var account = accounts[index];
            var current_tx_count = account.tx_count;
            index++;
            $.fn.blockstrap.accounts.update(account, function(obj)
            {
                var new_txs = [];
                var new_tx_count = 0;
                if(obj.tx_count > current_tx_count)
                {
                    new_tx_count = obj.tx_count - current_tx_count;
                    if($.isPlainObject(obj.txs))
                    {
                        $.each(obj.txs, function(key, tx)
                        {
                            new_txs.push(tx);
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
                    $.fn.blockstrap.accounts.updates(index, callback);
                }
            });
        }
        else
        {
            if(callback) callback();
        }
    }
    
    accounts.verify = function(account, fields, callback, password)
    {
        $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
        {
            var key = '';
            if($.isArray(fields))
            {
                $.each(fields, function(k, v)
                {
                    key_obj = CryptoJS.SHA3(salt+key+v.id+v.value, { outputLength: 512 });
                    key = key_obj.toString();
                });
            };
            if(key)
            {
                
                var keys = $.fn.blockstrap.currencies.keys(key);
                if(keys.pub === account.address)
                {
                    if(callback) callback(true, keys);
                    else return true;
                }
                else
                {
                    $.fn.blockstrap.core.modal('Warning', 'Credentials do not match');
                    $.fn.blockstrap.core.loader('close');
                }
            }
            else
            {
                $.fn.blockstrap.core.modal('Error', 'Unable to construct keys');
                $.fn.blockstrap.core.loader('close');
            }
        });
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {accounts:accounts});
})
(jQuery);
