Mustache <a name="docs_home"></a>
=================================

We use [Mustache.js](https://github.com/janl/mustache.js/) as our templating engine. It allows us to easily combine JSON data arrays with HTML templates and render the results to the screen. By using MustacheJS the syntax for our templates can also be produced server-side by one of their [other libraries](http://mustache.github.io/).

Other areas of interest for MustacheJS and Blockstrap include:

* [Example Code](#mustache_example)
* [URL Routing](#mustache_routing)

------------------------------------------------
### Example Code <a name="mustache_example"></a>

As seen from the corresponding documentation, a quick example of how Mustache can be used:

<!--pre-javascript-->
```
var view = {
    title: "Joe",
    calc: function () 
    {
        return 2 + 4;
    }
};

var output = Mustache.render("{{title}} spends {{calc}}", view);
```

This would render as follows:

```
Joe spends 6
```
<small><a href="#docs_home">- back to top</a></small>

-----------------------------------------------
### URL Routing <a name="mustache_routing"></a>

By default, if visiting the root URL of the application without any additional URL paramters or hashes, the data and HTML for the view will be fetched via AJAX from the following locations (further defined within the necessary [configuration](../../core/configuration/) files):

* __DATA__: `/themes/default/data/index.json`
* __HTML__: `/themes/default/html/index.html`

If visiting the __accounts__ URL such with the hash as follows `your-application.com#accounts`, Blockstrap will assume you want to load the __accounts`__page and will also load:

* __DATA__: `/themes/default/data/accounts.json`
* __HTML__: `/themes/default/html/accounts.html`

It will first render the index page before then merging the accounts data and rendering the content from accounts by replacing the configured `$.fn.blockstrap.settings.content_id` element with the additional HTML.

<small><a href="#docs_home">- back to top</a></small>


---

1. Related Articles
2. [Back to Assets](../../assets/)
3. [Dependencies](../dependencies/)
4. [Boostrap](../bootstrap/)
5. [Mustache](../mustache/)
6. [LESS.css](../less/)
7. [Table of Contents](../../../)
