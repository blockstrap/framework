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

###### Related Articles

01. [Back to Modules](../../modules/)
02. [Accounts](../accounts/)
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
13. Styles
14. [Templates](../templates/)
15. [Widgets](../widgets/)
16. [__Table of Contents__](../../../)