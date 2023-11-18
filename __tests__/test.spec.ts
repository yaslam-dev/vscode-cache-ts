import { ExtensionContextMock } from '../mocks/ExtensionContextMock';
import { Cache } from '../src/main';

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

    // it('returned Promise should resolve to false if a numeric key is provided', function () {
    //   const context = new ExtensionContext();
    //   const cache = new Cache(context);
    //   return cache.put(100, 'bar').then(function (success) {
    //     assert.equal(success, false);
    //   });
    // });

    // it('returned Promise should resolve to false if an object key is provided', function () {
    //   const context = new ExtensionContext();
    //   const cache = new Cache(context);
    //   const obj = {};
    //   return cache.put(obj, 'bar').then(function (success) {
    //     assert.equal(success, false);
    //   });
    // });

    // it('returned Promise should resolve to false if a boolean key is provided', function () {
    //   const context = new ExtensionContext();
    //   const cache = new Cache(context);
    //   return cache.put(true, 'bar').then(function (success) {
    //     assert.equal(success, false);
    //   });
    // });

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

    //   it('should expire items', function (done) {
    //     this.timeout(3000);

    //     const context = new ExtensionContext();
    //     const cache = new Cache(context);
    //     const now = Math.floor(Date.now() / 1000);
    //     const lifetime = 1;
    //     const key = 'foo';
    //     const value = 'bar';
    //     cache.put(key, value, lifetime).then(function () {
    //       setTimeout(function () {
    //         assert.equal(typeof cache.get(key), 'undefined');
    //         done();
    //       }, 2000);
    //     });
    //   });
  });

  // describe('has', function () {
  //   it('should indicate when a cached item exists', function () {
  //     const context = new ExtensionContext();
  //     const cache = new Cache(context);
  //     const key = 'foo';
  //     const value = 'bar';
  //     return cache.put(key, value).then(function () {
  //       assert(cache.has(key));
  //     });
  //   });

  //   it('should indicate when an expired item does not exist', function (done) {
  //     this.timeout(3000);

  //     const context = new ExtensionContext();
  //     const cache = new Cache(context);
  //     const now = Math.floor(Date.now() / 1000);
  //     const lifetime = 1;
  //     const key = 'foo';
  //     const value = 'bar';
  //     cache.put(key, value, lifetime).then(function () {
  //       setTimeout(function () {
  //         assert.equal(cache.has(key), false);
  //         done();
  //       }, 2000);
  //     });
  //   });
  // });

  // describe('forget', function () {
  //   it('should remove a cache item', function () {
  //     const context = new ExtensionContext();
  //     const cache = new Cache(context);
  //     const key = 'foo';
  //     const value = 'bar';
  //     return cache
  //       .put(key, value)
  //       .then(function () {
  //         return cache.forget(key);
  //       })
  //       .then(function () {
  //         assert.equal(cache.has(key), false);
  //       });
  //   });
  // });

  // describe('keys', function () {
  //   it('should return an array of all cache keys', function (done) {
  //     const context = new ExtensionContext();
  //     const cache = new Cache(context);
  //     const keys = ['key1', 'key2', 'key3'];
  //     const value = 'foo';
  //     const promises = [];
  //     for (const key of keys) {
  //       promises.push(
  //         new Promise(function (resolve, reject) {
  //           cache.put(key, value).then(function () {
  //             resolve(key);
  //           });
  //         }),
  //       );
  //     }
  //     Promise.all(promises).then(function (values) {
  //       assert.deepEqual(cache.keys(), keys);
  //       done();
  //     });
  //   });
  // });

  // describe('all', function () {
  //   it('should return an object of all cached items', function () {
  //     const context = new ExtensionContext();
  //     const cache = new Cache(context);
  //     const all = {
  //       foo1: 'bar1',
  //       foo2: 'bar2',
  //     };
  //     return cache
  //       .put('foo1', 'bar1')
  //       .then(function () {
  //         return cache.put('foo2', 'bar2', 10);
  //       })
  //       .then(function () {
  //         assert.deepEqual(cache.all(), all);
  //       });
  //   });

  //   it('should return an empty object if there are no cache items', function () {
  //     const context = new ExtensionContext();
  //     const cache = new Cache(context);
  //     assert.deepEqual(cache.all(), {});
  //   });
  // });

  // describe('flush', function () {
  //   it('should empty the cache', function () {
  //     const context = new ExtensionContext();
  //     const cache = new Cache(context);
  //     return cache
  //       .put('foo', 'bar')
  //       .then(function () {
  //         assert.notDeepEqual(cache.all(), {});
  //         return cache.flush();
  //       })
  //       .then(function () {
  //         assert.deepEqual(cache.all(), {});
  //       });
  //   });
  // });

  //   describe('getExpiration', function () {
  //     it('should return the expiration for an item with an expiration', function () {
  //       const context = new ExtensionContext();
  //       const cache = new Cache(context);
  //       const now = Math.floor(Date.now() / 1000);
  //       const lifetime = 10;
  //       const key = 'foo';
  //       return cache.put(key, 'bar', lifetime).then(function () {
  //         assert.equal(cache.getExpiration(key), now + lifetime);
  //       });
  //     });

  //     it('should return undefined for an item without an expiration', function () {
  //       const context = new ExtensionContext();
  //       const cache = new Cache(context);
  //       const key = 'foo';
  //       return cache.put(key, 'bar').then(function () {
  //         assert.equal(typeof cache.getExpiration(key), 'undefined');
  //       });
  //     });

  //     it('should return undefined for a non-existent item', function () {
  //       const context = new ExtensionContext();
  //       const cache = new Cache(context);
  //       assert.equal(typeof cache.getExpiration('foo'), 'undefined');
  //     });
  //   });

  //   describe('isExpired', function () {
  //     it('should return true if an item is expired', function (done) {
  //       this.timeout(3000);
  //       const context = new ExtensionContext();
  //       const cache = new Cache(context);
  //       const lifetime = 1;
  //       const key = 'foo';
  //       cache.put(key, 'bar', lifetime).then(function () {
  //         setTimeout(function () {
  //           assert.ok(cache.isExpired(key));
  //           done();
  //         }, 2000);
  //       });
  //     });

  //     it('should return false if an item is not expired', function () {
  //       this.timeout(3000);
  //       const context = new ExtensionContext();
  //       const cache = new Cache(context);
  //       const lifetime = 1;
  //       const key = 'foo';
  //       return cache.put(key, 'bar', lifetime).then(function () {
  //         assert.ok(!cache.isExpired(key));
  //       });
  //     });

  //     it('should return false an item does not expire', function () {
  //       const context = new ExtensionContext();
  //       const cache = new Cache(context);
  //       const key = 'foo';
  //       return cache.put(key, 'bar').then(function () {
  //         assert.ok(!cache.isExpired(key));
  //       });
  //     });

  //     it('should return false a key does not exist', function () {
  //       const context = new ExtensionContext();
  //       const cache = new Cache(context);
  //       assert.ok(!cache.isExpired('foo'));
  //     });
  //   });
});
