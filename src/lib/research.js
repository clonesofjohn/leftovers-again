import Natures from 'data/natures';
import util from 'pokeutil';
// what we've got:
// {
//   "ident": "p2: Gligar",
//   "details": "Gligar, L77, M",
//   "condition": "227/227",
//   "active": true,
//   "stats": {
//     "atk": 160,
//     "def": 206,
//     "spa": 98,
//     "spd": 145,
//     "spe": 175
//   },
//   "moves": [
//     "roost",
//     "uturn",
//     "stealthrock",
//     "earthquake"
//   ],
//   "baseAbility": "immunity",
//   "item": "eviolite",
//   "pokeball": "pokeball",
//   "canMegaEvo": false
// }

const AT = 'atk';
const DF = 'def';
const SA = 'spa';
const SD = 'spd';
const SP = 'spe';
const HP = 'hp';
const ASSUME_LEVEL = 75;

// const STATS = [AT, DF, SA, SD, SP, HP];

const researchFieldsForActiveMon = ['types', 'height', 'weight', 'baseStats'];
const researchFieldsForOpponentMon = ['abilities'];

class Research {
  constructor() {
  }

  researchMon(mon, isMine = false, dangerouslyCalculateStats = true) {
    if (typeof mon === 'string') {
      mon = {species: mon}; // eslint-disable-line
      console.log(mon);
    }
    this.readFromPokedex(mon, isMine);

    // stats: at this point, we have baseStats for everyone, and stats for
    // our own mons. this is 'dangerous' because you will make guesses about
    // the mon's evs and ivs. If these guesses are wrong, 'stats' and
    // 'boostedStats' will be wrong for your opponent's mon.
    if (dangerouslyCalculateStats) {
      this.calculateStats(mon);
      this.checkHP(mon);
    }
    return mon;
  }

  readFromPokedex(mon, isMine) {
    const key = util.toId(mon.species);
    const research = util.researchPokemonById(key);
    researchFieldsForActiveMon.forEach(field => {
      mon[field] = research[field];
    });
    if (!isMine) {
      researchFieldsForOpponentMon.forEach(field => {
        mon[field] = research[field];
      });

      // possible moves
    }
  }

  checkHP(mon) {
    if (mon.hppct && mon.stats.hp) {
      mon.maxhp = mon.stats.hp;
      mon.hp = mon.stats.hp * mon.hppct / 100;
    }
  }

  /**
   * Calculate the 'stats' object, which takes baseStats, boosts, EVs, and IVs
   * into account. Default values are provided for boosts, EVs, and IVs if the
   * object doesn't currently have these set.
   *
   * @param  A reference to the mon in question.
   * @return The pokemon, with updated values for 'boosts', 'evs', 'ivs',
   * 'stats', and 'boostedStats'.
   */
  calculateStats(mon) {
    mon.level = mon.level || ASSUME_LEVEL;
    mon.boosts = Object.assign({
      [AT]: 0,
      [DF]: 0,
      [SA]: 0,
      [SD]: 0,
      [SP]: 0
    }, mon.boosts);

    mon.evs = Object.assign({
      [AT]: 84,
      [DF]: 84,
      [SA]: 84,
      [SD]: 84,
      [SP]: 84,
      [HP]: 84
    }, mon.evs);

    mon.ivs = Object.assign({
      [AT]: 31,
      [DF]: 31,
      [SA]: 31,
      [SD]: 31,
      [SP]: 31,
      [HP]: 31
    }, mon.ivs);

    // REMINDER: if it exists, 'stats' is already modified based on baseStats,
    // EVs, IVs, and level, but not boosts!
    if (!mon.stats) {
      mon.stats = {};
    }
    [AT, SA, DF, SD, SP, HP].forEach( stat => {
      if (!mon.stats[stat]) {
        this._assumeStat(mon, stat);
      }
    });

    if (!mon.boostedStats) {
      mon.boostedStats = {};
    }
    [AT, SA, DF, SD, SP].forEach( stat => {
      mon.boostedStats[stat] = this._getModifiedStat(
        mon.stats[stat], mon.boosts[stat]);
    });
    return mon;
  }

  /**
   * Updates a certain stat if it isn't already set.

   * @param  {Object} mon The pokemon object. This is modified directly.
   * Expects the following properties:
   * level: {Number} The Pokemon's level
   * baseStats: {Object} The Pokemon's unmodified (pre-EV and IV) stats
   * stats: {Object} The Pokemon's modified stats.
   * nature: {String} (optional) The Pokemon's nature; use natureMultiplier if
   * this is undefined.
   * @param  {Enum/String} stat The stat to maybe update.
   * @param  {Number} evs The EV number, ex. 252.
   * @param  {Number} natureMultiplier The nature multiplier to use if the
   *                                   mon doesn't have a nature set. Should
   *                                   be in [0.9, 1, 1.1].
   */
  _assumeStat(mon, stat, evs = 85, natureMultiplier = 1) {
    if (!mon.stats[stat]) {
      mon.stats[stat] = this._calculateStat(mon, stat, evs, natureMultiplier);
    }
    return mon;
  }

  /**
   * Calculates a certain stat.
   *
   * HP = ((Base * 2 + IV + EV/4) * Level / 100) + Level + 10
   * Stat = (((Base * 2 + IV + EV/4) * Level / 100) + 5) * Naturemod
   *
   * @param  {Object} mon The pokemon object. This is modified directly.
   * Expects the following properties:
   * level: {Number} The Pokemon's level
   * baseStats: {Object} The Pokemon's unmodified (pre-EV and IV) stats
   * stats: {Object} The Pokemon's modified stats.
   * nature: {String} (optional) The Pokemon's nature; use natureMultiplier if
   * this is undefined.
   * @param  {Enum/String} stat The stat to maybe update.
   * @param  {Number} evs The EV number, ex. 252.
   * @param  {Number} natureMultiplier The nature multiplier to use if the
   *                                   mon doesn't have a nature set. Should
   *                                   be in [0.9, 1, 1.1].
   */
  _calculateStat(mon, stat, evs = 0, natureMultiplier = 1) {
    const evBonus = Math.floor(evs / 4);
    const addThis = stat === 'hp' ? (mon.level + 10) : 5;
    const calculated = ((mon.baseStats[stat] * 2 + 31 + evBonus) *
      (mon.level / 100) + addThis);

    const nature = (mon.nature
        ? this._getNatureMultiplier(mon.nature, stat)
        : natureMultiplier);

    return Math.floor(calculated * nature);
  }

  /**
   * Get the multiplier for a given nature and stat.
   *
   * @param  {String/Enum} nature A nature.
   * @param  {String/Enum} stat   A stat.
   * @return {Number} A number in [0.9, 1, 1.1]. 1 is returned for undefined
   * natures.
   */
  _getNatureMultiplier(nature, stat) {
    if (!nature) return 1;
    if (!Natures[nature]) {
      console.log('invalid nature! ' + nature);
      return 1;
    }
    if (Natures[nature][0] === stat) return 1.1;
    if (Natures[nature][1] === stat) return 0.9;
    return 1;
  }

  _getModifiedStat(stat, mod) {
    return mod > 0 ? Math.floor(stat * (2 + mod) / 2)
      : mod < 0 ? Math.floor(stat * 2 / (2 - mod))
        : stat;
  }


}


export default new Research();
