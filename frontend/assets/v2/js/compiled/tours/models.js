// Generated by CoffeeScript 1.3.3
var DestinationSearchParams, RoomsSearchParams, TourEntry, TourSearchParams, TourTripResultSet, ToursAviaResultSet, ToursHotelsResultSet, ToursOverviewVM, ToursResultSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourEntry = (function() {

  function TourEntry() {
    this.beforeRender = __bind(this.beforeRender, this);

    this.rt = __bind(this.rt, this);

    this.savings = __bind(this.savings, this);

    this.maxPriceHtml = __bind(this.maxPriceHtml, this);

    this.minPriceHtml = __bind(this.minPriceHtml, this);

    this.priceHtml = __bind(this.priceHtml, this);

    this.price = __bind(this.price, this);

    this.isHotel = __bind(this.isHotel, this);

    this.isAvia = __bind(this.isAvia, this);
    _.extend(this, Backbone.Events);
  }

  TourEntry.prototype.isAvia = function() {
    return this.avia;
  };

  TourEntry.prototype.isHotel = function() {
    return this.hotels;
  };

  TourEntry.prototype.price = function() {
    if (this.selection() === null) {
      return 0;
    }
    return this.selection().price;
  };

  TourEntry.prototype.priceHtml = function() {
    if (this.selection() === null) {
      return "Не выбрано";
    }
    return this.price() + '<span class="rur">o</span>';
  };

  TourEntry.prototype.minPriceHtml = function() {
    return this.minPrice() + '<span class="rur">o</span>';
  };

  TourEntry.prototype.maxPriceHtml = function() {
    return this.maxPrice() + '<span class="rur">o</span>';
  };

  TourEntry.prototype.savings = function() {
    if (this.selection() === null) {
      return 0;
    }
    return 555;
  };

  TourEntry.prototype.rt = function() {
    return false;
  };

  TourEntry.prototype.beforeRender = function() {};

  return TourEntry;

})();

