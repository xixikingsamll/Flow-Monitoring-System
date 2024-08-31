const speedTest = require('network-speed'); // 引入 network-speed 库
const ping = require('ping'); // 引入 ping 库
const testNetworkSpeed = new speedTest();

// 获取网络下载速度的函数
async function getNetworkDownloadSpeed() {
    const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
    const fileSizeInBytes = 500000;
    const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
    return speed.mbps; // 返回以 Mbps 为单位的下载速度
}

// 获取网络延迟的函数
async function getNetworkLatency() {
  const target = 'speedtest.cn'; // 使用国内的测试地址
  try {
    const res = await ping.promise.probe(target);
    return res.time; // 返回以毫秒为单位的延迟
  } catch (error) {
    console.error('获取网络延迟时出错:', error);
    return null;
  }
}

// 导出函数
module.exports = {
    getNetworkDownloadSpeed,
    getNetworkLatency
};