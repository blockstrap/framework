## Wallet Contacts

Contacts can be accessed from any application that includes the [$.fn.blockstrap.contacts](../../../framework/modules/contacts/) module.

By utilizing this module, the wallet is able to create and manage contacts.

When first creating a new contacts called ___Blockstrap Donations___, information such as the following is added to [localStorage](http://en.wikipedia.org/wiki/Web_storage):

<!--pre-javascript-->
```
{
    id: "blockstrap_donations",
    name: "Blockstrap Donations",
    blockchains: [
        {
            code: "btc",
            blockchain: "Bitcoin",
            addresses: [
                {
                    key: "13uXA8zfLjsnrg69f6FcHVRfwBGobYU3bc"
                }
            ]
        }
    ],
    data: {
        contacts_dnk: false
    },
    tx_to: 0,
    tx_from: 0
}
```
---

Please note that the `id` field is auto-generated base dupon the `name`.

The `blockchain` selection is a parameter of the function and should only allow those supported via configuration. Verified `addresses` can be added to each blockchain. Although the Blockstrap data structure is set-up for multiple addresses within multiple blockchains, the current UX implementation with the default wallet only allows each contact to use a single blockchain / address, unless you are importing contact addresses using the [DNKey](http://dnkey.me) specifications as supported by the Blockstrap API.

The `data` field allows you to assign arbitary information to contacts, such as email addresses or DNKs.

The `tx_to` and `tx_from` fields are not yet supported.


---

1. Related Articles
2. [Back to Wallet](../../wallet/)
3. [Installation](../installation/)
4. [Security](../security/)
5. [Accounts](../accounts/)
6. [Contacts](../contacts/)
7. [Table of Contents](../../../)
