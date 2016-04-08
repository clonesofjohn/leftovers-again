import util from 'pokeutil';
import Pokemon from 'model/pokemon';
import Log from 'log';

class Pokebarn {
  constructor() {
    this.allmon = [];
  }

  all() {
    return this.allmon;
  }

  create(ident, details, owner = null) {
    const res = new Pokemon(ident, details, owner);
    this.allmon.push(res);
    return res;
  }

  find(ident) {
    const searchFor = util.identWithoutPosition(ident);
    const matches = this.allmon.filter((mon) => searchFor === mon.ident);
    if (matches.length > 1) {
      Log.error('Found multiple mons with the same ident! o fuck');
      Log.error(matches);
    }
    return matches[0];
  }

  /**
   * Somet
   * @param  {[type]} ident   [description]
   * @param  {[type]} details [description]
   * @return {[type]}         [description]
   */
  findWithoutIdent(owner, details) {
    const species = details.split(',')[0];
    const matches = this.allmon.filter((mon) => !mon.ident &&
      owner === mon.owner && species === mon.species
    );
    return matches[0];
  }

  /**
   * Finds or creates a Pokemon from the given information.
   *
   * @param  {[type]} ident   The ident of the Pokemon, ex. 'p1: Nicknamed'
   * @param  {[type]} details The details of the Pokemon, ex. 'Pikachu, L83, M'
   * @return {Pokemon}         The Pokemon created.
   */
  findOrCreate(ident, details) {
    const mon = this.find(ident);
    if (mon) return mon;

    const owner = util.identToOwner(ident);
    const identless = this.findWithoutIdent(owner, details);
    if (identless) {
      identless.useIdent(ident);
      return identless;
    }
    return this.create(ident, details);
  }

  /**
   * Create a Pokemon even though we don't know its ident yet. This happens
   * when we get a 'poke' message before teamPreview.
   *
   * @param  {String} owner   The owner of the Pokemon, ex. 'p1' or 'p2'
   * @param  {String} details  Some details about the Pokemon, ex. 'Jynx, F'
   * @return {Pokemon}         The Pokemon created.
   */
  createPlaceholder(owner, details) {
    return this.create(null, details, owner);
  }

  /**
   * Find a Pokemon by its position, ex. 'p2a'
   * @param  {String} pos The position of the Pokemon.
   * @return {Pokemon} The Pokemon object.
   */
  findByPos(pos) {
    return this.allmon.find( (mon) => { return mon.position === pos; });
  }

}

export default Pokebarn;
