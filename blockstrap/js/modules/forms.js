/*
 * 
 *  Blockstrap v0.6.0.0
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

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
    
    forms.switch_addresses = function(form, vars)
    {
        if(
            typeof vars.accountId != 'undefined'
            && typeof vars.chain != 'undefined'
        ){
            var account_id = vars.accountId;
            var chain = vars.chain;
            var account = $.fn.blockstrap.accounts.get(account_id, true);
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
            account.addresses[0].chains[chain].push(account.blockchains[chain].address);
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
                            if(keys.pub === this_account.address)
                            {
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
                                        if(balance > fee)
                                        {
                                            console.log('need to transfer funds first!');
                                        }
                                        else
                                        {
                                            $.fn.blockstrap.data.save('accounts', account.id, account, function()
                                            {
                                                $.fn.blockstrap.accounts.update(
                                                    account, 
                                                    function(results)
                                                    {
                                                        console.log('and then?', results);
                                                    }, 
                                                    true, 
                                                    0, 
                                                    this_account.code
                                                );
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    })
                }
                else
                {
                    $.fn.blockstrap.core.modal(title, contents);
                }
            });
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {forms:forms});
})
(jQuery);
