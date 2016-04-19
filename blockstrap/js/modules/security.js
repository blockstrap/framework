/*
 * 
 *  Blockstrap v0.6.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var security = {};
    
    security.logged_in = function()
    {
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(login_status))
        {
            login_status = $.parseJSON(login_status);
            if(login_status.logged_in && login_status.logged_in === true) return true;
            else return false;
        }
        else
        {
            return true;
        }
    }
    
    security.login = function(username, password, callback)
    {
        var now = new Date().getTime();
        var un = blockstrap_functions.slug(username);
        var salt = localStorage.getItem('nw_blockstrap_salt');
        var pw = CryptoJS.SHA3(password, { outputLength: 512 }).toString();
        var check = localStorage.getItem('nw_keys_your_password');
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(check))
        {
            check = $.parseJSON(check);
        }
        if(!blockstrap_functions.json(login_status))
        {
            if(check === pw)
            {
                login_status = {};
                login_status.username = un;
                login_status.password = pw;
                login_status = JSON.stringify(login_status);
            }
        }
        if(blockstrap_functions.json(login_status))
        {
            login_status = $.parseJSON(login_status);
            if(
                typeof login_status.username == 'undefined'
                && typeof login_status.password == 'undefined'
                && check === pw
            ){
                login_status.username = un;
                login_status.password = pw;
            }
            if(login_status.username === un && login_status.password === pw)
            {
                if(login_status.logged_in !== true)
                {
                    login_status.ts = now;
                    login_status.logged_in = true;
                    localStorage.setItem('nw_blockstrap_login', JSON.stringify(login_status));
                }
                if(callback) callback();
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Invalid Credentials');
            }
        }
        else
        {
            $.fn.blockstrap.core.modal('Error', 'Unacceptable Credentials');
        }
    }
    
    security.logout = function()
    {
        var now = new Date().getTime();
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(!blockstrap_functions.json(login_status))
        {
            login_status = {};
        }
        else
        {
            login_status = $.parseJSON(login_status);
        }
        login_status.ts = now;
        login_status.logged_in = false;
        localStorage.setItem('nw_blockstrap_login', JSON.stringify(login_status));
        location.reload();
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {security:security});
})
(jQuery);


