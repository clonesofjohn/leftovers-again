// ==UserScript==
// @name         Pokemon Showdown Helper
// @namespace    http://metal-heart.org/
// @version      0.4
// @description  enter something useful
// @author       marten
// @include        http://play.pokemonshowdown.com/*
// @include      file:///*/Pokemon-Showdown-Client/*
// @grant        none

// in Tampermonkey, just require your local file when developing. ex.
// for linux: require      file:///media/marten/PERPETUAL_GAZE/leftovers-again/scripts/clienthax.js
// @require      file:///Users/martins/src/leftovers-again/scripts/clienthax.js
// ==/UserScript==
console.log('hello from clienthax.js');

// apply extra CSS
// .switchmenu button {
//   width: 150px;
// }

// .movemenu button {
//   width: 306px;
// }

var ws = new window.WebSocket('ws://localhost:7331');
var isOpen = false;
var msgQueue = [];

// set up listeners and send off queued messages
ws.onopen = function() {
  console.log('websocket opened.');

  ws.onmessage = function(msg) {
    console.log('received msg ', msg);
    $('.battle-log .inner').append('<p>' + msg.data + '</p>');
    if (msg.data.moves) _onMoveData(msg.data.moves);
    if (msg.data.opponent) _onOpponentData(msg.data.opponent);
    if (msg.data.switches) _onSwitchData(msg.data.switches);
  };

  isOpen = true;

  while(msgQueue.length) {
    console.log('sending from queue:', msgQueue[0]);
    ws.send(msgQueue.shift());
  }
};

// retrieve the data we want
var callhome = function() {
  ws.send('>' + window.room.id + '\n|ask4help');
};

var clear = function() {
  console.log('clearing out all lgn\'s');
  $('.lgn').remove();
}

var helpExists = false;

// listen to Showdown's websocket connection
var listen = function() {
  if(!window.app.socket) {
    console.log('waiting...');
    return setTimeout( listen, 1000 );
  }
  var prevfn = window.app.socket.onmessage;
  window.app.socket.onmessage = function(msg) {
    prevfn(msg);

    if(isOpen) {
      ws.send(msg.data)
    } else {
      msgQueue.push(msg.data);
    }

    if(msg.data.indexOf('|start') >= 0 && !helpExists) {
      var helpButton = '<button class="help">HELP!!</button>';
      $('.battle-options div').prepend(helpButton);
      $('button.help').click(callhome);

      // temporarily add a 'clear' button
      var clearButton = '<button class="lgnclear">CLEAR</button>';
      $('.battle-options div').prepend(clearButton);
      $('button.lgnclear').click(clear);

      helpExists = true;
    }

  };
};

var _onMoveData = function(moves) {
  for (var i = 0; i < moves.length; i++) {
    $('.movemenu button[value=' + (i + 1) + '] small')
      .first()
      .after('<small class="lgn damage">' +
        moves[i].damage +
        '</small>');

  }
};

var _opponentData = function(opponent) {
  if(!opponent) return;
  var arrows = '';
  if(opponent.hasStrength) arrows += _getIcon('up-arrow');
  if(opponent.hasWeakness) arrows += _getIcon('down-arrow');

  $('.statbar.lstatbar strong')
    .after('<small class="lgn">' + arrows + '</small>');
};

var _onSwitchData = function(switches) {
  // value seems to be 0-5
  // but is '[Species or Name],active' for the active mon
  for (var i = 0; i < switches.length; i++) {
    var searchVal = (switches[i].active)
      ? '*active'
      : i;
    $('.switchmenu button[value="' + searchVal + '"] span.hpbar')
      .before('<small class="lgn">something</small>');
  }
};

var _getIcon = function(str) {
  return '<i class="fa fa-' + str + '" />';
}

listen();
