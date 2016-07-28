/*
 * 
 *  Blockstrap v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECT
    var theme = {};
    
    theme.filters = {
        contracts: function(bs, data)
        {
            var contracts = [];
            if(localStorage)
            {
                $.each(localStorage, function(key, contract)
                {
                    if(key.substring(0, 13) === 'nw_contracts_')
                    {
                        var this_contract = $.parseJSON(contract);
                        var decimal_divider = '1';
                        for(i = 0; i < this_contract.decimals; i++)
                        {
                            decimal_divider+= '0';
                        }
                        decimal_divider = parseInt(decimal_divider);
                        var supply_display = parseFloat(this_contract.supply / decimal_divider).toFixed(this_contract.decimals);
                        this_contract.supply_display = supply_display + ' ' + this_contract.symbol;
                        contracts.push(this_contract);
                    }
                });
            }
            return contracts;
        },
        tokens: function(bs, data)
        {
            var accounts = [];
            if(localStorage)
            {
                $.each(localStorage, function(key, account)
                {
                    if(key.substring(0, 10) === 'nw_tokens_')
                    {
                        var this_account = $.parseJSON(account);
                        this_account.currencies = [];
                        $.each(this_account.tokens, function(key, obj)
                        {
                            obj.code = key;
                            obj.balance_display = parseFloat((obj.balance / obj.one)) + ' ' + obj.symbol;
                            this_account.currencies.push(obj);
                        });
                        accounts.push(this_account);
                    }
                });
            }
            return accounts;
        }
    }
    
    // FUNCTIONS FOR OBJECT
    theme.new = function()
    {
        // DO NOT USE THIS UNLESS YOU REALLY NEED TOO
        // AND EVEN THEN - REALLY THINK ABOUT IT ...
        // UNLESS OF COURSE IT IS SPECIFIC TO THIS THEME
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {theme:theme});
})
(jQuery);