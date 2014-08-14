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
    // EMPTY OBJECT
    var buttons = {};
    
    // FUNCTIONS FOR OBJECT
    buttons.new = function()
    {
        
    }
    buttons.menu = function(button)
    {
        var header = $('header');
        var content = $('#main-content');
        var sidebar_width = 250;
        var sidebar_display = $('#sidebar').css('display');
        
        $('#sidebar').css({'z-index':1});
        $('#navigation').css({'z-index':2});
        
        if($('#sidebar').css('left') === '60px')
        {
            sidebar_width = 0;
        }
        
        if(!$(button).hasClass('open'))
        {
            var left = '100%';
            var margin_left = -60;
            var width = '200%';
            var header_margin = margin_left;
            
            $(button).addClass('open');
            $('body').addClass('blockstrap-open-menu');
            
            if($('#sidebar').css('left') === '60px')
            {
                header_margin = -77;
            }
            
            $(header).animate({'left':left, 'margin-left':header_margin, 'width':width}, {duration: 350, queue: false, complete: function(e)
            {
                header.clearQueue();
            }});
            $(content).animate({'left':left, 'margin-left':margin_left, 'width':width}, {duration: 350, queue: false, complete: function(e)
            {
                content.clearQueue();
            }});
        }
        else
        {            
            $(header).animate({'left':sidebar_width, 'margin-left':0}, {duration: 350, queue: false, complete: function(e)
            {
                $(this).css('width','auto');
                $(button).removeClass('open');
                $('body').removeClass('blockstrap-open-menu');
                header.clearQueue();
            }});
            $(content).animate({'left':sidebar_width, 'margin-left':0}, {duration: 350, queue: false, complete: function(e)
            {
                $(this).css('width','auto');
                $(button).removeClass('open');
                $('body').removeClass('blockstrap-open-menu');
                content.clearQueue();
            }});
        }
    }
    buttons.sidebar = function(button)
    {
        var header = $('header');
        var content = $('#main-content');
        var left = 60;
        var margin_left = '-100%';
        var width = '100%';
        $('#sidebar').css({'z-index':2});
        $('#navigation').css({'z-index':1});
        $(window).trigger('resize');
        if(!$(button).hasClass('open'))
        {
            $(button).addClass('open');
            $('body').addClass('blockstrap-open-menu');
            $(header).animate({'left':left, 'margin-left':margin_left, 'width':width}, {duration:350, queue:false, complete:function(e)
            {
                header.clearQueue();
            }});
            $(content).animate({'left':left, 'margin-left':margin_left, 'width':width}, {duration:350, queue:false, complete:function(e)
            {
                header.clearQueue();
            }});
        }
        else
        {
            left = 0;
            margin_left = 0;    
            
            $(header).animate({'left':left, 'margin-left':margin_left}, {duration:350, queue:false, complete:function(e)
            {
                $(this).css({'width':'auto'});
                header.clearQueue();
                $(button).removeClass('open');
                $('body').removeClass('blockstrap-open-menu');
            }});
            $(content).animate({'left':left, 'margin-left':margin_left, 'width':width}, {duration:350, queue:false, complete:function(e)
            {
                $(this).css({'width':'auto'});
                header.clearQueue();
                $(button).removeClass('open');
                $('body').removeClass('blockstrap-open-menu');
            }});
        }
    }
    buttons.auth_salt = function(button)
    {
        var input_value = $(button).find('input.switch').val();
        if(input_value === true || input_value === 'true')
        {
            var password = '';
            password+= '<div class="form-group" id="salt-password">';
                password+= '<label class="control-label col-sm-3" for="salt_pw">Salt Password</label>';
                password+= '<div class="col-sm-9">';
                    password+= '<input type="text" data-setup-type="module" value="" placeholder="Strictly used for salt generation - not device or wallet" class="form-control " id="salt_pw">';
                password+= '</div>';
            password+= '</div>';
            if($('#blockstrap-setup-step1-left').find('#salt-password').length < 1)
            {
                $('#blockstrap-setup-step1-left').append(password);
                $('#blockstrap-setup-step1-left').find('#salt-password').hide(0);
            }
            $('#blockstrap-setup-step1-left').find('#salt-password').show(350, function()
            {
              
            });
        }
        else
        {
            $('#blockstrap-setup-step1-left').find('#salt-password').hide(350, function()
            {
              $(this).remove();
            });
        }
    }
    
    buttons.photo_salt = function(button)
    {
        var input_id = $(button).find('input.switch').attr('data-input');
        var input = $(button).parent().parent().parent().find('input#'+input_id);
        var photo = $(input).attr('data-img');
        if(photo)
        {
            var photo_salt = CryptoJS.SHA3(photo, { outputLength: 256 });
            var hidden_input = '<input type="hidden" id="'+input_id+'" value="'+photo_salt+'" data-setup-type="module" class="hidden-input" />';
            if($(button).parent().find('.hidden-input').length < 1)
            {
                $(button).parent().append(hidden_input);
            }
        }
        else
        {
            if($(button).hasClass('bootstrap-switch-on'))
            {
                $.fn.blockstrap.core.modal('Warning', 'Unable to find photo');
            }
            if($(button).parent().find('.hidden-input').length > 0)
            {
                $(button).parent().find('.hidden-input').remove();
            }
        }
    }
    
    buttons.extra_fields = function(button)
    {
        var value = $(button).val();
        var form = $('#'+$(button).attr('data-form'));
        var setup_type = 'module';
        if($(button).attr('data-setup-type')) setup_type = $(button).attr('data-setup-type');
        $(button).find('option').each(function(i)
        {
            if($(this).attr('value') === value)
            {
                var text = $(this).html();
                if(value)
                {
                    var component = '';
                    $(button).find('option:nth-child('+(i+1)+')').remove();
                    component+= '<div class="form-group" id="extra-'+value+'">';
                        component+= '<label class="control-label col-sm-3" for="'+value+'">'+text+'</label>';
                        component+= '<div class="col-sm-9">';
                            component+= '<input type="text" data-setup-type="'+setup_type+'" class="form-control" id="'+value+'">';
                        component+= '</div>';
                    component+= '</div>';
                    $(form).prepend(component);
                    $(form).find('#extra-'+value).hide(0);
                    $(form).find('#extra-'+value).show(350);
                }
            }
        });
    }
    
    $($.fn.blockstrap.element).on('click', '#menu-toggle', function(e)
    {
        $.fn.blockstrap.buttons.menu(this);
    });
    $($.fn.blockstrap.element).on('click', '#sidebar-toggle', function(e)
    {
        $.fn.blockstrap.buttons.sidebar(this);
    });
    $($.fn.blockstrap.element).on('change', '.extra-fields', function(e)
    {
        $.fn.blockstrap.buttons.extra_fields(this);
    });
    $($.fn.blockstrap.element).on('click', '.bootstrap-switch-id-auth_salt', function(e)
    {
        $.fn.blockstrap.buttons.auth_salt(this);
    });
    $($.fn.blockstrap.element).on('click', 'label[for="auth_salt"]', function(e)
    {
        var boot_switch = $(this).parent().find('.bootstrap-switch-id-auth_salt');
        if($(boot_switch).hasClass('bootstrap-switch-off')) $(this).parent().find('input.switch').val('true');
        else $(this).parent().find('input.switch').val('false');
    });
    $($.fn.blockstrap.element).on('click', '.bootstrap-switch-id-photo_salt', function(e)
    {
        $.fn.blockstrap.buttons.photo_salt(this);
    });
    
    $($.fn.blockstrap.element).swipe( {
        //Generic swipe handler for all directions
        swipeLeft:function(event, direction, distance, duration, fingerCount) 
        {
            if($($.fn.blockstrap.element).find('#mobile-footer').css('display') === 'block')
            {
                if($($.fn.blockstrap.element).find('#menu-toggle').hasClass('open'))
                {
                    $($.fn.blockstrap.element).find('#menu-toggle').trigger('click');
                }
                else
                {
                    if(!$($.fn.blockstrap.element).find('#sidebar-toggle').hasClass('open'))
                    {
                        $($.fn.blockstrap.element).find('#sidebar-toggle').trigger('click');
                    }
                }
            }
        },
        swipeRight:function(event, direction, distance, duration, fingerCount) 
        {
            if($($.fn.blockstrap.element).find('#mobile-footer').css('display') === 'block')
            {
                if($($.fn.blockstrap.element).find('#sidebar-toggle').hasClass('open'))
                {
                    $($.fn.blockstrap.element).find('#sidebar-toggle').trigger('click');
                }
                else
                {
                    if(!$($.fn.blockstrap.element).find('#menu-toggle').hasClass('open'))
                    {
                        $($.fn.blockstrap.element).find('#menu-toggle').trigger('click');
                    }
                }
            }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
        threshold:100
    });
    
    $(window).resize(function(e)
    {
        var content_height = $('#main-content').height();
        var sidebar_height = $('#sidebar').height();
        var menu_height = $('#navigation').height();
        if($('#sidebar').css('left') === '60px')
        {
            if(content_height > sidebar_height || menu_height > sidebar_height)
            {
                if(content_height > menu_height)
                {
                    $('#sidebar').height(content_height + $('header').height());
                }
                else
                {
                    $('#sidebar').height(menu_height + $('header').height());
                }
            }
        }
        if($('#sidebar').css('left') === '0px' && $('#sidebar-toggle').hasClass('open'))
        {
            $('#navigation').css({'z-index':2});
            $('#sidebar-toggle').removeClass('open');
            $('#main-content, header').css({'margin-left':0, 'left':$('#sidebar').outerWidth(), 'width':'auto'});
        }
        else if($('#navigation').css('padding-top') === '0px')
        {
            $('#navigation').css({'z-index':99999});
            $('#main-content, header').css({'left':$('#sidebar').outerWidth(), 'margin-left':0, 'width': 'auto'});
            $('#menu-toggle').removeClass('open');
        }
        else if(!$('#menu-toggle').hasClass('open'))
        {
            $('#navigation').css({'z-index':2});
            if($('#sidebar').css('left') === '60px')
            {
                if($('#sidebar-toggle').hasClass('open'))
                {
                    $('#main-content, header').css({'left':60});
                }
                else
                {
                    $('#main-content, header').css({'left':0});
                }
            }
            else
            {
                $('#main-content, header').css({'left':$('#sidebar').outerWidth()});
            }
        }
    })
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {buttons:buttons});
})
(jQuery);