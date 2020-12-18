const vscode = require('vscode')
const sourcebin = require('sourcebin')
const { default : axios } = require('axios')
const clipboardy = require('clipboardy');
const fs = require('fs')

/**
 * @param {vscode.ExtensionContext} context
*/

function activate(context) {
	console.log('Extension is active')
	let makeBin = vscode.commands.registerCommand('sourcebinupload.makeBin', () => {
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
		let copyCode = 'Copy Code'

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
		.then(data => vscode.window.showInformationMessage("Bin created.", copyLink, openLink, copyCode).then(s => {
			if (s === copyLink) {
				clipboardy.writeSync(data.short)
			} else if (s === openLink) {
				vscode.env.openExternal(vscode.Uri.parse(data.short))
			} else if (s === copyCode) {
				clipboardy.writeSync(data.key)
			}
		}))
		.catch(err => vscode.window.showErrorMessage(err))

	})

	context.subscriptions.push(makeBin)

	let saveBin = vscode.commands.registerCommand('sourcebinupload.saveBin', async ()  =>  {
		const { activeTextEditor: editor } = vscode.window
		const currentFolder = editor.document.fileName.split('\\').slice(0,-1).join('\\')
		let code = await vscode.window.showInputBox()
			axios.get(`https://sourceb.in/raw/${code}/0`).then(res => {
				console.log(res.data)
				console.log(currentFolder)
				fs.writeFile(`${currentFolder}\\${code}`, res.data, console.error)
				vscode.window.showInformationMessage(`Bin saved as ${code}`)
		}).catch(err => vscode.window.showErrorMessage("Cannot find bin, ", err))
	})

	context.subscriptions.push(saveBin)
}
// @ts-ignore
exports.activate = activate

function deactivate() {}


	// @ts-ignore
	activate,
	deactivate
