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
import { updateLinks } from "./UpdateLinks";

export default class BladeLinkProvider implements DocumentLinkProvider {
    public provideDocumentLinks(
        doc: TextDocument
    ): ProviderResult<DocumentLink[]> {
        return updateLinks(doc);
    }
}
