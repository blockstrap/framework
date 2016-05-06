Blockstrap Functions <a name="docs_home"></a>
=============================================

### Blockstrap Functions & Variables

These functions are not attached to any modules and are in most cases used prior to the initialization of the [core functions](../core-functions/). 

They are often called by first setting `$bs = blockstrap_functions;` - where you can then use the following functions anywhere:

* [`$bs.array_length`(obj)](#bs_array_length)
* [`$bs.check`(options, callback)](#bs_check)
* [`$bs.exists`(url)](#bs_exists)
* [`$bs.get_css`(attributes)](#bs_get_css)
* [`$bs.include`(blockstrap, start, files, callback, dependency)](#bs_include)
* [`$bs.initialize`()](#bs_initialize)
* [`$bs.js`(id, src, callback)](#bs_js)
* [`$bs.json`(string)](#bs_json)
* [`$bs.slug`(slug)](#bs_slug)
* [`$bs.unslug`(slug)](#bs_unslug)
* [`$bs.update`(version, callback)](#bs_update)
* [`$bs.vars`(variable)](#bs_vars)

--------------------------------------------------------------------------------

#### `$bs.array_length`(obj) <a name="bs_array_length" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes and array or an object and returns the number of first-level items it contains.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.check`(options, callback) <a name="bs_check" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is called prior the [Plugin Construct](../construct/) and is designed to ensure that the current device has the [minimum requirements](../started/requirements/). The `options` are those obtained from `defaults.json` but is currently not used. In fact, at the moment, the only check that is performed by this function is to ensure that localStorage is functioning normally.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.exists`(attributes) <a name="bs_exists" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function checks to see whether the `url` exists or not.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.get_css`(attributes) <a name="bs_get_css" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function emulates `jQuery.getScript()` but is used for including CSS files. It is based upon [Intesso's getCSS](https://github.com/intesso/jquery-getCSS).

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.include`(blockstrap, start, files, callback, dependency) <a name="bs_include" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to include multiple `files` and then perform the necessary `callback` function upon completion.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.initialize`() <a name="bs_initialize" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to initiate core upon first completing the necessary prerequisites.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.js`(id, src, callback) <a name="bs_js" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to add a JavaScript file to the header of the DOM.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.json`(string) <a name="bs_json" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is check whether or not a string is a JSON array.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.slug`(slug) <a name="bs_slug" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to convert a string into something more sensible for URL structures.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.unslug`(slug) <a name="bs_unslug" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used in an attempt to convert a slug back to a more sensible text string.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.update`(version, callback) <a name="bs_update" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to check the version numbers in confguration against those stored locally to determine if an update is required.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `$bs.vars`(variable) <a name="bs_vars" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used for two things. If no `variable` is provided it will return the variables in the current `window.location` as an array of objects. If a `variable` is provided it will return the value of that variable should it exist within the current `window.location` else it will return false.

<small><a href="#docs_home">- back to top</a></small>

---

1. Related Articles
2. [Return to Core](../../core/)
2. [Configuration Settings](../configuration/)
3. [Defaults](../defaults/)
4. [Core Functions](../core-functions/)
5. [Blockstrap Functions](../blockstrap-functions/)
6. [Plugin Construct](../construct/)
7. [Table of Contents](../../../)
