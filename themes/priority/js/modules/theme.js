/*
 * 
 *  Blockstrap v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECTS
    var theme = {};
    theme.filters = {};
    
    // NEW HTML CONTENT
    theme.new = function()
    {
        $('#issues .qr-code').each(function(i)
        {
            $(this).qrcode({
                render: 'image',
                width: 80,
                height: 80,
                text: $(this).attr('data-qr')
            });
        });
    }
    
    // THEME FILTERS
    theme.filters.issues = function(blockstrap, data)
    {
        var issues = [];        
        var issue1 = {
            title: 'Provide support for stellar',
            address: '18AyfmPNxGbo5oqDoN5UvfCiSX4bBrJ1eV',
            author: '<a href="http://twitter.com/m_smalley">Mark Smalley</a>',
            votes: 12,
            contributions: 0.012,
            points: 13
        };
        var issue2 = {
            title: 'Provide support for something else with a really long title like this!',
            address: '18AyfmPNxGbo5oqDoN5UvfCiSX4bBrJ1eV',
            author: '<a href="http://twitter.com/m_smalley">Mark Smalley</a>',
            votes: 11,
            contributions: 0.012,
            points: 12
        };
        issues.push(issue1);
        issues.push(issue2);
        return issues;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {theme:theme});
})
(jQuery);