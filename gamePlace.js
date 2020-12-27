var SERVERIP = "127.0.0.1";
var SERVERPORT = 7893;

var su;
var w;

var gameU;
var gameS;

function loadGames() {
  initWindow();

  su = new ServerUser();
  w = new WelcomeServer(SERVERIP, SERVERPORT, su);
  su.server = w;
  w.start();
  w.hello();

  var addGameBlock = document.getElementById("addGameContainer");
  addGameBlock.addEventListener("click", e => {
    addGame();
  });
}

function initWindow() {
  var addGameBlock = document.getElementById("addGameContainer");
  addGameBlock.addEventListener("mouseenter", e => {
    addGameBlock.style.backgroundColor = GAMEHIGHLIGHT;
  });
  addGameBlock.addEventListener("mouseleave", e => {
    addGameBlock.style.backgroundColor = "#FFFFFF";
  });
}

var GAMETYPES;

var GAMEGREEN = "#76D7C4";
var GAMERED = "#F1948A";
var GAMEHIGHLIGHT = "#F2F3F4";

class ServerUser {

  //Welcome
  gameIDs = [];
  gameOpened = [];
  firstGameTypes = true;
  gameColors = [];
  gameActive = [];
  gameTypes = [];
  enteredGameID;

  handleHello(answer) {
    //Check if a game got deleted:
    var present = [];
    for (var i = 0; i < this.gameIDs.length; i++) {
      present.push(false);
    }
    //Check if the game is new:
    for (var i = 0; i < answer.length; i++) {
      var already = false;
      var gameIndex;
      for (var j = 0; j < this.gameIDs.length; j++) {
        if (this.gameIDs[j] == answer[i].id) {
          already = true;
          present[j] = true;
          gameIndex = j;
          break;
        }
      }
      if (!already) { //Game is new:
        addClosedGame(answer[i], this.gameIDs.length);
        this.gameIDs.push(answer[i].id);
        this.gameOpened.push(false);
        if (answer[i].started) {
          this.gameColors.push(GAMERED);
        }
        else {
          this.gameColors.push(GAMEGREEN);
        }
        this.gameActive.push(false);
        this.gameTypes.push(answer[i].type.id);
        present.push(true);
      }
      else { //Game is not new:
        document.getElementById("game" + answer[i].id + "NBP").innerHTML = answer[i].nb_players;
        var col;
        if (answer[i].started) {
          col = GAMERED;
        }
        else {
          col = GAMEGREEN;
        }
        this.gameColors[gameIndex] = col;
        var activeColor = document.getElementById("game" + answer[i].id).style.backgroundColor;
        if (!this.gameActive[gameIndex]) {
          document.getElementById("game" + answer[i].id).style.backgroundColor = col;
        }
        document.getElementById("game" + answer[i].id).started = answer[i].started;
      }
    }
    //Check if game got deleted:
    for (var i = this.gameIDs.length-1; i >= 0; i--) {
      if (!present[i]) {
        document.getElementById("underBar").removeChild(document.getElementById("game" + this.gameIDs[i]));
        this.gameIDs.splice(i, 1);
        this.gameOpened.splice(i, 1);
        this.gameColors.splice(i, 1);
        this.gameActive.splice(i, 1);
        this.gameTypes.splice(i, 1);
      }
    }
    if (this.firstGameTypes) {
      this.server.getGameTypes();
      this.firstGameTypes = false;
    }
  }

  handleGetGameTypes(answer) {
    GAMETYPES = answer;
  }

  handleAddGame(answer) {
    // addClosedGame(answer.game, this.gameIDs.length);
    // this.gameIDs.push(answer.game.id);
    // this.gameOpened.push(false);
    // this.gameColors.push(GAMEGREEN);
    // this.gameActive.push(false);
    // this.gameTypes.push(answer.game.type.id);
    cancelAddGame();
  }

  handleRemoveGame(answer) {
    if (answer.code != 0) {
      console.log("Cannot remove game, code: ", answer.code);
    }
  }

