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
                if(obj.value) content+= obj.value.toLocaleString();
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
    };
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {markets:markets});
})
(jQuery);
