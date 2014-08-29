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
    // EMPTY OBJECTS
    var btc = {};
    var vals = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var positions = {};
    for (var i=0 ; i < vals.length ; ++i) 
    {
        positions[vals[i]] = i;
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
    
    btc.raw = function(return_address, privkey, these_inputs, these_outputs, this_fee, amount_to_send)
    {
        var secret = btc.decode(privkey).slice(1, 33);
        var secret = Bitcoin.Base58.decode(privkey).slice(1, 33);
        var eckey = new Bitcoin.ECKey(secret);
        var fee = 0;
        var balance = 0;
        var total = 0;
        if(this_fee) fee = this_fee;
        if(amount_to_send) total = amount_to_send;
        TX.init(eckey);
        $.each(these_inputs, function(i, o)
        {
            balance+= o.value;
            var unspent = {'txid':o.txid, 'n': o.n, 'script':o.script,'value': o.value*1};
            TX.addInputs(unspent, TX.getAddress());
        });
        $.each(these_outputs, function(i, o)
        {
            TX.addOutput(these_outputs[i].address, parseFloat(these_outputs[i].value));
        });
        if(balance > (total + fee))
        {
            var change = balance - (total + fee);
            TX.addOutput(return_address, parseFloat(change / 100000000).toFixed(8));
        }
        var sendTx = (TX.construct());
        return Crypto.util.bytesToHex(sendTx.serialize());
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {btc:btc});
})
(jQuery);
