// Generated by CoffeeScript 1.4.0
var Voyasha, VoyashaCheapest, VoyashaOptima, VoyashaRich, scaledValue,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

scaledValue = function(value, max, scale, invert) {
  if (invert == null) {
    invert = false;
  }
  if (value >= max) {
    if (invert) {
      return 0;
    } else {
      return scale;
    }
  }
  if (invert) {
    return scale - value * scale / max;
  }
  return value * scale / max;
};

Voyasha = (function() {

  function Voyasha(toursResultSet) {
    var _this = this;
    this.toursResultSet = toursResultSet;
    this.choose = __bind(this.choose, this);

    this.handleHotels = __bind(this.handleHotels, this);

    this.handleAvia = __bind(this.handleAvia, this);

    if (this.init) {
      this.init();
    }
    this.selected = ko.computed(function() {
      var item, result, _i, _len, _ref;
      result = [];
      _ref = _this.toursResultSet.data();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.isAvia()) {
          result.push((!item.noresults ? _this.handleAvia(item) : null));
        } else {
          result.push((!item.noresults ? _this.handleHotels(item) : null));
        }
      }
      return result;
    });
    this.price = ko.computed(function() {
      var item, result, _i, _len, _ref;
      result = 0;
      _ref = _this.selected();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item != null) {
          result += item.price;
        }
      }
      return result;
    });
    this.title = this.getTitle();
  }

  Voyasha.prototype.handleAvia = function() {
    throw "Implement me";
  };

  Voyasha.prototype.getRating = function(x, maxPrice, maxDistance) {
    var dCenter, hotelRating, rPrice, stars, userRating;
    if (x.rating === '-') {
      userRating = 0;
    } else {
      userRating = scaledValue(x.rating, 5, this.RATING_WEIGHT);
    }
    stars = scaledValue(x.starsNumeric, 5, this.STARS_WEIGHT);
    dCenter = scaledValue(x.distanceToCenter, maxDistance, this.DISTANCE_WEIGHT, true);
    rPrice = scaledValue(x.roomSets()[0].discountPrice, maxPrice, this.PRICE_WEIGHT, true);
    hotelRating = Math.sqrt(stars * stars + userRating * userRating + dCenter * dCenter + rPrice * rPrice);
    return hotelRating;
  };

  Voyasha.prototype.handleHotels = function(item) {
    var data, found, maxDistance, maxPrice, result,
      _this = this;
    data = item.results().data();
    maxPrice = _.reduce(data, function(memo, hotel) {
      if (memo > hotel.roomSets()[0].discountPrice) {
        return memo;
      } else {
        return hotel.roomSets()[0].discountPrice;
      }
    }, data[0].roomSets()[0].discountPrice);
    maxDistance = _.reduce(data, function(memo, hotel) {
      if (!hotel.distanceToCenter) {
        return memo;
      }
      if (memo > hotel.distanceToCenter) {
        return memo;
      } else {
        return hotel.distanceToCenter;
      }
    }, 0);
    found = _.reduce(data, function(memo, hotel) {
      if (_this.getRating(memo, maxPrice, maxDistance) > _this.getRating(hotel, maxPrice, maxDistance)) {
        return memo;
      } else {
        return hotel;
      }
    }, data[0]);
    result = {
      roomSet: found.roomSets()[0],
      hotel: data,
      price: found.roomSets()[0].discountPrice
    };
    return result;
  };

  Voyasha.prototype.choose = function() {
    var item, _i, _len, _ref;
    _ref = this.toursResultSet.data();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.isAvia()) {
        item.select((item.noresults ? null : this.handleAvia(item)));
      } else {
        item.select((item.noresults ? null : this.handleHotels(item)));
      }
    }
    return this.toursResultSet.showOverview();
  };

  return Voyasha;

})();

VoyashaCheapest = (function(_super) {

  __extends(VoyashaCheapest, _super);

  function VoyashaCheapest() {
    this.handleAvia = __bind(this.handleAvia, this);

    this.getTitle = __bind(this.getTitle, this);

    this.init = __bind(this.init, this);
    return VoyashaCheapest.__super__.constructor.apply(this, arguments);
  }

  VoyashaCheapest.prototype.init = function() {
    this.PRICE_WEIGHT = 5;
    this.RATING_WEIGHT = 0;
    this.STARS_WEIGHT = 0;
    return this.DISTANCE_WEIGHT = 0;
  };

  VoyashaCheapest.prototype.getTitle = function() {
    return 'Самый дешевый';
  };

  VoyashaCheapest.prototype.handleAvia = function(item) {
    return _.reduce(item.results().data, function(memo, flight) {
      if (memo.price < flight.price) {
        return memo;
      } else {
        return flight;
      }
    }, item.results().data[0]);
  };

  return VoyashaCheapest;

})(Voyasha);

VoyashaOptima = (function(_super) {

  __extends(VoyashaOptima, _super);

  function VoyashaOptima() {
    this.handleAvia = __bind(this.handleAvia, this);

    this.getTitle = __bind(this.getTitle, this);

    this.init = __bind(this.init, this);
    return VoyashaOptima.__super__.constructor.apply(this, arguments);
  }

  VoyashaOptima.prototype.init = function() {
    this.PRICE_WEIGHT = 5;
    this.RATING_WEIGHT = 3;
    this.STARS_WEIGHT = 4;
    return this.DISTANCE_WEIGHT = 2;
  };

  VoyashaOptima.prototype.getTitle = function() {
    return 'Оптимальный вариант';
  };

  VoyashaOptima.prototype.handleAvia = function(item) {
    return item.results().getFilterLessBest();
  };

  return VoyashaOptima;

})(Voyasha);

VoyashaRich = (function(_super) {

  __extends(VoyashaRich, _super);

  function VoyashaRich() {
    this.handleAvia = __bind(this.handleAvia, this);

    this.getTitle = __bind(this.getTitle, this);

    this.init = __bind(this.init, this);
    return VoyashaRich.__super__.constructor.apply(this, arguments);
  }

  VoyashaRich.prototype.init = function() {
    this.PRICE_WEIGHT = 5;
    this.RATING_WEIGHT = 3;
    this.STARS_WEIGHT = 5;
    return this.DISTANCE_WEIGHT = 5;
  };

  VoyashaRich.prototype.getTitle = function() {
    return 'Роскошный вариант';
  };

  VoyashaRich.prototype.handleAvia = function(item) {
    var data, result, _i, _len;
    data = item.results().data;
    result = {
      'direct': data[0].directRating(),
      'price': data[0].price,
      'result': data[0]
    };
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      if (item.directRating() < result.direct) {
        result.direct = item.directRating();
        result.price = item.price;
        result.result = item;
      } else if (item.directRating() === result.direct) {
        if (item.price < result.price) {
          result.price = item.price;
          result.result = item;
        }
      }
    }
    return result.result;
  };

  return VoyashaRich;

})(Voyasha);
