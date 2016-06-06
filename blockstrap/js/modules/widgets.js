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
    var widgets = {};   
    var polls = {};
    var bs_widget_init = false;

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
                                        placeholder: 'Enter your password here',
                                        value: ''
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
                                contents = 'Your transaction has been relayed.';
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
        $('body').on('click', '.bs-accounts_modal', function(e)
        {
            e.preventDefault();
            var button = this;
            var all = $(button).attr('data-all');
            var app_salt = $(button).attr('data-salt');
            var title = 'Warning';
            var default_contents = 'You do not have any accouunts saved in localStorage yet.';
            var contents = default_contents;
            var accounts = $.fn.blockstrap.accounts.get(false, false, true);
            
            $(button).addClass('loading');
            
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
                            widgets.update('accounts', account, function(x)
                            {
                                obj = $.fn.blockstrap.accounts.get(account.id, true, true)[chain];
                                var blockchain = $.fn.blockstrap.settings.blockchains[chain].blockchain;
                                var key_button = '<a href="#" class="btn btn-primary bs-account-key btn-xs" data-name="'+obj.name+'" data-address="'+obj.address+'" data-chain="'+chain+'" data-salt="'+app_salt+'">Keys</a>';
                                var qr_button = '<a href="#" class="btn btn-success bs-qr btn-xs" data-content="'+obj.address+'">QR</a>';
                                var send_button = '<a href="#" class="btn btn-warning bs-account-send btn-xs" data-name="'+obj.name+'" data-address="'+obj.address+'" data-chain="'+chain+'" data-salt="'+app_salt+'">Send</a>';
                                var remove_button = '<a href="#" class="btn btn-danger bs-account-remove btn-xs" data-id="'+blockstrap_functions.slug(obj.name)+'">Remove</a>';
                                var buttons = key_button + ' ' + qr_button + ' ' + send_button + ' ' + remove_button;
                                contents+= '<div id="wrapper-'+blockstrap_functions.slug(obj.name)+'">';
                                contents+= '<p><hr><strong>'+obj.name+'</strong> ('+blockchain+')<br /><br />'+buttons+'</p>';
                                contents+= '<p class="small"><strong>Address</strong>: '+obj.address+'</p>';
                                contents+= '<p><strong>TXs</strong>: <span class="bs-txs">'+obj.tx_count+'</span> | <strong>Balance</strong>: <span class="bs-balance">'+parseFloat(obj.balance / 100000000).toFixed(8)+'</span> | <strong>Total Received</strong>: <span class="bs-received">'+parseFloat(obj.received / 100000000).toFixed(8)+'</span></p>';
                                contents+= '</div>';
                                widgets.poll(60, 'acc_' + blockstrap_functions.slug(obj.name), function()
                                {
                                    widgets.update('accounts', account, false, 0, chain);
                                }, true);
                            }, 0, chain);
                        });
                    }
                });
            }
            $.fn.blockstrap.core.modal(title, contents, 'default-modal', function()
            {
                $(button).removeClass('loading');
            });
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
        var html = $(button).attr('data-html');
        var amount = parseFloat($(button).attr('data-amount')).toFixed(8);
        var title = 'Error';
        var content = 'Missing required data attributes!';
        if(qr == 'false') qr = false;
        else qr = true;
        if(bip == 'false') bip = false;
        else bip = true;
        if(chain && address)
        {
            var blockchain = bs.settings.blockchains[chain].blockchain;
            title = 'Send ' + blockchain + ' to ' + address;
            if(amount && amount > 0)
            {
                title = 'Send ' + amount + ' ' + blockchain + ' to ' + address;
            }
        }
        if((qr || bip && (chain && address)) || (chain && address))
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
            else
            {
                content = '';
                if(html) content+= html;
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
                            if(typeof results.received != 'undefined' && txs)
                            {
                                $('.'+group+'-received-'+address).text(parseInt(results.received / 100000000).toFixed(8));
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
                if(id == 'your_password_repeat' || id == 'fake_password_field' || id == 'fake_username_field')
                {
                    
                }
                else
                {
                    keys[id] = value
                }
            });
            $.fn.blockstrap.core.salt(keys, function(salt, keys)
            {
                $.fn.blockstrap.data.save('blockstrap', 'salt', salt, function()
                {
                    $.fn.blockstrap.core.modals('close_all');
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
                    contents = '<p>We have saved '+account.name+' to localStorage,</p><p>You will need the <strong>final_seed</strong> in order to re-use this account elsewhere. The final seed is:</p><pre><code>'+final_seed+'</code></pre><p><span class="alert alert-danger alert-block">LOSS OF THIS SEED COULD RESULT IN LOSS OF CONTROL</span></p>';
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
            return '<form class="bs-new-account form-horizontal" data-chain="'+chain+'" data-salt="'+app_salt+'" data-callback="'+callback+'" data-print="'+print+'" data-save="'+save+'" data-more="'+more+'" data-check="'+check+'"><!-- HACK FOR IE/FIREBUG --><div style="display:none;"><input type="text" id="fake_username_field"/><input type="password" id="fake_password_field"/></div>  <!-- END OF AUTO-COMPLETE HACK --><div class="form-group"><label for="name" class="control-label col-sm-3">Account Name</label><div class="col-sm-9"><input type="text" class="form-control" name="name" id="name" placeholder="This name gets used as part of the hashing process..." autocomplete="off" /></div></div><div class="form-group"><label class="control-label col-sm-3" for="salt">Your Unique Salt</label><div class="col-sm-9"><input type="text" class="form-control" placeholder="Type Salt or Click to Generate New" value="'+salt+'" name="salt" id="salt" autocomplete="off" />'+salt_button+'</div></div><div class="form-group"><label class="control-label col-sm-3" for="pass">Password</label><div class="col-sm-9"><input type="password" class="form-control" name="pass" id="pass" placeholder="Add a password for extra hashing strength!" autocomplete="off" /></div></div><div class="form-group"><label class="control-label col-sm-3">&nbsp;</label><div class="col-sm-9"><input type="password" class="form-control" placeholder="Repeat your password to be sure you typed it correctly..." name="password" id="password" autocomplte="off" /></div></div><div class="form-group"><button type="submit" class="btn btn-primary pull-right">Submit</button></div></form>';
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
        bs_widget_init = true;
        widgets.accounts();
        widgets.addresses();
        widgets.donations();
        widgets.generations();
        widgets.modals();
        widgets.options();
        widgets.payments();
        widgets.switch();
        widgets.toggles();
    }
    
    widgets.modals = function()
    {
        $('body').on('hide.bs.modal', '.modal', function()
        {
            $('.loading').removeClass('loading');
        });
        $('body').on('click', '.bs-qr', function(e)
        {
            e.preventDefault();
            var content = $(this).attr('data-content');
            $.fn.blockstrap.widgets.qr(false, content, true);
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
    
    widgets.qr = function(obj, content, modal)
    {
        var need_modal = false;
        if(typeof modal != 'undefined' && modal)
        {
            need_modal = true;
            var title = 'QR Code<br /><small>( <a href="'+content+'" target="_blank">'+content+'</a> )</small>';
            var contents = '<div class="qr-wrapper" data-content="'+content+'" />';
            $.fn.blockstrap.core.modal(title, contents);
        }
        if(obj && contnt && !need_modal)
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
                                            }, $.fn.blockstrap.core.timeouts('bs_widgets_request'));
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
    
    widgets.switch = function()
    {
        $('body').on('submit', 'form.bs-update-api', function(e)
        {
            e.preventDefault();
            var form = $(this);
            var api = $(form).find('#api-provider').val();
            var key = $(form).find('#api-key').val();
            if(api)
            {
                $.fn.blockstrap.settings.default_api = api;
                if(
                    key
                    && typeof $.fn.blockstrap.settings.apis.defaults[api] != 'undefined'
                ){
                    $.fn.blockstrap.settings.apis.defaults[api].key = key;
                }
            }
            if(key)
            {
                $.fn.blockstrap.settings.default_key = key;
            }
        });
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
                var current_received = account.received;
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
                        this_account.blockchains[account.code].received = results.received;
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
                                    $(wrapper).find('.bs-received').text(parseFloat(updated_account.blockchains[chain].received / 100000000).toFixed(8));
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