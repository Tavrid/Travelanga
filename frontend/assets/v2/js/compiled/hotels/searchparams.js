// Generated by CoffeeScript 1.4.0
var HotelsSearchParams, SpRoom,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SpRoom = (function() {

  function SpRoom(parent) {
    var _this = this;
    this.parent = parent;
    this.getUrl = __bind(this.getUrl, this);

    this.getHash = __bind(this.getHash, this);

    this.adults = ko.observable(1).extend({
      integerOnly: {
        min: 1,
        max: 4
      }
    });
    this.children = ko.observable(0).extend({
      integerOnly: {
        min: 0,
        max: 2
      }
    });
    this.ages = ko.observableArray();
    this.infants = ko.observable(0).extend({
      integerOnly: {
        min: 0,
        max: 2
      }
    });
    this.adults.subscribe(function(newValue) {
      if (newValue + _this.children() > 5) {
        _this.adults(5 - _this.children());
      }
      if ((_this.parent.overall() - _this.adults() + newValue) > 9) {
        return _this.adults(9 - _this.parent.overall() + _this.adults());
      }
    });
    this.children.subscribe(function(newValue) {
      var i, _i, _ref;
      if (newValue + _this.adults() > 5) {
        newValue = 5 - _this.adults();
        _this.children(newValue);
      }
      if ((_this.parent.overall() - _this.children() + newValue) > 9) {
        _this.children(9 - _this.parent.overall() + _this.children());
      }
      if (_this.ages().length === newValue) {
        return;
      }
      if (_this.ages().length < newValue) {
        for (i = _i = 0, _ref = newValue - _this.ages().length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          _this.ages.push({
            age: ko.observable(12).extend({
              integerOnly: {
                min: 0,
                max: 12
              }
            })
          });
        }
      } else if (_this.ages().length > newValue) {
        _this.ages.splice(newValue);
      }
      return ko.processAllDeferredBindingUpdates();
    });
  }

  SpRoom.prototype.fromList = function(item) {
    var i, parts, _i, _ref;
    console.log('SpRoom FromList', item);
    parts = item.split(':');
    console.log('parts:', parts);
    this.adults(parts[0]);
    this.children(parts[1]);
    this.infants(parts[2]);
    if (this.children() > 0) {
      for (i = _i = 0, _ref = this.children() - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.ages.push({
          age: ko.observable(parts[3 + i]).extend({
            integerOnly: {
              min: 0,
              max: 12
            }
          })
        });
      }
    }
    return console.log('ages:', this.ages());
  };

  SpRoom.prototype.fromObject = function(item) {
    var i, _i, _ref, _results;
    console.log('search params FromObject', item);
    this.adults(item.adt);
    this.children(item.chd);
    this.infants(item.cots);
    if (this.children() > 0) {
      _results = [];
      for (i = _i = 0, _ref = this.children() - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.ages.push({
          age: ko.observable(item.chdAges[i]).extend({
            integerOnly: {
              min: 0,
              max: 12
            }
          })
        }));
      }
      return _results;
    }
  };

  SpRoom.prototype.getHash = function() {
    var age, parts, _i, _len, _ref;
    parts = [this.adults(), this.children(), this.infants()];
    _ref = this.ages();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      age = _ref[_i];
      parts.push(age.age());
    }
    return parts.join(':');
  };

  SpRoom.prototype.getUrl = function(i) {
    var ageObj, agesText, agesTextVals, j, _i, _len, _ref;
    agesText = '';
    console.log('age p', this.ages(), this);
    agesTextVals = [];
    j = 0;
    _ref = this.ages();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ageObj = _ref[_i];
      console.log('age', ageObj, ageObj.age());
      agesTextVals.push(("rooms[" + i + "][chdAges][" + j + "]=") + ageObj.age());
      j++;
    }
    if (agesTextVals.length) {
      agesText = agesTextVals.join('&');
    }
    if (!agesText) {
      agesText = "rooms[" + i + "][chdAges]=0";
    }
    return ("rooms[" + i + "][adt]=") + this.adults() + ("&rooms[" + i + "][chd]=") + this.children() + "&" + agesText + ("&rooms[" + i + "][cots]=") + this.infants();
  };

  return SpRoom;

})();

