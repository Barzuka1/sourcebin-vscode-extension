const vscode = require('vscode')
const sourcebin = require('sourcebin')
const clipboardy = require('clipboardy');

/**
 * @param {vscode.ExtensionContext} context
*/

function activate(context) {
	console.log('Extension is active')
	let disposable = vscode.commands.registerCommand('sourcebinupload.createBin', function () {

		let content

		var editor = vscode.window.activeTextEditor
		const { getText } = editor.document
		if (editor.selection.isEmpty) {
			content = getText()
		} else {
			content = getText(editor.selection)
		}

		let copyText = 'Copy Link'
		let rawLink = 'Copy Raw Link'
		sourcebin.create([
			{
				name: editor.document.fileName,
				languageId: editor.document.languageId,
				content: content
			}
		], {
			title: editor.document.fileName,
			description: 'Created with SourcebinUpload (vscode extension)'
		})
		.then(data => vscode.window.showInformationMessage("Bin created.", copyText, rawLink).then(s => {
			if (s === copyText) {
				clipboardy.writeSync(data.short)
			} else if (s === rawLink) {
				clipboardy.writeSync(data.files[0].raw)
			}
			console.log(data)
		}))
		.catch(err => vscode.window.showErrorMessage(err))

	})

	context.subscriptions.push(disposable)
}
// @ts-ignore
exports.activate = activate

function deactivate() {}

module.exports = {
	// @ts-ignore
	activate,
	deactivate
}
