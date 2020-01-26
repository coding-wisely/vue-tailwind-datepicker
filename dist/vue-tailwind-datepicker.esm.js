import moment from 'moment';

//

var script = {
    name: "tailwind-vue-datepicker",
    data: function data() {
        return {
            hideCalendar: true,
            today: moment(),
            dateContext: moment(),
            days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            activeIndex: null,
            selectedDate: moment().format(this.dateFormat)
        };
    },
    methods: {
        selectDay: function selectDay(event, index) {
            this.activeIndex = index;
            var target = event.target.innerHTML;
            this.selectedDate = this.formatSelectedDate(target);
            this.$emit("input", this.selectedDate);
        },
        formatSelectedDate: function formatSelectedDate(target) {
            var day = target ? target : this.currentDate;

            var month = moment()
                .month(this.month)
                .format("MM");
            var year = moment()
                .year(this.year)
                .format("YYYY");
            var str = moment(
                year + "-" + month + "-" + day,
                this.dateFormat,
                false
            ).format();
            var selected = moment(str).utcOffset(str);
            return selected.format(this.dateFormat);
        },
        showCalendar: function showCalendar() {
            return (this.hideCalendar = !this.hideCalendar);
        },
        addMonth: function addMonth() {
            this.dateContext = moment(this.dateContext).add(1, "month");
        },
        subtractMonth: function subtractMonth() {
            this.dateContext = moment(this.dateContext).subtract(1, "month");
        }
    },
    computed: {
        year: function year() {
            return this.dateContext.format("Y");
        },
        month: function month() {
            return this.dateContext.format("MMMM");
        },
        daysInMonth: function daysInMonth() {
            return this.dateContext.daysInMonth();
        },
        currentDate: function currentDate() {
            return this.dateContext.get("date");
        },
        firstDayOfMonth: function firstDayOfMonth() {
            var firstDay = moment(this.dateContext).subtract(
                this.currentDate - 1,
                "days"
            );
            return firstDay.weekday();
        },
        initialDate: function initialDate() {
            return this.today.get("date");
        },
        initialMonth: function initialMonth() {
            return this.today.format("MMMM");
        },
        initialYear: function () {
            return this.today.format("Y");
        }
    },
    props: {
        pickerWrapperClasses: {
            type: String,
            default: "w-64"
        },
        inputFieldClasses: {
            type: String,
            default:
                "focus:outline-none cursor-pointer  w-full bg-white h-12 p-3 border-b border-purple-300 text-lg font-medium text-gray-700"
        },
        pickerMonthSelectionClasses: {
            type: String,
            default: "flex justify-between h-12 w-full p-2 items-center bg-purple-100 uppercase"
        },
        pickerDaysHeaderClasses: {
            type: String,
            default: "flex w-full w-full justify-start text-center p-2"
        },
        calendarWrapperClasses: {
            type: String,
            default: "flex w-full border-l border-r border-b border-purple-100 justify-start text-center flex-wrap"
        },
        selectedDayClasses: {
            type: String,
            default: "bg-purple-500 text-white"
        },
        currentDayClasses: {
            type: String,
            default: "bg-purple-300 text-white"
        },
        dateFormat: {
            type: String,
            default: "YYYY-MM-DD"
        },
        preselectedDay: {
            type: Number
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
          attrs: { type: "text", placeholder: "Date" },
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
                            fill: "none",
                            d:
                              "M8.388 10.049l4.76-4.873a.783.783 0 00-1.117-1.093L6.726 9.516a.78.78 0 00.012 1.105l5.433 5.307a.784.784 0 001.106-.013.78.78 0 00-.012-1.104l-4.877-4.762z"
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
                          fill: "none",
                          d:
                            "M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"
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
    inject("data-v-fd8d529c_0", { source: "\n.calendar-day-box[data-v-fd8d529c] {\n    width: 13.3%;\n}\n.svg-icon[data-v-fd8d529c] {\n    width: 1em;\n    height: 1em;\n}\n.svg-icon path[data-v-fd8d529c],\n.svg-icon polygon[data-v-fd8d529c],\n.svg-icon rect[data-v-fd8d529c] {\n    fill: #4691f6;\n}\n.svg-icon circle[data-v-fd8d529c] {\n    stroke: #4691f6;\n    stroke-width: 1;\n}\n.slide-leave-active[data-v-fd8d529c],\n.slide-enter-active[data-v-fd8d529c] {\n    transition: 1s;\n}\n.slide-enter[data-v-fd8d529c] {\n    transform: translate(-100%, 0);\n}\n.slide-leave-to[data-v-fd8d529c] {\n    transform: translate(-100%, 0);\n}\n.open[data-v-fd8d529c] {\n    left: 0;\n    transition: all 0.3s ease;\n}\n", map: {"version":3,"sources":["/Users/vladimir/Projects/npm/vue-tailwind-datepicker/src/vue-tailwind-datepicker.vue"],"names":[],"mappings":";AA4LA;IACA,YAAA;AACA;AAEA;IACA,UAAA;IACA,WAAA;AACA;AAEA;;;IAGA,aAAA;AACA;AAEA;IACA,eAAA;IACA,eAAA;AACA;AAEA;;IAEA,cAAA;AACA;AAEA;IACA,8BAAA;AACA;AAEA;IACA,8BAAA;AACA;AAEA;IACA,OAAA;IACA,yBAAA;AACA","file":"vue-tailwind-datepicker.vue","sourcesContent":["<template>\n    <div :class=\"pickerWrapperClasses\">\n      <label>\n        <input\n                type=\"text\"\n                placeholder=\"Date\"\n                :class=\"inputFieldClasses\"\n                @click=\"showCalendar\"\n                v-model=\"selectedDate\"\n        />\n      </label>\n      <transition name=\"slide\">\n            <div\n                    v-if=\"!hideCalendar\"\n                    :class=\"[hideCalendar ? 'hidden' : 'open' , calendarWrapperClasses]\"\n            >\n                <div :class=\"pickerMonthSelectionClasses\">\n                    <span role=\"button\">\n                      <svg @click=\"subtractMonth\" class=\"svg-icon\">\n                        <path\n                                fill=\"none\"\n                                d=\"M8.388 10.049l4.76-4.873a.783.783 0 00-1.117-1.093L6.726 9.516a.78.78 0 00.012 1.105l5.433 5.307a.784.784 0 001.106-.013.78.78 0 00-.012-1.104l-4.877-4.762z\"\n                        />\n                      </svg>\n                    </span>\n                    <div>{{month + ' ' + year}}</div>\n                    <svg @click=\"addMonth\" class=\"svg-icon\" role=\"button\">\n                        <path\n                                fill=\"none\"\n                                d=\"M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z\"\n                        />\n                    </svg>\n                </div>\n                <div :class=\"pickerDaysHeaderClasses\">\n                    <div\n                            class=\"calendar-day-box\"\n                            v-for=\"(day, index) in days\"\n                            :key=\"'day-' + index + '-' + day\"\n                    >{{ day }}\n                    </div>\n                </div>\n                <div :class=\"calendarWrapperClasses\">\n                    <div\n                            class=\"calendar-day-box\"\n                            v-for=\"(blank, index) in firstDayOfMonth\"\n                            :key=\"'day-' + blank + '-' + index\"\n                    ></div>\n                    <div\n                            class=\"calendar-day-box text-center\"\n                            v-for=\"(date, index) in daysInMonth\"\n                            :key=\"'day-' + index \"\n                            :class=\"[[index === activeIndex ?selectedDayClasses:(date === initialDate && month === initialMonth && year === initialYear) ? currentDayClasses :  '']] \"\n                    >\n            <span\n                    ref=\"day\"\n                    role=\"button\"\n                    :class=\"[index === activeIndex ?selectedDayClasses:''] \"\n                    @click=\"selectDay($event, index)\"\n            >{{ date }}</span>\n                    </div>\n                </div>\n            </div>\n        </transition>\n    </div>\n</template>\n\n<script>\n    import moment from \"moment\";\n\n    export default {\n        name: \"tailwind-vue-datepicker\",\n        data() {\n            return {\n                hideCalendar: true,\n                today: moment(),\n                dateContext: moment(),\n                days: [\"Su\", \"Mo\", \"Tu\", \"We\", \"Th\", \"Fr\", \"Sa\"],\n                activeIndex: null,\n                selectedDate: moment().format(this.dateFormat)\n            };\n        },\n        methods: {\n            selectDay(event, index) {\n                this.activeIndex = index;\n                let target = event.target.innerHTML;\n                this.selectedDate = this.formatSelectedDate(target);\n                this.$emit(\"input\", this.selectedDate);\n            },\n            formatSelectedDate(target) {\n                let day = target ? target : this.currentDate;\n\n                let month = moment()\n                    .month(this.month)\n                    .format(\"MM\");\n                let year = moment()\n                    .year(this.year)\n                    .format(\"YYYY\");\n                let str = moment(\n                    year + \"-\" + month + \"-\" + day,\n                    this.dateFormat,\n                    false\n                ).format();\n                let selected = moment(str).utcOffset(str);\n                return selected.format(this.dateFormat);\n            },\n            showCalendar() {\n                return (this.hideCalendar = !this.hideCalendar);\n            },\n            addMonth() {\n                this.dateContext = moment(this.dateContext).add(1, \"month\");\n            },\n            subtractMonth() {\n                this.dateContext = moment(this.dateContext).subtract(1, \"month\");\n            }\n        },\n        computed: {\n            year() {\n                return this.dateContext.format(\"Y\");\n            },\n            month() {\n                return this.dateContext.format(\"MMMM\");\n            },\n            daysInMonth() {\n                return this.dateContext.daysInMonth();\n            },\n            currentDate() {\n                return this.dateContext.get(\"date\");\n            },\n            firstDayOfMonth() {\n                let firstDay = moment(this.dateContext).subtract(\n                    this.currentDate - 1,\n                    \"days\"\n                );\n                return firstDay.weekday();\n            },\n            initialDate() {\n                return this.today.get(\"date\");\n            },\n            initialMonth() {\n                return this.today.format(\"MMMM\");\n            },\n            initialYear: function () {\n                return this.today.format(\"Y\");\n            }\n        },\n        props: {\n            pickerWrapperClasses: {\n                type: String,\n                default: \"w-64\"\n            },\n            inputFieldClasses: {\n                type: String,\n                default:\n                    \"focus:outline-none cursor-pointer  w-full bg-white h-12 p-3 border-b border-purple-300 text-lg font-medium text-gray-700\"\n            },\n            pickerMonthSelectionClasses: {\n                type: String,\n                default: \"flex justify-between h-12 w-full p-2 items-center bg-purple-100 uppercase\"\n            },\n            pickerDaysHeaderClasses: {\n                type: String,\n                default: \"flex w-full w-full justify-start text-center p-2\"\n            },\n            calendarWrapperClasses: {\n                type: String,\n                default: \"flex w-full border-l border-r border-b border-purple-100 justify-start text-center flex-wrap\"\n            },\n            selectedDayClasses: {\n                type: String,\n                default: \"bg-purple-500 text-white\"\n            },\n            currentDayClasses: {\n                type: String,\n                default: \"bg-purple-300 text-white\"\n            },\n            dateFormat: {\n                type: String,\n                default: \"YYYY-MM-DD\"\n            },\n            preselectedDay: {\n                type: Number\n            }\n        }\n    };\n</script>\n\n<style scoped>\n\n    .calendar-day-box {\n        width: 13.3%;\n    }\n\n    .svg-icon {\n        width: 1em;\n        height: 1em;\n    }\n\n    .svg-icon path,\n    .svg-icon polygon,\n    .svg-icon rect {\n        fill: #4691f6;\n    }\n\n    .svg-icon circle {\n        stroke: #4691f6;\n        stroke-width: 1;\n    }\n\n    .slide-leave-active,\n    .slide-enter-active {\n        transition: 1s;\n    }\n\n    .slide-enter {\n        transform: translate(-100%, 0);\n    }\n\n    .slide-leave-to {\n        transform: translate(-100%, 0);\n    }\n\n    .open {\n        left: 0;\n        transition: all 0.3s ease;\n    }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-fd8d529c";
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

export default __vue_component__;
export { install };