HotelsSearchParams = (function() {

  function HotelsSearchParams() {
    this.GAData = __bind(this.GAData, this);

    this.GAKey = __bind(this.GAKey, this);

    this.url = __bind(this.url, this);

    this.fromObject = __bind(this.fromObject, this);

    this.fromList = __bind(this.fromList, this);

    this.getHash = __bind(this.getHash, this);

    var _this = this;
    this.city = ko.observable('');
    this.checkIn = ko.observable(false);
    this.checkOut = ko.observable(false);
    this.rooms = ko.observableArray([new SpRoom(this)]);
    this.overall = ko.computed(function() {
      var result, room, _i, _len, _ref;
      result = 0;
      _ref = _this.rooms();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        room = _ref[_i];
        result += room.adults();
        result += room.children();
      }
      return result;
    });
  }

  HotelsSearchParams.prototype.getHash = function() {
    var hash, parts, room, _i, _len, _ref;
    parts = [this.city(), moment(this.checkIn()).format('D.M.YYYY'), moment(this.checkOut()).format('D.M.YYYY')];
    _ref = this.rooms();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      parts.push(room.getHash());
    }
    hash = 'hotels/search/' + parts.join('/') + '/';
    window.voyanga_debug("Generated hash for hotels search", hash);
    return hash;
  };

  HotelsSearchParams.prototype.fromList = function(data) {
    var item, r, rest, _i, _len, _results;
    this.city(data[0]);
    this.checkIn(moment(data[1], 'D.M.YYYY').toDate());
    this.checkOut(moment(data[2], 'D.M.YYYY').toDate());
    this.rooms.splice(0);
    rest = data[3].split('/');
    _results = [];
    for (_i = 0, _len = rest.length; _i < _len; _i++) {
      item = rest[_i];
      if (item) {
        r = new SpRoom(this);
        r.fromList(item);
        _results.push(this.rooms.push(r));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  HotelsSearchParams.prototype.fromObject = function(data) {
    var item, r, _i, _len, _ref, _results;
    this.city(data.city);
    this.checkIn(moment(data.checkIn, 'YYYY-M-D').toDate());
    this.checkOut(moment(data.checkIn, 'YYYY-M-D').add('days', data.duration).toDate());
    this.rooms.splice(0);
    _ref = data.rooms;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      r = new SpRoom(this);
      r.fromObject(item);
      _results.push(this.rooms.push(r));
    }
    return _results;
  };

  HotelsSearchParams.prototype.url = function() {
    var i, result, room, _i, _len, _ref;
    result = "hotel/search?city=" + this.city();
    result += '&checkIn=' + moment(this.checkIn()).format('YYYY-M-D');
    result += '&duration=' + moment(this.checkOut()).diff(moment(this.checkIn()), 'days');
    _ref = this.rooms();
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      room = _ref[i];
      result += '&' + room.getUrl(i);
    }
    return result;
  };

  HotelsSearchParams.prototype.GAKey = function() {
    return this.city();
  };

  HotelsSearchParams.prototype.GAData = function() {
    var passangers, result, room, _i, _len, _ref;
    result = "1";
    passangers = [0, 0, 0];
    _ref = this.rooms();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      passangers[0] += room.adults();
      passangers[1] += room.children();
      passangers[2] += room.infants();
    }
    result += ", " + passangers.join(" - ");
    result += ", " + moment(this.checkIn()).format('D.M.YYYY') + ' - ' + moment(this.checkOut()).format('D.M.YYYY');
    result += ", " + moment(this.checkIn()).diff(moment(), 'days') + " - " + moment(this.checkOut()).diff(moment(this.checkIn()), 'days');
    return result;
  };

  return HotelsSearchParams;

})();
