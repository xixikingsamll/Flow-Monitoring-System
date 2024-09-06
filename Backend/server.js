const WebSocket = require('ws');
const { getNetworkDownloadSpeed, getNetworkLatency } = require('./functions/getSpeed');

// 创建一个 WebSocket 服务器
const wss = new WebSocket.Server({ port: 3007 });

// 用于近期存储下载速度数据
let oneMinute = new Array(60).fill(0) // 1分钟
let fiveMinute = new Array(300).fill(0)  // 5分钟
let oneHour = new Array(3600).fill(0)  // 1小时

// 用来更新数据的函数（当存储的数据超过时间范围的时候，就优化最后面的一项）
const updateDate = (array, num) => {
    if (array.length >= num) {
        array.shift();
    }
}

// 计算相应时间段的下载速度
const averageFlow = (array) => {
    let result = array.reduce((prev, cur) => prev + cur, 0) / array.length
    return parseFloat(result.toFixed(2))
}  
 
wss.on('connection', (ws) => {
    console.log('客户端已连接');

    // 定期获取网速并发送给客户端
    setInterval(async () => {
        // 获取延迟
        let latency = parseFloat(parseFloat(await getNetworkLatency()).toFixed(2)) || 0;
        // 获取流量并存入
        let downloadSpeed = parseFloat(parseFloat(await getNetworkDownloadSpeed()).toFixed(2)) || 0;
        
        if (downloadSpeed === Infinity) {
            downloadSpeed = 0
        }
        oneMinute.push(downloadSpeed) 
        fiveMinute.push(downloadSpeed)
        oneHour.push(downloadSpeed)
        
        // 更新数组长度 
        updateDate(oneMinute, 60)
        updateDate(fiveMinute, 300)
        updateDate(oneHour, 3600)
        

        // 求平均值
        const result = {
            oneMinute: {
                averageFlow: averageFlow(oneMinute)
            },
            fiveMinute: {
                averageFlow: averageFlow(fiveMinute)
            },
            oneHour: {
                averageFlow: averageFlow(oneHour)
            }
        }
        console.log(result);
         
        
        ws.send(JSON.stringify({ downloadSpeed, latency, result }));
    }, 1000); // 每1秒获取一次网速

    // 当服务器收到消息时，触发该事件
    ws.on('message', (message) => {
        console.log(`收到消息：${message}`);
        // 可以根据需要处理消息
    });

    // 处理客户端断开连接的事件
    ws.on('close', () => {
        console.log('客户端已断开连接');
    }); // 处理客户端断开连接的事件
});

console.log('WebSocket 服务器已启动，正在监听端口 3007');

