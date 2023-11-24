import { ExtensionContextMock } from '../mocks/ExtensionContextMock';

// Test ExtensionContext Mock
describe('ExtensionContextMock', function () {
  describe('globalState.update()', function () {
    it('should return true when updating a value', async () => {
      const context = new ExtensionContextMock();
      await context.globalState.update('foo', 'bar');
      const value = context.globalState.get('foo');
      expect(value).toBeTruthy();
    });

    it('should return true when updating value with undefined', async () => {
      const context = new ExtensionContextMock();
      await context.globalState.update('foo', undefined);
      const value = context.globalState.get('foo');
      expect(value).toEqual(undefined);
    });
  });

  describe('globalState.get()', function () {
    it('should return the value when getting the value', async () => {
      const context = new ExtensionContextMock();
      await context.globalState.update('foo', 'bar');
      const value = context.globalState.get('foo');
      expect(value).toEqual('bar');
    });
  });
});
