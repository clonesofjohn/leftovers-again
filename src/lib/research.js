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
    if (state.self.active) {
      state.self.active = this.researchMon(state.self.active);
      if (state.self.active.moves) {
        state.self.active.moves.map(move => this.researchMove(move));
      }
    }

    if (state.self.reserve) {
      state.self.reserve.map(mon => {
        // not sure why I have to do this weird reassignment thing here and
        // nowhere else
        mon.moves = mon.moves.map(move => this.researchMove(move));
        return this.researchMon(mon);
      });
    }

    state.opponent.active = this.researchMon(state.opponent.active);
    state.opponent.reserve.map(mon => this.researchMon(mon));

    return state;
  }

  researchMove(move) {
    if (typeof move === 'string') {
      move = {id: move}; // eslint-disable-line
    }
    const research = util.researchMoveById(move.id);
    ['accuracy', 'basePower', 'category', 'name', 'volatileStatus',
    'priority', 'flags', 'heal', 'self', 'type'].forEach( (field) => {
      if (!move[field] && research[field]) {
        move[field] = research[field];
      }
    });
    return move;
  }

  getUnsafeStats(mon) {
    Stats.calculateStats(mon);
    Stats.checkHP(mon);
  }

  researchMon(mon, isMine = false, dangerouslyCalculateStats = false) {
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
