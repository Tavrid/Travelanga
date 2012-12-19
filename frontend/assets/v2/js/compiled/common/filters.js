// Generated by CoffeeScript 1.4.0
var AviaFiltersT, DistancesFilter, Filter, HotelFiltersT, ListFilter, MaxStopoverFilter, OnlyDirectFilter, PriceFilter, ServiceClassFilter, StarOption, StarsFilter, TextFilter, TimeFilter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Filter = (function() {

  function Filter() {
    this.setConfig = __bind(this.setConfig, this);
    this.getConfig = __bind(this.getConfig, this);
  }

  Filter.prototype.filter = function(item) {
    throw "override me";
  };

  Filter.prototype.resetLimits = function(item) {};

  Filter.prototype.updateLimits = function(item) {};

  Filter.prototype.get = function(item, key) {
    var value;
    value = ko.utils.unwrapObservable(item[key]);
    if ((typeof value) === 'function') {
      value = value.apply(item);
    }
    return value;
  };

  Filter.prototype.getConfig = function() {
    return this.selection();
  };

  Filter.prototype.setConfig = function(value) {
    return this.selection(value);
  };

  return Filter;

})();

TimeFilter = (function(_super) {

  __extends(TimeFilter, _super);

  function TimeFilter(key) {
    this.key = key;
    this.setConfig = __bind(this.setConfig, this);
    this.filter = __bind(this.filter, this);
    this.limits = ko.rangeObservable(1440, 0);
    this.selection = ko.rangeObservable(0, 1440);
    this.element = false;
    _.extend(this, Backbone.Events);
  }

  TimeFilter.prototype.filter = function(result) {
    return Utils.inRange(this.get(result, this.key), this.selection());
  };

  TimeFilter.prototype.updateLimits = function(item) {
    var limits, value;
    value = this.get(item, this.key);
    limits = this.limits();
    if (value < limits.from) {
      limits.from = value;
    }
    if (value > limits.to) {
      limits.to = value;
    }
    return this.limits(limits.from + ';' + limits.to);
  };

  TimeFilter.prototype.setConfig = function(value) {
    this.selection(value.from + ';' + value.to);
    if (this.element) {
      return this.element.jslider('value', value.from, value.to);
    }
  };

  return TimeFilter;

})(Filter);

PriceFilter = (function(_super) {

  __extends(PriceFilter, _super);

  function PriceFilter(key) {
    this.key = key;
    this.setConfig = __bind(this.setConfig, this);
    this.filter = __bind(this.filter, this);
    this.limits = ko.rangeObservable(999000, 0);
    this.selection = ko.rangeObservable(0, 999000);
    this.element = false;
    _.extend(this, Backbone.Events);
  }

  PriceFilter.prototype.filter = function(result) {
    return Utils.inRange(this.get(result, this.key), this.selection());
  };

  PriceFilter.prototype.updateLimits = function(item) {
    var limits, value;
    value = this.get(item, this.key);
    limits = this.limits();
    if (value < limits.from) {
      limits.from = value;
    }
    if (value > limits.to) {
      limits.to = value;
    }
    return this.limits(limits.from + ';' + limits.to);
  };

  PriceFilter.prototype.setConfig = function(value) {
    this.selection(value.from + ';' + value.to);
    if (this.element) {
      return this.element.jslider('value', value.from, value.to);
    }
  };

  return PriceFilter;

})(Filter);

DistancesFilter = (function(_super) {

  __extends(DistancesFilter, _super);

  function DistancesFilter(key) {
    this.key = key;
    this.setConfig = __bind(this.setConfig, this);
    this.filter = __bind(this.filter, this);
    this.limits = ko.rangeObservable(999000, 0);
    this.selection = ko.observable(999000);
    this.element = false;
    _.extend(this, Backbone.Events);
  }

  DistancesFilter.prototype.filter = function(result) {
    return this.get(result, this.key) <= this.selection();
  };

  DistancesFilter.prototype.updateLimits = function(item) {
    var limits, value;
    value = this.get(item, this.key);
    limits = this.limits();
    if (value < limits.from) {
      limits.from = value;
    }
    if (value > limits.to) {
      limits.to = value;
    }
    return this.limits(limits.from + ';' + limits.to);
  };

  DistancesFilter.prototype.setConfig = function(value) {
    this.selection(value);
    if (this.element) {
      return this.element.jslider('value', value);
    }
  };

  return DistancesFilter;

})(Filter);

