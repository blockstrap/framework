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
    var api = {};
    var api_timeout = 15000;
    var active_requests = {};
    var apis = $.fn.blockstrap.settings.apis;
    var blockchains = $.fn.blockstrap.settings.blockchains;
    var api_service = $.fn.blockstrap.core.option('api_service', 'blockstrap');
    var api_key = $.fn.blockstrap.core.option('key', false);
    if($.fn.blockstrap.settings.api_service)
    {
        api_service = $.fn.blockstrap.settings.api_service;
    }
    
    if($.fn.blockstrap.settings.cache && $.fn.blockstrap.settings.cache.api && $.fn.blockstrap.settings.cache.api.timeout)
    {
        api_timeout = $.fn.blockstrap.settings.cache.api.timeout;
    }
    
    api.address = function(hash, blockchain, callback, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        var api_url = api.url('address', hash, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var address = {
                        address: 'N/A',
                        hash: 'N/A',
                        tx_count: 0,
                        blockchain: blockchain,
                        received: 0,
                        balance: 0,
                    }
                    if(results)
                    {
                        address = api.results(address, results, blockchain, 'address', callback);               
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(address);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return address;
                    }
                }
            }, 'GET', false, blockchain, 'address');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.addresses = function(hashes, blockchain, callback, service)
    {
        var hashed_url = '';
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        else if($.isArray(hashes))
        {
            var delimiter = '&addresses=';
            var map = api.map(blockchain);
            if(map.from.addresses.delimiter) delimiter = map.from.addresses.delimiter;
            
            $.each(hashes, function(k, hash)
            {
                if(k === 0) hashed_url+= hash;
                else hashed_url+= delimiter + hash;
            });

            var api_url = api.url('addresses', hashed_url, blockchain);
            if(api_url)
            {
                api.request(api_url, function(results)
                {
                    var addresses = [];
                    if(results)
                    {
                        $.each(results, function(k, v)
                        {
                            var address = {
                                address: 'N/A',
                                hash: 'N/A',
                                tx_count: 0,
                                blockchain: blockchain,
                                received: 0,
                                balance: 0
                            }
                            address = api.results(address, results[k], blockchain, 'addresses');
                            addresses.push(address);
                        })
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(addresses);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return addresses;
                    }
                }, 'GET', false, blockchain, 'addresses');
            }
            else if(callback)
            {
                callback(false);
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    
    api.balance = function(hash, blockchain, callback, service)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        api.address(hash, blockchain, function(address)
        {
            if(address && address.balance) 
            {
                if(api_service !== original_service)
                {
                    api_service = original_service;
                }
                callback(address.balance);
            }
            else 
            {
                if(api_service !== original_service)
                {
                    api_service = original_service;
                }
                callback(0);
            }
        });
    }
    
    api.block = function(height, blockchain, callback, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        
        var api_url = api.url('block', height, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var block = {
                        blockchain: blockchain,
                        height: 'N/A',
                        hash: 'N/A',
                        prev: 'N/A',
                        next: 'N/A',
                        tx_count: 0,
                        time: 0
                    };
                    if(results)
                    {
                        block = api.results(block, results, blockchain, 'block');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(block);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return block;
                    }
                }
            }, 'GET', false, blockchain, 'block');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.dnkey = function(id, blockchain, callback, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        
        var api_url = api.url('dnkey', id, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var dnkeys = {
                        blockchain: blockchain,
                        dnkey: false
                    };
                    if(results)
                    {
                        dnkeys = api.results(dnkeys, results, blockchain, 'dnkey');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(dnkeys);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return dnkeys;
                    }
                }
            }, 'GET', false, blockchain, 'dnkey');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.dnkeys = function(id, blockchain, callback, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        
        var api_url = api.url('dnkeys', id, blockchain);
        if(api_url && blockchain == 'multi')
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var dnkeys = {
                        blockchain: blockchain,
                        dnkeys: false
                    };
                    if(results)
                    {
                        dnkeys = api.results(dnkeys, results, blockchain, 'dnkeys');
                    }
                    $.each(dnkeys.dnkeys, function(chain, obj)
                    {
                        $.each($.fn.blockstrap.settings.blockchains, function(this_chain, values)
                        {
                            if(values.lib == chain)
                            {
                                dnkeys.dnkeys[this_chain] = obj;
                                delete dnkeys.dnkeys[chain];
                            }   
                        });
                    });
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(dnkeys);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return dnkeys;
                    }
                }
            }, 'GET', false, blockchain, 'dnkeys');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.map = function(blockchain)
    {
        if(!blockchain) blockchain = 'btc';
        if(typeof apis[blockchain] == 'undefined') blockchain = 'defaults';
        if(typeof apis[blockchain][api_service] == 'undefined')
        {
            if(typeof apis['defaults'][api_service] != 'undefined')
            {
                return apis['defaults'][api_service].functions;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return apis[blockchain][api_service].functions;
        }
    }
    
    api.market = function(blockchain, stat, callback, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        
        var api_url = api.url('market', stat, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    if(api_service !== original_service)
                    {
                        api_service = original_service;
                    }
                    callback(results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var market = {
                        price_usd_now: 0,
                        tx_count_24hr: 0,
                        sent_usd_24hr: 0,
                        sent_coins_24hr: 0,
                        coins_discovered: 0,
                        marketcap: 0
                    };
                    if(results)
                    {
                        market = api.results(market, results, blockchain, 'market');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(market);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return market;
                    }
                }
            }, 'GET', false, blockchain, 'market');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.request = function(url, callback, type, data, blockchain, call, username, password)
    {
        if(!type) type = 'GET';
        if(!blockchain) blockchain = 'btc';
        var map = api.map(blockchain);
        var headers = false;
        if(
            $.isPlainObject(blockchains[blockchain]) 
            && $.isPlainObject(blockchains[blockchain].auth) 
            && $.isPlainObject(blockchains[blockchain].auth[api_service])
        ){
            var auth = blockchains[blockchain].auth[api_service];
            if(
                !username 
                && typeof auth.username != 'undefined'
            ){
                username = auth.username;
            }
            if(
                !password 
                && typeof auth.password != 'undefined'
            ){
                password = auth.password;
            }
            if(username && password)
            {
                headers = {
                    'Authorization': 'Basic ' + btoa(username + ':' + password)
                }
            }
        }
        $.ajax({
            url: url,
            type: type,
            dataType: 'JSON',
            data: data,
            async: false,
            headers: headers,
            success: function(results)
            {
                var extra_key = false;
                var key_to_call = false;
                if(
                    typeof map.from[call] != 'undefined'
                    && typeof map.from[call].key != 'undefined'
                ){
                    if(map.from[call].key.indexOf(".") > -1)
                    {
                        var key_array = map.from[call].key.split('.');
                        if(blockstrap_functions.array_length(key_array) == 2)
                        {
                            if(key_array[0] == '')
                            {
                                key_to_call = key_array[1];
                            }
                            else
                            {
                                key_to_call = key_array[0];
                                extra_key = key_array[1];
                                if(extra_key === '0') extra_key = 0;
                            }
                        }
                    }
                    var data = false;
                    if(
                        results 
                        && key_to_call 
                        || 
                        (
                        results
                        && typeof results.data != 'undefined'
                        && typeof map.from[call] != 'undefined'
                        && typeof map.from[call].key != 'undefined'
                        && typeof results.data[map.from[call].key] != 'undefined'
                        )
                    ){
                        if(key_to_call)
                        {
                            if(extra_key || extra_key === 0)
                            {
                                data = results.data[key_to_call][extra_key];
                            }
                            else
                            {
                                data = results.data[key_to_call];
                            }
                        }
                        else
                        {
                            if(call)
                            {
                                data = results.data[map.from[call].key];
                            }
                            else
                            {
                                data = results.data;
                            }
                        }
                    }
                    else if(
                        typeof results.data != 'undefined' 
                        && !map.from[call].key
                    ){
                        data = results.data;
                    }
                    else
                    {
                        data = results;
                    }
                    if(callback) callback(data);
                }
                else
                {
                    if(callback) callback(results);
                }
            },
            error: function()
            {
                if(callback) callback(false)
            },
            timeout: api_timeout // 15 Seconds
        })
    }
    
    api.relay = function(hash, blockchain, callback, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        var request_data = {};
        var map = api.map(blockchain);
        request_data[map.to.relay_param] = hash;
        
        var api_url = api.url('relay', hash, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var data = false;
                    var tx = false;
                    if(results)
                    {
                        if(results.data)
                        {
                            if(
                                map.from.relay.inner
                                && typeof results.data[map.from.relay.inner] != 'undefined'
                                && typeof results.data[map.from.relay.inner][map.from.relay.txid] != 'undefined'
                            ){
                                data = results.data[map.from.relay.inner][map.from.relay.txid];
                            }
                            else if(
                                map.from.relay.txid
                                && typeof results.data[map.from.relay.txid] != 'undefined'
                            ){
                                data = results.data[map.from.relay.txid];
                            }
                            if(data)
                            {
                                tx = {
                                    blockchain: blockchain,
                                    txid: data
                                }
                            }
                        }
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(tx);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return tx;
                    }
                }
            }, 'POST', request_data, blockchain, 'relay');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.results = function(defaults, results, blockchain, request, callback)
    {
        var clean_results = false;
        var map = api.map(blockchain);
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        
        if(!$.isPlainObject(results))
        {
            var original_results = results;
            results = {};
            results[request] = {};
            results[request][blockchain] = original_results;
        }
        
        if(
            defaults && results 
            && blockchain && request 
            && $.isPlainObject(defaults) 
            && $.isPlainObject(results) 
            && typeof map.from != 'undefined' 
            && typeof map.from[request] != 'undefined' 
        ){
            var result_count = 0;
            var number_of_results = $bs.array_length(defaults);
            $.each(defaults, function(field_name, field_value)
            {
                result_count++;
                if(
                    typeof map.from[request][field_name] != 'undefined' 
                ){
                    var this_map = map.from[request][field_name];
                    var result = results[map.from[request][field_name]];
                    var arrayed_result = bs.core.string_to_array(this_map);
                    if(arrayed_result && $bs.array_length(arrayed_result) === 4)
                    {
                        if(
                            (
                                arrayed_result[1] == '+'
                                || arrayed_result[1] == '-'
                                || arrayed_result[1] == '*'
                                || arrayed_result[1] == '/'
                            )
                            &&
                            (
                                arrayed_result[3] == 'int'
                                || arrayed_result[3] == 'float'
                            )
                        ){
                            var parse_type = arrayed_result[3];
                            if(
                                typeof results[arrayed_result[0]] != 'undefined'
                                && typeof results[arrayed_result[2]] != 'undefined'
                            ){
                                var res_01 = results[arrayed_result[0]];
                                var res_02 = results[arrayed_result[2]];
                                if(parse_type == 'float')
                                {
                                    res_01 = parseFloat(results[arrayed_result[0]]);
                                    res_02 = parseFloat(resultsq[arrayed_result[2]]);
                                    res_01 = res_01 * 100000000;
                                    res_02 = res_02 * 100000000;
                                }
                                else if(parse_type == 'int')
                                {
                                    res_01 = parseInt(results[arrayed_result[0]]);
                                    res_02 = parseInt(results[arrayed_result[2]]);
                                }
                                result = res_01 + res_02;
                                if(arrayed_result[1] == '-')
                                {
                                    result = res_01 - res_02;
                                }
                                else if(arrayed_result[1] == '*')
                                {
                                    if(parse_type == 'int')
                                    {
                                        result = parseInt(res_01 * res_02);
                                    }
                                    else
                                    {
                                        result = res_01 * res_02;
                                    }
                                }
                                else if(arrayed_result[1] == '/')
                                {
                                    result = res_01 / res_02;
                                }
                                defaults[field_name] = result;
                            }
                        }
                    }
                    else if(arrayed_result && $bs.array_length(arrayed_result) === 2)
                    {
                        var parse_type = arrayed_result[1];
                        if(
                            arrayed_result[1] == 'int'
                            || arrayed_result[1] == 'float'
                            || arrayed_result[1] == 'hextohash'
                            || arrayed_result[1] == 'utctoepoch'
                            || arrayed_result[1] == 'count'
                            || arrayed_result[1] == 'lowercase'
                        ){
                            if(parse_type == 'float')
                            {
                                res_01 = parseFloat(results[arrayed_result[0]]).toPrecision(8);
                                res_01 = parseInt((res_01 * 100000000));
                            }
                            else if(parse_type == 'int')
                            {
                                res_01 = parseInt(results[arrayed_result[0]]);
                            }
                            else if(parse_type == 'hextohash')
                            {
                                var address = results[arrayed_result[0]];
                                var hash = bitcoin.Address.fromBase58(address);
                                res_01 = hash;
                            }
                            else if(parse_type == 'utctoepoch')
                            {
                                var date = new Date(results[arrayed_result[0]]);
                                var epoch = date.getTime() / 1000;
                                res_01 = epoch;
                            }
                            else if(parse_type == 'count')
                            {
                                var obj = results[arrayed_result[0]];
                                var count = $bs.array_length(obj);
                                res_01 = count;
                            }
                            else if(parse_type == 'lowercase')
                            {
                                res_01 = results[arrayed_result[0]].toLowerCase();
                            }
                            defaults[field_name] = res_01;
                        }
                    }       
                    else
                    {
                        if(
                            typeof map.from[request][field_name] != 'undefined' 
                            && typeof results[map.from[request][field_name]] != 'undefined' 
                        ){
                            defaults[field_name] = results[map.from[request][field_name]];
                        }
                        else
                        {
                            defaults[request] = results;
                        }
                    }
                }
            });
        }
        return defaults;
    }
    
    api.settings = function(chain, provider, direction, key)
    {
        var result = false;
        var bs = $.fn.blockstrap.settings;
        if(
            typeof chain != 'undefined'
            && typeof provider != 'undefined'
            && typeof direction != 'undefined'
            && typeof key != 'undefined'
        ){
            if(
                typeof bs.apis.defaults[provider] != 'undefined'
                && typeof bs.apis.defaults[provider].functions != 'undefined'
                && typeof bs.apis.defaults[provider].functions[direction] != 'undefined'
                && typeof bs.apis.defaults[provider].functions[direction][key] != 'undefined'
            ){
                return bs.apis.defaults[provider].functions[direction][key];
            }
            else
            {
                if(
                    typeof bs.apis[chain] != 'undefined'
                    && typeof bs.apis[chain][provider] != 'undefined'
                    && typeof bs.apis[chain][provider].functions != 'undefined'
                    && typeof bs.apis[chain][provider].functions[direction] != 'undefined'
                    && typeof bs.apis[chain][provider].functions[direction][key] != 'undefined'
                ){
                    return bs.apis[chain][provider].functions[direction][key];
                }
                else
                {
                    return result;
                }
            }
        }
        else
        {
            return result;
        }
    }
    
    api.transaction = function(txid, blockchain, callback, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        
        var api_url = api.url('transaction', txid, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var map = api.map(blockchain);
                    var now = new Date().getTime();
                    var transaction = {
                        blockchain: blockchain,
                        txid: 'N/A',
                        size: 'N/A',
                        block: 'N/A',
                        time: parseInt(now / 1000),
                        input: 0,
                        output: 0,
                        value: 0,
                        fees: 0
                    }
                    if(results)
                    {
                        transaction = api.results(transaction, results, blockchain, 'transaction');
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(transaction);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return transaction;
                    }
                }
            }, 'GET', false, blockchain, 'transaction');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.transactions = function(address, blockchain, callback, service, return_raw, count, skip)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        var api_url = api.url('transactions', address, blockchain);
        
        // Hack for BS API Pagination
        if(typeof count != 'undefined' && parseInt(count) > 0 )
        {
            if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] == 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[0];
                api_url+= '&'+key+'='+count;
            }
            else if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[0];
                api_url+= '&'+key+'='+count;
            }
        }
        if(typeof count != 'undefined' && parseInt(skip) > 0 )
        {
            if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] == 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis[blockchain][api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[1];
                api_url+= '&'+key+'='+skip;
            }
            else if(
                typeof $.fn.blockstrap.settings.apis.defaults[api_service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis.defaults[api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[1];
                api_url+= '&'+key+'='+skip;
            }
        }
            
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var transactions = [];
                    var map = api.map(blockchain);
                    var now = new Date().getTime();
                    if(results)
                    {
                        $.each(results, function(k, v)
                        {
                            var transaction = {
                                blockchain: blockchain,
                                txid: 'N/A',
                                size: 'N/A',
                                block: 'N/A',
                                time: parseInt(now / 1000),
                                input: 0,
                                output: 0,
                                value: 0,
                                fees: 0
                            };
                            transaction = api.results(
                                transaction, 
                                results[k], 
                                blockchain, 
                                'transactions'
                            );
                            transactions.push(transaction);
                        });
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(transactions);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return transactions;
                    }
                }
            }, 'GET', false, blockchain, 'transactions');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.unspents = function(address, blockchain, callback, confirms, service, return_raw)
    {
        var original_service = api_service;
        if(service && service !== api_service)
        {
            api_service = service;
        }
        if(!confirms) confirms = 0;
        
        var api_url = api.url('unspents', address, blockchain);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    callback(results);
                }
                else
                {
                    var unspents = [];
                    var map = api.map(blockchain);
                    if(results)
                    {
                        var reverse = false;
                        if(
                            typeof map.from.unspents.reverse_array != 'undefined' 
                            && map.from.unspents.reverse_array === true
                        ){
                            reverse = true;
                        }
                        $.each(results, function(k, v)
                        {
                            var unspent = {
                                txid: 'N/A',
                                index: 0,
                                value: 0,
                                script: 'N/A'
                            }
                            var confirmations = 0;
                            unspent = api.results(unspent, results[k], blockchain, 'unspents');
                            if(confirmations >= confirms) unspents.push(unspent);
                        });
                        if(reverse) unspents = unspents.reverse();
                    }
                    if(callback) 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        callback(unspents);
                    }
                    else 
                    {
                        if(api_service !== original_service)
                        {
                            api_service = original_service;
                        }
                        return unspents;
                    }
                }
            }, 'GET', false, blockchain, 'unspents');
        }
        else if(callback)
        {
            callback(false);
        }
        else
        {
            return false;
        }
    }
    
    api.url = function(action, key, blockchain)
    {
        var url = false;
        if(!blockchain) blockchain = 'btc';
        if(apis == 'undefined')
        {
            apis = $.fn.blockstrap.settings.apis;
        }
        if(
            blockchain != 'multi'
            &&
            (
            (
            typeof apis[blockchain] == 'undefined' 
            || typeof apis[blockchain][api_service] == 'undefined'
            || typeof apis[blockchain][api_service].functions.to[action] == 'undefined'    
            || apis[blockchain][api_service].functions.to[action] == ""
            )
            &&
            (
            typeof apis['defaults'] == 'undefined' 
            || typeof apis['defaults'][api_service] == 'undefined'
            || typeof apis['defaults'][api_service].functions.to[action] == 'undefined'  
            || apis['defaults'][api_service].functions.to[action] == ""
            || typeof $.fn.blockstrap.settings.blockchains[blockchain].apis[api_service] == 'undefined'
            )
            )
        ){
            if(action == 'addresses') key = 'multiple-addresses';
            var text = '<p class="'+key+blockchain+action+'">Please note that the selected API "<strong>'+api_service+'</strong>" used for "<strong>'+key+'</strong>" is either not mapped to the "<strong>'+blockchain+'</strong>" blockchain or does not support the required "<strong>'+action+'</strong>" function.</p>';
            if(
                $('#default-modal').find('h4.modal-title').text() != 'API Warning'
                && $('#default-modal').find('.modal-body').find('.'+key+blockchain+action).length < 1
            ){
                $.fn.blockstrap.core.modal('API Warning', text);
                return false;
            }
            else if(
                $('#default-modal').find('h4.modal-title').text() == 'API Warning'
                && $('#default-modal').find('.modal-body').find('.'+key+blockchain+action).length < 1
            ){
                var current_text = $('#default-modal').find('.modal-body').html();
                $.fn.blockstrap.core.modal('API Warning', current_text+text);
                return false;
            }
            else
            {
                return false;
            }
        }
        else if(
            blockchain != 'multi'
            &&
            (
            typeof apis[blockchain] != 'undefined' 
            && typeof apis[blockchain][api_service] != 'undefined'
            && typeof apis[blockchain][api_service].functions.to[action] != 'undefined'
            )
        ){
            url = blockchains[blockchain].apis[api_service] + apis[blockchain][api_service].functions.to[action] + key;
            if(apis[blockchain][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis[blockchain][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        else if( blockchain != 'multi')
        {
            url = blockchains[blockchain].apis[api_service] + apis['defaults'][api_service].functions.to[action] + key;
            if(apis['defaults'][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis['defaults'][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        else
        {
            api_service = 'blockstrap';
            blockchains = $.fn.blockstrap.settings.blockchains;
            apis = $.fn.blockstrap.settings.apis;
            url = blockchains[blockchain].apis[api_service] + apis['defaults'][api_service].functions.to[action] + key;
            if(apis['defaults'][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis['defaults'][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        if(api_key)
        {
            if(url.indexOf("?") > -1)
            {
                url+='&api_key='+api_key;
            }
            else
            {
                url+='?api_key='+api_key;
            }
        }
        var app_id = 'framework';
        if(typeof $.fn.blockstrap.settings.app_id != 'undefined')
        {
            app_id = $.fn.blockstrap.settings.app_id;
        }
        else
        {
            app_id = $.fn.blockstrap.settings.id;
        }
        if(api_service == 'blockstrap')
        {
            app_id+= '_v'+blockstrap_functions.slug($.fn.blockstrap.settings.v);
            if(action == 'stats' || action == 'addresses')
            {
                if(url.indexOf("?") > -1)
                {
                    url+= '&app_id='+app_id;
                }
                else
                {
                    url+= '?app_id='+app_id;
                }
            }
            else
            {
                if(url.indexOf("?") > -1)
                {
                    url+= '&app_id='+app_id;
                }
                else
                {
                    url+= '?app_id='+app_id;
                }
            }
        }
        return url;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {api:api});
})
(jQuery);
