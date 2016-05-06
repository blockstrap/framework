Accounts Module <a name="docs_home"></a>
========================================

### Accounts Functions & Variables

The Accounts Module features the following functions:

* [`$.fn.blockstrap.accounts.access`(account_id, tx)](#accounts_access)
* [`$.fn.blockstrap.accounts.address`(key, account_id)](#accounts_address)
* [`$.fn.blockstrap.accounts.balances`()](#accounts_balances)
* [`$.fn.blockstrap.accounts.get`(id)](#accounts_get)
* [`$.fn.blockstrap.accounts.new`(blockchain, name, password, keys, callback)](#accounts_new)
* [`$.fn.blockstrap.accounts.poll`(wait, callback)](#accounts_poll)
* [`$.fn.blockstrap.accounts.prepare`(to, account_id, amount)](#accounts_prepare)
* [`$.fn.blockstrap.accounts.remove`(collection, key, element, confirm)](#accounts_remove)
* [`$.fn.blockstrap.accounts.total`(rate, prefix)](#accounts_total)
* [`$.fn.blockstrap.accounts.tx`(txid, account_id)](#accounts_tx)
* [`$.fn.blockstrap.accounts.txs`(account_id)](#accounts_txs)
* [`$.fn.blockstrap.accounts.update`(account, callback, force_refresh)](#accounts_update)
* [`$.fn.blockstrap.accounts.updates`(index, callback, old_txs, old_tx_count)](#accounts_updates)
* [`$.fn.blockstrap.accounts.verify`(account, fields, callback, password)](#accounts_verify)

--------------------------------------------------------------------------------

#### `accounts.access`(account_id, tx) <a name="accounts_access" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to construct a form that can validate whether the active user has the right to access and (or) control the corresponding account. It uses the `account_id` to access the stored `keys` associated with that account, and then creates the necessary input fields as required. If you wish to send a payment upon completing the validation a valid `tx` object is required.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.address`(key, account_id) <a name="accounts_address" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return an account object based upon the `key` variable matching an address from one of the locally stored accounts. If an optional `account_id` is provided it will instead only select that account for ones to check, rather than checking all of the accounts.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.balances`() <a name="accounts_balances" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function checks all available accounts to find the total number of accounts for each blockchain as well as the total current balance of each account. It does this internally, without any additional API calls so is not necessarily real-time and cannot be used to update accounts.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.get`(id) <a name="accounts_get" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return an account object based upon the provided `id`. 

If the account `id` is not provided it will instead return an array containing all of the account objects.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.new`(blockchain, name, password, keys, callback) <a name="accounts_new" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will take the required `blockchain`, `name`, `password` and `keys` and create a new account, then perform the `callback` function upon completion.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.poll`(wait, callback) <a name="accounts_poll" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used make regular calls to the API in order to update account information. If no `wait` time isprovided it will instead refer to the following settings `$.fn.blockstrap.settings.cache.accounts`. During each interval, it will perform the [`accounts.updates`](#accounts_updates) function. If any new transactions have occured since those stored locally, the user will be informed via a modal window regarding the new transactions, and the page content will be refreshed.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.prepare`(to, account_id, amount) <a name="accounts_prepare" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is wrapper for [`accounts.access`](#accounts_access) and first checks whether the `to` address and `account_id` are valid before proceeding.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.remove`(collection, key, element, confirm) <a name="accounts_remove" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will use the `collection` and `key` to locate an item stored locally.

If the `confirm` is set to true, it will first ask for confirmation before then deleting the item.

If an `element` is provided, it will also remove this from the DOM.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.total`(rate, prefix) <a name="accounts_total" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to take the grand total from [`accounts.balances`](#accounts_balances) and use the `rate` variable to select the desired exchange rate from `$.fn.blockstrap.settings.exchange`. The output returned can also be prefixed by setting `prefix` to something such as `US$`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.tx`(txid, account_id) <a name="accounts_tx" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return a transaction object based upon the `txid`. 

It will by default search all available accounts, but if an `account_id` is provided, it will only check the corresponding account.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.txs`(account_id) <a name="accounts_txs" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return an array of transaction objects based upon the provided `account_id`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.update`(account, callback, force_refresh) <a name="accounts_update" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will make an API call to check the TX count for the provided `account` object. If new transactions have occured, it will also perform another API call to collect transactions. By default, it will only update an account if the caching time (set as `$.fn.blockstrap.settings.cache.accounts`) has passed. If `force_refresh` is set, it will update the account regardless.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.updates`(index, callback, old_txs, old_tx_count) <a name="accounts_updates" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function cycles through all accounts and applies [`accounts.update`](#accounts_update) as required.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `accounts.verify`(account, fields, callback, password) <a name="accounts_verify" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to verify the results provided after submitting the form generated via [`accounts.access`](#accounts_access).

<a href="#docs_home"><small>- back to top</small></a>

---

###### Related Articles

01. [Back to Modules](../../modules/)
02. Accounts
03. [API](../api/)
04. [Buttons](../buttons/)
05. [Contacts](../contacts/)
06. [Blockchains](../blockchains/)
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