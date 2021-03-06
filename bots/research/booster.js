/**
 * Cast spikes all the time.
 *
 * npm run develop -- --bot=research/spikes
 */

import AI from 'ai';
import {MOVE, SWITCH} from 'decisions';

const moveId = 'workup';

export default class SunnyDay extends AI {
  constructor() {
    super();
    this.meta = {
      accepts: 'anythinggoes',
      format: 'anythinggoes'
    };

    this.ctr = -1;
  }

  team() {
    return `
Pancham
Ability: Mold Breaker
Level: 100
EVs: 180 Atk / 100 Def / 212 SpD / 12 Spe
Adamant Nature
- Swords Dance
- Work Up
- Knock Off
- Gunk Shot

Pancham
Ability: Mold Breaker
Level: 100
EVs: 180 Atk / 100 Def / 212 SpD / 12 Spe
Adamant Nature
- Swords Dance
- Work Up
- Knock Off
- Gunk Shot

Pancham
Ability: Mold Breaker
Level: 100
EVs: 180 Atk / 100 Def / 212 SpD / 12 Spe
Adamant Nature
- Swords Dance
- Work Up
- Knock Off
- Gunk Shot

Pancham
Ability: Mold Breaker
Level: 100
EVs: 180 Atk / 100 Def / 212 SpD / 12 Spe
Adamant Nature
- Swords Dance
- Work Up
- Knock Off
- Gunk Shot

Pancham
Ability: Mold Breaker
Level: 100
EVs: 180 Atk / 100 Def / 212 SpD / 12 Spe
Adamant Nature
- Swords Dance
- Work Up
- Knock Off
- Gunk Shot

Pancham
Ability: Mold Breaker
Level: 100
EVs: 180 Atk / 100 Def / 212 SpD / 12 Spe
Adamant Nature
- Swords Dance
- Work Up
- Knock Off
- Gunk Shot
`;
  }

  decide(state) {
    console.log(state.self.reserve);
    if (state.forceSwitch || state.teamPreview || !this._can(state)) {
      this.ctr = this.ctr + 1;
      // will crash out when ctr >= 7;

      return new SWITCH(this.ctr);
    }
    return new MOVE(moveId);
  }

  _can(state) {
    if (!state.self.active) return false;
    if (!state.self.active.moves) return false;
    const move = state.self.active.moves.find(m => m.id === moveId);
    if (move.disabled) return false;
    return true;
  }
}

export default SunnyDay;
