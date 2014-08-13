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
    // EMPTY OBJECT
    var accounts = {};
    
    // FUNCTIONS FOR OBJECT
    accounts.new = function(currency, name, password, keys, callback)
    {
        var key = '';
        var slug = blockstrap_functions.slug(name);
        $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
        {
            if(!salt)
            {
                $.fn.blockstrap.core.modal('Error', 'No salt set for this device');
            }
            else
            {
                $.fn.blockstrap.data.find('accounts', slug, function(account)
                {
                    if(account)
                    {
                        $.fn.blockstrap.core.modal('Warning', 'This account already exists');
                    }
                    else
                    {
                        if($.isPlainObject(keys))
                        {
                            var values = keys;
                            keys = [];
                            $.each(values, function(k, v)
                            {
                                keys.push(k);
                                key_obj = CryptoJS.SHA3(salt+key+k+v, { outputLength: 512 });
                                key = key_obj.toString();
                            });
                        };
                        var address_key = new Bitcoin.ECKey(key);
                        var address = address_key.getBitcoinAddress().toString();
                        var pw_obj = CryptoJS.SHA3(salt+password, { outputLength: 512 });
                        var pw = pw_obj.toString();
                        var account = {
                            currency: currency,
                            name: name,
                            password: pw,
                            keys: keys,
                            address: address
                        };
                        $.fn.blockstrap.data.save('accounts', slug, account, function()
                        {
                            callback(account);
                        });
                    }
                });
            }
        });
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {accounts:accounts});
})
(jQuery);
