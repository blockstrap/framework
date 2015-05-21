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
    var multisig = {};
    
    multisig.generate = function(seed, chain, keys, required)
    {
        if(typeof keys == 'undefined')
        {
            keys = 3;
        }
        if(typeof required == 'undefined' || !rparseInt(equired))
        {
            required = 2;
        }
        if(typeof seed == 'undefined' || !seed)
        {
            var seed = navigator.userAgent + Date.now();
        }
        if(typeof chain == 'undefined' || !chain)
        {
            var chain = 'btc';
        }
        var address = false;
        var key_pairs = keys;
        if(typeof keys == 'number')
        {
            key_pairs = $.fn.blockstrap.blockchains.keys(seed, chain, keys);
        }
        if($.isArray(key_pairs))
        {
            key_pairs.map(function(obj)
            {
                return bitcoin.Script.fromHex($.fn.blockstrap.core.string_to_hex(obj.pub)).toBuffer();
            });
            var redeem_script = bitcoin.scripts.multisigOutput(required, key_pairs); // 2 of 3
            var script_pub_key = bitcoin.scripts.scriptHashOutput(redeem_script.getHash());
            var lib = $.fn.blockstrap.settings.blockchains[chain].lib;
            address = bitcoin.Address.fromOutputScript(script_pub_key, bitcoin.networks[lib]).toString();
        }
        return address;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {multisig:multisig});
})
(jQuery);
