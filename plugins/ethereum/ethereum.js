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
                        tx_count: 'N/A',
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
            $('body').on('submit', '', function(e)
            {
                e.preventDefault();
                var form = $(this);
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
            });
        },
        create: function()
        {
            $('body').on('submit', '', function(e)
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
            ethereum.forms.watch();
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
                                                text: 'Token Contract'
                                            },
                                            wrapper: {
                                                css: 'col-xs-9'
                                            },
                                            values: contract_values
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
