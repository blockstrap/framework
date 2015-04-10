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
    var blockchains = {};
    var temp_blockchain_validation = [
        {
            "code": "btc",
            "starts": ['1', '3']
        },
        {
            "code": "ltc",
            "starts": ['L']
        },
        {
            "code": "dash",
            "starts": ['X']
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
            "code": "dash",
            "starts": ['y']
        },
        {
            "code": "doget",
            "starts": ['n']
        }
    ];
    
    blockchains.check = function(address)
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
        // THIS CAN THEN BE USED FOR TEMPORARY BLOCKCHAIN VERIFICATION
        return address.charAt(0);
    }
    
    blockchains.key = function(code)
    {
        var bs = $.fn.blockstrap;
        if(!code) code = 'btc';
        if(
            !$.isPlainObject(bs.settings.blockchains) 
            || !$.isPlainObject(bs.settings.blockchains[code]) 
            || typeof bs.settings.blockchains[code].lib == 'undefined'
        ){
            code = 'btc';
        }
        if(
            $.isPlainObject(bs.settings.blockchains[code]) 
            && typeof bs.settings.blockchains[code].lib != 'undefined'
        ){
            return bs.settings.blockchains[code].lib;
        }
        else
        {
            return 'bitcoin';
        }
    }
    
    blockchains.keys = function(secret, blockchain)
    {
        var keys = {};
        var hash = bitcoin.crypto.sha256(secret);
        var blockchain_key = blockchains.key(blockchain);
        var blockchain_obj = bitcoin.networks[blockchain_key];
        try
        {
            var raw_keys = bitcoin.HDNode.fromSeedBuffer(hash, blockchain_obj);
            keys.pub = raw_keys.pubKey.getAddress(blockchain_obj).toString();
            keys.priv = raw_keys.privKey.toWIF(blockchain_obj);
        }
        catch(error)
        {
            keys.pub = false;
            keys.priv = false;
        }
        return keys;
    }
    
    blockchains.raw = function(return_to, privkey, inputs, outputs, this_fee, amount_to_send)
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
            if(change > 0)
            {
                tx.addOutput(return_to, change);
            }
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
    
    blockchains.send = function(
        to_address, 
        to_amount, 
        from_address, 
        keys, 
        callback, 
        blockchain
    ){
        var available_balance = 0;
        var private_key = keys.priv;
        if(!blockchain) blockchain = 'btc';
        var fee = $.fn.blockstrap.settings.blockchains[blockchain].fee * 100000000;
        $.fn.blockstrap.api.balance(from_address, blockchain, function(balance)
        {
            if(
                blockchain != $.fn.blockstrap.blockchains.which(to_address)
                || blockchain != $.fn.blockstrap.blockchains.which(from_address)
            ){
                $.fn.blockstrap.core.loader('close');
                var content = 'Incompatible addresses. Please ensure you are sending to and from the same blockchain.';
                $.fn.blockstrap.core.modal('Warning', content);
                return false;
            }
            else if(balance - fee >= to_amount)
            {
                $.fn.blockstrap.api.unspents(keys.pub, blockchain, function(unspents)
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
                        var raw_transaction = blockchains.raw(
                            from_address, 
                            private_key, 
                            inputs, 
                            outputs, 
                            fee, 
                            to_amount
                        );
                        $.fn.blockstrap.api.relay(raw_transaction, blockchain, function(tx)
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
    
    blockchains.validate = function(address)
    {
        try 
        {
            var results = blockchains.check(address);
            return results;
        } 
        catch(e) 
        {
            return false;
        }
    }
    
    blockchains.which = function(address)
    {
        try 
        {
            var key = blockchains.validate(address);
        } 
        catch(error) 
        {
            // if decoding fails, assume invalid address
            return false;
        }
        // TODO: NEED PROPER CHECKSUM HANDLING HERE
        // LATEST VERSION OF BITCOINJS-LIB SEEMED TO BE MISSING IT :-(
        // FOR NOW - WE WILL USE A HACKY CHECK ON ADDRESSES
        var blockchain = false;
        if($.isArray(temp_blockchain_validation))
        {
            $.each(temp_blockchain_validation, function(k, coin)
            {
                $.each(coin.starts, function(index, character)
                {
                    if(character == key) blockchain = coin.code;
                });
            });
        }
        return blockchain;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {blockchains:blockchains});
})
(jQuery);
