// Generated by CoffeeScript 1.4.0
var City, Event, EventCategory, EventCategorySet, EventLink, EventLinkSet, EventPhotoBox, EventPrice, EventPriceSet, EventSet, EventTag, EventTagSet, EventTour, EventTourResultSet, EventTourSet,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ko.bindingHandlers.highlightChange = {
  update: function(element, valueAccessor, allBindingsAccessor) {
    var allBindings, newEl, previousImage, value, valueUnwrapped, varLeftPos, varLeftPosStart, varTopPos, varTopPosStart;
    value = valueAccessor();
    allBindings = allBindingsAccessor();
    valueUnwrapped = ko.utils.unwrapObservable(value);
    previousImage = allBindings.previousImage;
    newEl = $('<div class="IMGmain"><img src=""></div>');
    newEl.appendTo(".centerTours");
    $(".IMGmain").eq(0).find('img').attr("src", previousImage());
    indexIMGresizeCenter(0);
    varLeftPos = $(".IMGmain").eq(1).css("left");
    varTopPos = $(".IMGmain").eq(1).css("top");
    varLeftPos = parseInt(varLeftPos.slice(0, -2));
    varTopPos = parseInt(varTopPos.slice(0, -2));
    varLeftPosStart = varLeftPos;
    varTopPosStart = varTopPos;
    $(".IMGmain").eq(1).css("opacity", "0").css("left", varLeftPosStart + "px").css("top", varTopPosStart + "px").find("img").attr("src", valueUnwrapped);
    previousImage(valueUnwrapped);
    slideToursSlide();
    ResizeAvia();
    return $(".IMGmain").eq(1).find("img").load(function() {
      indexIMGresizeCenter(1);
      $(".IMGmain").eq(0).animate({
        opacity: 0
      }, speedAnimateChangePic, function() {
        return $(".IMGmain:not(:last-child)").eq(0).remove();
      });
      return $(".IMGmain").eq(1).animate({
        opacity: 1
      }, speedAnimateChangePic);
    });
  }
};

Event = (function(_super) {

  __extends(Event, _super);

  function Event(data) {
    var _this = this;
    this.startDate = ko.observable(new Date(data.startDate));
    this.endDate = ko.observable(new Date(data.endDate));
    this.address = ko.observable(data.address);
    this.contact = ko.observable(data.contact);
    this.eventId = data.id;
    this.eventPageUrl = '/eventInfo/info/eventId/' + this.eventId;
    this.preview = ko.observable(data.preview);
    this.description = ko.observable(data.description);
    this.title = ko.observable(data.title);
    this.categories = ko.observableArray(new EventCategorySet(data.categories));
    this.links = ko.observableArray(new EventLinkSet(data.links));
    this.tags = ko.observableArray(new EventTagSet(data.tags));
    this.prices = ko.observableArray(new EventPriceSet(data.prices));
    this.tour = ko.observable(new EventTourSet(data.tours));
    this.image = ko.observable(data.image);
    this.thumb = ko.observable(data.thumb);
    this.active = ko.observable(data.active);
    this.minimalPrice = ko.computed(function() {
      return _this.prices()[0].price;
    });
  }

  Event.prototype.duration = function() {
    return dateUtils.formatDuration(this._duration);
  };

  return Event;

})(Backbone.Events);

