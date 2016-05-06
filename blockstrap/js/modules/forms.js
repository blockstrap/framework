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
            $.fn.blockstrap.core.modals('close_all');
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
                    if(
                        typeof $.fn.blockstrap.settings.blockchains[chain].apis[$.fn.blockstrap.core.api()] != 'undefined'
                    ){
                        new_chains.push(chain);
                    }
                });
            }
            else
            {
                new_chains.push(new_chain);
            }
            $.fn.blockstrap.core.modals('close_all');
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
                            var fields_to_use = {};
                            $.each(fields, function(i)
                            {
                                var field = fields[i];
                                fields_to_use[field.id] = field.value;
                            });
                            $.fn.blockstrap.accounts.new(
                                new_chains, 
                                account.name, 
                                fields_to_use.wallet_password, 
                                fields_to_use, 
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
                            setTimeout(function()
                            {
                                $.fn.blockstrap.core.modal(title, contents);
                            }, $.fn.blockstrap.core.timeouts('loader'));
                        }
                    }
                    else
                    {
                        $.fn.blockstrap.core.loader('close');
                        setTimeout(function()
                        {
                            $.fn.blockstrap.core.modal(title, contents);
                        }, $.fn.blockstrap.core.timeouts('loader'));
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
                        setTimeout(function()
                        {
                            $.fn.blockstrap.core.modal('Success', 'Contact Updated');
                        }, $.fn.blockstrap.core.timeouts('loader'));
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
                        if($.isArray(fields))
                        {
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
                                                            }, $.fn.blockstrap.core.timeouts('bs_forms_switch_address'));
                                                        }
                                                        else
                                                        {
                                                            var title = 'Error';
                                                            var contents = 'Unable to relay raw transaction';
                                                            $.fn.blockstrap.core.loader('close');
                                                            setTimeout(function()
                                                            {
                                                                $.fn.blockstrap.core.modal(title, contents);
                                                            }, $.fn.blockstrap.core.timeouts('loader'));
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
                                setTimeout(function()
                                {
                                    $.fn.blockstrap.core.modal(title, contents);
                                }, $.fn.blockstrap.core.timeouts('loader'));
                            }
                        }
                    })
                }
                else
                {
                    var title = 'Warning';
                    var contents = 'Unable to verify ownership';
                    $.fn.blockstrap.core.loader('close');
                    setTimeout(function()
                    {
                        $.fn.blockstrap.core.modal(title, contents);
                    }, $.fn.blockstrap.core.timeouts('loader'));
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
            var verification = false;
            try{
                verification = bitcoin.Message.verify(address, signature, message, blockchain_obj);
            }
            catch(error)
            {
                
            }
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