ListFilter = (function(_super) {

  __extends(ListFilter, _super);

  function ListFilter(keys, caption, moreLabel) {
    var _this = this;
    this.keys = keys;
    this.caption = caption;
    this.moreLabel = moreLabel;
    this.setConfig = __bind(this.setConfig, this);
    this.getConfig = __bind(this.getConfig, this);
    this.showMore = __bind(this.showMore, this);
    this.reset = __bind(this.reset, this);
    this.filter = __bind(this.filter, this);
    this.options = ko.observableArray();
    this._known = {};
    this.active = ko.computed(function() {
      return _this.options().length > 1;
    });
    this.selection = ko.computed(function() {
      var item, result, _i, _len, _ref;
      result = [];
      _ref = _this.options();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.checked()) {
          result.push(item.key);
        }
      }
      return result;
    });
    _.extend(this, Backbone.Events);
  }

  ListFilter.prototype.addOption = function(value) {
    this._known[value] = 1;
    this.options.remove(function(item) {
      return item.key === value;
    });
    return this.options.unshift({
      key: value,
      checked: ko.observable(0)
    });
  };

  ListFilter.prototype.updateLimits = function(item) {
    var key, propValue, value, values, _i, _len, _ref, _results;
    _ref = this.keys;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      propValue = this.get(item, key);
      if (typeof propValue === 'undefined') {
        continue;
      } else if (typeof propValue !== 'object') {
        values = [];
        values.push(propValue);
      } else {
        values = propValue;
      }
      if (values) {
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
            value = values[_j];
            if (this._known[value]) {
              continue;
            }
            this._known[value] = 1;
            this.options.push({
              key: value,
              checked: ko.observable(0)
            });
            _results1.push(this.options.sort(function(left, right) {
              if (left.key === right.key) {
                return 0;
              }
              if (left.key > right.key) {
                return 1;
              }
              return -1;
            }));
          }
          return _results1;
        }).call(this));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  ListFilter.prototype.filter = function(result) {
    var find, key, propValue, value, values, _i, _j, _len, _len1, _ref, _ref1;
    if (this.selection().length === 0) {
      return true;
    }
    console.log('servFilters', this.selection());
    _ref = this.keys;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      propValue = this.get(result, key);
      console.log('servFiltersProp', propValue);
      if (typeof propValue !== 'object') {
        if (this.selection().indexOf(propValue) < 0) {
          return false;
        }
      } else {
        if (propValue) {
          values = propValue;
          find = true;
          _ref1 = this.selection();
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            value = _ref1[_j];
            find = find && (propValue.indexOf(value) >= 0);
          }
          return find;
        } else {
          return false;
        }
      }
    }
    return true;
  };

  ListFilter.prototype.reset = function() {
    var item, _i, _len, _ref, _results;
    _ref = this.options();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push(item.checked(false));
    }
    return _results;
  };

  ListFilter.prototype.showMore = function(context, event) {
    var btnText, div, el;
    el = $(event.currentTarget);
    div = el.parent().parent().find('.more-filters');
    if (!(div.css('display') === 'none')) {
      btnText = el.text(el.text().replace("Скрыть", "Все"));
      return div.hide('fast', reInitJScrollPane);
    } else {
      btnText = el.text(el.text().replace("Все", "Скрыть"));
      return div.show('fast', reInitJScrollPane);
    }
  };

  ListFilter.prototype.getConfig = function() {
    var item, result, _i, _len, _ref;
    result = {};
    _ref = this.options();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      result[item.key] = item.checked();
    }
    return result;
  };

  ListFilter.prototype.setConfig = function(value) {
    var item, _i, _len, _ref, _results;
    _ref = this.options();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push(item.checked(value[item.key]));
    }
    return _results;
  };

  return ListFilter;

})(Filter);

