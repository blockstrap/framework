Contacts Module <a name="docs_home"></a>
========================================

#### Contacts Functions & Variables

The Contacts Module features the following functions:

* [`$.fn.blockstrap.contacts.get`(id)](#contacts_get)
* [`$.fn.blockstrap.contacts.new`(name, address, blockchain, fields, callback, ignore_errors)](#contacts_new)

--------------------------------------------------------------------------------

#### `contacts.get`(id) <a name="contacts_get" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will return a contact object based upon the provided `id`. 

If the contact `id` is not provided it will instead return an array containing all of the contact objects.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `contacts.new`(name, address, blockchain, fields, callback, ignore_errors) <a name="contacts_new" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will take the required `name`, `address`, `blockchain` and `fields` and create a new contact, then perform the `callback` function upon completion. Modal errors messages can be supressed by setting `ignore_errors` to `true`.

<a href="#docs_home"><small>- back to top</small></a>

---

###### Related Articles

01. [Back to Modules](../../modules/)
02. [Accounts](../accounts/)
03. [API](../api/)
04. [Buttons](../buttons/)
05. Contacts
06. [Blockchains](../blockchains/)
07. [Data](../data/)
08. [Filters](../filters/)
09. [Forms](../forms/)
10. [HTML](../html/)
11. [Multisig](../multisig/)
12. [Security](../security/)
13. [Styles](../styles/)
14. [Templates](../templates/)
15. [Widgets](../widgets/)
16. [__Table of Contents__](../../../)