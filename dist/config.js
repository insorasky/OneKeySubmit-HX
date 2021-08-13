var hx = require('hbuilderx');
var path = require('path')

let showConfig = () => {
	let cfgPath = path.resolve(__dirname, '../user/config.js')
	hx.workspace.openTextDocument(cfgPath)
};

module.exports = {
	showConfig
}