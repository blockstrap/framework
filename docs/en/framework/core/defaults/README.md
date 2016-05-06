## Blockstrap Defaults

There are certain components that will be included regardless of whether they are added to the configuration file or not.

This is currently controlled by `$.fn.blockstrap.defaults()` and auto-includes the following dependencies:

* __dependencies/crypt.js__
* __dependencies/sha3.js__
* __dependencies/mustache.js__

As well as the following modules:

* __modules/templates.js__
* __modules/theme.js__

__The only way to prevent this is to set `install` to `false` in configuration__, at which point, a failure to manually include the required modules listed above will almost certainly result in all kinds of nasty errors.

In addition to the `$.fn.blockstrap.defaults()` function called prior to the dependencies and modules being included there is another function within __core__ (`$.fn.blockstrap.core.defaults`) that creates skeleton functionality for the following functions if their corresponding modules are not included within the initial configuration:

* __Data Module__: `$.fn.blockstrap.data.find()`
* __Data Module__: `$.fn.blockstrap.data.save()`
* __Security Module__: `$.fn.blockstrap.security.loggedin()`

These are common modules used throughout other modules, and the skeleton functions auto-included do nothing more than prevent errors.

---

1. Related Articles
2. [Return to Core](../../core/)
2. [Configuration Settings](../configuration/)
3. [Defaults](../defaults/)
4. [Core Functions](../core-functions/)
5. [Blockstrap Functions](../blockstrap-functions/)
6. [Plugin Construct](../construct/)
7. [Table of Contents](../../../)
