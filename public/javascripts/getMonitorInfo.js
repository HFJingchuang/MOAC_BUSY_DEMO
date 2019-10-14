var superagent = require('superagent')
var path = require('path');
var nconf = require('nconf');
// const ws = require('./wss').ws

nconf.file({ file: path.resolve(__dirname, "../../contract.json") });
var microChainAddr = nconf.get("data")[2]['microChainAddr'];

nconf.file({ file: path.resolve(__dirname, "../../initConfig.json") });
var monitorLink = nconf.get("monitorLink");
var url = 'http://' + monitorLink + '/rpc';

GetBlockNumber();
GetBlock(10);
GetSubChainInfo();

/**
 * 获得当前应用链的区块高度
 */
async function GetBlockNumber() {
    const response = await superagent.post(url)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .send({
            "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetBlockNumber",
            "params": { "SubChainAddr": microChainAddr }
        }).
        timeout(10000).catch(e => {
            console.log(e)
        });
    console.log(response.body);
    return response.body.result;
}

/**
 * 获得当前应用链的指定的区块信息
 */
async function GetBlock(number) {
    const response = await superagent.post(url)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .send({
            "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetBlock",
            "params": { "number": number, "SubChainAddr": microChainAddr }
        }).
        timeout(10000).catch(e => {
            console.log(e)
        });
    console.log(response.body);
    return response.body.result;
}

/**
 * 获得当前应用链的信息
 */
async function GetSubChainInfo() {
    const response = await superagent.post(url)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .send({
            "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetSubChainInfo",
            "params": { "SubChainAddr": microChainAddr }
        }).
        timeout(10000).catch(e => {
            console.log(e)
        });
    console.log(response.body);
    return response.body.result;
}