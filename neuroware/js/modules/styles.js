/*
 * 
 *  Neuroware v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECT
    var styles = {};
    
    // FUNCTIONS FOR OBJECT
    styles.set = function(id, index)
    {
        if(!index) index = 0;
        if(!id) id = 'neuroware-styles';

        var style = document.createElement('style');
        style.id = id;
        style.setAttribute("type", "text/css");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);
        var tag = document.getElementById(id);
        var sheet = tag.sheet ? tag.sheet : tag.styleSheet;
        var id_prefix = '#'+$.fn.neuroware.settings.id;

        var styles = $.fn.neuroware.settings.styles;    
        if($.isPlainObject(styles))
        {
            $.each(styles, function(k, v)
            {
                var rule = $.fn.neuroware.styles.rule(k, v);
                var element = $.fn.neuroware.styles.element(k);
                if(sheet.insertRule) 
                {
                    sheet.insertRule(element + ' { ' + rule + ' }', index);
                }
                else 
                {
                    sheet.addRule(element, rule, index);
                }                        
            });
        }
    };
    styles.rule = function(key, value)
    {
        var map = styles.map('rules');
        var rule = map[key] + ': ' + value;
        return rule;
    };
    styles.element = function(key)
    {
        var map = styles.map('elements');
        var element = '#' + $.fn.neuroware.settings.id + ' ' + map[key];
        return element;
    };
    styles.map = function(type)
    {
        return $.fn.neuroware.settings.maps.styles[type];
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.neuroware, {styles:styles});
})
(jQuery);


