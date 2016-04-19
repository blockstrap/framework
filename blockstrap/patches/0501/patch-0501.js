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
    var patch0501 = {};
    
    patch0501.init = function(callback)
    {
        var accounts = new Array();
        var contacts = new Array();
        var $bs = blockstrap_functions;
        if(typeof localStorage != 'undefined')
        {
            $.each(localStorage, function(k, v)
            {
                if(k.substring(0, 12) == "nw_accounts_") 
                {
                    var account = $.parseJSON(v);
                    if(typeof account.currency != 'undefined')
                    {
                        account.blockchain = account.currency;
                        delete account.currency;
                        // Now need to update TXS
                        if($.isPlainObject(account.txs) && $bs.array_length(account.txs) > 0)
                        {
                            $.each(account.txs, function(txk, txv)
                            {
                                if(typeof txv.currency != 'undefined')
                                {
                                    account.txs[txk].blockchain = account.txs[txk].currency;
                                    delete account.txs[txk].currency;
                                }
                            });
                        }
                        localStorage.setItem(k, JSON.stringify(account));
                    }
                    accounts.push(account);
                }
                else if(k.substring(0, 12) == "nw_contacts_") 
                {
                    var contact = $.parseJSON(v);
                    if(typeof contact.currencies != 'undefined')
                    {
                        var bc = contact.currencies;
                        delete contact.currencies;
                        contact.blockchains = {
                            code: bc.code,
                            blockchain: bc.currency,
                            addresses: bc.addresses
                        }
                        localStorage.setItem(k, JSON.stringify(contact));
                    }
                    contacts.push(contact);
                }
            });
        }
        callback();
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.patches, {patch0501:patch0501});
    
})
(jQuery);
