Currencies Module <a name="docs_home"></a>
==========================================

<span class="alert alert-danger"><strong>Please note that the currencies module has been deprecated</strong>. It is now [blockchains.js](../blockchains/).</span>

### Currencies Functions & Variables

The Currencies Module features the following functions:

* [`$.fn.blockstrap.currencies.check`(input)](#currencies_check)
* [`$.fn.blockstrap.currencies.key`(code)](#currencies_key)
* [`$.fn.blockstrap.currencies.keys`(secret, currency)](#currencies_keys)
* [`$.fn.blockstrap.currencies.raw`(return_to, privkey, inputs, outputs, this_fee, amount_to_send)](#currencies_raw)
* [`$.fn.blockstrap.currencies.send`(to_address, to_amount, from_address, keys, callback, currency)](#currencies_send)
* [`$.fn.blockstrap.currencies.validate`(address)](#currencies_validate)
* [`$.fn.blockstrap.currencies.which`(address)](#currencies_which)

--------------------------------------------------------------------------------

#### `currencies.check`(input) <a name="currencies_check" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return the first character a validated `address`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `currencies.key`(code) <a name="currencies_key" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return the `BitcoinJS-Lib` formatted currency code if provided with the Blockstrap currency `code`. 

For example, `btc` becomes `bitcoin` and `dogt` becomes `dogecointestnet`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `currencies.keys`(secret, currency) <a name="currencies_keys" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes the `secret` seed and `currency` and returns an object containing the public and private keys generated from the `secret`.

Please note that by default, Blockstrap __DOES NOT__ store the private keys anywhere.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `currencies.raw`(return_to, privkey, inputs, outputs, this_fee, amount_to_send) <a name="currencies_raw" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns a raw transaction Hex-string that can then be relayed.

It already requires you to have the `inputs` and `outputs` properly formed. The `return_to` variable is the change address that should be used to send-back the left-over inputs. You need to set the `amount_to_send` (as an integer) as well as the preferred mining fee by using `this_fee`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `currencies.send`(to_address, to_amount, from_address, keys, callback, currency) <a name="currencies_send" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to construct a raw transaction and then relay it. Basic settings such as who to send the coins to with `to_address`, or how much to send with `to_amount` and `currency` are clear enough. The `from_address` will be used as the returning change address. The `keys` should be a key object as returned by [`currencies.keys`](#currencies_keys), which contains both the public and private keys. Before proceeding, we first check locally to see if the account belongs to this user and it has the necessary balance required to perform the transaction. If it does, the public key is used in reference to an [`api.unspents`](../api/#api_unspents) call, the results from which are then used to construct the necessary available inputs. We then call [`currencies.raw`](#currencies_raw) and use the returned object as the required variable in an [`api.relay`](../api/#api_relay) call.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `currencies.validate`(address) <a name="currencies_validate" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns a boolean and is used on conjunction with [`currencies.check`](#currencies_check) to validate an `address`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `currencies.which`(address) <a name="currencies_which" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return the currency code (or false) for a given `address`.

However, please note that this __IS NOT ACCURATE__ as it currently uses a very hacky method. Sorry about that.

<a href="#docs_home"><small>- back to top</small></a>

---

1. Related Articles
2. [Back to Modules](../../modules/)
3. [Accounts](../accounts/)
4. [API](../api/)
5. [Buttons](../buttons/)
6. [Contacts](../contacts/)
7. [Blockchains](../currencies/)
8. [Data](../data/)
9. [Filters](../filters/)
10. [Forms](../forms/)
11. [Security](../security/)
12. [Styles](../styles/)
13. [Templates](../templates/)
14. [Table of Contents](../../../)
