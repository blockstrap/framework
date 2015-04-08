## Blockstrap Framework

The Blockstrap Framework is a component of the Blockstrap Stack. It provides a front-end HTML5 interface for web-applications to communicate and manipulate blockchains and other dynamic data stores via external APIs. By default, it is configured to use the [Blockstrap API](../api/) but is API-neutral throughout. This allows you to host and manage your own API end-points or select from others configured at core, with examples included for the following services:

* [Blockchains.io](http://blockchains.io) (8 Chains)
* [SoChain.io](http://chain.so) (6 Chains)
* [Blockr.io](http://blockr.io) (4 Chains)
* [HelloBlock.io](https://helloblock.io/) (BTC only)

However, please note that the default [wallet]() application included with [core]() allows you to choose which API to use, it does not provide different lists of supported blockchains based on the support of that API. By default, it shows support for six blockchains, but only two of the supported API services provide support for all six chains. Those blockchains supported by [Blockchains.io](http://blockchains.io) and [SoChain](http://chain.so) are:

* [Bitcoin](http://blockchains.io/btc/blocks/)
* [DashPay](http://blockchains.io/dash/blocks/)
* [Dogecoin](http://blockchains.io/doge/blocks/)
* [Litecoin](http://blockchains.io/ltc/blocks/)
* [Bitcoin Testnet](http://blockchains.io/btct/blocks/)
* [Litecoin Testnet](http://blockchains.io/ltct/blocks/)
* [DashPay Testnet](http://blockchains.io/dast/blocks/)
* [Dogecoin Testnet](http://blockchains.io/dogt/blocks/)

The Framework has been developed with modularity and flexibility as the focal point of each technical decision. Currently providing a choice of 11 interchangable modules, features can be easily extended, included, replaced or removed depending on the need of each application.

These [modules](modules/) include:

* [Accounts](http://docs.blockstrap.com/en/framework/modules/accounts/)
* [API](http://docs.blockstrap.com/en/framework/modules/api/)
* [Buttons](http://docs.blockstrap.com/en/framework/modules/buttons/)
* [Contacts](http://docs.blockstrap.com/en/framework/modules/contacts/)
* [Blockchains](http://docs.blockstrap.com/en/framework/modules/blockchains/)
* [Data](http://docs.blockstrap.com/en/framework/modules/data/)
* [Filters](http://docs.blockstrap.com/en/framework/modules/filters/)
* [Forms](http://docs.blockstrap.com/en/framework/modules/forms/)
* [Security](http://docs.blockstrap.com/en/framework/modules/security/)
* [Styles](http://docs.blockstrap.com/en/framework/modules/styles/)
* [Templates](http://docs.blockstrap.com/en/framework/modules/templates/)

When combined, they form our default deterministic wallet:

![Wallet Screen-Shot](https://raw.githubusercontent.com/blockstrap/docs/master/_libs/img/docs/applications/wallet/setup.jpg)

A live demo is available for viewing at - [http://demo.blockstrap.com/wallet/v0.4/](http://demo.blockstrap.com/framework/v0.5/).

Please see our [documentation](http://docs.blockstrap.com) for more information and instructions on getting started.