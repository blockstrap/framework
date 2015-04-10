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
    var contacts = {};
    
    contacts.get = function(id)
    {
        var contacts = false;
        if(localStorage)
        {
            $.each(localStorage, function(key, contact)
            {
                if(key.substring(0, 12) === 'nw_contacts_')
                {
                    if(!$.isArray(contacts)) contacts = [];
                    if(id && key == 'nw_contacts_' + id) contacts.push($.parseJSON(contact));
                    else if(!id) contacts.push($.parseJSON(contact));
                }
            });
        }
        return contacts;
    }
    
    contacts.new = function(name, address, blockchain, fields, callback)
    {
        var addresses = address;
        if(!$.isPlainObject(address) && !$.fn.blockstrap.blockchains.validate(address))   
        {
            callback();
            $.fn.blockstrap.core.modal('Error', 'This is not a valid address!');
        }
        else
        {
            if(!$.isPlainObject(address))   
            {
                addresses = {};
                addresses[blockchain].address = address;
            }
            if(name && fields)
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
                        var blockchains_to_save = [];
                        $.each(addresses, function(chain, obj)
                        {
                            var address = obj;
                            var blockchain = chain;
                            if($.fn.blockstrap.blockchains.which(address) != blockchain)
                            {
                                var which = $.fn.blockstrap.blockchains.which(address);
                                var blockchains = $.fn.blockstrap.settings.blockchains;
                                var blockchain_name = blockchains[which].blockchain;
                                var blockchain_selected = blockchains[blockchain].blockchain;
                                $.fn.blockstrap.core.loader('close');
                                $.fn.blockstrap.core.modal('Warning', 'This address does not match the blockchain you selected. You selected '+blockchain_name+' but the address you entered appears to be for '+blockchain_selected+'. This is not 100% accurate, and could be an internal problem.');
                                return false;
                            }
                            else
                            {
                                blockchains_to_save.push({
                                    code: blockchain,
                                    blockchain: $.fn.blockstrap.settings.blockchains[blockchain].blockchain,
                                    addresses: [
                                        {
                                            key: address
                                        }
                                    ]
                                });
                            }
                        });

                        var data = {};
                        if($.isPlainObject(fields))
                        {
                            $.each(fields, function(k, v)
                            {
                                if(v !== name && v !== address && v !== blockchain)
                                {
                                    data[k] = v;
                                }
                            });
                        };

                        var contact = {
                            id: id,
                            name: name,
                            blockchains: blockchains_to_save,
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
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {contacts:contacts});
})
(jQuery);
