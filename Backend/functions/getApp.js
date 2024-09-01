const { exec } = require('child_process');
const iconv = require('iconv-lite');

// 获取端口流量信息的函数
function getPortTraffic(callback) {
  exec('netstat -ano', { encoding: 'buffer' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行 netstat 时出错: ${error}`);
      callback([]);
      return;
    }

    // 将输出从 GBK 编码转换为 UTF-8
    const decodedOutput = iconv.decode(stdout, 'gbk');
    const lines = decodedOutput.split('\n');
    const connections = [];

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5 && (parts[0] === 'TCP' || parts[0] === 'UDP')) {
        const protocol = parts[0];
        const localAddress = parts[1];
        const remoteAddress = parts[2];
        const state = parts[3];
        const pid = parts[4];

        const localPort = localAddress.split(':').pop();

        connections.push({
          protocol,
          localAddress,
          remoteAddress,
          localPort,
          state,
          pid,
          sentBytes: 0, // 初始化发送字节数
          receivedBytes: 0 // 初始化接收字节数
        });
      }
    });

    // 获取网络流量数据
    exec('typeperf "\\Network Interface(*)\\Bytes Sent/sec" "\\Network Interface(*)\\Bytes Received/sec" -sc 1', { encoding: 'buffer' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行 typeperf 时出错: ${error}`);
            callback([]);
            return;
        }

        const decodedTypeperf = iconv.decode(stdout, 'gbk');
        const typeperfLines = decodedTypeperf.split('\n');

        // 解析 typeperf 输出
        const networkData = typeperfLines.slice(2).map(line => {
        // 去掉可能存在的引号
        const parts = line.trim().replace(/"/g, '').split(',');
        
        if (parts.length < 5) {
            // 处理格式不符合预期的行
            console.warn('Skipping malformed line:', line);
            return null;
        }
        const [timestamp, sentBytes1, sentBytes2, receivedBytes1, receivedBytes2] = parts;
        return {
            timestamp,
            sentBytes: parseFloat(sentBytes2),
            receivedBytes: parseFloat(receivedBytes2)
        };
        }).filter(data => data !== null); // 过滤掉格式不正确的行
        
      
      // 更新连接信息中的流量数据
      const detailedConnections = connections.map(connection => {
        // 如果之前有数据，计算流量消耗
        const latestData = networkData[networkData.length - 1] || { sentBytes: 0, receivedBytes: 0 };

        // 注意这里计算的是每次采样之间的流量，可能需要根据实际情况调整
        connection.sentBytes = latestData.sentBytes;
        connection.receivedBytes = latestData.receivedBytes;
        
        return {
          ...connection
        };
      });

      callback(detailedConnections);
    });
  });
}

module.exports = getPortTraffic;
