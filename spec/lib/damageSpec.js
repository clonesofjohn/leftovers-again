import Damage from 'lib/damage';
import Research from 'lib/research';
import util from 'pokeutil';

describe('damage calculator', () => {
  describe('normal moves', () => {
    it('should handle some normal moves', () => {
      // 85 bp
      const bodyslam = Damage.getDamageResult(
        Research.researchMon('eevee'),
        Research.researchMon('meowth'), 'bodyslam');
      // 120 bp
      const doubleedge = Damage.getDamageResult(
        Research.researchMon('eevee'),
         Research.researchMon('meowth'), 'doubleedge');

      expect(bodyslam[0]).toBeLessThan(doubleedge[0]);
    });

    it('should do less damage to rock & steel', () => {
      const groundtype = Damage.getDamageResult(
        Research.researchMon('eevee'),
        Research.researchMon('muk'), 'bodyslam');
      const rocktype = Damage.getDamageResult(
        Research.researchMon('eevee'),
        Research.researchMon('geodude'), 'bodyslam');
      const steeltype = Damage.getDamageResult(
        Research.researchMon('eevee'),
        Research.researchMon('klang'), 'bodyslam');

      expect(rocktype[0]).toBeLessThan(groundtype[0]);
      expect(steeltype[0]).toBeLessThan(groundtype[0]);
    });

    it('should do NO damage to ghost types', () => {
      const ghosttype = Damage.getDamageResult(
        Research.researchMon('eevee'),
        Research.researchMon('gengar'), 'bodyslam');

      expect(ghosttype[0]).toEqual(0);
      expect(ghosttype[ghosttype.length - 1]).toEqual(0);
    });
  });
  describe('boosts', () => {
    it('should handle +1 boosted attack', () => {
      const raw = Research.researchMon({
        species: 'eevee'
      });

      const boosted = Research.researchMon({
        species: 'eevee',
        boosts: {atk: 1}
      });

      const defender = Research.researchMon('geodude');

      // hacky
      raw.boostedStats.atk = raw.boostedStats.atk * 1.5;

      const boostedDmg = Damage.getDamageResult(boosted, defender, 'bodyslam');
      const rawDmg = Damage.getDamageResult(raw, defender, 'bodyslam');
      expect(boostedDmg).toEqual(rawDmg);
    });
    it('should handle +2 boosted attack', () => {
      const raw = Research.researchMon({
        species: 'eevee'
      });

      const boosted = Research.researchMon({
        species: 'eevee',
        boosts: {atk: 2}
      });

      const defender = Research.researchMon('geodude');

      // hacky
      raw.boostedStats.atk = raw.boostedStats.atk * 2;

      const boostedDmg = Damage.getDamageResult(boosted, defender, 'bodyslam');
      const rawDmg = Damage.getDamageResult(raw, defender, 'bodyslam');
      expect(boostedDmg).toEqual(rawDmg);
    });
    it('should handle +2 boosted defense', () => {
      const raw = Research.researchMon({
        species: 'eevee'
      });

      const boosted = Research.researchMon({
        species: 'eevee',
        boosts: {def: 2}
      });

      const defender = Research.researchMon('geodude');

      // hacky
      raw.boostedStats.def = raw.boostedStats.def * 2;

      const boostedDmg = Damage.getDamageResult(boosted, defender, 'bodyslam');
      const rawDmg = Damage.getDamageResult(raw, defender, 'bodyslam');
      expect(boostedDmg).toEqual(rawDmg);
    });
  });

  describe('weather', () => {
    describe('Sunny Day', () => {
      let eevee;
      let meowth;
      beforeEach( () => {
        eevee = Research.researchMon('eevee');
        meowth = Research.researchMon('meowth');
      });
      it('should enhance fire moves', () => {
        const sunny = Damage.getDamageResult(
          eevee, meowth, 'overheat', {weather: 'SunnyDay'}, true);
        const cloudy = Damage.getDamageResult(
          eevee, meowth, 'overheat', {weather: 'None'}, true);
        expect(cloudy * 1.5).toBeCloseTo(sunny);
      });
      it('should dehance water moves', () => {
        const sunny = Damage.getDamageResult(
          meowth, meowth, 'hydropump', {weather: 'SunnyDay'}, true);
        const cloudy = Damage.getDamageResult(
          meowth, meowth, 'hydropump', {weather: 'None'}, true);
        expect(cloudy * 0.5).toBeCloseTo(sunny);
      });
    });
  });
});
