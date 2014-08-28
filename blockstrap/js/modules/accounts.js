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
    var accounts = {};
    
    // FUNCTIONS FOR OBJECT
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
                            var address_key = new Bitcoin.ECKey(key);
                            var address = address_key.getBitcoinAddress().toString();
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
                                incoming: 0,
                                outgoing: 0,
                                balance: 0
                            };
                            if(data) account.data = data;
                            $.fn.blockstrap.data.save('accounts', slug, account, function()
                            {
                                callback(account);
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
    
    accounts.get = function(id)
    {
        var accounts = false;
        if($.isPlainObject(localStorage))
        {
            if(id && localStorage.getItem('nw_accounts_'+id))
            {
                return $.parseJSON(localStorage.getItem('nw_accounts_'+id));
            }
            else
            {
                $.each(localStorage, function(key, account)
                {
                    if(key.substring(0, 12) === 'nw_accounts_')
                    {
                        if(!$.isArray(accounts)) accounts = [];
                        accounts.push($.parseJSON(account));
                    }
                });
            }
        }
        return accounts;
    }
    
    accounts.balance = function(address, currency, callback, update)
    {
        if(update && callback)
        {
            var balance = 0;
            if(address)
            {
                $.fn.blockstrap.api.address(address, currency, function(address)
                {
                    if(address.balance) callback(address.balance)
                    else callback(balance);
                })
            }
        }
        else
        {
            if(callback) callback(false);
            else return false;
        }
    }
    
    accounts.balances = function(update)
    {
        var balances = {};
        if($.isArray(accounts.get()))
        {
            $.each(accounts.get(), function(k, v)
            {
                accounts.balance(v.address, v.currency.code, function(balance)
                {
                    if(!balance) balance = parseInt(v.balance);
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
                }, update);
            });
        }
        return balances;
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
                var total = parseInt(currency.balance) * parseInt(exchange_rates[rate]);
                grand_total = grand_total + total;
            });
        }
        if(prefix) return prefix + ' ' + grand_total;
        else return grand_total;
    }
    
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
                    id: 'verify-account',
                    fields: fields
                }
            ],
            buttons: {
                forms: [
                    {
                        type: "submit",
                        id: "submit-verification",
                        css: 'btn-primary pull-right',
                        text: 'Submit',
                        attributes: [
                            {
                                key: 'data-account-id',
                                value: account_id
                            },
                            {
                                key: 'data-form-id',
                                value: 'verify-account'
                            }
                        ]
                    },
                    {
                        css: 'btn-danger pull-right',
                        text: 'Cancel',
                        attributes: [
                            {
                                key: 'data-dismiss',
                                value: 'modal'
                            }
                        ]
                    }
                ]
            }
        };
        var intro = '';
        if(is_tx === true)
        {
            options.buttons.forms[0].id = 'submit-payment';
            options.buttons.forms[0].attributes.push({
                key: 'data-to-address',
                value: tx.to
            });
            options.buttons.forms[0].attributes.push({
                key: 'data-to-amount',
                value: tx.amount
            });
            var amount = parseInt(tx.amount) / 100000000;
            amount = amount + ' ' + account.currency.type;
            intro = '<p>Please confirm you want to send ' + amount + ' to ' + tx.to + '</p>';
        }
        var form = $.fn.blockstrap.forms.process(options);
        $.fn.blockstrap.core.modal('Verify Ownership of ' + account.name, intro + form);
    }
    
    accounts.verify = function(account, fields, callback)
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
                var address_key = new Bitcoin.ECKey(key);
                var address = address_key.getBitcoinAddress().toString();
                if(address === account.address)
                {
                    if(callback) callback(true, address, address_key);
                    else return true;
                }
                else
                {
                    $.fn.blockstrap.core.modal('Warning', 'Credentials do not match');
                }
            }
            else
            {
                $.fn.blockstrap.core.modal('Error', 'Unable to construct keys');
            }
        });
    }
    
    accounts.prepare = function(to, account_id, amount)
    {
        if(to && !$.fn.blockstrap.btc.validate(to))
        {
            $.fn.blockstrap.core.modal('Warning', to + ' is not a valid address');
        }
        else if(to, account_id, amount)
        {
            var tx = {
                to: to,
                from: account_id,
                amount: parseFloat(amount) * 100000000
            };
            $.fn.blockstrap.accounts.access(account_id, tx);
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {accounts:accounts});
})
(jQuery);
