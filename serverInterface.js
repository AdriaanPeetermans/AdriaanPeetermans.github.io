class Server {

  constructor(ip, port, user) {
    this.ip = ip;
    this.port = port;
    this.parser = new MessageParser();
    // this.buffer = new MessageBuffer(this, 16);
    this.opened = false;
    this.user = user;
  }

  start() {
    this.connection = new WebSocket('ws://'.concat(this.ip).concat(':').concat(this.port.toString()));
    this.connection.onopen = function() {
      this.connectionOpened();
    }.bind(this);
    this.connection.onerror = function (error) {
      this.connectionErrored(error);
    }.bind(this);
    this.connection.onmessage = function (e) {
      this.connectionMessaged(e);
    }.bind(this);
  }

  stop() {
    this.connection.close();
  }

  connectionOpened() {
    this.opened = true;
  }

  connectionErrored(error) {
    console.log('Connection error', error);
    this.user.noConnection();
  }

  connectionMessaged(e) {
    // this.buffer.addMessage(this.parser.parseMessage(e.data));
  }

  sendMessage(object) {
    this.messageToSend = object;
    this.trySendMessage();
  }

  trySendMessage() {
    if (!this.opened) {
      //console.log("not opened");
      setTimeout(this.trySendMessage.bind(this), 100);
    }
    else {
      //console.log("opened and sending ", this.parser.serializeMessage(this.messageToSend), this.connection);
      this.connection.send(this.parser.serializeMessage(this.messageToSend));
    }
  }

  notify(message) {
    console.log('Notify', message);
  }
}

class WelcomeServer extends Server {

  constructor(ip, port, user) {
    super(ip, port, user);
  }

  start() {
    super.start();
    // var helloRepeatFunc = function() {
    //   this.hello();
    // }.bind(this);
    // this.helloRepeat = window.setInterval(helloRepeatFunc, 2000);
  }

  hello() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("HELLO");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  enterGame(gameId) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("ENTER_GAME");
    message.addAttribute("type", typeAtt);
    var idAtt = new ParsedInt(gameId);
    message.addAttribute("game_id", idAtt);
    this.sendMessage(message);
  }

  getGameTypes() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("GET_GAMETYPES");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  addGame(gameType) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("ADD_GAME");
    message.addAttribute("type", typeAtt);
    var gameTypeAtt = new ParsedInt(gameType);
    message.addAttribute("game_type", gameTypeAtt);
    this.sendMessage(message);
  }

  removeGame(gameId) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("REMOVE_GAME");
    message.addAttribute("type", typeAtt);
    var gameIdAtt = new ParsedInt(gameId);
    message.addAttribute("game_id", gameIdAtt);
    this.sendMessage(message);
  }

  connectionMessaged(e) {
    var answer = this.parser.parseMessage(e.data).getObject();
    if (answer == null) {
      return;
    }
    var type = answer.type;
    if (type == null) {
      return;
    }
    switch (type) {
    case "HELLO":
      this.handleHello(answer);
      break;
    case "ENTER_GAME":
      this.handleEnterGame(answer);
      break;
    case "GET_GAMETYPES":
      this.handleGetGameTypes(answer);
      break;
    case "ADD_GAME":
      this.handleAddGame(answer);
      break;
    case "REMOVE_GAME":
      this.handleRemoveGame(answer);
      break;
    case "ERROR":
      this.handleError(answer);
      break;
    default:
      this.handleError(answer);
      break;
    }
  }

  handleHello(answer) {
    var games = answer.games;
    if (games == null) {
      return;
    }
    if (games.length == null) {
      return;
    }
    this.user.handleHello(games);
  }

  handleEnterGame(answer) {
    delete answer.type;
    this.user.handleEnterGame(answer);
  }

  handleGetGameTypes(answer) {
    var types = answer.types;
    if (types == null) {
      return;
    }
    if (types.length == null) {
      return;
    }
    this.user.handleGetGameTypes(types);
  }

  handleAddGame(answer) {
    delete answer.type;
    this.user.handleAddGame(answer);
  }

  handleRemoveGame(answer) {
    delete answer.type;
    this.user.handleRemoveGame(answer);
  }

  handleError(answer) {
    console.log('Error: ', answer);
  }
}