ToursAviaResultSet = (function(_super) {

  __extends(ToursAviaResultSet, _super);

  function ToursAviaResultSet(raw, sp) {
    this.afterRender = __bind(this.afterRender, this);

    this.beforeRender = __bind(this.beforeRender, this);

    this.rt = __bind(this.rt, this);

    this.timelineEnd = __bind(this.timelineEnd, this);

    this.rt = __bind(this.rt, this);

    this.rtTimelineStart = __bind(this.rtTimelineStart, this);

    this.timelineStart = __bind(this.timelineStart, this);

    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.additionalText = __bind(this.additionalText, this);

    this.destinationText = __bind(this.destinationText, this);

    this.maxPrice = __bind(this.maxPrice, this);

    this.minPrice = __bind(this.minPrice, this);

    this.numAirlines = __bind(this.numAirlines, this);

    this.overviewPeople = __bind(this.overviewPeople, this);

    this.overviewText = __bind(this.overviewText, this);

    this.doNewSearch = __bind(this.doNewSearch, this);

    this.toBuyRequest = __bind(this.toBuyRequest, this);

    this.select = __bind(this.select, this);

    this.newResults = __bind(this.newResults, this);
    ToursAviaResultSet.__super__.constructor.apply(this, arguments);
    this.api = new AviaAPI;
    this.template = 'avia-results';
    this.overviewTemplate = 'tours-overview-avia-no-selection';
    this.panel = new AviaPanel();
    this.panel.handlePanelSubmit = this.doNewSearch;
    this.panel.sp.fromObject(sp);
    this.panel.original_template = this.panel.template;
    this.results = ko.observable();
    this.selection = ko.observable(null);
    this.newResults(raw, sp);
    this.data = {
      results: this.results
    };
  }

  ToursAviaResultSet.prototype.newResults = function(raw, sp) {
    var result,
      _this = this;
    this.rawSP = sp;
    result = new AviaResultSet(raw);
    result.injectSearchParams(sp);
    result.postInit();
    result.recommendTemplate = 'avia-tours-recommend';
    result.tours = true;
    result.select = function(res) {
      _this.select(res, result);
      return _this.trigger('next');
    };
    this.avia = true;
    return this.results(result);
  };

  ToursAviaResultSet.prototype.select = function(res) {
    if (res.ribbon) {
      res = res.data;
    }
    this.results().selected_key(res.key);
    res.parent.filtersConfig = res.parent.filters.getConfig();
    this.results().selected_best(res.best | false);
    this.overviewTemplate = 'tours-overview-avia-ticket';
    return this.selection(res);
  };

  ToursAviaResultSet.prototype.toBuyRequest = function() {
    var result;
    result = {};
    result.type = 'avia';
    result.searchId = this.selection().cacheId;
    result.searchKey = this.selection().flightKey();
    result.adults = this.rawSP.adt;
    result.children = this.rawSP.chd;
    result.infants = this.rawSP.inf;
    return result;
  };

  ToursAviaResultSet.prototype.doNewSearch = function() {
    var _this = this;
    return this.api.search(this.panel.sp.url(), function(data) {
      return _this.newResults(data.flights.flightVoyages, data.searchParams);
    });
  };

  ToursAviaResultSet.prototype.overviewText = function() {
    return "Перелет " + this.results().departureCity + ' &rarr; ' + this.results().arrivalCity;
  };

  ToursAviaResultSet.prototype.overviewPeople = function() {
    var sum;
    sum = this.panel.sp.adults() + this.panel.sp.children() + this.panel.sp.infants();
    return Utils.wordAfterNum(sum, 'человек', 'человека', 'человек');
  };

  ToursAviaResultSet.prototype.numAirlines = function() {
    return this.results().filters.airline.options().length;
  };

  ToursAviaResultSet.prototype.minPrice = function() {
    var cheapest;
    cheapest = _.reduce(this.results().data, function(el1, el2) {
      if (el1.price < el2.price) {
        return el1;
      } else {
        return el2;
      }
    }, this.results().data[0]);
    return cheapest.price;
  };

  ToursAviaResultSet.prototype.maxPrice = function() {
    var mostExpensive;
    mostExpensive = _.reduce(this.results().data, function(el1, el2) {
      if (el1.price > el2.price) {
        return el1;
      } else {
        return el2;
      }
    }, this.results().data[0]);
    return mostExpensive.price;
  };

  ToursAviaResultSet.prototype.destinationText = function() {
    return "<span class='left-avia-city'>" + this.results().departureCity + "&rarr;</span> " + "<span class='left-avia-city'>" + this.results().arrivalCity + "</span>";
  };

  ToursAviaResultSet.prototype.additionalText = function() {
    if (this.selection() === null) {
      return "";
    }
    if (this.rt()) {
      return "";
    } else {
      return ", " + this.selection().departureTime() + ' - ' + this.selection().arrivalTime();
    }
  };

  ToursAviaResultSet.prototype.dateClass = function() {
    if (this.rt()) {
      return 'blue-two';
    } else {
      return 'blue-one';
    }
  };

  ToursAviaResultSet.prototype.dateHtml = function(startonly) {
    var result, source;
    if (startonly == null) {
      startonly = false;
    }
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    result = '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(source.departureDate());
    result += '</div>';
    if (startonly) {
      return result;
    }
    if (this.rt()) {
      result += '<div class="day">';
      result += dateUtils.formatHtmlDayShortMonth(source.rtDepartureDate());
      result += '</div>';
    }
    return result;
  };

  ToursAviaResultSet.prototype.timelineStart = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.departureDate();
  };

  ToursAviaResultSet.prototype.rtTimelineStart = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.rtDepartureDate();
  };

  ToursAviaResultSet.prototype.rt = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.roundTrip;
  };

  ToursAviaResultSet.prototype.timelineEnd = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.arrivalDate();
  };

  ToursAviaResultSet.prototype.rt = function() {
    return this.results().roundTrip;
  };

  ToursAviaResultSet.prototype.beforeRender = function() {
    if (this.results().selectedKey) {
      return this.results().filters.getConfig(this.results().filtersConfig);
    }
  };

  ToursAviaResultSet.prototype.afterRender = function() {
    var _this = this;
    if (this.results()) {
      console.log('avia after rend');
      if (this.results().selected_key) {
        console.log('Yes, have selected');
        return window.setTimeout(function() {
          if ($('.ticket-content .btn-cost.selected').parent().parent().parent().parent().length) {
            return Utils.scrollTo($('.ticket-content .btn-cost.selected').parent().parent().parent().parent());
          }
        }, 50);
      }
    }
  };

  return ToursAviaResultSet;

})(TourEntry);

