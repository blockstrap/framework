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
    var contacts = {};
    
    contacts.get = function()
    {
        var contacts = false;
        if(localStorage)
        {
            $.each(localStorage, function(key, contact)
            {
                if(key.substring(0, 12) === 'nw_contacts_')
                {
                    if(!$.isArray(contacts)) contacts = [];
                    contacts.push($.parseJSON(contact));
                }
            });
        }
        return contacts;
    }
    
    contacts.new = function(name, address, currency, fields, callback)
    {
        if(!$.fn.blockstrap.currencies.validate(address))
        {
            callback();
            $.fn.blockstrap.core.modal('Error', 'This is not a valid address!');
        }
        else if(name && address && fields)
        {
            var id = blockstrap_functions.slug(name);
            $.fn.blockstrap.data.find('contacts', id, function(contact)
            {
                if(contact)
                {
                    $.fn.blockstrap.core.loader('close');
                    $.fn.blockstrap.core.modal('Warning', 'This contact already exists');
                }
                else if($.fn.blockstrap.currencies.which(address) != currency)
                {
                    var which = $.fn.blockstrap.currencies.which(address);
                    var currencies = $.fn.blockstrap.settings.currencies;
                    console.log('which', which);
                    console.log('currency', currency);
                    var currency_name = currencies[which].currency;
                    var currency_selected = currencies[currency].currency;
                    $.fn.blockstrap.core.loader('close');
                    $.fn.blockstrap.core.modal('Warning', 'This address does not match the currency you selected. You selected '+currency_name+' but the address you entered appears to be for '+currency_selected+'. This is not 100% accurate, and could be an internal problem.');
                }
                else
                {
                    var data = {};
                    if($.isPlainObject(fields))
                    {
                        $.each(fields, function(k, v)
                        {
                            if(v !== name && v !== address && v !== currency)
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
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {contacts:contacts});
})
(jQuery);
