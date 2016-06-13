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
    var shapeshift = {};
    var shapeshift_markets = {};
    var shapeshift_urls = {
        markets: 'https://shapeshift.io/marketinfo/',
        shift: 'https://shapeshift.io/shift/'
    };
    
    shapeshift.accounts = function(obj)
    {
        if(
            typeof obj != 'undefined'
            && typeof obj.objects != 'undefined'
            && typeof obj.objects[0] != 'undefined'
            && typeof obj.objects[0].fields != 'undefined'
            && typeof obj.objects[0].fields[0] != 'undefined'
            && typeof obj.objects[0].fields[2] != 'undefined'
            && typeof obj.objects[0].fields[0].selects != 'undefined'
            && typeof obj.objects[0].fields[2].selects != 'undefined'
            && typeof obj.objects[0].fields[0].selects[0] != 'undefined'
            && typeof obj.objects[0].fields[2].selects[0] != 'undefined'
            && typeof obj.objects[0].fields[0].selects[0].values != 'undefined'
            && typeof obj.objects[0].fields[2].selects[0].values != 'undefined'
            && $.isArray(obj.objects[0].fields[0].selects[0].values)
            && $.isArray(obj.objects[0].fields[2].selects[0].values)
        ){
            var accounts = $.fn.blockstrap.accounts.get();
            if($.isArray(accounts))
            {
                $.each(accounts, function(k, account)
                {
                    if(
                        typeof account.blockchains != 'undefined'
                        && $.isPlainObject(account.blockchains)
                    ){
                        $.each(account.blockchains, function(v, blockchain)
                        {
                            if(
                                typeof blockchain.code != 'undefined'
                                && blockchain.code.slice(-1) != 't'
                            ){
                                obj.objects[0].fields[0].selects[0].values.push({
                                    value: blockchain.code + '-' + blockchain.address + '-' + account.id,
                                    text: account.name + ' > ' + blockchain.type
                                });
                                obj.objects[0].fields[2].selects[0].values.push({
                                    value: blockchain.code + '-' + blockchain.address,
                                    text: account.name + ' > ' + blockchain.type
                                });
                            }
                        });
                    }
                });
            }
        }
        return obj;
    }
    
    shapeshift.buttons = function()
    {
        $('body').on('click', '.btn-shapeshift', function(e)
        {
            e.preventDefault();
            var title = 'Exchange Coins via Shapeshift.io';
            var contents = '<p>Fill-out the necessary details below to establish a conversion connection:</p>';
            var form = {
                objects: [
                    {
                        id: 'bs-shapeshift',
                        fields: [
                            {
                                selects: [
                                    {
                                        id: 'shift_from',
                                        values: [
                                            {
                                                value: '',
                                                text: '-- Where to shift from? --'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                inputs: [
                                    {
                                        id: 'shift_amount',
                                        placeholder: 'How much to exchange?'
                                    }
                                ]
                            },
                            {
                                selects: [
                                    {
                                        id: 'shift_to',
                                        values: [
                                            {
                                                value: '',
                                                text: '-- Where to shift to? --'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                inputs: [
                                    {
                                        id: 'shift_expected',
                                        placeholder: 'This is what you will get...',
                                        attributes: [
                                            {
                                                key: 'readonly',
                                                value: 'readonly'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                inputs: [
                                    {
                                        id: 'shift_pw',
                                        placeholder: 'Account password may be required?'
                                    }
                                ]
                            }
                        ],
                        buttons: {
                            forms: {
                                id: 'bs-shapeshift-submit',
                                type: 'submit',
                                css: 'btn-success pull-right',
                                text: 'Submit Request'
                            }
                        }
                    }
                ]               
            };
            var template = $.fn.blockstrap.html.form();
            var html = Mustache.render(template, shapeshift.accounts(form));
            $.fn.blockstrap.core.modal(title, contents + html);
        });
    }
    
    shapeshift.forms = function()
    {
        $('body').on('change', 'form#bs-shapeshift #shift_from, form#bs-shapeshift #shift_to, form#bs-shapeshift #shift_amount', function(e)
        {
            var id = false;
            var from = $('form#bs-shapeshift #shift_from').val().split('-');
            var to = $('form#bs-shapeshift #shift_to').val().split('-');
            var amount = parseInt(parseFloat($('form#bs-shapeshift #shift_amount').val()) * 100000000);
            var from_code = from[0];
            var to_code = to[0];
            var from_address = false;
            var to_address = false;
            if(typeof from[1] != 'undefined') from_address = from[1];
            if(typeof from[2] != 'undefined') id = from[2];
            if(typeof to[1] != 'undefined') to_address = to[1];
            $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-from-code', from_code);
            $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-from-address', from_address);
            $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-from-id', id);
            $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-to-code', to_code);
            $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-to-address', to_address);
            shapeshift.markets(
                from_code + '_' + to_code,
                function(response)
                {
                    if(
                        typeof response.rate != 'undefined'
                        && typeof response.minerFee != 'undefined'
                        && typeof response.minimum != 'undefined'
                        && typeof response.limit != 'undefined'
                    ){
                        var to_fee = parseInt(response.minerFee * 100000000);
                        var to_minimum = parseInt(response.minimum * 100000000);
                        var to_limit = parseInt(response.limit * 100000000);
                        var new_total = parseFloat(((amount * response.rate) - to_fee) / 100000000).toFixed(8);
                        $('form#bs-shapeshift #shift_expected').val(new_total);
                        $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-to-fee', to_fee);
                        $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-to-limit', to_limit);
                        $('form#bs-shapeshift #bs-shapeshift-submit').attr('data-to-minimum', to_minimum);
                    }
                }
            );
        });
        $('body').on('submit', 'form#bs-shapeshift', function(e)
        {
            e.preventDefault();
            var form = $(this);
            var title = 'Warning';
            var contents = 'Missing required fields';
            var from_code = $(form).find('#bs-shapeshift-submit').attr('data-from-code');
            var from_address = $(form).find('#bs-shapeshift-submit').attr('data-from-address');
            var account_id = $(form).find('#bs-shapeshift-submit').attr('data-from-id');
            var to_code = $(form).find('#bs-shapeshift-submit').attr('data-to-code');
            var to_address = $(form).find('#bs-shapeshift-submit').attr('data-to-address');
            var to_fee = parseInt($(form).find('#bs-shapeshift-submit').attr('data-to-fee'));
            var to_limit = parseInt($(form).find('#bs-shapeshift-submit').attr('data-to-limit'));
            var to_minimum = parseInt($(form).find('#bs-shapeshift-submit').attr('data-to-minimum'));
            var to_minimum_display = parseFloat(to_minimum / 100000000).toFixed(8);
            var to_limit_display = parseFloat(to_limit / 100000000).toFixed(8);
            var amount = parseInt(parseFloat($(form).find('#shift_amount').val()) * 100000000);
            var pw = $(form).find('#shift_pw').val();
            if(from_code && from_address && to_code && to_address && amount && to_fee && to_limit && to_minimum && pw && account_id)
            {
                if(from_address != to_address)
                {
                    $.fn.blockstrap.api.balance(from_address, from_code, function(balance)
                    {
                        var fee = $.fn.blockstrap.settings.blockchains[from_code].fee * 100000000;
                        var total_to_minimum = to_minimum + fee;
                        if(balance && (balance - fee) >= amount)
                        {
                            if(amount >= to_minimum)
                            {
                                if(amount <= to_limit)
                                {
                                    var pair = from_code + '_' + to_code;
                                    var private_key = '';
                                    $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
                                    {
                                        if(salt)
                                        {
                                            var account = $.fn.blockstrap.accounts.get(account_id);
                                            if(
                                                typeof account.blockchains != 'undefined'
                                                && typeof account.blockchains[from_code] != 'undefined'
                                            ){
                                                account = account.blockchains[from_code];
                                            }
                                            var fields = [
                                                {
                                                    id: 'wallet_name',
                                                    value: account.name
                                                },
                                                {
                                                    id: 'wallet_password',
                                                    value: pw
                                                }
                                            ];
                                            $.fn.blockstrap.accounts.verify(account, fields, function(verified, keys)
                                            {
                                                if(verified === true)
                                                {
                                                    shapeshift.shift(pair, to_address, from_address, function(response)
                                                    {
                                                        if(
                                                            typeof response.orderId != 'undefined'
                                                            && typeof response.deposit != 'undefined'
                                                        ){
                                                            var id = response.orderId;
                                                            var deposit_address = response.deposit;
                                                            $.fn.blockstrap.blockchains.send(
                                                                deposit_address,
                                                                amount, 
                                                                from_address, 
                                                                keys, 
                                                                function(response)
                                                                {
                                                                    if(typeof response.txid != 'undefined')
                                                                    {
                                                                        title = 'Success';
                                                                        contents = '<p>We have sent your coins to shapeshift.</p>';
                                                                        contents+= '<p>You may require your Transaction ID:<br />' + response.txid + '</p>';
                                                                        contents+= '<p>You may also require your Order ID: ' + id + '</p>';
                                                                        contents+= '<p>Please note that the conversion process typically takes between two to ten minutes, so please be patient...</p>';
                                                                    }
                                                                    else
                                                                    {
                                                                        title = 'Warning';
                                                                        contents = '<p>Error processing transaction.</p>';
                                                                        contents+= '<p>You may require your Order ID: ' + id + '</p>';
                                                                    }
                                                                    $.fn.blockstrap.core.modal(title, contents);
                                                                }, 
                                                                from_code
                                                            );
                                                        }
                                                    });
                                                }
                                                else
                                                {
                                                    contents = 'Password does not match account details';
                                                    $.fn.blockstrap.core.modal(title, contents);
                                                }
                                            });
                                        }
                                        else
                                        {
                                            contents = 'Missing required device salt in order to utilize account password';
                                            $.fn.blockstrap.core.modal(title, contents);
                                        }
                                    });
                                }
                                else
                                {
                                    contents = 'The maximum you can exchange is ' + to_limit_display;
                                    $.fn.blockstrap.core.modal(title, contents);
                                }
                            }
                            else
                            {
                                contents = 'The minimum required amount to exchange is ' + to_minimum_display;
                                $.fn.blockstrap.core.modal(title, contents);
                            }
                        }
                        else
                        {
                            var funds = 'In fact, you do not have any balance at all.';
                            if((balance - fee)  < amount)
                            {
                                funds = '<p>You only have a balance of ' + parseFloat(balance / 100000000).toFixed(8) + '.</p>';
                            }
                            else if(balance)
                            {
                                funds = '<p>You only have a balance of ' + parseFloat(balance / 100000000).toFixed(8) + '.</p>';
                                funds+= '<p>You require at least ' + parseFloat(total_to_minimum / 100000000).toFixed(8) + '.</p>';
                            }
                            contents = '<p>You do not have enough available funds.</p><p>' + funds + '</p>';
                            $.fn.blockstrap.core.modal(title, contents);
                        }
                    });
                }
                else
                {
                    contents = 'You cannot use shapeshift with the same addresses';
                    $.fn.blockstrap.core.modal(title, contents);
                }
            }
            else
            {
                $.fn.blockstrap.core.modal(title, contents);
            }
        } );
    }
    
    shapeshift.init = function()
    {
        shapeshift.buttons();
        shapeshift.forms();
    }
    
    shapeshift.markets = function(pair, callback)
    {
        var url = shapeshift_urls.markets;
        if(typeof pair != 'undefined' && pair) url+= pair + '/';
        $.ajax({
            url: url,
            success: function(response)
            {
                if(typeof callback != 'undefined' && $.isFunction(callback)) callback(response);
            },
            error: function(response)
            {
                if(typeof callback != 'undefined' && $.isFunction(callback)) callback(false);
            }
        });
    }
    
    shapeshift.shift = function(pair, to_address, from_address, callback)
    {
        var url = shapeshift_urls.shift;
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                pair: pair,
                withdrawal: to_address,
                returnAddress: from_address
            },
            success: function(response)
            {
                if(typeof callback != 'undefined' && $.isFunction(callback)) callback(response);
            },
            error: function(response)
            {
                if(typeof callback != 'undefined' && $.isFunction(callback)) callback(false);
            }
        });
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {shapeshift:shapeshift});
    
    // QUICK FIX FOR NOW - IF ADDING AN ACTION FROM WITHIN A PLUGIN 
    // THAT CALLS THAT SAME PLUGIN - IT MUST BE ADDED AFTER THE MERGE
    $.fn.blockstrap.core.add_action(
        'init',
        'shapeshift_init',
        'plugins.shapeshift',
        'init'
    );
})
(jQuery);
