Dependencies <a name="docs_home"></a>
=====================================

### Core Dependencies

* [`ago.js`](#dep_ago) - [Timeago](http://timeago.yarp.com/) `v1.4.1` __MIT License__
* [`bitcoinjs-lib.js`](#dep_btcjs) - [BitcoinJS](http://bitcoinjs.org/) `v1.1.3` __MIT License__
* [`bootstrap.js`](#dep_boot) - [Bootstrap](http://getbootstrap.com/) `v3.2.0` __MIT License__
* [`bootstrap-filestyle.js`](#dep_boot_file) - [Bootstrap FileStyle](http://markusslima.github.io/bootstrap-filestyle/) `v1.1.2` __MIT License__
* [`bootstrap-switch.js`](#dep_boot_switch) - [Boostrap Switch](http://www.bootstrap-switch.org) `v3.0.2` __Apache License 2.0__
* [`crypto.js`](#dep_crypto) - [CryptoJS](https://code.google.com/p/crypto-js/) `v3.1.2` __BSD License__
* [`effects.js`](#dep_effects) - [jQuery UI Effects](http://jqueryui.com) `v1.9.2` __MIT License__
* [`jquery.js`](#dep_jquery) - [jQuery](http://jquery.com) `v1.11.0` __MIT License__
* [`less.js`](#dep_less) - [Less.js](http://lesscss.org/) `v1.7.0` __Apache License 2.0__
* [`mustache.js`](#dep_mustache) - [MustacheJS](https://github.com/janl/mustache.js) `v0.8.2` __MIT License__
* [`qrcode.js`](#dep_qrcode) - [jQuery QRCode](http://larsjung.de/jquery-qrcode/) `v0.10.0` __MIT License__
* [`sha3.js`](#dep_sha3) - [SHA3 - CryptoJS](https://code.google.com/p/crypto-js/) `v3.1.2` __BSD License__
* [`tables.js`](#dep_tables) - [DataTables](http://datatables.net) `v1.10.0` __MIT License__

------------------------------------
#### `ago.js` <a name="dep_ago"></a>

This dependency is used by [`$.fn.blockstrap.core.ago`](../../core/core-functions/#bs_ago) to convert a timestamp into a text string describing how long has passed since the timestamp.

<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------
#### `bitcoinjs-lib.js` <a name="dep_btcjs"></a>

This depedency is required for [`$.fn.blockstrap.modules.blockchains`](../../modules/blockchains/), which is in-turn used by these core modules:

* [`$.fn.blockstrap.modules.accounts`](../../modules/accounts/)
* [`$.fn.blockstrap.modules.contacts`](../../modules/contacts/)
* [`$.fn.blockstrap.modules.buttons`](../../modules/buttons/)

Please note that we have a slightly modified version that includes the additional blockchains that we parse.

<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------
#### `bootstrap.js` <a name="dep_boot"></a>

This depedency is required by several functions and modules throughout core. More information available [here](../bootstrap/).

<small><a href="#docs_home">- back to top</a></small>

-----------------------------------------------------------
#### `bootstrap-filestyle.js` <a name="dep_boot_file"></a>

This depedency is required by our modified [bootstrap](../bootstrap/#bootstrap_filestyle) functionality.

<small><a href="#docs_home">- back to top</a></small>

---------------------------------------------------------
#### `bootstrap-switch.js` <a name="dep_boot_switch"></a>

This depedency is required by our modified [bootstrap](../bootstrap/#bootstrap_switch) functionality.

<small><a href="#docs_home">- back to top</a></small>

------------------------------------------
#### `crypto.js` <a name="dep_crypto"></a>

This depedency is required throughout the framework for security purposes.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------
#### `effects.js` <a name="dep_effects"></a>

This is an optional depedency allowing for smoother, more natural animations.

<small><a href="#docs_home">- back to top</a></small>

------------------------------------------
#### `jquery.js` <a name="dep_jquery"></a>

This is required in order to use the framework and is auto-loaded by the framework so need not be included in dependency lists.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------
#### `less.js` <a name="dep_less"></a>

Strictly speaking, this is not a dependency as it is not found within the dependency folders and is only loaded if the `less: true` is set in the configuration files. For more information on this dependency please see [here](../less/).

<small><a href="#docs_home">- back to top</a></small>

----------------------------------------------
#### `mustache.js` <a name="dep_mustache"></a>

This dependency is used by all functions requiring template rendering.

<small><a href="#docs_home">- back to top</a></small>

------------------------------------------
#### `qrcode.js` <a name="dep_qrcode"></a>

This dependency is used to generate QR codes. It cannot be used to scan them.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------
#### `sha3.js` <a name="dep_sha3"></a>

This depedency is required throughout the framework for security purposes.

<small><a href="#docs_home">- back to top</a></small>

------------------------------------------
#### `tables.js` <a name="dep_tables"></a>

This depedency is required for sortable tables.

<small><a href="#docs_home">- back to top</a></small>

---

1. Related Articles
2. [Back to Assets](../../assets/)
3. [Dependencies](../dependencies/)
4. [Boostrap](../bootstrap/)
5. [Mustache](../mustache/)
6. [LESS.css](../less/)
7. [Table of Contents](../../../)
