/* ========================================================================
 * Bootstrap: alert.js v3.0.2
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: carousel.js v3.0.2
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.2
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: modal.js v3.0.2
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.2
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: popover.js v3.0.2
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tab.js v3.0.2
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
;
var $ = jQuery.noConflict();

$(document).ready(function($){

	// Recuperation des elements importants
	var headerwrap = $('#navwrap_menu_header');
	var menusearch = $('#wrap_menu_search');
	var divMenuTitreMobile = $("body").find('.menu-titre-mobile');
	var topDist = $("#navwrap_menu_header").offset().top;
	var typeVisiteur = localStorage.getItem('typeVisiteur');
	if(typeVisiteur == null || (typeVisiteur != 'part' && typeVisiteur != 'pro')) {
		typeVisiteur = 'part';
		localStorage.setItem('typeVisiteur', 'part');
	}

	//Gestion du menu sticky (si l'on scroll et que l'on depasse un trigger, on passe en position top = 0)
	$(window).scroll(function(){

		var scroll = $(this).scrollTop();
		if (($('body').height() - 100 - topDist) > $(window).height()) {
			if (headerwrap.hasClass('sticky')) {
				if( scroll == 0 ) {
					headerwrap.addClass('notsticky');
					headerwrap.removeClass('sticky');
				}
			} else {
				if( scroll > topDist ) {
					headerwrap.addClass('sticky');
					headerwrap.removeClass('notsticky');
				}
			}
		}
	});

	//Au clic sur le bouton de recherche, on fait apparaitre/disparaitre la recherche
	$("[id=button_menu_search]").click(function() {
		toggleSearch(menusearch);
	});

	//Fonction de fermeture de la recherche
	$("[id=button_menu_close_search]").click(function() {
		hideSearch(menusearch);
	});

	//Au clic sur le bouton de recherche, on fait apparaitre/disparaitre la recherche mobile
	$("[id=button_menu_search_mobile]").click(function() {
		hide(divMenuTitreMobile);
		toggleSearch(menusearch);
	});

	//Au clic sur le bouton menu, on fait apparaitre/disparaitre le menu sur mobile et disparaitre la recherche si elle est visible
	$("[id^=button_menu_mobile]").click(function() {
		$(this).toggleClass('active');
		hideSearch(menusearch);

		if (divMenuTitreMobile.css('display') != 'none') {
			hide(divMenuTitreMobile);
			localStorage.setItem('isMenuOpen', 'false');
		} else {
			show(divMenuTitreMobile);
			localStorage.setItem('isMenuOpen', 'true');
		}
	});

	//Au clic sur une rubrique, on fait apparaitre la div correspondante
	$('.menu_header_hidden').click(function() {
		$(this).blur();
		// Récupérer l'id du lien du menu attaché au bloc qu'on vient de fermer
		var id_actuel;
		$('.part, .pro').find('.submenu_main').each(function(index, element) {
			// Récupérer l'id du lien du menu attaché au bloc ouvert
			if ($(this).css("display") === 'block') {
				id_actuel = $(this).attr("id");
			}
		});

		var idToOpen = "submenu_" + $(this).attr('id');
		var delay = 0;
		$('.menu_header_hidden').each(function(index, element) {
			var id = "submenu_" + $(this).attr('id');
			if(id != idToOpen) {
				var div = $("body").find('#' + id);
				if(div.css('display') != 'none') {
					delay = 400;
				}
				// Supprimer la classe "active" d'un lien du menu autre que celui cliqué
				if ($(this).hasClass("active")) {
					$(this).removeClass('active');
				}
				hide(div);
			}
			// Pour le lien cliqué
			else {
				// Ajouter la classe "active" pour le lien du menu cliqué
				if (!$(this).hasClass("active")) {
					$(this).addClass('active');
				}
				// Enlever la classe "active" du lien cliqué s'il correspond au bloc ouvert, car il est fermé après le clic,
				// et ainsi la classe "active" doît être enlevée
				if(typeof id_actuel != 'undefined' && idToOpen == id_actuel) {
					$(this).removeClass('active');
				}
			}
		});

		var div = $("body").find('#' + idToOpen);
		toggle(div, delay);

	});

	//Sauvegarde de l'etat
	$('.part_button_mobile').click(function() {
		localStorage.setItem('typeVisiteur', 'part');
		localStorage.removeItem('menuOpened');
		$('.menu_header_hidden_mobile').each( function( index, element ){
			var id = "submenu_" + $(this).attr('id');
			var div = $("body").find('#' + id);
			if (div.css('display') != 'none') {
				localStorage.setItem('menuOpened', id);
			}

		});

		if (divMenuTitreMobile.css('display') != 'none') {
			localStorage.setItem('isMenuOpen', 'true');
		} else {
			localStorage.setItem('isMenuOpen', 'false');
		}
	});

	$('.pro_button_mobile').click(function() {
		localStorage.setItem('typeVisiteur', 'pro');
		localStorage.removeItem('menuOpened');
		$('.menu_header_hidden_mobile').each( function( index, element ){
			var id = "submenu_" + $(this).attr('id');
			var div = $("body").find('#' + id);
			if (div.css('display') != 'none') {
				localStorage.setItem('menuOpened', id);
			}

		});

		if (divMenuTitreMobile.css('display') != 'none') {
			localStorage.setItem('isMenuOpen', 'true');
		} else {
			localStorage.setItem('isMenuOpen', 'false');
		}
	});

	$('.box_particulier').click(function() {
		localStorage.setItem('typeVisiteur', 'part');
	});

	$('.box_professionnel').click(function() {
		localStorage.setItem('typeVisiteur', 'pro');
	});

	//Au clic sur une rubrique, on fait apparaitre la div correspondante en mode mobile
	$('.menu_header_hidden_mobile').click(function() {

		var idToOpen = "submenu_" + $(this).attr('id');
		var divToOpen = $("body").find('#' + idToOpen);

		$('.menu_header_hidden_mobile').each( function( index, element ){
			var id = "submenu_" + $(this).attr('id');
			if(id != idToOpen) {
				var div = $("body").find('#' + id);
				hide(div);
			}
		});

		if (divToOpen.css('display') != 'none') {
			hide(divToOpen);
		} else {
			show(divToOpen);
		}
	});

	//Au clic sur le bouton fermer d'une rubrique, on fait disparaitre la div correspondante
	$('.menu_header_hidden_button').click(function() {

		var id = "submenu_" + $(this).attr('name');

		var div = $("body").find('#' + id);
		hide(div);

		$('.menu_header_hidden').each(function(index, element) {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
		});
	});

	// Gestion de la préouverture des menus en mode mobile
	var isMenuOpen = localStorage.getItem('isMenuOpen');
	if(isMenuOpen == 'true') {
		show(divMenuTitreMobile);
		$('#button_menu_mobile').addClass('active');
		var menuOpened = localStorage.getItem('menuOpened');
		if(menuOpened != null) {
			var div = $("body").find('#' + menuOpened);
			show(div);
		}
	}else {
		divMenuTitreMobile.toggle();
	}

	//Gestion du surlignage en fonction du choix particulier/professionnel
	if(typeVisiteur == 'part') {
		$('.part_button_mobile').addClass('selected');
		$('.box_particulier').addClass('box_active');
		$(document.body).addClass('part');
	} else {
		$('.pro_button_mobile').addClass('selected');
		$('.box_professionnel').addClass('box_active');
		$(document.body).addClass('pro');
	}


});

//Fonction d'apparition/disparition d'une div
function toggle(div) {
	div.animate({
		height: 'toggle'
	});
}
function toggle(div, delay) {
	div.delay(delay).animate({
		height: 'toggle'
	});
}

//Fonction de dispraition d'une div
function hide(div) {
	div.animate({
		height: 'hide'
	});
}

//Fonction d'apparition d'une div
function show(div) {
	div.animate({
		height: 'show'
	});
}

//Fonction d'apparition/disparition de la recherche
function toggleSearch(div) {
	if (div.hasClass("menu_search_notshown")) {
		showSearch(div);
	}
	else {
		hideSearch(div);
	}
	$('#button_menu_mobile').removeClass('active');
}

//Fonction de disparition de la recherche
function hideSearch(div) {
	div.addClass('menu_search_notshown');
	div.removeClass('menu_search_shown');
}

//Fonction d'apparition de la recherche
function showSearch(div) {
	div.addClass('menu_search_shown');
	div.removeClass('menu_search_notshown');
}
;
var $ = jQuery.noConflict();


$(document).ready(function($){

	// Les éléments html sur lesquels on applique le zoom
	var elementsToResize = $('#content .view-search-page .ctn-gen-introduction, #content .view-search-page .ctn-gen-liste-thematique, #content h1, #content .newsletter div p,#content .newsletter #edit-text-top, #content .newsletter button,#content .newsletter h2, #content .pager-next a, #content #views-record-count-text, #content .ctn-gen .ctn-gen-body p, #content .ctn-gen .ctn-gen-ascenseur .ctn-gen-ascenseur-texte>p, #content .ctn-gen .ctn-gen-introduction p, #content .ctn-gen .ctn-gen-push-3 p, #content .ctn-gen .ctn-gen-push-2 p, #content .ctn-gen .ctn-gen-onglets p, #content .ctn-gen .ctn-gen-citation p,#content .ctn-gen .ctn-gen-chiffre p, #content .ctn-gen .ctn-gen-apparte p, #content .ctn-gen .ctn-gen-auteur p, #content .ctn-gen .ctn-gen-body span, #content .ctn-gen .ctn-gen-body h2, #content .ctn-gen .ctn-gen-ascenseur h2, #content .ctn-gen .ctn-gen-push-3 h2, #content .ctn-gen .ctn-gen-push-2 h2, #content .ctn-gen .ctn-gen-onglets h2, #content .ctn-gen .ctn-gen-citation h2, #content .ctn-gen .ctn-gen-apparte h2, #content .ctn-gen .ctn-gen-textes-references h2, #content .ctn-gen .ctn-gen-citation-date, #content .ctn-gen .ctn-gen-citation-auteur, #content .ctn-gen .ctn-gen-chiffre span, #content .ctn-gen .auteur .plus a, #content .auteur p, #content .ctn-gen-push-3-lien a, #content .ctn-gen-onglets a, #content .ctn-gen .auteur .nom,.ctn-gen-textes-references a, #content .sous-thematique .surtitre, #content .sous-thematique p,#content .sous-thematique button, #content .sous-thematique .keywords h2, #content .views-exposed-form button, #content .views-exposed-form select, #content .views-exposed-form #edit-keys, #content .hub .keywords h2, #content .hub .keywords a, #content .contenus h2,#content .hub .contenus .sous-titre, #content .hub p, #content .demarche h2, #content .demarche .body p,#content .demarche label, #content .plaintes_sous-titre, #content .thematique-plainte h2, #content .thematique-plainte label, #content .thematique-plainte .description p, #content .action h2, #content .action .body p, #content .node-declarer-un-fichier .brouillon h2, #content .node-declarer-un-fichier .brouillon p, #content .node-norme h2, #content .node-norme .body p, #content .node-norme .body a,#content .node-norme #aucune-dispense p, #content .node-norme .ascenseur .ctn-gen-ascenseur-toCollapse, #content .thematique-plainte .ascenseur .ctn-gen-ascenseur-toCollapse,#content .node-declarer-un-fichier .brouillon input, #content .node-declarer-un-fichier .thematiques h2, #content .node-declarer-un-fichier .thematiques h4, #content .node-declarer-un-fichier .thematiques p, #content .node-declarer-un-fichier .thematiques label, #content .node-declarer-un-fichier .bloc-declaration h2, #content .node-declarer-un-fichier .bloc-declaration h3, #content .node-declarer-un-fichier .bloc-declaration p, .view-declarations .sub h2, .view-declarations .sub a, .view-declarations #aucune-dispense h2, .view-declarations #aucune-dispense p, .view-declarations #aucune-declaration p, .view-declarations #aucune-declaration h2, #content .principe h2, #content .principe .intro p, #content .view-view-modeles h2, #content .node-modele h2, #content .node-modele h3, #content .node-modele #text-copy-button-contenu p, #content .node-modele label, #content .node-modele legend div, .page-modele #content h2, .page-modele #content h3, .page-modele #content #text-copy-button-contenu p, .page-modele #content .modalites-wrapper, #content .page-erreur .texte-explication-erreur p, #content .page-erreur .texte-explication-erreur span');

	// Appliquer le zoom avant gardé dans la variable de session à partir des mesures de la page précédente
	if (typeof sessionStorage['zoom'] != 'undefined') {
			$.each(elementsToResize, function(index, value) {
				// Augmentation de la taille de la police
				var currentSize = parseInt($(this).css('font-size')) + parseInt(sessionStorage['zoom']);
				$(this).css('font-size', currentSize);
				// Augmentation de la taille de la ligne (pour que les lettres de lignes différentes ne s'entrechoquent pas)
	    		var currentLineSize = parseInt($(this).css('line-height'));
				if(currentLineSize < currentSize){
					currentLineSize =  currentLineSize + parseInt(sessionStorage['zoom']);
					$(this).css('line-height', currentLineSize + "px");
				}
			});
	}
	else {
		sessionStorage['zoom'] = 0;
	}

	// Variable pour mettre une limite de 10 pas pour le zoom+, et de ne jamais appliquer un zoom- si on a le font-size par défaut
	if (typeof sessionStorage['max_increase'] == 'undefined') {
		sessionStorage['max_increase'] = 0;
	}

	var stop = false;
	$('#increaseFont').click(function(){
		// On peut appliquer un zoom+ de 10 pas maximum
		if (parseInt(sessionStorage['max_increase']) <10) {
			sessionStorage['max_increase'] = parseInt(sessionStorage['max_increase']) + 1;
			sessionStorage['zoom'] = parseInt(sessionStorage['zoom']) + 2;
			$.each(elementsToResize, function(index, value) {
				// Augmentation de la taille de la police
				var currentSize = parseInt($(this).css('font-size')) + 2;
	    		$(this).css('font-size', currentSize);
	    		// Augmentation de la taille de la ligne (pour que les lettres de lignes différentes ne s'entrechoquent pas)
	    		var currentLineSize = parseInt($(this).css('line-height')) + 2;
				$(this).css('line-height', currentLineSize + "px");
			});		
		}
    }); 
    

    $('#decreaseFont').click(function(){ 
    	// Si on a pas fait de zoom+, on peut pas faire un zoom-
    	if (parseInt(sessionStorage['max_increase']) > 0) {

    		sessionStorage['max_increase'] = parseInt(sessionStorage['max_increase']) - 1;

	    	stop = false;
	    	// Vérifier à chaque clic s'il y a un élément qui atteint le font-size 0
	  		$.each(elementsToResize, function(index, value) {
				var currentSize = parseInt($(this).css('font-size')) - 2;
				if (currentSize < 0 || currentSize == 0) { 
					stop = true; 
				}
			});

	  		// Si aucun élément n'atteint le font-size 0 <=> variable stop à false, on incrémente la variable de session de nombre de pas en arrière, et on applique le zoom arrière
			if (!stop) { 
				sessionStorage['zoom'] = parseInt(sessionStorage['zoom']) - 2;
				$.each(elementsToResize, function(index, value) {
					// Diminution de la taille de la police
					var currentSize = parseInt($(this).css('font-size')) - 2;
		        	$(this).css('font-size', currentSize);
		        	// Diminution de la taille de la ligne
		        	var currentLineSize = parseInt($(this).css('line-height')) - 2;
					$(this).css('line-height', currentLineSize + "px");
	        	});
			}
		}
    });
    
}); ;
var $ = jQuery.noConflict();

$(document).ready(function($){

  /*** webform ***/
	//Ouverture et fermeture d'un groupe de champs
	$('.panel-heading a').click(function() {
		var ele = $(this);
		if($('.panel-collapse').hasClass('in')){
			$(this).parent().next('div').removeClass('in');
			$('html, body').animate({
		        scrollTop: ele.offset().top - 200
		    }, 800);
		}
		else {
			$(this).parent().next('div').addClass('in');
			$('html, body').animate({
		        scrollTop: ele.offset().top - 200
		    }, 800);
		}
	 });

  /*** gestion particulier/professionnel ***/
  var home_part = ['/', '/fr'];
  var home_pro = ['/professionnel', '/fr/professionnel'];
	// Recuperation des elements importants
	var typeVisiteur = localStorage.getItem('typeVisiteur');
	if(typeVisiteur == null || (typeVisiteur != 'part' && typeVisiteur != 'pro')) {
		typeVisiteur = 'part';
		localStorage.setItem('typeVisiteur', 'part');
	}
  //typeVisiteur is saved and exists and we're on the front page
  else if (home_part.join(home_pro).indexOf(window.location.pathname) >= 0) {
    //visiteur is part and home page is pro : we redirect
    if (typeVisiteur == 'part' && home_pro.indexOf(window.location.pathname) >= 0) {
      window.location.replace(window.location.origin + home_part[0]);
    }
    //visiteur is pro and home page is part : we redirect
    if (typeVisiteur == 'pro' && home_part.indexOf(window.location.pathname) >= 0) {
      window.location.replace(window.location.origin + home_pro[0]);
    }
  }

  //Gestion des part/pro d'un contenu
  var typePage = $("#type_page").val();

  if(typeof typePage !== 'undefined' && home_part.join(home_pro).indexOf(window.location.pathname) == -1) {
    if (typePage === 'Pro') {
      $(document.body).addClass('pro');
      localStorage.setItem('typeVisiteur', 'pro');
      $('.box_particulier, .box_professionnel').removeClass('box_active');
      $('.pro_button_mobile, .part_button_mobile').removeClass('selected');
      $('.box_professionnel').addClass('box_active');
      $('.pro_button_mobile').addClass('selected');
      $('.footer .cnildirect a, a.cnildirect-menu').attr('href', $('.footer .cnildirect a').attr('href') + '?visiteur=pro');
    }
    else {// Visiteur part (par défaut)
      $(document.body).addClass('part');
      localStorage.setItem('typeVisiteur', 'part');
      $('.pro_button_mobile, .part_button_mobile').removeClass('selected');
      $('.box_particulier, .box_professionnel').removeClass('box_active');
      $('.box_particulier').addClass('box_active');
      $('.part_button_mobile').addClass('selected');
      $('.hub .articles-associes.pro').hide();
      $('.hub .articles-associes.part').show();
      $('.footer .cnildirect a, a.cnildirect-menu').attr('href', $('.footer .cnildirect a').attr('href') + '?visiteur=part');
    }
  }

  // gestion du paramètre visiteur pour cnil-direct
  if(localStorage.getItem('typeVisiteur') == 'pro') {
    $('.footer .cnildirect a, a.cnildirect-menu').attr('href', $('.footer .cnildirect a').attr('href') + '?visiteur=pro');
  }
  else {
    $('.footer .cnildirect a, a.cnildirect-menu').attr('href', $('.footer .cnildirect a').attr('href') + '?visiteur=part');
  }

	//Gestion du surlignage en fonction du choix particulier/professionnel et des suppressions d'elements hors contexte
	if(localStorage.getItem('typeVisiteur') == 'part') {
		$(".Part").show();
		$('.hub .articles-associes.pro').hide();
        $('.hub .articles-associes.part').show();
	} else {
		$(".Pro").show();
		$('.hub .articles-associes.part').hide();
        $('.hub .articles-associes.pro').show();
	}

  //Gestion des part/pro
  $(".interest-element-hashtag").each( function( index, element ){
    if(typeVisiteur == 'part') {
      $(this).addClass('part');
    } else {
      $(this).addClass('pro');
    }
  });

  /*** gestion du bouton cnil direct ***/
  var cookieCnilDirect = getCookieCnilDirect();
  //cookie exists
  if(cookieCnilDirect.length && cookieCnilDirect == 'true') {
    $('.footer .cnildirect').hide();
  }
  $('#cnil-direct-close-button').click(function(event) {
    setCookieCnilDirect(true);
    $('.footer .cnildirect').hide();
  });

    /*** tarte au citron : gestion cookies ***/

	//tarteaucitron : Gestion des cookies des services vidéos - les vidéos youtube et dailymotion sont possiblement désactivées
  if (jQuery('iframe, embed')) {
    jQuery('iframe, embed').filter(function() {
      if (this.src.match(/.*www.youtube.com.*/)) {
        jQuery(this).replaceWith("<div class='youtube_player' videoID='"+this.src.substring(this.src.lastIndexOf('/') + 1)+"' width='450' height='330' theme='dark' rel='1' controls='1' showinfo='1' autoplay='0'></div>");
      }
      if (this.src.match(/.*www.dailymotion.com.*/)) {
        jQuery(this).replaceWith("<div class='dailymotion_player' videoID='"+this.src.substring(this.src.lastIndexOf('/') + 1)+"' width='450' height='330'  showinfo='1' autoplay='0'></div>");
      }
    });
  }

  /*** formulaire de recherche ***/

	// Pour le bandeau de recherche sur chaque page, mettre à jour le lien de la loupe à chaque fois qu'on renseigne la chaine à chercher.
	// On gère aussi le clic sur le bouton "entrée" du clavier.
	var enter = false;
	var valeur = null;
	// Evénement de saisie d'un terme
	$('#search, .search_erreur #page_search').keypress(function(event) {
		// Au clic sur la "loupe"
		$('#search-loupe, .search_erreur #page-search-loupe').on( "click", function() {
			if (!enter) {
				if ($('#search').val() == '') {
					// Si la valeur de l'id #search est vide et que la valeur de ".search_erreur #page_search" est définie, il s'agit donc du bandeau de la page erreur
					if (typeof $('.search_erreur #page_search').val() != 'undefined') {
						valeur = $('.search_erreur #page_search').val();
					}
				}
				else {
					valeur = $('#search').val();
				}
				// Cela permet de ne pas repasser par le clic, ce qui pourrait concaténer le terme cherché plusieurs fois au "href"
				enter = true;
				// Ajouter la chaine cherché au lien basique de la loupe
       $('#search-loupe, .search_erreur #page-search-loupe').attr('href', $('#search-loupe, .search_erreur #page-search-loupe').attr('href') + valeur);
     }
   });

		// Au clic sur le bouton "entrée" du clavier
   if(event.keyCode === 13) {
    if ($('#search').val() == '') {
      if (typeof $('.search_erreur #page_search').val() != 'undefined') {
       valeur = $('.search_erreur #page_search').val();
     }
   }
   else {
    valeur = $('#search').val();
  }
	 		// Ce pivot évite de déclencher l'événement "onclick" du bouton loupe, ce qui pourrait concaténer
	 		// le terme cherché plusieurs fois au "href"
	 		enter = true;
     $('#search-loupe, .search_erreur #page-search-loupe').attr('href', $('#search-loupe, .search_erreur #page-search-loupe').attr('href') + valeur);
     $('#search-loupe img, .search_erreur #page-search-loupe img').click();
   }

 });

