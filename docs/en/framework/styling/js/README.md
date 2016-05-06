JS
==

In addition to development styling through [LESS.css](../../assets/less/) and conventional production styling with [CSS](../css/) further modifications can be made via JavaScript by using the [$.fn.blockstrap.styles](../../modules/styles/) module.

The common use of this module would be in editing the [configuration](../../core/configuration/) files, such as:

<!--pre-javascript-->
```
{
    styles: {
        vars: {
            content_bg: "#DDD",
            header_bg: "#475862"
        },
        elements: {
            content_bg: "#main-content",
            header_bg: "header"
        },
        rules: {
            content_bg: "background",
            header_bg: "background"
        }
    }
}
```
---

This makes it easy for anyone to make minor modifications or to allow applications to enable its user to make those modifications. The options can also be applied via HTML5 data attributes like all [core configuration](../../core/configuration/) settings.

--------------------------------------------------------------------------------

1. Related Articles
2. [Return to Styling](../../styling/)
2. [CSS](../css/)
3. [JS](../js/)
4. [Table of Contents](../../../)
