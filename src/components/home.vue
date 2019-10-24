<template>
  <div class="home">
    <section class="head_back"></section>
    <section class="head">
      <div class="topImgBox">
        <img src="../images/logo.png" style="height: 150px;display: flex;" />
      </div>
      <div class="topTitleBox">
        <span>墨客应用链一键发链工具</span>
      </div>
    </section>
    <section class="content">
      <el-tabs tab-position="top" @tab-click="handleClick">
        <el-tab-pane label="准备工作说明">
          <div class="content-pane">
            <div class="content-pane-left" style="text-align:left;width:800px">
              <p>
                <b>1.Vnode节点同步</b>
                <br />版本来源:
                <a
                  style="text-decoration: none;color: #419efb;"
                  href="https://github.com/MOACChain/moac-core/releases/"
                >https://github.com/MOACChain/moac-core/releases/</a>
                <br />配置好vnodeconfig.json后，可在测试环境testnet启动节点：
                <br />./moac -testnet -rpcaddr ‘your ip’ -rpcport ‘8545’ -rpc -rpcapi “chain3,mc,net,db,personal,admin,miner,txpool”
                <br />同步需要一段时间
                <br />具体可参照：
                <br />
                <el-link
                  type="primary"
                  href="https://blog.csdn.net/lyq13573221675/article/details/81078424"
                >墨客区块链(MOAC BlockChain) 节点安装教程</el-link>
                <br />
                <br />
                <b>2.SCS节点启动，获取SCS帐号</b>
                <br />配置好userconfig.json后，可启动
                <br />./scsserver –password “123456”
                <br />具体可参照：
                <br />
                <el-link
                  type="primary"
                  href="https://blog.csdn.net/lyq13573221675/article/details/81125954"
                >墨客区块链(MOAC BlockChain) 应用链搭建教程</el-link>
                <br />
              </p>
              <p style="margin-top: 40px;">
                <b>详情参考：</b>
                <br />
                <el-link
                  type="primary"
                  href="https://moacdocs-chn.readthedocs.io/zh_CN/latest/subchain/%E9%83%A8%E7%BD%B2%E5%AD%90%E9%93%BE%E5%89%8D%E7%9A%84%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C.html"
                >部署应用链前的准备工作</el-link>
              </p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="部署应用链出块">
          <el-alert
            v-show="isDeploy"
            class="deployInfo"
            :title="deployTitle"
            :type="deployType"
            center
            :closable="deployColse"
            show-icon
          ></el-alert>
          <div class="content-pane">
            <div class="content-pane-left" style="margin-top: 20px;">
              <el-form
                label-position="left"
                label-width="160px"
                :model="configData"
                ref="configData"
                :rules="rules"
              >
                <el-form-item label="应用链操作账号" prop="baseaddr">
                  <el-input v-model="configData.baseaddr" type="text" placeholder="请输入应用链操作账号"></el-input>
                </el-form-item>
                <el-form-item label="密钥" prop="privatekey">
                  <el-input v-model="configData.privatekey" type="password" placeholder="请输入密钥"></el-input>
                </el-form-item>
                <el-form-item label="所需最小应用链数" prop="minScsRequired">
                  <el-input
                    v-model="configData.minScsRequired"
                    type="number"
                    maxlength="1"
                    @change="getScsNumber"
                    placeholder="请输入最小应用链数，当前允许值：1，3，5，7"
                  ></el-input>
                </el-form-item>
                <el-form-item label="SCS节点" prop="scs">
                  <li
                    v-for="(item,index) of  configData.scs"
                    :key="'scs'+index"
                    style="list-style:none"
                  >
                    <el-input
                      v-model="configData.scs[index]"
                      type="text"
                      style="margin-bottom: 10px;"
                      placeholder="请输入节点地址"
                    ></el-input>
                  </li>
                </el-form-item>
                <el-form-item label="主链vnode收益账号" prop="vnodeVia">
                  <el-input v-model="configData.vnodeVia" type="text" placeholder="请输入主链vnode收益账号"></el-input>
                </el-form-item>
                <el-form-item label="代理vnode节点" prop="vnodeUri">
                  <el-input v-model="configData.vnodeUri" type="text" placeholder="请输入代理vnode节点"></el-input>
                </el-form-item>
                <el-form-item label="应用链调用地址" prop="vnodeConnectUrl">
                  <el-input
                    v-model="configData.vnodeConnectUrl"
                    type="text"
                    placeholder="请输入应用链调用地址"
                  ></el-input>
                </el-form-item>
                <el-form-item label="代理vnode节点保证金" prop="minVnodeDeposit">
                  <el-input
                    v-model="configData.minVnodeDeposit"
                    type="number"
                    placeholder="请输入代理vnode节点保证金"
                  ></el-input>
                </el-form-item>
                <el-form-item label="应用链矿池保证金" prop="minScsDeposit">
                  <el-input
                    v-model="configData.minScsDeposit"
                    type="number"
                    placeholder="请输入应用链矿池保证金"
                  ></el-input>
                </el-form-item>
                <el-form-item label="应用链合约gas费" prop="microChainDeposit">
                  <el-input
                    v-model="configData.microChainDeposit"
                    type="number"
                    placeholder="请输入应用链合约gas费"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="deployAction"
                    class="button"
                    style="margin-left: -160px;"
                    :disabled="deployButton"
                  >一键部署</el-button>
                  <el-button @click="clear" class="button">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="infoboard">
              <el-form :model="contractData" ref="contractData">
                <span>完成部署后应用链合约相关地址</span>
                <el-form-item label="Vnode矿池合约地址">
                  <el-input v-model="contractData.vnodePoolAddr" type="text" readonly></el-input>
                </el-form-item>
                <el-form-item label="应用链矿池地址">
                  <el-input v-model="contractData.scsPoolAddr" type="text" readonly></el-input>
                </el-form-item>
                <el-form-item label="应用链合约地址">
                  <el-input v-model="contractData.microChainAddr" type="text" readonly></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="添加新的Scs节点">
          <el-alert
            v-show="isAdd"
            class="deployInfo"
            :title="addTitle"
            :type="addType"
            center
            :closable="addColse"
            show-icon
          ></el-alert>
          <div class="content-pane">
            <div class="content-pane-left">
              <div id="list">
                <div class="contentList">
                  <div style="float:left;margin:10px;width: 100%;text-align: left;">添加的Scs节点：</div>
                  <li
                    v-for="(item,index) of  addNewScs"
                    :key="'new'+ index"
                    style="list-style:none"
                  >
                    <div style="padding:10px;">
                      <el-input v-model="addNewScs[index]" placeholder="请输入Scs节点地址"></el-input>
                    </div>
                  </li>
                  <div style="float:left;width:100%">
                    <el-button style="float: left;margin: 10px;" @click="addScs">+</el-button>
                    <el-button style="float: left;margin: 10px;" @click="cancelScs">-</el-button>
                  </div>
                </div>
              </div>
              <el-button
                type="primary"
                @click="addScsToConfig"
                class="button"
                :disabled="deployButton"
              >一键添加</el-button>
            </div>
            <div class="infoboard">
              <span>已完成添加的Scs节点</span>
              <div class="infoboard-list">
                <li v-for="(item,index) of addedScs" :key="'new'+ index" style="list-style:none">
                  <div style="padding:10px;">
                    <el-input v-model="addedScs[index]" readonly></el-input>
                  </div>
                </li>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="添加监听应用链节点">
          <el-alert
            v-show="isMonitor"
            class="deployInfo"
            :title="monitorTitle"
            :type="monitorType"
            center
            :closable="monitorColse"
            show-icon
          ></el-alert>
          <div class="content-pane">
            <div class="content-pane-left" style="margin-top: 20px;">
              <el-form
                label-position="left"
                label-width="150px"
                :model="monitor"
                ref="monitor"
                :rules="monitorRules"
              >
                <el-form-item label="监听应用链账号" prop="monitorAddr">
                  <el-input v-model="monitor.monitorAddr" type="text" placeholder="请输入监听应用链账号"></el-input>
                </el-form-item>
                <el-form-item label="监听应用链rpc接口" prop="monitorLink">
                  <el-input v-model="monitor.monitorLink" type="text" placeholder="请输入监听应用链rpc接口"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="addMonitorAddrtoConfig"
                    class="button"
                    style="margin-left: -150px;"
                    :disabled="deployButton"
                  >一键添加</el-button>
                  <el-button @click="clearMoitor" class="button">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关闭应用链">
          <el-alert
            v-show="isCloseA"
            class="deployInfo"
            :title="closeATitle"
            :type="closeAType"
            center
            :closable="closeAColse"
            show-icon
          ></el-alert>
          <div class="content-pane">
            <el-button type="primary" @click="onClose" class="button" :disabled="deployButton">一键关闭</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="应用链浏览器" name="explore">
          <el-row :gutter="5">
            <el-col :span="8" :push="3">
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <span style="color:#409EFF">MicroChain Address：</span>
                <span style="color:#909399">{{contractData.microChainAddr}}</span>
              </div>
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <span style="color:#409EFF">sender：</span>
                <span style="color:#909399">{{sender}}</span>
              </div>
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <span style="color:#409EFF">MicroChain Balance：</span>
                <span style="color:#909399">{{getBalance(contractData.microChainAddr)}}</span>
              </div>
            </el-col>
            <el-col :span="8" :push="4">
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <el-tooltip placement="right" effect="light">
                  <div slot="content">
                    加入一个appChain的最低存款额，以moac为单位，默认为每个appChain 2 moac;
                    <br />如果appChain的要求高于这个限制，那么SCS不会加入；
                  </div>
                  <span style="color:#409EFF">BondLimit：</span>
                </el-tooltip>
                <span style="color:#909399">{{format(BondLimit)}}</span>
              </div>
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <el-tooltip placement="right" effect="light">
                  <div slot="content">
                    应用链出块奖励：
                    <br />每天有86400秒，每10秒出一个块，每天有8640个块
                    <br />BlockReward=0.0005 moac，即每天大概消耗 8640 * 0.0005 =4.32 moac。
                  </div>
                  <span style="color:#409EFF">BlockReward：</span>
                </el-tooltip>

                <span style="color:#909399">{{format(BlockReward)}}</span>
              </div>
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    应用链打包交易奖励：
                    <br />奖励给SCC节点 = TxReward * 打包交易数量
                    <br />假设10TPS，相当于100tx/每个块，则每天消耗： 0.0000001 * 8640 * 100 = 0.0864 moac
                  </div>
                  <span style="color:#409EFF">TxReward：</span>
                </el-tooltip>

                <span style="color:#909399">{{format(TxReward)}}</span>
              </div>
            </el-col>
            <el-col :span="8" :push="1">
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    应用链刷新奖励：
                    <br />奖励vnode节点，每一个SCS节点都会和某一个vnode节点链接
                    <br />假设100个块/flush一次，则每天消耗： 0.01 * 8640 / 100 = 0.864 moac
                  </div>
                  <span style="color:#409EFF">ViaReward：</span>
                </el-tooltip>
                <span style="color:#909399">{{format(ViaReward)}}</span>
              </div>
              <div class="grid-content" style="text-align:left;padding-top:5px;">
                <span style="color:#409EFF">scsCount：</span>
                <span style="color:#909399">{{scsCount.length}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="2">
              <div class="blockHead" style="text-align:left;">
                <span>应用链最新区块信息</span>
                <span
                  style="margin-left:400px;color:#409EFF;font-weight:bold;font-size:25px"
                >{{blockNumber}}</span>
              </div>
              <div v-if="!hasBlock" style="margin-top:20px;font-size:15px;">
                <span>暂未获取出块信息，请稍等。。。</span>
              </div>
              <div v-if="hasBlock" class="box-card" style="overflow:auto">
                <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="isScroll">
                  <div v-for="i in count" :key="i" class="text item">
                    <el-row>
                      <el-col>
                        <div style="text-align:left;">
                          <span style="color:#409EFF">BlockNumber：</span>
                          <span style="color:#909399">{{blocks[i-1].Header.number}}</span>
                        </div>
                        <div style="text-align:left;">
                          <span style="color:#409EFF">Txs：</span>
                          <span style="color:#909399">{{blocks[i-1].Txs.length}}</span>
                        </div>
                        <div style="text-align:left;">
                          <span style="color:#409EFF">Time：</span>
                          <span style="color:#909399">{{formatTime(blocks[i-1].Header.timestamp)}}</span>
                        </div>
                        <div style="text-align:left;">
                          <span style="color:#409EFF">Miner：</span>
                          <span style="color:#909399">{{blocks[i-1].Header.miner}}</span>
                        </div>
                        <div style="text-align:left;">
                          <span style="color:#409EFF">BlockHash：</span>
                          <span style="color:#909399">{{blocks[i-1].Hash}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </ul>
              </div>
            </el-col>
            <el-col :span="6" style="margin-left:250px;">
              <div class="scsHead" style="text-align:left;">
                <span>应用链SCS</span>
              </div>
              <div v-for="i in scsCount.length" :key="i" class="text item">
                <div style="text-align:left;">
                  <span style="color:#409EFF">{{scsCount[i-1]}}</span>
                </div>
                <div style="text-align:left;">
                  <span>{{getBalance(scsCount[i-1])}} Moac</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script>
import { truncate, constants } from "fs";
import { setTimeout } from "timers";
var superagent = require("superagent");
export default {
  name: "home",
  data() {
    var validateScs = (rule, value, callback) => {
      if (value.includes("")) {
        callback(new Error("请填写所有所需应用链"));
      } else {
        callback();
      }
    };
    var validateNumber = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("不可小于零"));
      } else {
        callback();
      }
    };
    var validateDeposit = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("不可小于1"));
      } else {
        callback();
      }
    };
    var validateMin = (rule, value, callback) => {
      let arr = [1, 3, 5, 7];
      if (!arr.includes(Number(value))) {
        callback(new Error("当前需要从如下值中选择：1，3，5，7"));
      } else {
        callback();
      }
    };
    return {
      initConfig: {
        baseaddr: "", // 子链操作账号：进行创建合约，发起交易等基本操作
        privatekey: "", //密钥
        scs: [], // scs节点
        vnodeVia: "", // 主链vnode收益账号
        vnodeUri: "", // 代理Vnode节点
        vnodeConnectUrl: "", // vnode提供给子链的调用地址
        minScsRequired: 3, // 子链需要SCS的最小数量，当前需要从如下值中选择：1，3，5，7
        rpcLink: "",
        minVnodeDeposit: 1, // 代理Vnode节点的保证金
        minScsDeposit: 1, // 子链矿池的保证金
        microChainDeposit: 1, // 子链合约的gas费
        addScs: [], // 需要添加的子链节点
        monitorAddr: "", // 用于监听的子链
        monitorLink: "", // 监听子链的rpc接口
        savedAddr: ""
      },
      configData: {
        baseaddr: "", // 子链操作账号：进行创建合约，发起交易等基本操作
        privatekey: "", //密钥
        scs: [""], // scs节点
        vnodeVia: "", // 主链vnode收益账号
        vnodeUri: "", // 代理Vnode节点
        vnodeConnectUrl: "", // vnode提供给子链的调用地址
        minScsRequired: "", // 子链需要SCS的最小数量，当前需要从如下值中选择：1，3，5，7
        rpcLink: "",
        minVnodeDeposit: "", // 代理Vnode节点的保证金
        minScsDeposit: "", // 子链矿池的保证金
        microChainDeposit: "", // 子链合约的gas费
        addScs: [], // 需要添加的子链节点
        monitorAddr: "", // 用于监听的子链
        monitorLink: "", // 监听子链的rpc接口
        savedAddr: ""
      },
      monitor: {
        monitorAddr: "", // 用于监听的子链
        monitorLink: "" // 监听子链的rpc接口
      },
      addNewScs: [], //需要添加的子链
      addedScs: [], //已完成添加的子链
      rules: {
        baseaddr: [{ required: true, message: "不可为空", trigger: "blur" }],
        privatekey: [{ required: true, message: "不可为空", trigger: "blur" }],
        scs: [
          { required: true, message: "不可为空", trigger: "blur" },
          { validator: validateScs, trigger: "blur" }
        ],
        vnodeVia: [{ required: true, message: "不可为空", trigger: "blur" }],
        vnodeUri: [{ required: true, message: "不可为空", trigger: "blur" }],
        vnodeConnectUrl: [
          { required: true, message: "不可为空", trigger: "blur" }
        ],
        minScsRequired: [
          { required: true, message: "不可为空", trigger: "blur" },
          { validator: validateMin, trigger: "blur" }
        ],
        minVnodeDeposit: [
          { required: true, message: "不可为空", trigger: "blur" },
          { validator: validateDeposit, trigger: "blur" }
        ],
        minScsDeposit: [
          { required: true, message: "不可为空", trigger: "blur" },
          { validator: validateDeposit, trigger: "blur" }
        ],
        microChainDeposit: [
          { required: true, message: "不可为空", trigger: "blur" },
          { validator: validateDeposit, trigger: "blur" }
        ]
      },
      monitorRules: {
        monitorAddr: [{ required: true, message: "不可为空", trigger: "blur" }],
        monitorLink: [{ required: true, message: "不可为空", trigger: "blur" }]
      },
      url: "http://localhost:3000/scss",
      contractData: {
        vnodePoolAddr: "", // Vnode矿池合约地址
        scsPoolAddr: "", // 子链矿池地址
        microChainAddr: "", // 子链合约地址
        savedHash: ""
      },
      isDeploy: false,
      deployTitle: "",
      deployType: "info",
      deployColse: false,
      isAdd: false,
      addTitle: "",
      addType: "info",
      addColse: false,
      isMonitor: false,
      monitorTitle: "",
      monitorType: "info",
      monitorColse: false,
      isCloseA: false,
      closeATitle: "",
      closeAType: "info",
      closeAColse: false,
      deployButton: false,
      sender: "",
      blockNumber: "",
      BondLimit: "",
      BlockReward: "",
      TxReward: "",
      ViaReward: "",
      scsCount: [],
      number: 0,
      count: 0,
      hasBlock: false,
      blocks: []
    };
  },
  computed: {
    isScroll() {
      return this.end === 1;
    }
  },
  created() {
    this.getInitConfig();
    this.getContact();
  },
  methods: {
    getInitConfig() {
      this.$http.get(this.url + "/getInitConfig").then(
        function(res) {
          console.log(res.body);
          this.configData = res.body;
          if (this.configData.scs.length === 0) {
            this.configData.scs = [""];
          }
          this.addedScs = res.body.addScs;
          this.monitor.monitorAddr = res.body.monitorAddr;
          this.monitor.monitorLink = res.body.monitorLink;
        },
        function() {
          console.log("请求失败处理");
        }
      );
    },
    getScsNumber() {
      var length = this.configData.scs.length;
      var number = Number(this.configData.minScsRequired);
      if (number > 0) {
        while (
          this.configData.scs.length !== Number(this.configData.minScsRequired)
        ) {
          if (
            this.configData.scs.length > Number(this.configData.minScsRequired)
          ) {
            this.configData.scs.splice(-1);
          } else if (
            this.configData.scs.length < Number(this.configData.minScsRequired)
          ) {
            this.configData.scs.push("");
          }
        }
      }
    },
    deployAction() {
      this.$refs["configData"].validate(valid => {
        if (valid) {
          if (
            this.contractData.vnodePoolAddr != "" &&
            this.contractData.scsPoolAddr != "" &&
            this.contractData.microChainAddr != ""
          ) {
            this.$confirm(
              "当前部署已完成，继续重新部署会覆盖当前已生成的相关合约地址, 是否继续?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.deployStart();
              })
              .catch(() => {});
          } else {
            this.deployStart();
          }
        }
      });
    },
    async deployStart() {
      this.addData();
      this.$http
        .post(this.url + "/initConfig", this.initConfig, { emulateJSON: false })
        .then(
          function(res) {
            // console.log(res);
            if (res.status === 200) {
              this.isDeploy = true;
              this.deployTitle = "开始部署，此过程需要一段时间，请耐心等待...";
              this.deployColse = false;
              this.deployButton = true;
              this.$http.post(this.url + "/deploy").then(
                function(res) {
                  // console.log(res);
                  var data = JSON.parse(res.bodyText);
                  if (data) {
                    switch (data.status) {
                      case "success":
                        this.isDeploy = true;
                        this.deployType = "success";
                        this.deployTitle = data.msg;
                        this.deployColse = true;
                        this.getContact();
                        this.deployButton = false;
                        break;
                      case "error":
                        this.isDeploy = true;
                        this.deployType = "error";
                        this.deployTitle = data.msg;
                        this.deployColse = true;
                        this.deployButton = false;
                        break;
                    }
                  }
                },
                function(res) {
                  console.log(res.status);
                  this.isDeploy = true;
                  this.deployType = "error";
                  this.deployTitle = "部署失败！";
                  this.deployColse = true;
                  this.deployButton = false;
                }
              );
            }
          },
          function(res) {
            console.log(res.status);
            this.isDeploy = true;
            this.deployType = "error";
            this.deployTitle = "初始化配置失败！";
            this.deployColse = true;
            return false;
          }
        );
    },
    addData() {
      this.initConfig.baseaddr = this.configData.baseaddr;
      this.initConfig.privatekey = this.configData.privatekey;
      this.initConfig.scs = this.configData.scs;
      this.initConfig.vnodeVia = this.configData.vnodeVia;
      this.initConfig.vnodeUri = this.configData.vnodeUri;
      this.initConfig.vnodeConnectUrl = this.configData.vnodeConnectUrl;
      this.initConfig.minScsRequired = this.configData.minScsRequired;
      this.initConfig.minVnodeDeposit = this.configData.minVnodeDeposit;
      this.initConfig.minScsDeposit = this.configData.minScsDeposit;
      this.initConfig.minScsDeposit = this.configData.minScsDeposit;
      this.initConfig.monitorLink = this.configData.monitorLink;
      this.initConfig.monitorAddr = this.configData.monitorAddr;
    },
    addScs() {
      this.addNewScs.push("");
    },
    cancelScs() {
      this.addNewScs.splice(-1);
    },
    addScsToConfig() {
      if (!this.contractData.microChainAddr) {
        this.$message.error("当前还未部署应用链！");
        return;
      }
      this.addData();
      if (!this.addNewScs) {
        this.$message.error("还未添加新的SCS！");
        return;
      }
      this.initConfig.addScs = this.addNewScs;
      this.$http
        .post(this.url + "/initConfig", this.initConfig, { emulateJSON: false })
        .then(
          function(res) {
            console.log(res);
            if (res.status === 200) {
              this.isAdd = true;
              this.addTitle = "开始添加应用链，请稍等!";
              this.addType = "info";
              this.addColse = false;
              this.deployButton = true;
              this.$http.post(this.url + "/addScs").then(
                function(res) {
                  console.log(res);
                  let data = JSON.parse(res.bodyText);
                  if (data) {
                    switch (data.status) {
                      case "success":
                        this.isAdd = true;
                        this.addTitle = data.msg;
                        this.addType = "success";
                        this.addColse = true;
                        this.addedScs = this.addedScs.concat(this.addNewScs);
                        this.addNewScs = [];
                        this.deployButton = false;
                        break;
                      case "error":
                        this.isAdd = true;
                        this.addTitle = data.msg;
                        this.addType = "error";
                        this.addColse = true;
                        this.deployButton = false;
                        break;
                    }
                  }
                },
                function(res) {
                  console.log(res.status);
                  this.isAdd = true;
                  this.addTitle = data.msg;
                  this.addType = "添加应用链失败!";
                  this.addColse = true;
                  this.deployButton = false;
                }
              );
            }
          },
          function(res) {
            console.log(res.status);
            this.isAdd = true;
            this.addTitle = data.msg;
            this.addType = "初始化配置失败！";
            this.addColse = true;
          }
        );
    },
    addMonitorAddrtoConfig() {
      if (!this.contractData.microChainAddr) {
        this.$message.error("当前还未部署应用链！");
        return;
      }
      this.$refs["monitor"].validate(valid => {
        if (valid) {
          this.addData();
          this.initConfig.monitorAddr = this.monitor.monitorAddr;
          this.initConfig.monitorLink = this.monitor.monitorLink;
          this.$http
            .post(this.url + "/initConfig", this.initConfig, {
              emulateJSON: false
            })
            .then(
              function(res) {
                console.log(res);
                if (res.status === 200) {
                  this.isMonitor = true;
                  this.monitorTitle = "开始添加监听应用链，请稍等！";
                  this.monitorType = "info";
                  this.monitorColse = false;
                  this.deployButton = true;
                  this.$http.post(this.url + "/addMonitor").then(
                    function(res) {
                      console.log(res);
                      let data = JSON.parse(res.bodyText);
                      if (data) {
                        switch (data.status) {
                          case "success":
                            this.isMonitor = true;
                            this.monitorTitle = data.msg;
                            this.monitorType = "success";
                            this.monitorColse = true;
                            this.deployButton = false;
                            break;
                          case "error":
                            this.isMonitor = true;
                            this.monitorTitle = data.msg;
                            this.monitorType = "error";
                            this.monitorColse = true;
                            this.deployButton = false;
                            break;
                        }
                      }
                    },
                    function(res) {
                      console.log(res.status);
                      this.isMonitor = true;
                      this.monitorTitle = "添加监听应用链失败!";
                      this.monitorType = "error";
                      this.monitorColse = true;
                      this.deployButton = false;
                    }
                  );
                }
              },
              function(res) {
                console.log(res.status);
                this.isMonitor = true;
                this.monitorTitle = "初始化配置失败!";
                this.monitorType = "error";
                this.monitorColse = true;
              }
            );
        }
      });
    },
    getContact() {
      this.$http.get(this.url + "/getContract").then(
        function(res) {
          if (res.body) {
            this.contractData = res.body;
          } else {
            this.contractData = {
              vnodePoolAddr: "",
              scsPoolAddr: "",
              microChainAddr: "",
              savedHash: ""
            };
          }
        },
        function() {
          console.log("请求失败处理");
          this.isDeploy = true;
          this.deployType = "error";
          this.deployTitle = "获取应用链相关合约地址失败!";
          this.deployColse = true;
        }
      );
    },
    onClose() {
      if (!this.contractData.microChainAddr) {
        this.$message.error("当前还未部署应用链！");
        return;
      }
      this.isCloseA = true;
      this.closeATitle = "正在关闭应用链，请稍等...";
      this.closeAType = "info";
      this.closeAColse = false;
      this.deployButton = true;
      this.$http
        .post(this.url + "/closeMicroChain", this.initConfig, {
          emulateJSON: true
        })
        .then(
          function(res) {
            console.log(res);
            if (res.status === 200) {
              this.isCloseA = true;
              this.closeATitle = "关闭成功!";
              this.closeAType = "success";
              this.closeAColse = true;
              this.deployButton = false;
              this.getContact();
            }
          },
          function(res) {
            console.log(res.status);
            this.isCloseA = true;
            this.closeATitle = "关闭应用链失败!";
            this.closeAType = "error";
            this.closeAColse = true;
            this.deployButton = false;
          }
        );
    },
    clear() {
      this.$refs["configData"].resetFields();
    },
    clearMoitor() {
      this.$refs["monitor"].resetFields();
    },
    async handleClick(tab, event) {
      if (tab.name === "explore") {
        await this.GetSubChainInfo();
        await this.GetBlockNumber();
      }
    },
    async GetBlockNumber() {
      const response = await superagent
        .post("http://" + this.monitor.monitorLink + "/rpc")
        .set("Content-Type", "application/json")
        .accept("application/json")
        .send({
          jsonrpc: "2.0",
          id: 0,
          method: "ScsRPCMethod.GetBlockNumber",
          params: { SubChainAddr: this.contractData.microChainAddr }
        })
        .timeout(10000)
        .catch(e => {
          console.log(e);
        });
      if (response && this.blockNumber != response.body.result) {
        if (response.body.result > 2) {
          this.blockNumber = response.body.result;
          this.hasBlock = true;
          if (this.number === 0) {
            this.number = this.blockNumber;
          }
          this.GetBlock(this.blockNumber);
          // this.load();
        }
      }
    },
    GetBlock(number) {
      superagent
        .post("http://" + this.monitor.monitorLink + "/rpc")
        .set("Content-Type", "application/json")
        .accept("application/json")
        .send({
          jsonrpc: "2.0",
          id: 0,
          method: "ScsRPCMethod.GetBlock",
          params: {
            number: number,
            SubChainAddr: this.contractData.microChainAddr
          }
        })
        .timeout(10000)
        .then(response => {
          if (response.body.result) {
            if (number === this.blockNumber) {
              this.count += 1;
              let tmp = this.blocks;
              this.blocks = [];
              this.blocks.push(response.body.result);
              for (var i = 0; i < tmp.length; i++) {
                this.blocks.push(tmp[i]);
              }
            } else {
              this.count += 1;
              this.blocks.push(response.body.result);
            }
            // console.log(this.blocks);
            // console.log(this.count, this.blocks.length);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    async GetSubChainInfo() {
      superagent
        .post("http://" + this.monitor.monitorLink + "/rpc")
        .set("Content-Type", "application/json")
        .accept("application/json")
        .send({
          jsonrpc: "2.0",
          id: 0,
          method: "ScsRPCMethod.GetSubChainInfo",
          params: { SubChainAddr: this.contractData.microChainAddr }
        })
        .timeout(10000)
        .then(response => {
          if (response.body.result) {
            this.sender = response.body.result.Sender;
            this.BondLimit = response.body.result.BondLimit;
            this.BlockReward = response.body.result.BlockReward;
            this.TxReward = response.body.result.TxReward;
            this.ViaReward = response.body.result.ViaReward;
            this.scsCount = response.body.result.ScsList;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    async GetScsId() {
      const response = await superagent
        .post("http://" + this.monitor.monitorLink + "/rpc")
        .set("Content-Type", "application/json")
        .accept("application/json")
        .send({
          jsonrpc: "2.0",
          id: 0,
          method: "ScsRPCMethod.GetScsId"
        })
        .timeout(10000)
        .catch(e => {
          console.log(e);
        });
    },
    load() {
      this.number = this.number - 1;
      if (this.number > 0) {
        // console.log("number:", this.number);
        this.GetBlock(this.number);
      }
    },
    formatTime(value) {
      let date = new Date(value * 1000);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
    getBalance(address) {
      if (address) {
        let balance = chain3.mc.getBalance(address).toString();
        return chain3.fromSha(balance, "mc");
      }
    },
    format(count) {
      if (count) {
        return chain3.fromSha(count, "mc");
      }
    }
  },
  mounted() {
    this.timer = setInterval(this.GetBlockNumber, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped >
.home {
  display: block;
  height: 100%;
  width: 100%;
  min-width: 1250px;
}
.head_back {
  width: 100%;
  height: 170px;
  background: linear-gradient(180deg, #1384c5, #ffffff);
}
.head {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 180px;
  .topTitleBox {
    float: right;
    width: 400px;
    margin-right: 200px;
    font-size: 30px;
    top: 65px;
    left: 400px;
    position: absolute;
    color: #ffffff;
  }
  .topImgBox {
    margin-left: 60px;
  }
}
.content {
  margin: 20px;
}
.deployInfo {
  position: absolute;
  top: 0px;
  width: 800px;
  right: 0px;
  left: 0px;
  height: 30px;
  margin: 0px auto;
  text-align: center;
  font-weight: bold;
}
.content-pane {
  margin: 20px;
  .content-pane-left {
    width: 600px;
    float: left;
    min-height: 500px;
  }
  .infoboard {
    width: 500px;
    position: absolute;
    top: 40px;
    left: 700px;
    padding: 10px;
    background: #d4ebf6;
    height: 350px;
    .infoboard-list {
      overflow: auto;
      height: 320px;
    }
  }
}
.content-pane-center {
  width: 600px;
  float: center;
  min-height: 500px;
}
.inputarea {
  width: 500px;
}
.step {
  margin-top: 20px;
}
.button {
  width: 200px;
  float: left;
  margin: 10px;
}
.popoverButton {
  border: none;
  color: #ffffff;
  position: absolute;
  top: 10px;
  right: 20px;
  background: none;
  font-size: 20px;
  cursor: pointer;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  background: #f2f6fc;
}
.box-card {
  width: 680px;
  height: 420px;
  margin-top: 10px;
  // margin-left: 160px;
}

.blockHead {
  width: 640px;
  margin-top: 40px;
  margin-left: 40px;
}

.scsHead {
  margin-top: 40px;
  margin-bottom: 30px;
}
</style>
