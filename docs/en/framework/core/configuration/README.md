## Configuring Blockstrap Core

Each blockstrap application that is powered by core is constructed from three configuration files.

* __Default Configuration__ (`/defaults.json`) - _must be located in the root folder_
* __Custom Configuration__ (`/themes/config.json`) - _assuming `themes` is set by `defaults`_
* __Theme Configuration__ (`/themes/default/config.json`) - _assuming the `default` theme is being used_
* __Secret Configuration__ (`/secret.json`) - _ignored by git repo_

If these files are not found in these locations, or in the locations set by each of the corresponding configuration files, blockstrap may fail to function properly. All options can also be provided via regular jQuery plugin initialization options (where they will only override the default configuration) or via HTML5 data attributes where they will also override custom configuration. At either previous configuration point, skipping all other configuration files is also possible by setting `skip_config: true`.

__Default Configuration__ is used to set all the defaults for all of the available options that can be configured.

__Custom Configuration__ is used by an application owner to configure universal settings.

__Theme Configuration__ is used by a theme or application owner to configure things relevant to that theme.

__Secret Configuration__ is used to override all other configuration and should not be included in repositories.

-------------------------
#### Important Configuration Settings

Some important configuration settings that may go un-noticed / un-used by new developers include:

* __key__: not included in configuration by default, adding it and providing a valid API Key will allow you to use APIs that require or utilize API Keys.
* __install__: if this is set to `false` the modules and dependencies will not be auto-loaded and cache settings will be ignored.
* __cascade__: set to `true` by default, this tries to load / merge dependencies and modules from core and then from theme simply by adding file names. If set to `false` you will need to provide full paths for the required files but it will only try to load from there.
* __cache__: this array selects which files are stored within localStorage and re-used upon returning visits. By default, these are all set to false, which is ideal for production. When going live, you may want to set these to `true` in order to increase the speed of page loads as follows:

<!--pre-javascript-->
```
"cache": {
    "api": {
        "timeout": 60000, // Used as default time to live with api module
        "markets": 60000 // Used by markets plugin
    },
    "accounts": 60000, // Used with accounts.poll and accounts.update and theme.balance
    "dependencies": true,
    "modules": true,
    "less": true,
    "bootstrap": true,
    "plugins": true,
    "css": true,
    "config": true,
    "json": true,
    "html": true
}
```

The settings listed above that have numbers in-place of boolean values represent the functions that can have specific lifespans applied to their caching, with each one set to 60 seconds by default. With all of these options set to `true` as listed above, no external files will ever need to be externally loaded once installed and saved to localStorage for the first time.

In order to see how the `install:false` setting and other configurations or scenarios works, please see the [examples](../../examples/) section for more details.

-----

Here are the current configuration files and some explanations to follow:

---------------------------------------------
#### Default Configuration - `/defaults.json`

___Please note the included comments added to the JSON seen below.___

This would break the application if used in production as comments are not valid within JSON arrays.

Lines 113 onwards are used solely for internal tests and API mapping.

