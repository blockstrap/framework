var TX = new function () {

	var inputs = [];
	var outputs = [];
	var eckey = null;
	var balance = 0;

	this.init = function(_eckey) {
		outputs = [];
		inputs = [];
		eckey = _eckey;
	}

	this.addOutput = function(addr, fval) {
		outputs.push({address: addr, value: fval});
	}

	this.getBalance = function() {
		return balance;
	}

	this.getAddress = function() {
		return eckey.getBitcoinAddress().toString();
	}

	this.addInputs = function(input){

		var bal = BigInteger.ZERO;
		var scr = dumpScript( new Bitcoin.Script(Crypto.util.hexToBytes(input.script)));
		var val = new BigInteger('' + Math.round(input.value  * 1e8), 10);
		var txid = reverseHex(input.txid);
		//var txid = input.txid;

		if (!(txid in inputs))
			inputs[txid] = {};

		balance += input.value;
		inputs[txid][input.n] = {'amount': val, 'script': scr};
	}

	this.construct = function() {
		var sendTx = new Bitcoin.Transaction();
		var selectedOuts = [];

		for (var hash in inputs) {
			if (!inputs.hasOwnProperty(hash))
				continue;
			for (var index in inputs[hash]) {
				if (!inputs[hash].hasOwnProperty(index))
					continue;

				var script = parseScript(inputs[hash][index].script);
				var b64hash = Crypto.util.bytesToBase64(Crypto.util.hexToBytes(hash));
				var txin = new Bitcoin.TransactionIn({outpoint: {hash: b64hash, index: index}, script: script, sequence: 4294967295});
				selectedOuts.push(txin);
				sendTx.addInput(txin);
			}
 		}
		
		$.each(outputs,function(i,o){
			var address = outputs[i].address;
			var fval = outputs[i].value;
			var value = new BigInteger('' + Math.round(fval * 1e8), 10);
			sendTx.addOutput(new Bitcoin.Address(address), value);
		});

		var hashType = 1;
		for (var i = 0; i < sendTx.ins.length; i++) {
			var connectedScript = selectedOuts[i].script;
			var hashy = sendTx.hashTransactionForSignature(connectedScript, i, hashType);
			var pubKeyHash = connectedScript.simpleOutHash();
			var signature = eckey.sign(hashy);
			signature.push(parseInt(hashType, 10));
			var pubKey = eckey.getPub();
			var scripty = new Bitcoin.Script();
			scripty.writeBytes(signature);
			scripty.writeBytes(pubKey);
			sendTx.ins[i].script = scripty;
		}
		return sendTx;
	};

	function parseScript(script) {
		var newScript = new Bitcoin.Script();
		var s = script.split(" ");
		for (var i in s) {
			if (Bitcoin.Opcode.map.hasOwnProperty(s[i])){
				newScript.writeOp(Bitcoin.Opcode.map[s[i]]);
			} else {
				if(typeof s[i] != 'function')
				{
					newScript.writeBytes(Crypto.util.hexToBytes(s[i]));
				}
			}
		}
		return newScript;
	}

	function readBuffer(f, size) {
		var res = f.slice(0, size);
		for (var i = 0; i < size; i++) f.shift();
			return res;
	}

	function readString(f) {
		var len = readVarInt(f);
		if (errv(len)) return [];
		return readBuffer(f, len);
	}

	function readVarInt(f) {
		var t = u8(f);
		if (t == 0xfd) return u16(f); else
		if (t == 0xfe) return u32(f); else
		if (t == 0xff) return u64(f); else
		return t;
    	}

	function uint(f, size) {
		if (f.length < size)
			return 0;
		var bytes = f.slice(0, size);
		var pos = 1;
		var n = 0;
		for (var i = 0; i < size; i++) {
			var b = f.shift();
			n += b * pos;
			pos *= 256;
		}
		return size <= 4 ? n : bytes;
	}

	function reverseHex(str) {
		return str.match(/.{1,2}/g).reverse().join("");
	}

	function endian(string) {
		var out = []
		for(var i = string.length; i > 0; i-=2) {
			out.push(string.substring(i-2,i));
		}
		return out.join("");
	}

	function u8(f)  {
		return uint(f,1);
	}

	function u16(f) {
		return uint(f,2);
	}

	function u32(f) {
		return uint(f,4);
	}

	function u64(f) {
		return uint(f,8);
	}

	function errv(val) {
		return (val instanceof BigInteger || val > 0xffff);
	}

	function dumpScript(script) {
		var out = [];
		for (var i = 0; i < script.chunks.length; i++) {
			var chunk = script.chunks[i];
			var op = new Bitcoin.Opcode(chunk);
			typeof chunk == 'number' ?  out.push(op.toString()) : out.push(Crypto.util.bytesToHex(chunk));
		}
		return out.join(' ');
	};
	return this;
};