import { ExtensionContext } from 'vscode';
import { now } from './utils';

interface CacheRecordItem<T> {
  value?: T;
  expiration?: number;
}

type CacheRecord<T> = Record<string, CacheRecordItem<T>>;

export class Cache<T> {
  private context: ExtensionContext;

  private cache: CacheRecord<T>;

  private namespace: string;

  constructor(context: ExtensionContext, namespace?: string) {
    this.context = context;
    this.namespace = namespace || 'cache';

    const defaultValue: CacheRecordItem<T> = {
      value: undefined,
    };

    const currentContextValue = this.context.globalState.get(
      this.namespace,
      defaultValue,
    );

    this.cache = { [this.namespace]: currentContextValue };
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
      obj.expiration = now() + expiration;
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
    this.cache[key].value = undefined as T;
    this.cache[key].expiration = 0;

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
    const value = this.cache[key].value;
    if (value === undefined || this.isExpired(key)) {
      return false;
    }
    return true;
  }

  public keys(): string[] {
    return Object.keys(this.cache);
  }

  public all(): Record<string, T> {
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

    const value = this.cache[key].value;
    const expiration = this.cache[key].expiration;
    if (!value || !expiration) {
      return false;
    }
    // Is expiration >= right now?
    return now() >= expiration;
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
}