  handleEnterGame(answer) {
    if (answer.code != 0) {
      console.log("Cannot enter game, code: ", answer.code);
      this.enteredGameID = null;
      return;
    }
    var type;
    for (var i = 0; i < this.gameIDs.length; i++) {
      if (this.gameIDs[i] == this.enteredGameID) {
        type = this.gameTypes[i];
        break;
      }
    }
    if (type == null) {
      console.log("Unknown game: ", this.enteredGameID);
      return;
    }
    switch (type) {
      case 0: //Carcassonne
      gameU = new CarcassonneUser(su, answer.port);
      gameS = new CarcassonneServer(SERVERIP, answer.port, gameU);
      gameU.server = gameS;
      gameS.start();
      gameS.hello();
    }
  }

  noConnection() {
    var noConnectBar = document.getElementById("noConnectBar");
    noConnectBar.style.display = "flex";
  }
}

class CarcassonneUser {

  wu;
  port;
  nameInput;
  nameDiv;
  server;
  botContainer;
  otherNameDiv;
  names;
  nameDivs;
  colorDiv;
  colorHolder;
  colorButs;
  colorSelect;
  primaryColors;
  secondaryColors;
  tertiaryColors;
  quaternaryColors;
  settingsDiv;
  riverCheck;
  abbotCheck;
  meeplesCheck;
  meeplesCount;
  settingsRiver = false;
  settingsAbbot = false;
  settingsNumberMeeples = 10;
  startDiv;
  banner;

  constructor(welcomeUser, port) {
    this.wu = welcomeUser;
    this.port = port;
  }

  handleCarcassonneHello(answer) {
    console.log("Hello from Carcassonne: ", answer);
    var gameId = answer.game_id;
    var container = document.getElementById("game" + gameId);
    this.botContainer = container.childNodes[1];
    this.botContainer.innerHTML = "";
    this.botContainer.classList.remove("openedGameBotContainer");
    this.botContainer.classList.add("joinedGameBotContainer");
    this.nameDiv = document.createElement("div");
    this.nameDiv.classList.add("joinedNameContainer");
    this.botContainer.appendChild(this.nameDiv);
    var nameTitleDiv = document.createElement("div");
    nameTitleDiv.classList.add("joinedTitleBar");
    nameTitleDiv.innerHTML = "Naam";
    this.nameDiv.appendChild(nameTitleDiv);
    this.nameInput = document.createElement("INPUT");
    this.nameInput.setAttribute("type", "text");
    this.nameInput.placeholder = "Jouw naam";
    this.nameInput.classList.add("joinedNameIntEl");
    this.nameDiv.appendChild(this.nameInput);
    var enterNameBut = document.createElement("button");
    enterNameBut.innerHTML = "Stuur naam";
    enterNameBut.classList.add("joinedNameIntEl");
    this.nameDiv.appendChild(enterNameBut);
    enterNameBut.addEventListener("click", e => {
      this.sendName();
    });
    this.colorDiv = document.createElement("div");
    this.colorDiv.classList.add("joinedColContainer");
    var colorTitleDiv = document.createElement("div");
    colorTitleDiv.classList.add("joinedTitleBar");
    colorTitleDiv.innerHTML = "Kleur";
    this.colorDiv.appendChild(colorTitleDiv);
    this.colorHolder = document.createElement("div");
    this.colorHolder.classList.add("joinedColorHolder");
    this.colorDiv.appendChild(this.colorHolder);
    this.primaryColors = answer.primaryColors;
    this.secondaryColors = answer.secondaryColors;
    this.tertiaryColors = answer.tertiaryColors;
    this.quaternaryColors = answer.quaternaryColors;

    this.addColorButtons(answer.availableColors);

    this.botContainer.appendChild(this.colorDiv);

    //Add settings:
    this.server.getSettings()

    //Add start button:
    this.addStartButton();

    this.server.getPlayerNames();
  }

