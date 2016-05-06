Core Functions <a name="docs_home"></a>
=======================================

### Core Functions & Variables

This is often called by first setting `var bs = $.fn.blockstrap;`.

You can then use the following functions once core has been fully initialized:

* [`bs.core.ago`(time)](#bs_ago)
* [`bs.core.add_action`(hook, key, bs_module, bs_function, vars)](#bs_add_action)
* [`bs.core.add_commas`(num)](#bs_add_commas)
* [`bs.core.apply_actions`(hook)](#bs_apply_actions)
* [`bs.core.boot`(bootstrap, key, html, index, callback)](#bs_boot)
* [`bs.core.bootstrap`(index, bootstrap, callback)](#bs_bootstrap)
* [`bs.core.buttons`()](#bs_buttons)
* [`bs.core.confirm`(title, content, confirmed_callback, cancel_callback)](#bs_confirm)
* [`bs.core.css`(callback, files)](#bs_css)
* [`bs.core.defaults`()](#bs_defaults)
* [`bs.core.filter`(data)](#bs_filter)
* [`bs.core.forms`()](#bs_forms)
* [`bs.core.get`(file, extension, callback, skip)](#bs_get)
* [`bs.core.image`(input, callback)](#bs_image)
* [`bs.core.init`()](#bs_init)
* [`bs.core.less`(callback)](#bs_less)
* [`bs.core.loaded`()](#bs_loaded)
* [`bs.core.loader`(state)](#bs_loader)
* [`bs.core.modal`(title, content, id)](#bs_modal)
* [`bs.core.modals`(action)](#bs_modals)
* [`bs.core.nav`(slug)](#bs_nav)
* [`bs.core.option`(key, default_value)](#bs_option)
* [`bs.core.page`()](#bs_page)
* [`bs.core.patch`(version, callback)](#bs_patch)
* [`bs.core.plugins`(index, plugins, callback)](#bs_plugins)
* [`bs.core.print`(contents)](#bs_print)
* [`bs.core.publicize`(callback)](#bs_publicize)
* [`bs.core.ready`()](#bs_ready)
* [`bs.core.refresh`(callback, slug)](#bs_refresh)
* [`bs.core.reset`(reload)](#bs_reset)
* [`bs.core.resize`(delay)](#bs_resize)
* [`bs.core.resized`(delay)](#bs_resized)
* [`bs.core.salt`(modules, callback, salt)](#bs_salt)
* [`bs.core.settings`(element)](#bs_settings)
* [`bs.core.string_to_array`(string)](#bs_string_to_array)
* [`bs.core.stringed`(styles)](#bs_stringed)
* [`bs.core.table`()](#bs_table)
* [`bs.core.test_results`(expected, given, index, total, title, api_service, chain_count, chain_total)](#bs_test_results)
* [`bs.core.test_results_table`(results)](#bs_test_results_table)
* [`bs.core.tests`(run)](#bs_tests)
* [`bs.core.txt`(input, callback)](#bs_txt)
* [`bs.core.upgrade`(saved_version, this_version, refresh, callback)](#bs_upgrade)

--------------------------------------------------------------------------------

#### `bs.core.ago`(time) <a name="bs_ago" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes a timestamp (in seconds) and converts it into a written phrase, such as one minute ago. If your time is set to milliseconds, convert it by one thousand (1,000) before running it through the function. Multi-lingual options will be available before reaching version 1.0.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.add_action`(hook, key, bs_module, bs_function, vars) <a name="bs_add_action" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function allows you to add custom functionality into critical core processes without needing to edit core files. It works in a way very similar to the add and apply_actions functions found in WordPress. The `hook` variable defines which event you would like to tie your action to. The current hooks available within core include:

* `init` - _called at the start of $.fn.blockstrap.core.init_
* `init_callback` - _called when the core.init function is completed_
* `ready` - _ called at the end of $.fn.blockstrap.core.ready_

The `key` is used as a unique identifier for each function you would like to attach to the hook.

The `bs_module` and `bs_function` variables allow you to define which function from which module you would like to run at the event, whereas the `vars` variable allows you to attach additional information to the function being called.

An example of this can be seen in `/plugins/markets/markets.js` as follows:

<!--pre-javascript-->
```
var conditions = 'something-important-to-pass-on';
$.fn.blockstrap.core.add_action(
    'init', 
    'market_updates',
    'plugins.markets', 
    'update', 
    conditions
);
```

It is worth noting that calling regular modules does not require dot notation, but should you wish to call a plugin function you need to add the word plugin followed by a dot and then the plugin name in order to access its functions (as seen on line 5 above).

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.add_commas`(num) <a name="bs_add_commas" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes an integer and returns a string with comma formatting as follows:

<!--pre-javascript-->
```
var price = $.fn.blockstrap.core.add_commas(12345);
// price = '12,345'
```

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.apply_actions`(hook) <a name="bs_apply_actions" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function attempts to call all the actions added the relevant `hook`.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.boot`(bootstrap, key, html, index, callback) <a name="bs_boot" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function loads each select Bootstrap component into `$.fn.blockstrap.snippets`. Once there, you could for example then get the relevant HTML Mustache template for lists by simply calling `$.fn.blockstrp.snippets['lists']`, which would contain the following HTML:

<!--pre-html-->
```
{{#objects}}
    <ul id="{{id}}" class="list-group">
        
        {{#items}}

            {{#href}}
                <a href="{{href}}">
                    <li class="list-group-item {{css}}">
                        <div class="list-item-content">
                            {{{html}}}
                        </div>
                        {{#badge}}
                            <span class="badge">{{badge}}</span>
                        {{/badge}}
                    </li>
                </a>
            {{/href}}
            {{^href}}
                <li class="list-group-item {{css}}">
                    <div class="list-item-content">
                        {{{html}}}
                    </div>
                    {{#buttons}}
                        <a 
                           href="{{href}}" 
                           class="btn {{css}}" 
                           {{#attributes}}
                                {{key}}="{{value}}" 
                           {{/attributes}}
                        >
                            {{text}}
                        </a>
                    {{/buttons}}
                </li>
            {{/href}}
        
        {{/items}}
        {{^items}}
            <li class="list-group-item {{css}}">
                {{{missing}}}
            </li>
        {{/items}}

    </ul>
{{/objects}}
```

This can then be merged with data using the `$.fn.blockstrap.templates.process` function to create fully-rendered content as follows:

<!--pre-javascript-->
```
var html = $.fn.blockstrap.snippets['lists'];
var data = {
    objects = [
        {
            id: 'list-id',
            items: [
                {
                    text: 'List Content'
                }
            ]
        }
    ]
};
var page_contents = Mustache.render(html, data);
```

The `page_contents` variable would then contain the following HTML:

<!--pre-html-->
```
<ul id="list-id">
    <li>List Content</li>
</ul>
```

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.bootstrap`(index, bootstrap, callback) <a name="bs_bootstrap" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function cycles through an array to load the necessary components using `$.fn.blockstrap.core.boot()`.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.buttons`(classes, ids) <a name="bs_buttons" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

If no classes or IDs are passed into the function (as seen when loaded automatically during initialization) this function will check the configuration settings to determine which button classes and IDs to apply the assigned functions to. If arrays of classes and IDs are passed into the function, it will initiative the newly assigned buttons.

If the classes array contianed the following:

<!--pre-javascript-->
```
{
    "classes": [
        "print",
        "qr"
    ]
}
```

This would try to assign the `$.fn.blocstrap.buttons.print` and `$.fn.blockstrap.buttons.qr` functions to the `.btn-print` and `.btn-qr` elements. Please note that classes that you wish to auto assign need to be prefixed with `btn`. If it could not find the necessary functionality within the `buttons` module it would attempt to seek out the same functions from `$.fn.blockstrap.theme.buttons.print` and `$.fn.blockstrap.theme.buttons.qr` before cancelling its self assignment.

In the case of IDs, dashes in IDs get converted to underscores, so the following array:

<!--pre-javascript-->
```
{
    "ids": [
        "submit-payment"
    ]
}
```

Would try to assign the `submit_payment` function to an element with an ID of `submit-payment`.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.confirm`(title, content, confirmed_callback, cancel_callback) <a name="bs_confirm" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens a modal window that mimics the functionality of a confirmation dialog, where the `title` and `content` variables define the contents of the modal window. The `confirmed_callback` and `cancel_callback` variables should be assigned functions that run according to the user's selection.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.css`(callback, files) <a name="bs_css" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function cycles through the configured array of files and adds them to the header as available. It will try to search the core `blockstrap/css/` folder if it is first unable to find them within your active theme CSS folder (`themes/<active-theme>/css/`). Once it has loaded all of the CSS files, it will then attempt to run the `callback` variable (which should be a function). If you include an array of `files` it will instead load these rather than those configured, which by default, include:

<!--pre-javascript-->
```
{
    "css": [
        "less",
        "font-awesome"
    ]
}
```

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.defaults`() <a name="bs_defaults" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is auto-loaded by core at run-time and should not be run again. It checks for whether the `data` and `security` modules are included and if not, then provides the following skeleton functions (that prevent known errors from other modules):

* $.fn.blockstrap.data.find
* $.fn.blockstrap.data.save
* $.fn.blockstrap.security.logged_in

These skeleton functions do nothing other than performing the associated callbacks.

Ideally, this function should not need to exist, and by version 1.0, it will either be removed, or be more configurable.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.filter`(data) <a name="bs_filter" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function reccursively loops through data arrays in search of the `func` keyword, from which it will then assign the necessary function from the filters module ([`$.fn.blockstrap.modules.filters`](../../modules/filters/)). For example and as seen within `themes/default/data/index.json`:

<!--pre-javascript-->
```
{
    "name": {
        "func": "get",
        "collection": "keys",
        "key": "your_name"
    }    
}
```

As seen on line 3 above, when the `func` is used as a key it's value becomes the filter function called. Each filter function has its own requirements. In the case of [`$.fn.blockstrap.filters.get`](../../modules/filters/#filters_get) a `collection` and `key` is required, which is then used in conjunction with `$.fn.blockstrap.data.find` in order to replace the value of the `name` object with the results collected from the find.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.forms`() <a name="bs_forms" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This is a horrid function and will be replaced very shortly with something much better. We do apologise for anyone brave enough to look through the source and see just how ugly this side-step became. It currently applies much of the fancy form magic used with the default theme, yet somehow managed to find its way into core. Again, sorry!

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.get`(file, extension, callback, skip) <a name="bs_get" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to collect __DATA__.json files and __TEMPLATE__.html files. Assuming the `skip` variable has not been defined, it will use the `file`.`extension` variables to construct a file name that is then retrieved via AJAX, upon completing which the `callback` function is called.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.image`(input, callback) <a name="bs_image" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes an input with type `file` and then performs the necessary `callback` function when it is used to upload an image file.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.init`() <a name="bs_init" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is the final function called at the end of the [Plugin Construct](../construct/). It is within this function that the content for the relevant page gets rendered. This function also contains two action hooks and flows as follows:

* Apply `init` Actions
* Perform [`$.fn.blockstrap.core.publicize`](#bs_publicize)
* If not logged-in, show `blockstrap/html/login.html` content
* __Else__ then continue with the following tasks:
* if [Accounts Module](../../modules/accounts/) activated, run `accounts.poll()`
* Render Content Relevant to Slugs
* Run Tests (if configured to do so)
* __Once Page Rendered__ then continue with the following:
* Initiate DOM Related Functions
* Apply `init_callback` Actions

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.less`(callback) <a name="bs_less" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function should (in most cases) be used when developing new applications as it allows you to use `.less` files live within the browser. The results can be cached locally so that consecutive page loads do not require you to load each individual less file, but when you have a complete suite of individual less files (such as when loading the default less files) it can take quite some time during that initial loading sequence, but is nonetheless very useful when developing. If used when developing, the final results can be locked-down before going live and served as a compiled CSS file instead.

___This function should not be called directly and is currently quite unstable with frustrating caching complexities!___

Currently, it is called when set within your [core configuration](../configuration/) files as follows:

<!--pre-javascript-->
```
{
    "less": true
}
```

If set to `true` the following __base__ LESS file will be used as a starting point `themes/<active-theme>/less/blockstrap.less` if available.

The __default__ Theme's LESS file has the following starting point:

<!--pre-css-->
```
// Import Core
@import "../../../blockstrap/bootstrap/less/bootstrap.less";

// Core variables and mixins
@import "variables.less";
@import "mixins.less";

// Switches
@import "switch/bootstrap-switch.less";

// Core App
@import "app.less";

// Responsiveness should be last
@import "responsiveness.less";
```

As you can see from line 2 above, the __default__ theme will also load each individual bootstrap component before loading its own theme-related files.

Again, this can be both useful and annoying. Good luck!

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.loaded`() <a name="bs_loaded" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is part of the final call from the [Plugin Construct](../construct/).

It is used internally to store the [configured](../configuration/) `theme_name` before it then calls the [`core.defaults`](#bs_defaults) function prior to [`core.init`](#bs_init).

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.loader`(state) <a name="bs_loader" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

If called without a defined `state` a `loading` CSS class will either be added or removed to the application's parent container. If a `state` such as __open__ or __close__ is defined, smoother animation will be used to transist between the two states.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.modal`(title, content, id) <a name="bs_modal" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to activate the [Bootstrap Modal](http://getbootstrap.com/javascript/#modals) component. The `title` and `content` define what to display within the modal window, whereas the `id` variable is used to open a specific modal window with pre-defined content as seen within the following section inside `themes/default/data/index.json`:

<!--pre-javascript-->
```
{
    "modals": {
        "func": "bootstrap",
        "type": "modals",
        "objects": [
            {
                "id": "default",
                "title": "Title",
                "body": "<p>Content.</p>",
                "close": "Cancel"
            },
            {
                "id": "confirm",
                "title": "Confirmation Required",
                "body": "<p>Please re-confirm you want to do that?</p>",
                "close": "Cancel",
                "footer": true,
                "actions": [
                    {
                        "text": "Confirm",
                        "css": "btn-success"
                    }
                ] 
            }
        }
    }
}
```

This would output the following HTML:

<!--pre-html-->
```
<div class="modal fade " id="default-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">×</span>
                    <span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title">Title</h4>
            </div>
            <div class="modal-body no-footer">
                <p>Content.</p>
            </div>
        </div>
    </div>
</div>
<div class="modal fade " id="confirm-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">×</span>
                    <span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title">Confirmation Required</h4>
            </div>
            <div class="modal-body">
                <p>Please re-confirm you want to do that?</p>    
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success">Confirm</button>
            </div>
        </div>
    </div>
</div>
```

With these two modals added to the DOM, the `$.fn.blockstrap.core.modal(false, false, 'confirm')` would result in the following:

![Default Confirmation Modal](../../../../_libs/img/docs/framework/core/confirmation-modal.jpg)

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.modals`(action) <a name="bs_modals" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is a lot like [`core.forms`](#bs_forms) in that it too is a bit of a mess and should hopefully be removed and or vastly improved by the time we reach version 1.0. Only the brave would dare spend the time getting their head around this one, but it basically runs a bunch of functions on potential modal content used by other modules and functions and should never be called directly so is probably worth forgetting (for now).

__Howerver__, there is one use it has in the form of the available `action` variable. If set to `close_all` it will close any and all open modal windows.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.nav`(slug) <a name="bs_nav" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function should be called when page content changes or loads and will add the `active` CSS class to the [configured](../configuration/) `navigation_id` and `mobile_nav_id` elements. If the `slug` equals `$.fn.blockstrap.settings.page_base` the slug will be converted to `$.fn.blockstrap.settings.slug_base`.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.option`(key, default_value) <a name="bs_option" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns the appropriate option as stored in localStorage. The appropriate options are defined during setup with the `data-setup-type` attributes used within the setup form, and by default include:

* api_service
* your_photo
* photo_salt
* your_question
* wallet_question
* wallet_choice

The `key` variable defines which option you would like to search for whilst the `default_value` provides an optional value to return if the desired option is not available.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.page`() <a name="bs_page" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function returns the current page slug.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.patch`(version, callback) <a name="bs_patch" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function loads and initiates the requested patch. Patches are used to handle upgrade paths between specific versions without needing to store or serve the upgraded code from core. Patches currently need to be served from `/blockstrap/patches/` with each patch contained within its own folder as follows:

* index.html
* blockstrap
    * css
    * js
    * patches
        * 0501
            * patch-0501.js
        * 0502
            * patch-0502.js
            
_Please note that the `index.html` file and `css` and `js` folders are shown above for context only._

We use folders in case patches require external files.

The patch itself follows a style similar to plugins, requiring this minimum functionality:

<!--pre-javascript-->
```
(function($) 
{
    var patch0501 = {};
    
    patch0501.init = function(callback)
    {
        // ADD UPGRADE CODE HERE
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.patches, {patch0501:patch0501});
    
})
(jQuery);
```

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.plugins`(index, plugins, callback) <a name="bs_plugins" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to store and serve plugins from cache. It cycles through the supplied `plugins` array and initiates the `callback` function upon completion.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.print`(contents) <a name="bs_print" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function opens a new print-friendly window containing the `contents` provided.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.publicize`(callback) <a name="bs_publicize" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function determines and sets the current user's role and then performs the provided `callback` function.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.ready`() <a name="bs_ready" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function should be called each time new content has been added to the DOM and in doing so performs the following functions:

* [`$.fn.blockstrap.core.table()`](#bs_table)
* [`$.fn.blockstrap.core.forms()`](#bs_forms)
* [`$.fn.blockstrap.core.page()`](#bs_page)
* [`$.fn.blockstrap.core.nav()`](#bs_nav)

It also attempts to load the following functions if the relevant modules are available:

* $.fn.blockstrap.theme.new
* $.fn.blockstrap.buttons.new

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.refresh`(callback, slug) <a name="bs_refresh" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will attempt to (re)-render the current page content and then peform the provided `callback` function. If however an optional `slug` variable is provided it will instead attempt to specifically load the relevant content related to the slug.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.reset`(reload) <a name="bs_reset" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function will clear all the related records from localStorage and if `reload` is set to `true` will then refresh the page.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.resize`(delay) <a name="bs_resize" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is a timeout wrapper for `core.resized` that allows the `delay` to be set as a variable.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.resized`(delay) <a name="bs_resized" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is called when new content is added to the DOM and the window is then subsequnetly resized. It currently then only calls:

* [`$.fn.blockstrap.core.table`](#bs_table)

This function will be more configurable before reaching version 1.0.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.salt`(modules, callback, salt) <a name="bs_salt" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to generate the device salt. It takes a `modules` object variable and cycles through each, compounding the encryption as it goes and performing the necessary `callback` function upon completion. If an optional `salt` is included, it will use that as the initial starting point for its encryption, rather than using the internally set application ID (`$.fn.blockstrap.settings.id`).

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.settings`(element) <a name="bs_settings" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is called from within the [`core.init`](#bs_init) function and transform the various data-attributes attached tothe provided `element` into configuration settings.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.string_to_array`(string) <a name="bs_string_to_array" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used by [`core.settings`](#bs_settings) to convert strings from data-attributes constructed as follows:

<!--pre-html-->
```
<div data-plugins="[markets, test]"></div>
```

Into the following array:

<!--pre-javascript-->
```
{
    plugins: [
        markets,
        test
    ]
}
```

The string must start with `[` and end with `]` whislt using the `', '` delimeter.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.stringed`(styles) <a name="bs_stringed" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used internally by the [Styles Module](../../modules/styles/) to convert strings to CSS attributes.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.table`() <a name="bs_table" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is auto-loaded when new content is added to the DOM. It searches for tables with the `data-tables` CSS class:

<!--pre-html-->
```
<table class="data-table"></table>
```

It will automatically apply the [DateTables Plugin](http://datatables.net) to any tables with this class.

It then uses these additional data attributes as advanced DataTables options:

<!--pre-html-->
```
<table

    class="data-table"
    data-search=""
    data-dom=""
    data-order=""
    data-order-by=""
    
></table>
```

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.test_results`(expected, given, index, total, title, api_service, chain_count, chain_total) <a name="bs_test_results" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to display the results related to [`core.tests`](#bs_tests) and __should not__ be called directly.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.test_results_table`(results) <a name="bs_test_results_table" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is also used to display the results related to [`core.tests`](#bs_tests) and __should not__ be called directly.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.tests`(run) <a name="bs_tests" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function __should not__ be called directly, as it is automatically called if [configured](../configuration/) to do so with `tests: true`.

These tests are strictly used in conjunction with the [API Module](../../modules/api/) with one example showing requirements as follows:

<!--pre-javascript-->
```
{
    "tests": {
        "api": {
            "address": {
                "request": "1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k",
                "results": {
                    "address": "1Nz5RqevRodefPyGVB8EpdwSEGS4Ax2f1k",
                    "balance": 10019000,
                    "blockchain": "btc",
                    "hash": "f1260c3cd86ecc03ce460c303ec0e8006e32273d",
                    "received": 10019000,
                    "tx_count": 2
                }
            }
        }
    }
}
```

Another way to run the tests without changing the configuration is visiting `tests.html` instead of `index.html`.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.txt`(input, callback) <a name="bs_txt" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function takes an input with type `file` and then performs the necessary `callback` function when it is used to upload a `.txt` file.

<small><a href="#docs_home">- back to top</a></small>

--------------------------------------------------------------------------------

#### `bs.core.upgrade`(saved_version, this_version, refresh, callback) <a name="bs_upgrade" class="pull-right" href="#docs_home"><i class="glyphicon glyphicon-upload"></i>- back to top</a>

This function is used to manage the logic behind which upgrade paths lead to which [patches](#bs_patch) being loaded.

<small><a href="#docs_home">- back to top</a></small>

---

1. Related Articles
2. [Return to Core](../../core/)
2. [Configuration Settings](../configuration/)
3. [Defaults](../defaults/)
4. [Core Functions](../core-functions/)
5. [Blockstrap Functions](../blockstrap-functions/)
6. [Plugin Construct](../construct/)
7. [Table of Contents](../../../)
