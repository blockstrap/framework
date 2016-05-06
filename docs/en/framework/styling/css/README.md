CSS
===

You do not need to manually include CSS within the HTML as styles are dyanmically added to the header by Blockstrap based upon the `css: []` options in [configuration](../../core/configuration/). Simply add or remove items in the options array to modify the stylesheets that are added to the page. By default, the following should be included:

<!--pre-javascript-->
```
{
    css: [
        'less', 
        'font-awesome',
        'theme'
    ]
}
```
---

By default, we have a compiled version (`/blockstrap/css/less.css`) of our [LESS.css](../../assets/less/) files that we use in production. When we want to make edits we simply add the `?less=true` parameter to the root URL of our application or update the [configuration](../../core/configuration/) options to `less: true`. This then intiates the `less.js` functionality and read the less files and inserts the rendered output into the DOM, where we can manually copy and paste the contents back into our `less.css` file for production.

We include [Font Awesome](http://fortawesome.github.io/Font-Awesome/) because it is awesome.

The `theme.css` file is auto-included should the active theme have one.

--------------------------------------------------------------------------------

1. Related Articles
2. [Return to Styling](../../styling/)
2. [CSS](../css/)
3. [JS](../js/)
4. [Table of Contents](../../../)
