import { existsSync } from "fs";
import {
    DocumentLink,
    Position,
    Range,
    TextDocument,
    Uri,
    workspace,
} from "vscode";
import {
    classNameToPath,
    livewireNameToIndexPath,
    livewireNameToPath,
    nameToIndexPath,
    nameToPath,
} from "./utils";

export function updateLinks(document: TextDocument): DocumentLink[] {
    const documentLinks: DocumentLink[] = [];
    const config = workspace.getConfiguration("laravel_goto_components");
    const workspacePath = workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;

    const regBlade = new RegExp(config.regex.blade, "g");
    const regLivewire = new RegExp(config.regex.livewire, "g");
    const text = document.getText();

    for (const match of text.matchAll(regBlade)) {
        if(!match.index) {
            continue;
        }

        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + match[0].length);
        const componentName = match[0];

        let componentPath = nameToPath(componentName);

        if (!existsSync(workspacePath + componentPath)) {
            componentPath = nameToIndexPath(componentName);

            if (!existsSync(workspacePath + componentPath)) {
                componentPath = classNameToPath(componentName, document.uri);

                if (!existsSync(workspacePath + componentPath)) {
                    continue;
                }
            }
        }

        const link = new DocumentLink(new Range(start, end), Uri.file(workspacePath + componentPath));
        documentLinks.push(link);
    }

    for (const match of text.matchAll(regLivewire)) {
        if(!match.index) {
            continue;
        }

        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + match[0].length);

        const componentName = match[0];

        let componentPath = livewireNameToPath(componentName);

        if (!existsSync(workspacePath + componentPath)) {
            componentPath = livewireNameToIndexPath(componentName);

            if (componentPath == '' || !existsSync(workspacePath + componentPath)) {
                continue;
            }
        }

        const link = new DocumentLink(new Range(start, end), Uri.file(workspacePath + componentPath));
        documentLinks.push(link);
    }

    return documentLinks;



    // const regBlade = new RegExp(config.regex.blade);
    // const regLivewire = new RegExp(config.regex.livewire);

    // let linesCount = doc.lineCount;

    // for (let index = 0; index < linesCount; index++) {
    //     let line = doc.lineAt(index);

    //     // Blade components support
    //     let bladeResult = [...line.text.matchAll(config.blade_regex)];
    //     console.log(bladeResult);
    // if (bladeResult !== null) {
    //     for (let componentName of bladeResult) {
    //         let componentPath = nameToPath(componentName);

    //         if (!existsSync(workspacePath + componentPath)) {
    //             componentPath = nameToIndexPath(componentName);

    //             if (!existsSync(workspacePath + componentPath)) {
    //                 componentPath = classNameToPath(componentName, doc.uri);

    //                 if (!existsSync(workspacePath + componentPath)) {
    //                     continue;
    //                 }
    //             }
    //         }

    //         let start = new Position(
    //             line.lineNumber,
    //             line.text.indexOf(componentName)
    //         );
    //         let end = start.translate(0, componentName.length);
    //         let documentlink = new DocumentLink(
    //             new Range(start, end),
    //             Uri.file(workspacePath + componentPath)
    //         );
    //         documentLinks.push(documentlink);
    //     }
    // }

    // // Livewire components support
    // let livewireResult = line.text.match(regLivewire);

    // if (livewireResult !== null) {
    //     for (let componentName of livewireResult) {
    //         let componentPath = livewireNameToPath(componentName);

    //         if (!existsSync(workspacePath + componentPath)) {
    //             componentPath = livewireNameToIndexPath(componentName);

    //             if (componentPath == '' || !existsSync(workspacePath + componentPath)) {
    //                 continue;
    //             }
    //         }

    //         let start = new Position(
    //             line.lineNumber,
    //             line.text.indexOf(componentName)
    //         );
    //         let end = start.translate(0, componentName.length);
    //         let documentlink = new DocumentLink(
    //             new Range(start, end),
    //             Uri.file(workspacePath + componentPath)
    //         );
    //         documentLinks.push(documentlink);
    //     }
    // }
    // }

    // return documentLinks;
}
