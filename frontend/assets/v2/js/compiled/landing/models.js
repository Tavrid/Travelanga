// Generated by CoffeeScript 1.4.0
var landBestPrice, landBestPriceBack, landBestPriceSet, landingCitySelector,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

landBestPriceBack = (function() {

  function landBestPriceBack(data, parent) {
    var _this = this;
    this.parent = parent;
    this.selectThis = __bind(this.selectThis, this);

    if (data.price) {
      this.price = parseInt(data.price);
      this.empty = false;
      this.showPrice = ko.computed(function() {
        return _this.price - _this.parent.showPrice();
      });
      this.showPriceText = ko.computed(function() {
        return Utils.formatPrice(_this.showPrice());
      });
      this.showWidth = ko.computed(function() {
        var k;
        if (_this.parent.backMaxPrice() - _this.parent.backMinPrice()) {
          k = 10 + Math.ceil((_this.showPrice() - _this.parent.backMinPrice()) / (_this.parent.backMaxPrice() - _this.parent.backMinPrice()) * 90);
          return k;
        } else {
          return 50;
        }
      });
    } else {
      this.empty = true;
    }
    this.backDate = moment(data.dateBack);
    this.selected = ko.observable(false);
  }

  landBestPriceBack.prototype.selectThis = function() {
    if (this.backDate.diff(this.parent.date) >= 0) {
      this.parent.setActiveBack(this.backDate.format('YYYY-MM-DD'));
      return this.parent.selectThis();
    }
  };

  return landBestPriceBack;

})();

landBestPrice = (function() {

  function landBestPrice(data, parent) {
    var _this = this;
    this.parent = parent;
    this.selectThis = __bind(this.selectThis, this);

    this.setActiveBack = __bind(this.setActiveBack, this);

    this.addBack = __bind(this.addBack, this);

    this.date = moment(data.date);
    this._results = {};
    if (data.price) {
      this.minPrice = ko.observable(parseInt(data.price) * 2 + 5);
      this.backMaxPrice = ko.observable(1);
      this.backMinPrice = ko.observable(this.minPrice());
      this.showPrice = ko.computed(function() {
        return Math.ceil(_this.minPrice() / 2);
      });
      this.showPriceText = ko.computed(function() {
        return Utils.formatPrice(_this.showPrice());
      });
      this.showWidth = ko.computed(function() {
        var k;
        if (_this.parent.maxPrice() - _this.parent.minPrice()) {
          k = 10 + Math.ceil((_this.showPrice() - _this.parent.minPrice()) / (_this.parent.maxPrice() - _this.parent.minPrice()) * 90);
          return k;
        } else {
          return 50;
        }
      });
    } else {
      this.empty = true;
    }
    this._emptyResults = ko.computed(function() {
      var obj, ret, _i, _len, _ref;
      ret = {};
      if (_this.parent.datesArr()) {
        _ref = _this.parent.datesArr();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          ret[obj.date] = new landBestPriceBack({
            dateBack: obj.date
          }, _this);
        }
      }
      console.log(ret);
      return ret;
    });
    this.results = ko.computed(function() {
      var obj, ret, _i, _len, _ref;
      ret = [];
      if (_this.parent.datesArr()) {
        _ref = _this.parent.datesArr();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          if (_this._results[obj.date]) {
            ret.push({
              date: obj.date,
              landBP: _this._results[obj.date]
            });
          } else {
            ret.push({
              date: obj.date,
              landBP: _this._emptyResults()[obj.date]
            });
          }
        }
      }
      return ret;
    });
    this.selected = ko.observable(false);
    this.selBack = ko.observable(null);
    this.active = ko.observable(null);
    this.addBack(data);
  }

  landBestPrice.prototype.addBack = function(data) {
    var back;
    if (data.dateBack) {
      back = new landBestPriceBack(data, this);
      if (back.price < this.minPrice()) {
        this.minPrice(back.price);
        if (this.selBack()) {
          this.selBack().selected(false);
        }
        back.selected(true);
        this.selBack(back);
        this.active(back);
      }
      if (back.showPrice() > this.backMaxPrice()) {
        this.backMaxPrice(back.showPrice());
      }
      if (back.showPrice() < this.backMinPrice()) {
        this.backMinPrice(back.showPrice());
      }
      return this._results[data.dateBack] = back;
    }
  };

  landBestPrice.prototype.setActiveBack = function(date) {
    if (this.active()) {
      this.active().selected(false);
    }
    if (this._results[date]) {
      this.active(this._results[date]);
    } else {
      this.active(this._emptyResults()[date]);
    }
    return this.active().selected(true);
  };

  landBestPrice.prototype.selectThis = function() {
    this.parent.setActive(this.date.format('YYYY-MM-DD'));
    console.log('selectThis', this.date, this.date.format('YYYY-MM-DD'));
    setDepartureDate(this.date.format('YYYY-MM-DD'));
    if (this.active()) {
      setBackDate(this.active().backDate.format('YYYY-MM-DD'));
      return this.setActiveBack(this.active().backDate.format('YYYY-MM-DD'));
    }
  };

  return landBestPrice;

})();