  addStartButton() {
    this.startDiv = document.createElement("div");
    this.startDiv.classList.add("joinedStartContainer");
    this.botContainer.appendChild(this.startDiv);

    var startTitleDiv = document.createElement("div");
    startTitleDiv.classList.add("joinedTitleBar");
    startTitleDiv.innerHTML = "Start";
    this.startDiv.appendChild(startTitleDiv);

    var startButton = document.createElement("button");
    startButton.innerHTML = "Start spel";
    startButton.user = this;
    startButton.onclick = this.startGame;
    startButton.style.marginTop = "5px";
    this.startDiv.appendChild(startButton);
  }

  startGame() {
    this.user.server.startGame();
  }

  drawSettings() {
    if (this.settingsDiv != null) {
      this.riverCheck.checked = this.settingsRiver;
      this.abbotCheck.checked = this.settingsAbbot;
      this.meeplesCheck.value = this.settingsNumberMeeples;
      this.meeplesCount.innerHTML = this.settingsNumberMeeples.toString();
      return;
    }
    this.settingsDiv = document.createElement("div");
    this.settingsDiv.classList.add("joinedSetContainer");
    //River:
    var setTitleDiv = document.createElement("div");
    setTitleDiv.classList.add("joinedTitleBar");
    setTitleDiv.innerHTML = "Instellingen";
    this.settingsDiv.appendChild(setTitleDiv);
    var riverSetDiv = document.createElement("div");
    riverSetDiv.classList.add("joinedSetRowContainer");
    this.settingsDiv.appendChild(riverSetDiv);
    var riverDiv = document.createElement("div");
    riverDiv.classList.add("joinedSetEl");
    riverDiv.innerHTML = "Rivier:";
    riverSetDiv.appendChild(riverDiv);
    var riverCheckDiv = document.createElement("div");
    riverCheckDiv.classList.add("joinedSetEl")
    riverSetDiv.appendChild(riverCheckDiv);
    this.riverCheck = document.createElement("INPUT");
    this.riverCheck.setAttribute("type", "checkbox");
    this.riverCheck.checked = this.settingsRiver;
    this.riverCheck.onclick = this.updateRiver;
    this.riverCheck.user = this;
    riverCheckDiv.appendChild(this.riverCheck);
    //Abbot:
    var abbotSetDiv = document.createElement("div");
    abbotSetDiv.classList.add("joinedSetRowContainer");
    this.settingsDiv.appendChild(abbotSetDiv);
    var abbotDiv = document.createElement("div");
    abbotDiv.classList.add("joinedSetEl");
    abbotDiv.innerHTML = "Abt:";
    abbotSetDiv.appendChild(abbotDiv);
    var abbotCheckDiv = document.createElement("div");
    abbotCheckDiv.classList.add("joinedSetEl");
    abbotSetDiv.appendChild(abbotCheckDiv);
    this.abbotCheck = document.createElement("INPUT");
    this.abbotCheck.setAttribute("type", "checkbox");
    this.abbotCheck.checked = this.settingsAbbot;
    this.abbotCheck.onclick = this.updateAbbot;
    this.abbotCheck.user = this;
    abbotCheckDiv.appendChild(this.abbotCheck);
    this.botContainer.appendChild(this.settingsDiv);
    //Number meeples:
    var meeplesSetDiv = document.createElement("div");
    meeplesSetDiv.classList.add("joinedSetRowContainer");
    this.settingsDiv.appendChild(meeplesSetDiv);
    var meeplesDiv = document.createElement("div");
    meeplesDiv.classList.add("joinedSetEl");
    meeplesDiv.innerHTML = "Aantal meeples:";
    meeplesSetDiv.appendChild(meeplesDiv);
    var meeplesCheckDiv = document.createElement("div");
    meeplesCheckDiv.classList.add("joinedSetEl");
    meeplesSetDiv.appendChild(meeplesCheckDiv);
    this.meeplesCheck = document.createElement("INPUT");
    this.meeplesCheck.setAttribute("type", "range");
    this.meeplesCheck.setAttribute("min", "1");
    this.meeplesCheck.setAttribute("max", "20");
    this.meeplesCheck.value = this.settingsNumberMeeples;
    meeplesCheckDiv.appendChild(this.meeplesCheck);
    this.meeplesCheck.oninput = this.updateMeepleCountSlide;
    this.meeplesCheck.user = this;
    this.meeplesCount = document.createElement("div");
    this.meeplesCount.classList.add("joinedSetEl");
    this.meeplesCount.innerHTML = this.settingsNumberMeeples.toString();
    meeplesSetDiv.appendChild(this.meeplesCount);
    //Button:
    var setTingsButton = document.createElement("button");
    setTingsButton.innerHTML = "Stuur instellingen";
    setTingsButton.user = this;
    setTingsButton.onclick = this.sendSettings;
    setTingsButton.style.marginTop = "5px";
    this.settingsDiv.appendChild(setTingsButton);
    this.botContainer.appendChild(this.settingsDiv);
  }

