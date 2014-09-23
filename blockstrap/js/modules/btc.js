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
    var btc = {};
    var vals = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var positions = {};
    for (var i=0 ; i < vals.length ; ++i) 
    {
        positions[vals[i]] = i;
    }
    
    btc.check = function(input)
    {
        var bytes = btc.decode(input);
        var front = bytes.slice(0,bytes.length-4);
        var back = bytes.slice(bytes.length-4);
        var checksum = Crypto.SHA256(Crypto.SHA256(front,{asBytes: true}), {asBytes: true}).slice(0,4);
        if (""+checksum != ""+back)
        {
            throw new Error("Checksum failed");
        }
        var o = front.slice(1);
        o.version = front[0];
        return o;
    }
    
    btc.decode = function(input)
    {
        var base = BigInteger.valueOf(58);
        var length = input.length;
        var num = BigInteger.valueOf(0);
        var leading_zero = 0;
        var seen_other = false;
        for(var i=0; i<length ; ++i)
        {
            var chr = input[i];
            var p = positions[chr];
            // if we encounter an invalid character, decoding fails
            if (p === undefined)
            {
                throw new Error('invalid base58 string: ' + input);
            }
            num = num.multiply(base).add(BigInteger.valueOf(p));
            if(chr == '1' && !seen_other)
            {
                ++leading_zero;
            }
            else
            {
                seen_other = true;
            }
        }
        var bytes = num.toByteArrayUnsigned();
        // remove leading zeros
        while(leading_zero-- > 0)
        {
            bytes.unshift(0);
        }
        return bytes;
    }

    btc.encode = function(pt, compressed)
    {
        var x = pt.getX().toBigInteger();
        var y = pt.getY().toBigInteger();
        var enc = integerToBytes(x, 32);
        if(compressed)
        {
            if(y.isEven())
            {
                enc.unshift(0x02);
            }
            else
            {
                enc.unshift(0x03);
            }
        }
        else
        {
            enc.unshift(0x04);
            enc = enc.concat(integerToBytes(y, 32));
        }
        return enc;
    }
    
    btc.encrypt = function(string, key)
    {
        return '' + CryptoJS.AES.encrypt(string, Crypto.SHA256(key));
    }
    
    btc.keys = function(secret, password)
    {
        var hash_str = Crypto.SHA256(secret);
        var hash = Crypto.util.hexToBytes(hash_str);
        var eckey = new Bitcoin.ECKey(hash);
        var pass = password || hash_str;
        var result = false;
        try
        {
            var curve = getSECCurveByName("secp256k1");
            var gen_pt = curve.getG().multiply(eckey.priv);
            eckey.pub = this.encode(gen_pt, false);
            eckey.pubKeyHash = Bitcoin.Util.sha256ripe160(eckey.pub);
            var pub = eckey.getBitcoinAddress();
            var priv = new Bitcoin.Address(hash);
            priv.version = 128;
            var payload = this.encrypt(hash_str+','+pub+','+priv, hash_str);
            result = {'result':1, 'secret':hash_str, 'pubkey':pub, 'privkey':priv, 'payload':payload, 'payload_hash':Crypto.SHA256(payload), 'response':'keys generated'};
        }
        catch(error)
        {
            result = {'result':0, 'error':error, 'response':base.lang('Invalid secret exponent (must be non-zero value)')};
        }
        return result;
    }
    
    btc.raw = function(return_address, privkey, inputs, outputs, this_fee, amount_to_send)
    {
        var secret = btc.decode(privkey).slice(1, 33);
        var eckey = new Bitcoin.ECKey(secret);
        var fee = 0;
        var balance = 0;
        var total = 0;
        if(this_fee) fee = this_fee;
        if(amount_to_send) total = amount_to_send;
        TX.init(eckey);
        $.each(inputs, function(i, o)
        {
            balance+= o.value;
            TX.addInputs(o, TX.getAddress());
        });
        $.each(outputs, function(i, o)
        {
            TX.addOutput(outputs[i].address, parseInt(outputs[i].value) / 100000000);
        });
        if(balance >= (total + fee))
        {
            var change = balance - (total + fee);
            TX.addOutput(return_address, parseInt(change) / 100000000);
        }
        var sendTx = (TX.construct());
        return Crypto.util.bytesToHex(sendTx.serialize());
    }
    
    btc.validate = function(address)
    {
        try 
        {
            btc.check(address);
            return true;
        } 
        catch(e) 
        {
            return false;
        }
    }
    
    btc.send = function(to_address, to_amount, from_address, keys, callback)
    {
        var private_key = keys.privkey.toString();
        var fee = $.fn.blockstrap.settings.currencies.btc.fee * 100000000;
        $.fn.blockstrap.api.balance(from_address, 'btc', function(balance)
        {
            if(balance - fee > to_amount)
            {
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
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {btc:btc});
})
(jQuery);
