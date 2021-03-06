/**
 * Summon Talonflames to cast 'Brave Bird' over and over.
 *
 * npm start -- research/bravest
 */


import AI from 'ai';
import {MOVE, SWITCH} from 'decisions';

const moveId = 'bravebird';

export default class Bravest extends AI {
  constructor() {
    super();
    this.meta = {
      accepts: 'anythinggoes',
      format: 'anythinggoes',
      nickname: 'Bravest1500000'
    };

    this.ctr = -1;
  }

  team() {
    return `
NamedA (Talonflame)
Ability: Gale Wings
Level: 100
EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe
Serious Nature
- Brave Bird

NamedB (Talonflame)
Ability: Gale Wings
Level: 100
EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe
Serious Nature
- Brave Bird

NamedC (Talonflame)
Ability: Gale Wings
Level: 100
EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe
Serious Nature
- Brave Bird

NamedD (Talonflame)
Ability: Gale Wings
Level: 100
EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe
Serious Nature
- Brave Bird

NamedE (Talonflame)
Ability: Gale Wings
Level: 100
EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe
Serious Nature
- Brave Bird

NamedF (Talonflame)
Ability: Gale Wings
Level: 100
EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe
Serious Nature
- Brave Bird
`;
  }

  decide(state) {
    // console.log(state);
    if (state.forceSwitch || state.teamPreview || !this.can(state)) {
      const possibleMons = state.self.reserve.filter( (mon) => {
        if (mon.condition === '0 fnt') return false;
        if (mon.active) return false;
        if (mon.dead) return false;
        return true;
      });
      const myMon = this._pickOne(possibleMons);
      return new SWITCH(myMon);
    }
    return new MOVE(moveId);
  }

  can(state) {
    if (!state.self.active) return false;
    if (!state.self.active.moves) return false;
    const move = state.self.active.moves.find(m => m.id === moveId);
    if (move.disabled) return false;
    return true;
  }

  _pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export default Bravest;
