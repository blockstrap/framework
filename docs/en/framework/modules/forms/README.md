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
