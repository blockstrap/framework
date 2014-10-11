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
    
    currencies.keys = function(secret, currency)
    {
        var keys = {};
        var hash = bitcoin.crypto.sha256(secret);
        if(!currency || currency == "btc") currency = "bitcoin";
        else if(currency == "ltc") currency = "litecoin";
        else if(currency == "doge") currency = "dogecoin";
        else if(currency == "btct") currency = "testnet";
        else if(currency == "ltct") currency = "litecoin";
        else if(currency == "doget") currency = "dogecoin";
        try
        {
            var raw_keys = bitcoin.HDNode.fromSeedBuffer(hash, bitcoin.networks[currency]);
            keys.pub = raw_keys.pubKey.getAddress(bitcoin.networks[currency]).toString();
            keys.priv = raw_keys.privKey.toWIF(bitcoin.networks[currency]);
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
        if(this_fee) fee = this_fee;
        if(amount_to_send) total = amount_to_send;
        
        $.each(inputs, function(i, o)
        {
            balance+= o.value;
            tx.addInput(o.txid, o.n);
        });
        $.each(outputs, function(i, o)
        {
            tx.addOutput(o.address, o.value)
        });
        if(balance > (total + fee))
        {
            var change = balance - (total + fee);
            tx.addOutput(return_to, change);
        }
        
        var key = bitcoin.ECKey.fromWIF(privkey);
        tx.sign(0, key);
        var raw = tx.toHex();
        return raw;
    }
    
    currencies.send = function(to_address, to_amount, from_address, keys, callback)
    {
        var available_balance = 0;
        var private_key = keys.priv;
        var fee = $.fn.blockstrap.settings.currencies.btc.fee * 100000000;
        $.fn.blockstrap.api.balance(from_address, 'btc', function(balance)
        {
            if(balance - fee >= to_amount)
            {
                $.fn.blockstrap.api.unspents(keys.pub, 'btc', function(unspents)
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
                            available_balance = available_balance + unspent.value;
                        });
                        var raw_transaction = currencies.raw(
                            from_address, 
                            private_key, 
                            inputs, 
                            outputs, 
                            fee, 
                            to_amount
                        );
                        $.fn.blockstrap.api.relay(raw_transaction, 'btc', function(tx)
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
