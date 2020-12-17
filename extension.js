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

		let copyLink = 'Copy Link'
		let openLink = 'Open Link'

		let index = 0
		editor.document.fileName.split('\\').forEach(obj => {
			index++
		})

		let fileName = editor.document.fileName.split('\\')[index-1].toString()

		sourcebin.create([
			{
				name: fileName,
				languageId: editor.document.languageId,
				content: content
			}
		], {
			title: fileName,
			description: 'Created with SourcebinUpload (vscode extension)'
		})
		.then(data => vscode.window.showInformationMessage("Bin created.", copyLink, openLink).then(s => {
			if (s === copyLink) {
				clipboardy.writeSync(data.short)
			} else if (s === openLink) {
				vscode.env.openExternal(vscode.Uri.parse(data.short))
			}
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