<!--pre-javascript-->
```
{
    "v": "0.5.0.2", // Used internally to perform updates
    "public": false, // Defines whether public user-views are required
    "security": false, // If user views are required, administrator needs to enter security hash
    "role": "admin", // What role should the appropriate user be given...?
    "id": "blockstrap", // ID of HTML container used to display the application
    "theme": "default", // Default theme to be used
    "less": false, // Should inline LESS.js be used...?
    "test": false, // Run internal tests...?
    "refresh": false, // Force refresh of locally stored files
    "cascade": true, // Perform cascading inclunsion of dependencies and modules
    "html_base": "html/", // The default location of the HTML templates
    "data_base": "data/", // The default location of the JSON data arrays
    "core_base": "blockstrap/", // The default location of core files
    "theme_base": "themes/", // The default location of theme files
    "dependency_base": "js/dependencies/", // The default location of dependency files
    "module_base": "js/modules/", // The default location of module files
    "page_base": "index", // The file name to use as the default HTML and DATA required for page rendering?
    "slug_base": "dashboard", // The file containing the inserted content for returning to homepage
    "api_service": "blockstrap", // The default API service used by the API module
    "base_url": "", // This gets filled-in by the framework upon initialization
    "content_id": "main-content", // The ID of the HTML element used to insert new paged content
    "navigation_id": "navigation", // The ID of the HTML element containing the main navigation
    "mobile_nav_id": "mobile-footer", // The ID of the HTML element containing the mobile navigation
    "css": ["less", "font-awesome"], // An array of CSS files to include
    "store": [
        // An array of setup componets to store publicly
        "app_url", 
        "your_name",
        "your_username"
    ],
    "modules": [
        // An array of modules to include
        "forms",
        "accounts",
        "contacts",
        "data", 
        "api", 
        "security", 
        "theme",
        "buttons", 
        "styles", 
        "templates",
        "filters",
        "blockchains"
    ],
    "dependencies": [
        // An array of dependencies to include 
        "sonic", 
        "crypto",
        "effects", 
        "steps",
        "bootstrap.min", 
        "bootstrap-switch.min",
        "mustache", 
        "tables",
        "qrcode",
        "bootstrap-filestyle.min",
        "bitcoinjs-lib2",
        "tx",
        "sha3",
        "rest",
        "ago"
    ],
    "bootstrap": [
        // An array of Bootstrap HTML snippets to include
        "lists", 
        "jumbotrons", 
        "panels", 
        "tables", 
        "modals", 
        "forms", 
        "bars"
    ],
    "buttons": {
        // An array of button classes and ID to be assigned functinality
        "classes": [
            "access", 
            "edit", 
            "login", 
            "logout", 
            "page",
            "print",
            "refresh",
            "remove",
            "reset",
            "setup",
            "import",
            "toggle"
        ],
        "ids": [
            "create-account",
            "create-contact",
            "create-credentials",
            "edit-object",
            "more-security",
            "send-money",
            "set-credentials",
            "submit-import",
            "submit-payment",
            "submit-verification"
        ]
    },
    "contacts": [
        // An array of contacts to auto-install upon setup completion
        {
            "name": "Blockstrap Donations",
            "address": "13uXA8zfLjsnrg69f6FcHVRfwBGobYU3bc",
            "blockchain": "btc",
            "contact_email": "info@neroware.io"
        }
    ],      
    "tests": {
        // An array of tests to run
        "api": {
            "address": {
                "request": "1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k",
                "results": {
                    "address": "1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k",
                    "balance": 10019000,
                    "blockchain": "btc",
                    "hash": "f1260c3cd86ecc03ce460c303ec0e8006e32273d",
                    "received": 10019000,
                    "tx_count": 2
                }
            },
            "addresses": {
                "request": [
                    "1121cQLqCsDsLPAkJW5ddTCREZ7Bp4ufrk",
                    "12higDjoCCNXSA95xZMWUdPvXNmkAduhWv"
                ],
                "results": [
                    {
                        "address": "1121cQLqCsDsLPAkJW5ddTCREZ7Bp4ufrk",
                        "balance": 0,
                        "blockchain": "btc",
                        "hash": "0030ececbad05ffcdff89f3f26e38ca3d735a8de",
                        "received": 5000000000,
                        "tx_count": 2
                    },
                    {
                        "address": "12higDjoCCNXSA95xZMWUdPvXNmkAduhWv",
                        "balance": 1,
                        "blockchain": "btc",
                        "hash": "12ab8dc588ca9d5787dde7eb29569da63c3a238c",
                        "received": 7764439255613,
                        "tx_count": 78
                    }
                ]
            },
            "block": {
                "request": "15968",
                "results": {
                    "blockchain": "btc",
                    "hash": "00000000201016a83272835468d457d15965d57f57c0da5944dc94ea9389f360",
                    "height": 15968,
                    "next": "0000000037d7c9885177df7af395d2e99b176a9372a03b855abdf2c9adac90b1",
                    "prev": "00000000abae6b44fa98526e865a08820f4528eda46cad40445de3690c502ae8",
                    "time": 1243609567,
                    "tx_count": 2
                }
            },
            "relay": {
                "request": "0100000001ec71e2ceac8476bea21fbc4a97062c000f07def6c8ef8d9171fb1a5e113418e0010000008c493046022100e6f39b4393794ef03b0f9dc71395e0835a211015b42ab4329cb6a6c1c8b3c6ea022100f1ccae451f35e5c5ad25a8f7e7b5e778bafc4dc69dd560fab1cbadbb88767916014104e1934263e84e202ebffca95246b63c18c07cd369c4f02de76dbd1db89e6255dacb3ab1895af0422e24e1d1099e80f01b899cfcdf9b947575352dbc1af57466b5ffffffff0210270000000000001976a914652c453e3f8768d6d6e1f2985cb8939db91a4e0588ace065f81f000000001976a914cf0dfe6e0fa6ea5dda32c58ff699071b672e1faf88ac00000000",
                "results": false
            },
            "transaction": {
                "request": "06032a172f88ba823785f87341eab26ee7a2eb2de9d2f105220d6580e3affc16",
                "results": {
                    "block": 15968,
                    "blockchain": "btc",
                    "fees": 0,
                    "input": 300000000000,
                    "output": 300000000000,
                    "size": 6883,
                    "time": 1243609567,
                    "txid": "06032a172f88ba823785f87341eab26ee7a2eb2de9d2f105220d6580e3affc16",
                    "value": 300000000000
                }
            },
            "transactions": {
                "request": "1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k",
                "results": [
                    {
                        "block": 317958,
                        "blockchain": "btc",
                        "fees": 10000,
                        "input": 1030000,
                        "output": 1020000,
                        "size": 668,
                        "time": 1409255576,
                        "txid": "5e441731363d19e7fb541600a944189724d1fd6863483b1d3903b2a2863aafa7",
                        "value": 19000
                    },
                    {
                        "block": 317957,
                        "blockchain": "btc",
                        "fees": 0,
                        "input": 25000000,
                        "output": 25000000,
                        "size": 225,
                        "time": 1409255541,
                        "txid": "65e7df7f40e1a38626a98a150730e5ed42d4b6b648ca9ff66e035ec21903aca3",
                        "value": 10000000
                    }
                ]
            },
            "unspents": {
                "request": "1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k",
                "results": [
                    {
                        "index": 0,
                        "script": "76a914f1260c3cd86ecc03ce460c303ec0e8006e32273d88ac",
                        "txid": "5e441731363d19e7fb541600a944189724d1fd6863483b1d3903b2a2863aafa7",
                        "value": 19000
                    },
                    {
                        "index": 0,
                        "script": "76a914f1260c3cd86ecc03ce460c303ec0e8006e32273d88ac",
                        "txid": "65e7df7f40e1a38626a98a150730e5ed42d4b6b648ca9ff66e035ec21903aca3",
                        "value": 10000000
                    }
                ]
            }
        }
    },
    "cache": {
        // This array controls the milliseconds certain results are cached
        "api": {
            "address": 60000,
            "timeout": 60000
        },
        "pages": 60000,
        "accounts": 60000,
        // It also controls which file types are stored locally to increase speed on return visits
        "dependencies": true,
        "modules": true,
        "less": true,
        "bootstrap": true,
        "plugins": true,
        "css": true,
        "config": true,
        "json": true,
        "html": true
    },
    "exchange": {
        // This array controls the default exachange rate used when dynamic ones are unavilable
        "btc": 500,
        "ltc": 5
    },
    "styles": {
        // This is ademonstration of how styling can be affected using JS options
        "vars": {
            "content_bg": "#DDD",
            "header_bg": "#475862"
        },
        "elements": {
            "content_bg": "#main-content",
            "header_bg": "header"
        },
        "rules": {
            "content_bg": "background",
            "header_bg": "background"
        }
    },
    "blockchains": {
        // Configure which blockchains your application will support
        "btct": {
            "blockchain": "Bitcoin Testnet",
            "lib": "bitcointestnet",
            "apis": {
                "helloblock": "https://mainnet.helloblock.io/v1/",
                "blockstrap": "https://api.blockstrap.com/v0/btct/",
                "sochain": "https://chain.so/api/v2/",
                "blockr": "http://tbtc.blockr.io/api/v1/"
            },
            "fee": 0.0001
        },
        "ltct": {
            "blockchain": "Litecoin Testnet",
            "lib": "litecointestnet",
            "apis": {
                "helloblock": "https://mainnet.helloblock.io/v1/",
                "blockstrap": "https://api.blockstrap.com/v0/ltct/",
                "sochain": "https://chain.so/api/v2/",
                "blockr": "http://ltc.blockr.io/api/v1/"
            },
            "fee": 0.0001
        },
        "doget": {
            "blockchain": "Dogecoin Testnet",
            "lib": "dogecointestnet",
            "apis": {
                "helloblock": "https://mainnet.helloblock.io/v1/",
                "blockstrap": "https://api.blockstrap.com/v0/dogt/",
                "sochain": "https://chain.so/api/v2/",
                "blockr": "http://dgc.blockr.io/api/v1/"
            },
            "fee": 0.0001
        },
        "btc": {
            "blockchain": "Bitcoin",
            "lib": "bitcoin",
            "apis": {
                "helloblock": "https://mainnet.helloblock.io/v1/",
                "blockstrap": "https://api.blockstrap.com/v0/btc/",
                "sochain": "https://chain.so/api/v2/",
                "blockr": "http://btc.blockr.io/api/v1/"
            },
            "fee": 0.0001
        },
        "ltc": {
            "blockchain": "Litecoin",
            "lib": "litecoin",
            "apis": {
                "helloblock": "https://mainnet.helloblock.io/v1/",
                "blockstrap": "https://api.blockstrap.com/v0/ltc/",
                "sochain": "https://chain.so/api/v2/",
                "blockr": "http://ltc.blockr.io/api/v1/"
            },
            "fee": 0.0001
        },
        "doge": {
            "blockchain": "Dogecoin",
            "lib": "dogecoin",
            "apis": {
                "helloblock": "https://mainnet.helloblock.io/v1/",
                "blockstrap": "https://api.blockstrap.com/v0/doge/",
                "sochain": "https://chain.so/api/v2/",
                "blockr": "http://dgc.blockr.io/api/v1/"
            },
            "fee": 0.0001
        }
    },
    "apis": {
        // The defaults are used when end-points are the same for each blockchain
        "defaults": {
            "blockstrap": {
                "functions": {
                    // TO represents the end-points you want to call
                    "to": {
                        "address": "addressTransactions/",
                        "addresses": "addresses/",
                        "transaction": "transaction/",
                        "transactions": "addressTransactions/$call?showtxnio=1",
                        "block": "blockHeight/",
                        "market": "marketStats/",
                        "relay": "transactionRelay/",
                        "relay_param": "",
                        "unspents": "addressUnspents/$call?showtxnio=1"
                    },
                    // FROM represents what to do with the data returned
                    "from": {
                        "address": {
                            "key": "address",
                            "address": "address",
                            "hash": "address_hash160",
                            "tx_count": "inout_count_total",
                            "received": "inputs_value_confirmed",
                            "balance": "balance"
                        },
                        "addresses": {
                            "key": "addresses",
                            "delimiter": ",",
                            "address": "address",
                            "hash": "address_hash160",
                            "tx_count": "inout_count_total",
                            "received": "inputs_value_confirmed",
                            "balance": "balance"
                        },
                        "block": {
                            "key": "blocks.0",
                            "height": "height",
                            "hash": "[id, lowercase]",
                            "prev": "[prev_block_id, lowercase]",
                            "next": "[next_block_id, lowercase]",
                            "tx_count": "tx_count",
                            "time": "time"
                        },
                        "market": {
                            "key": "market",
                            "btc_to_usd": "price_24hr",
                            "daily_txs": "txn_count_24hr",
                            "daily_sent": "value_sent_24hr",
                            "hash_rate": "hashrate",
                            "btc_discovered": "coins_discovered",
                            "market_cap": "marketcap"
                        },
                        "relay": {
                            "txid": "",
                            "inner": ""
                        },
                        "transaction": {
                            "key": "transaction",
                            "txid": "[id, lowercase]",
                            "size": "size",
                            "block": "block_height",
                            "time": "block_time",
                            "input": "input_value",
                            "output": "output_value",
                            "value": "[_output_value, -, _fees, int]",
                            "fees": "_fees"
                        },
                        "transactions": {
                            "key": "address.transactions",
                            "txid": "[id, lowercase]",
                            "size": "size",
                            "block": "block_height",
                            "time": "block_time",
                            "input": "input_value",
                            "output": "output_value",
                            "value": "tx_address_value",
                            "fees": "fees"
                        },
                        "unspents": {
                            "key": "address.transactions",
                            "reverse_array": true,
                            "confirmations": "confirmations",
                            "txid": "[id, lowercase]",
                            "index": "tx_address_pos",
                            "value": "tx_address_value",
                            "script": "[tx_address_script_pub_key, lowercase]"
                        }
                    }
                }
            },
            "blockr": {
                "functions": {
                    "to": {
                        "address": "address/info/",
                        "addresses": "address/info/",
                        "block": "block/info/",
                        "relay": "tx/push/",
                        "relay_param": "hex",
                        "transaction": "tx/info/",
                        "transactions": "address/txs/",
                        "unspents": "address/unspent/"
                    },
                    "from": {
                        "address": {
                            "key": "",
                            "address": "address",
                            "hash": "[address, hextohash]",
                            "tx_count": "nb_txs",
                            "received": "[totalreceived, float]",
                            "balance": "[balance, float]"
                        },
                        "addresses": {
                            "key": "",
                            "delimiter": ",",
                            "address": "address",
                            "hash": "[address, hextohash]",
                            "tx_count": "nb_txs",
                            "received": "[totalreceived, float]",
                            "balance": "[balance, float]"
                        },
                        "block": {
                            "key": "",
                            "height": "nb",
                            "hash": "hash",
                            "prev": "prev_block_hash",
                            "next": "next_block_hash",
                            "tx_count": "nb_txs",
                            "time": "[time_utc, utctoepoch]"
                        },
                        "relay": {
                            "txid": "",
                            "inner": ""
                        },
                        "transaction": {
                            "key": "",
                            "txid": "tx",
                            "size": "",
                            "block": "block",
                            "time": "[time_utc, utctoepoch]",
                            "input": "",
                            "output": "",
                            "value": "[amount, float]",
                            "fees": "[fee, float]"
                        },
                        "transactions": {
                            "key": ".txs",
                            "txid": "tx",
                            "size": "",
                            "block": "",
                            "time": "[time_utc, utc_to_epoch]",
                            "input": "",
                            "output": "",
                            "value": "[amount, float]",
                            "fees": "[fee, float]"
                        },
                        "unspents": {
                            "key": ".unspent",
                            "confirmations": "confirmations",
                            "txid": "tx",
                            "index": "n",
                            "value": "[amount, float]",
                            "script": "script"
                        }
                    }
                }
            }
        },
        "btc": {
            "helloblock": {
                "functions": {
                    "to": {
                        "address": "addresses/",
                        "addresses": "addresses?addresses=",
                        "transaction": "transactions/",
                        "transactions": "addresses/$call/transactions?limit=100",
                        "block": "blocks/",
                        "relay": "transactions/",
                        "relay_param": "rawTxHex",
                        "unspents": "addresses/$call/unspents?limit=100"
                    },
                    "from": {
                        "address": {
                            "key": "address",
                            "address": "address",
                            "hash": "hash160",
                            "tx_count": "txsCount",
                            "received": "confirmedReceivedValue",
                            "balance": "balance"
                        },
                        "addresses": {
                            "key": "addresses",
                            "delimiter": "&addresses=",
                            "address": "address",
                            "hash": "hash160",
                            "tx_count": "txsCount",
                            "received": "confirmedReceivedValue",
                            "balance": "balance"
                        },
                        "transaction": {
                            "key": "transaction",
                            "txid": "txHash",
                            "size": "size",
                            "block": "blockHeight",
                            "time": "blockTime",
                            "input": "totalInputsValue",
                            "output": "totalOutputsValue",
                            "value": "estimatedTxValue",
                            "fees": "fees"
                        },
                        "transactions": {
                            "key": "transactions",
                            "txid": "txHash",
                            "size": "size",
                            "block": "blockHeight",
                            "time": "blockTime",
                            "input": "totalInputsValue",
                            "inputs": "inputs",
                            "output": "totalOutputsValue",
                            "outputs": "outputs",
                            "value": "estimatedTxValue",
                            "fees": "fees"
                        },
                        "block": {
                            "key": "block",
                            "height": "blockHeight",
                            "hash": "blockHash",
                            "prev": "prevBlockHash",
                            "tx_count": "txsCount",
                            "time": "blockTime"
                        },
                        "relay": {
                            "txid": "txHash",
                            "inner": "transaction"
                        },
                        "unspents": {
                            "key": "unspents",
                            "confirmations": "confirmations",
                            "txid": "txHash",
                            "index": "index",
                            "value": "value",
                            "script": "scriptPubKey"
                        }
                    }
                }
            },
            "sochain": {
                "functions": {
                    "to": {
                        "address": "address/BTC/",
                        "addresses": "",
                        "transaction": "tx/BTC/",
                        "transactions": "address/BTC/",
                        "block": "block/BTC/",
                        "relay": "send_tx/BTC/",
                        "relay_param": "tx_hex",
                        "unspents": "get_tx_unspent/BTC/"
                    },
                    "from": {
                        "address": {
                            "key": "",
                            "address": "address",
                            "hash": "[address, hextohash]",
                            "tx_count": "total_txs",
                            "received": "[received_value, float]",
                            "balance": "[balance, float]"
                        },
                        "addresses": {
                            "key": "",
                            "address": "",
                            "hash": "",
                            "tx_count": "",
                            "received": "",
                            "balance": ""
                        },
                        "block": {
                            "key": "",
                            "height": "block_no",
                            "hash": "blockhash",
                            "prev": "previous_blockhash",
                            "next": "next_blockhash",
                            "tx_count": "[txs, count]",
                            "time": "time"
                        },
                        "relay": {
                            "txid": "tx_hex",
                            "inner": "transaction"
                        },
                        "transaction": {
                            "key": "",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "[sent_value, float]",
                            "fees": "[fee, float]"
                        },
                        "transactions": {
                            "key": ".txs",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "",
                            "fees": ""
                        },
                        "unspents": {
                            "key": ".txs",
                            "reverse_array": true,
                            "confirmations": "confirmations",
                            "txid": "txid",
                            "index": "output_no",
                            "value": "[value, float]",
                            "script": "script_hex"
                        }
                    }
                }
            }
        },
        "ltc": {
            "sochain": {
                "functions": {
                    "to": {
                        "address": "address/LTC/",
                        "addresses": "",
                        "transaction": "tx/LTC/",
                        "transactions": "",
                        "block": "block/LTC/",
                        "relay": "send_tx/LTC/",
                        "relay_param": "tx_hex",
                        "unspents": "get_tx_unspent/LTC/"
                    },
                    "from": {
                        "address": {
                            "key": "",
                            "address": "address",
                            "hash": "",
                            "tx_count": "total_txs",
                            "received": "received_value",
                            "balance": "balance"
                        },
                        "addresses": {
                            "key": "",
                            "address": "",
                            "hash": "",
                            "tx_count": "",
                            "received": "",
                            "balance": ""
                        },
                        "transaction": {
                            "key": "",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "sent_value",
                            "fees": "fee"
                        },
                        "transactions": {
                            "key": "",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "sent_value",
                            "fees": "fee"
                        },
                        "block": {
                            "key": "",
                            "height": "block_no",
                            "hash": "blockhash",
                            "prev": "previous_blockhash",
                            "next": "next_blockhash",
                            "tx_count": "",
                            "time": "time"
                        },
                        "relay": {
                            "txid": "tx_hex",
                            "inner": "transaction"
                        },
                        "unspents": {
                            "key": ".txs",
                            "confirmations": "confirmations",
                            "txid": "txid",
                            "index": "output_no",
                            "value": "value",
                            "script": "script_hex"
                        }
                    }
                }
            }
        },
        "doge": {
            "sochain": {
                "functions": {
                    "to": {
                        "address": "address/DOGE/",
                        "addresses": "",
                        "transaction": "tx/DOGE/",
                        "transactions": "",
                        "block": "block/DOGE/",
                        "relay": "send_tx/DOGE/",
                        "relay_param": "tx_hex",
                        "unspents": "get_tx_unspent/DOGE/"
                    },
                    "from": {
                        "address": {
                            "key": "",
                            "address": "address",
                            "hash": "[address, hextohash]",
                            "tx_count": "total_txs",
                            "received": "[received_value, float]",
                            "balance": "[balance, float]"
                        },
                        "addresses": {
                            "key": "",
                            "address": "",
                            "hash": "",
                            "tx_count": "",
                            "received": "",
                            "balance": ""
                        },
                        "block": {
                            "key": "",
                            "height": "block_no",
                            "hash": "blockhash",
                            "prev": "previous_blockhash",
                            "next": "next_blockhash",
                            "tx_count": "[txs, count]",
                            "time": "time"
                        },
                        "relay": {
                            "txid": "tx_hex",
                            "inner": "transaction"
                        },
                        "transaction": {
                            "key": "",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "[sent_value, float]",
                            "fees": "[fee, float]"
                        },
                        "transactions": {
                            "key": ".txs",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "",
                            "fees": ""
                        },
                        "unspents": {
                            "key": ".txs",
                            "reverse_array": true,
                            "confirmations": "confirmations",
                            "txid": "txid",
                            "index": "output_no",
                            "value": "[value, float]",
                            "script": "script_hex"
                        }
                    }
                }
            }
        },
        "btct": {
            "sochain": {
                "functions": {
                    "to": {
                        "address": "address/BTCTEST/",
                        "addresses": "",
                        "transaction": "tx/BTCTEST/",
                        "transactions": "",
                        "block": "block/BTCTEST/",
                        "relay": "send_tx/BTCTEST/",
                        "relay_param": "tx_hex",
                        "unspents": "get_tx_unspent/BTCTEST/"
                    },
                    "from": {
                        "address": {
                            "key": "",
                            "address": "address",
                            "hash": "[address, hextohash]",
                            "tx_count": "total_txs",
                            "received": "[received_value, float]",
                            "balance": "[balance, float]"
                        },
                        "addresses": {
                            "key": "",
                            "address": "",
                            "hash": "",
                            "tx_count": "",
                            "received": "",
                            "balance": ""
                        },
                        "block": {
                            "key": "",
                            "height": "block_no",
                            "hash": "blockhash",
                            "prev": "previous_blockhash",
                            "next": "next_blockhash",
                            "tx_count": "[txs, count]",
                            "time": "time"
                        },
                        "relay": {
                            "txid": "tx_hex",
                            "inner": "transaction"
                        },
                        "transaction": {
                            "key": "",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "[sent_value, float]",
                            "fees": "[fee, float]"
                        },
                        "transactions": {
                            "key": ".txs",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "",
                            "fees": ""
                        },
                        "unspents": {
                            "key": ".txs",
                            "reverse_array": true,
                            "confirmations": "confirmations",
                            "txid": "txid",
                            "index": "output_no",
                            "value": "[value, float]",
                            "script": "script_hex"
                        }
                    }
                }
            }
        },
        "ltct": {
            "sochain": {
                "functions": {
                    "to": {
                        "address": "address/LTCTEST/",
                        "addresses": "",
                        "transaction": "tx/LTCTEST/",
                        "transactions": "",
                        "block": "block/LTCTEST/",
                        "relay": "send_tx/LTCTEST/",
                        "relay_param": "tx_hex",
                        "unspents": "get_tx_unspent/LTCTEST/"
                    },
                    "from": {
                        "address": {
                            "key": "",
                            "address": "address",
                            "hash": "[address, hextohash]",
                            "tx_count": "total_txs",
                            "received": "[received_value, float]",
                            "balance": "[balance, float]"
                        },
                        "addresses": {
                            "key": "",
                            "address": "",
                            "hash": "",
                            "tx_count": "",
                            "received": "",
                            "balance": ""
                        },
                        "block": {
                            "key": "",
                            "height": "block_no",
                            "hash": "blockhash",
                            "prev": "previous_blockhash",
                            "next": "next_blockhash",
                            "tx_count": "[txs, count]",
                            "time": "time"
                        },
                        "relay": {
                            "txid": "tx_hex",
                            "inner": "transaction"
                        },
                        "transaction": {
                            "key": "",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "[sent_value, float]",
                            "fees": "[fee, float]"
                        },
                        "transactions": {
                            "key": ".txs",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "",
                            "fees": ""
                        },
                        "unspents": {
                            "key": ".txs",
                            "reverse_array": true,
                            "confirmations": "confirmations",
                            "txid": "txid",
                            "index": "output_no",
                            "value": "[value, float]",
                            "script": "script_hex"
                        }
                    }
                }
            }
        },
        "doget": {
            "sochain": {
                "functions": {
                    "to": {
                        "address": "address/DOGETEST/",
                        "addresses": "",
                        "transaction": "tx/DOGETEST/",
                        "transactions": "",
                        "block": "block/DOGETEST/",
                        "relay": "send_tx/DOGETEST/",
                        "relay_param": "tx_hex",
                        "unspents": "get_tx_unspent/DOGETEST/"
                    },
                    "from": {
                        "address": {
                            "key": "",
                            "address": "address",
                            "hash": "[address, hextohash]",
                            "tx_count": "total_txs",
                            "received": "[received_value, float]",
                            "balance": "[balance, float]"
                        },
                        "addresses": {
                            "key": "",
                            "address": "",
                            "hash": "",
                            "tx_count": "",
                            "received": "",
                            "balance": ""
                        },
                        "block": {
                            "key": "",
                            "height": "block_no",
                            "hash": "blockhash",
                            "prev": "previous_blockhash",
                            "next": "next_blockhash",
                            "tx_count": "[txs, count]",
                            "time": "time"
                        },
                        "relay": {
                            "txid": "tx_hex",
                            "inner": "transaction"
                        },
                        "transaction": {
                            "key": "",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "[sent_value, float]",
                            "fees": "[fee, float]"
                        },
                        "transactions": {
                            "key": ".txs",
                            "txid": "txid",
                            "size": "",
                            "block": "block_no",
                            "time": "time",
                            "input": "",
                            "output": "",
                            "value": "",
                            "fees": ""
                        },
                        "unspents": {
                            "key": ".txs",
                            "reverse_array": true,
                            "confirmations": "confirmations",
                            "txid": "txid",
                            "index": "output_no",
                            "value": "[value, float]",
                            "script": "script_hex"
                        }
                    }
                }
            }
        }
    }
}
```