EventSet = (function() {

  function EventSet(events) {
    this.afterRender = __bind(this.afterRender, this);

    this.mapsInit = __bind(this.mapsInit, this);

    this.closeEventsMaps = __bind(this.closeEventsMaps, this);

    this.closeEventsPhoto = __bind(this.closeEventsPhoto, this);

    this.setActive = __bind(this.setActive, this);

    var _this = this;
    this.events = ko.observableArray(events);
    this.currentTitle = ko.observable('HUY');
    this.currentEvent = ko.computed(function() {
      var activeEvents;
      activeEvents = _.filter(_this.events(), function(event) {
        return event.active();
      });
      console.log("SETTING TAITL", activeEvents[0].title());
      _this.currentTitle(activeEvents[0].title());
      return activeEvents[0];
    });
    this.previousImage = ko.observable('');
    this.activeMaps = 0;
    this.mapsInited = false;
    this.isRendered = false;
  }

  EventSet.prototype.setActive = function(valueAccessor, event) {
    var _this = this;
    if ($(event.target).hasClass('lookEyes')) {
      return true;
    }
    if (this.activeMaps === 1) {
      this.closeEventsMaps();
    }
    $('.slideTours').find('.triangle').animate({
      'top': '0px'
    }, 200);
    this.events(_.map(this.events(), function(event) {
      return event.active(false);
    }));
    valueAccessor.active(true);
    return $(event.target).closest('.toursTicketsMain').find('.triangle').animate({
      'top': '-16px'
    }, 200);
  };

  EventSet.prototype.closeEventsPhoto = function() {
    if ($(".mapsBigAll").is(':visible')) {
      return;
    }
    $(".slideTours").find(".active").find(".triangle").animate({
      top: "0px"
    }, 200);
    $(".toursTicketsMain").removeClass("active");
    $(".mapsBigAll").css("opacity", "0");
    $(".toursBigAll").animate({
      opacity: 0
    }, 700, function() {
      return $(this).css("display", "none");
    });
    $(".mapsBigAll").show();
    if (!this.mapsInited) {
      this.mapsInit();
    }
    $(".mapsBigAll").animate({
      opacity: 1
    }, 700);
    return this.activeMaps = 1;
  };

  EventSet.prototype.closeEventsMaps = function() {
    $(".toursBigAll").css("opacity", "0");
    $(".mapsBigAll").animate({
      opacity: 0
    }, 700, function() {
      return $(this).css("display", "none");
    });
    $(".toursBigAll").show();
    $(".toursBigAll").animate({
      opacity: 1
    }, 700);
    return this.activeMaps = 0;
  };

  EventSet.prototype.mapsInit = function() {
    var element, gMap, value;
    value = {
      lat: 52,
      lng: 10
    };
    this.mapsInited = true;
    element = $(".mapsBigAll")[0];
    return gMap = new google.maps.Map(element, {
      'mapTypeControl': false,
      'panControl': false,
      'zoomControlOptions': {
        position: google.maps.ControlPosition.LEFT_TOP,
        style: google.maps.ZoomControlStyle.SMALL
      },
      'streetViewControl': false,
      'zoom': 3,
      'mapTypeId': google.maps.MapTypeId.TERRAIN,
      'center': new google.maps.LatLng(value.lat, value.lng)
    });
  };

  EventSet.prototype.afterRender = function() {
    this.mapsInited = false;
    window.app.toggleGMaps(true);
    return this.isRendered = true;
  };

  return EventSet;

})();

EventCategory = (function() {

  function EventCategory(data) {
    this.id = ko.observable(data.id);
    this.title = ko.observable(data.title);
  }

  return EventCategory;

})();

EventCategorySet = (function() {

  function EventCategorySet(data) {
    var set;
    set = [];
    $.each(data, function(i, eventCategory) {
      return set.push(new EventCategory(eventCategory));
    });
    return set;
  }

  return EventCategorySet;

})();

EventLink = (function() {

  function EventLink(data) {
    this.title = ko.observable(data.title);
    this.url = ko.observable(data.url);
  }

  return EventLink;

})();

EventLinkSet = (function() {

  function EventLinkSet(data) {
    var set;
    set = [];
    $.each(data, function(i, eventLink) {
      return set.push(new EventLink(eventLink));
    });
    return set;
  }

  return EventLinkSet;

})();

EventTag = (function() {

  function EventTag(data) {
    this.name = ko.observable(data.name);
  }

  return EventTag;

})();

EventTagSet = (function() {

  function EventTagSet(data) {
    var set;
    set = [];
    $.each(data, function(i, eventTag) {
      return set.push(new EventTag(eventTag));
    });
    return set;
  }

  return EventTagSet;

})();

City = (function() {

  function City(data) {
    this.title = ko.observable(data.title);
  }

  return City;

})();

EventPrice = (function() {

  function EventPrice(data) {
    this.city = ko.observable(new City(data.city));
    this.price = ko.observable(data.price);
  }

  return EventPrice;

})();

EventPriceSet = (function() {

  function EventPriceSet(data) {
    var set;
    set = [];
    $.each(data, function(i, eventPrice) {
      return set.push(new EventPrice(eventPrice));
    });
    return set;
  }

  return EventPriceSet;

})();

EventTour = (function() {

  function EventTour(data) {
    this.name = data.name;
  }

  return EventTour;

})();

