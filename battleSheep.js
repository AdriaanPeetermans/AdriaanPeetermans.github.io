class Board {
  constructor(size, initialField) {
    if (size == null) {
      this.field = initialField;
      this.size = (initialField.length-1)/2;
    }
    else {
      this.size = size;
      this.initField();
    }
  }

  initField() {
    this.field = [];
    for (var r = 0; r < this.size*2+1; r++) {
      var row = [];
      for (var q = 0; q < 2*this.size+1 - Math.abs(this.size-r); q++) {
        row.push(0);
      }
      this.field.push(row);
    }
  }

  onePiece() {

  }

  getNeighbors(hex) {
    var result = [];
    if (hex.q > 0) {
      result.push({r: hex.r, q: hex.q-1});
    }
    var maxQ = 2*this.size+1 - Math.abs(this.size-hex.r);
    if (hex.q < maxQ-1) {
      result.push({r: hex.r, q: hex.q+1});
    }
    //Upper neighbors:
    if (hex.r > 0) {
      if (hex.r <= this.size) {
        if (hex.q < maxQ-1) {
          result.push({r: hex.r-1, q:hex.q});
        }
        if (hex.q > 0) {
          result.push({r: hex.r-1, q: hex.q-1});
        }
      }
      else {
        result.push({r: hex.r-1, q: hex.q});
        result.push({r: hex.r-1, q: hex.q+1});
      }
    }
    //Lower neighbors:
    if (hex.r < 2*this.size) {
      if (hex.r < this.size) {
        result.push({r: hex.r+1, q: hex.q});
        result.push({r: hex.r+1, q: hex.q+1});
      }
      else {
        if (hex.q < maxQ-1) {
          result.push({r: hex.r+1, q: hex.q});
        }
        if (hex.q > 0) {
          result.push({r: hex.r+1, q: hex.q-1})
        }
      }
    }
    return result;
  }
}

class BoardVisualiser {
  constructor(canvas, board) {
    this.canvas = canvas;
    this.board = board;
    this.ctx = this.canvas.getContext("2d");
    this.initFieldCenters();
  }

  initFieldCenters() {
    this.borderWidth = Math.min(this.canvas.width, this.canvas.height)*0.05;
    var sizeX = (this.canvas.width - 2*this.borderWidth)/(2*this.board.size)/Math.sqrt(3);
    var sizeY = (this.canvas.height - 2*this.borderWidth)/((this.board.size)*2*1.5+2);
    this.tileSize = Math.min(sizeX, sizeY);
    var midpoint = {x: this.canvas.width/2, y:this.canvas.height/2};
    this.tileCenters = [];
    for (var r = 0; r < this.board.size*2+1; r++) {
      var row = [];
      var y = midpoint.y + (r-this.board.size)*3/2*this.tileSize;
      for (var q = 0; q < 2*this.board.size+1 - Math.abs(this.board.size-r); q++) {
        var midRow = this.board.size - Math.abs(this.board.size-r)/2;
        var x = midpoint.x + (q-midRow)*Math.sqrt(3)*this.tileSize;
        row.push({x: x, y: y});
      }
      this.tileCenters.push(row);
    }
  }

  getPointHex(r, q, i) {
    var center = this.tileCenters[r][q];
    var angle = Math.PI/180*(60*i - 30);
    return {x: center.x + this.tileSize*Math.cos(angle), y: center.y + this.tileSize*Math.sin(angle)};
  }