ToursHotelsResultSet = (function(_super) {

  __extends(ToursHotelsResultSet, _super);

  function ToursHotelsResultSet(raw, sp) {
    this.afterRender = __bind(this.afterRender, this);

    this.beforeRender = __bind(this.beforeRender, this);

    this.timelineEnd = __bind(this.timelineEnd, this);

    this.timelineStart = __bind(this.timelineStart, this);

    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.additionalText = __bind(this.additionalText, this);

    this.price = __bind(this.price, this);

    this.destinationText = __bind(this.destinationText, this);

    this.maxPrice = __bind(this.maxPrice, this);

    this.minPrice = __bind(this.minPrice, this);

    this.numHotels = __bind(this.numHotels, this);

    this.overviewPeople = __bind(this.overviewPeople, this);

    this.overviewText = __bind(this.overviewText, this);

    this.doNewSearch = __bind(this.doNewSearch, this);

    this.toBuyRequest = __bind(this.toBuyRequest, this);

    this.select = __bind(this.select, this);

    this.newResults = __bind(this.newResults, this);
    ToursHotelsResultSet.__super__.constructor.apply(this, arguments);
    this.api = new HotelsAPI;
    this.panel = new HotelsPanel();
    this.panel.handlePanelSubmit = this.doNewSearch;
    this.panel.sp.fromObject(sp);
    this.panel.original_template = this.panel.template;
    this.overviewTemplate = 'tours-overview-hotels-no-selection';
    this.template = 'hotels-results';
    this.activeHotel = ko.observable(0);
    this.selection = ko.observable(null);
    this.results = ko.observable();
    this.data = {
      results: this.results
    };
    this.newResults(raw, sp);
  }

  ToursHotelsResultSet.prototype.newResults = function(data, sp) {
    var result,
      _this = this;
    this.rawSP = sp;
    result = new HotelsResultSet(data, sp, this.activeHotel);
    result.tours(true);
    result.postInit();
    result.select = function(hotel) {
      hotel.parent = result;
      hotel.oldPageTop = $("html").scrollTop() | $("body").scrollTop();
      hotel.off('back');
      hotel.on('back', function() {
        return _this.trigger('setActive', _this, false, false, hotel.oldPageTop, function() {
          if (!hotel.parent.showFullMap()) {
            return Utils.scrollTo('#hotelResult' + hotel.hotelId);
          } else {
            return hotel.parent.showFullMapFunc(null, null, true);
          }
        });
      });
      hotel.off('select');
      hotel.on('select', function(roomData) {
        _this.select(roomData);
        return _this.trigger('next');
      });
      return _this.trigger('setActive', {
        'data': hotel,
        template: 'hotels-info-template',
        'parent': _this
      });
    };
    result.selectFromPopup = function(hotel) {
      hotel.parent = result;
      hotel.activePopup.close();
      hotel.oldPageTop = $("html").scrollTop() | $("body").scrollTop();
      hotel.off('back');
      hotel.on('back', function() {
        return _this.trigger('setActive', _this, false, false, hotel.oldPageTop, function() {
          if (!hotel.parent.showFullMap()) {
            return Utils.scrollTo('#hotelResult' + hotel.hotelId);
          }
        });
      });
      hotel.off('select');
      hotel.on('select', function(roomData) {
        _this.select(roomData);
        return _this.trigger('next');
      });
      return _this.trigger('setActive', {
        'data': hotel,
        template: 'hotels-info-template',
        'parent': _this
      });
    };
    this.hotels = true;
    this.selection(null);
    return this.results(result);
  };

  ToursHotelsResultSet.prototype.select = function(roomData) {
    var hotel;
    hotel = roomData.hotel;
    hotel.parent = this.results();
    this.activeHotel(hotel.hotelId);
    this.overviewTemplate = 'tours-overview-hotels-ticket';
    this.selection(roomData);
    hotel.parent.filtersConfig = hotel.parent.filters.getConfig();
    return hotel.parent.pagesLoad = hotel.parent.showParts();
  };

  ToursHotelsResultSet.prototype.toBuyRequest = function() {
    var result, room, _i, _len, _ref;
    result = {};
    result.type = 'hotel';
    result.searchId = this.selection().hotel.cacheId;
    result.searchKey = this.selection().roomSet.resultId;
    result.adults = 0;
    result.age = false;
    result.cots = 0;
    _ref = this.rawSP.rooms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      result.adults += room.adultCount * 1;
      if (room.childAge) {
        result.age = room.childAgeage;
      }
      result.cots += room.cots * 1;
    }
    return result;
  };

  ToursHotelsResultSet.prototype.doNewSearch = function() {
    var _this = this;
    return this.api.search(this.panel.sp.url(), function(data) {
      data.searchParams.cacheId = data.cacheId;
      return _this.newResults(data, data.searchParams);
    });
  };

  ToursHotelsResultSet.prototype.overviewText = function() {
    return this.destinationText();
  };

  ToursHotelsResultSet.prototype.overviewPeople = function() {
    var sum;
    sum = this.panel.sp.overall();
    return Utils.wordAfterNum(sum, 'человек', 'человека', 'человек') + ', ' + this.results().wordDays;
  };

  ToursHotelsResultSet.prototype.numHotels = function() {
    return this.results().data().length;
  };

  ToursHotelsResultSet.prototype.minPrice = function() {
    return this.results().minPrice;
  };

  ToursHotelsResultSet.prototype.maxPrice = function() {
    return this.results().maxPrice;
  };

  ToursHotelsResultSet.prototype.destinationText = function() {
    return "<span class='hotel-left-long'>Отель в " + this.rawSP.cityFull.casePre + "</span><span class='hotel-left-short'>" + this.rawSP.cityFull.caseNom + "</span>";
  };

  ToursHotelsResultSet.prototype.price = function() {
    if (this.selection() === null) {
      return 0;
    }
    return this.selection().roomSet.price;
  };

  ToursHotelsResultSet.prototype.additionalText = function() {
    if (this.selection() === null) {
      return "";
    }
    return ", " + this.selection().hotel.hotelName;
  };

  ToursHotelsResultSet.prototype.dateClass = function() {
    return 'orange-two';
  };

  ToursHotelsResultSet.prototype.dateHtml = function(startOnly) {
    var result;
    if (startOnly == null) {
      startOnly = false;
    }
    result = '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(this.results().checkIn);
    result += '</div>';
    if (startOnly) {
      return result;
    }
    result += '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(this.results().checkOut);
    return result += '</div>';
  };

  ToursHotelsResultSet.prototype.timelineStart = function() {
    return this.results().checkIn;
  };

  ToursHotelsResultSet.prototype.timelineEnd = function() {
    return this.results().checkOut;
  };

  ToursHotelsResultSet.prototype.beforeRender = function() {
    console.log('beforeRender hotels');
    if (this.results()) {
      this.results().toursOpened = true;
      if (this.activeHotel()) {
        this.results().filters.setConfig(this.results().filtersConfig);
        return this.results().showParts(this.results().pagesLoad);
      } else {
        return this.results().postFilters();
      }
    }
  };

  ToursHotelsResultSet.prototype.afterRender = function() {
    var _this = this;
    if (this.results()) {
      if (this.activeHotel()) {
        return window.setTimeout(function() {
          if ($('.hotels-tickets .btn-cost.selected').parent().parent().parent().parent().length) {
            return Utils.scrollTo($('.hotels-tickets .btn-cost.selected').parent().parent().parent().parent());
          }
        }, 50);
      }
    }
  };

  return ToursHotelsResultSet;

})(TourEntry);

