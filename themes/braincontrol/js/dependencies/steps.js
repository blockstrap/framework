var blockstrap_setup_steps = [
    {
        "avatar": "blockstrap/img/avatar.jpg",
        "name": "Setup Wizard",
        "info": "(Here to help you get started)",
        "help": {
            "title": "SALT GENERATION",
            "body": "<p>Before we create any addresses we first need to establish a device salt. Each piece of information you enter is hashed and re-hashed before ever leaving the browser. We never see any of your details from the resulting hashes. At the end of the process a device salt is generated that we can use to more securely create new accounts.</p><p><b>Once entering these details you cannot change them later or recover them without recreating this process with the exact same data.</b></p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "Level of Entropy",
                    "stacks": [
                        {
                            "class": "progress-bar-success progress-bar-striped active",
                            "value": "3",
                            "text": "3%"
                        }
                    ]
                }
            ]
        },
        "steps": [
            {
                "id": "step1",
                "css": "btn-page active current",
                "href": "",
                "text": "CREATE ACCOUNT"
            },
            {
                "id": "docs",
                "css": "",
                "href": "https://github.com/blockstrap/framework/tree/master/docs/en/",
                "text": "GET HELP"
            }
        ],
        "actions": [
            {
                "id": "next-step",
                "css": "btn btn-primary pull-right btn-setup",
                "href": "#",
                "text": "CREATE ACCOUNT",
                "attributes": [
                    {
                        "key": "data-forms",
                        "value": "blockstrap-setup-step1-left, blockstrap-setup-step1-right"

                    },
                    {
                        "key": "data-step",
                        "value": 1
                    },
                    {
                        "key": "data-steps",
                        "value": 1
                    }
                ]
            }
        ],
        "panels": [
            {
                "id": "welcome-message",
                "css": "col-md-12 ribbon",
                "body": {
                    "func": "bootstrap",
                    "type": "jumbotrons",
                    "objects": [
                        {
                            "title": "Generating Your Device Salt",
                            "intro": "This is a one time installation process. Please read the instructions carefully...",
                            "html": "<b>REMINDER:</b> We do not store or keep a record of your private keys or any of your personal information. Instead we take these memorable pieces of information and turn them into hashes, which we use to create a device salt that is stored within your browser and used to create more secure wallet accounts. <b>Failure to recreate these same steps could result in loose of coins...</b>",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default btn-reset",
                                    "text": "Reset"
                                },
                                {
                                    "href": "#",
                                    "css": "btn-primary btn-import",
                                    "text": "Import"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "salt-generation",
                "css": "col-md-6 odd",
                "header": "User Account Details",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step1-left",
                            "fields": [
                                {
                                    "inputs": {
                                        "id": "app_salt",
                                        "value": "{{salt}}",
                                        "label": {
                                            "text": "App Salt",
                                            "css": "hidden"
                                        },
                                        "css": "hidden",
                                        "wrapper": {
                                            "css": "col-sm-9 hidden"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "module"
                                            },
                                            {
                                                "key": "read-only",
                                                "value": "true"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "your_name",
                                        "label": {
                                            "text": "Your Name",
                                            "css": "col-sm-3"
                                        },
                                        "type": "text",
                                        "placeholder": "Using your actual name is easier to remember",
                                        "value": "",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "module"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "your_username",
                                        "label": {
                                            "text": "Your Username",
                                            "css": "col-sm-3"
                                        },
                                        "type": "text",
                                        "placeholder": "Pick a simple yet memorable username",
                                        "value": "",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "module"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "your_password",
                                        "label": {
                                            "text": "Your Password",
                                            "css": "col-sm-3"
                                        },
                                        "type": "pass",
                                        "placeholder": "This cannot be changed later",
                                        "value": "",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "module"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "your_password_repeat",
                                        "label": {
                                            "text": "Repeat Password",
                                            "css": "col-sm-3"
                                        },
                                        "type": "pass",
                                        "placeholder": "Confirm your password again",
                                        "value": "",
                                        "css": "ignore",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "module"
                                            },
                                            {
                                                "key": "data-repeat-id",
                                                "value": "your_password"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "additional-modules",
                "css": "col-md-6 odd",
                "header": "Setup First Wallet Account",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step1-right",
                            "fields": [
                                {
                                    "selects": {
                                        "id": "wallet_blockchain",
                                        "css": "bs-blockchain-select hd prepend",
                                        "label": {
                                            "text": "Blockchain",
                                            "css": "col-sm-3"
                                        },
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "wallet"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "wallet_name",
                                        "label": {
                                            "text": "Name / Label",
                                            "css": "col-sm-3"
                                        },
                                        "placeholder": "You will need to remember these if recreating them later",
                                        "type": "text",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "wallet"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "wallet_password",
                                        "label": {
                                            "text": "Password",
                                            "css": "col-sm-3"
                                        },
                                        "placeholder": "This should be unique to this individual wallet",
                                        "type": "pass",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "wallet"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "wallet_password_repeat",
                                        "label": {
                                            "text": "Repeat Password",
                                            "css": "col-sm-3"
                                        },
                                        "placeholder": "Please enter your password again",
                                        "type": "pass",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "css": "ignore",
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "wallet"
                                            },
                                            {
                                                "key": "data-repeat-id",
                                                "value": "wallet_password"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    }
]