class MessageParser {

	constructor() {
		this.escapeChar = '\\';
		this.delimiterChar = ',';
		this.arrayOpenChar = '[';
		this.arrayCloseChar = ']';
		this.objectOpenChar = '{';
		this.objectCloseChar = '}';
		this.spaceChar = ' ';
		this.equalsChar = ':';
		this.stringChar = '"';
	}

	serializeMessage(object) {
		return object.toString();
	}

	parseMessage(message) {
		if (message.length < 1) {
			return null;
		}
		message = this.removeSpace(message);
		if (message.charAt(0) == this.objectOpenChar) {
			var attributes = this.getAttributes(message);
			var result = new ParsedObject();
			for (var att of attributes.keys()) {
				result.addAttribute(att, this.parseMessage(attributes.get(att)));
			}
			return result;
		}
		if (message.charAt(0) == this.arrayOpenChar) {
			var list = this.getList(message);
			var result = new ParsedArray();
			for (var li of list) {
				result.addContent(this.parseMessage(li));
			}
			return result;
		}
		if (message.charAt(0) == this.stringChar) {
			if (message.length < 2) {
				return null;
			}
			if (message.charAt(message.length-1) != this.stringChar) {
				return null;
			}
			if (message.charAt(message.length-2) == this.escapeChar) {
				var escapeCount = 0;
				for (var i = message.length-2; i >= 0; i--) {
					if (message.charAt(i) != this.escapeChar) {
						break;
					}
					escapeCount ++;
				}
				if (escapeCount%2 == 1) {
					return null;
				}
			}
			return new ParsedString(message.substring(1, message.length-1));
		}
		if (this.canBeInt(message)) {
			return new ParsedInt(parseInt(message));
		}
		if (this.canBeDouble(message)) {
			return new ParsedDouble(parseFloat(message));
		}
		if (this.canBeBoolean(message)) {
			return new ParsedBoolean(message == "true");
		}
		return null;
	}

	canBeDouble(message) {
    var result = parseFloat(message);
    if (Number.isNaN(result)) {
      return false;
    }
    return true;
	}

	canBeInt(message) {
    var resultF = parseFloat(message);
    var resultI = parseInt(message);
    if (Number.isNaN(resultF)) {
      return false;
    }
    if (resultF != resultI) {
      return false;
    }
    return true;
	}

	canBeBoolean(message) {
		if (message == "true") {
      return true;
    }
    if (message == "false") {
      return true;
    }
    return false;
	}

	getList(message) {
		if (message.length < 2) {
			return null;
		}
		if (message.charAt(0) != this.arrayOpenChar) {
			return null;
		}
		if (message.charAt(message.length-1) != this.arrayCloseChar) {
			return null;
		}
		if (message.charAt(message.length-2) == this.escapeChar) {
			var escapeCount = 0;
			for (var i = message.length-2; i >= 0; i--) {
				if (message.charAt(i) != this.escapeChar) {
					break;
				}
				escapeCount ++;
			}
			if (escapeCount%2 == 1) {
				return null;
			}
		}
		var result = [];
		message = message.substring(1, message.length-1);
		var elStart = 0;
		var check = true;
		var openArray = 0;
		var openObject = 0;
		for (var i = 0; i < message.length; i++) {
			if (i != 0) {
				if (message.charAt(i-1) == this.escapeChar) {
					continue;
				}
			}
			if (check) {
				if (message.charAt(i) == this.delimiterChar) {
					result.push(this.removeSpace(message.substring(elStart, i)));
					elStart = i+1;
					continue;
				}
				if (message.charAt(i) == this.objectOpenChar) {
					openArray = 0;
					openObject = 1;
					check = false;
					continue;
				}
				if (message.charAt(i) == this.arrayOpenChar) {
					openArray = 1;
					openObject = 0;
					check = false;
					continue;
				}
				if (i == message.length-1) {
					result.push(this.removeSpace(message.substring(elStart, i+1)));
				}
			}
			else {
				if (message.charAt(i) == this.objectOpenChar) {
					openObject ++;
					continue;
				}
				if (message.charAt(i) == this.arrayOpenChar) {
					openArray ++;
					continue;
				}
				if (message.charAt(i) == this.objectCloseChar) {
					openObject --;
					if ((openObject == 0) && (openArray == 0)) {
						if (i == message.length-1) {
							result.push(this.removeSpace(message.substring(elStart, i+1)));
						}
						check = true;
					}
					continue;
				}
				if (message.charAt(i) == this.arrayCloseChar) {
					openArray --;
					if ((openObject == 0) && (openArray == 0)) {
						if (i == message.length-1) {
							result.push(this.removeSpace(message.substring(elStart, i+1)));
						}
						check = true;
					}
					continue;
				}
			}
		}
		return result;
	}

