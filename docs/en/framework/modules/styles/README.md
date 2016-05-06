Styles Module <a name="docs_home"></a>
======================================

### Styles Functions & Variables

The Styles Module features the following functions:

* [`$.fn.blockstrap.styles.element`(key)](#styles_element)
* [`$.fn.blockstrap.styles.map`(type)](#styles_map)
* [`$.fn.blockstrap.styles.rule`(key, value)](#styles_rule)
* [`$.fn.blockstrap.styles.set`(id, index)](#styles_set)

--------------------------------------------------------------------------------

#### `styles.element`(key) <a name="styles_element" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns an HTML reference based upon [`styles.map`](#styles_map) by using the `key`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `styles.map`(type) <a name="styles_map" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns the results from `$.fn.blockstrap.settings.style[key]`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `styles.rule`(key, value) <a name="styles_rule" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function uses the `key` and `value` to create a valid CSS rule to be used by Javascript with [`styles.set`](#styles_set).

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `styles.set`(id, index) <a name="styles_set" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to apply the styles settings (as [configured](../../core/configuration/)) to the DOM. The sample configuration included by default is as follows:

<!--pre-javascript-->
```
{
    "styles": {
        "vars": {
            "content_bg": "#DDD",
            "header_bg": "#475862"
        },
        "elements": {
            "content_bg": "#main-content",
            "header_bg": "header"
        },
        "rules": {
            "content_bg": "background",
            "header_bg": "background"
        }
    }
}
```

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
