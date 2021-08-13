var hx = require("hbuilderx");
var ci = require("miniprogram-ci");
var fs = require("fs");
var path = require('path');
var cp = require('child_process');
var usercfg = require('../user/config');

let submit = () => {
	hx.window.getActiveTextEditor().then(editor => {
		let channel = hx.window.createOutputChannel('提交微信小程序')
		channel.show()
		let currentPath = editor.document.workspaceFolder.uri.path
		let cfgPath = path.join(currentPath, 'manifest.json')
		let cfg = JSON.parse(fs.readFileSync(cfgPath))
		if(!cfg['mp-weixin']['appid']){
			channel.appendLine('请先在manifest.json中设置AppID！')
			return
		}
		let appid = cfg['mp-weixin']['appid']
		let version = cfg['versionName']
		let keyPath = path.join(currentPath, 'private.' + appid + '.key')
		if(!fs.existsSync(keyPath)){
			channel.appendLine('请先在小程序后台——开发管理——开发设置中下载小程序代码上传密钥后，命名为【private.（AppID）.key】（即下载后无需改名）置于项目根目录下！')
			return
		}
		var description = ''
		hx.window.showInputBox({
			prompt: '请输入当前版本描述',
			placeHolder: '于 ' + new Date().format("yyyy-MM-dd hh:mm:ss") + ' 提交'
		}).then((result) => {
			if(result == '') description = '于 ' + new Date().format("yyyy-MM-dd hh:mm:ss") + ' 提交'
			else description = result
			channel.appendLine('当前提交版本：' + version + '；如果版本有误，请修改manifest.json中的版本号；')
			channel.appendLine('版本描述：' + description)
			let hxRoot = path.resolve(process.execPath, '../..')
			var myEnv = process.env
			Object.assign(myEnv, {
				'NODE_ENV': 'production',
				'UNI_INPUT_DIR': currentPath,
				'UNI_OUTPUT_DIR': path.join(currentPath, 'unpackage/dist/build/mp-weixin'),
				'UNI_PLATFORM': 'mp-weixin'
			})
			var node = cp.spawn(path.join(hxRoot, 'node/node'), ['--max-old-space-size=2048', path.join(hxRoot, 'uniapp-cli/bin/uniapp-cli.js')], {
				cwd: path.join(hxRoot, 'uniapp-cli'),
				env: myEnv
			})
			node.stdout.on('data', data => {
				data.toString().split('\n').forEach((item, index, arr) => {
					if(item == '') return
					channel.appendLine(item)
					console.log(item)
				})
			})
			node.stderr.on('data', data => {
				data.toString().split('\n').forEach((item, index, arr) => {
					if(item == '') return
					channel.appendLine(item)
					console.log(item)
				})
			})
			node.on('exit', code => {
				console.log(code)
				if(code != 0){
					channel.appendLine('编译出错，请检查错误后重试')
					return
				}
				channel.appendLine('编译完成，开始向微信提交小程序...')
				;(async () => {
					console.log("Submit to Wechat")
					const project = new ci.Project({
						appid: appid,
						type: 'miniProgram',
						projectPath: path.join(currentPath, 'unpackage/dist/build/mp-weixin/'),
						privateKeyPath: keyPath,
						ignores: []
					})
					const result = ci.upload({
						project,
						version: version,
						desc: description,
						setting: {
							es6: usercfg.cfg.es6,
						},
						robot: usercfg.cfg.robot,
						onProgressUpdate: (data) => {
							console.log(data.message)
							channel.appendLine(data.message)
						}
					}).then(data => {
						channel.appendLine('提交完成，如果是第一次使用本插件，请访问小程序后台将本机器人的版本设为体验版！')
					}).catch(err => {
						console.log(err)
						channel.appendLine(err.toString())
						channel.appendLine('提交出错，请检查HBuilderX日志，查看错误原因！')
					})
				})()
			})
		}).catch(err => {
			channel.appendLine('用户取消提交。')
		})
	}).catch(err => {
		console.log(err)
	})
}

module.exports = {
	submit
}