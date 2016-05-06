Bootstrap <a name="docs_home"></a>
==================================

We have packaged the fabulous [bootstrap](http://getbootstrap.com) framework with [core](../../core/). It allows for easy component based styling. If you do not already know how it functions, we suggest you [read the documentation](http://getbootstrap.com/css/). The version included with [core](../../core/) also allows us to edit [LESS](../less/) files direct. In addition to the standard CSS classes and JS components available with Bootstrap, the following add-on functionality is provided by Blockstrap:

* [Bootstrap Filters](#bootstrap_filters)
* [Bootstrap Switches](#bootstrap_switches)
* [Bootstrap FileStyle](#bootstrap_filestyle)
* [Bootstrap Modal Functions](#bootstrap_modals)
* [Bootstrap Confirmations](#bootstrap_confirmations)
* [Bootstrap Forms](#bootstrap_forms)

-------------------------------------------------------
#### Bootstrap Filters <a name="bootstrap_filters"></a>

Bootstrap filters allow you to insert HTML components into data arrays as follows (and seen in `themes/default/data/index.json`):

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
        }
    }
}
```

On line 3 above, the `bootstrap` filter is activated via the `func` key. 

The `type` is then used in conjunction with the `objects` to first collect the following HTML (from `blockstrap/htl/bootstrap/modals.html`):

<!--pre-html-->
```
{{#objects}}
<div class="modal fade {{css}}" id="{{id}}-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title">{{{title}}}</h4>
            </div>
            {{#footer}}
                <div class="modal-body">
            {{/footer}}
            {{^footer}}
                <div class="modal-body no-footer">
            {{/footer}}
                {{{body}}}
                <div class="row-fluid">
                    {{#form}}
                        <!-- FORM CONTENT REMOVED FOR DOCUMENTATION -->
                    {{/form}}
                </div>
            </div>
            {{#footer}}
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">{{close}}</button>
                {{#actions}}
                    <button type="button" class="btn {{css}}">{{text}}</button>
                {{/actions}}
            </div>
            {{/footer}}
        </div>
    </div>
</div>
{{/objects}}
```

This is then combined with the `objects` found in the initial data array using [Mustache](../mustache/) replacing the `modals` object in the initial data array with the following HTML:

<!--pre-html-->
```
<div id="default-modal" class="modal fade ">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button data-dismiss="modal" class="close" type="button">
                    <span aria-hidden="true">×</span><span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title">Title</h4>
            </div>
            <div class="modal-body no-footer">
                <p>Content.</p>
            </div>      
        </div>
    </div>
</div>
```

This can then be rendered to the screen with a template using the following [Mustache](../mustache/) syntax:

<!--pre-html-->
```
{{{modals}}}
```

<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------------------
#### Bootstrap Switches <a name="bootstrap_switches"></a>

The switches become available when the necessary file is added to [configuration](../../core/configuration/) as required:

<!--pre-javascript-->
```
{
    "dependencies": [
        "bootstrap-switch.min"
    ]
}
```

If added, whenever new content is added to the DOM, any inputs with the `switch` class as follows:

<!--pre-html-->
```
<input class="switch" />
```

Will be converted into switches, which should look something like this:

![Bootstrap Switches](../../../../_libs/img/docs/framework/assets/bootstrap/switches.jpg)

You can see how these work by starting at `themes/default/js/dependencies/steps.json` with the following example:

<!--pre-javascript-->
```
{
    "inputs": {
        "id": "wallet_choice",
        "css": "switch",
        "label": {
            "text": "Add question to Salt?",
            "css": "col-sm-6"
        },
        "type": "checkbox",
        "attributes": [
            {
                "key": "data-off-color",
                "value": "danger"
            },
            {
                "key": "data-on-color",
                "value": "success"
            },
            {
                "key": "data-off-text",
                "value": "NO"
            },
            {
                "key": "data-on-text",
                "value": "YES"
            },
            {
                "key": "data-label-text",
                "value": "SET"
            }
        ],
        "wrapper": {
            "css": "col-sm-6"
        }
    }
}
```

As you can see from lines 10 to 31, the data attributes of the input are used as plugin options.

<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------------------
#### Bootstrap FileStyle <a name="bootstrap_filestyle"></a>

The filestyle functionality becomes available when the necessary file is added to [configuration](../../core/configuration/) as required:

<!--pre-javascript-->
```
{
    "dependencies": [
        "bootstrap-filestyle.min"
    ]
}
```

If added, whenever new content is added to the DOM, any inputs with the `filestyle` class as follows:

<!--pre-html-->
```
<input class="filestyle" />
```

Will be converted into filestyle inputs, which should look something like this:

![Bootstrap Filestyle](../../../../_libs/img/docs/framework/assets/bootstrap/filestyle.jpg)

You can see how these work by starting at `themes/default/js/dependencies/steps.json` with the following example:

<!--pre-javascript-->
```
{
    "inputs": {
        "id": "your_photo",
        "label": {
            "text": "Profile Photo",
            "css": "col-sm-3"
        },
        "type": "file",
        "css": "filestyle",
        "wrapper": {
            "css": "col-sm-9"
        }
    }
}
```

There are currently no additional options available for this plugin.

__However__, pleae note that upon uploading a new image, its base64 representation will beadded to the inputs `data-img` HTML5 attributes.


<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------------------
#### Bootstrap Modal Functions <a name="bootstrap_modals"></a>

The [`$.fn.blockstrap.core.modal`](../../core/core-functions/#bs_modal) allows you to add the following code to your application:

<!--pre-javascript-->
```
var bs = $.fn.blockstrap;
$('body').on('click', '.example-button', function(e)
{
    e.preventDefault();
    bs.core.modal('Example', 'This is an example modal window');
});
```

This should then present you will the following being seen in your application:

![Example Modal](../../../../_libs/img/docs/framework/assets/bootstrap/modal.jpg)

If you are not using the default theme, you will be required to manually add the minimum default modal to your template.

You can either enter the minimum required HTML yourself or follow the steps outlined in the [`bootstrap.filters`](#bootstrap_filters) section listed above.

<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------------------
#### Bootstrap Confirmations <a name="bootstrap_confirmations"></a>

The [`$.fn.blockstrap.core.confirm`](../../core/core-functions/#bs_confirm) allows you to add the following code to your application:

<!--pre-javascript-->
```
var bs = $.fn.blockstrap;
$('body').on('click', '.example-confirmation', function(e)
{
    e.preventDefault();
    var yes = function(state)
    {
        console.log(state);
    }
    var no = function(state)
    {
        console.log(state);
    }
    bs.core.confirm('Confirm', 'Are you sure?', yes, no);
});
```

This should then present you will the following being seen in your application:

![Example Modal](../../../../_libs/img/docs/framework/assets/bootstrap/confirm.jpg)

If you are not using the default theme, you will be required to manually add the minimum confirm modal to your template as follows:

<!--pre-html-->
```
<div id="default-modal" class="modal fade ">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button data-dismiss="modal" class="close" type="button">
                    <span aria-hidden="true">×</span><span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body no-footer"></div>      
        </div>
    </div>
</div>
```

This could also be done through filters (as seen in `themes/default/data/index.json`):

<!--pre-javascript-->
```
{
"modals": {
    "func": "bootstrap",
    "type": "modals",
    "objects": [
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
```

This function can be supplied two callback functions, one for re-confirming yes, and theother for cancelling.

<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------------------
#### Bootstrap Forms <a name="bootstrap_forms"></a>

Since one of the snippets that can be called via `$.fn.blockstrap.snippets['form']` is a fully-functioning HTML template that uses the Bootstrap form syntax, you can create entire forms using Javascript within your application as follows:

<!--pre-javascript-->
```
var options = {
    objects: [
        {
            id: 'verify-ownership',
            fields: [
                {
                    inputs: [
                        {
                            id: 'un',
                            label: 'Username',
                            type: 'text',
                            placeholder: 'Type your username'
                        }
                    ]
                },
                {
                    inputs: [
                        {
                            id: 'pw',
                            label: 'Password',
                            type: 'password',
                            placeholder: 'Confirm your identity'
                        }
                    ]
                }
            ]
        }
    ],
    buttons: {
        forms: [
            {
                type: "submit",
                id: "sign-in",
                css: 'btn-primary pull-right',
                text: 'Submit'
            }
        ]
    }
};
var form = $.fn.blockstrap.forms.process(options);
```

This would provide the `form` variable with the following HTML:

<!--pre-html-->
```
<form id="verify-ownership">
    <div class="form-group">
        <input 
           type="text" 
           id="un" 
           class="form-control" 
           placeholder="Type your username" 
           value="" 
           autocomplete="off"
        />
    </div>
    <div class="form-group">
        <input 
           type="password" 
           id="pw" 
           class="form-control" 
           placeholder="Confirm your identity" 
           value="" 
           autocomplete="off"
        />
    </div>
    <div class="actions">
        <button 
            type="submit" 
            id="sign-in" 
            class="btn btn-primary pull-right"
        >Submit</button>
    </div>
</form>
```

This snippets currently supported by core include:

* __Bars__ called via `$.fn.blockstrap.snippets['bars']`
* __Forms__ called via `$.fn.blockstrap.snippets['forms']`
* __Jumbotrons__ called via `$.fn.blockstrap.snippets['jumbotrons']`
* __Lists__ called via `$.fn.blockstrap.snippets['lists']`
* __Login__ called via `$.fn.blockstrap.snippets['login']`
* __Modals__ called via `$.fn.blockstrap.snippets['modals']`
* __Panels__ called via `$.fn.blockstrap.snippets['panels']`
* __Tables__ called via `$.fn.blockstrap.snippets['tables']`

Please note that the same `form` syntax can also be found inside the `modal` template.

<small><a href="#docs_home">- back to top</a></small>

---

1. Related Articles
2. [Back to Assets](../../assets/)
3. [Dependencies](../dependencies/)
4. [Boostrap](../bootstrap/)
5. [Mustache](../mustache/)
6. [LESS.css](../less/)
7. [Table of Contents](../../../)
