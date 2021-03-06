var path = require('path');
var spawn = require('child_process').spawn;
var dateformat = require('dateformat');
var utils = require('./utils.js');
var fs = require('fs');
var nconf = require('nconf');
var schedule = require('node-schedule');

var baseaddr = utils.nconf.get("baseaddr");
var privatekey = utils.nconf.get("privatekey");

// saveMicroChain();
getSavedMicroChain();
// changejson();
// scheduleCronstyle();

function connectSsh() {
    var filePath = path.resolve(__dirname, "../../logs/");
    var now = new Date();
    var timestampFn = dateformat(now, "yyyy-mm-dd");
    var filename = filePath + "/log." + timestampFn + ".log";
    console.log(filename);
    var tail = spawn('tail', ['-f', '-n 2', filename]);
    tail.stdout.on('data', function (data) {
        var line = data.toString('utf-8');
        console.log(line);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(line);
            }
        });
    })
}

// save MicroChain address to the blockChain.
async function saveMicroChain() {

    // let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contract.json"), 'utf8'));
    nconf.file({ file: path.resolve(__dirname, "../../contract.json") });
    let hash = nconf.get('savedHash');
    let logs;
    if (hash) {
        logs = await getSavedMicroChain(hash);
        //以下为写入数据log
        let log = {
            time: (new Date).getTime(),
            type: "info",
            msg: nconf.get('microChainAddr')
        };
        logs.push(log);
        console.log(logs);
    } else {
        //以下为写入数据log
        logs = [{
            time: (new Date).getTime(),
            type: "info",
            msg: nconf.get('microChainAddr')
        }];
    }

    //转换log数据格式
    let str = JSON.stringify(logs);
    console.log(str);
    let data = Buffer.from(str).toString('hex');
    data = '0x' + data;
    console.log(data);

    let rawTx = {
        to: microChainDeposit = utils.nconf.get("savedAddr"),
        nonce: utils.chain3.toHex(utils.getNonce(baseaddr)),
        gasLimit: utils.chain3.toHex("9000000"),
        gasPrice: utils.chain3.toHex(utils.chain3.mc.gasPrice),
        chainId: utils.chain3.toHex(utils.chain3.version.network),
        data: data
    };

    let signtx = utils.chain3.signTransaction(rawTx, privatekey);
    utils.chain3.mc.sendRawTransaction(signtx, function (err, hash) {
        if (!err) {
            console.log("succeed: ", hash);
            wirteJson("savedHash", hash);
            return hash;
        } else {
            console.log("error:", err);
            console.log('raw tx:', rawTx);
        }
    });
}

// get saved MicroChain address.
async function getSavedMicroChain() {
    // let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contract.json"), 'utf8'));
    nconf.file({ file: path.resolve(__dirname, "../../contract.json") });
    //获取交易信息
    let hash = nconf.get('savedHash');
    return data = await new Promise((resolve, reject) => {
        utils.chain3.mc.getTransaction(hash, function (e, result) {
            if (!e) {
                //console.log(result);
                inputData = result.input;
                res_str = Buffer.from(inputData.replace('0x', ''), 'hex').toString();
                res_json = JSON.parse(res_str);
                console.log(res_json);
                resolve(res_json);
            } else {
                reject(e);
            }
        });
    });
}

function wirteJson(name, value) {
    var contractPath = path.resolve(__dirname, "../../contract.json");
    var config = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    config[name] = value;
    fs.writeFileSync(contractPath, JSON.stringify(config, null, '\t'), 'utf8');
}

async function changejson() {
    var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contract.json"), 'utf8'));
    baseaddr = utils.nconf.get("baseaddr");
    let hash = config['savedHash'];
    let microChainAddr = config['microChainAddr'];
    console.log(microChainAddr);
    if (hash) {
        let logs = await getSavedMicroChain(hash);
        for (var i = 0; i < logs.length; i++) {
            let log = logs[i];
            if (log["addr"] === microChainAddr) {
                logs.splice(i, 1);
                break;
            }
        }
        console.log(logs);
        // reSaveMicroChain(logs);
    }
}


function clearMicroChain() {

    let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contract.json"), 'utf8'));
    let hash = config['savedHash'];
    if (hash) {
        // let logs = await getSavedMicroChain(hash);
        let logs = [{
            type: 'MicroChainAddr',
            addr: '0xee8d88b1a46e67fb2dbcb595f6693df51c2b3b7c',
            time: 1571878882000
        }, {
            type: 'MicroChainAddr',
            addr: '0xee8d88b1a46e67fb2dbcb595f6693df51c2b3b7c',
            time: 1571888964664
        }, {
            type: 'MicroChainAddr',
            addr: '0xee8d88b1a46e67fb2dbcb595f6693df51c2b3b7c',
            time: 1571868082000
        }, {
            type: 'MicroChainAddr',
            addr: '0xee8d88b1a46e67fb2dbcb595f6693df51c2b3b7c',
            time: 1571902500012
        }];
        for (var i = logs.length - 1; i >= 0; i--) {
            let log = logs[i];
            let time = log["time"];
            let now = (new Date).getTime();
            let hours = (now - time) / 3600000;
            console.log(hours);
            if (hours >= 4) {
                logs.splice(i, 1);
            }
        }
        console.log(logs);
        // reSaveMicroChain(logs);
    }
}

function scheduleCronstyle() {
    // 每隔小时执行一次应用链清理
    var rule = new schedule.RecurrenceRule();
    // rule.hour = [0, 4, 8, 12, 16, 20];
    rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    console.log('scheduleCronstyle:start' + new Date().getMinutes());
    schedule.scheduleJob(rule, () => {
        console.log('scheduleCronstyle:' + new Date().getMinutes());
        clearMicroChain();
    });
}