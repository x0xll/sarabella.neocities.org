// math.test.js
const { LevelManager } = require('./levelManager');

describe('Add experience to Magic Tree', () => {
    test('add experience', () => {
        const phaserScene = {
            sharedData: 
            {
                magicTree: {
                    logic: {}
                }
            }
        }
        const tree = new LevelManager(phaserScene)
        tree.addExperience(10)
        expect(phaserScene.sharedData.magicTree.logic.experience).toBe(10);
    });

    test('add experience to pass a level', () => {
        const phaserScene = {
            sharedData: 
            {
                magicTree: {
                    logic: {}
                }
            }
        }
        const tree = new LevelManager(phaserScene)
        tree.addExperience(75)
        expect(phaserScene.sharedData.magicTree.logic.level).toBe(2);
    });

    test('add too much experience', () => {
        const phaserScene = {
            sharedData: 
            {
                magicTree: {
                    logic: {}
                }
            }
        }
        const tree = new LevelManager(phaserScene)
        tree.addExperience(10000000)
        expect(phaserScene.sharedData.magicTree.logic.level).toBe(12);
        expect(phaserScene.sharedData.magicTree.logic.experience).toBe(10000000)
    });
});