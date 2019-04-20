express3 で socket.io をつかってみたサンプルです。
(以前は express2 を使ってました。 express3 で動作するように変更しました。)  

    npm install
    npm start

複数のブラウザで http://localhost:3000 を開き、
マウス移動や、キーボード押下をしてみてください。
フォーカスが当たっていないブラウザの画面中でも接続車数、キーのコード、マウス位置の表示が更新されます。

マウスドラッグすると線を引くことができます。これも他のブラウザ画面に表示が反映されます。  

[https://github.com/sksmatt/nodejs-cursor-tracking](https://github.com/sksmatt/nodejs-cursor-tracking)
を参考にして作成しました。(これは express2 を利用しています)

## License 

[![Greenkeeper badge](https://badges.greenkeeper.io/katoy/socketio_sample.svg)](https://greenkeeper.io/)

(The MIT License)

Copyright (c) 2012 Matt Varone &lt;contact@mattvarone.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
