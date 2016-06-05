var widget_options = {
    id: 'widgets',
    app_id: 'widgets',
    install: false,
    skip_config: true,
    buttons: false,
    modules: false,
    dependencies: false,
    styles: false,
    bootstrap: false,
    default_api: 'blockcypher',
    default_key: 'ADD_API_KEY_HERE'
};

var blockstrap_defaults = $.extend({}, blockstrap_options, widget_options);