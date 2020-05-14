(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('moment')) :
  typeof define === 'function' && define.amd ? define(['exports', 'moment'], factory) :
  (global = global || self, factory(global.VueTailwindDatepicker = {}, global.moment));
}(this, (function (exports, moment) { 'use strict';

  moment = moment && Object.prototype.hasOwnProperty.call(moment, 'default') ? moment['default'] : moment;

  //

  var script = {
    name: 'tailwind-vue-datepicker',
    data: function data () {
      return {
        hideCalendar: true,
        today: moment(),
        dateContext: moment(),
        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        activeIndex: null,
        selectedDate: moment().format(this.dateFormat)
      }
    },
    methods: {
      selectDay: function selectDay (event, index) {
        this.activeIndex = index;
        var target = event.target.innerHTML;
        this.selectedDate = this.formatSelectedDate(target);
        this.$emit('input', this.selectedDate);
        if(this.closeOnClick){
          this.hideCalendar = true;
        }
      },
      formatSelectedDate: function formatSelectedDate (target) {
        var day = target ? target : this.currentDate;

        var month = moment()
        .month(this.month)
        .format('MM');
        var year = moment()
        .year(this.year)
        .format('YYYY');
        var str = moment(
          year + '-' + month + '-' + day,
          this.dateFormat,
          false
        ).format();
        var selected = moment(str).utcOffset(str);
        return selected.format(this.dateFormat)
      },
      showCalendar: function showCalendar () {
        return (this.hideCalendar = !this.hideCalendar)
      },
      addMonth: function addMonth () {
        this.dateContext = moment(this.dateContext).add(1, 'month');
      },
      subtractMonth: function subtractMonth () {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
      }
    },
    computed: {
      year: function year () {
        return this.dateContext.format('Y')
      },
      month: function month () {
        return this.dateContext.format('MMMM')
      },
      daysInMonth: function daysInMonth () {
        return this.dateContext.daysInMonth()
      },
      currentDate: function currentDate () {
        return this.dateContext.get('date')
      },
      firstDayOfMonth: function firstDayOfMonth () {
        var firstDay = moment(this.dateContext).subtract(
          this.currentDate - 1,
          'days'
        );
        return firstDay.weekday()
      },
      initialDate: function initialDate () {
        return this.today.get('date')
      },
      initialMonth: function initialMonth () {
        return this.today.format('MMMM')
      },
      initialYear: function () {
        return this.today.format('Y')
      }
    },
    mounted: function mounted() {
      if (this.value.length > 0) {
        this.selectedDate = this.value;
      }
    },
    props: {
      pickerWrapperClasses: {
        type: String,
        default: 'w-64'
      },
      inputFieldClasses: {
        type: String,
        default:
          'focus:outline-none cursor-pointer  w-full bg-white h-12 p-3 border-b border-purple-300 text-lg font-medium text-gray-700'
      },
      pickerMonthSelectionClasses: {
        type: String,
        default: 'flex justify-between h-12 w-full p-2 items-center bg-purple-100 uppercase'
      },
      pickerDaysHeaderClasses: {
        type: String,
        default: 'flex w-full w-full justify-start text-center p-2'
      },
      calendarWrapperClasses: {
        type: String,
        default: 'flex w-full border-l border-r border-b border-purple-100 justify-start text-center flex-wrap'
      },
      selectedDayClasses: {
        type: String,
        default: 'bg-purple-500 text-white'
      },
      currentDayClasses: {
        type: String,
        default: 'bg-purple-300 text-white'
      },
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      preselectedDay: {
        type: Number
      },
      closeOnClick: {
        type: Boolean,
        default: true
      },
      value: {
        type: String,
        default: ''
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { class: _vm.pickerWrapperClasses },
      [
        _c("label", [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.selectedDate,
                expression: "selectedDate"
              }
            ],
            class: _vm.inputFieldClasses,
            attrs: { placeholder: "Date", type: "text" },
            domProps: { value: _vm.selectedDate },
            on: {
              click: _vm.showCalendar,
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.selectedDate = $event.target.value;
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("transition", { attrs: { name: "slide" } }, [
          !_vm.hideCalendar
            ? _c(
                "div",
                {
                  class: [
                    _vm.hideCalendar ? "hidden" : "open",
                    _vm.calendarWrapperClasses
                  ]
                },
                [
                  _c("div", { class: _vm.pickerMonthSelectionClasses }, [
                    _c("span", { attrs: { role: "button" } }, [
                      _c(
                        "svg",
                        {
                          staticClass: "svg-icon",
                          on: { click: _vm.subtractMonth }
                        },
                        [
                          _c("path", {
                            attrs: {
                              d:
                                "M8.388 10.049l4.76-4.873a.783.783 0 00-1.117-1.093L6.726 9.516a.78.78 0 00.012 1.105l5.433 5.307a.784.784 0 001.106-.013.78.78 0 00-.012-1.104l-4.877-4.762z",
                              fill: "none"
                            }
                          })
                        ]
                      )
                    ]),
                    _vm._v(" "),
                    _c("div", [_vm._v(_vm._s(_vm.month + " " + _vm.year))]),
                    _vm._v(" "),
                    _c(
                      "svg",
                      {
                        staticClass: "svg-icon",
                        attrs: { role: "button" },
                        on: { click: _vm.addMonth }
                      },
                      [
                        _c("path", {
                          attrs: {
                            d:
                              "M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z",
                            fill: "none"
                          }
                        })
                      ]
                    )
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { class: _vm.pickerDaysHeaderClasses },
                    _vm._l(_vm.days, function(day, index) {
                      return _c(
                        "div",
                        {
                          key: "day-" + index + "-" + day,
                          staticClass: "calendar-day-box"
                        },
                        [_vm._v(_vm._s(day) + "\n                ")]
                      )
                    }),
                    0
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { class: _vm.calendarWrapperClasses },
                    [
                      _vm._l(_vm.firstDayOfMonth, function(blank, index) {
                        return _c("div", {
                          key: "day-" + blank + "-" + index,
                          staticClass: "calendar-day-box"
                        })
                      }),
                      _vm._v(" "),
                      _vm._l(_vm.daysInMonth, function(date, index) {
                        return _c(
                          "div",
                          {
                            key: "day-" + index,
                            staticClass: "calendar-day-box text-center",
                            class: [
                              [
                                index === _vm.activeIndex
                                  ? _vm.selectedDayClasses
                                  : date === _vm.initialDate &&
                                    _vm.month === _vm.initialMonth &&
                                    _vm.year === _vm.initialYear
                                  ? _vm.currentDayClasses
                                  : ""
                              ]
                            ]
                          },
                          [
                            _c(
                              "span",
                              {
                                ref: "day",
                                refInFor: true,
                                class: [
                                  index === _vm.activeIndex
                                    ? _vm.selectedDayClasses
                                    : ""
                                ],
                                attrs: { role: "button" },
                                on: {
                                  click: function($event) {
                                    return _vm.selectDay($event, index)
                                  }
                                }
                              },
                              [_vm._v(_vm._s(date))]
                            )
                          ]
                        )
                      })
                    ],
                    2
                  )
                ]
              )
            : _vm._e()
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-b88f25b4_0", { source: "\n.calendar-day-box[data-v-b88f25b4] {\n    width: 13.3%;\n}\n.svg-icon[data-v-b88f25b4] {\n    width: 1em;\n    height: 1em;\n}\n.svg-icon path[data-v-b88f25b4],\n.svg-icon polygon[data-v-b88f25b4],\n.svg-icon rect[data-v-b88f25b4] {\n    fill: #4691f6;\n}\n.svg-icon circle[data-v-b88f25b4] {\n    stroke: #4691f6;\n    stroke-width: 1;\n}\n.slide-leave-active[data-v-b88f25b4],\n.slide-enter-active[data-v-b88f25b4] {\n    transition: 1s;\n}\n.slide-enter[data-v-b88f25b4] {\n    transform: translate(-100%, 0);\n}\n.slide-leave-to[data-v-b88f25b4] {\n    transform: translate(-100%, 0);\n}\n.open[data-v-b88f25b4] {\n    left: 0;\n    transition: all 0.3s ease;\n}\n", map: {"version":3,"sources":["D:\\Users\\ben\\Development\\Code\\vue-tailwind-datepicker\\src\\vue-tailwind-datepicker.vue"],"names":[],"mappings":";AA4MA;IACA,YAAA;AACA;AAEA;IACA,UAAA;IACA,WAAA;AACA;AAEA;;;IAGA,aAAA;AACA;AAEA;IACA,eAAA;IACA,eAAA;AACA;AAEA;;IAEA,cAAA;AACA;AAEA;IACA,8BAAA;AACA;AAEA;IACA,8BAAA;AACA;AAEA;IACA,OAAA;IACA,yBAAA;AACA","file":"vue-tailwind-datepicker.vue","sourcesContent":["<template>\r\n    <div :class=\"pickerWrapperClasses\">\r\n        <label>\r\n            <input\r\n                    :class=\"inputFieldClasses\"\r\n                    @click=\"showCalendar\"\r\n                    placeholder=\"Date\"\r\n                    type=\"text\"\r\n                    v-model=\"selectedDate\"\r\n            />\r\n        </label>\r\n        <transition name=\"slide\">\r\n            <div\r\n                    :class=\"[hideCalendar ? 'hidden' : 'open' , calendarWrapperClasses]\"\r\n                    v-if=\"!hideCalendar\"\r\n            >\r\n                <div :class=\"pickerMonthSelectionClasses\">\r\n                    <span role=\"button\">\r\n                      <svg @click=\"subtractMonth\" class=\"svg-icon\">\r\n                        <path\r\n                                d=\"M8.388 10.049l4.76-4.873a.783.783 0 00-1.117-1.093L6.726 9.516a.78.78 0 00.012 1.105l5.433 5.307a.784.784 0 001.106-.013.78.78 0 00-.012-1.104l-4.877-4.762z\"\r\n                                fill=\"none\"\r\n                        />\r\n                      </svg>\r\n                    </span>\r\n                    <div>{{month + ' ' + year}}</div>\r\n                    <svg @click=\"addMonth\" class=\"svg-icon\" role=\"button\">\r\n                        <path\r\n                                d=\"M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z\"\r\n                                fill=\"none\"\r\n                        />\r\n                    </svg>\r\n                </div>\r\n                <div :class=\"pickerDaysHeaderClasses\">\r\n                    <div\r\n                            :key=\"'day-' + index + '-' + day\"\r\n                            class=\"calendar-day-box\"\r\n                            v-for=\"(day, index) in days\"\r\n                    >{{ day }}\r\n                    </div>\r\n                </div>\r\n                <div :class=\"calendarWrapperClasses\">\r\n                    <div\r\n                            :key=\"'day-' + blank + '-' + index\"\r\n                            class=\"calendar-day-box\"\r\n                            v-for=\"(blank, index) in firstDayOfMonth\"\r\n                    ></div>\r\n                    <div\r\n                            :class=\"[[index === activeIndex ?selectedDayClasses:(date === initialDate && month === initialMonth && year === initialYear) ? currentDayClasses :  '']] \"\r\n                            :key=\"'day-' + index \"\r\n                            class=\"calendar-day-box text-center\"\r\n                            v-for=\"(date, index) in daysInMonth\"\r\n                    >\r\n            <span\r\n                    :class=\"[index === activeIndex ?selectedDayClasses:''] \"\r\n                    @click=\"selectDay($event, index)\"\r\n                    ref=\"day\"\r\n                    role=\"button\"\r\n            >{{ date }}</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </transition>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n  import moment from 'moment'\r\n\r\n  export default {\r\n    name: 'tailwind-vue-datepicker',\r\n    data () {\r\n      return {\r\n        hideCalendar: true,\r\n        today: moment(),\r\n        dateContext: moment(),\r\n        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],\r\n        activeIndex: null,\r\n        selectedDate: moment().format(this.dateFormat)\r\n      }\r\n    },\r\n    methods: {\r\n      selectDay (event, index) {\r\n        this.activeIndex = index\r\n        let target = event.target.innerHTML\r\n        this.selectedDate = this.formatSelectedDate(target)\r\n        this.$emit('input', this.selectedDate)\r\n        if(this.closeOnClick){\r\n          this.hideCalendar = true;\r\n        }\r\n      },\r\n      formatSelectedDate (target) {\r\n        let day = target ? target : this.currentDate\r\n\r\n        let month = moment()\r\n        .month(this.month)\r\n        .format('MM')\r\n        let year = moment()\r\n        .year(this.year)\r\n        .format('YYYY')\r\n        let str = moment(\r\n          year + '-' + month + '-' + day,\r\n          this.dateFormat,\r\n          false\r\n        ).format()\r\n        let selected = moment(str).utcOffset(str)\r\n        return selected.format(this.dateFormat)\r\n      },\r\n      showCalendar () {\r\n        return (this.hideCalendar = !this.hideCalendar)\r\n      },\r\n      addMonth () {\r\n        this.dateContext = moment(this.dateContext).add(1, 'month')\r\n      },\r\n      subtractMonth () {\r\n        this.dateContext = moment(this.dateContext).subtract(1, 'month')\r\n      }\r\n    },\r\n    computed: {\r\n      year () {\r\n        return this.dateContext.format('Y')\r\n      },\r\n      month () {\r\n        return this.dateContext.format('MMMM')\r\n      },\r\n      daysInMonth () {\r\n        return this.dateContext.daysInMonth()\r\n      },\r\n      currentDate () {\r\n        return this.dateContext.get('date')\r\n      },\r\n      firstDayOfMonth () {\r\n        let firstDay = moment(this.dateContext).subtract(\r\n          this.currentDate - 1,\r\n          'days'\r\n        )\r\n        return firstDay.weekday()\r\n      },\r\n      initialDate () {\r\n        return this.today.get('date')\r\n      },\r\n      initialMonth () {\r\n        return this.today.format('MMMM')\r\n      },\r\n      initialYear: function () {\r\n        return this.today.format('Y')\r\n      }\r\n    },\r\n    mounted() {\r\n      if (this.value.length > 0) {\r\n        this.selectedDate = this.value;\r\n      }\r\n    },\r\n    props: {\r\n      pickerWrapperClasses: {\r\n        type: String,\r\n        default: 'w-64'\r\n      },\r\n      inputFieldClasses: {\r\n        type: String,\r\n        default:\r\n          'focus:outline-none cursor-pointer  w-full bg-white h-12 p-3 border-b border-purple-300 text-lg font-medium text-gray-700'\r\n      },\r\n      pickerMonthSelectionClasses: {\r\n        type: String,\r\n        default: 'flex justify-between h-12 w-full p-2 items-center bg-purple-100 uppercase'\r\n      },\r\n      pickerDaysHeaderClasses: {\r\n        type: String,\r\n        default: 'flex w-full w-full justify-start text-center p-2'\r\n      },\r\n      calendarWrapperClasses: {\r\n        type: String,\r\n        default: 'flex w-full border-l border-r border-b border-purple-100 justify-start text-center flex-wrap'\r\n      },\r\n      selectedDayClasses: {\r\n        type: String,\r\n        default: 'bg-purple-500 text-white'\r\n      },\r\n      currentDayClasses: {\r\n        type: String,\r\n        default: 'bg-purple-300 text-white'\r\n      },\r\n      dateFormat: {\r\n        type: String,\r\n        default: 'YYYY-MM-DD'\r\n      },\r\n      preselectedDay: {\r\n        type: Number\r\n      },\r\n      closeOnClick: {\r\n        type: Boolean,\r\n        default: true\r\n      },\r\n      value: {\r\n        type: String,\r\n        default: ''\r\n      }\r\n    }\r\n  }\r\n</script>\r\n\r\n<style scoped>\r\n\r\n    .calendar-day-box {\r\n        width: 13.3%;\r\n    }\r\n\r\n    .svg-icon {\r\n        width: 1em;\r\n        height: 1em;\r\n    }\r\n\r\n    .svg-icon path,\r\n    .svg-icon polygon,\r\n    .svg-icon rect {\r\n        fill: #4691f6;\r\n    }\r\n\r\n    .svg-icon circle {\r\n        stroke: #4691f6;\r\n        stroke-width: 1;\r\n    }\r\n\r\n    .slide-leave-active,\r\n    .slide-enter-active {\r\n        transition: 1s;\r\n    }\r\n\r\n    .slide-enter {\r\n        transform: translate(-100%, 0);\r\n    }\r\n\r\n    .slide-leave-to {\r\n        transform: translate(-100%, 0);\r\n    }\r\n\r\n    .open {\r\n        left: 0;\r\n        transition: all 0.3s ease;\r\n    }\r\n</style>\r\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-b88f25b4";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  // Import vue component
  // Declare install function executed by Vue.use()
  function install(Vue) {
      if (install.installed) { return; }
      install.installed = true;
      Vue.component('VueTailwindDatepicker', __vue_component__);
  }

  // Create module definition for Vue.use()
  var plugin = {
      install: install,
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
      GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
      GlobalVue = global.Vue;
  }
  if (GlobalVue) {
      GlobalVue.use(plugin);
  }

  exports.default = __vue_component__;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