ToursResultSet = (function() {

  function ToursResultSet(raw, searchParams) {
    var result, variant, _i, _len, _ref,
      _this = this;
    this.searchParams = searchParams;
    this.buy = __bind(this.buy, this);

    this.showOverview = __bind(this.showOverview, this);

    this.removeItem = __bind(this.removeItem, this);

    this.nextEntry = __bind(this.nextEntry, this);

    this.setActiveTimelineHotels = __bind(this.setActiveTimelineHotels, this);

    this.setActiveTimelineAvia = __bind(this.setActiveTimelineAvia, this);

    this.setActive = __bind(this.setActive, this);

    _.extend(this, Backbone.Events);
    this.data = ko.observableArray();
    _ref = raw.allVariants;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      variant = _ref[_i];
      if (!variant) {
        continue;
      }
      if (variant.flights) {
        result = new ToursAviaResultSet(variant.flights.flightVoyages, variant.searchParams);
      } else {
        variant.searchParams.cacheId = variant.cacheId;
        result = new ToursHotelsResultSet(variant, variant.searchParams);
      }
      this.data.push(result);
      result.on('setActive', function(entry, beforeRender, afterRender, scrollTo, callback) {
        if (beforeRender == null) {
          beforeRender = true;
        }
        if (afterRender == null) {
          afterRender = true;
        }
        if (scrollTo == null) {
          scrollTo = 0;
        }
        if (callback == null) {
          callback = null;
        }
        return _this.setActive(entry, beforeRender, afterRender, scrollTo, callback);
      });
      result.on('next', function(entry) {
        return _this.nextEntry();
      });
    }
    this.timeline = new Timeline(this.data);
    this.selection = ko.observable(this.data()[0]);
    this.panel = ko.computed({
      read: function() {
        if (_this.selection().panel) {
          _this.panelContainer = _this.selection().panel;
        }
        _this.panelContainer.timeline = _this.timeline;
        _this.panelContainer.setActiveTimelineAvia = _this.setActiveTimelineAvia;
        _this.panelContainer.setActiveTimelineHotels = _this.setActiveTimelineHotels;
        if (!_this.panelContainer.onlyTimeline) {
          _this.panelContainer.onlyTimeline = false;
        } else {
          _this.panelContainer.timeline.termsActive = false;
        }
        _this.panelContainer.selection = _this.selection;
        _this.panelContainer.template = 'tours-panel-template';
        return _this.panelContainer;
      }
    });
    this.price = ko.computed(function() {
      var item, sum, _j, _len1, _ref1;
      sum = 0;
      _ref1 = _this.data();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        sum += item.price();
      }
      return sum;
    });
    this.savings = ko.computed(function() {
      var item, sum, _j, _len1, _ref1;
      sum = 0;
      _ref1 = _this.data();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        sum += item.savings();
      }
      return sum;
    });
    this.someSegmentsSelected = ko.computed(function() {
      var x, _j, _len1, _ref1;
      _ref1 = _this.data();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        x = _ref1[_j];
        if (x.selection()) {
          return true;
        }
      }
      return false;
    });
    this.someSegmentsSelected.subscribe(function(newValue) {
      if (newValue) {
        return $('#tour-buy-btn').show('fast');
      } else {
        return $('#tour-buy-btn').hide('fast');
      }
    });
    this.vm = new ToursOverviewVM(this);
    this.voyashki = [];
    this.voyashki.push(new VoyashaCheapest(this));
    this.voyashki.push(new VoyashaOptima(this));
    this.voyashki.push(new VoyashaRich(this));
  }

  ToursResultSet.prototype.setActive = function(entry, beforeRender, afterRender, scrollTo, callback) {
    var _this = this;
    if (beforeRender == null) {
      beforeRender = true;
    }
    if (afterRender == null) {
      afterRender = true;
    }
    if (scrollTo == null) {
      scrollTo = 0;
    }
    if (callback == null) {
      callback = null;
    }
    $('#loadWrapBgMin').show();
    if (entry.overview) {
      $('.btn-timeline-and-condition').hide();
      window.toursOverviewActive = true;
    } else {
      window.toursOverviewActive = false;
    }
    console.log('br', beforeRender, afterRender);
    if (entry.beforeRender && beforeRender) {
      console.log('brin');
      entry.beforeRender();
    }
    this.trigger('inner-template', entry.template);
    return window.setTimeout(function() {
      if (entry.afterRender && afterRender) {
        console.log('arin');
        entry.afterRender();
      }
      _this.selection(entry);
      ko.processAllDeferredBindingUpdates();
      ResizeAvia();
      $('#loadWrapBgMin').hide();
      if (!(scrollTo === false)) {
        Utils.scrollTo(scrollTo, false);
      }
      if (callback) {
        return callback();
      }
    }, 100);
  };

  ToursResultSet.prototype.setActiveTimelineAvia = function(entry) {
    return this.setActive(entry.avia.item);
  };

  ToursResultSet.prototype.setActiveTimelineHotels = function(entry) {
    return this.setActive(entry.hotel.item);
  };

  ToursResultSet.prototype.nextEntry = function() {
    var x, _i, _len, _ref;
    _ref = this.data();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if (!x.selection()) {
        this.setActive(x);
        return;
      }
    }
    return this.showOverview();
  };

  ToursResultSet.prototype.removeItem = function(item, event) {
    var idx;
    event.stopPropagation();
    if (this.data().length < 2) {
      return;
    }
    idx = this.data.indexOf(item);
    if (idx === -1) {
      return;
    }
    this.data.splice(idx, 1);
    if (item === this.selection()) {
      return this.setActive(this.data()[0]);
    }
  };

  ToursResultSet.prototype.showOverview = function() {
    var dummyPanel,
      _this = this;
    dummyPanel = {
      onlyTimeline: true,
      calendarHidden: function() {
        return true;
      },
      calendarValue: ko.observable({
        values: []
      })
    };
    this.setActive({
      template: 'tours-overview',
      data: this,
      overview: true,
      panel: dummyPanel
    });
    ResizeAvia();
    return window.setTimeout(function() {
      var aviaRes, calendarEvents, checkIn, checkOut, dest, flight, flights, hotelEvent, resSet, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      console.log('after render tours all tour page');
      console.log(_this.data());
      calendarEvents = [];
      _ref = _this.data();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resSet = _ref[_i];
        if (resSet.isAvia()) {
          console.log('avia', resSet.data.results(), resSet.rawSP);
          flights = [];
          _ref1 = resSet.rawSP.destinations;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            dest = _ref1[_j];
            flight = {
              type: 'flight',
              description: dest.departure + ' || ' + dest.arrival,
              cityFrom: dest.departure_iata,
              cityTo: dest.arrival_iata
            };
            flight.dayStart = moment(dest.date)._d;
            flight.dayEnd = moment(dest.date)._d;
            flights.push(flight);
          }
          if (resSet.selection()) {
            console.log('select:', resSet.selection());
            aviaRes = resSet.selection();
            flights[0].dayEnd = aviaRes.arrivalDate();
            if (aviaRes.roundTrip) {
              flights[1].dayEnd = aviaRes.rtArrivalDate();
            }
            console.log('city:', aviaRes.arrivalCity(), 'date:', aviaRes.arrivalDate());
          }
          for (_k = 0, _len2 = flights.length; _k < _len2; _k++) {
            flight = flights[_k];
            calendarEvents.push(flight);
          }
        }
        if (resSet.isHotel()) {
          console.log('hotel', resSet.data.results(), resSet.rawSP);
          checkIn = moment(resSet.rawSP.checkIn).add('h', 8);
          checkOut = moment(resSet.rawSP.checkIn).add('d', resSet.rawSP.duration);
          hotelEvent = {
            dayStart: checkIn._d,
            dayEnd: checkOut._d,
            type: 'hotel',
            description: '',
            city: resSet.rawSP.city
          };
          if (resSet.selection()) {
            console.log('select:', resSet.selection());
            hotelEvent.description = resSet.selection().hotel.hotelName;
          }
          calendarEvents.push(hotelEvent);
        }
      }
      calendarEvents.sort(function(left, right) {
        if (left.dayStart > right.dayStart) {
          return 1;
        }
        if (left.dayStart < right.dayStart) {
          return -1;
        }
        return 0;
      });
      console.log(calendarEvents);
      /*VoyangaCalendarTimeline.calendarEvents = [
        {dayStart: Date.fromIso('2012-10-23'),dayEnd: Date.fromIso('2012-10-23'),type:'flight',color:'red',description:'Москва || Санкт-Петербург',cityFrom:'MOW',cityTo:'LED'},
        {dayStart: Date.fromIso('2012-10-23'),dayEnd: Date.fromIso('2012-10-28'),type:'hotel',color:'red',description:'Californication Hotel2',city:'LED'},
        {dayStart: Date.fromIso('2012-10-28'),dayEnd: Date.fromIso('2012-10-28'),type:'flight',color:'red',description:'Санкт-Петербург || Москва',cityFrom:'LED',cityTo:'MOW'},
        {dayStart: Date.fromIso('2012-10-28'),dayEnd: Date.fromIso('2012-10-28'),type:'flight',color:'red',description:'Москва || Санкт-Петербург',cityFrom:'MOW',cityTo:'LED'},
        {dayStart: Date.fromIso('2012-11-21'),dayEnd: Date.fromIso('2012-11-22'),type:'flight',color:'red',description:'Санкт-Петербург || Москва',cityFrom:'LED',cityTo:'MOW'},
        {dayStart: Date.fromIso('2012-11-21'),dayEnd: Date.fromIso('2012-11-28'),type:'hotel',color:'red',description:'Californication Hotel',city:'MOW'},
        {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Москва || Санкт-Петербург',cityFrom:'MOW',cityTo:'LED'},
        {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Санкт-Петербург || Амстердам',cityFrom:'LED',cityTo:'AMS'},
        {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Амстердам || Санкт-Петербург',cityFrom:'AMS',cityTo:'LED'},
        {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Санкт-Петербург || Москва',cityFrom:'LED',cityTo:'MOW'},
      ]
      */

      VoyangaCalendarTimeline.calendarEvents = calendarEvents;
      VoyangaCalendarTimeline.jObj = '#voyanga-calendar-timeline';
      return VoyangaCalendarTimeline.init();
    }, 1000);
  };

  ToursResultSet.prototype.buy = function() {
    var toBuy, x, _i, _len, _ref;
    toBuy = [];
    _ref = this.data();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if (x.selection()) {
        toBuy.push({
          module: 'Tours'
        });
        toBuy.push(x.toBuyRequest());
      }
    }
    return Utils.toBuySubmit(toBuy);
  };

  return ToursResultSet;

})();

