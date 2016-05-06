Hooks
=====

Hooks allow you to insert new events into the core processes without needing to edit core files.

The full list of available hooks where [`$.fn.blockstrap.core.apply_actions`](../../core/core-functions/#bs_apply_actions) is used include:

* `init` - _called at the start of $.fn.blockstrap.core.init_
* `init_callback` - _called when the core.init function is completed_
* `ready` - _ called at the end of $.fn.blockstrap.core.ready_

An example of how to add an action to `init` can be seen below:

<!--pre-javascript-->
```
var important_info = 'something-needed-later';
$.fn.blockstrap.core.add_action(
    'init', // the hook to use
    'example_action', // a unique identifier
    'theme', // the module to use
    'example', // the function in module to use
    important_info // information needed later?
);
```

More information is available regarding [`$.fn.blockstrap.core.add_action`](../../core/core-functions/#bs_add_action).

--------------------------------------------------------------------------------

1. Related Articles
2. [Return to Extending](../../extending/)
3. [Themes](../themes/)
4. [Buttons](../buttons/)
5. [Filters](../filters/)
6. [Hooks](../hooks/)
7. [Table of Contents](../../../)