  sendSettings() {
    this.user.server.setSettings(this.user.settingsRiver, this.user.settingsAbbot, this.user.settingsNumberMeeples);
  }

  updateMeepleCountSlide() {
    this.user.meeplesCount.innerHTML = this.value.toString();
    this.user.settingsNumberMeeples = this.value;
  }

  updateAbbot() {
    this.user.settingsAbbot = this.checked;
  }

  updateRiver() {
    this.user.settingsRiver = this.checked;
  }

  addColorButtons(available) {
    this.colorHolder.innerHTML = "";
    this.colorButs = [];
    for (var i = 0; i < available.length; i++) {
      if (available[i]) {
        var colorBut = document.createElement("div");
        colorBut.classList.add("joinedColorBut");
        colorBut.style.backgroundColor = this.primaryColors[i];
        colorBut.style.borderColor = this.tertiaryColors[i];
        colorBut.index = i;
        colorBut.user = this;
        colorBut.addEventListener("mouseenter", this.colButMouseEnter);
        colorBut.addEventListener("mouseleave", this.colButMouseLeave);
        colorBut.addEventListener("click", this.colButClick)
        this.colorButs.push(colorBut);
        this.colorHolder.appendChild(colorBut);
      }
      else {
        this.colorButs.push(null);
      }
    }
  }

  colButMouseEnter() {
    this.user.colorButs[this.index].style.backgroundColor = this.user.quaternaryColors[this.index];
  }

  colButMouseLeave() {
    if (this.user.colorSelect != this.index) {
      this.user.colorButs[this.index].style.backgroundColor = this.user.primaryColors[this.index];
    }
    else {
      this.user.colorButs[this.index].style.backgroundColor = this.user.tertiaryColors[this.index];
    }
  }

  colButClick() {
    this.user.server.setColor(this.index);
  }

  sendName() {
    console.log("Enter name: ", this.nameInput.value);
    this.server.setPlayerName(this.nameInput.value);
  }

