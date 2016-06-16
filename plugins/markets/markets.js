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
    var markets = {};
    
    $.fn.blockstrap.settings.exchange = {
        ts: 0,
        usd: {
            btc: 0,
            ltc: 0,
            doge: 0,
            btct: 0,
            ltct: 0,
            doget: 0
        }
    };
    
    // THESE ARE DEFAULT CONDITIONS
    // IF API BEING USED DOES NOT SUPPORT MARKET API
    // THESE VALUES WILL NOT BE UPDATED UNLESS API SUPPORTS
    var conditions = {
        "ts": 0,
        "price_usd_now" : {
            text: "BTC to USD",
            prefix: "US$",
            value: 0
        },
        "tx_count_24hr": {
            text: "Daily TXs",
            value: 0
        },
        "sent_usd_24hr": {
            text: "Daily US$ Sent",
            affix: "Billion",
            value: 0
        },
        "sent_coins_24hr": {
            text: "Daily BTC Sent",
            value: 0
        },
        "coins_discovered": {
            text: "BTC Discovered",
            affix: "Million",
            value: 0
        },
        "marketcap": {
            text: "Market Cap US$",
            affix: "Billion",
            value: 0
        }
    };
    
    $($.fn.blockstrap.element).on('click', '.btn-markets', function(e)
    {
        e.preventDefault();
        $.fn.blockstrap.core.loader('open');
        markets.updates(false, function()
        {
            $.fn.blockstrap.core.refresh(function()
            {
                
            }, $.fn.blockstrap.core.page())
        }, true);
    });
    
    markets.conditions = function(rates, callback, force_refresh)
    {
        var cache = 0;
        var now = (new Date().getTime()) / 1000;
        
        var refresh = false;
        if(typeof force_refresh != 'undefined' && force_refresh == true) refresh = true;
        
        if(
            typeof $.fn.blockstrap.settings.cache != 'undefined'
            && typeof $.fn.blockstrap.settings.cache.api != 'undefined'
            && typeof $.fn.blockstrap.settings.cache.api.markets != 'undefined'
        ){
            cache = $.fn.blockstrap.settings.cache.api.markets;
        }
        else if(
            typeof $.fn.blockstrap.settings.app != 'undefined'
            && typeof $.fn.blockstrap.settings.app.plugins != 'undefined'
            && typeof $.fn.blockstrap.settings.app.plugins.markets != 'undefined'
            && typeof $.fn.blockstrap.settings.app.plugins.markets.cache != 'undefined'
        ){
            cache = $.fn.blockstrap.settings.app.plugins.markets.cache;
        }
        
        $.fn.blockstrap.core.loading('FETCHING MARKET CONDITIONS', false);
        
        $.fn.blockstrap.data.find('market', 'conditions', function(data)
        {
            if(typeof data.ts == 'undefined' || (typeof data.ts != 'undefined' && (now > (data.ts + cache)) || refresh))
            {
                if(
                    typeof conditions.price_usd_now != 'undefined'
                    && typeof rates.usd != 'undefined'
                    && typeof rates.usd.btc != 'undefined'
                ){
                    conditions.price_usd_now.value = rates.usd.btc;
                    if(
                        typeof $.fn.blockstrap.settings.app != 'undefined'
                        && typeof $.fn.blockstrap.settings.app.plugins != 'undefined'
                        && typeof $.fn.blockstrap.settings.app.plugins.markets != 'undefined'
                        && typeof $.fn.blockstrap.settings.app.plugins.markets.map != 'undefined'
                        && typeof $.fn.blockstrap.settings.app.plugins.markets.map.txs != 'undefined'
                        && typeof $.fn.blockstrap.settings.app.plugins.markets.map.btc != 'undefined'
                        && typeof $.fn.blockstrap.settings.app.plugins.markets.map.total != 'undefined'
                    ){
                        var map = $.fn.blockstrap.settings.app.plugins.markets.map;
                        $.ajax({
                            url: map.txs.to,
                            success: function(txs_response)
                            {
                                var txs = parseInt(txs_response);
                                $.ajax({
                                    url: map.btc.to,
                                    success: function(btc_response)
                                    {
                                        var btc = parseInt(btc_response);
                                        $.ajax({
                                            url: map.total.to,
                                            success: function(total_response)
                                            {
                                                var total = parseInt(total_response);
                                                if(txs && btc && total)
                                                {
                                                    var now = (new Date().getTime()) / 1000;
                                                    conditions.ts = now;
                                                    conditions.tx_count_24hr.value = txs;
                                                    conditions.sent_coins_24hr.value = btc / 100000000;
                                                    conditions.sent_usd_24hr.value = parseFloat((parseFloat(conditions.sent_coins_24hr.value * conditions.price_usd_now.value).toFixed(2)) / 1000000000).toFixed(1);
                                                    conditions.coins_discovered.value = parseFloat((total / 100000000) / 1000000).toFixed(1);
                                                    conditions.marketcap.value = parseFloat((parseFloat((total / 100000000) * conditions.price_usd_now.value).toFixed(2)) / 1000000000).toFixed(1);
                                                    localStorage.setItem('nw_market_conditions', JSON.stringify(conditions));
                                                }
                                                if(callback) callback();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        if(callback) callback();
                    }
                }
                else
                {
                    if(callback) callback();
                }
            }
            else
            {
                if(
                    typeof data.ts != 'undefined'
                    && typeof data.tx_count_24hr != 'undefined'
                    && typeof data.sent_coins_24hr != 'undefined'
                    && typeof data.sent_usd_24hr != 'undefined'
                    && typeof data.coins_discovered != 'undefined'
                    && typeof data.marketcap != 'undefined'
                ){
                    conditions.price_usd_now.value = data.price_usd_now.value;
                    conditions.tx_count_24hr.value = data.tx_count_24hr.value;
                    conditions.sent_coins_24hr.value = data.sent_coins_24hr.value;
                    conditions.sent_usd_24hr.value = data.sent_usd_24hr.value;
                    conditions.coins_discovered.value = data.coins_discovered.value;
                    conditions.marketcap.value = data.marketcap.value;
                }
                if(callback) callback(conditions);
            }
        });
    }
    
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
                if(!obj.value)
                {
                    content+= 'N/A';
                    obj.text = 'unable to connect to source';
                }
                else 
                {
                    if(obj.prefix) content+= obj.prefix + ' ';
                    content+= $.fn.blockstrap.core.add_commas(Number(parseFloat(obj.value).toFixed(2)));
                    if(obj.affix) content+= ' ' + obj.affix;
                }
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
    
    markets.rates = function(callback, force_refresh)
    {
        var cache = 0;
        var url = false;
        var now = (new Date().getTime()) / 1000;
        
        var refresh = false;
        if(typeof force_refresh != 'undefined' && force_refresh == true) refresh = true;
        
        if(
            typeof $.fn.blockstrap.settings.cache != 'undefined'
            && typeof $.fn.blockstrap.settings.cache.api != 'undefined'
            && typeof $.fn.blockstrap.settings.cache.api.markets != 'undefined'
        ){
            cache = $.fn.blockstrap.settings.cache.api.markets;
        }
        else if(
            typeof $.fn.blockstrap.settings.app != 'undefined'
            && typeof $.fn.blockstrap.settings.app.plugins != 'undefined'
            && typeof $.fn.blockstrap.settings.app.plugins.markets != 'undefined'
            && typeof $.fn.blockstrap.settings.app.plugins.markets.cache != 'undefined'
        ){
            cache = $.fn.blockstrap.settings.app.plugins.markets.cache;
        }
        
        $.fn.blockstrap.core.loading('FETCHING EXCHANGE RATES', false);
        
        $.fn.blockstrap.data.find('market', 'exchange', function(data)
        {
            if(typeof data.ts == 'undefined' || (typeof data.ts != 'undefined' && (now > (data.ts + cache)) || refresh))
            {
                if(
                    typeof $.fn.blockstrap.settings.app != 'undefined'
                    && typeof $.fn.blockstrap.settings.app.plugins != 'undefined'
                    && typeof $.fn.blockstrap.settings.app.plugins.markets != 'undefined'
                    && typeof $.fn.blockstrap.settings.app.plugins.markets.map != 'undefined'
                    && typeof $.fn.blockstrap.settings.app.plugins.markets.map.rates != 'undefined'
                ){
                    var map = $.fn.blockstrap.settings.app.plugins.markets.map.rates;
                    var keys = false;
                    if(typeof map.to != 'undefined') url = map.to;
                    if(
                        typeof $.fn.blockstrap.settings.keys != 'undefined'
                        && typeof $.fn.blockstrap.settings.keys.plugins != 'undefined'
                        && typeof $.fn.blockstrap.settings.keys.plugins.markets != 'undefined'
                    ){
                        keys = $.fn.blockstrap.settings.keys.plugins.markets;
                        if(
                            keys
                            && typeof keys.key_name != 'undefined'
                            && typeof keys.key != 'undefined'
                        ){
                            url+= '?' + keys.key_name + '=' + keys.key;
                        }
                    }
                    if(url)
                    {
                        if(
                            typeof map.from != 'undefined'
                            && typeof map.from.ts != 'undefined'
                            && typeof map.from.rates != 'undefined'
                        ){
                            $.ajax({
                                url: url,
                                success: function(response)
                                {
                                    if(
                                        typeof response[map.from.ts] != 'undefined'
                                        && typeof response[map.from.rates] != 'undefined'
                                        && typeof response[map.from.rates].BTC != 'undefined'
                                    ){
                                        var dollar_per_bitcoin = parseFloat(1 / response.rates.BTC).toFixed(2);
                                        $.fn.blockstrap.settings.exchange.usd.btc = dollar_per_bitcoin;
                                        $.fn.blockstrap.settings.exchange.ts = response[map.from.ts];
                                        localStorage.setItem('nw_market_exchange', JSON.stringify($.fn.blockstrap.settings.exchange));
                                    }
                                    if(callback) callback($.fn.blockstrap.settings.exchange);
                                },
                                error: function(response)
                                {
                                    if(callback) callback(false);
                                }
                            });
                        }
                        else
                        {
                            if(callback) callback(false);
                        }
                    }
                    else
                    {
                        if(callback) callback(false);
                    }
                }
                else
                {
                    if(callback) callback(false);
                }
            }
            else
            {
                if(
                    typeof data.usd != 'undefined'
                    && typeof data.usd.btc != 'undefined'
                    && typeof data.ts != 'undefined'
                ){
                    $.fn.blockstrap.settings.exchange.usd.btc = data.usd.btc;
                    $.fn.blockstrap.settings.exchange.ts = data.ts;
                }
                if(callback) callback(data);
            }
        });
    }
    
    markets.span = function(title, content)
    {
        var html = "";
        html+= "<span class='panel-value'>"+content+"</span>";
        html+= "<span class='panel-description'>"+title+"</span>";
        return html;
    }
    
    markets.updates = function(variables, callback, force_refresh)
    {    
        $.fn.blockstrap.plugins.markets.rates(function(response)
        {
            if(
                typeof response.usd != 'undefined'
                && typeof response.usd.btc != 'undefined'
            ){
                $.fn.blockstrap.plugins.markets.conditions(response, function(response)
                {
                    if(callback) callback();
                }, force_refresh);
            }
            else
            {
                if(callback) callback();
            }
        }, force_refresh);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {markets:markets});
    
    // QUICK FIX FOR NOW - IF ADDING AN ACTION FROM WITHIN A PLUGIN 
    // THAT CALLS THAT SAME PLUGIN - IT MUST BE ADDED AFTER THE MERGE
    $.fn.blockstrap.core.add_action(
        'init', 
        'market_updates',
        'plugins.markets', 
        'updates', 
        conditions
    );
})
(jQuery);
