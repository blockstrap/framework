var blockstrap_setup_steps = [
    {
        "avatar": "blockstrap/img/avatar.jpg",
        "name": "Setup Wizard",
        "info": "(Here to help you get started)",
        "help": {
            "title": "SALT GENERATION",
            "body": "<p>A salt is an extra layer of encryption that makes hashing passwords more secure. A salt is added to make an already difficult combination more difficult. A salt value is generated entirely at random and lowers the possibility of someone discovering your hash.</p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "10% complete (1 of 3)",
                    "stacks": [
                        {
                            "class": "progress-bar-success progress-bar-striped active",
                            "value": "20",
                            "text": "10%"
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
                "text": "STEP ONE"
            },
            {
                "id": "step2",
                "css": "btn-page",
                "href": "",
                "text": "STEP TWO"
            },
            {
                "id": "step3",
                "css": "btn-page",
                "href": "",
                "text": "ACTIVATE"
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
                            "intro": "This is a one time installation process. Please read the instructions carefully.",
                            "html": "<b>REMINDER:</b> We do not store or keep a record of your private keys or personal information anywhere. Instead we take these memorable pieces of information and turn them into 'hashes' which we use to create a device Salt that is stored in your browser. It is through reacreating the steps in this process that you generate your Salt and access your wallet. As we do not keep this information it is important that you remember the details you enter and keep them safe. <b>REMEMBER: If you cannot recreate this process, you cannot access your wallet.</b>",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default",
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
                                        "placeholder": "If you use your real name you might remember it",
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
                                            "text": "Authenticate Each Session",
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
            "body": "If you wish you can configure your wallet to include extra security infromation. Just like before this information isn't stored anywhere, so make sure you record this information in a safe place.</p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "40% complete (2 of 3)",
                    "stacks": [
                        {
                            "class": "progress-bar-success progress-bar-striped active",
                            "value": "40",
                            "text": "40%"
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
                "text": "STEP ONE"
            },
            {
                "id": "step2",
                "css": "btn-page active",
                "href": "",
                "text": "STEP TWO"
            },
            {
                "id": "step3",
                "css": "btn-page",
                "href": "",
                "text": "ACTIVATE"
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
                            "intro": "Configure your wallet to include extra security modules (Reccomended)",
                            "html": "<b>REMINDER:</b> We do not store or keep a record of your private keys or personal information anywhere. Instead we take these memorable pieces of information and turn them into 'hashes' which we use to create a device Salt that is stored in your browser. It is through reacreating the steps in this process that you generate your Salt and access your wallet. As we do not keep this information it is important that you remember the details you enter and keep them safe. <b>REMEMBER: If you cannot recreate this process, you cannot access your wallet.</b>",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default",
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
            "title": "What is a Salt...?",
            "body": "<p>Not entirely sure exactly what to say here but do know that Johnny has some work to do throughout to help make it pukka!</p><p>Not entirely sure exactly what to say here but do know that Johnny has some work to do throughout to help make it pukka!</p>"
        },
        "progress": {
            "func": "bootstrap",
            "type": "bars",
            "objects": [
                {
                    "id": "",
                    "after": "40% complete (3 of 3)",
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
                "text": "Salt Check"
            },
            {
                "id": "step2",
                "css": "btn-page",
                "href": "",
                "text": "Additional Entropy"
            },
            {
                "id": "step3",
                "css": "btn-page active",
                "href": "",
                "text": "First Wallet"
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
                            "title": "Generating Wallets",
                            "intro": "Now on Step 3 of 3",
                            "html": "Not sure what to put here yet... Any ideas are much appreciated...?.",
                            "buttons": [
                                {
                                    "href": "#",
                                    "css": "btn-default",
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
                "header": "Wallet Requirements",
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
                                                "key": "data-setup-type",
                                                "value": "wallet"
                                            },
                                            {
                                                "key": "data-pw-id",
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
                "header": "Additional Wallet Options",
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
                                        "placeholder": "This should be unique to this individual wallet",
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
                                        "id": "wallet_choice",
                                        "css": "switch",
                                        "label": {
                                            "text": "Add question to salt too?",
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