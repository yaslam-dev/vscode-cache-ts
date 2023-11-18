export const ExtensionContextMock = function () {
  this.globalState = {};

  // Get the cached item
  this.globalState.get = function (key, defaultValue): undefined {
    // If key does not exist
    if (typeof this[key] === 'undefined') {
      // If default value is provided
      if (typeof defaultValue !== 'undefined') {
        return defaultValue;
      } else {
        return undefined;
      }
    } else {
      return this[key];
    }
  };

  // Update a cached item
  this.globalState.update = function (key, value) {
    this[key] = value;

    return new Promise((resolve) => {
      resolve(true);
    });
  };
};
