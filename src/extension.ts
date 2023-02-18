import { ExtensionContext, languages, window, workspace } from "vscode";
import { updateLinks } from "./UpdateLinks";
import BladeLinkProvider from "./BladeLinkProvider";

window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      const document = editor.document;
      const disposable = workspace.onDidChangeTextDocument((event) => {
        if (event.document === document) {
          updateLinks(document);
        }
      });
    }
  });

export function activate(context: ExtensionContext) {
    let bladeLink = languages.registerDocumentLinkProvider(
        "blade",
        new BladeLinkProvider()
    );

    context.subscriptions.push(bladeLink);
}

export function deactivate() { }
