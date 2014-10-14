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
    var api = {};
    var api_timeout = 15000;
    var active_requests = {};
    var apis = $.fn.blockstrap.settings.apis;
    var currencies = $.fn.blockstrap.settings.currencies;
    var api_service = $.fn.blockstrap.core.option('api_service', 'helloblock');
    if($.fn.blockstrap.settings.api_service)
    {
        api_service = $.fn.blockstrap.settings.api_service;
    }
    
    if($.fn.blockstrap.settings.cache.api.timeout)
    {
        api_timeout = $.fn.blockstrap.settings.cache.api.timeout;
    }
    
    api.address = function(hash, currency, callback)
    {
        api.request(api.url('address', hash, currency), function(results)
        {
            var address = {
                address: 'N/A',
                hash: 'N/A',
                tx_count: 0,
                currency: currency,
                received: 0,
                balance: 0,
            }
            if(results)
            {
                address = api.results(address, results, currency, 'address', callback);               
            }
            if(callback) callback(address);
            else return address;
        }, 'GET', false, currency, 'address');
    }
    
    api.addresses = function(hashes, currency, callback)
    {
        var hashed_url = '';
        if($.isArray(hashes))
        {
            var delimiter = '&addresses=';
            var map = api.map(currency);
            if(map.from.addresses.delimiter) delimiter = map.from.addresses.delimiter;
            
            $.each(hashes, function(k, hash)
            {
                if(k === 0) hashed_url+= hash;
                else hashed_url+= delimiter + hash;
            });

            api.request(api.url('addresses', hashed_url, currency), function(results)
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
                            currency: currency,
                            received: 0,
                            balance: 0
                        }
                        address = api.results(address, results[k], currency, 'addresses');
                        addresses.push(address);
                    })
                }
                if(callback) callback(addresses);
                else return addresses;
            }, 'GET', false, currency, 'addresses');
        }
        else
        {
            return false;
        }
    }
    
    api.balance = function(hash, currency, callback)
    {
        api.address(hash, currency, function(address)
        {
            if(address && address.balance) callback(address.balance);
            else callback(0);
        });
    }
    
    api.block = function(height, currency, callback)
    {
        api.request(api.url('block', height, currency), function(results)
        {
            var map = api.map(currency);
            var block = {
                currency: currency,
                height: 'N/A',
                hash: 'N/A',
                prev: 'N/A',
                next: 'N/A',
                tx_count: 0,
                time: 0
            };
            if(results)
            {
                block = api.results(block, results, currency, 'block');
            }
            if(callback) callback(block);
            else return block;
        }, 'GET', false, currency, 'block');
    }
    
    api.map = function(currency)
    {
        if(!currency) currency = 'btc';
        if(typeof apis[currency] == 'undefined') currency = 'defaults';
        if(typeof apis[currency][api_service] == 'undefined')
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
            return apis[currency][api_service].functions;
        }
    }
    
    api.request = function(url, callback, type, data, currency, call, username, password)
    {
        if(!type) type = 'GET';
        if(!currency) currency = 'btc';
        var map = api.map(currency);
        var headers = false;
        if(
            $.isPlainObject(currencies[currency]) 
            && $.isPlainObject(currencies[currency].auth) 
            && $.isPlainObject(currencies[currency].auth[api_service])
        ){
            var auth = currencies[currency].auth[api_service];
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
                        data = results.data[map.from[call].key];
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
            },
            error: function()
            {
                if(callback) callback(false)
            },
            timeout: api_timeout // 15 Seconds
        })
    }
    
    api.relay = function(hash, currency, callback)
    {
        var request_data = {};
        var map = api.map(currency);
        request_data[map.to.relay_param] = hash;
        api.request(api.url('relay', '', currency), function(results)
        {
            var data = false;
            var tx = false;
            if(results)
            {
                if(results.data)
                {
                    if(map.from.relay.inner)
                    {
                        data = results.data[map.from.relay.inner][map.from.relay.txid];
                    }
                    else if(map.from.relay.txid)
                    {
                        data = results.data[map.from.relay.txid];
                    }
                    if(data)
                    {
                        tx = {
                            currency: currency,
                            txid: data
                        }
                    }
                }
            }
            if(callback) callback(tx);
            else return tx;
        }, 'POST', request_data, currency, 'relay')
    }
    
    api.results = function(defaults, results, currency, request, callback)
    {
        var clean_results = false;
        var map = api.map(currency);
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        if(
            defaults && results 
            && currency && request 
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
                                    result = res_01 * res_02;
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
                                res_01 = parseFloat(results[arrayed_result[0]]);
                                res_01 = res_01 * 100000000;
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
                    }
                }
            });
        }
        return defaults;
    }
    
    api.transaction = function(txid, currency, callback)
    {
        api.request(api.url('transaction', txid, currency), function(results)
        {
            var map = api.map(currency);
            var now = new Date().getTime();
            var transaction = {
                currency: currency,
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
                transaction = api.results(transaction, results, currency, 'transaction');
            }
            if(callback) callback(transaction);
            else return transaction;
        }, 'GET', false, currency, 'transaction');
    }
    
    api.transactions = function(address, currency, callback)
    {
        api.request(api.url('transactions', address, currency), function(results)
        {
            var transactions = [];
            var map = api.map(currency);
            var now = new Date().getTime();
            if(results)
            {
                $.each(results, function(k, v)
                {
                    var transaction = {
                        currency: currency,
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
                        currency, 
                        'transactions'
                    );
                    transactions.push(transaction);
                });
            }
            if(callback) callback(transactions);
            else return transactions;
        }, 'GET', false, currency, 'transactions');
    }
    
    api.unspents = function(address, currency, callback, confirms)
    {
        if(!confirms) confirms = 0;
        api.request(api.url('unspents', address, currency), function(results)
        {
            var unspents = [];
            var map = api.map(currency);
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
                    unspent = api.results(unspent, results[k], currency, 'unspents');
                    if(confirmations >= confirms) unspents.push(unspent);
                });
                if(reverse) unspents = unspents.reverse();
            }
            if(callback) callback(unspents);
            else return unspents;
        }, 'GET', false, currency, 'unspents');
    }
    
    api.url = function(action, key, currency)
    {
        var url = false;
        if(!currency) currency = 'btc';
        if(
            typeof apis['defaults'] == 'undefined' 
            || typeof apis['defaults'][api_service] == 'undefined'
        ){
            if(
                typeof apis[currency] == 'undefined' 
                || typeof apis[currency][api_service] == 'undefined'
            ){
                return false;
            }
            else
            {
                url = currencies[currency].apis[api_service] + apis[currency][api_service].functions.to[action] + key;
                if(apis[currency][api_service].functions.to[action].indexOf("$call") > -1)
                {
                    var call = apis[currency][api_service].functions.to[action].replace("$call", key);
                    url = currencies[currency].apis[api_service] + call;
                }
            }
        }
        else
        {
            url = currencies[currency].apis[api_service] + apis['defaults'][api_service].functions.to[action] + key;
            if(apis['defaults'][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis['defaults'][api_service].functions.to[action].replace("$call", key);
                url = currencies[currency].apis[api_service] + call;
            }
        }
        return url;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {api:api});
})
(jQuery);
