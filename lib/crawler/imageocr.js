'use strict';

const http = require('http');
// 用于请求的选项
const options = {
  host: 'localhost',
  port: '8080',
  path: '/ocrservice/ocrservice',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
};

function ImageOCR() {
}

ImageOCR.prototype.getocr = function(imagedata) {
  const image_base64 = new Buffer(imagedata).toString('base64');

  return new Promise(function(resolve, reject) {
    // 创建向服务端发送的请求
    const req = http.request(options, (response)=>{

      var body = '';
      response.on('error', function(error) {
        console.log('in error' + error);
        reject(error);
      });
      // 不断更新数据
      response.on('data', function(data) {
        body += data;
      });
      response.on('end', function() {
        // 数据接收完成
        // console.log('in request' + body);
        resolve(body);
      });
    });
    // 发送实际的图像数据base64格式
    req.write('imagedata=' + encodeURIComponent(image_base64));
    req.end();
  });
};
exports.ImageOCR = ImageOCR;

/*
const fs = require('fs');
fs.readFile('/imtc_ios/crawlreports/reports/2018-4-4-15-9-26/0a835ead-8772-48c9-99d7-844db3866873.png',(err,filedata)=>{
  console.log('err=' + err +', filedata=' + filedata.length);

  const  imageocr  = new ImageOCR();
  imageocr.getocr(filedata).then((ret)=>{
  console.log('in getocr=' + ret);

},null);
});
*/
