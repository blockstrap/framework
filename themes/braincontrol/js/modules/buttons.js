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
    var buttons = {};
    
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
                    var component = $.fn.blockstrap.forms.process({
                        objects: [
                            {
                                fields_only: true,
                                fields: [
                                    {
                                        inputs: [
                                            {
                                                id: value,
                                                label: {
                                                    text: text,
                                                    css: 'col-sm-3',
                                                },
                                                type: 'text',
                                                wrapper: {
                                                    css: 'col-sm-9 extra-field-icon'
                                                },
                                                attributes: [
                                                    {
                                                        key: 'data-setup-type',
                                                        value: setup_type
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    });
                    $(button).find('option:nth-child('+(i+1)+')').remove();                    
                    if($(button).attr('data-before'))
                    {
                        var id = $(button).attr('data-before');
                        $(form).find('#'+id).parent().parent().before(component);
                    }
                    else
                    {
                        $(form).prepend(component);
                    }
                    $(form).find('#'+value).parent().hide(0);
                    $(form).find('#'+value).parent().show(350);
                }
            }
        });
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
    
    buttons.new = function()
    {
        
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
    
    buttons.salt_choice = function(button)
    {
        var add_question = $(button).find('input.switch').val();
        if(add_question === true || add_question === 'true')
        {
            $('input#salt_question').attr('data-setup-type', 'module');
        }
        else
        {
            $('input#salt_question').attr('data-setup-type', 'option');
        }
    }
    
    buttons.wallet_choice = function(button)
    {
        var add_question = $(button).find('input.switch').val();
        if(add_question === true || add_question === 'true')
        {
            $('input#wallet_question').attr('data-setup-type', 'wallet');
        }
        else
        {
            $('input#wallet_question').attr('data-setup-type', 'option');
        }
    }
    
    buttons.your_question = function(button)
    {
        var form_id = $(button).parent().find('input.switch').attr('data-form-id');
        var form = $($.fn.blockstrap.element).find('form#'+form_id);
        if($(form).find('.temp-question').length > 0)
        {
            $(form).find('.temp-question').each(function(i)
            {
                $(this).hide(350, function()
                {
                    $(this).remove();
                });
            });
        }
        else
        {
            var question = $.fn.blockstrap.forms.input({
                id: 'salt_question',
                label: {
                    text: 'The Question',
                    css: 'col-sm-3',
                },
                wrapper: {
                    css: 'col-sm-9'
                },
                attributes: [
                    {
                        key: 'data-setup-type',
                        value: 'option'
                    }
                ]
            });
            var answer = $.fn.blockstrap.forms.input({
                id: 'salt_answer',
                type: 'pass',
                label: {
                    text: 'The Answer',
                    css: 'col-sm-3',
                },
                wrapper: {
                    css: 'col-sm-9'
                },
                attributes: [
                    {
                        key: 'data-setup-type',
                        value: 'module'
                    }
                ]
            });
            var answer_repeat = $.fn.blockstrap.forms.input({
                id: 'salt_answer_repeat',
                type: 'pass',
                label: {
                    text: 'Repeat Answer',
                    css: 'col-sm-3',
                },
                css: 'ignore',
                wrapper: {
                    css: 'col-sm-9'
                },
                attributes: [
                    {
                        key: 'data-setup-type',
                        value: 'module'
                    },
                    {
                        key: 'data-repeat-id',
                        value: 'salt_answer'
                    }
                ]
            });
            var choice = $.fn.blockstrap.forms.input({
                id: 'salt_choice',
                type: 'checkbox',
                label: {
                    text: 'Add question to salt too?',
                    css: 'col-sm-6',
                },
                wrapper: {
                    css: 'col-sm-6'
                },
                css: 'switch',
                attributes: [
                    {
                        key: "data-off-color",
                        value: "danger"
                    },
                    {
                        key: "data-on-color",
                        value: "success"
                    },
                    {
                        key: "data-off-text",
                        value: "NO"
                    },
                    {
                        key: "data-on-text",
                        value: "YES"
                    },
                    {
                        key: "data-label-text",
                        value: "SET"
                    },
                    {
                        key: 'data-setup-type',
                        value: 'option'
                    }
                ]
            });
            var html = '<div id="temporary_question">' + question + answer + answer_repeat + choice + '</div>';
            $(form).append(html);
            $(form).find('#temporary_question').hide(0).show(350, function()
            {
                $(this).find('.form-group').each(function(i)
                {
                    $(this).addClass('temp-question');
                });
                var temp_html = $(form).find('#temporary_question').html();
                $(form).find('#temporary_question').after(temp_html);
                $(form).find('#temporary_question').remove();
                $.fn.blockstrap.core.ready();
            });
        }
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
    $($.fn.blockstrap.element).on('click', '.bootstrap-switch-id-photo_salt', function(e)
    {
        $.fn.blockstrap.buttons.photo_salt(this);
    });
    $($.fn.blockstrap.element).on('click', 'label[for="your_question"]', function(e)
    {
        var boot_switch = $(this).parent().find('.bootstrap-switch-id-your_question');
        if($(boot_switch).hasClass('bootstrap-switch-off')) $(this).parent().find('input.switch').val('true');
        else $(this).parent().find('input.switch').val('false');
    });
    $($.fn.blockstrap.element).on('click', '.bootstrap-switch-id-your_question', function(e)
    {
        $.fn.blockstrap.buttons.your_question(this);
    });
    $($.fn.blockstrap.element).on('click', 'label[for="salt_choice"]', function(e)
    {
        var boot_switch = $(this).parent().find('.bootstrap-switch-id-salt_choice');
        if($(boot_switch).hasClass('bootstrap-switch-off')) $(this).parent().find('input.switch').val('true');
        else $(this).parent().find('input.switch').val('false');
    });
    $($.fn.blockstrap.element).on('click', '.bootstrap-switch-id-salt_choice', function(e)
    {
        $.fn.blockstrap.buttons.salt_choice(this);
    });
    $($.fn.blockstrap.element).on('click', 'label[for="wallet_choice"]', function(e)
    {
        var boot_switch = $(this).parent().find('.bootstrap-switch-id-wallet_choice');
        if($(boot_switch).hasClass('bootstrap-switch-off')) $(this).parent().find('input.switch').val('true');
        else $(this).parent().find('input.switch').val('false');
    });
    $($.fn.blockstrap.element).on('click', '.bootstrap-switch-id-wallet_choice', function(e)
    {
        $.fn.blockstrap.buttons.wallet_choice(this);
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