## Manual Installation

The majority of people will tell you that running evaluated JavaScript is an extremely bad idea and incredibly difficult to debug. Nonetheless, in order to auto-load assets from the client-side based on configuration settings there really is no other way to do it, especially if you want to load these assets into localStorage for caching and quicker loading later.

By visiting `manual.html` rather than the `index.html` file, you will see that an ID other than `blockstrap` has been used and that the element has an additional `data-install="false"` HTML attribute added to prevent the install process from running.

<!--pre-html-->
```
<div id="blockstrap" data-install="false"></div>
```

This then allows the JavaScript files to be included manually (after the element) as follows:

<!--pre-html-->
```
<!-- INCLUDE REQUIRED DEPENDENCIES MANUALLY -->
<script src="blockstrap/js/dependencies/jquery.min.js"></script>
<script src="blockstrap/js/dependencies/ago.js"></script>
<script src="blockstrap/js/dependencies/bootstrap.min.js"></script>
<script src="blockstrap/js/dependencies/bootstrap-filestyle.min.js"></script>
<script src="blockstrap/js/dependencies/bootstrap-switch.min.js"></script>
<script src="blockstrap/js/dependencies/crypto.js"></script>
<script src="blockstrap/js/dependencies/sha3.js"></script>
<script src="blockstrap/js/dependencies/bitcoinjs-lib.js"></script>
<script src="blockstrap/js/dependencies/effects.js"></script>
<script src="blockstrap/js/dependencies/filesaver.js"></script>
<script src="blockstrap/js/dependencies/mustache.js"></script>
<script src="blockstrap/js/dependencies/tables.js"></script>
<script src="blockstrap/js/dependencies/qrcode.js"></script>
    
<!-- INCLUDE REQUIRED THEME DEPENDENCIES MANUALLY -->
<script src="themes/default/js/dependencies/steps.js"></script>
    
<!-- INCLUDE BS FRAMEWORK -->
<script src="blockstrap/js/defaults.js"></script>
<script src="blockstrap/js/blockstrap.js"></script>
<!-- PLEASE NOTE YOU CAN NOW SET INSTALL TO FALSE IN OPTIONS -->
    
<!-- INCLUDE REQUIRED MODULES MANUALLY -->
<script src="blockstrap/js/modules/templates.js"></script>
<script src="blockstrap/js/modules/api.js"></script>
<script src="blockstrap/js/modules/accounts.js"></script>
<script src="blockstrap/js/modules/blockchains.js"></script>
<script src="blockstrap/js/modules/buttons.js"></script>
<script src="blockstrap/js/modules/contacts.js"></script>
<script src="blockstrap/js/modules/data.js"></script>
<script src="blockstrap/js/modules/filters.js"></script>
<script src="blockstrap/js/modules/forms.js"></script>
<script src="blockstrap/js/modules/security.js"></script>
<script src="blockstrap/js/modules/styles.js"></script>
    
<!-- INCLUDE REQUIRED THEME MODULES MANUALLY -->
<script src="themes/default/js/modules/buttons.js"></script>
<script src="themes/default/js/modules/theme.js"></script>
    
<!-- INCLUDE PLUGINS MANUALLY -->
<script src="plugins/markets/markets.js"></script>
```

Where we then need to re-initiate things manually with the following code:

<!--pre-html-->
```
<script>
$(document).ready(function()
{
    $('#blockstrap-manual').blockstrap();
});
</script>
```

---

1. Related Articles
2. [Return to Examples](../../examples/)
3. [Manual Install](../manual/)
4. [API Tests](../tests/)
5. [Table of Contents](../../../)
