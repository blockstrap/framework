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
    var ethereum = {};
    
    $.fn.blockstrap.settings.ethereum = {
        apis: {
            blockcypher: {
                in: {
                    address: {
                        address: 'address',
                        balance: 'final_balance',
                        received: 'total_received',
                        sent: 'total_sent',
                        tx_count: 'final_n_tx'
                    },
                    contract: {
                        address: 'address',
                        balance: 'final_balance',
                        received: 'total_received',
                        sent: 'total_sent',
                        tx_count: 'final_n_tx'
                    },
                    transaction: {
                        hash: 'hash',
                        sent: 'total',
                        fees: 'fees',
                        size: 'size',
                        gas_used: 'gas_used',
                        gas_price: 'gas_price',
                        block_height: 'block_height',
                        block_hash: 'block_hash',
                        inputs: 'inputs',
                        outputs: 'outputs'
                    }
                },
                out: {
                    address: 'https://api.blockcypher.com/v1/eth/main/addrs/',
                    contract: 'https://api.blockcypher.com/v1/eth/main/contracts/',
                    transaction: 'https://api.blockcypher.com/v1/eth/main/txs/'
                }
            }
        },
        connected: false,
        defaults: {
            decimals: 2,
            symbol: '$',
            abi: [{"constant":true, "inputs":[], "name":"name", "outputs":[{"type":"string"}], "type":"function"}, {"constant":true, "inputs":[], "name":"totalSupply", "outputs":[{"type":"uint256"}], "type":"function"}, {"constant":true, "inputs":[{"type":"address"}], "name":"balanceOf", "outputs":[{"type":"uint256"}], "type":"function"}, {"constant":true, "inputs":[], "name":"symbol", "outputs":[{"type":"string"}], "type":"function"}, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "type": "function"}, {"constant":true, "inputs":[], "name":"decimals", "outputs":[{"type":"uint8"}], "type":"function"},{"anonymous":false, "inputs": [ { "indexed": true, "name": "from", "type": "address"}, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event"}]
        },
        wei: {
            decimals: 1000000000000000000
        }
    };
    
    if(typeof web3 !== 'undefined') 
    {
        web3 = new Web3(web3.currentProvider);
    } 
    else 
    {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    $.fn.blockstrap.eth = false;
    if(web3.isConnected())
    {
        $.fn.blockstrap.eth = web3;
        $.fn.blockstrap.settings.ethereum.connected = true;
    }
    
    ethereum.ajax = {
        get: function(key, value, source, callback)
        {
            if(key && value && source && source != 'geth' && callback && $.isFunction(callback))
            {
                var url = false;
                if(
                    typeof $.fn.blockstrap.settings.ethereum.apis[source] != 'undefined'
                    && typeof $.fn.blockstrap.settings.ethereum.apis[source].out != 'undefined'
                    && typeof $.fn.blockstrap.settings.ethereum.apis[source].out[key] != 'undefined'
                    && $.fn.blockstrap.settings.ethereum.apis[source].out[key]
                ){
                    url = $.fn.blockstrap.settings.ethereum.apis[source].out[key] + value;
                }
                if(url)
                {
                    var api_keys = $.fn.blockstrap.settings.keys.apis.blockcypher.key;
                    $.ajax({
                        url: url + '?token=' + api_keys[Math.floor(Math.random()*api_keys.length)],
                        complete: function(data)
                        {
                            callback($.fn.blockstrap.plugins.ethereum.ajax.normalize(data, key, source));
                        }
                    });
                }
            }
        },
        normalize: function(data, key, source)
        {
            var response = {
                success: false,
                data: false
            };
            if(source && source != 'geth')
            {
                if(
                    typeof data.responseJSON != 'undefined'
                    && $.isPlainObject(data.responseJSON)
                    && typeof data.responseJSON.error == 'undefined'
                ){
                    response.success = true;
                    response.data = {};
                    if(
                        typeof $.fn.blockstrap.settings.ethereum.apis[source] != 'undefined'
                        && typeof $.fn.blockstrap.settings.ethereum.apis[source].in != 'undefined'
                        && typeof $.fn.blockstrap.settings.ethereum.apis[source].in[key] != 'undefined'
                        && $.isPlainObject($.fn.blockstrap.settings.ethereum.apis[source].in[key])
                    ){
                        $.each($.fn.blockstrap.settings.ethereum.apis[source].in[key], function(k, v)
                        {
                            response.data[k] = data.responseJSON[v];
                        });
                    }
                    return response;
                }
                else
                {
                    return response;
                }
            }
            else
            {
                return response;
            }
        }
    }
    
    ethereum.addresses = {
        get: function(address, options, callback)
        {
            if(
                typeof address == 'string'
                && typeof options != 'undefined'
                && typeof callback == 'function'
                && $.isArray(options)
            ){
                if($.fn.blockstrap.settings.ethereum.connected === true)
                {
                    var address = {
                        balance: web3.eth.getBalance(address).toNumber(),
                        tx_count: web3.eth.getTransactionCount(address),
                        sent: 'N/A',
                        received: 'N/A'
                    }
                    callback(address);
                }
                else
                {
                    $.fn.blockstrap.plugins.ethereum.api.address(address, 'blockcypher', function(obj)
                    {
                        var address = false;
                        if(
                            typeof obj.success != 'undefined'
                            && typeof obj.data != 'undefined'
                            && obj.success === true
                            && $.isPlainObject(obj.data)
                        ){
                            address = obj.data;
                        }
                        callback(address);
                    });
                }
            }
        },
        update: function(account_id, address, callback, time_to_wait)
        {
            if(typeof time_to_wait == 'undefined') time_to_wait = 50000;
            $.fn.blockstrap.data.find('tokens', account_id, function(account)
            {
                if(account)
                {
                    $.fn.blockstrap.core.loader('open');
                    $.fn.blockstrap.plugins.ethereum.addresses.get(address, [], function(obj)
                    {
                        if(account.tokens.eth.balance != obj.balance)
                        {
                            account.tokens.eth.balance = obj.balance;
                            account.tokens.eth.tx_count = obj.tx_count;
                            account.tokens.eth.sent = obj.sent;
                            account.tokens.eth.received = obj.received;
                            $.fn.blockstrap.data.save('tokens', account_id, account, function()
                            {
                                setTimeout(function()
                                {
                                    var account_count = 0;
                                    $.each(account.tokens, function(code, token)
                                    {
                                        if(code != 'eth')
                                        {
                                            $.fn.blockstrap.data.find('contracts', code, function(stored_contract)
                                            {
                                                var abi = $.fn.blockstrap.settings.ethereum.defaults.abi;
                                                $.fn.blockstrap.plugins.ethereum.contracts.get(stored_contract.address, abi, function(contract)
                                                {
                                                    account_count++;
                                                    var balance = contract.balanceOf('0x' + account.keys.address).toNumber();
                                                    account.tokens[code].balance = balance;
                                                    $.fn.blockstrap.data.save('tokens', account_id, account, function()
                                                    {
                                                        if(account_count >= blockstrap_functions.array_length(account.tokens))
                                                        {
                                                            callback(true);
                                                        }
                                                    });
                                                });
                                            });
                                        }
                                        else
                                        {
                                            account_count++;
                                        }
                                    });
                                }, time_to_wait);
                            });
                        }
                        else
                        {
                            callback(false);
                        }
                    });
                }
                else
                {
                    callback(false);
                }
            });
        }
    }
    
    ethereum.transactions = {
        get: function(hash, options, callback)
        {
            if(
                typeof hash == 'string'
                && typeof options != 'undefined'
                && typeof callback == 'function'
                && $.isArray(options)
            ){
                if($.fn.blockstrap.settings.ethereum.connected === true)
                {
                    var eth_tx = web3.eth.getTransaction(hash);
                    var eth_tx_receipt = web3.eth.getTransactionReceipt(hash);
                    var fees = (eth_tx_receipt.gasUsed * eth_tx.gasPrice.toNumber());
                    var tx = {
                        hash: hash,
                        sent: eth_tx.value.toNumber(),
                        fees: fees,
                        size: 'N/A',
                        gas_used: eth_tx_receipt.gasUsed,
                        gas_price: eth_tx.gasPrice.toNumber(),
                        block_height: eth_tx.blockNumber,
                        block_hash: eth_tx.blockHash,
                        inputs: 'N/A',
                        outputs: 'N/A'
                    }
                    callback(tx);
                }
                else
                {
                    $.fn.blockstrap.plugins.ethereum.api.transaction(hash, 'blockcypher', function(obj)
                    {
                        var tx = false;
                        if(
                            typeof obj.success != 'undefined'
                            && typeof obj.data != 'undefined'
                            && obj.success === true
                            && $.isPlainObject(obj.data)
                        ){
                            tx = obj.data;
                        }
                        callback(tx);
                    });
                }
            }
        }
    }
    
    ethereum.api = {
        address: function(address, source, callback)
        {
            $.fn.blockstrap.plugins.ethereum.ajax.get('address', address, source, callback);
        },
        contract: function(address, source, callback)
        {
            $.fn.blockstrap.plugins.ethereum.ajax.get('contract', address, source, callback);
        },
        transaction: function(tx, source, callback)
        {
            $.fn.blockstrap.plugins.ethereum.ajax.get('transaction', tx, source, callback);
        }
    }
    
    ethereum.buttons = {
        init: function()
        {
            $.fn.blockstrap.plugins.ethereum.buttons.update();
        },
        update: function()
        {
            $('body').on('click', '.btn-update_token', function(e)
            {
                e.preventDefault();
                var button = $(this);
                var account_id = $(button).attr('data-key');
                $.fn.blockstrap.data.find('tokens', account_id, function(account)
                {
                    if(
                        account 
                        && typeof account.tokens != 'undefined' 
                        && $.isPlainObject(account.tokens)
                    ){
                        $.fn.blockstrap.core.loader('open');
                        $.fn.blockstrap.plugins.ethereum.addresses.update(account_id, account.keys.address, function()
                        {
                            var account_count = 0;
                            $.each(account.tokens, function(code, token)
                            {
                                if(code != 'eth')
                                {
                                    $.fn.blockstrap.data.find('contracts', code, function(stored_contract)
                                    {
                                        var abi = $.fn.blockstrap.settings.ethereum.defaults.abi;
                                        $.fn.blockstrap.plugins.ethereum.contracts.get(stored_contract.address, abi, function(contract)
                                        {
                                            account_count++;
                                            var balance = contract.balanceOf('0x' + account.keys.address).toNumber();
                                            account.tokens[code].balance = balance;
                                            $.fn.blockstrap.data.save('tokens', account_id, account, function()
                                            {
                                                if(account_count >= blockstrap_functions.array_length(account.tokens))
                                                {
                                                    $.fn.blockstrap.core.refresh(function()
                                                    {
                                                        $.fn.blockstrap.core.loader('close');
                                                        setTimeout(function()
                                                        {
                                                            
                                                        });
                                                    }, $.fn.blockstrap.core.page());
                                                }
                                            });
                                        });
                                    });
                                }
                                else
                                {
                                    account_count++;
                                }
                            });
                        }, 1);
                    }
                });
            });
        }
    }
    
    ethereum.contracts = {
        all: function()
        {
            var contracts = [];
            if(localStorage)
            {
                $.each(localStorage, function(key, contract)
                {
                    if(key.substring(0, 13) === 'nw_contracts_')
                    {
                        contracts.push(JSON.parse(contract));
                    }
                });
            }
            return contracts;
        },
        get: function(address, options, callback)
        {
            if(
                typeof address == 'string'
                && typeof options != 'undefined'
                && typeof callback == 'function'
                && $.isArray(options)
            ){
                if($.fn.blockstrap.settings.ethereum.connected === true)
                {
                    var contract = web3.eth.contract(options).at(address);
                    callback(contract);
                }
                else
                {
                    $.fn.blockstrap.plugins.ethereum.api.contract(address, 'blockcypher', callback);
                }
            }
        }
    }
    
    ethereum.forms = {
        account: function()
        {
            $('body').on('submit', '#create-token', function(e)
            {
                e.preventDefault();
                var form = $(this);
                var token_name = $(form).find('#token-name').val();
                var token_decimals = $(form).find('#token-decimals').val();
                var token_supply = $(form).find('#token-supply').val();
                var token_symbol = $(form).find('#token-symbol').val();
                if(
                    token_name 
                    && token_decimals
                    && token_supply
                    && token_symbol
                ){
                    token_decimals = parseInt(token_decimals);
                    token_supply = parseInt(token_supply);
                    var contract_options = $.fn.blockstrap.settings.ethereum.defaults.abi;
                    console.log('contract_options', contract_options);
                    /*
                    contract_options[0].value = token_name;
                    contract_options[1].value = token_supply;
                    contract_options[3].value = token_symbol;
                    contract_options[5].value = token_decimals;
                    */
                    
                    contract_options = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "type": "function" }, { "constant": true, "inputs": [], "name": "standard", "outputs": [ { "name": "", "type": "string" } ], "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "10000" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "Neuroware Sdn Bhd" }, { "name": "decimalUnits", "type": "uint8", "index": 2, "typeShort": "uint", "bits": "8", "displayName": "decimal Units", "template": "elements_input_uint", "value": "2" }, { "name": "tokenSymbol", "type": "string", "index": 3, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "%" } ], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ];
                    
                    var new_contract = web3.eth.contract(contract_options);
                    console.log('new_contract', new_contract);
                    var contract_code = new_contract.new.getData(
                        token_supply,
                        token_name,
                        token_decimals,
                        token_symbol,
                        {
                            value: 0,
                            gas: 4000000,
                            gasPrice: 50000000000,
                            from: '0x7d0C58E478479c8f6f5A96C2424d6AE4F82980e0'
                        },
                        function(err, myContract)
                        {
                            if(!err) 
                            {
                               // NOTE: The callback will fire twice!
                               // Once the contract has the transactionHash property set and once its deployed on an address.

                               // e.g. check tx hash on the first call (transaction send)
                               if(!myContract.address) 
                               {
                                   console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
                                   // Success? 0xee87adc79d9005ef8440442cba5b8df5f9c0b0ddb681111c2db3024ab6b25630
                                   // Number 2 - 0x592eac6ac6c1f8fb7fe94e78ba2860839854c91a86a62dd569adb1479d91f37b
                                   // check address on the second call (contract deployed)
                                } 
                                else 
                                {
                                   console.log(myContract.address) // the contract address
                                }

                                // Note that the returned "myContractReturned" === "myContract",
                                // so the returned "myContractReturned" object will also get the address set.
                            }
                            else
                            {
                                console.log('err', err);
                                console.log('myContract', myContract);
                            }
                        }
                    );
                    console.log('contract_code', contract_code);
                }
            });
        },
        add: function()
        {
            $('body').on('submit', '#add-token', function(e)
            {
                e.preventDefault();
                var form = $(this);
                var modal = $(form).parent().parent().parent().parent();
                var account_id = $(modal).attr('data-account-id');
                var contract_id = $(form).find('#contract').val();
                if(account_id && contract_id)
                {
                    $.fn.blockstrap.core.loader('open');
                    $.fn.blockstrap.data.find('tokens', account_id, function(account)
                    {
                        $.fn.blockstrap.data.find('contracts', contract_id, function(contract)
                        {
                            if(
                                account && contract
                                && $.isPlainObject(account)
                                && $.isPlainObject(contract)
                                && typeof account.tokens != 'undefined'
                                && typeof account.tokens[contract_id] == 'undefined'
                            ){
                                var options = $.fn.blockstrap.settings.ethereum.defaults.abi;
                                $.fn.blockstrap.plugins.ethereum.contracts.get(contract.address, options, function(this_contract)
                                {
                                    var one = '1';
                                    for(i = 0; i < contract.decimals; i++)
                                    {
                                        one+= '0';
                                    }
                                    one = parseInt(one);
                                    account.tokens[contract_id] = {
                                        balance: this_contract.balanceOf('0x' + account.keys.address).toNumber(),
                                        decimals: contract.decimals,
                                        name: contract.name,
                                        one: one,
                                        received: 0,
                                        sent: 0,
                                        symbol: contract.symbol,
                                        tx_count: 0,
                                        txs: []
                                    }
                                    $.fn.blockstrap.data.save('tokens', account_id, account, function()
                                    {
                                        $.fn.blockstrap.core.refresh(function()
                                        {
                                            $.fn.blockstrap.core.loader('close');
                                            setTimeout(function()
                                            {
                                                var message = 'Added ' + contract.name + ' to ' + account.name;
                                                $.fn.blockstrap.core.modal('Success', message);
                                            }, $.fn.blockstrap.core.timeouts('loader'));
                                        }, $.fn.blockstrap.core.page());
                                    });
                                });
                            }
                            else
                            {
                                $.fn.blockstrap.core.loader('close');
                                setTimeout(function()
                                {
                                    $.fn.blockstrap.core.modal('Warning', 'Unable to add token to account');
                                }, $.fn.blockstrap.core.timeouts('loader'));
                            }
                        });
                    });
                }
                else if(account_id)
                {
                    var token_name = $(form).find('#token-name').val();
                    var token_decimals = $(form).find('#token-decimals').val();
                    var token_supply = $(form).find('#token-supply').val();
                    var token_symbol = $(form).find('#token-symbol').val();
                    if(token_name && token_decimals && token_supply && token_symbol)
                    {
                        $.fn.blockstrap.core.loader('open');
                    }
                }
            });
        },
        create: function()
        {
            $('body').on('submit', '#account-token', function(e)
            {
                e.preventDefault();
                var form = $(this);
                var account_name = $(form).find('#account-name').val();
                var account_password = $(form).find('#account-password').val();
                var password_repeat = $(form).find('#account-password-repeat').val();
                if(account_name && account_password && password_repeat && account_password == password_repeat)
                {
                    var slug = blockstrap_functions.slug(account_name);
                    $.fn.blockstrap.core.loader('open');
                    $.fn.blockstrap.data.find('tokens', slug, function(existing_account)
                    {
                        if(
                            typeof existing_account == 'undefined'
                            || !existing_account
                        ){
                            var seed = ethUtil.sha3(slug);
                            var hashed_pw = ethUtil.sha3(account_password);
                            var keys = $.fn.blockstrap.plugins.ethereum.keys(ethUtil.sha3(seed + '_' + hashed_pw));
                            var account = {
                                id: slug,
                                name: account_name,
                                password: hashed_pw.toString('hex'),
                                keys: {
                                    address: keys.address,
                                    public: keys.public
                                },
                                tokens: {
                                    eth: {
                                        name: 'Ethereum',
                                        decimals: ((''+$.fn.blockstrap.settings.ethereum.wei.decimals).length - 1),
                                        one: $.fn.blockstrap.settings.ethereum.wei.decimals,
                                        symbol: 'ETH',
                                        sent: 0,
                                        received: 0,
                                        balance: 0,
                                        txs: [],
                                        tx_count: 0
                                    }
                                }
                            };
                            var abi = $.fn.blockstrap.settings.ethereum.defaults.abi;
                            $.fn.blockstrap.plugins.ethereum.addresses.get(keys.address, abi, function(address)
                            {
                                if(
                                    typeof address.tx_count != 'undefined'
                                    && (address.tx_count > 0 || address.tx_count == 'N/A')
                                ){
                                    account.tokens.eth.sent = address.sent;
                                    account.tokens.eth.received = address.received;
                                    account.tokens.eth.balance = address.balance;
                                    account.tokens.eth.tx_count = address.tx_count;
                                }
                                $.fn.blockstrap.data.save('tokens', slug, account, function()
                                {
                                    $.fn.blockstrap.core.refresh(function()
                                    {
                                        $.fn.blockstrap.core.loader('close');
                                        setTimeout(function()
                                        {
                                            $.fn.blockstrap.core.modal('Success', 'Successfully created token account');
                                        }, $.fn.blockstrap.core.timeouts('loader'));
                                    }, $.fn.blockstrap.core.page());
                                });
                            });
                        }
                        else
                        {
                            $.fn.blockstrap.core.loader('close');
                            setTimeout(function()
                            {
                                $.fn.blockstrap.core.modal('Warning', 'This token account already exists!');
                            }, $.fn.blockstrap.core.timeouts('loader'));
                        }
                    });
                }
            });
        },
        init: function()
        {
            ethereum.forms.account();
            ethereum.forms.add();
            ethereum.forms.create();
            ethereum.forms.send();
            ethereum.forms.watch();
        },
        send: function()
        {
            $('body').on('submit', '#send-token', function(e)
            {
                e.preventDefault();
                var form = $(this);
                var account_id = $(form).find('#account-id').val();
                var contract_id = $(form).find('#contract-id').val();
                var amount = $(form).find('#amount').val();
                var address = $(form).find('#address').val();
                var password = $(form).find('#password').val();
                if(
                    account_id && contract_id && amount && address && password
                ){
                    $.fn.blockstrap.core.loader('open');
                    $.fn.blockstrap.data.find('tokens', account_id, function(account)
                    {
                        if(account.password == ethUtil.sha3(password).toString('hex'))
                        {
                            $.fn.blockstrap.data.find('contracts', contract_id, function(contract)
                            {
                                if(
                                    account && contract
                                    && $.isPlainObject(account)
                                    && $.isPlainObject(contract)
                                    && typeof account.tokens != 'undefined'
                                    && typeof account.tokens[contract_id] != 'undefined'
                                ){
                                    var options = $.fn.blockstrap.settings.ethereum.defaults.abi;
                                    $.fn.blockstrap.plugins.ethereum.contracts.get(contract.address, options, function(this_contract)
                                    {
                                        var seed = ethUtil.sha3(blockstrap_functions.slug(account.name));
                                        var hashed_pw = ethUtil.sha3(password);
                                        var keys = $.fn.blockstrap.plugins.ethereum.keys(ethUtil.sha3(seed + '_' + hashed_pw));
                                        try{
                                            $.fn.blockstrap.plugins.ethereum.send({
                                                key: keys.private,
                                                from: account.keys.address,
                                                to: address,
                                                amount: amount,
                                                contract: this_contract,
                                                contract_address: this_contract.address
                                            }, function(hash)
                                            {
                                                if(hash)
                                                {
                                                    var name = this_contract.symbol() + ' ' + this_contract.name();
                                                    var message = '<p>Successfully sent ' + amount + ' ' + name + ' to ' + address + '</p>';
                                                    message+= '<p>TX HASH: ' + hash + '</p>';
                                                    $.fn.blockstrap.plugins.ethereum.addresses.update(account_id, account.keys.address, function()
                                                    {
                                                        $.fn.blockstrap.core.refresh(function()
                                                        {
                                                            $.fn.blockstrap.core.loader('close');
                                                            setTimeout(function()
                                                            {
                                                                $.fn.blockstrap.core.modal('Success', message);
                                                            }, $.fn.blockstrap.core.timeouts('loader'));
                                                        }, $.fn.blockstrap.core.page());
                                                    });
                                                }
                                            });
                                        }
                                        catch(error)
                                        {
                                            $.fn.blockstrap.core.loader('close');
                                            setTimeout(function()
                                            {
                                                $.fn.blockstrap.core.modal('Error', 'Invalid raw Ethereum transaction');
                                            }, $.fn.blockstrap.core.timeouts('loader'));
                                        }
                                    });
                                }
                                else if(
                                    account && contract_id
                                    && contract_id == 'eth'
                                    && $.isPlainObject(account)
                                    && typeof account.tokens != 'undefined'
                                    && typeof account.tokens[contract_id] != 'undefined'
                                ){
                                    var seed = ethUtil.sha3(blockstrap_functions.slug(account.name));
                                    var hashed_pw = ethUtil.sha3(password);
                                    var keys = $.fn.blockstrap.plugins.ethereum.keys(ethUtil.sha3(seed + '_' + hashed_pw));
                                    try{
                                        $.fn.blockstrap.plugins.ethereum.send({
                                            key: keys.private,
                                            from: account.keys.address,
                                            to: address,
                                            amount: amount
                                        }, function(hash)
                                        {
                                            if(hash)
                                            {
                                                var message = '<p>Successfully sent ' + amount + ' Ether to ' + address + '</p>';
                                                message+= '<p>TX HASH: ' + hash + '</p>';
                                                $.fn.blockstrap.plugins.ethereum.addresses.update(account_id, account.keys.address, function()
                                                {
                                                    $.fn.blockstrap.core.refresh(function()
                                                    {
                                                        $.fn.blockstrap.core.loader('close');
                                                        setTimeout(function()
                                                        {
                                                            $.fn.blockstrap.core.modal('Success', message);
                                                        }, $.fn.blockstrap.core.timeouts('loader'));
                                                    }, $.fn.blockstrap.core.page());
                                                });
                                            }
                                        });
                                    }
                                    catch(error)
                                    {
                                        $.fn.blockstrap.core.loader('close');
                                        setTimeout(function()
                                        {
                                            $.fn.blockstrap.core.modal('Error', 'Invalid raw Ethereum transaction');
                                        }, $.fn.blockstrap.core.timeouts('loader'));
                                    }
                                }
                            });
                        }
                        else
                        {
                            $.fn.blockstrap.core.loader('close');
                            setTimeout(function()
                            {
                                $.fn.blockstrap.core.modal('Warning', 'Incorrect password');
                            }, $.fn.blockstrap.core.timeouts('loader'));
                        }
                    });
                }
            });
        },
        watch: function()
        {
            $('body').on('submit', '#watch-token', function(e)
            {
                e.preventDefault();
                var form = $(this);
                var options = []
                var contract_address = $(form).find('#contract-address').val();
                var contract_options = $(form).find('#contract-options').val();
                if(contract_options) options = JSON.parse(contract_options.split('\n'));
                else options = $.fn.blockstrap.settings.ethereum.defaults.abi;
                if(
                    contract_address 
                    && $.isArray(options) 
                    && blockstrap_functions.array_length(options) > 0
                ){
                    $.fn.blockstrap.core.loader('open');
                    var contracts = $.fn.blockstrap.plugins.ethereum.contracts;
                    contracts.get(contract_address, options, function(contract)
                    {
                        if(
                            contract
                            && typeof contract.name != 'undefined'
                            && typeof contract.decimals != 'undefined'
                            && typeof contract.symbol != 'undefined'
                            && typeof contract.totalSupply != 'undefined'
                        ){
                            var slug = blockstrap_functions.slug(contract.name());
                            $.fn.blockstrap.data.find('contracts', slug, function(existing_contract)
                            {
                                if(
                                    typeof existing_contract == 'undefined'
                                    || !existing_contract
                                ){
                                    var this_contract = {
                                        id: slug,
                                        name: contract.name(),
                                        address: contract_address,
                                        decimals: contract.decimals().toNumber(),
                                        symbol: contract.symbol(),
                                        supply: contract.totalSupply().toNumber()
                                    }
                                    $.fn.blockstrap.data.save('contracts', slug, this_contract, function()
                                    {
                                        $.fn.blockstrap.core.refresh(function()
                                        {
                                            $.fn.blockstrap.core.loader('close');
                                            setTimeout(function()
                                            {
                                                $.fn.blockstrap.core.modal('Success', 'Successfully stored contract');
                                            }, $.fn.blockstrap.core.timeouts('loader'));
                                        }, $.fn.blockstrap.core.page());
                                    });
                                }
                                else
                                {
                                    $.fn.blockstrap.core.loader('close');
                                    setTimeout(function()
                                    {
                                        $.fn.blockstrap.core.modal('Warning', 'This contract already exists!');
                                    }, $.fn.blockstrap.core.timeouts('loader'));
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    
    ethereum.init = function()
    {
        ethereum.buttons.init();
        ethereum.forms.init();
    }
    
    ethereum.keys = function(seed, salt)
    {
        var keys = false;
        if(!salt && localStorage.getItem('nw_blockstrap_salt'))
        {
            if(blockstrap_functions.json(localStorage.getItem('nw_blockstrap_salt')))
            {
                salt = JSON.parse(localStorage.getItem('nw_blockstrap_salt'));
            }
        }
        if(seed && salt)
        {
            var eth_wallet = new Wallet(ethUtil.sha3(salt + '_' + seed));
            keys = {
                address: eth_wallet.getAddress().toString('hex'),
                private: eth_wallet.privKey.toString('hex'),
                public: eth_wallet.getPublicKey().toString('hex')
            };
        }
        return keys;
    }
    
    ethereum.render = function(unknown, data)
    {
        var slug = $.fn.blockstrap.core.page();
        if(
            typeof data.navigation != 'undefined'
            && $.isArray(data.navigation)
        ){
            var css = 'btn-page';
            if(slug == 'tokens')
            {
                css = 'btn-page active';
                if(
                    typeof data.modals == 'string'
                ){
                    var creste_form = $.fn.blockstrap.forms.process({
                        css: 'form-horizontal bs',
                        objects: [
                            {
                                id: 'create-token',
                                fields: [
                                    {
                                        inputs: {
                                            id: 'token-name',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Token Name'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Also used as part of key creation'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'token-decimals',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Token Decimals'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Maximum number of decimals places (less than 20)'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'token-supply',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Token Supply'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Required supply multiplied by 10 to the power of d (for decimals)'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'token-symbol',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Token Symbol'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Such as $ or % (for example)'
                                        }
                                    }
                                ],
                                buttons: {
                                    forms: [
                                        {
                                            id: 'cancel-create',
                                            css: 'btn-danger pull-right btn-split',
                                            text: 'Cancel',
                                            type: 'button',
                                            attributes: [
                                                {
                                                    key: 'data-dismiss',
                                                    value: 'modal'
                                                }
                                            ]
                                        },
                                        {
                                            type: "submit",
                                            id: "submit-create-token",
                                            css: 'btn-primary pull-right btn-split',
                                            text: 'Create Tokens'
                                        }
                                    ]
                                }
                            }
                        ]
                    });
                    var ethereum_modals = '<div class="modal fade " id="create-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Create New Tokens</h4></div><div class="modal-body no-footer"><p>'+creste_form+'</p><div class="row-fluid"></div></div></div></div></div>';
                    var watch_form = $.fn.blockstrap.forms.process({
                        css: 'form-horizontal bs',
                        objects: [
                            {
                                id: 'watch-token',
                                fields: [
                                    {
                                        inputs: {
                                            id: 'contract-address',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Contract Address'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Public address of token contract'
                                        }
                                    },
                                    {
                                        areas: {
                                            id: 'contract-options',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Contract Options'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Optional custom contract options'
                                        }
                                    }
                                ],
                                buttons: {
                                    forms: [
                                        {
                                            id: 'cancel-watch',
                                            css: 'btn-danger pull-right btn-split',
                                            text: 'Cancel',
                                            type: 'button',
                                            attributes: [
                                                {
                                                    key: 'data-dismiss',
                                                    value: 'modal'
                                                }
                                            ]
                                        },
                                        {
                                            type: "submit",
                                            id: "submit-watch-token",
                                            css: 'btn-primary pull-right btn-split',
                                            text: 'Fetch Contract'
                                        }
                                    ]
                                }
                            }
                        ]
                    });
                    ethereum_modals+= '<div class="modal fade " id="watch-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Watch Existing Tokens</h4></div><div class="modal-body no-footer"><p>'+watch_form+'</p><div class="row-fluid"></div></div></div></div></div>';
                    var account_form = $.fn.blockstrap.forms.process({
                        css: 'form-horizontal bs',
                        objects: [
                            {
                                id: 'account-token',
                                fields: [
                                    {
                                        inputs: {
                                            id: 'account-name',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Account Name'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Used as part of key creation'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'account-password',
                                            type: 'password',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Account Password'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Used as part of key creation'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'account-password-repeat',
                                            type: 'password',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Repeat Password'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Better to be safe than sorry'
                                        }
                                    }
                                ],
                                buttons: {
                                    forms: [
                                        {
                                            id: 'cancel-account',
                                            css: 'btn-danger pull-right btn-split',
                                            text: 'Cancel',
                                            type: 'button',
                                            attributes: [
                                                {
                                                    key: 'data-dismiss',
                                                    value: 'modal'
                                                }
                                            ]
                                        },
                                        {
                                            type: "submit",
                                            id: "submit-account-token",
                                            css: 'btn-primary pull-right btn-split',
                                            text: 'Create Account'
                                        }
                                    ]
                                }
                            }
                        ]
                    });
                    ethereum_modals+= '<div class="modal fade " id="account-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Create New Token Account</h4></div><div class="modal-body no-footer"><p>'+account_form+'</p><div class="row-fluid"></div></div></div></div></div>';
                    var contracts = $.fn.blockstrap.plugins.ethereum.contracts.all();
                    var contract_values = [
                        {
                            value: '',
                            text: '-- Select Token Contract'
                        }
                    ];
                    if(contracts && $.isArray(contracts) && blockstrap_functions.array_length(contracts) > 0)
                    {
                        $.each(contracts, function(k, contract)
                        {
                            contract_values.push({
                                value: contract.id,
                                text: contract.name
                            });
                        });
                    }
                    var add_form = $.fn.blockstrap.forms.process({
                        css: 'form-horizontal bs',
                        objects: [
                            {
                                id: 'add-token',
                                fields: [
                                    {
                                        selects: 
                                        {
                                            id: 'contract',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Existing Contract'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            values: contract_values
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'token-name',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'New Token Name'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Optionally create new tokens from this address...'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'token-decimals',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Token Decimals'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Maximum number of decimals places (less than 20)'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'token-supply',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Token Supply'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Required supply multiplied by 10 to the power of d (for decimals)'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'token-symbol',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Token Symbol'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Such as $ or % (for example)'
                                        }
                                    }
                                ],
                                buttons: {
                                    forms: [
                                        {
                                            id: 'cancel-addition',
                                            css: 'btn-danger pull-right btn-split',
                                            text: 'Cancel',
                                            type: 'button',
                                            attributes: [
                                                {
                                                    key: 'data-dismiss',
                                                    value: 'modal'
                                                }
                                            ]
                                        },
                                        {
                                            type: "submit",
                                            id: "submit-add-token",
                                            css: 'btn-primary pull-right btn-split',
                                            text: 'Add Token'
                                        }
                                    ]
                                }
                            }
                        ]
                    });
                    ethereum_modals+= '<div class="modal fade " id="add-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Add Token Contract to Account</h4></div><div class="modal-body no-footer"><p>'+add_form+'</p><div class="row-fluid"></div></div></div></div></div>';
                    var send_form = $.fn.blockstrap.forms.process({
                        css: 'form-horizontal bs',
                        objects: [
                            {
                                id: 'send-token',
                                fields: [
                                    {
                                        hiddens: 
                                        {
                                            id: 'contract-id'
                                        }
                                    },
                                    {
                                        hiddens: 
                                        {
                                            id: 'account-id'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'amount',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Amount to Send'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'How much to send...?'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'address',
                                            type: 'text',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Address'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Where to send it...?'
                                        }
                                    },
                                    {
                                        inputs: {
                                            id: 'password',
                                            type: 'password',
                                            label: {
                                                css: 'col-xs-3',
                                                text: 'Password'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            placeholder: 'Password required in order to send'
                                        }
                                    }
                                ],
                                buttons: {
                                    forms: [
                                        {
                                            id: 'cancel-send',
                                            css: 'btn-danger pull-right btn-split',
                                            text: 'Cancel',
                                            type: 'button',
                                            attributes: [
                                                {
                                                    key: 'data-dismiss',
                                                    value: 'modal'
                                                }
                                            ]
                                        },
                                        {
                                            type: "submit",
                                            id: "submit-send-token",
                                            css: 'btn-primary pull-right btn-split',
                                            text: 'Send'
                                        }
                                    ]
                                }
                            }
                        ]
                    });
                    ethereum_modals+= '<div class="modal fade " id="send-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Send Tokens</h4></div><div class="modal-body no-footer"><p>'+send_form+'</p><div class="row-fluid"></div></div></div></div></div>';
                    data.modals+= ethereum_modals;
                }
            }
            data.navigation.push({
                css: css,
                href: '#tokens',
                id: 'tokens',
                text: 'Tokens'
            });
        };
        return data;
    };
    
    ethereum.send = function(options, callback)
    {
        var defaults = {
            key: false,
            from: false,
            to: false,
            amount: 0,
            contract: false,
            contract_address: false,
            abi: false,
            gas_price: 50000000000,
            gas_limit: 100000
        }
        var settings = defaults;
        if(typeof options != 'undefined' && $.isPlainObject(options))
        {
            settings = $.extend({}, defaults, options);
        }
        
        if($.fn.blockstrap.settings.ethereum.connected === true)
        {
            
            var ether_to_send = web3.fromDecimal(web3.toWei(settings.amount), 'ether');
            var private_key = new Buffer(settings.key, 'hex');

            if(!settings.abi)
            {
                settings.abi = [{"constant":true, "inputs":[], "name":"name", "outputs":[{"type":"string"}], "type":"function"}, {"constant":true, "inputs":[], "name":"totalSupply", "outputs":[{"type":"uint256"}], "type":"function"}, {"constant":true, "inputs":[{"type":"address"}], "name":"balanceOf", "outputs":[{"type":"uint256"}], "type":"function"}, {"constant":true, "inputs":[], "name":"symbol", "outputs":[{"type":"string"}], "type":"function"}, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "type": "function"}, {"constant":true, "inputs":[], "name":"decimals", "outputs":[{"type":"uint8"}], "type":"function"},{"anonymous":false, "inputs": [ { "indexed": true, "name": "from", "type": "address"}, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event"}];
            }

            var raw_tx = {
                nonce: web3.eth.getTransactionCount(settings.from),
                gasPrice: settings.gas_price,
                gasLimit: settings.gas_limit,
                to: settings.to, 
                value: ether_to_send,
            }

            if(settings.contract)
            {
                var token_decimals = settings.contract.decimals().toNumber();
                var token_divider = '1';
                for(i = 0; i < token_decimals; i++)
                {
                    token_divider+= '0';
                }
                token_divider = parseInt(token_divider);
                var hex_data = settings.contract.transfer.getData(settings.to, parseInt(parseFloat(settings.amount * token_divider)));
                raw_tx.value = 0;
                raw_tx.data = hex_data;
                raw_tx.to = settings.contract_address;
            }
            var tx = new EthJS.Tx(raw_tx);
            tx.sign(private_key);
            var serialized_tx = tx.serialize();
            web3.eth.sendRawTransaction(serialized_tx.toString('hex'), function(err, hash) 
            {
                if(
                    hash
                    && typeof callback == 'function'
                ){
                    callback(hash)
                }
                else
                {
                    $.fn.blockstrap.core.loader('close');
                    setTimeout(function()
                    {
                        $.fn.blockstrap.core.modal('Error', 'Unable to process transaction');
                    }, $.fn.blockstrap.core.timeouts('loader'));
                }
            });
        }
        else
        {
            $.fn.blockstrap.core.loader('close');
            setTimeout(function()
            {
                $.fn.blockstrap.core.modal('Warning', 'Currently need to be connected to local Geth to send transactions!');
            }, $.fn.blockstrap.core.timeouts('loader'));
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {ethereum:ethereum});
    
    // QUICK FIX FOR NOW - IF ADDING AN ACTION FROM WITHIN A PLUGIN 
    // THAT CALLS THAT SAME PLUGIN - IT MUST BE ADDED AFTER THE MERGE
    $.fn.blockstrap.core.add_action(
        'init', 
        'ethereum_init',
        'plugins.ethereum', 
        'init'
    );
    
    $.fn.blockstrap.core.add_filter('templates_render', 'ethereum_template_render', 'plugins.ethereum', 'render');
})
(jQuery);
