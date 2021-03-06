# MOAC_BUSY_DEMO
MOAC一键发链商务DEMO

## 墨客链
[墨客（MOAC)](http://www.moacchina.com/)，起源于世界IT中心硅谷的第三代区块链底层技术平台。
墨客（MOAC）采用双分层结构，是实现分片和异步智能合约调用，唯一同时兼具可扩展性、安全性、去中心化的底层公链。
墨客主网已于2018年4月30日正式上线，开启区块链商业应用新时代。
MOAC上线以后，搭建新的区块链系统可以以**应用链**的形式在墨客链上进行实验验证，无需巨大的额外开销。
本项目即为演示如何轻松一键搭建应用链而生。

### 安装
```javascript
npm install
```
另外windows环境下您可能需要 [Visual C++ 、 Python 2.7](https://github.com/nodejs/node-gyp#on-windows)

### 默认配置
```json
{
      {
    *  "baseaddr": "", // 子链操作账号：进行创建合约，发起交易等基本操作
    *  "privatekey": "", // 操作账号对应keystone密码
      // scs节点
    *  "scs": [
        ""
      ],
    *  "vnodeVia": "", // * 主链vnode收益账号
    *  "vnodeUri": "http://127.0.0.1:8545", // 代理Vnode节点
    *  "vnodeConnectUrl": "127.0.0.1:80062", // vnode提供给子链的调用地址
    *  "minScsRequired": "3", // 子链需要SCS的最小数量，当前需要从如下值中选择：1，3，5，7，默认3
      "rpcLink": "",
    *  "minVnodeDeposit": 1, // 代理Vnode节点的保证金
    *  "minScsDeposit": 1, // 子链矿池的保证金
    *  "microChainDeposit": 1, // 子链合约的gas费
      "addScs": [],
    *  "monitorAddr": "", // * 监听子链的rpc接口
    *  "monitorLink": "127.0.0.1:2345", // 用于监听的子链
    *  "savedAddr": "", // 数据上链地址，定期清理用
    *  "password": "" // 访问密码
    }
}
```
带有 * 的参数行均为默认配置，需要服务启动前完成配置。

### 节点启动
```javascript
// vnode
nohup ./moac-linux-amd64 --testnet --rpc --rpcapi="mc,txpool,chain3,net,SCS" &

// scs
nohup ./scsserver-linux-amd64 --password "123456" &

// monitor
nohup ./scsserver-linux-amd64 --password "123456" --rpcdebug --rpcaddr "0.0.0.0" --rpcport 2345  --rpccorsdomain "*" &
```


### 启动服务
```javascript
nohup forever bin/www &
```


#### SWTC&MOAC开发者社区

项目讨论的QQ群：568285439

Telegram: https://t.me/moacblockchain

提案发起（Submit proposal）： https://github.com/JCCDex/ProjectFundingProposal/issues
