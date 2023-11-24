import {
  Extension,
  ExtensionContext,
  ExtensionMode,
  GlobalEnvironmentVariableCollection,
  Memento,
  SecretStorage,
  Uri,
} from 'vscode';

interface GlobalStateMememto extends Memento {
  setKeysForSync(keys: readonly string[]): void;
}

class globalStateMememto<T> implements GlobalStateMememto {
  globalState: Record<string, T>;

  constructor() {
    this.globalState = {};
  }

  keys(): readonly string[] {
    return Object.keys(this.globalState);
  }

  get<T>(key: string, defaultValue?: T) {
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

  update(key: string, value: T): Thenable<void> {
    this.globalState[key] = value;

    return new Promise((resolve) => {
      resolve();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setKeysForSync(_keys: readonly string[]): void {
    throw new Error('Method not implemented.');
  }
}

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

  globalState: Memento & {
    setKeysForSync(keys: readonly string[]): void;
  };

  constructor() {
    this.globalState = new globalStateMememto();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asAbsolutePath(_relativePath: string): string {
    throw new Error('Method not implemented.');
  }
}
