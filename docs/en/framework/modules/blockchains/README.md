Blockchains Module <a name="docs_home"></a>
==========================================

Please note that it is [BitcoinJS-Lib](http://bitcoinjs.org) that makes most of these functions possible.

The framework currently supports the following blockchains (and their corrresponding [testnets](https://en.bitcoin.it/wiki/Testnet)):

| Blockchain | Homepage | Active Chain Code | Test-Net Code |
|------------|----------|-------------------|---------------|
|Bitcoin|[http://bitcoin.org](http://bitcoin.org)|btc|btct|
|Litecoin|[http://litecoin.org](http://litecoin.org)|ltc|ltct|
|Dogecoin|[http://dogecoin.com](http://dogecoin.com)|doge|doget|
|Dash|[http://dashpay.io](http://dashpay.io)|dash|dasht|

### Blockchains Functions & Variables

The Blockchains Module features the following functions:

* [`$.fn.blockstrap.blockchains.check`(address)](#blockchains_check)
* [`$.fn.blockstrap.blockchains.decode`(script_pub_key)](#blockchains_decode)
* [`$.fn.blockstrap.blockchains.empty`(private_key, to_address, chain, callback))](#blockchains_empty)
* [`$.fn.blockstrap.blockchains.key`(code)](#blockchains_key)
* [`$.fn.blockstrap.blockchains.keys`(secret, blockchain, number_of_keys, indexes, raw)](#blockchains_keys)
* [`$.fn.blockstrap.blockchains.raw`(return_to, privkey, inputs, outputs, this_fee, amount_to_send, data, sign_tx, script)](#blockchains_raw)
* [`$.fn.blockstrap.blockchains.send`(to, amount, from, keys, callback, blockchain, data, fee)](#blockchains_send)
* [`$.fn.blockstrap.blockchains.supported`(blockchain)](#blockchains_supported)
* [`$.fn.blockstrap.blockchains.validate`(address)](#blockchains_validate)
* [`$.fn.blockstrap.blockchains.which`(address)](#blockchains_which)

--------------------------------------------------------------------------------

#### `blockchains.check`(address) <a name="blockchains_check" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return the first character of a validated `address`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.decode`(script_pub_key) <a name="blockchains_decode" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function decodes the `script_pub_key` from a valid OP_Return outgoing transaction into a readable text string.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.empty`(private_key, to_address, chain, callback) <a name="blockchains_empty" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function checks the balance belonging to the provided `private_key` and then sends all of the funds (minus the default network fee) to the required `to_address`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.key`(code) <a name="blockchains_key" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return the `BitcoinJS-Lib` formatted blockchain code if provided with the Blockstrap blockchain `code`. 

For example, `btc` becomes `bitcoin` and `doget` becomes `dogecointestnet`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.keys`(secret, blockchain, number_of_keys, indexes, raw) <a name="blockchains_keys" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes the `secret` seed and `blockchain` and returns an object containing the public and private keys generated from the `secret`.

Please note that by default, Blockstrap __DOES NOT__ store the private keys anywhere.

Multiple keys or specific HD derivative keys can be generated using the `number_of_keys` and `indexes` variables, where as the `raw` variable can be used to also return the complete unfiltered keys and attach them to the returned object within a raw field.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.raw`(return_to, privkey, inputs, outputs, this_fee, amount_to_send, data, sign_tx, script) <a name="blockchains_raw" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns a raw transaction Hex-string that can then be relayed.

It already requires you to have the `inputs` and `outputs` properly formed. The `return_to` variable is the change address that should be used to send-back the left-over inputs. You need to set the `amount_to_send` (as an integer) as well as the preferred mining fee by using `this_fee`.

If you the raw transaction return to be signed, you need to provide the appropriate `privkey` for the `inputs` (currently assumes all inputs from same address). You can leave this false or null but should also set the `sign_tx` variable to `false`.

The `data` variable is used to store additional information within the __op_return__ field of the transaction and must conform to the relevant `$.fn.settings.blockchains[chain].op_limit`.

The `script` variable is used for multisignature transactions.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.send`(to, amount, from, keys, callback, blockchain, data, fee) <a name="blockchains_send" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to construct a raw transaction and then relay it. Basic settings such as who to send the coins to with `to` address, or how much to send with the `amount` and `blockchain` are clear enough. The `from` will be used as the returning change address. The `keys` should be a key object as returned by [`blockchains.keys`](#blockchains_keys), which contains both the public and private keys. Before proceeding, we first check locally to see if the account belongs to this user and it has the necessary balance required to perform the transaction. If it does, the public key is used in reference to an [`api.unspents`](../api/#api_unspents) call, the results from which are then used to construct the necessary available inputs. We then call [`blockchains.raw`](#blockchains_raw) and use the returned object as the required variable in an [`api.relay`](../api/#api_relay) call.

In order to attach aribitary data to the transaction via an OP_Return, simply add a `data` variable, where custom transaction fees canalso be set using the `fee` variable, which if left empty will then use the default fee structure instead.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.supported`(blockchain) <a name="blockchains_check" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return a boolean value confirming whether or not the selected `blockchain` has API support or not.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.validate`(address) <a name="blockchains_validate" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns a boolean and is used on conjunction with [`blockchains.check`](#blockchains_check) to validate an `address`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `blockchains.which`(address) <a name="blockchains_which" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return the blockchain code (or false) for a given `address`.

However, please note that this __IS NOT ACCURATE__ as it currently uses a very hacky method. Sorry about that.

<a href="#docs_home"><small>- back to top</small></a>

---

###### Related Articles

01. [Back to Modules](../../modules/)
02. [Accounts](../accounts/)
03. [API](../api/)
04. [Buttons](../buttons/)
05. [Contacts](../contacts/)
06. Blockchains
07. [Data](../data/)
08. [Filters](../filters/)
09. [Forms](../forms/)
10. [HTML](../html/)
11. [Multisig](../multisig/)
12. [Security](../security/)
13. [Styles](../styles/)
14. [Templates](../templates/)
15. [Widgets](../widgets/)
16. [__Table of Contents__](../../../)