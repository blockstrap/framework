Filters API
===========

If a theme contains the `js/modules/theme.js` module, it will attempt to auto-load and auto-assign filter functions as follows:

* `theme.filter.example()` - this will be envoked when `func: "example"` is found within a JSON data array as follows:

<!--pre-javascript-->
```
{
    "content": {
        "func": "example"
    }
}
```

In addition, any filters added to [configuration](../../core/configuration/) can also be invoked via data arrays.

Please see [`$.fn.blockstrap.modules.filters`](../../modules/filters/) for a full list of filters available with core.

--------------------------------------------------------------------------------

1. Related Articles
2. [Return to Extending](../../extending/)
3. [Themes](../themes/)
4. [Buttons](../buttons/)
5. [Filters](../filters/)
6. [Hooks](../hooks/)
7. [Table of Contents](../../../)
