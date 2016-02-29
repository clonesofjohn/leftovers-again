import util from 'pokeutil';
import Stats from 'lib/stats';

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


// const STATS = [AT, DF, SA, SD, SP, HP];

const researchFieldsForActiveMon = ['types', 'height', 'weight', 'baseStats'];
const researchFieldsForOpponentMon = ['abilities'];

class Research {
  constructor() {
  }

  getExtendedInfo(state) {
    // @TODO
  }

  researchMove(move) {
    if (typeof move === 'string') {
      move = {id: move}; // eslint-disable-line
    }
    const research = util.researchMoveById(move.id);
    ['accuracy', 'basePower', 'category', 'name', 'volatileStatus',
    'priority', 'flags', 'heal', 'self', 'type'].forEach( (field) => {
      if (!out[field] && research[field]) {
        out[field] = research[field];
      }
    });
  }

  getUnsafeStats(mon) {
    Stats.calculateStats(mon);
    Stats.checkHP(mon);
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
      this.getUnsafeStats(mon);
    }
    return mon;
  }

  readFromPokedex(mon, isMine) {
    const key = util.toId(mon.species);
    const research = util.researchPokemonById(key);
    researchFieldsForActiveMon.forEach(field => {
      if (!mon[field] && research[field]) {
        mon[field] = research[field];
      }
    });
    if (!isMine) {
      researchFieldsForOpponentMon.forEach(field => {
        if (!mon[field] && research[field]) {
          mon[field] = research[field];
        }
      });
    }
  }



}


export default new Research();
