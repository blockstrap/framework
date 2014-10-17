/*
 * 
 *  Blockstrap v0.4.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var markets = {};
    var conditions = {
        "btc_to_usd" : {
            text: "BTC to USD",
            prefix: "US$",
            value: 5555
        },
        "daily_txs": {
            text: "Daily TXs",
            value: 555
        },
        "daily_sent": {
            text: "Daily BTC Sent",
            value: 5555555
        },
        "hash_rate": {
            text: "Hash Rate GH/s",
            value: 555555
        },
        "btc_discovered": {
            text: "BTC Discovered",
            affix: "Million",
            value: 55
        },
        "market_cap": {
            text: "Market Cap US$",
            affix: "Billion",
            value: 55.5
        }
    };
    
    markets.filter = function(data)
    {
        var objs = [];']['
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
        var bs_auth = $.fn.blockstrap.settings.currencies.btc.auth;
        var username = bs_auth.blockstrap.username;
        var password = bs_auth.blockstrap.password;
        var url = 'http://api.blockstrap.com/v0/btc/marketStats';
        $.fn.blockstrap.api.request(url, function(results)
        {
            if(
                $.isPlainObject(results) 
                && $.isPlainObject(results.data)
                && results.status == 'success'
            ){
                var market = results.data.market;
                conditions['btc_to_usd']['value'] = market.price_24hr;
                conditions['daily_txs']['value'] = market.txn_count_24hr;
                conditions['daily_sent']['value'] = market.value_sent_24hr;
                conditions['hash_rate']['value'] = market.hashrate;
                conditions['btc_discovered']['value'] = (market.coins_discovered / 1000000);
                conditions['market_cap']['value'] = (market.marketcap / 1000000000);
            }
        }, 'GET', false, 'btc', false, username, password);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {markets:markets});
    
    // QUICK FIX FOR NOW - IF ADDING AN ACTION FROM WITHIN A PLUGIN 
    // THAT CALLS THAT SAME PLUGIN - IT MUST BE ADDED AFTER THE MERGE
    $.fn.blockstrap.core.add_actions(
        'init', 
        'market_updates',
        'plugins.markets', 
        'update', 
        conditions
    );
})
(jQuery);