/*** gestion éléments contenus ***/

	//gestion des listes titrées (H3 et H4)
	$('#content ol li h2, #content ol li h3, #content ol li h4').each(function(index, value) {
		$(value).parent().addClass('hx');
	});

	//gestion de l'attribut start pour les puces numérotés
	$('#content ol').each(function(){
		if($(this).attr("start")){
			$(this).css('counter-increment', 'repas '+ ($(this).attr('start')-1) );
		}
	});

	//gestion des ascenseurs
	$(".ctn-gen-ascenseur-collapse, .ascenseur .button-collapse").click(function() {
		divToClick = $(this);
		divToAnimate = $(this).parent().find('.ctn-gen-ascenseur-toCollapse')
		if (divToAnimate.css('display') != 'none') {
			divToAnimate.animate({
				height: 'hide'
			});
			divToClick.removeClass('collapsed');
		} else {
			divToAnimate.animate({
				height: 'show'
			});
			//gestion de l'overflow appliqué dans le cas d'un ascenceur.
			divToAnimate.css('overflow','initial');
			divToAnimate.find('table').css('table-layout', 'fixed');
			divToAnimate.find('table').css('width', '100%');
			divToClick.addClass('collapsed');
		}
	});

    //initialise les popover avec l'option html
    $('[data-toggle="popover"]').popover({ html : true});

    // Fermer les pop in au clic en dehors
    $('body').on('click', function (e) {
      if ($(e.target).data('toggle') !== 'popover' && $(e.target).parents('.popover.in').length === 0) {
        $('[data-toggle="popover"]').popover('hide');
        $('.popover').hide();
      }
    });

    /*** gestion vues ***/

    //gestion des views et du loader
    $('.list-view').ajaxStart(function() {
      $('.list-view .view-content').append('<div class="loader"></div>');
    });
    $('.list-view').ajaxSuccess(function() {
      $('.list-view .view-content .loader').remove();
    });

  });