  handleGetPlayerNames(answer) {
    console.log("Received names: ", answer);
    if (this.names == null) { //First time names received
      this.names = answer;
      this.nameDivs = [];
      this.otherNameDiv = document.createElement("div");
      this.otherNameDiv.classList.add("joinedOtherNameContainer");
      var playerTitleDiv = document.createElement("div");
      playerTitleDiv.classList.add("joinedTitleBar");
      playerTitleDiv.innerHTML = "Spelers";
      this.otherNameDiv.appendChild(playerTitleDiv);
      for (var i = 0; i < this.names.length; i++) {
        this.addNameBox(i);
      }
      this.botContainer.appendChild(this.otherNameDiv);
    }
    else { //Already has names, check for updates
      var stillHere = [];
      for (var i = 0; i < this.names.length; i++) {
        stillHere.push(false);
      }
      for (var i = 0; i < answer.length; i++) {
        var checkName = answer[i].name;
        var newName = true;
        for (var j = 0; j < this.names.length; j++) {
          if (!stillHere[j]) {
            if (this.names[j].name == checkName) {
              stillHere[j] = true;
              newName = false;
              if (this.names[j].color != answer[i].color) {
                this.names[j].color = answer[i].color;
                this.nameDivs[j].style.backgroundColor = this.quaternaryColors[this.names[j].color];
                this.nameDivs[j].style.color = this.tertiaryColors[this.names[j].color];
                this.nameDivs[j].style.borderStyle = "solid";
                this.nameDivs[j].style.borderWidth = "0.5px";
                this.nameDivs[j].style.borderColor = this.tertiaryColors[this.names[j].color];
              }
              break;
            }
          }
        }
        if (newName) { // Add new names
          this.names.push(answer[i]);
          this.addNameBox(this.names.length-1);
        }
      }
      for (var i = stillHere.length-1; i >= 0; i--) { // Remove name if not present
        if (!stillHere[i]) {
          this.names.splice(i, 1);
          var box = this.nameDivs.splice(i, 1)[0];
          this.otherNameDiv.removeChild(box);
        }
      }
    }
  }

  handleSetPlayerName(answer) {
    if (answer.code == 1) {
      this.addBanner("Deze naam bestaat al");
      return;
    }
    if (answer.code == 0) {
      this.nameDiv.style.display = "none";
    }
  }

  handleLeave(answer) {
    console.log("left game: ", answer);
  }

  handleSetColor(answer) {
    if (answer.code == 1) {
      this.addBanner("Deze kleur is al gekozen");
      return;
    }
    if (answer.code == 2) {
      this.addBanner("Deze kleur is ongeldig");
      return;
    }
    if (answer.code == 0) {
      this.botContainer.removeChild(this.colorDiv);
    }
  }

  handleNotifyColors(answer) {
    this.addColorButtons(answer.availableColors);
  }

  handleGetSettings(answer) {
    console.log("Received settings: ", answer);
    this.settingsRiver = answer.river;
    this.settingsAbbot = answer.abbot;
    this.settingsNumberMeeples = answer.numberMeeples;
    this.drawSettings();
  }

  handleSetSettings(answer) {
    console.log("Received set settings: ", answer);
  }

  handleStartGame(answer) {
    if (answer.code == 1) {
      this.addBanner("Dit spel is al begonnen");
      return;
    }
    if (answer.code == 2) {
      this.addBanner("Te weinig spelers");
      return;
    }
    if (answer.code == 3) {
      this.addBanner("Sommige spelers kozen nog geen kleur");
      return;
    }
    console.log("Game started! ", answer);
  }

  handleNotifyGetReady(answer) {
    console.log("Notified getting ready: ", answer);
    window.open("carcassonne.html?port=" + this.port.toString(),"_self")
    // this.server.readyToStart();
  }

  handleNotifyStart(answer) {
    console.log("And the game is started! ", answer);
  }

  handleReadyToStart(answer) {
    console.log("Ready to start well received: ", answer);
  }

  addNameBox(index) {
    var nameBox = document.createElement("div");
    nameBox.classList.add("joinedOtherNameIntEl");
    nameBox.innerHTML = this.names[index].name;
    if (this.names[index].color == -1) {
      nameBox.style.backgroundColor = "transparent";
      nameBox.style.color = "#000000";
      nameBox.style.borderStyle = "solid";
      nameBox.style.borderWidth = "0.5px";
    }
    else {
      nameBox.style.backgroundColor = this.quaternaryColors[this.names[index].color];
      nameBox.style.color = this.tertiaryColors[this.names[index].color];
      nameBox.style.borderColor = this.tertiaryColors[this.names[index].color];
      nameBox.style.borderStyle = "solid";
      nameBox.style.borderWidth = "0.5px";
    }
    this.otherNameDiv.appendChild(nameBox);
    this.nameDivs.push(nameBox);
  }

