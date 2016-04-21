<?php

$obj = false;
$callb = false;
$callback = '';
$bitcoind = false;
$method = false;
$variables = false;
$rpc_user = false;
$rpc_pw = false;
$rpc_port = false;
$blockchain = false;

$address = false;
$block = false;
$transaction = false;
$transactions = false;
$unspents = false;

function dump($obj)
{
    echo '<pre>';
        print_r($obj);
    echo '</pre>';
}

if(isset($_POST['method']) && $_POST['method']) $method = $_POST['method'];
if(isset($_POST['variables']) && $_POST['variables']) $variables = $_POST['variables'];
if(isset($_POST['rpc_user']) && $_POST['rpc_user']) $rpc_user = $_POST['rpc_user'];
if(isset($_POST['rpc_pw']) && $_POST['rpc_pw']) $rpc_pw = $_POST['rpc_pw'];
if(isset($_POST['rpc_port']) && $_POST['rpc_port']) $rpc_port = $_POST['rpc_port'];

if(isset($_GET['callback']) && $_GET['callback']) $callback = $_GET['callback'];
if(isset($_GET['blockchain']) && $_GET['blockchain']) $blockchain = $_GET['blockchain'];
if(isset($_GET['call']) && $_GET['call']) $call = $_GET['call'];

$results = [
    'data' => [
        'success' => false,
        'results' => false
    ]
];

include('jsonRPCClient.php');

if(
    $call == 'address' 
    || $call == 'block' 
    || $call == 'transaction' 
    || $call == 'transactions' 
    || $call == 'unspents'
){
    $bitcoind = new jsonRPCClient("http://test:temptesting123@localhost:8332/");
    if($call == 'address')
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
            "blockchain" => $blockchain
        ];
        if(isset($_GET['id']) && $_GET['id'])
        {

        }
    }
    else if($call == 'transactions')
    {
        $obj = [
            "blockchain" => $blockchain
        ];
        if(isset($_GET['id']) && $_GET['id'])
        {

        }
    }
    else if($call == 'unspents')
    {
        $obj = [
            "blockchain" => $blockchain
        ];
        if(isset($_GET['id']) && $_GET['id'])
        {

        }
    }
    if($obj)
    {
        $results['data']['success'] = true;
        $results['data']['results'] = $obj;
    }
}

echo $callback.'('.json_encode($results).')';