class TileDrawer {

  constructor(canvas, tile) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.tile = tile;

    this.cityColor = "#DC7633";
    this.roadColor = "#F7DC6F";
    this.grassColor = "#28B463";
    this.monasteryColor0 = "#EDBB99";
    this.monasteryColor1 = "#E74C3C";
    this.shieldColor0 = "#F2F3F4";
    this.shieldColor1 = "#2980B9";
    this.villageColor = "#E74C3C";
    this.gardenColor0 = "#EDBB99";
    this.gardenColor1 = "#A569BD";
    this.riverColor = "#3498DB";
  }

  drawTile(x, y, size) {
    this.ctx.fillStyle = this.grassColor;
    this.ctx.fillRect(Math.round(x-size/2), Math.round(y-size/2), size, size);
    this.drawCities(x, y, size);
    this.drawRoads(x, y, size);
    if (this.tile.monastery) {
      this.drawMonastery(x, y, size);
    }
    if (this.tile.garden) {
      this.drawGarden(x, y, size);
    }
    this.drawShields(x, y, size);
    this.drawRiver(x, y, size);
  }

  drawShields(x, y, size) {
    if (this.tile.sideN.cityShield) {
      this.drawShield(0+this.tile.rotation, x, y, size);
    }
    if (this.tile.sideE.cityShield) {
      this.drawShield(1+this.tile.rotation, x, y, size);
    }
    if (this.tile.sideS.cityShield) {
      this.drawShield(2+this.tile.rotation, x, y, size);
    }
    if (this.tile.sideW.cityShield) {
      this.drawShield(3+this.tile.rotation, x, y, size);
    }
  }

  drawShield(theta, x, y, size) {
    var points = [[x-size/5, y-size/2.1], [x-size/5+size/8, y-size/2.1], [x-size/5+size/8, y-size/2.1+size/8], [x-size/5, y-size/2.1+size/8]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.shieldColor0);
    points = [[x-size/5, y-size/2.1], [x-size/5+size/16, y-size/2.1], [x-size/5+size/16, y-size/2.1+size/16], [x-size/5, y-size/2.1+size/16]];
    transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.shieldColor1);
    points = [[x-size/5+size/16, y-size/2.1+size/16], [x-size/5+size/8, y-size/2.1+size/16], [x-size/5+size/8, y-size/2.1+size/8], [x-size/5+size/16, y-size/2.1+size/8]];
    transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.shieldColor1);
  }

  drawRiver(x, y, size) {
    if (this.tile.sideN.river > 0) {
      this.drawRiverPart(0+this.tile.rotation, x, y, size);
      if (this.tile.sideN.river == this.tile.sideE.river) {
        this.drawCornerPart(0+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideN.river == this.tile.sideS.river) {
        this.drawMiddleRiverPart(0+this.tile.rotation, x, y, size);
      }
    }
    if (this.tile.sideE.river > 0) {
      this.drawRiverPart(1+this.tile.rotation, x, y, size);
      if (this.tile.sideE.river == this.tile.sideS.river) {
        this.drawCornerPart(1+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideE.river == this.tile.sideW.river) {
        this.drawMiddleRiverPart(1+this.tile.rotation, x, y, size);
      }
    }
    if (this.tile.sideS.river > 0) {
      this.drawRiverPart(2+this.tile.rotation, x, y, size);
      if (this.tile.sideS.river == this.tile.sideW.river) {
        this.drawCornerPart(2+this.tile.rotation, x, y, size);
      }
    }
    if (this.tile.sideW.river > 0) {
      this.drawRiverPart(3+this.tile.rotation, x, y, size);
      if (this.tile.sideW.river == this.tile.sideN.river) {
        this.drawCornerPart(3+this.tile.rotation, x, y, size);
      }
    }
  }

  drawRoads(x, y, size) {
    if (this.tile.sideN.road > 0) {
      this.drawRoadPart(0+this.tile.rotation, x, y, size);
      if (this.tile.sideN.road == this.tile.sideE.road) {
        this.drawCornerPart(0+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideN.road == this.tile.sideS.road) {
        this.drawMiddleRoadPart(0+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideN.road != this.tile.sideE.road) {
        if (this.tile.sideN.road != this.tile.sideS.road) {
          if (this.tile.sideN.road != this.tile.sideW.road) {
            this.drawFinalRoadPart(0+this.tile.rotation, x, y, size);
            this.drawVillage(x, y, size);
          }
        }
      }
    }
    if (this.tile.sideE.road > 0) {
      this.drawRoadPart(1+this.tile.rotation, x, y, size);
      if (this.tile.sideE.road == this.tile.sideS.road) {
        this.drawCornerPart(1+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideE.road == this.tile.sideW.road) {
        this.drawMiddleRoadPart(1+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideE.road != this.tile.sideN.road) {
        if (this.tile.sideE.road != this.tile.sideS.road) {
          if (this.tile.sideE.road != this.tile.sideW.road) {
            this.drawFinalRoadPart(1+this.tile.rotation, x, y, size);
            this.drawVillage(x, y, size);
          }
        }
      }
    }
    if (this.tile.sideS.road > 0) {
      if (this.tile.sideS.road == this.tile.sideW.road) {
        this.drawCornerPart(2+this.tile.rotation, x, y, size);
      }
      this.drawRoadPart(2+this.tile.rotation, x, y, size);
      if (this.tile.sideS.road != this.tile.sideE.road) {
        if (this.tile.sideS.road != this.tile.sideN.road) {
          if (this.tile.sideS.road != this.tile.sideW.road) {
            this.drawFinalRoadPart(2+this.tile.rotation, x, y, size);
            this.drawVillage(x, y, size);
          }
        }
      }
    }
    if (this.tile.sideW.road > 0) {
      if (this.tile.sideW.road == this.tile.sideN.road) {
        this.drawCornerPart(3+this.tile.rotation, x, y, size);
      }
      this.drawRoadPart(3+this.tile.rotation, x, y, size);
      if (this.tile.sideW.road != this.tile.sideE.road) {
        if (this.tile.sideW.road != this.tile.sideS.road) {
          if (this.tile.sideW.road != this.tile.sideN.road) {
            this.drawFinalRoadPart(3+this.tile.rotation, x, y, size);
            this.drawVillage(x, y, size);
          }
        }
      }
    }
  }

  drawCornerPart(theta, x, y, size) {
    var points = [[x-size/15, y-size/3], [x+size/15, y-size/3], [x+size/3, y-size/15], [x+size/3, y+size/15]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.roadColor);
  }

  drawRiverCornerPart(theta, x, y, size) {
    var points = [[x-size/12, y-size/3], [x+size/12, y-size/3], [x+size/3, y-size/12], [x+size/3, y+size/12]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.riverColor);
  }

  drawPolygon(points, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
    for (var i = 1; i < points.length; i++) {
      this.ctx.lineTo(Math.round(points[i][0]), Math.round(points[i][1]));
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawRoadPart(theta, x, y, size) {
    var points = [[x-size/15, y-size/2], [x-size/15, y-size/3], [x+size/15, y-size/3], [x+size/15, y-size/2]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.roadColor);
  }

  drawRiverPart(theta, x, y, size) {
    var points = [[x-size/12, y-size/2], [x-size/12, y-size/3], [x+size/12, y-size/3], [x+size/12, y-size/2]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.riverColor);
  }

  drawCities(x, y, size) {
    if (this.tile.sideN.city > 0) {
      if (this.tile.sideN.city == this.tile.sideE.city) {
        this.drawCityCornerPart(0+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideN.city == this.tile.sideS.city) {
        this.drawCityMidPart(0+this.tile.rotation, x, y, size);
      }
      this.drawCityPart(0+this.tile.rotation, x, y, size);
    }
    if (this.tile.sideE.city > 0) {
      if (this.tile.sideE.city == this.tile.sideS.city) {
        this.drawCityCornerPart(1+this.tile.rotation, x, y, size);
      }
      if (this.tile.sideE.city == this.tile.sideW.city) {
        this.drawCityMidPart(1+this.tile.rotation, x, y, size);
      }
      this.drawCityPart(1+this.tile.rotation, x, y, size);
    }
    if (this.tile.sideS.city > 0) {
      if (this.tile.sideS.city == this.tile.sideW.city) {
        this.drawCityCornerPart(2+this.tile.rotation, x, y, size);
      }
      this.drawCityPart(2+this.tile.rotation, x, y, size);
    }
    if (this.tile.sideW.city > 0) {
      if (this.tile.sideW.city == this.tile.sideN.city) {
        this.drawCityCornerPart(3+this.tile.rotation, x, y, size);
      }
      this.drawCityPart(3+this.tile.rotation, x, y, size);
    }
  }

  drawCityPart(theta, x, y, size) {
    var points = [[x-size/2, y-size/2], [x-size/2+Math.cos(Math.PI/6)*size/3, y-size/2+Math.sin(Math.PI/6)*size/3], [x+size/2-Math.cos(Math.PI/6)*size/3, y-size/2+Math.sin(Math.PI/6)*size/3], [x+size/2, y-size/2]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.cityColor);
  }

  drawCityCornerPart(theta, x, y, size) {
    var points = [[x-size/2, y-size/2], [x+size/2, y+size/2], [x+size/2, y-size/2]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.cityColor);
  }

  drawCityMidPart(theta, x, y, size) {
    var points = [[x-size/2+Math.cos(Math.PI/6)*size/3, y-size/2+Math.sin(Math.PI/6)*size/3], [x+size/2-Math.cos(Math.PI/6)*size/3, y-size/2+Math.sin(Math.PI/6)*size/3], [x+size/2-Math.cos(Math.PI/6)*size/3, y+size/2-Math.sin(Math.PI/6)*size/3], [x-size/2+Math.cos(Math.PI/6)*size/3, y+size/2-Math.sin(Math.PI/6)*size/3]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.cityColor);
  }

  transformPoints(points, theta, center) {
    var transformedPoints = [];
    var thetaRad = -theta*Math.PI/2;
    for (var i = 0; i < points.length; i++) {
      transformedPoints.push([Math.cos(thetaRad)*(points[i][0]-center.x)+Math.sin(thetaRad)*(points[i][1]-center.y)+center.x, -Math.sin(thetaRad)*(points[i][0]-center.x)+Math.cos(thetaRad)*(points[i][1]-center.y)+center.y]);
    }
    return transformedPoints;
  }

  drawMonastery(x, y, size) {
    var points = [[x-size/6, y-size/6], [x+size/6, y-size/6], [x+size/6, y+size/6], [x-size/6, y+size/6]];
    this.drawPolygon(points, this.monasteryColor0);
    points = [[x-size/10, y-size/10], [x+size/10, y-size/10], [x+size/10, y+size/10], [x-size/10, y+size/10]];
    this.drawPolygon(points, this.monasteryColor1);
  }

  drawGarden(x, y, size) {
    var points = [[x-size/6, y-size/6], [x+size/6, y-size/6], [x+size/6, y+size/6], [x-size/6, y+size/6]];
    this.drawPolygon(points, this.gardenColor0);
    points = [[x-size/10, y-size/10], [x+size/10, y-size/10], [x+size/10, y+size/10], [x-size/10, y+size/10]];
    this.drawPolygon(points, this.gardenColor1);
  }

  drawVillage(x, y, size) {
    var points = [[x-size/10, y-size/10], [x+size/10, y-size/10], [x+size/10, y+size/10], [x-size/10, y+size/10]];
    this.drawPolygon(points, this.villageColor);
  }

  drawFinalRoadPart(theta, x, y, size) {
    var points = [[x-size/15, y-size/3], [x-size/15, y], [x+size/15, y], [x+size/15, y-size/3]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.roadColor);
  }

  drawMiddleRoadPart(theta, x, y, size) {
    var points = [[x-size/15, y-size/3], [x-size/15, y+size/3], [x+size/15, y+size/3], [x+size/15, y-size/3]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.roadColor);
  }

  drawMiddleRiverPart(theta, x, y, size) {
    var points = [[x-size/12, y-size/3], [x-size/12, y+size/3], [x+size/12, y+size/3], [x+size/12, y-size/3]];
    var transformedPoints = this.transformPoints(points, theta, {x: x, y: y});
    this.drawPolygon(transformedPoints, this.riverColor);
  }
}

class Board {

  constructor(canvas, size, carcassonneCanvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.tiles = [];
    this.carcassonneCanvas = carcassonneCanvas;

    this.relativeTileBorderSize = 0.05;

    this.size = size;
    this.midPos = {x: this.canvas.width/2, y: this.canvas.height/2};
    this.tempMidPos = this.midPos;

    this.intraTileLineColor = "#947560";
    this.tileToPlaceHighlightColor = "lightGreen";

    this.canvas.board = this;
    this.canvas.onmousemove = this.mouseMove;
    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmouseup = this.mouseUp;
    this.canvas.onclick = this.mouseClick;

    this.moved = false;

    var container = document.getElementById("gameCanvasContainer");
    var colors = [["red", "darkred"], ["blue", "darkblue"]];
    this.meepleDrawer = new MeepleDrawer(container, canvas, colors, this.size, this.midPos, this.relativeTileBorderSize, this.carcassonneCanvas.gameUser, this);
    this.selectMeeple = false;
    this.abbot = false;
  }

  // This does not check if this is a valid tile.
  addTile(tile, position) {
    this.tiles.push({tile: tile, position: position});
  }

  // x, y provide position of tile with location (0, 0).
  drawBoard(x, y, size) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var tileBorderSize = this.relativeTileBorderSize*size;
    var tileSize = size + tileBorderSize;
    var borders = this.getMinMaxPos();
    for (var xi = borders.minX; xi <= borders.maxX; xi++) {
      var X = x + tileSize*xi;
      for (var yi = borders.minY; yi <= borders.maxY; yi++) {
        var Y = y - tileSize*yi;
        var tile = this.getTile(xi, yi);
        if (tile != null) {
          var drawMeeples = false;
          if (this.selectMeeple && (this.lastChosenPos != null)) {
            if ((xi == this.lastChosenPos.x) && (yi == this.lastChosenPos.y)) {
              this.meepleDrawer.drawSelectMeeples(this.abbot, tile, {xi, yi});
            }
          }
          var tileDrawer = new TileDrawer(this.canvas, tile);
          //Check for abbot selection.
          tileDrawer.drawTile(X, Y, size);
        }
      }
    }
    //Independent from mouse position:
    this.drawInterTileLines(borders);
    this.drawTileToPlaceHighlight();
  }

  drawBoardAuto() {
    this.drawBoard(this.tempMidPos.x, this.tempMidPos.y, this.size);
  }

  drawInterTileLines(borders) {
    this.ctx.strokeStyle = this.intraTileLineColor;
    this.ctx.lineWidth = 1;
    if (borders.minX > borders.maxX) {
      borders = {minX: 0, maxX: 0, minY: 0, maxY: 0};
    }
    for (var xi = borders.minX-0.5; xi <= borders.maxX+0.5; xi++) {
      this.ctx.beginPath();
      var start = this.getMidPoint(xi, borders.minY-1.5);
      this.ctx.moveTo(start.x, start.y);
      var stop = this.getMidPoint(xi, borders.maxY+1.5);
      this.ctx.lineTo(stop.x, stop.y);
      this.ctx.stroke();
    }
    for (var yi = borders.minY-0.5; yi <= borders.maxY+0.5; yi++) {
      this.ctx.beginPath();
      var start = this.getMidPoint(borders.minX-1.5, yi);
      this.ctx.moveTo(start.x, start.y);
      var stop = this.getMidPoint(borders.maxX+1.5, yi);
      this.ctx.lineTo(stop.x, stop.y);
      this.ctx.stroke();
    }
  }

  drawTileToPlaceHighlight() {
    if (this.tileToPlace == null) {
      return;
    }
    var tileBorderSize = this.relativeTileBorderSize*this.size;
    var tileSize = this.size + tileBorderSize;
    this.ctx.strokeStyle = this.tileToPlaceHighlightColor;
    this.ctx.lineWidth = Math.round(tileSize/5);
    for (var i = 0; i < this.tileToPlacePos.length; i++) {
      var mid = this.getMidPoint(this.tileToPlacePos[i].x, this.tileToPlacePos[i].y);
      this.ctx.beginPath();
      this.ctx.moveTo(mid.x - tileSize*0.3, mid.y - tileSize*0.3);
      this.ctx.lineTo(mid.x + tileSize*0.3, mid.y - tileSize*0.3);
      this.ctx.lineTo(mid.x + tileSize*0.3, mid.y + tileSize*0.3);
      this.ctx.lineTo(mid.x - tileSize*0.3, mid.y + tileSize*0.3);
      //this.ctx.lineTo(mid.x - tileSize*0.3, mid.y - tileSize*0.3);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  mouseMove(evt) {
    if (this.board.mouseIsDown) {
      var diffX = evt.layerX - this.board.mouseStartPos.x;
      var diffY = evt.layerY - this.board.mouseStartPos.y;
      this.board.tempMidPos = {x: this.board.midPos.x + diffX, y: this.board.midPos.y + diffY};
      this.board.drawBoardAuto();
      this.board.meepleDrawer.updateMidPoint(this.board.tempMidPos);
    }
    this.board.handleTileHilight(evt.layerX, evt.layerY);
    this.board.moved = true;
  }

  mouseDown(evt) {
    this.board.mouseIsDown = true;
    this.board.mouseStartPos = {x: evt.layerX, y: evt.layerY};
    this.board.moved = false;
  }

  mouseUp(evt) {
    this.board.mouseIsDown = false;
    var diffX = evt.layerX - this.board.mouseStartPos.x;
    var diffY = evt.layerY - this.board.mouseStartPos.y;
    this.board.midPos.x = this.board.midPos.x + diffX;
    this.board.midPos.y = this.board.midPos.y + diffY;
    this.board.tempMidPos = this.board.midPos;
  }

  getTile(x, y) {
    for (var i = 0; i < this.tiles.length; i++) {
      var pos = this.tiles[i].position;
      if (pos.x == x) {
        if (pos.y == y) {
          return this.tiles[i].tile;
        }
      }
    }
    return null;
  }

  getMinMaxPos() {
    var minX = Number.MAX_SAFE_INTEGER;
    var maxX = -Number.MAX_SAFE_INTEGER;
    var minY = Number.MAX_SAFE_INTEGER;
    var maxY = -Number.MAX_SAFE_INTEGER;
    for (var i = 0; i < this.tiles.length; i++) {
      var pos = this.tiles[i].position;
      if (pos.x < minX) {
        minX = pos.x;
      }
      if (pos.x > maxX) {
        maxX = pos.x;
      }
      if (pos.y < minY) {
        minY = pos.y;
      }
      if (pos.y > maxY) {
        maxY = pos.y;
      }
    }
    return {minX: minX, maxX: maxX, minY: minY, maxY: maxY};
  }

  getMidPoint(x, y) {
    var tileBorderSize = this.relativeTileBorderSize*this.size;
    var tileSize = this.size + tileBorderSize;
    var result = {x: this.tempMidPos.x + x*tileSize, y: this.tempMidPos.y - y*tileSize};
    return result;
  }

  getTilePos(x, y) {
    var tileBorderSize = this.relativeTileBorderSize*this.size;
    var tileSize = this.size + tileBorderSize;
    var xn = Math.round((x - this.tempMidPos.x)/tileSize);
    var yn = Math.round((-y + this.tempMidPos.y)/tileSize);
    return {x: xn, y: yn};
  }

  handleTileHilight(x, y) {
    this.drawBoardAuto();
    var pos = this.getTilePos(x, y);
    var tile = this.getTile(pos.x, pos.y);
    if (tile == null) {
      //Empty position.
      if (this.tileToPlace != null) {
        var canPlace = false;
        for (var i = 0; i < this.tileToPlacePos.length; i++) {
          if ((this.tileToPlacePos[i].x == pos.x) && (this.tileToPlacePos[i].y == pos.y)) {
            canPlace = true;
            break;
          }
        }
        if (canPlace) {
          var tileDrawer = new TileDrawer(this.canvas, this.tileToPlace);
          var midPos = this.getMidPoint(pos.x, pos.y);
          tileDrawer.drawTile(midPos.x, midPos.y, this.size, false, false);
        }
      }
    }
    else {
      //Handle project highlight here.
    }
  }

  // getMeepleHighlight(drawer, relPos) {
  //   var highlight = false;
  //   var poss = drawer.getMeeplePos(this.size, this.abbot);
  //   var meepleSize = this.size/8;
  //   console.log(meepleSize, poss);
  //   var colors = [];
  //   for (var i = 0; i < poss.length; i++) {
  //     var dist = Math.sqrt((relPos.x - poss[i].x)**2 + (relPos.y - poss[i].y)**2);
  //     console.log(dist);
  //     if (dist < meepleSize) {
  //       //Should reflect player number!
  //       colors.push(1);
  //       highlight = true;
  //     }
  //     else {
  //       colors.push(null);
  //     }
  //   }
  //   return {highlight: highlight, colors: colors};
  // }

  //Tell board which tile it should show for placement and at which positions the tile can fit.
  setTileToPlace(tile, possiblePos) {
    this.tileToPlace = tile;
    this.tileToPlacePos = possiblePos;
    if (tile !=  null) {
      this.drawBoardAuto();
    }
  }

  resetTileToPlace(chosenPos) {
    this.tileToPlace = null;
    this.tileToPlacePos = null;
    this.lastChosenPos = chosenPos;
  }

  mouseClick(evt) {
    if (!this.board.moved) {
      var x = evt.layerX;
      var y = evt.layerY;
      var pos = this.board.getTilePos(x, y);
      this.board.clickedPos(pos.x, pos.y);
    }
  }

  clickedPos(x, y) {
    //Check if this player is placing a new tile:
    if (this.getTile(x, y) == null) {
      if (this.tileToPlace != null) {
        var canPlace = false;
        for (var i = 0; i < this.tileToPlacePos.length; i++) {
          if ((this.tileToPlacePos[i].x == x) && (this.tileToPlacePos[i].y == y)) {
            canPlace = true;
            break;
          }
        }
        if (canPlace) {
          this.placeTile(x, y);
        }
      }
    }
  }

  placeTile(x, y) {
    this.carcassonneCanvas.gameUser.setPos({posX: x, posY: y}, this.tileToPlace.rotation);
    this.resetTileToPlace({x: x, y: y});
  }

  updateMeepleZoom() {
    this.meepleDrawer.updateSize(this.size);
  }

  updateSelectMeepleAbbot(newAbbot) {
    this.abbot = newAbbot;
    if (this.selectMeeple) {
      var tile = this.getTile(this.lastChosenPos.x, this.lastChosenPos.y);
      this.meepleDrawer.drawSelectMeeples(this.abbot, tile, {xi: this.lastChosenPos.x, yi: this.lastChosenPos.y});
    }
  }

  resetSelectMeeple() {
    this.meepleDrawer.removeSelectMeeples({xi: this.lastChosenPos.x, yi: this.lastChosenPos.y});
    this.selectMeeple = false;
    this.abbot = false;
  }

  newMeeple(meeple, playerNumber) {
    this.meepleDrawer.drawFixedMeeple(playerNumber, meeple);
  }
}

class MeepleDrawer {

  constructor(container, mainCanvas, colors, size, midPoint, relativeTileBorderSize, user, board) {
    this.container = container;
    this.container.innerHTML = "";
    this.offset = {x: mainCanvas.offsetLeft, y: mainCanvas.offsetTop};
    this.colors = colors;
    //this.meeples = [];
    this.size = size;
    this.midPoint = midPoint;
    this.relativeTileBorderSize = relativeTileBorderSize;
    this.user = user;
    this.board = board;
  }

  updateSize(newSize) {
    this.size = newSize;
    //Iterate meeples.
    for (var i = 0; i < this.container.childNodes.length; i++) {
      var meeple = this.container.childNodes[i];
      var path = meeple.childNodes[0];
      this.setMeepleScale(meeple, path);
      var midPos = this.getTileMidPoint(meeple.meeple.position);
      if (meeple.noMeeple != null) {
        meeple.style.left = (this.offset.x + midPos.x - 52) + "px";
        meeple.style.top = (this.offset.y + midPos.y - 17) + "px";
      }
      else {
        var meeplePos = this.getMeeplePos(meeple.tile, meeple.meeple);
        meeple.style.left = (this.offset.x + midPos.x + meeplePos.x - 25*this.size/200) + "px";
        meeple.style.top = (this.offset.y + midPos.y + meeplePos.y - 25*this.size/200) + "px";
      }
    }
  }

  updateMidPoint(newMidPoint) {
    this.midPoint = newMidPoint;
    //Iterate meeples.
    for (var i = 0; i < this.container.childNodes.length; i++) {
      var meeple = this.container.childNodes[i];
      //var path = meeple.childNodes[0];
      var midPos = this.getTileMidPoint(meeple.meeple.position);
      if (meeple.noMeeple != null) {
        meeple.style.left = (this.offset.x + midPos.x - 52) + "px";
        meeple.style.top = (this.offset.y + midPos.y - 17) + "px";
      }
      else {
        var meeplePos = this.getMeeplePos(meeple.tile, meeple.meeple);
        meeple.style.left = (this.offset.x + midPos.x + meeplePos.x - 25*this.size/200) + "px";
        meeple.style.top = (this.offset.y + midPos.y + meeplePos.y - 25*this.size/200) + "px";
      }
    }
  }

  drawSelectMeeples(abbot, tile, tilePos) {
    //Remove meeples that where already there.
    var len = this.container.childNodes.length;
    var meepleNodes = [];
    for (var i = 0; i < len; i++) {
      meepleNodes.push(this.container.childNodes[i]);
    }
    for (var i = 0; i < len; i++) {
      var meeple = meepleNodes[i];
      if ((meeple.meeple.position.xi == tilePos.xi) && (meeple.meeple.position.yi == tilePos.yi)) {
        this.container.removeChild(meeple);
      }
    }
    //Make abbot selectable:
    for (var i = 0; i < this.container.childNodes.length; i++) {
      var svg = this.container.childNodes[i];
      var meeple = svg.meeple;
      var playerNumber = svg.playerNumber;
      if ((playerNumber == this.user.playerNumbers[this.user.myIndex]) && (meeple.isAbbot == true)) {
        var path = svg.childNodes[0];
        path.style.cursor = "pointer";
        path.onmouseenter = this.mouseEnterAbbot;
        path.onmouseleave = this.mouseLeaveAbbot;
        path.onclick = this.mouseClickAbbot;
        break;
      }
    }
    if (abbot == null) {
      var tileMidPos = this.getTileMidPoint(tilePos);
      var but = this.createNoMeepleButton(tileMidPos, tilePos);
      but.tile = tile;
      this.container.appendChild(but);
      but.drawer = this;
      but.onmouseenter = this.mouseEnterNoMeeple;
      but.onmouseleave = this.mouseLeaveNoMeeple;
      but.onclick = this.mouseClickNoMeeple;
      return;
    }
    var meeples = this.getAllMeeples(abbot, tile, tilePos);
    for (var i = 0; i < meeples.length; i++) {
      var meeple = meeples[i];
      var tileMidPos = this.getTileMidPoint(tilePos);
      var relPos = this.getMeeplePos(tile, meeple);
      var svg = this.createMeeple(meeple, {x: tileMidPos.x + relPos.x, y: tileMidPos.y + relPos.y}, null);
      svg.tile = tile;
      this.container.appendChild(svg);
      svg.childNodes[0].drawer = this;
      svg.childNodes[0].onmouseenter = this.mouseEnterSelMeeple;
      svg.childNodes[0].onmouseleave = this.mouseLeaveSelMeeple;
      svg.childNodes[0].onclick = this.mouseClickSelMeeple;
    }
  }

  drawFixedMeeple(playerNumber, meeple) {
    //Draw chosen meeple.
    if (meeple.takeAwayAbbot) {
      for (var i = 0; i < this.container.childNodes.length; i++) {
        var svg = this.container.childNodes[i];
        if ((svg.meeple.isAbbot == true) && (svg.playerNumber == playerNumber)) {
          this.container.removeChild(svg);
          return;
        }
      }
    }
    var tileMidPos = this.getTileMidPoint(meeple.position);
    var tile = this.board.getTile(meeple.position.xi, meeple.position.yi);
    var relPos = this.getMeeplePos(tile, meeple);
    var meeple = this.createMeeple(meeple, {x: tileMidPos.x + relPos.x, y: tileMidPos.y + relPos.y}, playerNumber);
    meeple.childNodes[0].drawer = this;
    meeple.tile = tile;
    this.container.appendChild(meeple);
  }

  removeSelectMeeples(tilePos) {
    var len = this.container.childNodes.length;
    var meepleNodes = [];
    for (var i = 0; i < len; i++) {
      meepleNodes.push(this.container.childNodes[i]);
    }
    for (var i = 0; i < len; i++) {
      var meeple = meepleNodes[i];
      if ((meeple.meeple.position.xi == tilePos.xi) && (meeple.meeple.position.yi == tilePos.yi)) {
        this.container.removeChild(meeple);
      }
    }
    //Make abbot unselectable:
    for (var i = 0; i < this.container.childNodes.length; i++) {
      var svg = this.container.childNodes[i];
      var meeple = svg.meeple;
      var playerNumber = svg.playerNumber;
      if ((playerNumber == this.user.playerNumbers[this.user.myIndex]) && (meeple.isAbbot == true)) {
        var path = svg.childNodes[0];
        path.style.cursor = null;
        path.onmouseenter = null;
        path.onmouseleave = null;
        path.onclick = null;
        break;
      }
    }
  }

  removeFixedMeeple(tilePos, playerNumber) {
    var len = this.container.childNodes.length;
    var meepleNodes = [];
    for (var i = 0; i < len; i++) {
      meepleNodes.push(this.container.childNodes[i]);
    }
    for (var i = 0; i < len; i++) {
      var meeple = meepleNodes[i];
      if ((meeple.meeple.position.xi == tilePos.x) && (meeple.meeple.position.yi == tilePos.y)) {
        if (meeple.playerNumber == playerNumber) {
          this.container.removeChild(meeple);
          break;
        }
      }
    }
  }

  getTileMidPoint(tilePos) {
    var tileBorderSize = this.relativeTileBorderSize*this.size;
    var tileSize = this.size + tileBorderSize;
    var result = {x: this.midPoint.x + tilePos.xi*tileSize, y: this.midPoint.y - tilePos.yi*tileSize};
    return result;
  }

  createNoMeepleButton(pos, tilePos) {
    var butDiv = document.createElement("div");
    butDiv.classList.add("noMeepleButton");
    butDiv.innerHTML = "Geen meeple";
    butDiv.meeple = {city: 0, garden: false, grass: 0, isAbbot: false, monastery: false, placeMeeple: false, position: tilePos, road: 0, takeAwayAbbot: false};
    butDiv.style.left = (this.offset.x + pos.x - 52) + "px";
    butDiv.style.top = (this.offset.y + pos.y - 17) + "px";
    butDiv.noMeeple = true;
    return butDiv;
  }

  createMeeple(meeple, meeplePos, playerNumber) {
    var meepleSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    meepleSVG.meeple = meeple;
    meepleSVG.classList.add("canMeepleSVG");
    meepleSVG.style.left = (this.offset.x + meeplePos.x - 25*this.size/200) + "px";
    meepleSVG.style.top = (this.offset.y + meeplePos.y - 25*this.size/200) + "px";
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("canMeeplePath");
    this.setMeepleScale(meepleSVG, path);
    if (meeple.isAbbot) {
      path.setAttribute("d", "m 35.348069,48.830709 6.027217,-0.15254 c 0.921873,0 1.084719,-0.549127 1.449589,-1.296996 0.210368,-0.511061 0.126698,-1.207636 -0.07259,-1.935264 -0.316121,-1.179886 -0.828928,-2.171276 -1.453312,-3.252744 -0.732702,-1.269114 -1.185456,-2.400608 -2.316723,-3.531871 -1.362828,-1.362847 -2.001509,-2.122039 -3.176421,-3.029437 -0.148543,-0.279744 -0.172688,-0.55949 0.15259,-0.839234 1.761076,-0.928501 4.382336,-1.20644 5.41687,-1.983643 0.393836,-0.3887 0.870302,-0.738309 1.068114,-1.449585 0.107385,-0.574547 0.165176,-1.224781 -0.228885,-1.907349 -0.461542,-0.79942 -1.992261,-1.371942 -3.051755,-1.983642 0,0 -2.538147,-1.319768 -4.196168,-1.525879 -1.464205,-0.249137 -2.064388,-0.25587 -4.057396,-0.285957 0.514753,-0.891579 0.458462,-1.083693 0.816904,-1.704533 0.582983,-1.009756 0.456261,-2.314573 -0.01862,-3.503916 -0.392151,-0.97434 -0.602858,-1.089253 -1.166738,-1.648701 -0.420661,-0.419602 -0.648286,-0.983902 -0.241906,-1.687773 1.793963,-2.1766 3.642126,-6.390474 3.675929,-7.9537886 0,-0.9126476 -7.673613,-8.06483 -8.97477,-8.06483 -1.301157,0 -8.97477,7.1521824 -8.97477,8.06483 0.03381,1.5633146 1.881966,5.7771866 3.675928,7.9537876 0.406382,0.703871 0.178752,1.268171 -0.241904,1.687773 -0.563883,0.559447 -0.77459,0.674361 -1.166741,1.648701 -0.474871,1.189343 -0.601594,2.494159 -0.0186,3.503915 0.358447,0.620841 0.30215,0.812954 0.816905,1.704534 -1.993027,0.03009 -2.59321,0.03681 -4.057418,0.285955 -1.658016,0.206113 -4.196162,1.52588 -4.196162,1.52588 -1.0594938,0.6117 -2.5902113,1.184222 -3.0517563,1.983643 -0.394081,0.682567 -0.3362928,1.332802 -0.2288852,1.907349 0.1978195,0.711275 0.6742795,1.060883 1.0681155,1.449584 1.0345337,0.777203 3.655795,1.055142 5.41687,1.983643 0.325278,0.279742 0.301133,0.559489 0.15259,0.839234 -1.174911,0.9074 -1.813589,1.666592 -3.176429,3.029427 -1.1312662,1.131264 -1.5840222,2.262757 -2.3167358,3.531853 -0.6243851,1.081467 -1.1371598,2.072857 -1.4533033,3.252725 -0.1993032,0.727628 -0.2829268,1.424199 -0.072574,1.935264 0.3648694,0.747873 0.5277175,1.296995 1.4495851,1.296995 l 6.027218,0.152541 10.396438,0.07631 z");
    }
    else {
      path.setAttribute("d", "m 26.7534,40.725049 c 0.46526,1.04936 0.88969,1.73251 1.36535,3.05796 0.427,1.17563 0.8228,2.21155 1.59326,3.49122 0.41451,0.436 0.86197,0.85223 1.57297,1.11034 3.1812,0.42498 6.25016,0.0643 9.37469,0.0925 1.52478,0.0736 3.24662,0.0481 4.87459,-0.0925 0.48419,-0.15048 0.94569,-0.6815 0.96813,-1.50301 0.12935,-0.62315 0.0905,-1.24558 -0.13538,-2.10558 -0.33624,-1.10834 -0.85461,-2.62292 -1.29084,-3.73715 -0.70464,-1.75802 -1.34565,-3.1099 -2.41027,-4.86793 -1.56044,-2.45758 -2.80133,-4.97906 -4.07123,-7.49474 -0.32718,-0.71552 -0.55393,-1.44537 -0.46263,-2.22067 0.0183,-0.40779 0.12714,-0.78844 0.74022,-1.01781 0.9768,-0.31859 2.21508,-0.37569 3.42353,-0.46264 1.58563,0.001 3.0669,-0.51857 4.53385,-1.11033 0.77863,-0.40503 1.5431,-0.83129 1.85056,-1.94308 0.25315,-0.77863 1.2e-4,-1.50102 -0.27758,-2.22067 -0.58786,-0.91127 -1.30559,-1.76687 -2.3132,-2.49825 -1.37172,-1.0542 -3.22647,-1.99061 -4.69392,-2.62227 -1.22171,-0.5033 -2.44547,-1.00456 -3.7261,-1.44895 -1.5856,-0.65611 -3.18362,-1.2223 -4.81145,-1.57297 -0.39729,-0.811857 -0.1516,-2.8033702 -1.33824,-5.8901232 -0.49309,-0.992975 -0.8397,-1.963458 -1.99275,-2.900014 -1.497,-1.156905 -2.5781,-1.36308 -4.52696,-1.36308 -1.94886,0 -3.02995,0.206175 -4.52695,1.36308 -1.15306,0.936556 -1.49967,1.907039 -1.99276,2.900014 -1.18664,3.086753 -0.94094,5.0782662 -1.33824,5.8901232 -1.62783,0.35067 -3.22585,0.91686 -4.81145,1.57297 -1.280633,0.44439 -2.5043931,0.94565 -3.7261041,1.44895 -1.467447,0.63166 -3.322194,1.56807 -4.69392,2.62227 -1.007607,0.73138 -1.725339,1.58698 -2.313192,2.49825 -0.277707,0.71965 -0.530733,1.44204 -0.277584,2.22067 0.307455,1.11179 1.07193,1.53805 1.850556,1.94308 1.466955,0.59176 2.94822,1.11199 4.533858,1.11033 1.208445,0.0869 2.4467281,0.14405 3.4235281,0.46264 0.613088,0.22937 0.721888,0.61002 0.740218,1.01781 0.0913,0.7753 -0.13544,1.50515 -0.462634,2.22067 -1.269891,2.51568 -2.5107901,5.03716 -4.0712221,7.49474 -1.064619,1.75803 -1.705632,3.10991 -2.410269,4.86793 -0.436233,1.11423 -0.954606,2.62881 -1.290843,3.73715 -0.225921,0.86 -0.264732,1.48243 -0.135384,2.10558 0.02244,0.82151 0.483939,1.35253 0.968136,1.50301 1.627971,0.14066 3.349803,0.16613 4.874589,0.0925 3.1245271,-0.0282 6.1934871,0.33246 9.3746871,-0.0925 0.711,-0.25811 1.15846,-0.67434 1.57297,-1.11034 0.77046,-1.27967 1.16626,-2.31559 1.59326,-3.49122 0.47566,-1.32545 0.90009,-2.0086 1.36536,-3.05796 0.16158,-0.34037 0.6671,-2.09706 1.75339,-2.0559 1.08629,-0.0412 1.59181,1.71553 1.7534,2.0559 z");
    }
    //meepleSVG.onmouseenter = this.mouseEnterMeeple;
    meepleSVG.appendChild(path);
    var playerIndex = null;
    for (var i = 0; i < this.user.playerNumbers.length; i++) {
      if (this.user.playerNumbers[i] == playerNumber) {
        playerIndex = i;
        break;
      }
    }
    if (playerIndex == null) {
      path.style.fill = "#D7DBDD";
      path.style.stroke = "#3B3B3B";
      path.style["fill-opacity"] = "0.75";
      path.style["opacity"] = "0.75";
      path.style.cursor = "pointer";
    }
    else {
      //Other players here:
      path.style.fill = this.user.primaryColors[this.user.playerColorIndexes[playerIndex]];
      path.style.stroke = this.user.tertiaryColors[this.user.playerColorIndexes[playerIndex]];
      path.style["fill-opacity"] = "1";
      path.style["opacity"] = "1";
    }
    path.svg = meepleSVG;
    meepleSVG.drawer = this;
    meepleSVG.playerNumber = playerNumber;
    return meepleSVG;
  }

  mouseEnterSelMeeple() {
    this.style.fill = this.drawer.user.primaryColors[this.drawer.user.playerColorIndexes[this.drawer.user.myIndex]];
    this.style.stroke = this.drawer.user.tertiaryColors[this.drawer.user.playerColorIndexes[this.drawer.user.myIndex]];
    this.style["fill-opacity"] = "1";
    this.style["opacity"] = "1";
  }

  mouseLeaveSelMeeple() {
    this.style.fill = "#D7DBDD";
    this.style.stroke = "#3B3B3B";
    this.style["fill-opacity"] = "0.75";
    this.style["opacity"] = "0.75";
  }

  mouseClickSelMeeple() {
    console.log("Selected meeple: ", this.svg.meeple)
    var meeple = this.svg.meeple;
    this.drawer.user.setMeeple(meeple.isAbbot, meeple.monastery, meeple.garden, meeple.road, meeple.city, meeple.grass, meeple.position);
    this.drawer.board.carcassonneCanvas.resetSelectMeeple();
  }

  mouseEnterNoMeeple() {
    this.style.backgroundColor = this.drawer.user.primaryColors[this.drawer.user.playerColorIndexes[this.drawer.user.myIndex]];
    this.style.borderColor = this.drawer.user.tertiaryColors[this.drawer.user.playerColorIndexes[this.drawer.user.myIndex]];
    this.style.opacity = "1";
  }

  mouseLeaveNoMeeple() {
    this.style.backgroundColor = "#D7DBDD";
    this.style.borderColor = "#3B3B3B";
    this.style.opacity = "0.75";
  }

  mouseClickNoMeeple() {
    console.log("Selected no meeple", this.meeple);
    var meeple = this.meeple;
    this.drawer.user.setMeeple(meeple.isAbbot, meeple.monastery, meeple.garden, meeple.road, meeple.city, meeple.grass, meeple.position);
    this.drawer.board.carcassonneCanvas.resetSelectMeeple();
  }

  mouseEnterAbbot() {
    this.style.fill = this.drawer.user.quaternaryColors[this.drawer.user.playerColorIndexes[this.drawer.user.myIndex]];
    this.style["fill-opacity"] = "0.75";
    this.style["opacity"] = "0.75";
  }

  mouseLeaveAbbot() {
    this.style.fill = this.drawer.user.primaryColors[this.drawer.user.playerColorIndexes[this.drawer.user.myIndex]];
    this.style["fill-opacity"] = "1";
    this.style["opacity"] = "1";
  }

  mouseClickAbbot() {
    console.log("Remove abbot: ", this.svg.meeple);
    var meeple = this.svg.meeple;
    this.drawer.user.setMeeple(true, false, false, meeple.road, meeple.city, meeple.grass, meeple.position);
    this.drawer.board.carcassonneCanvas.resetSelectMeeple();
  }

  setMeepleScale(svg, path) {
    if (svg.noMeeple != null) {
      return;
    }
    var factor = this.size/200;
    svg.style.width = (50*factor) + "px";
    svg.style.height = (50*factor) + "px";
    path.style["transform"] = "scale(" + factor + ")";
    path.style["-ms-transform"] = "scale(" + factor + ")";
    path.style["-webkit-transform"] = "scale(" + factor + ")";
  }

  getMeeplePos(tile, meeple) {
    if (meeple.garden) {
      return {x: 0, y: 0};
    }
    if (meeple.monastery) {
      return {x: 0, y: 0};
    }
    var sides = ["N", "E", "S", "W"];
    if (meeple.road != 0) {
      for (var i = 0; i < sides.length; i++) {
        var roadNumber = tile["side" + sides[i]].road;
        if (roadNumber == meeple.road) {
          return this.transformPoint({x: 0, y: -this.size*3/8}, i + tile.rotation);
        }
      }
      return null;
    }
    if (meeple.city != 0) {
      for (var i = 0; i < sides.length; i++) {
        var cityNumber = tile["side" + sides[i]].city;
        if (cityNumber == meeple.city) {
          return this.transformPoint({x: 0, y: -this.size*3/8}, i + tile.rotation);
        }
      }
      return null;
    }
    if (meeple.grass != 0) {
      for (var i = 0; i < sides.length; i++) {
        var grassTopNumber = tile["side" + sides[i]].grassTop;
        if (grassTopNumber == meeple.grass) {
          return this.transformPoint({x: -this.size/4, y: -this.size*3/8}, i + tile.rotation);
        }
        var grassBotNumber = tile["side" + sides[i]].grassBot;
        if (grassBotNumber == meeple.grass) {
          return this.transformPoint({x: this.size/4, y: -this.size*3/8}, i + tile.rotation);
        }
      }
      return null;
    }
    return null;
  }

  getAllMeeples(abbot, tile, tilePos) {
    var result = [];
    var grasses = [];
    var roads = [];
    var cities = [];
    if (tile.garden) {
      result.push({city: 0, garden: true, grass: 0, isAbbot: abbot, monastery: false, placeMeeple: true, position: tilePos, road: 0, takeAwayAbbot: false});
    }
    if (tile.monastery) {
      result.push({city: 0, garden: false, grass: 0, isAbbot: abbot, monastery: true, placeMeeple: true, position: tilePos, road: 0, takeAwayAbbot: false});
    }
    if (abbot) {
      return result;
    }
    var sides = ["N", "E", "S", "W"];
    for (var i = 0; i < sides.length; i++) {
      var cityNumber = tile["side" + sides[i]].city;
      var roadNumber = tile["side" + sides[i]].road;
      var grassTopNumber = tile["side" + sides[i]].grassTop;
      var grassBotNumber = tile["side" + sides[i]].grassBot;
      if (cityNumber != 0) {
        var already = false;
        for (var j = 0; j < cities.length; j++) {
          if (cities[j] == cityNumber) {
            already = true;
            break;
          }
        }
        if (!already) {
          cities.push(cityNumber);
          result.push({city: cityNumber, garden: false, grass: 0, isAbbot: false, monastery: false, placeMeeple: true, position: tilePos, road: 0, takeAwayAbbot: false})
        }
      }
      if (roadNumber != 0) {
        var already = false;
        for (var j = 0; j < roads.length; j++) {
          if (roads[j] == roadNumber) {
            already = true;
            break;
          }
        }
        if (!already) {
          roads.push(roadNumber);
          result.push({city: 0, garden: false, grass: 0, isAbbot: false, monastery: false, placeMeeple: true, position: tilePos, road: roadNumber, takeAwayAbbot: false})
        }
      }
      if (grassTopNumber != 0) {
        var already = false;
        for (var j = 0; j < grasses.length; j++) {
          if (grasses[j] == grassTopNumber) {
            already = true;
            break;
          }
        }
        if (!already) {
          grasses.push(grassTopNumber);
          result.push({city: 0, garden: false, grass: grassTopNumber, isAbbot: false, monastery: false, placeMeeple: true, position: tilePos, road: 0, takeAwayAbbot: false})
        }
      }
      if (grassBotNumber != 0) {
        var already = false;
        for (var j = 0; j < grasses.length; j++) {
          if (grasses[j] == grassBotNumber) {
            already = true;
            break;
          }
        }
        if (!already) {
          grasses.push(grassBotNumber);
          result.push({city: 0, garden: false, grass: grassBotNumber, isAbbot: false, monastery: false, placeMeeple: true, position: tilePos, road: 0, takeAwayAbbot: false})
        }
      }
    }
    return result;
  }

  //Calculate relative meeple pos.
  getAllMeeplePos(abbot, tile, tilePos) {
    //Should also check if project is occupied.
    var meeples = this.getAllMeeples(abbot, tile, tilePos);
    var result = [];
    for (var i = 0; i < meeples.length; i++) {
      result.push(this.getMeeplePos(tile, meeples[i]));
    }
    return result;
  }

  transformPoint(point, theta) {
    var thetaRad = -theta*Math.PI/2;
    var center = {x: 0, y: 0};
    return {x: Math.cos(thetaRad)*(point.x-center.x)+Math.sin(thetaRad)*(point.y-center.y)+center.x, y: -Math.sin(thetaRad)*(point.x-center.x)+Math.cos(thetaRad)*(point.y-center.y)+center.y};
  }
}
