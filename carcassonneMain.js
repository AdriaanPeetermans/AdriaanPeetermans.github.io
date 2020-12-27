var SERVERIP = "127.0.0.1";

var gameU, gameS;

var moveInst;
var canvasInst;

function init() {
//Adjust canvas size:
  resizeMainCanvas();
  window.onresize = resizeMainCanvas;
//Start server comminucation:
  var port = getUrlParam("port", 0);
  console.log(port);
  gameU = new CarcassonneUser(port);
  gameS = new CarcassonneServer(SERVERIP, port, gameU);
  gameU.server = gameS;
  gameS.start();
  gameS.hello();
}

function resizeMainCanvas() {
  var mainCanvas = document.getElementById("mainCanvas");
  mainCanvas.style.width = window.innerWidth + "px";
  mainCanvas.style.height = (window.innerHeight - 75) + "px";
  if (canvasInst != null) {
    canvasInst.drawBoard();
  }
}

function initCanvas() {
  var can = document.getElementById("mainCanvas");
  canvasInst = new CarcasonneCanvas(can, 1, gameU, moveInst);
  //Testtiles:
  // var tile1 = {
	// 	sideN: {
	// 		city: 1,
	// 		cityShield: true,
	// 		road: 0,
	// 		river: 0,
	// 		grassTop: 0,
	// 		grassBot: 0
	// 	},
	// 	sideE: {
	// 		city: 2,
	// 		cityShield: false,
	// 		road: 0,
	// 		river: 0,
	// 		grassTop: 0,
	// 		grassBot: 0
	// 	},
	// 	sideS: {
	// 		city: 0,
	// 		cityShield: false,
	// 		road: 1,
	// 		river: 0,
	// 		grassTop: 1,
	// 		grassBot: 2
	// 	},
	// 	sideW: {
	// 		city: 0,
	// 		cityShield: false,
	// 		road: 1,
	// 		river: 0,
	// 		grassTop: 2,
	// 		grassBot: 1
	// 	},
	// 	monastery: false,
	// 	garden: true,
	// 	multiplicity: 1,
  //   rotation: 0
	// };
  // var tile2 = {
	// 	sideN: {
	// 		city: 1,
	// 		cityShield: false,
	// 		road: 0,
	// 		river: 0,
	// 		grassTop: 0,
	// 		grassBot: 0
	// 	},
	// 	sideE: {
	// 		city: 0,
	// 		cityShield: false,
	// 		road: 0,
	// 		river: 1,
	// 		grassTop: 1,
	// 		grassBot: 2
	// 	},
	// 	sideS: {
	// 		city: 2,
	// 		cityShield: true,
	// 		road: 0,
	// 		river: 0,
	// 		grassTop: 0,
	// 		grassBot: 0
	// 	},
	// 	sideW: {
	// 		city: 0,
	// 		cityShield: false,
	// 		road: 0,
	// 		river: 1,
	// 		grassTop: 2,
	// 		grassBot: 1
	// 	},
	// 	monastery: false,
	// 	garden: false,
  //   multiplicity: 1,
  //   rotation: 0
	// };
  // canvasInst.drawTile(tile1, {x: 0, y: 0});
  // canvasInst.drawTile(tile2, {x: 0, y: 1});
  //canvasInst.setTileToPlace(tile2);

  //var testTile = {garden: false, monastery: false, rotation: 0,
    // sideE: {grassTop: 1, city: 0, road: 1, cityShield: false, river: 0, grassBot: 2},
    // sideN: {grassTop: 0, city: 1, road: 0, cityShield: false, river: 0, grassBot: 0},
    // sideS: {grassTop: 2, city: 0, road: 0, cityShield: false, river: 0, grassBot: 2},
    // sideW: {grassTop: 2, city: 0, road: 1, cityShield: false, river: 0, grassBot: 1}};
  //canvasInst.drawTile(testTile, {x: 1, y: 1});
}

function initContainers() {
  var chatBar = document.getElementById("chatUpperBar");
  chatBar.parrentContainer = document.getElementById("chatContainer");
  chatBar.lowerBox = document.getElementById("chatLowerBox");
  chatBar.normalHeight = "350px";
  chatBar.onclick = closeContainer;
  var moveBar = document.getElementById("moveUpperBar");
  moveBar.parrentContainer = document.getElementById("moveContainer");
  moveBar.lowerBox = document.getElementById("moveLowerBox");
  moveBar.normalHeight = "200px";
  moveBar.onclick = closeContainer;
  var otherPlayerBar = document.getElementById("otherPlayerUpperBar");
  otherPlayerBar.parrentContainer = document.getElementById("otherPlayerContainer");
  otherPlayerBar.lowerBox = document.getElementById("otherPlayerLowerBox");
  otherPlayerBar.normalHeight = "400px";
  otherPlayerBar.onclick = closeContainer;
  var gameInfoBar = document.getElementById("gameInfoUpperBar");
  gameInfoBar.parrentContainer = document.getElementById("gameInfoContainer");
  gameInfoBar.lowerBox = document.getElementById("gameInfoLowerBox");
  gameInfoBar.normalHeight = "150px";
  gameInfoBar.onclick = closeContainer;

  //init container internals:
  moveInst = new MoveContainer(document.getElementById("moveLowerBox"), gameU);
  canvasInst.moveContainer = moveInst;
}

