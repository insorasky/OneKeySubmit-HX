# OneKeySubmit
HBuilderX Uni-App微信小程序一键提交

### 优势
- 1.一键快速提交，无需启动繁杂沉重的微信开发者工具；
- 2.直接使用manifest.json中的版本号，便于版本管理。

### 安装方法
- 1.进入HBuilderX的`plugins`目录；
- 2.将插件文件夹解压至此目录；
- 3.在插件目录下执行`npm install`安装依赖；
- 4.重启HBuilderX；

### 食用方法
- 1.使用HBuilderX打开Uni-App项目；
- 2.首次使用时，请点击发行——一键提交设置，设置插件；可参考[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)；
- 3.在项目manifest.json中设置版本号和应用的AppID；
- 4.在微信小程序后台——开发管理——开发设置中下载小程序代码上传密钥后，命名为【private.（AppID）.key】（即下载后无需改名）置于项目根目录下；
- 5.点击发行——向微信提交小程序，等待提交完成。

### 关于
Sora 版权所有；感谢DCloud开发HBuilderX和Uni-App。
[inSoraSky博客](https://www.sorasky.in/)
[Uni-App官网](https://uniapp.dcloud.io/)
[HBuilderX官网](https://hx.dcloud.net.cn/)
