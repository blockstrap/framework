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
    var vals = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var positions = {};
    for (var i=0 ; i < vals.length ; ++i) 
    {
        positions[vals[i]] = i;
    }
    
    currencies.check = function(input)
    {
        console.log('check is missing!');
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
            btc.check(address);
            return true;
        } 
        catch(e) 
        {
            return false;
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {currencies:currencies});
})
(jQuery);
