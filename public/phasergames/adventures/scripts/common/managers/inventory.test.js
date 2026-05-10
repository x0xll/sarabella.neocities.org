// math.test.js
const { InventoryManager } = require('./inventoryManager');

describe('Add items to inventory', () => {
  test('add single item', () => {
    const phaserScene = {
        sharedData: {}
    }
    const inventory = new InventoryManager(phaserScene)
    inventory.addItem("TestItem")
    expect(phaserScene.sharedData.inventory.allItems["TestItem"]).toBe(1);
  });

  test('add multiple items', () => {
    const phaserScene = {
        sharedData: {}
    }
    const inventory = new InventoryManager(phaserScene)
    inventory.addItem("TestItem", 3)
    expect(phaserScene.sharedData.inventory.allItems["TestItem"]).toBe(3);
  });
});

describe('Remove items from inventory', () => {
  test('remove single item', () => {
    const phaserScene = {
        sharedData: {}
    }
    const inventory = new InventoryManager(phaserScene)
    inventory.addItem("TestItem", 3)
    let removed = inventory.removeItem("TestItem")
    expect(removed).toBe(true);
    expect(phaserScene.sharedData.inventory.allItems["TestItem"]).toBe(2);
  });

  test('remove multiple items', () => {
    const phaserScene = {
        sharedData: {}
    }
    const inventory = new InventoryManager(phaserScene)
    inventory.addItem("TestItem", 3)
    let removed = inventory.removeItem("TestItem", 2)
    expect(removed).toBe(true);
    expect(phaserScene.sharedData.inventory.allItems["TestItem"]).toBe(1);
  });

  test('remove too many items', () => {
    const phaserScene = {
        sharedData: {}
    }
    const inventory = new InventoryManager(phaserScene)
    inventory.addItem("TestItem")
    expect(inventory.removeItem("TestItem", 2)).toBe(false);
  });
});

describe('Get item count', () => {
  test('count zero items', () => {
    const phaserScene = {
        sharedData: {}
    }
    const inventory = new InventoryManager(phaserScene)
    expect(inventory.getItemCount("TestItem")).toBe(0);
  });

  test('count multiple items', () => {
    const phaserScene = {
        sharedData: {}
    }
    const inventory = new InventoryManager(phaserScene)
    inventory.addItem("TestItem", 3)
    expect(inventory.getItemCount("TestItem")).toBe(3);
  });
});
