Buttons Module <a name="docs_home"></a>
=======================================

### Buttons Functions & Variables

The Buttons Module features the following functions:

* [`$.fn.blockstrap.buttons.access`(button, e)](#buttons_access)
* [`$.fn.blockstrap.buttons.add_contact_address`(button, e)](#buttons_addcontact) __needs updating__
* [`$.fn.blockstrap.buttons.cancel`(button, mobile, menu, elements)](#buttons_cancel)
* [`$.fn.blockstrap.buttons.check_all_inactive`(button, e)](#buttons_checkall) __needs updating__
* [`$.fn.blockstrap.buttons.check_inactive`(button, e)](#buttons_checkinactive) __needs updating__
* [`$.fn.blockstrap.buttons.create_account`(button, e)](#buttons_create_account)
* [`$.fn.blockstrap.buttons.create_contact`(button, e)](#buttons_create_contact)
* [`$.fn.blockstrap.buttons.create_credentials`(button, e)](#buttons_create_credentials)
* [`$.fn.blockstrap.buttons.edit`(button, e)](#buttons_edit)
* [`$.fn.blockstrap.buttons.edit_object`(button, e)](#buttons_edit_object)
* [`$.fn.blockstrap.buttons.hidden_toggler`(button, e)](#buttons_hiddentoggler) __needs updating__
* [`$.fn.blockstrap.buttons.import`(button, e)](#buttons_import)
* [`$.fn.blockstrap.buttons.import_file`(button, e)](#buttons_importfile) __needs updating__
* [`$.fn.blockstrap.buttons.login`(button, e)](#buttons_login)
* [`$.fn.blockstrap.buttons.logout`(button, e)](#buttons_logout)
* [`$.fn.blockstrap.buttons.more_security`(button, e)](#buttons_security)
* [`$.fn.blockstrap.buttons.new_chain`(button, e)](#buttons_newchain) __needs updating__
* [`$.fn.blockstrap.buttons.page`(button, e)](#buttons_page)
* [`$.fn.blockstrap.buttons.print`(button, e)](#buttons_print)
* [`$.fn.blockstrap.buttons.process`(slug, content, filtered_data, button, effect, direction, reverse_direxction, mobile, menu, elements)](#buttons_process)
* [`$.fn.blockstrap.buttons.refresh`(button, e)](#buttons_refresh)
* [`$.fn.blockstrap.buttons.remove`(button, e)](#buttons_remove)
* [`$.fn.blockstrap.buttons.reset`(button, e)](#buttons_reset)
* [`$.fn.blockstrap.buttons.save_salt`(button, e)](#buttons_savesalt) __needs updating__
* [`$.fn.blockstrap.buttons.save_wallet`(button, e)](#buttons_savewallet) __needs updating__
* [`$.fn.blockstrap.buttons.see_all`(button, e)](#buttons_seeall) __needs updating__
* [`$.fn.blockstrap.buttons.send_money`(button, e)](#buttons_send_money)
* [`$.fn.blockstrap.buttons.setup`(button, e)](#buttons_setup)
* [`$.fn.blockstrap.buttons.submit_import`(button, e)](#buttons_submit_import)
* [`$.fn.blockstrap.buttons.submit_payment`(button, e)](#buttons_submit_payment)
* [`$.fn.blockstrap.buttons.submit_verification`(button, e)](#buttons_submit_verification)
* [`$.fn.blockstrap.buttons.sign`(button, e)](#buttons_sign) __needs updating__
* [`$.fn.blockstrap.buttons.switch`(button, e)](#buttons_switch) __needs updating__
* [`$.fn.blockstrap.buttons.toggle`(button, e)](#buttons_toggle)
* [`$.fn.blockstrap.buttons.verify`(button, e)](#buttons_verify) __needs updating__

--------------------------------------------------------------------------------

#### `buttons.access`(button, e) <a name="buttons_access" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens a modal window containing a QR code with the address for the corresponding `account_id`, and also provides a selection of actions that can then be performed on the account.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.cancel`(button, mobile, menu, elements) <a name="buttons_cancel" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used internally to close sidebars and navigation upon page transitions.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.create_account`(button, e) <a name="buttons_create_account" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to activate the creation of a new account.

It uses the `data-form` attribute of the clicked `button` to find the form.

Each `form-group` container within the form is then checked and used towards the compounding encryption.

The minimum required inputs include:

* `<input id="wallet_blockchain" />`
* `<input id="wallet_name" />`
* `<input id="wallet_password" />`

Without these, it will not be able to call the required [`$.fn.blockstrap.accounts.new`](../accounts/#accounts_new) function.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.create_contact`(button, e) <a name="buttons_contact" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to activate the creation of a new contact.

It uses the `data-form` attribute of the clicked `button` to find the form.

Each `form-group` container within the form is then checked and used towards the contact creation.

The minimum required inputs include:

* `<input id="contact_name" />`
* `<input id="contact_address" />`
* `<input id="contact_blockchain" />`

Without these, it will not be able to call the required [`$.fn.blockstrap.contacts.new`](../contacts/#contacts_new) function.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.create_credentials`(button, e) <a name="buttons_credentials" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens the `login-credentials-modal` if available.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.edit`(button, e) <a name="buttons_edit" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens a modal window containing a form that allows you to edit contact details.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.edit_object`(button, e) <a name="buttons_edit_object" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used in conjunction with [`buttons.edit`](#buttons_edit) to perform the saving of edited information.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.import`(button, e) <a name="buttons_import" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens a modal window that provides instructions on importing device data.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.login`(button, e) <a name="buttons_login" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function provides login functionality that utilizes internally stored `your_username` and `your_password` options to confirm if the user should be allowed further access.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.logout`(button, e) <a name="buttons_logout" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will logout the current user.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.more_security`(button, e) <a name="buttons_security" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function toggles hidden content display within the account creation modal window.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.page`(button, e) <a name="buttons_page" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to providing animated page transitions within the __default__ theme.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.print`(button, e) <a name="buttons_print" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to open a print-friendly window.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.process`(slug, content, filtered_data, button, effect, direction, reverse_direxction, mobile, menu, elements) <a name="buttons_process" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used in conjunction with [`buttons.page`](#buttons_page) to handle the injection of new content when switching pages.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.refresh`(button, e) <a name="buttons_refresh" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to refresh specific content on the page using the following `button` attributes:

* data-collection
* data-key

Currently, the only accepted collection is `accounts`.

The corresponding `key` is used as an account_id in order to update the details via an API call and then refresh the page content.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.remove`(button, e) <a name="buttons_remove" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to open a modal window the contains a form with the relevant information needed to perform [`$.fn.blockstrap.accounts.remove`](../accounts/#accounts_remove).

The following `button` data attributes are required:

* data-collection
* data-key
* data-confirm
* data-element

The `data-collection` and `data-key` are used to defined which item should be removed from localStorage, whilst the `data-confirm` defines whether a confirmation modal should appear first. Upon successfuly removal, the `data-element` will be used as an ID reference to findthe appropriate element within the DOM to remove.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.reset`(button, e) <a name="buttons_reset" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens a confirmation modal asking if you want to reset your device, confirming which will then remove all Blockstrap related information from localStorage.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.send_money`(button, e) <a name="buttons_send_money" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used prior to [`$.fn.blockstrap.accounts.prepare`](../accounts/#accounts_prepare) as a way to collect the required information. It uses the following `button` data attributes:

* data-form-id

From which it then seeks the following inputs:

* `<input id="to" />`
* `<input id="from" />`
* `<input id="amount" />`

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.set_credentials`(button, e) <a name="buttons_set_credentials" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens a modal window with a form that allows you to set your user credentials.

It requires the following `button` data attributes:

* data-form
* data-field-username
* data-field-password
* data-field-repeat

It uses the `data-form` value to first define which form to then look for the three required fields.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.setup`(button, e) <a name="buttons_setup" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is a complete nightmare, and yet it is also central to the process and used for the most important task at hand, setting-up your device for the first time. It's a little like [`buttons.create_account`](#buttons_create_account) in its requirements for minimum input values (derived from `data-form`).

However, it also allows you to define setup steps. Setup can consist of as many steps as added to the required `steps.js` dependency. In `themes/default/js/dependencies/steps.js` there are two steps, at which point the following `button` data attributes also become important:

* data-steps
* data-step

The `data-steps` should confirm the total number of setup steps whereas the `data-step   should confirm the current step.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.submit_import`(button, e) <a name="buttons_submit_import" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used in conjunction with [`buttons.import`](#buttons_import).

It searches the DOM for `form#import-device-data #import-data` expectings its value to be a JSON string, where it will then attempt to add the relevant records to localStorage. Once parsed, the JSON object looks for the following fields:

* `nw_accounts` __array__
* `nw_blockstrap` __object__
* `nw_contacts` __array__
* `nw_keys` __object__

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.submit_payment`(button, e) <a name="buttons_submit_payment" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to process information prior to sending a payment and uses the following `button` data attributes:

* data-form-id
* data-account-id
* data-to-blockchain
* data-to-address
* data-to-amount

The `data-form-id` is used to define which form within the DOM to use to find the validating information proving ownwership of the account, where as the `data-account-id` is used to define which account to send the payment from, and the other three fields then define what to send to where.

The critical functions is must parse include:

* [`$.fn.blockstrap.accounts.verify`](../accounts/#accounts_verify)
* [`$.fn.blockstrap.blockchains.send`](../blockchains/#blockchains_send)

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.submit_verification`(button, e) <a name="buttons_submit_verification" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used in conjunction with [`$.fn.blockstrap.accounts.verify`](../accounts/#accounts_verify) to ensure that the current user has ownership of the relevant account. It requires the following `button` data attributes:

* data-form-id
* data-account-id

The `data-form-id` is used to define which form within the DOM to use to find the validating information proving ownwership of the account, where as the `data-account-id` is used to define which account needs verifying.

<a href="#docs_home"><small>- back to top</small></a>

--------------------------------------------------------------------------------

#### `buttons.toggle`(button, e) <a name="buttons_toggle" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to toggle UI elements within the ocntact creation modal window between an input form with a user icon floating to the right to a select box filled with current contacts and the ability to switch back to the manual input. If no contacts have yet been created and the `button` is clicked, a new modal window will open informing the user that they do not yet have any contacts.

<a href="#docs_home"><small>- back to top</small></a>

---

###### Related Articles

01. [Back to Modules](../../modules/)
02. [Accounts](../accounts/)
03. [API](../api/)
04. Buttons
05. [Contacts](../contacts/)
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