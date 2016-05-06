## Blockstrap Accounts <a name="docs_home"></a>

Accounts can be accessed from any application that includes the [$.fn.blockstrap.accounts](../../../framework/modules/accounts/) module.

By utilizing this module, the wallet is able to create and manage accounts.

When first creating a new ___Bitcoin___ account called ___My Wallet___, information such as the following is added to [localStorage](http://en.wikipedia.org/wiki/Web_storage):

<!--pre-javascript-->
```
{
    id: "my_wallet",
    name: "My Wallet",
    blockchain: {
        type: "Bitcoin",
        code: "btc"
    },
    keys: ["wallet_blockchain", "wallet_name", "wallet_password"],
    address: "1AVYBJcRuYPRSXBqqd1nj8nSpCyxYKUezV",
    tx_count: 0,
    balance: 0,
    ts: 1411946986223,
    password: "39e7a72e09cd4191a17a099caf8a010e02210892dca234f7e15d0db368591b528c09d17605dca4d6a200c83005a64b0e30c36dcee6bdae326d941794866404f1"
}
```
---

Please note that the `id` field is auto-generated from the `name`.

The `blockchain` selection is a parameter of the function and should only allow those supported via configuration.

The `keys` field is an array of the components used to generate the key-pair. A salted hash of each of these and their hidden values are added to the hash of the next. We store what was used so we know what to ask for when needed.

We only store the public key, as seen in the `address` field.

The `ts` field represents the time the account was created (and is later updated).

We store a salted hash of the `password` as this allows us to verify against it for simple UX functionality such as removing or editing the account on the device.

At the point of creation and (or) depending on `cache` [configuration](../../../framework/core/configuration/) settings, the [$.fn.blockstrap.api](../../../framework/modules/api/) module will fetch additional informating pertaining to the balance and transaction count of each account.

If the new transaction account is higher than the currently saved count, it will then make another API call and collect and store additional transaction information, such as:

<!--pre-javascript-->
```
{
    "id": "my_wallet",
    "blockchain": {
        "type": "Bitcoin",
        "code": "btc"
    },
    "name": "My First Wallet",
    "password": "39e7a72e09cd4191a17a099caf8a010e02210892dca234f7e15d0db368591b528c09d17605dca4d6a200c83005a64b0e30c36dcee6bdae326d941794866404f1",
    "keys": ["wallet_blockchain", "wallet_name", "wallet_password"],
    "address": "1AVYBJcRuYPRSXBqqd1nj8nSpCyxYKUezV",
    "tx_count": 7,
    "balance": 260000,
    "ts": 1411946986223,
    "txs": {
        "txid_51bda8d2268beae1b5e8d60850df9d6ef3ff3d012413e81f48d50cc34a98deee": {
            "blockchain": "btc",
            "txid": "51bda8d2268beae1b5e8d60850df9d6ef3ff3d012413e81f48d50cc34a98deee",
            "size": 226,
            "block": 322972,
            "time": 1411946137,
            "input": 2125000,
            "output": 2115000,
            "value": 200000,
            "fees": 10000
        },
        "txid_2f231b7f41cee3f40b4a4de30d52b9ef28028529fd10986f2666cc8641dbbfab": {
            "blockchain": "btc",
            "txid": "2f231b7f41cee3f40b4a4de30d52b9ef28028529fd10986f2666cc8641dbbfab",
            "size": 373,
            "block": 322972,
            "time": 1411946137,
            "input": 1072901,
            "output": 1062901,
            "value": 10000,
            "fees": 10000
        },
        "txid_baff4c9adb96029216b0d88259491b502d9ec63bff23a70feaa99aa28a5487ff": {
            "blockchain": "btc",
            "txid": "baff4c9adb96029216b0d88259491b502d9ec63bff23a70feaa99aa28a5487ff",
            "size": 226,
            "block": 322976,
            "time": 1411947003,
            "input": 1052901,
            "output": 1042901,
            "value": 10000,
            "fees": 10000
        }, // AND SO ON AND SO FORTH
    }
}
```
<small><a href="#docs_home">- back to top</a></small>

Please see the [`$.fn.blockstrap.accounts`](../../../framework/modules/accounts/) documentation for more information.

---

1. Related Articles
2. [Back to Wallet](../../wallet/)
3. [Installation](../installation/)
4. [Security](../security/)
5. [Accounts](../accounts/)
6. [Contacts](../contacts/)
7. [Table of Contents](../../../)
