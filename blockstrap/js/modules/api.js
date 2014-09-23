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
    
    if($.fn.blockstrap.settings.cache.api.timeout)
    {
        api_timeout = $.fn.blockstrap.settings.cache.api.timeout;
    }
    
    api.address = function(hash, currency, callback)
    {
        if(!$.isPlainObject(apis[currency])) return false;
        api.request(api.url('address', hash, currency), function(results)
        {
            var data = false;
            var map = apis[currency].functions;
            if(results.data && results.data[map.from.address.key]) data = results.data[map.from.address.key];
            var address = {
                address: 'N/A',
                hash: 'N/A',
                tx_count: 0,
                currency: currency,
                received: 0,
                balance: 0,
            }
            if(data[map.from.address.address]) address.address = data[map.from.address.address];
            if(data[map.from.address.hash]) address.hash = data[map.from.address.hash];
            if(data[map.from.address.tx_count]) address.tx_count = data[map.from.address.tx_count];
            if(data[map.from.address.received]) address.received = data[map.from.address.received];
            if(data[map.from.address.balance]) address.balance = data[map.from.address.balance];
            if(callback) callback(address);
            else return address;
        });
    }
    
    api.addresses = function(hashes, currency, callback)
    {
        var hashed_url = '';
        if($.isArray(hashes))
        {
            $.each(hashes, function(k, hash)
            {
                if(k === 0) hashed_url+= hash;
                else hashed_url+= '&addresses=' + hash;
            });
        }
        api.request(api.url('addresses', hashed_url, currency), function(results)
        {
            
            var data = false;
            var map = apis[currency].functions;
            if(results.data && results.data[map.from.addresses.key]) data = results.data[map.from.addresses.key];
            var addresses = [];
            $.each(data, function(k, v)
            {
                var address = {
                    address: 'N/A',
                    hash: 'N/A',
                    tx_count: 0,
                    currency: currency,
                    received: 0,
                    balance: 0
                }
                if(data[k][map.from.addresses.address]) address.address = data[k][map.from.addresses.address];
                if(data[k][map.from.addresses.hash]) address.hash = data[k][map.from.addresses.hash];
                if(data[k][map.from.addresses.tx_count]) address.tx_count = data[k][map.from.addresses.tx_count];
                if(data[k][map.from.addresses.received]) address.received = data[k][map.from.addresses.received];
                if(data[k][map.from.addresses.balance]) address.balance = data[k][map.from.addresses.balance];
                addresses.push(address);
            })
            if(callback) callback(addresses);
            else return addresses;
        })
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
            var data = false;
            var map = apis[currency].functions;
            if(results.data && results.data[map.from.block.key]) data = results.data[map.from.block.key];
            var block = {
                currency: currency,
                height: 'N/A',
                hash: 'N/A',
                prev: 'N/A',
                tx_count: 0,
                time: 0
            }
            if(data[map.from.block.height]) block.height = data[map.from.block.height];
            if(data[map.from.block.hash]) block.hash = data[map.from.block.hash];
            if(data[map.from.block.prev]) block.prev = data[map.from.block.prev];
            if(data[map.from.block.tx_count]) block.tx_count = data[map.from.block.tx_count];
            if(data[map.from.block.time]) block.time = data[map.from.block.time];
            if(callback) callback(block);
            else return block;
        })
    }
    
    api.request = function(url, callback, type, data)
    {
        if(!type) type = 'GET';
        $.ajax({
            url: url,
            type: type,
            dataType: 'JSON',
            data: data,
            success: function(results)
            {
                if(callback) callback(results);
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
        var map = apis[currency].functions;
        request_data[map.to.relay_param] = hash;
        api.request(api.url('relay', '', currency), function(results)
        {
            var data = false;
            var tx = false;
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
            if(callback) callback(tx);
            else return tx;
        }, 'POST', request_data)
    }
    
    api.transaction = function(txid, currency, callback)
    {
        api.request(api.url('transaction', txid, currency), function(results)
        {
            var data = false;
            var map = apis[currency].functions;
            if(results.data && results.data[map.from.transaction.key]) data = results.data[map.from.transaction.key];
            var now = new Date().getTime();
            var transaction = {
                currency: currency,
                txid: 'N/A',
                size: 'N/A',
                block: 'N/A',
                time: parseInt(now / 1000),
                input: 0,
                output: 0,
                inputs: false,
                outputs: false,
                value: 0,
                fees: 0
            }
            if(data[map.from.transaction.txid]) transaction.txid = data[map.from.transaction.txid];
            if(data[map.from.transaction.size]) transaction.size = data[map.from.transaction.size];
            if(data[map.from.transaction.block]) transaction.block = data[map.from.transaction.block];
            if(data[map.from.transaction.time]) transaction.time = data[map.from.transaction.time];
            if(data[k][map.from.transaction.inputs]) transaction.inputs = data[k][map.from.transaction.inputs];
            if(data[k][map.from.transaction.outputs]) transaction.outputs = data[k][map.from.transaction.outputs];
            if(data[k][map.from.transaction.fees]) transaction.fees = data[k][map.from.transaction.fees];
            if(data[k][map.from.transaction.value]) transaction.value = data[k][map.from.transaction.value];
            if(callback) callback(transaction);
            else return transaction;
        })
    }
    
    api.transactions = function(address, currency, callback)
    {
        api.request(api.url('transactions', address, currency), function(results)
        {
            var data = false;
            var map = apis[currency].functions;
            if(results.data && results.data[map.from.transactions.key]) data = results.data[map.from.transactions.key];
            var transactions = [];
            var now = new Date().getTime();
            $.each(data, function(k, v)
            {
                var transaction = {
                    currency: currency,
                    txid: 'N/A',
                    size: 'N/A',
                    block: 'N/A',
                    time: parseInt(now / 1000),
                    input: 0,
                    output: 0,
                    inputs: false,
                    outputs: false,
                    value: 0,
                    fees: 0
                }
                if(data[k][map.from.transaction.txid]) transaction.txid = data[k][map.from.transaction.txid];
                if(data[k][map.from.transaction.size]) transaction.size = data[k][map.from.transaction.size];
                if(data[k][map.from.transaction.block]) transaction.block = data[k][map.from.transaction.block];
                if(data[k][map.from.transaction.time]) transaction.time = data[k][map.from.transaction.time];
                if(data[k][map.from.transaction.input]) transaction.input = data[k][map.from.transaction.input];
                if(data[k][map.from.transaction.output]) transaction.output = data[k][map.from.transaction.output];
                if(data[k][map.from.transaction.inputs]) transaction.inputs = data[k][map.from.transaction.inputs];
                if(data[k][map.from.transaction.outputs]) transaction.outputs = data[k][map.from.transaction.outputs];
                if(data[k][map.from.transaction.fees]) transaction.fees = data[k][map.from.transaction.fees];
                if(data[k][map.from.transaction.value]) transaction.value = data[k][map.from.transaction.value];
                transactions.push(transaction);
            });
            if(callback) callback(transactions);
            else return transactions;
        })
    }
    
    api.unspents = function(address, currency, callback, confirms)
    {
        api.request(api.url('unspents', address, currency), function(results)
        {
            var data = false;
            var map = apis[currency].functions;
            var base = $.fn.blockstrap.settings.base_url;
            if(!confirms) confirms = 1;
            if(results.data && results.data[map.from.unspents.key]) data = results.data[map.from.unspents.key];
            var unspents = [];
            $.each(data, function(k, v)
            {
                var unspent = {
                    txid: 'N/A',
                    index: 0,
                    value: 0,
                    script: 'N/A'
                }
                var confirmations = 0;
                if(data[k][map.from.unspents.txid]) unspent.txid = data[k][map.from.unspents.txid];
                if(data[k][map.from.unspents.index]) unspent.index = data[k][map.from.unspents.index];
                if(data[k][map.from.unspents.value]) unspent.value = data[k][map.from.unspents.value];
                if(data[k][map.from.unspents.script]) unspent.script = data[k][map.from.unspents.script];
                if(data[k][map.from.unspents.confirmations]) confirmations = data[k][map.from.unspents.confirmations];
                if(confirmations >= confirms) unspents.push(unspent);
            })
            if(callback) callback(unspents);
            else return unspents;
        })
    }
    
    api.url = function(action, key, currency)
    {
        if(!currency) currency = 'btc';
        var url = currencies[currency].api + apis[currency].functions.to[action] + key;
        if(apis[currency].functions.to[action].indexOf("$call") > -1)
        {
            var call = apis[currency].functions.to[action].replace("$call", key);
            url = currencies[currency].api + call;
        }
        return url;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {api:api});
})
(jQuery);