  drawHexes() {
    this.ctx.strokeStyle = "#000000";
    for (var r = 0; r < this.board.size*2+1; r++) {
      for (var q = 0; q < 2*this.board.size+1 - Math.abs(this.board.size-r); q++) {
        this.ctx.beginPath();
        for (var i = 0; i < 6; i++) {
          var point = this.getPointHex(r, q, i);
          if (i == 0) {
            this.ctx.moveTo(point.x, point.y);
          }
          else {
            this.ctx.lineTo(point.x, point.y);
          }
        }
        this.ctx.closePath();
        this.ctx.stroke();
        if (this.board.field[r][q] == 1) {
          this.ctx.fillStyle = "#28B463";
          this.ctx.fill();
        }
        if (this.board.field[r][q] == 0.5) {
          this.ctx.fillStyle = "#85C1E9";
          this.ctx.fill();
        }
        if (this.board.field[r][q] == 0.25) {
          this.ctx.fillStyle = "#F1948A";
          this.ctx.fill();
        }
      }
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.clearCanvas();
    this.drawHexes();
  }

  getPoint(pixel) {
    var midpoint = {x: this.canvas.width/2, y:this.canvas.height/2};
    var r =  Math.round((pixel.y - midpoint.y)/3*2/this.tileSize + this.board.size);
    var midRow = this.board.size - Math.abs(this.board.size-r)/2;
    var q = Math.round((pixel.x-midpoint.x)/Math.sqrt(3)/this.tileSize + midRow);
    return {r: r, q: q};
  }
}

class HumanInteractor {
  constructor(board, boardVisualiser) {
    this.board = board;
    this.boardVisualiser = boardVisualiser;
  }

  mouseOverBoard(evt) {
    var can = this.boardVisualiser.canvas;
    var rect = can.getBoundingClientRect();
    var xfact = can.width/parseInt(can.style.width.split("p")[0]);
    var yfact = can.height/parseInt(can.style.height.split("p")[0]);
    var x = (evt.clientX - rect.left)*xfact;
    var y = (evt.clientY - rect.top)*yfact;
    var hex = this.boardVisualiser.getPoint({x: x, y: y});
    if (this.board.field[hex.r] == null) {
      return;
    }
    for (var r = 0; r < this.board.size*2+1; r++) {
      for (var q = 0; q < 2*this.board.size+1 - Math.abs(this.board.size-r); q++) {
        if ((this.board.field[r][q] == 0.5) | (this.board.field[r][q] == 0.25)) {
          if ((hex.r != r) | (hex.q != q)) {
            this.board.field[r][q] = 0;
          }
        }
      }
    }
    if ((this.board.field[hex.r][hex.q] == 0) | (this.board.field[hex.r][hex.q] == 0.25)) {
      this.board.field[hex.r][hex.q] = 0.5;
    }
    var neighs = this.board.getNeighbors(hex);
    for (var i = 0; i < neighs.length; i++) {
      var neig = neighs[i];
      if (this.board.field[neig.r][neig.q] == 0) {
        this.board.field[neig.r][neig.q] = 0.25;
      }
    }
    this.boardVisualiser.draw();
  }

  mouseClickBoard(evt) {
    var can = this.boardVisualiser.canvas;
    var rect = can.getBoundingClientRect();
    var xfact = can.width/parseInt(can.style.width.split("p")[0]);
    var yfact = can.height/parseInt(can.style.height.split("p")[0]);
    var x = (evt.clientX - rect.left)*xfact;
    var y = (evt.clientY - rect.top)*yfact;
    var hex = this.boardVisualiser.getPoint({x: x, y: y});
    if (this.board.field[hex.r][hex.q] == 1) {
      this.board.field[hex.r][hex.q] = 0.5;
    }
    else {
      this.board.field[hex.r][hex.q] = 1;
    }
    this.boardVisualiser.draw();
  }

  clearBoard(evt) {
    this.board.initField();
    this.boardVisualiser.draw();
  }

  resize(evt) {
    var value = evt.srcElement.value;
    this.board.size = value;
    this.board.initField();
    this.boardVisualiser.initFieldCenters();
    this.boardVisualiser.draw();
  }

  start(evt) {
    if (!this.board.onePiece()) {
      return;
    }

  }
}

function test() {
  var b = new Board(6, null);
  var bv = new BoardVisualiser(document.getElementById("testCan"), b);
  bv.draw();
  var hi = new HumanInteractor(b, bv);

  //Bind events:
  document.getElementById("testCan").addEventListener('mousemove', function (evt) {
    hi.mouseOverBoard(evt);
  }, false);
  document.getElementById("testCan").addEventListener('click', function (evt) {
    hi.mouseClickBoard(evt);
  }, false);
  document.getElementById("startButton").addEventListener('click', function (evt) {
    hi.start(evt);
  }, false);
  document.getElementById("clearButton").addEventListener('click', function (evt) {
    hi.clearBoard(evt);
  }, false);
  document.getElementById("sizeSlider").addEventListener('input', function (evt) {
    hi.resize(evt);
  }, false);
}
