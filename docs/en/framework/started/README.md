## Getting Started

Before you [download](download/) Blockstrap, you should first check the [minimum requirements](requirements/).

You should then be able open the `index.html` file from within a browser (or visit the root directory from a server), at which point you should then be presented with a rendered user-view of the default [wallet](../../applications/wallet/) application, which is just one of several themes that are included within core.

If this is the first time you have used Blockstrap from that domain on that device, you should be asked to setup your device salt - else you would in the case of the default wallet be presented with the wallet itself. More detailed information on [installing the wallet](../../applications/wallet/installation/) is also available.

--------------
### Disclaimer

However, what you see and when you see it is very much dependent on the application that is being used or presented. In the case of [prioritizer](../../applications/prioritizer/) there are even admin and user views, and only adminstrators are ever asked to set things up. In addition to that, if you are only using [core](../core/) and have not included any additional [modules](../modules/) or the necessary configuration files, you may end-up seeing nothing.

By default, the following applications are included within [core](../core/):

* [Wallet](../../applications/wallet/)
* [Prioritizer](../../applications/prioritizer/)

Blockstrap Core is a [jQuery](http://jquery.com) plugin, so without [core](../core/) (`blockstrap/js/blockstrap.js`) or jQuery, nothing will work. By default, Blockstrap is set to auto include jQuery prior to then loading the other listed [assets](../assets/) and completing the process by initializing itself. For a deeper look at the exact logic flow, we would suggest reading the [Plugin Construct](../core/construct/) article. For a better explanation of device salts and how we generate private keys it is essential that you review our [security](../../applications/wallet/security/) article.

---------------
### Quick Start

Assuming you have included core within the header of your HTML and have the default HTML element in the body waiting as follows:

<!--pre-html-->
```
<head>
    <script src="blockstrap/js/blockstrap.js"></script>
</head>
<body>
    <div id="blockstrap"></div>
</body>
```

The default application will be initiated automatically due to having the `blockstrap` ID within the main document.

---------------------
### Manual Initiation

You can manually initiate the plugin whilst adding options as follows:

<!--pre-html-->
```
<head>
    <script src="blockstrap/js/blockstrap.js"></script>
</head>
<body>
    <div id="your-application"></div>
</body>
<script>
$(document).ready(function()
{
    $('#your-application').blockstrap({
        less: true
    });
});
</script>
```

This same configuration could also be achieved as follows:

<!--pre-html-->
```
<head>
    <script src="blockstrap/js/blockstrap.js"></script>
</head>
<body>
    <div id="blockstrap" data-less="true"></div>
</body>
```

In both cases, [LESS.css](../assets/less/) would be activated as all options can be provided via JavaScript or HTML5 data attributes.

Continue learning more by selecting something from below:

* [Download Blockstrap](download/)
* [Understanding Core](../core/)
* [Extending Blockstrap](../extending/)
* [Styling Blockstrap](../styling/)

--------------------------------------------------------------------------------

1. Related Articles
2. [Minimum Requirements](requirements/)
3. [Download](download/)
4. [Security Q&A](security/)
5. [Table of Contents](../../)