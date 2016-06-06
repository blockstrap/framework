var widget_options = {
    app_id: 'widgets',
    install: true,
    skip_config: true,
    buttons: false,
    modules: ['api', 'accounts', 'data', 'html', 'blockchains', 'widgets'],
    dependencies: ['bootstrap.min', 'crypto', 'sha3', 'bitcoinjs-lib', 'qrcode', 'mustache'],
    styles: false,
    bootstrap: false,
    default_api: 'blockcypher',
    default_key: 'ADD_API_KEY_HERE'
};

var blockstrap_defaults = $.extend({}, blockstrap_options, widget_options);