  addBanner(text) {
    if (this.banner == null) {
      this.banner = document.createElement("div");
      this.banner.classList.add("openedGameTopBanner");
      this.botContainer.appendChild(this.banner);
    }
    this.banner.innerHTML = text;
    if (text.length == 0) {
      this.banner.style.display = "none";
    }
    else {
      this.banner.style.display = "flex";
    }
  }
}

function addGame() {
  closeOpenedGames();
  firstCheckout = undefined;
  document.getElementById("addGameContainer").style.display = "none";
  var extendedAddBox = document.createElement("div");
  extendedAddBox.classList.add("extendedAddContainer");
  extendedAddBox.id = "extendedAddContainer";
  var underBar = document.getElementById("underBar");
  underBar.appendChild(extendedAddBox);

  var extendedAddTopBox = document.createElement("div");
  extendedAddTopBox.classList.add("extendedAddTopContainer");
  extendedAddBox.appendChild(extendedAddTopBox);

  var extendedAddTopLeftBox = document.createElement("div");
  extendedAddTopLeftBox.classList.add("extendedAddTextContainer");
  extendedAddTopBox.appendChild(extendedAddTopLeftBox);
  extendedAddTopLeftBox.innerHTML = "Kies een spel:";
  extendedAddTopLeftBox.style.margin = "10px";

  var extendedAddSel = document.createElement("select");
  extendedAddSel.name = "addSel";
  extendedAddSel.id = "addSel";
  for (var option of GAMETYPES) {
    var opt = document.createElement("option");
    opt.value = option.id;
    opt.text = option.name;
    extendedAddSel.appendChild(opt);
  }
  extendedAddSel.style.margin="10px";
  extendedAddTopBox.appendChild(extendedAddSel);

  var extendedAddBotBox = document.createElement("div");
  extendedAddBotBox.classList.add("extendedAddBotContainer");
  extendedAddBox.appendChild(extendedAddBotBox);

  var cancelBtn = document.createElement("button");
  cancelBtn.innerHTML = "Annuleer";
  extendedAddBotBox.appendChild(cancelBtn);
  cancelBtn.addEventListener("click", e => {
    cancelAddGame();
  });

  var addBtn = document.createElement("button");
  addBtn.innerHTML = "Voeg toe";
  extendedAddBotBox.appendChild(addBtn);
  addBtn.addEventListener("click", e => {
    sendAddGame();
  });
}

function sendAddGame() {
  var addSel = document.getElementById("addSel");
  var type = addSel.options[addSel.selectedIndex].value;
  w.addGame(type);
}

function cancelAddGame() {
  var extendedAddBox = document.getElementById("extendedAddContainer");
  extendedAddBox.remove();
  document.getElementById("addGameContainer").style.display = "flex";
}

