import Battle from '../src/battle';
import {MOVE, SWITCH} from '../src/decisions';
import util from '../src/util';

// import sampleRequest from './helpers/request';
import sampleRequest from './helpers/requestb';


describe('battle', () => {
  let battle;
  const exampleState = {
    rqid: 1,
    self: {
      active: {
        moves: [
          {
            id: 'niceone'
          }
        ]
      },
      reserve: [
        {
          species: 'fakemon'
        },
        {
          species: 'fakechu'
        }
      ]
    }
  };
  beforeEach( () => {
    battle = new Battle();
    spyOn(util, 'researchPokemonById').and.returnValue({});
    spyOn(battle.store, 'data').and.returnValue(exampleState);
  });
  it('should format an integer-based move', () => {
    const res = Battle._formatMessage(1, new MOVE(0), exampleState);
    expect(res).toEqual('1|/move 1|1');
  });
  it('should format an object-based move', () => {
    const res = Battle._formatMessage(1,
      new MOVE(exampleState.self.active.moves[0]), exampleState);
    expect(res).toEqual('1|/move 1|1');
  });
  it('should format a name-based move', () => {
    const res = Battle._formatMessage(1,
      new MOVE('niceone'), exampleState);
    expect(res).toEqual('1|/move 1|1');
  });
  it('should format an integer-based switch', () => {
    const res = Battle._formatMessage(1, new SWITCH(0), exampleState);
    expect(res).toEqual('1|/switch 1|1');
  });
  it('should format an object-based switch', () => {
    const res = Battle._formatMessage(1,
      new SWITCH(exampleState.self.reserve[0]), exampleState);
    expect(res).toEqual('1|/switch 1|1');
  });
  it('should format a name-based switch', () => {
    const res = Battle._formatMessage(1,
      new SWITCH('fakemon'), exampleState);
    expect(res).toEqual('1|/switch 1|1');
  });
});

describe('store integration', () => {
  let battle;
  beforeEach( () => {
    spyOn(console, 'log');
    battle = new Battle();
  });
  it('should process an incoming request', () => {
    battle.handle('request', [sampleRequest]);
    // make a pokemon active
    battle.handle('switch', ['p2a: Gligar', 'Gligar, L77, M', '227/227']);
    const state = battle.store.data();
    expect(state.self.active).toEqual(jasmine.any(Object));
    expect(state.self.reserve.length).toBe(6);
    expect(state.rqid).toBe(1);
    const moves = state.self.active.moves;

    // fields from research
    expect(moves[0].id).toEqual('roost');

    // fields from 'active' array in the request
    expect(moves[0].pp).toEqual(16);
    expect(moves[0].maxpp).toEqual(16);
    expect(moves[0].disabled).toBe(false);
  });
});




