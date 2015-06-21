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
    var buttons = {};
    
    window.onpopstate = function(event) 
    {
        if($.isPlainObject(event.state) && event.state.slug)
        {
            // HARDCODED HACK FOR NOW
            var slug = event.state.slug;
            if(slug == bs.settings.page_base) slug = bs.settings.slug_base;
            $.fn.blockstrap.core.nav(slug);
        }
    }
    
    buttons.access = function(button, e)
    {
        e.preventDefault();
        var account_id = $(button).attr('data-key');
        var chain = $(button).attr('data-chain');
        $.fn.blockstrap.data.find('accounts', account_id, function(raw_account)
        {
            if(
                typeof raw_account.blockchains != 'undefined'
                && typeof raw_account.blockchains[chain] != 'undefined'
            ){
                var account = raw_account.blockchains[chain];
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
                $.fn.blockstrap.core.modal(title, qr_code + form);
            }
        });
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
    
    buttons.create_account = function(button, e)
    {
        e.preventDefault();
        var wallet = {};
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form'));
        $.fn.blockstrap.core.loader('open');
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
            && wallet.wallet_blockchain
            && wallet.wallet_name 
            && wallet.wallet_password 
            && !wallet.cancel
        )
        {
            
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
                'blockstrap'
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
            var dnk = false;
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
                                            text: blockchain.blockchain + " Address",
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
        var obj = localStorage.getItem('nw_' + collection + '_' + key);
        if(blockstrap_functions.json(obj)) obj = $.parseJSON(obj);
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
                if($.fn.blockstrap.blockchains.validate(address))
                {
                    obj[ids[0]][ids[1]][ids[2]][ids[3]].key = address;
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
                        $.fn.blockstrap.core.modal('Success', 'Edit Saved');
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
            $('.'+css).toggle(speed);
        }
        else
        {
            $('#'+id).toggle(speed);
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
                e.preventDefault();
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
    }
    
    buttons.send_money = function(button, e)
    {
        e.preventDefault();
        var form = $($.fn.blockstrap.element).find('form#'+$(button).attr('data-form-id'));
        var to = $(form).find('#to').val();
        var from = $(form).find('#from').val();
        var chain = $(form).find('#from option:selected').attr('data-chain');
        var amount = parseFloat($(form).find('#amount').val()) * 100000000;
        if(!to) $.fn.blockstrap.core.modal('Warning', 'Missing address to send payment to');
        else if(!from) $.fn.blockstrap.core.modal('Warning', 'Missing account to use to send from');
        else if(!amount) $.fn.blockstrap.core.modal('Warning', 'You have not provided the amount you want to send');
        else
        {
            $.fn.blockstrap.accounts.prepare(to, from, amount, chain);
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
            
            bs.core.loader('open');
            
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
                                if(label) bs.core.modal('Error', 'Value for "'+label+'" Required');
                                else bs.core.modal('Error', 'Value Required');
                                continue_salting = false;
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
                                    bs.core.modal('Warning', 'Repeating Mismatch');
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
                                    }
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
        var account_id = $(button).attr('data-account-id');
        var chain = $(button).attr('data-chain');
        var blockchain = $(button).attr('data-to-blockchain');
        var to_address = $(button).attr('data-to-address');
        var to_amount = parseInt($(button).attr('data-to-amount'));
        var form = $('form#'+form_id);
        var raw_accounts = $.fn.blockstrap.accounts.get(account_id, true);
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
        if(balance < to_amount + fee)
        {
            $.fn.blockstrap.core.modal('Warning', 'You do not have sufficient funds');
        }
        else
        {
            $.fn.blockstrap.core.loader('open');
            $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
            {
                $(form).find('.form-group').each(function(i)
                {
                    var input = $(this).find('input');
                    var value = $(input).val();
                    var id = $(input).attr('id');
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
                                saved_account.blockchains[chain].ts = new Date().getTime();
                                saved_account.blockchains[chain].balance = change;
                                saved_account.blockchains[chain].tx_count++;
                                $.fn.blockstrap.data.save('accounts', account_id, saved_account, function(obj)
                                {
                                    $.fn.blockstrap.core.refresh(function()
                                    {
                                        $.fn.blockstrap.core.modals('close_all');
                                        var title = 'Sent ' + parseInt(to_amount) / 100000000 + ' ' + saved_account.blockchains[chain].type + ' to ' + to_address;
                                        var base = $.fn.blockstrap.settings.base_url;
                                        var content = '<p>Transaction ID: ' + tx.txid + '</p><p>You can <a href="' + base + '?txid=' + tx.txid + '#transaction">verify</a> your transaction using our internal explorer, or via a third-party service such as <a href="https://blockchains.io/' + blockchain + '/transaction/' + tx.txid + '">this</a>.</p>';
                                        content+='<p>Please note that a '+(fee / 100000000)+' '+$.fn.blockstrap.settings.blockchains[blockchain].blockchain+' mining fee was also added to the transaction.</p>';
                                        $.fn.blockstrap.core.modal(title, content);
                                    }, blockstrap_functions.slug(window.location.hash));
                                });
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
                    }
                }, false, chain, raw_accounts.type);
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
        var chain = $(button).attr('data-chain');
        var form = $('form#'+form_id);
        var raw_accounts = $.fn.blockstrap.accounts.get(account_id, true);
        if(
            typeof raw_accounts.blockchains != 'undefined'
            && typeof raw_accounts.blockchains[chain] != 'undefined'
        ){
            account = raw_accounts.blockchains[chain];
        }
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
                    var private_key = keys.priv;
                    var address = keys.pub;
                    var title = 'Private Key for '+address;
                    var intro = '<p style="word-wrap: break-word;">'+private_key+'</p>';
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
            }, false, chain, raw_accounts.type);
        });
    }
    
    buttons.switch = function(button, e)
    {
        e.preventDefault();
        var account_id = $(button).attr('data-key');
        var chain = $(button).attr('data-chain');
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
        $.fn.blockstrap.core.modal('Switch Addresses', contents + form);
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
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {buttons:buttons});
})
(jQuery);