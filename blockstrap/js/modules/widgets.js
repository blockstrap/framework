/*
 * 
 *  Blockstrap v0.5.0.2
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var widgets = {};    

    widgets.donate = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        var chain = $(button).attr('data-chain');
        var address = $(button).attr('data-address');
        var qr = $(button).attr('data-qr');
        var bip = $(button).attr('data-bip');
        var label = $(button).attr('data-label');
        var amount = parseFloat($(button).attr('data-amount')).toFixed(8);
        var title = 'Error';
        var content = 'Missing required data attributes!';
        if(qr == 'true') qr = true;
        else qr = false;
        if(bip == 'true') bip = true;
        else bip = false;
        if(chain && address)
        {
            var blockchain = bs.settings.blockchains[chain].blockchain;
            title = 'Send ' + blockchain + ' to ' + address;
            if(amount && amount > 0)
            {
                title = 'Send ' + amount + ' ' + blockchain + ' to ' + address;
            }
        }
        if(qr || bip && chain && address)
        {
            if(qr && bip)
            {
                if(chain == 'doget') chain = 'doge';
                else if(chain == 'dasht') chain = 'dash';
                else if(chain == 'btct') chain = 'btc';
                else if(chain == 'ltct') chain = 'ltc';
                var qr = widgets.html('qr', {content:address});
                var bip_chain = bs.settings.blockchains[chain].lib;
                var bip_url = bip_chain + ':' + address +  '';
                if(amount && amount > 0) bip_url+= '?amount=' + amount;
                if(label)
                {
                    if(amount > 0 && label) bip_url+= '&';
                    else bip_url+= '?';
                    bip_url+= 'label='+label;
                }
                var bip = '<a href="'+bip_url+'" class="btn btn-success btn-block">Desktop QT</a>';
                content = qr + '<p class="clearfix"></p>' + bip;
            }
            else if(qr)
            {
                var qr = widgets.html('qr', {content:address});
                content = qr;
            }
            else if(bip)
            {
                var bip = 'And then?';
                content = bip;
            }
        }
        bs.core.modal(title, content);
        if(qr)
        {
            widgets.qr();
        }
    }
    
    widgets.donations = function()
    {
        $('body').on('click', '.btn-donate', function(e)
        {
            widgets.donate(this, e);
        });
        $('.btn-donate').each(function(i)
        {
            var button = this;
            var address = $(button).attr('data-address');
            var chain = $(button).attr('data-chain');
            var group = $(button).attr('data-group');
            var balance = $(button).attr('data-balance');
            var txs = $(button).attr('data-txs');
            var loading = $(button).attr('data-loading');
            var inject = $(button).attr('data-inject');
            if(balance == 'true') balance = true;
            else balance = false;
            if(txs == 'true') txs = true;
            else txs = false;
            if(inject == 'true') inject = true;
            else inject = false;
            if(chain && address)
            {
                if(inject && $('#default-modal').length < 1)
                {
                    var modal = widgets.html('modal');
                    $('body').append(modal);
                }
                if(group)
                {
                    // UPDATE RELEVANT LABELS
                    if(balance || txs)
                    {
                        if(loading)
                        {
                            $('.'+group+'-balance-'+address).addClass('loading').text(loading);
                            $('.'+group+'-txs-'+address).addClass('loading').text(loading);
                        }
                        $.fn.blockstrap.api.address(address, chain, function(results)
                        {
                            if(typeof results.balance != 'undefined' && balance)
                            {
                                $('.'+group+'-balance-'+address).text(parseInt(results.balance / 100000000).toFixed(8));
                            }
                            if(typeof results.tx_count != 'undefined' && txs)
                            {
                                $('.'+group+'-txs-'+address).text(results.tx_count);
                            }
                        });
                    }
                }
            }
        });
    }
    
    widgets.generate = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        bs.core.modal('Success', 'Generate Function');
    }
    
    widgets.generations = function()
    {
        $('body').on('click', '.btn-generate', function(e)
        {
            widgets.generate(this, e);
        });
    }
    
    widgets.html = function(type, options)
    {
        if(type == 'modal')
        {
            var id = 'default-modal';
            if(typeof options.id != 'undefined')
            {
                id = options.id;
            }
            return '<div id="'+id+'" class="modal fade" style="display: none;" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><h4 class="modal-title"></h4></div><div class="modal-body no-footer"></div></div></div></div>';
        }
        if(type == 'qr')
        {
            var content = '';
            if(typeof options.content != 'undefined')
            {
                content = options.content;
            }
            return '<div class="qr-wrapper" data-content="'+content+'"></div>';
        }
    }
    
    widgets.init = function()
    {
        widgets.donations();
        widgets.generations();
        widgets.messaging();
    }
    
    widgets.message = function(button, e)
    {
        e.preventDefault();
        var bs = $.fn.blockstrap;
        bs.core.modal('Success', 'Message Function');
    }
    
    widgets.messaging = function()
    {
        $('body').on('click', '.btn-message', function(e)
        {
            widgets.message(this, e);
        });
    }
    
    widgets.qr = function(obj, content)
    {
        if(obj && contnt)
        {
            if($(obj).find('img').length > 0)
            {
                $(obj).find('img').remove();   
            }
            $(obj).qrcode({
                render: 'image',
                text: content
            });
        }
        else
        {
            $('.qr-wrapper').each(function(i)
            {
                if($(this).find('img').length < 1)
                {
                    $(this).qrcode({
                        render: 'image',
                        text: $(this).attr('data-content')
                    });
                }
            });
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {widgets:widgets});
})
(jQuery);