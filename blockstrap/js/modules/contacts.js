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
    var contacts = {};
    
    // FUNCTIONS FOR OBJECT
    contacts.new = function(name, address, currency, fields, callback)
    {
        if(name && address && fields)
        {
            var id = blockstrap_functions.slug(name);
            $.fn.blockstrap.data.find('contacts', id, function(contact)
            {
                if(contact)
                {
                    $.fn.blockstrap.core.loader('close');
                    $.fn.blockstrap.core.modal('Warning', 'This contact already exists');
                }
                else
                {
                    var data = {};
                    if($.isPlainObject(fields))
                    {
                        $.each(fields, function(k, v)
                        {
                            if(v !== name && v !== address)
                            {
                                data[k] = v;
                            }
                        });
                    };
                    var currencies = [];
                    var addresses = [];
                    addresses.push({key:address});
                    currencies.push({
                        code: currency,
                        currency: $.fn.blockstrap.settings.currencies[currency].currency,
                        addresses: addresses
                    });
                    contact = {
                        id: id,
                        name: name,
                        currencies: currencies,
                        data: data,
                        tx_to: 0,
                        tx_from: 0
                    };
                    $.fn.blockstrap.data.save('contacts', id, contact, function()
                    {
                        callback(contact);
                    });
                }
            });
               
        }
        else
        {
            $.fn.blockstrap.core.loader('close');
            $.fn.blockstrap.core.modal('Warning', 'Currency not supported');
        }
    }
    
    contacts.get = function()
    {
        var contacts = [];
        if($.isPlainObject(localStorage))
        {
            $.each(localStorage, function(key, contact)
            {
                if(key.substring(0, 12) === 'nw_contacts_')
                {
                    contacts.push($.parseJSON(contact));
                }
            });
        }
        return contacts;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {contacts:contacts});
})
(jQuery);