StarOption = (function() {

  function StarOption(key) {
    var _this = this;
    this.key = key;
    this.starName = STARS_VERBOSE[this.key - 1];
    this.checked = ko.observable(0);
    this.cls = ko.computed(function() {
      if (_this.checked()) {
        return 'active';
      }
      return '';
    });
  }

  return StarOption;

})();

StarsFilter = (function(_super) {

  __extends(StarsFilter, _super);

  function StarsFilter(keys, caption, moreLabel) {
    var i, _i,
      _this = this;
    this.keys = keys;
    this.caption = caption;
    this.moreLabel = moreLabel;
    this.setConfig = __bind(this.setConfig, this);
    this.getConfig = __bind(this.getConfig, this);
    this.filter = __bind(this.filter, this);
    this.options = ko.observableArray();
    for (i = _i = 1; _i <= 5; i = ++_i) {
      this.options.push(new StarOption(i));
    }
    this.active = ko.computed(function() {
      return _this.options().length > 1;
    });
    this.selection = ko.computed(function() {
      var item, result, _j, _len, _ref;
      result = [];
      _ref = _this.options();
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        item = _ref[_j];
        if (item.checked()) {
          result.push(item.starName);
        }
      }
      return result;
    });
    _.extend(this, Backbone.Events);
  }

  StarsFilter.prototype.updateLimits = function(item) {};

  StarsFilter.prototype.filter = function(result) {
    var key, propValue, _i, _len, _ref;
    if (this.selection().length === 0) {
      return true;
    }
    _ref = this.keys;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      propValue = this.get(result, key);
      console.log(this.selection());
      console.log(propValue);
      if (this.selection().indexOf(propValue) < 0) {
        return false;
      }
    }
    return true;
  };

  StarsFilter.prototype.starClick = function() {
    console.log(this);
    if (!$(this).hasClass('active')) {
      return $(this).addClass('active');
    } else {
      return $(this).removeClass('active');
    }
  };

  StarsFilter.prototype.getConfig = function() {
    var item, result, _i, _len, _ref;
    result = {};
    _ref = this.options();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      result[item.starName] = item.checked();
    }
    return result;
  };

  StarsFilter.prototype.setConfig = function(value) {
    var item, _i, _len, _ref, _results;
    _ref = this.options();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push(item.checked(value[item.starName]));
    }
    return _results;
  };

  return StarsFilter;

})(Filter);

MaxStopoverFilter = (function(_super) {

  __extends(MaxStopoverFilter, _super);

  function MaxStopoverFilter(value, field) {
    this.value = value;
    this.field = field != null ? field : 'stopoverLength';
    this.filter = __bind(this.filter, this);
    this.selection = ko.observable(0);
  }

  MaxStopoverFilter.prototype.filter = function(item) {
    if (this.selection()) {
      return this.get(item, this.field) <= (60 * 60) * this.value;
    }
    return true;
  };

  return MaxStopoverFilter;

})(Filter);

OnlyDirectFilter = (function(_super) {

  __extends(OnlyDirectFilter, _super);

  function OnlyDirectFilter() {
    this.filter = __bind(this.filter, this);    this.selection = ko.observable(0);
  }

  OnlyDirectFilter.prototype.filter = function(item) {
    if (+this.selection()) {
      return item.direct;
    }
    return true;
  };

  return OnlyDirectFilter;

})(Filter);

ServiceClassFilter = (function(_super) {

  __extends(ServiceClassFilter, _super);

  function ServiceClassFilter() {
    this.filter = __bind(this.filter, this);    this.selection = ko.observable('A');
  }

  ServiceClassFilter.prototype.filter = function(item) {
    var lit;
    lit = this.selection();
    if (lit === 'A') {
      return item.serviceClass === 'E';
    } else {
      return item.serviceClass === 'B' || item.serviceClass === 'F';
    }
  };

  return ServiceClassFilter;

})(Filter);

