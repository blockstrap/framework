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
    theme.buttons = {};
    
    // NEW DOM CONTENT
    theme.new = function()
    {
        // QR CODES
        $('#issues .qr-code').each(function(i)
        {
            $(this).qrcode({
                render: 'image',
                width: 80,
                height: 80,
                text: $(this).attr('data-content')
            });
        });
        // ISOTOPE FILTERING
        var $container = $('#issues').isotope({
            itemSelector: '.issue',
            layoutMode: 'vertical',
            getSortData: {
                addresses: '[data-addresses]',
                titles: '[data-titles]',
                votes: '[data-votes] parseInt',
                contributions: '[data-contributions] parseFloat',
                points: '[data-points] parseInt'
            },
            sortBy: 'points',
            sortAscending: false
        });
        $('#filters').on('click', 'a', function(e)
        {
            e.preventDefault();
            $('#filters a').removeClass('active');
            $(this).addClass('active');
            var sort = $(this).attr('data-sort');
            var order = false;
            if(sort == 'titles' || sort == 'addresses') order = true;
            $container.isotope({ sortBy: sort, sortAscending: order});
        });
        $('select#filter').on('change', function()
        {
            $('#filters a#' + $(this).val()).trigger('click');
        });
    }
    
    // THEME FILTERS
    theme.filters.issues = function(blockstrap, data)
    {
        var issues = [];
        if($.isArray(priority_issues))
        {
            $.each(priority_issues, function(k, issue)
            {
                var $bs = blockstrap_functions;
                var slug = $bs.slug(issue.title)
                issue.href = '#'+slug;
                issues.push(issue);
            });
        }
        return issues;
    }
    
    // COPIED FROM CORE TO REMOVE NEED FOR CORE FILTERS
    theme.filters.bootstrap = function(blockstrap, data)
    {
        var snippet = blockstrap.snippets[data.type];
        var html = Mustache.render(snippet, data);
        return html;
    }
    
    // THEME BUTTONS
    theme.buttons.qr = function(button, e)
    {
        e.preventDefault();
        var address = $(button).attr('data-content');
        var title = 'Contribute to ' + address;
        var content = '<div class="qr-holder" data-content="' + address + '"></div>';
        $.fn.blockstrap.core.modal(title, content);
    }
    theme.buttons.details = function(button, e)
    {
        e.preventDefault();
        var details = $(button).parent().find('.details').html();
        var title = $(button).parent().parent().parent().find('.info h4').html();
        $.fn.blockstrap.core.modal(title, details);
    }
    theme.buttons.share = function(button, e)
    {
        e.preventDefault();
        var t = $(button).parent().parent().parent().find('.info h4').text();
        var title = $(button).parent().parent().parent().find('.info h4').html();
        var u = $.fn.blockstrap.settings.base_url + '#' + blockstrap_functions.slug(t);
        var twitter = 'https://twitter.com/intent/tweet?url='+u+'&text='+t;
        var facebook = 'http://www.facebook.com/sharer/sharer.php?u='+u+'&t='+t;
        var linked = 'http://www.linkedin.com/shareArticle?mini=true&url='+u+'&title='+t;
        var google = 'https://plus.google.com/share?url='+u;
        $('#share-modal').find('a.twitter').attr('href', twitter);
        $('#share-modal').find('a.facebook').attr('href', facebook);
        $('#share-modal').find('a.linked').attr('href', linked);
        $('#share-modal').find('a.google').attr('href', google);
        $.fn.blockstrap.core.modal(title, false, 'share-modal');
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {theme:theme});
})
(jQuery);