'use strict';

exports.isDev = process.env.NO_SMOKE === 'dev';
exports.OcrHost = {
  host: 'localhost',
  port: '8080',
  path: '/ocrservice/ocrservice',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
};
