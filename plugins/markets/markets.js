/*
 * 
 *  Blockstrap v0.4.1.0
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var markets = {};
    
    // THESE ARE DEFAULT CONDITIONS
    // IF API BEING USED DOES NOT SUPPORT MARKET API
    // THESE VALUES WILL NOT BE UPDATED UNLESS API SUPPORTS
    var conditions = {
        "price_usd_now" : {
            text: "BTC to USD",
            prefix: "US$",
            value: 5555
        },
        "tx_count_24hr": {
            text: "Daily TXs",
            value: 555
        },
        "sent_usd_24hr": {
            text: "Daily US$ Sent",
            affix: "Million",
            value: 5555555
        },
        "sent_coins_24hr": {
            text: "Daily BTC Sent",
            value: 555555
        },
        "coins_discovered": {
            text: "BTC Discovered",
            affix: "Million",
            value: 55
        },
        "marketcap": {
            text: "Market Cap US$",
            affix: "Billion",
            value: 55.5
        }
    };
    
    markets.filter = function(data)
    {
        var objs = [];
        if($.isArray(data))
        {
            $.each(data, function(k, object)
            {
                var css = '';
                var obj = false;
                var content = '';
                if(object.css) css = object.css;
                if(conditions[object.id]) obj = conditions[object.id];
                if(obj.prefix) content+= obj.prefix + ' ';
                if(obj.value) content+= Number(parseFloat(obj.value).toFixed(2)).toLocaleString();
                if(obj.affix) content+= ' ' + obj.affix;
                var html = markets.span(obj.text, content);
                objs.push({css: css, html: html});
            });
        }
        var market_conditions = Mustache.render($.fn.blockstrap.snippets['lists'], {
            objects: [
                {
                    id: 'market-conditions',
                    items: objs
                }
            ]
        });
        return market_conditions;
    }
    
    markets.span = function(title, content)
    {
        var html = "";
        html+= "<span class='panel-value'>"+content+"</span>";
        html+= "<span class='panel-description'>"+title+"</span>";
        return html;
    }
    
    markets.update = function()
    {
        $.fn.blockstrap.api.market('multi', '', function(results)
        {
            if(
                $.isPlainObject(results) 
                && typeof results.data != 'undefined'
                && typeof results.data.markets != 'undefined'
                && typeof results.data.markets.btc != 'undefined'
            )
            {
                results = results.data.markets.btc;
                if(results.fiat_usd_now)
                {
                    conditions['price_usd_now']['value'] = results.fiat_usd_now;
                }
                if(results.tx_count_24hr)
                {
                    conditions['tx_count_24hr']['value'] = results.tx_count_24hr;
                }
                if(results.output_value_24hr_fiat_now)
                {
                    conditions['sent_usd_24hr']['value'] = ((results.output_value_24hr_fiat_now / 1000000) / 100000000);
                }
                if(results.output_value_24hr)
                {
                    conditions['sent_coins_24hr']['value'] = (results.output_value_24hr / 100000000);
                }
                if(results.coinbase_value_todate)
                {
                    conditions['coins_discovered']['value'] = ((results.coinbase_value_todate / 1000000) / 100000000);
                }
                if(results.marketcap)
                {
                    conditions['marketcap']['value'] = (results.marketcap / 1000000000);
                }
            }
        }, 'blockstrap', true);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {markets:markets});
    
    // QUICK FIX FOR NOW - IF ADDING AN ACTION FROM WITHIN A PLUGIN 
    // THAT CALLS THAT SAME PLUGIN - IT MUST BE ADDED AFTER THE MERGE
    $.fn.blockstrap.core.add_action(
        'init', 
        'market_updates',
        'plugins.markets', 
        'update', 
        conditions
    );
})
(jQuery);
