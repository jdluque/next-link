import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class NextLink extends Plugin {
	// settings: MyPluginSettings;

	async onload() {
		// await this.loadSettings();

		this.addCommand({
			id: 'next-link',
			name: 'Next link',
			editorCallback: (editor: Editor, view: MarkdownView) => {
                //let cursorText = editor.getCursor().slice()
                let cursorText = editor.getLine(editor.getCursor().line).
                    slice(editor.getCursor().ch);
                const regex = /\[\[[^\]]+\]\]/
                let numLines = editor.lineCount();
                let currLine = editor.getCursor().line;
                let i = 0;
                while (i < numLines) {
                    let offset : number = i == 0 ? editor.getCursor().ch : 0; 
                    let text = editor.getLine(currLine).slice(offset);
                    let match_index = text.search(regex);
                    if (match_index > -1) {
                        //editor.setCursor(currLine, match_index + offset + 2);
                        // TODO: The +1 is a workaround for getting the cursor in the note name; find a solution that puts the cursor on the first character
                        editor.setCursor(currLine, match_index + offset + 2 + 1);
                        break;
                    }
                    i++;
                    currLine = (currLine + 1) % numLines;
                }
			}
		});

        this.addCommand({
            id: 'prev-link',
            name: 'Previous link',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                let cursorText = editor.getLine(editor.getCursor().line).
                    slice(editor.getCursor().ch);
                const regex = /\[\[[^\]]+\]\](?!.*\[\[.*\]\])/
                let numLines = editor.lineCount();
                let currLine = editor.getCursor().line;
                let i = 0;
                while (i < numLines) {
                    let offset : number = i == 0 ? editor.getCursor().ch : -1; 
                    var text : string;
                    if (offset < 0) {
                        text = editor.getLine(currLine);
                    } else{
                        text = editor.getLine(currLine).slice(0,offset);
                    }
                    let match_index = text.search(regex);
                    if (match_index > -1) {
                        editor.setCursor(currLine, match_index + 2 + 1);
                        break;
                    }
                    i++;
                    currLine = (currLine - 1 + numLines) % numLines;
                }
            }
        });
	}

	onunload() {}
}
