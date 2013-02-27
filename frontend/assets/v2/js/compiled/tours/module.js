// Generated by CoffeeScript 1.4.0
/*
Tours module
Controller + panel
*/

var ToursModule;

ToursModule = (function() {

  function ToursModule() {
    var _this = this;
    this.panel = ko.observable(null);
    this.p = new TourPanelSet();
    this.innerTemplate = '';
    this.controller = new ToursController(this.p.sp);
    this.controller.on('results', function(results) {
      return _this.panel(results.panel);
    });
    this.controller.on('index', function(results) {
      return _this.panel(_this.p);
    });
    this.controller.on('inner-template', function(data) {
      return _this.innerTemplate = data;
    });
  }

  ToursModule.prototype.resize = function() {
    return ResizeAvia();
  };

  return ToursModule;

})();
