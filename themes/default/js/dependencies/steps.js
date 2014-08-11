var blockstrap_setup_steps = [
    {
        "avatar": "blockstrap/img/avatar.jpg",
        "name": "Huxley The Wizard",
        "info": "( huxley stardust is here to help you )",
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
                "css": "btn-page",
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
                            "title": "Welcome to Blockstrap",
                            "intro": "This device is compatible and ready to be used.",
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
                "id": "salt-generation",
                "css": "col-md-6 odd",
                "header": "Determenistic Key-Salt Generation",
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
        "name": "Huxley The Wizard",
        "info": "( huxley stardust is here to help you )",
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
                "text": "Salt Check"
            },
            {
                "id": "step2",
                "css": "btn-page active",
                "href": "",
                "text": "Additional Entropy"
            },
            {
                "id": "step3",
                "css": "btn-page",
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
                            "title": "Additionsl Entropy",
                            "intro": "Now on Step 2 of 3",
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
                "header": "Additional Salt Modules",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step2-left",
                            "fields": [
                                {
                                    "selects": {
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
        "name": "Huxley The Wizard",
        "info": "( huxley stardust is here to help you )",
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
                        "value": "blockstrap-setup-step2-left, blockstrap-setup-step2-right"

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
                            "id": "blockstrap-setup-step2-left",
                            "fields": [
                                {
                                    "selects": {
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
                "header": "Additional Wallet Options",
                "body": {
                    "func": "bootstrap",
                    "type": "forms",
                    "objects": [
                        {
                            "id": "blockstrap-setup-step2-right",
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