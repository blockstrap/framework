<?php

// DEPENDENCIES
error_reporting(0);
include('jsonRPCClient.php');

// DEFAULTS
$obj = false;
$call = false;
$callback = '';
$bitcoind = false;
$blockchain = false;

// RPC OPTIONS
// TODO - HIDE THESE
$rpc_options = [
    "btc" => [
        "username" => "test",
        "password" => "temptesting123",
        "host" => "localhost",
        "port" => "8332"
    ],
    "doge" => [
        "username" => "test",
        "password" => "temptesting123",
        "host" => "localhost",
        "port" => "8335"
    ]
];

// PASSED VIA AJAX CALL
if(isset($_GET['callback']) && $_GET['callback']) $callback = $_GET['callback'];
if(isset($_GET['blockchain']) && $_GET['blockchain']) $blockchain = $_GET['blockchain'];
if(isset($_GET['call']) && $_GET['call']) $call = $_GET['call'];

// DEFAULT RESULTS
$results = [
    'data' => [
        'success' => false,
        'results' => false
    ]
];

// CHECK FOR VALID CALL
if(
    $call == 'address' 
    || $call == 'block' 
    || $call == 'transaction' 
    || $call == 'transactions' 
    || $call == 'unspents'
){
    // CONNECT TO QT
    $loaded = false;
    $debug = false;
    
    try {
        $bitcoind = new jsonRPCClient("http://".$rpc_options[$blockchain]['username'].":".$rpc_options[$blockchain]['password']."@".$rpc_options[$blockchain]['host'].":".$rpc_options[$blockchain]['port']."/");
        if($bitcoind->getinfo())
        {
            $loaded = true;
        }
    } catch (Exception $e) {
        $loaded = false;
    }
    
    if($loaded === true)
    {
        $bitcoind = new jsonRPCClient("http://".$rpc_options[$blockchain]['username'].":".$rpc_options[$blockchain]['password']."@".$rpc_options[$blockchain]['host'].":".$rpc_options[$blockchain]['port']."/");
        $raw = false;
        if($debug && $bitcoind && $loaded)
        {
            $raw = $bitcoind->getinfo();
        }
        else if($call == 'address')
        {
            $obj = [
                "address" => false,
                "blockchain" => $blockchain,
                "hash" => "N/A",
                "tx_count" => 0,
                "received" => 0,
                "balance" => 0
            ];
            if(isset($_GET['id']) && $_GET['id'])
            {
                $address = $_GET['id'];
                $obj['address'] = $address;
                $account_name = 'XXX_'.$address;
                $balance = $bitcoind->getbalance($account_name, 1, true);
                $received = $bitcoind->getreceivedbyaccount($account_name, 1);
                $address = $bitcoind->validateaddress($obj['address']);
                $txs = $bitcoind->listtransactions($account_name, 100, 0, true);
                if($balance)
                {
                    $obj['balance'] = intval($balance * 100000000);
                }
                if($received)
                {
                    $obj['received'] = intval($received * 100000000);
                }
                if($txs)
                {
                    $obj['tx_count'] = count($txs);
                }
            }
        }
        else if($call == 'block')
        {
            $obj = [
                "blockchain" => $blockchain,
                "height" => "N/A",
                "hash" => "N/A",
                "prev" => "N/A",
                "next" => "N/A",
                "tx_count" => 0,
                "time" => "N/A"
            ];
            if(isset($_GET['id']) && $_GET['id'])
            {
                $height = intval($_GET['id']);
                $block_hash = $bitcoind->getblockhash($height);
                $block = $bitcoind->getblock($block_hash);
                $obj['raw'] = $block;
                if($block_hash)
                {
                    $obj['height'] = $height;
                    $obj['hash'] = $block_hash;
                }
                if($block)
                {
                    if(isset($block['previousblockhash']) && $block['previousblockhash'])
                    {
                        $obj['prev'] = $block['previousblockhash'];
                    }
                    if(isset($block['nextblockhash']) && $block['nextblockhash'])
                    {
                        $obj['next'] = $block['nextblockhash'];
                    }
                    if(isset($block['tx']) && is_array($block['tx']))
                    {
                        $obj['tx_count'] = count($block['tx']);
                    }
                    if(isset($block['time']) && $block['time'])
                    {
                        $obj['time'] = $block['time'];
                    }
                }
            }
        }
        else if($call == 'transaction')
        {
            $obj = [
                "blockchain" => $blockchain,
                "txid" => "N/A",
                "size" => "N/A",
                "block" => "N/A",
                "time" => "N/A",
                "input" => 0,
                "output" => 0,
                "value" => 0,
                "fees" => 0
            ];
            if(isset($_GET['id']) && $_GET['id'])
            {
                $txid = $_GET['id'];
                $tx = $bitcoind->gettransaction($txid, true);
                if($tx)
                {
                    $obj['txid'] = $txid;
                    $raw_tx = $bitcoind->getrawtransaction($txid, 1);
                    if(isset($tx['blockhash']) && $tx['blockhash'])
                    {
                        $block = $bitcoind->getblock($tx['blockhash']);
                        if($block && isset($block['height']) && $block['height'])
                        {
                            $obj['block'] = $block['height'];
                        }
                    }
                    if(isset($tx['amount']) && $tx['amount'])
                    {
                        // TODO - Need to know output and input, but cannot do that with looping raw TXs
                        $obj['output'] = intval($tx['amount'] * 100000000);
                        $obj['value'] = intval($tx['amount'] * 100000000);
                    }
                    if(isset($tx['blocktime']) && $tx['blocktime'])
                    {
                        $obj['time'] = $tx['blocktime'];
                    }
                    else if(isset($tx['time']) && $tx['time'])
                    {
                        $obj['time'] = $tx['time'];
                    }
                    if($raw_tx)
                    {
                        if(isset($raw_tx['size']) && $raw_tx['size'])
                        {
                            $obj['size'] = $raw_tx['size'];
                        }
                        if(isset($raw_tx['vin']) && is_array($raw_tx['vin']))
                        {
                            $inputs = $raw_tx['vin'];
                        }
                        if(isset($raw_tx['vout']) && is_array($raw_tx['vout']))
                        {
                            $outputs = $raw_tx['vout'];
                        }
                        $obj['raw'] = $raw_tx;
                    }
                }
            }
        }
        else if($call == 'transactions')
        {
            $obj = [
                "blockchain" => $blockchain,
                "txs" => []
            ];
            if(isset($_GET['id']) && $_GET['id'])
            {
                $address = $_GET['id'];
                $obj['address'] = $address;
                $account_name = 'XXX_'.$address;
                $txs = $bitcoind->listtransactions($account_name, 100, 0, true);
                $obj['raw'] = $txs;
                if($txs && is_array($txs))
                {
                    foreach(array_reverse($txs) as $tx) 
                    {
                        $txid = $tx['txid'];
                        $this_tx = [
                            "blockchain" => $blockchain,
                            "txid" => "N/A",
                            "size" => "N/A",
                            "block" => "N/A",
                            "time" => "N/A",
                            "input" => 0,
                            "output" => 0,
                            "value" => 0,
                            "fees" => 0
                        ];
                        $this_tx['txid'] = $txid;
                        $raw_tx = $bitcoind->getrawtransaction($txid, 1);
                        if(isset($tx['blockhash']) && $tx['blockhash'])
                        {
                            $block = $bitcoind->getblock($tx['blockhash']);
                            if($block && isset($block['height']) && $block['height'])
                            {
                                $this_tx['block'] = $block['height'];
                            }
                        }
                        if(isset($tx['amount']) && $tx['amount'])
                        {
                            // TODO - Need to know output and input, but cannot do that with looping raw TXs
                            $this_tx['output'] = intval($tx['amount'] * 100000000);
                            $this_tx['value'] = intval($tx['amount'] * 100000000);
                        }
                        if(isset($tx['blocktime']) && $tx['blocktime'])
                        {
                            $this_tx['time'] = $tx['blocktime'];
                        }
                        else if(isset($tx['time']) && $tx['time'])
                        {
                            $this_tx['time'] = $tx['time'];
                        }
                        if($raw_tx)
                        {
                            if(isset($raw_tx['size']) && $raw_tx['size'])
                            {
                                $this_tx['size'] = $raw_tx['size'];
                            }
                            if(isset($raw_tx['vin']) && is_array($raw_tx['vin']))
                            {
                                $inputs = $raw_tx['vin'];
                            }
                            if(isset($raw_tx['vout']) && is_array($raw_tx['vout']))
                            {
                                $outputs = $raw_tx['vout'];
                            }
                            $this_tx['raw'] = $raw_tx;
                        }
                        $obj['txs'][] = $this_tx;
                    }
                }
            }
        }
        else if($call == 'unspents')
        {
            $obj = [
                "blockchain" => $blockchain,
                "txs" => []
            ];
            if(isset($_GET['id']) && $_GET['id'])
            {
                $address = $_GET['id'];
                $obj['address'] = $address;
                $account_name = 'XXX_'.$address;
                $unspents = $bitcoind->listunspent(1, 9999999, [$address]);
                if($unspents)
                {
                    if(is_array($unspents) && count($unspents) > 0)
                    {
                        foreach(array_reverse($unspents) as $tx) 
                        {
                            if(isset($tx['txid']) && $tx['txid'])
                            {
                                $this_tx = [
                                    "blockchain" => $blockchain,
                                    "txid" => $tx['txid'],
                                    "confirmations" => 0,
                                    "index" => 0,
                                    "value" => 0,
                                    "script" => "N/A"
                                ];
                                if(isset($tx['confirmations']) && $tx['confirmations'])
                                {
                                    $this_tx['confirmations'] = $tx['confirmations'];
                                }
                                if(isset($tx['vout']) && $tx['vout'])
                                {
                                    $this_tx['index'] = $tx['vout'];
                                }
                                if(isset($tx['amount']) && $tx['amount'])
                                {
                                    $this_tx['value'] = intval($tx['amount'] * 100000000);
                                }
                                if(isset($tx['scriptPubKey']) && $tx['scriptPubKey'])
                                {
                                    $this_tx['script'] = $tx['scriptPubKey'];
                                }
                                $obj['txs'][] = $this_tx;
                            }
                        }
                    }
                }
            }
        }
    }
    if($obj)
    {
        $results['data']['success'] = true;
        $results['data']['results'] = $obj;
    }
    else if($debug && $raw)
    {
        $results = $raw;
    }
}

// USE JSONP CALLBACK
echo $callback.'('.json_encode($results).')';