DestinationSearchParams = (function() {

  function DestinationSearchParams() {
    this.city = ko.observable('');
    this.dateFrom = ko.observable('');
    this.dateTo = ko.observable('');
  }

  return DestinationSearchParams;

})();

RoomsSearchParams = (function() {

  function RoomsSearchParams() {
    this.adt = ko.observable(2);
    this.chd = ko.observable(0);
    this.chdAge = ko.observable(false);
    this.cots = ko.observable(false);
  }

  return RoomsSearchParams;

})();

TourSearchParams = (function(_super) {

  __extends(TourSearchParams, _super);

  function TourSearchParams() {
    this.removeItem = __bind(this.removeItem, this);

    var _this = this;
    TourSearchParams.__super__.constructor.call(this);
    this.startCity = ko.observable('LED');
    this.destinations = ko.observableArray([]);
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
    this.returnBack = ko.observable(1);
  }

  TourSearchParams.prototype.url = function() {
    var params, result,
      _this = this;
    result = 'tour/search?';
    params = [];
    params.push('start=' + this.startCity());
    _.each(this.destinations(), function(destination, ind) {
      params.push('destinations[' + ind + '][city]=' + destination.city());
      params.push('destinations[' + ind + '][dateFrom]=' + moment(destination.dateFrom()).format('D.M.YYYY'));
      return params.push('destinations[' + ind + '][dateTo]=' + moment(destination.dateTo()).format('D.M.YYYY'));
    });
    _.each(this.rooms(), function(room, ind) {
      return params.push(room.getUrl(ind));
    });
    result += params.join("&");
    window.voyanga_debug("Generated search url for tours", result);
    return result;
  };

  TourSearchParams.prototype.key = function() {
    var key;
    key = this.startCity();
    _.each(this.destinations(), function(destination) {
      return key += destination.city() + destination.dateFrom() + destination.dateTo();
    });
    _.each(this.rooms(), function(room) {
      return key += room.getHash();
    });
    return key;
  };

  TourSearchParams.prototype.getHash = function() {
    var hash, parts;
    parts = [this.startCity(), this.returnBack()];
    _.each(this.destinations(), function(destination) {
      parts.push(destination.city());
      parts.push(moment(destination.dateFrom()).format('D.M.YYYY'));
      return parts.push(moment(destination.dateTo()).format('D.M.YYYY'));
    });
    parts.push('rooms');
    _.each(this.rooms(), function(room) {
      return parts.push(room.getHash());
    });
    hash = 'tours/search/' + parts.join('/') + '/';
    window.voyanga_debug("Generated hash for tour search", hash);
    return hash;
  };

  TourSearchParams.prototype.fromList = function(data) {
    var destination, doingrooms, i, room, _i, _ref;
    window.voyanga_debug("Restoring TourSearchParams from list");
    this.startCity(data[0]);
    this.returnBack(data[1]);
    doingrooms = false;
    this.destinations([]);
    this.rooms([]);
    for (i = _i = 2, _ref = data.length; _i <= _ref; i = _i += 3) {
      if (data[i] === 'rooms') {
        break;
      }
      destination = new DestinationSearchParams();
      destination.city(data[i]);
      destination.dateFrom(moment(data[i + 1], 'D.M.YYYY').toDate());
      destination.dateTo(moment(data[i + 2], 'D.M.YYYY').toDate());
      this.destinations.push(destination);
    }
    i = i + 1;
    while (i < data.length) {
      room = new SpRoom(this);
      room.fromList(data[i]);
      this.rooms.push(room);
      i++;
    }
    return window.voyanga_debug('Result', this);
  };

  TourSearchParams.prototype.fromObject = function(data) {
    window.voyanga_debug("Restoring TourSearchParams from object");
    _.each(data.destinations, function(destination) {
      destination = new DestinationSearchParams();
      destination.city(destination.city);
      destination.dateFrom(moment(destination.dateFrom, 'D.M.YYYY').toDate());
      destination.dateTo(moment(destination.dateTo, 'D.M.YYYY').toDate());
      return this.destinations.push(destination);
    });
    _.each(data.rooms, function(room) {
      room = new SpRoom(this);
      return this.rooms.push(this.room.fromObject(room));
    });
    return window.voyanga_debug('Result', this);
  };

  TourSearchParams.prototype.removeItem = function(item, event) {
    var idx;
    event.stopPropagation();
    if (this.data().length < 2) {
      return;
    }
    idx = this.data.indexOf(item);
    if (idx === -1) {
      return;
    }
    this.data.splice(idx, 1);
    if (item === this.selection()) {
      return this.setActive(this.data()[0]);
    }
  };

  return TourSearchParams;

})(SearchParams);

