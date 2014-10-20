/*
 * 
 *  Blockstrap v0.4.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 * 
 */
(function($) 
{
    var currencies = {};
    var temp_currencies = [
        {
            "code": "btc",
            "starts": ['1', '3']
        },
        {
            "code": "ltc",
            "starts": ['L']
        },
        {
            "code": "doge",
            "starts": ['D']
        },
        {
            "code": "btct",
            "starts": ['m', 'n']
        },
        {
            "code": "ltct",
            "starts": ['m, n']
        },
        {
            "code": "doget",
            "starts": ['n']
        }
    ];
    
    currencies.check = function(address)
    {
        try 
        {
            var decoded_hex = Crypto.util.base64ToBytes(address);
        } 
        catch(error) 
        {
            // if decoding fails, assume invalid address
            return false;
        }
        var decoded = bitcoin.Script.fromHex(decoded_hex).toBuffer();
        if (decoded.length != 25) {
            return false;
        }
        // IF PASSING THIS FAR RETURN BACK FIRST CHARACTER OF ADDRESS
        // THIS CAN THEN BE USED FOR TEMPORARY CURRENCY VERIFICATION
        return address.charAt(0);
    }
    
    currencies.key = function(code)
    {
        var bs = $.fn.blockstrap;
        if(!code) code = 'btc';
        if(
            !$.isPlainObject(bs.settings.currencies) 
            || !$.isPlainObject(bs.settings.currencies[code]) 
            || typeof bs.settings.currencies[code].lib == 'undefined'
        ){
            code = 'btc';
        }
        if(
            $.isPlainObject(bs.settings.currencies[code]) 
            && typeof bs.settings.currencies[code].lib != 'undefined'
        ){
            return bs.settings.currencies[code].lib;
        }
        else
        {
            return 'bitcoin';
        }
    }
    
    currencies.keys = function(secret, currency)
    {
        var keys = {};
        var hash = bitcoin.crypto.sha256(secret);
        var currency_key = currencies.key(currency);
        var currency_obj = bitcoin.networks[currency_key];
        try
        {
            var raw_keys = bitcoin.HDNode.fromSeedBuffer(hash, currency_obj);
            keys.pub = raw_keys.pubKey.getAddress(currency_obj).toString();
            keys.priv = raw_keys.privKey.toWIF(currency_obj);
        }
        catch(error)
        {
            keys.pub = false;
            keys.priv = false;
        }
        return keys;
    }
    
    currencies.raw = function(return_to, privkey, inputs, outputs, this_fee, amount_to_send)
    {
        tx = new bitcoin.Transaction();
        
        var fee = 0;
        var balance = 0;
        var total = 0;
        var input_index = 0;
        var key = bitcoin.ECKey.fromWIF(privkey);
        var inputs_to_sign = [];
        var debug = false;
        
        if(this_fee) fee = this_fee;
        if(amount_to_send) total = amount_to_send;
        
        if(debug)
        {
            console.log('inputs', inputs);
            console.log('outputs', outputs);
        }

        $.each(inputs, function(i, o)
        {
            if(balance <= (amount_to_send + fee))
            {
                balance+= o.value;
                tx.addInput(o.txid, o.n);
                inputs_to_sign.push(input_index);
                input_index++;
            }
        });
        $.each(outputs, function(i, o)
        {
            tx.addOutput(o.address, o.value)
        });
        if(balance >= (total + fee))
        {
            var change = balance - (total + fee);
            tx.addOutput(return_to, change);
        }
        $.each(inputs_to_sign, function(k)
        {
            tx.sign(k, key);
        });
        var raw = tx.toHex();
        if(debug)
        {
            console.log('raw', raw);
            return false;
        }
        else return raw;
    }
    
    currencies.send = function(
        to_address, 
        to_amount, 
        from_address, 
        keys, 
        callback, 
        currency
    ){
        var available_balance = 0;
        var private_key = keys.priv;
        if(!currency) currency = 'btc';
        var fee = $.fn.blockstrap.settings.currencies[currency].fee * 100000000;
        $.fn.blockstrap.api.balance(from_address, currency, function(balance)
        {
            if(balance - fee >= to_amount)
            {
                $.fn.blockstrap.api.unspents(keys.pub, currency, function(unspents)
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
                            //available_balance = available_balance + unspent.value;
                        });
                        var raw_transaction = currencies.raw(
                            from_address, 
                            private_key, 
                            inputs, 
                            outputs, 
                            fee, 
                            to_amount
                        );
                        $.fn.blockstrap.api.relay(raw_transaction, currency, function(tx)
                        {
                            if(tx && tx.txid)
                            {
                                if(callback) callback(tx);
                            }
                            else
                            {
                                $.fn.blockstrap.core.loader('close');
                                if(callback) callback(false);
                            }
                        });
                    }
                    else
                    {
                        $.fn.blockstrap.core.loader('close');
                        if(callback) callback(false);
                    }
                });
            }
            else
            {
                var content = 'Insufficient funds to relay transaction.';
                $.fn.blockstrap.core.modal('Warning', content);
                if(callback) callback(false);
            }
        });
    }
    
    currencies.validate = function(address)
    {
        try 
        {
            var results = currencies.check(address);
            return results;
        } 
        catch(e) 
        {
            return false;
        }
    }
    
    currencies.which = function(address)
    {
        try 
        {
            var key = currencies.validate(address);
        } 
        catch(error) 
        {
            // if decoding fails, assume invalid address
            return false;
        }
        // TODO: NEED PROPER CHECKSUM HANDLING HERE
        // LATEST VERSION OF BITCOINJS-LIB SEEMED TO BE MISSING IT :-(
        // FOR NOW - WE WILL USE A HACKY CHECK ON ADDRESSES
        var currency = false;
        if($.isArray(temp_currencies))
        {
            $.each(temp_currencies, function(k, coin)
            {
                $.each(coin.starts, function(index, character)
                {
                    if(character == key) currency = coin.code;
                });
            });
        }
        return currency;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {currencies:currencies});
})
(jQuery);
