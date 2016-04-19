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
    var patch0600 = {};
    
    patch0600.init = function(callback)
    {
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        if(typeof localStorage != 'undefined')
        {
            $.each(localStorage, function(k, v)
            {
                if(k.substring(0, 12) == "nw_accounts_") 
                {
                    var new_chains = {};
                    var new_transactions = [];
                    var new_balance = '0.00000000';
                    var saved_account = $.parseJSON(v);
                    var usd_rates = 0;
                    if(
                        typeof bs.settings.exchange != 'undefined'
                        && typeof bs.settings.exchange.usd != 'undefined'
                    ){ 
                        usd_rates = bs.settings.exchange.usd;
                    }
                    if(typeof saved_account.blockchains == 'undefined')
                    {
                        if(typeof usd_rates[saved_account.blockchain.code] != 'undefined' && usd_rates[saved_account.blockchain.code] > 0)
                        {
                            new_balance = parseFloat(usd_rates[saved_account.blockchain.code] * saved_account.balance).toFixed(2);
                        }
                        new_chains[saved_account.blockchain.code] = {
                            type: bs.settings.blockchains[saved_account.blockchain.code].blockchain,
                            address: saved_account.address,
                            code: saved_account.blockchain.code,
                            tx_count: saved_account.tx_count,
                            balance: saved_account.balance,
                            display_balance: new_balance,
                            ts: saved_account.ts
                        };
                        $.each(saved_account.txs, function(k, tx)
                        {
                            new_transactions.push({
                                ts: saved_account.ts,
                                address: saved_account.address,
                                chain: saved_account.blockchain.code,
                                tx: tx,
                                txid: tx.txid
                            });
                        });
                        var account = {
                            id: saved_account.id,
                            blockchains: new_chains,
                            name: saved_account.name,
                            password: saved_account.password,
                            keys: saved_account.keys,
                            tx_total: saved_account.tx_count,
                            usd_total: new_balance,
                            txs: new_transactions
                        };
                        bs.data.save('accounts', saved_account.id, account, function()
                        {

                        });
                    }
                }
            });
        }
        callback();
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.patches, {patch0600:patch0600});
    
})
(jQuery);