//Decode URL:
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

function getUrlParam(parameter, defaultvalue){
  var urlparameter = defaultvalue;
  if(window.location.href.indexOf(parameter) > -1){
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
}

class CarcassonneUser {

  port;
  server;

  askingForPos = false;
  askingForMeeple = false;

  constructor(port) {
    this.port = port;
  }

  handleCarcassonneHello(answer) {
    console.log("Received hello: ", answer);

    this.primaryColors = answer.primaryColors;
    this.secondaryColors = answer.secondaryColors;
    this.tertiaryColors = answer.tertiaryColors;
    this.quaternaryColors = answer.quaternaryColors;

    this.server.getSettings();
  }

  handleGetSettings(answer) {
    console.log("Received settings: ", answer);

    this.settingAbbot = answer.abbot;
    this.settingNumberMeeples = answer.numberMeeples;
    this.settingRiver = answer.river;

    this.server.readyToStart();
    initCanvas();
    initContainers();
  }

  handleNotifyStart(answer) {
    console.log("And the game is started! ", answer);

    moveInst.updateMyScore(0);
  }

  handleReadyToStart(answer) {
    console.log("Ready to start well received: ", answer);
  }

  handleNotifyNumberPlayers(answer) {
    console.log("Number players: ", answer);

    this.numberPlayers = answer.numberPlayers;
    this.playerColorIndexes = answer.playerColorIndexes;
    this.playerNames = answer.playerNames;
    this.playerNumbers = answer.playerNumbers;
  }

  handleNotifyPlayerNumber(answer) {
    console.log("My player number: ", answer);
    if (this.playerNumbers == null) {
      return;
    }
    for (var i = 0; i < this.playerNumbers.length; i++) {
      if (this.playerNumbers[i] == answer.playerNumber) {
        this.myIndex = i;
        break;
      }
    }
    moveInst.updateMeepleColors();
  }

  handleNewTile(answer) {
    console.log("New tile: ", answer);
    canvasInst.drawTile(canvasInst.convertTile(answer.tile), {x: answer.pos.posX, y: answer.pos.posY});
  }

  handleNumberTiles(answer) {
    console.log("Number tiles left: ", answer);
  }

  handleNumberMeeplesLeft(answer) {
    console.log("Number of meeples left: ", answer);
    moveInst.updateNumberMeeples(answer.numberMeeples);
    this.numberMeeplesLeft = answer.numberMeeples;
  }

  handleNumberAbbotsLeft(answer) {
    console.log("Number of abbots left: ", answer);
    moveInst.updateNumberAbbots(answer.left + 0);
    this.numberAbbotsLeft = answer.left + 0;
  }

  handleTileToPlace(answer) {
    console.log("Tile to place: ", answer);
    canvasInst.drawBoard();
    moveInst.setTile(canvasInst.convertTile(answer.tile));
  }

  handleGetPos(answer) {
    console.log("Asking for pos: ", answer);
    this.askingForPos = true;
  }

  setPos(position, rotation) {
    if (this.askingForPos) {
      this.askingForPos = false;
      var orientation = canvasInst.convertToOrientation(rotation);
      this.server.setPos(position, orientation);
    }
  }

  handleGetMeeple(answer) {
    console.log("Get meeple question: ", answer);
    this.askingForMeeple = true;
    //Highlight meeple positions here.
    moveInst.selectMeeple();
    canvasInst.selectMeeple(moveInst.abbot);
  }

  setMeeple(isAbbot, monastery, garden, road, city, grass, position) {
    if (this.askingForMeeple) {
      this.askingForMeeple = false;
      this.server.setMeeple(isAbbot, monastery, garden, road, city, grass, {posX: position.xi, posY: position.yi});
      canvasInst.resetSelectMeeple();
    }
  }

  handleNewMeeple(answer) {
    console.log("New Meeple: ", answer);
    var pos = answer.meeple.position;
    answer.meeple.position = {xi: pos.posX, yi: pos.posY};
    canvasInst.newMeeple(answer.meeple, answer.playerNumber);
  }

  handleMeepleRelease(answer) {
    console.log("Meeple released: ", answer);
    canvasInst.releaseMeeple(answer.meeple, answer.playerNumber);
  }

  handleScores(answer) {
    console.log("New Scores: ", answer);
    var newScore = answer.scores[this.playerNumbers[this.myIndex]];
    moveInst.updateMyScore(newScore);
  }
}

function closeContainer() {
  this.parrentContainer.style.height = "20px";
  this.lowerBox.style.height = "0px";
  this.onclick = openContainer;
}

function openContainer() {
  this.parrentContainer.style.height = this.normalHeight;
  this.lowerBox.style.height = "100%";
  this.onclick = closeContainer;
}

class MoveContainer {

  mainDiv;
  zoomDiv;
  tileDiv;
  tileCanvas;
  meepleDiv;
  scoreDiv;
  scoreLeftPointsValueDiv;
  scoreRightCityValueDiv;
  scoreRightRoadValueDiv;
  scoreRightMonasteryValueDiv;
  scoreRightGrassValueDiv;
  currentTile;
  meepleSVGLeft;
  meepleSVGRight;
  meepleNumberMeepleDiv;
  meepleNumberAbbotDiv;

  constructor(mainDiv, user) {
    this.mainDiv = mainDiv;
    this.user = user;
    this.initWindow();

    //Testing
    // this.setTile({
  	// 	sideN: {
  	// 		city: 1,
  	// 		cityShield: false,
  	// 		road: 0,
  	// 		river: 0,
  	// 		grassTop: 0,
  	// 		grassBot: 0
  	// 	},
  	// 	sideE: {
  	// 		city: 0,
  	// 		cityShield: false,
  	// 		road: 0,
  	// 		river: 1,
  	// 		grassTop: 1,
  	// 		grassBot: 2
  	// 	},
  	// 	sideS: {
  	// 		city: 2,
  	// 		cityShield: true,
  	// 		road: 0,
  	// 		river: 0,
  	// 		grassTop: 0,
  	// 		grassBot: 0
  	// 	},
  	// 	sideW: {
  	// 		city: 0,
  	// 		cityShield: false,
  	// 		road: 0,
  	// 		river: 1,
  	// 		grassTop: 2,
  	// 		grassBot: 1
  	// 	},
  	// 	monastery: false,
  	// 	garden: false,
    //   multiplicity: 1,
    //   rotation: 0
  	// });
  }

  initWindow() {
    this.initZoomDiv();
    this.initTileDiv();
    this.initMeepleDiv();
    this.initScoreDiv();
  }

  initZoomDiv() {
    this.zoomDiv = document.createElement("div");
    this.zoomDiv.id = "moveZoomDiv";
    this.mainDiv.appendChild(this.zoomDiv);
    var zoomTextDiv = document.createElement("div");
    zoomTextDiv.id = "moveZoomTextDiv";
    zoomTextDiv.innerHTML = "Zoom bord";
    this.zoomDiv.appendChild(zoomTextDiv);
    var zoomPlusDiv = document.createElement("div");
    zoomPlusDiv.classList.add("moveZoomBut");
    zoomPlusDiv.innerHTML = "+";
    this.zoomDiv.appendChild(zoomPlusDiv);
    var zoomMinDiv = document.createElement("div");
    zoomMinDiv.classList.add("moveZoomBut");
    zoomMinDiv.innerHTML = "-";
    this.zoomDiv.appendChild(zoomMinDiv);
    //Buttons:
    zoomPlusDiv.onmousedown = this.zoomMouseDown;
    zoomPlusDiv.onmouseup = this.zoomMouseUp;
    zoomPlusDiv.onclick = this.zoomPlusClick;
    zoomPlusDiv.onmouseenter = this.zoomMouseEnter;
    zoomPlusDiv.onmouseleave = this.zoomMouseLeave;
    zoomMinDiv.onmousedown = this.zoomMouseDown;
    zoomMinDiv.onmouseup = this.zoomMouseUp;
    zoomMinDiv.onclick = this.zoomMinClick;
    zoomMinDiv.onmouseenter = this.zoomMouseEnter;
    zoomMinDiv.onmouseleave = this.zoomMouseLeave;
  }

  zoomMouseDown() {
    this.classList.remove("moveZoomBut");
    this.classList.add("moveZoomButPressed");
  }

  zoomMouseUp() {
    this.classList.remove("moveZoomButPressed");
    this.classList.add("moveZoomBut");
  }

  zoomPlusClick() {
    canvasInst.zoomIn();
  }

  zoomMinClick() {
    canvasInst.zoomOut();
  }

  zoomMouseEnter() {
    this.style.backgroundColor = "#EED2BF";
  }

  zoomMouseLeave() {
    this.style.backgroundColor = "#BA4A00";
  }

  initTileDiv() {
    this.tileDiv = document.createElement("div");
    this.tileDiv.id = "moveTileDiv";
    this.mainDiv.appendChild(this.tileDiv);
    var tileTextDiv = document.createElement("div");
    tileTextDiv.id = "moveTileTextDiv";
    tileTextDiv.innerHTML = "Tegel";
    this.tileDiv.appendChild(tileTextDiv);
    this.tileCanvas = document.createElement("canvas");
    this.tileCanvas.id = "moveTileCanvas";
    this.tileCanvas.width = 170;
    this.tileCanvas.height = 130;
    this.tileDiv.appendChild(this.tileCanvas);
    this.initTileCanvas();
  }

  initTileCanvas() {
    var ctx = this.tileCanvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#BA4A00";
    ctx.moveTo(35.5, 129.5);
    ctx.lineTo(35.5, 30.5);
    ctx.lineTo(134.5, 30.5);
    ctx.lineTo(134.5, 129.5);
    ctx.lineTo(35.5, 129.5);
    ctx.stroke();
    this.drawArrowLeft("#BA4A00");
    this.drawArrowRight("#BA4A00");
    this.tileCanvas.container = this;
    this.tileCanvas.onmousemove = this.mouseMoveCanvas;
    this.tileCanvas.onclick = this.mouseClickCanvas;
  }

  mouseClickCanvas(evt) {
    if (this.container.currentTile == null) {
      return;
    }
    var x = evt.layerX;
    var y = evt.layerY;
    if (this.container.mouseCloseArrowLeft(x, y)) {
      var rotation = this.container.currentTile.rotation;
      rotation = rotation - 1;
      if (rotation < 0) {
        rotation = rotation + 4;
      }
      this.container.currentTile.rotation = rotation;
      this.container.drawTile(this.container.currentTile);
      canvasInst.setTileToPlace(this.container.currentTile);
    }
    if (this.container.mouseCloseArrowRight(x, y)) {
      var rotation = this.container.currentTile.rotation;
      rotation = rotation + 1;
      if (rotation > 3) {
        rotation = rotation - 4;
      }
      this.container.currentTile.rotation = rotation;
      this.container.drawTile(this.container.currentTile);
      canvasInst.setTileToPlace(this.container.currentTile);
    }
  }

  mouseMoveCanvas(evt) {
    var x = evt.layerX;
    var y = evt.layerY;
    if (this.container.mouseCloseArrowLeft(x, y)) {
      this.container.drawArrowLeft("#EED2BF");
      this.container.drawArrowRight("#BA4A00");
      this.style.cursor = "pointer";
    }
    else {
      if (this.container.mouseCloseArrowRight(x, y)) {
        this.container.drawArrowRight("#EED2BF");
        this.container.drawArrowLeft("#BA4A00");
        this.style.cursor = "pointer";
      }
      else {
        this.container.drawArrowLeft("#BA4A00");
        this.container.drawArrowRight("#BA4A00");
        this.style.cursor = "auto";
      }
    }
  }

  mouseCloseArrowLeft(x, y) {
    var distL = Math.sqrt((55-x)**2 + (50-y)**2);
    if (Math.abs(distL-35) < 10) {
      var alpha = Math.atan((50-y)/(x-55))/Math.PI*180;
      if ((alpha < 0) && (x < 55)) {
        return true;
      }
    }
    return false;
  }

  mouseCloseArrowRight(x, y) {
    var distR = Math.sqrt((115-x)**2 + (50-y)**2);
    if (Math.abs(distR-35) < 10) {
      var alpha = Math.atan((50-y)/(x-115))/Math.PI*180;
      if ((alpha > 0) && (x > 115)) {
        return true;
      }
    }
    return false;
  }

  drawTile(tile) {
    var tileDrawer = new TileDrawer(this.tileCanvas, tile);
    tileDrawer.drawTile(85, 80, 95);
  }

  resetTile() {
    var ctx = this.tileCanvas.getContext('2d');
    ctx.clearRect(37, 32, 96, 96);
    this.currentTile = null;
    canvasInst.setTileToPlace(null);
  }

  setTile(tile) {
    this.currentTile = tile;
    this.drawTile(this.currentTile);
    canvasInst.setTileToPlace(tile);
  }

  drawArrowLeft(color) {
    var ctx = this.tileCanvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(55, 50, 35, Math.PI, 1.5*Math.PI);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(30, 50);
    ctx.lineTo(20, 70);
    ctx.lineTo(10, 50);
    ctx.closePath();
    ctx.fill();
  }

  drawArrowRight(color) {
    var ctx = this.tileCanvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(115, 50, 35, 1.5*Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 50);
    ctx.lineTo(160, 50);
    ctx.lineTo(150, 70);
    ctx.lineTo(140, 50);
    ctx.closePath();
    ctx.fill();
  }

  initMeepleDiv() {
    this.meepleDiv = document.createElement("div");
    this.meepleDiv.id = "moveMeepleDiv";
    this.mainDiv.appendChild(this.meepleDiv);
    var meepleTextDiv = document.createElement("div");
    meepleTextDiv.id = "moveMeepleTextDiv";
    meepleTextDiv.innerHTML = "Meeples";
    this.meepleDiv.appendChild(meepleTextDiv);
    var meepleSVGDiv = document.createElement("div");
    meepleSVGDiv.id = "moveMeepleSVGDiv";
    this.meepleDiv.appendChild(meepleSVGDiv);
    var meepleLeftContainer = document.createElement("div");
    meepleLeftContainer.classList.add("moveMeepleContainer");
    meepleSVGDiv.appendChild(meepleLeftContainer);
    var meepleRightContainer = document.createElement("div");
    meepleRightContainer.classList.add("moveMeepleContainer");
    meepleSVGDiv.appendChild(meepleRightContainer);
    this.meepleSVGLeft = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.meepleSVGLeft.id = "moveMeepleSVGLeft";
    meepleLeftContainer.appendChild(this.meepleSVGLeft);
    this.meepleSVGRight = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.meepleSVGRight.id = "moveMeepleSVGRight";
    meepleRightContainer.appendChild(this.meepleSVGRight);
    this.drawMeeple(this.meepleSVGLeft);
    this.drawAbbot(this.meepleSVGRight);
    this.meepleNumberMeepleDiv = document.createElement("div");
    this.meepleNumberMeepleDiv.classList.add("moveMeepleNumberDiv");
    this.meepleNumberMeepleDiv.innerHTML = "XX";
    meepleLeftContainer.appendChild(this.meepleNumberMeepleDiv);
    this.meepleNumberAbbotDiv = document.createElement("div");
    this.meepleNumberAbbotDiv.classList.add("moveMeepleNumberDiv");
    this.meepleNumberAbbotDiv.innerHTML = "XX";
    meepleRightContainer.appendChild(this.meepleNumberAbbotDiv);
    //TBF
  }

  updateNumberMeeples(number) {
    this.meepleNumberMeepleDiv.innerHTML = number;
  }

  updateNumberAbbots(number) {
    this.meepleNumberAbbotDiv.innerHTML = number;
  }

  drawMeeple(svg) {
    this.meeplePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.meeplePath.classList.add("moveMeeplePath");
    this.updatePathColor(this.meeplePath);
    this.meeplePath.setAttribute("d", "m 26.7534,40.725049 c 0.46526,1.04936 0.88969,1.73251 1.36535,3.05796 0.427,1.17563 0.8228,2.21155 1.59326,3.49122 0.41451,0.436 0.86197,0.85223 1.57297,1.11034 3.1812,0.42498 6.25016,0.0643 9.37469,0.0925 1.52478,0.0736 3.24662,0.0481 4.87459,-0.0925 0.48419,-0.15048 0.94569,-0.6815 0.96813,-1.50301 0.12935,-0.62315 0.0905,-1.24558 -0.13538,-2.10558 -0.33624,-1.10834 -0.85461,-2.62292 -1.29084,-3.73715 -0.70464,-1.75802 -1.34565,-3.1099 -2.41027,-4.86793 -1.56044,-2.45758 -2.80133,-4.97906 -4.07123,-7.49474 -0.32718,-0.71552 -0.55393,-1.44537 -0.46263,-2.22067 0.0183,-0.40779 0.12714,-0.78844 0.74022,-1.01781 0.9768,-0.31859 2.21508,-0.37569 3.42353,-0.46264 1.58563,0.001 3.0669,-0.51857 4.53385,-1.11033 0.77863,-0.40503 1.5431,-0.83129 1.85056,-1.94308 0.25315,-0.77863 1.2e-4,-1.50102 -0.27758,-2.22067 -0.58786,-0.91127 -1.30559,-1.76687 -2.3132,-2.49825 -1.37172,-1.0542 -3.22647,-1.99061 -4.69392,-2.62227 -1.22171,-0.5033 -2.44547,-1.00456 -3.7261,-1.44895 -1.5856,-0.65611 -3.18362,-1.2223 -4.81145,-1.57297 -0.39729,-0.811857 -0.1516,-2.8033702 -1.33824,-5.8901232 -0.49309,-0.992975 -0.8397,-1.963458 -1.99275,-2.900014 -1.497,-1.156905 -2.5781,-1.36308 -4.52696,-1.36308 -1.94886,0 -3.02995,0.206175 -4.52695,1.36308 -1.15306,0.936556 -1.49967,1.907039 -1.99276,2.900014 -1.18664,3.086753 -0.94094,5.0782662 -1.33824,5.8901232 -1.62783,0.35067 -3.22585,0.91686 -4.81145,1.57297 -1.280633,0.44439 -2.5043931,0.94565 -3.7261041,1.44895 -1.467447,0.63166 -3.322194,1.56807 -4.69392,2.62227 -1.007607,0.73138 -1.725339,1.58698 -2.313192,2.49825 -0.277707,0.71965 -0.530733,1.44204 -0.277584,2.22067 0.307455,1.11179 1.07193,1.53805 1.850556,1.94308 1.466955,0.59176 2.94822,1.11199 4.533858,1.11033 1.208445,0.0869 2.4467281,0.14405 3.4235281,0.46264 0.613088,0.22937 0.721888,0.61002 0.740218,1.01781 0.0913,0.7753 -0.13544,1.50515 -0.462634,2.22067 -1.269891,2.51568 -2.5107901,5.03716 -4.0712221,7.49474 -1.064619,1.75803 -1.705632,3.10991 -2.410269,4.86793 -0.436233,1.11423 -0.954606,2.62881 -1.290843,3.73715 -0.225921,0.86 -0.264732,1.48243 -0.135384,2.10558 0.02244,0.82151 0.483939,1.35253 0.968136,1.50301 1.627971,0.14066 3.349803,0.16613 4.874589,0.0925 3.1245271,-0.0282 6.1934871,0.33246 9.3746871,-0.0925 0.711,-0.25811 1.15846,-0.67434 1.57297,-1.11034 0.77046,-1.27967 1.16626,-2.31559 1.59326,-3.49122 0.47566,-1.32545 0.90009,-2.0086 1.36536,-3.05796 0.16158,-0.34037 0.6671,-2.09706 1.75339,-2.0559 1.08629,-0.0412 1.59181,1.71553 1.7534,2.0559 z");
    svg.appendChild(this.meeplePath);
  }

  drawAbbot(svg) {
    this.abbotPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.abbotPath.classList.add("moveMeeplePath");
    this.updatePathColor(this.abbotPath);
    this.abbotPath.setAttribute("d", "m 35.348069,48.830709 6.027217,-0.15254 c 0.921873,0 1.084719,-0.549127 1.449589,-1.296996 0.210368,-0.511061 0.126698,-1.207636 -0.07259,-1.935264 -0.316121,-1.179886 -0.828928,-2.171276 -1.453312,-3.252744 -0.732702,-1.269114 -1.185456,-2.400608 -2.316723,-3.531871 -1.362828,-1.362847 -2.001509,-2.122039 -3.176421,-3.029437 -0.148543,-0.279744 -0.172688,-0.55949 0.15259,-0.839234 1.761076,-0.928501 4.382336,-1.20644 5.41687,-1.983643 0.393836,-0.3887 0.870302,-0.738309 1.068114,-1.449585 0.107385,-0.574547 0.165176,-1.224781 -0.228885,-1.907349 -0.461542,-0.79942 -1.992261,-1.371942 -3.051755,-1.983642 0,0 -2.538147,-1.319768 -4.196168,-1.525879 -1.464205,-0.249137 -2.064388,-0.25587 -4.057396,-0.285957 0.514753,-0.891579 0.458462,-1.083693 0.816904,-1.704533 0.582983,-1.009756 0.456261,-2.314573 -0.01862,-3.503916 -0.392151,-0.97434 -0.602858,-1.089253 -1.166738,-1.648701 -0.420661,-0.419602 -0.648286,-0.983902 -0.241906,-1.687773 1.793963,-2.1766 3.642126,-6.390474 3.675929,-7.9537886 0,-0.9126476 -7.673613,-8.06483 -8.97477,-8.06483 -1.301157,0 -8.97477,7.1521824 -8.97477,8.06483 0.03381,1.5633146 1.881966,5.7771866 3.675928,7.9537876 0.406382,0.703871 0.178752,1.268171 -0.241904,1.687773 -0.563883,0.559447 -0.77459,0.674361 -1.166741,1.648701 -0.474871,1.189343 -0.601594,2.494159 -0.0186,3.503915 0.358447,0.620841 0.30215,0.812954 0.816905,1.704534 -1.993027,0.03009 -2.59321,0.03681 -4.057418,0.285955 -1.658016,0.206113 -4.196162,1.52588 -4.196162,1.52588 -1.0594938,0.6117 -2.5902113,1.184222 -3.0517563,1.983643 -0.394081,0.682567 -0.3362928,1.332802 -0.2288852,1.907349 0.1978195,0.711275 0.6742795,1.060883 1.0681155,1.449584 1.0345337,0.777203 3.655795,1.055142 5.41687,1.983643 0.325278,0.279742 0.301133,0.559489 0.15259,0.839234 -1.174911,0.9074 -1.813589,1.666592 -3.176429,3.029427 -1.1312662,1.131264 -1.5840222,2.262757 -2.3167358,3.531853 -0.6243851,1.081467 -1.1371598,2.072857 -1.4533033,3.252725 -0.1993032,0.727628 -0.2829268,1.424199 -0.072574,1.935264 0.3648694,0.747873 0.5277175,1.296995 1.4495851,1.296995 l 6.027218,0.152541 10.396438,0.07631 z");
    svg.appendChild(this.abbotPath);
  }

  updatePathColor(path) {
    if ((this.user.primaryColors != null) && (this.user.myIndex != null)) {
      path.style.fill = this.user.primaryColors[this.user.playerColorIndexes[this.user.myIndex]];
      path.style.stroke = this.user.tertiaryColors[this.user.playerColorIndexes[this.user.myIndex]];
    }
  }

  updateMeepleColors() {
    if ((this.meeplePath != null) && (this.abbotPath != null)) {
      this.updatePathColor(this.meeplePath);
      this.updatePathColor(this.abbotPath);
    }
  }

  updateMyScore(newScore) {
    this.scoreLeftPointsValueDiv.innerHTML = newScore.toString();
  }

  initScoreDiv() {
    this.scoreDiv = document.createElement("div");
    this.scoreDiv.id = "moveScoreDiv";
    this.mainDiv.appendChild(this.scoreDiv);
    var scoreLeftDiv = document.createElement("div");
    scoreLeftDiv.id = "moveScoreLeftDiv";
    this.scoreDiv.appendChild(scoreLeftDiv);
    var scoreLeftPointsDiv = document.createElement("div");
    scoreLeftPointsDiv.id = "moveScoreLeftPointsDiv";
    scoreLeftPointsDiv.innerHTML = "Punten";
    scoreLeftDiv.appendChild(scoreLeftPointsDiv);
    this.scoreLeftPointsValueDiv = document.createElement("div");
    this.scoreLeftPointsValueDiv.id = "moveScoreLeftPointsValueDiv";
    this.scoreLeftPointsValueDiv.innerHTML = "XX";
    scoreLeftDiv.appendChild(this.scoreLeftPointsValueDiv);
    var scoreLeftEndPointsDiv1 = document.createElement("div");
    scoreLeftEndPointsDiv1.id = "moveScoreLeftEndPointsDiv1";
    scoreLeftEndPointsDiv1.innerHTML = "Punten";
    scoreLeftDiv.appendChild(scoreLeftEndPointsDiv1);
    var scoreLeftEndPointsDiv2 = document.createElement("div");
    scoreLeftEndPointsDiv2.id = "moveScoreLeftEndPointsDiv2";
    scoreLeftEndPointsDiv2.innerHTML = "einde spel";
    scoreLeftDiv.appendChild(scoreLeftEndPointsDiv2);
    this.scoreLeftEndPointsValueDiv = document.createElement("div");
    this.scoreLeftEndPointsValueDiv.id = "moveScoreLeftEndPointsValueDiv";
    this.scoreLeftEndPointsValueDiv.innerHTML = "XX";
    scoreLeftDiv.appendChild(this.scoreLeftEndPointsValueDiv);
    var scoreRightDiv = document.createElement("div");
    scoreRightDiv.id = "moveScoreRightDiv";
    this.scoreDiv.appendChild(scoreRightDiv);
    var scoreRightCityDiv = document.createElement("div");
    scoreRightCityDiv.classList.add("moveScoreRightEl");
    scoreRightDiv.appendChild(scoreRightCityDiv);
    var scoreRightCityTextDiv = document.createElement("div");
    scoreRightCityTextDiv.classList.add("moveScoreRightTextEl");
    scoreRightCityTextDiv.innerHTML = "Stad:";
    scoreRightCityDiv.appendChild(scoreRightCityTextDiv);
    this.scoreRightCityValueDiv = document.createElement("div");
    this.scoreRightCityValueDiv.classList.add("moveScoreRightValueEl");
    this.scoreRightCityValueDiv.innerHTML = "XX + XX";
    scoreRightCityDiv.appendChild(this.scoreRightCityValueDiv);
    var scoreRightRoadDiv = document.createElement("div");
    scoreRightRoadDiv.classList.add("moveScoreRightEl");
    scoreRightDiv.appendChild(scoreRightRoadDiv);
    var scoreRightRoadTextDiv = document.createElement("div");
    scoreRightRoadTextDiv.classList.add("moveScoreRightTextEl");
    scoreRightRoadTextDiv.innerHTML = "Weg:";
    scoreRightRoadDiv.appendChild(scoreRightRoadTextDiv);
    this.scoreRightRoadValueDiv = document.createElement("div");
    this.scoreRightRoadValueDiv.classList.add("moveScoreRightValueEl");
    this.scoreRightRoadValueDiv.innerHTML = "XX + XX";
    scoreRightRoadDiv.appendChild(this.scoreRightRoadValueDiv);
    var scoreRightMonasteryDiv = document.createElement("div");
    scoreRightMonasteryDiv.classList.add("moveScoreRightEl");
    scoreRightDiv.appendChild(scoreRightMonasteryDiv);
    var scoreRightMonasteryTextDiv = document.createElement("div");
    scoreRightMonasteryTextDiv.classList.add("moveScoreRightTextEl");
    scoreRightMonasteryTextDiv.innerHTML = "Klooster:";
    scoreRightMonasteryDiv.appendChild(scoreRightMonasteryTextDiv);
    this.scoreRightMonasteryValueDiv = document.createElement("div");
    this.scoreRightMonasteryValueDiv.classList.add("moveScoreRightValueEl");
    this.scoreRightMonasteryValueDiv.innerHTML = "XX + XX";
    scoreRightMonasteryDiv.appendChild(this.scoreRightMonasteryValueDiv);
    var scoreRightGrassDiv = document.createElement("div");
    scoreRightGrassDiv.classList.add("moveScoreRightEl");
    scoreRightDiv.appendChild(scoreRightGrassDiv);
    var scoreRightGrassTextDiv = document.createElement("div");
    scoreRightGrassTextDiv.classList.add("moveScoreRightTextEl");
    scoreRightGrassTextDiv.innerHTML = "Weide:";
    scoreRightGrassDiv.appendChild(scoreRightGrassTextDiv);
    this.scoreRightGrassValueDiv = document.createElement("div");
    this.scoreRightGrassValueDiv.classList.add("moveScoreRightValueEl");
    this.scoreRightGrassValueDiv.innerHTML = "XX + XX";
    scoreRightGrassDiv.appendChild(this.scoreRightGrassValueDiv);
    //TBF
  }

  selectMeeple() {
    this.resetTile();
    this.meeplePath.style.cursor = "pointer";
    this.abbotPath.style.cursor = "pointer";
    if (this.user.numberMeeplesLeft > 0) {
      this.abbot = false;
      this.meeplePath.style.fill = this.user.quaternaryColors[this.user.playerColorIndexes[this.user.myIndex]];
    }
    else {
      if (this.user.numberAbbotsLeft > 0) {
        this.abbot = true;
        this.abbotPath.style.fill = this.user.quaternaryColors[this.user.playerColorIndexes[this.user.myIndex]];
      }
      else {
        this.abbot = null;
      }
    }
    this.meeplePath.move = this;
    this.abbotPath.move = this;
    this.meeplePath.onclick = this.mouseClickMeeple;
    this.abbotPath.onclick = this.mouseClickAbbot;
  }

  mouseClickMeeple() {
    if ((!this.move.abbot) && (this.move.abbot != null)) {
      this.move.abbot = null;
      this.move.meeplePath.style.fill = this.move.user.primaryColors[this.move.user.playerColorIndexes[this.move.user.myIndex]];
      canvasInst.selectMeepleSwitchAbbot(this.move.abbot);
      return;
    }
    if (this.move.user.numberMeeplesLeft == 0) {
      return;
    }
    this.move.abbot = false;
    this.move.abbotPath.style.fill = this.move.user.primaryColors[this.move.user.playerColorIndexes[this.move.user.myIndex]];
    this.move.meeplePath.style.fill = this.move.user.quaternaryColors[this.move.user.playerColorIndexes[this.move.user.myIndex]];
    canvasInst.selectMeepleSwitchAbbot(this.move.abbot);
  }

  mouseClickAbbot() {
    if (!gameU.settingAbbot) {
      return;
    }
    if (this.move.abbot) {
      this.move.abbot = null;
      this.move.abbotPath.style.fill = this.move.user.primaryColors[this.move.user.playerColorIndexes[this.move.user.myIndex]];
      canvasInst.selectMeepleSwitchAbbot(this.move.abbot);
      return;
    }
    if (this.move.user.numberAbbotsLeft == 0) {
      return;
    }
    this.move.abbot = true;
    this.move.abbotPath.style.fill = this.move.user.quaternaryColors[this.move.user.playerColorIndexes[this.move.user.myIndex]];
    this.move.meeplePath.style.fill = this.move.user.primaryColors[this.move.user.playerColorIndexes[this.move.user.myIndex]];
    canvasInst.selectMeepleSwitchAbbot(this.move.abbot);
  }

  resetSelectMeeple() {
    this.meeplePath.style.cursor = null;
    this.abbotPath.style.cursor = null;
    this.meeplePath.style.fill = this.user.primaryColors[this.user.playerColorIndexes[this.user.myIndex]];
    this.abbotPath.style.fill = this.user.primaryColors[this.user.playerColorIndexes[this.user.myIndex]];
  }
}