class CarcassonneServer extends Server {

  constructor(ip, port, user) {
    super(ip, port, user);
  }

  hello() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("HELLO");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  getPlayerNames() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("GET_PLAYERNAMES");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  setPlayerName(name) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("SET_PLAYERNAME");
    message.addAttribute("type", typeAtt);
    var nameAtt = new ParsedString(name);
    message.addAttribute("name", nameAtt);
    this.sendMessage(message);
  }

  setColor(color) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("SET_COLOR");
    message.addAttribute("type", typeAtt);
    var colAtt = new ParsedInt(color);
    message.addAttribute("color", colAtt);
    this.sendMessage(message);
  }

  leave() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("LEAVE");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  startGame() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("START_GAME");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  readyToStart() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("READY_TO_START");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  getSettings() {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("GET_SETTINGS");
    message.addAttribute("type", typeAtt);
    this.sendMessage(message);
  }

  setSettings(river, abbot, numberMeeples) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("SET_SETTINGS");
    message.addAttribute("type", typeAtt);
    var riverAtt = new ParsedBoolean(river);
    message.addAttribute("river", riverAtt);
    var abbotAtt = new ParsedBoolean(abbot);
    message.addAttribute("abbot", abbotAtt);
    var numberMeeplesAtt = new ParsedInt(numberMeeples);
    message.addAttribute("numberMeeples", numberMeeplesAtt);
    this.sendMessage(message);
  }

  setPos(position, orientation) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("QUESTION_GET_POS");
    message.addAttribute("type", typeAtt);
    var positionAtt = new ParsedObject();
    positionAtt.addAttribute("posX", new ParsedInt(position.posX));
    positionAtt.addAttribute("posY", new ParsedInt(position.posY));
    message.addAttribute("position", positionAtt);
    var orientationAtt = new ParsedString(orientation);
    message.addAttribute("orientation", orientationAtt);
    this.sendMessage(message);
  }

  setMeeple(isAbbot, monastery, garden, road, city, grass, position) {
    var message = new ParsedObject();
    var typeAtt = new ParsedString("QUESTION_GET_MEEPLE");
    message.addAttribute("type", typeAtt);
    var meepleAtt = new ParsedObject();
    var cityAtt = new ParsedInt(city);
    meepleAtt.addAttribute("city", cityAtt);
    var gardenAtt = new ParsedBoolean(garden);
    meepleAtt.addAttribute("garden", gardenAtt);
    var grassAtt = new ParsedInt(grass);
    meepleAtt.addAttribute("grass", grassAtt);
    var isAbbotAtt = new ParsedBoolean(isAbbot);
    meepleAtt.addAttribute("isAbbot", isAbbotAtt);
    var monasteryAtt = new ParsedBoolean(monastery);
    meepleAtt.addAttribute("monastery", monasteryAtt);
    var posXAtt = new ParsedInt(position.posX);
    var posYAtt = new ParsedInt(position.posY);
    var positionAtt = new ParsedObject();
    positionAtt.addAttribute("posX", posXAtt);
    positionAtt.addAttribute("posY", posYAtt);
    meepleAtt.addAttribute("position", positionAtt);
    var roadAtt = new ParsedInt(road);
    meepleAtt.addAttribute("road", roadAtt);
    message.addAttribute("meeple", meepleAtt);
    this.sendMessage(message);
  }

  connectionMessaged(e) {
    var answer = this.parser.parseMessage(e.data).getObject();
    if (answer == null) {
      return;
    }
    var type = answer.type;
    if (type == null) {
      return;
    }
    if (type.substring(0,6) == "NOTIFY") {
      this.handleNotify(answer);
      return;
    }
    if (type.substring(0,8) == "QUESTION") {
      this.handleQuestion(answer);
      return;
    }
    switch (type) {
      case "HELLO":
        this.handleHello(answer);
        break;
      case "GET_PLAYERNAMES":
        this.handleGetPlayerNames(answer);
        break;
      case "SET_PLAYERNAME":
        this.handleSetPlayerName(answer);
        break;
      case "SET_COLOR":
        this.handleSetColor(answer);
        break;
      case "LEAVE":
        this.handleLeave(answer);
        break;
      case "START_GAME":
        this.handleStartGame(answer);
        break;
      case "READY_TO_START":
        this.handleReadyToStart(answer);
        break;
      case "GET_SETTINGS":
        this.handleGetSettings(answer);
        break;
      case "SET_SETTINGS":
        this.handleSetSettings(answer);
        break;
      case "ERROR":
        this.handleError(answer);
        break;
      default:
        this.handleError(answer);
        break;
    }
  }

  handleHello(answer) {
    delete answer.type;
    this.user.handleCarcassonneHello(answer);
  }

  handleGetPlayerNames(answer) {
    var names = answer.names;
    if (names == null) {
      return;
    }
    if (names.length == null) {
      return;
    }
    this.user.handleGetPlayerNames(names);
  }

  handleSetPlayerName(answer) {
    delete answer.type;
    this.user.handleSetPlayerName(answer);
  }

  handleSetColor(answer) {
    delete answer.type;
    this.user.handleSetColor(answer);
  }

  handleLeave(answer) {
    delete answer.type;
    this.user.handleLeave(answer);
  }

  handleStartGame(answer) {
    delete answer.type;
    this.user.handleStartGame(answer);
  }

  handleReadyToStart(answer) {
    delete answer.type;
    this.user.handleReadyToStart(answer);
  }

  handleGetSettings(answer) {
    delete answer.type;
    this.user.handleGetSettings(answer);
  }

  handleSetSettings(answer) {
    delete answer.type;
    this.user.handleSetSettings(answer);
  }

  handleNotify(answer) {
    //console.log('Notify: ', answer);
    var type = answer.type;
    switch (type) {
      case "NOTIFY_COLORS":
        this.user.handleNotifyColors(answer);
        break;
      case "NOTIFY_GET_READY":
        this.user.handleNotifyGetReady(answer);
        break;
      case "NOTIFY_START":
        this.user.handleNotifyStart(answer);
        break;
      case "NOTIFY_NUMBER_PLAYERS":
        this.user.handleNotifyNumberPlayers(answer);
        break;
      case "NOTIFY_PLAYER_NUMBER":
        this.user.handleNotifyPlayerNumber(answer);
        break;
      case "NOTIFY_NEW_TILE":
        this.user.handleNewTile(answer);
        break;
      case "NOTIFY_NUMBER_TILES":
        this.user.handleNumberTiles(answer);
        break;
      case "NOTIFY_MEEPLES_LEFT":
        this.user.handleNumberMeeplesLeft(answer);
        break;
      case "NOTIFY_ABBOT_LEFT":
        this.user.handleNumberAbbotsLeft(answer);
        break;
      case "NOTIFY_TILE_TO_PLACE":
        this.user.handleTileToPlace(answer);
        break;
      case "NOTIFY_NEW_MEEPLE":
        this.user.handleNewMeeple(answer);
        break;
      case "NOTIFY_MEEPLE_RELEASE":
        this.user.handleMeepleRelease(answer);
        break;
      case "NOTIFY_SET_SCORES":
        this.user.handleScores(answer);
        break;
      default:
        this.handleError(answer);
        break;
    }
  }

  handleQuestion(answer) {
    var type = answer.type;
    switch (type) {
      case "QUESTION_GET_POS":
        this.handleGetPos(answer);
        break;
      case "QUESTION_GET_MEEPLE":
        this.handleGetMeeple(answer);
        break;
      default:
        this.handleError(answer);
        break;
    }
  }

  handleNewMeeple(answer) {
    this.user.handleNewMeeple(answer);
  }

  handleGetPos(answer) {
    this.user.handleGetPos(answer);
  }

  handleGetMeeple(answer) {
    this.user.handleGetMeeple(answer);
  }

  handleError(answer) {
    console.log('Error: ', answer);
  }
}
