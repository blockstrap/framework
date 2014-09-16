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
    var buttons = {};
    var page_cache_time = $.fn.blockstrap.settings.cache.pages;
    var pages_cached = {};
    
    window.onpopstate = function(event) 
    {
        if($.isPlainObject(event.state) && event.state.slug)
        {
            // HARDCODED HACK FOR NOW
            var slug = event.state.slug;
            if(slug == 'index') slug = 'dashboard';
            $.fn.blockstrap.core.nav(slug);
        }
    }
    
    buttons.access = function(button, e)
    {
        e.preventDefault();
        var account_id = $(button).attr('data-key');
        $.fn.blockstrap.data.find('accounts', account_id, function(account)
        {
            var title = 'Public Key:';
            if(account.address) title = title + ' ' + account.address;
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
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            });
            $.fn.blockstrap.core.modal(title, qr_code + form);
        });
    }
    
    buttons.account = function(button, e)
    {
        e.preventDefault();
        var wallet = {};
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form'));
        $.fn.blockstrap.core.loader('open');
        $.fn.blockstrap.core.modals('close_all');
        if($(form).length > 0)
        {
            $(form).find('.form-group').each(function(i)
            {
                var value = $(this).find('input').val();
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
            && wallet.wallet_currency
            && wallet.wallet_name 
            && wallet.wallet_password 
            && !wallet.cancel
        )
        {
            $.fn.blockstrap.accounts.new(
                wallet.wallet_currency, 
                wallet.wallet_name,
                wallet.wallet_password,
                wallet,
                function(account)
                {
                    /* NEED TO RESET THE INDEX HTML AND DATA */
                    $.fn.blockstrap.templates.render('accounts', function()
                    {
                        $.fn.blockstrap.core.ready();
                        $.fn.blockstrap.core.loader('close');
                    }, true);
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
    
    buttons.check = function()
    {
        var hash = false;
        if(window.location.href.split('#').length === 2) 
        {
            hash = window.location.href.split('#')[1];
        }
        if(hash)
        {
            $($.fn.blockstrap.element).find('.btn-page').each(function()
            {
                if($(this).attr('href') === '#'+hash)
                {
                    if($('#mobile-footer').css('display') === 'block')
                    {
                        if($(this).parent().attr('id') === 'mobile-footer')
                        {
                            $(this).trigger('click');
                            return false;
                        }
                    }
                    else
                    {
                        $(this).trigger('click');
                        return false;
                    }
                }
            })
        }
    }
    
    buttons.contact = function(button, e)
    {
        e.preventDefault();
        var contact = {};
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form'));
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
                    else if(!value && !$(this).find('select').hasClass('extra-fields'))
                    {
                        var label = false;
                        if($(this).find('label').html()) label = $(this).find('label').html();
                        if(label) $.fn.blockstrap.core.modal('Error', 'Value for "'+label+'" Required');
                        else $.fn.blockstrap.core.modal('Error', 'Value Required');
                        $.fn.blockstrap.core.loader('close');
                        return false;
                    }
                }
            });
        }
        if(
            contact 
            && contact.contact_name
            && contact.contact_address 
            && contact.contact_currency 
        )
        {
            $.fn.blockstrap.contacts.new(
                contact.contact_name, 
                contact.contact_address,
                contact.contact_currency,
                contact,
                function(contact)
                {
                    /* NEED TO RESET THE INDEX HTML AND DATA */
                    $.fn.blockstrap.templates.render('contacts', function()
                    {
                        $.fn.blockstrap.core.ready();
                        $.fn.blockstrap.core.loader('close');
                    }, true);
                }
            )
        }
        else
        {
            $.fn.blockstrap.core.loader('close');
            $.fn.blockstrap.core.modal('Error', 'Missing contact requirements');
            return false;
        }
    }
    
    buttons.credentials = function(button, e)
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
            var email = 'N / A';
            var title = 'Edit Contact Details';
            if(obj.data.contact_email) email = obj.data.contact_email;
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
                        id: "email",
                        label: {
                            text: "Email",
                            css: "col-xs-3"
                        },
                        type: "text",
                        value: email,
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
                if($.isArray(obj.currencies))
                {
                    $.each(obj.currencies, function(k, currency)
                    {
                        if($.isArray(currency.addresses))
                        {
                            $.each(currency.addresses, function(key, address)
                            {
                                fields.push({
                                    inputs: {
                                        id: "currencies."+k+".addresses."+key+".key",
                                        label: {
                                            text: currency.currency + " Address",
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
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(login_status))
        {
            $.fn.blockstrap.security.logout();
        }
        else
        {
            $.fn.blockstrap.core.modal('Warning', '<p>No login information has been established yet. Would you like to create login credentials now?<p><p><a href="#" class="btn btn-sm btn-success" id="create-login-credentials">Create Credentials</a> <a href="#" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</a></p>');
        }
    }
    
    buttons.more = function(button, e)
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
                $(button).text('Less Security');
                $(button).removeClass('btn-default').addClass('btn-danger');
            }
            else
            {
                $(this).hide(350);
                $(button).text('More Security');
                $(button).removeClass('btn-danger').addClass('btn-default');
            }
        });
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
            $.fn.blockstrap.core.nav(slug);
            if(mobile && !menu) $(elements).css({'opacity':0});
            if(menu)
            {
                $.fn.blockstrap.core.loader('open');
            }
            if($.fn.blockstrap.settings.data_base && $.fn.blockstrap.settings.html_base)
            {
                e.preventDefault();
                $.fn.blockstrap.data.find('data', slug, function(results)
                {
                    var data = results;
                    var refresh = blockstrap_functions.vars('refresh');
                    if(!pages_cached[slug]) pages_cached[slug] = now;
                    if(pages_cached[slug] + page_cache_time < now)
                    {
                        refresh = true;
                        pages_cached[slug] = now;
                    }
                    if(refresh === true || !data)
                    {                              $.fn.blockstrap.templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.data_base+slug, 'json', function(data)
                        {
                            if(data.status)
                            {
                                buttons.cancel(button, mobile, menu, elements);
                            }
                            else
                            {
                                var filtered_data = $.fn.blockstrap.core.filter(data);
                                $.fn.blockstrap.data.save('data', slug, data, function(res)
                                {
                                    $.fn.blockstrap.data.find('html', slug, function(results)
                                    {
                                        var html = results;
                                        if(refresh === true || !html)
                                        {
                                            $.fn.blockstrap.templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.html_base+slug, 'html', function(content)
                                            {
                                                if(content.status && content.status === 404)
                                                {
                                                    buttons.cancel(button, mobile, menu, elements);
                                                }
                                                else
                                                {
                                                    $.fn.blockstrap.data.save('html', slug, content, function()
                                                    {
                                                        buttons.process(slug, content, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
                                                    });
                                                }
                                            });
                                        }
                                        else
                                        {                                            
                                            buttons.process(slug, html, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
                                        }
                                    });
                                });
                            }
                        });
                    }
                    else
                    {
                        var filtered_data = $.fn.blockstrap.core.filter(data);
                        $.fn.blockstrap.data.find('html', slug, function(results)
                        {
                            buttons.process(slug, results, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
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
    
    buttons.prepare = function(button, e)
    {
        e.preventDefault();
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form-id'));
        var to = $(form).find('#to').val();
        var from = $(form).find('#from').val();
        var amount = parseFloat($(form).find('#amount').val()) * 100000000;
        if(!to) $.fn.blockstrap.core.modal('Warning', 'Missing address to send payment to');
        else if(!from) $.fn.blockstrap.core.modal('Warning', 'Missing account to use to send from');
        else if(!amount) $.fn.blockstrap.core.modal('Warning', 'You have not provided the amount you want to send');
        else
        {
            $.fn.blockstrap.accounts.prepare(to, from, amount);
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
        $('#'+$.fn.blockstrap.settings.content_id).hide(effect, {direction:direction}, 500);
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
        if(history.pushState) 
        {
            var refresh = '';
            if(location.search.indexOf('refresh=true') > -1) refresh = '?refresh=true';
            var url = $.fn.blockstrap.settings.base_url;
            if(slug === $.fn.blockstrap.settings.slug_base)
            {
                history.pushState({slug:'index'}, document.getElementsByTagName("title")[0].innerHTML, url + refresh);
            }
            else
            {
                history.pushState({slug:slug}, document.getElementsByTagName("title")[0].innerHTML, url + refresh + '#'+slug);
            }
            $($.fn.blockstrap.element).find('.activated').removeClass('activated');
            $.fn.blockstrap.core.ready();
        }
        else
        {
            $.fn.blockstrap.core.ready();
        }
    }
    
    buttons.refresh = function(button, e)
    {
        e.preventDefault();
        var collection = $(button).attr('data-collection');
        var key = $(button).attr('data-key');
        if(collection == 'accounts')
        {
            $.fn.blockstrap.core.loader('open');
            var account = $.fn.blockstrap.accounts.get(key);
            $.fn.blockstrap.accounts.update(account, function()
            {
                $.fn.blockstrap.core.refresh(function()
                {
                    $.fn.blockstrap.core.loader('close');
                });
            }, true);
        }
    }      
    
    buttons.remove = function(button, e)
    {
        e.preventDefault();
        var key = $(button).attr('data-key');
        var element = $(button).attr('data-element');
        var collection = $(button).attr('data-collection');
        var confirm = $(button).attr('data-confirm');
        if(confirm)
        {
            var form = $.fn.blockstrap.forms.input({
                label: 'Password',
                type: 'password',
                id: 'confirm-pw',
                placeholder: 'Type your password to allow account removal'
            });
            var text = '<p>Please confirm removal of this account. You will not be able to use any of the coins on the account unless you can accurately re-create them or first back-up the private key. We hope you understand the risks. Please type the account password below and then press confirm to remove account.</p><p>'+form+'</p>';
            $.fn.blockstrap.core.confirm('Confirmation Required', text, function()
            {
                $.fn.blockstrap.accounts.remove(collection, key, element, confirm);
            });
        }
        else
        {
            $.fn.blockstrap.accounts.remove(collection, key, element, false);
        }
    }
    
    buttons.reset = function(button, e)
    {
        if(e)
        {
            e.preventDefault();
            $.fn.blockstrap.core.confirm('Confirm Device Reset', 'Please confirm that you want to completely remove all of the information from this device? If you have any coins stored, please ensure you first back-up the private keys or make a back-up of the wallet first.', function(confirmed)
            {
                if(confirmed) $.fn.blockstrap.core.reset();
            });
        }
        else
        {
            $.fn.blockstrap.core.reset();
        }
    }
    
    buttons.save = function(button, e)
    {
        e.preventDefault();
        var key = $(button).attr('data-key');
        var element = $(button).attr('data-element');
        var collection = $(button).attr('data-collection');
        var form_id = $(button).attr('data-form-id');
        var form = $($.fn.blockstrap.element).find('form#' + form_id);
        var obj = localStorage.getItem('nw_' + collection + '_' + key);
        if(blockstrap_functions.json(obj)) obj = $.parseJSON(obj);
        $(form).find('.form-group').each(function(i)
        {
            var input = $(this).find('input');
            var value = $(input).val();
            var id = $(input).attr('id');
            if(id.indexOf('email') > -1)
            {
                obj.data.contact_email = value;
            }
            else if(id.indexOf('.') > -1)
            {
                var ids = id.split('.');
                var address = value;
                if($.fn.blockstrap.btc.validate(address))
                {
                    obj[ids[0]][ids[1]][ids[2]][ids[3]].key = address;
                    if(i >= $(form).find('.form-group').length - 1)
                    {
                        $.fn.blockstrap.data.save(collection, key, obj, function()
                        {
                            $.fn.blockstrap.core.refresh(function()
                            {
                                $.fn.blockstrap.core.modal('Success', 'Edit Saved');
                            });
                        });
                    }
                }
                else
                {
                    $.fn.blockstrap.core.modal('Warning', 'Not a valid address');
                }
            }
            else
            {
                obj[id] = value;
            }
        });
    }
    
    buttons.send = function(button, e)
    {
        e.preventDefault();
        var fields = [];
        var form_id = $(button).attr('data-form-id');
        var account_id = $(button).attr('data-account-id');
        var to_address = $(button).attr('data-to-address');
        var to_amount = parseInt($(button).attr('data-to-amount'));
        var form = $('form#'+form_id);
        var account = $.fn.blockstrap.accounts.get(account_id);
        var balance = account.balance;
        var fee = $.fn.blockstrap.settings.currencies.btc.fee * 100000000;
        var from_address = account.address;
        var change = balance - (to_amount + fee);
        var current_tx_count = account.tx_count;
        if(balance < to_amount + fee)
        {
            $.fn.blockstrap.core.modal('Warning', 'You do not have sufficient funds');
        }
        else
        {
            $.fn.blockstrap.core.modals('close_all');
            $.fn.blockstrap.core.loader('open');
            $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
            {
                $(form).find('.form-group').each(function(i)
                {
                    var input = $(this).find('input');
                    var value = $(input).val();
                    var id = $(input).attr('id');
                    fields.push({
                        id: id,
                        value: value
                    });
                });
                $.fn.blockstrap.accounts.verify(account, fields, function(verified, keys)
                {
                    if(verified === true)
                    {
                        var private_key = keys.privkey.toString();
                        $.fn.blockstrap.api.unspents(keys.pubkey.toString(), 'btc', function(unspents)
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
                                });
                                var raw_transaction = $.fn.blockstrap.btc.raw(from_address, private_key, inputs, outputs, fee, to_amount);
                                $.fn.blockstrap.api.relay(raw_transaction, 'btc', function(tx)
                                {
                                    if(tx && tx.txid)
                                    {
                                        account.ts = new Date().getTime();
                                        account.balance = change;
                                        account.tx_count++;
                                        $.fn.blockstrap.data.save('accounts', account_id, account, function(obj)
                                        {
                                            $.fn.blockstrap.core.refresh(function()
                                            {
                                                var title = 'Sent ' + parseInt(to_amount) / 100000000 + ' Bitcoin to ' + to_address;
                                                var base = $.fn.blockstrap.settings.base_url;
                                                var content = '<p>Transaction ID: ' + tx.txid + '</p><p>You can <a href="' + base + '?txid=' + tx.txid + '#transaction">verify</a> your transaction using our internal explorer, or via a third-party service such as <a href="https://blockchain.info/tx/' + tx.txid + '">this</a>.</p><p>Please note that upon refreshing or switching pages, balances may return to their previous totals when transactions are successful but unconfirmed, where they can take anywhere upto 10 minutes to be confirmed. We will provide dual balances for each currency in the next release.</p>';
                                                $.fn.blockstrap.core.modal(title, content);
                                                $.fn.blockstrap.core.loader('close');
                                            });
                                        });
                                    }
                                    else
                                    {
                                        $.fn.blockstrap.core.loader('close');
                                    }
                                });
                            }
                            else
                            {
                                $.fn.blockstrap.core.loader('close');
                            }
                        });
                    }
                });
            });
        }
    } 
    
    buttons.set = function(button, e)
    {
        e.preventDefault();
        var form_id = $(button).attr('data-form');
        var username_id = $(button).attr('data-field-username');
        var password_id = $(button).attr('data-field-password');
        var repeat_id = $(button).attr('data-field-repeat');
        var form = $($.fn.blockstrap.element).find('#'+form_id);
        var username = $(form).find('#'+username_id).val();
        var password = $(form).find('#'+password_id).val();
        var repeat = $(form).find('#'+repeat_id).val();
        if(username && password && password == repeat)
        {
            $.fn.blockstrap.security.credentials(username, password, function()
            {
                location.reload();
            });
        }
        else
        {
            if(password != repeat)
            {
                $.fn.blockstrap.core.modal('Warning', 'Password Mismatch');
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Missing Username & Password');
            }
        }
    }
    
    buttons.setup = function(button, e)
    {
        e.preventDefault();
        var href = $(button).attr('href');
        var steps = parseInt($(button).attr('data-steps'));
        var current_step = parseInt($(button).attr('data-step'));
        var next_step = current_step + 1;
        var form_string = $(button).attr('data-forms');
        var forms = form_string.split(', ');
        
        if($.isArray(forms))
        {
            var wallet = false;
            var modules = {};
            var options = {};
            var continue_salting = true;
            
            $.fn.blockstrap.core.loader();
            
            $.each(forms, function(form_index, form_id)
            {
                var form = $('form#'+form_id);
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
                                if($(this).find('label').html()) label = $(this).find('label').html();
                                if(label) $.fn.blockstrap.core.modal('Error', 'Value for "'+label+'" Required');
                                else $.fn.blockstrap.core.modal('Error', 'Value Required');
                                continue_salting = false;
                            }
                        }
                        else
                        {
                            var value = $(this).find('input').val();
                            var image = $(this).find('input').attr('data-img');
                            
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
                                    $.fn.blockstrap.core.modal('Warning', 'Repeating Mismatch');
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
                                options[$(this).find('input').attr('id')] = value;
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
                                    wallet[$(this).find('input').attr('id')] = value;
                                }
                            }
                            else
                            {
                                if($(this).find('select').length < 1)
                                {
                                    $.fn.blockstrap.core.modal('Error', 'Setup Type Missing');
                                }
                            }
                        }
                    });
                }
            });
            
            $.fn.blockstrap.data.find('blockstrap', 'options', function(current_options)
            {
                var merged_options = $.extend({}, current_options, options);
                $.fn.blockstrap.data.save('blockstrap', 'options', merged_options, function()
                {

                });
            });
            
            if(
                wallet 
                && wallet.wallet_currency
                && wallet.wallet_name 
                && wallet.wallet_password
                && !wallet.cancel
            )
            {
                $.fn.blockstrap.accounts.new(
                    wallet.wallet_currency, 
                    wallet.wallet_name,
                    wallet.wallet_password,
                    wallet,
                    function(account)
                    {
                        // INSTALL CONFIGURED CONTACTS IF AVAILABLE
                        if($.isArray($.fn.blockstrap.settings.contacts))
                        {
                            var contacts = $.fn.blockstrap.settings.contacts;
                            $.each(contacts, function(k, contact)
                            {
                                $.fn.blockstrap.contacts.new(
                                    contact.name, 
                                    contact.address,
                                    contact.currency,
                                    contact,
                                    function()
                                    {
                                        // And then?
                                    }
                                );
                            });
                        }
                        
                        /* NEED TO RESET THE INDEX HTML AND DATA */
                        $.fn.blockstrap.templates.render('index', function()
                        {
                            $("html, body").animate({ scrollTop: 0 }, 350, function()
                            {
                                $.fn.blockstrap.core.loader('close');
                            });
                        }, true);
                    }
                )
            }
            else if(continue_salting)
            {
                var saved_salt = $.fn.blockstrap.settings.id;
                if(localStorage.getItem('nw_blockstrap_salt'))
                {
                    saved_salt = localStorage.getItem('nw_blockstrap_salt');
                }
                $.fn.blockstrap.security.salt(modules, function(salt, keys)
                {
                    $.fn.blockstrap.data.find('blockstrap', 'keys', function(stored_keys)
                    {
                        var new_keys = $.merge($.merge([], stored_keys), keys);
                        $.fn.blockstrap.data.save('blockstrap', 'keys', new_keys, function()
                        {
                            $.fn.blockstrap.data.save('blockstrap', 'salt', salt, function()
                            {
                                $("html, body").animate({ scrollTop: 0 }, 350);
                                if(current_step >= steps)
                                {
                                    /* NEED TO RESET THE INDEX HTML AND DATA */
                                    $.fn.blockstrap.templates.render('index', function()
                                    {
                                        location.reload();
                                    }, true);
                                }
                                else
                                {
                                    $.fn.blockstrap.data.find('data', 'index', function(results)
                                    {
                                        results.setup = {};
                                        results.setup.func = 'setup';
                                        results.setup.step = next_step;
                                        var data = $.fn.blockstrap.core.filter(results);
                                        $.fn.blockstrap.data.find('html', 'index', function(html)
                                        {
                                            var page = Mustache.render(html, data);
                                            $($.fn.blockstrap.element).html('');
                                            $($.fn.blockstrap.element).append(page);
                                            $($.fn.blockstrap.element).addClass('loading');
                                            $($.fn.blockstrap.element).find('#blockstrap-loader').css({'opacity': 1, 'z-index': 9999999});
                                            $.fn.blockstrap.core.ready();
                                            $.fn.blockstrap.core.loader();
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
                $.fn.blockstrap.core.loader('close');
            }
        }
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
                    var currencies = contact.currencies;
                    if($.isArray(currencies))
                    {
                        $.each(currencies, function(currency_key, currency)
                        {
                            var addresses = currency.addresses;
                            if($.isArray(addresses))
                            {
                                $.each(addresses, function(address_key, address)
                                {
                                    value = address.key;
                                    text = contact.name +': '+ currency.currency;
                                });
                            }
                        });
                    }
                    if(value && text)
                    {
                        options+= '<option value="' + value + '">' + text + '</option>';
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
        var fields = [];
        var form_id = $(button).attr('data-form-id');
        var account_id = $(button).attr('data-account-id');
        var form = $('form#'+form_id);
        var account = $.fn.blockstrap.accounts.get(account_id);
        $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
        {
            $(form).find('.form-group').each(function(i)
            {
                var input = $(this).find('input');
                var value = $(input).val();
                var id = $(input).attr('id');
                fields.push({
                    id: id,
                    value: value
                });
            });
            $.fn.blockstrap.accounts.verify(account, fields, function(verified, keys)
            {
                if(verified === true)
                {
                    var private_key = keys.privkey.toString();
                    var address = keys.pubkey.toString();
                    var title = 'Private Key for '+address;
                    var intro = '<p style="word-wrap: break-word;">'+private_key+'</p>';
                    var qr_code = '<p class="qr-holder" data-content="'+private_key+'"></p>';
                    var print = '<p style="text-align: center"><a href="#" class="btn btn-danger btn-print" data-print-id="default-modal" data-print-class="modal-body" data-print-title="Private Key for '+address+'">PRINT THIS KEY</a></p>';
                    $.fn.blockstrap.core.modal(title, intro + qr_code + print);
                    $('#default-modal').find('.qr-holder').each(function()
                    {
                        $(this).qrcode({
                            render: 'image',
                            text: $(this).attr('data-content')
                        });
                    });
                }
            });
        });
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {buttons:buttons});
})
(jQuery);