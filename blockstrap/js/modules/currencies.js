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
