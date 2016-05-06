## Wallet Installation

Assuming you have already [downloaded](../../../framework/started/download/) the [framework](../../../framework/), the wallet should load by default when visiting the root folder from a web-server. 

The included `.htaccess` file should route all requests through to `index.html`. 

The default wallet theme should be set within `defaults.json` as follows:

<!--pre-javascript-->
```
{
    "id": "blockstrap",
    "theme": "default"
}
```

As you can see from line 2 above, the default ID should also be `blockstrap`, which should match the container in `index.html`:

<!--pre-html-->
```
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="blockstrap/js/blockstrap.js"></script>
    </head>
    <body>
        <div id="blockstrap" class="bs installing"></div>
    </body>
</html>
```

If you have not created a device salt with Blockstrap on this device at this domain, you should be presented with the installation screen as follows:

![Wallet Installation](../../../../_libs/img/docs/applications/wallet/installation/setup.jpg)

Once this has been completed, you should instead see the dashboard, which should look something like this:

![Wallet Installation](../../../../_libs/img/docs/applications/wallet/installation/dashboard.jpg)

If you have not already viewed the [Getting Started](../../../framework/started/) you may wish to do so.

Else you may find some of these topics of interest:

* [Understanding Core](../../../framework/core/)
* [Extending Blockstrap](../../../framework/extending/)

---

1. Related Articles
2. [Back to Wallet](../../wallet/)
3. [Installation](../installation/)
4. [Security](../security/)
5. [Accounts](../accounts/)
6. [Contacts](../contacts/)
7. [Table of Contents](../../../)