landBestPriceSet = (function() {

  function landBestPriceSet(allData) {
    this.setDirectBestPrice = __bind(this.setDirectBestPrice, this);

    this.setDirectBackDate = __bind(this.setDirectBackDate, this);

    this.setActive = __bind(this.setActive, this);

    this.bestDateClick = __bind(this.bestDateClick, this);

    var cnt, data, dataKey, dataObj, dateKey, datesObj, empty, firstElem, key, landBP, mom, monthChanged, monthName, prevMonth, tmpMom, today, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3,
      _this = this;
    this._results = {};
    this.dates = {};
    this.datesArr = ko.observableArray([]);
    this.directBestPrice = ko.observable(null);
    this.directBestPriceData = ko.observable(null);
    this.minBestPrice = ko.observable(null);
    this.maxPrice = ko.observable(1);
    this.minPrice = ko.observable(9999999);
    this.active = ko.observable(null);
    for (key in allData) {
      data = allData[key];
      if (!this.dates[data.date]) {
        this.dates[data.date] = true;
      }
      if (data.dateBack) {
        if (!this.dates[data.dateBack]) {
          this.dates[data.dateBack] = true;
        }
      }
      if (this._results[data.date]) {
        this._results[data.date].addBack(data);
      } else {
        this._results[data.date] = new landBestPrice(data, this);
      }
      if (!this.minBestPrice() || this._results[data.date].minPrice() < this.minBestPrice().minPrice()) {
        this.minBestPrice(this._results[data.date]);
        console.log('set new minBestPrice', this.minBestPrice());
      }
    }
    _ref = this._results;
    for (key in _ref) {
      landBP = _ref[key];
      if (landBP.showPrice() > this.maxPrice()) {
        this.maxPrice(landBP.showPrice());
      }
      if (landBP.showPrice() < this.minPrice()) {
        this.minPrice(landBP.showPrice());
      }
    }
    console.log('DATES:', this.dates);
    cnt = 0;
    tmpMom = moment();
    while (cnt < 18) {
      cnt++;
      dateKey = tmpMom.format('YYYY-MM-DD');
      if (!this.dates[dateKey]) {
        this.dates[dateKey] = true;
      }
      tmpMom._d.setDate(tmpMom._d.getDate() + 1);
    }
    _ref1 = this.dates;
    for (dataKey in _ref1) {
      empty = _ref1[dataKey];
      if (this._results[dataKey]) {
        this.datesArr.push({
          date: dataKey,
          landBP: this._results[dataKey],
          monthName: '',
          monthChanged: false,
          dateText: '',
          today: false
        });
      } else {
        this.datesArr.push({
          date: dataKey,
          landBP: new landBestPrice({
            date: dataKey
          }, this),
          monthName: '',
          monthChanged: false,
          dateText: '',
          today: false
        });
      }
    }
    this.datesArr.sort(function(objDateLeft, objDateRight) {
      var l, r;
      l = moment(objDateLeft.date).unix();
      r = moment(objDateRight.date).unix();
      if (l < r) {
        return -1;
      } else if (r < l) {
        return 1;
      }
      return 0;
    });
    firstElem = true;
    today = moment().format("YYYY-MM-DD");
    _ref2 = this.datesArr();
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      dataObj = _ref2[_i];
      mom = moment(dataObj.date);
      if (firstElem) {
        monthChanged = false;
        prevMonth = mom.month();
        monthName = ACC_MONTHS[mom.month()];
      } else {
        if (mom.month() !== prevMonth) {
          monthName = ACC_MONTHS[mom.month()];
          monthChanged = true;
        } else {
          monthName = '';
          monthChanged = false;
        }
      }
      dataObj.monthName = monthName;
      dataObj.monthChanged = monthChanged;
      dataObj.dateText = SHORT_WEEKDAYS[(mom.day() + 6) % 7] + '<br><span>' + mom.format('DD') + '</span>';
      dataObj.today = dataObj.date === today;
      console.log('date', dataObj.date, today, dataObj.date === today);
      if (firstElem) {
        firstElem = false;
      }
      prevMonth = mom.month();
    }
    console.log('dates', this.datesArr());
    this.active(this.minBestPrice());
    if (this.active()) {
      this.active().selected(true);
    } else {
      _ref3 = this.datesArr();
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        datesObj = _ref3[_j];
        this.active(datesObj.landBP);
        this.active().selected(true);
        break;
      }
    }
    this.selectedPrice = ko.computed(function() {
      var price;
      if (_this.directBestPrice()) {
        price = _this.directBestPrice();
      } else {
        if (_this.active()) {
          if (_this.active().active()) {
            price = _this.active().active().price;
          } else {
            if (_this.active() && _this.active().showPrice) {
              price = _this.active().showPrice();
            } else {
              console.log('active not set', _this.active());
            }
          }
        }
      }
      if (!price) {
        price = '???';
      } else {
        price = Utils.formatPrice(price);
      }
      return price;
    });
    this.bestDate = ko.computed(function() {
      var dateFrom, strDate;
      if (_this.directBestPriceData()) {
        if (_this.directBestPriceData().date) {
          dateFrom = moment(_this.directBestPriceData().date);
          console.log('SETTING UP BACK DATE', _this.directBestPriceData());
          strDate = dateUtils.formatDayMonthYear(dateFrom._d);
          return strDate;
        }
      }
      return false;
    });
  }

  landBestPriceSet.prototype.bestDateClick = function() {
    if (this.directBestPriceData()) {
      if (!this.directBestPrice()) {
        this.directBestPrice(this.directBestPriceData().price);
      }
      if (this.directBestPriceData().date) {
        setDepartureDate(moment(this.directBestPriceData().date).format('YYYY-MM-DD'));
      }
      if (this.directBestPriceData().dateBack) {
        setBackDate(moment(this.directBestPriceData().dateBack).format('YYYY-MM-DD'));
      }
      if (this.active()) {
        console.log('yes have active', this.active());
        this.active().selected(false);
        if (this.active().active()) {
          return this.active().active().selected(false);
        } else {
          return console.log('not have active', this.active());
        }
      }
    }
  };

  landBestPriceSet.prototype.setActive = function(date) {
    var obj, _i, _len, _ref;
    this.active().selected(false);
    if (this._results[date]) {
      this.active(this._results[date]);
    } else {
      _ref = this.datesArr();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        if (obj.date === date) {
          this.active(obj.landBP);
        }
      }
    }
    console.log('@active()', this.active());
    this.active().selected(true);
    return this.directBestPrice(null);
  };

  landBestPriceSet.prototype.setDirectBackDate = function(date) {};

  landBestPriceSet.prototype.setDirectBestPrice = function(data) {
    console.log('DIRECCCCTTTTTT');
    this.directBestPrice(data.price);
    this.directBestPriceData(data);
    if (this.active()) {
      console.log('yes have active', this.active());
      this.active().selected(false);
      if (this.active().active()) {
        this.active().active().selected(false);
      }
    } else {
      console.log('not have active', this.active());
    }
    if (this.directBestPriceData()) {
      if (!this.directBestPrice()) {
        this.directBestPrice(this.directBestPriceData().price);
      }
      if (this.directBestPriceData().date) {
        setDepartureDate(moment(this.directBestPriceData().date).format('YYYY-MM-DD'));
      }
      if (this.directBestPriceData().dateBack) {
        setBackDate(moment(this.directBestPriceData().dateBack).format('YYYY-MM-DD'));
      }
      if (this.active()) {
        console.log('yes have active', this.active());
        this.active().selected(false);
        if (this.active().active()) {
          return this.active().active().selected(false);
        } else {
          return console.log('not have active', this.active());
        }
      }
    }
  };

  return landBestPriceSet;

})();