	getAttributes(message) {
		if (message.length < 2) {
			return null;
		}
		if (message.charAt(0) != this.objectOpenChar) {
			return null;
		}
		if (message.charAt(message.length-1) != this.objectCloseChar) {
			return null;
		}
		if (message.charAt(message.length-2) == this.escapeChar) {
			var escapeCount = 0;
			for (var i = message.length-2; i >= 0; i--) {
				if (message.charAt(i) != this.escapeChar) {
					break;
				}
				escapeCount ++;
			}
			if (escapeCount%2 == 1) {
				return null;
			}
		}
		var result = new Map();
		message = message.substring(1, message.length-1);
		var attNameStart = 0;
		var attValueStart = 0;
		var check = true;
		var openArray = 0;
		var openObject = 0;
		var attName = "";
		var att = true;
		for (var i = 0; i < message.length; i++) {
			if (check) {
				if (i != 0) {
					if (message.charAt(i-1) == this.escapeChar) {
						continue;
					}
				}
				if (message.charAt(i) == this.equalsChar) {
					if (!att) {
						return null;
					}
					attName = this.removeSpace(message.substring(attNameStart, i));
					att = false;
					attValueStart = i+1;
					continue;
				}
				if (message.charAt(i) == this.delimiterChar) {
					if (att) {
						return null;
					}
					result.set(attName, this.removeSpace(message.substring(attValueStart, i)));
					att = true;
					attNameStart = i+1;
					continue;
				}
				if (message.charAt(i) == this.arrayOpenChar) {
					check = false;
					openArray = 1;
					openObject = 0;
					continue;
				}
				if (message.charAt(i) == this.objectOpenChar) {
					check = false;
					openObject = 1;
					openArray = 0;
					continue;
				}
				if (i == message.length-1) {
					if (att) {
						return null;
					}
					result.set(attName, message.substring(attValueStart, i+1));
					att = true;
					attNameStart = i+1;
					continue;
				}
			}
			else {
				if (i != 0) {
					if (message.charAt(i-1) == this.escapeChar) {
						continue;
					}
				}
				if (message.charAt(i) == this.arrayOpenChar) {
					openArray ++;
					continue;
				}
				if (message.charAt(i) == this.objectOpenChar) {
					openObject ++;
					continue;
				}
				if (message.charAt(i) == this.arrayCloseChar) {
					openArray --;
					if ((openArray <= 0) && (openObject <= 0)) {
						check = true;
					}
					if (i == message.length-1) {
						result.set(attName, this.removeSpace(message.substring(attValueStart, i+1)));
					}
					continue;
				}
				if (message.charAt(i) == this.objectCloseChar) {
					openObject --;
					if ((openArray <= 0) && (openObject <= 0)) {
						check = true;
					}
					if (i == message.length-1) {
						result.set(attName, this.removeSpace(message.substring(attValueStart, i+1)));
					}
					continue;
				}
			}
		}
		return result;
	}

	removeSpace(message) {
		var i = 0;
		while (i < message.length) {
			if (message.charAt(i) != this.spaceChar) {
				break;
			}
			i ++;
		}
		var j = message.length-1;
		while (j >= 0) {
			if (message.charAt(j) != this.spaceChar) {
				if (message.charAt(j) == this.escapeChar) {
					if (j != message.length-1) {
						j = j+1;
					}
				}
				break;
			}
			j --;
		}
		return message.substring(i, j+1);
	}
}

class ParsedObject {

	constructor() {
		this.body = new Map();
	}

	addAttribute(name, attribute) {
		if (!this.body.has(name)) {
			this.body.set(name, attribute);
		}
	}

	getAttribute(name) {
		return this.body.get(name);
	}

	isPrimitive() {
		return false;
	}

	getValue() {
		return null;
	}

	toString() {
		var result = "{";
		for (var att of this.body.keys()) {
			result = result.concat(att).concat(": ").concat(this.body.get(att).toString()).concat(", ");
		}
		if (this.body.size > 0) {
			result = result.substring(0, result.length-2);
		}
		result = result.concat("}");
		return result;
	}

  getObject() {
    var result = {};
    for (var att of this.body.keys()) {
      result[att] = this.body.get(att).getObject();
    }
    return result;
  }
}

class ParsedArray extends ParsedObject {

	constructor() {
    super();
		this.content = [];
	}

	addAttribute(name, attribute) {
		return;
	}

	getAttribute(name) {
		return null;
	}

	addContent(object) {
		this.content.push(object);
	}

	getContent(index) {
		return this.content[index];
	}

	getContentLength() {
		return this.content.length;
	}

	toString() {
		var result = "[";
		for (var object of this.content) {
			result = result.concat(object.toString()).concat(", ");
		}
		if (this.content.length > 0) {
			result = result.substring(0, result.length-2);
		}
		result = result.concat("]");
		return result;
	}

  getObject() {
    var result = [];
    for (var i = 0; i < this.getContentLength(); i++) {
      result.push(this.getContent(i).getObject());
    }
    return result;
  }
}

class ParsedString extends ParsedObject {

	constructor(value) {
    super();
		this.value = value;
	}

	addAttribute(name, attribute) {
		return;
	}

	getAttribute(name) {
		return null;
	}

	isPrimitive() {
		return true;
	}

	getValue() {
		return this.value;
	}

	toString() {
		var result = "\"".concat(this.value).concat("\"");
		return result;
	}

  getObject() {
    var result = this.getValue();
    return result;
  }
}

class ParsedBoolean extends ParsedObject {

	constructor(value) {
    super();
		this.value = value;
	}

	addAttribute(name, attribute) {
		return;
	}

	getAttribute(name) {
		return null;
	}

	isPrimitive() {
		return true;
	}

	getValue() {
		return this.value;
	}

	toString() {
		var result = this.value.toString();
		return result;
	}

  getObject() {
    var result = this.getValue();
    return result;
  }
}

class ParsedDouble extends ParsedObject {

	constructor(value) {
    super();
		this.value = value;
	}

	addAttribute(name, attribute) {
		return;
	}

	getAttribute(name) {
		return null;
	}

	isPrimitive() {
		return true;
	}

	getValue() {
		return this.value;
	}

	toString() {
    var result = this.value.toString();
		return result;
	}

  getObject() {
    var result = this.getValue();
    return result;
   }
}

class ParsedInt extends ParsedObject {

	constructor(value) {
    super();
		this.value = value;
	}

	addAttribute(name, attribute) {
		return;
	}

	getAttribute(name) {
		return null;
	}

	isPrimitive() {
		return true;
	}

	getValue() {
		return this.value;
	}

	toString() {
    var result = this.value.toString();
		return result;
	}

  getObject() {
    var result = this.getValue();
    return result;
  }
}
