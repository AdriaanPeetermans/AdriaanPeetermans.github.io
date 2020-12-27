function test1() {
  var parser = new MessageParser();

  connection = new WebSocket('ws://127.0.0.1:7893');

  connection.onopen = function () {
    var obj = new ParsedObject();
    var typeAtt = new ParsedString("ADD_GAME");
    obj.addAttribute("type", typeAtt);
    connection.send(parser.serializeMessage(obj));
    console.log("send hello");
  };

  // Log errors
  connection.onerror = function (error) {
    console.log("WebSocket Error ", error);
  };

  // Log messages from the server
  connection.onmessage = function (e) {
    console.log("Received: ", e);
    console.log(e.data);
    var parsedObj = parser.parseMessage(e.data);
    console.log(parsedObj);
  }
}

function test() {
  var su = new ServerUser();
  var w = new WelcomeServer('127.0.0.1', 7893, su);
  su.server = w;
  w.start();
  w.hello();
  console.log('Enter game has been sent');

  document.getElementById("tilePosBut").onclick = function() {
    var orient = document.getElementById("orient");
    var posX = document.getElementById("posX");
    var posY = document.getElementById("posY");
    su.carServer.setPos({posX: posX.value, posY: posY.value}, orient.value);
  };

  document.getElementById("meepleBut").onclick = function() {
    var radios = document.getElementsByName("meeple");
    console.log(radios);
    if (radios[0].checked) { // noMeeple
      su.carServer.setMeeple(false, false, false, 0, 0, 0, {posX: 0, posY: 0});
      return;
    }
    if (radios[1].checked) { // Abbot monastery
      var posX = document.getElementById("posXMeeple");
      var posY = document.getElementById("posYMeeple");
      su.carServer.setMeeple(true, true, false, 0, 0, 0, {posX: posX.value, posY: posY.value});
      return;
    }
    if (radios[2].checked) { // Abbot garden
      var posX = document.getElementById("posXMeeple");
      var posY = document.getElementById("posYMeeple");
      su.carServer.setMeeple(true, false, true, 0, 0, 0, {posX: posX.value, posY: posY.value});
      return;
    }
    if (radios[3].checked) { // Abbot take
      var posX = document.getElementById("posXMeeple");
      var posY = document.getElementById("posYMeeple");
      su.carServer.setMeeple(true, false, false, 0, 0, 0, {posX: posX.value, posY: posY.value});
      return;
    }
    if (radios[4].checked) { // Monastery
      var posX = document.getElementById("posXMeeple");
      var posY = document.getElementById("posYMeeple");
      su.carServer.setMeeple(false, true, false, 0, 0, 0, {posX: posX.value, posY: posY.value});
      return;
    }
    if (radios[5].checked) { // Road
      var posX = document.getElementById("posXMeeple");
      var posY = document.getElementById("posYMeeple");
      var project = document.getElementById("numberMeeple");
      su.carServer.setMeeple(false, false, false, project.value, 0, 0, {posX: posX.value, posY: posY.value});
      return;
    }
    if (radios[6].checked) { // City
      var posX = document.getElementById("posXMeeple");
      var posY = document.getElementById("posYMeeple");
      var project = document.getElementById("numberMeeple");
      su.carServer.setMeeple(false, false, false, 0, project.value, 0, {posX: posX.value, posY: posY.value});
      return;
    }
    if (radios[7].checked) { // Grass
      var posX = document.getElementById("posXMeeple");
      var posY = document.getElementById("posYMeeple");
      var project = document.getElementById("numberMeeple");
      su.carServer.setMeeple(false, false, false, 0, 0, project.value, {posX: posX.value, posY: posY.value});
      return;
    }
  };
}

class ServerUser {

  //Welcome

  handleHello(answer) {
    console.log('User has received: ', answer);
    var gameId = answer[0].id;
    this.server.enterGame(gameId);
    console.log('Try to enter game: ', gameId);
  }

  handleEnterGame(answer) {
    console.log('Entered game: ', answer);
    this.carServer = new CarcassonneServer('127.0.0.1', answer.port, this);
    this.carServer.start();
    this.carServer.hello();
  }

  handleGetGameTypes(answer) {
    console.log('Game types: ', answer);
  }

  handleAddGame(answer) {
    console.log('Added game: ', answer);
  }

  handleRemoveGame(answer) {
    console.log('Game removed: ', answer);
  }

  //Carcassonne

  handleCarcassonneHello(answer) {
    console.log('Carcassonne hello: ', answer);
    this.carServer.setPlayerName("Leon");
  }

  handleGetPlayerNames(answer) {
    console.log('Player names: ', answer);
    //this.carServer.startGame();
    this.carServer.getSettings();
  }

  handleSetPlayerName(answer) {
    console.log('Name set: ', answer);
    this.carServer.getPlayerNames();
  }

  handleLeave(answer) {
    console.log('Left game: ', answer);
  }

  handleStartGame(answer) {
    console.log("Game started: ", answer);
  }

  handleGetSettings(answer) {
    console.log("Got settings: ", answer);
    if (this.already == null) {
      this.already = 1;
      this.carServer.setSettings(false, false, 13);
    }
    else {
      //setTimeout(this.carServer.startGame.bind(this.carServer), 6000);
      this.carServer.startGame();
    }
  }

  handleSetSettings(answer) {
    console.log("Setted settings: ", answer);
    this.carServer.getSettings();
  }

  handleGetPos() {
    console.log("You should give a pos!");
  }
}
