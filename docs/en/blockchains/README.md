## The Blockchains

The blockchains as a whole needs to be introduced.

Also an excuse to link to the [blockchains explorer](http://blockchains.io).

The blockchains currently parsed include:

* [Bitcoin](bitcoin/)
* [Litecoin](litecoin/)
* [Dogecoin](dogecoin/)
* [Testnets](testnets/)

The [`$.fn.blockstrap.blockchains`](../framework/modules/blockchains/) module utilizes the following magic numbers.

It does this via a modified version of BitcoinJS-Lib with the following `networks.js` settings:

<!--pre-javascript-->
```
var networks = {
    bitcoin: {
        magicPrefix: "Bitcoin Signed Message:\n",
        bip32: {
            "public": 76067358,
            "private": 76066276
        },
        pubKeyHash: 0,
        scriptHash: 5,
        wif: 128,
        dustThreshold: 546,
        feePerKb: 1e4,
        estimateFee: estimateFee("bitcoin")
    },
    bitcointestnet: {
        magicPrefix: "Bitcoin Signed Message:\n",
        bip32: {
            "public": 70617039,
            "private": 70615956
        },
        pubKeyHash: 111,
        scriptHash: 196,
        wif: 239,
        dustThreshold: 546,
        feePerKb: 1e4,
        estimateFee: estimateFee("bitcointestnet")
    },
    dogecoin: {
        magicPrefix: "Dogecoin Signed Message:\n",
        bip32: {
            "public": 49990397,
            "private": 49988504
        },
        pubKeyHash: 30,
        scriptHash: 22,
        wif: 158,
        dustThreshold: 0,
        dustSoftThreshold: 1e8,
        feePerKb: 1e8,
        estimateFee: estimateFee("dogecoin")
    },
    dogecointestnet: {
        magicPrefix: "Dogecoin Signed Message:\n",
        bip32: {
            "public": 49990397,
            "private": 49988504
        },
        pubKeyHash: 113,
        scriptHash: 196,
        wif: 241,
        dustThreshold: 0,
        dustSoftThreshold: 1e8,
        feePerKb: 1e8,
        estimateFee: estimateFee("dogecointestnet")
    },
    litecoin: {
        magicPrefix: "Litecoin Signed Message:\n",
        bip32: {
            "public": 27108450,
            "private": 27106558
        },
        pubKeyHash: 48,
        scriptHash: 5,
        wif: 176,
        dustThreshold: 0,
        dustSoftThreshold: 1e5,
        feePerKb: 1e5,
        estimateFee: estimateFee("litecoin")
    },
    litecointestnet: {
        magicPrefix: "Litecoin Signed Message:\n",
        bip32: {
            "public": 27108450,
            "private": 27106558
        },
        pubKeyHash: 111,
        scriptHash: 196,
        wif: 239,
        dustThreshold: 0,
        dustSoftThreshold: 1e5,
        feePerKb: 1e5,
        estimateFee: estimateFee("litecointestnet")
    },
    viacoin: {
        magicPrefix: "Viacoin Signed Message:\n",
        bip32: {
            "public": 76067358,
            "private": 76066276
        },
        pubKeyHash: 71,
        scriptHash: 33,
        wif: 199,
        dustThreshold: 560,
        dustSoftThreshold: 1e5,
        feePerKb: 1e5,
        estimateFee: estimateFee("viacoin")
    },
    viacointestnet: {
        magicPrefix: "Viacoin Signed Message:\n",
        bip32: {
            "public": 70617039,
            "private": 70615956
        },
        pubKeyHash: 127,
        scriptHash: 196,
        wif: 255,
        dustThreshold: 560,
        dustSoftThreshold: 1e5,
        feePerKb: 1e5,
        estimateFee: estimateFee("viacointestnet")
    },
    zetacoin: {
        magicPrefix: "Zetacoin Signed Message:\n",
        bip32: {
            "public": 76067358,
            "private": 76066276
        },
        pubKeyHash: 80,
        scriptHash: 9,
        wif: 224,
        dustThreshold: 546,
        feePerKb: 1e4,
        estimateFee: estimateFee("zetacoin")
    }
};
```

---

1. Related Articles
2. [Bitcoin](bitcoin/)
3. [Litecoin](litecoin/)
4. [Dogecoin](dogecoin/)
5. [Testnets](testnets/)
6. [Table of Contents](../)