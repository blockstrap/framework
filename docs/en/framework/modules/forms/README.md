Forms Module <a name="docs_home"></a>
=====================================

### Functions & Variables

The Forms Module features the following functions:

* [`$.fn.blockstrap.forms.get`(callback)](#forms_get)
* [`$.fn.blockstrap.forms.input`(options)](#forms_input)
* [`$.fn.blockstrap.forms.process`(data, form)](#forms_process)

--------------------------------------------------------------------------------

#### `forms.get`(callback) <a name="forms_get" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return the raw Mustache-compliant HTML syntax for forms from `$.fn.blockstrap.snippets.form`.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `forms.input`(options) <a name="forms_input" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This functon returns a rendered HTML input using the `options` as field options for the form.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `forms.process`(data, form) <a name="forms_process" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns a rendered HTML form using Mustache.

It takes the supplied `data` and uses [`forms.get`](#forms_get) as the default HTML, which can be overriden via `form`.

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
09. Forms
10. [HTML](../html/)
11. [Multisig](../multisig/)
12. [Security](../security/)
13. [Styles](../styles/)
14. [Templates](../templates/)
15. [Widgets](../widgets/)
16. [__Table of Contents__](../../../)