function addClosedGame(game, gameIndex) {
  var underBar = document.getElementById("underBar");
  var TNLink;
  switch (game.type.id) {
    case 0: //Carcassonne
      TNLink = "Images/carcassonneThumbNail.png";
      break;
  }
  var gameBlock = document.createElement("div");
  gameBlock.classList.add("closedGameContainer");
  if (game.started) {
    gameBlock.style.backgroundColor = GAMERED;
  }
  gameBlock.id = "game" + game.id;
  var addGameBlock = document.getElementById("addGameContainer");
  var underBar = document.getElementById("underBar");
  underBar.insertBefore(gameBlock, addGameBlock);

  var TNBlock = document.createElement("div");
  TNBlock.classList.add("closedGameTNContainer");
  gameBlock.appendChild(TNBlock);

  var TNImage = document.createElement("img");
  TNImage.src = TNLink;
  TNImage.height = "80";
  TNBlock.appendChild(TNImage);

  var gameTypeHolderBlock = document.createElement("div");
  gameTypeHolderBlock.classList.add("closedGameTextHolderContainer");
  gameBlock.appendChild(gameTypeHolderBlock);

  var gameTypeTopBlock = document.createElement("div");
  gameTypeTopBlock.classList.add("closedGameTextContainer");
  gameTypeTopBlock.innerHTML = "Spel:";
  gameTypeHolderBlock.appendChild(gameTypeTopBlock);

  var gameTypeBotBlock = document.createElement("div");
  gameTypeBotBlock.classList.add("clodesGameTextContainer");
  gameTypeBotBlock.id = "game" + game.id + "Type";
  gameTypeHolderBlock.appendChild(gameTypeBotBlock);

  var gameIDHolderBlock = document.createElement("div");
  gameIDHolderBlock.classList.add("closedGameTextHolderContainer");
  gameBlock.appendChild(gameIDHolderBlock);

  var gameIDTopBlock = document.createElement("div");
  gameIDTopBlock.classList.add("closedGameTextContainer");
  gameIDTopBlock.innerHTML = "ID:";
  gameIDHolderBlock.appendChild(gameIDTopBlock);

  var gameIDBotBlock = document.createElement("div");
  gameIDBotBlock.classList.add("clodesGameTextContainer");
  gameIDBotBlock.id = "game" + game.id + "ID";
  gameIDHolderBlock.appendChild(gameIDBotBlock);

  var gameNBPHolderBlock = document.createElement("div");
  gameNBPHolderBlock.classList.add("closedGameTextHolderContainer");
  gameBlock.appendChild(gameNBPHolderBlock);

  var gameNBPTopBlock = document.createElement("div");
  gameNBPTopBlock.classList.add("closedGameTextContainer");
  gameNBPTopBlock.innerHTML = "Aantal spelers:";
  gameNBPHolderBlock.appendChild(gameNBPTopBlock);

  var gameNBPBotBlock = document.createElement("div");
  gameNBPBotBlock.classList.add("clodesGameTextContainer");
  gameNBPBotBlock.id = "game" + game.id + "NBP";
  gameNBPHolderBlock.appendChild(gameNBPBotBlock);

  var gameType = document.getElementById("game" + game.id + "Type");
  gameType.innerHTML = game.type.name;
  var gameID = document.getElementById("game" + game.id + "ID");
  gameID.innerHTML = game.id;
  var gameNBP = document.getElementById("game" + game.id + "NBP");
  gameNBP.innerHTML = game.nb_players;
  //var gameBlock = document.getElementById("game" + game.id);
  gameBlock.addEventListener("mouseenter", closedGameEnter);
  gameBlock.addEventListener("mouseleave", closedGameLeave);
  gameBlock.gameIndex = game.id;
  gameBlock.started = game.started;
  gameBlock.addEventListener("click", closedGameClick);
}

function closedGameEnter(evt) {
  var gameIndex;
  for (var i = 0; i < su.gameIDs.length; i++) {
    if (su.gameIDs[i] == evt.currentTarget.gameIndex) {
      gameIndex = i;
      su.gameActive[i] = true;
    }
  }
  evt.currentTarget.style.backgroundColor = GAMEHIGHLIGHT;
}

function closedGameLeave(evt) {
  var gameIndex;
  for (var i = 0; i < su.gameIDs.length; i++) {
    if (su.gameIDs[i] == evt.currentTarget.gameIndex) {
      gameIndex = i;
      break;
    }
  }
  su.gameActive[gameIndex] = false;
  evt.currentTarget.style.backgroundColor = su.gameColors[gameIndex];
}

function closedGameClick(evt) {
  var index = evt.currentTarget.gameIndex;
  checkOutGame(index, this.started);
}

function openedGameClick(evt) {
  var index = evt.currentTarget.gameIndex;
  closeGame(index, true);
}

function closeOpenedGames() {
  if (su.enteredGameID != null) {
    console.log("Leaving game: ", su.enteredGameID);
    gameS.leave();
    gameS = null;
    gameU = null;
    su.enteredGameID = null;
  }
  for (var i = 0; i < su.gameOpened.length; i++) {
    if (su.gameOpened[i]) {
      closeGame(su.gameIDs[i], false);
    }
  }
}

var firstCheckout = undefined;

