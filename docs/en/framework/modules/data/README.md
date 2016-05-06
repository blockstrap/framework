Data Module <a name="docs_home"></a>
====================================

Please note that these functions utilize [localStorage](http://diveintohtml5.info/storage.html) and do not yet have fallbacks. A lack of localStorage (such as Safari's private browsing) will prevent usage. Earlier versions had various fallbacks and advanced options (such as LevelDB), which is why we introduced callback methods. However, the current version only supports LocalStorage. This will be fixed by version 1.0.

### Data Functions & Variables

The Data Module features the following functions:

* [`$.fn.blockstrap.data.find`(collection, key, callback)](#data_find)
* [`$.fn.blockstrap.data.item`(collection, key)](#data_item)
* [`$.fn.blockstrap.data.option`(key)](#data_option)
* [`$.fn.blockstrap.data.save`(collection, key, value, callback)](#data_save)

--------------------------------------------------------------------------------

#### `data.find`(collection, key, callback) <a name="data_find" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function uses the `collection` and `key` to retreave the corresponding value from localStorage. 

It then performs the provided `callback` function and carries over the results.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `data.item`(collection, key) <a name="data_item" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used internally to map the `collection` and `key` and returns a new key.

Given `user` and `name` it would return `nw_user_name`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `data.option`(key) <a name="data_option" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes the `key` and returns the value from within the `nw_blockstrap_options` entry.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `data.save`(collection, key, value, callback) <a name="data_save" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function uses the `collection` and `key` to store the corresponding `value` into localStorage. 

It then performs the provided `callback` function and carries over the results.

<a href="#docs_home"><small>- back to top</small></a>

---

1. Related Articles
2. [Back to Modules](../../modules/)
3. [Accounts](../accounts/)
4. [API](../api/)
5. [Buttons](../buttons/)
6. [Contacts](../contacts/)
7. [Blockchains](../blockchains/)
8. [Data](../data/)
9. [Filters](../filters/)
10. [Forms](../forms/)
11. [Security](../security/)
12. [Styles](../styles/)
13. [Templates](../templates/)
14. [Table of Contents](../../../)
