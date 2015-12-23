
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

var ws = new window.WebSocket('ws://localhost:7331');
var isOpen = false;
var msgQueue = [];

// set up listeners and send off queued messages
ws.onopen = function() {
  console.log('websocket opened.');

  ws.onmessage = function(msg) {
    console.log('received msg ', msg);
    $('.battle-log .inner').append('<p>' + msg.data + '</p>');
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
      helpExists = true;
    }

  };
}

listen();
