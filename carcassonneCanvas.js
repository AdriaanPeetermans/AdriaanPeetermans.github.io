class CarcasonneCanvas {

  canvas;
  resolution;
  board;
  gameUser;

  constructor(canvas, resolution, gameUser, moveContainer) {
    this.canvas = canvas;
    this.resolution = resolution;
    this.gameUser = gameUser;
    this.moveContainer = moveContainer;
    this.init();
  }

  init() {
    var width = parseInt(this.canvas.style.width.substring(0,this.canvas.style.width.length-2));
    var height = parseInt(this.canvas.style.height.substring(0,this.canvas.style.height.length-2));
    this.canvas.width = Math.round(width / this.resolution);
    this.canvas.height = Math.round(height / this.resolution);

    this.board = new Board(this.canvas, Math.round(Math.min(width / this.resolution / 10, height / this.resolution / 10)), this);
  }

  drawTile(tile, pos) {
    this.board.addTile(tile, pos);
    this.board.drawBoardAuto();
  }

  zoomIn() {
    if (this.board.size > Math.min(this.canvas.width, this.canvas.height)) {
      return;
    }
    this.board.size = Math.round(this.board.size / 0.75);
    this.board.drawBoardAuto();
    this.board.updateMeepleZoom();
  }

  zoomOut() {
    if (this.board.size < 20) {
      return;
    }
    this.board.size = Math.round(this.board.size * 0.75);
    this.board.drawBoardAuto();
    this.board.updateMeepleZoom();
  }

  drawBoard() {
    this.board.drawBoardAuto();
  }

  setTileToPlace(tile) {
    var legalPos = this.getLegalPos(tile);
    this.board.setTileToPlace(tile, legalPos);
  }

  getLegalPos(tile) {
    //Should still check if tile contains river and restrict choices.
    //If yes, also check river corner.
    if (tile == null) {
      return null;
    }
    if (this.containsRiver(tile)) {
      return this.getLegalPosRiver(tile);
    }
    var result = [];
    var minMax = this.board.getMinMaxPos();
    for (var xi = minMax.minX-1; xi <= minMax.maxX+1; xi ++) {
      for (var yi = minMax.minY-1; yi <= minMax.maxY+1; yi ++) {
        if (this.board.getTile(xi, yi) == null) {
          var allNull = true;
          //Check above
          var neig = this.board.getTile(xi, yi+1);
          if (neig != null) {
            allNull = false;
            var neigSide = this.getSide(neig, 2);
            var thisSide = this.getSide(tile, 0);
            if (!this.fitSide(neigSide, thisSide)) {
              continue;
            }
          }
          //Check below
          neig = this.board.getTile(xi, yi-1);
          if (neig != null) {
            allNull = false;
            var neigSide = this.getSide(neig, 0);
            var thisSide = this.getSide(tile, 2);
            if (!this.fitSide(neigSide, thisSide)) {
              continue;
            }
          }
          //Check Left
          neig = this.board.getTile(xi-1, yi);
          if (neig != null) {
            allNull = false;
            var neigSide = this.getSide(neig, 1);
            var thisSide = this.getSide(tile, 3);
            if (!this.fitSide(neigSide, thisSide)) {
              continue;
            }
          }
          //Check right
          neig = this.board.getTile(xi+1, yi);
          if (neig != null) {
            allNull = false;
            var neigSide = this.getSide(neig, 3);
            var thisSide = this.getSide(tile, 1);
            if (!this.fitSide(neigSide, thisSide)) {
              continue;
            }
          }
          //Add tile
          if (!allNull) {
            result.push({x: xi, y: yi});
          }
        }
      }
    }
    return result;
  }

  getLegalPosRiver(tile) {
    var corner = this.getRiverCorner(tile);
    var result = [];
    var minMax = this.board.getMinMaxPos();
    if ((minMax.minX > minMax.maxX) && (minMax.minY > minMax.maxY)) {
      result.push({x: 0, y: 0});
      return result;
    }
    for (var xi = minMax.minX-1; xi <= minMax.maxX+1; xi ++) {
      for (var yi = minMax.minY-1; yi <= minMax.maxY+1; yi ++) {
        if (this.board.getTile(xi, yi) == null) {
          var allNull = true;
          var canFit = true;
          for (var sidei = 0; sidei < 2; sidei ++) {
            var side = corner.sides[sidei];
            var neig = this.board.getTile(xi + ((side+2)%4-2)%2, yi + ((side+3)%4-2)%2);
            if (neig != null) {
              allNull = false;
              var neigSide = this.getSide(neig, (side+2)%4);
              var thisSide = this.getSide(tile, side);
              if (!this.fitSide(neigSide, thisSide)) {
                canFit = false;
              }
              if (corner.corner) {
                var neigCorner = this.getRiverCorner(neig);
                if (neigCorner.corner) {
                  //Look at previous corner, not only neighbor tile.
                  if (corner.type != (neigCorner.type+2)%4) {
                    canFit = false;
                  }
                }
              }
            }
          }
          if (canFit && !allNull) {
            result.push({x: xi, y: yi});
          }
        }
      }
    }
    return result;
  }

  getRiverCorner(tile) {
    var rivers = [];
    for (var i = 0; i < 4; i ++) {
      if (this.getSide(tile, i).river != 0) {
        rivers.push(i);
      }
    }
    var corner;
    var type;
    if ((rivers[0] % 2) == (rivers[1] % 2)) {
      corner = false;
      type = rivers[0];
    }
    else {
      corner = true;
      if (rivers[0] == 0) {
        type = (rivers[1] - 1)/2*3;
      }
      if (rivers[0] == 2) {
        type = 2;
      }
      else {
        type = 1;
      }
    }
    return {corner: corner, type: type, sides: rivers};
  }

  containsRiver(tile) {
    for (var side = 0; side < 4; side ++) {
      var tileSide = this.getSide(tile, side);
      if ((tileSide.river != 0) && (tileSide.river != null)) {
        return true;
      }
    }
    return false;
  }

  fitSide(side0, side1) {
    if (side0.city != 0) {
      return side1.city != 0;
    }
    if (side0.road != 0) {
      return side1.road != 0;
    }
    if (side0.river != 0) {
      return side1.river != 0;
    }
    return (side1.city == 0) && (side1.road == 0) && (side1.river == 0);
  }

  getSide(tile, side) {
    var rot = (side - tile.rotation + 4) % 4;
    if (rot == 0) {
      return tile.sideN;
    }
    if (rot == 1) {
      return tile.sideE;
    }
    if (rot == 2) {
      return tile.sideS;
    }
    else {
      return tile.sideW;
    }
  }

  convertTile(tile) {
    if (tile.rotation == null) {
      var rotation;
      switch (tile.orientation) {
        case "North":
          rotation = 0;
          break;
        case "East":
          rotation = 1;
          break;
        case "South":
          rotation = 2;
          break;
        case "West":
          rotation = 3;
          break
        default:
          rotation = -1;
          break;
      }
      tile.rotation = rotation;
    }
    return tile;
  }

  convertToOrientation(rotation) {
    switch (rotation) {
      case 0:
        return "North";
      case 1:
        return "East";
      case 2:
        return "South";
      case 3:
        return "West";
      default:
        return null;
    }
  }

  selectMeeple(abbot) {
    this.board.selectMeeple = true;
    this.board.abbot = abbot;
    this.board.updateSelectMeepleAbbot(this.board.abbot);
  }

  resetSelectMeeple() {
    this.board.selectMeeple = false;
    this.board.resetSelectMeeple();
    this.moveContainer.resetSelectMeeple();
  }

  selectMeepleSwitchAbbot(newAbbot) {
    this.board.updateSelectMeepleAbbot(newAbbot);
  }

  newMeeple(meeple, playerNumber) {
    this.board.newMeeple(meeple, playerNumber);
  }

  releaseMeeple(meeple, playerNumber) {
    this.board.meepleDrawer.removeFixedMeeple({x: meeple.position.posX, y: meeple.position.posY}, playerNumber);
  }
}
