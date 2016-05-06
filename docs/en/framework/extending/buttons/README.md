Buttons API
===========

If a theme contains the `js/modules/theme.js` module, it will attempt to auto-load and auto-assign button functions as follows:

* `theme.buttons.example()` will be assigned to buttons with the `.btn-example` class
* `theme.buttons.an_id()` will be assigned to buttons with the `#an-id` id

If the function name does not contain an underscore it will be assigned to a class, whereas one with an underscore will be assigned to an ID.

--------------------------------------------------------------------------------

1. Related Articles
2. [Return to Extending](../../extending/)
3. [Themes](../themes/)
4. [Buttons](../buttons/)
5. [Filters](../filters/)
6. [Hooks](../hooks/)
7. [Table of Contents](../../../)
