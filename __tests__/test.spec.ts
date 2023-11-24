import { ExtensionContextMock } from '../mocks/ExtensionContextMock';
import { Cache } from '../src/main';
import { now } from '../src/utils';

describe('Cache', function () {
  describe('constructor', function () {
    it('should set the namespace', function () {
      const context = new ExtensionContextMock();
      const namespace = 'foo';
      const cache = new Cache(context, namespace);
      expect(cache.getNamespace()).toEqual(namespace);
    });

    it('should set the cache as an undefined', function () {
      const namespace = 'foo';
      const context = new ExtensionContextMock();
      const cache = new Cache<string>(context, namespace);
      expect(cache.get(namespace)).toBe(undefined);
    });

    it('should namespace multiple caches', async () => {
      const context = new ExtensionContextMock();

      const key = 'foo';
      const value = 'bar1';

      const cache1 = new Cache<string>(context, 'cache1');
      const cache2 = new Cache<string>(context, 'cache2');

      await cache1.put(key, value);
      await cache2.put(key, value);

      const outputFromCache1 = cache1.get(key);
      const outputFromCache2 = cache2.get(key);
      expect(outputFromCache1).toEqual(outputFromCache2);
    });
  });

  describe('put', function () {
    it('should set the value in the cache', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache<string>(context);
      const key = 'foo';
      const value = 'bar';

      await cache.put(key, value);
      expect(cache.get(key)).toEqual(value);
    });

    it('should set expirations', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const now = Math.floor(Date.now() / 1000);
      const lifetime = 5;
      const key = 'foo';
      const value = 'bar';

      await cache.put(key, value, lifetime);
      expect(cache.getExpiration(key)).toEqual(now + lifetime);
    });

    it('should expire items', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const lifetime = 1;
      const key = 'foo';
      const value = 'bar';
      await cache.put(key, value, lifetime);
      setTimeout(function () {
        const value = cache.get(key);
        expect(value).toEqual(undefined);
      }, 2000);
    });
  });

  describe('has', function () {
    it('should indicate when a cached item exists', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const key = 'foo';
      const value = 'bar';
      await cache.put(key, value);
      expect(cache.has(key)).toBeTruthy();
    });

    it('should indicate when an expired item exists', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const lifetime = 10_000;
      const key = 'foo';
      const value = 'bar';
      await cache.put(key, value, lifetime);
      expect(cache.has(key)).toBeTruthy();
    });
  });

  describe('forget', function () {
    it('should remove a cache item', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const key = 'foo';
      const value = 'bar';
      await cache.put(key, value);
      expect(cache.has(key)).toBeTruthy();
      await cache.forget(key);
      expect(cache.has(key)).toBeFalsy();
    });

    it('should return undefined if the cache item is not present', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const key = 'key';
      await cache.put('key', 'foo', 10);
      setTimeout(() => {
        expect(cache.has(key)).toBeUndefined();
      }, 2000);
    });
  });

  describe('keys', () => {
    it('should return an array of all cache keys', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const keys = ['cache', 'key1', 'key2', 'key3'];
      const value = 'foo';
      for (const key of keys) {
        await cache.put(key, value);
      }
      expect(cache.keys()).toEqual(keys);
    });
  });

  describe('all', function () {
    it('should return an object of all cached items', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const all = {
        foo1: 'bar1',
        foo2: 'bar2',
      };
      await cache.put('foo1', 'bar1');
      await cache.put('foo2', 'bar2', 10);
      expect(cache.all()).toEqual(all);
    });

    it('should return an empty object if there are no cache items', () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const expectedValue = {
        cache: undefined,
      };
      expect(cache.all()).toStrictEqual(expectedValue);
    });
  });

  describe('flush', function () {
    it('should empty the cache', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      await cache.put('foo', 'bar');
      expect(cache.get('foo')).toEqual('bar');
      await cache.flush();
      expect(cache.all()).toEqual({});
    });
  });

  describe('getExpiration', function () {
    it('should return the expiration for an item with an expiration', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      const lifetime = 10;
      const key = 'foo';
      await cache.put(key, 'bar', lifetime);
      const expectedValue = now() + lifetime;
      expect(cache.getExpiration(key)).toEqual(expectedValue);
    });
  });

  describe('isExpired', function () {
    it('should return false a key does not exist', async () => {
      const context = new ExtensionContextMock();
      const cache = new Cache(context);
      await cache.put('foo', 10);
      expect(!cache.isExpired('foo')).toBeTruthy();
    });
  });
});
