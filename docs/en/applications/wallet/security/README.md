## Wallet / Framework Security

#### TL;DR - When in doubt, stick to the testnets!

There are two types of people involved in Bitcoin. There are those that put their life savings into experimental hybrid web-wallets using deterministic means of compounding personal information into encrypted salts used to generate private keys inline without actually storing them anywhere, and those that don't.

_**Don't store any significant value within the Blockstrap Framework example applications, especially whilst we are still in Beta!**_

-----

1. For more information and specifics please visit our [Security Q&A Section](../../../framework/started/security/) for further details.

To understand the implications of using our wallet it is important to know how Blockstrap generates private keys and in what format it stores them, or in our case, does not store them. The Blockstrap framework uses compounding encryption to generate hashes from a series of personal questions, such as (by default) the following minimum requirements; your full name, username, password, date of birth and city of birth, from which it is able to then generate a __device salt__. With each security question a hash is generated and added to the raw string of the next hashed answer to generate a new hash, which goes on and on. This is to prevent random brute force attacks. Additional rounds of optional entropy can be added by (for example) uploading a unique hashed avatar or even creating your own questions and answers. Since the Blockstrap framework is module, the possibilities are endless and need not even remain purely deterministic - as seen with the potentially dangerous yet excessively secure option of taking a photo of yourself, loading it onto your local device and then deleting it. __Use at your own risk!__

At the end of the setup process when your __device salt__ has been generated and stored locally within your browser you may then create new crypto-blockchain accounts that use the salt in conjuction with a new series of compunding encryption to generate individual keys for each blockchain.

__At no point are any private keys ever stored or transmitted to or from the browser.__

However, the down-side to this is that if you loose your device or accidentally clear the localStorage and are then also unable to recreate the exact steps used to initially set-up your wallets, you may __loose access to your coins forever__.

It is possible to backup your device, and or even print QR codes of each individual private key (upon request and the necessary recreation of security steps), so at all times value is stored within these example applications, we would strongly suggest taking the time to back-up as required and even test those backups, just to be safe.

__If in doubt, stick to the testnets!__



---

1. Related Articles
2. [Back to Wallet](../../wallet/)
3. [Installation](../installation/)
4. [Security](../security/)
5. [Accounts](../accounts/)
6. [Contacts](../contacts/)
7. [Table of Contents](../../../)