EventTourSet = (function() {

  function EventTourSet(data) {
    var set;
    set = [];
    $.each(data, function(i, tour) {
      return set.push(new EventTour(tour));
    });
    return set;
  }

  return EventTourSet;

})();

EventTourResultSet = (function() {

  function EventTourResultSet(resultSet, eventId) {
    var _this = this;
    this.eventId = eventId;
    this.hidePanel = __bind(this.hidePanel, this);

    this.showPanel = __bind(this.showPanel, this);

    this.togglePanel = __bind(this.togglePanel, this);

    this.gotoAndShowPanel = __bind(this.gotoAndShowPanel, this);

    this.reinit = __bind(this.reinit, this);

    this.items = ko.observableArray([]);
    this.selectedCity = ko.observable(resultSet.city.id);
    this.fullPrice = ko.observable(0);
    this.fullPriceUpdateTime = ko.observable(window.priceData[this.selectedCity()]["updateTime"]);
    this.fullPriceUpdateTimeText = ko.computed(function() {
      var upTime, updateText;
      upTime = moment(_this.fullPriceUpdateTime());
      console.log('upDate', upTime, upTime._d);
      updateText = dateUtils.formatDayMonth(upTime._d) + ', ' + dateUtils.formatTime(upTime._d);
      return updateText;
    });
    this.selectedCity.subscribe(function(newCityId) {
      _this.fullPriceUpdateTime(window.priceData[newCityId]["updateTime"]);
      return _this.reinit(window.toursArr[newCityId]);
    });
    this.startCity = ko.observable(resultSet.city.localRu);
    this.activePanel = ko.observable(null);
    this.overviewPeople = ko.observable(0);
    this.overviewPricePeople = ko.observable('');
    this.photoBox = new EventPhotoBox(window.eventPhotos);
    this.visiblePanel = ko.observable(false);
    this.visiblePanel.subscribe(function(newValue) {
      if (newValue) {
        return _this.showPanel();
      } else {
        return _this.hidePanel();
      }
    });
    this.showPanelText = ko.computed(function() {
      if (_this.visiblePanel()) {
        return "свернуть";
      } else {
        return "развернуть";
      }
    });
    this.reinit(resultSet);
  }

  EventTourResultSet.prototype.reinit = function(resultSet) {
    var firstHotel, i, item, panelSet, room, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;
    this.resultSet = resultSet;
    this.hasFlight = false;
    this.hasHotel = false;
    this.items([]);
    this.flightCounter = ko.observable(0);
    this.hotelCounter = ko.observable(0);
    this.selected_key = ko.observable('');
    this.selected_best = ko.observable('');
    this.correctTour = ko.observable(false);
    this.totalCost = 0;
    panelSet = new TourPanelSet();
    this.activePanel(panelSet);
    this.activePanel().startCity(this.resultSet.city.code);
    this.activePanel().selectedParams = {
      ticketParams: [],
      eventId: this.eventId
    };
    this.activePanel().sp.calendarActivated(false);
    window.app.fakoPanel(panelSet);
    this.startCity(this.resultSet.city.localRu);
    console.log('reinitEventData', this);
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
    try {
      _.each(this.resultSet.items, function(item) {
        var aviaResult;
        if (item.isFlight) {
          _this.hasFlight = true;
          _this.flightCounter(_this.flightCounter() + 1);
          _this.roundTrip = item.flights.length === 2;
          aviaResult = new AviaResult(item, _this);
          aviaResult.sort();
          aviaResult.priceHtml = ko.observable(aviaResult.price + '<span class="rur">o</span>');
          aviaResult.overviewText = ko.observable("Перелет " + aviaResult.departureCity() + ' &rarr; ' + aviaResult.arrivalCity());
          aviaResult.overviewTemplate = 'tours-event-avia-ticket';
          aviaResult.dateClass = ko.observable(_this.roundTrip ? 'blue-two' : 'blue-one');
          aviaResult.isAvia = ko.observable(item.isFlight);
          aviaResult.isHotel = ko.observable(item.isHotel);
          aviaResult.startDate = aviaResult.departureDate();
          aviaResult.dateHtml = ko.observable('<div class="day">' + dateUtils.formatHtmlDayShortMonth(aviaResult.departureDate()) + '</div>' + (_this.roundTrip ? '<div class="day">' + dateUtils.formatHtmlDayShortMonth(aviaResult.rtDepartureDate()) + '</div>' : ''));
          _this.activePanel().selectedParams.ticketParams.push(aviaResult.getParams());
          aviaResult.overviewPeople = ko.observable;
          _this.items.push(aviaResult);
          return _this.totalCost += aviaResult.price;
        } else if (item.isHotel) {
          _this.hasHotel = true;
          _this.hotelCounter(_this.hotelCounter() + 1);
          console.log("Hotel: ", item);
          _this.lastHotel = new HotelResult(item, _this, item.duration, item, item.hotelDetails);
          _this.lastHotel.priceHtml = ko.observable(_this.lastHotel.roomSets()[0].price + '<span class="rur">o</span>');
          _this.lastHotel.dateClass = ko.observable('orange-two');
          _this.lastHotel.overviewTemplate = 'tours-event-hotels-ticket';
          _this.lastHotel.isAvia = ko.observable(item.isFlight);
          _this.lastHotel.isHotel = ko.observable(item.isHotel);
          _this.lastHotel.startDate = _this.lastHotel.checkIn;
          _this.lastHotel.serachParams = item.searchParams;
          _this.lastHotel.overviewText = ko.observable("<span class='hotel-left-long'>Отель в " + _this.lastHotel.serachParams.cityFull.casePre + "</span><span class='hotel-left-short'>" + _this.lastHotel.address + "</span>");
          _this.lastHotel.dateHtml = ko.observable('<div class="day">' + dateUtils.formatHtmlDayShortMonth(_this.lastHotel.checkIn) + '</div>' + '<div class="day">' + dateUtils.formatHtmlDayShortMonth(_this.lastHotel.checkOut) + '</div>');
          _this.activePanel().selectedParams.ticketParams.push(_this.lastHotel.getParams());
          console.log("Add to items hotel ", _this.lastHotel);
          _this.items.push(_this.lastHotel);
          return _this.totalCost += _this.lastHotel.roomSets()[0].discountPrice;
        }
      });
      _.sortBy(this.items(), function(item) {
        return item.startDate;
      });
      this.startDate = this.items()[0].startDate;
      this.dateHtml = ko.observable('<div class="day">' + dateUtils.formatHtmlDayShortMonth(this.startDate) + '</div>');
      firstHotel = true;
      console.log('items', this.items());
      _ref = this.items();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.isHotel()) {
          if (!firstHotel) {
            this.activePanel().addPanel();
          } else {
            i = 0;
            _ref1 = item.serachParams.rooms;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              room = _ref1[_j];
              if (!this.activePanel().sp.rooms()[i]) {
                this.activePanel().sp.addSpRoom();
              }
              this.activePanel().sp.rooms()[i].adults(room.adultCount);
              this.activePanel().sp.rooms()[i].children(room.childCount);
              this.activePanel().sp.rooms()[i].ages(room.childAge);
              i++;
            }
            firstHotel = false;
          }
          this.activePanel().lastPanel.checkIn(moment(item.checkIn)._d);
          this.activePanel().lastPanel.checkOut(moment(item.checkOut)._d);
          this.activePanel().lastPanel.city(item.cityCode);
          console.log('try set destData', moment(item.checkIn)._d, moment(item.checkOut)._d, item.cityCode, 'to', this.activePanel().lastPanel, this.activePanel().lastPanel.checkIn());
        }
      }
      this.overviewPeople(Utils.wordAfterNum(this.activePanel().sp.overall(), 'человек', 'человека', 'человек'));
      this.overviewPricePeople('Цена за ' + (this.activePanel().sp.adults() ? Utils.wordAfterNum(this.activePanel().sp.adults(), 'взрослого', 'взрослых', 'взрослых') : '') + (this.activePanel().sp.children() ? ' ' + Utils.wordAfterNum(this.activePanel().sp.children(), 'ребенка', 'детей', 'детей') : ''));
      console.log('activePanel', this.activePanel());
      this.activePanel().saveStartParams();
      _.last(this.activePanel().panels()).minimizedCalendar(true);
      window.setTimeout(function() {
        console.log('calendar activated');
        return _this.activePanel().sp.calendarActivated(true);
      }, 1000);
      window.setTimeout(function() {
        if (_this.visiblePanel()) {
          console.log('need showPanel');
          return $('.sub-head.event').css('margin-top', '0px');
        } else {
          $('.sub-head.event').stop(true);
          $('.sub-head.event').css('margin-top', (-_this.activePanel().heightPanelSet() + 4) + 'px');
          return console.log('need hidePanel', $('.sub-head.event'), _this.activePanel().heightPanelSet(), $('.sub-head.event').css('margin-top'));
        }
      }, 200);
      this.correctTour(true);
    } catch (exept) {
      console.log("Cannot process tour");
      this.correctTour(false);
    }
    return this.fullPrice(this.totalCost);
  };

  EventTourResultSet.prototype.gotoAndShowPanel = function() {
    Utils.scrollTo('.panel');
    return this.visiblePanel(true);
  };

  EventTourResultSet.prototype.togglePanel = function() {
    return this.visiblePanel(!this.visiblePanel());
  };

  EventTourResultSet.prototype.showPanel = function() {
    console.log('showPanel');
    return $('.sub-head.event').animate({
      'margin-top': '0px'
    });
  };

  EventTourResultSet.prototype.hidePanel = function() {
    console.log('hidePanel', this.activePanel().heightPanelSet());
    return $('.sub-head.event').animate({
      'margin-top': (-this.activePanel().heightPanelSet() + 4) + 'px'
    });
  };

  return EventTourResultSet;

})();

