MAX_TRAVELERS = 9
MAX_CHILDREN = 8

# Recursion work around
EXITED = true

###
Balances number of travelers, using those which was not affected by most recent user change
###
balanceTravelers = (others, model)->
  if model.overall() > MAX_TRAVELERS && EXITED
    EXITED = false
    # How many travelers we need to throw out
    delta = model.overall() - MAX_TRAVELERS
    for prop in others
      if model[prop]() >= delta
        model[prop] model[prop]() - delta
        break
      else
        delta -= model[prop]()
        model[prop] 0
  EXITED = true


class AviaPanel extends SearchPanel
  constructor: ->
    super()

    @template = 'avia-panel-template'
    window.voyanga_debug "AviaPanel created"
    @sp = new SearchParams()
    @departureDate = @sp.date
    @departureCity = @sp.dep
    @departureCityReadable = ko.observable ''
    @departureCityReadableGen = ko.observable ''
    @departureCityReadableAcc = ko.observable ''
    @arrivalDate = @sp.rtDate
    @arrivalCity = @sp.arr
    @arrivalCityReadable = ko.observable ''
    @arrivalCityReadableGen = ko.observable ''
    @arrivalCityReadableAcc = ko.observable ''

    # helper flags for clicck outside of ppl panel handling
    @inside = false
    @inside2 = false
    @inside3 = false

    #helper to save calendar state
    @oldCalendarState = @minimizedCalendar()

    #helper to handle dispaying of calendar
    @fromChosen = ko.computed =>
      @departureDate().length > 0

    @toChosen = ko.computed =>
      @arrivalDate().length > 0 && @rt()

    @rt = @sp.rt

    # Popup inputs
    @adults = @sp.adults
    @children = @sp.children
    @infants = @sp.infants

    @departureDateDay = ko.computed =>
      dateUtils.formatDay(@departureDate())

    @departureDateMonth = ko.computed =>
      dateUtils.formatMonth(@departureDate())

    @arrivalDateDay = ko.computed =>
      dateUtils.formatDay(@arrivalDate())

    @arrivalDateMonth = ko.computed =>
      dateUtils.formatMonth(@arrivalDate())

    # Travelers constraits
    @adults.subscribe (newValue) =>
      if @infants() > @adults()
        @infants @adults()

      if newValue > MAX_TRAVELERS
        @adults MAX_TRAVELERS

      balanceTravelers ["children", 'infants'], @


    @children.subscribe (newValue) =>
      if newValue > MAX_TRAVELERS - 1
        @children MAX_TRAVELERS - 1

      balanceTravelers ["adults", 'infants'], @

    @infants.subscribe (newValue) =>
      if newValue > @adults()
        @adults @infants()

      balanceTravelers ["children", 'adults'], @

    @sum_children = ko.computed =>
      # dunno why but we have stange to string casting here
      @children()*1 + @infants()*1

    @overall = ko.computed =>
      @adults()*1 + @children()*1 + @infants()*1

    @rt.subscribe @rtTumbler

    @calendarText = ko.computed =>
      result = "Выберите дату перелета "
      if ((@departureCityReadable().length>0) && (@arrivalCityReadable().length>0))
        result +=@departureCityReadable() + ' → ' + @arrivalCityReadable()
      else if ((@departureCityReadable().length==0) && (@arrivalCityReadable().length>0))
        result+=' в ' + @arrivalCityReadableAcc()
      else if ((@departureCityReadable().length>0) && (@arrivalCityReadable().length==0))
        result+=' из ' + @departureCityReadableGen()
      return result

    # FIXME:
    $ =>
      $('.how-many-man .popup').find('input').hover ->
        $(this).parent().find('.plusOne').show()
        $(this).parent().find('.minusOne').show()

      $('.adults,.childs,.small-childs').hover null,   ->
        $(this).parent().find('.plusOne').hide()
        $(this).parent().find('.minusOne').hide()

      $('.plusOne').hover ->
        $(this).addClass('active')
        $('.minusOne').addClass('active')
      , ->
        $(this).removeClass('active')
        $('.minusOne').removeClass('active')

      $('.minusOne').hover ->
        $(this).addClass('active');
        $('.plusOne').addClass('active')
      , ->
        $(this).removeClass('active')
        $('.plusOne').removeClass('active')

      # Placeholder-like behaviour for inputs
      $('.how-many-man .popup').find('input').focus ->
        $(@).attr 'rel', $(@).val()
        $(@).val('')

      $('.how-many-man .popup').find('input').blur ->
        if $(@).val() == ''
          $(@).val $(@).attr 'rel'
        $(@).trigger 'change'

      $('.how-many-man').find('.popup').hover =>
        @inside = true
      , =>
        @inside = false

      $('.how-many-man .content').hover =>
        @inside2 = true
      , =>
        @inside2 = false

      $('.how-many-man .btn').hover =>
        @inside3 = true
      , =>
        @inside3 = false

      # Initial state for tumbler
      @rtTumbler(@rt())

  rtTumbler: (newValue) ->
      if newValue
        $('.tumblr .switch').animate {'left': '35px'}, 200
        VoyangaCalendarStandart.twoSelect = true;
        VoyangaCalendarStandart.clean()
      else
        $('.tumblr .switch').animate {'left': '-1px'}, 200
        VoyangaCalendarStandart.twoSelect = false;


  ###
  # Click handlers
  ###
  selectOneWay: =>
    @rt(false)

  selectRoundTrip: =>
    @rt(true)

  plusOne: (model, e)->
    prop = $(e.target).attr("rel")
    model[prop](model[prop]()+1)

  minusOne: (model, e)->
    prop = $(e.target).attr("rel")
    model[prop] model[prop]()-1

  # FIXME decouple!
  navigateToNewSearch: ->
    app.navigate @sp.getHash(), {trigger: true}

  show: (context, event)=>
    el = $(event.currentTarget)
    if !el.hasClass('active')
      console.log "PP OPENENG"
      $(document.body).mousedown =>
        console.log @inside, @inside2
        if @inside ||  @inside2 || @inside3
          return
        @close()
      $('.how-many-man .btn').addClass('active')
      $('.how-many-man .content').addClass('active')
      $('.how-many-man').find('.popup').addClass('active')

    else
      @close()

  close: ->
    $(document.body).unbind 'mousedown'
    console.log "PP CLOSED"
    $('.how-many-man .btn').removeClass('active')
    $('.how-many-man .content').removeClass('active')

    $('.how-many-man').find('.popup').removeClass('active')
  	
    
  returnRecommend: (context, event)->
    $('.recomended-content').slideDown()
    $('.order-hide').fadeIn();
    $(event.currentTarget).animate {top : '-19px'}, 500, null, ->
      ResizeAvia()

$(document).on "autocompleted", "input.departureCity", ->
  $('input.arrivalCity.second-path').focus()

$(document).on "keyup change", "input.second-path", (e) ->
  firstValue = $(this).val()
  secondEl = $(this).siblings('input.input-path')
  if ((e.keyCode==8) || (firstValue.length<3))
    secondEl.val('')

