import Pokemon from 'model/pokemon';
import util from 'pokeutil';
import log from 'log';

describe('Pokemon', () => {
  // it('should figure out the pokemon owner', () => {
  //   const mon = new Pokemon('p1: Fakechu');
  //   expect(mon.owner).toBe('p1');
  // });
  describe('useDetails', () => {
    let mon;
    beforeEach( () => {
      spyOn(util, 'researchPokemonById').and.returnValue({});
      mon = new Pokemon('fakechu');
    });
    it('should figure out the species', () => {
      mon.useDetails('Fakechu, L83, M');
      expect(mon.species).toEqual('fakechu');
      expect(mon.level).toEqual(83);
      expect(mon.gender).toEqual('M');
    });

    it('should reject malformed details', () => {

    });
  });
  describe('useCondition', () => {
    let mon;
    beforeEach( () => {
      spyOn(util, 'researchPokemonById').and.returnValue({});
      mon = new Pokemon('fakechu');
    });
    it('should parse a healthy condition', () => {
      const cond = '100/100';
      mon.useCondition(cond);
      expect(mon.hp).toEqual(100);
      expect(mon.maxhp).toEqual(100);
      expect(mon.hppct).toEqual(100);
      expect(mon.condition).toEqual(cond);
      expect(mon.conditions.length).toEqual(0);
      expect(mon.dead).toBe(undefined);
    });

    it('should parse an unhealthy condition', () => {
      const cond = '25/250 par poi';
      mon.useCondition(cond);
      expect(mon.hp).toEqual(25);
      expect(mon.maxhp).toEqual(250);
      expect(mon.hppct).toEqual(10);
      expect(mon.condition).toEqual(cond);
      expect(mon.conditions.length).toEqual(2);
      expect(mon.dead).toBe(undefined);
    });

    it('should parse death', () => {
      const cond = '0 fnt';
      mon.useCondition(cond);
      expect(mon.hp).toEqual(0);
      expect(mon.hppct).toEqual(0);
      expect(mon.dead).toBe(true);
    });

    it('should reject malformed conditions', () => {
      spyOn(log, 'error');
      mon.useCondition('100');
      expect(log.error).toHaveBeenCalled();
    });

    it('should reject malformed conditions', () => {
      spyOn(log, 'error');
      mon.useCondition('sdajio fds');
      expect(log.error).toHaveBeenCalled();
    });

    it('should reject malformed conditions', () => {
      spyOn(log, 'error');
      mon.useCondition('100 ');
      expect(log.error).toHaveBeenCalled();
    });
  });
  describe('data', () => {
    let mon;
    beforeEach( () => {
      spyOn(util, 'researchPokemonById').and.returnValue({});
      mon = new Pokemon('Fakechu');
    });
    it('should return only what is set', () => {
      const cond = '25/250 par poi';
      mon.useCondition(cond);
      const res = mon.data();
      expect(res.condition).toEqual(cond);
      expect(res.conditions.length).toEqual(2);
      expect(res.dead).toBe(undefined);
    });
  });
  // removing for now because we're no longer calculating boostedStats automatically.
  //
  // describe('stat handling', () => {
  //   it('should process boosted stats', () => {
  //     spyOn(util, 'researchPokemonById').and.returnValue({
  //       stats: {atk: 100},
  //       boosts: {atk: 2}
  //     });
  //     const mon = new Pokemon('Fakechu');
  //     const res = mon.data();
  //     expect(res.stats.atk).toEqual(100);
  //     expect(res.boosts.atk).toEqual(2);
  //     expect(res.boostedStats.atk).toEqual(200);
  //   });
  // });
  describe('useBoost', () => {
    let mon;
    beforeEach( () => {
      spyOn(util, 'researchPokemonById').and.returnValue({});
      mon = new Pokemon('Fakechu');
    });
    it('should boost a stat', () => {
      mon.useBoost('atk', 1);
      expect(mon.data().boosts.atk).toEqual(1);

      mon.useBoost('atk', 2);
      expect(mon.data().boosts.atk).toEqual(3);

      mon.useBoost('atk', -3);
      expect(mon.data().boosts.atk).toBe(undefined);
    });

    it('should unboost a stat', () => {
      mon.useBoost('atk', -1);
      expect(mon.data().boosts.atk).toEqual(-1);

      mon.useBoost('atk', -2);
      expect(mon.data().boosts.atk).toEqual(-3);

      mon.useBoost('atk', 3);
      expect(mon.data().boosts.atk).toBe(undefined);
    });

    it('should limit boost level to 6', () => {
      mon.useBoost('atk', -7);
      expect(mon.data().boosts.atk).toEqual(-6);

      mon.useBoost('atk', 13);
      expect(mon.data().boosts.atk).toEqual(6);
    });


  });
});
