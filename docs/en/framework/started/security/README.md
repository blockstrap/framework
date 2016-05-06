Security Q&A <a name="docs_home"></a>
=====================================

We will attempt to address some common questions and concerns regarding our determenistic by default nature.

* [01. What does deterministic by default mean?](#qa_01)
* [02. What are device salts?](#qa_02)
* [03. What happens if I loose or fail to correctly re-create my salt?](#qa_03)
* [04. But is it safe?](#qa_04)
* [05. What is compounding encryption?](#qa_05)

------------------------------------------------------------------------
### 01. What does determenistic by default mean? <a name="qa_01"></a>

Instead of relying and in-turn being controlled by the [pseudorandomness](http://en.wikipedia.org/wiki/Pseudorandomness) of machines, where the storage of generated [private keys](http://en.wikipedia.org/wiki/Public-key_cryptography) is then required, we use [deterministic algorithms](http://en.wikipedia.org/wiki/Deterministic_algorithm) to generate the keys at the moment they are needed - nullifying their need to be stored anywhere. This allows [core](../../core/) to run entirely in JavaScript from the browser, without the need for a file-storage service, instead relying on [localStorage](http://en.wikipedia.org/wiki/Web_storage) which is merely used to store the publicly available information. Private information is never stored anywhere.

<small><a href="#docs_home">- back to top</a></small>

------------------------------------------------------
### 02. What are device salts? <a name="qa_02"></a>

By default, the [installation of the wallet](../../../applications/wallet/installation/) guides new users through the process of deterministically generating a device salt. Blockstrap then uses compounding encryption through a modular method from within the browser that allows each application developer to deploy systems of varying levels of security dependent on their project needs or application environment. By default, we then use the salt to generate secure deterministic private keys that are not stored anywhere but can be easily recrerated inline at the moment they are required.

<small><a href="#docs_home">- back to top</a></small>

-------------------------------------------------------------------------------------------
### 03. What happens if I loose or fail to correctly re-create my salt? <a name="qa_03"></a>

If you loose your device or the browser cache is refreshed, there is always the possibility you could re-create the salt, but if you are unable to remember the details that you used to create the salt, you will probably never be able to re-cover or re-use the accounts created with that salt. If you did not make a back-up of the private keys, you may have lost everything, which is why it is very important you understand the risks.

<small><a href="#docs_home">- back to top</a></small>

-----------------------------------------------
### 04. But is it safe? <a name="qa_04"></a>

It is as safe as you make it. Different use cases often require different forms of solutions. The most important question is really who has access to your [private keys](http://en.wikipedia.org/wiki/Public-key_cryptography)? In the case of many web-based services, the service provider is often in control of the private keys. In the case of most software solutions, the keys are usually stored on the corresponding device. Both scenarios involve your private keys being located in a single physical location and if you are lucky, will also be properly encrypted with a password. Blockstrap does not store private keys anywhere. They are created with compounding encryption using a device salt that prevents random brute force leaving you just as susceptible to theft as your bank account or other personal accounts. If you are prone to forgetting passwords or are unable or unwilling to manage the recovery functionmality yourself, you may be best with another service. However, please remember that if anyone is ever able to recover the keys for you it means that you do not really control the keys to start with.

<small><a href="#docs_home">- back to top</a></small>


---------------------------------------------------------------
### 05. What is compounding encryption? <a name="qa_05"></a>

With each security question the hash is added to the raw string of the next to generate a new hash that is compounded and combined with the previous. At the end of the process your device salt is finally generated, and parts of it are stored on your device.

<small><a href="#docs_home">- back to top</a></small>

---

1. Related Articles
2. [Return to Getting Started](../../started/)
3. [Minimum Requirements](../requirements/)
4. [Download](../download/)
5. [Security Q&A](../security/)
6. [Table of Contents](../../../)
