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
    var ethereum = {};
    
    $.fn.blockstrap.settings.ethereum = {
        connected: false,
        wei: {
            decimals: 1000000000000000000
        }
    };
    
    if(typeof web3 !== 'undefined') 
    {
        web3 = new Web3(web3.currentProvider);
    } 
    else 
    {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    $.fn.blockstrap.eth = false;
    if(web3.isConnected())
    {
        $.fn.blockstrap.eth = web3;
        $.fn.blockstrap.settings.ethereum.connected = true;
    }
    
    ethereum.render = function(unknown, data)
    {
        var slug = $.fn.blockstrap.core.page();
        if(
            typeof data.navigation != 'undefined'
            && $.isArray(data.navigation)
        ){
            var css = 'btn-page';
            if(slug == 'tokens')
            {
                css = 'btn-page active';
                if(
                    typeof data.modals == 'string'
                ){
                    var ethereum_modals = '<div class="modal fade " id="create-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Create New Tokens</h4></div><div class="modal-body no-footer"><p>TOKEN CREATION FORM</p><div class="row-fluid"></div></div></div></div></div>';
                    ethereum_modals+= '<div class="modal fade " id="watch-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Watch Existing Tokens</h4></div><div class="modal-body no-footer"><p>TOKEN WATCH FORM</p><div class="row-fluid"></div></div></div></div></div>';
                    ethereum_modals+= '<div class="modal fade " id="account-token-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Create New Token Account</h4></div><div class="modal-body no-footer"><p>TOKEN ACCOUNT FORM</p><div class="row-fluid"></div></div></div></div></div>';
                    data.modals+= ethereum_modals;
                }
            }
            data.navigation.push({
                css: css,
                href: '#tokens',
                id: 'tokens',
                text: 'Tokens'
            });
        };
        return data;
    };
    
    ethereum.init = function()
    {
        
    }
    
    ethereum.keys = function(seed, salt)
    {
        var keys = false;
        if(!salt && localStorage.getItem('nw_blockstrap_salt'))
        {
            if(blockstrap_functions.json(localStorage.getItem('nw_blockstrap_salt')))
            {
                salt = JSON.parse(localStorage.getItem('nw_blockstrap_salt'));
            }
        }
        if(seed && salt)
        {
            var eth_wallet = new Wallet(ethUtil.sha3(salt + '_' + seed));
            keys = {
                address: eth_wallet.getAddress().toString('hex'),
                private: eth_wallet.privKey.toString('hex'),
                public: eth_wallet.getPublicKey().toString('hex')
            };
        }
        return keys;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap.plugins, {ethereum:ethereum});
    
    // QUICK FIX FOR NOW - IF ADDING AN ACTION FROM WITHIN A PLUGIN 
    // THAT CALLS THAT SAME PLUGIN - IT MUST BE ADDED AFTER THE MERGE
    $.fn.blockstrap.core.add_action(
        'init', 
        'ethereum_init',
        'plugins.ethereum', 
        'init'
    );
    
    $.fn.blockstrap.core.add_filter('templates_render', 'ethereum_template_render', 'plugins.ethereum', 'render');
})
(jQuery);
