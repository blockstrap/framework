LESS.css
========

[Less](http://lesscss.org/) is a CSS pre-processor, meaning that it extends the CSS language, adding features that allow variables, mixins, functions and many other techniques that allow you to make CSS that is more maintainable, themable and extendable. For example:

<!--pre-css-->
```
@base: #f938ab;

.box-shadow(@style, @c) when (iscolor(@c)) {
  -webkit-box-shadow: @style @c;
  box-shadow:         @style @c;
}
.box-shadow(@style, @alpha: 50%) when (isnumber(@alpha)) {
  .box-shadow(@style, rgba(0, 0, 0, @alpha));
}
.box {
  color: saturate(@base, 5%);
  border-color: lighten(@base, 30%);
  div { .box-shadow(0 0 5px, 30%) }
}
```

This would compile to:

<!--pre-css-->
```
.box {
  color: #fe33ac;
  border-color: #fdcdea;
}
.box div {
  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
```

The `/blockstrap/js/less.js` and `/themes/<active-theme>/less/blockstrap.less` files are only ever included if `less: true` is set within the [configuration](../../core/configuration/).

The most obvious benefit of programatic pre-processing CSS is the use of variables, which for the default theme are stored at `themes/default/less/variables.less` and include:

<!--pre-css-->
```
/*

COLORS

*/

// HEADER
@header-bg: #475862;
@nav-bg: transparent;
@nav-bg-active: #2B3F4B;
@nav-bg-hover: #2F2F2F;
@nav-border: transparent;
@nav-border-active: #111E27;
@nav-border-hover: #000000;
@nav-color: #EDEDED;
@nav-color-active: #AAAAAA;
@nav-color-hover: #FFFF99;

// SIDEBAR
@sidebar-bg: #102634;
@sidebar-link-color: #FFFFBB;
@sidebar-sub-color: #0085B2;
@sidebar-panel-bg: #111E27;
@sidebar-panel-border: #214760;
@sidebar-panel-color: #666666;

// CONTENT
@content-bg: #DDDDDD;
@content-link: #069;
@content-link-hover: #757575;
@panel-header-bg: #111E27;
@panel-header-color: #EEEEEE;
@panel-border: #CCCCCC;

// BUTTONS
@btn-primary-top: #0085B2;
@btn-primary-bottom: #214E6B;
@btn-primary-border: #000000;
@btn-primary-color: #FFFFFF;
@btn-success-top: #398235;
@btn-success-bottom: #176002;
@btn-success-border: #888;
@btn-success-color: #FFF;
@btn-default-top: #475862;
@btn-default-bottom: #283238;
@btn-default-border: #000000;
@btn-default-color: #FFFFFF;
@btn-danger-top: #8C0000;
@btn-danger-bottom: #400000;
@btn-danger-border: #000000;
@btn-danger-color: #FFFFFF;
@btn-subtle-top: #F9F9F9;
@btn-subtle-bottom: #EBEAEB;
@btn-subtle-color: #069;
@btn-subtle-border: #BBB;

// RIBBONS
@ribbon-default: #214E6B;
@ribbon-default-color: #FFFFEE;
@ribbon-from: #008C23;
@ribbon-to: #8C0000;

// TABLES
@table-bg: #EEEEEE;
@table-bg-alt: #FFFFFF;
@table-color: #757575;
@table-border: #BBBBBB;
@table-header-bg: #111E27;
@table-header-bg-active: #214862;
@table-header-color: #EDEDED;

// MODALS
@modal-bg: #000F26;
@modal-bg-opacity: 0.85;
@modal-header-bg: #EEE;
@modal-header-color: #757575;
@modal-body-bg: #FFF;
@modal-body-color: #555;
@modal-border: #BBB;
@modal-form-bg: #FFFFEE;

// FORMS
@form-horizontal-label-bg: #DDD;
@form-horizontal-label-border: #CCC;
@form-horizontal-label-color: #555;
@form-alternative-bg: #FFFFEE;

/*

DIMENSIONS

*/
@header-height: 60px;
@sidebar-width: 250px;
@panel-padding: 20px;

/*

CURVES

*/
@border-radius: 4px;
```

Changing the variables above should allow you to create completely new skins and theme styles without needing to edit anything further. More information is available for [`$.fn.blockstrap.core.less`](../../core/core-functions/#bs_less).

---

1. Related Articles
2. [Back to Assets](../../assets/)
3. [Dependencies](../dependencies/)
4. [Boostrap](../bootstrap/)
5. [Mustache](../mustache/)
6. [LESS.css](../less/)
7. [Table of Contents](../../../)
