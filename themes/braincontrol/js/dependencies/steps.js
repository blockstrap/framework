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
                "text": "STEP 1: SALT GENERATION"
            },
            {
                "id": "step2",
                "css": "btn-page",
                "href": "",
                "text": "STEP 2: CREATE ACCOUNT"
            },
            {
                "id": "docs",
                "css": "",
                "href": "https://github.com/blockstrap/framework/tree/master/docs/en/",
                "text": "Help"
            }
        ],
        "actions": [
            {
                "id": "next-step",
                "css": "btn btn-primary pull-right btn-setup",
                "href": "#",
                "text": "Next Step",
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
                        "value": 2
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
                            "html": "<b>REMINDER:</b> We do not store or keep a record of your private keys or personal information anywhere. Instead we take these memorable pieces of information and turn them into 'hashes' which we use to create a salt that is stored in your browser. It is through recreating the steps in this process that you generate your salt and access the accounts in your wallet. As we do not keep this information it is important that you remember the details you enter and keep them safe. <b>REMEMBER: If you cannot recreate this process, you will not be able to access the accounts in your wallet. You cannot change this information later.</b><hr /><b>Please take extra special care if adding an image to the device salt. While this can make your account extremely secure and impossible to breach - especially if you take a unique photo that has not been shared anywhere - you must realise that loosing access to that photo would also mean the potential loss of all accounts created with this device. Should you use an image, we strongly recommend you backup your device salt once it has been generated.</b>",
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
                "header": "Required Salt Components",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step1-left",
                            "fields": [
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
                                },
                                {
                                    "dobs": {
                                        "id": "your_dob",
                                        "label": {
                                            "text": "Date of Birth",
                                            "css": "col-sm-3"
                                        },
                                        "placeholder": "",
                                        "value": "",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "day": {
                                            "text": "Day",
                                            "css": "col-sm-4"
                                        },
                                        "month": {
                                            "text": "Month",
                                            "css": "col-sm-4"
                                        },
                                        "year": {
                                            "text": "Year",
                                            "css": "col-sm-4"
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
                                        "id": "your_city",
                                        "label": {
                                            "text": "City of Birth",
                                            "css": "col-sm-3"
                                        },
                                        "type": "text",
                                        "placeholder": "It is easier to remember your real city of birth",
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
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "auth-settinga",
                "css": "col-md-6 even",
                "header": "Optional Security & Settings",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step1-right",
                            "fields": [
                                {
                                    "inputs": {
                                        "id": "app_url",
                                        "label": {
                                            "text": "App URL",
                                            "css": "col-sm-3"
                                        },
                                        "type": "text",
                                        "placeholder": "",
                                        "value": "{{urls.root}}",
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
                                    "selects": {
                                        "id": "extra_salty",
                                        "css": "extra-fields",
                                        "label": {
                                            "text": "Salt Component",
                                            "css": "col-sm-3"
                                        },
                                        "values": [
                                            {
                                                "value": "",
                                                "text": "-- Select Additional Salt Components --"
                                            },
                                            {
                                                "value": "your_email",
                                                "text": "Your Email"
                                            },
                                            {
                                                "value": "your_tel",
                                                "text": "Your Telephone"
                                            },
                                            {
                                                "value": "your_pin",
                                                "text": "PIN Number"
                                            }
                                        ],
                                        "attributes": [
                                            {
                                                "key": "data-form",
                                                "value": "blockstrap-setup-step1-right"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        }
                                    }
                                },
                                {
                                    "selects": {
                                        "id": "api_service",
                                        "label": {
                                            "text": "API Service",
                                            "css": "col-sm-3"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "option"
                                            }
                                        ],
                                        "values": [
                                            {
                                                "value": "blockstrap",
                                                "text": "Blockstrap"
                                            },
                                            {
                                                "value": "blockcypher",
                                                "text": "BlockCypher"
                                            },
                                            {
                                                "value": "blocktrail",
                                                "text": "Blocktrail"
                                            },
                                            {
                                                "value": "toshi",
                                                "text": "Toshi"
                                            },
                                            {
                                                "value": "qt",
                                                "text": "Local QTs"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        }
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "your_photo",
                                        "label": {
                                            "text": "Profile Photo",
                                            "css": "col-sm-3"
                                        },
                                        "type": "file",
                                        "css": "filestyle",
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "option"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        }
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "photo_salt",
                                        "css": "switch",
                                        "label": {
                                            "text": "Add Photo to Salt?",
                                            "css": "col-sm-6"
                                        },
                                        "type": "checkbox",
                                        "attributes": [
                                            {
                                                "key": "data-off-color",
                                                "value": "danger"
                                            },
                                            {
                                                "key": "data-on-color",
                                                "value": "success"
                                            },
                                            {
                                                "key": "data-off-text",
                                                "value": "NO"
                                            },
                                            {
                                                "key": "data-on-text",
                                                "value": "YES"
                                            },
                                            {
                                                "key": "data-label-text",
                                                "value": "SET"
                                            },
                                            {
                                                "key": "data-setup-type",
                                                "value": "option"
                                            },
                                            {
                                                "key": "data-input",
                                                "value": "your_photo"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-6"
                                        }
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "your_question",
                                        "css": "switch",
                                        "label": {
                                            "text": "Create custom question for salt?",
                                            "css": "col-sm-6"
                                        },
                                        "type": "checkbox",
                                        "attributes": [
                                            {
                                                "key": "data-off-color",
                                                "value": "danger"
                                            },
                                            {
                                                "key": "data-on-color",
                                                "value": "success"
                                            },
                                            {
                                                "key": "data-off-text",
                                                "value": "NO"
                                            },
                                            {
                                                "key": "data-on-text",
                                                "value": "YES"
                                            },
                                            {
                                                "key": "data-label-text",
                                                "value": "SET"
                                            },
                                            {
                                                "key": "data-setup-type",
                                                "value": "option"
                                            },
                                            {
                                                "key": "data-form-id",
                                                "value": "blockstrap-setup-step1-right"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-6"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    },
    {
        "avatar": "blockstrap/img/avatar.jpg",
        "name": "Setup Wizard",
        "info": "(Here to help you )",
        "help": {
            "title": "ACCOUNT CREATION",
            "body": "<p>Please note that we use compounding encryption to generate the necessary seeds used for each individual account created. The element you choose to include gets hashed (along with the device salt) and then re-hashed again. Only publicly available information related to this account is stored, and is strictly within the browser you are currently using.</p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "Step 2 of 2",
                    "stacks": [
                        {
                            "class": "progress-bar-success progress-bar-striped active",
                            "value": "80",
                            "text": "80%"
                        }
                    ]
                }
            ]
        },
        "steps": [
            {
                "id": "step1",
                "css": "btn-page",
                "href": "",
                "text": "STEP 1: SALT GENERATION"
            },
            {
                "id": "step2",
                "css": "btn-page active current",
                "href": "",
                "text": "STEP 2: CREATE ACCOUNT"
            },
            {
                "id": "docs",
                "css": "",
                "href": "https://github.com/blockstrap/framework/tree/master/docs/en/",
                "text": "Help"
            }
        ],
        "actions": [
            {
                "id": "next-step",
                "css": "btn btn-primary pull-right btn-setup",
                "href": "#",
                "text": "Next Step",
                "attributes": [
                    {
                        "key": "data-forms",
                        "value": "blockstrap-setup-step2-left, blockstrap-setup-step2-right"

                    },
                    {
                        "key": "data-step",
                        "value": 2
                    },
                    {
                        "key": "data-steps",
                        "value": 2
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
                            "title": "Creating Your First Account",
                            "intro": "You're almost ready to get started...",
                            "html": "Now that you have generated your device salt it's time to create your first account.",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default btn-reset",
                                    "text": "Reset"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "additional-modules",
                "css": "col-md-6 odd",
                "header": "Required Account Information",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step2-left",
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
            },
            {
                "id": "application-settings",
                "css": "col-md-6 even",
                "header": "Optional Account Security",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step2-right",
                            "fields": [
                                {
                                    "selects": {
                                        "id": "extra_salty_wallet",
                                        "css": "extra-fields",
                                        "label": {
                                            "text": "More",
                                            "css": "col-sm-3"
                                        },
                                        "values": [
                                            {
                                                "value": "",
                                                "text": "-- Select Additional Wallet Security --"
                                            },
                                            {
                                                "value": "wallet_email",
                                                "text": "Email Address"
                                            },
                                            {
                                                "value": "wallet_tel",
                                                "text": "Telephone Number"
                                            },
                                            {
                                                "value": "wallet_pin",
                                                "text": "PIN Number"
                                            }
                                        ],
                                        "attributes": [
                                            {
                                                "key": "data-form",
                                                "value": "blockstrap-setup-step2-right"
                                            },
                                            {
                                                "key": "data-setup-type",
                                                "value": "wallet"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        }
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "wallet_question",
                                        "label": {
                                            "text": "Custom Question",
                                            "css": "col-sm-3"
                                        },
                                        "placeholder": "This is entirely optional",
                                        "type": "text",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "attributes": [
                                            {
                                                "key": "data-setup-type",
                                                "value": "option"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "wallet_answer",
                                        "label": {
                                            "text": "Answer",
                                            "css": "col-sm-3"
                                        },
                                        "placeholder": "Enter the answer to your custom question",
                                        "type": "pass",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "css": "optional",
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
                                        "id": "wallet_answer_repeat",
                                        "label": {
                                            "text": "Repeat",
                                            "css": "col-sm-3"
                                        },
                                        "placeholder": "Better to be safe than sorry",
                                        "type": "pass",
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        },
                                        "css": "ignore",
                                        "attributes": [
                                            {
                                                "key": "data-repeat-id",
                                                "value": "wallet_answer"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "inputs": {
                                        "id": "wallet_choice",
                                        "css": "switch",
                                        "label": {
                                            "text": "Add question to Salt?",
                                            "css": "col-sm-6"
                                        },
                                        "type": "checkbox",
                                        "attributes": [
                                            {
                                                "key": "data-off-color",
                                                "value": "danger"
                                            },
                                            {
                                                "key": "data-on-color",
                                                "value": "success"
                                            },
                                            {
                                                "key": "data-off-text",
                                                "value": "NO"
                                            },
                                            {
                                                "key": "data-on-text",
                                                "value": "YES"
                                            },
                                            {
                                                "key": "data-label-text",
                                                "value": "SET"
                                            },
                                            {
                                                "key": "data-setup-type",
                                                "value": "option"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-6"
                                        }
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