/*
 * 
 *  Neuroware v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECTS
    var api = {};
    var map = {
        ends: {
            btc: 'https://mainnet.helloblock.io/v1/'
        },
        to: {
            address: 'addresses/',
            addresses: 'addresses?addresses=',
            transaction: 'transactions/',
            transactions: 'addresses/$call/transactions?limit=100',
            block: 'blocks/'
        },
        from: {
            address: {
                key: 'address',
                address: 'address',
                hash: 'hash160',
                tx_count: 'confirmedTxsCount',
                received: 'confirmedReceivedValue',
                balance: 'confirmedBalance'
            },
            addresses: {
                key: 'addresses',
                address: 'address',
                hash: 'hash160',
                tx_count: 'confirmedTxsCount',
                received: 'confirmedReceivedValue',
                balance: 'confirmedBalance'
            },
            transaction: {
                key: 'transaction',
                txid: 'txHash',
                size: 'size',
                block: 'blockHeight',
                time: 'blockTime',
                input: 'totalInputsValue',
                output: 'totalOutputsValue',
                fees: 'fees'
            },
            transactions: {
                key: 'transactions',
                txid: 'txHash',
                size: 'size',
                block: 'blockHeight',
                time: 'blockTime',
                input: 'totalInputsValue',
                output: 'totalOutputsValue',
                fees: 'fees'
            },
            block: {
                key: 'block',
                height: 'blockHeight',
                hash: 'blockHash',
                prev: 'prevBlockHash',
                tx_count: 'txsCount',
                time: 'blockTime'
            }
        }
    }
    
    // FUNCTIONS FOR OBJECT
    api.url = function(action, key, currency)
    {
        if(!currency) currency = 'btc';
        var url = map.ends[currency] + map.to[action] + key;
        if(map.to[action].indexOf("$call") > -1)
        {
            var call = map.to[action].replace("$call", key);
            url = map.ends[currency] + call;
        }
        return url;
    }
    api.request = function(url, callback)
    {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSON',
            success: function(results)
            {
                if(callback) callback(results);
            }
        })
    }
    api.address = function(hash, currency, callback)
    {
        api.request(api.url('address', hash, currency), function(results)
        {
            var data;
            if(results.data[map.from.address.key]) data = results.data[map.from.address.key];
            var address = {
                url: '#',
                address: 'N/A',
                hash: 'N/A',
                tx_count: 0,
                currency: currency,
                received: 0,
                balance: 0,
            }
            if(data[map.from.address.address]) address.url = '#address?key='+data[map.from.address.address];
            if(data[map.from.address.address]) address.address = data[map.from.address.address];
            if(data[map.from.address.hash]) address.hash = data[map.from.address.hash];
            if(data[map.from.address.tx_count]) address.tx_count = data[map.from.address.tx_count];
            if(data[map.from.address.received]) address.received = data[map.from.address.received];
            if(data[map.from.address.balance]) address.balance = data[map.from.address.balance];
            if(callback) callback(address);
            else return address;
        })
    }
    api.transactions = function(address, currency, callback)
    {
        api.request(api.url('transactions', address, currency), function(results)
        {
            var data;
            if(results.data[map.from.transactions.key]) data = results.data[map.from.transactions.key];
            var transactions = [];
            $.each(data, function(k, v)
            {
                var transaction = {
                    url: '#',
                    currency: currency,
                    txid: 'N/A',
                    size: 'N/A',
                    block: 'N/A',
                    time: 0,
                    input: 0,
                    output: 0,
                    fees: 0
                }
                if(data[k][map.from.transaction.txid]) transaction.url = '#transaction?txid='+data[k][map.from.transaction.txid];
                if(data[k][map.from.transaction.txid]) transaction.txid = data[k][map.from.transaction.txid];
                if(data[k][map.from.transaction.size]) transaction.size = data[k][map.from.transaction.size];
                if(data[k][map.from.transaction.block]) transaction.block = data[k][map.from.transaction.block];
                if(data[k][map.from.transaction.time]) transaction.time = data[k][map.from.transaction.time];
                if(data[k][map.from.transaction.input]) transaction.input = data[k][map.from.transaction.input];
                if(data[k][map.from.transaction.output]) transaction.output = data[k][map.from.transaction.output];
                if(data[k][map.from.transaction.fees]) transaction.fees = data[k][map.from.transaction.fees];
                transactions.push(transaction);
            });
            if(callback) callback(transactions);
            else return transactions;
        })
    }
    api.addresses = function(hashes, currency, callback)
    {
        api.request(api.url('addresses', hashes, currency), function(results)
        {
            var data;
            if(results.data[map.from.addresses.key]) data = results.data[map.from.addresses.key];
            var addresses = [];
            $.each(data, function(k, v)
            {
                var address = {
                    url: '#',
                    address: 'N/A',
                    hash: 'N/A',
                    tx_count: 0,
                    currency: currency,
                    received: 0,
                    balance: 0
                }
                if(data[k][map.from.addresses.address]) address.url = '#address?key='+data[k][map.from.addresses.address];
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
    api.transaction = function(txid, currency, callback)
    {
        api.request(api.url('transaction', txid, currency), function(results)
        {
            var data;
            if(results.data[map.from.transaction.key]) data = results.data[map.from.transaction.key];
            var transaction = {
                url: '#',
                currency: currency,
                txid: 'N/A',
                size: 'N/A',
                block: 'N/A',
                time: 0,
                input: 0,
                output: 0,
                fees: 0
            }
            if(data[map.from.transaction.txid]) transaction.url = '#transaction?txid='+data[map.from.transaction.txid];
            if(data[map.from.transaction.txid]) transaction.txid = data[map.from.transaction.txid];
            if(data[map.from.transaction.size]) transaction.size = data[map.from.transaction.size];
            if(data[map.from.transaction.block]) transaction.block = data[map.from.transaction.block];
            if(data[map.from.transaction.time]) transaction.time = data[map.from.transaction.time];
            if(data[map.from.transaction.input]) transaction.input = data[map.from.transaction.input];
            if(data[map.from.transaction.output]) transaction.output = data[map.from.transaction.output];
            if(data[map.from.transaction.fees]) transaction.fees = data[map.from.transaction.fees];
            if(callback) callback(transaction);
            else return transaction;
        })
    }
    api.block = function(height, currency, callback)
    {
        api.request(api.url('block', height, currency), function(results)
        {
            var data;
            if(results.data[map.from.block.key]) data = results.data[map.from.block.key];
            var block = {
                url: '#',
                currency: currency,
                height: 'N/A',
                hash: 'N/A',
                prev: 'N/A',
                tx_count: 0,
                time: 0
            }
            if(data[map.from.block.height]) block.url = '#block?height='+data[map.from.block.height];
            if(data[map.from.block.height]) block.height = data[map.from.block.height];
            if(data[map.from.block.hash]) block.hash = data[map.from.block.hash];
            if(data[map.from.block.prev]) block.prev = data[map.from.block.prev];
            if(data[map.from.block.tx_count]) block.tx_count = data[map.from.block.tx_count];
            if(data[map.from.block.time]) block.time = data[map.from.block.time];
            if(callback) callback(block);
            else return block;
        })
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.neuroware, {api:api});
})
(jQuery);