function checkOutGame(index, started) {
  if (firstCheckout == index) {
    firstCheckout = undefined;
    return;
  }
  firstCheckout = index;
  var gamePos;
  for (var i = 0; i < su.gameIDs.length; i++) {
    if (su.gameIDs[i] == index) {
      gamePos = i;
      break;
    }
  }
  closeOpenedGames();
  su.gameActive[gamePos] = true;
  su.gameOpened[gamePos] = true;
  var gameBox = document.getElementById("game" + index);
  gameBox.classList.add("openedGameContainer");
  gameBox.classList.remove("closedGameContainer");
  gameBox.removeEventListener("mouseleave", closedGameLeave);
  gameBox.removeEventListener("mouseenter", closedGameEnter);
  gameBox.removeEventListener("click", closedGameClick);

  var childs = [];
  var nbChildren = gameBox.childNodes.length;
  // gameBox.childNodes;
  for (var i = 0; i < nbChildren; i++) {
    childs.push(gameBox.childNodes[0])
    gameBox.removeChild(gameBox.childNodes[0]);
  }
  var openedGameTopBox = document.createElement("div");
  openedGameTopBox.classList.add("openedGameTopContainer");
  for (var i = 0; i < childs.length; i++) {
    openedGameTopBox.appendChild(childs[i]);
  }
  gameBox.appendChild(openedGameTopBox);
  openedGameTopBox.gameIndex = gameBox.gameIndex;
  openedGameTopBox.addEventListener("click", openedGameClick);

  var openedGameBotBox = document.createElement("div");
  openedGameBotBox.classList.add("openedGameBotContainer");
  gameBox.appendChild(openedGameBotBox);

  //Check if game is already started:
  if (started) {
    var alreadyStartedDiv = document.createElement("div");
    alreadyStartedDiv.classList.add("alreadyStartedDiv");
    alreadyStartedDiv.innerHTML = "Dit spel is al begonnen";
    openedGameBotBox.appendChild(alreadyStartedDiv);
  }
  else {
    var deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Verwijder spel";
    openedGameBotBox.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", e => {
      deleteGame(index);
    });

    var enterBtn = document.createElement("button");
    enterBtn.innerHTML = "Speel mee!";
    openedGameBotBox.appendChild(enterBtn);
    enterBtn.addEventListener("click", e => {
      enterGame(index);
    });
  }
}

function enterGame(gameID) {
  console.log("enter game", gameID);
  w.enterGame(gameID);
  su.enteredGameID = gameID;
}

function deleteGame(gameID) {
  w.removeGame(gameID);
}

function closeGame(index, currentActive) {
  if (su.enteredGameID != null) {
    console.log("Leaving game: ", su.enteredGameID);
    gameS.leave();
    gameS = null;
    gameU = null;
    su.enteredGameID = null;
  }
  var gamePos;
  for (var i = 0; i < su.gameIDs.length; i++) {
    if (su.gameIDs[i] == index) {
      gamePos = i;
      break;
    }
  }
  var gameBox = document.getElementById("game" + index);
  var topBox = gameBox.childNodes[0];
  var children = [];
  var nbChildren = topBox.childNodes.length;
  for (var i = 0; i < nbChildren; i++) {
    children.push(topBox.childNodes[i])
  }
  gameBox.removeChild(topBox);
  gameBox.removeChild(gameBox.childNodes[0]);
  for (var i = 0; i < nbChildren; i++) {
    gameBox.appendChild(children[i]);
  }
  gameBox.classList.add("closedGameContainer");
  gameBox.classList.remove("openedGameContainer");
  gameBox.addEventListener("mouseleave", closedGameLeave);
  gameBox.addEventListener("mouseenter", closedGameEnter);
  gameBox.addEventListener("click", closedGameClick);
  su.gameOpened[gamePos] = false;
  if (!currentActive) {
    gameBox.style.backgroundColor = su.gameColors[gamePos];
    su.gameActive[gamePos] = false;
  }
}
