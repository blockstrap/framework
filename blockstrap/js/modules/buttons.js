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
    var buttons = {};
    
    // FUNCTIONS FOR OBJECT
    buttons.process = function(slug, content, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements)
    {
        $('#'+$.fn.blockstrap.settings.content_id).hide(effect, {direction:direction}, 500);
        var paged_html = Mustache.render(content, filtered_data);
        $('#'+$.fn.blockstrap.settings.content_id).html(paged_html).show(effect, {direction:reverse_direction}, 500, function()
        {
            if(mobile && !menu) $(elements).css({'opacity':1});
            if(menu)
            {
                if($('#menu-toggle').hasClass('open')) $('#menu-toggle').trigger('click');
                if($('#sidebar-toggle').hasClass('open')) $('#sidebar-toggle').trigger('click');
            }
        });
        $(button).removeClass('loading');
        if(history.pushState) 
        {
            if(slug === $.fn.blockstrap.settings.slug_base)
            {
                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, $.fn.blockstrap.settings.base_url);
            }
            else
            {
                history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, '#'+slug);
            }
            $($.fn.blockstrap.element).find('.activated').removeClass('activated');
            $.fn.blockstrap.core.new();
        }
        else
        {
            $.fn.blockstrap.core.new();
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
        if($(button).attr('data-elements')) elements = $(button).attr('data-elements');
        if($(button).attr('data-effect')) effect = $(button).attr('data-effect');
        if($(button).hasClass('up')) 
        {
            direction = 'up';
            reverse_direction = 'down';
        }
        if($('#mobile-footer').css('display') === 'block') mobile = true;
        if($('#menu-toggle').hasClass('open') || $('#sidebar-toggle').hasClass('open')) menu = true;
        if(slugs[0] === "" && href)
        {
            slug = slugs[1];
            $($.fn.blockstrap.element).find('.btn-page.active').removeClass('active').addClass('activated');
            $(button).addClass('active loading');
            if(mobile && !menu) $(elements).css({'opacity':0});
            if($.fn.blockstrap.settings.data_base && $.fn.blockstrap.settings.html_base)
            {
                e.preventDefault();
                $.fn.blockstrap.data.find('data', slug, function(results)
                {
                    var data = results;
                    var refresh = blockstrap_functions.vars('refresh');
                    if(refresh === true || !data)
                    {
                        $.fn.blockstrap.templates.get('themes/'+$.fn.blockstrap.settings.theme+'/'+$.fn.blockstrap.settings.data_base+slug, 'json', function(data)
                        {
                            if(data.status)
                            {
                                buttons.cancel(button, mobile, menu, elements);
                            }
                            else
                            {
                                var filtered_data = $.fn.blockstrap.core.filter(data);
                                $.fn.blockstrap.data.put(slug, filtered_data);
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
                        $.fn.blockstrap.data.put(slug, filtered_data);
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
                                        buttons.process(slug, content, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
                                    }
                                });
                            }
                            else
                            {
                                buttons.process(slug, html, filtered_data, button, effect, direction, reverse_direction, mobile, menu, elements);
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
    
    buttons.reset = function(button, e)
    {
        e.preventDefault();
        $.fn.blockstrap.core.confirm('Confirm Device Reset', 'Please confirm that you want to completely remove all of the information from this device? If you have any coins stored, please ensure you first back-up the private keys or make a back-up of the wallet first.', function(confirmed)
        {
            if(confirmed) $.fn.blockstrap.core.reset();
        });
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
                        /* NEED TO RESET THE INDEX HTML AND DATA */
                        $.fn.blockstrap.templates.render('index', function()
                        {
                            location.reload();
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
                                            $.fn.blockstrap.core.new();
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
                        $.fn.blockstrap.core.new();
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
                        $.fn.blockstrap.core.new();
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
        }
    }
    
    buttons.remove = function(button, e)
    {
        e.preventDefault();
        var key = $(button).attr('data-key');
        var parent = $(button).attr('data-parent');
        var element = $(button).attr('data-element');
        var collection = $(button).attr('data-collection');
        if($.isPlainObject(localStorage))
        {
            var item = localStorage.getItem('nw_' + collection + '_' + key);
            if(item)
            {
                localStorage.removeItem('nw_' + collection + '_' + key);
                $($.fn.blockstrap.element).find('#' + parent).find('#' + element).hide(350, function()
                {
                   $(this).remove();
                })
            }
        }
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
    
    buttons.credentials = function(button, e)
    {
        e.preventDefault();
        $('#login-credentials-modal').modal('show');
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
    
    buttons.print = function(button, e)
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
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {buttons:buttons});
})
(jQuery);