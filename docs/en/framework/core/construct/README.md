## The jQuery Plugin Construct

The `plugin` function at [core](../../core/) is what defines the order of initization. When the `/blockstrap/js/blockstrap.js` file is included in the header, the `plugin` functionality is called the moment the `/defaults.json` configuration file has been loaded, after which the following order of events then transpire:

* Plugin Options & Defaults Merged
* Custom Configuration & Theme Options Merged
* Settings Created from Merging of Merges
* HTML5 Data Attributes Override Settings
* Default Dependencies & Modules Added to Configuration
* Loading Screen Elements Fetched and Added to DOM
* Update Checks (for new versions of Blockstrap)
* LESS.css Modules Loaded (if enabled)
* CSS Included (if enabled)
* Dependencies Included
* Modules Included
* Core Initiated

As seen here:

<!--pre-javascript-->
```
function plugin(element, options, defaults)
{
    // MERGE DEFAULT AND PLUGIN OPTIONS
    var settings = $.extend({}, defaults, options);
    
    // THEN GET CONFIG FILE
    $.fn.blockstrap.core.get(bs_theme_config, 'json', function(results)
    {
        if($.isPlainObject(results))
        {
            $.fn.blockstrap.settings = $.extend({}, settings, results);
            $.fn.blockstrap.core.settings(element);
            $.fn.blockstrap.defaults();
            var bs = $.fn.blockstrap;
            var $bs = blockstrap_functions;
            var dependencies = $.fn.blockstrap.settings.dependencies;
            var modules = $.fn.blockstrap.settings.modules;
            // LOADING SCREEN
            // TODO: REMOVE FROM CORE...?
            // BETTER PLACED IN THEMES...?
            $.ajax({
                url: $.fn.blockstrap.settings.core_base + 'html/' + 'loading.html',
                dataType: 'HTML',
                type: 'GET',
                complete: function(results)
                {
                    var element = $.fn.blockstrap.element;
                    var id = $.fn.blockstrap.settings.content_id;
                    if($(element).find('#' + id).length < 1)
                    {
                        if(results)
                        {
                            if(results.responseText && results.responseText === '404')
                            {
                                // Do nothing!
                            }
                            else
                            {
                                var loading = results.responseText;
                                $($.fn.blockstrap.element).append(loading);
                            }
                        }
                    }
                }
            });
            // UPDATE CORE IF REQUIRED
            $bs.update(bs.settings.v, function()
            {
                // USE LESS.css ...?
                bs.core.less(function()
                {
                    // INSERT CSS
                    bs.core.css(function()
                    {
                        if($.isArray(dependencies))
                        {
                            // INCLUDE JS DEPENDENCIES
                            $bs.include(bs, 0, dependencies, function()
                            {
                                if($.isArray(modules))
                                {
                                    // INCLUDE JS MODULES
                                    $bs.include(bs, 0, modules, function()
                                    {
                                        bs.core.loaded();
                                    });
                                }
                                else
                                {
                                    bs.core.loaded();
                                }
                            }, true);
                        }
                        else
                        {
                            bs.core.loaded();
                        }
                    });
                });
            });
        }
    });
}
```

---

1. Related Articles
2. [Return to Core](../../core/)
2. [Configuration Settings](../configuration/)
3. [Defaults](../defaults/)
4. [Core Functions](../core-functions/)
5. [Blockstrap Functions](../blockstrap-functions/)
6. [Plugin Construct](../construct/)
7. [Table of Contents](../../../)
