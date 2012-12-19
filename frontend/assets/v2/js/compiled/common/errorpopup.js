// Generated by CoffeeScript 1.4.0
var ERRORS, ErrorPopup,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ERRORS = {
  avia404: {
    title: "Перелеты не найдены",
    text: "Перелеты по данному направлению в выбранные дни не найдены. Попробуйте изменить даты в поисковом запросе.",
    buttonText: "Перейти на главную",
    onclose: false
  },
  avia500: {
    title: "Упс",
    text: "При обработке запроса произошла внутренняя ошибка сервера. Мы работаем над устранением данной неисправности, попробуйте повторить запрос позже.",
    buttonText: "Перейти на главную"
  },
  aviaNoTicketOnValidation: {
    title: "Не подтвердился авиабилет",
    text: "При проверке доступности выбранный авиабилет не подтвердился. Это могло произойти по причине того что билет по данному тарифу уже купил кто-то другой. Попробуйте выбрать другой вариант перелета.",
    buttonText: "Ok"
  },
  hotels404: {
    title: "Гостиницы не найдены",
    text: "Доступные для бронирования гостиницы в выбранном городе в эти дни не найдены. Попробуйте изменить параметры поискового запроса.",
    buttonText: "Перейти на главную"
  },
  hotelsNoTicketOnValidation: {
    title: "Не подтвердился выбранный отель",
    text: "При проверке доступности, отель не подтвердил доступность выбранного номера. Это могло произойти по причине того что номер уже забронировал кто-то другой. Попробуйте выбрать другой вариант.",
    buttonText: "Ok"
  },
  toursNoTicketOnValidation: {
    title: "Не подтвердился выбранный вариант",
    text: "При проверке доступности, некоторые из сегментов не подтвердились: TODO Попробуйте выбрать другой вариант.",
    buttonText: "Ok"
  },
  e500withText: {
    title: "Упс",
    text: "При обработке запроса произошла внутренняя ошибка сервера. Мы работаем над устранением данной неисправности, попробуйте повторить запрос позже.: {0}",
    buttonText: "Перейти на главную"
  },
  passport500: {
    title: "Упс",
    text: "При обработке запроса произошла внутренняя ошибка сервера. Мы работаем над устранением данной неисправности, попробуйте повторить запрос позже.",
    buttonText: "Перейти на главную"
  },
  passportBookingError: {
    title: "Ошибка бронирования",
    text: "При выполнении запроса произошла ошибка бронирования следующих сегментов: {0} Это могло произойти по причине того что выбранный вариант уже купил кто-то другой. Попробуйте выбрать что-то другое.",
    buttonText: "Ok"
  }
};

ErrorPopup = (function(_super) {

  __extends(ErrorPopup, _super);

  function ErrorPopup(key, params, onclose) {
    var data, id;
    if (params == null) {
      params = false;
    }
    this.onclose = onclose != null ? onclose : false;
    this.close = __bind(this.close, this);
    id = 'errorpopup';
    data = ERRORS[key];
    data.text = data.text.format(params);
    if (!this.onclose) {
      this.onclose = data.onclose;
    }
    ErrorPopup.__super__.constructor.call(this, '#' + id, data, true);
    ko.processAllDeferredBindingUpdates();
    SizeBox(id);
    ResizeBox(id);
  }

  ErrorPopup.prototype.close = function() {
    ErrorPopup.__super__.close.apply(this, arguments);
    if (this.onclose) {
      return this.onclose();
    } else {
      return window.location = '/#' + (window.app.activeModule() || 'tours');
    }
  };

  return ErrorPopup;

})(GenericPopup);
