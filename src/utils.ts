import { existsSync, readFile, readFileSync } from "fs";
import { workspace, Uri } from "vscode";

export function nameToPath(path: string): string {
    return `/resources/views/components/${path.replace(/\./g, "/")}.blade.php`;
}

export function nameToIndexPath(path: string): string {
    return `/resources/views/components/${path.replace(/\./g, "/")}/index.blade.php`;
}

export function livewireNameToPath(path: string): string {
    return `/resources/views/livewire/${path.replace(/\./g, "/")}.blade.php`;
}

export function classNameToPath(path: string, uri: Uri): string {
    const workspacePath = workspace.getWorkspaceFolder(uri)?.uri.fsPath;

    const parts = path.replace(/\./g, "/").split('-');
    const className = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    const classPath = `/app/View/Components/${className}.php`;

    if (existsSync(workspacePath + classPath)) {
        let file = readFileSync(workspacePath + classPath, 'utf-8');

        if (file) {
            let view = file.match(/(?<=return view\([\\'\"])[a-z.-]+/g);

            if (view) {
                return `/resources/views/${view[0].replace(/\./g, "/")}.blade.php`;
            }
        }
    }

    return '';
}

export function livewireNameToIndexPath(path: string): string {
    return `/resources/views/livewire/${path.replace(/\./g, "/")}/index.blade.php`;
}