ToursOverviewVM = (function() {

  function ToursOverviewVM(resultSet) {
    this.resultSet = resultSet;
    this.afterRender = __bind(this.afterRender, this);

    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.startCity = __bind(this.startCity, this);

  }

  ToursOverviewVM.prototype.startCity = function() {
    var firstResult;
    firstResult = this.resultSet.data()[0];
    if (firstResult.isAvia()) {
      return firstResult.results().departureCity;
    } else {
      return firstResult.results().city.caseNom;
    }
  };

  ToursOverviewVM.prototype.dateClass = function() {
    return 'blue-one';
  };

  ToursOverviewVM.prototype.dateHtml = function() {
    var firstResult;
    firstResult = this.resultSet.data()[0];
    return firstResult.dateHtml(true);
  };

  ToursOverviewVM.prototype.afterRender = function() {};

  return ToursOverviewVM;

})();

TourTripResultSet = (function() {

  function TourTripResultSet(resultSet) {
    var _this = this;
    this.resultSet = resultSet;
    this.items = [];
    this.hasFlight = false;
    this.hasHotel = false;
    this.flightCounter = ko.observable(0);
    this.hotelCounter = ko.observable(0);
    this.selected_key = ko.observable('');
    this.selected_best = ko.observable('');
    this.totalCost = 0;
    this.flightCounterWord = ko.computed(function() {
      var res;
      res = Utils.wordAfterNum(_this.flightCounter(), 'авивабилет', 'авиабилета', 'авиабилетов');
      if (_this.hotelCounter() > 0) {
        res = res + ', ';
      }
      return res;
    });
    this.hotelCounterWord = ko.computed(function() {
      return Utils.wordAfterNum(_this.hotelCounter(), 'гостиница', 'гостиницы', 'гостиниц');
    });
    _.each(this.resultSet.items, function(item) {
      var aviaResult;
      if (item.isFlight) {
        _this.hasFlight = true;
        _this.flightCounter(_this.flightCounter() + 1);
        _this.roundTrip = item.flights.length === 2;
        aviaResult = new AviaResult(item, _this);
        aviaResult.sort();
        _this.items.push(aviaResult);
        return _this.totalCost += aviaResult.price;
      } else if (item.isHotel) {
        _this.hasHotel = true;
        _this.hotelCounter(_this.hotelCounter() + 1);
        console.log("Hotel: ", item);
        _this.lastHotel = new HotelResult(item, _this, item.duration, item, item.hotelDetails);
        _this.items.push(_this.lastHotel);
        return _this.totalCost += _this.lastHotel.roomSets()[0].discountPrice;
      }
    });
  }

  return TourTripResultSet;

})();
