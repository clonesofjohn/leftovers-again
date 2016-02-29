/**
 * Utility functions.
 *
 */
import BattleMovedex from 'data/moves';
import BattlePokedex from 'data/pokedex';
import log from 'log';

class PokeUtil {
  toId(text) {
    let name = '';
    if (text) {
      // most lines copied from server code..
      name = ('' + text).replace(/[\|\s\[\]\,\']+/g, '').toLowerCase().trim();

      // these two are not! but I needed them.
      name = name.replace('-', '');
      name = name.replace('.', '');
      name = name.replace(' ', '');

      if (name.length > 18) name = name.substr(0, 18).trim();
    }
    return name;
  }

  researchMoveById(id) {
    // hidden power moves end with '60'. hidden power ground comes out as
    // hiddenpowerground6 due to the 18-character limit. it's kept as
    // hiddenpowerground in our data.
    id = this.toId(id).replace(/6[0]?$/,''); // eslint-disable-line
    if (BattleMovedex[id]) return BattleMovedex[id];

    log.warn('couldn\'t find my move ' + id );
    return {name: id, id: this.toId(id)};
  }

  researchPokemonById(id) {
    id = this.toId(id); // eslint-disable-line
    if (BattlePokedex[id]) return BattlePokedex[id];

    log.warn('couldn\'t find my pokemon ' + id );
    return {name: id, id};
  }

  /**
   * Apply boost levels to a stat.
   *
   * @param  {Number} stat The calculated stat.
   * @param  {Number} mod  The boost level, from -6 to 6.
   * @return {Number} The stat including the boost multiplier.
   */
  boostMultiplier(stat, mod = 0) {
    console.log(stat, mod);
    return mod > 0 ? Math.floor(stat * (2 + mod) / 2)
    : mod < 0 ? Math.floor(stat * 2 / (2 - mod))
      : stat;
  }

  updateBoosts(orig = {}, additional) {
    Object.keys(additional).forEach( (stat) => {
      const current = orig[stat] || 0;
      const next = Math.max(-6, Math.min(6, current + additional[stat]));
      if (next === 0) {
        delete orig[stat];
      } else {
        orig[stat] = next;
      }
    });
    return orig;
  }
}

const util = new PokeUtil();
export default util;