There is a lot to digest above, which is why the file is called `defaults` as opposed to config, or options. As well as the base options, arrays of dependencies and modules, andother functionality such as caching options - it also contains the mapping of four different API services available to use, as well as including test semantics and results. It is the API mapping and tests that take-up the <strong>vast</strong> majority of the defaults configuration file. Much of this should be abstracted prior to reaching version 1.0. In the meantime, it shows you how you can hook-up the framwork to any web-based API service out there, including your own private / proprietary ones.

------------------------------------------------
#### Theme Configuration - `/themes/config.json`

<!--pre-javascript-->
```
{
    "theme": "default"
}
```

It would be at this point that you should start adding your own configuration, this way, you are then able to leave the defaults as they are.

----------------------------------------------------------------
#### Default Wallet Configuration - `/themes/default/config.json`

<!--pre-javascript-->
```
{
    "theme": "default",
    "plugins": [
        "markets"
    ]
}
```

The only thing the default theme needs to do (assuming the default configuration has not been changed) is to activate the markets plugin.

---------------------------------------------------------------
#### Prioritizer Configuration - `/themes/priority/config.json`

<!--pre-javascript-->
```
{
    "theme": "priority",
    "public": true,
    "cascade": false,
    "security": "9d2caf7f21ee0a0a679b2d15c79d165f",
    "content_id": "issues",
    "slug_base": "index",
    "modules": [
        "blockstrap/js/modules/data",
        "blockstrap/js/modules/api",
        "blockstrap/js/modules/templates",
        "blockstrap/js/modules/blockchains",
        "blockstrap/js/modules/security",
        "themes/priority/js/modules/theme"
    ],
    "dependencies": [
        "themes/priority/js/dependencies/issues",
        "blockstrap/js/dependencies/crypto",
        "blockstrap/js/dependencies/sha3",
        "blockstrap/js/dependencies/mustache",
        "blockstrap/js/dependencies/bootstrap.min",
        "blockstrap/js/dependencies/bitcoinjs-lib",
        "themes/priority/js/dependencies/isotope",
        "blockstrap/js/dependencies/qrcode",
        "themes/priority/js/dependencies/steps",
        "blockstrap/js/dependencies/tx"
    ],
    "bootstrap": [
        "modals",
        "forms"
    ],
    "css": [
        "bootstrap", 
        "priority"
    ],
    "styles": false,
    "plugins": false,
    "buttons": {
        "classes": [
            "details",
            "share",
            "close",
            "qr"
        ]
    }
}
```

Prioritizer has a few things that need to change. The most important changes are lines 3, 4 and 5 - as 3 activates public user views and 5 is used to confirm who is the administrator. Line 4 deactivates cascading file inclusion. Cascading file inclusion checks two locations for each dependency and module (the core blockstrap folder and the specified theme folder), whereas deactivating this requires you to include the path within the relevant array (as seen in lines 8 to 15 and 16 to 27.

----------------------------------------------------------------
#### Secret Configuration - `/secret.json`

<!--pre-javascript-->
```
{
    "key": "MY_SECRET_API_KEY_GOES_HERE"
}
```

---

1. Related Articles
2. [Return to Core](../../core/)
2. [Configuration Settings](../configuration/)
3. [Default Includes](../defaults/)
4. [Core Functions](../core-functions/)
5. [Blockstrap Functions](../blockstrap-functions/)
6. [Plugin Construct](../construct/)
7. [Table of Contents](../../../)
