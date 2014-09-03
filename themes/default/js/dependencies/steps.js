var blockstrap_setup_steps = [
    {
        "avatar": "blockstrap/img/avatar.jpg",
        "name": "Setup Wizard",
        "info": "(Here to help you get started)",
        "help": {
            "title": "SALT GENERATION",
            "body": "<p>The first step in creating your account is generating a salt. Every piece of information you enter is hashed and additionally hashed again with each new field. At the end of the process a salt is generated for your account.</p> <p><b>Once enetered you cannot change these details later.</b></p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "Step 1 of 3",
                    "stacks": [
                        {
                            "class": "progress-bar-success progress-bar-striped active",
                            "value": "33",
                            "text": "33%"
                        }
                    ]
                }
            ]
        },
        "steps": [
            {
                "id": "step1",
                "css": "btn-page active",
                "href": "",
                "text": "SALT GENERATION"
            },
            {
                "id": "step2",
                "css": "btn-page",
                "href": "",
                "text": "ADDITIONAL SECURITY"
            },
            {
                "id": "step3",
                "css": "btn-page",
                "href": "",
                "text": "CREATE ACCOUNT"
            }
        ],
        "actions": [
            {
                "id": "next-step",
                "css": "btn btn-primary pull-right bs-setup",
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
                        "value": 3
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
                            "html": "<b>REMINDER:</b> We do not store or keep a record of your private keys or personal information anywhere. Instead we take these memorable pieces of information and turn them into 'hashes' which we use to create a salt that is stored in your browser. It is through recreating the steps in this process that you generate your salt and access the accounts in your wallet. As we do not keep this information it is important that you remember the details you enter and keep them safe. <b>REMEMBER: If you cannot recreate this process, you will not be able to access the accounts in your wallet. You cannot change this information later.</b>",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default btn-reset-device",
                                    "text": "Reset"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "salt-generation",
                "css": "col-md-6 odd",
                "header": "Your Account Information",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step1-left",
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
                "header": "Authentication Settings",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step1-right",
                            "fields": [
                                {
                                    "inputs": {
                                        "id": "auth_salt",
                                        "css": "switch",
                                        "label": {
                                            "text": "Authenticate Salt Generation",
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
                                },
                                {
                                    "inputs": {
                                        "id": "auth_session",
                                        "css": "switch",
                                        "label": {
                                            "text": "Add Password to Salt",
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
                                },
                                {
                                    "inputs": {
                                        "id": "auth_tx",
                                        "css": "switch",
                                        "label": {
                                            "text": "Authenticate Each Transaction",
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
                                                "key": "checked",
                                                "value": "checked"
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
                                },
                                {
                                    "inputs": {
                                        "id": "auth_settings",
                                        "css": "switch",
                                        "label": {
                                            "text": "Authenticate Settings Page",
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
    },
    {
        "avatar": "blockstrap/img/avatar.jpg",
        "name": "Setup Wizard",
        "info": "(Here to help you)",
        "help": {
            "title": "ADDITIONAL SECURITY",
            "body": "<p>Now you have succesfully generated your salt you can add additional layers of infromation which will be compounded and added to your current salt. Just like before this information isn't stored anywhere, so make sure you record your details in a safe place.</p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "Step 2 of 3",
                    "stacks": [
                        {
                            "class": "progress-bar-success progress-bar-striped active",
                            "value": "66",
                            "text": "66%"
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
                "text": "SALT GENERATION"
            },
            {
                "id": "step2",
                "css": "btn-page active",
                "href": "",
                "text": "ADDITIONAL SECURITY"
            },
            {
                "id": "step3",
                "css": "btn-page",
                "href": "",
                "text": "ACTIVATE ACCOUNT"
            }
        ],
        "actions": [
            {
                "id": "next-step",
                "css": "btn btn-primary pull-right bs-setup",
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
                        "value": 3
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
                            "title": "Extend Your Security Settings",
                            "intro": "Configure your account to include extra security modules (Reccomended)",
                            "html": "Here your device can be configured to include extra security modules. Like before this information is not stored anywhere and must be recreated to access your account. You can also use your account photo as an additional layer of entropy to your salt - as with all other information in this set up process, if you lose your image, you will also lose access to your account.<b>REMEMBER: If you cannot recreate this process, you will not be able to access the accounts in your wallet. You cannot change this information later.</b>",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default btn-reset-device",
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
                "header": "Additional Salt Components",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step2-left",
                            "fields": [
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
                                                "value": "your_id",
                                                "text": "Passport Number"
                                            }
                                        ],
                                        "attributes": [
                                            {
                                                "key": "data-form",
                                                "value": "blockstrap-setup-step2-left"
                                            }
                                        ],
                                        "wrapper": {
                                            "css": "col-sm-9"
                                        }
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
                "header": "Applications Settings",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step2-right",
                            "fields": [
                                {
                                    "selects": {
                                        "id": "api_service",
                                        "label": {
                                            "text": "API Service",
                                            "css": "col-sm-3"
                                        },
                                        "attributes": [
                                            {
                                                "value": "data-setup-type",
                                                "text": "option"
                                            }
                                        ],
                                        "values": [
                                            {
                                                "value": "blockstrap",
                                                "text": "Blockstrap"
                                            },
                                            {
                                                "value": "helloblock",
                                                "text": "Hello Block"
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
                                                "value": "blockstrap-setup-step2-left"
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
            "title": "CHOOSING A PASSWORD",
            "body": "<p><b>TIP:</b>The best passwords are seemigly random characters that are easy to remember. For example, The Quick Brown Fox Jumps Over The Lazy Dog would become TQBFJOTLD</p><p><b>BONUS TIP:</b> Don't actually use TQBFJOTLD as your password.</p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "Step 3 of 3",
                    "stacks": [
                        {
                            "class": "progress-bar-success progress-bar-striped active",
                            "value": "99",
                            "text": "99%"
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
                "text": "SALT GENERATION"
            },
            {
                "id": "step2",
                "css": "btn-page",
                "href": "",
                "text": "ADDITIONAL SECURITY"
            },
            {
                "id": "step3",
                "css": "btn-page active",
                "href": "",
                "text": "CREATE ACCOUNT"
            }
        ],
        "actions": [
            {
                "id": "next-step",
                "css": "btn btn-primary pull-right bs-setup",
                "href": "#",
                "text": "Next Step",
                "attributes": [
                    {
                        "key": "data-forms",
                        "value": "blockstrap-setup-step3-left, blockstrap-setup-step3-right"

                    },
                    {
                        "key": "data-step",
                        "value": 3
                    },
                    {
                        "key": "data-steps",
                        "value": 3
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
                            "title": "Activating Your Account",
                            "intro": "You're almost ready to get started...",
                            "html": "Now you have generated your salt it's time to create your account.",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default btn-reset-device",
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
                "header": "Account Settings",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step3-left",
                            "fields": [
                                {
                                    "selects": {
                                        "id": "wallet_currency",
                                        "css": "bs-currency-select",
                                        "label": {
                                            "text": "Currency",
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
                                        "type": "password",
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
                                        "type": "password",
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
                "header": "Additional Account Options",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step3-right",
                            "fields": [
                                {
                                    "selects": {
                                        "id": "extra_salty_wallet",
                                        "css": "extra-fields",
                                        "label": {
                                            "text": "More Security",
                                            "css": "col-sm-3"
                                        },
                                        "values": [
                                            {
                                                "value": "",
                                                "text": "-- Select Additional Wallet Security --"
                                            },
                                            {
                                                "value": "wallet_pin",
                                                "text": "PIN Number"
                                            }
                                        ],
                                        "attributes": [
                                            {
                                                "key": "data-form",
                                                "value": "blockstrap-setup-step3-right"
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
                                        "type": "password",
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
                                        "type": "password",
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