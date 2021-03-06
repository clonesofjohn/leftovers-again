import EliteFour from './elitefour';

export default class Wikstrom extends EliteFour {
  constructor() {
    super();
    this.meta = meta;
  }
}

const meta = {
  format: 'anythinggoes',
  accepts: 'ALL',
  nickname: 'EliteFouroWikstrom',
  team: `
Klefki
Ability: Prankster
- Spikes
- Torment
- Dazzling Gleam
- Flash Cannon

Probopass
Ability: Sturdy
- Power Gem
- Earth Power
- Flash Cannon
- Discharge

Scizor
Ability: Technician
- X-Scissor
- Iron Head
- Bullet Punch
- Night Slash

Aegislash
Ability: Stance Change
- Sacred Sword
- Iron Head
- King's Shield
- Shadow Claw
`
};
