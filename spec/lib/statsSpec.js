import Stats from 'lib/stats';
describe('stats', () => {
  describe('_getNatureMultiplier', () => {
    it('should return 1 if nature is falsy', () => {
      expect(Stats._getNatureMultiplier(false, 'atk')).toBe(1);
      expect(Stats._getNatureMultiplier(undefined, 'atk')).toBe(1);
      expect(Stats._getNatureMultiplier(null, null)).toBe(1);
    });
    it('should return 1 if nature is invalid', () => {
      spyOn(console, 'log');
      expect(Stats._getNatureMultiplier('dopey', 'atk')).toBe(1);
    });
    it('should give 10% boosts to boosted stats', () => {
      expect(Stats._getNatureMultiplier('adamant', 'atk')).toBe(1.1);
      expect(Stats._getNatureMultiplier('naughty', 'atk')).toBe(1.1);
      expect(Stats._getNatureMultiplier('impish', 'def')).toBe(1.1);
    });
    it('should give 10% unboosts to unboosted stats', () => {
      expect(Stats._getNatureMultiplier('adamant', 'spa')).toBe(0.9);
      expect(Stats._getNatureMultiplier('naughty', 'spd')).toBe(0.9);
      expect(Stats._getNatureMultiplier('lonely', 'def')).toBe(0.9);
    });
    it('should return 1 for neutral stats', () => {
      expect(Stats._getNatureMultiplier('bashful', 'atk')).toBe(1);
      expect(Stats._getNatureMultiplier('bashful', 'def')).toBe(1);
      expect(Stats._getNatureMultiplier('hardy', 'spa')).toBe(1);
      expect(Stats._getNatureMultiplier('quirky', 'spd')).toBe(1);
      expect(Stats._getNatureMultiplier('serious', 'spe')).toBe(1);
    });
  });
  describe('_assumeStat', () => {
    const base = {
      stats: {},
      baseStats: {
        atk: 1,
        hp: 1
      },
      level: 100
    };
    let mon;
    beforeEach( () => {
      mon = {};
      Object.assign(mon, base);
      mon.stats = {}; // don't know why I have to do this, but I do
    });
    it('should get correct results for 0 EVs', () => {
      Stats._assumeStat(mon, 'atk', 0);
      expect(mon.stats.atk).toEqual(38);
    });
    it('should get correct results for 252 EVs', () => {
      Stats._assumeStat(mon, 'atk', 252);
      expect(mon.stats.atk).toEqual(38 + 63);
    });
    it('should get correct results for 252 EVs assuming good nature', () => {
      mon.nature = 'brave';
      Stats._assumeStat(mon, 'atk', 252);
      expect(mon.stats.atk).toEqual(Math.floor((38 + 63) * 1.1));
    });
    it('should get correct results for 252 EVs with good nature', () => {
      Stats._assumeStat(mon, 'atk', 252, 1.1);
      expect(mon.stats.atk).toEqual(Math.floor((38 + 63) * 1.1));
    });
    it('should get correct results for 252 EVs assuming bad nature', () => {
      mon.nature = 'calm';
      Stats._assumeStat(mon, 'atk', 252);
      expect(mon.stats.atk).toEqual(Math.floor((38 + 63) * 0.9));
    });
    it('should get correct results for 252 EVs with bad nature', () => {
      Stats._assumeStat(mon, 'atk', 252, 0.9);
      expect(mon.stats.atk).toEqual(Math.floor((38 + 63) * 0.9));
    });
    it('should get base HP for 0 EVs', () => {
      Stats._assumeStat(mon, 'hp', 0);
      expect(mon.stats.hp).toEqual(33 + 100 + 10);
    });
    it('should get base HP for 252 EVs', () => {
      Stats._assumeStat(mon, 'hp', 252);
      expect(mon.stats.hp).toEqual(33 + 63 + 100 + 10);
    });
    it('should get base HP for a lower level', () => {
      mon.level = 50;
      Stats._assumeStat(mon, 'hp', 252);
      expect(mon.stats.hp).toEqual((33 + 63) * 0.5 + 50 + 10);
    });
    it('should match this poliwrath math I\'m doing', () => {
      mon.level = 81;
      mon.baseStats = {
        'hp': 90,
        'atk': 95,
        'def': 95,
        'spa': 70,
        'spd': 90,
        'spe': 70,
      };
      Stats._assumeStat(mon, 'hp', 85);
      Stats._assumeStat(mon, 'atk', 85);
      Stats._assumeStat(mon, 'def', 85);
      Stats._assumeStat(mon, 'spa', 85);
      Stats._assumeStat(mon, 'spd', 85);
      Stats._assumeStat(mon, 'spe', 85);
      expect(mon.stats.hp).toBeCloseTo(278);
      expect(mon.stats.atk).toBeCloseTo(201);
      expect(mon.stats.def).toBeCloseTo(201);
      expect(mon.stats.spa).toBeCloseTo(160);
      expect(mon.stats.spd).toBeCloseTo(192);
      expect(mon.stats.spe).toBeCloseTo(160);
    });
  });
});