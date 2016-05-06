Blockstrap Plugins
==================

The following plugins are available and included with the Blockstrap [Framework](../framework/):

* [Markets](markets/)

A plugin should take the form of a folder with the same name as the plugin (this provides a place to add other non auto-loaded files related to the plugin) and should be added (by default) to the `plugins` folder at root.

Including the name of the plugin within the [configuration](../framework/core/configuration/) array will activate the plugin, as follows:

<!--pre-javascript-->
```
{
    "theme": "default",
    "plugins": [
        "markets"
    ]
}
```

This can be seen in `themes/default/config.json`, keeping it attached only to the default theme.

This would in-turn activate [`plugins/markets/markets.js`](markets/).

--------------------------------------------------------------------------------

1. Related Articles
2. [Markets](markets/)
3. [Table of Contents](../../)
