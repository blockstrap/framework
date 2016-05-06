Filters Module <a name="docs_home"></a>
=======================================

More information is available for [extending themes with filters](../../extending/filters/).

### Filters Functions & Variables

The Filters Module features the following functions:

* [`$.fn.blockstrap.filters.accounts`(blockstrap, data)](#filters_accounts)
* [`$.fn.blockstrap.filters.avatars`(blockstrap, data)](#filters_avatars)
* [`$.fn.blockstrap.filters.balances`(blockstrap, data)](#filters_balances)
* [`$.fn.blockstrap.filters.bootstrap`(blockstrap, data)](#filters_bootstrap)
* [`$.fn.blockstrap.filters.contacts`(blockstrap, data)](#filters_contacts)
* [`$.fn.blockstrap.filters.get`(blockstrap, data)](#filters_get)
* [`$.fn.blockstrap.filters.got`(blockstrap, data)](#filters_got)
* [`$.fn.blockstrap.filters.last`(blockstrap, data)](#filters_last)
* [`$.fn.blockstrap.filters.plugin`(blockstrap, data)](#filters_plugin)
* [`$.fn.blockstrap.filters.setup`(blockstrap, data)](#filters_setup)
* [`$.fn.blockstrap.filters.total`(blockstrap, data)](#filters_total)
* [`$.fn.blockstrap.filters.txs`(blockstrap, data)](#filters_txs)

--------------------------------------------------------------------------------

#### `filters.accounts`(blockstrap, data) <a name="filters_accounts" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return an array of the current [accounts](../../../applications/wallet/accounts/) and will also convert each account balance to a float.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.avatars`(blockstrap, data) <a name="filters_avatars" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return an image with the `avatar` CSS class using [`data.option('your_photo')`](../data/#data_option). 

The `data` object can be used to set a default image if `your_photo` is not stored locally within the options.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.balances`(blockstrap, data) <a name="filters_balances" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return an array of objects containg the transaction counts and balances of each account.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.bootstrap`(blockstrap, data) <a name="filters_bootstrap" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return rendered HTML content using `data.type` as a snippet ID and the entire `data` object as the data. 

More information can be seen in [`bootstrap assets`](../../assets/bootstrap/).

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.contacts`(blockstrap, data) <a name="filters_contacts" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return an array of the current [contacts](../../../applications/wallet/contacts/).

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.get`(blockstrap, data) <a name="filters_get" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter uses [`data.find`](../data/#data_find) to return the value defined by `data.collection` and `data.key`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.got`(blockstrap, data) <a name="filters_got" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter uses [`data.find`](../data/#data_find) to return a boolean based upon having value defined by `data.collection` and `data.key`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.last`(blockstrap, data) <a name="filters_last" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter returns a text string containing information pertaining to when the last transaction made by any accounts took place. The following `data` atrributes can be used to modify the results as follows:

* `data.html` (used as the HTML template to be rendered by Mustache)
* `data.alternative` (the text to be shown if there are no transactions)
* `data.type` (this __must__ currently be set to `tx` in order for the filter to function)

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.plugin`(blockstrap, data) <a name="filters_plugin" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return the results from the relevant plugin unless the plugin required plugin function cannot be found, in which case it will return the `data`. Data attributes required include:

* data.name
* data.call
* data.data

The results would derive from `$.fn.blockstrap.plugins[data.name][data.call](data.data)`. 

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.setup`(blockstrap, data) <a name="filters_setup" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return the results from `$.fn.blockstrap.core.filter(blockstrap_setup_steps[data.step])`.

It is used in conjunction with the ever-so complicated [`core.setup`](../../core/core-functions/#bs_setup) function, which allows for a step-by-step process.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.total`(blockstrap, data) <a name="filters_total" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return the results from [`accounts.total(rate, prefix)`](../accounts/#accounts_total). 

The default value for rate is `usd` and the default value for prefix is `US$`. These can be overriden using `data.rate` and `data.prefix`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `filters.txs`(blockstrap, data) <a name="filters_txs" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This filter will return a rendered HTMl list of transactions for the defined account ID (`data.id`) and the length can be set via `data.limit` - defaulting to 7.

<a href="#docs_home"><small>- back to top</small></a>

---

###### Related Articles

01. [Back to Modules](../../modules/)
02. [Accounts](../accounts/)
03. [API](../api/)
04. [Buttons](../buttons/)
05. [Contacts](../contacts/)
06. [Blockchains](../blockchains/)
07. [Data](../data/)
08. Filters
09. [Forms](../forms/)
10. [HTML](../html/)
11. [Multisig](../multisig/)
12. [Security](../security/)
13. [Styles](../styles/)
14. [Templates](../templates/)
15. [Widgets](../widgets/)
16. [__Table of Contents__](../../../)