landingCitySelector = (function() {

  function landingCitySelector(allCaches) {
    this.bestDateClick = __bind(this.bestDateClick, this);

    this.selectCity = __bind(this.selectCity, this);

    var cacheInfo, cityId, cityInfo,
      _this = this;
    this.datesArr = ko.observableArray([]);
    this.currentCityCode = ko.observable('');
    this.citiesInfo = {};
    this.citiesInfoArr = [];
    this.landBestPriceSets = {};
    this.rt = ko.observable(true);
    console.log('BeforeRender ', allCaches);
    for (cityId in allCaches) {
      cacheInfo = allCaches[cityId];
      console.log('in loop ', cacheInfo);
      cityInfo = {
        'code': cacheInfo['cityCode'],
        'id': cacheInfo['cityId'],
        'name': cacheInfo['cityName'],
        'caseAcc': cacheInfo['cityAcc'],
        'bestPrice': cacheInfo['flightCacheBestPriceArr']
      };
      this.citiesInfo[cityInfo.code] = cityInfo;
      this.citiesInfoArr.push(cityInfo);
      this.landBestPriceSets[cityInfo.code] = new landBestPriceSet(cacheInfo['flightCache']);
    }
    this.active = ko.computed(function() {
      if (_this.currentCityCode()) {
        return _this.landBestPriceSets[_this.currentCityCode()].active();
      }
    });
    this.bestDate = ko.computed(function() {
      var val;
      if (_this.currentCityCode()) {
        val = _this.landBestPriceSets[_this.currentCityCode()].bestDate();
        console.log('valueeeee:', val, typeof val);
        return val;
      }
      return false;
    });
    this.selectedPrice = ko.computed(function() {
      if (_this.currentCityCode()) {
        return _this.landBestPriceSets[_this.currentCityCode()].selectedPrice();
      }
    });
    console.log('AFTER RENDER CitySelector', this.citiesInfo);
  }

  landingCitySelector.prototype.selectCity = function(cityCode) {
    console.log('select city');
    if (typeof cityCode !== 'string' && cityCode.code) {
      cityCode = cityCode.code;
    }
    this.currentCityCode(cityCode);
    console.log('best price info', this.citiesInfo[cityCode].bestPrice);
    this.landBestPriceSets[cityCode].setDirectBestPrice(this.citiesInfo[cityCode].bestPrice);
    $('input.second-path.departureCity').val('');
    $('input.input-path.departureCity').val('');
    console.log('Im rest this fields:', $('input.second-path.departureCity').val(''), $('input.input-path.departureCity').val(''));
    app.fakoPanel().departureCity(cityCode);
    app.fakoPanel().arrivalCity(window.pointCity);
    app.fakoPanel().rt(this.rt());
    return this.datesArr(this.landBestPriceSets[cityCode].datesArr());
  };

  landingCitySelector.prototype.bestDateClick = function() {
    if (this.currentCityCode()) {
      this.landBestPriceSets[this.currentCityCode()].bestDateClick();
      return app.fakoPanel().navigateToNewSearch();
    }
  };

  return landingCitySelector;

})();
