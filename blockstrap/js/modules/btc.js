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
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {btc:btc});
})
(jQuery);
