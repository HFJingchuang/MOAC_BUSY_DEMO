# MOAC_BUSY_DEMO
MOAC一键发链商务DEMO

### 安装
```javascript
npm install
```
另外windows环境下您可能需要 [Visual C++ 、 Python 2.7](https://github.com/nodejs/node-gyp#on-windows)

### 默认配置
```json
{
      {
    *  "baseaddr": "0x7a2dc129b3d794e4e8a009c83ffd7a2412f5e326", // 子链操作账号：进行创建合约，发起交易等基本操作
    *  "privatekey": "86736091a441dffeb8656e731474433aaf531c4adab0497fa38d36215f44f18d", // 操作账号对应keystone密码
      // scs节点
    *  "scs": [
        ""
      ],
    *  "vnodeVia": "0x668F273aF881d2eb13736425a0d72921fdA7e52D", // * 主链vnode收益账号
    *  "vnodeUri": "http://127.0.0.1:8545", // 代理Vnode节点
    *  "vnodeConnectUrl": "127.0.0.1:80062", // vnode提供给子链的调用地址
    *  "minScsRequired": "1", // 子链需要SCS的最小数量，当前需要从如下值中选择：1，3，5，7，默认1
      "rpcLink": "",
    *  "minVnodeDeposit": 1, // 代理Vnode节点的保证金
    *  "minScsDeposit": 1, // 子链矿池的保证金
    *  "microChainDeposit": 1, // 子链合约的gas费
      "addScs": [],
    *  "monitorAddr": "", // * 监听子链的rpc接口
    *  "monitorLink": "127.0.0.1:2345", // 用于监听的子链
    *  "savedAddr": "0x7a2dc129b3d794e4e8a009c83ffd7a2412f5e330", // 数据上链地址，定期清理用
    *  "password": "moac123" // 访问密码
    }
}
```
带有 * 的列均为默认配置，需要服务启动前完成配置。

### 启动服务
```javascript
npm run start
```
