# Blazing Fast vscode cache

_[vscode-cache-ts](https://github.com/yaslam-dev/vscode-cache-ts) is a typed abstraction of the [VSCode API](https://code.visualstudio.com/api/references/vscode-api#Memento) `ExtensionContext.globalState` interface._

## Installation

Install vscode-cache-ts with npm

```bash
  npm install vscode-cache-ts
```

with yarn

```bash
  yarn add vsode-cache-ts
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Basic Usage

```typescript
import Cache from 'vscode-cache-ts';

// Extension activation method
let activate = (extensionContext) => {
  // Instantiate the cache by passing your `ExtensionContext` object into it
  let myCache = new Cache<string>(extensionContext);

  // Save an item to the cache by specifying a key and value
  myCache.put('userName', 'John Doe').then(() => {
    // Does the cache have userName?
    console.log(myCache.has('userName')); // returns true

    // Fetch the userName from the cache
    let userName = myCache.get('userName');
  });
};
```

```typescript
import Cache from 'vscode-cache-ts';

// Dummy interface to communicate automatic type inference
interface QueryResponse {
  result: string;
}

const resultJSON: QueryResponse = {
  result: '200',
};

// Extension activation method
let activate = async (extensionContext) => {
  // Instantiate the cache by passing your `ExtensionContext` object into it
  const namespace = 'result';
  const myCache = new Cache<QueryResponse>(extensionContext, namespace);

  // Save an item to the cache by specifying a key and value
  await myCache.put(namespace, resultJSON);

  if (myCache.has(namespace)) {
    console.log(myCache.has(namespace));
    // Fetch the resultJSON from the cache
    // notice the unwrapped value will uphold the contract by QueryResponse
    let userName: QueryResponse = myCache.get(namespace);
  }
};
```

## Optional expirations

You can optionally pass an expiration/lifetime (in seconds) for the cached item. If the current time is passed the expiration, then the cache no longer has it.

```javascript
// Save something in the cache for 5 seconds
myCache.put('searchResults', results, 5).then(() => {
  // Does the cache still have it?
  console.log(myCache.has('searchResults')); // returns true

  // Does the cache still have it 10 seconds later?
  setTimeout(() => {
    console.log(myCache.has('searchResults')); // returns false
  }, 10000);
});
```

## Default values

You can optionally specify a default value when fetching a cache item just in case it doesn't exist or is expired.

```javascript
// Does the cache contain this value?
myCache.has('foo'); // returns false

// Fetch the value of foo, but give it a default value of "bar"
let foo = myCache.get('foo', 'bar');

console.log(foo); // returns bar
```

## Custom Namespaces

You can specify an optional namespace when instantiating your cache just in case you wanted more than one cache. This keeps them separate within the `globalState` object. The advantage of this is that you can use the same cache keys on different caches in order to store different values.

```javascript
// Create a cache for some API
let apiCache = new Cache(extensionContext, 'api');

// Create some sort of database cache
let databaseCache = new Cache(extensionContext, 'database');

// Store a value into the api cache using the key 'foo'
apiCache.put('foo', apiResults);

// Store a different value into the database cache using the key 'foo'
databaseCache.put('foo', databaseResults);

// Because there are two caches, you can use the same keys in each without overriding values
```

## Authors

- [@yaslam-dev](https://github.com/yaslam-dev)

## Acknowledgements

- [Vscode Cache](https://github.com/Jakobud/vscode-cache)

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
