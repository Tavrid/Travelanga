// Generated by CoffeeScript 1.4.0
var implement;

implement = function(class_, interface_) {
  var key, val, _results;
  _results = [];
  for (key in interface_) {
    val = interface_[key];
    if (!class_.prototype[key] || typeof class_.prototype[key] !== "function") {
      throw "Implement method `" + key + "` of interface `" + interface_.name + "` on  `" + class_.name + "`";
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};
