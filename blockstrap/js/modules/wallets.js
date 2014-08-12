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
    // EMPTY OBJECT
    var wallets = {};
    
    // FUNCTIONS FOR OBJECT
    wallets.new = function(currency, name, password, keys, callback)
    {
        console.log('currency', currency);
        console.log('name', name);
        console.log('password', password);
        console.log('keys', keys);
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {wallets:wallets});
})
(jQuery);


