// Generated by CoffeeScript 1.4.0
/*
SEARCH controller, should be splitted once we will get more actions here
*/

var AviaController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

AviaController = (function() {

  function AviaController(searchParams) {
    this.searchParams = searchParams;
    this.checkTicketAction = __bind(this.checkTicketAction, this);

    this.indexAction = __bind(this.indexAction, this);

    this.handleResults = __bind(this.handleResults, this);

    this.search = __bind(this.search, this);

    this.searchAction = __bind(this.searchAction, this);

    this.api = new AviaAPI;
    this.routes = {
      '/search/:from/:to/:when/:adults/:children/:infants/:rtwhen/': this.searchAction,
      '/search/:from/:to/:when/:adults/:children/:infants/': this.searchAction,
      '': this.indexAction
    };
    this.results = ko.observable();
    _.extend(this, Backbone.Events);
  }

  AviaController.prototype.searchAction = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    window.voyanga_debug("AVIA: Invoking searchAction", args);
    this.searchParams.fromList(args);
    return this.search();
  };

  AviaController.prototype.search = function() {
    var _this = this;
    return this.api.search(this.searchParams.url(), function(data) {
      var stacked;
      try {
        stacked = _this.handleResults(data);
      } catch (err) {
        if (err === '404') {
          new ErrorPopup('avia404');
          return;
        }
        throw new Error("Unable to build AviaResultSet from search response");
      }
      _this.results(stacked);
      _this.render('results', {
        results: _this.results
      });
      return ko.processAllDeferredBindingUpdates();
    });
  };

  AviaController.prototype.handleResults = function(data) {
    var stacked;
    window.voyanga_debug("searchAction: handling results", data);
    stacked = new AviaResultSet(data.flights.flightVoyages, data.siblings);
    stacked.injectSearchParams(data.searchParams);
    stacked.postInit();
    stacked.checkTicket = this.checkTicketAction;
    return stacked;
  };

  AviaController.prototype.indexAction = function() {
    window.voyanga_debug("AVIA: invoking indexAction");
    return this.render("index", {});
  };

  AviaController.prototype.checkTicketAction = function(result, resultDeferred) {
    var diff, now,
      _this = this;
    now = moment();
    diff = now.diff(this.results().creationMoment, 'seconds');
    if (diff < AVIA_TICKET_TIMELIMIT) {
      resultDeferred.resolve(result);
      return;
    }
    return this.api.search(this.searchParams.url(), function(data) {
      var stacked;
      try {
        stacked = _this.handleResults(data);
      } catch (err) {
        throw new Error("Unable to build AviaResultSet from search response. Check ticket");
      }
      result = stacked.findAndSelect(result);
      if (result) {
        return resultDeferred.resolve(result);
      } else {
        new ErrorPopup('aviaNoTicketOnValidation', "Билет не найден, выберите другой.", false, function() {});
        return _this.results(stacked);
      }
    }, true, 'Идет проверка выбранных выриантов<br>Это может занять от 5 до 30 секунд');
  };

  AviaController.prototype.render = function(view, data) {
    return this.trigger("viewChanged", view, data);
  };

  return AviaController;

})();
