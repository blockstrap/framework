<?php

// DEPENDENCIES
//error_reporting(0);
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
    ],
    "doget" => [
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
    || $call == 'dnkey' 
    || $call == 'dnkeys' 
    || $call == 'op_returns' 
    || $call == 'relay' 
    || $call == 'transaction' 
    || $call == 'transactions' 
    || $call == 'unspents'
){
    // CONNECT TO QT
    $loaded = false;
    $debug = false;
    
    if($blockchain != 'multi')
        {
        try {
            $bitcoind = new jsonRPCClient("http://".$rpc_options[$blockchain]['username'].":".$rpc_options[$blockchain]['password']."@".$rpc_options[$blockchain]['host'].":".$rpc_options[$blockchain]['port']."/");
            if($bitcoind->getinfo())
            {
                $loaded = true;
            }
        } catch (Exception $e) {
            $loaded = false;
        }
    }
    
    if($loaded === true || $blockchain == 'multi')
    {
        if($blockchain != 'multi')
        {
            $bitcoind = new jsonRPCClient("http://".$rpc_options[$blockchain]['username'].":".$rpc_options[$blockchain]['password']."@".$rpc_options[$blockchain]['host'].":".$rpc_options[$blockchain]['port']."/");
            $raw = false;
            if($debug && $bitcoind && $loaded)
            {
                $raw = $bitcoind->getinfo();
            }
        }
        if($call == 'address')
        {
            $obj = [
                "address" => false,
                "blockchain" => $blockchain,
                "hash" => "N/A",
                "tx_count" => 0,
                "received" => 0,
                "balance" => 0,
                "raw" => []
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
                $unspents = $bitcoind->listunspent(1, 9999999, [$obj['address']]);
                if($unspents)
                {
                    if(is_array($unspents) && count($unspents) > 0)
                    {
                        $balance = 0;
                        foreach(array_reverse($unspents) as $tx) 
                        {
                            $balance = $balance + intval($tx['amount'] * 100000000);
                        }
                        $obj['balance'] = $balance;
                    }
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
        else if($call == 'dnkey' || $call == 'dnkeys')
        {
            $obj = [
                "blockchain" => $blockchain,
                "dns" => false,
                "dnkeys" => []
            ];
            if(isset($_GET['id']) && $_GET['id'] && $_GET['id'] != 'false')
            {
                $domain = $_GET['id'];
                $dns = dns_get_record($domain, DNS_TXT);
                $obj['dns'] = $dns;
                foreach($dns as $record)
                {
                    if(isset($record['entries']))
                    {
                        foreach($record['entries'] as $entry)
                        {
                            if(substr($entry, 0, 6) === "dnkey-")
                            {
                                $this_result = substr($entry, 6, strlen($entry));
                                $these_results = explode('=', $this_result);
                                if(isset($obj['dnkeys'][$these_results[0]]))
                                {
                                    $obj['dnkeys'][$these_results[0]][] = $these_results[1];
                                }
                                else
                                {
                                    $obj['dnkeys'][$these_results[0]] = [];
                                    $obj['dnkeys'][$these_results[0]][] = $these_results[1];
                                }
                            }
                        }
                    }
                        
                }
            }
        }
        else if($call == 'op_returns')
        {
            $obj = [
                "blockchain" => $blockchain,
                "addresses" => [],
                "txs" => []
            ];
            if(isset($_GET['id']) && $_GET['id'] && $_GET['id'] != 'false')
            {
                $valid_txs = [];
                $addresses = explode('_', $_GET['id']);
                $to_address = $addresses[0];
                $from_address = $addresses[0];
                $obj['addresses']['to'] = $to_address;
                $obj['addresses']['from'] = $from_address;
                $account_name = 'XXX_'.$to_address;
                $originaL_txs = $bitcoind->listtransactions($account_name, 1000, 0, true);
                if($originaL_txs && is_array($originaL_txs))
                {
                    $txs = array_reverse($originaL_txs);
                    foreach($txs as $key => $tx)
                    {
                        $txs[$key]['tx'] = $bitcoind->gettransaction($tx['txid'], true);
                        foreach($txs[$key]['tx']['details'] as $detail)
                        {
                            if(isset($detail['address']) && $detail['address'] == $obj['addresses']['from'])
                            {
                                if(!isset($valid_txs['TX_'.$tx['time'].'_'.$tx['txid']]))
                                {
                                    $valid_txs['TX_'.$tx['time'].'_'.$tx['txid']] = $bitcoind->getrawtransaction($tx['txid'], 1);
                                    $valid_txs['TX_'.$tx['time'].'_'.$tx['txid']]['details'] = $detail;
                                }
                            }
                        }
                    }
                    $txs = [];
                    foreach($valid_txs as $tx)
                    {
                        $this_tx = [
                            "txid" => $tx['txid'],
                            "data" => "",
                            "pos" => null,
                            "tot" => count($tx['vout'])
                        ];
                        foreach($tx['vout'] as $key => $output)
                        {
                            if($output['value'] <= 0)
                            {
                                $this_tx['data'] = $output['scriptPubKey']['hex'];
                                $this_tx['pos'] = $key;
                            }
                        }
                        foreach($tx['vin'] as $key => $input)
                        {
                            $include_this = false;
                            $extra_info = $bitcoind->gettransaction($input['txid'], true);
                            // CAN NOW USE DETAILS AND CHECK IF ADDRESS IS LINKED !!!
                            foreach($extra_info['details'] as $detail)
                            {
                                if($detail['address'] == $obj['addresses']['from']) $include_this = true;
                            }
                        }
                        if($this_tx['data'] && $include_this === true)
                        {
                            $txs[] = $this_tx;
                        }
                    }
                    $obj['txs'] = $txs;
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
                "fees" => 0,
                "raw" => []
            ];
            if(isset($_GET['id']) && $_GET['id'])
            {
                $txid = $_GET['id'];
                $tx = $bitcoind->gettransaction($txid, true);
                $obj['raw']['tx'] = $tx;
                if($tx)
                {
                    $value = 0;
                    $obj['txid'] = $txid;
                    $raw_tx = $bitcoind->getrawtransaction($txid, 1);
                    $obj['raw']['raw_tx'] = $raw_tx;
                    if(isset($tx['blockhash']) && $tx['blockhash'])
                    {
                        $block = $bitcoind->getblock($tx['blockhash']);
                        $obj['raw']['block'] = $block;
                        if($block && isset($block['height']) && $block['height'])
                        {
                            $obj['block'] = $block['height'];
                        }
                    }
                    if(isset($tx['amount']) && $tx['amount'])
                    {
                        // TODO - Need to know output and input, but cannot do that with looping raw TXs
                        $obj['output'] = intval($tx['amount'] * 100000000);
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
                        $addresses_used_in_outputs = [];
                        if(isset($raw_tx['size']) && $raw_tx['size'])
                        {
                            $obj['size'] = $raw_tx['size'];
                        }
                        if(isset($raw_tx['vout']) && is_array($raw_tx['vout']))
                        {
                            $inner_output_value = 0;
                            foreach($raw_tx['vout'] as $output)
                            {
                                $inner_output_value = $inner_output_value + intval($output['value'] * 100000000);
                            }
                            $obj['output'] = $inner_output_value;
                        }
                        if(isset($raw_tx['vin']) && is_array($raw_tx['vin']))
                        {
                            $inner_input_value = 0;
                            $inputs = $raw_tx['vin'];
                            foreach($inputs as $key => $input)
                            {
                                $tx = $bitcoind->getrawtransaction($input['txid'], 1);
                                foreach($tx['vout'] as $output)
                                {
                                    $inner_input_value = $inner_input_value + intval($output['value'] * 100000000);
                                }
                            }
                            $obj['input'] = $inner_input_value;
                        }
                        $obj['fees'] = $obj['input'] - $obj['output'];
                        $obj['value'] = $obj['output'];
                    }
                }
            }
        }
        else if($call == 'transactions')
        {
            $obj = [
                "blockchain" => $blockchain,
                "txs" => [],
                "raw" => []
            ];
            if(isset($_GET['id']) && $_GET['id'] && $_GET['id'] != 'false')
            {
                $address = $_GET['id'];
                $obj['address'] = $address;
                $account_name = 'XXX_'.$address;
                $originaL_txs = $bitcoind->listtransactions($account_name, 100, 0, true);
                if($originaL_txs && is_array($originaL_txs))
                {
                    $txs = array_reverse($originaL_txs);
                    $obj['raw']['txs'] = $txs;
                    foreach($txs as $tx) 
                    {
                        $value = 0;
                        $details = false;
                        $this_input_value = 0;
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
                            "fees" => 0,
                            "raw" => []
                        ];
                        $this_tx['txid'] = $txid;
                        $raw_tx = $bitcoind->getrawtransaction($txid, 1);
                        $this_tx['raw']['raw_tx'] = $raw_tx;
                        if(isset($tx['blockhash']) && $tx['blockhash'])
                        {
                            $block = $bitcoind->getblock($tx['blockhash']);
                            $this_tx['raw']['block'] = $block;
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
                                $inner_value = 0;
                                $inputs = $raw_tx['vin'];
                                foreach($inputs as $key => $input)
                                {
                                    $txid = $input['txid'];
                                    $this_inner_tx = $bitcoind->gettransaction($txid, true);
                                    if(isset($this_inner_tx['details']) && is_array($this_inner_tx['details']))
                                    {
                                        $sent = false;
                                        $inputs[$key]['details'] = $this_inner_tx['details'];
                                        foreach($this_inner_tx['details'] as $detail)
                                        {   
                                            if(isset($detail['address']) && $detail['address'] && $detail['address'] != $obj['address'] && $detail['category'] == 'receive')
                                            {
                                                $inner_value = $inner_value + intval($detail['amount'] * 100000000);
                                                $sent = true;
                                            }
                                        }
                                        $this_tx['input'] = $inner_value;
                                    }
                                }
                                $this_tx['raw']['inputs'] = $inputs;
                            }
                            if(isset($raw_tx['vout']) && is_array($raw_tx['vout']))
                            {
                                $outputs = $raw_tx['vout'];
                                $inner_value = 0;
                                foreach($outputs as $key => $output)
                                {
                                    $inner_value = $inner_value + intval($output['value'] * 100000000);
                                }
                                $this_tx['output'] = $inner_value;
                                
                                if($this_tx['output'] > $this_tx['input'])
                                {
                                    
                                    
                                    foreach($inputs as $key => $input)
                                    {
                                        $inner_value = 0;
                                        $txid = $input['txid'];
                                        $this_inner_tx = $bitcoind->gettransaction($txid, true);
                                        if(isset($this_inner_tx['details']) && is_array($this_inner_tx['details']))
                                        {
                                            $sent = false;
                                            $inputs[$key]['details'] = $this_inner_tx['details'];
                                            foreach($this_inner_tx['details'] as $detail)
                                            {   
                                                if($detail['address'] == $obj['address'] && $detail['category'] == 'receive')
                                                {
                                                    $inner_value = $inner_value + intval($detail['amount'] * 100000000);
                                                    $sent = true;
                                                }
                                            }
                                            $this_tx['input'] = $inner_value;
                                        }
                                    }
                                    $this_tx['raw']['inputs'] = $inputs;
                                    //$this_tx['fees'] = $this_tx['input'] - $this_tx['output'];
                                    $inner_value = 0;
                                    foreach($outputs as $output)
                                    {
                                        if(
                                            isset($output['scriptPubKey']['addresses']) 
                                            && $output['scriptPubKey']['addresses'][0] != $obj['address']
                                        ){
                                            $inner_value = $inner_value + intval($output['value'] * 100000000);
                                        }
                                    }
                                    $this_tx['value'] = 0 - $inner_value;
                                }
                                $this_tx['fees'] = $this_tx['input'] - $this_tx['output'];
                                $this_tx['raw']['outputs'] = $outputs;
                            }
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
                "txs" => [],
                "raw" => []
            ];
            if(isset($_GET['id']) && $_GET['id'])
            {
                $address = $_GET['id'];
                $obj['address'] = $address;
                $account_name = 'XXX_'.$address;
                $unspents = $bitcoind->listunspent(1, 9999999, [$address]);
                $obj['raw']['unspents'] = $unspents;
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
        else if($call == 'relay')
        {
            $obj = [
                "blockchain" => $blockchain,
                "txid" => false
            ];
            if(isset($_POST['tx']) && $_POST['tx'])
            {
                $raw_tx = $_POST['tx'];
                $tx = $bitcoind->sendrawtransaction($raw_tx);
                $obj['raw'] = $tx;
                if($tx)
                {
                    $obj['txid'] = $tx;
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