/*
 * 
 *  Blockstrap v0.5
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var styles = {};
    
    styles.element = function(key)
    {
        var map = styles.map('elements');
        var element = '#' + $.fn.blockstrap.settings.id + ' ' + map[key];
        return element;
    };
    
    styles.map = function(type)
    {
        return $.fn.blockstrap.settings.styles[type];
    }
    
    styles.rule = function(key, value)
    {
        var map = styles.map('rules');
        var rule = map[key] + ': ' + value;
        return rule;
    };
    
    styles.set = function(id, index)
    {
        if(!index) index = 0;
        if(!id) id = 'blockstrap-styles';

        var style = document.createElement('style');
        style.id = id;
        style.setAttribute("type", "text/css");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);
        var tag = document.getElementById(id);
        var sheet = tag.sheet ? tag.sheet : tag.styleSheet;
        var id_prefix = '#'+$.fn.blockstrap.settings.id;

        var styles = $.fn.blockstrap.settings.styles;    
        if($.isPlainObject(styles))
        {
            $.each(styles, function(k, v)
            {
                var rule = $.fn.blockstrap.styles.rule(k, v);
                var element = $.fn.blockstrap.styles.element(k);
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
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {styles:styles});
})
(jQuery);