EventPhotoBox = (function() {

  function EventPhotoBox(picturesRaw) {
    this.next = __bind(this.next, this);

    this.prev = __bind(this.prev, this);

    this.onResize = __bind(this.onResize, this);

    this.onComplete = __bind(this.onComplete, this);

    this.onAnimate = __bind(this.onAnimate, this);

    this.afterLoad = __bind(this.afterLoad, this);

    this.afterRender = __bind(this.afterRender, this);

    this.getIndex = __bind(this.getIndex, this);

    var photoObj, picture, pictures, _i, _len,
      _this = this;
    this.photos = ko.observableArray([]);
    this.imagesServer = ko.observable('');
    this.totalCount = 0;
    this.unloadedCount = 0;
    this.activeIndex = ko.observable(0);
    this.picturesPadding = ko.observable(5);
    this.animation = false;
    this.boxHeight = ko.observable(0);
    this.picturesLoaded = false;
    this.afterRendered = false;
    this.renderedPhotos = ko.computed(function() {
      var result;
      return result = [];
    });
    pictures = [];
    for (_i = 0, _len = picturesRaw.length; _i < _len; _i++) {
      photoObj = picturesRaw[_i];
      picture = new Image();
      this.unloadedCount++;
      $(picture).bind('load error', function(e) {
        var photo;
        console.log('image is loaded', e, _this);
        if (e.type === 'load') {
          _this.totalCount++;
          photo = {};
          photo.url = e.currentTarget.src;
          photo.height = e.currentTarget.height;
          photo.width = e.currentTarget.width;
          photo.width = Math.round(photo.width * (400 / photo.height));
          photo.height = 400;
          _this.boxHeight(400);
          _this.photos.push(photo);
        }
        _this.unloadedCount--;
        if (_this.unloadedCount <= 0) {
          _this.picturesLoaded = true;
          return _this.afterLoad();
        }
      });
      picture.src = this.imagesServer() + photoObj.url;
    }
  }

  EventPhotoBox.prototype.getIndex = function(ind) {
    var result;
    result = ind % this.totalCount;
    if (result < 0) {
      result = this.totalCount + result;
    }
    return result;
  };

  EventPhotoBox.prototype.afterRender = function() {
    this.afterRendered = true;
    return this.afterLoad();
  };

  EventPhotoBox.prototype.afterLoad = function() {
    var divInfo, dw, elem, i, tmpdw, _i, _j, _k, _l, _len, _ref;
    if (this.afterRendered && this.picturesLoaded) {
      this.renderedDivs = [];
      console.log('phts', this.photos(), this.boxHeight());
      for (i = _i = -2; _i <= 2; i = ++_i) {
        divInfo = {};
        console.log('cmpW', i, 'out', this.getIndex(i));
        divInfo.div = $('<div class="eventPhoto"><img src="' + this.photos()[this.getIndex(i)].url + '" height="400"/></div>');
        divInfo.prevInd = this.getIndex(i - 1);
        divInfo.nextInd = this.getIndex(i + 1);
        divInfo.thisInd = this.getIndex(i);
        this.renderedDivs.push(divInfo);
      }
      dw = Math.round(this.photos()[this.renderedDivs[2].thisInd].width / 2);
      tmpdw = dw + this.picturesPadding();
      this.renderedDivs[2].left = -dw;
      for (i = _j = 3; _j <= 4; i = ++_j) {
        this.renderedDivs[i].left = tmpdw;
        tmpdw += this.photos()[this.renderedDivs[i].thisInd].width + this.picturesPadding();
      }
      tmpdw = -dw;
      for (i = _k = 1; _k >= 0; i = --_k) {
        tmpdw -= this.photos()[this.renderedDivs[i].thisInd].width + this.picturesPadding();
        this.renderedDivs[i].left = tmpdw;
      }
      _ref = this.renderedDivs;
      for (_l = 0, _len = _ref.length; _l < _len; _l++) {
        elem = _ref[_l];
        elem.div.css('left', elem.left + 'px');
        $('#eventsContent .photoGallery .centerPosition').append(elem.div);
      }
      console.log('all loaded', this.renderedDivs);
      return $('.events .center-block').css('position', 'static');
    }
  };

  EventPhotoBox.prototype.onAnimate = function(pos, info) {
    var deltaLeft, elem, _i, _len, _ref, _results;
    deltaLeft = pos - info.start;
    _ref = this.renderedDivs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      _results.push(elem.div.css('left', (elem.left + deltaLeft) + 'px'));
    }
    return _results;
  };

  EventPhotoBox.prototype.onComplete = function() {
    var divInfo, elem, i, left, _i, _len, _ref;
    console.log('animation complete');
    _ref = this.renderedDivs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      elem.left = elem.left + this.delta;
    }
    if (this.delta < 0) {
      console.log('next');
      this.renderedDivs[0].div.remove();
      this.renderedDivs.shift();
      i = this.renderedDivs[3].nextInd;
      left = this.renderedDivs[3].left + this.photos()[this.renderedDivs[3].thisInd].width + this.picturesPadding();
    } else {
      console.log('prev');
      this.renderedDivs[4].div.remove();
      this.renderedDivs.pop();
      i = this.renderedDivs[0].prevInd;
      left = this.renderedDivs[0].left - this.photos()[i].width - this.picturesPadding();
    }
    divInfo = {};
    divInfo.div = $('<div class="eventPhoto"><img src="' + this.photos()[this.getIndex(i)].url + '" height="400"/></div>');
    divInfo.prevInd = this.getIndex(i - 1);
    divInfo.nextInd = this.getIndex(i + 1);
    divInfo.thisInd = this.getIndex(i);
    divInfo.left = left;
    divInfo.div.css('left', divInfo.left + 'px');
    if (this.delta < 0) {
      this.renderedDivs.push(divInfo);
      $('#eventsContent .photoGallery .centerPosition').append(divInfo.div);
    } else {
      this.renderedDivs.unshift(divInfo);
      $('#eventsContent .photoGallery .centerPosition').prepend(divInfo.div);
    }
    console.log('divs', this.renderedDivs);
    return this.animation = false;
  };

  EventPhotoBox.prototype.onResize = function() {
    return console.log('resize');
  };

  EventPhotoBox.prototype.prev = function() {
    var dw,
      _this = this;
    if (!this.animation) {
      this.animation = true;
      dw = -Math.round(this.photos()[this.renderedDivs[1].thisInd].width / 2);
      this.delta = dw - this.renderedDivs[1].left;
      console.log('delta', this.delta);
      return this.renderedDivs[1].div.animate({
        left: dw + 'px'
      }, {
        step: function(pos, info) {
          return _this.onAnimate(pos, info);
        },
        complete: function() {
          return _this.onComplete();
        }
      });
    }
  };

  EventPhotoBox.prototype.next = function() {
    var dw,
      _this = this;
    if (!this.animation) {
      this.animation = true;
      dw = -Math.round(this.photos()[this.renderedDivs[3].thisInd].width / 2);
      this.delta = dw - this.renderedDivs[3].left;
      console.log('delta', this.delta);
      return this.renderedDivs[3].div.animate({
        left: dw + 'px'
      }, {
        step: function(pos, info) {
          return _this.onAnimate(pos, info);
        },
        complete: function() {
          return _this.onComplete();
        }
      });
    }
  };

  return EventPhotoBox;

})();
