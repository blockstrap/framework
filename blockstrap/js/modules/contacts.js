/*
 * 
 *  Blockstrap v0.6.0.1
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
        if(id) return $.fn.blockstrap.core.apply_filters('contacts_get', contacts[0]);
        else return $.fn.blockstrap.core.apply_filters('contacts_get', contacts);
    }
    
    contacts.new = function(name, address, blockchain, fields, callback, ignore_errors)
    {
        if(typeof ignore_errors == 'undefined') ignore_errors = false;
        else ignore_errors = true;
        var addresses = address;
        if(!$.isPlainObject(address) && !$.fn.blockstrap.blockchains.validate(address))   
        {
            if(!ignore_errors)
            {
                setTimeout(function()
                {
                    $.fn.blockstrap.core.modal('Error', 'This is not a valid address!');
                }, $.fn.blockstrap.core.timeouts('loader'));
            }
            $.fn.blockstrap.core.apply_actions('contacts_new', function()
            {
                callback();
            });
        }
        else
        {
            if(!$.isPlainObject(address))   
            {
                addresses = {};
                addresses[blockchain] = [];
                addresses[blockchain].push(address);
            }
            if(name && fields)
            {
                var id = blockstrap_functions.slug(name);
                $.fn.blockstrap.data.find('contacts', id, function(contact)
                {
                    if(contact)
                    {
                        $.fn.blockstrap.core.loader('close');
                        if(!ignore_errors)
                        {
                            setTimeout(function()
                            {
                                $.fn.blockstrap.core.modal('Warning', 'This contact already exists');
                            }, $.fn.blockstrap.core.timeouts('loader'));
                        }
                    }
                    else 
                    {
                        var blockchains_to_save = [];
                        $.each(addresses, function(chain, obj)
                        {
                            var address = obj[0];
                            var blockchain = chain;
                            if(!$.fn.blockstrap.blockchains.supported(blockchain))
                            {
                                // NOTHING
                            }
                            else if(
                                $.fn.blockstrap.blockchains.which(address) != blockchain
                                &&
                                (
                                    blockchain == 'ltct'
                                    && $.fn.blockstrap.blockchains.which(address) != 'btct'
                                )
                            ){
                                var which = $.fn.blockstrap.blockchains.which(address);
                                if(which)
                                {
                                    var blockchains = $.fn.blockstrap.settings.blockchains;
                                    var blockchain_name = blockchains[which].blockchain;
                                    var blockchain_selected = blockchains[blockchain].blockchain;
                                    $.fn.blockstrap.core.loader('close');
                                    if(!ignore_errors)
                                    {
                                        setTimeout(function()
                                        {
                                            $.fn.blockstrap.core.modal('Warning', 'This address does not match the blockchain you selected. You selected '+blockchain_name+' but the address you entered appears to be for '+blockchain_selected+'. This is not 100% accurate, and could be an internal problem.');
                                        }, $.fn.blockstrap.core.timeouts('loader'));
                                    }
                                    return false;
                                }
                            }
                            else if(
                                $.fn.blockstrap.blockchains.which(address) == blockchain
                                ||
                                (
                                    $.fn.blockstrap.blockchains.which(address) != blockchain
                                    && blockchain == 'ltct'
                                    && $.fn.blockstrap.blockchains.which(address) == 'btct'
                                )
                            ){
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
                            $.fn.blockstrap.core.apply_actions('contacts_new', function()
                            {
                                callback(contact);
                            }, contact);
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
