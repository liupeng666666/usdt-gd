function GetRequest() {
    var url = location.search; // 获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var level = GetRequest().level;

function zhanshi() {
    $("#userGuide").removeClass("active");
    $("#followStrategy").removeClass("active");
    $("#commProblem").removeClass("active");
    $("#currencyDetails").removeClass("active");
    $("#" + level).addClass("active");
    $("#z_" + level).parent().find('li').removeClass("active");
    $("#z_" + level).addClass("active");
}

zhanshi();

var json_url = {
    usdt: ["https://tether.to/",
        "https://github.com/OmniLayer/omnicore",
        "https://omniexplorer.info/",
        "https://tether.to/",
        "https://tether.to/",
        "https://tether.to/",
        "https://gateio.io/trade/usdt_eth",
        "https://tether.to/",
        "https://github.com/OmniLayer/omnicore",
        "https://omniexplorer.info/",
        "https://tether.to/",
        "https://tether.to/"
    ],
    btc: [
        "https://bitcoin.org/en/download",
        "https://github.com/bitcoin/bitcoin",
        "https://www.blockchain.com/btc/tx/%7Bvalue%7D",
        "https://bitcoin.org/en/",
        "https://bitcointalk.org/",
        "https://en.bitcoin.it/wiki/Comparison_of_mining_pools",
        "https://gateio.io/trade/btc_usdt",
        "https://bitcoin.org/en/download",
        "https://github.com/bitcoin/bitcoin",
        "https://www.blockchain.com/btc/tx/%7Bvalue%7D",
        "https://bitcoin.org/en/",
        "https://bitcointalk.org/"
    ],
    bch: ["https://www.bitcoincash.org/",
        "https://github.com/Bitcoin-ABC/bitcoin-abc",
        "https://blockchair.com/",
        "https://www.bitcoincash.org/",
        "https://www.bitcoincash.org/",
        "https://www.bitcoincash.org/",
        "https://gateio.io/trade/bch_usdt",
        "https://www.bitcoincash.org/",
        "https://github.com/Bitcoin-ABC/bitcoin-abc",
        "https://blockchair.com/",
        "https://www.bitcoincash.org/",
        "https://www.bitcoincash.org/"
    ],
    btg: ["https://bitcoingold.org/",
        "https://github.com/BTCGPU/BTCGPU",
        "https://bitcoingold.org/",
        "https://bitcoingold.org/",
        "https://bitcoingold.org/",
        "https://bitcoingold.org/",
        "https://gateio.io/trade/btg_usdt",
        "https://bitcoingold.org/",
        "https://github.com/BTCGPU/BTCGPU",
        "https://bitcoingold.org/",
        "https://bitcoingold.org/",
        "https://bitcoingold.org/"
    ],
    ltc: ["https://litecoin.org/zh_HANS",
        "https://github.com/litecoin-project",
        "http://explorer.litecoin.net/",
        "https://litecoin.org/",
        "https://forum.litecoin.net/",
        "http://litecoin.info/Mining_Pool_Comparison",
        "https://gateio.io/trade/ltc_usdt",
        "https://litecoin.org/zh_HANS",
        "https://github.com/litecoin-project",
        "http://explorer.litecoin.net/",
        "https://litecoin.org/",
        "https://forum.litecoin.net/"
    ],
    zec: ["https://z.cash/",
        "https://github.com/Electric-Coin-Company/dev-ci-zcash",
        "https://explorer.zcha.in/",
        "https://z.cash/",
        "https://forum.zcashcommunity.com/",
        "https://z.cash/",
        "https://gateio.io/trade/zec_usdt",
        "https://z.cash/",
        "https://github.com/Electric-Coin-Company/dev-ci-zcash",
        "https://explorer.zcha.in/",
        "https://z.cash/",
        "https://forum.zcashcommunity.com/"
    ],
    eth: ["https://www.ethereum.org/cli",
        "https://github.com/ethereum/",
        "https://etherscan.io/",
        "https://www.ethereum.org/",
        "https://forum.ethereum.org/",
        "https://www.ethereum.org/",
        "https://gateio.io/trade/eth_usdt",
        "https://www.ethereum.org/cli",
        "https://github.com/ethereum/",
        "https://etherscan.io/",
        "https://www.ethereum.org/",
        "https://forum.ethereum.org/"
    ],
    neo: ["https://neo.org/download",
        "https://github.com/neo-project",
        "https://neotracker.io/",
        "https://neo.org/",
        "https://www.reddit.com/r/NEO/",
        "https://neo.org/",
        "https://gateio.io/trade/neo_usdt",
        "https://neo.org/download",
        "https://github.com/neo-project",
        "https://neotracker.io/",
        "https://neo.org/",
        "https://www.reddit.com/r/NEO/"
    ],
    gas: ["https://neo.org/download",
        "https://github.com/neo-project",
        "https://neotracker.io/",
        "https://neo.org/",
        "https://www.reddit.com/r/NEO/",
        "https://neo.org/",
        "https://gateio.io/trade/neo_usdt",
        "https://neo.org/download",
        "https://github.com/neo-project",
        "https://neotracker.io/",
        "https://neo.org/",
        "https://www.reddit.com/r/NEO/"
    ],
    eos: ["https://eos.io/",
        "https://github.com/eosio",
        "https://eospark.com/MainNet/account/gateiowallet",
        "https://eos.io/",
        "https://t.me/joinchat/AAAAAEQbOeucnaMWN0A9dQ",
        "https://eos.io/",
        "https://gateio.io/trade/eos_usdt",
        "https://eos.io/",
        "https://github.com/eosio",
        "https://eospark.com/MainNet/account/gateiowallet",
        "https://eos.io/",
        "https://t.me/joinchat/AAAAAEQbOeucnaMWN0A9dQ"
    ],
    xmr: ["https://getmonero.org/",
        "https://github.com/monero-project/monero",
        "https://monerohash.com/",
        "https://getmonero.org/",
        "https://bitcointalk.org/index.php?topic=583449.0",
        "https://bitcointalk.org/index.php?topic=583449.0",
        "https://gateio.io/trade/xmr_usdt",
        "https://getmonero.org/",
        "https://github.com/monero-project/monero",
        "https://monerohash.com/",
        "https://getmonero.org/",
        "https://bitcointalk.org/index.php?topic=583449.0"
    ],
    etc: ["https://ethereumclassic.github.io/",
        "https://github.com/ethereumproject",
        "http://gastracker.io/",
        "https://ethereumclassic.github.io/",
        "https://www.reddit.com/r/EthereumClassic",
        "https://ethereumclassic.github.io/",
        "https://gateio.io/trade/etc_usdt",
        "https://ethereumclassic.github.io/",
        "https://github.com/ethereumproject",
        "http://gastracker.io/",
        "https://ethereumclassic.github.io/",
        "https://www.reddit.com/r/EthereumClassic"
    ],
    dash: ["https://www.dash.org/getstarted.html",
        "https://github.com/dashpay/dash",
        "https://explorer.dash.org/chain/Dash",
        "https://www.dash.org/",
        "https://bitcointalk.org/index.php?topic=421615.0",
        "https://bitcointalk.org/index.php?topic=421615.0",
        "https://gateio.io/trade/dash_usdt",
        "https://www.dash.org/getstarted.html",
        "https://github.com/dashpay/dash",
        "https://explorer.dash.org/chain/Dash",
        "https://www.dash.org/",
        "https://bitcointalk.org/index.php?topic=421615.0"
    ],
    qtum: ["https://qtum.org/zh",
        "https://github.com/qtumproject",
        "https://qtum.org/zh",
        "https://qtum.org/zh",
        "https://qtum.org/zh",
        "https://qtum.org/zh",
        "https://gateio.io/trade/qtum_usdt",
        "https://qtum.org/zh",
        "https://github.com/qtumproject",
        "https://qtum.org/zh",
        "https://qtum.org/zh",
        "https://qtum.org/zh"
    ],
    ada: ["https://www.cardano.org/en/home/",
        "https://github.com/input-output-hk/cardano-sl/",
        "https://cardanoexplorer.com/",
        "https://www.cardano.org/en/home/",
        "https://www.cardano.org/en/home/",
        "https://www.cardano.org/en/home/",
        "https://gateio.io/trade/ada_usdt",
        "https://www.cardano.org/en/home/",
        "https://github.com/input-output-hk/cardano-sl/",
        "https://cardanoexplorer.com/",
        "https://www.cardano.org/en/home/",
        "https://www.cardano.org/en/home/"
    ],
    bts: ["https://github.com/bitshares/bitshares1-core/releases",
        "https://github.com/bitshares/bitshares1-core",
        "http://bts.ai/u/gate-io-bts",
        "https://bitshares.org/",
        "https://bitsharestalk.org/",
        "https://bitshares.org/",
        "https://gateio.io/trade/bts_usdt",
        "https://github.com/bitshares/bitshares1-core/releases",
        "https://github.com/bitshares/bitshares1-core",
        "http://bts.ai/u/gate-io-bts",
        "https://bitshares.org/",
        "https://bitsharestalk.org/"
    ],
    gxs: ["https://www.gxb.io/",
        "https://github.com/OdysseyProtocol",
        "https://block.gxb.io/#/",
        "https://www.gxb.io/",
        "https://www.gxb.io/",
        "https://www.gxb.io/",
        "https://gateio.io/trade/gxs_usdt",
        "https://www.gxb.io/",
        "https://github.com/OdysseyProtocol",
        "https://block.gxb.io/#/",
        "https://www.gxb.io/",
        "https://www.gxb.io/"
    ],
    ont: ["https://ont.io/",
        "https://ont.io/",
        "https://explorer.ont.io/",
        "https://ont.io/",
        "https://ont.io/",
        "https://ont.io/",
        "https://gateio.io/trade/ont_usdt",
        "https://ont.io/",
        "https://ont.io/",
        "https://explorer.ont.io/",
        "https://ont.io/",
        "https://ont.io/"
    ],
    trx: ["https://tronlab.com/",
        "https://tronlab.com/",
        "https://tronscan.org/#/",
        "https://tronlab.com/",
        "https://tronlab.com/",
        "https://tronlab.com/",
        "https://gateio.io/trade/trx_usdt",
        "https://tronlab.com/",
        "https://tronlab.com/",
        "https://tronscan.org/#/",
        "https://tronlab.com/",
        "https://tronlab.com/"
    ],
    vtho: ["https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/trade/vtho_eth",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO",
        "https://gateio.io/coininfo/VTHO"
    ],
    xrp: ["https://gatehub.net/",
        "https://github.com/ripple",
        "https://xrpcharts.ripple.com/#/graph",
        "https://ripple.com/",
        "https://ripple.com/",
        "https://ripple.com/",
        "https://gateio.io/trade/xrp_usdt",
        "https://gatehub.net/",
        "https://github.com/ripple",
        "https://xrpcharts.ripple.com/#/graph",
        "https://ripple.com/",
        "https://ripple.com/"
    ]

}

function opnedetail(jsonData) {
    $('.currencyDetail h2').text(jsonData.title);
    $('.imgBx img').attr('src', jsonData.url);
    $('.name').text(jsonData.name);
    $('.yname').text(jsonData.yname);
    $('.Abbreviation').text(jsonData.Abbreviation);
    $('.desc').text(jsonData.desc);
    $('.coinparams span').eq(0).text('推出日期：' + jsonData.params.data)
    $('.coinparams span').eq(1).text('发行总量：' + jsonData.params.distributionNum)
    $('.coinparams span').eq(2).text('存量：' + jsonData.params.stock)
    $('.coinparams span').eq(3).text('市值：' + jsonData.params.marketValue)
    $('.coinparams span').eq(4).text('币种算法：' + jsonData.params.algorithm)
    $('.coinparams span').eq(5).text('区块速度：' + jsonData.params.speed)
    $('.coinparams span').eq(6).text('区块大小：' + jsonData.params.big)
    $('.coinparams span').eq(7).text('难度调整：' + jsonData.params.adjustment)
    $('.coinparams span').eq(8).text('证明方式：' + jsonData.params.method)
    address(jsonData.Abbreviation);
    $('.currencyDetail').show();
    $('.currencyDetailList').hide();
}

function address(yname) {
    var name = yname.toLowerCase();
    var str = "";
    for (var key in json_url) {
        if (key == name) {
            str += "<a target=\"_blank\" href=\"" + json_url[key][0] + "\">钱包下载</a>";
            str += "<a  target=\"_blank\" href=\"" + json_url[key][1] + "\">源码下载</a>";
            str += "<a  target=\"_blank\" href=\"" + json_url[key][2] + "\">区块浏览器</a>";
            str += "<a  target=\"_blank\" href=\"" + json_url[key][3] + "\">官方网站</a>";
            str += "<a  target=\"_blank\" href=\"" + json_url[key][4] + "\">论坛</a>";
            str += "<a  target=\"_blank\" href=\"" + json_url[key][5] + "\">挖矿</a>";
            str += "<a>交易</a>";

        }
    }
    $("#message_address").html(str);

}

var json_message = {
    usdt: {
        "title": "【USDT】Tether Tether 钱包下载与资料",
        "url": "img/usdt.png",
        "name": "Tether ",
        "yname": "Tether",
        "Abbreviation": "USDT",
        "desc": "USDT （tether.to）是一个由著名交易所bitfinex发起和由全球多家交易所支持的USD电子代币。USDT是基于比特币网络上的一个资产代币（Omnilayer协议），按照银行实际持有的法币量进行发行，市场价值与美元按照1:1锚定。用户可以像使用比特币一样在区块链上进行发送和接收。",
        "params": {
            "data": "-",
            "distributionNum": "0 ",
            "stock": "-",
            "marketValue": "$-",
            "speed": "600秒/块",
            "big": "25",
            "adjustment": "2016 Blocks ",
            "method": "PoW",
            "algorithm": "SHA-256"
        }
    },
    btc: {
        "title": "【BTC】Bitcoin 比特币 钱包下载与资料",
        "url": "img/btc.png",
        "name": "比特币 ",
        "yname": "Bitcoin",
        "Abbreviation": "BTC",
        "desc": "Bitcoin是点对点的基于SHA-256算法的网络数字货币，到2140年之前总额达到2100万。",
        "params": {
            "data": "2009-01-03 ",
            "distributionNum": "21000000 ",
            "stock": "16596000 ",
            "marketValue": "$ 134,934,441,840",
            "speed": "600秒/块",
            "big": "25",
            "adjustment": "2016 Blocks ",
            "method": "PoW",
            "algorithm": "SHA-256"
        }
    },
    bch: {
        "title": "【BCH】BCH BCH(原BCC) 钱包下载与资料",
        "url": "img/bch.png",
        "name": "BCH(原BCC)",
        "yname": "BCH",
        "Abbreviation": "BCH",
        "desc": "BCH (Bitcoin Cash) 是2017年8月1日比特币网络发生分叉后出现的新币种，总额达到2100万。",
        "params": {
            "data": "2017-08-01",
            "distributionNum": "21000000",
            "stock": "21000000",
            "marketValue": "$ 17,244,570,000",
            "speed": "600秒/块",
            "big": "25",
            "adjustment": "2016 Blocks ",
            "method": "PoW",
            "algorithm": "SHA-256"
        }
    },
    btg: {
        "title": "【BTG】BTG BTG 钱包下载与资料",
        "url": "img/btg.png",
        "name": "BTG",
        "yname": "BTG",
        "Abbreviation": "BTG",
        "desc": "BTG (Bitcoin Gold) 是2017年10月24日以比特币网络历史区块为基础，通过改变挖矿算法Equihash以利于GPU挖矿而分叉出现的新币种，总额达到2100万。团队预挖100000BTG可能抛向市场，请务必注意投资风险。",
        "params": {
            "data": "2017-10-24",
            "distributionNum": "21000000",
            "stock": "21000000",
            "marketValue": "$ 590,520,000",
            "speed": "600秒/块",
            "big": "25",
            "adjustment": "2016 Blocks ",
            "method": "PoW",
            "algorithm": "Equihash "
        }
    },
    ltc: {
        "title": "【LTC】Litecoin 莱特币 钱包下载与资料",
        "url": "img/ltc.png",
        "name": "莱特币  ",
        "yname": "Litecoin   ",
        "Abbreviation": "LTC",
        "desc": "第一个基于Scrypt算法的网络数字货币，与Bitcoin相比，他的确认速度快，2.5分钟确认一次，总量为8400万。",
        "params": {
            "data": "2011-10-07 ",
            "distributionNum": "84000000  ",
            "stock": "53165200  ",
            "marketValue": "$ 4,310,102,764",
            "speed": "150秒/块",
            "big": "50",
            "adjustment": "2016 Blocks ",
            "method": "PoW",
            "algorithm": "Scrypt"
        }
    },
    zec: {
        "title": "【ZEC】ZCash ZCash 钱包下载与资料",
        "url": "img/zec.png",
        "name": "ZCash ",
        "yname": "ZCash  ",
        "Abbreviation": "ZEC",
        "desc": "Zcash（ZEC）是一种采用零知识证明算法的透明和匿名性共存的新型加密数字资产，采用EquiHash算法和PoW的方式构建适合普通电脑挖矿的分发机制。发行总量与比特币相同2100万。",
        "params": {
            "data": "2016-10-28",
            "distributionNum": "21000000 ",
            "stock": "21000000 ",
            "marketValue": "$ 4,427,850,000",
            "speed": "150秒/块",
            "big": "12.5 ",
            "adjustment": "1 Block ",
            "method": "PoW",
            "algorithm": "EquiHash "
        }
    },
    eth: {
        "title": "【ETH】Ethereum 以太币 钱包下载与资料",
        "url": "img/eth.png",
        "name": "以太币 ",
        "yname": "Ethereum  ",
        "Abbreviation": "ETH",
        "desc": "以太坊 (Ethereum) 是一个基于P2P数字加密算法的去中心化可编程平台，包含数字货币和智能合约等特色功能，现存总量约8千万枚。",
        "params": {
            "data": "2015-11-1 ",
            "distributionNum": "~76623310   ",
            "stock": "94886500    ",
            "marketValue": "$ 42,817,533,125 ",
            "speed": "60秒/块",
            "big": "PoW",
            "adjustment": "1",
            "method": "PoS",
            "algorithm": "-"
        }
    },
    neo: {
        "title": "【NEO】Neo 小蚁Neo 钱包下载与资料",
        "url": "img/neo.png",
        "name": "小蚁Neo",
        "yname": "Neo ",
        "Abbreviation": "NEO",
        "desc": "NEO is a non-profit community-based blockchain project that utilizes blockchain technology and digital identity to digitize assets, to automate the management of digital assets using smart contracts, and to realize a smart economy with a distributed network.",
        "params": {
            "data": "2016-09-09 ",
            "distributionNum": "100000000  ",
            "stock": "100000000   ",
            "marketValue": "$ 3,258,000,000 ",
            "speed": "20秒/块",
            "big": "-",
            "adjustment": "-",
            "method": "PoW+PoS",
            "algorithm": "-"
        }
    },
    gas: {
        "title": "【GAS】Gas 小蚁Gas 钱包下载与资料",
        "url": "img/gas.png",
        "name": "小蚁Gas  ",
        "yname": "Gas",
        "Abbreviation": "GAS",
        "desc": "GAS is the fuel token for the realization of NEO network resource control, with a maximum total limit of 100 million. The NEO network charges for the operation and storage of tokens and smart contracts, thereby creating economic incentives for bookkeepers and preventing the abuse of resources. The minimum unit of GAS is 0.00000001..",
        "params": {
            "data": "2016-09-09",
            "distributionNum": "100000000 ",
            "stock": "100000000  ",
            "marketValue": "$ 961,000,000",
            "speed": "20秒/块",
            "big": "-",
            "adjustment": "-",
            "method": "PoW+PoS",
            "algorithm": "-"
        }
    },
    eos: {
        "title": "【EOS】EOS EOS 钱包下载与资料",
        "url": "img/eos.png",
        "name": "EOS ",
        "yname": "EOS",
        "Abbreviation": "EOS",
        "desc": "EOS.io项目由block.one的CTO Dan Larimer主导，目标是建立一个横向和纵向都高度规模化的区块链操作系统，提供各种必要的功能和超高的处理能力，让开发者可以将注意力集中在业务层。EOS币前5天的ICO成本为0.00326 ETH，按当时市值计算约6.52CNY，在其后的一年中将有另外70%币稀释市场，请务必注意投资风险。",
        "params": {
            "data": "2017-07-01 ",
            "distributionNum": "1000000000 ",
            "stock": "1000000000  ",
            "marketValue": "$ 8,163,700,000,",
            "speed": "-秒/块",
            "big": "-",
            "adjustment": "1",
            "method": "~",
            "algorithm": "-"
        }
    },
    xmr: {
        "title": "【XMR】Monero 门罗币 钱包下载与资料",
        "url": "img/xmr.png",
        "name": "门罗币",
        "yname": "Monero",
        "Abbreviation": "XMR",
        "desc": "Monero (XMR) 是基于CryptoNote协议，致力于隐私保护的新一代虚拟货币。CrytoNote由Bytecoin为开源原创，采用环签名（Ring Signatures）方式使转账匿名化。一分钟区块，总量1.84千万。",
        "params": {
            "data": "2014-04-18",
            "distributionNum": ">18400000 ",
            "stock": "15260400 ",
            "marketValue": "$ 1,978,358,256,",
            "speed": "60秒/块",
            "big": "~",
            "adjustment": "1",
            "method": "PoW",
            "algorithm": "CryptoNight"
        }
    },
    etc: {
        "title": "【ETC】Ethereum Classic 以太经典 钱包下载与资料",
        "url": "img/etc.png",
        "name": "以太经典 ",
        "yname": "Ethereum Classic ",
        "Abbreviation": "ETC",
        "desc": "以太经典 (Ethereum Classic) 是经过以太坊项目针对DAO资金问题进行硬分叉后未尊从或未升级的以太坊区块分支，保留了原有以太坊的代码规则和特色。",
        "params": {
            "data": "2015-11-1 ",
            "distributionNum": "~76623310 ",
            "stock": "96008000 ",
            "marketValue": "$ 1,640,776,720 ,",
            "speed": "60秒/块",
            "big": "PoW",
            "adjustment": "1",
            "method": "PoS",
            "algorithm": "-"
        }
    },
    dash: {
        "title": "【DASH】Dash 达世币 钱包下载与资料",
        "url": "img/dash.png",
        "name": "达世币",
        "yname": "Dash",
        "Abbreviation": "DASH",
        "desc": "达世币（DASH，原名暗黑币，原符号DRK，DarkCoin）有诸多被后来者广泛采用的创新。采用独创的11轮科学算法进行哈希运算，首次提出并实现了匿名区块转账方式。采用类似于PoW+PoS的混合挖矿方式，Masternodes获得10%的挖矿奖励。首次引入暗重力波（DGW）难度调整算法保护区块网络。总量约2200万枚。",
        "params": {
            "data": "2014-01-18",
            "distributionNum": "22000000",
            "stock": "7592180",
            "marketValue": "$ 1,761,385,760",
            "speed": "150秒/块",
            "big": "-",
            "adjustment": "Dark Gravity Wave",
            "method": "PoW",
            "algorithm": "X11"
        }
    },
    qtum: {
        "title": "【QTUM】Qtum 量子链 钱包下载与资料",
        "url": "img/qtum.png",
        "name": "量子链",
        "yname": "Qtum",
        "Abbreviation": "QTUM",
        "desc": "量子链Qtum是首个基于UTXO模型的POS智能合约平台，可以实现和比特币生态和以太坊生态的兼容性，并通过移动端的战略，促进区块链技术的产品化和提高区块链行业的易用性，旨在将真实商业社会与区块链世界连接。因此，量子链是一个区块链应用平台的集大成者。",
        "params": {
            "data": "2017-3-16",
            "distributionNum": "100000000",
            "stock": "100000000",
            "marketValue": "$ 762,000,",
            "speed": "-秒/块",
            "big": "-",
            "adjustment": "Block",
            "method": "PoS",
            "algorithm": "-"
        }
    },
    ada: {
        "title": "【ADA】Cardano 艾达币 钱包下载与资料",
        "url": "img/ada.png",
        "name": "艾达币",
        "yname": "Cardano",
        "Abbreviation": "ADA",
        "desc": "ADA是卡尔达诺Cardano项目的区块链数字资产。卡尔达诺（Cardano）是一个分散且公开的区块链，也是ㄧ个加密货币项目，而且是完全开源的。卡尔达诺正在开发一个智能合约平台，旨在提供比以前开发的任何协议更先进的功能。它是第一个从科学哲学和以研究为首驱使导向，进而演变而来的区块链平台。开发团队由全球专业工程师和研究人员组成。点击这里查看官方网站.",
        "params": {
            "data": "2017",
            "distributionNum": "31112483745",
            "stock": "31112500000",
            "marketValue": "$ 2,432,997,500",
            "speed": "-秒/块",
            "big": "-",
            "adjustment": "Block",
            "method": "-",
            "algorithm": "-"
        }
    },
    bts: {
        "title": "【BTS】BitShares 比特股 钱包下载与资料",
        "url": "img/bts.png",
        "name": "比特股",
        "yname": "BitShares",
        "Abbreviation": "BTS",
        "desc": "比特股（BitShares, BTS） 由BTSX更名为BTS，是一个基于石墨烯区块链技术的去中心化金融服务综合平台。 任何个人或机构都可以在平台上自由的进行转账、借贷、交易、发行资产如虚拟币、公司股票、众筹项目、积分、商品期货等，也可以基于平台快速搭建低成本、高性能的虚拟币/股票/贵金属交易所。 比特股平台有去中心化的：锚定货币、交易所、资产管理、加密私信、匿名功能等。比特股更有为符合企业监管需求的黑/白名单功能、高级多重签名、投票功能等。有外部信息输入系统可用于博彩、现实预测等等其它的应用。",
        "params": {
            "data": "2014-07-22",
            "distributionNum": "2000000000",
            "stock": "3600570000",
            "marketValue": "$ 375,539,451",
            "speed": "10秒/块",
            "big": "-",
            "adjustment": "-",
            "method": "DPOS",
            "algorithm": "-"
        }
    },
    gxs: {
        "title": "【GXS】GXShares 公信宝 钱包下载与资料",
        "url": "img/gxs.png",
        "name": "公信宝",
        "yname": "GXShares",
        "Abbreviation": "GXS",
        "desc": "公信宝的公链——公信链，这是一条并发能达到10万TPS，基于石墨烯技术，以DPoS为共识机制的公有链。公信宝在公信链基础上，搭建了一个去中心化数据交易所，能帮助数据买家和卖家实现高效的点对点数据交易，拥有不缓存数据、保护用户隐私、丰富一手数据源接入等优势。 点击这里查看官方网站.",
        "params": {
            "data": "2017",
            "distributionNum": "100000000",
            "stock": "100000000",
            "marketValue": "$ 154,410,000",
            "speed": "-秒/块",
            "big": "-",
            "adjustment": "-",
            "method": "Block",
            "algorithm": "-"
        }
    },
    ont: {
        "title": "【ONT】Ontology 本体 钱包下载与资料",
        "url": "img/ont.png",
        "name": "本体",
        "yname": "Ontology",
        "Abbreviation": "ONT",
        "desc": "",
        "params": {
            "data": "",
            "distributionNum": "1000000000",
            "stock": "1000000000",
            "marketValue": " $ 1,865,000,000",
            "speed": "-秒/块",
            "big": "-",
            "adjustment": "-",
            "method": "-",
            "algorithm": "-"
        }
    },
    trx: {
        "title": "【TRX】TRON 波场 钱包下载与资料",
        "url": "img/trx.png",
        "name": "波场",
        "yname": "TRON",
        "Abbreviation": "TRX",
        "desc": "TRX is the ERC20 token of TRON. click here to details at the official website.",
        "params": {
            "data": "2017",
            "distributionNum": "65613192465",
            "stock": "65613200000",
            "marketValue": "$ 1,637,049,340",
            "speed": "-秒/块",
            "big": "-",
            "adjustment": "-",
            "method": "Block",
            "algorithm": "-"
        }
    },
    vtho: {
        "title": "【VTHO】 钱包下载与资料",
        "url": "img/vtho.png",
        "name": "",
        "yname": "",
        "Abbreviation": "VTHO",
        "desc": "",
        "params": {
            "data": "",
            "distributionNum": "",
            "stock": "",
            "marketValue": "$",
            "speed": "-秒/块",
            "big": "-",
            "adjustment": "-",
            "method": "",
            "algorithm": "-"
        }
    },
    xrp: {
        "title": "【XRP】Ripple 瑞波币 钱包下载与资料",
        "url": "img/xrp.png",
        "name": "瑞波币",
        "yname": "Ripple",
        "Abbreviation": "XRP",
        "desc": "Ripple是一个区中心化的资产传输网络，发行于2013年初，用于解决金融机构以及用户间的资产转换和信任问题。XRP是这个网络上面的基础资产，目前已经成为市值排名前几位的区块链资产。",
        "params": {
            "data": "2013",
            "distributionNum": "100000000000",
            "stock": "100000000000",
            "marketValue": " $ 48,600,000,000",
            "speed": "10秒/块",
            "big": "-",
            "adjustment": "-",
            "method": " PoW+PoS",
            "algorithm": "-"
        }
    }

}

function address_list() {
    var str = "";
    for (var key in json_message) {
        var ms = json_message[key];
        str += "<li>                 <div class=\"currencyListHide\">";
        str += "<p>市值</p>";
        str += "<p>" + ms.params.marketValue + "</p>";
        str += "<div>";
        for (var key1 in json_url) {
            if (key1 == key.toLowerCase()) {
                str += " <a  target=\"_blank\" href=\"" + json_url[key1][7] + "\">钱包下载</a>";
                str += " <a  target=\"_blank\" href=\"" + json_url[key1][8] + "\">官网</a>";
                str += "<a  target=\"_blank\" href=\"" + json_url[key1][9] + "\">区块</a>";
                str += "<a  target=\"_blank\" href=\"" + json_url[key1][10] + "\">创世贴</a>";
                str += "<a  target=\"_blank\" href=\"" + json_url[key1][11] + "\">源码</a>";
                str += "<a onclick='opnedetail(" + JSON.stringify(ms) + ")'>介绍</a>";
            }
        }

        str += "</div>";
        str += " </div>";
        str += "<img src=\"" + ms.url + "\">";
        str += "<p>" + ms.Abbreviation + "</p>";
        str += "<span>" + ms.yname + "</span>";
        str += "</li>";
    }
    $("#address_list").html(str);

}

address_list();
var userid;
var token;
var language;
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        if (language == 2) {
            loadProperties();
        }
    }
})

$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 350) {
        $(".followStrategyNav").hide();
    } else {
        $(".followStrategyNav").show();
    }
});