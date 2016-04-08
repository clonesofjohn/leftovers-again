import chalk from 'chalk';

const HP_BAR_LENGTH = 10;
const EXTRA_MON_ICON = 'O';
const DEAD_MON_ICON = ' ';
const UNKNOWN_MON_ICON = '?';
const MY_BACKGROUND = chalk.bgYellow;
const YOUR_BACKGROUND = chalk.bgCyan;
const MY_TEXT = chalk.bold.black;
const YOUR_TEXT = chalk.bold.black;
const EMPTY = '           ';

class MatchStatus {
  report(state) {
    const myLastMove = state.self.active.prevMoves
      ? state.self.active.prevMoves[0]
      : '';
    const yourLastMove = state.opponent.active.prevMoves
      ? state.opponent.active.prevMoves[0]
      : '';

    const stuff = this.padLeft(state.turn, 2) + '|' +

      this.padLeft(myLastMove, 12) + ' | ' +

      this.padLeft(
        this.statusString(state.self.active.statuses) + ' ' +
        this.boostString(state.self.active.boosts)
      , 15) + ' ' +

      this.padLeft(
        state.self.active.species
      , 10) + ' ' +

      this.hp(state.self.active.hppct || EMPTY) + ' | ' +

      this.myReserve(state.self.reserve) + ' | ' +
      this.yourReserve(state.opponent.reserve) + ' | ' +

      this.hp(state.opponent.active.hppct || EMPTY) + ' ' +

      this.padRight(
        state.opponent.active.species
      , 10) + ' ' +

      this.padRight(
        this.statusString(state.opponent.active.statuses) + ' ' +
        this.boostString(state.opponent.active.boosts)
      , 15) + ' | ' +

      this.padRight(yourLastMove, 12) + '';
    console.log(stuff);
  }

  /**
   * Show different data if team preview is true.
   * @param  {Object} state  The state of the match.
   */
  reportTeamPreview(state) {
    // console.log(state);
    const mine = state.self.reserve.map(mon => mon.species).join(', ');
    const yours = state.opponent.reserve.map(mon => mon.species).join(', ');
    console.log(`${this.padLeft(mine, 55)} | ${yours}`);
  }

  hp(hppct) {
    const blox = Math.ceil(hppct / HP_BAR_LENGTH);
    const antiblox = HP_BAR_LENGTH - blox;
    return chalk.bgGreen(' '.repeat(blox)) + chalk.bgRed(' '.repeat(antiblox));
  }

  statusString(statuses) {
    if (!statuses || statuses.length === 0) return '';
    if (statuses.length <= 2) {
      return '[' + statuses.join(' ') + ']';
    }
    return '[' + statuses.map(str => str.substr(0, 2)).join(' ').substr(0, 8) + ']';
  }

  boostString(boosts = {}) {
    let out = '';
    Object.keys(boosts).forEach(key => {
      const mod = (boosts[key] > 0)
        ? '+'.                                                                                                                repeat(boosts[key])
        : '-'.repeat(-1 * boosts[key]);
      out += key + mod + ' ';
    });
    return out.trim();
  }

  myReserve(reserve) {
    const myAlive = reserve.filter( mon => {
      return !mon.dead;
    }).length;
    const myDead = reserve.filter( mon => {
      return mon.dead;
    }).length;

    const stuff = MY_BACKGROUND( MY_TEXT(
      this.padLeft(DEAD_MON_ICON.repeat(myDead) +
        EXTRA_MON_ICON.repeat(myAlive), 6)
    ));
    return stuff;
  }
  yourReserve(reserve) {
    const yourAlive = reserve.filter( mon => {
      return !mon.dead;
    }).length;
    const yourDead = reserve.filter( mon => {
      return mon.dead;
    }).length;

    const stuff = YOUR_BACKGROUND( YOUR_TEXT(
      this.padRight(EXTRA_MON_ICON.repeat(yourAlive) +
        UNKNOWN_MON_ICON.repeat(6 - yourDead - yourAlive), 6)
    ));
    return stuff;
  }

  padLeft(nr = ' ', n, str) {
    if (nr.length >= n) return nr.substr(0, n);
    return Array(n - String(nr).length + 1).join(str || ' ') + nr;
  }
  padRight(nr = ' ', n, str) {
    if (nr.length >= n) return nr.substr(0, n);
    return nr + Array(n - String(nr).length + 1).join(str || ' ');
  }
}

let ms = new MatchStatus();
export default ms;
