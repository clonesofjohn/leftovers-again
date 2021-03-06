/**
 * {{Repo}}
 *
 */
import AI from 'ai';
import {MOVE, SWITCH} from 'decisions';


class {{Repo}} extends AI {
  constructor() {
    super();
  }

{{#if team }}
  team() {
    return `
Magikarp @ Leftovers
Ability: Rattled
EVs: 252 HP / 4 Atk / 252 Spe
Careful Nature
- Celebrate
- Flail
- Happy Hour
- Splash`;
  }
{{/if}}

  /**
   * Here's the main loop of your bot. Please read the documentation for more
   * details.
   *
   * @param  {Object} state The current state of the game.
   *
   * @return {Decision}     A decision object.
   */
  decide(state) {
    if (state.forceSwitch{{#if team}} || state.teamPreview{{/if}}) {
      const myMon = this._pickOne(
        state.self.reserve.filter( mon => !mon.dead )
      );
      return new SWITCH(myMon);
    }
    const myMove = this._pickOne(
      state.self.active.moves.filter( move => !move.disabled )
    );
    return new MOVE(myMove);
  }

  _pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export default {{Repo}};
