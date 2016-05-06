## Blockstrap - The OpenSource HTML5 Blockchain Framework

The Blockstrap framework provides a front-end HTML5 interface for web-applications to communicate and manipulate blockchains using either external web-accessible APIs or self-hosted local QTs direct from the source.

By default, it is configured to use the [BlockCypher API](http://blocksypher.com) but as well as being a blockchain-agnoistic framework, Blockstrap is also API-neutral throughout. This allows you to host and manage your own API end-points or select from others configured at core, with examples included and ready for use with the following services:

* [BlockCypher](http://blockcypher.com) (Supporting 3 Chains - __ready for public testing__)
* [BlockTrail](http://blocktrail.com) (Supporting 2 Chains - __not completed yet__)
* __LocalQTs__ (Tested on 4 Chains - __not completed yet__)

Work is currently underway to support the following APIs:

* [SoChain](http://chain.so) (Supporting 6 Chains)
* [BlockR](http://blockchain.info) (Supporting 5 Chains)
* [Blockchain.info](http://blockchain.info) (Supporting 1 Chain)
* [Insights](http://insights.io) (Supporting 2 Chains)
* [Toshi](http://toshi.io) (Supporting 2 Chains)

The framework itself is currently capable of supporting the following blockchains:

* __Bitcoin__
* __Dash__
* __Dogecoin__
* __Litecoin__
* Bitcoin Testnet
* Litecoin Testnet
* Dash Testnet
* Dogecoin Testnet

The framework has been developed with modularity and flexibility as the focal point of each technical decision. 

This has enabled us to provide support for plugins and themes and allows developers to easuly extend, modify and truly customize every aspect of the application. Included within the framework download as examples are the following themes:

* Default Wallet (as seen above)
* Priorities (community-driven crowd-sourced to-do list)
* BrainControl 2.0 (example of a heaviliy modified wallet)

We've also bundled the following plugins:

* Market Conditions
* API Tests

Everything is powered by one or more of the following interchangable [modules](modules/):

* [Accounts](docs/en/framework/modules/accounts/)
* [API](http://docs.blockstrap.com/en/framework/modules/api/)
* [Blockchains](http://docs.blockstrap.com/en/framework/modules/blockchains/)
* [Buttons](http://docs.blockstrap.com/en/framework/modules/buttons/)
* [Contacts](http://docs.blockstrap.com/en/framework/modules/contacts/)
* [Data](http://docs.blockstrap.com/en/framework/modules/data/)
* [Filters](http://docs.blockstrap.com/en/framework/modules/filters/)
* [Forms](http://docs.blockstrap.com/en/framework/modules/forms/)
* [HTML](http://docs.blockstrap.com/en/framework/modules/html/)
* [Multisig](http://docs.blockstrap.com/en/framework/modules/multisig/)
* [Security](http://docs.blockstrap.com/en/framework/modules/security/)
* [Styles](http://docs.blockstrap.com/en/framework/modules/styles/)
* [Templates](http://docs.blockstrap.com/en/framework/modules/templates/)
* [Widgets](http://docs.blockstrap.com/en/framework/modules/widgets/)

When combined, they form our default deterministic wallet, which can be setup in seconds:

![Wallet Screen-Shot](docs/img/setup.jpg)

Once setup, users are provided with a fully-featured responsive experience that is available on any device - with support for accounts, contacts, message signing and much more. Come take a look at the live demo - [http://blockstrap.com/demo/](#)

![Wallet Screen-Shot](docs/img/dashboard.jpg)

We suggest that you read our [documentation](#) for more information and instructions on how to get started.

-----

#### PLEASE NOTE THAT OUR DOCUMENTATION IS UNDERGOING REJUVINATION

Specific topics of interest include:

* [Blockstrap Applications](docs/en/applications)
* [Blockstrap Framework](docs/en/framework)
* [Blockstrap Plugins](docs/en/plugins)
* [Supported Blockchains](docs/en/blockchains)