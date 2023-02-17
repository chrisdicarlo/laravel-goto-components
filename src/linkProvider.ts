import { existsSync } from "fs";
import {
    DocumentLinkProvider,
    Hover,
    MarkdownString,
    Position,
    TextDocument,
    Uri,
    workspace,
    ProviderResult,
    DocumentLink,
    Range,
} from "vscode";
import { nameToIndexPath, nameToPath, livewireNameToIndexPath, livewireNameToPath, classNameToPath } from "./utils";

export default class LinkProvider implements DocumentLinkProvider {
    public provideDocumentLinks(
        doc: TextDocument
    ): ProviderResult<DocumentLink[]> {
        const documentLinks: DocumentLink[] = [];

        const config = workspace.getConfiguration("laravel_goto_components");
        const workspacePath = workspace.getWorkspaceFolder(doc.uri)?.uri.fsPath;

        const regBlade = new RegExp(config.regex.blade);
        const regLivewireComponent = new RegExp(config.regex.livewireComponent);
        const regLivewireDirective = new RegExp(config.regex.livewireDirective);
        const regLivewire = new RegExp(config.regex.livewire);
        let linesCount = doc.lineCount;

        let index = 0;
        while (index < linesCount) {
            let line = doc.lineAt(index);
            let bladeResult = line.text.match(regBlade);

            if (bladeResult !== null) {
                for (let componentName of bladeResult) {
                    let componentPath = nameToPath(componentName);

                    if (!existsSync(workspacePath + componentPath)) {
                        componentPath = nameToIndexPath(componentName);

                        if (! existsSync(workspacePath + componentPath)) {
                            componentPath = classNameToPath(componentName, doc.uri);

                            if (!existsSync(workspacePath + componentPath)) {
                                continue;
                            }
                        }
                    }

                    let start = new Position(
                        line.lineNumber,
                        line.text.indexOf(componentName)
                    );
                    let end = start.translate(0, componentName.length);
                    let documentlink = new DocumentLink(
                        new Range(start, end),
                        Uri.file(workspacePath + componentPath)
                    );
                    documentLinks.push(documentlink);
                }
            }

            let livewireResult = line.text.match(regLivewire);

            if (livewireResult !== null) {
                for (let componentName of livewireResult) {
                    let componentPath = livewireNameToPath(componentName);

                    if (!existsSync(workspacePath + componentPath)) {
                        componentPath = livewireNameToIndexPath(componentName);

                        if (componentPath == '' || !existsSync(workspacePath + componentPath)) {
                            continue;
                        }
                    }

                    let start = new Position(
                        line.lineNumber,
                        line.text.indexOf(componentName)
                    );
                    let end = start.translate(0, componentName.length);
                    let documentlink = new DocumentLink(
                        new Range(start, end),
                        Uri.file(workspacePath + componentPath)
                    );
                    documentLinks.push(documentlink);
                }
            }

            //   let livewireComponentResult = line.text.match(regLivewireComponent);

            //   if (livewireComponentResult !== null) {
            //     for (let componentName of livewireComponentResult) {
            //       let componentPath = livewireNameToPath(componentName);

            //        if (!existsSync(workspacePath + componentPath)) {
            //          componentPath = livewireNameToIndexPath(componentName);

            //         if (!existsSync(workspacePath + componentPath)) {
            //           continue;
            //         }
            //        }

            //       let start = new Position(
            //         line.lineNumber,
            //         line.text.indexOf(componentName)
            //       );
            //       let end = start.translate(0, componentName.length);
            //       let documentlink = new DocumentLink(
            //         new Range(start, end),
            //         Uri.file(workspacePath + componentPath)
            //       );
            //       documentLinks.push(documentlink);
            //     }
            //   }

            //   let livewireDirectiveResult = line.text.match(regLivewireDirective);

            //   if (livewireDirectiveResult !== null) {
            //     for (let componentName of livewireDirectiveResult) {
            //       let componentPath = livewireNameToPath(componentName);

            //        if (!existsSync(workspacePath + componentPath)) {
            //          componentPath = livewireNameToIndexPath(componentName);

            //         if (!existsSync(workspacePath + componentPath)) {
            //           continue;
            //         }
            //        }

            //       let start = new Position(
            //         line.lineNumber,
            //         line.text.indexOf(componentName)
            //       );
            //       let end = start.translate(0, componentName.length);
            //       let documentlink = new DocumentLink(
            //         new Range(start, end),
            //         Uri.file(workspacePath + componentPath)
            //       );
            //       documentLinks.push(documentlink);
            //     }
            //   }

            index++;
        }

        return documentLinks;
    }
}
