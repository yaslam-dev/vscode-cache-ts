import {
  Extension,
  ExtensionContext,
  ExtensionMode,
  GlobalEnvironmentVariableCollection,
  Memento,
  SecretStorage,
  Uri,
} from 'vscode';

export class ExtensionContextMock implements ExtensionContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptions: { dispose(): any }[];
  workspaceState: Memento;
  secrets: SecretStorage;
  extensionUri: Uri;
  extensionPath: string;
  environmentVariableCollection: GlobalEnvironmentVariableCollection;
  storageUri: Uri;
  storagePath: string;
  globalStorageUri: Uri;
  globalStoragePath: string;
  logUri: Uri;
  logPath: string;
  extensionMode: ExtensionMode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extension: Extension<any>;

  globalState;

  constructor() {
    this.globalState = {};
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asAbsolutePath(relativePath: string): string {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: string, defaultValue?: any): undefined | any {
    if (this.globalState[key] === undefined) {
      // If default value is provided
      if (defaultValue !== undefined) {
        return defaultValue;
      } else {
        return undefined;
      }
    } else {
      return this.globalState[key];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(key: string, value: any): Thenable<any> {
    this.globalState[key] = value;

    return new Promise((resolve) => {
      resolve(this.globalState[key]);
    });
  }
}