TextFilter = (function(_super) {

  __extends(TextFilter, _super);

  function TextFilter(key, caption) {
    this.key = key;
    this.caption = caption;
    this.keyDown = __bind(this.keyDown, this);
    this.updateResults = __bind(this.updateResults, this);
    this.filter = __bind(this.filter, this);
    this.selection = ko.observable('');
    this.updateTimeout = null;
  }

  TextFilter.prototype.filter = function(item) {
    var expr, lit, result;
    lit = this.selection();
    result = true;
    if (lit !== '') {
      expr = new RegExp(lit, 'ig');
      result = expr.test(item[this.key]);
    }
    return result;
  };

  TextFilter.prototype.updateResults = function() {
    return this.updateTimeout = null;
  };

  TextFilter.prototype.keyDown = function() {
    var _this = this;
    if (this.updateTimeout !== null) {
      window.clearTimeout(this.updateTimeout);
      return this.updateTimeout = window.setTimeout(function() {
        return _this.updateResults();
      }, 1000);
    }
  };

  return TextFilter;

})(Filter);

AviaFiltersT = (function() {

  function AviaFiltersT(results) {
    var fields,
      _this = this;
    this.results = results;
    this.setConfig = __bind(this.setConfig, this);
    this.getConfig = __bind(this.getConfig, this);
    this.iterate = __bind(this.iterate, this);
    this.filter = __bind(this.filter, this);
    this.runFiltersFunc = __bind(this.runFiltersFunc, this);
    this.runFilters = __bind(this.runFilters, this);
    this.filterBackVoyage = __bind(this.filterBackVoyage, this);
    this.filterVoyage = __bind(this.filterVoyage, this);
    this.filterResult = __bind(this.filterResult, this);
    this.updateLimitsBackVoyage = __bind(this.updateLimitsBackVoyage, this);
    this.updateLimitsVoyage = __bind(this.updateLimitsVoyage, this);
    this.updateLimitsResult = __bind(this.updateLimitsResult, this);
    this.template = 'avia-filters';
    this.rt = this.results.roundTrip;
    this.showRt = ko.observable(0);
    this.showRtText = ko.observable('');
    this.showRt.subscribe(function(newValue) {
      if (+newValue) {
        return _this.showRtText('обратно');
      } else {
        return _this.showRtText('туда');
      }
    });
    this.voyageFilters = ['departure', 'arrival', 'shortStopover', 'irrelevantlyLong', 'onlyDirect'];
    this.rtVoyageFilters = ['rtDeparture', 'rtArrival', 'shortStopover', 'irrelevantlyLong', 'onlyDirect'];
    this.resultFilters = ['departureAirport', 'arrivalAirport', 'airline', 'serviceClass'];
    this.departure = new PriceFilter('departureTimeNumeric');
    this.arrival = new TimeFilter('arrivalTimeNumeric');
    if (this.rt) {
      this.rtDeparture = new TimeFilter('departureTimeNumeric');
      this.rtArrival = new TimeFilter('arrivalTimeNumeric');
    }
    fields = this.rt ? ['departureAirport', 'rtArrivalAirport'] : ['departureAirport'];
    this.departureAirport = new ListFilter(fields, this.results.departureCity, 'Все аэропорты');
    fields = this.rt ? ['arrivalAirport', 'rtDepartureAirport'] : ['arrivalAirport'];
    this.arrivalAirport = new ListFilter(fields, this.results.arrivalCity, 'Все аэропорты');
    this.airline = new ListFilter(['airlineName'], 'Авиакомпании', 'Все авиакомпании');
    this.shortStopover = new MaxStopoverFilter(2.5);
    this.irrelevantlyLong = new MaxStopoverFilter(30, 'maxStopoverLength');
    this.irrelevantlyLong.selection(1);
    this.onlyDirect = new OnlyDirectFilter();
    this.serviceClass = new ServiceClassFilter();
    this.refilter = (ko.computed(function() {
      var key, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      _ref = _this.resultFilters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _this[key].selection();
      }
      _ref1 = _this.voyageFilters;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        key = _ref1[_j];
        _this[key].selection();
      }
      if (_this.rt) {
        _ref2 = _this.rtVoyageFilters;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          key = _ref2[_k];
          _results.push(_this[key].selection());
        }
        return _results;
      }
    })).extend({
      throttle: 50
    });
    this.refilter.subscribe(this.filter);
    this.iterate(this.updateLimitsResult, this.updateLimitsVoyage, this.updateLimitsBackVoyage);
  }

  AviaFiltersT.prototype.updateLimitsResult = function(result) {
    return this.runFiltersFunc(result, this.resultFilters, 'updateLimits');
  };

  AviaFiltersT.prototype.updateLimitsVoyage = function(voyage) {
    var visible;
    visible = true;
    return this.runFiltersFunc(voyage, this.voyageFilters, 'updateLimits');
  };

  AviaFiltersT.prototype.updateLimitsBackVoyage = function(backVoyage) {
    return this.runFiltersFunc(backVoyage, this.rtVoyageFilters, 'updateLimits');
  };

  AviaFiltersT.prototype.setVisibleIfChanged = function(item, visible) {
    if (item.visible() === visible) {
      return;
    }
    return item.visible(visible);
  };

  AviaFiltersT.prototype.filterResult = function(result) {
    return this.runFilters(result, this.resultFilters);
  };

  AviaFiltersT.prototype.filterVoyage = function(voyage) {
    return this.runFilters(voyage, this.voyageFilters);
  };

  AviaFiltersT.prototype.filterBackVoyage = function(backVoyage) {
    return this.runFilters(backVoyage, this.rtVoyageFilters);
  };

  AviaFiltersT.prototype.runFilters = function(item, filterSet) {
    var filter_key, visible, _i, _len;
    visible = true;
    for (_i = 0, _len = filterSet.length; _i < _len; _i++) {
      filter_key = filterSet[_i];
      visible = visible && this[filter_key].filter(item);
      if (!visible) {
        break;
      }
    }
    return this.setVisibleIfChanged(item, visible);
  };

  AviaFiltersT.prototype.runFiltersFunc = function(item, filterSet, methodName) {
    var filter_key, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = filterSet.length; _i < _len; _i++) {
      filter_key = filterSet[_i];
      _results.push(this[filter_key][methodName](item));
    }
    return _results;
  };

  AviaFiltersT.prototype.filter = function() {
    this.iterate(this.filterResult, this.filterVoyage, this.filterBackVoyage);
    ko.processAllDeferredBindingUpdates();
    return scrollValue('avia', {});
  };

  AviaFiltersT.prototype.iterate = function(onResult, onVoyage, onBackVoyage) {
    var backVoyage, result, voyage, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    _ref = this.results.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      onResult(result);
      _ref1 = result.voyages;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        voyage = _ref1[_j];
        onVoyage(voyage);
        if (this.rt) {
          _ref2 = voyage._backVoyages;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            backVoyage = _ref2[_k];
            onBackVoyage(backVoyage);
          }
          voyage.chooseActive();
        }
      }
      result.chooseActive();
    }
    return this.results.postFilters();
  };

  AviaFiltersT.prototype.getConfig = function() {
    var config, key, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    config = {};
    _ref = this.resultFilters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      config[key] = this[key].getConfig();
    }
    _ref1 = this.voyageFilters;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      key = _ref1[_j];
      config[key] = this[key].getConfig();
    }
    if (this.rt) {
      _ref2 = this.rtVoyageFilters;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        key = _ref2[_k];
        config[key] = this[key].getConfig();
      }
    }
    console.log('getConfig', config);
    return config;
  };

  AviaFiltersT.prototype.setConfig = function(config) {
    var cfg, key, _results;
    console.log('setConfig', config);
    _results = [];
    for (key in config) {
      cfg = config[key];
      _results.push(this[key].setConfig(cfg));
    }
    return _results;
  };

  return AviaFiltersT;

})();

