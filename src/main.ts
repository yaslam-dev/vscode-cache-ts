import { ExtensionContext } from 'vscode';

export class Cache<T> {
  private context: ExtensionContext;

  private cache: {
    [key: string]: {
      value: T;
      expiration?: number;
    };
  };

  private namespace: string;

  constructor(context: ExtensionContext, namespace?: string) {
    this.context = context;
    this.namespace = namespace || 'cache';
    this.cache = this.context.globalState.get(this.namespace, {});
  }

  public put(key: string, value: T, expiration?: number): Thenable<void> {
    const obj: {
      value: T;
      expiration?: number;
    } = {
      value: value,
    };

    // Set expiration
    if (expiration && Number.isInteger(expiration)) {
      obj.expiration = this.now() + expiration;
    }

    // Save to local cache object
    this.cache[key] = obj;

    // Save to extension's globalState
    return this.context.globalState.update(this.namespace, this.cache);
  }

  public forget(key: string): undefined | Thenable<void> {
    if (!this.has(key)) {
      return undefined;
    }

    // Delete from local object
    delete this.cache[key];

    // Update the extension's globalState
    return this.context.globalState.update(this.namespace, this.cache);
  }

  public get(key: string): T | undefined {
    if (!this.has(key)) {
      return undefined;
    }

    return this.cache[key].value;
  }

  public has(key: string): boolean {
    if (this.cache[key] === undefined || this.isExpired(key)) {
      return false;
    }
    return true;
  }

  public keys(): string[] {
    return Object.keys(this.cache);
  }

  public all(): {
    [key: string]: T;
  } {
    const items = {};
    for (const key in this.cache) {
      items[key] = this.cache[key].value;
    }
    return items;
  }

  public flush(): Thenable<void> {
    this.cache = {};
    return this.context.globalState.update(this.namespace, undefined);
  }

  public isExpired(key: string): boolean {
    // If key doesn't exist or it has no expiration
    if (
      this.cache[key] === undefined ||
      this.cache[key].expiration === undefined
    ) {
      return false;
    }
    // Is expiration >= right now?
    return this.now() >= this.cache[key].expiration;
  }

  public getExpiration(key: string): undefined | number {
    if (!this.has(key)) {
      return undefined;
    }

    return this.cache[key].expiration;
  }

  public getNamespace(): string {
    return this.namespace;
  }

  private now(): number {
    return Math.floor(Date.now() / 1000);
  }
}
