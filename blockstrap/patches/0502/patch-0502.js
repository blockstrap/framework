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
    var patch0502 = {};
    
    patch0502.init = function(callback)
    {
        var accounts = new Array();
        var $bs = blockstrap_functions;
        if(typeof localStorage != 'undefined')
        {
            $.each(localStorage, function(k, v)
            {
                if(k.substring(0, 12) == "nw_accounts_") 
                {
                    var new_chain = {
                        code: 'dash',
                        type: 'DashPay',
                        original: 'drk'
                    };
                    var account = $.parseJSON(v);
                    if(account.blockchain.code == 'drk' || account.blockchain.code == 'drkt')
                    {
                        if(account.blockchain.code == 'drkt')
                        {
                            new_chain.code = 'dasht';
                            new_chain.type = 'DashPay Testnet';
                            new_chain.original = 'drkt';
                        }
                        account.blockchain = new_chain;
                        delete account.currency;
                        // Now need to update TXS
                        if($.isPlainObject(account.txs) && $bs.array_length(account.txs) > 0)
                        {
                            $.each(account.txs, function(txk, txv)
                            {
                                var new_tx_chain = 'dash';
                                if(txv.blockchain == 'drk' || txv.blockchain == 'drkt')
                                {
                                    if(txv.blockchain == 'drkt')
                                    {
                                        new_tx_chain = 'dasht';
                                    }
                                    account.txs[txk].blockchain = new_tx_chain;
                                }
                            });
                        }
                        localStorage.setItem(k, JSON.stringify(account));
                    }
                    accounts.push(account);
                }
            });
        }
        callback();
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.patches, {patch0502:patch0502});
    
})
(jQuery);