function redirectionDemarche() {
  if($('input[type=radio]:checked').val()!= undefined){
    location.href= $('input[type=radio]:checked').val();
  }
    else{
      $("#alert-plaintes").show();
  }
}

/*** fonctions de gestion des cookies pour cnil direct ***/
function setCookieCnilDirect(cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = 'cnil-direct-hidden' + "=" + cvalue + "; " + expires;
}

function getCookieCnilDirect() {
    var name = 'cnil-direct-hidden' + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

;
/*jslint browser: true, evil: true */

// define correct path for files inclusion
var scripts = document.getElementsByTagName('script'),
    path = scripts[scripts.length - 1].src.split('?')[0],
    cdn = path.split('/').slice(0, -1).join('/') + '/',
    alreadyLaunch = (alreadyLaunch === undefined) ? 0 : alreadyLaunch,
    tarteaucitronForceLanguage = (tarteaucitronForceLanguage === undefined) ? '' : tarteaucitronForceLanguage,
    tarteaucitronProLoadServices,
    tarteaucitronNoAdBlocker = false;

var tarteaucitron = {
    "version": 303,
    "cdn": cdn,
    "user": {},
    "lang": {},
    "services": {},
    "added": [],
    "idprocessed": [],
    "state": [],
    "launch": [],
    "parameters": {},
    "isAjax": false,
    "reloadThePage": false,
    "init": function (params) {
        "use strict";
        var origOpen;

        tarteaucitron.parameters = params;
        if (alreadyLaunch === 0) {
            alreadyLaunch = 1;
            if (window.addEventListener) {
                window.addEventListener("load", function () {
                    tarteaucitron.load();
                    tarteaucitron.fallback(['tarteaucitronOpenPanel'], function (elem) {
                        elem.addEventListener("click", function () {
                            tarteaucitron.userInterface.openPanel();
                        }, false);
                    }, true);
                }, false);
                window.addEventListener("scroll", function () {
                    var scrollPos = window.pageYOffset || document.documentElement.scrollTop,
                        heightPosition;
                    if (document.getElementById('tarteaucitronAlertBig') !== null && tarteaucitron.showsmall && !tarteaucitron.highPrivacy) {
                        if (document.getElementById('tarteaucitronAlertBig').style.display === 'block') {
                            heightPosition = document.getElementById('tarteaucitronAlertBig').offsetHeight + 'px';

                            if (scrollPos > (screen.height * 2)) {
                                tarteaucitron.userInterface.respondAll(true);
                            } else if (scrollPos > (screen.height / 2)) {
                                document.getElementById('tarteaucitronDisclaimerAlert').innerHTML = '<b>' + tarteaucitron.lang.alertBigScroll + '</b> ' + tarteaucitron.lang.alertBig;
                            }

                            if (tarteaucitron.orientation === 'top') {
                                document.getElementById('tarteaucitronPercentage').style.top = heightPosition;
                            } else {
                                document.getElementById('tarteaucitronPercentage').style.bottom = heightPosition;
                            }
                            document.getElementById('tarteaucitronPercentage').style.width = ((100 / (screen.height * 2)) * scrollPos) + '%';
                        }
                    }
                }, false);
                window.addEventListener("keydown", function (evt) {
                    if (evt.keyCode === 27) {
                        tarteaucitron.userInterface.closePanel();
                    }
                }, false);
                window.addEventListener("hashchange", function () {
                    if (document.location.hash === tarteaucitron.hashtag && tarteaucitron.hashtag !== '') {
                        tarteaucitron.userInterface.openPanel();
                    }
                }, false);
                window.addEventListener("resize", function () {
                    if (document.getElementById('tarteaucitron') !== null) {
                        if (document.getElementById('tarteaucitron').style.display === 'block') {
                            tarteaucitron.userInterface.jsSizing('main');
                        }
                    }

                    if (document.getElementById('tarteaucitronCookiesListContainer') !== null) {
                        if (document.getElementById('tarteaucitronCookiesListContainer').style.display === 'block') {
                            tarteaucitron.userInterface.jsSizing('cookie');
                        }
                    }
                }, false);
            } else {
                window.attachEvent("onload", function () {
                    tarteaucitron.load();
                    tarteaucitron.fallback(['tarteaucitronOpenPanel'], function (elem) {
                        elem.attachEvent("onclick", function () {
                            tarteaucitron.userInterface.openPanel();
                        });
                    }, true);
                });
                window.attachEvent("onscroll", function () {
                    var scrollPos = window.pageYOffset || document.documentElement.scrollTop,
                        heightPosition;
                    if (document.getElementById('tarteaucitronAlertBig') !== null && tarteaucitron.showsmall && !tarteaucitron.highPrivacy) {
                        if (document.getElementById('tarteaucitronAlertBig').style.display === 'block') {
                            heightPosition = document.getElementById('tarteaucitronAlertBig').offsetHeight + 'px';

                            if (scrollPos > (screen.height * 2)) {
                                tarteaucitron.userInterface.respondAll(true);
                            } else if (scrollPos > (screen.height / 2)) {
                                document.getElementById('tarteaucitronDisclaimerAlert').innerHTML = '<b>' + tarteaucitron.lang.alertBigScroll + '</b> ' + tarteaucitron.lang.alertBig;
                            }
                            if (tarteaucitron.orientation === 'top') {
                                document.getElementById('tarteaucitronPercentage').style.top = heightPosition;
                            } else {
                                document.getElementById('tarteaucitronPercentage').style.bottom = heightPosition;
                            }
                            document.getElementById('tarteaucitronPercentage').style.width = ((100 / (screen.height * 2)) * scrollPos) + '%';
                        }
                    }
                });
                window.attachEvent("onkeydown", function (evt) {
                    if (evt.keyCode === 27) {
                        tarteaucitron.userInterface.closePanel();
                    }
                });
                window.attachEvent("onhashchange", function () {
                    if (document.location.hash === tarteaucitron.hashtag && tarteaucitron.hashtag !== '') {
                        tarteaucitron.userInterface.openPanel();
                    }
                });
                window.attachEvent("onresize", function () {
                    if (document.getElementById('tarteaucitron') !== null) {
                        if (document.getElementById('tarteaucitron').style.display === 'block') {
                            tarteaucitron.userInterface.jsSizing('main');
                        }
                    }

                    if (document.getElementById('tarteaucitronCookiesListContainer') !== null) {
                        if (document.getElementById('tarteaucitronCookiesListContainer').style.display === 'block') {
                            tarteaucitron.userInterface.jsSizing('cookie');
                        }
                    }
                });
            }

            if (typeof XMLHttpRequest !== 'undefined') {
                origOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function () {

                    if (window.addEventListener) {
                        this.addEventListener("load", function () {
                            if (typeof tarteaucitronProLoadServices === 'function') {
                                tarteaucitronProLoadServices();
                            }
                        }, false);
                    } else if (typeof this.attachEvent !== 'undefined') {
                        this.attachEvent("onload", function () {
                            if (typeof tarteaucitronProLoadServices === 'function') {
                                tarteaucitronProLoadServices();
                            }
                        });
                    } else {
                        if (typeof tarteaucitronProLoadServices === 'function') {
                            setTimeout(tarteaucitronProLoadServices, 1000);
                        }
                    }

                    try {
                        origOpen.apply(this, arguments);
                    } catch (err) {}
                };
            }
        }
    },
    "load": function () {
        "use strict";
        var cdn = tarteaucitron.cdn,
            language = tarteaucitron.getLanguage(),
            pathToLang = cdn + 'lang/tarteaucitron.' + language + '.js?v=' + tarteaucitron.version,
            pathToServices = cdn + 'tarteaucitron.services.js?v=' + tarteaucitron.version,
            linkElement = document.createElement('link'),
            defaults = {
                "adblocker": false,
                "hashtag": '#tarteaucitron',
                "highPrivacy": false,
                "orientation": "top",
                "removeCredit": false,
                "showAlertSmall": true,
                "cookieslist": true
            },
            params = tarteaucitron.parameters;

        // Step 0: get params
        if (params !== undefined) {
            tarteaucitron.extend(defaults, params);
        }

        // global
        tarteaucitron.showsmall = defaults.showAlertSmall;
        tarteaucitron.orientation = defaults.orientation;
        tarteaucitron.hashtag = defaults.hashtag;
        tarteaucitron.highPrivacy = defaults.highPrivacy;

        // Step 1: load css
        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = cdn + 'css/tarteaucitron.css?v=' + tarteaucitron.version;
        document.getElementsByTagName('head')[0].appendChild(linkElement);

        // Step 2: load language and services
        tarteaucitron.addScript(pathToLang, '', function () {
            tarteaucitron.addScript(pathToServices, '', function () {

                var body = document.body,
                    div = document.createElement('div'),
                    html = '',
                    index,
                    orientation = 'Top',
                    cat = ['ads', 'analytic', 'api', 'comment', 'social', 'support', 'video'],
                    i;

                cat = cat.sort(function (a, b) {
                    if (tarteaucitron.lang[a].title > tarteaucitron.lang[b].title) { return 1; }
                    if (tarteaucitron.lang[a].title < tarteaucitron.lang[b].title) { return -1; }
                    return 0;
                });

                // Step 3: prepare the html
                html += '<div id="tarteaucitronPremium"></div>';
                html += '<div id="tarteaucitronBack" onclick="tarteaucitron.userInterface.closePanel();"></div>';
                html += '<div id="tarteaucitron">';
                html += '   <div id="tarteaucitronClosePanel" onclick="tarteaucitron.userInterface.closePanel();">';
                //modification Yann Jajkiewicz 09/09/2015 : ajout logo croix au lieu d utexte fermer
                html += '       <div class="logo_croix">&nbsp;</div>';
                //html += '       ' + tarteaucitron.lang.close;
                html += '   </div>';
                html += '   <div id="tarteaucitronServices">';

                //modification Yann Jajkiewicz 09/09/2015
                html += '   <div id="tarteaucitronHeader">';
                html += '       <h1>'+ tarteaucitron.lang.header +'</h1>';
                html += '           <div id="tarteaucitronInfo" class="tarteaucitronInfoBox">';
                html += '               ' + tarteaucitron.lang.disclaimer;
                if (defaults.removeCredit === false) {
                    html += '               <br/><br/>';
                    html += '               <a href="https://opt-out.ferank.eu/" rel="nofollow" target="_blank">' + tarteaucitron.lang.credit + '</a>';
                }
                html += '           </div>';
                html += '           <hr />';
                html += '   </div>';

                html += '      <div class="tarteaucitronLine tarteaucitronMainLine" id="tarteaucitronMainLineOffset">';
                html += '         <div class="tarteaucitronName">';
                //modification Yann Jajkiewicz 09/09/2015
                //html += '            <b><a href="#" onclick="tarteaucitron.userInterface.toggle(\'tarteaucitronInfo\', \'tarteaucitronInfoBox\');return false">&#10011;</a> ' + tarteaucitron.lang.all + '</b>';
                html += '          <h2>' + tarteaucitron.lang.all + '</h2>';
                html += '         </div>';
                html += '         <div class="tarteaucitronAsk" id="tarteaucitronScrollbarAdjust">';
                html += '            <div id="tarteaucitronAllAllowed" class="tarteaucitronAllow" onclick="tarteaucitron.userInterface.respondAll(true);">';
                html += '               ' + tarteaucitron.lang.allow;
                html += '            </div> ';
                html += '            <div id="tarteaucitronAllDenied" class="tarteaucitronDeny" onclick="tarteaucitron.userInterface.respondAll(false);">';
                html += '               ' + tarteaucitron.lang.deny;
                html += '            </div>';
                html += '         </div>';
                html += '      </div>';
                //modification Yann Jajkiewicz 09/09/2015
               // html += '      <div id="tarteaucitronInfo" class="tarteaucitronInfoBox">';
                //html += '         ' + tarteaucitron.lang.disclaimer;
                //if (defaults.removeCredit === false) {
                //    html += '        <br/><br/>';
                //    html += '        <a href="https://opt-out.ferank.eu/" rel="nofollow" target="_blank">' + tarteaucitron.lang.credit + '</a>';
                //}
                //html += '      </div>';
                html += '      <div class="tarteaucitronBorder" id="tarteaucitronScrollbarParent">';
                html += '         <div class="clear"></div>';
                for (i = 0; i < cat.length; i += 1) {
                    html += '         <div id="tarteaucitronServicesTitle_' + cat[i] + '" class="tarteaucitronHidden">';
                    html += '            <hr />';
                    html += '            <div class="tarteaucitronTitle">';
                    //html += '               <a href="#" onclick="tarteaucitron.userInterface.toggle(\'tarteaucitronDetails' + cat[i] + '\', \'tarteaucitronInfoBox\');return false">&#10011;</a> ' + tarteaucitron.lang[cat[i]].title;
                    //modification Yann Jajkiewicz 09/09/2015
                    html += '               <h3>'+ tarteaucitron.lang[cat[i]].title+'</h3>';
                    html += '            </div>';
                    html += '            <div id="tarteaucitronDetails' + cat[i] + '" class="tarteaucitronDetails tarteaucitronInfoBox">';
                    html += '               ' + tarteaucitron.lang[cat[i]].details;
                    html += '            </div>';
                    html += '         </div>';
                    html += '         <div id="tarteaucitronServices_' + cat[i] + '"></div>';
                }
                html += '         <div class="tarteaucitronHidden" id="tarteaucitronScrollbarChild" style="height:20px;display:block"></div>';
                html += '       </div>';
                html += '   </div>';
                html += '</div>';

                if (defaults.orientation === 'bottom') {
                    orientation = 'Bottom';
                }

                if (defaults.highPrivacy) {
                    html += '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '">';
                    html += '   <span id="tarteaucitronDisclaimerAlert">';
                    html += '       ' + tarteaucitron.lang.alertBigPrivacy;
                    html += '   </span>';
                    html += '   <span id="tarteaucitronPersonalize" onclick="tarteaucitron.userInterface.openPanel();">';
                    html += '       ' + tarteaucitron.lang.personalize;
                    html += '   </span>';
                    html += '</div>';
                } else {
                    html += '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '">';
                    html += '   <span id="tarteaucitronDisclaimerAlert">';
                    html += '       ' + tarteaucitron.lang.alertBigClick + ' ' + tarteaucitron.lang.alertBig;
                    html += '   </span>';
                    html += '   <span id="tarteaucitronPersonalize" onclick="tarteaucitron.userInterface.respondAll(true);">';
                    html += '       &#10003; ' + tarteaucitron.lang.acceptAll;
                    html += '   </span>';
                    html += '   <span id="tarteaucitronCloseAlert" onclick="tarteaucitron.userInterface.openPanel();">';
                    html += '       ' + tarteaucitron.lang.personalize;
                    html += '   </span>';
                    html += '</div>';
                    html += '<div id="tarteaucitronPercentage"></div>';
                }

                if (defaults.showAlertSmall === true) {
                    html += '<div id="tarteaucitronAlertSmall">';
                    html += '   <div id="tarteaucitronManager" onclick="tarteaucitron.userInterface.openPanel();">';
                    html += '       ' + tarteaucitron.lang.alertSmall;
                    html += '       <div id="tarteaucitronDot">';
                    html += '           <span id="tarteaucitronDotGreen"></span>';
                    html += '           <span id="tarteaucitronDotYellow"></span>';
                    html += '           <span id="tarteaucitronDotRed"></span>';
                    html += '       </div>';
                    if (defaults.cookieslist === true) {
                        html += '   </div><!-- @whitespace';
                        html += '   --><div id="tarteaucitronCookiesNumber" onclick="tarteaucitron.userInterface.toggleCookiesList();">0</div>';
                        html += '   <div id="tarteaucitronCookiesListContainer">';
                        html += '       <div id="tarteaucitronClosePanelCookie" onclick="tarteaucitron.userInterface.closePanel();">';
                        html += '           ' + tarteaucitron.lang.close;
                        html += '       </div>';
                        html += '       <div class="tarteaucitronCookiesListMain" id="tarteaucitronCookiesTitle">';
                        html += '            <b id="tarteaucitronCookiesNumberBis">0 cookie</b>';
                        html += '       </div>';
                        html += '       <div id="tarteaucitronCookiesList"></div>';
                        html += '    </div>';
                    } else {
                        html += '   </div>';
                    }
                    html += '</div>';
                }

                tarteaucitron.addScript(tarteaucitron.cdn + 'advertising.js?v=' + tarteaucitron.version, '', function () {
                    if (tarteaucitronNoAdBlocker === true || defaults.adblocker === false) {
                        div.id = 'tarteaucitronRoot';
                        body.appendChild(div, body);
                        div.innerHTML = html;

                        if (tarteaucitron.job !== undefined) {
                            tarteaucitron.job = tarteaucitron.cleanArray(tarteaucitron.job);
                            for (index = 0; index < tarteaucitron.job.length; index += 1) {
                                tarteaucitron.addService(tarteaucitron.job[index]);
                            }
                        }

                        tarteaucitron.isAjax = true;
                        tarteaucitron.job.push = function (id) {

                            // ie <9 hack
                            if (typeof tarteaucitron.job.indexOf === 'undefined') {
                                tarteaucitron.job.indexOf = function (obj, start) {
                                    var i,
                                        j = this.length;
                                    for (i = (start || 0); i < j; i += 1) {
                                        if (this[i] === obj) { return i; }
                                    }
                                    return -1;
                                };
                            }

                            if (tarteaucitron.job.indexOf(id) === -1) {
                                Array.prototype.push.call(this, id);
                            }
                            tarteaucitron.launch[id] = false;
                            tarteaucitron.addService(id);
                        };

                        if (document.location.hash === tarteaucitron.hashtag && tarteaucitron.hashtag !== '') {
                            tarteaucitron.userInterface.openPanel();
                        }

                        tarteaucitron.cookie.number();
                        setInterval(tarteaucitron.cookie.number, 60000);
                    }
                }, defaults.adblocker);

                if (defaults.adblocker === true) {
                    setTimeout(function () {
                        if (tarteaucitronNoAdBlocker === false) {
                            html = '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '" style="display:block">';
                            html += '   <span id="tarteaucitronDisclaimerAlert">';
                            html += '       ' + tarteaucitron.lang.adblock + '<br/>';
                            html += '       <b>' + tarteaucitron.lang.adblock_call + '</b>';
                            html += '   </span>';
                            html += '   <span id="tarteaucitronPersonalize" onclick="location.reload();">';
                            html += '       ' + tarteaucitron.lang.reload;
                            html += '   </span>';
                            html += '</div>';
                            html += '<div id="tarteaucitronPremium"></div>';
                            div.id = 'tarteaucitronRoot';
                            body.appendChild(div, body);
                            div.innerHTML = html;
                            tarteaucitron.pro('!adblocker=true');
                        } else {
                            tarteaucitron.pro('!adblocker=false');
                        }
                    }, 1500);
                }
            });
        });
    },
    "addService": function (serviceId) {
        "use strict";
        var html = '',
            s = tarteaucitron.services,
            service = s[serviceId],
            cookie = tarteaucitron.cookie.read(),
            hostname = document.location.hostname,
            hostRef = document.referrer.split('/')[2],
            isNavigating = (hostRef === hostname) ? true : false,
            isAutostart = (!service.needConsent) ? true : false,
            isWaiting = (cookie.indexOf(service.key + '=wait') >= 0) ? true : false,
            isDenied = (cookie.indexOf(service.key + '=false') >= 0) ? true : false,
            isAllowed = (cookie.indexOf(service.key + '=true') >= 0) ? true : false,
            isResponded = (cookie.indexOf(service.key + '=false') >= 0 || cookie.indexOf(service.key + '=true') >= 0) ? true : false;

        if (tarteaucitron.added[service.key] !== true) {
            tarteaucitron.added[service.key] = true;

            html += '<div id="' + service.key + 'Line" class="tarteaucitronLine">';
            html += '   <div class="tarteaucitronName">';
            html += '       <b>' + service.name + '</b><br/>';
            //modification Yann Jajkiewicz 09/09/2015
            //html += '       <span id="tacCL' + service.key + '" class="tarteaucitronListCookies"></span><br/>';
            html += '       <a href="https://opt-out.ferank.eu/service/' + service.key + '/" target="_blank">';
            html += '           ' + tarteaucitron.lang.more;
            html += '       </a>';
            //modification Yann Jajkiewicz 09/09/2015
            //html += '        - ';
            html += '       <a href="' + service.uri + '" target="_blank">';
            html += '           ' + tarteaucitron.lang.source;
            html += '       </a>';
            html += '   </div>';
            html += '   <div class="tarteaucitronAsk">';
            html += '       <div id="' + service.key + 'Allowed" class="tarteaucitronAllow" onclick="tarteaucitron.userInterface.respond(this, true);">';
            html += '          ' + tarteaucitron.lang.allow;
            html += '       </div> ';
            html += '       <div id="' + service.key + 'Denied" class="tarteaucitronDeny" onclick="tarteaucitron.userInterface.respond(this, false);">';
            html += '          ' + tarteaucitron.lang.deny;
            html += '       </div>';
            html += '   </div>';
            html += '</div>';

            tarteaucitron.userInterface.css('tarteaucitronServicesTitle_' + service.type, 'display', 'block');

            if (document.getElementById('tarteaucitronServices_' + service.type) !== null) {
                document.getElementById('tarteaucitronServices_' + service.type).innerHTML += html;
            }

            tarteaucitron.userInterface.order(service.type);
        }

        // allow by default for non EU
        if (isResponded === false && tarteaucitron.user.bypass === true) {
            isAllowed = true;
            tarteaucitron.cookie.create(service.key, true);
        }

        if ((!isResponded && (isAutostart || (isNavigating && isWaiting)) && !tarteaucitron.highPrivacy) || isAllowed) {
            if (!isAllowed) {
                tarteaucitron.cookie.create(service.key, true);
            }
            if (tarteaucitron.launch[service.key] !== true) {
                tarteaucitron.launch[service.key] = true;
                service.js();
            }
            tarteaucitron.state[service.key] = true;
            tarteaucitron.userInterface.color(service.key, true);
        } else if (isDenied) {
            if (typeof service.fallback === 'function') {
                service.fallback();
            }
            tarteaucitron.state[service.key] = false;
            tarteaucitron.userInterface.color(service.key, false);
        } else if (!isResponded) {
            tarteaucitron.cookie.create(service.key, 'wait');
            if (typeof service.fallback === 'function') {
                service.fallback();
            }
            tarteaucitron.userInterface.color(service.key, 'wait');
            tarteaucitron.userInterface.openAlert();
        }

        tarteaucitron.cookie.checkCount(service.key);
    },
    "cleanArray": function cleanArray(arr) {
        "use strict";
        var i,
            len = arr.length,
            out = [],
            obj = {},
            s = tarteaucitron.services;

        for (i = 0; i < len; i += 1) {
            if (!obj[arr[i]]) {
                obj[arr[i]] = {};
                if (tarteaucitron.services[arr[i]] !== undefined) {
                    out.push(arr[i]);
                }
            }
        }

        out = out.sort(function (a, b) {
            if (s[a].type + s[a].key > s[b].type + s[b].key) { return 1; }
            if (s[a].type + s[a].key < s[b].type + s[b].key) { return -1; }
            return 0;
        });

        return out;
    },
    "userInterface": {
        "css": function (id, property, value) {
            "use strict";
            if (document.getElementById(id) !== null) {
                document.getElementById(id).style[property] = value;
            }
        },
        "respondAll": function (status) {
            "use strict";
            var s = tarteaucitron.services,
                service,
                key,
                index = 0;

            for (index = 0; index < tarteaucitron.job.length; index += 1) {
                service = s[tarteaucitron.job[index]];
                key = service.key;
                if (tarteaucitron.state[key] !== status) {
                    if (status === false && tarteaucitron.launch[key] === true) {
                        tarteaucitron.reloadThePage = true;
                    }
                    if (tarteaucitron.launch[key] !== true && status === true) {
                        tarteaucitron.launch[key] = true;
                        tarteaucitron.services[key].js();
                    }
                    tarteaucitron.state[key] = status;
                    tarteaucitron.cookie.create(key, status);
                    tarteaucitron.userInterface.color(key, status);
                }
            }
        },
        "respond": function (el, status) {
            "use strict";
            var key = el.id.replace(new RegExp("(Eng[0-9]+|Allow|Deni)ed", "g"), '');

            // return if same state
            if (tarteaucitron.state[key] === status) {
                return;
            }

            if (status === false && tarteaucitron.launch[key] === true) {
                tarteaucitron.reloadThePage = true;
            }

            // if not already launched... launch the service
            if (status === true) {
                if (tarteaucitron.launch[key] !== true) {
                    tarteaucitron.launch[key] = true;
                    tarteaucitron.services[key].js();
                }
            }
            tarteaucitron.state[key] = status;
            tarteaucitron.cookie.create(key, status);
            tarteaucitron.userInterface.color(key, status);
        },
        "color": function (key, status) {
            "use strict";
            var gray = '#808080',
                greenDark = '#1B870B',
                greenLight = '#E6FFE2',
                redDark = '#9C1A1A',
                redLight = '#FFE2E2',
                yellowDark = '#FBDA26',
                c = 'tarteaucitron',
                nbDenied = 0,
                nbPending = 0,
                nbAllowed = 0,
                sum = tarteaucitron.job.length,
                index;

            if (status === true) {
                tarteaucitron.userInterface.css(key + 'Line', 'borderLeft', '5px solid ' + greenDark);
                tarteaucitron.userInterface.css(key + 'Allowed', 'backgroundColor', greenDark);
                tarteaucitron.userInterface.css(key + 'Denied', 'backgroundColor', gray);
                //modification Yann Jajkiewicz 09/09/2015
                $('#' + key + 'Allowed').addClass('active');
                $('#' + key + 'Denied').removeClass('active');

            } else if (status === false) {
                tarteaucitron.userInterface.css(key + 'Line', 'borderLeft', '5px solid ' + redDark);
                tarteaucitron.userInterface.css(key + 'Allowed', 'backgroundColor', gray);
                tarteaucitron.userInterface.css(key + 'Denied', 'backgroundColor', redDark);
                //modification Yann Jajkiewicz 09/09/2015
                $('#' + key + 'Denied').addClass('active');
                $('#' + key + 'Allowed').removeClass('active');
            }

            // check if all services are allowed
            for (index = 0; index < sum; index += 1) {
                if (tarteaucitron.state[tarteaucitron.job[index]] === false) {
                    nbDenied += 1;
                } else if (tarteaucitron.state[tarteaucitron.job[index]] === undefined) {
                    nbPending += 1;
                } else if (tarteaucitron.state[tarteaucitron.job[index]] === true) {
                    nbAllowed += 1;
                }
            }

            tarteaucitron.userInterface.css(c + 'DotGreen', 'width', ((100 / sum) * nbAllowed) + '%');
            tarteaucitron.userInterface.css(c + 'DotYellow', 'width', ((100 / sum) * nbPending) + '%');
            tarteaucitron.userInterface.css(c + 'DotRed', 'width', ((100 / sum) * nbDenied) + '%');

            if (nbDenied === 0 && nbPending === 0) {
                tarteaucitron.userInterface.css(c + 'AllAllowed', 'backgroundColor', greenDark);
                tarteaucitron.userInterface.css(c + 'AllDenied', 'backgroundColor', gray);
                $('#' + c + 'AllAllowed').addClass('active');
                $('#' + c + 'AllDenied').removeClass('active');
            } else if (nbAllowed === 0 && nbPending === 0) {
                tarteaucitron.userInterface.css(c + 'AllAllowed', 'backgroundColor', gray);
                tarteaucitron.userInterface.css(c + 'AllDenied', 'backgroundColor', redDark);
                $('#' + c + 'AllAllowed').removeClass('active');
                $('#' + c + 'AllDenied').addClass('active');
            } else {
                tarteaucitron.userInterface.css(c + 'AllAllowed', 'backgroundColor', gray);
                tarteaucitron.userInterface.css(c + 'AllDenied', 'backgroundColor', gray);
                $('#' + c + 'AllAllowed').removeClass('active');
                $('#' + c + 'AllDenied').removeClass('active');
            }

            // close the alert if all service have been reviewed
            if (nbPending === 0) {
                tarteaucitron.userInterface.closeAlert();
            }

            if (tarteaucitron.services[key].cookies.length > 0 && status === false) {
                tarteaucitron.cookie.purge(tarteaucitron.services[key].cookies);
            }

            if (status === true) {
                if (document.getElementById('tacCL' + key) !== null) {
                    document.getElementById('tacCL' + key).innerHTML = '...';
                }
                setTimeout(function () {
                    tarteaucitron.cookie.checkCount(key);
                }, 2500);
            } else {
                tarteaucitron.cookie.checkCount(key);
            }
        },
        "openPanel": function () {
            "use strict";
            tarteaucitron.userInterface.css('tarteaucitron', 'display', 'block');
            tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'block');
            tarteaucitron.userInterface.css('tarteaucitronCookiesListContainer', 'display', 'none');
            tarteaucitron.userInterface.jsSizing('main');
            $('body').addClass('tarteaucitron-open');
        },
        "closePanel": function () {
            "use strict";

            if (document.location.hash === tarteaucitron.hashtag) {
                document.location.hash = '';
            }
            tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none');
            tarteaucitron.userInterface.css('tarteaucitronCookiesListContainer', 'display', 'none');

            tarteaucitron.fallback(['tarteaucitronInfoBox'], function (elem) {
                elem.style.display = 'none';
            }, true);

            if (tarteaucitron.reloadThePage === true) {
                window.location.reload();
            } else {
                tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'none');
            }
            $('body').removeClass('tarteaucitron-open');
        },
        "openAlert": function () {
            "use strict";
            var c = 'tarteaucitron';
            tarteaucitron.userInterface.css(c + 'Percentage', 'display', 'block');
            tarteaucitron.userInterface.css(c + 'AlertSmall', 'display', 'none');
            tarteaucitron.userInterface.css(c + 'AlertBig',   'display', 'block');
        },
        "closeAlert": function () {
            "use strict";
            var c = 'tarteaucitron';
            tarteaucitron.userInterface.css(c + 'Percentage', 'display', 'none');
            tarteaucitron.userInterface.css(c + 'AlertSmall', 'display', 'block');
            tarteaucitron.userInterface.css(c + 'AlertBig',   'display', 'none');
            tarteaucitron.userInterface.jsSizing('box');
        },
        "toggleCookiesList": function () {
            "use strict";
            var div = document.getElementById('tarteaucitronCookiesListContainer');

            if (div === null) {
                return;
            }

            if (div.style.display !== 'block') {
                tarteaucitron.cookie.number();
                div.style.display = 'block';
                tarteaucitron.userInterface.jsSizing('cookie');
                tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none');
                tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'block');
                tarteaucitron.fallback(['tarteaucitronInfoBox'], function (elem) {
                    elem.style.display = 'none';
                }, true);
            } else {
                div.style.display = 'none';
                tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none');
                tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'none');
            }
        },
        "toggle": function (id, closeClass) {
            "use strict";
            var div = document.getElementById(id);

            if (div === null) {
                return;
            }

            if (closeClass !== undefined) {
                tarteaucitron.fallback([closeClass], function (elem) {
                    if (elem.id !== id) {
                        elem.style.display = 'none';
                    }
                }, true);
            }

            if (div.style.display !== 'block') {
                div.style.display = 'block';
            } else {
                div.style.display = 'none';
            }
        },
        "order": function (id) {
            "use strict";
            var main = document.getElementById('tarteaucitronServices_' + id),
                allDivs,
                store = [],
                i;

            if (main === null) {
                return;
            }

            allDivs = main.childNodes;

            if (typeof Array.prototype.map === 'function') {
                Array.prototype.map.call(main.children, Object).sort(function (a, b) {
                    if (tarteaucitron.services[a.id.replace(/Line/g, '')].name > tarteaucitron.services[b.id.replace(/Line/g, '')].name) { return 1; }
                    if (tarteaucitron.services[a.id.replace(/Line/g, '')].name < tarteaucitron.services[b.id.replace(/Line/g, '')].name) { return -1; }
                    return 0;
                }).forEach(function (element) {
                    main.appendChild(element);
                });
            }
        },
        "jsSizing": function (type) {
            "use strict";
            var scrollbarMarginRight = 10,
                scrollbarWidthParent,
                scrollbarWidthChild,
                servicesHeight,
                e = window,
                a = 'inner',
                windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                mainTop,
                mainHeight,
                closeButtonHeight,
                headerHeight,
                cookiesListHeight,
                cookiesCloseHeight,
                cookiesTitleHeight,
                paddingBox,
                alertSmallHeight,
                cookiesNumberHeight;

            if (type === 'box') {
                if (document.getElementById('tarteaucitronAlertSmall') !== null && document.getElementById('tarteaucitronCookiesNumber') !== null) {

                    // reset
                    tarteaucitron.userInterface.css('tarteaucitronCookiesNumber', 'padding', '0px 10px');

                    // calculate
                    alertSmallHeight = document.getElementById('tarteaucitronAlertSmall').offsetHeight;
                    cookiesNumberHeight = document.getElementById('tarteaucitronCookiesNumber').offsetHeight;
                    paddingBox = (alertSmallHeight - cookiesNumberHeight) / 2;

                    // apply
                    tarteaucitron.userInterface.css('tarteaucitronCookiesNumber', 'padding', paddingBox + 'px 10px');
                }
            } else if (type === 'main') {

                // get the real window width for media query
                if (window.innerWidth === undefined) {
                    a = 'client';
                    e = document.documentElement || document.body;
                }

                // height of the services list container
                if (document.getElementById('tarteaucitron') !== null && document.getElementById('tarteaucitronClosePanel') !== null && document.getElementById('tarteaucitronMainLineOffset') !== null) {

                    // reset
                    tarteaucitron.userInterface.css('tarteaucitronScrollbarParent', 'height', 'auto');

                    // calculate
                    mainHeight = document.getElementById('tarteaucitron').offsetHeight;
                    closeButtonHeight = document.getElementById('tarteaucitronClosePanel').offsetHeight;
                    headerHeight = document.getElementById('tarteaucitronMainLineOffset').offsetHeight;

                    // apply
                    servicesHeight = (mainHeight - closeButtonHeight - headerHeight + 1);
                    tarteaucitron.userInterface.css('tarteaucitronScrollbarParent', 'height', servicesHeight + 'px');
                }

                // align the main allow/deny button depending on scrollbar width
                if (document.getElementById('tarteaucitronScrollbarParent') !== null && document.getElementById('tarteaucitronScrollbarChild') !== null) {

                    // media query
                    if (e[a + 'Width'] <= 479) {
                        tarteaucitron.userInterface.css('tarteaucitronScrollbarAdjust', 'marginLeft', '11px');
                    } else if (e[a + 'Width'] <= 767) {
                        scrollbarMarginRight = 12;
                    }

                    scrollbarWidthParent = document.getElementById('tarteaucitronScrollbarParent').offsetWidth;
                    scrollbarWidthChild = document.getElementById('tarteaucitronScrollbarChild').offsetWidth;
                    tarteaucitron.userInterface.css('tarteaucitronScrollbarAdjust', 'marginRight', ((scrollbarWidthParent - scrollbarWidthChild) + scrollbarMarginRight) + 'px');
                }

                // center the main panel
                if (document.getElementById('tarteaucitron') !== null) {

                    // media query
                    if (e[a + 'Width'] <= 767) {
                        mainTop = 0;
                    } else {
                        mainTop = ((windowInnerHeight - document.getElementById('tarteaucitron').offsetHeight) / 2) - 21;
                    }

                    // correct
                    if (mainTop < 0) {
                        mainTop = 0;
                    }

                    if (document.getElementById('tarteaucitronMainLineOffset') !== null) {
                        if (document.getElementById('tarteaucitron').offsetHeight < (windowInnerHeight / 2)) {
                            mainTop -= document.getElementById('tarteaucitronMainLineOffset').offsetHeight;
                        }
                    }

                    // apply
                    tarteaucitron.userInterface.css('tarteaucitron', 'top', mainTop + 'px');
                }


            } else if (type === 'cookie') {

                // put cookies list at bottom
                if (document.getElementById('tarteaucitronAlertSmall') !== null) {
                    tarteaucitron.userInterface.css('tarteaucitronCookiesListContainer', 'bottom', (document.getElementById('tarteaucitronAlertSmall').offsetHeight) + 'px');
                }

                // height of cookies list
                if (document.getElementById('tarteaucitronCookiesListContainer') !== null) {

                    // reset
                    tarteaucitron.userInterface.css('tarteaucitronCookiesList', 'height', 'auto');

                    // calculate
                    cookiesListHeight = document.getElementById('tarteaucitronCookiesListContainer').offsetHeight;
                    cookiesCloseHeight = document.getElementById('tarteaucitronClosePanelCookie').offsetHeight;
                    cookiesTitleHeight = document.getElementById('tarteaucitronCookiesTitle').offsetHeight;

                    // apply
                    tarteaucitron.userInterface.css('tarteaucitronCookiesList', 'height', (cookiesListHeight - cookiesCloseHeight - cookiesTitleHeight - 2) + 'px');
                }
            }
        }
    },
    "cookie": {
        "owner": {},
        "create": function (key, status) {
            "use strict";
            var d = new Date(),
                time = d.getTime(),
                expireTime = time + 31536000000, // 365 days
                regex = new RegExp("!" + key + "=(wait|true|false)", "g"),
                cookie = tarteaucitron.cookie.read().replace(regex, ""),
                value = 'tarteaucitron=' + cookie + '!' + key + '=' + status;

            if (tarteaucitron.cookie.read().indexOf(key + '=' + status) === -1) {
                tarteaucitron.pro('!' + key + '=' + status);
            }

            d.setTime(expireTime);
            document.cookie = value + '; expires=' + d.toGMTString() + '; path=/;';
        },
        "read": function () {
            "use strict";
            var nameEQ = "tarteaucitron=",
                ca = document.cookie.split(';'),
                i,
                c;

            for (i = 0; i < ca.length; i += 1) {
                c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return '';
        },
        "purge": function (arr) {
            "use strict";
            var i;

            for (i = 0; i < arr.length; i += 1) {
                document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;';
                document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' + location.hostname + ';';
                document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' + location.hostname.split('.').slice(-2).join('.') + ';';
            }
        },
        "checkCount": function (key) {
            "use strict";
            var arr = tarteaucitron.services[key].cookies,
                nb = arr.length,
                nbCurrent = 0,
                html = '',
                i,
                status = document.cookie.indexOf(key + '=true');

            if (status >= 0 && nb === 0) {
                //modification Yann Jajkiewicz 09/09/2015
                //html += tarteaucitron.lang.useNoCookie;
            } else if (status >= 0) {
                for (i = 0; i < nb; i += 1) {
                    if (document.cookie.indexOf(arr[i] + '=') !== -1) {
                        nbCurrent += 1;
                        if (tarteaucitron.cookie.owner[arr[i]] === undefined) {
                            tarteaucitron.cookie.owner[arr[i]] = [];
                        }
                        if (tarteaucitron.cookie.crossIndexOf(tarteaucitron.cookie.owner[arr[i]], tarteaucitron.services[key].name) === false) {
                            tarteaucitron.cookie.owner[arr[i]].push(tarteaucitron.services[key].name);
                        }
                    }
                }

                if (nbCurrent > 0) {
                    html += tarteaucitron.lang.useCookieCurrent + ' ' + nbCurrent + ' cookie';
                    if (nbCurrent > 1) {
                        html += 's';
                    }
                    html += '.';
                } else {
                    //modification Yann Jajkiewicz 09/09/2015
                    //html += tarteaucitron.lang.useNoCookie;
                }
            } else if (nb === 0) {
                //modification Yann Jajkiewicz 09/09/2015
                //html = tarteaucitron.lang.noCookie;
            } else {
                html += tarteaucitron.lang.useCookie + ' ' + nb + ' cookie';
                if (nb > 1) {
                    html += 's';
                }
                html += '.';
            }

            if (document.getElementById('tacCL' + key) !== null) {
                document.getElementById('tacCL' + key).innerHTML = html;
            }
        },
        "crossIndexOf": function (arr, match) {
            "use strict";
            var i;
            for (i = 0; i < arr.length; i += 1) {
                if (arr[i] === match) {
                    return true;
                }
            }
            return false;
        },
        "number": function () {
            "use strict";
            var cookies = document.cookie.split(';'),
                nb = (document.cookie !== '') ? cookies.length : 0,
                html = '',
                i,
                name,
                namea,
                nameb,
                c,
                d,
                s = (nb > 1) ? 's' : '',
                savedname,
                regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i,
                regexedDomain = (tarteaucitron.cdn.match(regex) !== null) ? tarteaucitron.cdn.match(regex)[1] : tarteaucitron.cdn,
                host = (tarteaucitron.domain !== undefined) ? tarteaucitron.domain : regexedDomain;

            cookies = cookies.sort(function (a, b) {
                namea = a.split('=', 1).toString().replace(/ /g, '');
                nameb = b.split('=', 1).toString().replace(/ /g, '');
                c = (tarteaucitron.cookie.owner[namea] !== undefined) ? tarteaucitron.cookie.owner[namea] : '0';
                d = (tarteaucitron.cookie.owner[nameb] !== undefined) ? tarteaucitron.cookie.owner[nameb] : '0';
                if (c + a > d + b) { return 1; }
                if (c + a < d + b) { return -1; }
                return 0;
            });

            if (document.cookie !== '') {
                for (i = 0; i < nb; i += 1) {
                    name = cookies[i].split('=', 1).toString().replace(/ /g, '');
                    if (tarteaucitron.cookie.owner[name] !== undefined && tarteaucitron.cookie.owner[name].join(' // ') !== savedname) {
                        savedname = tarteaucitron.cookie.owner[name].join(' // ');
                        html += '<div class="tarteaucitronHidden">';
                        html += '     <div class="tarteaucitronTitle">';
                        html += '        ' + tarteaucitron.cookie.owner[name].join(' // ');
                        html += '    </div>';
                        html += '</div>';
                    } else if (tarteaucitron.cookie.owner[name] === undefined && host !== savedname) {
                        savedname = host;
                        html += '<div class="tarteaucitronHidden">';
                        html += '     <div class="tarteaucitronTitle">';
                        html += '        ' + host;
                        html += '    </div>';
                        html += '</div>';
                    }
                    html += '<div class="tarteaucitronCookiesListMain">';
                    html += '    <div class="tarteaucitronCookiesListLeft"><a href="#" onclick="tarteaucitron.cookie.purge([\'' + cookies[i].split('=', 1) + '\']);tarteaucitron.cookie.number();tarteaucitron.userInterface.jsSizing(\'cookie\');return false"><b>&times;</b></a> <b>' + name + '</b>';
                    html += '    </div>';
                    html += '    <div class="tarteaucitronCookiesListRight">' + cookies[i].split('=').slice(1).join('=') + '</div>';
                    html += '</div>';
                }
            } else {
                html += '<div class="tarteaucitronCookiesListMain">';
                html += '    <div class="tarteaucitronCookiesListLeft"><b>-</b></div>';
                html += '    <div class="tarteaucitronCookiesListRight"></div>';
                html += '</div>';
            }

            html += '<div class="tarteaucitronHidden" style="height:20px;display:block"></div>';

            if (document.getElementById('tarteaucitronCookiesList') !== null) {
                document.getElementById('tarteaucitronCookiesList').innerHTML = html;
            }

            if (document.getElementById('tarteaucitronCookiesNumber') !== null) {
                document.getElementById('tarteaucitronCookiesNumber').innerHTML = nb;
            }

            if (document.getElementById('tarteaucitronCookiesNumberBis') !== null) {
                document.getElementById('tarteaucitronCookiesNumberBis').innerHTML = nb + ' cookie' + s;
            }

            for (i = 0; i < tarteaucitron.job.length; i += 1) {
                tarteaucitron.cookie.checkCount(tarteaucitron.job[i]);
            }
        }
    },
    "getLanguage": function () {
        "use strict";
        if (!navigator) { return 'en'; }

        var availableLanguages = 'en,fr,es,it,de,pt,pl,ru',
            defaultLanguage = 'en',
            lang = navigator.language || navigator.browserLanguage ||
                navigator.systemLanguage || navigator.userLang || null,
            userLanguage = lang.substr(0, 2);

        if (tarteaucitronForceLanguage !== '') {
            if (availableLanguages.indexOf(tarteaucitronForceLanguage) !== -1) {
                return tarteaucitronForceLanguage;
            }
        }

        if (availableLanguages.indexOf(userLanguage) === -1) {
            return defaultLanguage;
        }
        return userLanguage;
    },
    "getLocale": function () {
        "use strict";
        if (!navigator) { return 'en_US'; }

        var lang = navigator.language || navigator.browserLanguage ||
                navigator.systemLanguage || navigator.userLang || null,
            userLanguage = lang.substr(0, 2);

        if (userLanguage === 'fr') {
            return 'fr_FR';
        } else if (userLanguage === 'en') {
            return 'en_US';
        } else if (userLanguage === 'de') {
            return 'de_DE';
        } else if (userLanguage === 'es') {
            return 'es_ES';
        } else if (userLanguage === 'it') {
            return 'it_IT';
        } else if (userLanguage === 'pt') {
            return 'pt_PT';
        } else {
            return 'en_US';
        }
    },
    "addScript": function (url, id, callback, execute) {
        "use strict";
        var script,
            done = false;

        if (execute === false) {
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = (id !== undefined) ? id : '';
            script.async = true;
            script.src = url;

            if (typeof callback === 'function') {
                script.onreadystatechange = script.onload = function () {
                    var state = script.readyState;
                    if (!done && (!state || /loaded|complete/.test(state))) {
                        done = true;
                        callback();
                    }
                };
            }

            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },
    "makeAsync": {
        "antiGhost": 0,
        "buffer": '',
        "init": function (url, id) {
            "use strict";
            var savedWrite = document.write,
                savedWriteln = document.writeln;

            document.write = function (content) {
                tarteaucitron.makeAsync.buffer += content;
            };
            document.writeln = function (content) {
                tarteaucitron.makeAsync.buffer += content.concat("\n");
            };

            setTimeout(function () {
                document.write = savedWrite;
                document.writeln = savedWriteln;
            }, 20000);

            tarteaucitron.makeAsync.getAndParse(url, id);
        },
        "getAndParse": function (url, id) {
            "use strict";
            if (tarteaucitron.makeAsync.antiGhost > 9) {
                tarteaucitron.makeAsync.antiGhost = 0;
                return;
            }
            tarteaucitron.makeAsync.antiGhost += 1;
            tarteaucitron.addScript(url, '', function () {
                if (document.getElementById(id) !== null) {
                    document.getElementById(id).innerHTML += "<span style='display:none'>&nbsp;</span>" + tarteaucitron.makeAsync.buffer;
                    tarteaucitron.makeAsync.buffer = '';
                    tarteaucitron.makeAsync.execJS(id);
                }
            });
        },
        "execJS": function (id) {
            /* not strict because third party scripts may have errors */
            var i,
                scripts,
                childId,
                type;

            if (document.getElementById(id) === null) {
                return;
            }

            scripts = document.getElementById(id).getElementsByTagName('script');
            for (i = 0; i < scripts.length; i += 1) {
                type = (scripts[i].getAttribute('type') !== null) ? scripts[i].getAttribute('type') : '';
                if (type === '') {
                    type = (scripts[i].getAttribute('language') !== null) ? scripts[i].getAttribute('language') : '';
                }
                if (scripts[i].getAttribute('src') !== null && scripts[i].getAttribute('src') !== '') {
                    childId = id + Math.floor(Math.random() * 99999999999);
                    document.getElementById(id).innerHTML += '<div id="' + childId + '"></div>';
                    tarteaucitron.makeAsync.getAndParse(scripts[i].getAttribute('src'), childId);
                } else if (type.indexOf('javascript') !== -1 || type === '') {
                    eval(scripts[i].innerHTML);
                }
            }
        }
    },
    "fallback": function (matchClass, content, noInner) {
        "use strict";
        var elems = document.getElementsByTagName('*'),
            i,
            index = 0;

        for (i in elems) {
            if (elems[i] !== undefined) {
                for (index = 0; index < matchClass.length; index += 1) {
                    if ((' ' + elems[i].className + ' ')
                            .indexOf(' ' + matchClass[index] + ' ') > -1) {
                        if (typeof content === 'function') {
                            if (noInner === true) {
                                content(elems[i]);
                            } else {
                                elems[i].innerHTML = content(elems[i]);
                            }
                        } else {
                            elems[i].innerHTML = content;
                        }
                    }
                }
            }
        }
    },
    "engage": function (id) {
        "use strict";
        var html = '',
            r = Math.floor(Math.random() * 100000);
        if (id == 'facebook') {
          //Le lien pour le partage sur facebook
            // Modifcation de Maël Cormier 20/11/2015 : ajout des balises title dans les liens générés pour Facebook et Twitter
        	// Modification de Maël Cormier 01/12/2015 : ajout de classes spécifiques quand les boutons de partage FB et Twitter sont désactivés depuis la Gestion de cookies
        	// Modificationde Maêl Cormier 15/12/2015 // Ligne 1267 : ajout d'une balise <hr> quand les vidéos sont désactivées
          html += '    <a class="fb_desactivate tac_activate rs-facebook" title="Facebook '+ tarteaucitron.lang.fallback +'" href="#" id="Eng' + r + 'ed' + id + '" data-toggle="modal" data-target="#facebookModal">';
          html += '    </a>';
        } else if (id == 'twitter') {
          //Le lien pour le partage sur twitter
          html += '    <a class="tw_desactivate tac_activate rs-twitter" title="Twitter '+ tarteaucitron.lang.fallback +'" href="#" id="Eng' + r + 'ed' + id + '" data-toggle="modal" data-target="#twitterModal">';
          html += '    </a>';
        } else {
          html += '<div class="tac_activate">';
          html += '   <div class="tac_float">';
          html += '      <b>' + tarteaucitron.services[id].name + '</b> ' + tarteaucitron.lang.fallback;
          html += '      <div class="tarteaucitronAllow" id="Eng' + r + 'ed' + id + '" onclick="tarteaucitron.userInterface.respond(this, true);">';
          html += '          ' + tarteaucitron.lang.allow;
          html += '       </div>';
          html += '   </div>';
          html += '</div>';
          html += '<hr>';
        }
        return html;
    },
    "extend": function (a, b) {
        "use strict";
        var prop;
        for (prop in b) {
            if (b.hasOwnProperty(prop)) {
                a[prop] = b[prop];
            }
        }
    },
    "proTemp": '',
    "proTimer": function () {
        "use strict";
        setTimeout(tarteaucitron.proPing, 1000);
    },
    "pro": function (list) {
        "use strict";
        tarteaucitron.proTemp += list;
        clearTimeout(tarteaucitron.proTimer);
        tarteaucitron.proTimer = setTimeout(tarteaucitron.proPing, 2500);
    },
    "proPing": function () {
        "use strict";
        if (tarteaucitron.uuid !== '' && tarteaucitron.uuid !== undefined && tarteaucitron.proTemp !== '') {
            var div = document.getElementById('tarteaucitronPremium'),
                timestamp = new Date().getTime(),
                url = '//opt-out.ferank.eu/premium.php?';

            if (div === null) {
                return;
            }

            url += 'domain=' + tarteaucitron.domain + '&';
            url += 'uuid=' + tarteaucitron.uuid + '&';
            url += 'c=' + encodeURIComponent(tarteaucitron.proTemp) + '&';
            url += '_' + timestamp;

            div.innerHTML = '<img src="' + url + '" style="display:none" />';

            tarteaucitron.proTemp = '';
        }

        tarteaucitron.cookie.number();
    }
};
;
tarteaucitron.init({
    "hashtag": "#tarteaucitron", /* Ouverture automatique du panel avec le hashtag */
    "highPrivacy": false, /* d�sactiver le consentement implicite (en naviguant) ? */
    "orientation": "top", /* le bandeau doit �tre en haut (top) ou en bas (bottom) ? */
    "adblocker": false, /* Afficher un message si un adblocker est d�tect� */
    "showAlertSmall": false, /* afficher le petit bandeau en bas � droite ? */
    "cookieslist": true, /* Afficher la liste des cookies install�s ? */
    "removeCredit": true /* supprimer le lien vers la source ? */
});


//Scripts de génération dynamique des services Tarteaucitron configurable depuis l'administration >> Gestion des cookies
var ajouts;
var ajouts_split;

(function($) {
	  Drupal.behaviors.cnil_configBehavior = {
	    attach: function (context, settings) {
	      ajouts = Drupal.settings.cnil_config.tarteaucitron;
	      ajouts_split = $.map(ajouts.split(","), $.trim);
	      $.each(ajouts_split,function(key,value){
	    	  (tarteaucitron.job = tarteaucitron.job || []).push(value);
	    	});
	    }
	  };
})(jQuery);


//(tarteaucitron.job = tarteaucitron.job || []).push('youtube');
//(tarteaucitron.job = tarteaucitron.job || []).push('dailymotion');
//(tarteaucitron.job = tarteaucitron.job || []).push('twitter');
//(tarteaucitron.job = tarteaucitron.job || []).push('facebook');



;
/*! Respond.js v1.4.2: min/max-width media query polyfill
 * Copyright 2014 Scott Jehl
 * Licensed under MIT
 * http://j.mp/respondjs */

!function(a){"use strict";a.matchMedia=a.matchMedia||function(a){var b,c=a.documentElement,d=c.firstElementChild||c.firstChild,e=a.createElement("body"),f=a.createElement("div");return f.id="mq-test-1",f.style.cssText="position:absolute;top:-100em",e.style.background="none",e.appendChild(f),function(a){return f.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',c.insertBefore(e,d),b=42===f.offsetWidth,c.removeChild(e),{matches:b,media:a}}}(a.document)}(this),function(a){"use strict";function b(){v(!0)}var c={};a.respond=c,c.update=function(){};var d=[],e=function(){var b=!1;try{b=new a.XMLHttpRequest}catch(c){b=new a.ActiveXObject("Microsoft.XMLHTTP")}return function(){return b}}(),f=function(a,b){var c=e();c&&(c.open("GET",a,!0),c.onreadystatechange=function(){4!==c.readyState||200!==c.status&&304!==c.status||b(c.responseText)},4!==c.readyState&&c.send(null))},g=function(a){return a.replace(c.regex.minmaxwh,"").match(c.regex.other)};if(c.ajax=f,c.queue=d,c.unsupportedmq=g,c.regex={media:/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,keyframes:/@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,comments:/\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,urls:/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,findStyles:/@media *([^\{]+)\{([\S\s]+?)$/,only:/(only\s+)?([a-zA-Z]+)\s?/,minw:/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,maxw:/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,minmaxwh:/\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,other:/\([^\)]*\)/g},c.mediaQueriesSupported=a.matchMedia&&null!==a.matchMedia("only all")&&a.matchMedia("only all").matches,!c.mediaQueriesSupported){var h,i,j,k=a.document,l=k.documentElement,m=[],n=[],o=[],p={},q=30,r=k.getElementsByTagName("head")[0]||l,s=k.getElementsByTagName("base")[0],t=r.getElementsByTagName("link"),u=function(){var a,b=k.createElement("div"),c=k.body,d=l.style.fontSize,e=c&&c.style.fontSize,f=!1;return b.style.cssText="position:absolute;font-size:1em;width:1em",c||(c=f=k.createElement("body"),c.style.background="none"),l.style.fontSize="100%",c.style.fontSize="100%",c.appendChild(b),f&&l.insertBefore(c,l.firstChild),a=b.offsetWidth,f?l.removeChild(c):c.removeChild(b),l.style.fontSize=d,e&&(c.style.fontSize=e),a=j=parseFloat(a)},v=function(b){var c="clientWidth",d=l[c],e="CSS1Compat"===k.compatMode&&d||k.body[c]||d,f={},g=t[t.length-1],p=(new Date).getTime();if(b&&h&&q>p-h)return a.clearTimeout(i),i=a.setTimeout(v,q),void 0;h=p;for(var s in m)if(m.hasOwnProperty(s)){var w=m[s],x=w.minw,y=w.maxw,z=null===x,A=null===y,B="em";x&&(x=parseFloat(x)*(x.indexOf(B)>-1?j||u():1)),y&&(y=parseFloat(y)*(y.indexOf(B)>-1?j||u():1)),w.hasquery&&(z&&A||!(z||e>=x)||!(A||y>=e))||(f[w.media]||(f[w.media]=[]),f[w.media].push(n[w.rules]))}for(var C in o)o.hasOwnProperty(C)&&o[C]&&o[C].parentNode===r&&r.removeChild(o[C]);o.length=0;for(var D in f)if(f.hasOwnProperty(D)){var E=k.createElement("style"),F=f[D].join("\n");E.type="text/css",E.media=D,r.insertBefore(E,g.nextSibling),E.styleSheet?E.styleSheet.cssText=F:E.appendChild(k.createTextNode(F)),o.push(E)}},w=function(a,b,d){var e=a.replace(c.regex.comments,"").replace(c.regex.keyframes,"").match(c.regex.media),f=e&&e.length||0;b=b.substring(0,b.lastIndexOf("/"));var h=function(a){return a.replace(c.regex.urls,"$1"+b+"$2$3")},i=!f&&d;b.length&&(b+="/"),i&&(f=1);for(var j=0;f>j;j++){var k,l,o,p;i?(k=d,n.push(h(a))):(k=e[j].match(c.regex.findStyles)&&RegExp.$1,n.push(RegExp.$2&&h(RegExp.$2))),o=k.split(","),p=o.length;for(var q=0;p>q;q++)l=o[q],g(l)||m.push({media:l.split("(")[0].match(c.regex.only)&&RegExp.$2||"all",rules:n.length-1,hasquery:l.indexOf("(")>-1,minw:l.match(c.regex.minw)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:l.match(c.regex.maxw)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}v()},x=function(){if(d.length){var b=d.shift();f(b.href,function(c){w(c,b.href,b.media),p[b.href]=!0,a.setTimeout(function(){x()},0)})}},y=function(){for(var b=0;b<t.length;b++){var c=t[b],e=c.href,f=c.media,g=c.rel&&"stylesheet"===c.rel.toLowerCase();e&&g&&!p[e]&&(c.styleSheet&&c.styleSheet.rawCssText?(w(c.styleSheet.rawCssText,e,f),p[e]=!0):(!/^([a-zA-Z:]*\/\/)/.test(e)&&!s||e.replace(RegExp.$1,"").split("/")[0]===a.location.host)&&("//"===e.substring(0,2)&&(e=a.location.protocol+e),d.push({href:e,media:f})))}x()};y(),c.update=y,c.getEmValue=u,a.addEventListener?a.addEventListener("resize",b,!1):a.attachEvent&&a.attachEvent("onresize",b)}}(this);;
