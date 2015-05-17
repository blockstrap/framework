/*
 * 
 *  Blockstrap v0.5.0.2
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var widgets = {};    

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
            var keys = $.fn.blockstrap.blockchains.keys(seed, chain);
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
            var keys = $.fn.blockstrap.blockchains.keys(seed, chain);
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
                        var fee = $.fn.blockstrap.settings.blockchains[chain].fee;
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
            var accounts = $.fn.blockstrap.accounts.get();
            
            if(all && all == 'true') all = true;
            else all = false;
            
            if($.isArray(accounts))
            {
                $.each(accounts, function(k, obj)
                {
                    if(typeof obj.keys != 'undefined' && (obj.keys == false || all == true))
                    {
                        if(contents == default_contents)
                        {
                            contents = '<p>These are the accounts currently stored within your browser:</p>';
                            title = 'Current Accounts';
                        }
                        var blockchain = $.fn.blockstrap.settings.blockchains[obj.blockchain.code].blockchain;
                        var key_button = '<a href="#" class="btn btn-primary bs-account-key btn-xs" data-name="'+obj.name+'" data-address="'+obj.address+'" data-chain="'+obj.blockchain.code+'" data-salt="'+app_salt+'">Keys</a>';
                        var send_button = '<a href="#" class="btn btn-success bs-account-send btn-xs" data-name="'+obj.name+'" data-address="'+obj.address+'" data-chain="'+obj.blockchain.code+'" data-salt="'+app_salt+'">Send</a>';
                        var remove_button = '<a href="#" class="btn btn-danger bs-account-remove btn-xs" data-id="'+blockstrap_functions.slug(obj.name)+'">Remove</a>';
                        var buttons = key_button + ' ' + send_button + ' ' + remove_button;
                        contents+= '<div id="wrapper-'+blockstrap_functions.slug(obj.name)+'">';
                        contents+= '<p><hr><strong>'+obj.name+'</strong> ('+blockchain+')<br>'+buttons+'</p>';
                        contents+= '<p class="small"><strong>Address</strong>: '+obj.address+'</p><br>';
                        contents+= '<div class="row">';
                        contents+= '<div class="col-sm-6"><p><strong>TXs</strong>: '+obj.tx_count+'</p></div>';
                        contents+= '<div class="col-sm-6"><p><strong>Balance</strong>: '+parseFloat(obj.balance / 100000000).toFixed(8)+'</p></div>';
                        contents+= '</div>';
                        contents+= '</div>';
                        $.fn.blockstrap.accounts.update(obj);
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
                    var keys = bs.blockchains.keys(seed, chain);
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
        widgets.payments();
        widgets.toggles();
    }
    
    widgets.payments = function()
    {
        $('body').on('click', '.bs-request', function(e)
        {
            widgets.request(this, e);
        });
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
        e.preventDefault();
        var bs = $.fn.blockstrap;
        bs.core.modal('Success', 'Payment Request Function');
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