HotelFiltersT = (function() {

  function HotelFiltersT(results) {
    var _this = this;
    this.results = results;
    this.setConfig = __bind(this.setConfig, this);
    this.getConfig = __bind(this.getConfig, this);
    this.iterate = __bind(this.iterate, this);
    this.filter = __bind(this.filter, this);
    this.runFiltersFunc = __bind(this.runFiltersFunc, this);
    this.runFilters = __bind(this.runFilters, this);
    this.filterRoom = __bind(this.filterRoom, this);
    this.filterHotel = __bind(this.filterHotel, this);
    this.updateLimitsRoom = __bind(this.updateLimitsRoom, this);
    this.updateLimitsHotel = __bind(this.updateLimitsHotel, this);
    this.showFullMap = __bind(this.showFullMap, this);
    this.template = 'hotels-filters';
    this.roomFilters = ['price'];
    this.hotelFilters = ['services', 'stars', 'distance', 'hotelName'];
    this.services = new ListFilter(['hotelServices'], 'Дополнительно', 'Все услуги');
    this.stars = new StarsFilter(['stars'], 'Дополнительно', 'Все услуги');
    this.price = new PriceFilter('pricePerNight');
    this.distance = new DistancesFilter('distanceToCenter');
    this.hotelName = new TextFilter('hotelName', 'поиск по названию');
    this.refilter = (ko.computed(function() {
      var key, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = _this.hotelFilters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _this[key].selection();
      }
      _ref1 = _this.roomFilters;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        key = _ref1[_j];
        _results.push(_this[key].selection());
      }
      return _results;
    })).extend({
      throttle: 50
    });
    this.refilter.subscribe(this.filter);
    this.iterate(this.updateLimitsHotel, this.updateLimitsRoom, false);
    this.services.addOption('Фитнесс');
    this.services.addOption('Парковка');
    this.services.addOption('Интернет');
  }

  HotelFiltersT.prototype.showFullMap = function() {
    console.log('FM');
    console.log();
    return this.results.showFullMapFunc();
  };

  HotelFiltersT.prototype.updateLimitsHotel = function(result) {
    return this.runFiltersFunc(result, this.hotelFilters, 'updateLimits');
  };

  HotelFiltersT.prototype.updateLimitsRoom = function(roomSet) {
    var visible;
    visible = true;
    return this.runFiltersFunc(roomSet, this.roomFilters, 'updateLimits');
  };

  HotelFiltersT.prototype.setVisibleIfChanged = function(item, visible) {
    if (item.visible() === visible) {
      return;
    }
    return item.visible(visible);
  };

  HotelFiltersT.prototype.filterHotel = function(result) {
    return this.runFilters(result, this.hotelFilters);
  };

  HotelFiltersT.prototype.filterRoom = function(roomSet) {
    return this.runFilters(roomSet, this.roomFilters);
  };

  HotelFiltersT.prototype.runFilters = function(item, filterSet) {
    var filter_key, visible, _i, _len;
    visible = true;
    for (_i = 0, _len = filterSet.length; _i < _len; _i++) {
      filter_key = filterSet[_i];
      visible = visible && this[filter_key].filter(item);
      if (!visible) {
        break;
      }
    }
    return this.setVisibleIfChanged(item, visible);
  };

  HotelFiltersT.prototype.runFiltersFunc = function(item, filterSet, methodName) {
    var filter_key, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = filterSet.length; _i < _len; _i++) {
      filter_key = filterSet[_i];
      _results.push(this[filter_key][methodName](item));
    }
    return _results;
  };

  HotelFiltersT.prototype.filter = function() {
    console.log('filters changed');
    return this.iterate(this.filterHotel, this.filterRoom);
  };

  HotelFiltersT.prototype.iterate = function(onHotel, onRoom, fromInt) {
    var result, roomSet, someVisible, _i, _j, _len, _len1, _ref, _ref1;
    if (fromInt == null) {
      fromInt = true;
    }
    _ref = this.results.data();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      onHotel(result);
      if (result.visible()) {
        someVisible = false;
        _ref1 = result.roomSets();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          roomSet = _ref1[_j];
          onRoom(roomSet);
          someVisible = someVisible || roomSet.visible();
        }
        result.visible(someVisible);
      }
    }
    console.log('all filters accepted', fromInt);
    return this.results.postFilters(true);
  };

  HotelFiltersT.prototype.getConfig = function() {
    var config, key, _i, _j, _len, _len1, _ref, _ref1;
    config = {};
    _ref = this.hotelFilters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      config[key] = this[key].getConfig();
    }
    _ref1 = this.roomFilters;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      key = _ref1[_j];
      config[key] = this[key].getConfig();
    }
    console.log('getConfig', config);
    return config;
  };

  HotelFiltersT.prototype.setConfig = function(config) {
    var cfg, key, _results;
    console.log('setConfig', config);
    _results = [];
    for (key in config) {
      cfg = config[key];
      _results.push(this[key].setConfig(cfg));
    }
    return _results;
  };

  return HotelFiltersT;

})();
