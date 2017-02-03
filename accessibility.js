define("github/accessibility", ["exports", "./inspect"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            e.prototype = new Error, e.prototype.constructor = e
        }

        function r(e) {
            this.name = "ImageWithoutAltAttributeError", this.stack = (new Error).stack, this.element = e, this.message = "Missing alt attribute on " + h["default"](e)
        }

        function a(e) {
            this.name = "LinkWithoutLabelError", this.stack = (new Error).stack, this.element = e, this.message = "Missing text, title, or aria-label attribute on " + h["default"](e)
        }

        function s(e) {
            this.name = "LinkWithoutLabelOrRoleError", this.stack = (new Error).stack, this.element = e, this.message = "Missing href or role=button on " + h["default"](e)
        }

        function o(e) {
            this.name = "LabelMissingControl", this.stack = (new Error).stack, this.element = e, this.message = "Label missing control on " + h["default"](e)
        }

        function u(e) {
            this.name = "ButtonWithoutLabelError", this.stack = (new Error).stack, this.element = e, this.message = "Missing text or aria-label attribute on " + h["default"](e)
        }

        function l(e) {
            return "true" === e.getAttribute("aria-hidden") || e.closest('[aria-hidden="true"]')
        }

        function c(e) {
            return "string" == typeof e && !!e.trim()
        }

        function d(e) {
            switch (e.nodeType) {
                case Node.ELEMENT_NODE:
                    if (c(e.getAttribute("alt")) || c(e.getAttribute("aria-label")) || c(e.getAttribute("title"))) return !0;
                    for (var t = e.childNodes, n = 0; n < t.length; n++) {
                        var i = t[n];
                        if (d(i)) return !0
                    }
                    break;
                case Node.TEXT_NODE:
                    return c(e.data)
            }
        }

        function f(e, t) {
            for (var n = e.querySelectorAll("img"), i = 0; i < n.length; i++) {
                var c = n[i];
                c.hasAttribute("alt") || t(new r(c))
            }
            for (var f = e.querySelectorAll("a"), h = 0; h < f.length; h++) {
                var m = f[h];
                if (m.hasAttribute("name") || l(m)) return;
                null == m.getAttribute("href") && "button" !== m.getAttribute("role") ? t(new s(m)) : d(m) || t(new a(m))
            }
            for (var v = e.querySelectorAll("button"), p = 0; p < v.length; p++) {
                var g = v[p];
                l(g) || d(g) || t(new u(g))
            }
            for (var b = e.querySelectorAll("label"), y = 0; y < b.length; y++) {
                var j = b[y],
                    w = j.control || document.getElementById(j.getAttribute("for")) || j.querySelector("input");
                w || t(new o(j))
            }
            for (var x = e.querySelectorAll("input[type=text], textarea"), S = 0; S < x.length; S++) {
                var k = x[S];
                !k.labels || k.labels.length || l(k) || k.hasAttribute("aria-label") || t(new a(k))
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.scanForProblems = f;
        var h = n(t);
        i(r), i(a), i(s), i(o), i(u)
    }), define("github/accessibility-report", ["./document-ready", "./failbot", "./accessibility"], function(e, t, n) {
        function i(e) {
            return document.body.classList.contains("zhio") || e.element.classList.contains("zh-login-status") || e.element.closest("#window-resizer-tooltip") || e.element.closest(".octotree_sidebar") || e.element.closest(".markdown-body")
        }

        function r(e) {
            if (!i(e)) {
                document.documentElement.classList.contains("is-staff") && console.warn(e.name + ": " + e.message);
                var n = document.querySelector("meta[name=accessibility-logger]");
                n && "1" === n.getAttribute("value") && t.reportError(e, {
                    bucket: "github-accessibility",
                    message: e.message,
                    "class": e.name
                })
            }
        }
        e.ready.then(function() {
            requestIdleCallback(function() {
                n.scanForProblems(document, r)
            })
        }), document.addEventListener("pjax:end", function(e) {
            requestIdleCallback(function() {
                n.scanForProblems(e.target, r)
            })
        })
    }), define("github/branches", ["delegated-events", "./jquery", "./sliding-promise-queue", "./throttled-input", "./fetch", "./hotkey", "./observe", "./history"], function(e, t, n, i, r, a, s, o) {
        function u(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function l(e) {
            var t = e.form;
            if (e.value.trim()) {
                var n = new URL(t.action, window.location.origin),
                    i = new URLSearchParams(n.search.slice(1));
                return i.append("utf8", t.elements.utf8.value), i.append("query", e.value), n.search = i.toString(), n.toString()
            }
            return t.getAttribute("data-reset-url")
        }

        function c(e) {
            function t() {
                i.classList.remove("is-loading")
            }
            var n = e.form,
                i = n.closest(".js-branches"),
                a = i.querySelectorAll(".js-branches-subnav .js-subnav-item"),
                s = i.querySelector(".js-branches-subnav .js-subnav-item.selected"),
                u = i.querySelector(".js-branches-subnav .js-branches-all"),
                c = n.getAttribute("data-results-container");
            v || (v = s);
            var d = e.value.trim(),
                f = l(e);
            p.push(r.fetchSafeDocumentFragment(document, f)).then(function(e) {
                o.replaceState(null, "", f);
                var t = document.getElementById(c);
                t.innerHTML = "", t.appendChild(e)
            }).then(t, t), i.classList.toggle("is-search-mode", d), i.classList.add("is-loading");
            for (var h = 0; h < a.length; h++) {
                var m = a[h];
                m.classList.remove("selected")
            }
            d ? u.classList.add("selected") : (v.classList.add("selected"), v = null)
        }

        function d(e) {
            var t = e.value.trim();
            e.value = "", t && c(e)
        }
        var f = u(t),
            h = u(n),
            m = u(a),
            v = null,
            p = new h["default"];
        s.observe(".js-branch-search-field", function() {
            i.addThrottledInputEventListener(this, c.bind(null, this)), this.addEventListener("keyup", function(e) {
                "esc" === m["default"](e) && (d(this), this.blur())
            })
        }), f["default"](document).on("submit", ".js-branch-search", !1), e.on("click", ".js-clear-branch-search", function() {
            var t = this.form.querySelector(".js-branch-search-field");
            t.focus(), t.value = "", e.fire(t, "input")
        }), f["default"](document).on("ajaxSend", ".js-branch-destroy, .js-branch-restore", function(e, t) {
            var n = this.matches(".js-branch-destroy"),
                i = this.closest(".js-branch-row").getAttribute("data-branch-name"),
                r = this.closest(".js-branches").querySelectorAll(".js-branch-row"),
                a = Array.from(r).filter(function(e) {
                    return e.getAttribute("data-branch-name") === i
                }),
                s = this.querySelector("button[type=submit]");
            s.blur(), s.classList.remove("tooltipped");
            for (var o = 0; o < a.length; o++) {
                var u = a[o];
                u.classList.add("loading")
            }
            t.done(function() {
                for (var e = 0; e < a.length; e++) {
                    var t = a[e];
                    t.classList.toggle("is-deleted", n)
                }
            }).always(function() {
                for (var e = 0; e < a.length; e++) {
                    var t = a[e];
                    t.classList.remove("loading")
                }
                s.classList.add("tooltipped")
            })
        }), f["default"](document).on("ajaxError", ".js-branch-destroy, .js-branch-restore", function(e) {
            e.preventDefault(), location.reload()
        })
    }), define("github/bulk-actions", ["delegated-events", "./sliding-promise-queue", "./debounce", "./fetch"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            var t, n, r, a, s, o, l, c, d;
            return regeneratorRuntime.async(function(f) {
                for (;;) switch (f.prev = f.next) {
                    case 0:
                        return t = e.target, n = Array.from(t.querySelectorAll(".js-bulk-actions-toggle:checked")), r = n.map(function(e) {
                            return e.closest(".js-bulk-actions-item").getAttribute("data-bulk-actions-id")
                        }).sort(), a = t.getAttribute("data-bulk-actions-url"), s = t.getAttribute("data-bulk-actions-parameter"), o = r.map(function(e) {
                            return s + "[]=" + e
                        }).join("&"), l = a + "?" + o, f.next = 9, regeneratorRuntime.awrap(u.push(i.fetchText(l)));
                    case 9:
                        c = f.sent, d = t.querySelector(".js-bulk-actions"), d.innerHTML = c;
                    case 12:
                    case "end":
                        return f.stop()
                }
            }, null, this)
        }
        var s = r(t),
            o = r(n),
            u = new s["default"];
        e.on("change", ".js-bulk-actions-toggle", function() {
            var t = this.closest(".js-bulk-actions-container");
            e.fire(t, "bulk-actions:update")
        }), e.on("bulk-actions:update", ".js-bulk-actions-container", o["default"](a, 100))
    }), define("github/bust-frames", [], function() {
        top !== window && (alert("For security reasons, framing is not allowed."), top.location.replace(document.location))
    }), define("github/collector-api", [], function() {
        function e(e) {
            return console && console.warn ? console.warn(e) : void 0
        }
        var t = {}.hasOwnProperty,
            n = [].slice,
            i = {
                host: "collector.githubapp.com",
                type: "page_view",
                dimensions: {},
                measures: {},
                context: {},
                actor: {},
                image: new Image,
                performance: {},
                expectedPerformanceTimingKeys: ["connectEnd", "connectStart", "domComplete", "domContentLoadedEventEnd", "domContentLoadedEventStart", "domInteractive", "domLoading", "domainLookupEnd", "domainLookupStart", "fetchStart", "loadEventEnd", "loadEventStart", "navigationStart", "redirectEnd", "redirectStart", "requestStart", "responseEnd", "responseStart", "secureConnectionStart", "unloadEventEnd", "unloadEventStart"],
                recordPageView: function() {
                    return this.applyMetaTags(), null == this.app ? !1 : null == this.host ? (e("Host not set, you are doing something wrong"), !1) : (this.image.src = this._src(), this._clearPerformance(), !0)
                },
                setHost: function(e) {
                    return this.host = e
                },
                setApp: function(e) {
                    return this.app = e
                },
                setDimensions: function(e) {
                    return this.dimensions = e
                },
                addDimensions: function(e) {
                    var n = void 0;
                    null == this.dimensions && (this.dimensions = {});
                    var i = [];
                    for (n in e)
                        if (t.call(e, n)) {
                            var r = e[n];
                            i.push(this.dimensions[n] = r)
                        }
                    return i
                },
                setMeasures: function(e) {
                    return this.measures = e
                },
                addMeasures: function(e) {
                    var n = void 0;
                    null == this.measures && (this.measures = {});
                    var i = [];
                    for (n in e)
                        if (t.call(e, n)) {
                            var r = e[n];
                            i.push(this.measures[n] = r)
                        }
                    return i
                },
                setContext: function(e) {
                    return this.context = e
                },
                addContext: function(e) {
                    var n = void 0;
                    null == this.context && (this.context = {});
                    var i = [];
                    for (n in e)
                        if (t.call(e, n)) {
                            var r = e[n];
                            i.push(this.context[n] = r)
                        }
                    return i
                },
                setActor: function(e) {
                    return this.actor = e
                },
                push: function(e) {
                    return this.applyCall(e)
                },
                enablePerformance: function() {
                    return this.performance = this._performanceTiming()
                },
                _recordSrc: function(e, t, n, i) {
                    return "//" + this.host + "/" + this.app + "/" + e + "?" + this._queryString(t, n, i)
                },
                _src: function() {
                    return "//" + this.host + "/" + this.app + "/" + this.type + "?" + this._queryString()
                },
                _queryString: function(e, t, n) {
                    var i = void 0,
                        r = void 0,
                        a = function() {
                            var e = this._params(),
                                t = [];
                            for (i in e) r = e[i], t.push("dimensions[" + i + "]=" + r);
                            return t
                        }.call(this);
                    return a.push(this._encodeObject("dimensions", this._merge(this.dimensions, e))), a.push(this._encodeObject("measures", this._merge(this.measures, t))), null != this.performance && a.push(this._encodeObject("measures", {
                        performance_timing: this.performance
                    })), a.push(this._encodeObject("context", this._merge(this.context, n))), a.push(this._actor()), a.push(this._encodeObject("dimensions", {
                        cid: this._clientId()
                    })), a.join("&")
                },
                _clearPerformance: function() {
                    return this.performance = null
                },
                _performanceTiming: function() {
                    var e = void 0,
                        t = void 0,
                        n = void 0;
                    if (null == window.performance || null == window.performance.timing || null == window.performance.timing.navigationStart) return null;
                    var i = {},
                        r = this.expectedPerformanceTimingKeys;
                    for (e = 0, t = r.length; t > e; e++) {
                        var a = r[e];
                        i[a] = null != (n = window.performance.timing[a]) ? n : 0
                    }
                    var s = 1,
                        o = [],
                        u = i.navigationStart;
                    for (var l in i) {
                        var c = i[l],
                            d = 0 === c ? null : c - u;
                        o.push(d)
                    }
                    return s + "-" + o.join("-")
                },
                _params: function() {
                    return {
                        page: this._encode(this._page()),
                        title: this._encode(this._title()),
                        referrer: this._encode(this._referrer()),
                        user_agent: this._encode(this._agent()),
                        screen_resolution: this._encode(this._screenResolution()),
                        pixel_ratio: this._encode(this._pixelRatio()),
                        browser_resolution: this._encode(this._browserResolution()),
                        tz_seconds: this._encode(this._tzSeconds()),
                        timestamp: (new Date).getTime()
                    }
                },
                _page: function() {
                    try {
                        return document.location.href
                    } catch (e) {}
                },
                _title: function() {
                    try {
                        return document.title
                    } catch (e) {}
                },
                _referrer: function() {
                    var e = void 0;
                    e = "";
                    try {
                        e = window.top.document.referrer
                    } catch (t) {
                        if (window.parent) try {
                            e = window.parent.document.referrer
                        } catch (t) {}
                    }
                    return "" === e && (e = document.referrer), e
                },
                _agent: function() {
                    try {
                        return navigator.userAgent
                    } catch (e) {}
                },
                _screenResolution: function() {
                    try {
                        return screen.width + "x" + screen.height
                    } catch (e) {
                        return "unknown"
                    }
                },
                _pixelRatio: function() {
                    return window.devicePixelRatio
                },
                _browserResolution: function() {
                    var e = void 0,
                        t = void 0;
                    try {
                        return t = 0, e = 0, "number" == typeof window.innerWidth ? (t = window.innerWidth, e = window.innerHeight) : null != document.documentElement && null != document.documentElement.clientWidth ? (t = document.documentElement.clientWidth, e = document.documentElement.clientHeight) : null != document.body && null != document.body.clientWidth && (t = document.body.clientWidth, e = document.body.clientHeight), t + "x" + e
                    } catch (n) {
                        return "unknown"
                    }
                },
                _tzSeconds: function() {
                    try {
                        return -60 * (new Date).getTimezoneOffset()
                    } catch (e) {
                        return ""
                    }
                },
                _merge: function() {
                    var e = void 0,
                        t = void 0,
                        i = void 0,
                        r = 1 <= arguments.length ? n.call(arguments, 0) : [],
                        a = {};
                    for (e = 0, i = r.length; i > e; e++) {
                        var s = r[e];
                        for (t in s) {
                            var o = s[t];
                            a[t] = o
                        }
                    }
                    return a
                },
                _encodeObject: function(e, t) {
                    var n = void 0,
                        i = void 0,
                        r = void 0,
                        a = [];
                    if (null != Array.isArray && Array.isArray(t) || "[object Array]" === Object.prototype.toString.call(t))
                        for (n = 0, i = t.length; i > n; n++) {
                            var s = t[n];
                            a.push(this._encodeObject(e + "[]", s))
                        } else if (t === Object(t))
                            for (r in t) a.push(this._encodeObject(e + "[" + r + "]", t[r]));
                        else a.push(e + "=" + this._encode(t));
                    return a.join("&")
                },
                _actor: function() {
                    var e = void 0,
                        t = void 0,
                        n = void 0,
                        i = [],
                        r = this.actor;
                    for (t in r) {
                        var a = r[t],
                            s = "dimensions[actor_" + t + "]";
                        if (a.join)
                            for (e = 0, n = a.length; n > e; e++) {
                                var o = a[e];
                                i.push(s + "[]=" + this._encode(o))
                            } else i.push(s + "=" + this._encode(a))
                    }
                    return i.join("&")
                },
                _getCookie: function(e) {
                    var t = void 0,
                        n = void 0,
                        i = [],
                        r = document.cookie.split(";");
                    for (t = 0, n = r.length; n > t; t++) {
                        var a = r[t],
                            s = a.trim().split("=");
                        if (!(s.length < 2)) {
                            var o = s[0],
                                u = s[1];
                            o === e && i.push({
                                key: o,
                                value: u
                            })
                        }
                    }
                    return i
                },
                _clientId: function() {
                    var e = void 0;
                    return e = this._getClientId(), "" === e && (e = this._setClientId()), e
                },
                _getClientId: function() {
                    var e = void 0,
                        t = void 0,
                        n = void 0,
                        i = this._getCookie("_octo"),
                        r = [];
                    for (t = 0, n = i.length; n > t; t++) {
                        var a = i[t],
                            s = a.value.split("."),
                            o = s.shift();
                        if ("GH1" === o && s.length > 1) {
                            var u = s.shift().split("-");
                            1 === u.length && (u[1] = "1"), u[0] *= 1, u[1] *= 1, e = s.join("."), r.push([u, e])
                        }
                    }
                    return e = "", r.length > 0 && (e = r.sort().reverse()[0][1]), e
                },
                _setClientId: function() {
                    var e = (new Date).getTime(),
                        t = Math.round(Math.random() * (Math.pow(2, 31) - 1)) + "." + Math.round(e / 1e3),
                        n = "GH1.1." + t,
                        i = new Date(e + 63072e6).toUTCString(),
                        r = document.domain;
                    if (null == r) throw new Error("Unable to get document domain");
                    var a = "." + r.split(".").reverse().slice(0, 2).reverse().join(".");
                    return document.cookie = "_octo=" + n + "; expires=" + i + "; path=/; domain=" + a, t
                },
                _encode: function(e) {
                    return null != e ? window.encodeURIComponent(e) : ""
                },
                applyQueuedCalls: function(e) {
                    var t = void 0,
                        n = void 0,
                        i = [];
                    for (t = 0, n = e.length; n > t; t++) {
                        var r = e[t];
                        i.push(this.applyCall(r))
                    }
                    return i
                },
                applyCall: function(t) {
                    var n = t[0],
                        i = t.slice(1);
                    return this[n] ? this[n].apply(this, i) : e(n + " is not a valid method")
                },
                applyMetaTags: function() {
                    var e = this.loadMetaTags();
                    return e.host && this.setHost(e.host), e.app && this.setApp(e.app), this._objectIsEmpty(e.actor) || this.setActor(e.actor), this.addDimensions(e.dimensions), this.addMeasures(e.measures), this.addContext(e.context)
                },
                loadMetaTags: function() {
                    var e = void 0,
                        t = void 0,
                        n = {
                            dimensions: {},
                            measures: {},
                            context: {},
                            actor: {}
                        },
                        i = document.getElementsByTagName("meta");
                    for (e = 0, t = i.length; t > e; e++) {
                        var r = i[e];
                        if (r.name && r.content) {
                            var a = r.name.match(this.octolyticsMetaTagName);
                            if (a) switch (a[1]) {
                                case "host":
                                    n.host = r.content;
                                    break;
                                case "app-id":
                                    n.app = r.content;
                                    break;
                                case "app":
                                    n.app = r.content;
                                    break;
                                case "dimension":
                                    this._addField(n.dimensions, a[2], r);
                                    break;
                                case "measure":
                                    this._addField(n.measures, a[2], r);
                                    break;
                                case "context":
                                    this._addField(n.context, a[2], r);
                                    break;
                                case "actor":
                                    this._addField(n.actor, a[2], r)
                            }
                        }
                    }
                    return n
                },
                _addField: function(e, t, n) {
                    return n.attributes["data-array"] ? (null == e[t] && (e[t] = []), e[t].push(n.content)) : e[t] = n.content
                },
                _objectIsEmpty: function(e) {
                    var n = void 0;
                    for (n in e)
                        if (t.call(e, n)) return !1;
                    return !0
                },
                octolyticsMetaTagName: /^octolytics-(host|app-id|app|dimension|measure|context|actor)-?(.*)/
            };
        if (window._octo) {
            if (window._octo.slice) {
                var r = window._octo.slice(0);
                window._octo = i, window._octo.applyQueuedCalls(r)
            }
        } else window._octo = i
    }), define("github/delegated-account-recovery", ["./fetch", "./form", "./invariant", "./observe", "delegated-events"], function(e, t, n, i, r) {
        function a(i) {
            var r, a, s, o, u;
            return regeneratorRuntime.async(function(l) {
                for (;;) switch (l.prev = l.next) {
                    case 0:
                        return r = i, n.invariant(r instanceof HTMLFormElement), a = document.querySelector(".js-delegated-account-recovery-submit"), n.invariant(a instanceof HTMLButtonElement), s = document.querySelector(".js-create-recovery-token-form"), n.invariant(s instanceof HTMLFormElement), r.classList.remove("failed"), r.classList.add("loading"), a.disabled = !0, l.prev = 9, l.next = 12, regeneratorRuntime.awrap(e.fetchForm(s));
                    case 12:
                        return o = l.sent, l.next = 15, regeneratorRuntime.awrap(o.json());
                    case 15:
                        u = l.sent, t.fillFormValues(r, {
                            token: u.token,
                            state: u.state_url
                        }), r.submit(), l.next = 25;
                        break;
                    case 20:
                        l.prev = 20, l.t0 = l["catch"](9), r.classList.remove("loading"), r.classList.add("failed"), a.disabled = !1;
                    case 25:
                    case "end":
                        return l.stop()
                }
            }, null, this, [
                [9, 20]
            ])
        }

        function s(e) {
            return regeneratorRuntime.async(function(t) {
                for (;;) switch (t.prev = t.next) {
                    case 0:
                        n.invariant(e instanceof HTMLFormElement), e.submit();
                    case 2:
                    case "end":
                        return t.stop()
                }
            }, null, this)
        }
        r.on("submit", ".js-post-recovery-token", function(e) {
            e.preventDefault(), a(this)
        }), i.observe("form.js-recovery-provider-auto-redirect", {
            init: function(e) {
                s(e)
            }
        }, HTMLFormElement)
    }), define("github/perform-transition", ["exports", "./jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e, t) {
            if (!o) return void t.apply(e);
            var n = s["default"](e).find(".js-transitionable");
            n = n.add(s["default"](e).filter(".js-transitionable"));
            for (var i = function(e, t) {
                    var i = n[e],
                        o = s["default"](i),
                        u = r(i);
                    o.one("transitionend", function() {
                        i.style.display = null, i.style.visibility = null, u && a(i, function() {
                            i.style.height = null
                        })
                    }), i.style.display = "block", i.style.visibility = "visible", u && a(i, function() {
                        i.style.height = o.height() + "px"
                    }), i.offsetHeight
                }, u = 0, l = n.length; l > u; u++) i(u, l);
            t.apply(e);
            for (var c = 0, d = n.length; d > c; c++) {
                var f = n[c];
                r(f) && (0 === s["default"](f).height() ? f.style.height = f.scrollHeight + "px" : f.style.height = "0px")
            }
        }

        function r(e) {
            return "height" === s["default"](e).css("transitionProperty")
        }

        function a(e, t) {
            e.style.transition = "none", t(e), e.offsetHeight, e.style.transition = null
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = i;
        var s = n(t),
            o = "ontransitionend" in window
    }), define("github/details", ["exports", "./typecast", "./hash-change", "delegated-events", "./once", "./perform-transition", "./setimmediate"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e) {
            var t = e.querySelectorAll("input[autofocus], textarea[autofocus]"),
                n = t[t.length - 1];
            n && document.activeElement !== n && n.focus()
        }

        function l(e) {
            e.classList.contains("tooltipped") && (e.classList.remove("tooltipped"), m["default"](e, "mouseleave").then(function() {
                return e.classList.add("tooltipped")
            }))
        }

        function c(e) {
            var t = e.closest(".js-edit-repository-meta");
            t && f["default"](t, HTMLFormElement).reset()
        }

        function d(e) {
            var t = e.getAttribute("data-details-container") || ".js-details-container",
                n = f["default"](e.closest(t), HTMLElement);
            v["default"](n, function() {
                n.classList.toggle("open"), n.classList.toggle("Details--on"), e.setAttribute("aria-expanded", n.classList.contains("Details--on").toString()), p["default"](function() {
                    u(n), l(e), c(e), e.blur && e.blur();
                    var t = new CustomEvent("details:toggled", {
                        bubbles: !0,
                        cancelable: !1
                    });
                    t.relatedTarget = e, n.dispatchEvent(t)
                })
            })
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.toggleDetailsTarget = d;
        var f = o(t),
            h = o(n),
            m = o(r),
            v = o(a),
            p = o(s);
        i.on("click", ".js-details-target", function(e) {
            d(this), e.preventDefault()
        }), h["default"](function(e) {
            for (var t = e.target;
                (t = t.parentNode) && t !== document.documentElement;) t.matches(".js-details-container") && t.classList.add("open", "Details--on")
        })
    }), define("github/sticky-scroll-into-view", ["exports", "./fragment-target"], function(e, t) {
        function n(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
            }
            return Array.from(e)
        }

        function i(e) {
            var t = e.ownerDocument;
            e.scrollIntoView(), t.defaultView.scrollBy(0, -a(t))
        }

        function r(e) {
            var n = t.findFragmentTarget(e);
            n && i(n)
        }

        function a(e) {
            var t = e.querySelectorAll(".js-sticky-offset-scroll");
            return Math.max.apply(Math, n(Array.from(t).map(function(e) {
                var t = e.getBoundingClientRect(),
                    n = t.top,
                    i = t.height;
                return 0 === n ? i : 0
            })))
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.scrollIntoView = i, e.scrollToFragmentTarget = r, e.computeFixedYOffset = a
    }), define("github/diffs/progressive", ["../observe", "delegated-events", "../sticky-scroll-into-view"], function(e, t, n) {
        function i(e) {
            var t = r();
            if (t) {
                a(e, t);
                var i = s(e, t);
                i && (n.scrollIntoView(i), d(i))
            }
        }

        function r() {
            return window.location.hash.slice(1)
        }

        function a(e, t) {
            var i = e.querySelector("#" + t);
            i || (i = e.querySelector("a[name=" + t + "]")), i && n.scrollIntoView(i)
        }

        function s(e, t) {
            var n = o(e, t);
            return n ? n : u(e, t)
        }

        function o(e, t) {
            var n = /^(diff-[0-9a-f]{32})(?:[L|R]\d+)?$/.exec(t);
            if (n) {
                var i = n[1],
                    r = e.querySelector("a[name='" + i + "']");
                if (r) {
                    var a = r.nextElementSibling;
                    if (a.querySelector(".js-diff-load-container")) return a
                }
            }
        }

        function u(e, t) {
            var n = /^(?:r|commitcomment-)(\d+)$/.exec(t);
            if (n) {
                var i = n[1],
                    r = e.querySelector("#diff-with-comment-" + i);
                if (r) {
                    var a = r.closest(".js-file");
                    return a
                }
            }
        }

        function l() {
            var e = this;
            e.querySelector(".js-diff-progressive-spinner").classList.add("d-none"), e.querySelector(".js-diff-progressive-retry").classList.remove("d-none")
        }

        function c(e) {
            e.querySelector(".js-diff-progressive-spinner").classList.remove("d-none"), e.querySelector(".js-diff-progressive-retry").classList.add("d-none")
        }

        function d(e) {
            var t = e.querySelector(".js-diff-entry-loader"),
                n = e.querySelector(".js-diff-placeholder"),
                i = e.querySelector(".js-diff-load");
            n.setAttribute("fill", "url('#animated-diff-gradient')"), i.textContent = i.getAttribute("data-disable-with"), i.setAttribute("disabled", !0);
            var r = new URL(t.getAttribute("data-fragment-url"), window.location.origin);
            t.src = r.toString()
        }

        function f() {
            var e = this;
            e.querySelector(".js-diff-load-button-container").classList.add("d-none"), e.querySelector(".js-diff-load-retry").classList.remove("d-none")
        }

        function h(e) {
            e.querySelector(".js-diff-load-button-container").classList.remove("d-none"), e.querySelector(".js-diff-load-retry").classList.add("d-none")
        }

        function m() {
            this.setAttribute("data-url", this.src), this.removeAttribute("src")
        }

        function v(e) {
            e.src = e.getAttribute("data-url"), e.removeAttribute("data-url")
        }
        e.observe(".js-diff-progressive-container", function(e) {
            i(e);
            var t = e.querySelector(".js-diff-progressive-loader");
            t && (t.addEventListener("load", function() {
                i(e)
            }), t.addEventListener("error", m), t.addEventListener("error", l))
        }), t.on("click", ".js-diff-progressive-retry .js-retry-button", function() {
            var e = this.closest(".js-diff-progressive-loader");
            c(e), v(e)
        }), e.observe(".js-diff-load-container", function(e) {
            var t = e.querySelector(".js-diff-entry-loader");
            t && (t.addEventListener("load", function() {
                var t = e.closest(".js-file");
                t.classList.remove("hide-file-notes-toggle");
                var n = r();
                n && a(e, n)
            }), t.addEventListener("error", m), t.addEventListener("error", f))
        }), t.on("click", ".js-diff-load", function() {
            var e = this.closest(".js-diff-load-container");
            d(e)
        }), t.on("click", ".js-diff-load-retry .js-retry-button", function() {
            var e = this.closest(".js-diff-entry-loader");
            h(e), v(e)
        })
    }), define("github/diffs/prose", ["../jquery", "delegated-events", "../history"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            var t = new URL(window.location.href, window.location.origin),
                i = e.closest(".file-header"),
                r = e.classList.contains("js-rendered"),
                a = e.classList.contains("js-source");
            t.hash = i.getAttribute("data-anchor"), r ? t.searchParams.set("short_path", i.getAttribute("data-short-path")) : a && t.searchParams["delete"]("short_path"), n.replaceState(null, "", t.toString())
        }

        function a(e) {
            for (var t = e.closest(".js-prose-diff-toggles"), n = t.querySelectorAll(".btn"), i = 0; i < n.length; i++) {
                var r = n[i];
                r.classList.remove("selected")
            }
            e.classList.add("selected")
        }
        var s = i(e);
        t.on("click", ".js-prose-diff-toggles .btn", function(e) {
            return this.classList.contains("selected") ? e.preventDefault() : (r(this), void a(this))
        }), s["default"](document).on("ajaxSuccess", ".js-prose-diff-toggles form", function(e, t, n, i) {
            var r = this.closest(".js-details-container"),
                a = r.querySelector(".js-file-content");
            if (a) {
                for (; a.hasChildNodes();) a.removeChild(a.lastChild);
                a.insertAdjacentHTML("afterbegin", i), r.classList.toggle("display-rich-diff"), r.classList.toggle("show-inline-notes")
            }
        })
    }), define("github/dismiss-notice", ["./jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSuccess", ".js-dismiss-notice", function() {
            this.closest(".js-dismissible-notice").classList.add("d-none")
        })
    }), define("github/fixed-offset-fragment-navigation-observer", ["./sticky-scroll-into-view", "./hash-change"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            e.computeFixedYOffset(document) && e.scrollToFragmentTarget(document)
        }
        var r = n(t);
        r["default"](i)
    }), define("github/gfm", ["delegated-events"], function(e) {
        e.on("click", ".email-hidden-toggle", function(e) {
            var t = this.nextElementSibling;
            t.style.display = "", t.classList.toggle("expanded"), e.preventDefault()
        })
    }), define("github/git-clone-help", ["delegated-events"], function(e) {
        e.on("click", ".js-git-clone-help-container .js-git-clone-help-switcher", function() {
            var e = this.closest(".js-git-clone-help-container"),
                t = this.getAttribute("data-url");
            if (e.querySelector(".js-git-clone-help-field").value = t, this.matches(".js-git-protocol-clone-url"))
                for (var n = e.querySelectorAll(".js-git-clone-help-text"), i = 0; i < n.length; i++) {
                    var r = n[i];
                    r.textContent = t
                }
            var a = e.querySelector(".js-clone-url-button.selected");
            a && a.classList.remove("selected"), this.closest(".js-clone-url-button").classList.add("selected")
        })
    }), define("github/google-analytics-octolytics", ["./google-analytics"], function(e) {
        function t(e) {
            var t = e.get("sendHitTask");
            e.set("sendHitTask", function(e) {
                if (t(e), "event" === e.get("hitType") && null != window._octo) {
                    var n = new XMLHttpRequest;
                    n.open("POST", "//" + window._octo.host + "/collect", !0), n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), n.send(e.get("hitPayload"))
                }
            })
        }
        e.providePlugin("octolyticsPlugin", t)
    }), define("github/google-analytics-overrides", ["exports", "./google-analytics", "./typecast"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            var t = document.querySelectorAll(e);
            return t.length > 0 ? t[t.length - 1] : void 0
        }

        function a() {
            var e = r("meta[name=analytics-location]");
            return e ? e.content : window.location.pathname
        }

        function s() {
            var e = r("meta[name=analytics-location-query-strip]"),
                t = "";
            e || (t = window.location.search);
            var n = r("meta[name=analytics-location-params]");
            n && (t += (t ? "&" : "?") + n.content);
            for (var i = document.querySelectorAll("meta[name=analytics-param-rename]"), a = 0; a < i.length; a++) {
                var s = i[a],
                    o = f["default"](s, HTMLMetaElement).content.split(":", 2);
                t = t.replace(new RegExp("(^|[?&])" + o[0] + "($|=)", "g"), "$1" + o[1] + "$2")
            }
            return t
        }

        function o() {
            return a() + s()
        }

        function u() {
            var e = document.title,
                t = r("meta[name=analytics-location]");
            return t && (e = e.replace(/([\w-]+\/)+[\w\.-]+/g, "private/private"), e = e.replace(/gist:[a-f0-9]{32}/g, "gist:private")), e
        }

        function l() {
            var e = window.location.protocol + "//" + window.location.host + o();
            t.setGlobalLocation(e), t.setGlobalTitle(u());
            for (var n = document.querySelectorAll("meta.js-ga-set"), i = 0; i < n.length; i++) {
                var r = n[i],
                    a = f["default"](r, HTMLMetaElement);
                t.setDimension(a.name, a.content)
            }
        }

        function c() {
            for (var e = document.querySelectorAll("meta[name=analytics-virtual-pageview]"), n = 0; n < e.length; n++) {
                var i = e[n];
                t.trackPageview(f["default"](i, HTMLMetaElement).content, {
                    title: ""
                })
            }
            t.trackPageview()
        }

        function d(e) {
            var t = e.trim().split(/\s*,\s*/);
            return {
                category: t[0],
                action: t[1],
                label: t[2],
                value: t[3]
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.updateGlobalFields = l, e.trackPageviews = c, e.extractEventParams = d;
        var f = i(n)
    }), define("github/google-analytics-tracking", ["./google-analytics-overrides", "./google-analytics", "./typecast", "./observe", "./document-ready", "./google-analytics-octolytics"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var s = a(n),
            o = document.querySelector("meta[name=google-analytics]");
        o && (t.setGlobalAccount(s["default"](o, HTMLMetaElement).content, "auto"), t.requirePlugin("octolyticsPlugin"), e.updateGlobalFields()), r.ready.then(function() {
            return e.trackPageviews()
        }), document.addEventListener("pjax:complete", function() {
            setTimeout(function() {
                e.updateGlobalFields(), e.trackPageviews()
            }, 20)
        }, !1), i.observe("[data-ga-load]", function() {
            var n = e.extractEventParams(this.getAttribute("data-ga-load"));
            n.interactive = !1, t.trackEvent(n)
        }), i.observe("meta[name=analytics-event]", function() {
            var n = e.extractEventParams(this.content);
            n.interactive = !1, t.trackEvent(n)
        }), window.addEventListener("click", function(n) {
            var i = void 0;
            if (n.target.closest && (i = n.target.closest("[data-ga-click]"))) {
                var r = e.extractEventParams(i.getAttribute("data-ga-click"));
                t.trackEvent(r)
            }
        }, !0)
    }), define("github/topics", ["./jquery", "./typecast", "./fetch", "./invariant", "delegated-events", "./form", "./details"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u() {
            var e = document.getElementById("repo-topics-save-notice");
            e && (e.classList.remove("d-none"), h["default"](e).fadeIn(400, function() {
                e.classList.add("d-inline-block"), setTimeout(function() {
                    h["default"](e).fadeOut(400, function() {
                        e.classList.remove("d-inline-block"), e.classList.add("d-none")
                    })
                }, 1500)
            }))
        }

        function l() {
            var e = m["default"](document.querySelector(".js-topic-suggestions-box"), HTMLElement),
                t = e.querySelectorAll(".js-topic-suggestion");
            t.length < 1 && e.remove()
        }

        function c(e) {
            var t = m["default"](document.querySelector(".js-repo-meta-container"), HTMLElement),
                n = document.getElementById("topics-list-container"),
                i = m["default"](t.querySelector(".js-repo-meta-edit"), HTMLElement),
                r = m["default"](t.querySelector(".js-edit-repo-meta-button"), HTMLButtonElement);
            r.classList.toggle("d-none", e), n.classList.toggle("d-none", e), i.classList.toggle("d-none", e)
        }

        function d() {
            c(!0)
        }

        function f() {
            c(!1);
            var e = document.getElementById("topics-list-container"),
                t = e.getAttribute("data-url");
            i.invariant(t, "`data-url` must exist"), n.fetchSafeDocumentFragment(document, t).then(function(t) {
                e.innerHTML = "", e.appendChild(t)
            })
        }
        var h = o(e),
            m = o(t);
        h["default"](document).on("ajaxSuccess", ".js-accept-topic-form", function() {
            var e = this.closest(".js-topic-suggestion"),
                t = this.closest(".js-topic-form-area"),
                n = t.querySelector(".js-template"),
                i = t.querySelector(".js-tag-input-selected-tags"),
                r = n.cloneNode(!0),
                a = e.querySelector('input[name="topic[name]"]').value;
            r.querySelector("input").value = a, r.querySelector(".js-placeholder-tag-name").replaceWith(a), r.classList.remove("d-none", "js-template"), i.appendChild(r), e.remove(), l(), u()
        });
        var v = new WeakMap;
        r.on("click", ".js-repo-topics-form-done", function(e) {
            var t = document.getElementById("repo-topics-edit-form");
            v.has(t) && e.preventDefault(), v.set(t, !0)
        }), h["default"](document).on("ajaxSuccess", ".js-decline-topic-form", function() {
            this.closest(".js-topic-suggestion").remove(), l(), u()
        }), h["default"](document).on("ajaxSend", "#repo-topics-edit-form", function() {
            var e = this.closest(".js-topic-form-area");
            e.classList.remove("errored");
            var t = this.querySelector(".js-repo-topics-form-done");
            t.disabled = !0;
            var n = e.querySelector(".js-topic-error");
            n.textContent = "";
            for (var i = e.querySelectorAll(".js-tag-input-tag.invalid-topic"), r = 0; r < i.length; r++) {
                var a = i[r];
                a.classList.remove("invalid-topic")
            }
        }), h["default"](document).on("ajaxComplete", "#repo-topics-edit-form", function() {
            var e = this.querySelector(".js-repo-topics-form-done");
            e.disabled = !1
        }), h["default"](document).on("ajaxSuccess", "#repo-topics-edit-form", function() {
            u();
            var e = document.getElementById("topic-suggestions-container");
            if (e) {
                var t = e.getAttribute("data-url");
                i.invariant(t, "`data-url` must exist"), n.fetchSafeDocumentFragment(document, t).then(function(t) {
                    e.innerHTML = "", e.appendChild(t)
                })
            }
            if (v.has(this)) {
                v["delete"](this);
                var r = this.querySelector(".js-repo-topics-form-done");
                s.toggleDetailsTarget(r), f()
            }
        }), h["default"](document).on("ajaxError", "#repo-topics-edit-form", function(e, t) {
            if (t.responseJSON) {
                if (t.responseJSON.message) {
                    e.preventDefault();
                    var n = this.closest(".js-topic-form-area");
                    n.classList.add("errored");
                    var i = n.querySelector(".js-topic-error");
                    i.textContent = t.responseJSON.message
                }
                if (t.responseJSON.invalidTopics)
                    for (var r = t.responseJSON.invalidTopics, a = this.querySelectorAll(".js-topic-input"), s = 0; s < r.length; s++)
                        for (var o = r[s], u = 0; u < a.length; u++) {
                            var l = a[u];
                            l.value === o && l.closest(".js-tag-input-tag").classList.add("invalid-topic")
                        }
            }
        }), r.on("tags:changed", "#repo-topics-edit-form", function() {
            var e = m["default"](document.getElementById("repo-topics-edit-form"), HTMLFormElement);
            v.has(e) || a.submit(e)
        }), r.on("click", ".js-repo-topics-form-toggle", function(e) {
            var t = m["default"](e.target.closest(".js-repo-meta-container"), HTMLElement),
                n = t.querySelector(".js-repo-topics-form-fragment");
            if (n) {
                n.classList.remove("d-none");
                var r = n.getAttribute("data-url");
                i.invariant(r, "`data-url` must exist"), n.setAttribute("src", r)
            }
            var a = t.querySelector(".js-repository-topics-container"),
                s = m["default"](a, HTMLElement).classList.contains("open");
            s ? d() : f()
        }), r.on("click", ".js-edit-repo-meta-toggle", function(e) {
            var t = m["default"](e.target.closest(".js-repo-meta-container"), HTMLElement),
                n = t.querySelector(".js-repo-meta-edit"),
                i = m["default"](n, HTMLElement).classList.contains("open"),
                r = t.querySelector(".js-repository-topics-container");
            r && (r = m["default"](r, HTMLElement), r.classList.toggle("d-none", i))
        })
    }), define("github/homepage/play-video", ["delegated-events"], function(e) {
        function t(e, t) {
            void 0 === t && (t = 0);
            var n = e.getBoundingClientRect(),
                i = n.top - t,
                r = n.bottom - window.innerHeight + t;
            0 > i ? window.scrollBy(0, i) : r > 0 && window.scrollBy(0, r)
        }
        e.on("click", ".js-video-play, .js-video-close, .is-expanded", function(e) {
            e.preventDefault();
            var n = this,
                i = n.classList.contains("js-video-play"),
                r = n.closest(".js-video-container"),
                a = r.querySelector(".js-video-iframe"),
                s = document.querySelector(".js-video-bg");
            i ? a.src = a.getAttribute("data-src") : a.removeAttribute("src"), r.classList.toggle("is-expanded", i), null != s && s.classList.toggle("is-expanded", i), t(a, 20)
        })
    }), define("github/legacy/behaviors/ajax-pagination", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSuccess", ".js-ajax-pagination", function(e, t, i, r) {
            this.replaceWith.apply(this, n["default"].parseHTML(r))
        })
    }), define("github/legacy/behaviors/ajax_error", ["../../jquery", "../../inspect", "../../failbot"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function a(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function o() {
            return u["default"]("#ajax-error-message").show(function() {
                return u["default"](this).addClass("visible")
            })
        }
        var u = i(e),
            l = i(t),
            c = function(e) {
                function t(e) {
                    r(this, t);
                    var n = a(this, Object.getPrototypeOf(t).call(this, e));
                    return n.name = "DataRemoteError", n.message = e, n
                }
                return s(t, e), t
            }(Error);
        u["default"](document).on("ajaxError", "[data-remote]", function(e, t, i, r) {
            var a = void 0,
                s = void 0,
                u = void 0,
                d = void 0;
            if (this === e.target && "abort" !== r && "canceled" !== r) {
                var f = "." + this.className.split(" ").sort().join("."),
                    h = new c(r + " (" + t.status + ") from " + f);
                if (n.reportError(h, {
                        dataRemote: {
                            target: l["default"](this),
                            method: null != (a = this.getAttribute("method")) ? a : "GET",
                            url: null != (s = null != (u = this.href) ? u : this.action) ? s : window.location.href,
                            dataType: null != (d = this.getAttribute("data-type")) ? d : "intelligent guess"
                        }
                    }), /<html/.test(t.responseText)) throw o(), e.stopImmediatePropagation(), h;
                return setTimeout(function() {
                    if (!e.isDefaultPrevented()) throw o(), h
                }, 0)
            }
        }), u["default"](document).on("ajaxSend", "[data-remote]", function() {
            return u["default"]("#ajax-error-message").hide().removeClass("visible")
        }), u["default"](document).on("click", ".js-ajax-error-dismiss", function() {
            return u["default"]("#ajax-error-message").hide().removeClass("visible"), !1
        })
    }), define("github/legacy/behaviors/ajax_loading", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSend", "[data-remote]", function(e) {
            return this !== e.target || e.isDefaultPrevented() ? void 0 : n["default"](this).addClass("loading")
        }), n["default"](document).on("ajaxComplete", "[data-remote]", function(e) {
            return this === e.target ? n["default"](this).removeClass("loading") : void 0
        })
    }), define("github/legacy/behaviors/analytics", ["../../document-ready"], function(e) {
        e.ready.then(function() {
            window._octo.push(["enablePerformance"]), window._octo.push(["recordPageView"])
        }), document.addEventListener("pjax:complete", function() {
            window._octo.push(["recordPageView"])
        })
    }), define("github/legacy/behaviors/autocheck", ["../../throttled-input", "../../jquery", "../../visible", "../../focused", "../../sliding-promise-queue", "delegated-events", "../../fetch"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e, t) {
            var n = void 0;
            if ((n = g.get(e)) || (n = new p["default"], g.set(e, n)), t.value.trim()) {
                var i = e.getAttribute("data-autocheck-authenticity-token");
                if (null == i) {
                    var r = e.form.querySelector("input[name=authenticity_token]");
                    i = null != r ? r.value : void 0
                }
                return t.authenticity_token = i, n.push(s.fetchText(e.getAttribute("data-autocheck-url"), {
                    method: "post",
                    body: h["default"].param(t),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }))
            }
            return Promise.reject(new Error("empty"))
        }

        function l(e) {
            return c(e), e.classList.add("errored"), h["default"](e).find("p.note").hide()
        }

        function c(e) {
            return e.classList.remove("errored"), e.classList.remove("warn"), h["default"](e).find("p.note").show(), h["default"](e).find("dd.error").remove(), h["default"](e).find("dd.warning").remove()
        }

        function d(e) {
            function t(t) {
                return e.classList.toggle("is-autocheck-loading", t), s.closest("dl.form-group").toggleClass("is-loading", t)
            }

            function n() {
                return t(!1), a.fire(e, "autocheck:complete")
            }

            function i(t) {
                e.classList.add("is-autocheck-successful");
                var i = e.closest("dl.form-group");
                return c(i), i.classList.add("successed"), a.fire(e, "autocheck:success", t), n()
            }

            function r(t) {
                var i = e.closest("dl.form-group");
                if ("empty" === t.message) c(i);
                else if (m["default"](e)) {
                    e.classList.add("is-autocheck-errored");
                    var r = (null != t.response ? t.response.text() : void 0) || Promise.resolve("Something went wrong");
                    r.then(function(n) {
                        /<html/.test(n) && (n = "Something went wrong."), l(i);
                        var r = document.createElement("dd");
                        return r.classList.add("error"), null != t.response && t.response.headers.get("Content-Type").match("text/html") ? r.innerHTML = n : r.textContent = n, i.append(r), a.fire(e, "autocheck:error")
                    })
                }
                return n()
            }
            var s = h["default"](e),
                o = {
                    value: e.value
                };
            a.fire(e, "autocheck:send", o);
            var d = h["default"].param(o).split("&").sort().join("&");
            return d !== b.get(e) ? (b.set(e, d), s.closest("dl.form-group").removeClass("errored successed"), e.classList.remove("is-autocheck-successful", "is-autocheck-errored"), t(!0), u(e, o).then(i, r)) : void 0
        }

        function f() {
            d(this)
        }
        var h = o(t),
            m = o(n),
            v = o(i),
            p = o(r),
            g = new WeakMap,
            b = new WeakMap;
        h["default"](document).on("change", "input[data-autocheck-url]", function() {
            d(this)
        }), v["default"](document, "input[data-autocheck-url]", {
            focusin: function() {
                e.addThrottledInputEventListener(this, f, {
                    wait: 300
                })
            },
            focusout: function() {
                e.removeThrottledInputEventListener(this, f)
            }
        })
    }), define("github/legacy/behaviors/autocomplete", ["../../observe", "../../throttled-input", "../../jquery", "../../visible", "../../navigation", "../../sliding-promise-queue", "../../fetch"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var l = o(n),
            c = o(i),
            d = o(a),
            f = function() {
                function e() {
                    this.onNavigationOpen = u(this.onNavigationOpen, this), this.onNavigationKeyDown = u(this.onNavigationKeyDown, this), this.onInputChange = u(this.onInputChange, this), this.onResultsMouseDown = u(this.onResultsMouseDown, this), this.onInputBlur = u(this.onInputBlur, this), this.onInputFocus = u(this.onInputFocus, this), this.focusedInput = this.focusedResults = null, this.mouseDown = !1, this.fetchQueue = new d["default"]
                }
                return e.prototype.bindEvents = function(e, n) {
                    l["default"](e).on("blur", this.onInputBlur), t.addThrottledInputEventListener(e, this.onInputChange), l["default"](n).on("mousedown", this.onResultsMouseDown), l["default"](n).on("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), l["default"](n).on("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
                }, e.prototype.unbindEvents = function(e, n) {
                    l["default"](e).off("blur", this.onInputBlur), t.removeThrottledInputEventListener(e, this.onInputChange), l["default"](n).off("mousedown", this.onResultsMouseDown), l["default"](n).off("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), l["default"](n).off("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
                }, e.prototype.onInputFocus = function(e) {
                    var t = l["default"](e).closest(".js-autocomplete-container"),
                        n = t.find(".js-autocomplete")[0];
                    this.focusedInput = e, this.focusedResults = n, this.bindEvents(e, n), l["default"](e).attr("autocomplete", "off"), l["default"](e).trigger("autocomplete:focus"), this.fetchResults(e.value)
                }, e.prototype.onInputBlur = function() {
                    var e = this.focusedInput,
                        t = this.focusedResults;
                    this.mouseDown || (this.hideResults(), this.inputValue = null, this.focusedInput = this.focusedResults = null, this.unbindEvents(e, t), l["default"](e).trigger("autocomplete:blur"))
                }, e.prototype.onResultsMouseDown = function() {
                    this.mouseDown = !0;
                    var e = function(t) {
                        return function() {
                            return t.mouseDown = !1, l["default"](document).off("mouseup", e)
                        }
                    }(this);
                    l["default"](document).on("mouseup", e)
                }, e.prototype.onInputChange = function(e) {
                    var t = e.currentTarget;
                    this.inputValue !== t.value && (l["default"](t).removeData("autocompleted"), l["default"](t).trigger("autocomplete:autocompleted:changed")), this.fetchResults(t.value)
                }, e.prototype.fetchResults = function(e) {
                    var t = this,
                        n = this.focusedResults.getAttribute("data-search-url");
                    if (n) {
                        var i = function() {
                            var i = l["default"](t.focusedInput).closest(".js-autocomplete-container"),
                                r = e.trim() ? (n += ~n.indexOf("?") ? "&" : "?", n += "q=" + encodeURIComponent(e), i.addClass("is-sending"), s.fetchText(n)) : l["default"](t.focusedResults).find("[data-autocomplete-value]").length > 0 ? t.hideResults() : Promise.resolve("");
                            return {
                                v: t.fetchQueue.push(r).then(function(t) {
                                    return function(n) {
                                        return l["default"](t.focusedResults).find(".js-autocomplete-results").html(n), t.onResultsChange(e)
                                    }
                                }(t))["catch"](function(e) {
                                    return e
                                }).then(function() {
                                    i.removeClass("is-sending")
                                })
                            }
                        }();
                        if ("object" == typeof i) return i.v
                    }
                }, e.prototype.onResultsChange = function(e) {
                    var t = l["default"](this.focusedResults).find("[data-autocomplete-value]");
                    if (0 === t.length) this.hideResults();
                    else if (this.inputValue !== e && (this.inputValue = e, this.showResults(), l["default"](this.focusedInput).is("[data-autocomplete-autofocus]"))) {
                        var n = this.focusedResults.querySelector(".js-navigation-container");
                        n && r.focus(n)
                    }
                }, e.prototype.onNavigationKeyDown = function(e) {
                    switch (e.originalEvent.detail.hotkey) {
                        case "tab":
                            return this.onNavigationOpen(e), !1;
                        case "esc":
                            return this.hideResults(), !1
                    }
                }, e.prototype.onNavigationOpen = function(e) {
                    var t = e.currentTarget;
                    if (!t.classList.contains("disabled")) {
                        var n = l["default"](t).attr("data-autocomplete-value");
                        this.inputValue = n, l["default"](this.focusedInput).val(n), l["default"](this.focusedInput).data("autocompleted", n), l["default"](this.focusedInput).trigger("autocomplete:autocompleted:changed", [n]), l["default"](this.focusedInput).trigger("autocomplete:result", [n]), l["default"](t).removeClass("active"), this.focusedInput === document.activeElement ? this.hideResults() : this.onInputBlur()
                    }
                }, e.prototype.showResults = function(e, t) {
                    var n = void 0,
                        i = void 0;
                    if (null == e && (e = this.focusedInput), null == t && (t = this.focusedResults), !c["default"](t)) {
                        n = l["default"](e).offset(), i = n.top;
                        var a = i + l["default"](e).innerHeight(),
                            s = l["default"](e).innerWidth();
                        l["default"](t).css({
                            display: "block",
                            position: "absolute",
                            width: s + 2
                        }), l["default"](t).offset({
                            top: a + 5
                        }), l["default"](e).addClass("js-navigation-enable");
                        var o = t.querySelector(".js-navigation-container");
                        return o && r.push(o), l["default"](t).show()
                    }
                }, e.prototype.hideResults = function(e, t) {
                    if (null == e && (e = this.focusedInput), null == t && (t = this.focusedResults), this.inputValue = null, t && c["default"](t)) {
                        l["default"](e).removeClass("js-navigation-enable");
                        var n = t.querySelector(".js-navigation-container");
                        return n && r.pop(n), l["default"](t).hide()
                    }
                }, e
            }(),
            h = new f;
        e.observe(".js-autocomplete-field", function(e) {
            this.addEventListener("focus", function() {
                return h.onInputFocus(e)
            }), document.activeElement === e && h.onInputFocus(e)
        })
    }), define("github/legacy/behaviors/autosearch_form", ["../../fetch", "../../history", "../../throttled-input", "../../jquery", "../../sliding-promise-queue", "../../focused"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o() {
            var n, i, r, a, s;
            return regeneratorRuntime.async(function(o) {
                for (;;) switch (o.prev = o.next) {
                    case 0:
                        return n = this.form, n.classList.add("is-sending"), o.prev = 2, i = u["default"](n).serialize(), r = (n.action + "&" + i).replace(/[?&]/, "?"), o.next = 7, regeneratorRuntime.awrap(d.push(e.fetchText(r)));
                    case 7:
                        return a = o.sent, s = document.getElementById(n.getAttribute("data-results-container")), s.innerHTML = a, o.abrupt("return", t.replaceState(null, "", "?" + i));
                    case 11:
                        return o.prev = 11, n.classList.remove("is-sending"), o.finish(11);
                    case 14:
                    case "end":
                        return o.stop()
                }
            }, null, this, [
                [2, , 11, 14]
            ])
        }
        var u = s(i),
            l = s(r),
            c = s(a),
            d = new l["default"];
        c["default"](document, ".js-autosearch-field", {
            focusin: function() {
                n.addThrottledInputEventListener(this, o)
            },
            focusout: function() {
                n.removeThrottledInputEventListener(this, o)
            }
        })
    }), define("github/legacy/behaviors/autosubmit", ["../../form", "../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("change", "form[data-autosubmit]", function() {
            e.submit(this)
        })
    }), define("github/legacy/behaviors/billing/addons", ["../../../observe", "../../../throttled-input", "../../../jquery", "../../../visible", "../../../pjax", "../../../history"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o() {
            function e(e) {
                var t = void 0;
                u["default"](".js-contact-us").toggleClass("d-none", !o), u["default"](".js-payment-summary").toggleClass("d-none", o), u["default"](".js-billing-section").toggleClass("has-removed-contents", e.free), u["default"](".js-upgrade-info").toggleClass("d-none", 0 >= s), u["default"](".js-downgrade-info").toggleClass("d-none", s >= 0), u["default"](".js-extra-seats-line-item").toggleClass("d-none", e.no_additional_seats);
                var n = e.selectors;
                for (t in n) {
                    var i = n[t];
                    u["default"](t).text(i)
                }
                return a.replaceState(r.getState(), "", e.url)
            }
            c && c.abort();
            var t = u["default"](this).attr("data-item-name") || "items",
                n = parseInt(u["default"](this).attr("data-item-minimum")) || 0,
                i = parseInt(u["default"](this).attr("data-item-count")) || 0,
                s = Math.max(n, parseInt(this.value) || 0),
                o = s > 300,
                l = document.querySelector(".js-purchase-button");
            l instanceof HTMLButtonElement && (l.disabled = 0 === s || o);
            var d = document.querySelector(".js-downgrade-button");
            d instanceof HTMLButtonElement && (d.disabled = s === i);
            var f = {};
            return f[t] = s, c = u["default"].ajax({
                url: u["default"](this).attr("data-url"),
                data: f
            }), c.then(e)
        }
        var u = s(n),
            l = s(i),
            c = null;
        e.observe(".js-addon-purchase-field", function() {
            return t.addThrottledInputEventListener(this, o), {
                add: function() {
                    l["default"](this) && o.call(u["default"](".js-addon-purchase-field")[0])
                }
            }
        }), e.observe(".js-addon-downgrade-field", function() {
            return u["default"](this).on("change", o), {
                add: function() {
                    l["default"](this) && o.call(u["default"](".js-addon-downgrade-field")[0])
                }
            }
        })
    }), define.register("jquery.payment"),
    function() {
        var e = [].slice,
            t = [].indexOf || function(e) {
                for (var t = 0, n = this.length; n > t; t++)
                    if (t in this && this[t] === e) return t;
                return -1
            };
        define(["jquery"], function(n) {
            var i, r, a, s, o, u, l, c, d, f, h, m, v, p, g, b, y, j, w, x, S, k, L;
            return n.payment = {}, n.payment.fn = {}, n.fn.payment = function() {
                var t, i;
                return i = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [], n.payment.fn[i].apply(this, t)
            }, s = /(\d{1,4})/g, n.payment.cards = a = [{
                type: "elo",
                patterns: [401178, 401179, 431274, 438935, 451416, 457393, 457631, 457632, 504175, 506699, 5067, 509, 627780, 636297, 636368, 650, 6516, 6550],
                format: s,
                length: [16],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "maestro",
                patterns: [5018, 502, 503, 506, 56, 58, 639, 6220, 67],
                format: s,
                length: [12, 13, 14, 15, 16, 17, 18, 19],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "forbrugsforeningen",
                patterns: [600],
                format: s,
                length: [16],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "dankort",
                patterns: [5019],
                format: s,
                length: [16],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "visa",
                patterns: [4],
                format: s,
                length: [13, 16],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "mastercard",
                patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
                format: s,
                length: [16],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "amex",
                patterns: [34, 37],
                format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                length: [15],
                cvcLength: [3, 4],
                luhn: !0
            }, {
                type: "dinersclub",
                patterns: [30, 36, 38, 39],
                format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
                length: [14],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "discover",
                patterns: [60, 64, 65, 622],
                format: s,
                length: [16],
                cvcLength: [3],
                luhn: !0
            }, {
                type: "unionpay",
                patterns: [62, 88],
                format: s,
                length: [16, 17, 18, 19],
                cvcLength: [3],
                luhn: !1
            }, {
                type: "jcb",
                patterns: [35],
                format: s,
                length: [16],
                cvcLength: [3],
                luhn: !0
            }], i = function(e) {
                var t, n, i, r, s, o, u, l;
                for (e = (e + "").replace(/\D/g, ""), r = 0, o = a.length; o > r; r++)
                    for (t = a[r], l = t.patterns, s = 0, u = l.length; u > s; s++)
                        if (i = l[s], n = i + "", e.substr(0, n.length) === n) return t
            }, r = function(e) {
                var t, n, i;
                for (n = 0, i = a.length; i > n; n++)
                    if (t = a[n], t.type === e) return t
            }, m = function(e) {
                var t, n, i, r, a, s;
                for (i = !0, r = 0, n = (e + "").split("").reverse(), a = 0, s = n.length; s > a; a++) t = n[a], t = parseInt(t, 10), (i = !i) && (t *= 2), t > 9 && (t -= 9), r += t;
                return r % 10 === 0
            }, h = function(e) {
                var t;
                return null != e.prop("selectionStart") && e.prop("selectionStart") !== e.prop("selectionEnd") ? !0 : null != ("undefined" != typeof document && null !== document && null != (t = document.selection) ? t.createRange : void 0) && document.selection.createRange().text ? !0 : !1
            }, k = function(e, t) {
                var n, i, r, a, s, o;
                try {
                    i = t.prop("selectionStart")
                } catch (u) {
                    a = u, i = null
                }
                return s = t.val(), t.val(e), null !== i && t.is(":focus") ? (i === s.length && (i = e.length), s !== e && (o = s.slice(i - 1, +i + 1 || 9e9), n = e.slice(i - 1, +i + 1 || 9e9), r = e[i], /\d/.test(r) && o === "" + r + " " && n === " " + r && (i += 1)), t.prop("selectionStart", i), t.prop("selectionEnd", i)) : void 0
            }, y = function(e) {
                var t, n, i, r, a, s, o, u;
                for (null == e && (e = ""), i = "\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19", r = "0123456789", s = "", t = e.split(""), o = 0, u = t.length; u > o; o++) n = t[o], a = i.indexOf(n), a > -1 && (n = r[a]), s += n;
                return s
            }, b = function(e) {
                var t;
                return t = n(e.currentTarget), setTimeout(function() {
                    var e;
                    return e = t.val(), e = y(e), e = e.replace(/\D/g, ""), k(e, t)
                })
            }, p = function(e) {
                var t;
                return t = n(e.currentTarget), setTimeout(function() {
                    var e;
                    return e = t.val(), e = y(e), e = n.payment.formatCardNumber(e), k(e, t)
                })
            }, l = function(e) {
                var t, r, a, s, o, u, l;
                return a = String.fromCharCode(e.which), !/^\d+$/.test(a) || (t = n(e.currentTarget), l = t.val(), r = i(l + a), s = (l.replace(/\D/g, "") + a).length, u = 16, r && (u = r.length[r.length.length - 1]), s >= u || null != t.prop("selectionStart") && t.prop("selectionStart") !== l.length) ? void 0 : (o = r && "amex" === r.type ? /^(\d{4}|\d{4}\s\d{6})$/ : /(?:^|\s)(\d{4})$/, o.test(l) ? (e.preventDefault(), setTimeout(function() {
                    return t.val(l + " " + a)
                })) : o.test(l + a) ? (e.preventDefault(), setTimeout(function() {
                    return t.val(l + a + " ")
                })) : void 0)
            }, o = function(e) {
                var t, i;
                return t = n(e.currentTarget), i = t.val(), 8 !== e.which || null != t.prop("selectionStart") && t.prop("selectionStart") !== i.length ? void 0 : /\d\s$/.test(i) ? (e.preventDefault(), setTimeout(function() {
                    return t.val(i.replace(/\d\s$/, ""))
                })) : /\s\d?$/.test(i) ? (e.preventDefault(), setTimeout(function() {
                    return t.val(i.replace(/\d$/, ""))
                })) : void 0
            }, g = function(e) {
                var t;
                return t = n(e.currentTarget), setTimeout(function() {
                    var e;
                    return e = t.val(), e = y(e), e = n.payment.formatExpiry(e), k(e, t)
                })
            }, c = function(e) {
                var t, i, r;
                return i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (t = n(e.currentTarget), r = t.val() + i, /^\d$/.test(r) && "0" !== r && "1" !== r ? (e.preventDefault(), setTimeout(function() {
                    return t.val("0" + r + " / ")
                })) : /^\d\d$/.test(r) ? (e.preventDefault(), setTimeout(function() {
                    var e, n;
                    return e = parseInt(r[0], 10), n = parseInt(r[1], 10), n > 2 && 0 !== e ? t.val("0" + e + " / " + n) : t.val("" + r + " / ")
                })) : void 0) : void 0
            }, d = function(e) {
                var t, i, r;
                return i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (t = n(e.currentTarget), r = t.val(), /^\d\d$/.test(r) ? t.val("" + r + " / ") : void 0) : void 0
            }, f = function(e) {
                var t, i, r;
                return r = String.fromCharCode(e.which), "/" === r || " " === r ? (t = n(e.currentTarget), i = t.val(), /^\d$/.test(i) && "0" !== i ? t.val("0" + i + " / ") : void 0) : void 0
            }, u = function(e) {
                var t, i;
                return t = n(e.currentTarget), i = t.val(), 8 !== e.which || null != t.prop("selectionStart") && t.prop("selectionStart") !== i.length ? void 0 : /\d\s\/\s$/.test(i) ? (e.preventDefault(), setTimeout(function() {
                    return t.val(i.replace(/\d\s\/\s$/, ""))
                })) : void 0
            }, v = function(e) {
                var t;
                return t = n(e.currentTarget), setTimeout(function() {
                    var e;
                    return e = t.val(), e = y(e), e = e.replace(/\D/g, "").slice(0, 4), k(e, t)
                })
            }, S = function(e) {
                var t;
                return e.metaKey || e.ctrlKey ? !0 : 32 === e.which ? !1 : 0 === e.which ? !0 : e.which < 33 ? !0 : (t = String.fromCharCode(e.which), !!/[\d\s]/.test(t))
            }, w = function(e) {
                var t, r, a, s;
                return t = n(e.currentTarget), a = String.fromCharCode(e.which), /^\d+$/.test(a) && !h(t) ? (s = (t.val() + a).replace(/\D/g, ""), r = i(s), r ? s.length <= r.length[r.length.length - 1] : s.length <= 16) : void 0
            }, x = function(e) {
                var t, i, r;
                return t = n(e.currentTarget), i = String.fromCharCode(e.which), /^\d+$/.test(i) && !h(t) ? (r = t.val() + i, r = r.replace(/\D/g, ""), r.length > 6 ? !1 : void 0) : void 0
            }, j = function(e) {
                var t, i, r;
                return t = n(e.currentTarget), i = String.fromCharCode(e.which), /^\d+$/.test(i) && !h(t) ? (r = t.val() + i, r.length <= 4) : void 0
            }, L = function(e) {
                var t, i, r, s, o;
                return t = n(e.currentTarget), o = t.val(), s = n.payment.cardType(o) || "unknown", t.hasClass(s) ? void 0 : (i = function() {
                    var e, t, n;
                    for (n = [], e = 0, t = a.length; t > e; e++) r = a[e], n.push(r.type);
                    return n
                }(), t.removeClass("unknown"), t.removeClass(i.join(" ")), t.addClass(s), t.toggleClass("identified", "unknown" !== s), t.trigger("payment.cardType", s))
            }, n.payment.fn.formatCardCVC = function() {
                return this.on("keypress", S), this.on("keypress", j), this.on("paste", v), this.on("change", v), this.on("input", v), this
            }, n.payment.fn.formatCardExpiry = function() {
                return this.on("keypress", S), this.on("keypress", x), this.on("keypress", c), this.on("keypress", f), this.on("keypress", d), this.on("keydown", u), this.on("change", g), this.on("input", g), this
            }, n.payment.fn.formatCardNumber = function() {
                return this.on("keypress", S), this.on("keypress", w), this.on("keypress", l), this.on("keydown", o), this.on("keyup", L), this.on("paste", p), this.on("change", p), this.on("input", p), this.on("input", L), this
            }, n.payment.fn.restrictNumeric = function() {
                return this.on("keypress", S), this.on("paste", b), this.on("change", b), this.on("input", b), this
            }, n.payment.fn.cardExpiryVal = function() {
                return n.payment.cardExpiryVal(n(this).val())
            }, n.payment.cardExpiryVal = function(e) {
                var t, n, i, r;
                return r = e.split(/[\s\/]+/, 2), t = r[0], i = r[1], 2 === (null != i ? i.length : void 0) && /^\d+$/.test(i) && (n = (new Date).getFullYear(), n = n.toString().slice(0, 2), i = n + i), t = parseInt(t, 10), i = parseInt(i, 10), {
                    month: t,
                    year: i
                }
            }, n.payment.validateCardNumber = function(e) {
                var n, r;
                return e = (e + "").replace(/\s+|-/g, ""), /^\d+$/.test(e) ? (n = i(e), n ? (r = e.length, t.call(n.length, r) >= 0 && (n.luhn === !1 || m(e))) : !1) : !1
            }, n.payment.validateCardExpiry = function(e, t) {
                var i, r, a;
                return "object" == typeof e && "month" in e && (a = e, e = a.month, t = a.year), e && t ? (e = n.trim(e), t = n.trim(t), /^\d+$/.test(e) && /^\d+$/.test(t) && e >= 1 && 12 >= e ? (2 === t.length && (t = 70 > t ? "20" + t : "19" + t), 4 !== t.length ? !1 : (r = new Date(t, e), i = new Date, r.setMonth(r.getMonth() - 1), r.setMonth(r.getMonth() + 1, 1), r > i)) : !1) : !1
            }, n.payment.validateCardCVC = function(e, i) {
                var a, s;
                return e = n.trim(e), /^\d+$/.test(e) ? (a = r(i), null != a ? (s = e.length, t.call(a.cvcLength, s) >= 0) : e.length >= 3 && e.length <= 4) : !1
            }, n.payment.cardType = function(e) {
                var t;
                return e ? (null != (t = i(e)) ? t.type : void 0) || null : null
            }, n.payment.formatCardNumber = function(e) {
                var t, r, a, s;
                return e = e.replace(/\D/g, ""), (t = i(e)) ? (a = t.length[t.length.length - 1], e = e.slice(0, a), t.format.global ? null != (s = e.match(t.format)) ? s.join(" ") : void 0 : (r = t.format.exec(e), null != r ? (r.shift(), r = n.grep(r, function(e) {
                    return e
                }), r.join(" ")) : void 0)) : e
            }, n.payment.formatExpiry = function(e) {
                var t, n, i, r;
                return (n = e.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/)) ? (t = n[1] || "", i = n[2] || "", r = n[3] || "", r.length > 0 ? i = " / " : " /" === i ? (t = t.substring(0, 1), i = "") : 2 === t.length || i.length > 0 ? i = " / " : 1 === t.length && "0" !== t && "1" !== t && (t = "0" + t, i = " / "), t + i + r) : ""
            }
        })
    }.call(this), define.registerEnd(), define("github/payment", ["exports", "./jquery", "jquery.payment"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            o["default"](e).payment("formatCardNumber")
        }

        function r(e) {
            o["default"](e).payment("formatCardCVC")
        }

        function a(e) {
            return o["default"].payment.cardType(e)
        }

        function s(e) {
            return o["default"].payment.formatCardNumber(e)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.installCardNumberFormatter = i, e.installCardCVCFormatter = r, e.cardType = a, e.formatCardNumber = s;
        var o = n(t)
    }), define("github/legacy/behaviors/billing/credit_card_fields", ["../../../observe", "../../../payment", "../../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            var t = e.find("option:selected").text(),
                n = {
                    Austria: "ATU000000000",
                    Belgium: "BE0000000000",
                    Bulgaria: "BG000000000...",
                    Croatia: "",
                    Cyprus: "CY000000000X",
                    "Czech Republic": "CZ00000000...",
                    Denmark: "DK00 00 00 00",
                    Estonia: "EE000000000",
                    Finland: "FI00000000",
                    France: "FRXX 000000000",
                    Germany: "DE000000000",
                    Greece: "EL000000000",
                    Hungary: "HU00000000",
                    Iceland: "",
                    Ireland: "IE...",
                    Italy: "IT00000000000",
                    Latvia: "LV00000000000",
                    Lithuania: "LT000000000...",
                    Luxembourg: "LU00000000",
                    Malta: "MT00000000",
                    Netherlands: "NL000000000B00",
                    Norway: "",
                    Poland: "PL0000000000",
                    Portugal: "PT000000000",
                    Romania: "RO...",
                    Slovakia: "SK0000000000",
                    Slovenia: "",
                    Spain: "ES...",
                    Sweden: "SE000000000000",
                    Switzerland: "",
                    "United Kingdom": "GB..."
                },
                i = ["Angola", "Antigua and Barbuda", "Aruba", "Bahamas", "Belize", "Benin", "Botswana", "Cameroon", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Cook Islands", "C\xf4te d'Ivoire", "Djibouti", "Dominica", "Fiji", "French Southern Lands", "Ghana", "Guyana", "Hong Kong", "Ireland", "Kiribati", "Korea, North", "Malawi", "Maritania", "Mauritius", "Montserrat", "Nauru", "Niue", "Qatar", "Saint Kitts and Nevis", "Saint Lucia", "Sao Tome and Principe", "Seychelles", "Sierra Leone", "Sint Maarten (Dutch part)", "Solomon Islands", "Somalia", "Suriname", "Syria", "Togo", "Tokelau", "Tonga", "United Arab Emirates", "Vanuatu", "Yemen", "Zimbabwe"],
                r = n[t];
            a["default"](".js-setup-creditcard").toggleClass("is-vat-country", null != r);
            var o = null != r ? "(" + r + ")" : "",
                u = e.parents(".js-setup-creditcard").find(".js-vat-help-text");
            u.html(o), "United States of America" !== t ? (a["default"](".js-setup-creditcard").addClass("is-international"), a["default"](".js-select-state").removeAttr("required").val("")) : (a["default"](".js-setup-creditcard").removeClass("is-international"), a["default"](".js-select-state").attr("required", "required")), s.call(i, t) >= 0 ? (a["default"](".js-setup-creditcard").addClass("no-postcodes"), a["default"](".js-postal-code-field").removeAttr("required").val("")) : (a["default"](".js-setup-creditcard").removeClass("no-postcodes"), a["default"](".js-postal-code-field").attr("required", "required"))
        }
        var a = i(n),
            s = [].indexOf || function(e) {
                for (var t = 0, n = this.length; n > t; t++)
                    if (t in this && this[t] === e) return t;
                return -1
            };
        e.observe(".js-card-select-number-field", {
            add: function() {
                t.installCardNumberFormatter(this)
            }
        }), e.observe(".js-card-cvv", {
            add: function() {
                t.installCardCVCFormatter(this)
            }
        }), e.observe(".js-card-select-number-field", function() {
            var e = a["default"](this).closest("form"),
                n = e.find(".js-card"),
                i = e.find(".js-card-select-type-field");
            a["default"](this).on("input", function() {
                var e = void 0,
                    r = void 0,
                    s = a["default"](this).val(),
                    o = t.cardType(s);
                if (o)
                    for (e = 0, r = n.length; r > e; e++) {
                        var u = n[e];
                        a["default"](u).toggleClass("enabled", a["default"](u).attr("data-name") === o), a["default"](u).toggleClass("disabled", a["default"](u).attr("data-name") !== o)
                    } else n.removeClass("enabled disabled");
                i.val(o)
            })
        }), a["default"](document).on("blur", ".js-card-select-number-field", function() {
            a["default"](this).val(t.formatCardNumber(a["default"](this).val()))
        }), a["default"](document).on("click", ".js-card", function() {
            var e = a["default"](this).closest("form"),
                t = e.find(".js-card-select-number-field");
            t.focus()
        }), a["default"](document).on("click", ".js-enter-new-card", function(e) {
            var t = a["default"](this).closest(".js-setup-creditcard"),
                n = t.find(".js-card-select-number-field");
            t.removeClass("has-credit-card"), n.attr("required", "required"), n.attr("data-encrypted-name", "billing[credit_card][number]"), e.preventDefault()
        }), a["default"](document).on("click", ".js-cancel-enter-new-card", function(e) {
            var t = a["default"](this).closest(".js-setup-creditcard"),
                n = t.find(".js-card-select-number-field");
            t.addClass("has-credit-card"), n.removeAttr("required"), n.removeAttr("data-encrypted-name"), e.preventDefault()
        }), a["default"](document).on("change", ".js-select-country", function() {
            r(a["default"](this))
        }), e.observe(".js-select-country", function() {
            r(a["default"](this))
        })
    }), define("github/legacy/behaviors/billing/payment_methods", ["../../../observe", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("change", ".js-payment-methods .js-payment-method", function() {
            var e = i["default"](this).closest(".js-payment-methods"),
                t = i["default"](this).attr("data-selected-tab");
            e.find(".js-selected-payment-method").removeClass("active"), e.find("." + t).addClass("active")
        }), e.observe(".js-selected-payment-method:not(.active)", {
            add: function() {
                i["default"](this).addClass("has-removed-contents")
            },
            remove: function() {
                i["default"](this).removeClass("has-removed-contents")
            }
        }), e.observe(".js-billing-payment-methods", function() {
            i["default"](this).removeClass("disabled")
        }), i["default"](document).on("click", ".js-toggle-change-payment-method", function() {
            var e = this.closest(".js-change-payment-method-container");
            e.querySelector(".js-change-payment-method").classList.toggle("has-removed-contents"), e.querySelector(".js-current-payment-method").classList.toggle("d-none")
        })
    }), define("github/stats", ["exports", "./proxy-site-detection", "./document-ready"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            var t = document.querySelector("meta[name=" + e + "]");
            return t ? t.getAttribute("content") : void 0
        }

        function a() {
            o = null;
            var e = r("browser-stats-url"),
                t = r("request-id");
            e && !s["default"](document) && (fetch(e, {
                method: "POST",
                body: JSON.stringify([{
                    requestId: t
                }].concat(u)),
                headers: {
                    "Content-Type": "application/json"
                }
            }), u = [])
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = function(e) {
            u.push(e), n.loaded.then(function() {
                o || (o = requestIdleCallback(a))
            })
        };
        var s = i(t),
            o = null,
            u = []
    }), define("github/legacy/behaviors/browser-features-stats", ["../../stats", "../../feature-detection"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e),
            r = n(t);
        i["default"]({
            browserfeatures: {
                classlist_multi_arg: r["default"].classListMultiArg,
                classlist: r["default"].classList,
                closest: r["default"].closest,
                custom_elements: r["default"].registerElement,
                custom_event: r["default"].CustomEvent,
                emoji_ios: r["default"].emojiSupportLevel,
                fetch: r["default"].fetch,
                matches: r["default"].matches,
                performance_getentries: r["default"].performanceGetEntries,
                performance_mark: r["default"].performanceMark,
                performance_now: r["default"].performanceNow,
                promise: r["default"].Promise,
                send_beacon: r["default"].sendBeacon,
                string_ends_with: r["default"].stringEndsWith,
                string_starts_with: r["default"].stringStartsWith,
                timezone: r["default"].timezone,
                url: r["default"].URL,
                url_search_params: r["default"].URLSearchParams,
                weakmap: r["default"].WeakMap
            }
        })
    }), define("github/legacy/behaviors/bundle-download-stats", ["../../jquery", "../../stats"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            var e = void 0,
                t = void 0,
                n = void 0,
                i = function() {
                    try {
                        return localStorage.getItem("bundle-urls")
                    } catch (e) {}
                }();
            i && (t = function() {
                try {
                    return JSON.parse(i)
                } catch (e) {}
            }()), null == t && (t = {});
            var a = r();
            try {
                localStorage.setItem("bundle-urls", JSON.stringify(a))
            } catch (o) {}
            var u = function() {
                var i = [];
                for (e in a) n = a[e], t[e] !== n && i.push(e);
                return i
            }();
            return u.length ? s["default"]({
                downloadedbundles: u
            }) : void 0
        }

        function r() {
            var e = void 0,
                t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                s = void 0,
                o = {},
                u = a["default"]("script");
            for (t = 0, i = u.length; i > t; t++) {
                var l = u[t];
                s = l.src.match(/\/([\w-]+)-[0-9a-f]{64}\.js$/), null != s && (e = s[1], o[e + ".js"] = l.src)
            }
            var c = a["default"]("link[rel=stylesheet]");
            for (n = 0, r = c.length; r > n; n++) {
                var d = c[n];
                s = d.href.match(/\/([\w-]+)-[0-9a-f]{64}\.css$/), null != s && (e = s[1], o[e + ".css"] = d.href)
            }
            return o
        }
        var a = n(e),
            s = n(t);
        a["default"](window).on("load", i)
    }), define("github/legacy/behaviors/buttons", ["../../observe"], function(e) {
        function t(e) {
            e.preventDefault(), e.stopPropagation()
        }
        e.observe("a.btn.disabled", {
            add: function(e) {
                e.addEventListener("click", t)
            },
            remove: function(e) {
                e.removeEventListener("click", t);
            }
        })
    }), define("github/legacy/behaviors/check_all", ["../../jquery", "../../setimmediate"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            return a["default"](e).closest(".js-check-all-container")[0] || document.body
        }

        function r(e, t, n, i) {
            null == i && (i = !1), t.indeterminate = i, t.checked !== n && (t.checked = n, s["default"](function() {
                var n = new CustomEvent("change", {
                    bubbles: !0,
                    cancelable: !1
                });
                n.relatedTarget = e, t.dispatchEvent(n)
            }))
        }
        var a = n(e),
            s = n(t);
        a["default"](document).on("change", "input.js-check-all", function(e) {
            var t = void 0,
                n = void 0;
            if (!a["default"](e.relatedTarget).is("input.js-check-all-item")) {
                var s = a["default"](i(this)),
                    o = s.find("input.js-check-all-item");
                for (t = 0, n = o.length; n > t; t++) {
                    var u = o[t];
                    r(this, u, this.checked)
                }
                o.removeClass("is-last-changed")
            }
        });
        var o = null;
        a["default"](document).on("mousedown", "input.js-check-all-item", function(e) {
            o = e.shiftKey
        }), a["default"](document).on("change", "input.js-check-all-item", function(e) {
            var t = void 0,
                n = void 0,
                s = void 0,
                u = void 0,
                l = void 0,
                c = void 0;
            if (!a["default"](e.relatedTarget).is("input.js-check-all, input.js-check-all-item")) {
                var d = a["default"](i(this)),
                    f = d.find("input.js-check-all")[0],
                    h = d.find("input.js-check-all-item");
                if (o && (s = h.filter(".is-last-changed")[0])) {
                    var m = h.toArray();
                    l = [m.indexOf(s), m.indexOf(this)].sort(), c = l[0], t = l[1];
                    var v = m.slice(c, +t + 1 || 9e9);
                    for (n = 0, u = v.length; u > n; n++) {
                        var p = v[n];
                        r(this, p, this.checked)
                    }
                }
                o = null, h.removeClass("is-last-changed"), a["default"](this).addClass("is-last-changed");
                var g = h.length,
                    b = function() {
                        var e = void 0,
                            t = void 0,
                            n = [];
                        for (e = 0, t = h.length; t > e; e++) {
                            var i = h[e];
                            i.checked && n.push(i)
                        }
                        return n
                    }().length,
                    y = b === g,
                    j = g > b && b > 0;
                r(this, f, y, j)
            }
        }), a["default"](document).on("change", "input.js-check-all-item", function() {
            var e = a["default"](i(this)),
                t = e.find(".js-check-all-count");
            if (t.length) {
                var n = e.find("input.js-check-all-item:checked").length;
                t.text(n)
            }
        })
    }), define("github/legacy/behaviors/clippable_behavior", ["delegated-events", "../../once"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            var t = document.createElement("pre");
            return t.style.width = "1px", t.style.height = "1px", t.style.position = "fixed", t.style.top = "5px", t.textContent = e, t
        }

        function r(e) {
            var t = getSelection();
            if (null != t) {
                t.removeAllRanges();
                var n = document.createRange();
                n.selectNodeContents(e), t.addRange(n), document.execCommand("copy"), t.removeAllRanges()
            }
        }

        function a(e) {
            var t = i(e);
            document.body.appendChild(t), r(t), document.body.removeChild(t)
        }

        function s(e) {
            e.select(), document.execCommand("copy");
            var t = getSelection();
            null != t && t.removeAllRanges()
        }

        function o(e) {
            return "INPUT" === e.nodeName || "TEXTAREA" === e.nodeName
        }
        var u = n(t);
        e.on("click", ".js-zeroclipboard", function() {
            var e = this,
                t = this.getAttribute("data-clipboard-text");
            if (t) a(t);
            else {
                var n = this.closest(".js-zeroclipboard-container"),
                    i = n.querySelector(".js-zeroclipboard-target");
                o(i) ? "hidden" === i.type ? a(i.value) : s(i) : r(i)
            }
            var l = this.getAttribute("data-copied-hint"),
                c = this.getAttribute("aria-label");
            l && l !== c && (this.setAttribute("aria-label", l), u["default"](this, "mouseleave").then(function() {
                null != c ? e.setAttribute("aria-label", c) : e.removeAttribute("aria-label")
            })), this.blur()
        })
    }), define("github/has-interactions", ["exports"], function(e) {
        function t(e) {
            return n(e) || a(e) || s(e) || o(e)
        }

        function n(e) {
            for (var t = e.querySelectorAll("input, textarea, select"), n = 0; n < t.length; n++) {
                var r = t[n];
                if (i(r)) return !0
            }
            return !1
        }

        function i(e) {
            if ("INPUT" === e.tagName || "TEXTAREA" === e.tagName || "SELECT" === e.tagName)
                if ("checkbox" === e.type) {
                    if (e.checked !== e.defaultChecked) return !0
                } else if (e.value !== e.defaultValue) return !0;
            return !1
        }

        function r(e) {
            if (1 !== e.nodeType) return !1;
            var t = e.nodeName.toLowerCase(),
                n = (e.getAttribute("type") || "").toLowerCase(),
                i = "input" === t && "submit" !== n && "reset" !== n;
            return "select" === t || "textarea" === t || i
        }

        function a(e) {
            var t = e.ownerDocument.activeElement;
            return r(t) && e === t || e.contains(t)
        }

        function s(e) {
            return e.matches(":active")
        }

        function o(e) {
            return e.closest(".is-dirty") || e.querySelector(".is-dirty") ? !0 : !1
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.hasInteractions = t, e.hasDirtyFields = n
    }), define("github/scrollby", ["exports", "./jquery", "./scrollto"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t, n) {
            if (0 === t && 0 === n) return [0, 0];
            var i = a(e);
            o["default"](e, {
                top: i.top + n,
                left: i.left + t
            });
            var r = a(e);
            return [r.left - i.left, r.top - i.top]
        }

        function a(e) {
            return e.offsetParent ? {
                top: s["default"](e).scrollTop(),
                left: s["default"](e).scrollLeft()
            } : {
                top: s["default"](document).scrollTop(),
                left: s["default"](document).scrollLeft()
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = r;
        var s = i(t),
            o = i(n)
    }), define("github/cumulative-scrollby", ["exports", "./dimensions", "./scrollby"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, n, i) {
            for (var r = t.overflowParent(e), o = 0, u = 0; r;) {
                var l = a["default"](r, n - o, i - u),
                    c = s(l, 2),
                    d = c[0],
                    f = c[1];
                if (o += d, u += f, o === n && u === i) break;
                r = t.overflowParent(r)
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = r;
        var a = i(n),
            s = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !i && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }()
    }), define("github/not-scrolling", ["exports", "./normalized-event-timestamp", "./debounce", "./setimmediate"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            return new Promise(function(n) {
                if (e === window && t.timeSinceTimestamp(u) > 500) return void o["default"](n);
                var i = s["default"](function() {
                    e.removeEventListener("scroll", i, {
                        capture: !0,
                        passive: !0
                    }), n()
                }, 500);
                e.addEventListener("scroll", i, {
                    capture: !0,
                    passive: !0
                }), i()
            })
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = a;
        var s = r(n),
            o = r(i),
            u = 0;
        window.addEventListener("scroll", function(e) {
            u = t.normalizedTimestamp(e.timeStamp)
        }, {
            capture: !0,
            passive: !0
        })
    }), define("github/preserve-position", ["exports", "./jquery", "./cumulative-scrollby", "./not-scrolling"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            return f["default"](window).then(function() {
                return o(s(), e)
            })
        }

        function s() {
            if (document.activeElement !== document.body) return document.activeElement;
            var e = document.querySelectorAll(":hover"),
                t = e.length;
            return t ? e[t - 1] : void 0
        }

        function o(e, t) {
            if (!e) return t();
            var n = u(e),
                i = t.call(e),
                r = l(n);
            if (r) {
                e = r.element;
                var a = r.top,
                    s = r.left,
                    o = e.getBoundingClientRect(),
                    c = o.top,
                    f = o.left;
                return d["default"](e, f - s, c - a), i
            }
        }

        function u(e) {
            for (var t = []; e;) {
                var n = e.getBoundingClientRect(),
                    i = n.top,
                    r = n.left;
                t.push({
                    element: e,
                    top: i,
                    left: r
                }), e = e.parentElement
            }
            return t
        }

        function l(e) {
            for (var t = 0, n = e.length; n > t; t++) {
                var i = e[t];
                if (c["default"].contains(document, i.element)) return i
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.preserveInteractivePosition = a, e.preservingScrollPosition = o;
        var c = r(t),
            d = r(n),
            f = r(i)
    }), define("github/xhr", ["exports"], function(e) {
        function t(e) {
            return new Promise(function(t, n) {
                e.onload = function() {
                    200 === e.status ? t(e.responseText) : n(new Error("XMLHttpRequest " + e.statusText))
                }, e.onerror = n, e.send()
            })
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.send = t
    }), define("github/updatable-content", ["exports", "./jquery", "./has-interactions", "./preserve-position", "./xhr"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function s(e) {
            var t, i, a;
            return regeneratorRuntime.async(function(s) {
                for (;;) switch (s.prev = s.next) {
                    case 0:
                        if (!c.get(e)) {
                            s.next = 2;
                            break
                        }
                        return s.abrupt("return");
                    case 2:
                        if (t = new XMLHttpRequest, i = e.getAttribute("data-url"), null != i) {
                            s.next = 6;
                            break
                        }
                        throw new Error("Element must have `data-url` attribute");
                    case 6:
                        return t.open("GET", i), t.setRequestHeader("Accept", "text/html"), t.setRequestHeader("X-Requested-With", "XMLHttpRequest"), c.set(e, t), s.prev = 10, s.next = 13, regeneratorRuntime.awrap(r.send(t));
                    case 13:
                        if (a = s.sent, !n.hasInteractions(e)) {
                            s.next = 16;
                            break
                        }
                        throw new Error("element had interactions");
                    case 16:
                        return s.abrupt("return", u(e, a));
                    case 19:
                        s.prev = 19, s.t0 = s["catch"](10), "XMLHttpRequest abort" !== s.t0.message && console.warn("Failed to update content", e, s.t0);
                    case 22:
                        return s.prev = 22, c["delete"](e), s.finish(22);
                    case 25:
                    case "end":
                        return s.stop()
                }
            }, null, this, [
                [10, 19, 22, 25]
            ])
        }

        function o(e, t) {
            var n;
            return regeneratorRuntime.async(function(i) {
                for (;;) switch (i.prev = i.next) {
                    case 0:
                        return n = c.get(e), n && n.abort(), i.abrupt("return", u(e, t));
                    case 3:
                    case "end":
                        return i.stop()
                }
            }, null, this)
        }

        function u(e, t) {
            return i.preserveInteractivePosition(function() {
                var n = l["default"](l["default"].parseHTML(t.trim()));
                return l["default"](e).replaceWith(n), n
            })
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.updateContent = s, e.replaceContent = o;
        var l = a(t),
            c = new WeakMap
    }), define("github/html-validation", ["exports"], function(e) {
        function t(e) {
            if (null == r) {
                var t = e.createElement("input");
                "checkValidity" in t ? (t.required = !0, t.value = "hi", r = t.cloneNode().checkValidity()) : r = !1
            }
            return r
        }

        function n(e) {
            if (e.hasAttribute("data-upload")) return !1;
            if (t(e.ownerDocument)) return e.checkValidity();
            if ("FORM" === e.tagName) {
                for (var i = e.elements, r = 0; r < i.length; r++) {
                    var a = i[r];
                    if (!n(a)) return !1
                }
                return !0
            }
            if (e.hasAttribute("required") && !e.value) return !1;
            if (e.hasAttribute("pattern")) {
                var s = new RegExp("^(?:" + e.getAttribute("pattern") + ")$");
                if (0 !== e.value.search(s)) return !1
            }
            return !0
        }

        function i(e, t) {
            var i = "FORM" === e.tagName ? e : e.form;
            null == t && (t = n(i));
            for (var r = i.querySelectorAll("button[data-disable-invalid]"), a = 0; a < r.length; a++) {
                var s = r[a];
                s.disabled = !t
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.checkValidity = n, e.revalidate = i;
        var r = void 0
    }), define("github/legacy/behaviors/commenting/ajax", ["../../../updatable-content", "../../../html-validation", "../../../jquery", "../../../setimmediate"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var a = r(n),
            s = r(i);
        a["default"](document).on("ajaxBeforeSend", ".js-new-comment-form", function(e) {
            return this === e.target && a["default"](this).data("remote-xhr") ? (s["default"](function() {
                throw new Error("canceled comment form submission")
            }), !1) : void 0
        }), a["default"](document).on("ajaxSend", ".js-new-comment-form", function(e) {
            return this === e.target ? a["default"](this).find(".js-comment-form-error").hide() : void 0
        }), a["default"](document).on("ajaxSuccess", ".js-new-comment-form", function(n, i, r, s) {
            var o = void 0;
            if (this === n.target) {
                this.reset(), a["default"](this).find(".js-resettable-field").each(function() {
                    this.value = this.getAttribute("data-reset-value")
                }), t.revalidate(this), a["default"](this).find(".js-write-tab").click();
                var u = s.updateContent;
                for (o in u) {
                    var l = u[o],
                        c = document.querySelector(o);
                    c ? e.replaceContent(c, l) : console.warn("couldn't find " + o + " for immediate update")
                }
            }
        }), a["default"](document).on("ajaxError", ".js-new-comment-form", function(e, t) {
            if (this === e.target) {
                var n = "You can't comment at this time";
                if (422 === t.status) {
                    var i = JSON.parse(t.responseText);
                    i.errors && (n += " \u2014 your comment ", n += " " + i.errors.join(", "))
                }
                return n += ". ", a["default"](this).find(".js-comment-form-error").show().text(n), !1
            }
        })
    }), define("github/legacy/behaviors/commenting/close", ["../../../observe"], function(e) {
        e.observe(".js-comment-and-button", function() {
            function e() {
                var e = this.value.trim();
                e !== r && (r = e, t.textContent = e ? t.getAttribute("data-comment-text") : i)
            }
            var t = this,
                n = t.form.querySelector(".js-comment-field"),
                i = t.textContent,
                r = !1;
            return {
                add: function() {
                    n.addEventListener("input", e), n.addEventListener("change", e)
                },
                remove: function() {
                    n.removeEventListener("input", e), n.removeEventListener("change", e)
                }
            }
        })
    }), define("github/legacy/behaviors/commenting/edit", ["delegated-events", "../../../jquery", "../../../has-interactions"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(t);
        e.on("click", ".js-comment-edit-button", function() {
            var t = this.closest(".js-comment");
            t.classList.add("is-comment-editing"), t.querySelector(".js-write-tab").click();
            var n = t.querySelector(".js-comment-field");
            n.focus(), e.fire(n, "change")
        }), r["default"](document).on("click", ".js-comment-cancel-button", function() {
            var e = void 0,
                t = void 0,
                i = r["default"](this).closest("form");
            if (n.hasDirtyFields(i[0]) && !confirm(r["default"](this).attr("data-confirm-text"))) return !1;
            var a = i.find("input, textarea");
            for (e = 0, t = a.length; t > e; e++) {
                var s = a[e];
                s.value = s.defaultValue
            }
            return r["default"](this).closest(".js-comment").removeClass("is-comment-editing"), !1
        }), r["default"](document).on("ajaxSend", ".js-comment-delete, .js-comment-update, .js-issue-update", function(e, t) {
            if (e.target === e.currentTarget) {
                var n = r["default"](this).closest(".js-comment");
                n.addClass("is-comment-loading"), n.find(".btn-sm").addClass("disabled");
                var i = n.attr("data-body-version");
                return i ? t.setRequestHeader("X-Body-Version", i) : void 0
            }
        }), r["default"](document).on("ajaxError", ".js-comment-update", function(e, t, n, i) {
            var a = void 0;
            if (e.target === e.currentTarget && (console.error("ajaxError for js-comment-update", i), 422 === t.status)) try {
                var s = JSON.parse(t.responseText),
                    o = r["default"](this).closest(".js-comment");
                if (s.stale) return t.stale = !0, o.addClass("is-comment-stale"), o.find(".btn-sm").addClass("disabled"), e.preventDefault();
                if (s.errors) {
                    var u = "There was an error posting your comment: " + s.errors.join(", ");
                    return o.find(".js-comment-update-error").text(u).show(), e.preventDefault()
                }
            } catch (l) {
                return a = l, console.error("Error trying to handle ajaxError for js-comment-update: " + a)
            }
        }), r["default"](document).on("ajaxComplete", ".js-comment-delete, .js-comment-update", function(e, t) {
            if (e.target === e.currentTarget) {
                var n = r["default"](this).closest(".js-comment");
                return n.removeClass("is-comment-loading"), n.find(".btn-sm").removeClass("disabled"), t.stale ? n.find(".form-actions button[type=submit].btn-sm").addClass("disabled") : void 0
            }
        }), r["default"](document).on("ajaxSuccess", ".js-comment-delete", function() {
            var e = this.closest(".js-comment"),
                t = this.closest(".js-comment-container");
            t || (t = this.closest(".js-line-comments")), 1 !== t.querySelectorAll(".js-comment").length && (t = e), r["default"](t).fadeOut(function() {
                e.remove()
            })
        }), r["default"](document).on("ajaxSuccess", ".js-comment-update", function(e, t, n, i) {
            var a = void 0,
                s = void 0;
            if (e.target === e.currentTarget) {
                var o = r["default"](this).closest(".js-comment");
                o.find(".js-comment-body").html(i.body), o.find(".js-comment-update-error").hide(), o.attr("data-body-version", i.newBodyVersion);
                var u = o.find("input, textarea");
                for (a = 0, s = u.length; s > a; a++) {
                    var l = u[a];
                    l.defaultValue = l.value
                }
                return o.removeClass("is-comment-stale"), o.removeClass("is-comment-editing")
            }
        }), r["default"](document).on("ajaxSuccess", ".js-issue-update", function(e, t, n, i) {
            var r = void 0,
                a = void 0,
                s = this,
                o = s.closest(".js-details-container");
            if (o.classList.remove("open"), null != i.issue_title) {
                o.querySelector(".js-issue-title").textContent = i.issue_title;
                var u = o.closest(".js-issues-results"),
                    l = u && u.querySelector(".js-merge-pull-request textarea");
                l && l.value === l.defaultValue && (l.value = l.defaultValue = i.issue_title)
            }
            document.title = i.page_title;
            var c = s.elements;
            for (r = 0, a = c.length; a > r; r++) {
                var d = c[r];
                d.defaultValue = d.value
            }
        })
    }), define("github/legacy/behaviors/commenting/focus", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("focusin", ".js-write-bucket", function() {
            return n["default"](this).addClass("focused")
        }), n["default"](document).on("focusout", ".js-write-bucket", function() {
            return n["default"](this).removeClass("focused")
        })
    }), define("github/menu", ["exports", "./jquery", "./fire", "delegated-events", "./hotkey", "./observe", "./perform-transition"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e) {
            p && l(p), i.fire(e, "menu:activate") && (f["default"](document).on("keydown.menu", d), f["default"](document).on("click.menu", c), p = e, v["default"](e, function() {
                e.classList.add("active");
                var t = e.querySelector(".js-menu-content [tabindex]");
                t && t.focus();
                var n = e.querySelector(".js-menu-content");
                n && (n.setAttribute("aria-hidden", "false"), n.setAttribute("aria-expanded", "true"));
                var i = e.querySelector(".js-menu-target");
                i && (i.setAttribute("aria-expanded", "true"), i.classList.add("selected"))
            }), h["default"](e, "menu:activated", {
                async: !0
            }))
        }

        function l(e) {
            e && i.fire(e, "menu:deactivate") && (f["default"](document).off(".menu"), p = null, v["default"](e, function() {
                e.classList.remove("active");
                var t = e.querySelector(".js-menu-content");
                t && (t.setAttribute("aria-hidden", "true"), t.setAttribute("aria-expanded", "false"));
                var n = e.querySelector(".js-menu-target");
                n && (n.setAttribute("aria-expanded", "false"), n.classList.remove("selected"))
            }), h["default"](e, "menu:deactivated", {
                async: !0
            }))
        }

        function c(e) {
            p && (f["default"](e.target).closest(p)[0] || (e.preventDefault(), l(p)))
        }

        function d(e) {
            if (p && "esc" === m["default"](e.originalEvent)) {
                var t = f["default"](document.activeElement).parents().get();
                t.indexOf(p) >= 0 && document.activeElement.blur(), e.preventDefault(), l(p)
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.activate = u, e.deactivate = l;
        var f = o(t),
            h = o(n),
            m = o(r),
            v = o(s),
            p = null;
        f["default"](document).on("click", ".js-menu-container", function(e) {
            var t = this,
                n = f["default"](e.target).closest(".js-menu-target")[0];
            n ? (e.preventDefault(), t === p ? l(t) : u(t)) : f["default"](e.target).closest(".js-menu-content")[0] || t === p && (e.preventDefault(), l(t))
        }), f["default"](document).on("click", ".js-menu-container .js-menu-close", function(e) {
            l(this.closest(".js-menu-container")), e.preventDefault()
        }), a.observe(".js-menu-container.active", {
            add: function() {
                document.body.classList.add("menu-active")
            },
            remove: function() {
                document.body.classList.remove("menu-active")
            }
        })
    }), define("github/legacy/behaviors/commenting/markdown-toolbar", ["../../../menu", "../../../observe", "delegated-events", "../../../hotkey"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            return e.trim().split("\n").length > 1
        }

        function s(e, t) {
            return Array(t + 1).join(e)
        }

        function o(e, t) {
            for (; e[t] && null != e[t - 1] && !e[t - 1].match(/\s/);) t--;
            return t
        }

        function u(e, t) {
            for (; e[t] && !e[t].match(/\s/);) t++;
            return t
        }

        function l(e, t) {
            var i = void 0,
                r = void 0,
                a = void 0;
            a = t.text, r = t.selectionStart, i = t.selectionEnd;
            var s = e.selectionStart;
            if (null === j || j) {
                e.contenteditable = !0;
                try {
                    j = document.execCommand("insertText", !1, a)
                } catch (o) {
                    j = !1
                }
                e.contenteditable = !1
            }
            if (!j) {
                var u = e.value.slice(0, e.selectionStart),
                    l = e.value.slice(e.selectionEnd);
                try {
                    document.execCommand("ms-beginUndoUnit")
                } catch (c) {}
                e.value = u + a + l;
                try {
                    document.execCommand("ms-endUndoUnit")
                } catch (c) {}
                n.fire(e, "input")
            }
            return null != r && null != i ? e.setSelectionRange(r, i) : e.setSelectionRange(s, e.selectionEnd)
        }

        function c(e, t) {
            var n = void 0,
                i = e.value.slice(e.selectionStart, e.selectionEnd);
            return n = t.orderedList ? v(e) : t.multiline && a(i) ? m(e, t) : h(e, t), l(e, n)
        }

        function d(e, t, n) {
            if (e.selectionStart === e.selectionEnd) e.selectionStart = o(e.value, e.selectionStart), e.selectionEnd = u(e.value, e.selectionEnd);
            else {
                var i = e.selectionStart - t.length,
                    r = e.selectionEnd + n.length,
                    a = e.value.slice(i, e.selectionStart) === t,
                    s = e.value.slice(e.selectionEnd, r) === n;
                a && s && (e.selectionStart = i, e.selectionEnd = r)
            }
            return e.value.slice(e.selectionStart, e.selectionEnd)
        }

        function f(e) {
            var t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                a = e.value.slice(0, e.selectionStart),
                o = e.value.slice(e.selectionEnd),
                u = null != (i = a.match(/\n*$/)) ? i[0].length : 0,
                l = null != (r = o.match(/^\n*/)) ? r[0].length : 0;
            return a.match(/\S/) && 2 > u && (t = s("\n", 2 - u)), o.match(/\S/) && 2 > l && (n = s("\n", 2 - l)), null == t && (t = ""), null == n && (n = ""), {
                newlinesToAppend: t,
                newlinesToPrepend: n
            }
        }

        function h(e, t) {
            var n = void 0,
                i = void 0,
                r = void 0,
                s = void 0,
                o = void 0,
                u = void 0,
                l = void 0,
                c = void 0,
                h = void 0,
                m = void 0,
                v = void 0,
                p = void 0,
                g = void 0,
                b = void 0,
                y = void 0,
                j = void 0,
                w = void 0,
                x = void 0;
            u = t.prefix, j = t.suffix, n = t.blockPrefix, i = t.blockSuffix, m = t.replaceNext, l = t.prefixSpace, p = t.scanFor, x = t.surroundWithNewlines;
            var S = e.selectionStart,
                k = e.selectionEnd;
            if (g = e.value.slice(e.selectionStart, e.selectionEnd), c = a(g) && n.length > 0 ? n + "\n" : u, w = a(g) && i.length > 0 ? "\n" + i : j, l) {
                var L = e.value[e.selectionStart - 1];
                0 === e.selectionStart || null == L || L.match(/\s/) || (c = " " + c)
            }
            g = d(e, c, w), y = e.selectionStart, b = e.selectionEnd;
            var _ = m.length > 0 && w.indexOf(m) > -1 && g.length > 0;
            if (x && (h = f(e), r = h.newlinesToAppend, s = h.newlinesToPrepend, c = r + u, w += s), g.startsWith(c) && g.endsWith(w)) return v = g.slice(c.length, g.length - w.length), S === k ? (o = S - c.length, o = Math.max(o, y), o = Math.min(o, y + v.length), y = b = o) : (y = y, b = y + v.length), {
                text: v,
                selectionStart: y,
                selectionEnd: b
            };
            if (_) return p.length > 0 && g.match(p) ? (w = w.replace(m, g), v = c + w, y = b = y + c.length, {
                text: v,
                selectionStart: y,
                selectionEnd: b
            }) : (v = c + g + w, y = y + c.length + g.length + w.indexOf(m), b = y + m.length, {
                text: v,
                selectionStart: y,
                selectionEnd: b
            });
            if (v = c + g + w, y = S + c.length, b = k + c.length, t.trimFirst) {
                var E = g.match(/^\s*|\s*$/g),
                    C = E[0] || "",
                    q = E[1] || "";
                v = C + c + g.trim() + w + q, y += C.length, b -= q.length
            }
            return {
                text: v,
                selectionStart: y,
                selectionEnd: b
            }
        }

        function m(e, t) {
            var n = void 0,
                i = void 0,
                r = void 0,
                a = void 0,
                s = void 0,
                o = void 0,
                u = void 0,
                l = void 0,
                c = void 0;
            a = t.prefix, u = t.suffix, l = t.surroundWithNewlines, c = e.value.slice(e.selectionStart, e.selectionEnd);
            var d = e.selectionStart;
            o = e.selectionEnd;
            var h = c.split("\n"),
                m = function() {
                    var e = void 0,
                        t = void 0,
                        i = [];
                    for (e = 0, t = h.length; t > e; e++) n = h[e], i.push(n.startsWith(a) && n.endsWith(u));
                    return i
                }(),
                v = m.every(function(e) {
                    return e
                });
            return v ? (c = function() {
                var e = void 0,
                    t = void 0,
                    i = [];
                for (e = 0, t = h.length; t > e; e++) n = h[e], i.push(n.slice(a.length, n.length - u.length));
                return i
            }().join("\n"), o = d + c.length) : (c = function() {
                var e = void 0,
                    t = void 0,
                    i = [];
                for (e = 0, t = h.length; t > e; e++) n = h[e], i.push(a + n + u);
                return i
            }().join("\n"), l && (s = f(e), i = s.newlinesToAppend, r = s.newlinesToPrepend, d += i.length, o = d + c.length, c = i + c + r)), {
                text: c,
                selectionStart: d,
                selectionEnd: o
            }
        }

        function v(e) {
            var t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                a = void 0,
                s = void 0,
                o = void 0,
                u = /^\d+\.\s+/,
                l = void 0,
                c = void 0;
            o = e.value.slice(e.selectionStart, e.selectionEnd), i = o.split("\n");
            var d = i.every(function(e) {
                return u.test(e)
            });
            return d ? (i = function() {
                var e = void 0,
                    t = void 0,
                    r = [];
                for (e = 0, t = i.length; t > e; e++) n = i[e], r.push(n.replace(u, ""));
                return r
            }(), o = i.join("\n")) : (i = function() {
                var e = void 0,
                    r = void 0,
                    a = [];
                for (t = e = 0, r = i.length; r > e; t = ++e) n = i[t], a.push(t + 1 + ". " + n);
                return a
            }(), o = i.join("\n"), s = f(e), r = s.newlinesToAppend, a = s.newlinesToPrepend, c = e.selectionStart + r.length, l = c + o.length, o = r + o + a), {
                text: o,
                selectionStart: c,
                selectionEnd: l
            }
        }

        function p(e) {
            var t = e.closest(".js-previewable-comment-form"),
                n = t.querySelector(".js-improved-comment-field"),
                i = {
                    prefix: e.getAttribute("data-prefix") || "",
                    suffix: e.getAttribute("data-suffix") || "",
                    blockPrefix: e.getAttribute("data-block-prefix") || "",
                    blockSuffix: e.getAttribute("data-block-suffix") || "",
                    multiline: e.hasAttribute("data-multiline"),
                    replaceNext: e.getAttribute("data-replace-next") || "",
                    prefixSpace: e.hasAttribute("data-prefix-space"),
                    scanFor: e.getAttribute("data-scan-for") || "",
                    surroundWithNewlines: e.hasAttribute("data-surround-with-newlines"),
                    orderedList: e.hasAttribute("data-ordered-list"),
                    trimFirst: e.hasAttribute("data-trim-first")
                };
            return n.focus(), c(n, i)
        }

        function g(e) {
            var t = void 0,
                n = void 0,
                i = x.get(e);
            if (i) return i;
            i = {};
            var r = e.querySelectorAll(".js-toolbar-item[data-toolbar-hotkey]");
            for (t = 0, n = r.length; n > t; t++) {
                var a = r[t],
                    s = a.getAttribute("data-toolbar-hotkey");
                i[w + "+" + s] = a
            }
            return x.set(e, i), i
        }

        function b() {
            if (!x.get(this)) {
                x.set(this, !0);
                var e = this.closest(".js-previewable-comment-form").querySelector(".js-toolbar"),
                    t = g(e);
                return this.addEventListener("keydown", function(e) {
                    var n = t[y["default"](e)];
                    n && (p(n), e.preventDefault())
                })
            }
        }
        var y = r(i),
            j = null;
        n.on("click", ".js-toolbar-item", function() {
            return e.deactivate(this.closest(".js-menu-container")), p(this)
        });
        var w = navigator.userAgent.match(/Macintosh/) ? "meta" : "ctrl",
            x = new WeakMap;
        t.observe(".js-improved-comment-field", function(e) {
            e.addEventListener("focus", b), document.activeElement === e && b.call(e)
        })
    }), define("github/legacy/behaviors/commenting/preview", ["../../../observe", "../../../normalized-event-timestamp", "../../../focused", "../../../jquery", "../../../fetch", "../../../stats", "../../../sliding-promise-queue"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e) {
            var t = e.getAttribute("data-preview-authenticity-token"),
                n = e.closest("form").elements.authenticity_token;
            return null != t ? t : null != n ? n.value : void 0
        }

        function l(e) {
            var t = e.closest(".js-previewable-comment-form"),
                n = e.classList.contains("js-preview-tab");
            if (n) {
                var i = t.querySelector(".js-write-bucket"),
                    r = t.querySelector(".js-preview-body");
                r.style.minHeight = h["default"](i).height() + "px"
            }
            t.classList.toggle("preview-selected", n), t.classList.toggle("write-selected", !n);
            var a = t.querySelector(".tabnav-tab.selected");
            a.setAttribute("aria-selected", !1), a.classList.remove("selected"), e.classList.add("selected"), e.setAttribute("aria-selected", !0);
            var s = t.querySelector(".js-write-tab");
            return n ? s.setAttribute("data-hotkey", "ctrl+P,meta+P") : s.removeAttribute("data-hotkey"), Promise.resolve(t)
        }

        function c(e, t) {
            var n = {
                    url: e.getAttribute("data-preview-url"),
                    data: {
                        text: t,
                        authenticity_token: u(e)
                    },
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    }
                },
                i = !e.dispatchEvent(new CustomEvent("preview:setup", {
                    bubbles: !0,
                    cancelable: !0,
                    detail: n
                }));
            if (i) return Promise.reject(new Error("preview canceled"));
            t = JSON.stringify(n);
            var r = g.get(e),
                a = void 0,
                s = void 0;
            return r && (a = r[0], s = r[1]), a !== t && (b = !1, s = p.push(d(n)), s.then(function() {
                b = !0
            }), g.set(e, [t, s])), s
        }

        function d(e) {
            return r.fetchText(e.url, {
                method: "post",
                body: h["default"].param(e.data),
                headers: e.headers
            })
        }

        function f(e, n) {
            var i = e.querySelector(".js-comment-field"),
                r = e.querySelector(".comment-body");
            return c(e, i.value).then(function(e) {
                r.innerHTML = e || "<p>Nothing to preview</p>";
                var i = t.timeSinceTimestamp(n);
                return m["default"]({
                    preview_delay: {
                        ms: i,
                        version: 2
                    }
                })
            }), b ? void 0 : r.innerHTML = "<p>Loading preview&hellip;</p>"
        }
        var h = o(i),
            m = o(a),
            v = o(s);
        h["default"](document).on("click", ".js-write-tab", function() {
            l(this).then(function(e) {
                return e.querySelector(".js-comment-field").focus()
            });
            var e = this.closest(".js-previewable-comment-form").querySelector(".js-toolbar");
            return null != e && e.classList.remove("d-none"), !1
        }), h["default"](document).on("click", ".js-preview-tab", function(e) {
            var n = t.normalizedTimestamp(e.timeStamp);
            l(this).then(function(e) {
                f(e, n)
            });
            var i = this.closest(".js-previewable-comment-form").querySelector(".js-toolbar");
            return null != i && i.classList.add("d-none"), !1
        }), h["default"](document).on("preview:render", ".js-previewable-comment-form", function(e) {
            var n = e.originalEvent.detail.requestedAt || t.normalizedTimestamp(e.timeStamp),
                i = this.querySelector(".js-preview-tab");
            return l(i).then(function(e) {
                f(e, n)
            })
        });
        var p = new v["default"],
            g = new WeakMap,
            b = !1;
        e.observe(".js-preview-tab", function(e) {
            var t = void 0,
                n = void 0;
            e.addEventListener("mouseenter", function() {
                t || (t = e.closest(".js-previewable-comment-form"), n = t.querySelector(".js-comment-field")), c(t, n.value)
            })
        }), n.onFocusedKeydown(document, ".js-comment-field", function() {
            var e = this.closest(".js-previewable-comment-form");
            return function(n) {
                return "ctrl+P" !== n.hotkey && "meta+P" !== n.hotkey || !e.classList.contains("write-selected") ? void 0 : (this.blur(), e.dispatchEvent(new CustomEvent("preview:render", {
                    bubbles: !0,
                    cancelable: !1,
                    detail: {
                        requestedAt: t.normalizedTimestamp(n.timeStamp)
                    }
                })), n.stopImmediatePropagation(), !1)
            }
        })
    }), define("github/legacy/behaviors/conversation-anchor-stats", ["../../stats", "../../hash-change"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e),
            r = n(t);
        r["default"](function(e) {
            var t = window.location.hash.slice(1);
            return t && /\/(issues|pulls?)\/\d+/.test(e.newURL) ? i["default"]({
                conversation_anchor: {
                    anchor: t,
                    matches_element: e.target !== window
                }
            }) : void 0
        })
    }), define.register("jcrop"), define(["jquery"], function(e) {
        e.Jcrop = function(t, n) {
            function i(e) {
                return Math.round(e) + "px"
            }

            function r(e) {
                return D.baseClass + "-" + e
            }

            function a() {
                return e.fx.step.hasOwnProperty("backgroundColor")
            }

            function s(t) {
                var n = e(t).offset();
                return [n.left, n.top]
            }

            function o(e) {
                return [e.pageX - I[0], e.pageY - I[1]]
            }

            function u(t) {
                "object" != typeof t && (t = {}), D = e.extend(D, t), e.each(["onChange", "onSelect", "onRelease", "onDblClick"], function(e, t) {
                    "function" != typeof D[t] && (D[t] = function() {})
                })
            }

            function l(e, t, n) {
                if (I = s(U), me.setCursor("move" === e ? e : e + "-resize"), "move" === e) return me.activateHandlers(d(t), p, n);
                var i = de.getFixed(),
                    r = f(e),
                    a = de.getCorner(f(r));
                de.setPressed(de.getCorner(r)), de.setCurrent(a), me.activateHandlers(c(e, i), p, n)
            }

            function c(e, t) {
                return function(n) {
                    if (D.aspectRatio) switch (e) {
                        case "e":
                            n[1] = t.y + 1;
                            break;
                        case "w":
                            n[1] = t.y + 1;
                            break;
                        case "n":
                            n[0] = t.x + 1;
                            break;
                        case "s":
                            n[0] = t.x + 1
                    } else switch (e) {
                        case "e":
                            n[1] = t.y2;
                            break;
                        case "w":
                            n[1] = t.y2;
                            break;
                        case "n":
                            n[0] = t.x2;
                            break;
                        case "s":
                            n[0] = t.x2
                    }
                    de.setCurrent(n), he.update()
                }
            }

            function d(e) {
                var t = e;
                return ve.watchKeys(),
                    function(e) {
                        de.moveOffset([e[0] - t[0], e[1] - t[1]]), t = e, he.update()
                    }
            }

            function f(e) {
                switch (e) {
                    case "n":
                        return "sw";
                    case "s":
                        return "nw";
                    case "e":
                        return "nw";
                    case "w":
                        return "ne";
                    case "ne":
                        return "sw";
                    case "nw":
                        return "se";
                    case "se":
                        return "nw";
                    case "sw":
                        return "ne"
                }
            }

            function h(e) {
                return function(t) {
                    return D.disabled ? !1 : "move" !== e || D.allowMove ? (I = s(U), ie = !0, l(e, o(t)), t.stopPropagation(), t.preventDefault(), !1) : !1
                }
            }

            function m(e, t, n) {
                var i = e.width(),
                    r = e.height();
                i > t && t > 0 && (i = t, r = t / e.width() * e.height()), r > n && n > 0 && (r = n, i = n / e.height() * e.width()), te = e.width() / i, ne = e.height() / r, e.width(i).height(r)
            }

            function v(e) {
                return {
                    x: e.x * te,
                    y: e.y * ne,
                    x2: e.x2 * te,
                    y2: e.y2 * ne,
                    w: e.w * te,
                    h: e.h * ne
                }
            }

            function p(e) {
                var t = de.getFixed();
                t.w > D.minSelect[0] && t.h > D.minSelect[1] ? (he.enableHandles(), he.done()) : he.release(), me.setCursor(D.allowSelect ? "crosshair" : "default")
            }

            function g(e) {
                if (!D.disabled && D.allowSelect) {
                    ie = !0, I = s(U), he.disableHandles(), me.setCursor("crosshair");
                    var t = o(e);
                    return de.setPressed(t), he.update(), me.activateHandlers(b, p, "touch" === e.type.substring(0, 5)), ve.watchKeys(), e.stopPropagation(), e.preventDefault(), !1
                }
            }

            function b(e) {
                de.setCurrent(e), he.update()
            }

            function y() {
                var t = e("<div></div>").addClass(r("tracker"));
                return R && t.css({
                    opacity: 0,
                    backgroundColor: "white"
                }), t
            }

            function j(e) {
                V.removeClass().addClass(r("holder")).addClass(e)
            }

            function w(e, t) {
                function n() {
                    window.setTimeout(b, d)
                }
                var i = e[0] / te,
                    r = e[1] / ne,
                    a = e[2] / te,
                    s = e[3] / ne;
                if (!re) {
                    var o = de.flipCoords(i, r, a, s),
                        u = de.getFixed(),
                        l = [u.x, u.y, u.x2, u.y2],
                        c = l,
                        d = D.animationDelay,
                        f = o[0] - l[0],
                        h = o[1] - l[1],
                        m = o[2] - l[2],
                        v = o[3] - l[3],
                        p = 0,
                        g = D.swingSpeed;
                    i = c[0], r = c[1], a = c[2], s = c[3], he.animMode(!0);
                    var b = function() {
                        return function() {
                            p += (100 - p) / g, c[0] = Math.round(i + p / 100 * f), c[1] = Math.round(r + p / 100 * h), c[2] = Math.round(a + p / 100 * m), c[3] = Math.round(s + p / 100 * v), p >= 99.8 && (p = 100), 100 > p ? (S(c), n()) : (he.done(), he.animMode(!1), "function" == typeof t && t.call(pe))
                        }
                    }();
                    n()
                }
            }

            function x(e) {
                S([e[0] / te, e[1] / ne, e[2] / te, e[3] / ne]), D.onSelect.call(pe, v(de.getFixed())), he.enableHandles()
            }

            function S(e) {
                de.setPressed([e[0], e[1]]), de.setCurrent([e[2], e[3]]), he.update()
            }

            function k() {
                return v(de.getFixed())
            }

            function L() {
                return de.getFixed()
            }

            function _(e) {
                u(e), H()
            }

            function E() {
                D.disabled = !0, he.disableHandles(), he.setCursor("default"), me.setCursor("default")
            }

            function C() {
                D.disabled = !1, H()
            }

            function q() {
                he.done(), me.activateHandlers(null, null)
            }

            function T() {
                V.remove(), F.show(), F.css("visibility", "visible"), e(t).removeData("Jcrop")
            }

            function A(e, t) {
                he.release(), E();
                var n = new Image;
                n.onload = function() {
                    var i = n.width,
                        r = n.height,
                        a = D.boxWidth,
                        s = D.boxHeight;
                    U.width(i).height(r), U.attr("src", e), Y.attr("src", e), m(U, a, s), $ = U.width(), W = U.height(), Y.width($).height(W), oe.width($ + 2 * se).height(W + 2 * se), V.width($).height(W), fe.resize($, W), C(), "function" == typeof t && t.call(pe)
                }, n.src = e
            }

            function M(e, t, n) {
                var i = t || D.bgColor;
                D.bgFade && a() && D.fadeTime && !n ? e.animate({
                    backgroundColor: i
                }, {
                    queue: !1,
                    duration: D.fadeTime
                }) : e.css("backgroundColor", i)
            }

            function H(e) {
                D.allowResize ? e ? he.enableOnly() : he.enableHandles() : he.disableHandles(), me.setCursor(D.allowSelect ? "crosshair" : "default"), he.setCursor(D.allowMove ? "move" : "default"), D.hasOwnProperty("trueSize") && (te = D.trueSize[0] / $, ne = D.trueSize[1] / W), D.hasOwnProperty("setSelect") && (x(D.setSelect), he.done(), delete D.setSelect), fe.refresh(), D.bgColor != ue && (M(D.shade ? fe.getShades() : V, D.shade ? D.shadeColor || D.bgColor : D.bgColor),
                    ue = D.bgColor), le != D.bgOpacity && (le = D.bgOpacity, D.shade ? fe.refresh() : he.setBgOpacity(le)), K = D.maxSize[0] || 0, Q = D.maxSize[1] || 0, Z = D.minSize[0] || 0, ee = D.minSize[1] || 0, D.hasOwnProperty("outerImage") && (U.attr("src", D.outerImage), delete D.outerImage), he.refresh()
            }
            var I, D = e.extend({}, e.Jcrop.defaults),
                P = navigator.userAgent.toLowerCase(),
                R = /msie/.test(P),
                O = /msie [1-6]\./.test(P);
            "object" != typeof t && (t = e(t)[0]), "object" != typeof n && (n = {}), u(n);
            var N = {
                    border: "none",
                    visibility: "visible",
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    top: 0,
                    left: 0
                },
                F = e(t),
                B = !0;
            if ("IMG" == t.tagName) {
                if (0 != F[0].width && 0 != F[0].height) F.width(F[0].width), F.height(F[0].height);
                else {
                    var z = new Image;
                    z.src = F[0].src, F.width(z.width), F.height(z.height)
                }
                var U = F.clone().removeAttr("id").css(N).show();
                U.width(F.width()), U.height(F.height()), F.after(U).hide()
            } else U = F.css(N).show(), B = !1, null === D.shade && (D.shade = !0);
            m(U, D.boxWidth, D.boxHeight);
            var $ = U.width(),
                W = U.height(),
                V = e("<div />").width($).height(W).addClass(r("holder")).css({
                    position: "relative",
                    backgroundColor: D.bgColor
                }).insertAfter(F).append(U);
            D.addClass && V.addClass(D.addClass);
            var Y = e("<div />"),
                J = e("<div />").width("100%").height("100%").css({
                    zIndex: 310,
                    position: "absolute",
                    overflow: "hidden"
                }),
                X = e("<div />").width("100%").height("100%").css("zIndex", 320),
                G = e("<div />").css({
                    position: "absolute",
                    zIndex: 600
                }).dblclick(function() {
                    var e = de.getFixed();
                    D.onDblClick.call(pe, e)
                }).insertBefore(U).append(J, X);
            B && (Y = e("<img />").attr("src", U.attr("src")).css(N).width($).height(W), J.append(Y)), O && G.css({
                overflowY: "hidden"
            });
            var K, Q, Z, ee, te, ne, ie, re, ae, se = D.boundary,
                oe = y().width($ + 2 * se).height(W + 2 * se).css({
                    position: "absolute",
                    top: i(-se),
                    left: i(-se),
                    zIndex: 290
                }).mousedown(g),
                ue = D.bgColor,
                le = D.bgOpacity;
            I = s(U);
            var ce = function() {
                    function e() {
                        var e, t = {},
                            n = ["touchstart", "touchmove", "touchend"],
                            i = document.createElement("div");
                        try {
                            for (e = 0; e < n.length; e++) {
                                var r = n[e];
                                r = "on" + r;
                                var a = r in i;
                                a || (i.setAttribute(r, "return;"), a = "function" == typeof i[r]), t[n[e]] = a
                            }
                            return t.touchstart && t.touchend && t.touchmove
                        } catch (s) {
                            return !1
                        }
                    }

                    function t() {
                        return D.touchSupport === !0 || D.touchSupport === !1 ? D.touchSupport : e()
                    }
                    return {
                        createDragger: function(e) {
                            return function(t) {
                                return D.disabled ? !1 : "move" !== e || D.allowMove ? (I = s(U), ie = !0, l(e, o(ce.cfilter(t)), !0), t.stopPropagation(), t.preventDefault(), !1) : !1
                            }
                        },
                        newSelection: function(e) {
                            return g(ce.cfilter(e))
                        },
                        cfilter: function(e) {
                            return e.pageX = e.originalEvent.changedTouches[0].pageX, e.pageY = e.originalEvent.changedTouches[0].pageY, e
                        },
                        isSupported: e,
                        support: t()
                    }
                }(),
                de = function() {
                    function e(e) {
                        e = s(e), m = f = e[0], v = h = e[1]
                    }

                    function t(e) {
                        e = s(e), c = e[0] - m, d = e[1] - v, m = e[0], v = e[1]
                    }

                    function n() {
                        return [c, d]
                    }

                    function i(e) {
                        var t = e[0],
                            n = e[1];
                        0 > f + t && (t -= t + f), 0 > h + n && (n -= n + h), v + n > W && (n += W - (v + n)), m + t > $ && (t += $ - (m + t)), f += t, m += t, h += n, v += n
                    }

                    function r(e) {
                        var t = a();
                        switch (e) {
                            case "ne":
                                return [t.x2, t.y];
                            case "nw":
                                return [t.x, t.y];
                            case "se":
                                return [t.x2, t.y2];
                            case "sw":
                                return [t.x, t.y2]
                        }
                    }

                    function a() {
                        if (!D.aspectRatio) return u();
                        var e, t, n, i, r = D.aspectRatio,
                            a = D.minSize[0] / te,
                            s = D.maxSize[0] / te,
                            c = D.maxSize[1] / ne,
                            d = m - f,
                            p = v - h,
                            g = Math.abs(d),
                            b = Math.abs(p),
                            y = g / b;
                        return 0 === s && (s = 10 * $), 0 === c && (c = 10 * W), r > y ? (t = v, n = b * r, e = 0 > d ? f - n : n + f, 0 > e ? (e = 0, i = Math.abs((e - f) / r), t = 0 > p ? h - i : i + h) : e > $ && (e = $, i = Math.abs((e - f) / r), t = 0 > p ? h - i : i + h)) : (e = m, i = g / r, t = 0 > p ? h - i : h + i, 0 > t ? (t = 0, n = Math.abs((t - h) * r), e = 0 > d ? f - n : n + f) : t > W && (t = W, n = Math.abs(t - h) * r, e = 0 > d ? f - n : n + f)), e > f ? (a > e - f ? e = f + a : e - f > s && (e = f + s), t = t > h ? h + (e - f) / r : h - (e - f) / r) : f > e && (a > f - e ? e = f - a : f - e > s && (e = f - s), t = t > h ? h + (f - e) / r : h - (f - e) / r), 0 > e ? (f -= e, e = 0) : e > $ && (f -= e - $, e = $), 0 > t ? (h -= t, t = 0) : t > W && (h -= t - W, t = W), l(o(f, h, e, t))
                    }

                    function s(e) {
                        return e[0] < 0 && (e[0] = 0), e[1] < 0 && (e[1] = 0), e[0] > $ && (e[0] = $), e[1] > W && (e[1] = W), [Math.round(e[0]), Math.round(e[1])]
                    }

                    function o(e, t, n, i) {
                        var r = e,
                            a = n,
                            s = t,
                            o = i;
                        return e > n && (r = n, a = e), t > i && (s = i, o = t), [r, s, a, o]
                    }

                    function u() {
                        var e, t = m - f,
                            n = v - h;
                        return K && Math.abs(t) > K && (m = t > 0 ? f + K : f - K), Q && Math.abs(n) > Q && (v = n > 0 ? h + Q : h - Q), ee / ne && Math.abs(n) < ee / ne && (v = n > 0 ? h + ee / ne : h - ee / ne), Z / te && Math.abs(t) < Z / te && (m = t > 0 ? f + Z / te : f - Z / te), 0 > f && (m -= f, f -= f), 0 > h && (v -= h, h -= h), 0 > m && (f -= m, m -= m), 0 > v && (h -= v, v -= v), m > $ && (e = m - $, f -= e, m -= e), v > W && (e = v - W, h -= e, v -= e), f > $ && (e = f - W, v -= e, h -= e), h > W && (e = h - W, v -= e, h -= e), l(o(f, h, m, v))
                    }

                    function l(e) {
                        return {
                            x: e[0],
                            y: e[1],
                            x2: e[2],
                            y2: e[3],
                            w: e[2] - e[0],
                            h: e[3] - e[1]
                        }
                    }
                    var c, d, f = 0,
                        h = 0,
                        m = 0,
                        v = 0;
                    return {
                        flipCoords: o,
                        setPressed: e,
                        setCurrent: t,
                        getOffset: n,
                        moveOffset: i,
                        getCorner: r,
                        getFixed: a
                    }
                }(),
                fe = function() {
                    function t(e, t) {
                        m.left.css({
                            height: i(t)
                        }), m.right.css({
                            height: i(t)
                        })
                    }

                    function n() {
                        return r(de.getFixed())
                    }

                    function r(e) {
                        m.top.css({
                            left: i(e.x),
                            width: i(e.w),
                            height: i(e.y)
                        }), m.bottom.css({
                            top: i(e.y2),
                            left: i(e.x),
                            width: i(e.w),
                            height: i(W - e.y2)
                        }), m.right.css({
                            left: i(e.x2),
                            width: i($ - e.x2)
                        }), m.left.css({
                            width: i(e.x)
                        })
                    }

                    function a() {
                        return e("<div />").css({
                            position: "absolute",
                            backgroundColor: D.shadeColor || D.bgColor
                        }).appendTo(h)
                    }

                    function s() {
                        f || (f = !0, h.insertBefore(U), n(), he.setBgOpacity(1, 0, 1), Y.hide(), o(D.shadeColor || D.bgColor, 1), he.isAwake() ? l(D.bgOpacity, 1) : l(1, 1))
                    }

                    function o(e, t) {
                        M(d(), e, t)
                    }

                    function u() {
                        f && (h.remove(), Y.show(), f = !1, he.isAwake() ? he.setBgOpacity(D.bgOpacity, 1, 1) : (he.setBgOpacity(1, 1, 1), he.disableHandles()), M(V, 0, 1))
                    }

                    function l(e, t) {
                        f && (D.bgFade && !t ? h.animate({
                            opacity: 1 - e
                        }, {
                            queue: !1,
                            duration: D.fadeTime
                        }) : h.css({
                            opacity: 1 - e
                        }))
                    }

                    function c() {
                        D.shade ? s() : u(), he.isAwake() && l(D.bgOpacity)
                    }

                    function d() {
                        return h.children()
                    }
                    var f = !1,
                        h = e("<div />").css({
                            position: "absolute",
                            zIndex: 240,
                            opacity: 0
                        }),
                        m = {
                            top: a(),
                            left: a().height(W),
                            right: a().height(W),
                            bottom: a()
                        };
                    return {
                        update: n,
                        updateRaw: r,
                        getShades: d,
                        setBgColor: o,
                        enable: s,
                        disable: u,
                        resize: t,
                        refresh: c,
                        opacity: l
                    }
                }(),
                he = function() {
                    function t(t) {
                        var n = e("<div />").css({
                            position: "absolute",
                            opacity: D.borderOpacity
                        }).addClass(r(t));
                        return J.append(n), n
                    }

                    function n(t, n) {
                        var i = e("<div />").mousedown(h(t)).css({
                            cursor: t + "-resize",
                            position: "absolute",
                            zIndex: n
                        }).addClass("ord-" + t);
                        return ce.support && i.bind("touchstart.jcrop", ce.createDragger(t)), X.append(i), i
                    }

                    function a(e) {
                        var t = D.handleSize,
                            i = n(e, E++).css({
                                opacity: D.handleOpacity
                            }).addClass(r("handle"));
                        return t && i.width(t).height(t), i
                    }

                    function s(e) {
                        return n(e, E++).addClass("jcrop-dragbar")
                    }

                    function o(e) {
                        var t;
                        for (t = 0; t < e.length; t++) T[e[t]] = s(e[t])
                    }

                    function u(e) {
                        var n, i;
                        for (i = 0; i < e.length; i++) {
                            switch (e[i]) {
                                case "n":
                                    n = "hline";
                                    break;
                                case "s":
                                    n = "hline bottom";
                                    break;
                                case "e":
                                    n = "vline right";
                                    break;
                                case "w":
                                    n = "vline"
                            }
                            C[e[i]] = t(n)
                        }
                    }

                    function l(e) {
                        var t;
                        for (t = 0; t < e.length; t++) q[e[t]] = a(e[t])
                    }

                    function c(e, t) {
                        D.shade || Y.css({
                            top: i(-t),
                            left: i(-e)
                        }), G.css({
                            top: i(t),
                            left: i(e)
                        })
                    }

                    function d(e, t) {
                        G.width(Math.round(e)).height(Math.round(t))
                    }

                    function f() {
                        var e = de.getFixed();
                        de.setPressed([e.x, e.y]), de.setCurrent([e.x2, e.y2]), m()
                    }

                    function m(e) {
                        return _ ? p(e) : void 0
                    }

                    function p(e) {
                        var t = de.getFixed();
                        d(t.w, t.h), c(t.x, t.y), D.shade && fe.updateRaw(t), _ || b(), e ? D.onSelect.call(pe, v(t)) : D.onChange.call(pe, v(t))
                    }

                    function g(e, t, n) {
                        (_ || t) && (D.bgFade && !n ? U.animate({
                            opacity: e
                        }, {
                            queue: !1,
                            duration: D.fadeTime
                        }) : U.css("opacity", e))
                    }

                    function b() {
                        G.show(), D.shade ? fe.opacity(le) : g(le, !0), _ = !0
                    }

                    function j() {
                        S(), G.hide(), D.shade ? fe.opacity(1) : g(1), _ = !1, D.onRelease.call(pe)
                    }

                    function w() {
                        A && X.show()
                    }

                    function x() {
                        return A = !0, D.allowResize ? (X.show(), !0) : void 0
                    }

                    function S() {
                        A = !1, X.hide()
                    }

                    function k(e) {
                        e ? (re = !0, S()) : (re = !1, x())
                    }

                    function L() {
                        k(!1), f()
                    }
                    var _, E = 370,
                        C = {},
                        q = {},
                        T = {},
                        A = !1;
                    D.dragEdges && e.isArray(D.createDragbars) && o(D.createDragbars), e.isArray(D.createHandles) && l(D.createHandles), D.drawBorders && e.isArray(D.createBorders) && u(D.createBorders), e(document).bind("touchstart.jcrop-ios", function(t) {
                        e(t.currentTarget).hasClass("jcrop-tracker") && t.stopPropagation()
                    });
                    var M = y().mousedown(h("move")).css({
                        cursor: "move",
                        position: "absolute",
                        zIndex: 360
                    });
                    return ce.support && M.bind("touchstart.jcrop", ce.createDragger("move")), J.append(M), S(), {
                        updateVisible: m,
                        update: p,
                        release: j,
                        refresh: f,
                        isAwake: function() {
                            return _
                        },
                        setCursor: function(e) {
                            M.css("cursor", e)
                        },
                        enableHandles: x,
                        enableOnly: function() {
                            A = !0
                        },
                        showHandles: w,
                        disableHandles: S,
                        animMode: k,
                        setBgOpacity: g,
                        done: L
                    }
                }(),
                me = function() {
                    function t(t) {
                        oe.css({
                            zIndex: 450
                        }), t ? e(document).bind("touchmove.jcrop", s).bind("touchend.jcrop", u) : f && e(document).bind("mousemove.jcrop", i).bind("mouseup.jcrop", r)
                    }

                    function n() {
                        oe.css({
                            zIndex: 290
                        }), e(document).unbind(".jcrop")
                    }

                    function i(e) {
                        return c(o(e)), !1
                    }

                    function r(e) {
                        return e.preventDefault(), e.stopPropagation(), ie && (ie = !1, d(o(e)), he.isAwake() && D.onSelect.call(pe, v(de.getFixed())), n(), c = function() {}, d = function() {}), !1
                    }

                    function a(e, n, i) {
                        return ie = !0, c = e, d = n, t(i), !1
                    }

                    function s(e) {
                        return c(o(ce.cfilter(e))), !1
                    }

                    function u(e) {
                        return r(ce.cfilter(e))
                    }

                    function l(e) {
                        oe.css("cursor", e)
                    }
                    var c = function() {},
                        d = function() {},
                        f = D.trackDocument;
                    return f || oe.mousemove(i).mouseup(r).mouseout(r), U.before(oe), {
                        activateHandlers: a,
                        setCursor: l
                    }
                }(),
                ve = function() {
                    function t() {
                        D.keySupport && (a.show(), a.focus())
                    }

                    function n(e) {
                        a.hide()
                    }

                    function i(e, t, n) {
                        D.allowMove && (de.moveOffset([t, n]), he.updateVisible(!0)), e.preventDefault(), e.stopPropagation()
                    }

                    function r(e) {
                        if (e.ctrlKey || e.metaKey) return !0;
                        ae = e.shiftKey ? !0 : !1;
                        var t = ae ? 10 : 1;
                        switch (e.keyCode) {
                            case 37:
                                i(e, -t, 0);
                                break;
                            case 39:
                                i(e, t, 0);
                                break;
                            case 38:
                                i(e, 0, -t);
                                break;
                            case 40:
                                i(e, 0, t);
                                break;
                            case 27:
                                D.allowSelect && he.release();
                                break;
                            case 9:
                                return !0
                        }
                        return !1
                    }
                    var a = e('<input type="radio" />').css({
                            position: "fixed",
                            left: "-120px",
                            width: "12px"
                        }).addClass("jcrop-keymgr"),
                        s = e("<div />").css({
                            position: "absolute",
                            overflow: "hidden"
                        }).append(a);
                    return D.keySupport && (a.keydown(r).blur(n), O || !D.fixedSupport ? (a.css({
                        position: "absolute",
                        left: "-20px"
                    }), s.append(a).insertBefore(U)) : a.insertBefore(U)), {
                        watchKeys: t
                    }
                }();
            ce.support && oe.bind("touchstart.jcrop", ce.newSelection), X.hide(), H(!0);
            var pe = {
                setImage: A,
                animateTo: w,
                setSelect: x,
                setOptions: _,
                tellSelect: k,
                tellScaled: L,
                setClass: j,
                disable: E,
                enable: C,
                cancel: q,
                release: he.release,
                destroy: T,
                focus: ve.watchKeys,
                getBounds: function() {
                    return [$ * te, W * ne]
                },
                getWidgetSize: function() {
                    return [$, W]
                },
                getScaleFactor: function() {
                    return [te, ne]
                },
                getOptions: function() {
                    return D
                },
                ui: {
                    holder: V,
                    selection: G
                }
            };
            return R && V.bind("selectstart", function() {
                return !1
            }), F.data("Jcrop", pe), pe
        }, e.fn.Jcrop = function(t, n) {
            var i;
            return this.each(function() {
                if (e(this).data("Jcrop")) {
                    if ("api" === t) return e(this).data("Jcrop");
                    e(this).data("Jcrop").setOptions(t)
                } else "IMG" == this.tagName ? e.Jcrop.Loader(this, function() {
                    e(this).css({
                        display: "block",
                        visibility: "hidden"
                    }), i = e.Jcrop(this, t), e.isFunction(n) && n.call(i)
                }) : (e(this).css({
                    display: "block",
                    visibility: "hidden"
                }), i = e.Jcrop(this, t), e.isFunction(n) && n.call(i))
            }), this
        }, e.Jcrop.Loader = function(t, n, i) {
            function r() {
                s.complete ? (a.unbind(".jcloader"), e.isFunction(n) && n.call(s)) : window.setTimeout(r, 50)
            }
            var a = e(t),
                s = a[0];
            a.bind("load.jcloader", r).bind("error.jcloader", function(t) {
                a.unbind(".jcloader"), e.isFunction(i) && i.call(s)
            }), s.complete && e.isFunction(n) && (a.unbind(".jcloader"), n.call(s))
        }, e.Jcrop.defaults = {
            allowSelect: !0,
            allowMove: !0,
            allowResize: !0,
            trackDocument: !0,
            baseClass: "jcrop",
            addClass: null,
            bgColor: "black",
            bgOpacity: .6,
            bgFade: !1,
            borderOpacity: .4,
            handleOpacity: .5,
            handleSize: null,
            aspectRatio: 0,
            keySupport: !0,
            createHandles: ["n", "s", "e", "w", "nw", "ne", "se", "sw"],
            createDragbars: ["n", "s", "e", "w"],
            createBorders: ["n", "s", "e", "w"],
            drawBorders: !0,
            dragEdges: !0,
            fixedSupport: !0,
            touchSupport: null,
            shade: null,
            boxWidth: 0,
            boxHeight: 0,
            boundary: 2,
            fadeTime: 400,
            animationDelay: 20,
            swingSpeed: 3,
            minSelect: [0, 0],
            maxSize: [0, 0],
            minSize: [0, 0],
            onChange: function() {},
            onSelect: function() {},
            onDblClick: function() {},
            onRelease: function() {}
        }
    }), define.registerEnd(), define("github/legacy/behaviors/crop_avatar", ["../../observe", "../../jquery", "jcrop"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var r = n(t),
            a = function() {
                function e(e) {
                    this.clearCropFormValues = i(this.clearCropFormValues, this), this.setCropFormValues = i(this.setCropFormValues, this), this.setCurrentSelection = i(this.setCurrentSelection, this), this.setTrueSize = i(this.setTrueSize, this), this.$container = r["default"](e), this.spinner = this.$container.find(".profile-picture-spinner"), this.img = this.$container.find(".js-croppable-avatar"), this.croppedX = this.$container.find(".js-crop-cropped-x"), this.croppedY = this.$container.find(".js-crop-cropped-y"), this.croppedW = this.$container.find(".js-crop-cropped-width"), this.croppedH = this.$container.find(".js-crop-cropped-height");
                    var t = this.img.parent("div").width(),
                        n = {
                            aspectRatio: 1,
                            onSelect: this.setCropFormValues,
                            onRelease: this.clearCropFormValues,
                            bgColor: "",
                            maxSize: [3e3, 3e3],
                            boxWidth: t,
                            boxHeight: t
                        };
                    this.setTrueSize(n), this.setCurrentSelection(n);
                    var a = this;
                    this.img.Jcrop(n, function() {
                        return a.spinner.addClass("d-none"), a.jcrop = this
                    })
                }
                return e.prototype.setTrueSize = function(e) {
                    var t = parseInt(this.img.attr("data-true-width")),
                        n = parseInt(this.img.attr("data-true-height"));
                    return 0 !== t && 0 !== n ? e.trueSize = [t, n] : void 0
                }, e.prototype.setCurrentSelection = function(e) {
                    var t = parseInt(this.croppedW.val()),
                        n = parseInt(this.croppedH.val());
                    if (0 !== t && 0 !== n) {
                        var i = parseInt(this.croppedX.val()),
                            r = parseInt(this.croppedY.val());
                        return e.setSelect = [i, r, i + t, r + n]
                    }
                }, e.prototype.setCropFormValues = function(e) {
                    return this.croppedX.val(e.x), this.croppedY.val(e.y), this.croppedW.val(e.w), this.croppedH.val(e.h)
                }, e.prototype.clearCropFormValues = function() {
                    return this.croppedX.val("0"), this.croppedY.val("0"), this.croppedW.val("0"), this.croppedH.val("0")
                }, e
            }();
        e.observe(".js-croppable-container", {
            add: function(e) {
                return new a(e)
            }
        }), document.addEventListener("facebox:afterClose", function() {
            r["default"](".js-avatar-field").val("")
        })
    }), define("github/legacy/behaviors/dirty_menus", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("menu:activate", ".js-select-menu", function() {
            n["default"](this).addClass("is-dirty")
        }), n["default"](document).on("menu:deactivate", ".js-select-menu", function() {
            n["default"](this).removeClass("is-dirty")
        })
    }), define("github/legacy/behaviors/disable", ["../../jquery", "delegated-events"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            return "INPUT" === e.nodeName ? e.value || "Submit" : e.innerHTML || ""
        }

        function r(e, t) {
            "INPUT" === e.nodeName ? e.value = t : e.innerHTML = t
        }
        var a = n(e),
            s = new WeakMap,
            o = ["input[type=submit][data-disable-with]", "button[data-disable-with]"].join(", ");
        t.on("submit", "form", function() {
            for (var e = this.querySelectorAll(o), t = 0; t < e.length; t++) {
                var n = e[t];
                s.set(n, i(n));
                var a = n.getAttribute("data-disable-with");
                a && r(n, a), n.disabled = !0
            }
        }, {
            capture: !0
        }), a["default"](document).on("ajaxComplete", "form", function(e) {
            if (this === e.target)
                for (var t = this.querySelectorAll(o), n = 0; n < t.length; n++) {
                    var i = t[n],
                        a = s.get(i);
                    null != a && (r(i, a), i.disabled = !1, s["delete"](i))
                }
        })
    }), define("github/legacy/behaviors/facebox", ["../../history", "../../observe", "../../facebox", "../../jquery", "../../hash-change", "../../visible"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o(e) {
            var t = e.querySelectorAll("input[autofocus], textarea[autofocus]"),
                n = t[t.length - 1];
            n && document.activeElement !== n && n.focus()
        }

        function u() {
            var e = window.location.hash.slice(1);
            if (e)
                for (var t = document.querySelectorAll("[data-hashchange-activated]"), n = 0; n < t.length; n++) {
                    var i = t[n];
                    if (i.getAttribute("data-hashchange-activated") === e) return i
                }
        }

        function l(e) {
            var t = void 0;
            if ("tab" === (t = e.hotkey) || "shift+tab" === t) {
                e.preventDefault();
                var n = c["default"]("#facebox"),
                    i = c["default"](Array.from(n.find("input, button, .btn, textarea")).filter(f["default"])).filter(function() {
                        return !this.disabled
                    }),
                    r = "shift+tab" === e.hotkey ? -1 : 1,
                    a = i.index(i.filter(":focus")),
                    s = a + r;
                s === i.length || -1 === a && "tab" === e.hotkey ? i.first().focus() : -1 === a ? i.last().focus() : i.get(s).focus()
            }
        }
        var c = s(i),
            d = s(r),
            f = s(a);
        d["default"](function() {
            var e = u();
            e && setTimeout(function() {
                e.click()
            }, 0)
        }), document.addEventListener("facebox:close", function() {
            var t = u();
            t && /facebox/.test(t.rel) && e.replaceState(e.getState(), "", window.location.href.split("#")[0])
        }), document.addEventListener("facebox:reveal", function() {
            var e = document.getElementById("facebox");
            setTimeout(function() {
                o(e)
            }, 0), c["default"](document).on("keydown", l)
        }), document.addEventListener("facebox:afterClose", function() {
            c["default"](document).off("keydown", l), c["default"]("#facebox :focus").blur()
        }), t.observe("a[rel*=facebox]", function() {
            n.addFaceboxEventListener(this)
        }), document.addEventListener("facebox:close", n.teardownOnClose), c["default"](document).on("click", ".js-facebox-close", n.close)
    }), define("github/legacy/behaviors/facebox-button", ["../../jquery", "../../facebox"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e),
            r = n(t);
        i["default"](document).on("click", "[data-facebox]", function() {
            r["default"]({
                div: this.getAttribute("data-facebox")
            }, this.getAttribute("data-facebox-class"))
        })
    }), define("github/fuzzy-filter", ["exports"], function(e) {
        function t(e, t) {
            var n = s(e, t);
            if (n && -1 === t.indexOf("/")) {
                var i = e.substring(e.lastIndexOf("/") + 1);
                n += s(i, t)
            }
            return n
        }

        function n(e, n) {
            var r = function() {
                for (var i = [], r = 0, a = e.length; a > r; r++) {
                    var s = e[r],
                        o = t(s, n);
                    o && i.push([s, o])
                }
                return i
            }();
            r.sort(i);
            for (var a = [], s = 0, o = r.length; o > s; s++) {
                var u = r[s];
                a.push(u[0])
            }
            return a
        }

        function i(e, t) {
            var n = e[0],
                i = t[0],
                r = e[1],
                a = t[1];
            return r > a ? -1 : a > r ? 1 : i > n ? -1 : n > i ? 1 : 0
        }

        function r(e) {
            var t = e.toLowerCase(),
                n = "+.*?[]{}()^$|\\".replace(/(.)/g, "\\$1"),
                i = new RegExp("\\(([" + n + "])\\)", "g");
            return e = t.replace(/(.)/g, "($1)(.*?)").replace(i, "(\\$1)"), new RegExp("(.*)" + e + "$", "i")
        }

        function a(e, t, n) {
            var i = e.innerHTML.trim();
            if (t) {
                null == n && (n = r(t));
                var a = i.match(n);
                if (!a) return;
                var s = !1;
                i = [];
                var o = void 0,
                    u = void 0,
                    l = void 0;
                for (o = u = 1, l = a.length; l >= 1 ? l > u : u > l; o = l >= 1 ? ++u : --u) {
                    var c = a[o];
                    c && (o % 2 === 0 ? s || (i.push("<mark>"), s = !0) : s && (i.push("</mark>"), s = !1), i.push(c))
                }
                e.innerHTML = i.join("")
            } else {
                var d = i.replace(/<\/?mark>/g, "");
                i !== d && (e.innerHTML = d)
            }
        }

        function s(e, t) {
            if (e === t) return 1;
            var n = e.length,
                i = 0,
                r = 0,
                a = void 0,
                s = void 0,
                o = void 0;
            for (a = s = 0, o = t.length; o > s; a = ++s) {
                var u = t[a],
                    l = e.indexOf(u.toLowerCase()),
                    c = e.indexOf(u.toUpperCase()),
                    d = Math.min(l, c),
                    f = d > -1 ? d : Math.max(l, c);
                if (-1 === f) return 0;
                i += .1, e[f] === u && (i += .1), 0 === f && (i += .8, 0 === a && (r = 1)), " " === e.charAt(f - 1) && (i += .8), e = e.substring(f + 1, n)
            }
            var h = t.length,
                m = i / h,
                v = (m * (h / n) + m) / 2;
            return r && 1 > v + .1 && (v += .1), v
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.fuzzyScore = t, e.fuzzySort = n, e.fuzzyRegexp = r, e.fuzzyHighlightElement = a
    }), define("github/fuzzy-filter-sort-list", ["exports", "./fuzzy-filter", "./jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, n, i) {
            var r = void 0,
                d = void 0,
                f = void 0,
                h = void 0,
                m = void 0,
                v = void 0,
                p = void 0,
                g = void 0,
                b = void 0,
                y = void 0,
                j = void 0;
            if (null == i && (i = {}), e) {
                n = n.toLowerCase();
                var w = null != i.content ? i.content : s,
                    x = null != i.text ? i.text : o,
                    S = null != i.score ? i.score : t.fuzzyScore,
                    k = i.limit;
                i.mark === !0 ? j = c : null != i.mark && null != i.mark.call && (j = i.mark);
                var L = l.get(e);
                for (L ? r = u["default"](e).children() : (r = L = u["default"](e).children(), l.set(e, L.slice(0))), d = 0, p = r.length; p > d; d++) f = r[d], e.removeChild(f), f.style.display = "";
                var _ = document.createDocumentFragment(),
                    E = 0,
                    C = 0;
                if (n) {
                    var q = L.slice(0);
                    for (m = 0, b = q.length; b > m; m++) f = q[m], null == f.fuzzyFilterTextCache && (f.fuzzyFilterTextCache = x(w(f))), f.fuzzyFilterScoreCache = S(f.fuzzyFilterTextCache, n, f);
                    q.sort(a);
                    var T = t.fuzzyRegexp(n);
                    for (v = 0, y = q.length; y > v; v++) {
                        if (f = q[v], (!k || k > E) && f.fuzzyFilterScoreCache > 0) {
                            if (C++, j) {
                                var A = w(f);
                                j(A), j(A, n, T)
                            }
                            _.appendChild(f)
                        }
                        E++
                    }
                } else
                    for (h = 0, g = L.length; g > h; h++) f = L[h], (!k || k > E) && (C++, j && j(w(f)), _.appendChild(f)), E++;
                return e.appendChild(_), C
            }
        }

        function a(e, t) {
            var n = e.fuzzyFilterScoreCache,
                i = t.fuzzyFilterScoreCache,
                r = e.fuzzyFilterTextCache,
                a = t.fuzzyFilterTextCache;
            return n > i ? -1 : i > n ? 1 : a > r ? -1 : r > a ? 1 : 0
        }

        function s(e) {
            return e
        }

        function o(e) {
            var t = e.hasAttribute("data-filter-value");
            if (t) {
                var n = e.getAttribute("data-filter-value");
                return n.toLowerCase().trim()
            }
            return e.textContent.toLowerCase().trim()
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = r;
        var u = i(n),
            l = new WeakMap,
            c = t.fuzzyHighlightElement
    }), define("github/prefix-filter-list", ["exports", "./jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e, t, n) {
            var i = void 0,
                o = void 0,
                u = void 0;
            if (null == n && (n = {}), e) {
                t = t.toLowerCase();
                var l = null != n.text ? n.text : r,
                    c = s["default"](e).children(),
                    d = n.limit;
                n.mark === !0 ? u = a : null != n.mark && null != n.mark.call && (u = n.mark);
                var f = 0;
                for (i = 0, o = c.length; o > i; i++) {
                    var h = c[i];
                    0 === l(h).indexOf(t) ? d && f >= d ? h.style.display = "none" : (f++, h.style.display = "", u && (u(h), u(h, t))) : h.style.display = "none"
                }
                return f
            }
        }

        function r(e) {
            return e.textContent.toLowerCase().trim()
        }

        function a(e, t) {
            var n = e.innerHTML;
            if (t) {
                var i = new RegExp(t, "i");
                e.innerHTML = n.replace(i, "<mark>$&</mark>")
            } else {
                var r = n.replace(/<\/?mark>/g, "");
                n !== r && (e.innerHTML = r)
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = i;
        var s = n(t)
    }), define("github/substring-filter-list", ["exports", "./jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e, t, n) {
            var i = void 0,
                o = void 0,
                u = void 0;
            if (null == n && (n = {}), e) {
                t = t.toLowerCase();
                var l = null != n.text ? n.text : r,
                    c = n.limit,
                    d = s["default"](e).children();
                n.mark === !0 ? u = a : null != n.mark && null != n.mark.call && (u = n.mark);
                var f = 0;
                for (i = 0, o = d.length; o > i; i++) {
                    var h = d[i]; - 1 !== l(h).indexOf(t) ? c && f >= c ? h.style.display = "none" : (f++, h.style.display = "", u && (u(h), u(h, t))) : h.style.display = "none"
                }
                return f
            }
        }

        function r(e) {
            return e.textContent.toLowerCase().trim()
        }

        function a(e, t) {
            var n = e.innerHTML;
            if (t) {
                var i = new RegExp(t, "i");
                e.innerHTML = n.replace(i, "<mark>$&</mark>")
            } else {
                var r = n.replace(/<\/?mark>/g, "");
                n !== r && (e.innerHTML = r)
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = i;
        var s = n(t)
    }), define("github/legacy/behaviors/filterable", ["../../observe", "delegated-events", "../../throttled-input", "../../jquery", "../../fuzzy-filter-sort-list", "../../prefix-filter-list", "../../substring-filter-list", "../../setimmediate"], function(e, t, n, i, r, a, s, o) {
        function u(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function l(e, t) {
            var n = e.hasAttribute("data-filterable-highlight"),
                i = e.getAttribute("data-filterable-limit"),
                r = 0;
            switch (e.getAttribute("data-filterable-type")) {
                case "fuzzy":
                    r = d["default"](e, t, {
                        mark: n,
                        limit: i
                    });
                    break;
                case "substring":
                    r = h["default"](e, t, {
                        mark: n,
                        limit: i
                    });
                    break;
                default:
                    r = f["default"](e, t, {
                        mark: n,
                        limit: i
                    })
            }
            e.classList.toggle("filterable-active", t.length > 0), e.classList.toggle("filterable-empty", 0 === r)
        }
        var c = u(i),
            d = u(r),
            f = u(a),
            h = u(s),
            m = u(o);
        e.observe(".js-filterable-field", function() {
            function e() {
                var e = this;
                r !== this.value && (r = this.value, m["default"](function() {
                    t.fire(e, "filterable:change")
                }))
            }

            function i() {
                var e = this;
                m["default"](function() {
                    t.fire(e, "filterable:change")
                })
            }
            var r = this.value;
            return {
                add: function() {
                    this.addEventListener("focus", i), n.addThrottledInputEventListener(this, e), document.activeElement === this && i.call(this)
                },
                remove: function() {
                    this.removeEventListener("focus", i), n.removeThrottledInputEventListener(this, e)
                }
            }
        }), c["default"](document).on("filterable:change", ".js-filterable-field", function() {
            for (var e = this.value.trim().toLowerCase(), t = document.querySelectorAll("[data-filterable-for=" + this.id + "]"), n = 0; n < t.length; n++) {
                var i = t[n];
                l(i, e);
                var r = new CustomEvent("filterable:change", {
                    bubbles: !0,
                    cancelable: !1
                });
                r.relatedTarget = this, i.dispatchEvent(r)
            }
        })
    }), define("github/legacy/behaviors/flash", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("click", ".js-flash-close", function() {
            var e = this.closest(".flash-messages");
            n["default"](this.closest(".flash")).fadeOut(300, function() {
                n["default"](this).remove(), e && !e.querySelector(".flash") && e.remove()
            })
        })
    }), define("github/legacy/behaviors/focus_delay", ["../../jquery", "../../fire"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e),
            r = n(t),
            a = new WeakMap;
        i["default"](document).on("focusin.delay", function(e) {
            var t = e.target;
            a.get(t) || r["default"](t, "focusin:delay", function() {
                a.set(t, !0), i["default"](t).trigger("focusin:delayed")
            })
        }), i["default"](document).on("focusout.delay", function(e) {
            return setTimeout(function() {
                var t = e.target;
                t !== document.activeElement && r["default"](t, "focusout:delay", function() {
                    a["delete"](e.target), i["default"](t).trigger("focusout:delayed")
                })
            }, 200)
        })
    }), define("github/local-storage", ["exports"], function(e) {
        function t(e) {
            try {
                return localStorage.getItem(e)
            } catch (t) {
                return null
            }
        }

        function n(e, t) {
            try {
                localStorage.setItem(e, t)
            } catch (n) {}
        }

        function i(e) {
            try {
                localStorage.removeItem(e)
            } catch (t) {}
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.getItem = t, e.setItem = n, e.removeItem = i
    }), define("github/legacy/behaviors/force-push-default-branch", ["../../local-storage", "../../observe"], function(e, t) {
        t.observe(".js-force-push-default-branch-notice", function() {
            var t = "true" === e.getItem("hide-force-push-default-branch-notice");
            this.classList.toggle("d-none", t), t && (this.submit(), e.removeItem("hide-force-push-default-branch-notice"))
        })
    }), define("github/legacy/behaviors/g-emoji-element", ["../../emoji-detection"], function(e) {
        function t(e) {
            var t = document.createElement("img");
            return t.className = "emoji", t.alt = ":" + e.getAttribute("alias") + ":", t.height = 20, t.width = 20, t
        }
        var n = Object.create(HTMLElement.prototype);
        n.createdCallback = function() {
            e.isEmojiSupported(this.textContent, this.getAttribute("ios-version")) || (this.textContent = "", this.image = t(this), this.appendChild(this.image))
        }, n.attachedCallback = function() {
            this.image && (this.image.src = this.getAttribute("fallback-src"))
        }, window.GEmojiElement = document.registerElement("g-emoji", {
            prototype: n
        })
    }), define("github/legacy/behaviors/issue-references", ["../../fetch", "../../observe"], function(e, t) {
        function n() {
            function t(e) {
                return i(u, e.title)
            }
            var n = void 0,
                r = void 0,
                a = void 0;
            if (a = this.getAttribute("data-url")) {
                var s = e.fetchJSON(a),
                    o = this.getAttribute("data-id"),
                    u = document.querySelectorAll(".js-issue-link[data-id='" + o + "']");
                for (n = 0, r = u.length; r > n; n++) {
                    var l = u[n];
                    l.removeAttribute("data-url")
                }
                var c = function(e) {
                    return function(t) {
                        var n = (null != t.response ? t.response.status : void 0) || 500,
                            r = function() {
                                switch (n) {
                                    case 404:
                                        return this.getAttribute("data-permission-text");
                                    default:
                                        return this.getAttribute("data-error-text")
                                }
                            }.call(e);
                        return i(u, r)
                    }
                }(this);
                return s.then(t, c)
            }
        }

        function i(e, t) {
            var n = void 0,
                i = void 0,
                r = [];
            for (n = 0, i = e.length; i > n; n++) {
                var a = e[n];
                r.push(a.setAttribute("title", t))
            }
            return r
        }
        t.observe(".js-issue-link", function() {
            this.addEventListener("mouseenter", n)
        })
    }), define("github/legacy/behaviors/js-immediate-updates", ["../../updatable-content", "../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("ajaxSuccess", ".js-immediate-updates", function(t, n, i, r) {
            var a = void 0;
            if (this === t.target) {
                var s = r.updateContent;
                for (a in s) {
                    var o = s[a],
                        u = document.querySelector(a);
                    u && e.replaceContent(u, o)
                }
            }
        })
    }), define("github/legacy/behaviors/labeled_button", ["../../observe"], function(e) {
        function t(e, t) {
            e.closest("label").classList.toggle("selected", t)
        }
        e.observe(".labeled-button:checked", {
            add: function() {
                t(this, !0)
            },
            remove: function() {
                t(this, !1)
            }
        })
    }), define("github/legacy/behaviors/minibutton_accessibility", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function n(e) {
            "enter" === e.hotkey && (i["default"](this).click(), e.preventDefault())
        }
        var i = t(e);
        i["default"](document).on("focus", "div.btn-sm, span.btn-sm", function() {
            i["default"](this).on("keydown", n)
        }), i["default"](document).on("blur", "div.btn-sm, span.btn-sm", function() {
            i["default"](this).off("keydown", n)
        })
    }), define("github/legacy/behaviors/notice", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSuccess", ".js-notice-dismiss", function() {
            n["default"](this.closest(".js-notice")).fadeOut()
        })
    }), define("github/legacy/behaviors/permalink", ["delegated-events"], function(e) {
        e.on("click", ".js-permalink-shortcut", function(e) {
            window.location = this.href + window.location.hash, e.preventDefault()
        })
    }), define("github/legacy/behaviors/pjax", ["../../jquery", "../../pjax"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            return null != e.getAttribute("data-pjax-preserve-scroll") ? !1 : 0
        }

        function r(e) {
            var t = a["default"](e),
                n = t.add(t.parents("[data-pjax]")).map(function() {
                    var e = this.getAttribute("data-pjax");
                    return null != e && "true" !== e ? e : void 0
                }),
                i = n[0];
            return i ? document.querySelector(i) : a["default"](e).closest("[data-pjax-container]")[0]
        }
        var a = n(e);
        a["default"](document).on("click", "[data-pjax] a, a[data-pjax]", function(e) {
            var n = this;
            if (null == n.getAttribute("data-skip-pjax") && null == n.getAttribute("data-remote")) {
                var a = r(n);
                return a ? t.click(e, {
                    container: a,
                    scrollTo: i(n)
                }) : void 0
            }
        }), a["default"](document).on("submit", "form[data-pjax]", function(e) {
            var n = this,
                a = r(n);
            return a ? t.submit(e, {
                container: a,
                scrollTo: i(n)
            }) : void 0
        })
    }), define("github/legacy/behaviors/pjax-loader", ["../../invariant"], function(e) {
        ! function() {
            function t() {
                n(0), a.classList.add("is-loading"), u = setTimeout(i, 0)
            }

            function n(e) {
                0 === e && (null == l && (l = getComputedStyle(s).transition), s.style.transition = "none"), o = e, s.style.width = o + "%", 0 === e && (s.clientWidth, s.style.transition = l)
            }

            function i() {
                0 === o && (o = 12), n(Math.min(o + 3, 95)), u = setTimeout(i, 500)
            }

            function r() {
                clearTimeout(u), n(100), a.classList.remove("is-loading")
            }
            var a = document.getElementById("js-pjax-loader-bar");
            if (a) {
                var s = a.firstElementChild;
                e.invariant(s instanceof HTMLElement, "Progress Bar must be an HTMLElement");
                var o = 0,
                    u = null,
                    l = null;
                document.addEventListener("pjax:start", t), document.addEventListener("pjax:end", r), document.addEventListener("pjax:timeout", function(e) {
                    e.preventDefault()
                })
            }
        }()
    }), define("github/legacy/behaviors/pjax/beforeunload", [], function() {
        document.addEventListener("pjax:click", function(e) {
            return window.onbeforeunload ? e.preventDefault() : void 0
        })
    }), define("github/legacy/behaviors/pjax/exceptions", ["delegated-events"], function(e) {
        function t() {
            var e = void 0,
                t = function() {
                    var t = void 0,
                        n = void 0,
                        i = [];
                    for (t = 0, n = arguments.length; n > t; t++) e = arguments[t], i.push(e.split("/", 3).join("/"));
                    return i
                }.apply(this, arguments);
            return t[0] === t[1]
        }
        e.on("pjax:click", "#js-repo-pjax-container a[href]", function(e) {
            return t(this.pathname, location.pathname) ? void 0 : e.preventDefault()
        }), e.on("pjax:click", ".js-comment-body", function(e) {
            return "files" === e.target.pathname.split("/")[3] ? e.preventDefault() : void 0
        })
    }), define("github/legacy/behaviors/pjax/head", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e),
            i = {};
        n["default"](function() {
            return i[document.location.pathname] = n["default"]("head [data-pjax-transient]")
        }), document.addEventListener("pjax:beforeReplace", function(e) {
            var t = void 0,
                r = void 0,
                a = void 0,
                s = e.detail.contents;
            for (t = r = 0, a = s.length; a > r; t = ++r) {
                var o = s[t];
                o && ("pjax-head" === o.id ? (i[document.location.pathname] = n["default"](o).children(), s[t] = null) : "js-flash-container" === o.id && (n["default"]("#js-flash-container").replaceWith(o), s[t] = null))
            }
        }), document.addEventListener("pjax:end", function() {
            var e = i[document.location.pathname];
            if (e) {
                n["default"]("head [data-pjax-transient]").remove();
                var t = n["default"](e).not("title, script, link[rel='stylesheet']"),
                    r = n["default"](e).filter("link[rel='stylesheet']");
                return n["default"](document.head).append(t.attr("data-pjax-transient", !0)), n["default"](document.head).append(r)
            }
        })
    }), define("github/legacy/behaviors/pjax_timing", ["../../stats", "../../setimmediate"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            e.detail && e.detail.url && (window.performance.mark(c), u = e.detail.url)
        }

        function r() {
            o["default"](function() {
                if (window.performance.getEntriesByName(c).length) {
                    window.performance.mark(d), window.performance.measure(l, c, d);
                    var e = window.performance.getEntriesByName(l),
                        t = e.pop(),
                        n = t ? t.duration : null;
                    n && (s["default"]({
                        pjax: {
                            url: u,
                            ms: Math.round(n)
                        }
                    }), a())
                }
            })
        }

        function a() {
            window.performance.clearMarks(c), window.performance.clearMarks(d), window.performance.clearMeasures(l)
        }
        var s = n(e),
            o = n(t),
            u = null,
            l = "last_pjax_request",
            c = "pjax_start",
            d = "pjax_end";
        document.addEventListener("pjax:start", i), document.addEventListener("pjax:end", r)
    }), define("github/legacy/behaviors/print_popup", ["../../document-ready"], function(e) {
        e.ready.then(function() {
            document.body.classList.contains("js-print-popup") && (window.print(),
                setTimeout(window.close, 1e3))
        })
    }), define("github/legacy/behaviors/quick_issue", ["../../focused", "../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            return "qi:" + document.location.toString()
        }
        var r = n(t);
        r["default"](function() {
            return document.documentElement.classList.contains("is-employee") ? (r["default"](document).on("submit", ".js-quick-issue-form", function() {
                r["default"](".facebox-content > *").hide(), r["default"](".facebox-content .js-quick-issue-thanks").show();
                var e = i();
                try {
                    localStorage.removeItem(e)
                } catch (t) {}
                return !0
            }), e.onFocusedInput(document, ".js-quick-issue-body", function() {
                return function() {
                    var e = i(),
                        t = this.value;
                    try {
                        return localStorage.setItem(e, t)
                    } catch (n) {}
                }
            }), document.addEventListener("facebox:reveal", function() {
                r["default"](".facebox-content .quick-issue-link").remove();
                var e = r["default"](".facebox-content .js-quick-issue-body");
                if (e.length) {
                    var t = function() {
                        var t = i(),
                            n = function() {
                                try {
                                    return localStorage.getItem(t)
                                } catch (e) {}
                            }();
                        return n && e[0].value, {
                            v: e.focus()
                        }
                    }();
                    if ("object" == typeof t) return t.v
                }
            }), r["default"](document).on("ajaxSuccess", ".js-quick-issue-form", function(e, t) {
                return r["default"](".js-quick-issue-thanks").append(t.responseText)
            })) : void 0
        })
    }), define("github/legacy/behaviors/quick_submit", ["../../focused", "../../form"], function(e, t) {
        e.onFocusedKeydown(document, ".js-quick-submit", function() {
            return function(e) {
                if ("ctrl+enter" === e.hotkey || "meta+enter" === e.hotkey) {
                    var n = this.form,
                        i = n.querySelector("input[type=submit], button[type=submit]");
                    return i && i.disabled || t.submit(n), !1
                }
            }
        })
    }), define("github/legacy/behaviors/quicksearch", ["../../form", "../../jquery", "../../navigation", "../../sliding-promise-queue", "../../fetch"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function s(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var o = a(t),
            u = a(i),
            l = function() {
                function t(e) {
                    this.resultsChanged = s(this.resultsChanged, this), this.fetchResults = s(this.fetchResults, this), this.onFieldInput = s(this.onFieldInput, this), this.onNavigationKeyDown = s(this.onNavigationKeyDown, this), this.teardown = s(this.teardown, this), this.$field = o["default"](e), this.$form = o["default"](e.form), this.fetchQueue = new u["default"], this.$field.on("input.results", this.onFieldInput), this.$field.on("focusout:delayed.results", this.teardown), this.$form.on("submit.results", this.teardown), this.$results = o["default"](".js-quicksearch-results"), n.push(this.$results[0]), this.$results.on("navigation:keydown.results", this.onNavigationKeyDown)
                }
                return t.prototype.teardown = function() {
                    this.$field.off(".results"), this.$form.off(".results"), this.$results.off(".results"), this.$results.removeClass("active"), n.pop(this.$results[0])
                }, t.prototype.onNavigationKeyDown = function(t) {
                    if ("esc" === t.originalEvent.detail.hotkey) this.$results.removeClass("active"), n.clear(this.$results[0]);
                    else if ("enter" === t.originalEvent.detail.hotkey && !t.target.classList.contains("js-navigation-item")) return e.submit(this.$form[0]), !1
                }, t.prototype.onFieldInput = function() {
                    return this.fetchResults(this.$field.val())
                }, t.prototype.fetchResults = function(e) {
                    var t = this.$results.attr("data-quicksearch-url");
                    if (t) {
                        var n = e.trim() ? (t += ~t.indexOf("?") ? "&" : "?", t += this.$form.serialize(), this.$form.addClass("is-sending"), r.fetchText(t)) : Promise.resolve(""),
                            i = function(e) {
                                return function() {
                                    return e.$form.removeClass("is-sending")
                                }
                            }(this);
                        return this.fetchQueue.push(n).then(function(e) {
                            return function(t) {
                                return e.$results.html(t), e.resultsChanged()
                            }
                        }(this)).then(i, i)
                    }
                }, t.prototype.resultsChanged = function() {
                    var e = "" !== this.$field.val();
                    return this.$results.toggleClass("active", e)
                }, t
            }();
        o["default"](document).on("focusin:delayed", ".js-quicksearch-field", function() {
            new l(this)
        })
    }), define("github/markdown-parsing", ["exports"], function(e) {
        function t() {
            var e = arguments[0],
                t = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
            return t.some(function(t) {
                return e.classList.contains(t)
            })
        }

        function n(e) {
            for (var t = e.parentNode.children, n = 0; n < t.length; ++n)
                if (t[n] === e) return n
        }

        function i(e) {
            return "IMG" === e.nodeName || null != e.firstChild
        }

        function r(e) {
            return "INPUT" === e.nodeName && "checkbox" === e.type
        }

        function a(e) {
            var t = e.childNodes[0],
                n = e.childNodes[1];
            return t && e.childNodes.length < 3 ? !("OL" !== t.nodeName && "UL" !== t.nodeName || n && (n.nodeType !== Node.TEXT_NODE || n.textContent.trim())) : void 0
        }

        function s(e, t) {
            var n = void 0,
                a = document.createNodeIterator(e, NodeFilter.SHOW_ELEMENT, function(e) {
                    return e.nodeName in l && (i(e) || r(e)) ? NodeFilter.FILTER_ACCEPT : void 0
                }),
                s = [];
            for (n = a.nextNode(); n;) s.push(n), n = a.nextNode();
            s.reverse().forEach(function(e) {
                return t(e, l[e.nodeName](e))
            })
        }

        function o(e) {
            var t = e.getRangeAt(0).cloneContents();
            u = 0;
            var i = e.anchorNode.parentNode.closest("li");
            if (i && ("OL" === i.parentNode.nodeName && (u = n(i)), !t.querySelector("li"))) {
                var r = document.createElement("li"),
                    a = document.createElement(i.parentNode.nodeName);
                r.appendChild(t), a.appendChild(r), t = document.createDocumentFragment(), t.appendChild(a)
            }
            return s(t, function(e, t) {
                return e.replaceWith(t)
            }), t
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.selectionToMarkdown = o;
        var u = 0,
            l = {
                INPUT: function(e) {
                    return e.checked ? "[x] " : "[ ] "
                },
                CODE: function(e) {
                    var t = e.textContent;
                    return "PRE" === e.parentNode.nodeName ? e.textContent = t.replace(/^/gm, "    ") : t.indexOf("`") >= 0 ? "`` " + t + " ``" : "`" + t + "`"
                },
                PRE: function(e) {
                    var t = e.parentNode;
                    return "DIV" === t.nodeName && t.classList.contains("highlight") && (e.textContent = e.textContent.replace(/^/gm, "    "), e.append("\n\n")), e
                },
                STRONG: function(e) {
                    return "**" + e.textContent + "**"
                },
                EM: function(e) {
                    return "_" + e.textContent + "_"
                },
                BLOCKQUOTE: function(e) {
                    var t = e.textContent.trim().replace(/^/gm, "> "),
                        n = document.createElement("pre");
                    return n.textContent = t + "\n\n", n
                },
                A: function(e) {
                    var n = e.textContent;
                    return t(e, "issue-link", "user-mention", "team-mention") ? n : /^https?:/.test(n) && n === e.getAttribute("href") ? n : "[" + n + "](" + e.getAttribute("href") + ")"
                },
                IMG: function(e) {
                    var n = e.getAttribute("alt");
                    return t(e, "emoji") ? n : "![" + n + "](" + e.getAttribute("src") + ")"
                },
                LI: function(e) {
                    var t = e.parentNode;
                    if (!a(e)) switch (t.nodeName) {
                        case "UL":
                            e.prepend("* ");
                            break;
                        case "OL":
                            if (u > 0 && !t.previousSibling) {
                                var i = n(e) + u + 1;
                                e.prepend(i + "\\. ")
                            } else e.prepend(n(e) + 1 + ". ")
                    }
                    return e
                },
                OL: function(e) {
                    var t = document.createElement("li");
                    return t.appendChild(document.createElement("br")), e.append(t), e
                },
                H1: function(e) {
                    var t = parseInt(e.nodeName.slice(1));
                    return e.prepend(Array(t + 1).join("#") + " "), e
                },
                UL: function(e) {
                    return e
                }
            };
        l.UL = l.OL;
        for (var c = 2; 6 >= c; ++c) l["H" + c] = l.H1
    }), define("github/legacy/behaviors/quote-markdown-selection", ["delegated-events", "../../markdown-parsing", "../../setimmediate"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            var n = document.createElement("div");
            n.appendChild(t), n.style.cssText = "position:absolute;left:-9999px;", document.body.appendChild(n);
            var i = void 0;
            try {
                var r = document.createRange();
                r.selectNodeContents(n), e.removeAllRanges(), e.addRange(r), i = e.toString(), e.removeAllRanges()
            } finally {
                document.body.removeChild(n)
            }
            return i
        }
        var a = i(n);
        e.on("quote:selection", ".js-quote-markdown", function(e) {
            var n = e.detail.selection;
            try {
                var i = r(n, t.selectionToMarkdown(n));
                return e.detail.selectionText = i.replace(/^\n+/, "").replace(/\s+$/, "")
            } catch (s) {
                a["default"](function() {
                    throw s
                })
            }
        })
    }), define("github/legacy/behaviors/quote_selection", ["../../form", "delegated-events", "../../jquery", "../../visible", "../../hotkey", "../../scrollto"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o(n) {
            var i = n.toString().trim();
            if (i) {
                var r = n.focusNode;
                r.nodeType != Node.ELEMENT_NODE && (r = r.parentNode);
                var a = r.closest(".js-quote-selection-container");
                if (a) {
                    var s = {
                        selection: n,
                        selectionText: i
                    };
                    if (!t.fire(a, "quote:selection", s)) return !0;
                    i = s.selectionText;
                    var o = Array.from(a.querySelectorAll(".js-quote-selection-target")).filter(l["default"])[0];
                    if (o) {
                        var u = "> " + i.replace(/\n/g, "\n> ") + "\n\n",
                            c = o.value;
                        return c && (u = c + "\n\n" + u), e.changeValue(o, u), d["default"](o, {
                            duration: 300,
                            complete: function() {
                                o.focus(), o.selectionStart = o.value.length, o.scrollTop = o.scrollHeight
                            }
                        }), !0
                    }
                }
            }
        }
        var u = s(n),
            l = s(i),
            c = s(r),
            d = s(a);
        u["default"](document).on("keydown", function(e) {
            "r" != c["default"](e) || e.isDefaultPrevented() || e.isFormInteraction() || !o(window.getSelection()) || e.preventDefault()
        })
    }), define("github/legacy/behaviors/reactions", ["../../jquery", "../../menu"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
            }
            return Array.from(e)
        }

        function r() {
            var e = this.getAttribute("data-reaction-label");
            this.closest(".js-add-reaction-popover").querySelector(".js-reaction-description").textContent = e
        }

        function a() {
            this.closest(".js-add-reaction-popover").querySelector(".js-reaction-description").textContent = "Pick your reaction"
        }
        var s = n(e);
        s["default"](document).on("ajaxSuccess", ".js-pick-reaction", function(e, n, r, a) {
            t.deactivate(this.closest(".js-menu-container"));
            var o = this.closest(".js-comment");
            if (o) {
                var u, l, c = s["default"].parseHTML(a.reactions_container.trim()),
                    d = s["default"].parseHTML(a.comment_header_reaction_button.trim());
                (u = o.querySelector(".js-reactions-container")).replaceWith.apply(u, i(c)), (l = o.querySelector(".js-comment-header-reaction-button")).replaceWith.apply(l, i(d)), o.classList.remove("is-reacting")
            }
        }), s["default"](document).on("menu:activated", ".js-reaction-popover-container", function() {
            s["default"](this).on("mouseenter", ".js-reaction-option-item", r), s["default"](this).on("mouseleave", ".js-reaction-option-item", a), this.closest(".js-comment").classList.add("is-reacting")
        }), s["default"](document).on("menu:deactivated", ".js-reaction-popover-container", function() {
            s["default"](this).off("mouseenter", ".js-reaction-option-item", r), s["default"](this).off("mouseleave", ".js-reaction-option-item", a), this.closest(".js-comment").classList.remove("is-reacting")
        })
    }), define("github/legacy/behaviors/removed_contents", ["../../observe"], function(e) {
        e.observe(".has-removed-contents", function() {
            var e = void 0;
            return {
                add: function(t) {
                    e = Array.from(t.childNodes), e.forEach(function(e) {
                        return t.removeChild(e)
                    })
                },
                remove: function(t) {
                    e.forEach(function(e) {
                        return t.appendChild(e)
                    })
                }
            }
        })
    }), define("github/legacy/behaviors/repo-list", ["delegated-events", "../../jquery", "../../fetch"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(t) {
            function i(n) {
                var i = t.closest(".js-repo-filter");
                i.querySelector(".js-repo-list").innerHTML = n;
                var r = i.querySelector(".js-filterable-field");
                return r && e.fire(r, "filterable:change"), t.remove()
            }

            function r() {
                return t.classList.remove("is-loading")
            }
            if (!t.classList.contains("is-loading")) return t.classList.add("is-loading"), n.fetchText(t.href).then(i).then(r, r)
        }
        var a = i(t);
        a["default"](document).on("focusin", ".js-repo-filter .js-filterable-field", function() {
            var e = this.closest(".js-repo-filter").querySelector(".js-more-repos-link");
            e && r(e)
        }), a["default"](document).on("click", ".js-repo-filter .js-repo-filter-tab", function(t) {
            var n = void 0,
                i = void 0,
                a = this.closest(".js-repo-filter"),
                s = a.querySelector(".js-more-repos-link");
            s && r(s);
            var o = a.querySelectorAll(".js-repo-filter-tab");
            for (n = 0, i = o.length; i > n; n++) {
                var u = o[n];
                u.classList.toggle("filter-selected", u === this)
            }
            e.fire(a.querySelector(".js-filterable-field"), "filterable:change"), t.preventDefault()
        }), a["default"](document).on("filterable:change", ".js-repo-filter .js-repo-list", function() {
            var e = this.closest(".js-repo-filter"),
                t = e.querySelector(".js-repo-filter-tab.filter-selected"),
                n = t ? t.getAttribute("data-filter") : void 0;
            n && a["default"](this).children().not(n).hide()
        }), a["default"](document).on("click", ".js-more-repos-link", function(e) {
            e.preventDefault(), r(this)
        })
    }), define("github/legacy/behaviors/session-resume", ["delegated-events", "../../typecast", "../../setimmediate"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            e = e || window.location;
            var t = document.querySelector("meta[name=session-resume-id]");
            return t ? l["default"](t, HTMLMetaElement).content : e.pathname
        }

        function a(e) {
            return e.id && e.value !== e.defaultValue && e.form !== f
        }

        function s(e) {
            var t = "session-resume:" + e,
                n = Array.from(document.querySelectorAll(".js-session-resumable")),
                i = n.filter(function(e) {
                    return a(e)
                }).map(function(e) {
                    return [e.id, e.value]
                });
            if (i.length) try {
                sessionStorage.setItem(t, JSON.stringify(i))
            } catch (r) {}
        }

        function o(e) {
            try {
                return sessionStorage.getItem(e)
            } catch (t) {
                return null
            }
        }

        function u(t) {
            var n = "session-resume:" + t,
                i = o(n);
            if (i) {
                try {
                    sessionStorage.removeItem(n)
                } catch (r) {}
                for (var a = [], s = JSON.parse(i), u = 0; u < s.length; u++) {
                    var l = s[u],
                        f = d(l, 2),
                        h = f[0],
                        m = f[1];
                    if (e.fire(document, "session:resume", {
                            targetId: h,
                            targetValue: m
                        })) {
                        var v = document.getElementById(h);
                        v && (v instanceof HTMLInputElement || v instanceof HTMLTextAreaElement) && v.value === v.defaultValue && (v.value = m, a.push(v))
                    }
                }
                c["default"](function() {
                    for (var t = 0; t < a.length; t++) {
                        var n = a[t];
                        e.fire(n, "change")
                    }
                })
            }
        }
        var l = i(t),
            c = i(n),
            d = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !i && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            f = null;
        window.addEventListener("submit", function(e) {
            f = e.target, c["default"](function() {
                e.defaultPrevented && (f = null)
            })
        }, {
            capture: !0
        }), window.addEventListener("pageshow", function() {
            u(r())
        }), window.addEventListener("pjax:end", function() {
            u(r())
        }), window.addEventListener("pagehide", function() {
            s(r())
        }), window.addEventListener("pjax:beforeReplace", function(e) {
            var t = e.detail.previousState,
                n = t ? t.url : null;
            n ? s(r(new URL(n))) : ! function() {
                var e = new Error("pjax:beforeReplace event.detail.previousState.url is undefined");
                c["default"](function() {
                    throw e
                })
            }()
        })
    }), define("github/legacy/behaviors/size_to_fit", ["../../dimensions", "../../observe", "../../jquery", "../../visible"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            return l["default"](e).on("user:resize.trackUserResize", function() {
                return l["default"](e).addClass("is-user-resized"), l["default"](e).css({
                    "max-height": ""
                })
            })
        }

        function s(e) {
            return l["default"](e).off("user:resize.trackUserResize")
        }

        function o(t) {
            function n() {
                if (t.value !== r && c["default"](t)) {
                    var n = e.overflowOffset(i[0]);
                    if (!(null == n || n.top < 0 || n.bottom < 0)) {
                        var a = i.outerHeight() + n.bottom;
                        t.style.maxHeight = a - 100 + "px";
                        var s = t.parentNode,
                            o = s.style.height;
                        s.style.height = l["default"](s).css("height"), t.style.height = "auto", i.innerHeight(t.scrollHeight), s.style.height = o, r = t.value
                    }
                }
            }
            var i = l["default"](t),
                r = null;
            i.on("change.sizeToFit", function() {
                n()
            }), i.on("input.sizeToFit", function() {
                n()
            }), t.value && n()
        }

        function u(e) {
            l["default"](e).off(".sizeToFit")
        }
        var l = r(n),
            c = r(i);
        l["default"](document).on("reset", "form", function() {
            var e = l["default"](this).find("textarea.js-size-to-fit");
            e.removeClass("is-user-resized"), e.css({
                height: "",
                "max-height": ""
            })
        }), t.observe("textarea.js-size-to-fit", {
            add: a,
            remove: s
        }), t.observe("textarea.js-size-to-fit:not(.is-user-resized)", {
            add: o,
            remove: u
        })
    }), define("github/legacy/behaviors/social", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSuccess", ".js-social-container", function(e, t, i, r) {
            return n["default"](this).find(".js-social-count").text(r.count)
        })
    }), define.register("reconnectingwebsocket"),
    function(e, t) {
        "function" == typeof define && define.amd ? define([], t) : "undefined" != typeof module && module.exports ? module.exports = t() : e.ReconnectingWebSocket = t()
    }(this, function() {
        function e(t, n, i) {
            function r(e, t) {
                var n = document.createEvent("CustomEvent");
                return n.initCustomEvent(e, !1, !1, t), n
            }
            var a = {
                debug: !1,
                automaticOpen: !0,
                reconnectInterval: 1e3,
                maxReconnectInterval: 3e4,
                reconnectDecay: 1.5,
                timeoutInterval: 2e3,
                maxReconnectAttempts: null
            };
            i || (i = {});
            for (var s in a) "undefined" != typeof i[s] ? this[s] = i[s] : this[s] = a[s];
            this.url = t, this.reconnectAttempts = 0, this.readyState = WebSocket.CONNECTING, this.protocol = null;
            var o, u = this,
                l = !1,
                c = !1,
                d = document.createElement("div");
            d.addEventListener("open", function(e) {
                u.onopen(e)
            }), d.addEventListener("close", function(e) {
                u.onclose(e)
            }), d.addEventListener("connecting", function(e) {
                u.onconnecting(e)
            }), d.addEventListener("message", function(e) {
                u.onmessage(e)
            }), d.addEventListener("error", function(e) {
                u.onerror(e)
            }), this.addEventListener = d.addEventListener.bind(d), this.removeEventListener = d.removeEventListener.bind(d), this.dispatchEvent = d.dispatchEvent.bind(d), this.open = function(t) {
                if (o = new WebSocket(u.url, n || []), t) {
                    if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) return
                } else d.dispatchEvent(r("connecting")), this.reconnectAttempts = 0;
                (u.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "attempt-connect", u.url);
                var i = o,
                    a = setTimeout(function() {
                        (u.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "connection-timeout", u.url), c = !0, i.close(), c = !1
                    }, u.timeoutInterval);
                o.onopen = function(n) {
                    clearTimeout(a), (u.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onopen", u.url), u.protocol = o.protocol, u.readyState = WebSocket.OPEN, u.reconnectAttempts = 0;
                    var i = r("open");
                    i.isReconnect = t, t = !1, d.dispatchEvent(i)
                }, o.onclose = function(n) {
                    if (clearTimeout(a), o = null, l) u.readyState = WebSocket.CLOSED, d.dispatchEvent(r("close"));
                    else {
                        u.readyState = WebSocket.CONNECTING;
                        var i = r("connecting");
                        i.code = n.code, i.reason = n.reason, i.wasClean = n.wasClean, d.dispatchEvent(i), t || c || ((u.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onclose", u.url), d.dispatchEvent(r("close")));
                        var a = u.reconnectInterval * Math.pow(u.reconnectDecay, u.reconnectAttempts);
                        setTimeout(function() {
                            u.reconnectAttempts++, u.open(!0)
                        }, a > u.maxReconnectInterval ? u.maxReconnectInterval : a)
                    }
                }, o.onmessage = function(t) {
                    (u.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onmessage", u.url, t.data);
                    var n = r("message");
                    n.data = t.data, d.dispatchEvent(n)
                }, o.onerror = function(t) {
                    (u.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onerror", u.url, t), d.dispatchEvent(r("error"))
                }
            }, 1 == this.automaticOpen && this.open(!1), this.send = function(t) {
                if (o) return (u.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "send", u.url, t), o.send(t);
                throw "INVALID_STATE_ERR : Pausing to reconnect websocket"
            }, this.close = function(e, t) {
                "undefined" == typeof e && (e = 1e3), l = !0, o && o.close(e, t)
            }, this.refresh = function() {
                o && o.close()
            }
        }
        if ("WebSocket" in window) return e.prototype.onopen = function(e) {}, e.prototype.onclose = function(e) {}, e.prototype.onconnecting = function(e) {}, e.prototype.onmessage = function(e) {}, e.prototype.onerror = function(e) {}, e.debugAll = !1, e.CONNECTING = WebSocket.CONNECTING, e.OPEN = WebSocket.OPEN, e.CLOSING = WebSocket.CLOSING, e.CLOSED = WebSocket.CLOSED, e
    }), define.registerEnd(), define("github/legacy/behaviors/socket_channel", ["../../invariant", "../../observe", "../../jquery", "reconnectingwebsocket"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            var t = void 0;
            if (t = document.head.querySelector("link[rel=web-socket]")) {
                e.invariant(t instanceof HTMLLinkElement, "Link must be of type HTMLLinkElement");
                var n = new c["default"](t.href);
                return n.reconnectInterval = 2e3 * Math.random() + 1e3, n.reconnectDecay = 2, n.maxReconnectAttempts = 5, n.addEventListener("open", function() {
                    try {
                        for (var e in d) n.send("subscribe:" + e)
                    } catch (t) {
                        n.refresh()
                    }
                }), n.addEventListener("message", function(e) {
                    var t = void 0,
                        n = void 0,
                        i = void 0;
                    i = JSON.parse(e.data), n = i[0], t = i[1], n && t && l["default"](f[n]).trigger("socket:message", [t, n])
                }), n
            }
        }

        function s(e) {
            var t = void 0,
                n = void 0;
            return null != (t = null != (n = e.getAttribute("data-channel")) ? n.split(/\s+/) : void 0) ? t : []
        }

        function o(e) {
            var t = void 0,
                n = void 0;
            if (null != h ? h : h = a()) {
                var i = h,
                    r = s(e);
                for (t = 0, n = r.length; n > t; t++) {
                    var o = r[t];
                    i.readyState !== WebSocket.OPEN || d[o] || i.send("subscribe:" + o), d[o] = !0, null == f[o] && (f[o] = []), f[o].push(e)
                }
            }
        }

        function u(e) {
            var t = void 0,
                n = void 0,
                i = s(e);
            for (t = 0, n = i.length; n > t; t++) {
                var r = i[t];
                f[r] = l["default"](f[r]).not(e).slice(0)
            }
        }
        var l = r(n),
            c = r(i),
            d = {},
            f = {},
            h = null;
        t.observe(".js-socket-channel[data-channel]", {
            add: o,
            remove: u
        })
    }), define("github/legacy/behaviors/stale_session", ["../../invariant", "delegated-events"], function(e, t) {
        ! function() {
            var n = document.querySelector("meta[name=user-login]");
            if (n instanceof HTMLMetaElement) {
                var i = n.content,
                    r = String(!!i.length);
                try {
                    localStorage.setItem("logged-in", r)
                } catch (a) {
                    return
                }
                window.addEventListener("storage", function(n) {
                    if (n.storageArea === localStorage && "logged-in" === n.key && n.newValue !== r) {
                        r = n.newValue;
                        var i = document.querySelector(".js-stale-session-flash");
                        e.invariant(i instanceof HTMLElement, "Flash element must exist and be an HTMLElement"), i.classList.toggle("is-signed-in", "true" === r), i.classList.toggle("is-signed-out", "false" === r), i.classList.remove("d-none"), window.addEventListener("popstate", function(e) {
                            null != e.state.container && location.reload()
                        }), t.on("submit", "form", function(e) {
                            e.preventDefault()
                        })
                    }
                })
            }
        }()
    }), define("github/text-field-mirror", ["exports", "./invariant"], function(e, t) {
        function n(e, n) {
            var s = e.nodeName.toLowerCase();
            if ("textarea" !== s && "input" !== s) throw new Error("expected textField to a textarea or input");
            var o = a.get(e);
            if (o && o.parentElement === e.parentElement) o.innerHTML = "";
            else {
                o = document.createElement("div"), a.set(e, o);
                var u = window.getComputedStyle(e),
                    l = i.slice(0);
                "textarea" === s ? l.push("white-space:pre-wrap;") : l.push("white-space:nowrap;");
                for (var c = 0, d = r.length; d > c; c++) {
                    var f = r[c];
                    l.push(f + ":" + u.getPropertyValue(f) + ";")
                }
                o.style.cssText = l.join(" ")
            }
            var h = void 0;
            n !== !1 && (h = document.createElement("span"), h.style.cssText = "position: absolute;", h.className = "text-field-mirror-marker", h.innerHTML = "&nbsp;");
            var m = void 0,
                v = void 0;
            if ("number" == typeof n) {
                var p = e.value.substring(0, n);
                p && (m = document.createTextNode(p)), p = e.value.substring(n), p && (v = document.createTextNode(p))
            } else {
                var g = e.value;
                g && (m = document.createTextNode(g))
            }
            return m && o.appendChild(m), h && o.appendChild(h), v && o.appendChild(v), o.parentElement || (t.invariant(e.parentElement, "textField must have a parentElement to mirror"), e.parentElement.insertBefore(o, e)), o.scrollTop = e.scrollTop, o.scrollLeft = e.scrollLeft, o
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = n;
        var i = ["position:absolute;", "overflow:auto;", "word-wrap:break-word;", "top:0px;", "left:-9999px;"],
            r = ["box-sizing", "font-family", "font-size", "font-style", "font-variant", "font-weight", "height", "letter-spacing", "line-height", "max-height", "min-height", "padding-bottom", "padding-left", "padding-right", "padding-top", "border-bottom", "border-left", "border-right", "border-top", "text-decoration", "text-indent", "text-transform", "width", "word-spacing"],
            a = new WeakMap
    }), define("github/text-field-selection-position", ["exports", "./jquery", "./text-field-mirror"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? e.selectionEnd : arguments[1],
                n = s["default"](e, t),
                i = a["default"](n).find(".text-field-mirror-marker").position();
            return i.top += parseInt(a["default"](n).css("border-top-width"), 10), i.left += parseInt(a["default"](n).css("border-left-width"), 10), setTimeout(function() {
                a["default"](n).remove()
            }, 5e3), i
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = r;
        var a = i(t),
            s = i(n)
    }), define("github/suggester", ["exports", "./fetch", "./navigation", "./jquery", "./typecast", "./stats", "./text-field-selection-position"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var l = o(i),
            c = o(r),
            d = o(a),
            f = o(s),
            h = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !i && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            m = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t
                }
            }(),
            v = {},
            p = function() {
                function e(t) {
                    u(this, e), this.setup = this.setup.bind(this), this.teardown = this.teardown.bind(this), this.textarea = t.input, this.types = t.types, this.suggester = t.suggester, this.repositionManually = t.repositionManually, this.teardownManually = t.teardownManually, this.onActivate = t.onActivate, this.suggestions = t.suggestions || document.createElement("div"), this.disable = t.disable
                }
                return m(e, [{
                    key: "setup",
                    value: function() {
                        l["default"](this.textarea.form).on("reset.suggester", this.deactivate.bind(this)), l["default"](this.textarea).on("paste.suggester", this.onPaste.bind(this)), l["default"](this.textarea).on("input.suggester", this.onInput.bind(this)), l["default"](this.suggester).on("navigation:keydown.suggester", "[data-value]", this.onNavigationKeyDown.bind(this)), l["default"](this.suggester).on("navigation:open.suggester", "[data-value]", this.onNavigationOpen.bind(this)), this.teardownManually || l["default"](this.textarea).on("focusout:delayed.suggester", this.teardown), this.loadSuggestions()
                    }
                }, {
                    key: "teardown",
                    value: function() {
                        this.deactivate(), l["default"](this.textarea).off(".suggester"), l["default"](this.textarea.form).off(".suggester"), l["default"](this.suggester).off(".suggester"), this.onSuggestionsLoaded = function() {
                            return null
                        }
                    }
                }, {
                    key: "onPaste",
                    value: function() {
                        this.deactivate(), this.justPasted = !0
                    }
                }, {
                    key: "onInput",
                    value: function() {
                        return this.justPasted ? void(this.justPasted = !1) : this.checkQuery() ? !1 : void 0
                    }
                }, {
                    key: "onNavigationKeyDown",
                    value: function(e) {
                        switch (e.originalEvent.detail.hotkey) {
                            case "tab":
                                return this.onNavigationOpen(e), !1;
                            case "esc":
                                return this.deactivate(), e.stopImmediatePropagation(), !1
                        }
                    }
                }, {
                    key: "_getDataValue",
                    value: function(e) {
                        return this.currentSearch.type.getValue ? this.currentSearch.type.getValue(e) : e.getAttribute("data-value")
                    }
                }, {
                    key: "_findIndexOfPick",
                    value: function(e, t) {
                        for (var n = 1, i = 0; i < e.length; i++) {
                            var r = e[i];
                            if (this._getDataValue(r) === t) return n;
                            n++
                        }
                        return -1
                    }
                }, {
                    key: "logMention",
                    value: function(e, n, i, r) {
                        var a = i.getAttribute("data-mentionable-type");
                        if (a) {
                            var s = i.getAttribute("data-mentionable-id");
                            if (s) {
                                var o = new FormData;
                                o.append("authenticity_token", n), o.append("mentionable_type", a), o.append("mentionable_id", s), o.append("query_string", r), t.fetch(e, {
                                    method: "POST",
                                    body: o
                                })
                            }
                        }
                    }
                }, {
                    key: "onNavigationOpen",
                    value: function(e) {
                        var t = this,
                            n = this._getDataValue(e.target),
                            i = this.currentSearch.type.typeid,
                            r = c["default"](this.suggester.querySelector("ul.suggestions"), HTMLElement).children,
                            a = this._findIndexOfPick(r, n),
                            s = this.currentSearch.query.length,
                            o = this.textarea.value.substring(0, this.currentSearch.endIndex),
                            u = this.textarea.value.substring(this.currentSearch.endIndex);
                        this.currentSearch.type.onSelection ? this.currentSearch.type.onSelection(n) : (o = o.replace(this.currentSearch.type.match, this.currentSearch.type.replace.replace("$value", n)), this.textarea.value = o + u), this.deactivate(), this.textarea.focus(), this.textarea.selectionStart = o.length, this.textarea.selectionEnd = o.length, d["default"]({
                            suggesterBehavior: {
                                version: 1,
                                typeid: i,
                                indexOfPick: a,
                                numCharacters: s
                            }
                        });
                        var l = this.suggester.getAttribute("data-log-mention-url");
                        if (l) {
                            var f = this.suggester.getAttribute("data-log-mention-authenticity-token");
                            f && requestIdleCallback(function() {
                                return t.logMention(l, f, e.target, t.currentSearch.query)
                            })
                        }
                    }
                }, {
                    key: "checkQuery",
                    value: function() {
                        var e = this,
                            t = this.searchQuery();
                        if (t) {
                            if (this.currentSearch && this.currentSearch === t.query) return;
                            return this.currentSearch = t, this.search(t.type, t.query).then(function(n) {
                                return n ? e.activate(t.startIndex) : e.deactivate()
                            }), this.currentSearch.query
                        }
                        return this.currentSearch = null, void this.deactivate()
                    }
                }, {
                    key: "activate",
                    value: function(e) {
                        this.onActivate && this.onActivate(this.suggester), this.repositionManually || l["default"](this.suggester).css(f["default"](this.textarea, e + 1)), this.suggester.classList.contains("active") || (this.suggester.classList.add("active"), this.textarea.classList.add("js-navigation-enable"), n.push(this.suggester), n.focus(this.suggester))
                    }
                }, {
                    key: "deactivate",
                    value: function() {
                        this.suggester.classList.contains("active") && (this.suggester.classList.remove("active"), l["default"](this.suggester).find(".suggestions").hide(), this.textarea.classList.remove("js-navigation-enable"), n.pop(this.suggester))
                    }
                }, {
                    key: "search",
                    value: function(e, t) {
                        var i = this;
                        return e.search(this.suggestions, t).then(function(e) {
                            var t = h(e, 2),
                                r = t[0],
                                a = t[1];
                            if (a > 0) {
                                var s = r[0].cloneNode(!0);
                                return i.suggester.innerHTML = "", i.suggester.appendChild(s), l["default"](s).show(), n.focus(i.suggester), !0
                            }
                            return !1
                        })
                    }
                }, {
                    key: "searchQuery",
                    value: function() {
                        var e = this.textarea.selectionEnd,
                            t = this.textarea.value.substring(0, e);
                        if (!this.disable || !this.disable(t))
                            for (var n in this.types) {
                                var i = this.types[n],
                                    r = t.match(i.match);
                                if (r) return i.normalizeMatch ? i.normalizeMatch(i, e, r) : this.normalizeMatch(i, e, r)
                            }
                    }
                }, {
                    key: "normalizeMatch",
                    value: function(e, t, n) {
                        var i = n[2],
                            r = n[3],
                            a = t - i.length,
                            s = t;
                        return {
                            type: e,
                            text: i,
                            query: r,
                            startIndex: a,
                            endIndex: s
                        }
                    }
                }, {
                    key: "loadSuggestions",
                    value: function() {
                        var e = this;
                        if (!this.suggestions.hasChildNodes()) {
                            var n = this.suggester.getAttribute("data-url");
                            if (n) {
                                var i = v[n] || (v[n] = t.fetchText(n));
                                return i.then(function(t) {
                                    return e.onSuggestionsLoaded(t)
                                })
                            }
                        }
                    }
                }, {
                    key: "onSuggestionsLoaded",
                    value: function(e) {
                        var t = this;
                        return l["default"].parseHTML(e).forEach(function(e) {
                            return t.suggestions.appendChild(e)
                        }), document.activeElement === this.textarea ? (this.currentSearch = null, this.checkQuery()) : void 0
                    }
                }]), e
            }();
        e["default"] = p
    }), define("github/legacy/behaviors/suggester", ["../../jquery", "../../suggester", "../../fuzzy-filter-sort-list"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t, n) {
            var i = n[3],
                r = n[4],
                a = t - r.length,
                s = t;
            return {
                type: e,
                text: i,
                query: r,
                startIndex: a,
                endIndex: s
            }
        }

        function a(e) {
            var t = e.getAttribute("data-emoji-name");
            return j[t] = " " + s(e).replace(/_/g, " "), t
        }

        function s(e) {
            return e.getAttribute("data-text").trim().toLowerCase()
        }

        function o(e, t) {
            var n = j[e].indexOf(t);
            return n > -1 ? 1e3 - n : 0
        }

        function u(e, t) {
            var n = e.search(t);
            return n > -1 ? 1e3 - n : 0
        }

        function l(e, t) {
            var n = void 0,
                i = void 0,
                r = void 0,
                a = void 0,
                s = c(e, t[0]);
            if (0 !== s.length) {
                if (1 === t.length) return [s[0], 1, []];
                for (a = null, i = 0, r = s.length; r > i; i++) {
                    var o = s[i];
                    if (n = d(e, t, o + 1)) {
                        var u = n[n.length - 1] - o;
                        (!a || u < a[1]) && (a = [o, u, n])
                    }
                }
                return a
            }
        }

        function c(e, t) {
            for (var n = 0, i = [];
                (n = e.indexOf(t, n)) > -1;) i.push(n++);
            return i
        }

        function d(e, t, n) {
            var i = void 0,
                r = void 0,
                a = void 0,
                s = [];
            for (i = r = 1, a = t.length; a >= 1 ? a > r : r > a; i = a >= 1 ? ++r : --r) {
                if (n = e.indexOf(t[i], n), -1 === n) return;
                s.push(n++)
            }
            return s
        }

        function f() {
            return 2
        }

        function h(e) {
            var t = void 0;
            return e ? ! function() {
                var n = e.toLowerCase().split("");
                t = function(t) {
                    if (!t) return 0;
                    var i = l(t, n);
                    if (!i) return 0;
                    var r = e.length / i[1];
                    return r /= i[0] / 2 + 1
                }
            }() : t = f, {
                score: t
            }
        }

        function m(e) {
            var t = e.match(/`{3,}/g);
            return t || (t = v(e).match(/`/g)), null != t && t.length % 2
        }

        function v(e) {
            return e.replace(/`{3,}[^`]*\n(.+)?\n`{3,}/g, "")
        }
        var p = i(e),
            g = i(t),
            b = i(n),
            y = {
                mention: {
                    typeid: "mention",
                    match: /(^|\s)(@([a-z0-9\-_\/]*))$/i,
                    replace: "$1@$value ",
                    search: function(e, t) {
                        var n = h(t),
                            i = p["default"](e).find("ul.mention-suggestions"),
                            r = b["default"](i[0], t, {
                                limit: 5,
                                text: s,
                                score: function(e, t, i) {
                                    var r = n.score(e, t, i),
                                        a = i.getAttribute("data-mentionable-score");
                                    return null !== a ? r * parseFloat(a) : r
                                }
                            });
                        return Promise.resolve([i, r])
                    }
                },
                auditLogUser: {
                    typeid: "auditLogUser",
                    match: /(^|\s)((\-?actor:|\-?user:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(e, t) {
                        var n = p["default"](e).find("ul.user-suggestions"),
                            i = b["default"](n[0], t, {
                                limit: 5
                            });
                        return Promise.resolve([n, i])
                    },
                    normalizeMatch: r
                },
                auditLogOrg: {
                    typeid: "auditLogOrg",
                    match: /(^|\s)((\-?org:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(e, t) {
                        var n = p["default"](e).find("ul.org-suggestions"),
                            i = b["default"](n[0], t, {
                                limit: 5
                            });
                        return Promise.resolve([n, i])
                    },
                    normalizeMatch: r
                },
                auditLogAction: {
                    typeid: "auditLogAction",
                    match: /(^|\s)((\-?action:)([a-z0-9\.\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(e, t) {
                        var n = p["default"](e).find("ul.action-suggestions"),
                            i = b["default"](n[0], t, {
                                limit: 5
                            });
                        return Promise.resolve([n, i])
                    },
                    normalizeMatch: r
                },
                auditLogRepo: {
                    typeid: "auditLogRepo",
                    match: /(^|\s)((\-?repo:)([a-z0-9\/\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(e, t) {
                        var n = p["default"](e).find("ul.repo-suggestions"),
                            i = b["default"](n[0], t, {
                                limit: 5
                            });
                        return Promise.resolve([n, i])
                    },
                    normalizeMatch: r
                },
                auditLogCountry: {
                    typeid: "auditLogCountry",
                    match: /(^|\s)((\-?country:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(e, t) {
                        var n = p["default"](e).find("ul.country-suggestions"),
                            i = b["default"](n[0], t, {
                                limit: 5
                            });
                        return Promise.resolve([n, i])
                    },
                    normalizeMatch: r
                },
                emoji: {
                    typeid: "emoji",
                    match: /(^|\s)(:([a-z0-9\-\+_]*))$/i,
                    replace: "$1$value ",
                    getValue: function(e) {
                        var t = e.firstElementChild;
                        return t && "G-EMOJI" === t.tagName && !t.firstElementChild ? t.textContent : e.getAttribute("data-value")
                    },
                    search: function(e, t) {
                        var n = p["default"](e).find("ul.emoji-suggestions");
                        t = " " + t.toLowerCase().replace(/_/g, " ");
                        var i = b["default"](n[0], t, {
                            limit: 5,
                            text: a,
                            score: o
                        });
                        return Promise.resolve([n, i])
                    }
                },
                hashed: {
                    typeid: "issue",
                    match: /(^|\s)(\#([a-z0-9\-_\/]*))$/i,
                    replace: "$1#$value ",
                    search: function(e, t) {
                        var n = void 0,
                            i = p["default"](e).find("ul.hashed-suggestions"),
                            r = /^\d+$/.test(t) ? (n = new RegExp("\\b" + t), function(e) {
                                return u(e, n)
                            }) : h(t).score,
                            a = b["default"](i[0], t, {
                                limit: 5,
                                text: s,
                                score: r
                            });
                        return Promise.resolve([i, a])
                    }
                }
            },
            j = {};
        p["default"](document).on("focusin:delayed", ".js-suggester-field", function() {
            new g["default"]({
                input: this,
                suggester: this.closest(".js-suggester-container").querySelector(".js-suggester"),
                types: y,
                disable: m
            }).setup()
        })
    }), define("github/legacy/behaviors/survey", ["../../typecast", "../../invariant", "../../observe", "../../local-storage", "../../form", "../../google-analytics", "../../jquery"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u() {
            var e = document.querySelector(".js-survey");
            t.invariant(e instanceof HTMLElement, "Missing `js-survey` element");
            var n = e.getAttribute("data-survey-slug");
            return t.invariant(null != n, "Missing `data-survey-slug` attribute"), "survey-" + n
        }

        function l() {
            return parseInt(i.getItem(u())) || 0
        }

        function c() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? 1 : arguments[0];
            i.setItem(u(), l() + e)
        }

        function d() {
            return "github.dev" === location.hostname || location.search.match(/show-survey=1/) ? !0 : l() < y
        }

        function f(e) {
            if (e.getAttribute("data-optional-question")) return !0;
            var t = e.querySelector("input.js-other-choice"),
                n = e.querySelector("input[type=text]");
            if (t && t.checked) {
                var i = n.value.trim();
                return i
            }
            return e.querySelector("input:checked") ? !0 : !1
        }

        function h(e) {
            var t = e.closest(".js-survey"),
                n = t.querySelector(".js-survey-button");
            n.disabled = !f(e)
        }

        function m(e) {
            var t = e.querySelector("input.js-other-choice"),
                n = e.querySelector("input[type=text]");
            t && (n.classList.toggle("d-none", !t.checked), t.checked && n.focus())
        }

        function v(e, t) {
            var n = e.querySelector(".js-survey-form"),
                i = e.querySelectorAll(".js-survey-box-header, .js-survey-body, .js-survey-footer"),
                s = e.querySelector(".js-survey-complete");
            t.classList.toggle("d-none", !0), Array.from(i).forEach(function(e) {
                return e.classList.toggle("d-none", !0)
            }), s.classList.toggle("d-none", !1), a.trackEvent({
                category: "survey",
                action: "click",
                label: "submit"
            }), c(y), r.submit(n), e.classList.contains("js-survey-fixed") && setTimeout(function() {
                return e.classList.toggle("anim-fade-down", !0)
            }, 5e3)
        }

        function p(e, t, n) {
            var i = n.getAttribute("data-next-question"),
                r = e.querySelector(".js-question[data-question='" + i + "']"),
                s = e.querySelector(".js-question-number");
            a.trackEvent({
                category: "survey",
                action: "click",
                label: "next",
                value: i
            }), s.textContent = parseInt(i) + 1, r.classList.toggle("d-none", !1), h(r), r.getAttribute("data-last-question") && (r.querySelector("textarea").focus(), t.textContent = "Submit", t.classList.add("btn-primary"))
        }
        var g = o(e),
            b = o(s),
            y = 3;
        n.observe(".js-survey", function() {
            d() ? (a.trackEvent({
                category: "survey",
                action: "show",
                interactive: !1
            }), c(), this.classList.toggle("d-none", !1)) : this.classList.toggle("d-none", !0)
        }), b["default"](document).on("ajaxSuccess", ".js-survey-form", function() {
            a.trackEvent({
                category: "survey",
                action: "success"
            })
        }), b["default"](document).on("click", ".js-survey-button", function() {
            var e = this.closest(".js-survey"),
                t = e.querySelector(".js-question:not(.d-none)"),
                n = t.getAttribute("data-last-question"),
                i = this;
            t.classList.toggle("d-none", !0), n ? v(e, i) : p(e, i, t)
        }), b["default"](document).on("click", ".js-dismiss-survey", function(e) {
            a.trackEvent({
                category: "survey",
                action: "click",
                label: "dismiss"
            }), g["default"](document.querySelector(".js-survey"), HTMLElement).classList.toggle("anim-fade-down", !0), c(y), e.preventDefault()
        }), b["default"](document).on("change", ".js-survey", function() {
            var e = this.querySelector(".js-question:not(.d-none)");
            h(e), m(e)
        }), n.observe(".js-survey input[type=text]", function() {
            b["default"](this).on("input", function() {
                var e = this.closest(".js-survey"),
                    t = e.querySelector(".js-question:not(.d-none)");
                h(t)
            })
        })
    }), define("github/legacy/behaviors/tag_input", ["../../typecast", "../../observe", "delegated-events", "../../fetch", "../../jquery", "../../suggester", "../../fuzzy-filter", "../../hotkey", "../../fuzzy-filter-sort-list"], function(e, t, n, i, r, a, s, o, u) {
        function l(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function c(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var d = l(e),
            f = l(r),
            h = l(a),
            m = l(o),
            v = l(u),
            p = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t
                }
            }(),
            g = function() {
                function e(t) {
                    c(this, e), this.container = t.container, this.selections = t.selections, this.inputWrap = t.inputWrap, this.input = t.input, this.suggestions = t.suggestions, this.tagTemplate = t.tagTemplate, this.form = this.input.closest("form"), this.delayTimer = null
                }
                return p(e, [{
                    key: "setup",
                    value: function() {
                        var e = this;
                        this.container.addEventListener("click", function(t) {
                            t.target.matches(".js-remove") ? e.removeTag(t) : e.onFocus()
                        }), this.input.addEventListener("focus", this.onFocus.bind(this)), this.input.addEventListener("blur", this.onBlur.bind(this)), this.input.addEventListener("keydown", this.onKeyDown.bind(this)), this.form.addEventListener("submit", this.onSubmit.bind(this)), this.setupSuggester()
                    }
                }, {
                    key: "setupSuggester",
                    value: function() {
                        var e = this.suggestions.cloneNode(!0);
                        this.container.appendChild(e), this.suggester = new h["default"]({
                            input: this.input,
                            suggester: this.suggestions,
                            suggestions: e,
                            repositionManually: !0,
                            teardownManually: !0,
                            onActivate: this.repositionSuggester.bind(this),
                            types: {
                                tag: {
                                    match: /.+/i,
                                    onSelection: this.selectTag.bind(this),
                                    search: this.filterSuggestions.bind(this),
                                    normalizeMatch: this.normalizeSuggestionMatch.bind(this)
                                }
                            }
                        }), this.suggester.setup(), this.container.classList.add("js-suggester-container"), this.suggestions.classList.add("js-navigation-container", "suggester")
                    }
                }, {
                    key: "onFocus",
                    value: function() {
                        this.inputWrap.classList.add("focus"), this.input != document.activeElement && this.input.focus()
                    }
                }, {
                    key: "onBlur",
                    value: function() {
                        this.inputWrap.classList.remove("focus")
                    }
                }, {
                    key: "onSubmit",
                    value: function() {
                        this.val() && (this.selectTag(this.val()), this.suggester.deactivate())
                    }
                }, {
                    key: "onKeyDown",
                    value: function(e) {
                        switch (m["default"](e)) {
                            case "backspace":
                                this.onBackspace(e);
                                break;
                            case "enter":
                            case "tab":
                                this.taggifyValueWhenSuggesterHidden(e);
                                break;
                            case ",":
                            case "space":
                                this.taggifyValue(e)
                        }
                    }
                }, {
                    key: "taggifyValueWhenSuggesterHidden",
                    value: function(e) {
                        !this.isSuggesterVisible() && this.val() && (e.preventDefault(), this.selectTag(this.val()))
                    }
                }, {
                    key: "taggifyValue",
                    value: function(e) {
                        this.val() && (e.preventDefault(), this.selectTag(this.val()), this.suggester.deactivate())
                    }
                }, {
                    key: "selectTag",
                    value: function(e) {
                        var t = this.normalizeTag(e),
                            i = this.selectedTags();
                        t && i.indexOf(t) < 0 && (this.selections.appendChild(this.templateTag(t)), this.input.value = "", n.fire(this.form, "tags:changed"))
                    }
                }, {
                    key: "removeTag",
                    value: function(e) {
                        e.preventDefault(), e.target.closest(".js-tag-input-tag").remove(), n.fire(this.form, "tags:changed")
                    }
                }, {
                    key: "templateTag",
                    value: function(e) {
                        var t = this.tagTemplate.cloneNode(!0);
                        return d["default"](t.querySelector("input"), HTMLInputElement).value = e, t.querySelector(".js-placeholder-tag-name").replaceWith(e), t.classList.remove("d-none", "js-template"), t
                    }
                }, {
                    key: "normalizeTag",
                    value: function(e) {
                        return e.toLowerCase().trim().replace(/[\s,']+/g, "-")
                    }
                }, {
                    key: "onBackspace",
                    value: function() {
                        if (!this.val()) {
                            var e = this.selections.querySelector("li:last-child .js-remove");
                            e && e.click()
                        }
                    }
                }, {
                    key: "val",
                    value: function() {
                        return this.input.value
                    }
                }, {
                    key: "repositionSuggester",
                    value: function(e) {
                        e.style.position = "absolute", e.style.top = this.container.clientHeight + "px"
                    }
                }, {
                    key: "filterSuggestions",
                    value: function(e, t) {
                        var n = this,
                            r = f["default"](e).find("ul.js-tag-suggestions"),
                            a = r[0];
                        if (a.hasAttribute("data-url")) return new Promise(function(e) {
                            clearTimeout(n.delayTimer), n.delayTimer = setTimeout(function() {
                                if (n.input.value.trim().length < 1 || !a) return e([r, 0]);
                                var s = new URL(a.getAttribute("data-url"), window.location.origin),
                                    o = new URLSearchParams(s.search.slice(1));
                                o.append("q", t), s.search = o.toString(), i.fetchSafeDocumentFragment(document, s).then(function(t) {
                                    a.innerHTML = "", a.appendChild(t);
                                    var n = r.find("li").length;
                                    e([r, n])
                                })
                            }, 300)
                        });
                        var o = this.selectedTags(),
                            u = v["default"](a, t, {
                                limit: 5,
                                score: function(e, t) {
                                    return o.indexOf(e) >= 0 ? 0 : o.indexOf(n.normalizeTag(e)) >= 0 ? 0 : s.fuzzyScore(e, t)
                                }
                            });
                        return Promise.resolve([r, u])
                    }
                }, {
                    key: "normalizeSuggestionMatch",
                    value: function(e, t, n) {
                        return {
                            type: e,
                            text: n[0],
                            query: n[0]
                        }
                    }
                }, {
                    key: "selectedTags",
                    value: function() {
                        var e = this.selections.querySelectorAll("input");
                        return Array.from(e).map(function(e) {
                            return e.value
                        }).filter(function(e) {
                            return e.length > 0
                        })
                    }
                }, {
                    key: "isSuggesterVisible",
                    value: function() {
                        return !!this.suggestions.offsetParent
                    }
                }]), e
            }();
        t.observe(".js-tag-input-container", function() {
            new g({
                container: this,
                inputWrap: this.querySelector(".js-tag-input-wrapper"),
                input: this.querySelector('input[type="text"]'),
                suggestions: this.querySelector(".js-tag-input-options"),
                selections: this.querySelector(".js-tag-input-selected-tags"),
                tagTemplate: this.querySelector(".js-template")
            }).setup()
        })
    }), define("github/legacy/behaviors/team-members", ["../../jquery", "../../fetch", "../../observe"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            function e(e) {
                return 0 === e.total ? e.members.push("This team has no members") : e.total > e.members.length && e.members.push(e.total - e.members.length + " more"), a(u, s(e.members))
            }
            var n = void 0;
            if (n = this.getAttribute("data-url")) {
                var i = t.fetchJSON(n),
                    r = this.getAttribute("data-id"),
                    u = o["default"](".js-team-mention[data-id='" + r + "']");
                u.removeAttr("data-url");
                var l = function(e) {
                    return function(t) {
                        var n = (null != t.response ? t.response.status : void 0) || 500,
                            i = function() {
                                switch (n) {
                                    case 404:
                                        return this.getAttribute("data-permission-text");
                                    default:
                                        return this.getAttribute("data-error-text")
                                }
                            }.call(e);
                        return a(u, i)
                    }
                }(this);
                return i.then(e, l)
            }
        }

        function a(e, t) {
            return e.attr("aria-label", t), e.addClass("tooltipped tooltipped-s tooltipped-multiline")
        }

        function s(e) {
            var t = void 0;
            return 0 === e.length ? "" : 1 === e.length ? e[0] : 2 === e.length ? e.join(" and ") : ([].splice.apply(e, [-1, 9e9].concat(t = "and " + e.slice(-1))), e.join(", "))
        }
        var o = i(e);
        n.observe(".js-team-mention", function() {
            o["default"](this).on("mouseenter", r)
        })
    }), define("github/legacy/behaviors/timeline_marker", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxBeforeSend", function(e, t, i) {
            if (!i.crossDomain) {
                var r = n["default"](".js-timeline-marker");
                r.length && t.setRequestHeader("X-Timeline-Last-Modified", r.attr("data-last-modified"))
            }
        })
    }), define("github/legacy/behaviors/timeline_progressive_disclosure", ["../../dimensions", "../../observe", "delegated-events"], function(e, t, n) {
        function i(e) {
            for (var t = 0; t < u.length; t++) {
                var n = u[t].exec(e);
                if (null != n) return [n[1], n[2]]
            }
        }

        function r(e, t, n) {
            var i = new URL(e.getAttribute("data-fragment-url"), window.location.origin),
                r = new URLSearchParams(i.search.slice(1));
            r.append("focus_type", t), r.append("focus_value", n), i.search = r.toString(), e.src = i.toString()
        }

        function a() {
            return window.location.hash.slice(1)
        }
        var s = function() {
            function e(e, t) {
                var n = [],
                    i = !0,
                    r = !1,
                    a = void 0;
                try {
                    for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                } catch (u) {
                    r = !0, a = u
                } finally {
                    try {
                        !i && o["return"] && o["return"]()
                    } finally {
                        if (r) throw a
                    }
                }
                return n
            }
            return function(t, n) {
                if (Array.isArray(t)) return t;
                if (Symbol.iterator in Object(t)) return e(t, n);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }();
        n.on("click", ".js-timeline-progressive-disclosure-button", function() {
            var e = this.closest(".js-timeline-progressive-disclosure-container");
            e.src = this.getAttribute("data-url")
        });
        var o = null;
        t.observe(".js-timeline-progressive-disclosure-container", function() {
            return {
                add: function(t) {
                    return t.addEventListener("loadstart", function() {
                        return this.classList.add("is-loading"), !0
                    }), t.addEventListener("loadend", function() {
                        return this.classList.remove("is-loading"), !0
                    }), t.addEventListener("load", function() {
                        if (t === o) {
                            o = null;
                            var n = a(),
                                i = document.getElementById(n);
                            if (i) {
                                var r = i.closest(".js-details-container");
                                null != r && r.classList.add("open");
                                var s = e.overflowOffset(i);
                                null != s && (s.top < 0 || s.bottom < 0) && i.scrollIntoView()
                            }
                        }
                        return !0
                    }), t.addEventListener("error", function() {
                        return this.src = "", !0
                    })
                }
            }
        });
        var u = [/^(commitcomment)-(\d+)$/, /^(commits-pushed)-([0-9a-f]{7})$/, /^(discussion)_r(\d+)$/, /^(discussion-diff)-(\d+)(?:[LR]-?\d+)?$/, /^(event)-(\d+)$/, /^(issuecomment)-(\d+)$/, /^(ref-commit)-([0-9a-f]{7})$/, /^(ref-issue)-(\d+)$/, /^(ref-pullrequest)-(\d+)$/];
        ! function() {
            var e = a();
            if (!document.getElementById(e)) {
                var t = document.querySelector(".js-timeline-progressive-disclosure-container");
                if (t) {
                    var n = i(e);
                    if (n) {
                        var u = s(n, 2),
                            l = u[0],
                            c = u[1];
                        return r(t, l, c), o = t
                    }
                }
            }
        }()
    }), define("github/legacy/behaviors/timing_stats", ["../../jquery", "../../stats"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            if (!window.performance.timing) try {
                return sessionStorage.setItem("navigationStart", Date.now().toString())
            } catch (e) {}
        }

        function r() {
            return setTimeout(function() {
                var e = void 0,
                    t = void 0,
                    n = void 0,
                    i = void 0,
                    r = void 0,
                    o = {};
                if (o.crossBrowserLoadEvent = Date.now(), window.performance.timing) {
                    var u = window.performance.timing;
                    for (t in u) {
                        var l = u[t];
                        "number" == typeof l && (o[t] = l)
                    }
                    var c = null != (i = window.chrome) && "function" == typeof i.loadTimes && null != (r = i.loadTimes()) ? r.firstPaintTime : void 0;
                    c && (o.chromeFirstPaintTime = Math.round(1e3 * c))
                } else {
                    var d = function() {
                        try {
                            return sessionStorage.getItem("navigationStart")
                        } catch (e) {}
                    }();
                    d && (o.simulatedNavigationStart = parseInt(d, 10))
                }
                var f = function() {
                    var e = void 0,
                        t = void 0,
                        n = window.performance.getEntriesByType("resource"),
                        i = [];
                    for (e = 0, t = n.length; t > e; e++) {
                        var r = n[e];
                        i.push(a["default"].extend({}, r))
                    }
                    return i
                }();
                for (e = 0, n = f.length; n > e; e++) {
                    var h = f[e];
                    delete h.toJSON
                }
                return Object.keys(o).length > 1 || f.length ? s["default"]({
                    timing: o,
                    resources: f
                }) : void 0
            }, 0)
        }
        var a = n(e),
            s = n(t);
        a["default"](window).on("pagehide", i), a["default"](window).on("load", r)
    }), define("github/page-focused", ["exports"], function(e) {
        function t(e) {
            return new Promise(function(t) {
                function n() {
                    e.hasFocus() && (t(), e.removeEventListener("visibilitychange", n), window.removeEventListener("focus", n), window.removeEventListener("blur", n))
                }
                e.addEventListener("visibilitychange", n), window.addEventListener("focus", n), window.addEventListener("blur", n), n()
            })
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = t
    }), define("github/in-viewport", ["exports", "./jquery", "./observe", "./page-focused"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            var t = e.getBoundingClientRect(),
                n = d["default"](window).height(),
                i = d["default"](window).width();
            if (0 === t.height) return !1;
            if (t.height < n) return t.top >= 0 && t.left >= 0 && t.bottom <= n && t.right <= i;
            var r = Math.ceil(n / 2);
            return t.top >= 0 && t.top + r < n
        }

        function s(e) {
            for (var t = e.elements, n = [], i = 0, r = t.length; r > i; i++) {
                var s = t[i];
                if (a(s)) {
                    var o = e["in"];
                    n.push(null != o ? o.call(s, s, e) : void 0)
                } else {
                    var u = e.out;
                    n.push(null != u ? u.call(s, s, e) : void 0)
                }
            }
            return n
        }

        function o(e) {
            document.hasFocus() && window.scrollY !== m && (m = window.scrollY, e.checkPending || (e.checkPending = !0, window.requestAnimationFrame(function() {
                e.checkPending = !1, s(e)
            })))
        }

        function u(e, t) {
            0 === t.elements.length && (window.addEventListener("scroll", t.scrollHandler, {
                capture: !0,
                passive: !0
            }), f["default"](document).then(function() {
                return s(t)
            })), t.elements.push(e)
        }

        function l(e, t) {
            var n = t.elements.indexOf(e); - 1 !== n && t.elements.splice(n, 1), 0 === t.elements.length && window.removeEventListener("scroll", t.scrollHandler, {
                capture: !0,
                passive: !0
            })
        }

        function c(e, t) {
            null != t.call && (t = {
                "in": t
            });
            var i = {
                id: h++,
                selector: e,
                "in": t["in"],
                out: t.out,
                elements: [],
                checkPending: !1,
                scrollHandler: function() {
                    o(i)
                }
            };
            return n.observe(e, {
                add: function(e) {
                    u(e, i)
                },
                remove: function(e) {
                    l(e, i)
                }
            }), i
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = c;
        var d = r(t),
            f = r(i),
            h = 0,
            m = -1
    }), define("github/legacy/behaviors/unread_comments", ["../../observe", "../../form", "../../jquery", "../../in-viewport"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            if (document.hasFocus()) {
                var e = document.querySelector(".js-timeline-marker-form");
                e && e instanceof HTMLFormElement && t.submit(e)
            }
        }

        function s(e) {
            return e.classList.remove("js-unread-item", "unread-item")
        }
        var o = r(n),
            u = r(i),
            l = 0;
        u["default"](".js-unread-item", {
            "in": function() {
                s(this)
            }
        }), e.observe(".js-unread-item", {
            add: function() {
                return l++
            },
            remove: function() {
                return l--, 0 === l ? a(this) : void 0
            }
        }), o["default"](document).on("socket:message", ".js-discussion", function(e) {
            var t = void 0,
                n = void 0;
            if (this === e.target) {
                var i = document.querySelectorAll(".js-unread-item");
                for (t = 0, n = i.length; n > t; t++) {
                    var r = i[t];
                    s(r)
                }
            }
        })
    }), define("github/legacy/behaviors/unread_item_counter", ["../../observe"], function(e) {
        function t() {
            var e = n ? "(" + n + ") " : "";
            return document.title.match(i) ? document.title = document.title.replace(i, e) : document.title = "" + e + document.title
        }
        var n = 0,
            i = /^\(\d+\)\s+/;
        e.observe(".js-unread-item", {
            add: function() {
                return n++, t()
            },
            remove: function() {
                return n--, t()
            }
        })
    }), define("github/legacy/behaviors/user_content", ["../../jquery", "../../fragment-target"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            if (location.hash && !document.querySelector(":target")) {
                var e = void 0;
                try {
                    e = decodeURIComponent(location.hash.slice(1))
                } catch (n) {
                    return
                }
                var i = t.findElementByFragmentName(document, "user-content-" + e);
                null != i && i.scrollIntoView()
            }
        }
        var r = n(e);
        window.addEventListener("hashchange", i), r["default"](i), document.addEventListener("pjax:success", i)
    }), define("github/legacy/behaviors/user_resize", ["../../jquery", "../../debounce"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            var e = null,
                t = s["default"](function() {
                    return e = null
                }, 200),
                n = {
                    x: 0,
                    y: 0
                };
            a["default"](this).on("mousemove.userResize", function(i) {
                if (n.x !== i.clientX || n.y !== i.clientY) {
                    var r = this.style.height;
                    e && e !== r && a["default"](this).trigger("user:resize"), e = r, t()
                }
                n = {
                    x: i.clientX,
                    y: i.clientY
                }
            })
        }

        function r() {
            a["default"](this).off("mousemove.userResize")
        }
        var a = n(e),
            s = n(t);
        a["default"].event.special["user:resize"] = {
            setup: i,
            teardown: r
        }
    }), define("github/legacy/behaviors/validation", ["../../observe", "../../html-validation", "../../focused", "../../jquery"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            var e = t.checkValidity(this);
            return e && t.revalidate(this),
                function() {
                    var n = t.checkValidity(this);
                    n !== e && t.revalidate(this), e = n
                }
        }
        var s = r(i),
            o = ["input[pattern]", "input[required]", "textarea[required]", "select[required]"].join(",");
        n.onFocusedInput(document, o, a), s["default"](document).on("change", o, a), e.observe(o, function(e) {
            e.form && t.revalidate(e)
        }), s["default"](document).on("submit", ".js-normalize-submit", function(e) {
            return t.checkValidity(this) ? void 0 : e.preventDefault()
        })
    }), define("github/legacy/behaviors/will-transition-once", ["../../observe"], function(e) {
        function t(e) {
            return e.target.classList.remove("will-transition-once")
        }
        e.observe(".will-transition-once", {
            add: function() {
                this.addEventListener("transitionend", t)
            },
            remove: function() {
                this.removeEventListener("transitionend", t)
            }
        })
    }), define("github/legacy/graphs/calendar-sample", ["../../invariant", "delegated-events", "../../fetch"], function(e, t, n) {
        t.on("click", ".js-new-user-contrib-example", function(t) {
            function i(e) {
                var t = document.createElement("div");
                t.innerHTML = e;
                var n = a.querySelector(".js-calendar-graph-svg");
                n.replaceWith(t.children[0])
            }

            function r() {
                return a.classList.remove("sample-graph")
            }
            t.preventDefault();
            var a = document.querySelector(".js-calendar-graph");
            e.invariant(a instanceof HTMLElement, "`js-calendar-graph` element must exist"), a.classList.contains("sample-graph") || (a.classList.add("sample-graph"), n.fetchText(this.getAttribute("href")).then(i, r))
        })
    }), define("github/legacy/graphs/network", ["../../typecast", "../../observe", "../../fetch", "../../jquery"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var s = r(e),
            o = r(i),
            u = function() {
                function e(e, t, n) {
                    this.container = e, this.width = t, this.height = n, this.initError = a(this.initError, this), this.init = a(this.init, this), this.loaderInterval = null, this.loaderOffset = 0, this.ctx = this.initCanvas(this.container, this.width, this.height), this.startLoader("Loading graph data"), this.loadMeta()
                }
                return e.prototype.initCanvas = function(e) {
                    var t = e.getElementsByTagName("canvas")[0];
                    t.style.zIndex = "0";
                    var n = t.width,
                        i = t.height,
                        r = t.getContext("2d"),
                        a = window.devicePixelRatio || 1,
                        s = r.webkitBackingStorePixelRatio || r.mozBackingStorePixelRatio || r.msBackingStorePixelRatio || r.oBackingStorePixelRatio || r.backingStorePixelRatio || 1,
                        o = a / s;
                    return 1 === o ? r : (t.width = n * o, t.height = i * o, t.style.width = n + "px", t.style.height = i + "px", r.scale(o, o), r)
                }, e.prototype.startLoader = function(e) {
                    return this.ctx.save(), this.ctx.font = "14px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#cacaca", this.ctx.textAlign = "center", this.ctx.fillText(e, this.width / 2, 155), this.ctx.restore(), this.displayLoader()
                }, e.prototype.stopLoader = function() {
                    var e = this.container.querySelector(".large-loading-area");
                    return e.classList.add("d-none")
                }, e.prototype.displayLoader = function() {
                    var e = this.container.querySelector(".large-loading-area");
                    return e.classList.remove("d-none")
                }, e.prototype.loadMeta = function() {
                    function e(e) {
                        return e.json()
                    }
                    var t = this.container.getAttribute("data-network-graph-meta-url");
                    return n.fetchPoll(t, {
                        headers: {
                            accept: "application/json"
                        }
                    }).then(e, this.initError).then(this.init)
                }, e.prototype.init = function(e) {
                    var t = void 0,
                        n = void 0,
                        i = void 0,
                        r = void 0;
                    if (m) {
                        this.focus = e.focus, this.nethash = e.nethash, this.spaceMap = e.spacemap, this.userBlocks = e.blocks, this.commits = function() {
                            var n = void 0,
                                r = void 0,
                                a = e.dates,
                                s = [];
                            for (i = n = 0, r = a.length; r > n; i = ++n) t = a[i], s.push(new l(i, t));
                            return s
                        }(), this.users = {};
                        var a = e.users;
                        for (n = 0, r = a.length; r > n; n++) {
                            var s = a[n];
                            this.users[s.name] = s
                        }
                        return this.chrome = new c(this, this.ctx, this.width, this.height, this.focus, this.commits, this.userBlocks, this.users), this.graph = new d(this, this.ctx, this.width, this.height, this.focus, this.commits, this.users, this.spaceMap, this.userBlocks, this.nethash), this.mouseDriver = new f(this.container, this.chrome, this.graph), this.keyDriver = new h(this.chrome, this.graph), this.stopLoader(), this.graph.drawBackground(), this.chrome.draw(), this.graph.requestInitialChunk()
                    }
                }, e.prototype.initError = function() {
                    return this.stopLoader(), this.ctx.clearRect(0, 0, this.width, this.height), this.startLoader("Graph could not be drawn due to a network problem.")
                }, e
            }(),
            l = function() {
                function e(e, t) {
                    this.time = e, this.date = new Date(t), this.requested = null, this.populated = null
                }
                return e.prototype.populate = function(e, t, n) {
                    return this.user = t, this.author = e.author, this.date = new Date(e.date.replace(" ", "T")), this.gravatar = e.gravatar, this.id = e.id, this.login = e.login, this.message = e.message, this.space = e.space, this.time = e.time, this.parents = this.populateParents(e.parents, n), this.requested = !0, this.populated = new Date
                }, e.prototype.populateParents = function(e, t) {
                    var n = void 0,
                        i = void 0,
                        r = function() {
                            var r = void 0,
                                a = void 0,
                                s = [];
                            for (r = 0, a = e.length; a > r; r++) n = e[r], i = t[n[1]], i.id = n[0], i.space = n[2], s.push(i);
                            return s
                        }();
                    return r
                }, e
            }(),
            c = function() {
                function e(e, t, n, i, r, a, s, o) {
                    this.network = e, this.ctx = t, this.width = n, this.height = i, this.focus = r, this.commits = a, this.userBlocks = s, this.users = o, this.namesWidth = 120, this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], this.userBgColors = ["#fff", "#f7f7f7"], this.headerColor = "#f7f7f7", this.dividerColor = "#ddd", this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = 10 + this.headerHeight + this.dateRowHeight, this.nameLineHeight = 24, this.offsetX = this.namesWidth + (this.width - this.namesWidth) / 2 - this.focus * this.nameLineHeight, this.offsetY = 0, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (this.width - this.namesWidth) / 2, this.activeUser = null
                }
                return e.prototype.moveX = function(e) {
                    return this.offsetX += e, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight ? this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight : void 0
                }, e.prototype.moveY = function(e) {
                    return this.offsetY += e, this.offsetY > 0 || this.contentHeight < this.height - this.graphTopOffset ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
                }, e.prototype.calcContentHeight = function() {
                    var e = void 0,
                        t = void 0,
                        n = 0,
                        i = this.userBlocks;
                    for (e = 0, t = i.length; t > e; e++) {
                        var r = i[e];
                        n += r.count
                    }
                    return n * this.nameLineHeight
                }, e.prototype.hover = function(e, t) {
                    var n = void 0,
                        i = void 0,
                        r = this.userBlocks;
                    for (n = 0, i = r.length; i > n; n++) {
                        var a = r[n];
                        if (e > 0 && e < this.namesWidth && t > this.graphTopOffset + this.offsetY + a.start * this.nameLineHeight && t < this.graphTopOffset + this.offsetY + (a.start + a.count) * this.nameLineHeight) return this.users[a.name]
                    }
                    return null
                }, e.prototype.draw = function() {
                    return this.drawTimeline(this.ctx), this.drawUsers(this.ctx)
                }, e.prototype.drawTimeline = function(e) {
                    var t = void 0,
                        n = void 0,
                        i = void 0,
                        r = void 0,
                        a = void 0,
                        s = void 0,
                        o = void 0,
                        u = void 0;
                    for (e.fillStyle = this.headerColor, e.fillRect(0, 0, this.width, this.headerHeight), e.fillStyle = this.dividerColor, e.fillRect(0, this.headerHeight - 1, this.width, 1), s = parseInt((0 - this.offsetX) / this.nameLineHeight), 0 > s && (s = 0), a = s + parseInt(this.width / (this.nameLineHeight - 1)), a > this.commits.length && (a = this.commits.length), e.save(), e.translate(this.offsetX, 0), r = null, i = null, n = t = o = s, u = a; u >= o ? u > t : t > u; n = u >= o ? ++t : --t) {
                        var l = this.commits[n],
                            c = this.months[l.date.getMonth()];
                        if (c !== r) {
                            e.font = "bold 12px 'Helvetica Neue', Arial, sans-serif", e.fillStyle = "#555";
                            var d = this.ctx.measureText(c).width;
                            e.fillText(c, n * this.nameLineHeight - d / 2, this.headerHeight / 2 + 4), r = c
                        }
                        var f = l.date.getDate();
                        if (f !== i) {
                            e.font = "12px 'Helvetica Neue', Arial, sans-serif", e.fillStyle = "#555";
                            var h = this.ctx.measureText(f).width;
                            e.fillText(f, n * this.nameLineHeight - h / 2, this.headerHeight + this.dateRowHeight / 2 + 3), i = f, e.fillStyle = "#ddd", e.fillRect(n * this.nameLineHeight, this.headerHeight, 1, 6)
                        }
                    }
                    return e.restore()
                }, e.prototype.drawUsers = function(e) {
                    var t = void 0,
                        n = void 0,
                        i = void 0;
                    e.fillStyle = "#fff", e.fillRect(0, 0, this.namesWidth, this.height), e.save(), e.translate(0, this.headerHeight + this.dateRowHeight + this.offsetY);
                    var r = this.userBlocks;
                    for (n = t = 0, i = r.length; i > t; n = ++t) {
                        var a = r[n];
                        e.fillStyle = this.userBgColors[n % 2], e.fillRect(0, a.start * this.nameLineHeight, this.namesWidth, a.count * this.nameLineHeight), this.activeUser && this.activeUser.name === a.name && (e.fillStyle = "rgba(0, 0, 0, 0.05)", e.fillRect(0, a.start * this.nameLineHeight, this.namesWidth, a.count * this.nameLineHeight));
                        var s = (a.start + a.count / 2) * this.nameLineHeight + 3;
                        e.fillStyle = "rgba(0, 0, 0, 0.1)", e.fillRect(0, a.start * this.nameLineHeight + a.count * this.nameLineHeight - 1, this.namesWidth, 1), e.fillStyle = "#333", e.font = "13px 'Helvetica Neue', Arial, sans-serif", e.textAlign = "center", e.fillText(a.name, this.namesWidth / 2, s, 96)
                    }
                    e.restore(), e.fillStyle = this.headerColor, e.fillRect(0, 0, this.namesWidth, this.headerHeight), e.fillStyle = "#777", e.font = "12px 'Helvetica Neue', Arial, sans-serif", e.fillText("Owners", 40, this.headerHeight / 2 + 3);
                    var o = 10;
                    return e.fillStyle = this.dividerColor, e.fillRect(this.namesWidth - 1, o, 1, this.headerHeight - 2 * o), e.fillStyle = this.dividerColor, e.fillRect(0, this.headerHeight - 1, this.namesWidth, 1), e.fillStyle = this.dividerColor, e.fillRect(this.namesWidth - 1, this.headerHeight, 1, this.height - this.headerHeight)
                }, e
            }(),
            d = function() {
                function e(e, t, n, i, r, a, s, o, u, l) {
                    var c = void 0,
                        d = void 0,
                        f = void 0,
                        h = void 0,
                        m = void 0,
                        v = void 0,
                        p = void 0,
                        g = void 0,
                        b = void 0,
                        y = void 0,
                        j = void 0;
                    this.network = e, this.ctx = t, this.width = n, this.height = i, this.focus = r, this.commits = a, this.users = s, this.spaceMap = o, this.userBlocks = u, this.nethash = l, this.namesWidth = 120, this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = 10 + this.headerHeight + this.dateRowHeight, this.bgColors = ["#fff", "#f9f9f9"], this.nameLineHeight = 24, this.spaceColors = ["#c0392b", "#3498db", "#2ecc71", "#8e44ad", "#f1c40f", "#e67e22", "#34495e", "#e74c3c", "#2980b9", "#1abc9c", "#9b59b6", "#f39c12", "#7f8c8d", "#2c3e50", "#d35400", "#e74c3c", "#95a5a6", "#bdc3c7", "#16a085", "#27ae60"], this.offsetX = this.namesWidth + (this.width - this.namesWidth) / 2 - this.focus * this.nameLineHeight, this.offsetY = 0, this.bgCycle = 0, this.marginMap = {}, this.gravatars = {}, this.activeCommit = null, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (this.width - this.namesWidth) / 2, this.showRefs = !0, this.lastHotLoadCenterIndex = null, this.connectionMap = {}, this.spaceUserMap = {};
                    var w = this.userBlocks;
                    for (d = 0, m = w.length; m > d; d++)
                        for (c = w[d], f = h = y = c.start, j = c.start + c.count; j >= y ? j > h : h > j; f = j >= y ? ++h : --h) this.spaceUserMap[f] = this.users[c.name];
                    this.headsMap = {};
                    var x = this.userBlocks;
                    for (g = 0, v = x.length; v > g; g++) {
                        c = x[g];
                        var S = this.users[c.name],
                            k = S.heads;
                        for (b = 0, p = k.length; p > b; b++) {
                            var L = k[b];
                            this.headsMap[L.id] || (this.headsMap[L.id] = []);
                            var _ = {
                                name: S.name,
                                head: L
                            };
                            this.headsMap[L.id].push(_)
                        }
                    }
                }
                return e.prototype.moveX = function(e) {
                    return this.offsetX += e, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight && (this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight), this.hotLoadCommits()
                }, e.prototype.moveY = function(e) {
                    return this.offsetY += e, this.offsetY > 0 || this.contentHeight < this.height - this.graphTopOffset ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
                }, e.prototype.toggleRefs = function() {
                    return this.showRefs = !this.showRefs
                }, e.prototype.calcContentHeight = function() {
                    var e = void 0,
                        t = void 0,
                        n = 0,
                        i = this.userBlocks;
                    for (e = 0, t = i.length; t > e; e++) {
                        var r = i[e];
                        n += r.count
                    }
                    return n * this.nameLineHeight
                }, e.prototype.hover = function(e, t) {
                    var n = void 0,
                        i = void 0,
                        r = void 0,
                        a = void 0,
                        s = this.timeWindow();
                    for (i = n = r = s.min, a = s.max; a >= r ? a >= n : n >= a; i = a >= r ? ++n : --n) {
                        var o = this.commits[i],
                            u = this.offsetX + o.time * this.nameLineHeight,
                            l = this.offsetY + this.graphTopOffset + o.space * this.nameLineHeight;
                        if (e > u - 5 && u + 5 > e && t > l - 5 && l + 5 > t) return o
                    }
                    return null
                }, e.prototype.hotLoadCommits = function() {
                    var e = void 0,
                        t = 200;
                    if (e = parseInt((-this.offsetX + this.graphMidpoint) / this.nameLineHeight), 0 > e && (e = 0), e > this.commits.length - 1 && (e = this.commits.length - 1), !(this.lastHotLoadCenterIndex && Math.abs(this.lastHotLoadCenterIndex - e) < 10)) {
                        this.lastHotLoadCenterIndex = e;
                        var n = this.backSpan(e, t),
                            i = this.frontSpan(e, t);
                        if (n || i) {
                            var r = n ? n[0] : i[0],
                                a = i ? i[1] : n[1];
                            return this.requestChunk(r, a)
                        }
                    }
                }, e.prototype.backSpan = function(e, t) {
                    var n = void 0,
                        i = void 0,
                        r = void 0,
                        a = void 0,
                        s = void 0,
                        o = void 0,
                        u = void 0,
                        l = void 0;
                    for (a = null, i = n = u = e;
                        (0 >= u ? 0 >= n : n >= 0) && i > e - t; i = 0 >= u ? ++n : --n)
                        if (!this.commits[i].requested) {
                            a = i;
                            break
                        }
                    if (null !== a) {
                        for (s = null, o = null, i = r = l = a;
                            (0 >= l ? 0 >= r : r >= 0) && i > a - t; i = 0 >= l ? ++r : --r)
                            if (this.commits[i].requested) {
                                s = i;
                                break
                            }
                        return s ? o = s + 1 : (o = a - t, 0 > o && (o = 0)), [o, a]
                    }
                    return null
                }, e.prototype.frontSpan = function(e, t) {
                    var n = void 0,
                        i = void 0,
                        r = void 0,
                        a = void 0,
                        s = void 0,
                        o = void 0,
                        u = void 0,
                        l = void 0,
                        c = void 0,
                        d = void 0;
                    for (l = null, i = n = a = e, s = this.commits.length;
                        (s >= a ? s > n : n > s) && e + t > i; i = s >= a ? ++n : --n)
                        if (!this.commits[i].requested) {
                            l = i;
                            break
                        }
                    if (null !== l) {
                        for (c = null, d = null, i = r = o = l, u = this.commits.length;
                            (u >= o ? u > r : r > u) && l + t > i; i = u >= o ? ++r : --r)
                            if (this.commits[i].requested) {
                                c = i;
                                break
                            }
                        return d = c ? c - 1 : l + t >= this.commits.length ? this.commits.length - 1 : l + t, [l, d]
                    }
                    return null
                }, e.prototype.chunkUrl = function() {
                    return s["default"](document.querySelector(".js-network-graph-container"), HTMLElement).getAttribute("data-network-graph-chunk-url")
                }, e.prototype.requestInitialChunk = function() {
                    if (m) {
                        var e = o["default"].param({
                                nethash: this.nethash
                            }),
                            t = this.chunkUrl() + "?" + e;
                        return n.fetchJSON(t).then(function(e) {
                            return function(t) {
                                return e.importChunk(t), e.draw(), e.network.chrome.draw()
                            }
                        }(this))
                    }
                }, e.prototype.requestChunk = function(e, t) {
                    var i = void 0,
                        r = void 0,
                        a = void 0,
                        s = void 0;
                    if (m) {
                        for (r = i = a = e, s = t; s >= a ? s >= i : i >= s; r = s >= a ? ++i : --i) this.commits[r].requested = new Date;
                        var u = this.chunkUrl() + "?" + o["default"].param({
                            nethash: this.nethash,
                            start: e,
                            end: t
                        });
                        return n.fetchJSON(u).then(function(e) {
                            return function(t) {
                                return e.importChunk(t), e.draw(), e.network.chrome.draw(), e.lastHotLoadCenterIndex = e.focus
                            }
                        }(this))
                    }
                }, e.prototype.importChunk = function(e) {
                    var t = this,
                        n = void 0,
                        i = void 0,
                        r = void 0,
                        a = void 0;
                    if (e.commits) {
                        var s = e.commits,
                            o = [],
                            u = function() {
                                var e = s[n],
                                    r = t.spaceUserMap[e.space],
                                    u = t.commits[e.time];
                                u.populate(e, r, t.commits), o.push(function() {
                                    var e = void 0,
                                        t = void 0,
                                        n = u.parents,
                                        r = [];
                                    for (e = 0, t = n.length; t > e; e++) a = n[e], r.push(function() {
                                        var e = void 0,
                                            t = void 0,
                                            n = void 0,
                                            r = [];
                                        for (i = e = t = a.time + 1, n = u.time; n >= t ? n > e : e > n; i = n >= t ? ++e : --e) this.connectionMap[i] = this.connectionMap[i] || [], r.push(this.connectionMap[i].push(u));
                                        return r
                                    }.call(this));
                                    return r
                                }.call(t))
                            };
                        for (n = 0, r = s.length; r > n; n++) u();
                        return o
                    }
                }, e.prototype.timeWindow = function() {
                    var e = void 0,
                        t = void 0;
                    return t = parseInt((this.namesWidth - this.offsetX + this.nameLineHeight) / this.nameLineHeight), 0 > t && (t = 0), e = t + parseInt((this.width - this.namesWidth) / this.nameLineHeight), e > this.commits.length - 1 && (e = this.commits.length - 1), {
                        min: t,
                        max: e
                    }
                }, e.prototype.draw = function() {
                    var e = void 0,
                        t = void 0,
                        n = void 0,
                        i = void 0,
                        r = void 0,
                        a = void 0,
                        s = void 0,
                        o = void 0,
                        u = void 0,
                        l = void 0,
                        c = void 0,
                        d = void 0,
                        f = void 0,
                        h = void 0,
                        m = void 0,
                        v = void 0,
                        p = void 0,
                        g = void 0,
                        b = void 0,
                        y = void 0,
                        j = void 0,
                        w = void 0,
                        x = void 0,
                        S = void 0;
                    this.drawBackground();
                    var k = this.timeWindow(),
                        L = k.min,
                        _ = k.max;
                    this.ctx.save(), this.ctx.translate(this.offsetX, this.offsetY + this.graphTopOffset);
                    var E = {},
                        C = this.spaceMap;
                    for (n = t = 0, a = C.length; a > t; n = ++t)
                        for (x = this.spaceMap.length - n - 1, i = r = v = L, p = _; p >= v ? p >= r : r >= p; i = p >= v ? ++r : --r) e = this.commits[i], e.populated && e.space === x && (this.drawConnection(e), E[e.id] = !0);
                    for (n = l = g = L, b = _; b >= g ? b >= l : l >= b; n = b >= g ? ++l : --l) {
                        var q = this.connectionMap[n];
                        if (q)
                            for (c = 0, s = q.length; s > c; c++) e = q[c], E[e.id] || (this.drawConnection(e), E[e.id] = !0)
                    }
                    var T = this.spaceMap;
                    for (n = d = 0, o = T.length; o > d; n = ++d)
                        for (x = this.spaceMap.length - n - 1, i = f = y = L, j = _; j >= y ? j >= f : f >= j; i = j >= y ? ++f : --f) e = this.commits[i], e.populated && e.space === x && (e === this.activeCommit ? this.drawActiveCommit(e) : this.drawCommit(e));
                    if (this.showRefs)
                        for (i = h = w = L, m = _; m >= w ? m >= h : h >= m; i = m >= w ? ++h : --h)
                            if (e = this.commits[i], e.populated) {
                                var A = this.headsMap[e.id];
                                if (A) {
                                    var M = 0;
                                    for (S = 0, u = A.length; u > S; S++) {
                                        var H = A[S];
                                        if (this.spaceUserMap[e.space].name === H.name) {
                                            var I = this.drawHead(e, H.head, M);
                                            M += I
                                        }
                                    }
                                }
                            }
                    return this.ctx.restore(), this.activeCommit ? this.drawCommitInfo(this.activeCommit) : void 0
                }, e.prototype.drawBackground = function() {
                    var e = void 0,
                        t = void 0,
                        n = void 0;
                    this.ctx.clearRect(0, 0, this.width, this.height), this.ctx.save(), this.ctx.translate(0, this.offsetY + this.graphTopOffset), this.ctx.clearRect(0, -10, this.width, this.height);
                    var i = this.userBlocks;
                    for (t = e = 0, n = i.length; n > e; t = ++e) {
                        var r = i[t];
                        this.ctx.fillStyle = this.bgColors[t % 2], this.ctx.fillRect(0, r.start * this.nameLineHeight - 10, this.width, r.count * this.nameLineHeight), this.ctx.fillStyle = "#DDDDDD", this.ctx.fillRect(0, (r.start + r.count) * this.nameLineHeight - 11, this.width, 1)
                    }
                    return this.ctx.restore()
                }, e.prototype.drawCommit = function(e) {
                    var t = e.time * this.nameLineHeight,
                        n = e.space * this.nameLineHeight;
                    return this.ctx.beginPath(), this.ctx.arc(t, n, 3, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(e.space), this.ctx.fill()
                }, e.prototype.drawActiveCommit = function(e) {
                    var t = e.time * this.nameLineHeight,
                        n = e.space * this.nameLineHeight;
                    return this.ctx.beginPath(), this.ctx.arc(t, n, 6, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(e.space), this.ctx.fill()
                }, e.prototype.drawCommitInfo = function(e) {
                    var t = void 0,
                        n = void 0,
                        i = void 0,
                        r = 3,
                        a = 340,
                        s = 56,
                        o = e.message ? this.splitLines(e.message, 48) : [],
                        u = Math.max(s, 38 + 16 * o.length),
                        l = this.offsetX + e.time * this.nameLineHeight,
                        c = this.graphTopOffset + this.offsetY + e.space * this.nameLineHeight;
                    return n = 0, i = 0, n = l < this.graphMidpoint ? l + 10 : l - (a + 10), i = c < 40 + (this.height - 40) / 2 ? c + 10 : c - u - 10, this.ctx.save(), this.ctx.translate(n, i), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.2)", this.ctx.lineWidth = 1, this.roundRect(0, 0, a, u, r), t = this.gravatars[e.gravatar], t ? this.drawGravatar(t, 10, 10) : (t = new Image, t.src = e.gravatar, t.onload = function(r) {
                        return function() {
                            return r.activeCommit === e ? (r.drawGravatar(t, n + 10, i + 10), r.gravatars[e.gravatar] = t) : void 0
                        }
                    }(this)), this.ctx.fillStyle = "#000", this.ctx.font = "bold 12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillText(e.author, 55, 24), this.ctx.fillStyle = "#bbb", this.ctx.font = "11px Consolas, Menlo, Courier, monospace", this.ctx.fillText(e.id.slice(0, 7), 280, 24), this.drawMessage(o, 55, 41), this.ctx.restore()
                }, e.prototype.drawGravatar = function(e, t, n) {
                    var i = 32;
                    return this.ctx.save(), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.0)", this.ctx.lineWidth = .1, this.roundRect(t + 2, n + 2, i, i, 4), this.ctx.clip(), this.ctx.drawImage(e, t + 2, n + 2, i, i), this.ctx.restore()
                }, e.prototype.roundRect = function(e, t, n, i, r) {
                    return this.ctx.beginPath(), this.ctx.moveTo(e, t + r), this.ctx.lineTo(e, t + i - r), this.ctx.quadraticCurveTo(e, t + i, e + r, t + i), this.ctx.lineTo(e + n - r, t + i), this.ctx.quadraticCurveTo(e + n, t + i, e + n, t + i - r), this.ctx.lineTo(e + n, t + r), this.ctx.quadraticCurveTo(e + n, t, e + n - r, t), this.ctx.lineTo(e + r, t), this.ctx.quadraticCurveTo(e, t, e, t + r), this.ctx.fill(), this.ctx.stroke()
                }, e.prototype.drawMessage = function(e, t, n) {
                    var i = void 0,
                        r = void 0,
                        a = void 0;
                    this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#000000";
                    var s = [];
                    for (r = i = 0, a = e.length; a > i; r = ++i) {
                        var o = e[r];
                        s.push(this.ctx.fillText(o, t, n + 16 * r))
                    }
                    return s
                }, e.prototype.splitLines = function(e, t) {
                    var n = void 0,
                        i = void 0,
                        r = void 0,
                        a = e.split(" "),
                        s = [];
                    for (r = "", n = 0, i = a.length; i > n; n++) {
                        var o = a[n];
                        r.length + 1 + o.length < t ? r = "" === r ? o : r + " " + o : (s.push(r), r = o)
                    }
                    return s.push(r), s
                }, e.prototype.drawHead = function(e, t, n) {
                    this.ctx.font = "11px 'Helvetica Neue', Arial, sans-serif", this.ctx.save();
                    var i = this.ctx.measureText(t.name).width;
                    this.ctx.restore();
                    var r = e.time * this.nameLineHeight,
                        a = e.space * this.nameLineHeight + 5 + n,
                        s = 2.5;
                    return this.ctx.save(), this.ctx.translate(r, a - s), this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)", this.ctx.beginPath(), this.ctx.moveTo(0, s), this.ctx.lineTo(-4, 10), this.ctx.quadraticCurveTo(-9, 10, -9, 15), this.ctx.lineTo(-9, 15 + i), this.ctx.quadraticCurveTo(-9, 15 + i + 5, -4, 15 + i + 5), this.ctx.lineTo(4, 15 + i + 5), this.ctx.quadraticCurveTo(9, 15 + i + 5, 9, 15 + i), this.ctx.lineTo(9, 15), this.ctx.quadraticCurveTo(9, 10, 4, 10), this.ctx.lineTo(0, s), this.ctx.fill(), this.ctx.fillStyle = "#fff", this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.textBaseline = "middle", this.ctx.scale(.85, .85), this.ctx.rotate(Math.PI / 2), this.ctx.fillText(t.name, 19, -.5), this.ctx.restore(), i + this.nameLineHeight
                }, e.prototype.drawConnection = function(e) {
                    var t = void 0,
                        n = void 0,
                        i = void 0,
                        r = e.parents,
                        a = [];
                    for (n = t = 0, i = r.length; i > t; n = ++t) {
                        var s = r[n];
                        0 === n ? s.space === e.space ? a.push(this.drawBasicConnection(s, e)) : a.push(this.drawBranchConnection(s, e)) : a.push(this.drawMergeConnection(s, e))
                    }
                    return a
                }, e.prototype.drawBasicConnection = function(e, t) {
                    var n = this.spaceColor(t.space);
                    return this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(e.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.stroke()
                }, e.prototype.drawBranchConnection = function(e, t) {
                    var n = this.spaceColor(t.space);
                    return this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight - 10, t.space * this.nameLineHeight), this.ctx.stroke(), this.threeClockArrow(n, t.time * this.nameLineHeight, t.space * this.nameLineHeight)
                }, e.prototype.drawMergeConnection = function(e, t) {
                    var n = void 0,
                        i = this.spaceColor(e.space);
                    if (this.ctx.strokeStyle = i, this.ctx.lineWidth = 2, this.ctx.beginPath(), e.space > t.space) {
                        this.ctx.moveTo(e.time * this.nameLineHeight, e.space * this.nameLineHeight);
                        var r = this.safePath(e.time, t.time, e.space);
                        return r ? (this.ctx.lineTo(t.time * this.nameLineHeight - 10, e.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight - 10, t.space * this.nameLineHeight + 15), this.ctx.lineTo(t.time * this.nameLineHeight - 5.7, t.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(i, t.time * this.nameLineHeight, t.space * this.nameLineHeight)) : (n = this.closestMargin(e.time, t.time, e.space, -1), e.space === t.space + 1 && e.space === n + 1 ? (this.ctx.lineTo(e.time * this.nameLineHeight, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 15, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 9.5, n * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(i, t.time * this.nameLineHeight, n * this.nameLineHeight), this.addMargin(e.time, t.time, n)) : e.time + 1 === t.time ? (n = this.closestMargin(e.time, t.time, t.space, 0), this.ctx.lineTo(e.time * this.nameLineHeight, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 15, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 15, t.space * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 9.5, t.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(i, t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.addMargin(e.time, t.time, n)) : (this.ctx.lineTo(e.time * this.nameLineHeight + 10, e.space * this.nameLineHeight - 10), this.ctx.lineTo(e.time * this.nameLineHeight + 10, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 10, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 10, t.space * this.nameLineHeight + 15), this.ctx.lineTo(t.time * this.nameLineHeight - 5.7, t.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(i, t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.addMargin(e.time, t.time, n)))
                    }
                    return n = this.closestMargin(e.time, t.time, t.space, -1), n < t.space ? (this.ctx.moveTo(e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 12.7, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 12.7, t.space * this.nameLineHeight - 10), this.ctx.lineTo(t.time * this.nameLineHeight - 9.4, t.space * this.nameLineHeight - 7.7), this.ctx.stroke(), this.fourClockArrow(i, t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.addMargin(e.time, t.time, n)) : (this.ctx.moveTo(e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 12.7, n * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 12.7, t.space * this.nameLineHeight + 10), this.ctx.lineTo(t.time * this.nameLineHeight - 9.4, t.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(i, t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.addMargin(e.time, t.time, n))
                }, e.prototype.addMargin = function(e, t, n) {
                    return this.marginMap[n] || (this.marginMap[n] = []), this.marginMap[n].push([e, t])
                }, e.prototype.oneClockArrow = function(e, t, n) {
                    return this.ctx.fillStyle = e, this.ctx.beginPath(), this.ctx.moveTo(t - 3, n + 10.5), this.ctx.lineTo(t - 9, n + 5.5), this.ctx.lineTo(t - 2.6, n + 3.5), this.ctx.fill()
                }, e.prototype.twoClockArrow = function(e, t, n) {
                    return this.ctx.fillStyle = e, this.ctx.beginPath(), this.ctx.moveTo(t - 12.4, n + 6.6), this.ctx.lineTo(t - 9.3, n + 10.6), this.ctx.lineTo(t - 3.2, n + 2.4), this.ctx.fill()
                }, e.prototype.threeClockArrow = function(e, t, n) {
                    return this.ctx.fillStyle = e, this.ctx.beginPath(), this.ctx.moveTo(t - 10, n - 3.5), this.ctx.lineTo(t - 10, n + 3.5), this.ctx.lineTo(t - 4, n), this.ctx.fill()
                }, e.prototype.fourClockArrow = function(e, t, n) {
                    return this.ctx.fillStyle = e, this.ctx.beginPath(), this.ctx.moveTo(t - 12.4, n - 6.6), this.ctx.lineTo(t - 9.3, n - 10.6), this.ctx.lineTo(t - 3.2, n - 2.4), this.ctx.fill()
                }, e.prototype.safePath = function(e, t, n) {
                    var i = void 0,
                        r = void 0,
                        a = this.spaceMap[n];
                    for (i = 0, r = a.length; r > i; i++) {
                        var s = a[i];
                        if (this.timeInPath(e, s)) return s[1] === t
                    }
                    return !1
                }, e.prototype.closestMargin = function(e, t, n, i) {
                    var r = void 0,
                        a = void 0,
                        s = void 0,
                        o = void 0,
                        u = this.spaceMap.length;
                    for (s = i, a = !1, r = !1, o = !1; !r || !a;) {
                        if (n + s >= 0 && this.safeMargin(e, t, n + s)) return n + s;
                        0 > n + s && (a = !0), n + s > u && (r = !0), o === !1 && 0 === s ? (s = -1, o = !0) : s = 0 > s ? -s - 1 : -s - 2
                    }
                    return n > 0 ? n - 1 : 0
                }, e.prototype.safeMargin = function(e, t, n) {
                    var i = void 0,
                        r = void 0;
                    if (!this.marginMap[n]) return !0;
                    var a = this.marginMap[n];
                    for (i = 0, r = a.length; r > i; i++) {
                        var s = a[i];
                        if (this.pathsCollide([e, t], s)) return !1
                    }
                    return !0
                }, e.prototype.pathsCollide = function(e, t) {
                    return this.timeWithinPath(e[0], t) || this.timeWithinPath(e[1], t) || this.timeWithinPath(t[0], e) || this.timeWithinPath(t[1], e)
                }, e.prototype.timeInPath = function(e, t) {
                    return e >= t[0] && e <= t[1]
                }, e.prototype.timeWithinPath = function(e, t) {
                    return e > t[0] && e < t[1]
                }, e.prototype.spaceColor = function(e) {
                    return 0 === e ? "#000000" : this.spaceColors[e % this.spaceColors.length]
                }, e
            }(),
            f = function() {
                function e(e, t, n) {
                    this.chrome = t, this.graph = n, this.out = a(this.out, this), this.move = a(this.move, this), this.docmove = a(this.docmove, this), this.down = a(this.down, this), this.up = a(this.up, this), this.dragging = !1, this.lastPoint = {
                        x: 0,
                        y: 0
                    }, this.lastHoverCommit = null, this.lastHoverUser = null, this.pressedCommit = null, this.pressedUser = null, this.canvas = e.getElementsByTagName("canvas")[0], this.canvasOffset = o["default"](this.canvas).offset(), this.canvas.style.cursor = "move", document.body.addEventListener("mouseup", this.up), document.body.addEventListener("mousemove", this.docmove), this.canvas.addEventListener("mousedown", this.down), this.canvas.addEventListener("mousemove", this.move), this.canvas.addEventListener("mouseout", this.out)
                }
                return e.prototype.up = function() {
                    return this.dragging = !1, this.pressedCommit && this.graph.activeCommit === this.pressedCommit ? window.open("/" + this.graph.activeCommit.user.name + "/" + this.graph.activeCommit.user.repo + "/commit/" + this.graph.activeCommit.id) : this.pressedUser && this.chrome.activeUser === this.pressedUser && (window.location = "/" + this.chrome.activeUser.name + "/" + this.chrome.activeUser.repo + "/network"), this.pressedCommit = null, this.pressedUser = null
                }, e.prototype.down = function() {
                    return this.graph.activeCommit ? this.pressedCommit = this.graph.activeCommit : this.chrome.activeUser ? this.pressedUser = this.chrome.activeUser : this.dragging = !0
                }, e.prototype.docmove = function(e) {
                    var t = e.pageX,
                        n = e.pageY;
                    return this.dragging && (this.graph.moveX(t - this.lastPoint.x), this.graph.moveY(n - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(t - this.lastPoint.x), this.chrome.moveY(n - this.lastPoint.y), this.chrome.draw()), this.lastPoint.x = t, this.lastPoint.y = n
                }, e.prototype.move = function(e) {
                    var t = e.pageX,
                        n = e.pageY;
                    if (this.dragging) this.graph.moveX(t - this.lastPoint.x), this.graph.moveY(n - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(t - this.lastPoint.x), this.chrome.moveY(n - this.lastPoint.y), this.chrome.draw();
                    else {
                        var i = this.chrome.hover(t - this.canvasOffset.left, n - this.canvasOffset.top);
                        if (i !== this.lastHoverUser) this.canvas.style.cursor = i ? "pointer" : "move", this.chrome.activeUser = i, this.chrome.draw(), this.lastHoverUser = i;
                        else {
                            var r = this.graph.hover(t - this.canvasOffset.left, n - this.canvasOffset.top);
                            r !== this.lastHoverCommit && (this.canvas.style.cursor = r ? "pointer" : "move", this.graph.activeCommit = r, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = r)
                        }
                    }
                    return this.lastPoint.x = t, this.lastPoint.y = n
                }, e.prototype.out = function() {
                    return this.graph.activeCommit = null, this.chrome.activeUser = null, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = null, this.lastHoverUser = null
                }, e
            }(),
            h = function() {
                function e(e, t) {
                    this.chrome = e, this.graph = t, this.down = a(this.down, this), this.dirty = !1, document.addEventListener("keydown", this.down)
                }
                return e.prototype.moveBothX = function(e) {
                    return this.graph.moveX(e), this.chrome.moveX(e), this.graph.activeCommit = null, this.dirty = !0
                }, e.prototype.moveBothY = function(e) {
                    return this.graph.moveY(e), this.chrome.moveY(e), this.graph.activeCommit = null, this.dirty = !0
                }, e.prototype.toggleRefs = function() {
                    return this.graph.toggleRefs(), this.dirty = !0
                }, e.prototype.redraw = function() {
                    return this.dirty && (this.graph.draw(), this.chrome.draw()), this.dirty = !1
                }, e.prototype.down = function(e) {
                    if (o["default"](e.target).is("input")) return !0;
                    if (e.shiftKey) switch (e.which) {
                        case 37:
                        case 72:
                            return this.moveBothX(999999), this.redraw();
                        case 38:
                        case 75:
                            return this.moveBothY(999999), this.redraw();
                        case 39:
                        case 76:
                            return this.moveBothX(-999999), this.redraw();
                        case 40:
                        case 74:
                            return this.moveBothY(-999999), this.redraw()
                    } else switch (e.which) {
                        case 37:
                        case 72:
                            return this.moveBothX(100), this.redraw();
                        case 38:
                        case 75:
                            return this.moveBothY(30), this.redraw();
                        case 39:
                        case 76:
                            return this.moveBothX(-100), this.redraw();
                        case 40:
                        case 74:
                            return this.moveBothY(-30), this.redraw();
                        case 84:
                            return this.toggleRefs(), this.redraw()
                    }
                }, e
            }(),
            m = !1;
        t.observe(".js-network-graph-container", {
            add: function() {
                return m = !0, new u(this, 980, 600)
            },
            remove: function() {
                return m = !1
            }
        })
    }), define("github/legacy/pages/account_membership", ["../../observe", "../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            var e = r["default"](this),
                t = e.find(":selected");
            t.attr("data-already-member") ? (r["default"](".js-account-membership-form").addClass("is-member"), r["default"](".js-account-membership-form").removeClass("is-not-member")) : (r["default"](".js-account-membership-form").removeClass("is-member"), r["default"](".js-account-membership-form").addClass("is-not-member"))
        }
        var r = n(t);
        e.observe(".js-account-membership", i), r["default"](document).on("change", ".js-account-membership", i)
    }), define("github/legacy/pages/audit_log", ["../../form", "../../jquery", "../../fetch"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            return l["default"](".js-audit-log-export-button").removeClass("disabled")
        }

        function a() {
            return l["default"](".js-audit-log-export-button").addClass("disabled")
        }

        function s() {
            function e() {
                var e = f.slice(0, h).join("");
                return t.text("Exporting" + e), h >= 3 ? h = 0 : h += 1
            }
            var t = l["default"](".js-audit-log-export-status");
            return t.data("oldText", t.text()), c = setInterval(e, d), a()
        }

        function o() {
            r();
            var e = l["default"](".js-audit-log-export-status");
            return e.text(e.data("oldText")), clearInterval(c), h = 0
        }

        function u() {
            return o(), l["default"]("#ajax-error-message").show(function() {
                return this.classList.add("visible")
            })
        }
        var l = i(t),
            c = null,
            d = 300,
            f = [".", ".", "."],
            h = 0;
        l["default"](document).on("ajaxSend", ".js-audit-log-export", s), l["default"](document).on("ajaxError", ".js-audit-log-export", u), l["default"](document).on("ajaxSuccess", ".js-audit-log-export", function(e, t, i, r) {
            function a() {
                return o(), window.location = r.export_url
            }
            return n.fetchPoll(r.job_url).then(a, u)
        }), l["default"](document).on("navigation:open", ".audit-search-form .js-suggester", function() {
            e.submit(this.closest("form"))
        })
    }), define("github/legacy/pages/billing_settings/coupon_redemption", ["../../../observe", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            if (e.length) {
                var t = e.attr("data-login"),
                    n = e.attr("data-plan");
                a["default"](".js-account-row, .js-choose-account").removeClass("selected"), e.addClass("selected"), e.find(".js-choose-account").addClass("selected"), a["default"](".js-account").val(t), a["default"](".js-plan-section").removeClass("d-none"), a["default"](".js-billing-plans").addClass("d-none");
                var i = a["default"](".js-billing-plans[data-login='" + t + "']");
                i.removeClass("d-none");
                var s = a["default"](".js-plan-row", i);
                return r(1 === s.length ? s : a["default"]("[data-name='" + n + "']", i))
            }
        }

        function r(e) {
            if (e.length) {
                var t = e.attr("data-name"),
                    n = parseInt(e.attr("data-cost"), 10),
                    i = e.closest(".js-billing-plans"),
                    r = "true" === i.attr("data-has-billing"),
                    s = i.attr("data-login");
                return a["default"](".js-plan-row, .js-choose-plan").removeClass("selected"), e.addClass("selected"), e.find(".js-choose-plan").addClass("selected"), e.find(".js-choose-plan-radio").prop("checked", !0), a["default"](".js-plan").val(t), 0 === n || r ? a["default"](".js-billing-section").addClass("has-removed-contents") : a["default"](".js-billing-section[data-login='" + s + "']").removeClass("has-removed-contents")
            }
        }
        var a = n(t);
        a["default"](document).on("submit", ".js-find-coupon-form", function(e) {
            var t = e.target.action,
                n = a["default"]("#code").val();
            return window.location = t + "/" + encodeURIComponent(n), e.stopPropagation(), e.preventDefault()
        }), a["default"](document).on("click", ".js-choose-account", function(e) {
            return a["default"](".js-plan-row, .js-choose-plan").removeClass("selected"), a["default"](".js-plan").val(""), a["default"](".js-billing-section").addClass("has-removed-contents"), i(a["default"](this).closest(".js-account-row")), e.stopPropagation(), e.preventDefault()
        }), a["default"](document).on("click", ".js-choose-plan", function(e) {
            return r(a["default"](this).closest(".js-plan-row")), e.stopPropagation(), e.preventDefault()
        }), e.observe(".js-choose-plan-radio:checked", {
            add: function() {
                r(a["default"](this).closest(".js-plan-row"))
            }
        }), e.observe(".js-plan-row.selected", {
            add: function() {
                return a["default"](this).closest("form").find(".js-redeem-button").prop("disabled", a["default"](this).hasClass("free-plan"))
            }
        }), a["default"](function() {
            return i(a["default"](".js-account-row.selected")), r(a["default"](".js-plan-row.selected"))
        })
    }), define("github/legacy/pages/billing_settings/survey", ["../../../html-validation", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("change", ".js-survey-select", function() {
            var e = i["default"](this)[0],
                t = i["default"](this).closest(".js-survey-question-form"),
                n = t.find(".js-survey-other-text"),
                r = e.options[e.selectedIndex];
            return r.classList.contains("js-survey-option-other") ? (t.addClass("is-other-selected"), n.attr("required", "required"), n.focus()) : (n.removeAttr("required"), t.removeClass("is-other-selected"))
        }), i["default"](document).on("change", ".js-survey-radio", function() {
            var t = i["default"](this)[0],
                n = i["default"](this).closest(".js-survey-question-form"),
                r = n.find(".js-survey-other-text");
            t.classList.contains("js-survey-radio-other") ? (n.addClass("is-other-selected"), r.attr("required", "required"), r.focus()) : (r.removeAttr("required"), n.removeClass("is-other-selected")), e.revalidate(this)
        })
    }), define("github/blob-anchor", ["exports"], function(e) {
        function t(e) {
            var t = e.match(/\#?(?:L)(\d+)/g);
            return t ? t.map(function(e) {
                return parseInt(e.replace(/\D/g, ""))
            }) : []
        }

        function n(e) {
            var t = e.match(/(file-.+?-)L\d+?/i);
            return t ? t[1] : ""
        }

        function i(e) {
            var i = t(e),
                r = n(e);
            return {
                lineRange: i,
                anchorPrefix: r
            }
        }

        function r(e) {
            var t = e.lineRange,
                n = e.anchorPrefix;
            switch (t.sort(a), t.length) {
                case 1:
                    return "#" + n + "L" + t[0];
                case 2:
                    return "#" + n + "L" + t[0] + "-L" + t[1];
                default:
                    return "#"
            }
        }

        function a(e, t) {
            return e - t
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.parseLineRange = t, e.parseFileAnchor = i, e.formatLineRange = r
    }), define("github/legacy/pages/blob", ["delegated-events", "../../blob-anchor", "../../jquery", "../../hash-change"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            var t = void 0,
                n = void 0;
            n = e.lineRange, t = e.anchorPrefix;
            var i = l["default"](".js-file-line");
            if (i.length) {
                if (i.css("background-color", ""), 1 === n.length) return l["default"]("#" + t + "LC" + n[0]).css("background-color", "#f8eec7");
                if (n.length > 1) {
                    for (var r = n[0], a = []; r <= n[1];) l["default"]("#" + t + "LC" + r).css("background-color", "#f8eec7"), a.push(r++);
                    return a
                }
            }
        }

        function s(e) {
            var n = void 0,
                i = void 0,
                r = void 0;
            return null == e && (e = t.parseFileAnchor(window.location.hash)), r = e.lineRange, n = e.anchorPrefix, a(e), !d && (i = l["default"]("#" + n + "LC" + r[0])).length && l["default"](window).scrollTop(i.offset().top - .33 * l["default"](window).height()), d = !1
        }

        function o(e, t) {
            var n = void 0,
                i = void 0,
                r = "FORM" === e.nodeName ? "action" : "href";
            return n = e.getAttribute(r), (i = n.indexOf("#")) >= 0 && (n = n.substr(0, i)), n += t, e.setAttribute(r, n)
        }

        function u(e) {
            var t = void 0;
            d = !0;
            var n = null != (t = l["default"](window).scrollTop()) ? t : 0;
            return e(), l["default"](window).scrollTop(n)
        }
        var l = r(n),
            c = r(i),
            d = !1;
        c["default"](function() {
            var e = void 0,
                t = void 0;
            if (document.querySelector(".js-file-line-container")) {
                setTimeout(s, 0);
                var n = window.location.hash,
                    i = document.querySelectorAll(".js-update-url-with-hash"),
                    r = [];
                for (e = 0, t = i.length; t > e; e++) {
                    var a = i[e];
                    r.push(o(a, n))
                }
                return r
            }
        }), l["default"](document).on("mousedown", ".js-line-number", function(e) {
            var n = t.parseFileAnchor(this.id);
            if (e.shiftKey) {
                var i = t.parseLineRange(window.location.hash);
                n.lineRange.unshift(i[0])
            }
            return u(function() {
                return window.location.hash = t.formatLineRange(n)
            }), !1
        }), l["default"](document).on("submit", ".js-jump-to-line-form", function() {
            var t = this.querySelector(".js-jump-to-line-field"),
                n = t.value.replace(/[^\d\-]/g, ""),
                i = n.split("-").map(function(e) {
                    return parseInt(e, 10)
                }).filter(function(e) {
                    return e > 0
                }).sort(function(e, t) {
                    return e - t
                });
            return i.length && (window.location.hash = "L" + i.join("-L")), e.fire(document, "facebox:close"), !1
        })
    }), define("github/legacy/pages/blob/blob_edit", ["../../../form", "../../../focused", "../../../code-editor", "../../../jquery", "../../../visible", "../../../fetch", "../../../observe"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e) {
            var t = void 0,
                n = e[0],
                i = n.querySelector(".js-blob-filename");
            return i ? "." === (t = i.value) || ".." === t || ".git" === t ? !1 : /\S/.test(i.value) : !0
        }

        function l(e) {
            var t = e.querySelector(".js-blob-contents");
            return t ? "true" === t.getAttribute("data-allow-unchanged") ? !0 : g(t) : !0
        }

        function c(e) {
            var t = e.querySelector(".js-new-filename-field");
            return g(t)
        }

        function d(e) {
            e = E["default"](".js-blob-form");
            var t = e[0];
            return Array.from(e.find(".js-check-for-fork")).some(C["default"]) ? !1 : u(e) ? l(t) || c(t) : !1
        }

        function f(e) {
            var t = e.find(".js-blob-contents")[0];
            return t ? E["default"](t).attr("data-allow-unchanged") ? !0 : g(t) : !1
        }

        function h(e) {
            var t = e[0],
                n = t.querySelector(".js-blob-contents");
            return g(n) || c(t)
        }

        function m(e) {
            var t = void 0;
            return t = E["default"](e).attr("data-github-confirm-unload"), ("yes" === t || "true" === t) && (t = ""), null == t && (t = "false"), "no" === t || "false" === t ? null : function() {
                return t
            }
        }

        function v() {
            var e = E["default"](".js-blob-form");
            if (e[0]) return e.find(".js-blob-submit").prop("disabled", !d(e)), e.find(".js-blob-contents-changed").val(f(e)), q ? h(e) ? window.onbeforeunload = q : window.onbeforeunload = null : void 0
        }

        function p(e) {
            var t = void 0,
                n = void 0,
                i = e.querySelectorAll("input"),
                r = [];
            for (t = 0, n = i.length; n > t; t++) {
                var a = i[t];
                "hidden" === a.getAttribute("type") && a.getAttribute("class") && (null == a.getAttribute("data-default-value") ? r.push(a.setAttribute("data-default-value", a.value)) : r.push(void 0))
            }
            return r
        }

        function g(e) {
            return null == e ? !0 : "hidden" === e.type ? e.value !== e.getAttribute("data-default-value") : e.value !== e.defaultValue
        }

        function b(e) {
            var t = e.querySelector(".js-blob-contents"),
                n = e.querySelector(".js-new-filename-field"),
                i = e.querySelector(".js-blob-filename");
            return t && n && i && null != i.defaultValue && i.defaultValue.length ? E["default"](t).data("old-filename", n.value) : void 0
        }

        function y(e) {
            return null != e[0] && (k(e), S(e)), v()
        }

        function j(e) {
            function t() {
                e[0].focus(), e[0].setSelectionRange(0, 0)
            }
            for (var n = []; e.val().split("/").length > 1;) {
                var i = e.val(),
                    r = i.split("/"),
                    a = r[0],
                    s = r.slice(1).join("/");
                "" === a || "." === a || ".git" === a ? (e.val(s), n.push(window.setTimeout(t, 1))) : ".." === a ? n.push(L(e)) : n.push(_(e, a, s))
            }
            return n
        }

        function w(e) {
            var t = E["default"](".js-gitignore-template"),
                n = E["default"](".js-license-template");
            return /^(.+\/)?\.gitignore$/.test(e) ? t.addClass("is-visible") : /^(.+\/)?(licen[sc]e|copying)($|\.)/i.test(e) ? n.addClass("is-visible") : (t.removeClass("is-visible"), n.removeClass("is-visible"))
        }

        function x(e) {
            var t = E["default"](".js-gitignore-template"),
                n = E["default"](".js-code-of-conduct-template");
            return /^(.+\/)?\.gitignore$/.test(e) ? t.addClass("is-visible") : /^(.+\/)?(code_of_conduct)($|\.)/i.test(e) ? n.addClass("is-visible") : (t.removeClass("is-visible"), n.removeClass("is-visible"))
        }

        function S(e) {
            var t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                a = void 0,
                s = void 0,
                o = void 0,
                u = e.closest("form"),
                l = E["default"](".js-blob-contents"),
                c = u.find(".js-new-blob-commit-summary");
            r = e.val() ? "Create " + e.val() : "Create new file";
            var d = l.data("old-filename"),
                f = E["default"](".js-new-filename-field").val();
            return l.removeData("new-filename"), r = (null != d ? d.length : void 0) && f !== d && null != e[0] ? (l.data("new-filename", !0), n = g(l[0]), t = n ? "Update and rename" : "Rename", e.val().length && f.length ? (o = d.split("/"), a = f.split("/"), s = !0, i = o.length - 1, o.forEach(function(e, t) {
                return t !== i && e !== a[t] ? s = !1 : void 0
            }), o.length === a.length && s ? t + " " + o[i] + " to " + a[i] : t + " " + d + " to " + f) : t + " " + d) : (null != d ? d.length : void 0) && f === d ? "Update " + e.val() : r, c.attr("placeholder", r), E["default"](".js-commit-message-fallback").val(r)
        }

        function k(e) {
            var t = void 0,
                n = E["default"](".breadcrumb").children(".js-path-segment");
            return t = "", n.each(function() {
                var e = E["default"](this);
                return t = t + e.text() + "/"
            }), t += e.val(), E["default"](".js-new-filename-field").val(t)
        }

        function L(e, t) {
            var n = void 0;
            return null == t && (t = !1), t || e.val(e.val().replace("../", "")), n = function() {
                e[0].focus(), e[0].setSelectionRange(0, 0)
            }, 1 !== e.parent().children(".separator").length && ! function() {
                e.prev().remove();
                var i = e.prev().children().children().html();
                e.prev().remove(), t && (e.val("" + i + e.val()), n = function() {
                    t && (e[0].focus(), e[0].setSelectionRange(i.length, i.length))
                })
            }(), w(e.val()), window.setTimeout(n, 1)
        }

        function _(e, t, n) {
            function i() {
                e[0].focus(), e[0].setSelectionRange(0, 0)
            }
            var r = void 0;
            if (null == n && (n = ""), t = t.replace(/[^-.a-z_0-9 ]+/gi, "-"), t = t.replace(/^-+|-+$/g, ""), t = t.trim(), t.length > 0) {
                if (r = e.parent().children(".js-repo-root, [itemtype]").children("a").last().attr("href"), !r) {
                    var a = e.parent().children(".js-repo-root, [itemtype]").children("span").children("a").last(),
                        s = a.attr("data-branch"),
                        o = a.attr("href");
                    r = o + "/tree/" + s
                }
                var u = E["default"](".js-crumb-template").clone().removeClass("js-crumb-template");
                u.find("a[itemscope]").attr("href", r + "/" + t), u.find("span").text(t);
                var l = E["default"](".js-crumb-separator").clone().removeClass("js-crumb-separator");
                e.before(u, l)
            }
            return e.val(n), w(e.val()), x(e.val()), window.setTimeout(i, 1)
        }
        var E = o(i),
            C = o(r),
            q = null;
        s.observe(".js-blob-form", function() {
            p(this), b(this), v(), q = m(this), E["default"](this).on("submit", function() {
                return window.onbeforeunload = null
            })
        }), E["default"](document).on("change", ".js-blob-contents", function() {
            return y(E["default"](".js-blob-filename")), v()
        }), t.onFocusedInput(document, ".js-blob-filename", function() {
            return function() {
                return E["default"](".js-blob-contents").attr("data-filename", E["default"](this).val()), w(E["default"](this).val()), x(E["default"](this).val()), y(E["default"](this))
            }
        }), t.onFocusedInput(document, ".js-breadcrumb-nav", function() {
            return function() {
                return j(E["default"](this)), y(E["default"](this))
            }
        }), t.onFocusedKeydown(document, ".js-breadcrumb-nav", function() {
            return function(e) {
                return 8 === e.keyCode && 0 === this.selectionStart && 0 === this.selectionEnd && 1 !== E["default"](this).parent().children(".separator").length && (L(E["default"](this), !0), e.preventDefault()), y(E["default"](this))
            }
        }), t.onFocusedInput(document, ".js-new-blob-commit-summary", function() {
            var e = this.closest(".js-file-commit-form").querySelector(".js-too-long-error");
            return function() {
                return e.classList.toggle("d-none", this.value.length <= 50)
            }
        }), s.observe(".js-check-for-fork", function() {
            this.addEventListener("load", function() {
                return v()
            })
        }), E["default"](document).on("change", ".js-gitignore-template input[type=radio]", function() {
            var e = n.getCodeEditor(E["default"](this).closest(".js-blob-form").find(".js-code-editor")[0]);
            if (null != e) return a.fetchText(this.getAttribute("data-template-url")).then(function(t) {
                return e.setCode(t)
            })
        }), E["default"](document).on("change", ".js-license-template input[type=radio]", function() {
            var e = n.getCodeEditor(E["default"](this).closest(".js-blob-form").find(".js-code-editor")[0]),
                t = E["default"](this).attr("data-template-contents");
            return null == t || null == e ? void 0 : e.setCode(t)
        }), E["default"](document).on("change", ".js-code-of-conduct-template input[type=radio]", function() {
            var e = n.getCodeEditor(E["default"](this).closest(".js-blob-form").find(".js-code-editor")[0]),
                t = E["default"](this).attr("data-template-contents");
            return null == t || null == e ? void 0 : e.setCode(t)
        }), t.onFocusedKeydown(document, ".js-new-blob-commit-description", function() {
            return function(t) {
                return "ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? (e.submit(this.form), !1) : void 0
            }
        })
    }), define("github/legacy/pages/blob/csv", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function n(e) {
            var t = void 0,
                n = void 0;
            e = e.toLowerCase();
            var i = r["default"](".js-csv-data tbody tr"),
                a = [];
            for (t = 0, n = i.length; n > t; t++) {
                var s = i[t],
                    o = r["default"](s).text().toLowerCase(); - 1 === o.indexOf(e) ? a.push(r["default"](s).hide()) : a.push(r["default"](s).show())
            }
            return a
        }

        function i(e) {
            var t = e.target.value;
            null != t && n(t), e.preventDefault()
        }
        var r = t(e);
        r["default"](document).on("focus", ".js-csv-filter-field", function() {
            return r["default"](this).on("keyup", i)
        }), r["default"](document).on("blur", ".js-csv-filter-field", function() {
            return r["default"](this).off("keyup", i)
        })
    }), define("github/legacy/pages/codesearch/advanced_search", ["../../../focused", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            function e(e) {
                return e.Users > e.Code && e.Users > e.Repositories ? "Users" : e.Code > e.Users && e.Code > e.Repositories ? "Code" : "Repositories"
            }
            var t = void 0;
            t = [];
            var n = a["default"](".js-advanced-search-input").val(),
                i = {
                    Repositories: 0,
                    Users: 0,
                    Code: 0
                },
                s = a["default"]("input[type=text].js-advanced-search-prefix, select.js-advanced-search-prefix");
            t = r(s, function(e, t, n) {
                return "" === e ? "" : ("" !== t && i[n]++, "" !== t ? "" + e + t : void 0)
            }), a["default"].merge(t, r(a["default"]("input[type=checkbox].js-advanced-search-prefix"), function(e, t, n) {
                var r = this.checked;
                return r ? (i[n]++, "" + e + r) : void 0
            }));
            var o = a["default"].trim(t.join(" "));
            return a["default"](".js-type-value").val(e(i)), a["default"](".js-search-query").val(a["default"].trim(n + " " + o)), a["default"](".js-advanced-query").empty(), a["default"](".js-advanced-query").text("" + o), a["default"](".js-advanced-query").prepend(a["default"]("<span>").text(a["default"].trim(n)), " ")
        }

        function r(e, t) {
            return a["default"].map(e, function(e) {
                function n(e) {
                    return -1 !== e.search(/\s/g) ? '"' + e + '"' : e
                }
                var i = a["default"].trim(a["default"](e).val()),
                    r = a["default"](e).attr("data-search-prefix"),
                    s = a["default"](e).attr("data-search-type");
                return "" === r ? t.call(e, r, i, s) : -1 !== i.search(/\,/g) && "location" !== r ? i.split(/\,/).map(function(i) {
                    return t.call(e, r, n(a["default"].trim(i)), s)
                }) : t.call(e, r, n(i), s)
            })
        }
        var a = n(t);
        e.onFocusedInput(document, ".js-advanced-search-prefix", function() {
            return function() {
                return i()
            }
        }), a["default"](document).on("change", ".js-advanced-search-prefix", i), a["default"](document).on("focusin", ".js-advanced-search-input", function() {
            return a["default"](this).closest(".js-advanced-search-label").addClass("focus")
        }), a["default"](document).on("focusout", ".js-advanced-search-input", function() {
            return a["default"](this).closest(".js-advanced-search-label").removeClass("focus")
        }), a["default"](document).on("click", ".js-see-all-search-cheatsheet", function() {
            return a["default"](".js-more-cheatsheet-info").removeClass("d-none"), !1
        }), a["default"](function() {
            return a["default"](".js-advanced-search-input").length ? i() : void 0
        })
    }), define("github/legacy/pages/commits", ["../../jquery", "../../navigation", "delegated-events"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(e);
        r["default"](document).on("navigation:keyopen", ".commits-list-item", function() {
            return r["default"](this).find(".commit-title > a").first().click(), !1
        }), n.on("navigation:keydown", ".commits-list-item", function(e) {
            "c" === e.detail.hotkey && (r["default"](this).find(".commit-title > a").first().click(), e.preventDefault(), e.stopPropagation())
        }), r["default"](document).on("menu:activated", ".js-diffbar-commits-menu", function(e) {
            var n = e.target.querySelector(".in-range");
            t.focus(this, n, "instant")
        })
    }), define("github/legacy/pages/compare", ["../../form", "../../jquery", "../../hash-change", "../../visible", "delegated-events", "../../observe"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var o = s(t),
            u = s(n),
            l = s(i);
        o["default"](document).on("click", ".js-compare-tabs a", function() {
            return o["default"](this).closest(".js-compare-tabs").find("a").removeClass("selected"), o["default"](this).addClass("selected"), o["default"]("#commits_bucket, #files_bucket, #commit_comments_bucket").hide(), o["default"](this.hash).show(), !1
        }), u["default"](function() {
            return o["default"](this).closest("#files_bucket")[0] && !l["default"](this) ? o["default"]('a.tabnav-tab[href="#files_bucket"]').click() : void 0
        }), o["default"](document).on("click", ".js-toggle-range-editor-cross-repo", function() {
            return o["default"](".js-range-editor").toggleClass("is-cross-repo"), !1
        }), r.on("pjax:click", ".js-range-editor", function(e) {
            var t = e.detail.options;
            o["default"](".js-compare-pr").hasClass("open") && !t.url.match(/expand=1/) && (null == t.data && (t.data = {}), t.data.expand = "1")
        }), o["default"](document).on("navigation:open", "form.js-commitish-form", function() {
            var t = this,
                n = o["default"](t),
                i = n.find(".js-new-item-name").text(),
                r = o["default"]("<input>", {
                    type: "hidden",
                    name: "new_compare_ref",
                    value: i
                });
            n.append(r), e.submit(t)
        }), a.observe(".js-compare-pr.open", {
            add: function() {
                return document.body.classList.add("is-pr-composer-expanded")
            },
            remove: function() {
                return document.body.classList.remove("is-pr-composer-expanded")
            }
        })
    }), define("github/legacy/pages/diffs/expander", ["../../../invariant", "../../../preserve-position", "../../../jquery", "../../../hash-change", "../../../fetch", "../../../dimensions", "../../../fragment-target"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e) {
            var n = void 0;
            return n = e.getAttribute("data-url"), n += "&anchor=" + encodeURIComponent(e.hash.slice(1)), n = n.replace(/[?&]/, "?"), new Promise(function(i, a) {
                return r.fetchText(n).then(function(n) {
                    var r = d["default"](e).closest(".js-expandable-line"),
                        a = r.next(".file-diff-line");
                    return t.preservingScrollPosition(a[0], function() {
                        r.replaceWith(n)
                    }), i()
                }, a)
            })
        }

        function l(e) {
            var t = e.match(/\#(diff\-[a-f0-9]+)([L|R])(\d+)$/i);
            if (null != t && 4 === t.length) return t;
            var n = e.match(/\#(discussion\-diff\-[0-9]+)([L|R])(\d+)$/i);
            return null != n && 4 === n.length ? n : null
        }

        function c(e, t, n) {
            var i = void 0,
                r = void 0,
                a = void 0,
                s = void 0,
                o = void 0;
            n = parseInt(n, 10);
            var u = d["default"](e).find(".js-expand");
            for (r = 0, a = u.length; a > r; r++) {
                var l = u[r],
                    c = "R" === t ? "data-right-range" : "data-left-range";
                if (s = l.getAttribute(c).split("-"), o = s[0], i = s[1], parseInt(o, 10) <= n && n <= parseInt(i, 10)) return l
            }
            return null
        }
        var d = o(n),
            f = o(i);
        f["default"](function() {
            var t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                o = void 0,
                f = window.location.hash;
            if (f && (r = l(f)) && (t = r[1], o = r[2], i = r[3], !s.findElementByFragmentName(document, f.slice(1)))) {
                var h = 0,
                    m = 1;
                return (n = function() {
                    var r = void 0,
                        l = void 0;
                    return (l = d["default"](s.findElementByFragmentName(document, t)).next()[0]) && (r = c(l, o, i)) ? (d["default"](r).parents(".js-details-container").addClass("open"), u(r).then(function() {
                        var t = s.findElementByFragmentName(document, f.slice(1));
                        if (t instanceof HTMLElement) {
                            var i = a.overflowOffset(t);
                            e.invariant(null != i, "Must be able to find overflowOffset of target element");
                            var r = i.top,
                                o = i.bottom;
                            if (0 > r || 0 > o) return t.scrollIntoView()
                        } else if (m > h) return h++, n()
                    })) : void 0
                })()
            }
        }), d["default"](document).on("click", ".js-expand", function() {
            return u(this), !1
        })
    }), define("github/legacy/pages/diffs/line-comments", ["../../../form", "../../../invariant", "../../../observe", "delegated-events", "../../../focused", "../../../parse-html", "../../../jquery", "../../../hotkey"], function(e, t, n, i, r, a, s, o) {
        function u(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function l(e) {
            var t = e.closest("tr");
            return w["default"](t).next(".js-inline-comments-container")[0]
        }

        function c(e) {
            var t = e.closest("tr"),
                n = g("#js-inline-comments-single-container-template"),
                i = n.querySelector(".js-inline-comment-form");
            return i && j(i, {
                path: e.getAttribute("data-path"),
                anchor: e.getAttribute("data-anchor"),
                position: e.getAttribute("data-position"),
                line: e.getAttribute("data-line")
            }), t.after(n), n
        }

        function d(e) {
            var t = e.match(/^new_inline_comment_diff_([\w-]+)_(\d+)_(\d+)$/) || [],
                n = S(t, 3),
                i = n[1],
                r = n[2];
            if (i) {
                var a = document.querySelector(".js-inline-comment-form input[name='in_reply_to'][value='" + r + "']");
                a && h(a.closest(".js-line-comments"))
            }
        }

        function f(e) {
            var t = e.match(/^new_inline_comment_diff_([\w-]+)_(\d+)$/) || [],
                n = S(t, 3),
                i = n[1],
                r = n[2];
            if (i) {
                var a = document.querySelector(".js-add-line-comment[data-anchor='" + i + "'][data-position='" + r + "']");
                a && a.click()
            }
        }

        function h(e) {
            var t = e.querySelector(".js-inline-comment-form-container");
            t.classList.add("open"), t.querySelector(".js-write-tab").click(), t.querySelector(".js-comment-field").focus()
        }

        function m(e) {
            e.reset();
            var t = e.closest(".js-inline-comment-form-container");
            t.classList.remove("open"), p()
        }

        function v(t) {
            var n = t.querySelector(".js-toggle-file-notes");
            n && e.changeValue(n, !0)
        }

        function p() {
            for (var e = document.querySelectorAll(".file .js-inline-comments-container"), t = 0; t < e.length; t++) {
                var n = e[t],
                    i = w["default"](n).find(".js-comments-holder > *"),
                    r = i.length > 0,
                    a = w["default"](n).find(".js-inline-comment-form-container").hasClass("open");
                r || a || w["default"](n).remove()
            }
        }

        function g(e) {
            var n = document.querySelector(e);
            t.invariant(n instanceof HTMLElement, e + " must match an HTMLElement");
            var i = n.firstElementChild;
            t.invariant(null != i, "template must have a child");
            var r = i.cloneNode(!0),
                a = r.querySelector("textarea");
            return a && a instanceof HTMLTextAreaElement && (a.value = ""), r
        }

        function b(e, t, n) {
            var i = w["default"](e).find(".js-line-comments." + t)[0];
            if (i) return i;
            i = g("#js-inline-comments-split-form-container-template"), i.classList.add(t);
            var r = i.querySelector(".js-inline-comment-form");
            r && j(r, n);
            var a = w["default"](e).find("." + t);
            return a.last().after(i), a.remove(), i
        }

        function y(e) {
            var t = w["default"](e).next(".js-inline-comments-container")[0];
            return t ? t : (t = g("#js-inline-comments-split-container-template"), e.after(t), t)
        }

        function j(e, t) {
            for (var n = e.elements, i = 0; i < n.length; i++) {
                var r = n[i];
                r.name in t && (r.value = t[r.name])
            }
            var a = e.querySelector(".js-comment-field");
            a.id = a.id.replace(/^r\d+ /, "").replace("${anchor}", t.anchor).replace("${position}", t.position)
        }
        var w = u(s),
            x = u(o),
            S = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !i && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }();
        i.on("click", ".js-add-single-line-comment", function() {
            v(this.closest(".file"));
            var e = l(this) || c(this),
                t = Array.from(e.querySelectorAll(".js-line-comments")).pop();
            h(t)
        }), i.on("click", ".js-add-split-line-comment", function() {
            v(this.closest(".file"));
            var e = void 0;
            switch (this.getAttribute("data-type")) {
                case "addition":
                    e = "js-addition";
                    break;
                case "deletion":
                    e = "js-deletion"
            }
            var t = y(this.closest("tr")),
                n = b(t, e, {
                    type: this.getAttribute("data-type"),
                    anchor: this.getAttribute("data-anchor"),
                    path: this.getAttribute("data-path"),
                    position: this.getAttribute("data-position"),
                    line: this.getAttribute("data-line")
                }),
                i = Array.from(n.querySelectorAll(".js-line-comments")).pop();
            h(i)
        }), i.on("click", ".js-toggle-inline-comment-form", function() {
            h(this.closest(".js-line-comments"))
        }), i.on("quote:selection", ".js-line-comments", function() {
            h(this)
        }), r.onFocusedKeydown(document, ".js-inline-comment-form .js-comment-field", function() {
            return function(e) {
                return this.classList.contains("js-navigation-enable") ? void 0 : "esc" === x["default"](e.originalEvent) && 0 === this.value.length ? (m(this.closest(".js-inline-comment-form")), !1) : void 0
            }
        }), i.on("click", ".js-hide-inline-comment-form", function() {
            m(this.closest(".js-inline-comment-form"))
        }), w["default"](document).on("ajaxSuccess", ".js-inline-comment-form", function(e, t, n, i) {
            if (this === e.target) {
                var r = i.inline_comment;
                if (r) {
                    var s = this.closest(".js-line-comments");
                    s.querySelector(".js-comments-holder").append(a.parseHTML(document, r))
                }
                var o = i.inline_comment_thread;
                if (o) {
                    var u = this.closest(".js-line-comments");
                    u.replaceWith(a.parseHTML(document, o))
                }
                m(this)
            }
        }), w["default"](document).on("ajaxError", ".js-inline-comment-form", function(e, t) {
            if (this === e.target) {
                var n = void 0,
                    i = JSON.parse(t.responseText),
                    r = this.querySelector(".js-comment-form-error");
                n = i.errors ? Array.isArray(i.errors) ? i.errors.join(", ") : i.errors : "There was an error posting your comment.", r.textContent = n, r.style.display = "block", e.preventDefault()
            }
        }), document.addEventListener("session:resume", function(e) {
            d(e.detail.targetId), f(e.detail.targetId)
        }), n.observe(".js-comment", {
            remove: p
        })
    }), define("github/legacy/pages/diffs/line-highlight", ["../../../observe", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(t, n, i) {
            return e.observe(t, function(e) {
                function t(e) {
                    u && i(u, !1), u = a["default"](e.target).closest(n)[0], u && i(u, !0)
                }

                function r() {
                    return e.addEventListener("mouseenter", l), e.addEventListener("mouseleave", o), e.addEventListener("mouseover", t)
                }

                function s() {
                    return e.removeEventListener("mouseenter", l), e.removeEventListener("mouseleave", o), e.removeEventListener("mouseover", t)
                }
                var o = void 0,
                    u = null,
                    l = o = function() {
                        u && i(u, !1), u = null
                    };
                return {
                    add: r,
                    remove: s
                }
            })
        }

        function r(e) {
            return Math.floor(e / 2)
        }
        var a = n(t);
        i(".diff-table", "td.blob-code, td.blob-num", function(e, t) {
            var n = void 0,
                i = void 0,
                a = void 0,
                s = void 0,
                o = void 0,
                u = void 0,
                l = void 0,
                c = e.parentNode,
                d = c.children;
            if (4 === d.length)
                for (i = a = 0, o = d.length; o > a; i = ++a) n = d[i], n === e && (l = r(i));
            var f = [];
            for (i = s = 0, u = d.length; u > s; i = ++s) n = d[i], (null == l || r(i) === l) && f.push(n.classList.toggle("is-hovered", t));
            return f
        })
    }), define("github/legacy/pages/diffs/linkable-line-number", ["delegated-events", "../../../observe", "../../../hash-change"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            return Math.floor(e / 2)
        }

        function a() {
            var e = void 0,
                t = void 0,
                n = void 0,
                i = void 0,
                a = void 0,
                s = void 0,
                u = void 0,
                l = void 0;
            if (o) {
                for (n = 0, a = o.length; a > n; n++) e = o[n], e.classList.remove("selected-line");
                o = null
            }
            var c = window.location.hash.substring(1);
            c && (u = document.getElementById(c)), u && u.classList.contains("js-linkable-line-number") && ! function() {
                var n = u.parentNode,
                    a = n.children;
                if (4 === a.length)
                    for (t = i = 0, s = a.length; s > i; t = ++i) e = a[t], e === u && (l = r(t));
                o = function() {
                    var n = void 0,
                        i = void 0,
                        s = [];
                    for (t = n = 0, i = a.length; i > n; t = ++n) e = a[t], (null == l || r(t) === l) && (e.classList.toggle("selected-line"), s.push(e));
                    return s
                }()
            }()
        }
        var s = i(n);
        e.on("click", ".js-linkable-line-number", function(e) {
            window.location.hash = this.id, e.preventDefault()
        });
        var o = null;
        s["default"](a), t.observe(".blob-expanded", a), t.observe(".js-diff-progressive-loader", function(e) {
            e.addEventListener("load", a)
        }), t.observe(".js-diff-entry-loader", function(e) {
            e.addEventListener("load", a)
        })
    }), define("github/legacy/pages/diffs/prose_diff", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("click", ".js-rich-diff.collapsed .js-expandable", function(e) {
            e.preventDefault(), n["default"](e.target).closest(".js-rich-diff").removeClass("collapsed")
        }), n["default"](document).on("click", ".js-show-rich-diff", function(e) {
            e.preventDefault(), n["default"](this).closest(".js-warn-no-visible-changes").addClass("d-none").hide().siblings(".js-no-rich-changes").removeClass("d-none").show()
        })
    }), define("github/legacy/pages/diffs/split", ["../../../observe"], function(e) {
        function t() {
            var e = document.querySelector("meta[name=diff-view]"),
                t = e && e instanceof HTMLMetaElement ? e.content : "",
                n = document.querySelector(".file-diff-split"),
                i = "split" === t && n || document.querySelector(".wants-full-width-container");
            document.body.classList.toggle("full-width", i)
        }
        e.observe("meta[name=diff-view]", {
            add: t,
            remove: t
        }), e.observe(".file-diff-split", {
            add: t,
            remove: t
        }), e.observe(".js-compare-tabs .tabnav-tab.selected", {
            add: t,
            remove: t
        }), e.observe(".wants-full-width-container", {
            add: t,
            remove: t
        })
    }), define("github/legacy/pages/diffs/toggle-file-notes", ["../../../invariant", "../../../observe", "../../../form", "delegated-events"], function(e, t, n, i) {
        i.on("change", ".js-toggle-file-notes", function() {
            this.closest(".file").classList.toggle("show-inline-notes", this.checked)
        }), i.on("click", ".js-toggle-all-file-notes", function(t) {
            for (var i = document.querySelectorAll(".js-toggle-file-notes"), r = !1, a = 0; a < i.length; a++) {
                var s = i[a];
                s.checked && (r = !0)
            }
            for (var o = 0; o < i.length; o++) {
                var u = i[o];
                e.invariant(u instanceof HTMLInputElement, "Element must be an HTMLInputElement"), n.changeValue(u, !r)
            }
            t.preventDefault()
        }), t.observe(".js-inline-comments-container", function() {
            var e = void 0,
                t = this.closest(".file");
            if (t) {
                var n = e = function() {
                    var e = null != t.querySelector(".js-inline-comments-container");
                    t.classList.toggle("has-inline-notes", e)
                };
                return {
                    add: n,
                    remove: e
                }
            }
        })
    }), define("github/legacy/pages/diffs/tr-collapsing", ["../../../observe"], function(e) {
        function t(e) {
            var t = e.parentElement,
                n = t.querySelectorAll("td.js-line-comments").length,
                i = t.querySelectorAll("td.js-line-comments.is-collapsed").length;
            t.classList.toggle("is-collapsed", i > 0 && n === i)
        }
        e.observe("td.js-line-comments.is-collapsed", {
            add: function(e) {
                t(e)
            },
            remove: function(e) {
                t(e)
            }
        })
    }), define("github/legacy/pages/directory", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("focusin", ".js-url-field", function() {
            var e = this;
            return setTimeout(function() {
                return n["default"](e).select()
            }, 0)
        })
    }), define("github/legacy/pages/early_access_tracking", ["../../google-analytics", "../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        ! function() {
            document.querySelector(".js-account-membership-form") && (i["default"](document).one("change.early-access-tracking", ".js-account-membership-form", function() {
                e.trackEvent({
                    category: "Large File Storage",
                    action: "attempt",
                    label: "location: early access form"
                })
            }), i["default"](document).on("submit.early-access-tracking", ".js-account-membership-form", function() {
                e.trackEvent({
                    category: "Large File Storage",
                    action: "submit",
                    label: "location: early access form"
                })
            }))
        }()
    }), define("github/legacy/pages/edit_repositories/options", ["../../../focused", "../../../jquery", "../../../visible", "../../../fetch"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            return s["default"](Array.from(s["default"](".js-repo-toggle-team:checked")).filter(o["default"]))
        }
        var s = r(t),
            o = r(n);
        e.onFocusedInput(document, ".js-repository-name", function() {
            var e = /[^0-9A-Za-z_\-.]/g,
                t = s["default"](".js-form-note"),
                n = s["default"](".js-rename-repository-button");
            return function() {
                t.html("Will be renamed as <strong>" + this.value.replace(e, "-") + "</strong>"), e.test(this.value) ? t.show() : t.hide(), this.value && this.value !== s["default"](this).attr("data-original-name") ? n.prop("disabled", !1) : n.prop("disabled", !0)
            }
        }), s["default"](document).on("click", ".js-repo-team-suggestions-view-all", function() {
            return i.fetchText(this.href).then(function(e) {
                return function(t) {
                    var n = a().map(function() {
                            return this.value
                        }),
                        i = s["default"](e).closest("ul");
                    return i.html(t), n.each(function() {
                        return i.find(".js-repo-toggle-team[value=" + this + "]").prop("checked", !0)
                    })
                }
            }(this)), !1
        })
    }), define("github/legacy/pages/edit_repositories/repository-collabs", ["../../../jquery", "../../../typecast", "../../../observe", "../../../form"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e, t) {
            var n = t.querySelector(".js-repo-access-error");
            return n.textContent = e, n.classList.remove("d-none")
        }

        function s() {
            var e = void 0,
                t = void 0,
                n = document.querySelectorAll(".js-repo-access-error"),
                i = [];
            for (e = 0, t = n.length; t > e; e++) {
                var r = n[e];
                r.textContent = "", i.push(r.classList.add("d-none"))
            }
            return i
        }

        function o(e) {
            return e.classList.toggle("is-empty", !e.querySelector(".js-repo-access-entry"))
        }

        function u() {
            var e = document.getElementById("collaborators");
            e && (f["default"](e.querySelector(".js-add-new-collab"), HTMLButtonElement).disabled = !0, d["default"](e.querySelector(".js-add-repo-access-field")).data("autocompleted"))
        }

        function l(e) {
            var t = void 0,
                n = void 0,
                i = document.querySelector(".js-repo-access-team-select");
            if (i) {
                var r = 0,
                    a = i.querySelectorAll(".js-repo-access-team-select-option");
                for (t = 0, n = a.length; n > t; t++) {
                    var s = a[t],
                        o = s.classList;
                    e === s.getAttribute("data-team-id") && (o.add("has-access"), o.remove("selected")), o.contains("has-access") || r++
                }
                if (0 === r) return f["default"](i.closest(".js-repo-access-group"), HTMLElement).classList.add("no-form")
            }
        }

        function c(e) {
            var t = document.querySelector(".js-repo-access-team-select");
            if (t) {
                var n = t.querySelector("[data-team-id='" + e + "']");
                return n && n.classList.remove("has-access"), f["default"](t.closest(".js-repo-access-group"), HTMLElement).classList.remove("no-form")
            }
        }
        var d = r(e),
            f = r(t);
        n.observe(".js-add-new-collab", u), d["default"](document).on("autocomplete:autocompleted:changed", ".js-add-repo-access-field", function() {
            return d["default"](this).data("autocompleted") ? this.form.querySelector(".js-add-new-collab").disabled = !1 : u()
        }), d["default"](document).on("selectmenu:selected", ".js-repo-access-team-select", function() {
            var e = this.querySelector(".js-repo-access-team-select-option.selected").getAttribute("data-team-id"),
                t = this.closest(".js-repo-access-group").querySelector(".js-add-repo-access-field");
            t.value = e, i.submit(t.form)
        }), d["default"](document).on("ajaxSend", ".js-add-repo-access-form", function() {
            s()
        }), d["default"](document).on("ajaxSuccess", ".js-add-repo-access-form", function(e, t, n, i) {
            var r = void 0,
                s = this.closest(".js-repo-access-group"),
                c = this.querySelector(".js-add-repo-access-field");
            r = "teams" === s.id ? s.querySelector(".js-repo-access-list") : s.querySelector(".js-repo-access-list-invites");
            var d = c.value;
            return c.value = "", i.error ? a(i.error, s) : (u(), r.insertAdjacentHTML("beforeend", i.html), o(s), "teams" === s.id ? l(d) : void 0)
        }), d["default"](document).on("ajaxSuccess", ".js-remove-repo-access-form", function() {
            s();
            var e = this.closest(".js-repo-access-entry"),
                t = this.closest(".js-repo-access-group");
            return "teams" === t.id && c(e.getAttribute("data-team-id")), e.remove(), o(t)
        }), d["default"](document).on("ajaxError", ".js-remove-repo-access-form", function() {
            return a(this.getAttribute("data-error-message"), this.closest(".js-repo-access-group")), !1
        })
    }), define("github/legacy/pages/edit_repositories/repository-options", ["../../../invariant", "../../../fetch", "delegated-events", "../../../observe", "../../../throttled-input", "../../../jquery"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o(e) {
            var t = e.querySelector(".js-authorized-pushers"),
                n = parseInt(t.getAttribute("data-limit")),
                i = t.querySelectorAll(".js-authorized-user-or-team").length;
            t.classList.toggle("at-limit", i >= n)
        }
        var u = s(a);
        u["default"](document).on("change", ".js-default-branch", function() {
            var t = document.querySelector(".js-default-branch-confirmation");
            e.invariant(t instanceof HTMLInputElement, ".js-default-branch-confirmation must exist and be an HTMLInputElement");
            var n = document.querySelector(".js-change-default-branch-button");
            e.invariant(n instanceof HTMLButtonElement, ".js-change-default-branch-button must exist and be an HTMLButtonElement"), n.disabled = this.value === t.getAttribute("data-original-value"), t.value = this.value
        }), n.on("change", ".js-repo-features-form input[type=checkbox]", function() {
            var e = this.closest(".js-repo-option").querySelector(".js-status-indicator");
            e.classList.remove("status-indicator-success", "status-indicator-failed"), e.classList.add("status-indicator-loading")
        }), u["default"](document).on("ajaxSuccess", ".js-repo-features-form", function(e, t, n, i) {
            Array.from(this.querySelectorAll(".status-indicator-loading")).forEach(function(e) {
                e.classList.remove("status-indicator-loading"), e.classList.add("status-indicator-success")
            }), /^\s*</.test(i) && u["default"](document.querySelector(".js-repo-nav")).replaceWith(i)
        }), u["default"](document).on("ajaxError", ".js-repo-features-form", function() {
            Array.from(this.querySelectorAll(".status-indicator-loading")).forEach(function(e) {
                e.classList.remove("status-indicator-loading"), e.classList.add("status-indicator-failed");
                var t = e.closest(".js-repo-option").querySelector("input[type=checkbox]");
                t.checked = !t.checked
            })
        }), n.on("change", ".js-merge-features-form input[type=checkbox]", function() {
            Array.from(this.form.querySelectorAll(".errored")).forEach(function(e) {
                return e.classList.remove("errored")
            });
            var e = this.closest(".js-repo-option"),
                t = e.querySelector(".js-status-indicator");
            t.classList.remove("status-indicator-success", "status-indicator-failed"), t.classList.add("status-indicator-loading")
        }), u["default"](document).on("ajaxSuccess", ".js-merge-features-form", function() {
            Array.from(this.querySelectorAll(".errored")).forEach(function(e) {
                return e.classList.remove("errored")
            }), Array.from(this.querySelectorAll(".status-indicator-loading")).forEach(function(e) {
                e.classList.remove("status-indicator-loading"), e.classList.add("status-indicator-success")
            })
        }), u["default"](document).on("ajaxError", ".js-merge-features-form", function(e) {
            Array.from(this.querySelectorAll(".status-indicator-loading")).forEach(function(e) {
                e.classList.remove("status-indicator-loading"), e.classList.add("status-indicator-failed");
                var t = e.closest(".js-repo-option");
                t.classList.add("errored");
                var n = t.querySelector("input[type=checkbox]");
                n.checked = !n.checked
            }), Array.from(this.querySelectorAll(".status-indicator-success")).forEach(function(e) {
                e.classList.remove("status-indicator-success")
            }), e.preventDefault()
        }), u["default"](document).on("change", ".js-protect-branch", function() {
            var e = this.closest(".js-protected-branch-settings"),
                t = this.checked;
            Array.from(e.querySelectorAll(".js-protected-branch-options")).forEach(function(e) {
                e.classList.toggle("active", t)
            }), Array.from(e.querySelectorAll(".js-protected-branch-option")).forEach(function(e) {
                t ? e.removeAttribute("disabled") : e.setAttribute("disabled", "disabled")
            })
        }), u["default"](document).on("change", ".js-required-status-toggle", function() {
            var e = this.closest(".js-protected-branch-settings"),
                t = e.querySelector(".js-required-statuses");
            t.classList.toggle("d-none", !this.checked)
        }), u["default"](document).on("change", ".js-required-status-checkbox", function() {
            var e = this.closest(".js-protected-branches-item");
            e.querySelector(".js-required-status-badge").classList.toggle("d-none", !this.checked)
        }), u["default"](document).on("change", ".js-authorized-branch-pushers-toggle", function() {
            var e = this.closest(".js-protected-branch-settings"),
                t = e.querySelector(".js-authorized-pushers");
            t.classList.toggle("d-none", !this.checked), t.querySelector(".js-autocomplete-field").focus()
        }), u["default"](document).on("change", ".js-protected-branch-include-admin-toggle", function() {
            var e = this.closest(".js-protected-branch-settings"),
                t = e.querySelectorAll(".js-protected-branch-admin-permission");
            Array.from(t).forEach(function(e) {
                e.classList.toggle("d-none"), e.classList.toggle("active", !e.classList.contains("d-none"))
            })
        }), u["default"](document).on("autocomplete:result", ".js-add-protected-branch-user-or-team", function(e, n) {
            var i = this.closest(".js-protected-branch-options"),
                r = this.closest(".js-autocomplete-container"),
                a = new URL(r.getAttribute("data-url"), window.location.origin),
                s = new URLSearchParams(a.search.slice(1));
            s.append("item", n), a.search = s.toString();
            var u = i.querySelector(".js-authorized-users-and-teams"),
                l = u.querySelector("div[data-user-or-team-name='" + n + "']");
            l ? (r.querySelector(".js-autocomplete-field").value = "", l.querySelector(".js-protected-branch-pusher").classList.add("user-already-added")) : t.fetchText(a).then(function(e) {
                r.querySelector(".js-autocomplete-field").value = "", u.insertAdjacentHTML("beforeend", e), o(i)
            })
        }), n.on("click", ".js-remove-authorized-user-or-team", function() {
            var e = this.closest(".js-protected-branch-options");
            this.closest(".js-authorized-user-or-team").remove(), o(e)
        }), i.observe("#pages-cname-field", function() {
            r.addThrottledInputEventListener(this, function() {
                var t = document.querySelector(".js-pages-cname-save-btn");
                e.invariant(t instanceof HTMLButtonElement, ".js-pages-cname-save-btn must be a button"), t.disabled = this.value === this.defaultValue
            })
        }), u["default"](document).on("selectmenu:selected", ".js-pages-source", function() {
            var t = document.querySelector(".js-pages-source-btn-text");
            e.invariant(t instanceof HTMLElement, ".js-pages-source-btn-text must exist");
            var n = t.getAttribute("data-original-text") === t.textContent,
                i = document.querySelector(".js-pages-source-save-btn");
            e.invariant(i instanceof HTMLButtonElement, "Missing element [`.js-pages-source-save-btn`]"), i.disabled = n;
            var r = document.querySelector(".js-pages-theme-source-value");
            if (r && r instanceof HTMLInputElement) {
                var a = this.querySelector(".selected input").value,
                    s = document.querySelector(".js-pages-theme-source-note"),
                    o = document.querySelector(".js-pages-theme-source-note-value");
                if (e.invariant(s instanceof HTMLElement && o instanceof HTMLElement, ".js-pages-theme-source-note and .js-pages-theme-source-note-value must exist"), "none" === a) {
                    var u = r.getAttribute("data-original-value"),
                        l = o.getAttribute("data-original-text");
                    e.invariant(null != u && null != l, "Missing attributes [`data-original-value`, `data-original-text`]"), r.value = u, o.textContent = l, s.classList.remove("hide-note")
                } else r.value = a, o.textContent = t.textContent, n ? s.classList.add("hide-note") : s.classList.remove("hide-note")
            }
        }), i.observe(".js-enable-btn", function() {
            this.disabled = !1, this.classList.remove("tooltipped"), this.removeAttribute("aria-label")
        })
    }), define("github/legacy/pages/editors/render", ["../../../observe", "../../../code-editor", "../../../jquery", "../../../visible"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            if (null != e) {
                var t = e.data("timing");
                if (null != t) return t.load = t.hello = null, t.helloTimer && (clearTimeout(t.helloTimer), t.helloTimer = null), t.loadTimer ? (clearTimeout(t.loadTimer), t.loadTimer = null) : void 0
            }
        }

        function s(e) {
            if (!e.data("timing")) {
                var t = 10,
                    n = 45,
                    i = {
                        load: null,
                        hello: null,
                        helloTimer: null,
                        loadTimer: null
                    };
                return i.load = Date.now(), i.helloTimer = setTimeout(l(e, function() {
                    return !i.hello
                }), 1e3 * t), i.loadTimer = setTimeout(l(e), 1e3 * n), e.data("timing", i)
            }
        }

        function o(e) {
            return e.addClass("is-render-requested")
        }

        function u(e) {
            return null != e ? (e.removeClass(v), e.addClass("is-render-failed"), a(e)) : void 0
        }

        function l(e, t) {
            return null == t && (t = function() {
                    return !0
                }),
                function() {
                    var n = void 0,
                        i = function() {
                            try {
                                return Array.from(e).some(m["default"])
                            } catch (t) {
                                return Array.from(e).filter(m["default"]).length > 0
                            }
                        }();
                    return !i || e.hasClass("is-render-ready") || e.hasClass("is-render-failed") || e.hasClass("is-render-failed-fatally") || t && !t() ? void 0 : (n = e.data("timing")) ? (console.error("Render timeout: " + JSON.stringify(n) + " Now: " + Date.now()), u(e)) : console.error("No timing data on $:", e)
                }
        }

        function c(e) {
            var t = void 0,
                n = h["default"](e || this);
            (null != (t = n.data("timing")) ? t.load : 0) || (a(n), s(n), n.addClass("is-render-automatic"), o(n))
        }

        function d(e) {
            var t = ".js-render-target";
            return e ? h["default"](t + "[data-identity='" + e + "']") : h["default"](t)
        }

        function f(e, n, i, r, a) {
            var s = void 0,
                o = void 0,
                l = void 0,
                c = void 0;
            switch (r) {
                case "hello":
                    var d = e.data("timing") || {
                        untimed: !0
                    };
                    if (d.hello = Date.now(), l = {
                            type: "render:cmd",
                            body: {
                                cmd: "ack",
                                ack: !0
                            }
                        }, s = {
                            type: "render:cmd",
                            body: {
                                cmd: "branding",
                                branding: !1
                            }
                        }, c = null != (o = e.find("iframe").get(0)) ? o.contentWindow : void 0, c && "function" == typeof c.postMessage && c.postMessage(JSON.stringify(l), "*"), c && "function" == typeof c.postMessage && c.postMessage(JSON.stringify(s), "*"),
                        e.hasClass("is-local")) {
                        var f = t.getCodeEditor(e.parents(".js-code-editor")[0]);
                        return null == f ? null : (s = {
                            type: "render:data",
                            body: f.code()
                        }, c && "function" == typeof c.postMessage ? c.postMessage(JSON.stringify(s), "*") : null)
                    }
                    break;
                case "error":
                    return u(e);
                case "error:fatal":
                    return u(e), e.addClass("is-render-failed-fatal");
                case "error:invalid":
                    return u(e, "invalid"), e.addClass("is-render-failed-invalid");
                case "loading":
                    return e.removeClass(v), e.addClass("is-render-loading");
                case "loaded":
                    return e.removeClass(v), e.addClass("is-render-loaded");
                case "ready":
                    if (e.removeClass(v), e.addClass("is-render-ready"), null != a && null != a.height) return e.height(a.height);
                    break;
                case "resize":
                    return null != a && null != a.height && e.hasClass("is-render-ready") ? e.height(a.height) : console.error("Resize event sent without height or before ready");
                default:
                    return console.error("Unknown message [" + n + "]=>'" + r + "'")
            }
        }
        var h = r(n),
            m = r(i),
            v = ["is-render-pending", "is-render-ready", "is-render-loading", "is-render-loaded"].reduce(function(e, t) {
                return e + " " + t
            });
        e.observe(".js-render-target", c), h["default"](window).on("message", function(e) {
            var t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                a = void 0,
                s = void 0,
                o = void 0,
                u = void 0,
                l = void 0;
            if (o = null != (s = e.originalEvent) ? s : e, n = o.data, r = o.origin, n && r) {
                u = function() {
                    try {
                        return JSON.parse(n)
                    } catch (t) {
                        return e = t, n
                    }
                }(), l = u.type, i = u.identity, t = u.body, a = u.payload;
                var c = d(i);
                if (l && t && 1 === c.length && r === c.attr("data-host") && "render" === l) return f(c, l, i, t, a)
            }
        })
    }), define("github/legacy/pages/explore", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](function() {
            function e() {
                t.find(".selected").removeClass("selected");
                var e = t.find("input[type=radio]:enabled:checked");
                return e.closest(".newsletter-frequency-choice").addClass("selected")
            }
            var t = n["default"](".js-newsletter-frequency-choice");
            if (t.length) return t.on("change", "input[type=radio]", function() {
                return e()
            }), e()
        }), n["default"](document).on("ajaxSuccess", ".js-subscription-toggle", function() {
            var e = n["default"](this).find(".selected .notice");
            return e.addClass("visible"), setTimeout(function() {
                return e.removeClass("visible")
            }, 2e3)
        }), n["default"](document).on("ajaxSuccess", ".js-explore-newsletter-subscription-container", function(e, t) {
            return n["default"](this).replaceWith(t.responseText)
        })
    }), define("github/legacy/pages/files/ref_create", ["../../../form", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("navigation:open", ".js-create-branch", function() {
            return e.submit(this), !1
        })
    }), define("github/legacy/pages/files/repo_next", ["delegated-events"], function(e) {
        e.on("click", ".js-toggle-lang-stats", function(e) {
            var t = document.querySelector(".js-stats-switcher-viewport");
            if (null != t) {
                var n = 0 !== t.scrollTop ? "is-revealing-overview" : "is-revealing-lang-stats";
                t.classList.toggle(n), e.preventDefault()
            }
        })
    }), define("github/legacy/pages/generated_pages/theme_picker", ["../../../typecast", "../../../form", "../../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var a = i(e),
            s = i(n),
            o = function() {
                function e(e) {
                    var t = s["default"](e);
                    this.name = t.attr("data-theme-name"), this.slug = t.attr("data-theme-slug"), this.gem = t.attr("data-theme-gem"), this.selected = t.hasClass("selected"), this.baseHref = t.attr("href")
                }
                return e.prototype.wrappedKey = function(e, t) {
                    return null == t && (t = null), t ? t + "[" + e + "]" : e
                }, e.prototype.params = function(e) {
                    null == e && (e = null);
                    var t = {};
                    return t[this.wrappedKey("theme_slug", e)] = this.slug, t
                }, e.prototype.previewSrc = function() {
                    return [this.baseHref, s["default"].param(this.params())].join("&")
                }, e
            }(),
            u = function() {
                function e() {
                    this.updateScrollLinks = r(this.updateScrollLinks, this), this.scrollThemeLinksContainer = r(this.scrollThemeLinksContainer, this), this.onPublishClick = r(this.onPublishClick, this), this.onHideClick = r(this.onHideClick, this), this.onThemeLinkClick = r(this.onThemeLinkClick, this), this.onThemeNavNextClick = r(this.onThemeNavNextClick, this), this.onThemeNavPrevClick = r(this.onThemeNavPrevClick, this), this.onScrollForwardsClick = r(this.onScrollForwardsClick, this), this.onScrollBackwardsClick = r(this.onScrollBackwardsClick, this), this.onPagePreviewLoad = r(this.onPagePreviewLoad, this), this.$pagePreview = s["default"]("#page-preview"), this.$contextLoader = s["default"](".theme-picker-spinner"), this.$fullPicker = s["default"](".theme-picker-thumbs"), this.$miniPicker = s["default"](".theme-picker-controls"), this.$scrollBackwardsLinks = s["default"](".theme-toggle-full-left"), this.$scrollForwardsLinks = s["default"](".theme-toggle-full-right"), this.$prevLinks = s["default"](".theme-picker-prev"), this.$nextLinks = s["default"](".theme-picker-next"), this.themeLinksContainer = this.$fullPicker.find(".js-theme-selector"), this.themeLinks = this.themeLinksContainer.find(".theme-selector-thumbnail"), this.themes = [], this.themeLinks.each(function(e) {
                        return function(t, n) {
                            var i = new o(n);
                            return i.selected && (e.selectedTheme = i), e.themes.push(i)
                        }
                    }(this)), this.selectedTheme = this.selectedTheme || this.themes[0], this.$pagePreview.on("load", this.onPagePreviewLoad), this.$scrollBackwardsLinks.click(this.onScrollBackwardsClick), this.$scrollForwardsLinks.click(this.onScrollForwardsClick), this.$prevLinks.click(this.onThemeNavPrevClick), this.$nextLinks.click(this.onThemeNavNextClick), this.themeLinks.click(this.onThemeLinkClick), s["default"](".theme-picker-view-toggle").click(this.onHideClick), s["default"]("#page-edit").click(this.onEditClick), s["default"]("#page-publish").click(this.onPublishClick), this.theme(this.selectedTheme), this.updateScrollLinks()
                }
                return e.prototype.onPagePreviewLoad = function() {
                    this.$contextLoader.removeClass("visible")
                }, e.prototype.onScrollBackwardsClick = function() {
                    return this.scrollThemeLinksContainer(-1)
                }, e.prototype.onScrollForwardsClick = function() {
                    return this.scrollThemeLinksContainer(1)
                }, e.prototype.onThemeNavPrevClick = function() {
                    return this.theme(this.prevTheme())
                }, e.prototype.onThemeNavNextClick = function() {
                    return this.theme(this.nextTheme())
                }, e.prototype.onThemeLinkClick = function(e) {
                    return this.theme(this.themeForLink(e.currentTarget)), !1
                }, e.prototype.onHideClick = function(e) {
                    this.$fullPicker.toggle(), this.$miniPicker.toggle(), this.scrollToTheme(this.theme(), !1);
                    var t = s["default"](e.currentTarget);
                    return t.toggleClass("open")
                }, e.prototype.onEditClick = function() {
                    return t.submit(a["default"](document.getElementById("page-edit-form"), HTMLFormElement)), !1
                }, e.prototype.onPublishClick = function() {
                    var e = s["default"]("#page-publish-form");
                    return e.find('input[name="page[theme_slug]"]').val(this.theme().slug), t.submit(a["default"](document.getElementById("page-publish-form"), HTMLFormElement)), !1
                }, e.prototype.scrollThemeLinksContainer = function(e) {
                    var t = this.themeLinksContainer.scrollLeft(),
                        n = this.themeLinksContainer.outerWidth(!1),
                        i = t + n * e;
                    return this.themeLinksContainer.animate({
                        scrollLeft: i
                    }, 400, function(e) {
                        return function() {
                            return e.updateScrollLinks()
                        }
                    }(this)), !1
                }, e.prototype.updateScrollLinks = function() {
                    var e = this.themeLinksContainer.scrollLeft();
                    if (0 >= e) return this.$scrollBackwardsLinks.addClass("disabled"), this.$scrollForwardsLinks.removeClass("disabled");
                    this.$scrollBackwardsLinks.removeClass("disabled");
                    var t = this.themeLinksContainer[0].scrollWidth,
                        n = t - this.themeLinksContainer.outerWidth(!1);
                    return e >= n ? this.$scrollForwardsLinks.addClass("disabled") : this.$scrollForwardsLinks.removeClass("disabled")
                }, e.prototype.selectedThemeIndex = function() {
                    return this.themes.indexOf(this.selectedTheme)
                }, e.prototype.prevTheme = function() {
                    var e = (this.selectedThemeIndex() - 1) % this.themes.length;
                    return 0 > e && (e += this.themes.length), this.themes[e]
                }, e.prototype.nextTheme = function() {
                    return this.themes[(this.selectedThemeIndex() + 1) % this.themes.length]
                }, e.prototype.themeForLink = function(e) {
                    return this.themes[this.themeLinks.index(s["default"](e))]
                }, e.prototype.linkForTheme = function(e) {
                    return s["default"](this.themeLinks[this.themes.indexOf(e)])
                }, e.prototype.scrollToTheme = function(e, t) {
                    null == t && (t = !0);
                    var n = this.linkForTheme(e),
                        i = this.themes.indexOf(e),
                        r = n.outerWidth(!0),
                        a = i * r,
                        s = this.themeLinksContainer.scrollLeft(),
                        o = s + this.themeLinksContainer.outerWidth(!1);
                    return s > a || a + r > o ? t ? this.themeLinksContainer.animate({
                        scrollLeft: a
                    }, 500) : this.themeLinksContainer.scrollLeft(a) : void 0
                }, e.prototype.theme = function(e) {
                    return null == e && (e = null), e ? (this.selectedTheme = e, this.showPreviewFor(e), this.themeLinks.removeClass("selected"), this.linkForTheme(e).addClass("selected"), this.scrollToTheme(e), this.$miniPicker.find(".js-theme-name").text(e.name), !1) : this.selectedTheme
                }, e.prototype.showPreviewFor = function(e) {
                    if (this.$contextLoader.addClass("visible"), e.gem) this.$pagePreview.attr("src", e.baseHref);
                    else {
                        var n = this.$fullPicker.find("form");
                        n.find('input[name="theme_slug"]').val(e.slug), t.submit(n[0])
                    }
                }, e
            }();
        s["default"](function() {
            return document.getElementById("theme-picker-wrap") ? new u : void 0
        })
    }), define("github/legacy/pages/gist/drag_drop", ["../../../typecast", "../../../observe", "../../../google-analytics"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            u["default"](document.querySelector(".js-gist-dropzone"), HTMLElement).classList.remove("d-none"), e.stopPropagation(), e.preventDefault()
        }

        function a(e) {
            null != e.target.classList && e.target.classList.contains("js-gist-dropzone") && e.target.classList.add("d-none")
        }

        function s(e) {
            var t = void 0,
                i = void 0,
                r = e.dataTransfer.files,
                a = function() {
                    var i = r[t];
                    n.trackEvent({
                        category: "Interaction",
                        action: "File Drop",
                        label: i.type
                    }), o(i).then(function(t) {
                        i = t.file;
                        var n = t.data;
                        return e.target.dispatchEvent(new CustomEvent("gist:filedrop", {
                            bubbles: !0,
                            cancelable: !0,
                            detail: {
                                file: i,
                                text: n
                            }
                        }))
                    }, function() {})
                };
            for (t = 0, i = r.length; i > t; t++) a();
            u["default"](document.querySelector(".js-gist-dropzone"), HTMLElement).classList.add("d-none"), e.stopPropagation(), e.preventDefault()
        }

        function o(e) {
            return new Promise(function(t, n) {
                var i = new FileReader;
                return i.onload = function() {
                    var r = i.result;
                    return r && !/\0/.test(r) ? t({
                        file: e,
                        data: r
                    }) : n(new Error("invalid file"))
                }, i.readAsText(e)
            })
        }
        var u = i(e);
        t.observe(".js-gist-dropzone", {
            add: function() {
                document.body.addEventListener("dragenter", r), document.body.addEventListener("dragleave", a), document.body.addEventListener("dragover", r), document.body.addEventListener("drop", s)
            },
            remove: function() {
                document.body.removeEventListener("dragenter", r), document.body.removeEventListener("dragleave", a), document.body.removeEventListener("dragover", r), document.body.removeEventListener("drop", s)
            }
        })
    }), define("github/legacy/pages/gist/gist_edit", ["../../../invariant", "../../../observe", "../../../code-editor", "../../../throttled-input", "../../../jquery", "../../../focused", "../../../fetch"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e) {
            var t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                a = void 0,
                s = e.querySelector(".js-gist-files"),
                o = document.getElementById("js-gist-file-template"),
                u = document.createElement("div");
            u.innerHTML = o.textContent;
            var l = u.querySelectorAll("[id]");
            for (n = 0, r = l.length; r > n; n++) t = l[n], t.removeAttribute("id");
            var c = u.querySelector(".js-code-textarea");
            null != c && c.setAttribute("id", "blob_contents_" + Date.now());
            var d = u.children;
            for (i = 0, a = d.length; a > i; i++) t = d[i], s.append(t);
            return s.lastElementChild
        }

        function l(e) {
            var t = void 0,
                n = void 0,
                i = e.querySelectorAll(".js-gist-file");
            for (t = 0, n = i.length; n > t; t++) {
                var r = i[t],
                    a = r.querySelector(".js-gist-filename"),
                    s = r.querySelector(".js-blob-contents");
                if (!a.value && !s.value) return r
            }
            return u(e)
        }

        function c(e) {
            return n.getAsyncCodeEditor(e.closest(".js-code-editor"))
        }

        function d(e) {
            var t = void 0,
                n = void 0,
                i = e.querySelectorAll(".js-code-textarea");
            for (t = 0, n = i.length; n > t; t++) {
                var r = i[t];
                if (r.value.trim().length > 0) return !0
            }
            return !1
        }

        function f() {
            var t = void 0,
                n = void 0,
                i = document.querySelectorAll(".js-gist-create"),
                r = [];
            for (t = 0, n = i.length; n > t; t++) {
                var a = i[t];
                e.invariant(a instanceof HTMLButtonElement, "`.js-gist-create` must be HTMLButtonElement"), r.push(a.disabled = !d(a.form))
            }
            return r
        }

        function h() {
            var e = this,
                t = e.getAttribute("data-language-detection-url");
            return t ? s.fetchJSON(t + "?filename=" + encodeURIComponent(e.value)).then(function(t) {
                return c(e).then(function(e) {
                    return e.setMode(t.language)
                })
            }) : void 0
        }

        function m(e) {
            var t = void 0,
                n = void 0,
                i = e.querySelectorAll(".js-remove-gist-file"),
                r = [];
            for (t = 0, n = i.length; n > t; t++) {
                var a = i[t];
                r.push(a.classList.toggle("d-none", i.length < 2))
            }
            return r
        }
        var v = o(r),
            p = o(a);
        v["default"](document).on("change", ".js-code-textarea", function() {
            return f()
        }), p["default"](document, ".js-gist-filename", {
            focusin: function() {
                var e = this,
                    t = this.closest(".js-code-editor");
                c(t).then(function() {
                    i.addThrottledInputEventListener(e, h)
                })
            },
            focusout: function() {
                i.removeThrottledInputEventListener(this, h)
            }
        }), v["default"](document).on("click", ".js-add-gist-file", function() {
            var e = this.closest(".js-blob-form");
            return u(e).scrollIntoView(), !1
        }), v["default"](document).on("gist:filedrop", ".js-blob-form", function(e) {
            var t = void 0,
                n = void 0,
                i = void 0;
            n = e.originalEvent.detail, t = n.file, i = n.text;
            var r = l(this),
                a = r.querySelector(".js-gist-filename");
            return a.value = t.name, h.call(a), c(a).then(function(e) {
                return e.setCode(i)
            }), r.scrollIntoView()
        }), v["default"](document).on("click", ".js-remove-gist-file", function() {
            var e = void 0,
                t = void 0,
                n = this.closest(".js-gist-file"),
                i = n.querySelectorAll(".js-gist-deleted input");
            for (e = 0, t = i.length; t > e; e++) {
                var r = i[e];
                r.disabled = !1
            }
            return n.querySelector(".js-code-editor").remove(), !1
        }), v["default"](function() {
            return f()
        }), t.observe(".js-remove-gist-file", function() {
            var e = this.closest(".js-gist-files");
            return {
                add: function() {
                    return m(e)
                },
                remove: function() {
                    return m(e)
                }
            }
        })
    }), define("github/legacy/pages/gist/task_lists", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxComplete", ".js-gist-file-update-container .js-comment-update", function(e, t) {
            if (200 === t.status) {
                var n = JSON.parse(t.responseText);
                if (this.action = n.url, n.authenticity_token) {
                    var i = this.querySelector("input[name=authenticity_token]");
                    i.value = n.authenticity_token
                }
            }
        })
    }), define("github/legacy/pages/header", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("click", ".js-skip-to-content", function() {
            return n["default"]("#start-of-content").next().attr("tabindex", "-1").focus(), !1
        })
    }), define("github/legacy/pages/hiring/credits", ["../../../observe"], function(e) {
        function t(e) {
            try {
                return e.toLocaleString()
            } catch (t) {
                if (t instanceof RangeError) return e.toString();
                throw t
            }
        }

        function n(e) {
            var n = e.target,
                i = parseInt(n.value, 10) || 0,
                r = n.getAttribute("data-price"),
                a = i * r,
                s = n.form,
                o = s.querySelector(".js-job-posting-credit-total-cost");
            o.textContent = t(a);
            var u = s.querySelector(".js-job-posting-units");
            u.textContent = "job credit" + (1 === i ? "" : "s")
        }
        e.observe(".js-job-posting-credit-credits-purchased", function() {
            this.addEventListener("change", n), this.addEventListener("keyup", n)
        })
    }), define("github/legacy/pages/hiring/job_form", ["../../../typecast", "../../../invariant", "../../../observe", "../../../fetch"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            var t = e.target,
                n = t.querySelector("button[type=submit]");
            n.disabled && e.preventDefault()
        }

        function s(e, t) {
            Array.from(e).forEach(function(e) {
                return e.classList.toggle("d-none", !t)
            })
        }

        function o(e, t) {
            var n = e.querySelectorAll(".js-job-posting-form-edit-section");
            s(n, t)
        }

        function u(e, t) {
            var n = e.querySelectorAll(".js-job-posting-form-preview-section");
            s(n, t)
        }

        function l(e, t) {
            var n = e.querySelector(".js-job-posting-form-preview");
            n.innerHTML = t
        }

        function c(e) {
            for (var t = [], n = e.elements, i = 0; i < n.length; i++) {
                var r = n[i];
                if ("_method" !== r.name && "" !== r.name) {
                    var a = "INPUT" === r.tagName && "checkbox" === r.type,
                        s = a && r.checked;
                    (a && s || !a) && t.push(r.name + "=" + encodeURIComponent(r.value))
                }
            }
            return t.join("&")
        }

        function d(e) {
            var n = e.target,
                r = n.parentNode.querySelector(".selected");
            if (r) r.classList.remove("selected"), n.classList.add("selected");
            else {
                var a = document.querySelector(".js-job-posting-form-tabs");
                t.invariant(a instanceof HTMLElement, "Missing `.js-job-posting-form-tabs` element"), h["default"](a.querySelector(".selected.tabnav-tab"), HTMLElement).classList.remove("selected"), h["default"](a.querySelector(".js-show-job-posting-preview"), HTMLElement).classList.add("selected")
            }
            window.scrollTo(0, 0);
            var s = n.form,
                o = h["default"](document.querySelector(".js-job-posting-preview-loading"), HTMLElement).innerHTML;
            h["default"](document.querySelector(".js-job-posting-form-preview"), HTMLElement).innerHTML = o, u(s, !0);
            for (var d = s.querySelectorAll(".js-job-posting-form-edit-section"), f = 0; f < d.length; f++) d[f].classList.add("d-none");
            var m = n.getAttribute("data-url"),
                v = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: c(s)
                };
            i.fetchText(m, v).then(function(e) {
                l(s, e)
            })
        }

        function f(e) {
            var t = e.target,
                n = t.parentNode.querySelector(".selected");
            n && (n.classList.remove("selected"), t.classList.add("selected"));
            var i = t.form;
            o(i, !0), u(i, !1)
        }
        var h = r(e);
        n.observe(".js-job-posting-form", function() {
            this.addEventListener("submit", a)
        }), n.observe(".js-show-job-posting-preview", function() {
            this.addEventListener("click", d)
        }), n.observe(".js-show-job-posting-form", function() {
            this.addEventListener("click", f)
        })
    }), define("github/legacy/pages/hiring/job_search", ["../../../observe", "../../../fetch", "../../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            var e = x["default"](".js-job-search-input")[0];
            if ("undefined" != typeof e) {
                var t = e.value,
                    n = x["default"]("input[type=text].js-job-search-prefix, select.js-job-search-prefix, input[type=hidden].js-job-search-prefix"),
                    i = s(n, function(e, t) {
                        return "" === e ? "" : "" !== t ? e + t : void 0
                    }),
                    r = "input[type=checkbox].js-job-search-prefix";
                x["default"].merge(i, s(x["default"](r), function(e, t) {
                    return "true" === t ? e + t : void 0
                }));
                var a = x["default"].trim(i.join(" "));
                x["default"](".js-hidden-job-query").val(x["default"].trim(t + " " + a))
            }
        }

        function a(e) {
            return -1 !== e.search(/\s/g) ? '"' + e.replace(/"/g, '\\"') + '"' : e
        }

        function s(e, t) {
            return x["default"].map(e, function(e) {
                var n = null;
                if (x["default"](e).is("[type=checkbox]")) n = e.checked ? "true" : "false";
                else {
                    var i = e.getAttribute("data-search-value");
                    n = null === i ? e.value.trim() : i
                }
                var r = e.getAttribute("data-search-prefix");
                return "" === r ? t.call(e, r, n) : -1 !== n.search(/\,/g) && r.indexOf("location") < 0 ? n.split(/\,/).map(function(n) {
                    return t.call(e, r, a(n.trim()))
                }) : t.call(e, r, a(n))
            })
        }

        function o(e) {
            var t = e[0].getAttribute("data-suggestion");
            null === t && (t = e[0].getAttribute("data-value"));
            var n = e.closest(".js-suggester-container"),
                i = n.find('input[type="text"]:not(.js-applied-suggestions-value)'),
                r = n.find(".js-job-search-prefix"),
                s = e[0].getAttribute("data-search-prefix");
            null !== s && (t = s + a(t)), r.val(t).change(), null === s && i.val(e[0].getAttribute("data-value")).change(), e.closest(".js-suggester").empty().addClass("d-none"), i.focus()
        }

        function u(e) {
            var t = e[0].getAttribute("data-value"),
                n = e.closest(".js-suggester-container"),
                i = n.find(".js-job-search-prefix"),
                r = e[0].getAttribute("data-search-prefix");
            i.attr("data-search-prefix", r).attr("data-search-value", t).attr("name", "exact_location"), i.val(e[0].getAttribute("data-value")).change(), e.closest(".js-suggester").empty().addClass("d-none"), i.focus()
        }

        function l(e) {
            var t = e[0].getAttribute("data-geonameid"),
                n = e.closest(".js-suggester-container"),
                i = n.find('input[type="text"]:not(.js-applied-suggestions-value)'),
                r = n.find(".applied-suggestions"),
                a = document.createElement("li");
            a.className = "applied-suggestion";
            var s = n.find(".js-applied-suggestions-value"),
                o = s[0].value,
                u = "";
            u = o.length < 1 ? t : o.split(",").concat(t).join(","), s.val(u).change(), a.appendChild(document.createTextNode(e.text()));
            var l = document.createElement("button");
            l.setAttribute("data-value", t), x["default"](l).append("&times;"), l.className = "js-remove-suggestion remove-suggestion tooltipped tooltipped-e", l.setAttribute("aria-label", "Remove"), l.type = "button", a.appendChild(l), r[0].appendChild(a), i.val(""), r.removeClass("d-none"), e.closest(".js-suggester").empty().addClass("d-none"), i.focus()
        }

        function c(e) {
            var t = e.getAttribute("data-default-search-prefix");
            e.setAttribute("data-search-prefix", t), e.removeAttribute("data-search-value")
        }

        function d(e, t) {
            var n = e.find(".js-navigation-item");
            if (!(n.length < 1)) {
                var i = e.find(".js-navigation-item.navigation-focus"),
                    r = null;
                if (i.length > 0) {
                    var a = i.next(),
                        s = i.prev();
                    i.removeClass("navigation-focus"), r = 1 === t ? a.length > 0 ? a : n.first() : s.length > 0 ? s : n.last()
                } else r = 1 === t ? n.first() : n.last();
                r.addClass("navigation-focus")
            }
        }

        function f(e, t) {
            var n = e.closest(".js-suggester-container")[0],
                i = n.querySelector(".js-suggester");
            i.innerHTML = t, i.querySelectorAll("li").length > 0 ? (i.classList.remove("d-none"), i.style.display = "block") : i.classList.add("d-none")
        }

        function h(e, n, i) {
            var r = e[0].value.trim(),
                a = e.closest(".js-suggester-container"),
                s = a[0].querySelector(".octospinner");
            if (a.find(".js-suggester").empty(), !(r.length < 1)) {
                s.classList.remove("d-none");
                var o = n.indexOf("?") > -1 ? "&" : "?";
                n += o + "q=" + i(r), t.fetchText(n).then(function(t) {
                    f(e, t), s.classList.add("d-none")
                })
            }
        }

        function m(e, t) {
            h(e, t, function(e) {
                return 'title:"' + encodeURIComponent(e) + '"'
            })
        }

        function v(e, t) {
            h(e, t, function(e) {
                return encodeURIComponent(e)
            })
        }

        function p(e) {
            for (; e.hasChildNodes();) e.removeChild(e.lastChild);
            e.classList.add("d-none")
        }

        function g(e, t, n, i) {
            var r = x["default"](t.target),
                a = r.closest(".js-suggester-container"),
                s = a.find(".js-suggester");
            if (S[e] && clearTimeout(S[e]), 38 === t.keyCode) return void d(s, -1);
            if (40 === t.keyCode) return void d(s, 1);
            if (9 === t.keyCode) {
                var o = s.find(".js-navigation-item.navigation-focus");
                return void(o.length > 0 ? (t.preventDefault(), i(o)) : p(s[0]))
            }
            if (27 === t.keyCode) return void p(s[0]);
            if (13 === t.keyCode) {
                var u = s.find(".js-navigation-item.navigation-focus");
                return void(u.length > 0 && (t.preventDefault(), i(u)))
            }
            var l = a[0].querySelector(".js-navigation-container").getAttribute("data-url");
            S[e] = setTimeout(function() {
                n(r, l)
            }, 500)
        }

        function b(e) {
            var t = e.target;
            t.classList.contains("js-navigation-item") || (t = t.closest(".js-navigation-item"));
            var n = t.closest(".js-job-search-suggester").querySelector(".navigation-focus");
            null !== n && n.classList.remove("navigation-focus"), t.classList.add("navigation-focus")
        }

        function y(e) {
            var t = e.target;
            t.classList.contains("js-navigation-item") || (t = t.closest(".js-navigation-item")), t.classList.remove("navigation-focus")
        }

        function j(e) {
            var t = e.target;
            t.classList.contains("js-navigation-item") || (t = t.closest(".js-navigation-item"));
            var n = t.getAttribute("data-search-prefix"),
                i = t.closest(".js-suggester"),
                r = i.classList.contains("js-job-search-suggester-with-list");
            "title:" === n ? o(x["default"](t)) : r ? l(x["default"](t)) : u(x["default"](t))
        }

        function w(e) {
            e.preventDefault();
            var t = x["default"](e.target),
                n = t[0].getAttribute("data-value"),
                i = t.closest(".js-suggester-container"),
                r = i[0].querySelector(".js-applied-suggestions-value"),
                a = r.value.split(","),
                s = a.indexOf(n);
            s > -1 && a.splice(s, 1), r.value = a.join(",");
            var o = t.closest(".applied-suggestions")[0];
            t.closest("li").remove(), o.querySelectorAll("li").length < 1 && o.classList.add("d-none")
        }
        var x = i(n);
        x["default"](document).on("focusin", ".js-job-search-prefix", function() {
            var e = document.getElementById("job-title-suggester");
            p(e);
            var t = document.getElementById("job-location-suggester");
            return p(t),
                function() {
                    r()
                }
        }), x["default"](document).on("focusin", ".js-job-search-input", function() {
            x["default"](this).closest(".js-advanced-search-label").addClass("focus")
        }), x["default"](document).on("change", ".js-job-search-prefix", r), x["default"](document).on("ajaxSuccess", ".js-job-search-unwatch", function(e) {
            var t = x["default"](e.target),
                n = t.closest(".menu");
            t.closest(".menu-item").remove(), n.find(".menu-item").length < 1 && (x["default"](".search-job-postings-watched, .js-job-search-watch").removeClass("d-none"), x["default"](".js-watched-orgs").addClass("d-none"))
        }), x["default"](document).on("ajaxSuccess", ".js-org-job-search-unwatch", function() {
            x["default"](".js-org-job-search-watch").removeClass("d-none")
        }), x["default"](document).on("ajaxSuccess", ".js-job-search-watch", function(e, t, n, i) {
            x["default"](".js-job-search-watch")[0].classList.add("d-none"), x["default"](".js-job-search-watches").empty().append(x["default"](i))
        }), x["default"](document).on("ajaxSuccess", ".js-org-job-search-watch", function(e, t, n, i) {
            x["default"](".js-org-job-search-watch")[0].classList.add("d-none"), x["default"](".js-org-job-search-unwatch").removeClass("d-none"), Array.from(document.querySelectorAll(".js-org-job-search-id")).forEach(function(e) {
                e.value = i.saved_search.id
            })
        }), x["default"](".js-select-menu.js-job-search-watch, .js-select-menu.js-org-job-search-watch").on("menu:activated", function(e) {
            x["default"](e.target).find(".js-job-search-title").focus()
        }), x["default"](document).on("submit", ".js-job-search-unwatch, .js-org-job-search-unwatch", function(e) {
            var t = e.target;
            t.blur(), t.classList.add("d-none")
        });
        var S = {};
        S.jobTitle = null, S.jobLocation = null, e.observe(".js-job-search-input", function() {
            this.addEventListener("keydown", function(e) {
                g("jobTitle", e, m, o)
            })
        }), e.observe(".js-job-search-suggester .js-navigation-item", function() {
            this.addEventListener("mouseover", b), this.addEventListener("mouseout", y), this.addEventListener("click", j)
        }), e.observe(".js-job-posting-location", function() {
            this.addEventListener("keydown", function(e) {
                c(e.target), g("jobLocation", e, v, u)
            })
        }), e.observe(".js-job-posting-location-with-list", function() {
            this.addEventListener("keydown", function(e) {
                g("jobLocation", e, v, l)
            })
        }), e.observe(".js-job-search-input, .js-job-search-hidden", function() {
            r()
        }), e.observe(".js-remove-suggestion", function() {
            this.addEventListener("click", w)
        })
    }), define("github/legacy/pages/hooks", ["../../invariant", "../../form", "../../throttled-input", "../../fetch", "../../jquery", "../../sudo", "../../facebox", "delegated-events", "../../observe"], function(e, t, n, i, r, a, s, o, u) {
        function l(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function c(e) {
            var t = f["default"](".js-hook-event-checkbox");
            return t.prop("checked", !1), null != e ? t.filter(e).prop("checked", !0) : void 0
        }

        function d() {
            var e = f["default"](this),
                n = e.find(".js-value"),
                i = e.closest("form"),
                r = i.find(".js-enforcement-value")[0];
            r.value = n.text().split("_")[0];
            var a = i.find(".js-final-value")[0];
            return "undefined" != typeof a && (n.text().split("_")[1] ? a.value = !1 : a.value = !0), t.submit(i[0])
        }
        var f = l(r),
            h = l(a),
            m = l(s),
            v = {
                isHttpFragment: function(e) {
                    return 0 === "http://".indexOf(e) || 0 === "https://".indexOf(e)
                },
                isValidHttpUrl: function(e) {
                    e = e.trim();
                    var t = function() {
                        try {
                            return new URL(e)
                        } catch (t) {}
                    }();
                    if (null == t) return !1;
                    var n = /^https?/.test(t.protocol),
                        i = t.href === e || t.href === e + "/";
                    return n && i
                }
            };
        u.observe(".js-hook-url-field", function(e) {
            function t(e) {
                var t = f["default"](e).closest("form"),
                    n = /^https:\/\/.+/.test(e.val());
                return t.toggleClass("is-ssl", n)
            }

            function i(e) {
                var t = e.val(),
                    n = v.isHttpFragment(t) || v.isValidHttpUrl(t);
                return e.closest("form").toggleClass("is-invalid-url", !n)
            }
            var r = f["default"](e);
            r.on("keyup", function() {
                return t(r)
            }), n.addThrottledInputEventListener(r[0], function() {
                i(r)
            }), t(r), i(r)
        }), f["default"](document).on("click", ".js-hook-toggle-ssl-verification", function(e) {
            return e.preventDefault(), f["default"](".js-ssl-hook-fields").toggleClass("is-not-verifying-ssl"), f["default"](".js-ssl-hook-fields").hasClass("is-not-verifying-ssl") ? (f["default"](".js-hook-ssl-verification-field").val("1"), o.fire(document, "facebox:close")) : f["default"](".js-hook-ssl-verification-field").val("0")
        }), f["default"](document).on("change", ".js-hook-event-choice", function() {
            var e = "custom" === f["default"](this).val();
            return f["default"](".js-hook-events-field").toggleClass("is-custom", e), !0
        }), f["default"](document).on("submit", ".js-hook-form", function() {
            var e = f["default"](this),
                t = e.find(".js-hook-event-choice:checked").val();
            return "custom" === t && f["default"](".js-hook-wildcard-event").prop("checked", !1), "push" === t && c('[value="push"]'), "all" === t && c(".js-hook-wildcard-event"), !0
        }), f["default"](document).on("details:toggled", ".js-hook-secret", function() {
            var e = f["default"](this),
                t = e.find("input[type=password]");
            return e.hasClass("open") ? t.removeAttr("disabled").focus() : t.attr("disabled", "disabled")
        }), f["default"](document).on("details:toggled", ".js-hook-delivery-item", function() {
            var e = f["default"](this),
                t = this.querySelector(".js-hook-delivery-details");
            return e.data("details-load-initiated") ? void 0 : h["default"]().then(function() {
                function n(e) {
                    return f["default"](t).replaceWith(e), t.classList.remove("is-loading")
                }

                function r() {
                    return t.classList.add("has-error"), t.classList.remove("is-loading")
                }
                return e.data("details-load-initiated", !0), t.classList.add("is-loading"), i.fetchText(t.getAttribute("data-url")).then(n, r)
            })
        }), f["default"](document).on("click", ".js-hook-delivery-details .js-tabnav-tab", function() {
            var e = f["default"](this),
                t = e.closest(".js-hook-delivery-details");
            t.find(".js-tabnav-tab").removeClass("selected");
            var n = t.find(".js-tabnav-tabcontent").removeClass("selected");
            return e.addClass("selected"), n.filter(function() {
                return this.getAttribute("data-tab-name") === e.attr("data-tab-target")
            }).addClass("selected")
        }), f["default"](document).on("click", ".js-hook-deliveries-pagination-button", function(e) {
            e.preventDefault();
            var t = this,
                n = f["default"](this).parent();
            return h["default"]().then(function() {
                return n.addClass("loading"), i.fetchText(t.getAttribute("href")).then(function(e) {
                    return n.replaceWith(e)
                })
            })
        }), f["default"](document).on("click", ".js-redeliver-hook-delivery-init-button", function(e) {
            e.preventDefault();
            var t = this.getAttribute("href");
            return h["default"]().then(function() {
                return m["default"]({
                    div: t
                })
            })
        }), f["default"](document).on("ajaxSuccess", ".js-redeliver-hook-form", function(e, t) {
            var n = this.getAttribute("data-delivery-guid"),
                i = f["default"](".js-hook-delivery-details").filter(function() {
                    return this.getAttribute("data-delivery-guid") === n
                }),
                r = i.closest(".js-hook-delivery-item");
            o.fire(document, "facebox:close");
            var a = f["default"](t.responseText);
            return i.replaceWith(a), a.on("load", function() {
                return i = r.find(".js-hook-delivery-details"), r.find(".js-item-status").removeClass("success pending failure").addClass(i.attr("data-status-class")), r.find(".js-item-status-tooltip").attr("aria-label", i.attr("data-status-message"))
            })
        }), f["default"](document).on("ajaxError", ".js-redeliver-hook-form", function() {
            return f["default"](this).siblings(".js-redelivery-dialog").addClass("failed")
        }), f["default"](document).on("submit", ".js-test-hook-form", function(t) {
            t.preventDefault();
            var n = this;
            return h["default"]().then(function() {
                function t() {
                    return n.dispatchEvent(new CustomEvent("ajaxComplete", {
                        bubbles: !0
                    }))
                }

                function r() {
                    return s.classList.add("success")
                }

                function a(t) {
                    s.classList.add("error");
                    var n = s.querySelector(".js-test-hook-message-errors");
                    return e.invariant(n instanceof HTMLElement, "Missing `.js-test-hook-message-errors` element"), null != t.response ? t.response.json().then(function(e) {
                        return n.textContent = e.errors
                    }) : n.textContent = "Network request failed"
                }
                var s = document.querySelector(".js-test-hook-message");
                return e.invariant(s instanceof HTMLElement, "Missing `.js-test-hook-message` element"), s.classList.remove("error", "success"), i.fetch(n.action, {
                    method: n.method,
                    body: f["default"](n).serialize(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    }
                }).then(r, a).then(t, t)
            })
        }), f["default"](document).on("click", ".js-hook-enforcement-select .js-navigation-item", d)
    }), define("github/legacy/pages/integrations", ["../../jquery", "../../observe"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            var e = document.getElementById("js-update-integration-permissions");
            null != e && e.removeAttribute("disabled")
        }
        var r = n(e);
        t.observe(".js-integration-permissions-selector", function() {
            r["default"]("[id^=integration_permission_]").on("change", function() {
                var e = this.getAttribute("data-permission"),
                    t = this.getAttribute("data-resource"),
                    n = Array.from(document.querySelectorAll('.js-integration-hook-event[data-resource="' + t + '"]')),
                    a = Array.from(document.querySelectorAll(".js-integration-single-file-resource"));
                i(), "none" !== e ? (r["default"](".js-integration-hook-event-permission-error[data-resource='" + t + "']").addClass("d-none"),
                    r["default"](".js-integration-single-file-permission-error").addClass("d-none"), n.forEach(function(e) {
                        return e.readOnly = !1
                    }), a.forEach(function(e) {
                        return e.readOnly = !1
                    }), this.closest(".js-list-group-item").classList.remove("disabled")) : (this.closest(".js-list-group-item").classList.add("disabled"), n.forEach(function(e) {
                    e.readOnly = !0, e.checked = !1
                }), "single_file" === t && a.forEach(function(e) {
                    e.readOnly = !0, e.value = ""
                }))
            }), r["default"]("[name^=integration]").on("change", function() {
                i()
            }), r["default"](".js-integration-hook-event").on("click", function() {
                return this.readOnly === !0 ? (r["default"](this.closest(".js-send-events")).find(".js-integration-hook-event-permission-error").removeClass("d-none"), !1) : void 0
            }), r["default"](".js-integration-single-file-resource").on("click", function() {
                return this.readOnly === !0 ? (r["default"](this.closest(".js-single-file")).find(".js-integration-single-file-permission-error").removeClass("d-none"), !1) : void 0
            })
        })
    }), define("github/legacy/pages/issues/filters", ["../../../form", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("navigation:open", ".js-issues-custom-filter", function() {
            var t = this,
                n = i["default"](t),
                r = n.find(".js-new-item-name").text(),
                a = n.attr("data-name"),
                s = i["default"]("<input>", {
                    type: "hidden",
                    name: a,
                    value: r
                });
            n.append(s), e.submit(t)
        })
    }), define("github/legacy/pages/issues/label_editor", ["../../../throttled-input", "../../../jquery", "../../../setimmediate", "../../../focused"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e, t) {
            return e.closest(".js-label-editor").find(".js-color-editor-bg").css("background-color", t), e.css("color", o(t, -.5)), e.css("border-color", t)
        }

        function s(e) {
            var t = "#c00",
                n = l["default"](e).closest(".js-color-editor");
            return n.find(".js-color-editor-bg").css("background-color", t), e.css("color", "#c00"), e.css("border-color", t)
        }

        function o(e, t) {
            var n = void 0;
            e = String(e).toLowerCase().replace(/[^0-9a-f]/g, ""), e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), t = t || 0;
            var i = "#";
            n = void 0;
            for (var r = 0; 3 > r;) n = parseInt(e.substr(2 * r, 2), 16), n = Math.round(Math.min(Math.max(0, n + n * t), 255)).toString(16), i += ("00" + n).substr(n.length), r++;
            return i
        }

        function u() {
            var e = l["default"](this),
                t = l["default"](this).closest(".js-label-editor");
            "#" !== e.val().charAt(0) && e.val("#" + e.val()), t.removeClass("is-valid is-not-valid");
            var n = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e.val());
            n ? (t.addClass("is-valid"), a(e, e.val())) : (t.addClass("is-not-valid"), s(e))
        }
        var l = r(t),
            c = r(n),
            d = r(i);
        d["default"](document, ".js-color-editor-input", {
            focusin: function() {
                e.addThrottledInputEventListener(this, u)
            },
            focusout: function() {
                e.removeThrottledInputEventListener(this, u)
            }
        }), l["default"](document).on("mousedown", ".js-color-chooser-color", function() {
            l["default"](this).closest(".js-color-editor").removeClass("open");
            var e = l["default"](this).closest(".js-label-editor"),
                t = "#" + l["default"](this).attr("data-hex-color"),
                n = e.find(".js-color-editor-input");
            return e.removeClass("is-valid is-not-valid"), n.val(t), a(n, t)
        }), l["default"](document).on("submit", ".js-label-editor form", function() {
            var e = void 0,
                t = l["default"](this).find(".js-color-editor-input");
            return e = t.val(), e.length < 6 && (e = e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), t.val(e.replace("#", ""))
        }), l["default"](document).on("focusin", ".js-label-editor", function() {
            return l["default"](this).closest(".js-label-editor").addClass("open")
        }), l["default"](document).on("reset", ".js-create-label", function() {
            var e = l["default"](this).find(".color-chooser span").removeAttr("data-selected"),
                t = e.eq(Math.floor(Math.random() * e.length)),
                n = "#" + t.attr("data-selected", "").attr("data-hex-color");
            return c["default"](function(e) {
                return function() {
                    var t = l["default"](e).find(".js-color-editor-input");
                    return t.attr("data-original-color", n).attr("value", n), a(t, t.val())
                }
            }(this))
        })
    }), define("github/legacy/pages/issues/labels", ["../../../invariant", "../../../inflector", "../../../number-helpers", "../../../jquery"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e, t) {
            return e.closest("div.js-details-container").classList.toggle("is-empty", t)
        }

        function s(i) {
            var r = document.querySelector(".js-labels-count");
            e.invariant(r instanceof HTMLElement, "Missing `.js-labels-count` element");
            var a = n.parseFormattedNumber(r.textContent),
                s = a + i;
            r.textContent = n.formatNumber(s);
            var o = document.querySelector(".js-labels-label");
            return e.invariant(o instanceof HTMLElement, "Missing `.js-labels-label` element"), t.pluralizeNode(s, o), s
        }
        var o = r(i);
        o["default"](document).on("click", ".js-edit-label", function() {
            o["default"](this).closest(".labels-list-item").addClass("edit")
        }), o["default"](document).on("click", ".js-edit-label-cancel", function() {
            this.form.reset(), o["default"](this).closest(".labels-list-item").removeClass("edit")
        }), o["default"](document).on("ajaxSuccess", ".js-create-label", function(e, t, n, i) {
            this.reset(), o["default"](this).nextAll(".table-list").prepend(i), s(1), a(this, !1)
        }), o["default"](document).on("ajaxSuccess", ".js-update-label", function(e, t, n, i) {
            o["default"](this).closest(".labels-list-item").replaceWith(i)
        }), o["default"](document).on("ajaxSend", ".js-update-label, .js-create-label", function() {
            o["default"](this).find(".error").text("")
        }), o["default"](document).on("ajaxError", ".js-update-label, .js-create-label", function(e, t) {
            return o["default"](this).find(".error").text(t.responseText), !1
        }), o["default"](document).on("ajaxSuccess", ".js-delete-label", function() {
            var e = s(-1);
            a(this, 0 === e), o["default"](this).closest(".labels-list-item").fadeOut()
        })
    }), define("github/legacy/pages/issues/legacy", ["../../../hash-change"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](function(e) {
            var t = e.newURL,
                n = t.match(/\/issues#issue\/(\d+)$/);
            if (n) {
                var i = n[1];
                return window.location = t.replace(/\/?#issue\/.+/, "/" + i)
            }
        }), n["default"](function(e) {
            var t = void 0,
                n = void 0,
                i = e.newURL,
                r = i.match(/\/issues#issue\/(\d+)\/comment\/(\d+)$/);
            return r ? (n = r[1], t = r[2], window.location = i.replace(/\/?#issue\/.+/, "/" + n + "#issuecomment-" + t)) : void 0
        })
    }), define("github/legacy/pages/issues/list", ["../../../form", "../../../observe", "../../../jquery", "delegated-events"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(t) {
            var n = t.querySelector(".js-issues-list-check");
            n && e.changeValue(n, !n.checked)
        }
        var s = r(n);
        t.observe(".js-issues-list-check:checked", {
            add: function() {
                this.closest(".js-issue-row").classList.add("selected")
            },
            remove: function() {
                this.closest(".js-issue-row").classList.remove("selected")
            }
        }), i.on("navigation:keydown", ".js-issue-row", function(e) {
            "x" === e.detail.hotkey && (a(this), e.preventDefault(), e.stopPropagation())
        }), s["default"]("#js-issues-search").focus(function() {
            return this.value = this.value
        })
    }), define("github/text", ["exports"], function(e) {
        function t(e) {
            return e.dispatchEvent(new CustomEvent("change", {
                bubbles: !0,
                cancelable: !1
            }))
        }

        function n(e, n, i) {
            var r = e.value.substring(0, e.selectionEnd),
                a = e.value.substring(e.selectionEnd);
            r = r.replace(n, i), a = a.replace(n, i), e.value = r + a, e.selectionStart = r.length, e.selectionEnd = r.length, t(e)
        }

        function i(e, n) {
            var i = e.selectionEnd,
                r = e.value.substring(0, i),
                a = e.value.substring(i),
                s = "" === e.value || r.match(/\n$/) ? "" : "\n";
            e.value = r + s + n + a, e.selectionStart = i + n.length, e.selectionEnd = i + n.length, t(e)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.replaceText = n, e.insertText = i
    }), define("github/legacy/pages/issues/replies", ["delegated-events", "../../../text"], function(e, t) {
        e.on("selectmenu:selected", ".js-saved-reply-container", function(e) {
            var n = e.target.querySelector(".js-saved-reply-body"),
                i = n.textContent.trim(),
                r = this.closest(".js-previewable-comment-form"),
                a = r.querySelector(".js-comment-field");
            t.insertText(a, i);
            var s = r.querySelector(".js-saved-reply-id");
            s.value = n.getAttribute("data-saved-reply-id")
        })
    }), define("github/legacy/pages/issues/sidebar", ["../../../form", "../../../jquery", "../../../fetch"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            e.replaceWith.apply(e, u["default"].parseHTML(t))
        }

        function a(e, t) {
            var i = s(e);
            t && i.push(t);
            var a = e.getAttribute("data-authenticity-token");
            null == a && (a = e.closest("form").elements.authenticity_token.value), i.push({
                name: "authenticity_token",
                value: a
            }), n.fetchText(e.getAttribute("data-url"), {
                method: "post",
                body: u["default"].param(i),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(function(t) {
                return r(e.closest(".js-discussion-sidebar-item"), t)
            })
        }

        function s(e) {
            var t = void 0,
                n = void 0,
                i = e.closest("form"),
                r = u["default"](i).serializeArray(),
                a = [];
            for (t = 0, n = r.length; n > t; t++) {
                var s = r[t];
                u["default"].contains(e, o(i, s)) && a.push(s)
            }
            return a
        }

        function o(e, t) {
            var n = void 0,
                i = void 0,
                r = e.elements;
            for (n = 0, i = r.length; i > n; n++) {
                var a = r[n];
                if (a.name === t.name && a.value === t.value) return a
            }
        }
        var u = i(t);
        u["default"](document).on("selectmenu:selected", ".js-issue-sidebar-form", function(t) {
            function n() {
                "FORM" === i.tagName ? e.submit(i) : a(i)
            }
            var i = this,
                r = t.target,
                s = r.closest(".js-select-menu"),
                o = s.hasAttribute("data-multiple");
            if (r.hasAttribute("data-clear-assignees")) {
                for (var l = r.closest(".js-menu-content"), c = l.querySelectorAll('input[name="issue[user_assignee_ids][]"]:checked'), d = 0; d < c.length; d++) {
                    var f = c[d];
                    f.disabled = !1, f.checked = !1
                }
                n()
            } else if (o) {
                var h = s.getAttribute("data-max-options");
                if (h) {
                    var m = Number(h),
                        v = s.querySelectorAll('input[type="checkbox"]:checked').length,
                        p = v > m;
                    s.querySelector(".js-max-warning").classList.toggle("d-none", !p)
                }
                u["default"](i).off(".deferredSubmit"), u["default"](i).one("menu:deactivate.deferredSubmit", n)
            } else n()
        }), u["default"](document).on("ajaxSuccess", ".js-discussion-sidebar-item", function(e, t, n, i) {
            var a = e.target.classList;
            a.contains("js-issue-sidebar-form") && r(this, i)
        }), u["default"](document).on("click", "div.js-issue-sidebar-form .js-issue-assign-self", function(e) {
            var t = this.closest(".js-issue-sidebar-form");
            a(t, {
                name: this.name,
                value: this.value
            }), e.preventDefault()
        })
    }), define("github/legacy/pages/issues/triage", ["../../../fetch", "../../../select-menu/loading", "../../../jquery", "../../../menu", "../../../setimmediate"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var s = a(n),
            o = a(r);
        s["default"](document).on("change", ".js-issues-list-check", function() {
            s["default"]("#js-issues-toolbar").toggleClass("triage-mode", s["default"](".js-issues-list-check:checked").length > 0)
        }), s["default"](document).on("change", ".js-issues-list-check", function() {
            for (var e = document.querySelectorAll(".js-issues-list-check:checked"), n = Array.from(e).map(function(e) {
                    return [e.name, e.value]
                }), i = document.querySelectorAll("#js-issues-toolbar .js-issues-toolbar-triage .js-select-menu"), r = 0; r < i.length; r++) {
                var a = i[r];
                t.setLoadingData(a, n), a.classList.add("js-load-contents")
            }
        }), s["default"](document).on("selectmenu:selected", ".js-issues-toolbar-triage .js-navigation-item", function() {
            var e = void 0,
                t = this.closest(".js-menu-container").hasAttribute("data-submits-hash"),
                n = s["default"](this).closest("form"),
                r = s["default"](this).hasClass("selected"),
                a = s["default"](this).attr("data-name"),
                u = s["default"](this).attr("data-value");
            e = t ? s["default"]("<input>", {
                type: "hidden",
                name: a + "[" + u + "]",
                value: r ? "1" : "0"
            }) : s["default"]("<input>", {
                type: "hidden",
                name: a,
                value: r ? u : ""
            }), o["default"](function(e) {
                return function() {
                    i.deactivate(e.closest(".js-menu-container"))
                }
            }(this)), n.find(".js-issues-triage-fields").append(e), n.addClass("will-submit")
        }), s["default"](document).on("menu:deactivate", ".js-issues-toolbar-triage .js-menu-container", function(t) {
            var n = void 0;
            if (n = this.querySelector("form.will-submit")) {
                this.classList.add("is-loading");
                var r = e.fetchJSON(n.getAttribute("action"), {
                    method: n.getAttribute("method"),
                    body: s["default"].param(s["default"](n).serializeArray()),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    }
                });
                r.then(function(t) {
                    return function(n) {
                        function r() {
                            return i.deactivate(t.closest(".js-menu-container")), location.reload()
                        }

                        function a() {
                            return t.classList.add("has-error")
                        }
                        var s = e.fetchPoll(n.job.url, {
                            headers: {
                                accept: "application/json"
                            }
                        });
                        return s.then(r, a)
                    }
                }(this)), n.classList.remove("will-submit"), t.preventDefault()
            }
        })
    }), define("github/date-input", ["exports", "./jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e, t) {
            "object" != typeof t && (t = {}), r["default"].extend(this, i.DEFAULT_OPTS, t), this.input = r["default"](e), this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate"), this.build(), this.selectDate(), this.show(), this.input.hide(), this.input.data("datePicker", this)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = i;
        var r = n(t);
        i.DEFAULT_OPTS = {
            month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            start_of_week: 1
        }, i.prototype = {
            build: function() {
                var e = r["default"]('<p class="month-nav"><span class="date-button prev" title="[Page-Up]">\u25c0</span> <span class="month-name"></span> <span class="date-button next" title="[Page-Down]">\u25b6</span></p>');
                this.monthNameSpan = r["default"](".month-name", e), r["default"](".prev", e).click(this.bindToObj(function() {
                    this.moveMonthBy(-1)
                })), r["default"](".next", e).click(this.bindToObj(function() {
                    this.moveMonthBy(1)
                }));
                var t = r["default"]('<p class="year-nav"><span class="date-button prev" title="[Ctrl+Page-Up]">\u25c0</span> <span class="year-name"></span> <span class="date-button next" title="[Ctrl+Page-Down]">\u25b6</span></p>');
                this.yearNameSpan = r["default"](".year-name", t), r["default"](".prev", t).click(this.bindToObj(function() {
                    this.moveMonthBy(-12)
                })), r["default"](".next", t).click(this.bindToObj(function() {
                    this.moveMonthBy(12)
                }));
                var n = r["default"]("<div></div>").append(e, t),
                    i = "<table><thead><tr>";
                r["default"](this.adjustDays(this.short_day_names)).each(function() {
                    i += "<th>" + this + "</th>"
                }), i += "</tr></thead><tbody></tbody></table>", this.dateSelector = this.rootLayers = r["default"]('<div class="date-selector"></div>').append(n, i).insertAfter(this.input), this.tbody = r["default"]("tbody", this.dateSelector), this.input.change(this.bindToObj(function() {
                    this.selectDate()
                })), this.selectDate()
            },
            selectMonth: function(e) {
                var t = new Date(e.getFullYear(), e.getMonth(), 1);
                if (!this.currentMonth || this.currentMonth.getFullYear() != t.getFullYear() || this.currentMonth.getMonth() != t.getMonth()) {
                    this.currentMonth = t;
                    for (var n = this.rangeStart(e), i = this.rangeEnd(e), a = this.daysBetween(n, i), s = "", o = 0; a >= o; o++) {
                        var u = new Date(n.getFullYear(), n.getMonth(), n.getDate() + o, 12, 0);
                        this.isFirstDayOfWeek(u) && (s += "<tr>"), s += u.getMonth() == e.getMonth() ? '<td class="selectable-day" date="' + this.dateToString(u) + '">' + u.getDate() + "</td>" : '<td class="unselected-month" date="' + this.dateToString(u) + '">' + u.getDate() + "</td>", this.isLastDayOfWeek(u) && (s += "</tr>")
                    }
                    this.tbody.empty().append(s), this.monthNameSpan.empty().append(this.monthName(e)), this.yearNameSpan.empty().append(this.currentMonth.getFullYear()), r["default"](".selectable-day", this.tbody).mousedown(this.bindToObj(function(e) {
                        this.changeInput(r["default"](e.target).attr("date"))
                    })), r["default"]("td[date='" + this.dateToString(new Date) + "']", this.tbody).addClass("today"), r["default"]("td.selectable-day", this.tbody).mouseover(function() {
                        r["default"](this).addClass("hover")
                    }), r["default"]("td.selectable-day", this.tbody).mouseout(function() {
                        r["default"](this).removeClass("hover")
                    })
                }
                r["default"](".selected", this.tbody).removeClass("selected"), r["default"]('td[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected")
            },
            selectDate: function(e) {
                "undefined" == typeof e && (e = this.stringToDate(this.input.val())), e || (e = new Date), this.selectedDate = e, this.selectedDateString = this.dateToString(this.selectedDate), this.selectMonth(this.selectedDate)
            },
            resetDate: function() {
                r["default"](".selected", this.tbody).removeClass("selected"), this.changeInput("")
            },
            changeInput: function(e) {
                this.input.val(e).change(), this.hide()
            },
            show: function() {
                this.rootLayers.css("display", "block"), r["default"]([window, document.body]).click(this.hideIfClickOutside), this.input.unbind("focus", this.show), this.rootLayers.keydown(this.keydownHandler), this.setPosition()
            },
            hide: function() {},
            hideIfClickOutside: function(e) {
                e.target == this.input[0] || this.insideSelector(e) || this.hide()
            },
            insideSelector: function(e) {
                var t = r["default"](e.target);
                if (t.parents(".date-selector").length || t.is(".date-selector")) return !0;
                var n = this.dateSelector.position();
                return n.right = n.left + this.dateSelector.outerWidth(), n.bottom = n.top + this.dateSelector.outerHeight(), e.pageY < n.bottom && e.pageY > n.top && e.pageX < n.right && e.pageX > n.left
            },
            keydownHandler: function(e) {
                switch (e.keyCode) {
                    case 9:
                    case 27:
                        return void this.hide();
                    case 13:
                        this.changeInput(this.selectedDateString);
                        break;
                    case 33:
                        this.moveDateMonthBy(e.ctrlKey ? -12 : -1);
                        break;
                    case 34:
                        this.moveDateMonthBy(e.ctrlKey ? 12 : 1);
                        break;
                    case 38:
                        this.moveDateBy(-7);
                        break;
                    case 40:
                        this.moveDateBy(7);
                        break;
                    case 37:
                        this.moveDateBy(-1);
                        break;
                    case 39:
                        this.moveDateBy(1);
                        break;
                    default:
                        return
                }
                e.preventDefault()
            },
            stringToDate: function(e) {
                var t = e.match(/^(\d{1,2}) ([^\s]+) (\d{4,4})$/);
                return t ? new Date(t[3], this.shortMonthNum(t[2]), t[1], 12, 0) : null
            },
            dateToString: function(e) {
                return e.getDate() + " " + this.short_month_names[e.getMonth()] + " " + e.getFullYear()
            },
            setPosition: function() {
                var e = this.input.offset();
                this.rootLayers.css({
                    top: e.top + this.input.outerHeight(),
                    left: e.left
                }), this.ieframe && this.ieframe.css({
                    width: this.dateSelector.outerWidth(),
                    height: this.dateSelector.outerHeight()
                })
            },
            moveDateBy: function(e) {
                var t = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + e);
                this.selectDate(t)
            },
            moveDateMonthBy: function(e) {
                var t = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + e, this.selectedDate.getDate());
                t.getMonth() == this.selectedDate.getMonth() + e + 1 && t.setDate(0), this.selectDate(t)
            },
            moveMonthBy: function(e) {
                var t = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + e, this.currentMonth.getDate());
                this.selectMonth(t)
            },
            monthName: function(e) {
                return this.month_names[e.getMonth()]
            },
            bindToObj: function(e) {
                var t = this;
                return function() {
                    return e.apply(t, arguments)
                }
            },
            bindMethodsToObj: function() {
                for (var e = 0; e < arguments.length; e++) this[arguments[e]] = this.bindToObj(this[arguments[e]])
            },
            indexFor: function(e, t) {
                for (var n = 0; n < e.length; n++)
                    if (t == e[n]) return n
            },
            monthNum: function(e) {
                return this.indexFor(this.month_names, e)
            },
            shortMonthNum: function(e) {
                return this.indexFor(this.short_month_names, e)
            },
            shortDayNum: function(e) {
                return this.indexFor(this.short_day_names, e)
            },
            daysBetween: function(e, t) {
                return e = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()), t = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()), (t - e) / 864e5
            },
            changeDayTo: function(e, t, n) {
                var i = n * (Math.abs(t.getDay() - e - 7 * n) % 7);
                return new Date(t.getFullYear(), t.getMonth(), t.getDate() + i)
            },
            rangeStart: function(e) {
                return this.changeDayTo(this.start_of_week, new Date(e.getFullYear(), e.getMonth()), -1)
            },
            rangeEnd: function(e) {
                return this.changeDayTo((this.start_of_week - 1) % 7, new Date(e.getFullYear(), e.getMonth() + 1, 0), 1)
            },
            isFirstDayOfWeek: function(e) {
                return e.getDay() == this.start_of_week
            },
            isLastDayOfWeek: function(e) {
                return e.getDay() == (this.start_of_week - 1) % 7
            },
            adjustDays: function(e) {
                for (var t = [], n = 0; n < e.length; n++) t[n] = e[(n + this.start_of_week) % 7];
                return t
            }
        }
    }), define("github/legacy/pages/milestones", ["../../has-interactions", "../../observe", "../../jquery", "../../date-input"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var a = r(n),
            s = r(i);
        t.observe("input.js-date-input", function() {
            a["default"](this).next(".date-selector").remove(), new s["default"](this)
        }), a["default"](document).on("click", ".js-date-input-clear", function() {
            return a["default"]("input.js-date-input").data("datePicker").resetDate(), !1
        }), a["default"](document).on("change click", ".js-milestone-edit-form", function() {
            var t = this.querySelector(".js-milestone-edit-cancel");
            e.hasDirtyFields(this) ? t.setAttribute("data-confirm", t.getAttribute("data-confirm-changes")) : t.removeAttribute("data-confirm")
        })
    }), define("github/legacy/pages/notifications", ["../../form", "../../jquery", "delegated-events"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            return e.classList.contains("read") ? void 0 : (e.classList.toggle("unread"), e.classList.toggle("read"))
        }
        var a = i(t);
        a["default"](document).on("click", ".js-notification-target", function(e) {
            e.which > 1 || r(this.closest(".js-notification"))
        }), a["default"](document).on("ajaxSuccess", ".js-delete-notification", function() {
            r(this.closest(".js-notification"))
        }), a["default"](document).on("ajaxSuccess", ".js-mute-notification", function() {
            r(this.closest(".js-notification"));
            var e = this.closest(".js-notification");
            e.classList.toggle("muted")
        }), a["default"](document).on("ajaxSuccess", ".js-unmute-notification", function() {
            var e = this.closest(".js-notification");
            e.classList.toggle("muted")
        }), a["default"](document).on("ajaxSuccess", ".js-mark-visible-as-read", function() {
            var e = void 0,
                t = void 0,
                n = void 0,
                i = void 0,
                r = this.closest(".js-notifications-browser"),
                a = r.querySelectorAll(".unread");
            for (e = 0, t = a.length; t > e; e++) {
                var s = a[e];
                s.classList.remove("unread"), s.classList.add("read")
            }
            return null != (n = r.querySelector(".js-mark-visible-as-read")) && n.classList.add("mark-all-as-read-confirmed"), null != (i = r.querySelector(".js-mark-as-read-confirmation")) ? i.classList.add("mark-all-as-read-confirmed") : void 0
        }), a["default"](document).on("ajaxSuccess", ".js-mark-remaining-as-read", function() {
            var e = void 0,
                t = void 0,
                n = this.closest(".js-notifications-browser");
            return null != (e = n.querySelector(".js-mark-remaining-as-read")) && e.classList.add("d-none"), null != (t = n.querySelector(".js-mark-remaining-as-read-confirmation")) ? t.classList.remove("d-none") : void 0
        }), n.on("navigation:keydown", ".js-notification", function(t) {
            switch (t.detail.hotkey) {
                case "I":
                case "e":
                case "y":
                    e.submit(this.querySelector(".js-delete-notification")), t.preventDefault(), t.stopPropagation();
                    break;
                case "M":
                case "m":
                    e.submit(this.querySelector(".js-mute-notification")), t.preventDefault(), t.stopPropagation()
            }
        }), a["default"](document).on("navigation:keyopen", ".js-notification", function() {
            r(this)
        }), a["default"](document).on("ajaxSend", ".js-notifications-subscription", function() {
            this.querySelector(".js-spinner").classList.remove("d-none")
        }), a["default"](document).on("ajaxComplete", ".js-notifications-subscription", function() {
            this.querySelector(".js-spinner").classList.add("d-none")
        })
    }), define("github/legacy/pages/notifications/subscriptions", ["../../../typecast", "../../../updatable-content", "../../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            s["default"](".js-setting-toggle .js-status-indicator").removeClass("status-indicator-success").removeClass("status-indicator-loading").removeClass("status-indicator-failed")
        }
        var a = i(e),
            s = i(n);
        s["default"](document).on("ajaxSend", ".js-setting-toggle", function() {
            r(), s["default"](this).find(".js-status-indicator").addClass("status-indicator-loading")
        }), s["default"](document).on("ajaxError", ".js-setting-toggle", function() {
            r(), s["default"](this).find(".js-status-indicator").addClass("status-indicator-failed")
        }), s["default"](document).on("ajaxSuccess", ".js-setting-toggle", function() {
            r(), s["default"](this).find(".js-status-indicator").addClass("status-indicator-success")
        }), s["default"](document).on("change", ".js-participating-email input, .js-subscribed-email input", function() {
            s["default"](".js-participating-email input:checked")[0] || s["default"](".js-subscribed-email input:checked")[0] ? s["default"](".js-notification-emails").removeClass("d-none") : s["default"](".js-notification-emails").addClass("d-none")
        }), s["default"](document).on("ajaxSend", ".js-unignore-form, .js-ignore-form", function() {
            s["default"](this).closest(".js-subscription-row").addClass("loading")
        }), s["default"](document).on("ajaxError", ".js-unignore-form, .js-ignore-form", function() {
            s["default"](this).closest(".js-subscription-row").removeClass("loading"), s["default"](this).find(".btn-sm").addClass("btn-danger").attr("title", "There was a problem unignoring this repo.")
        }), s["default"](document).on("ajaxSuccess", ".js-unignore-form", function() {
            s["default"](this).closest(".js-subscription-row").removeClass("loading").addClass("unsubscribed")
        }), s["default"](document).on("ajaxSuccess", ".js-ignore-form", function() {
            s["default"](this).closest(".js-subscription-row").removeClass("loading unsubscribed")
        }), s["default"](document).on("ajaxSend", ".js-unsubscribe-form, .js-subscribe-form", function() {
            s["default"](this).closest(".js-subscription-row").addClass("loading")
        }), s["default"](document).on("ajaxError", ".js-unsubscribe-form, .js-subscribe-form", function() {
            s["default"](this).closest(".js-subscription-row").removeClass("loading"), s["default"](this).find(".btn-sm").addClass("btn-danger").attr("title", "There was a problem with unsubscribing :(")
        }), s["default"](document).on("ajaxSuccess", ".js-unsubscribe-form", function() {
            s["default"](this).closest(".js-subscription-row").removeClass("loading").addClass("unsubscribed")
        }), s["default"](document).on("ajaxSuccess", ".js-subscribe-form", function() {
            s["default"](this).closest(".js-subscription-row").removeClass("loading unsubscribed")
        }), s["default"](document).on("ajaxSuccess", ".js-thread-subscription-status", function(e, n, i, r) {
            t.replaceContent(a["default"](document.querySelector(".js-thread-subscription-status"), HTMLElement), r)
        })
    }), define("github/legacy/pages/oauth", ["../../typecast", "../../jquery", "delegated-events", "../../observe"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            return e.querySelectorAll(".js-integrations-install-repo-picked .js-repository-picker-result").length
        }

        function s(e) {
            return a(e) > 0
        }

        function o(e) {
            var t = +e.getAttribute("data-max-repos");
            return t ? a(e) >= t : void 0
        }

        function u(e) {
            var t = e.querySelector(".js-all-repositories-radio");
            return t.checked || s(e)
        }

        function l() {
            var e = 0;
            0 !== document.querySelectorAll(".js-integrations-install-repo-picked:not(.d-none)").length && (e = document.querySelectorAll(".js-repository-picker-result:not(.d-none)").length);
            var t = "";
            if (e > 0) {
                var n = e > 1 ? "repositories" : "repository";
                t = "Selected " + e + " " + n
            }
            return d["default"](".js-integration-total-repos").text(t)
        }
        var c = r(e),
            d = r(t);
        d["default"](document).on("ajaxSend", ".js-toggler-container .js-set-approval-state", function() {
            return this.closest(".js-toggler-container").classList.add("loading")
        }), d["default"](document).on("ajaxComplete", ".js-toggler-container .js-set-approval-state", function() {
            return this.closest(".js-toggler-container").classList.remove("loading")
        }), d["default"](document).on("ajaxSuccess", ".js-toggler-container .js-set-approval-state", function(e, t, n, i) {
            if (1 === i.approval_state) this.closest(".js-toggler-container").classList.add("on");
            else if (2 === i.approval_state) {
                var r = this.closest(".js-toggler-container");
                r.classList.add("revoked"), r.classList.remove("on")
            }
        }), d["default"](document).on("ajaxSuccess", ".js-request-approval-facebox-form", function() {
            var e = this.getAttribute("data-container-id");
            return document.getElementById(e).classList.add("on"), n.fire(document, "facebox:close")
        }), i.observe(".js-integrations-install-form", function() {
            function e() {
                return n.disabled = !u(this), null !== t.querySelector(".flash") ? (a.disabled = o(this), t.querySelector(".flash").classList.toggle("d-none", !o(this))) : void 0
            }
            var t = this,
                n = t.querySelector(".js-integrations-install-form-submit"),
                i = t.querySelector(".js-autocomplete"),
                r = i.getAttribute("data-search-url"),
                a = t.querySelector(".js-autocomplete-field");
            this.addEventListener("change", e), e.call(this), d["default"](document).on("click", ".js-repository-picker-remove", function() {
                var n = this.closest(".js-repository-picker-result");
                return n.remove(), 0 === c["default"](document.querySelector(".js-integrations-install-repo-picked"), HTMLElement).children.length && c["default"](document.querySelector(".js-min-repository-error"), HTMLElement).classList.remove("d-none"), l(), e.call(t)
            }), d["default"](document).on("focus", ".js-integrations-install-repo-picker .js-autocomplete-field", function() {
                return c["default"](document.querySelector(".js-select-repositories-radio"), HTMLInputElement).checked = !0, e.call(t)
            }), d["default"](document).on("autocomplete:autocompleted:changed", ".js-integrations-install-repo-picker", function() {
                var e = void 0,
                    t = void 0,
                    n = r,
                    a = document.querySelectorAll(".js-integrations-install-repo-picked .js-selected-repository-field");
                for (e = 0, t = a.length; t > e; e++) {
                    var s = c["default"](a[e], HTMLInputElement);
                    n += ~n.indexOf("?") ? "&" : "?", n += s.name + "=" + encodeURIComponent(s.value)
                }
                return i.setAttribute("data-search-url", n)
            }), d["default"](document).on("autocomplete:result", ".js-integrations-install-repo-picker", function(n, i) {
                var r = this.querySelector("#repo-result-" + i),
                    s = t.querySelector(".js-integrations-install-repo-picked");
                return r.classList.remove("d-none"), s.insertBefore(r, s.firstChild), a.value = "", t.querySelector(".js-autocomplete-results").innerHTML = "", c["default"](document.querySelector(".js-min-repository-error"), HTMLElement).classList.add("d-none"), l(), e.call(t)
            }), d["default"](document).on("click", ".js-all-repositories-radio", function() {
                c["default"](document.querySelector(".js-integrations-install-repo-picked, .js-min-repository-error"), HTMLElement).classList.add("d-none"), l()
            }), d["default"](document).on("click", ".js-select-repositories-radio", function() {
                c["default"](document.querySelector(".js-integrations-install-repo-picked"), HTMLElement).classList.remove("d-none"), l()
            }), d["default"](document).on("submit", ".js-integrations-install-form", function() {
                this.querySelector(".js-all-repositories-radio").checked ? Array.from(this.querySelectorAll('input[name="repository_ids[]"]')).forEach(function(e) {
                    return e.remove()
                }) : d["default"](".js-autocomplete-results").empty()
            })
        })
    }), define("github/legacy/pages/orgs", ["delegated-events"], function(e) {
        e.on("submit", ".org form[data-results-container]", function(e) {
            e.preventDefault()
        })
    }), define("github/legacy/pages/orgs/invitations/new", ["../../../../jquery", "../../../../visible", "../../../../fetch"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            return a["default"](Array.from(a["default"](".js-invitation-toggle-team:checked")).filter(s["default"]))
        }
        var a = i(e),
            s = i(t);
        a["default"](document).on("click", ".js-invitations-team-suggestions-view-all", function() {
            return n.fetchText(this.href).then(function(e) {
                return function(t) {
                    var n = r().map(function() {
                            return this.value
                        }),
                        i = a["default"](e).closest("ul");
                    return i.html(t), n.each(function() {
                        return i.find(".js-invitation-toggle-team[value=" + this + "]").prop("checked", !0)
                    })
                }
            }(this)), !1
        })
    }), define("github/legacy/pages/orgs/invitations/reinstate", ["../../../../invariant", "delegated-events", "../../../../observe"], function(e, t, n) {
        function i() {
            var t = document.querySelector(".js-org-reinstate-forms"),
                n = document.querySelectorAll(".js-org-reinstate-option:checked");
            if (t && 1 === n.length) {
                var i = n[0].getAttribute("data-form");
                e.invariant(null != i, "Missing attribute `data-form`");
                for (var r = t.getElementsByClassName("js-togglable-form"), a = 0; a < r.length; a++) {
                    var s = r[a];
                    s.classList.add("d-none")
                }
                var o = document.getElementById(i);
                o.classList.remove("d-none")
            }
        }
        t.on("change", ".js-org-reinstate-option", i), n.observe(".js-org-reinstate-forms", i)
    }), define("github/legacy/pages/orgs/members/change-role", ["delegated-events"], function(e) {
        e.on("change", ".js-change-org-role-selector", function(e) {
            var t = e.target.form.querySelector(".js-change-org-role-submit");
            t && (t.disabled = !1)
        })
    }), define("github/org-sidebar-stats", ["exports", "./inflector"], function(e, t) {
        function n(e, n) {
            var i = arguments.length <= 2 || void 0 === arguments[2] ? 0 : arguments[2],
                r = e.querySelector("." + n),
                a = r.parentNode.querySelector(".js-stat-label");
            r.textContent = i, t.pluralizeNode(i, a)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.updateStat = n
    }), define("github/legacy/pages/orgs/members/index", ["../../../../invariant", "../../../../fetch", "delegated-events", "../../../../form", "../../../../org-sidebar-stats", "../../../../focused", "../../../../throttled-input", "../../../../jquery", "../../../../sudo", "../../../../setimmediate", "../../../../facebox"], function(e, t, n, i, r, a, s, o, u, l, c) {
        function d(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function f() {
            var e = Array.from(document.querySelectorAll(".js-bulk-actions-container .js-bulk-actions-toggle:checked"));
            return e.map(function(e) {
                return e.closest(".js-bulk-actions-item").getAttribute("data-bulk-actions-id")
            }).sort()
        }
        var h = d(o),
            m = d(u),
            v = d(l),
            p = d(c);
        n.on("click", ".js-member-remove-confirm-button", function(e) {
            e.preventDefault();
            var n = new URL(this.getAttribute("data-url"), window.location.origin),
                i = new URLSearchParams(n.search.slice(1)),
                r = this.getAttribute("data-member-id");
            if (r) i.append("member_ids[]", r);
            else
                for (var a = f(), s = 0; s < a.length; s++) {
                    var o = a[s];
                    i.append("member_ids[]", o)
                }
            n.search = i.toString(), p["default"](function() {
                t.fetchText(n).then(p["default"])
            })
        }), n.on("click", ".js-member-search-filter", function(t) {
            t.preventDefault();
            var n = this.getAttribute("data-filter"),
                i = this.closest(".js-select-menu").getAttribute("data-filter-on"),
                r = document.querySelector(".js-member-filter-field");
            e.invariant(r instanceof HTMLInputElement, "`.js-member-filter-field` must be an input");
            var a = r.value,
                o = new RegExp(i + ":[a-z]+"),
                u = a.toString().trim().replace(o, "");
            r.value = (u + " " + n).replace(/\s\s/, " "), r.focus(), s.dispatchThrottledInputEvent(r)
        }), h["default"](document).on("ajaxSend ajaxComplete", ".js-add-team-member-or-repo-form", function(e) {
            this === e.target && this.classList.toggle("is-sending", "ajaxSend" === e.type)
        });
        var g = navigator.userAgent.match(/Macintosh/) ? "meta" : "ctrl";
        a.onFocusedKeydown(document, ".js-add-team-member-or-repo-form .js-autocomplete-field", function() {
            return function(e) {
                return "enter" === e.hotkey || e.hotkey === g + "+enter" ? e.preventDefault() : void 0
            }
        }), h["default"](document).on("autocomplete:result", ".js-bulk-add-team-form .js-autocomplete-field", function(e) {
            var n = this,
                i = h["default"](this).data("autocompleted");
            i.indexOf("/") > 0 && ! function() {
                var i = n.form.action,
                    r = n.form.method,
                    a = new FormData(n.form);
                m["default"]().then(function() {
                    p["default"](function() {
                        t.fetchText(i, {
                            method: r,
                            body: a
                        }).then(p["default"])
                    })
                }), e.stopPropagation()
            }()
        }), h["default"](document).on("autocomplete:result", ".js-add-team-member-or-repo-form", function() {
            var e = this;
            v["default"](function() {
                return i.submit(e)
            })
        }), h["default"](document).on("ajaxSuccess", ".js-add-team-member-or-repo-form", function(e, t) {
            var n = void 0,
                i = void 0,
                a = void 0,
                s = void 0;
            try {
                s = JSON.parse(t.responseText)
            } catch (o) {}
            s ? (n = h["default"](s.list_item_html), s.stat_count_class && null != s.item_count && r.updateStat(document.body, s.stat_count_class, s.item_count)) : n = h["default"](t.responseText);
            var u = h["default"](".js-member-list");
            this.querySelector(".js-autocomplete-field").value = "";
            var l = n.attr("data-login");
            if (l) {
                var c = u.children();
                for (i = 0, a = c.length; a > i; i++) {
                    var d = c[i];
                    if (d.getAttribute("data-login") === l) return
                }
            }
            u.prepend(n);
            var f = !u.children().length;
            return u.closest(".js-org-section").toggleClass("is-empty", f), u.siblings(".js-subnav").addClass("subnav-bordered")
        }), h["default"](document).on("ajaxSuccess", ".js-remove-team-repository", function(e, t) {
            var n = h["default"](this),
                i = n.closest(".js-org-section"),
                a = i.find(".js-org-list");
            n.closest(".js-org-repo").remove();
            var s = !a.children().length;
            i.toggleClass("is-empty", s), s && (a.removeClass("table-list-bordered"), a.siblings(".js-subnav").removeClass("subnav-bordered"));
            var o = void 0;
            try {
                o = JSON.parse(t.responseText)
            } catch (u) {}
            return o && null != o.item_count ? r.updateStat(document.body, "js-repositories-count", o.item_count) : void 0
        }), h["default"](document).on("ajaxError", ".js-add-team-member-or-repo-form, .js-remove-team-repository", function(e, t) {
            if (!/<html/.test(t.responseText)) {
                var n = h["default"](".js-member-list, .js-member-listings-container").siblings(".js-blankslate"),
                    i = void 0;
                try {
                    var r = JSON.parse(t.responseText);
                    i = r.message_html
                } catch (a) {
                    i = h["default"](t.responseText)
                }
                return h["default"](".flash-messages").remove(), n.before(i), !1
            }
        })
    }), define("github/legacy/pages/orgs/members/show", ["../../../../fetch", "delegated-events", "../../../../facebox"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(n);
        t.on("click", ".js-remove-member-button", function(t) {
            t.preventDefault();
            var n = new URL(this.getAttribute("data-url"), window.location.origin),
                i = new URLSearchParams(n.search.slice(1));
            i.append("member_ids[]", this.getAttribute("data-user-id")), i.append("redirect_to_path", this.getAttribute("data-redirect-to-path")), n.search = i.toString(), r["default"](function() {
                e.fetchText(n).then(r["default"])
            })
        })
    }), define("github/legacy/pages/orgs/migration/customize_member_privileges", ["../../../../typecast", "../../../../jquery", "../../../../debounce"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            var e = l["default"](document.querySelector(".js-save-member-privileges-button-container"), HTMLElement);
            return e.classList.toggle("member-privilege-radios-preserved", u())
        }

        function a() {
            return "" === l["default"](document.querySelector(".js-customize-member-privileges-default-repository-permission-radio:checked"), HTMLInputElement).value
        }

        function s() {
            return "0" === l["default"](document.querySelector(".js-customize-member-privileges-repository-creation-radio:checked"), HTMLInputElement).value
        }

        function o() {
            return "secret" === l["default"](document.querySelector(".js-customize-member-privileges-team-privacy-radio:checked"), HTMLInputElement).value
        }

        function u() {
            return a() && s() && o()
        }
        var l = i(e),
            c = i(t),
            d = i(n);
        c["default"](document).on("change", ".js-customize-member-privileges-default-repository-permission-radio", function() {
            var e = l["default"](document.querySelector(".js-migrate-ability-list-item-default-repository-permission"), HTMLElement);
            return e.classList.toggle("migrate-ability-not-possible", a()), r()
        }), c["default"](document).on("change", ".js-customize-member-privileges-repository-creation-radio", function() {
            var e = l["default"](document.querySelector(".js-migrate-ability-list-item-members-can-create-repositories"), HTMLElement);
            return e.classList.toggle("migrate-ability-not-possible", s()), r()
        }), c["default"](document).on("change", ".js-customize-member-privileges-team-privacy-radio", function() {
            var e = l["default"](document.querySelector(".js-migrate-ability-list-item-team-privacy"), HTMLElement);
            return e.classList.toggle("migrate-ability-not-possible", o()), r()
        }), c["default"](function() {
            var e = document.querySelector(".js-org-migration-settings-sidebar");
            if (null != e) {
                var t = e.getBoundingClientRect();
                if (null != t) {
                    var n = 16,
                        i = t.top + window.pageYOffset - n,
                        a = e.style.position,
                        s = e.style.top,
                        o = e.style.left,
                        u = e.style.width,
                        l = d["default"](function() {
                            var r = e.parentNode;
                            if (null != r && r instanceof HTMLElement) {
                                var l = r.getBoundingClientRect(),
                                    c = l.right - t.width;
                                return window.pageYOffset >= i ? (e.style.position = "fixed", e.style.top = n + "px", e.style.left = c + "px", e.style.width = "250px") : (e.style.position = a, e.style.top = s, e.style.left = o, e.style.width = u)
                            }
                        }, 5);
                    return window.addEventListener("scroll", l, {
                        passive: !0
                    }), window.addEventListener("resize", l, {
                        passive: !0
                    }), r()
                }
            }
        })
    }), define("github/legacy/pages/orgs/migration/index", ["../../../../throttled-input", "../../../../typecast", "../../../../fetch", "../../../../observe"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e, t) {
            return s["default"](document.querySelector(".js-rename-owners-team-button"), HTMLElement).classList.toggle("disabled", !e), s["default"](document.querySelector(".js-rename-owners-team-errors"), HTMLElement).innerHTML = t, s["default"](document.querySelector(".js-rename-owners-team-note"), HTMLElement).classList.toggle("d-none", "" !== t)
        }
        var s = r(t);
        i.observe(".js-rename-owners-team-input", function() {
            e.addThrottledInputEventListener(this, function() {
                var e = this.form,
                    t = this.value.trim().toLowerCase();
                if ("owners" === t || "" === t) return a(!1, "");
                e.classList.add("is-sending");
                var i = new URL(this.getAttribute("data-check-url"), window.location.origin),
                    r = new URLSearchParams(i.search.slice(1));
                return r.append("name", t), i.search = r.toString(), n.fetchText(i).then(function(t) {
                    t = t.trim();
                    var n = "" === t;
                    return e.classList.remove("is-sending"), a(n, t)
                })
            })
        })
    }), define("github/legacy/pages/orgs/new", ["../../../focused", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        e.onFocusedInput(document, ".js-new-organization-name", function() {
            var e = this.closest("dd").querySelector(".js-field-hint-name");
            if (e) return function() {
                return "innerText" in e ? e.innerText = this.value : e.textContent = this.value
            }
        }), i["default"](document).on("ajaxSend", ".js-org-list-item .js-org-remove-item", function() {
            return this.closest(".js-org-list-item").classList.add("d-none")
        }), i["default"](document).on("ajaxSuccess", ".js-org-list-item .js-org-remove-item", function() {
            return this.closest(".js-org-list-item").remove()
        }), i["default"](document).on("ajaxError", ".js-org-list-item .js-org-remove-item", function() {
            this.closest(".js-org-list-item").classList.remove("d-none");
            var e = this.getAttribute("data-error-message");
            return e ? alert(e) : void 0
        })
    }), define("github/legacy/pages/orgs/per_seat", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function n(e) {
            var t = void 0,
                n = e.selectors;
            for (t in n) {
                var r = n[t];
                i["default"](t).text(r)
            }
            var a = 100 === e.filled_seats_percent;
            return i["default"](".js-live-update-seats-percent").css("width", e.filled_seats_percent + "%"), i["default"](".js-need-more-seats").toggleClass("d-none", !a), i["default"](".js-add-team-member-or-repo-form").toggleClass("d-none", a)
        }
        var i = t(e);
        i["default"](document).on("ajaxSuccess", ".js-per-seat-invite-field, .js-per-seat-invite .js-org-remove-item", function(e, t) {
            return n(JSON.parse(t.responseText))
        })
    }), define("github/legacy/pages/orgs/repositories/index", ["delegated-events", "../../../../fetch", "../../../../observe", "../../../../hotkey", "../../../../facebox"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var s = a(i),
            o = a(r);
        n.observe(".js-repository-fallback-search", function() {
            this.addEventListener("keypress", function(e) {
                if ("enter" === s["default"](e)) {
                    var t = new URL(this.getAttribute("data-url"), window.location.origin),
                        n = new URLSearchParams(t.search.slice(1)),
                        i = n.get("q") || "";
                    n.set("q", i + " " + this.value), t.search = n.toString(), window.location = t.toString()
                }
            })
        }), e.on("click", ".js-team-repo-higher-access", function() {
            var e = this.getAttribute("data-url");
            o["default"](function() {
                t.fetchText(e).then(o["default"])
            })
        })
    }), define("github/legacy/pages/orgs/repositories/permission-select", ["../../../../form", "../../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("selectmenu:selected", ".js-select-repo-permission", function() {
            e.submit(this)
        }), i["default"](document).on("ajaxSend", ".js-select-repo-permission", function() {
            return this.classList.remove("was-successful")
        }), i["default"](document).on("ajaxSuccess", ".js-select-repo-permission", function(e, t, n, i) {
            var r = void 0;
            return this.classList.add("was-successful"), null != (r = this.closest(".js-org-repo")) ? r.classList.toggle("with-higher-access", i.members_with_higher_access) : void 0
        })
    }), define("github/legacy/pages/orgs/security_settings/index", ["../../../../observe", "../../../../facebox"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        e.observe(".js-two-factor-needs-enforced", function() {
            this.addEventListener("submit", function(e) {
                var t = e.target,
                    n = t.querySelector("input[type=checkbox]");
                n.checked && (e.preventDefault(), i["default"]({
                    div: "#confirm-2fa-requirement"
                }))
            })
        }), e.observe(".js-two-factor-enforcement-poller", function() {
            var e = this.getAttribute("data-redirect-url");
            this.addEventListener("load", function() {
                window.location.href = e
            })
        })
    }), define("github/legacy/pages/orgs/settings/change-default-repository-permission", ["../../../../invariant", "../../../../form", "../../../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(n);
        r["default"](document).on("click", ".js-change-default-repository-permission-confirm", function(n) {
            n.preventDefault();
            var i = document.querySelector(".js-change-default-repository-permission-form");
            e.invariant(i instanceof HTMLFormElement, "`.js-change-default-repository-permission-form` must be a form"), t.submit(i)
        })
    }), define("github/warn-unsaved-changes", ["./has-interactions", "./observe"], function(e, t) {
        function n() {
            e.hasDirtyFields(this) ? i(this) : r()
        }

        function i(e) {
            var t = e.getAttribute("data-warn-unsaved-changes") || "Changes you made may not be saved.";
            window.onbeforeunload = function(e) {
                return e.returnValue = t, t
            }
        }

        function r() {
            window.onbeforeunload = null
        }
        t.observe("[data-warn-unsaved-changes]", function(e) {
            e.addEventListener("input", n), e.addEventListener("change", n), e.addEventListener("submit", r)
        })
    }), define("github/legacy/pages/orgs/settings/security", ["../../../../invariant", "delegated-events", "../../../../facebox", "../../../../warn-unsaved-changes"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            return document.querySelector(".js-saml-provider-settings-form")
        }

        function a() {
            return r().querySelector(".js-saml-form-inputs")
        }

        function s() {
            return document.querySelector(".js-saml-mode")
        }

        function o() {
            return document.querySelector(".js-org-saml-confirm-enforcement-hidden")
        }

        function u() {
            var t = document.querySelector(".js-org-saml-previously-enforced");
            return e.invariant(t instanceof HTMLInputElement, "`.js-org-saml-previously-enforced` must be HTMLInputElement"), "1" === t.value
        }

        function l() {
            return "0" === o().value
        }

        function c() {
            var t = document.querySelector(".js-org-has-unlinked-saml-members");
            return e.invariant(t instanceof HTMLInputElement, "`.js-org-has-unlinked-saml-members` must be HTMLInputElement"), "1" === t.value
        }

        function d(e) {
            e && e.classList.remove("d-none")
        }

        function f(e) {
            e && e.classList.add("d-none")
        }

        function h() {
            return "save_settings" === s().value
        }

        function m() {
            return "test_settings" === s().value
        }

        function v() {
            var t = document.querySelector(".js-org-enable-saml");
            return e.invariant(t instanceof HTMLInputElement, "`.js-org-enable-saml` must be an HTMLInputElement"), t.checked
        }

        function p() {
            var t = document.querySelector(".js-org-saml-enforce");
            return e.invariant(t instanceof HTMLInputElement, "`.js-org-saml-enforce` must be an HTMLInputElement"), t.checked
        }

        function g() {
            b["default"]({
                div: "#disable-saml-confirmation"
            })
        }
        var b = i(n);
        t.on("click", ".js-org-enable-saml", function(e) {
            e.currentTarget.checked ? d(a()) : f(a())
        }), t.on("click", ".js-saml-submit", function(e) {
            s().value = e.currentTarget.name
        }), t.on("click", ".js-org-saml-confirm-enforce-button", function() {
            o().value = "true", r().submit()
        }), t.on("submit", ".js-saml-provider-settings-form", function(e) {
            e.preventDefault(), h() ? v() ? p() && l() && !u() && c() ? b["default"]({
                div: "#enforce-saml-confirmation"
            }) : r().submit() : g() : m() && r().submit()
        }), document.addEventListener("facebox:close", function() {
            var e = document.querySelector("#facebox .js-disable-saml-confirmation");
            if (e) {
                var t = document.querySelector(".js-org-enable-saml");
                t && t instanceof HTMLInputElement && (t.checked = !0, d(a()))
            }
        })
    }), define("github/legacy/pages/orgs/team", ["../../../typecast", "../../../fetch", "delegated-events", "../../../jquery", "../../../sudo"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var s = a(e),
            o = a(i),
            u = a(r);
        o["default"](document).on("autocomplete:autocompleted:changed", ".js-team-add-user-name", function() {
            var e = o["default"](".js-team-add-user-button")[0];
            e.disabled = !o["default"](this).data("autocompleted")
        }), n.on("click", ".js-team-remove-user", function(e) {
            e.preventDefault(), o["default"](".js-team-add-user-form").removeClass("d-none"), o["default"](".js-team-add-user-name").focus(), this.closest("li").remove()
        }), n.on("click", ".js-team-add-user-button", function(e) {
            e.preventDefault();
            var n = this.closest(".js-team-add-user-form"),
                i = n.querySelector(".js-team-add-user-name"),
                r = i.value;
            if (r && o["default"](i).data("autocompleted")) {
                i.value = "";
                for (var a = s["default"](document.querySelector(".js-team-user-logins"), HTMLElement), l = a.querySelectorAll("li"), c = 0; c < l.length; c++) {
                    var d = l[c];
                    if (d.getAttribute("data-login") === r) return
                }
                u["default"]().then(function() {
                    var e = new URL(n.getAttribute("data-template-url"), window.location.origin),
                        s = new URLSearchParams(e.search.slice(1));
                    s.append("member", r), e.search = s.toString(), t.fetchSafeDocumentFragment(document, e).then(function(e) {
                        a.appendChild(e), o["default"](".js-login-field").prop("disabled", !1), n.classList.add("d-none")
                    }), i.focus()
                })
            }
        })
    }), define("github/legacy/pages/orgs/teams/change-visibility", ["delegated-events"], function(e) {
        e.on("change", ".js-change-team-visibility-selector", function(e) {
            var t = e.target.form.querySelector(".js-change-team-visibility-submit");
            t && (t.disabled = !1)
        })
    }), define("github/legacy/pages/orgs/teams/import", ["../../../../typecast", "../../../../throttled-input", "../../../../observe", "../../../../jquery"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var a = r(e),
            s = r(i);
        s["default"](document).on("ajaxSend", ".js-ldap-import-groups-container", function(e, t) {
            return t.setRequestHeader("X-Context", "import")
        }), s["default"](document).on("autocomplete:autocompleted:changed", ".js-team-ldap-group-field", function() {
            var e = void 0;
            (e = this.closest(".js-ldap-group-adder")) && (e.classList.remove("is-exists"), e.querySelector(".js-ldap-group-adder-button").disabled = !s["default"](this).data("autocompleted"))
        }), s["default"](document).on("navigation:open", ".js-team-ldap-group-autocomplete-results .js-navigation-item", function() {
            var e = s["default"](this).closest(".js-ldap-group-adder"),
                t = s["default"](this).attr("data-dn");
            return e.find(".js-team-ldap-dn-field").val(t), s["default"](this).closest(".js-ldap-import-groups-container").find(".js-ldap-group-dn").map(function(n, i) {
                s["default"](i).text() === t && (e.addClass("is-exists"), e[0].querySelector(".js-ldap-group-adder-button").disabled = !0)
            })
        }), s["default"](document).on("ajaxSend", ".js-import-container", function() {
            this.classList.add("is-importing"), this.querySelector(".js-ldap-group-adder-button").disabled = !0
        }), s["default"](document).on("ajaxComplete", ".js-import-container", function() {
            return s["default"](this).removeClass("is-importing")
        }), s["default"](document).on("ajaxSuccess", ".js-ldap-group-adder", function(e, t, n, i) {
            return s["default"](this).closest(".js-ldap-import-groups-container").removeClass("is-empty").find(".js-ldap-imported-groups").prepend(s["default"](i)), this.reset(), s["default"](this).find(".js-team-ldap-group-field").focus(), this.querySelector(".js-ldap-group-adder-button").disabled = !0, s["default"](".js-import-form-actions").removeClass("d-none")
        }), s["default"](document).on("submit", ".js-team-remove-group", function() {
            this.closest(".js-team").classList.add("is-removing"), a["default"](document.querySelector(".js-team-ldap-group-field"), HTMLElement).focus()
        }), s["default"](document).on("ajaxSuccess", ".js-team-remove-group", function() {
            this.closest(".js-team").remove(), document.querySelector(".js-team:not(.is-removing)") || (a["default"](document.querySelector(".js-ldap-import-groups-container"), HTMLElement).classList.add("is-empty"), a["default"](document.querySelector(".js-import-form-actions"), HTMLElement).classList.add("d-none"))
        }), s["default"](document).on("ajaxError", ".js-team-remove-group", function() {
            this.closest(".js-team").classList.remove("is-removing")
        }), s["default"](document).on("click", ".js-edit-team", function(e) {
            return s["default"](this).closest(".js-team").hasClass("is-removing") ? !1 : (e.preventDefault(), s["default"](this).closest(".js-team").addClass("is-editing"), s["default"](this).closest(".js-team").find(".js-team-name-field").focus())
        }), s["default"](document).on("click", ".js-save-button", function() {
            return s["default"](this).hasClass("disabled") ? !1 : s["default"](this).closest(".js-team").addClass("is-sending")
        }), s["default"](document).on("click", ".js-cancel-team-edit", function(e) {
            e.preventDefault();
            var t = s["default"](this).closest(".js-team").removeClass("is-editing"),
                n = t.find(".js-team-form").removeClass("is-exists");
            return n.find(".js-slug").text(n.find(".js-slug").attr("data-original-slug")), n[0].reset()
        }), s["default"](document).on("ajaxSuccess", ".js-team-form:not(.is-checking)", function(e, t, n, i) {
            return t.nameCheck ? void 0 : s["default"](this).closest(".js-team").removeClass("is-editing").replaceWith(s["default"](i))
        }), s["default"](document).on("ajaxSuccess", ".js-team-form.is-checking", function(e, t, n, i) {
            var r = void 0,
                a = s["default"](this).removeClass("is-checking");
            return "function" == typeof(r = a.find(".js-team-name-field")).removeData && r.removeData("autocheck-xhr"), i.error ? (a.find(".js-save-button").addClass("disabled"), "exists" === i.error ? (a.addClass("is-exists"), a.find(".js-slug").html(i.slug)) : void 0) : (a.find(".js-slug").html(i.slug), a.find(".js-save-button").removeClass("disabled"))
        }), s["default"](document).on("ajaxError", ".js-team-form", function(e, t) {
            return t.nameCheck && "abort" === t.statusText ? !1 : void 0
        }), n.observe(".js-team-name-field", function() {
            t.addThrottledInputEventListener(this, function() {
                var e = void 0,
                    t = s["default"](this),
                    n = t.closest(".js-team-form");
                null != (e = t.data("autocheck-xhr")) && e.abort(), n.removeClass("is-exists").addClass("is-checking"), n.find(".js-save-button").addClass("disabled");
                var i = s["default"].ajax({
                    url: t.attr("data-check-url"),
                    type: "GET",
                    context: this,
                    data: {
                        name: this.value
                    }
                });
                return i.nameCheck = !0, t.data("autocheck-xhr", i)
            })
        })
    }), define("github/legacy/pages/orgs/teams/index", ["../../../../typecast", "../../../../throttled-input", "delegated-events"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(e);
        n.on("click", ".js-team-search-filter", function(e) {
            e.preventDefault();
            var n = this.getAttribute("data-filter"),
                i = this.closest(".js-select-menu").getAttribute("data-filter-on"),
                a = r["default"](document.querySelector(".js-team-search-field"), HTMLInputElement),
                s = a.value,
                o = new RegExp(i + ":[a-z]+"),
                u = s.toString().trim().replace(o, "");
            a.value = (u + " " + n).replace(/\s\s/, " "), a.focus(), t.dispatchThrottledInputEvent(a)
        })
    }), define("github/legacy/pages/orgs/teams/new", ["../../../../throttled-input", "../../../../fetch", "../../../../observe"], function(e, t, n) {
        function i(e) {
            var n = e.value.trim(),
                i = e.form;
            i.classList.add("is-sending"), i.classList.remove("is-name-check-fail"), i.classList.remove("is-name-check-success");
            var r = new URL(e.getAttribute("data-check-url"), window.location.origin),
                a = new URLSearchParams(r.search.slice(1));
            a.append("name", n), r.search = a.toString(), t.fetchText(r).then(function(t) {
                var r = void 0;
                i.classList.remove("is-sending"), i.querySelector(".js-team-name-errors").innerHTML = t || "";
                var a = null != (r = e.getAttribute("data-original")) ? r.trim() : void 0,
                    s = a && n === a,
                    o = !!i.querySelector(".js-error"),
                    u = (o || !n) && !s;
                return i.querySelector(".js-create-team-button").disabled = u, i.classList.toggle("is-name-check-fail", o), i.classList.toggle("is-name-check-success", !o && n)
            })
        }
        n.observe(".js-new-team", function() {
            e.addThrottledInputEventListener(this, function() {
                i(this)
            })
        }), n.observe(".js-new-org-team", function() {
            var e = this.querySelector(".js-new-team");
            e.value && i(e)
        })
    }), define("github/legacy/pages/orgs/teams/show", ["../../../../typecast", "delegated-events", "../../../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(e),
            a = i(n);
        t.on("click", ".js-team-description-toggle", function() {
            return a["default"](".js-description-toggler").toggleClass("on")
        }), a["default"](document).on("ajaxComplete", ".js-team-description-form", function() {
            var e = a["default"](".js-team-description-field").val();
            return a["default"](".js-description-toggler").toggleClass("on"), e.trim() ? a["default"](".js-team-description .description").text(e) : a["default"](".js-team-description .description").html("<span class='link'>This team has no description</span>")
        }), a["default"](document).on("ajaxSuccess", ".js-add-team-members-form", function(e, n) {
            var i = a["default"](document).find(".js-member-listings-container");
            return t.fire(document, "facebox:close"), i.html(n.responseText)
        }), t.on("click", ".js-rename-owners-team-next-btn", function() {
            return r["default"](document.querySelector(".js-rename-owners-team-about-content"), HTMLElement).classList.toggle("migrate-owners-content-hidden"), r["default"](document.querySelector(".js-rename-owners-team-rename-form"), HTMLElement).classList.toggle("migrate-owners-content-hidden")
        })
    }), define("github/legacy/pages/orgs/transform", ["../../../observe"], function(e) {
        e.observe(".js-org-transform-poller", function() {
            var e = this.getAttribute("data-redirect-url");
            this.addEventListener("load", function() {
                return window.location.href = e
            })
        })
    }), define("github/legacy/pages/pages_composer", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](function() {
            function e(e, t) {
                var i = n["default"](t),
                    r = e.value;
                e.value = i.text(), i.text(r)
            }
            n["default"]("#load-readme").click(function() {
                function t() {
                    return this.value !== s && a.hide(), i.off("change keyup", t)
                }
                var i = n["default"]("#gollum-editor-body"),
                    r = n["default"]("#editor-body-buffer"),
                    a = n["default"]("#undo-load-readme"),
                    s = r.text();
                e(i, r);
                var o = n["default"](this);
                return this.disabled = !0, o.text(o.attr("data-readme-name") + " loaded"), a.show(), i.on("change keyup", t), !1
            }), n["default"]("#undo-load-readme").click(function() {
                e(n["default"]("#gollum-editor-body"), n["default"]("#editor-body-buffer"));
                var t = n["default"]("#load-readme");
                return t[0].disabled = !1, t.text("Load " + t.attr("data-readme-name")), n["default"](this).hide(), !1
            })
        })
    }), define("github/legacy/pages/pull_requests/composer", ["delegated-events", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        e.on("change", ".js-collab-checkbox", function() {
            Array.from(this.form.querySelectorAll(".errored")).forEach(function(e) {
                return e.classList.remove("errored")
            });
            var e = this.closest(".js-collab-option"),
                t = e.querySelector(".js-status-indicator");
            t.classList.remove("status-indicator-success", "status-indicator-failed"), t.classList.add("status-indicator-loading")
        }), i["default"](document).on("ajaxSuccess", ".js-collab-form", function() {
            Array.from(this.querySelectorAll(".errored")).forEach(function(e) {
                return e.classList.remove("errored")
            }), Array.from(this.querySelectorAll(".status-indicator-loading")).forEach(function(e) {
                e.classList.remove("status-indicator-loading"), e.classList.add("status-indicator-success")
            })
        }), i["default"](document).on("ajaxError", ".js-collab-form", function(e) {
            Array.from(this.querySelectorAll(".status-indicator-loading")).forEach(function(e) {
                e.classList.remove("status-indicator-loading"), e.classList.add("status-indicator-failed");
                var t = e.closest(".js-collab-option");
                t.classList.add("errored");
                var n = t.querySelector(".js-collab-checkbox");
                n.checked = !n.checked
            }), Array.from(this.querySelectorAll(".status-indicator-success")).forEach(function(e) {
                e.classList.remove("status-indicator-success")
            }), e.preventDefault()
        })
    }), define("github/legacy/pages/pull_requests/discussion-timeline-regrouping", ["../../../observe"], function(e) {
        function t(e, t) {
            var n = e.querySelector("table.timeline-commits > tbody"),
                i = t.querySelectorAll("table.timeline-commits > tbody > tr.commit");
            Array.from(i).forEach(function(e) {
                n.appendChild(e)
            }), t.remove()
        }
        e.observe(".discussion-item.discussion-commits", {
            add: function(e) {
                var n = e.previousElementSibling;
                n && n.matches(".discussion-item.discussion-commits") && !e.querySelector(".discussion-item-header") && t(n, e)
            }
        })
    }), define("github/legacy/pages/pull_requests/merge", ["../../../updatable-content", "../../../jquery", "../../../visible"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(t),
            a = i(n);
        r["default"](document).on("details:toggled", ".js-pull-merging", function() {
            var e = r["default"](this).find(".js-merge-pull-request");
            e.toggleClass("is-dirty", Array.from(e).some(a["default"]))
        }), r["default"](document).on("ajaxSuccess", ".js-merge-pull-request", function(t, n, i, a) {
            var s = void 0;
            this.reset(), r["default"](this).removeClass("is-dirty");
            var o = a.updateContent;
            for (s in o) {
                var u = o[s],
                    l = document.querySelector(s);
                l && e.replaceContent(l, u)
            }
        }), r["default"](document).on("session:resume", function(e) {
            e = e.originalEvent;
            var t = document.getElementById(e.detail.targetId);
            if (t) {
                var n = r["default"](t).closest(".js-merge-pull-request");
                n.closest(".js-details-container").addClass("open")
            }
        }), r["default"](document).on("change", ".js-merge-method", function() {
            var e = this.closest(".js-merge-pr");
            e.classList.toggle("is-merging", "merge" === this.value), e.classList.toggle("is-squashing", "squash" === this.value), e.classList.toggle("is-rebasing", "rebase" === this.value);
            for (var t = e.querySelectorAll(".js-merge-pull-request .js-merge-commit-button"), n = 0; n < t.length; n++) {
                var i = t[n];
                i.type = this.value === i.value ? "submit" : "button"
            }
            var r = e.closest(".js-pull-merging"),
                a = r.getAttribute("data-url");
            a = a.replace(/merge_type=(\w+)/, "merge_type=" + this.value), r.setAttribute("data-url", a)
        }), r["default"](document).on("change", ".js-merge-button-toggle", function() {
            var e = void 0,
                t = void 0,
                n = this.closest(".js-merge-pr"),
                i = !this.checked,
                r = n.querySelectorAll(".js-merge-commit-button");
            for (e = 0, t = r.length; t > e; e++) {
                var a = r[e];
                a.disabled = i
            }
        }), r["default"](document).on("navigation:open", ".js-merge-method-menu .js-navigation-item", function() {
            var e = this.closest(".js-merge-pr"),
                t = e.querySelector(".js-merge-title"),
                n = e.querySelector(".js-merge-message");
            t.defaultValue === t.value && (t.defaultValue = this.getAttribute("data-input-title-value")), n.defaultValue === n.value && (n.defaultValue = this.getAttribute("data-input-message-value"))
        }), r["default"](document).on("change", ".js-update-branch-method", function() {
            var e = document.querySelector(".js-update-branch-form");
            e && (e.classList.toggle("is-merging", "merge" === this.value), e.classList.toggle("is-rebasing", "rebase" === this.value))
        })
    }), define("github/legacy/pages/pull_requests/merging_error", ["../../../jquery", "../../../fetch"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e);
        i["default"](document).on("ajaxError", ".js-handle-pull-merging-errors", function(e, t) {
            var n = void 0,
                r = this.closest(".js-pull-merging");
            if (r.classList.add("is-error"), 422 === t.status && (n = t.responseText)) {
                var a = r.querySelector(".js-pull-merging-error");
                i["default"](a).replaceWith(n)
            }
            return !1
        }), i["default"](document).on("click", ".js-pull-merging-refresh", function() {
            var e = this.closest(".js-pull-merging"),
                n = e.getAttribute("data-url");
            return t.fetchText(n).then(function(t) {
                return i["default"](e).replaceWith(t)
            }), !1
        })
    }), define("github/legacy/pages/pull_requests/restore_branch", ["../../../observe", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            a["default"](".pull-request-ref-restore").removeClass("last").last().addClass("last")
        }

        function r() {
            var e = a["default"]("#js-pull-restorable").length;
            a["default"](".js-pull-discussion-timeline").toggleClass("is-pull-restorable", e)
        }
        var a = n(t);
        e.observe(".pull-request-ref-restore", {
            add: i,
            remove: i
        }), e.observe("#js-pull-restorable", {
            add: r,
            remove: r
        })
    }), define("github/legacy/pages/pulls/show", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("pjax:end", function() {
            n["default"](".js-pull-refresh-on-pjax").trigger("socket:message")
        })
    }), define("github/legacy/pages/repositories/fork", ["../../../invariant"], function(e) {
        document.addEventListener("facebox:reveal", function() {
            var t = document.querySelector("#facebox .js-fork-select-fragment");
            if (t) {
                var n = t.getAttribute("data-url");
                e.invariant(n, "Missing attribute `data-url`"), t.setAttribute("src", n)
            }
        })
    }), define("github/legacy/pages/repositories/pulse", ["../../../jquery", "../../../pjax"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e),
            r = n(t);
        i["default"](document).on("change", ".js-pulse-period", function(e) {
            var t = i["default"](e.target).attr("data-url");
            return r["default"]({
                url: t,
                container: "#js-repo-pjax-container"
            })
        })
    }), define("github/legacy/pages/repositories/repo_new", ["../../../form", "../../../jquery", "delegated-events"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var a = i(t),
            s = function() {
                function t() {
                    var t = this;
                    this.validate = r(this.validate, this), this.updateUpsell = r(this.updateUpsell, this), this.selectedPrivacyToggleElement = r(this.selectedPrivacyToggleElement, this), this.handlePrivacyChange = r(this.handlePrivacyChange, this),
                        this.handleOwnerChange = r(this.handleOwnerChange, this), this.elements = {
                            $ownerContainer: a["default"](".js-owner-container"),
                            $iconPreviewPublic: a["default"](".js-icon-preview-public"),
                            $iconPreviewPrivate: a["default"](".js-icon-preview-private"),
                            $upgradeUpsell: a["default"]("#js-upgrade-container").hide(),
                            $upgradeConfirmationCheckbox: a["default"](".js-confirm-upgrade"),
                            $upsells: a["default"](".js-upgrade"),
                            $privacyToggles: a["default"](".js-privacy-toggle"),
                            $privateRadio: a["default"](".js-privacy-toggle[value=false]"),
                            $publicRadio: a["default"](".js-privacy-toggle[value=true]"),
                            $repoNameField: a["default"]("input[type=text].js-repo-name"),
                            $form: a["default"]("#new_repository"),
                            $licenseContainer: a["default"](".js-license-container"),
                            $suggestion: a["default"](".js-reponame-suggestion")
                        }, this.current_login = a["default"]("input[name=owner]:checked").prop("value"), this.privateRepo = this.selectedPrivacyToggleElement() == this.elements.$privateRadio, this.changedPrivacyManually = this.privateRepo, this.elements.$ownerContainer.on("change", "input[type=radio]", this.handleOwnerChange), this.elements.$privacyToggles.on("change", function(e) {
                            return function(t) {
                                return e.handlePrivacyChange(t.targetElement, t)
                            }
                        }(this)), this.elements.$upgradeUpsell.on("change input", "input", this.validate), this.elements.$form.on("repoform:validate", this.validate), this.elements.$suggestion.on("click", function(n) {
                            var i = t.elements.$repoNameField[0];
                            e.changeValue(i, n.target.textContent), n.preventDefault()
                        }), this.handleOwnerChange(), this.validate()
                }
                return t.prototype.handleOwnerChange = function() {
                    this.current_login = a["default"]("input[name=owner]:checked").prop("value"), this.elements.$repoNameField.trigger("change");
                    var e = this.elements.$ownerContainer.find(".select-menu-item.selected");
                    return this.changedPrivacyManually || ("private" === e.attr("data-default") ? this.elements.$privateRadio.prop("checked", "checked").change() : this.elements.$publicRadio.prop("checked", "checked").change()), "yes" === e.attr("data-permission") ? (a["default"](".with-permission-fields").show(), a["default"](".without-permission-fields").hide(), a["default"](".errored").show(), a["default"]("dl.warn").show()) : (a["default"](".with-permission-fields").hide(), a["default"](".without-permission-fields").show(), a["default"](".errored").hide(), a["default"]("dl.warn").hide()), this.updateUpsell(), this.handlePrivacyChange()
                }, t.prototype.handlePrivacyChange = function(e, t) {
                    null == e && (e = this.selectedPrivacyToggleElement()), null == t && (t = null), t && !t.isTrigger && (this.changedPrivacyManually = !0);
                    var n = this.elements.$upgradeUpsell.find(".js-billing-section");
                    return "false" === e.val() ? (this.privateRepo = !0, this.elements.$upgradeUpsell.show(), n.removeClass("has-removed-contents"), this.elements.$upgradeUpsell.find("input[type=checkbox]").prop("checked", "checked"), this.elements.$iconPreviewPublic.hide(), this.elements.$iconPreviewPrivate.show()) : (this.privateRepo = !1, this.elements.$upgradeUpsell.hide(), n.addClass("has-removed-contents"), this.elements.$upgradeUpsell.find("input[type=checkbox]").prop("checked", null), this.elements.$form.attr("action", this.elements.$form.attr("data-url")), this.elements.$iconPreviewPrivate.hide(), this.elements.$iconPreviewPublic.show()), this.validate()
                }, t.prototype.selectedPrivacyToggleElement = function() {
                    return this.elements.$privateRadio.is(":checked") ? this.elements.$privateRadio : this.elements.$publicRadio
                }, t.prototype.updateUpsell = function() {
                    var e = this.elements.$upsells.filter("[data-login=" + this.current_login + "]");
                    return this.elements.$upgradeUpsell.html(e)
                }, t.prototype.validate = function() {
                    var e = void 0;
                    e = !0, this.elements.$repoNameField.is(".is-autocheck-successful") || (e = !1);
                    var t = this.elements.$upgradeUpsell.find("input[type=checkbox]");
                    return this.privateRepo && t.length && !t.is(":checked") && (e = !1), this.elements.$form.find("button.primary").prop("disabled", !e)
                }, t
            }();
        a["default"](function() {
            return a["default"](".page-new-repo").length ? new s : void 0
        }), n.on("autocheck:send", "#repository_name", function(e) {
            var t = e.detail,
                n = a["default"](this),
                i = n.closest("form").find("input[name=owner]:checked").val();
            t.owner = i, n.trigger("repoform:validate")
        }), n.on("autocheck:complete", "#repository_name", function() {
            return a["default"](this).trigger("repoform:validate")
        }), n.on("autocheck:success", "#repository_name", function(e) {
            var t = void 0;
            if (null != e.detail && (t = e.detail.trim()), t) {
                var n = this.closest("dl.form-group");
                n.classList.add("warn");
                var i = document.createElement("dd");
                i.classList.add("warning"), i.innerHTML = t, n.append(i)
            }
        })
    }), define("github/legacy/pages/repositories/side_navigation", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        document.addEventListener("pjax:end", function() {
            var e = void 0,
                t = void 0,
                i = void 0,
                r = void 0,
                a = void 0,
                s = n["default"](document.head).find("meta[name='selected-link']").attr("value");
            if (null != s) {
                var o = n["default"](".js-sidenav-container-pjax .js-selected-navigation-item").removeClass("selected");
                for (e = 0, i = o.length; i > e; e++) {
                    var u = o[e],
                        l = null != (a = n["default"](u).attr("data-selected-links")) ? a : "",
                        c = l.split(" ");
                    for (t = 0, r = c.length; r > t; t++) {
                        var d = c[t];
                        d === s && n["default"](u).addClass("selected")
                    }
                }
            }
        })
    }), define("github/legacy/pages/repository_imports/show", ["../../../typecast", "../../../form", "../../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
            }
            return Array.from(e)
        }
        var a = i(e),
            s = i(n);
        s["default"](document).on("change", ".js-repository-import-owner-container input", function() {
            var e = this.getAttribute("data-upsell"),
                t = this.getAttribute("data-billing-url");
            a["default"](document.querySelector(".js-repository-import-billing-url"), HTMLAnchorElement).href = t, a["default"](document.querySelector(".js-repository-import-upsell"), HTMLElement).classList.toggle("d-none", "false" == e), a["default"](document.querySelector(".js-repository-import-no-upsell"), HTMLElement).classList.toggle("d-none", "true" == e)
        }), s["default"](document).on("socket:message", ".repository-import", function(e, t) {
            t.redirect_to && (document.location.href = t.redirect_to, e.stopImmediatePropagation())
        }), s["default"](document).on("change", ".js-repository-import-lfs-opt", function() {
            var e = this.getAttribute("data-percent-used"),
                t = this.closest(".js-repository-import-lfs-container"),
                n = this.getAttribute("data-used");
            t.querySelector(".js-repository-import-lfs-warn").classList.toggle("d-none", !(e > 100)), t.querySelector(".js-usage-bar").classList.toggle("exceeded", e >= 100), t.querySelector(".js-usage-bar").setAttribute("aria-label", e + "%"), t.querySelector(".js-repository-import-lfs-progress").style.width = e + "%", t.querySelector("span.js-usage-text").innerText = n
        }), s["default"](document).on("menu:activated selectmenu:load", ".js-repository-import-author-select-menu", function() {
            var e = this.querySelector(".js-repository-import-author-autocomplete");
            e.focus(), e.select()
        }), s["default"](document).on("autocomplete:result", ".js-repository-import-author-autocomplete", function() {
            var e = this.closest(".js-repository-import-author"),
                n = e.querySelector(".js-author-login-info");
            t.changeValue(n, this.value)
        }), s["default"](document).on("ajaxSuccess", ".js-repository-import-author-form", function(e, t, n, i) {
            var a = s["default"].parseHTML(i.trim()),
                o = this.closest(".js-repository-import-author");
            o.replaceWith.apply(o, r(a))
        }), s["default"](document).on("click", ".js-repository-import-projects-cancel-button", function() {
            var e = a["default"](document.querySelector(".js-repository-import-projects-cancel-form"), HTMLFormElement);
            t.submit(e)
        })
    }), define("github/legacy/pages/sessions/two_factor", ["../../../typecast", "../../../fetch", "delegated-events", "../../../jquery"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            document.body.classList.add("is-sending"), document.body.classList.remove("is-sent", "is-not-sent")
        }

        function s() {
            document.body.classList.add("is-sent"), document.body.classList.remove("is-sending")
        }

        function o(e) {
            e && (u["default"](document.querySelector(".js-sms-error"), HTMLElement).textContent = e), document.body.classList.add("is-not-sent"), document.body.classList.remove("is-sending")
        }
        var u = r(e),
            l = r(i);
        l["default"](document).on("ajaxSend", ".js-send-auth-code", a), l["default"](document).on("ajaxSuccess", ".js-send-auth-code", s), l["default"](document).on("ajaxError", ".js-send-auth-code", function(e, t) {
            o(t.responseText), e.preventDefault()
        }), n.on("click", ".js-send-two-factor-code", function() {
            var e = this.form,
                n = e.querySelector(".js-country-code-select").value,
                i = e.querySelector(".js-sms-number").value,
                r = n + " " + i;
            a();
            var u = this.getAttribute("data-authenticity-token");
            null == u && (u = e.elements.authenticity_token.value);
            var l = new FormData;
            l.append("number", r), l.append("authenticity_token", u), t.fetch(this.getAttribute("data-url"), {
                method: "post",
                body: l
            }).then(function() {
                s(), Array.from(e.querySelectorAll(".js-2fa-enable")).forEach(function(e) {
                    return e.disabled = !1
                }), e.querySelector(".js-2fa-otp").focus()
            })["catch"](function(t) {
                t.response && t.response.text().then(o), Array.from(e.querySelectorAll(".js-2fa-enable")).forEach(function(e) {
                    return e.disabled = !0
                })
            })
        }), n.on("click", ".js-enable-enable-two-factor-auth-button", function() {
            var e = u["default"](document.querySelector(".js-enable-two-factor-auth-button"), HTMLButtonElement);
            e.disabled = !1, e.removeAttribute("aria-label"), e.classList.remove("tooltipped")
        }), document.addEventListener("facebox:reveal", function() {
            var e = document.querySelector("#facebox .js-two-factor-set-sms-fallback");
            e && (l["default"](".js-configure-sms-fallback .facebox-alert").text("").hide(), l["default"](".js-configure-sms-fallback").show(), l["default"](".js-verify-sms-fallback").hide())
        }), l["default"](document).on("ajaxSuccess", ".js-two-factor-set-sms-fallback", function(e, t) {
            switch (t.status) {
                case 200:
                case 201:
                    window.location.reload();
                    break;
                case 202:
                    l["default"](".js-configure-sms-fallback").hide(), l["default"](".js-verify-sms-fallback").show(), l["default"](".js-fallback-otp").focus()
            }
        }), l["default"](document).on("ajaxError", ".js-two-factor-set-sms-fallback", function(e, t) {
            switch (t.status) {
                case 422:
                    window.location.reload();
                    break;
                case 429:
                    return l["default"](".js-configure-sms-fallback .facebox-alert").text(t.responseText).show(), !1
            }
        })
    }), define("github/legacy/pages/settings/user/saved-replies", ["../../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSuccess", ".js-saved-reply-delete", function() {
            var e = this.closest(".js-saved-reply-container"),
                t = e.querySelectorAll(".js-saved-reply-list-item").length;
            e.classList.toggle("has-replies", t > 1), this.closest(".js-saved-reply-list-item").remove()
        })
    }), define("github/legacy/pages/settings/user/settings", ["../../../../typecast", "../../../../form", "delegated-events", "../../../../observe", "../../../../jquery", "../../../../facebox"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o(e) {
            if (!document.querySelector(".js-blocked-user-list")) {
                var t = e.querySelector(".blankslate");
                t.classList.add("d-none")
            }
        }

        function u(e, t) {
            var n = e.querySelector(".js-add-new-blocked-user");
            n.disabled = !t
        }
        var l = s(e),
            c = s(r);
        i.observe(".js-email-global-unsubscribe-form", function() {
            this.querySelector(".js-email-global-unsubscribe-submit").disabled = !0
        }), c["default"](document).on("change", ".js-email-global-unsubscribe-form", function() {
            var e = void 0,
                t = function() {
                    var t = void 0,
                        n = void 0,
                        i = this.querySelectorAll(".js-email-global-unsubscribe"),
                        r = [];
                    for (t = 0, n = i.length; n > t; t++) e = i[t], e.checked && r.push(e);
                    return r
                }.call(this);
            return this.querySelector(".js-email-global-unsubscribe-submit").disabled = t[0].defaultChecked
        }), c["default"](document).on("ajaxError", ".js-remove-ssh-key", function() {
            return c["default"](this).removeClass("disabled").find("span").text("Error. Try again.")
        }), c["default"](document).on("ajaxSuccess", ".js-remove-ssh-key", function() {
            return n.fire(document, "facebox:close"), document.getElementById(this.getAttribute("data-row-id")).remove(), 0 === c["default"](".js-ssh-keys-box li").length ? c["default"](".js-ssh-keys-container").removeClass("has-keys") : void 0
        }), c["default"](document).on("ajaxError", ".js-remove-gpg-key", function() {
            return c["default"](this).removeClass("disabled").find("span").text("Error. Try again.")
        }), c["default"](document).on("ajaxSuccess", ".js-remove-gpg-key", function() {
            return n.fire(document, "facebox:close"), document.getElementById(this.getAttribute("data-row-id")).remove(), 0 === c["default"](".js-gpg-keys-box li").length ? c["default"](".js-gpg-keys-container").removeClass("has-keys") : void 0
        }), c["default"](document).on("ajaxSend", ".js-verify-ssh-key", function() {
            return c["default"](this).addClass("disabled").find("span").text("Verifying\u2026")
        }), c["default"](document).on("ajaxError", ".js-verify-ssh-key", function() {
            return c["default"](this).removeClass("disabled").find("span").text("Error. Try again.")
        }), c["default"](document).on("ajaxSuccess", ".js-verify-ssh-key", function() {
            var e = this.closest("li");
            return e.querySelector(".js-unverified-user-key-notice").remove(), e.querySelector(".js-user-key-icon").classList.remove("unverified-user-key"), this.remove()
        }), c["default"](document).on("ajaxSuccess", ".js-leave-collaborated-repo", function(e) {
            var t = e.target.getAttribute("data-repo-id"),
                n = l["default"](document.querySelector(".js-collab-repo[data-repo-id='" + t + "']"), HTMLElement);
            n.remove(), a.close()
        }), c["default"](document).on("ajaxSuccess", ".js-newsletter-unsubscribe-form", function() {
            var e = void 0,
                t = void 0,
                n = document.querySelectorAll(".js-newsletter-unsubscribe-message"),
                i = [];
            for (e = 0, t = n.length; t > e; e++) {
                var r = n[e];
                i.push(r.classList.toggle("d-none"))
            }
            return i
        }), c["default"](document).on("click", ".js-show-new-ssh-key-form", function() {
            return c["default"](".js-new-ssh-key-box").toggle().find(".js-ssh-key-title").focus(), !1
        }), c["default"](document).on("click", ".js-show-new-gpg-key-form", function() {
            return c["default"](".js-new-gpg-key-box").toggle().find(".js-gpg-key-public-key").focus(), !1
        }), c["default"](document).on("ajaxSuccess", ".js-revoke-access-form", function() {
            var e = this.getAttribute("data-id"),
                t = this.getAttribute("data-type-name"),
                n = l["default"](document.querySelector(".js-revoke-item[data-type='" + t + "'][data-id='" + e + "']"), HTMLElement);
            a.close(), n.remove(), n.classList.contains("new-token") && l["default"](document.querySelector(".js-flash-new-token"), HTMLElement).remove()
        }), c["default"](document).on("click", ".js-delete-oauth-application-image", function() {
            var e = this.closest(".js-uploadable-container"),
                n = e.closest("form"),
                i = this.getAttribute("data-app-logo-destroy-path"),
                r = this.getAttribute("data-app-logo-destroy-method"),
                a = this.getAttribute("data-app-logo-destroy-field-name"),
                s = this.getAttribute("data-app-logo-destroy-field-value");
            return n.action = i, c["default"](n).append('<input name="' + a + '" type="hidden" value="' + s + '">'), c["default"](n).append('<input name="_method" type="hidden" value="' + r + '">'), t.submit(n), !1
        }), c["default"](document).on("click", ".js-new-callback", function(e) {
            e.preventDefault();
            var t = c["default"](e.currentTarget).closest(".js-callback-urls"),
                n = t.find(".js-callback-url").first().clone();
            return n.removeClass("is-default-callback"), n.find("input").val(""), t.addClass("has-many"), c["default"](e.currentTarget).before(n)
        }), c["default"](document).on("click", ".js-delete-callback", function(e) {
            e.preventDefault();
            var t = c["default"](e.currentTarget).closest(".js-callback-urls");
            c["default"](e.currentTarget).closest(".js-callback-url").remove();
            var n = t.find(".js-callback-url");
            return n.length <= 1 ? t.removeClass("has-many") : void 0
        }), c["default"](document).on("click", ".js-oauth-application-whitelist .js-deny-this-request", function(e) {
            c["default"](e.currentTarget).siblings("#state").val("denied"), t.submit(this.closest(".js-org-application-access-form"))
        }), c["default"](document).on("ajaxSuccess", ".js-org-application-access-form", function() {
            return window.location.reload()
        }), c["default"](document).on("click", ".js-user-rename-warning-continue", function() {
            var e = void 0,
                t = void 0,
                n = document.querySelectorAll(".js-user-rename-warning, .js-user-rename-form"),
                i = [];
            for (e = 0, t = n.length; t > e; e++) {
                var r = n[e];
                i.push(r.classList.toggle("d-none"))
            }
            return i
        }), c["default"](document).on("change", ".js-checkbox-scope", function() {
            var e = void 0,
                t = void 0,
                n = this.closest(".js-check-scope-container"),
                i = n.querySelectorAll(".js-checkbox-scope"),
                r = [];
            for (e = 0, t = i.length; t > e; e++) {
                var a = i[e];
                a !== this ? (a.checked = this.checked, r.push(a.disabled = this.checked)) : r.push(void 0)
            }
            return r
        }), c["default"](document).on("click", ".js-generate-integration-key", function() {
            n.fire(document, "facebox:close");
            var e = l["default"](document.querySelector(".js-integration-key-management-wrapper"), HTMLElement);
            return e.classList.add("downloading")
        }), i.observe(".js-block-users-form", u), c["default"](document).on("ajaxSuccess", ".js-block-users-form", function(e, n, i, r) {
            var a = l["default"](document.querySelector(".js-user-block-settings-list"), HTMLElement),
                s = l["default"](a.querySelector(".js-blocked-list"), HTMLElement);
            u(this);
            var c = this.querySelector(".js-add-blocked-user-field");
            t.changeValue(c, ""), o(a), s.insertAdjacentHTML("afterbegin", r)
        }), c["default"](document).on("autocomplete:autocompleted:changed", ".js-add-blocked-user-field", function() {
            u(this.form, c["default"](this).data("autocompleted"))
        })
    }), define("github/legacy/pages/settings/user/user_sessions", ["../../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSuccess", ".js-user-sessions-revoke", function() {
            this.closest("li").remove()
        })
    }), define("github/legacy/pages/signup", ["../../observe", "../../google-analytics", "../../jquery"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(n);
        r["default"](function() {
            return r["default"](".js-email-notice-trigger").focus(function() {
                return r["default"](".js-email-notice").addClass("notice-highlight")
            }), r["default"](".js-email-notice-trigger").blur(function() {
                return r["default"](".js-email-notice").removeClass("notice-highlight")
            })
        }), e.observe(".js-plan-choice:checked", {
            add: function() {
                return r["default"](this).closest(".plan-row").addClass("selected")
            },
            remove: function() {
                return r["default"](this).closest(".plan-row").removeClass("selected")
            }
        }), e.observe(".js-setup-organization:checked", {
            add: function() {
                var e = r["default"](".js-choose-plan-submit");
                return e.attr("data-default-text") || e.attr("data-default-text", e.text()), e.text(e.attr("data-org-text"))
            },
            remove: function() {
                var e = r["default"](".js-choose-plan-submit");
                return e.text(e.attr("data-default-text"))
            }
        });
        var a = new WeakMap;
        e.observe(".js-signup-form", function() {
            var e = this;
            e.addEventListener("input", function(n) {
                if (n.target.closest("input[type=text]") && !a.get(e)) {
                    var i = e.querySelector(".js-signup-source");
                    t.trackEvent({
                        category: "Signup",
                        action: "Attempt",
                        label: i.value
                    }), a.set(e, !0)
                }
            })
        })
    }), define("github/legacy/pages/site-search", ["../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function n(e) {
            var t = a["default"](".js-site-search-form")[0];
            t.setAttribute("action", t.getAttribute("data-unscoped-search-url")), a["default"](".js-site-search").removeClass("scoped-search"), e.setAttribute("placeholder", e.getAttribute("data-unscoped-placeholder"))
        }

        function i(e) {
            var t = a["default"](".js-site-search-form")[0];
            t.setAttribute("action", t.getAttribute("data-scoped-search-url")), a["default"](".js-site-search").addClass("scoped-search"), e.setAttribute("placeholder", e.getAttribute("data-scoped-placeholder"))
        }

        function r(e) {
            var t = e.target,
                r = t.value;
            "" === r && "backspace" === e.hotkey && t.classList.contains("is-clearable") && n(t), "" === r && "esc" === e.hotkey && i(t), t.classList.toggle("is-clearable", "" === r)
        }
        var a = t(e);
        a["default"](document).on("focus", ".js-site-search-field", function() {
            return a["default"](this).on("keyup", r)
        }), a["default"](document).on("blur", ".js-site-search-field", function() {
            return a["default"](this).off("keyup", r)
        }), a["default"](document).on("focusout", ".js-site-search-focus", function() {
            this.closest(".js-chromeless-input-container").classList.remove("focus"), "" === this.value && this.classList.contains("js-site-search-field") && i(this)
        }), a["default"](document).on("focusin", ".js-site-search-focus", function() {
            this.closest(".js-chromeless-input-container").classList.add("focus")
        })
    }), define("github/legacy/pages/site/contact", ["../../../observe", "../../../html-validation"], function(e, t) {
        e.observe(".js-contact-javascript-flag", function(e) {
            e.value = "true"
        }), e.observe(".js-dmca-comment", function() {
            t.revalidate(this, !1)
        })
    }), define("github/legacy/pages/site/features", ["../../../observe", "../../../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            var e = a["default"]("#js-features-branch-diagram");
            return e.removeClass("preload"), e.find("path").each(function() {
                var e = void 0;
                a["default"](this).is("#js-branch-diagram-branch") ? e = "stroke-dashoffset 3.5s linear 0.25s" : a["default"](this).is("#js-branch-diagram-master") ? e = "stroke-dashoffset 4.1s linear 0s" : a["default"](this).is("#js-branch-diagram-arrow") && (e = "stroke-dashoffset 0.2s linear 4.3s");
                var t = a["default"](this).get(0),
                    n = t.getTotalLength();
                return t.style.transition = t.style.WebkitTransition = "none", t.style.strokeDasharray = n + " " + n, t.style.strokeDashoffset = n, t.getBoundingClientRect(), t.style.transition = t.style.WebkitTransition = e, t.style.strokeDashoffset = "0"
            })
        }

        function r() {
            return a["default"](document).scrollTop() >= a["default"]("#js-features-branch-diagram").offset().top - 700 ? i() : void 0
        }
        var a = n(t);
        a["default"](document).on("click", ".js-segmented-nav-button", function(e) {
            var t = a["default"](this).attr("data-selected-tab"),
                n = a["default"](this).closest(".js-segmented-nav");
            return n.find(".js-segmented-nav-button").removeClass("selected"), n.siblings(".js-selected-nav-tab").removeClass("active"), a["default"](this).addClass("selected"), a["default"]("." + t).addClass("active"), e.preventDefault()
        }), e.observe("#js-features-branch-diagram.preload", {
            add: function() {
                return a["default"](window).on("scroll", r)
            },
            remove: function() {
                return a["default"](window).off("scroll", r)
            }
        })
    }), define("github/legacy/pages/site/header_notifications", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("socket:message", ".js-notification-indicator", function(e, t) {
            n["default"](this).attr({
                "aria-label": t.aria_label,
                "data-ga-click": t.ga_click
            }), n["default"]("span", this).attr("class", t.span_class)
        })
    }), define("github/legacy/pages/site/keyboard_shortcuts", ["../../../jquery", "../../../visible", "../../../facebox", "../../../fetch"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            var e = "/site/keyboard_shortcuts?url=" + window.location.pathname;
            return u["default"](function() {
                return i.fetchText(e).then(function(e) {
                    return u["default"](e, "shortcuts")
                })
            })
        }
        var s = r(e),
            o = r(t),
            u = r(n);
        s["default"](document).on("click", ".js-keyboard-shortcuts", function() {
            return a(), !1
        }), s["default"](document).on("click", ".js-see-all-keyboard-shortcuts", function() {
            return this.remove(), s["default"](".facebox .js-hidden-pane").css("display", "table-row-group"), !1
        }), s["default"](document).on("keypress", function(e) {
            return e.target === document.body && 63 === e.which ? (Array.from(s["default"](".facebox")).some(o["default"]) ? n.close() : a(), !1) : void 0
        })
    }), define("github/legacy/pages/site_status", ["../../typecast", "../../observe"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e);
        t.observe(".js-site-status-container", function() {
            var e = this,
                t = e.querySelector(".js-site-status-message"),
                n = e.querySelector(".js-site-status-time"),
                r = e.querySelector(".flash"),
                a = i["default"](document.querySelector("meta[name=site-status-api-url]"), HTMLMetaElement).content;
            window.fetch(a).then(function(e) {
                return e.json()
            }).then(function(i) {
                if (null != i.status && "good" !== i.status) {
                    t.textContent = i.body, n.setAttribute("datetime", i.created_on);
                    var a = "major" === i.status ? "error" : "warn";
                    r.classList.add("flash-" + a), e.classList.remove("d-none")
                }
            })
        })
    }), define("github/legacy/pages/stafftools/ldap", ["../../../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("ajaxSend", ".js-action-ldap-create", function() {
            return n["default"](this).find(".btn-sm").addClass("disabled")
        }), n["default"](document).on("ajaxError", ".js-action-ldap-create", function() {
            return !1
        }), n["default"](document).on("ajaxComplete", ".js-action-ldap-create", function(e, t) {
            var i = n["default"](this),
                r = 500 === t.status ? "Oops, something went wrong." : t.responseText;
            return i.find(".js-message").show().html(" &ndash; " + r), 200 === t.status && i.find(".btn").hide(), !1
        })
    }), define("github/legacy/pages/tree_finder", ["../../typecast", "../../observe", "../../fetch", "../../fuzzy-filter", "../../focused", "../../throttled-input", "../../navigation"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e, t) {
            var r = document.getElementById(e.getAttribute("data-results"));
            if (r) {
                var a = f.get(r);
                if (!a) return void(null == d && (d = n.fetchJSON(r.getAttribute("data-url")).then(function(t) {
                    f.set(r, t.paths), u(e), d = null
                })["catch"](function() {
                    d = null
                })));
                var o = c["default"](c["default"](r.querySelector(".js-tree-browser-result-template"), HTMLElement).firstElementChild, HTMLElement),
                    l = c["default"](r.querySelector(".js-tree-finder-results"), HTMLElement);
                null == t && (t = e.value);
                var h = void 0,
                    m = void 0;
                t ? (h = i.fuzzyRegexp(t), m = i.fuzzySort(a, t)) : m = a, r.classList.toggle("filterable-empty", !m.length);
                for (var v = document.createDocumentFragment(), p = m.slice(0, 50), g = 0, b = p.length; b > g; g++) {
                    var y = p[g],
                        j = o.cloneNode(!0),
                        w = c["default"](j.getElementsByClassName("js-tree-finder-path")[0], HTMLAnchorElement),
                        x = new URL(w.href);
                    x.pathname = x.pathname + "/" + y, w.href = x.href, w.textContent = y, i.fuzzyHighlightElement(w, t, h), v.appendChild(j)
                }
                l.innerHTML = "", l.appendChild(v), s.focus(l)
            }
        }

        function l(e) {
            u(e.target)
        }
        var c = o(e),
            d = null,
            f = new WeakMap;
        r.onFocusedKeydown(document, ".js-tree-finder-field", function() {
            return function(e) {
                "esc" === e.hotkey && (history.back(), e.preventDefault())
            }
        }), t.observe(".js-tree-finder-field", {
            init: function(e) {
                u(e)
            },
            add: function(e) {
                a.addThrottledInputEventListener(e, l), e.focus()
            },
            remove: function(e) {
                a.removeThrottledInputEventListener(e, l)
            }
        })
    }), define("github/legacy/pages/users/contributions", ["../../../typecast", "../../../fetch", "../../../invariant", "../../../history", "../../../jquery", "../../../pjax", "delegated-events", "../../../inflector", "../../../number-helpers", "../../../observe"], function(e, t, n, i, r, a, s, o, u, l) {
        function c(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function d() {
            var e = C["default"](document.querySelector(".js-calendar-graph"), HTMLElement);
            return e.getAttribute("data-url")
        }

        function f(e) {
            return e.target.matches("rect.day") ? m(e.target) : void 0
        }

        function h() {
            var e = document.querySelector(".svg-tip");
            null != e && e.remove()
        }

        function m(e) {
            var t = S(e.getAttribute("data-date")),
                n = parseInt(e.getAttribute("data-count")),
                i = 0 === n ? "No" : u.formatNumber(n),
                r = D[t.getUTCMonth()].slice(0, 3) + " " + t.getUTCDate() + ", " + t.getUTCFullYear(),
                a = q["default"]('<div class="svg-tip svg-tip-one-line">\n  <strong>' + i + " " + o.pluralize(n, "contribution") + "</strong> on " + r + "\n</div>").get(0);
            q["default"](".svg-tip").remove(), document.body.appendChild(a);
            var s = e.getBoundingClientRect(),
                l = s.left + window.pageXOffset - a.offsetWidth / 2 + s.width / 2,
                c = s.bottom + window.pageYOffset - a.offsetHeight - 2 * s.height;
            return a.style.top = c + "px", a.style.left = l + "px"
        }

        function v(e) {
            var t = document.getElementById("js-contribution-activity");
            t && T["default"]({
                url: e,
                container: t,
                scrollTo: !1,
                replace: !0
            })
        }

        function p(e, i) {
            var r, a, s, o;
            return regeneratorRuntime.async(function(u) {
                for (;;) switch (u.prev = u.next) {
                    case 0:
                        return r = C["default"](document.querySelector(".js-calendar-graph"), HTMLElement), a = r.getAttribute("data-graph-url"), n.invariant(null != a, "Missing attribute `data-graph-url`"), s = a + "?from=" + x(e) + "&to=" + x(i) + "&full_graph=1", u.next = 6, regeneratorRuntime.awrap(t.fetchSafeDocumentFragment(document, s));
                    case 6:
                        o = u.sent, C["default"](document.querySelector(".js-contribution-graph"), HTMLElement).replaceWith(o);
                    case 8:
                    case "end":
                        return u.stop()
                }
            }, null, this)
        }

        function g(e) {
            A = e, H = null, I = null;
            var t = d() + "?tab=overview&period=" + A;
            return j(), v(t)
        }

        function b(e, t) {
            var n = void 0,
                i = void 0;
            return i = e.getAttribute("class").trim().split(" "), i = function() {
                var e = void 0,
                    r = void 0,
                    a = [];
                for (e = 0, r = i.length; r > e; e++) n = i[e], n !== t && a.push(n);
                return a
            }(), e.setAttribute("class", i.join(" "))
        }

        function y(e, t) {
            var n = e.getAttribute("class") + " " + t;
            return e.setAttribute("class", n.trim())
        }

        function j(e, t) {
            function n(n) {
                var i = S(n.getAttribute("data-date")).getTime();
                return e && t ? e.getTime() <= i && i <= t.getTime() : i === e.getTime()
            }
            var i = void 0,
                r = void 0,
                a = void 0,
                s = void 0,
                o = void 0,
                u = C["default"](document.querySelector(".js-calendar-graph"), HTMLElement),
                l = u.querySelectorAll("rect.day");
            for (r = 0, s = l.length; s > r; r++) i = l[r], b(i, "active");
            if (u.classList.remove("days-selected"), e || t) {
                u.classList.add("days-selected");
                var c = [];
                for (a = 0, o = l.length; o > a; a++) i = l[a], n(i) && c.push(y(i, "active"));
                return c
            }
        }

        function w(e) {
            return ("0" + e).slice(-2)
        }

        function x(e) {
            return e.getUTCFullYear() + "-" + w(e.getUTCMonth() + 1) + "-" + w(e.getUTCDate())
        }

        function S(e) {
            var t = void 0,
                n = void 0,
                i = void 0,
                r = void 0,
                a = void 0;
            return i = function() {
                var t = void 0,
                    n = void 0,
                    i = e.split("-"),
                    a = [];
                for (t = 0, n = i.length; n > t; t++) r = i[t], a.push(parseInt(r));
                return a
            }(), a = i[0], n = i[1], t = i[2], new Date(Date.UTC(a, n - 1, t))
        }

        function k(e, t, n) {
            var i = void 0,
                r = void 0,
                a = void 0,
                s = void 0,
                o = d() + "?tab=overview";
            if (e >= H && I >= e) return void g("weekly");
            if ("object" == typeof t && (M = t, t = !0), M && t) {
                var u = new Date(M.getTime() - 26784e5),
                    l = new Date(M.getTime() + 26784e5),
                    c = e > M ? [M, e] : [e, M];
                i = c[0], r = c[1], u > i && (i = u), r > l && (r = l), a = [i, r], H = a[0], I = a[1], o += "&from=" + x(i) + "&to=" + x(r)
            } else i = e, s = [i, null], H = s[0], I = s[1], o += "&from=" + x(i);
            return M = e, A = "custom", j(i, r), n ? void 0 : v(o)
        }

        function L(e, t) {
            var n = new Date(Date.parse("1 " + e + " " + t + " 00:00:00 UTC")),
                i = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 0));
            p(n, i)
        }

        function _(e) {
            var t = e.closest(".js-details-container");
            t && t.classList.add("open");
            var n = 62,
                i = e.getBoundingClientRect(),
                r = 10,
                a = window.scrollY + i.top - n - r;
            window.scrollTo(0, a)
        }

        function E() {
            var e = window.location.hash;
            if (e && !(e.indexOf("#event-") < 0)) {
                var t = e.slice(1, e.length),
                    n = document.getElementById(t);
                n && _(n)
            }
        }
        var C = c(e),
            q = c(r),
            T = c(a),
            A = null,
            M = null,
            H = null,
            I = null;
        s.on("pjax:send", "#js-contribution-activity", function() {
            this.classList.add("loading")
        }), s.on("pjax:complete", "#js-contribution-activity", function() {
            this.classList.remove("loading")
        }), l.observe(".js-calendar-graph-svg", function() {
            var e = void 0,
                t = void 0,
                n = this.closest(".js-calendar-graph");
            n.addEventListener("mouseover", f), n.addEventListener("mouseout", h), e = n.getAttribute("data-from"), e && (e = M = S(e)), t = n.getAttribute("data-to"), t && (t = S(t))
        }), s.on("click", ".js-calendar-graph rect.day", function(e) {
            var t = S(this.getAttribute("data-date"));
            k(t, e.shiftKey, !1)
        });
        var D = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        s.on("click", ".js-year-link", function(e) {
            e.preventDefault(), e.stopPropagation();
            var t = C["default"](document.querySelector(".js-year-link.selected"), HTMLElement),
                n = e.target;
            t.classList.remove("selected"), n.classList.add("selected");
            var i = n.innerText,
                r = new Date,
                a = r.getUTCFullYear();
            if (parseInt(a) === parseInt(i)) {
                var s = r.getUTCMonth(),
                    o = new Date(a, s, 1);
                return p(o, r)
            }
            return L("December", i)
        }), E(), window.addEventListener("hashchange", function(e) {
            var t = e.newURL || window.location.href,
                n = t.slice(t.indexOf("#") + 1, t.length),
                i = document.getElementById(n);
            return i ? (e.stopPropagation(), void _(i)) : !0
        }), l.observe(".js-profile-timeline-year-list.js-sticky", function() {
            var e = document.getElementById("js-contribution-activity");
            e.style.minHeight = this.offsetHeight + "px"
        }), q["default"](document).on("ajaxSuccess", ".js-show-more-timeline-form", function(e, t, r) {
            var a = document.querySelector(".js-show-more-timeline-form");
            if (a) {
                var s = a.getAttribute("data-year");
                n.invariant(null != s, "Missing attribute `data-year`");
                var o = C["default"](document.querySelector(".js-year-link.selected"), HTMLElement),
                    u = C["default"](document.getElementById("year-link-" + s), HTMLElement);
                o.classList.remove("selected"), u.classList.add("selected")
            }
            document.title = e.target.getAttribute("data-title"), i.pushState(null, "", r.url)
        })
    }), define("github/legacy/pages/users/pinned-repositories", ["../../../invariant", "delegated-events", "../../../hotkey"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t, n) {
            var i = e.querySelector(".js-remaining-pinned-repos-count"),
                r = i.getAttribute("data-remaining-label"),
                a = n - t;
            i.textContent = a + " " + r, i.classList.toggle("text-red", 1 > a)
        }

        function a(e) {
            var t = parseInt(e.getAttribute("data-max-repo-count"), 10),
                n = e.querySelectorAll("input[type=checkbox]:checked").length,
                i = Array.from(e.querySelectorAll("input[type=checkbox]"));
            n === t ? i.forEach(function(e) {
                return e.disabled = !e.checked
            }) : t > n && i.forEach(function(e) {
                return e.disabled = !1
            });
            var a = e.closest(".js-pinned-repos-selection-form");
            r(a, n, t)
        }

        function s(e) {
            var t = Array.from(e.querySelectorAll(".js-pinned-repo-source"));
            if (t.length < 1) return [!0, !0];
            var n = Array.from(e.querySelectorAll(".js-pinned-repo-source:checked")),
                i = n.map(function(e) {
                    return e.value
                }),
                r = i.indexOf("owned") > -1,
                a = i.indexOf("contributed") > -1;
            return r && !a || !r && a ? n.forEach(function(e) {
                return e.disabled = !0
            }) : n.forEach(function(e) {
                return e.disabled = !1
            }), [r, a]
        }

        function o(e) {
            var t = e.classList.contains("js-owned-repo"),
                n = e.classList.contains("js-contributed-repo");
            return [t, n]
        }

        function u(e) {
            "enter" === l["default"](e) && e.preventDefault();
            var t = e.target.closest(".js-pinned-repos-selection-form"),
                n = t.querySelector(".js-pinned-repos-filter").value.trim().toLowerCase(),
                i = n.length < 1,
                r = t.querySelectorAll(".js-pinned-repos-selection"),
                a = s(t),
                u = c(a, 2),
                d = u[0],
                f = u[1],
                h = !1;
            Array.from(r).forEach(function(e) {
                var t = e.querySelector(".js-repo").textContent.trim(),
                    r = o(e),
                    a = c(r, 2),
                    s = a[0],
                    u = a[1],
                    l = e.querySelector('input[type="checkbox"]').checked,
                    m = t.toLowerCase().indexOf(n) > -1,
                    v = (i || m) && (s && d || u && f),
                    p = l || v;
                p && (h = !0), e.classList.toggle("d-none", !p)
            });
            var m = t.querySelector(".js-no-repos-message");
            m.classList.toggle("d-none", h)
        }
        var l = i(n),
            c = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !i && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }();
        t.on("change", ".js-pinned-repos-selection-list input[type=checkbox]", function() {
            var e = this.closest(".js-pinned-repos-selection");
            e.classList.toggle("selected", this.checked), a(e.closest(".js-pinned-repos-selection-list"))
        }), t.on("keyup", ".js-pinned-repos-filter", u), t.on("change", ".js-pinned-repos-filter", u), t.on("search", ".js-pinned-repos-filter", u), t.on("change", ".js-pinned-repo-source", u), document.addEventListener("facebox:reveal", function() {
            var t = document.querySelector("#facebox .js-pinned-repos-settings-fragment");
            if (t) {
                var n = t.getAttribute("data-url");
                e.invariant(n, "`data-url` must exist"), t.setAttribute("src", n)
            }
        })
    }), define.register("sortablejs"),
    function(e) {
        "use strict";
        "function" == typeof define && define.amd ? define(e) : "undefined" != typeof module && "undefined" != typeof module.exports ? module.exports = e() : "undefined" != typeof Package ? Sortable = e() : window.Sortable = e()
    }(function() {
        "use strict";

        function e(e, t) {
            if (!e || !e.nodeType || 1 !== e.nodeType) throw "Sortable: `el` must be HTMLElement, and not " + {}.toString.call(e);
            this.el = e, this.options = t = g({}, t), e[R] = this;
            var n = {
                group: Math.random(),
                sort: !0,
                disabled: !1,
                store: null,
                handle: null,
                scroll: !0,
                scrollSensitivity: 30,
                scrollSpeed: 10,
                draggable: /[uo]l/i.test(e.nodeName) ? "li" : ">*",
                ghostClass: "sortable-ghost",
                chosenClass: "sortable-chosen",
                ignore: "a, img",
                filter: null,
                animation: 0,
                setData: function(e, t) {
                    e.setData("Text", t.textContent)
                },
                dropBubble: !1,
                dragoverBubble: !1,
                dataIdAttr: "data-id",
                delay: 0,
                forceFallback: !1,
                fallbackClass: "sortable-fallback",
                fallbackOnBody: !1
            };
            for (var i in n) !(i in t) && (t[i] = n[i]);
            Y(t);
            for (var a in this) "_" === a.charAt(0) && (this[a] = this[a].bind(this));
            this.nativeDraggable = t.forceFallback ? !1 : B, r(e, "mousedown", this._onTapStart), r(e, "touchstart", this._onTapStart), this.nativeDraggable && (r(e, "dragover", this), r(e, "dragenter", this)), W.push(this._onDragOver), t.store && this.sort(t.store.get(this))
        }

        function t(e) {
            w && w.state !== e && (o(w, "display", e ? "none" : ""), !e && w.state && x.insertBefore(w, b), w.state = e)
        }

        function n(e, t, n) {
            if (e) {
                n = n || N, t = t.split(".");
                var i = t.shift().toUpperCase(),
                    r = new RegExp("\\s(" + t.join("|") + ")(?=\\s)", "g");
                do
                    if (">*" === i && e.parentNode === n || ("" === i || e.nodeName.toUpperCase() == i) && (!t.length || ((" " + e.className + " ").match(r) || []).length == t.length)) return e; while (e !== n && (e = e.parentNode))
            }
            return null
        }

        function i(e) {
            e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.preventDefault()
        }

        function r(e, t, n) {
            e.addEventListener(t, n, !1)
        }

        function a(e, t, n) {
            e.removeEventListener(t, n, !1)
        }

        function s(e, t, n) {
            if (e)
                if (e.classList) e.classList[n ? "add" : "remove"](t);
                else {
                    var i = (" " + e.className + " ").replace(P, " ").replace(" " + t + " ", " ");
                    e.className = (i + (n ? " " + t : "")).replace(P, " ")
                }
        }

        function o(e, t, n) {
            var i = e && e.style;
            if (i) {
                if (void 0 === n) return N.defaultView && N.defaultView.getComputedStyle ? n = N.defaultView.getComputedStyle(e, "") : e.currentStyle && (n = e.currentStyle), void 0 === t ? n : n[t];
                t in i || (t = "-webkit-" + t), i[t] = n + ("string" == typeof n ? "" : "px")
            }
        }

        function u(e, t, n) {
            if (e) {
                var i = e.getElementsByTagName(t),
                    r = 0,
                    a = i.length;
                if (n)
                    for (; a > r; r++) n(i[r], r);
                return i
            }
            return []
        }

        function l(e, t, n, i, r, a, s) {
            var o = N.createEvent("Event"),
                u = (e || t[R]).options,
                l = "on" + n.charAt(0).toUpperCase() + n.substr(1);
            o.initEvent(n, !0, !0), o.to = t, o.from = r || t, o.item = i || t, o.clone = w, o.oldIndex = a, o.newIndex = s, t.dispatchEvent(o), u[l] && u[l].call(e, o)
        }

        function c(e, t, n, i, r, a) {
            var s, o, u = e[R],
                l = u.options.onMove;
            return s = N.createEvent("Event"), s.initEvent("move", !0, !0), s.to = t, s.from = e, s.dragged = n, s.draggedRect = i, s.related = r || t, s.relatedRect = a || t.getBoundingClientRect(), e.dispatchEvent(s), l && (o = l.call(u, s)), o
        }

        function d(e) {
            e.draggable = !1
        }

        function f() {
            U = !1
        }

        function h(e, t) {
            var n = e.lastElementChild,
                i = n.getBoundingClientRect();
            return (t.clientY - (i.top + i.height) > 5 || t.clientX - (i.right + i.width) > 5) && n
        }

        function m(e) {
            for (var t = e.tagName + e.className + e.src + e.href + e.textContent, n = t.length, i = 0; n--;) i += t.charCodeAt(n);
            return i.toString(36)
        }

        function v(e) {
            var t = 0;
            if (!e || !e.parentNode) return -1;
            for (; e && (e = e.previousElementSibling);) "TEMPLATE" !== e.nodeName.toUpperCase() && t++;
            return t
        }

        function p(e, t) {
            var n, i;
            return function() {
                void 0 === n && (n = arguments, i = this, setTimeout(function() {
                    1 === n.length ? e.call(i, n[0]) : e.apply(i, n), n = void 0
                }, t))
            }
        }

        function g(e, t) {
            if (e && t)
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
        }
        var b, y, j, w, x, S, k, L, _, E, C, q, T, A, M, H, I, D = {},
            P = /\s+/g,
            R = "Sortable" + (new Date).getTime(),
            O = window,
            N = O.document,
            F = O.parseInt,
            B = !!("draggable" in N.createElement("div")),
            z = function(e) {
                return e = N.createElement("x"), e.style.cssText = "pointer-events:auto", "auto" === e.style.pointerEvents
            }(),
            U = !1,
            $ = Math.abs,
            W = ([].slice, []),
            V = p(function(e, t, n) {
                if (n && t.scroll) {
                    var i, r, a, s, o = t.scrollSensitivity,
                        u = t.scrollSpeed,
                        l = e.clientX,
                        c = e.clientY,
                        d = window.innerWidth,
                        f = window.innerHeight;
                    if (L !== n && (k = t.scroll, L = n, k === !0)) {
                        k = n;
                        do
                            if (k.offsetWidth < k.scrollWidth || k.offsetHeight < k.scrollHeight) break; while (k = k.parentNode)
                    }
                    k && (i = k, r = k.getBoundingClientRect(), a = ($(r.right - l) <= o) - ($(r.left - l) <= o), s = ($(r.bottom - c) <= o) - ($(r.top - c) <= o)), a || s || (a = (o >= d - l) - (o >= l), s = (o >= f - c) - (o >= c), (a || s) && (i = O)), (D.vx !== a || D.vy !== s || D.el !== i) && (D.el = i, D.vx = a, D.vy = s, clearInterval(D.pid), i && (D.pid = setInterval(function() {
                        i === O ? O.scrollTo(O.pageXOffset + a * u, O.pageYOffset + s * u) : (s && (i.scrollTop += s * u), a && (i.scrollLeft += a * u))
                    }, 24)))
                }
            }, 30),
            Y = function(e) {
                var t = e.group;
                t && "object" == typeof t || (t = e.group = {
                    name: t
                }), ["pull", "put"].forEach(function(e) {
                    e in t || (t[e] = !0)
                }), e.groups = " " + t.name + (t.put.join ? " " + t.put.join(" ") : "") + " "
            };
        return e.prototype = {
            constructor: e,
            _onTapStart: function(e) {
                var t = this,
                    i = this.el,
                    r = this.options,
                    a = e.type,
                    s = e.touches && e.touches[0],
                    o = (s || e).target,
                    u = o,
                    c = r.filter;
                if (!("mousedown" === a && 0 !== e.button || r.disabled) && (o = n(o, r.draggable, i))) {
                    if (q = v(o), "function" == typeof c) {
                        if (c.call(this, e, o, this)) return l(t, u, "filter", o, i, q), void e.preventDefault()
                    } else if (c && (c = c.split(",").some(function(e) {
                            return e = n(u, e.trim(), i), e ? (l(t, e, "filter", o, i, q), !0) : void 0
                        }))) return void e.preventDefault();
                    (!r.handle || n(u, r.handle, i)) && this._prepareDragStart(e, s, o)
                }
            },
            _prepareDragStart: function(e, t, n) {
                var i, a = this,
                    o = a.el,
                    l = a.options,
                    c = o.ownerDocument;
                n && !b && n.parentNode === o && (M = e, x = o, b = n, y = b.parentNode, S = b.nextSibling, A = l.group, i = function() {
                    a._disableDelayedDrag(), b.draggable = !0, s(b, a.options.chosenClass, !0), a._triggerDragStart(t)
                }, l.ignore.split(",").forEach(function(e) {
                    u(b, e.trim(), d)
                }), r(c, "mouseup", a._onDrop), r(c, "touchend", a._onDrop), r(c, "touchcancel", a._onDrop), l.delay ? (r(c, "mouseup", a._disableDelayedDrag), r(c, "touchend", a._disableDelayedDrag), r(c, "touchcancel", a._disableDelayedDrag), r(c, "mousemove", a._disableDelayedDrag), r(c, "touchmove", a._disableDelayedDrag), a._dragStartTimer = setTimeout(i, l.delay)) : i())
            },
            _disableDelayedDrag: function() {
                var e = this.el.ownerDocument;
                clearTimeout(this._dragStartTimer), a(e, "mouseup", this._disableDelayedDrag), a(e, "touchend", this._disableDelayedDrag), a(e, "touchcancel", this._disableDelayedDrag), a(e, "mousemove", this._disableDelayedDrag), a(e, "touchmove", this._disableDelayedDrag)
            },
            _triggerDragStart: function(e) {
                e ? (M = {
                    target: b,
                    clientX: e.clientX,
                    clientY: e.clientY
                }, this._onDragStart(M, "touch")) : this.nativeDraggable ? (r(b, "dragend", this), r(x, "dragstart", this._onDragStart)) : this._onDragStart(M, !0);
                try {
                    N.selection ? N.selection.empty() : window.getSelection().removeAllRanges()
                } catch (t) {}
            },
            _dragStarted: function() {
                x && b && (s(b, this.options.ghostClass, !0), e.active = this, l(this, x, "start", b, x, q))
            },
            _emulateDragOver: function() {
                if (H) {
                    if (this._lastX === H.clientX && this._lastY === H.clientY) return;
                    this._lastX = H.clientX, this._lastY = H.clientY, z || o(j, "display", "none");
                    var e = N.elementFromPoint(H.clientX, H.clientY),
                        t = e,
                        n = " " + this.options.group.name,
                        i = W.length;
                    if (t)
                        do {
                            if (t[R] && t[R].options.groups.indexOf(n) > -1) {
                                for (; i--;) W[i]({
                                    clientX: H.clientX,
                                    clientY: H.clientY,
                                    target: e,
                                    rootEl: t
                                });
                                break
                            }
                            e = t
                        } while (t = t.parentNode);
                    z || o(j, "display", "")
                }
            },
            _onTouchMove: function(t) {
                if (M) {
                    e.active || this._dragStarted(), this._appendGhost();
                    var n = t.touches ? t.touches[0] : t,
                        i = n.clientX - M.clientX,
                        r = n.clientY - M.clientY,
                        a = t.touches ? "translate3d(" + i + "px," + r + "px,0)" : "translate(" + i + "px," + r + "px)";
                    I = !0, H = n, o(j, "webkitTransform", a), o(j, "mozTransform", a), o(j, "msTransform", a), o(j, "transform", a), t.preventDefault()
                }
            },
            _appendGhost: function() {
                if (!j) {
                    var e, t = b.getBoundingClientRect(),
                        n = o(b),
                        i = this.options;
                    j = b.cloneNode(!0), s(j, i.ghostClass, !1), s(j, i.fallbackClass, !0), o(j, "top", t.top - F(n.marginTop, 10)), o(j, "left", t.left - F(n.marginLeft, 10)), o(j, "width", t.width), o(j, "height", t.height), o(j, "opacity", "0.8"), o(j, "position", "fixed"), o(j, "zIndex", "100000"), o(j, "pointerEvents", "none"), i.fallbackOnBody && N.body.appendChild(j) || x.appendChild(j), e = j.getBoundingClientRect(), o(j, "width", 2 * t.width - e.width), o(j, "height", 2 * t.height - e.height)
                }
            },
            _onDragStart: function(e, t) {
                var n = e.dataTransfer,
                    i = this.options;
                this._offUpEvents(), "clone" == A.pull && (w = b.cloneNode(!0), o(w, "display", "none"), x.insertBefore(w, b)), t ? ("touch" === t ? (r(N, "touchmove", this._onTouchMove), r(N, "touchend", this._onDrop), r(N, "touchcancel", this._onDrop)) : (r(N, "mousemove", this._onTouchMove), r(N, "mouseup", this._onDrop)), this._loopId = setInterval(this._emulateDragOver, 50)) : (n && (n.effectAllowed = "move", i.setData && i.setData.call(this, n, b)), r(N, "drop", this), setTimeout(this._dragStarted, 0))
            },
            _onDragOver: function(e) {
                var i, r, a, s = this.el,
                    u = this.options,
                    l = u.group,
                    d = l.put,
                    m = A === l,
                    v = u.sort;
                if (void 0 !== e.preventDefault && (e.preventDefault(), !u.dragoverBubble && e.stopPropagation()), I = !0, A && !u.disabled && (m ? v || (a = !x.contains(b)) : A.pull && d && (A.name === l.name || d.indexOf && ~d.indexOf(A.name))) && (void 0 === e.rootEl || e.rootEl === this.el)) {
                    if (V(e, u, this.el), U) return;
                    if (i = n(e.target, u.draggable, s), r = b.getBoundingClientRect(), a) return t(!0), void(w || S ? x.insertBefore(b, w || S) : v || x.appendChild(b));
                    if (0 === s.children.length || s.children[0] === j || s === e.target && (i = h(s, e))) {
                        if (i) {
                            if (i.animated) return;
                            g = i.getBoundingClientRect()
                        }
                        t(m), c(x, s, b, r, i, g) !== !1 && (b.contains(s) || (s.appendChild(b), y = s), this._animate(r, b), i && this._animate(g, i))
                    } else if (i && !i.animated && i !== b && void 0 !== i.parentNode[R]) {
                        _ !== i && (_ = i, E = o(i), C = o(i.parentNode));
                        var p, g = i.getBoundingClientRect(),
                            k = g.right - g.left,
                            L = g.bottom - g.top,
                            q = /left|right|inline/.test(E.cssFloat + E.display) || "flex" == C.display && 0 === C["flex-direction"].indexOf("row"),
                            T = i.offsetWidth > b.offsetWidth,
                            M = i.offsetHeight > b.offsetHeight,
                            H = (q ? (e.clientX - g.left) / k : (e.clientY - g.top) / L) > .5,
                            D = i.nextElementSibling,
                            P = c(x, s, b, r, i, g);
                        if (P !== !1) {
                            if (U = !0, setTimeout(f, 30), t(m), 1 === P || -1 === P) p = 1 === P;
                            else if (q) {
                                var O = b.offsetTop,
                                    N = i.offsetTop;
                                p = O === N ? i.previousElementSibling === b && !T || H && T : N > O
                            } else p = D !== b && !M || H && M;
                            b.contains(s) || (p && !D ? s.appendChild(b) : i.parentNode.insertBefore(b, p ? D : i)), y = b.parentNode, this._animate(r, b), this._animate(g, i)
                        }
                    }
                }
            },
            _animate: function(e, t) {
                var n = this.options.animation;
                if (n) {
                    var i = t.getBoundingClientRect();
                    o(t, "transition", "none"), o(t, "transform", "translate3d(" + (e.left - i.left) + "px," + (e.top - i.top) + "px,0)"), t.offsetWidth, o(t, "transition", "all " + n + "ms"), o(t, "transform", "translate3d(0,0,0)"), clearTimeout(t.animated), t.animated = setTimeout(function() {
                        o(t, "transition", ""), o(t, "transform", ""), t.animated = !1
                    }, n)
                }
            },
            _offUpEvents: function() {
                var e = this.el.ownerDocument;
                a(N, "touchmove", this._onTouchMove), a(e, "mouseup", this._onDrop), a(e, "touchend", this._onDrop), a(e, "touchcancel", this._onDrop)
            },
            _onDrop: function(t) {
                var n = this.el,
                    i = this.options;
                clearInterval(this._loopId), clearInterval(D.pid), clearTimeout(this._dragStartTimer), a(N, "mousemove", this._onTouchMove), this.nativeDraggable && (a(N, "drop", this), a(n, "dragstart", this._onDragStart)), this._offUpEvents(), t && (I && (t.preventDefault(), !i.dropBubble && t.stopPropagation()), j && j.parentNode.removeChild(j), b && (this.nativeDraggable && a(b, "dragend", this), d(b), s(b, this.options.ghostClass, !1), s(b, this.options.chosenClass, !1), x !== y ? (T = v(b), T >= 0 && (l(null, y, "sort", b, x, q, T), l(this, x, "sort", b, x, q, T), l(null, y, "add", b, x, q, T), l(this, x, "remove", b, x, q, T))) : (w && w.parentNode.removeChild(w), b.nextSibling !== S && (T = v(b), T >= 0 && (l(this, x, "update", b, x, q, T), l(this, x, "sort", b, x, q, T)))), e.active && ((null === T || -1 === T) && (T = q), l(this, x, "end", b, x, q, T), this.save())), x = b = y = j = S = w = k = L = M = H = I = T = _ = E = A = e.active = null)
            },
            handleEvent: function(e) {
                var t = e.type;
                "dragover" === t || "dragenter" === t ? b && (this._onDragOver(e), i(e)) : ("drop" === t || "dragend" === t) && this._onDrop(e)
            },
            toArray: function() {
                for (var e, t = [], i = this.el.children, r = 0, a = i.length, s = this.options; a > r; r++) e = i[r], n(e, s.draggable, this.el) && t.push(e.getAttribute(s.dataIdAttr) || m(e));
                return t
            },
            sort: function(e) {
                var t = {},
                    i = this.el;
                this.toArray().forEach(function(e, r) {
                    var a = i.children[r];
                    n(a, this.options.draggable, i) && (t[e] = a)
                }, this), e.forEach(function(e) {
                    t[e] && (i.removeChild(t[e]), i.appendChild(t[e]))
                })
            },
            save: function() {
                var e = this.options.store;
                e && e.set(this)
            },
            closest: function(e, t) {
                return n(e, t || this.options.draggable, this.el)
            },
            option: function(e, t) {
                var n = this.options;
                return void 0 === t ? n[e] : (n[e] = t, void("group" === e && Y(n)))
            },
            destroy: function() {
                var e = this.el;
                e[R] = null, a(e, "mousedown", this._onTapStart), a(e, "touchstart", this._onTapStart), this.nativeDraggable && (a(e, "dragover", this), a(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(e) {
                    e.removeAttribute("draggable")
                }), W.splice(W.indexOf(this._onDragOver), 1), this._onDrop(), this.el = e = null
            }
        }, e.utils = {
            on: r,
            off: a,
            css: o,
            find: u,
            is: function(e, t) {
                return !!n(e, t, e)
            },
            extend: g,
            throttle: p,
            closest: n,
            toggleClass: s,
            index: v
        }, e.create = function(t, n) {
            return new e(t, n)
        }, e.version = "1.4.2", e
    }), define.registerEnd(), define("github/legacy/pages/users/pinned-repository-reordering", ["delegated-events", "../../../fetch", "../../../observe", "sortablejs"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            var t = e.item,
                n = e.oldIndex;
            l = t.parentNode.children[n + 1]
        }

        function s(e) {
            var n = e.oldIndex,
                i = e.newIndex,
                r = e.item;
            if (n !== i) {
                var a = r.closest(".js-pinned-repos-reorder-form"),
                    s = a.closest(".js-pinned-repos-reorder-container"),
                    o = s.querySelector(".js-pinned-repos-spinner"),
                    c = s.querySelector(".js-pinned-repos-reorder-error");
                // c.textContent = "", o.style.display = "inline-block", u.option("disabled", !0), t.fetchText(a.action, {
                //     method: a.method,
                //     body: new FormData(a)
                // })["catch"](function() {
                //     var e = r.parentNode;
                //     l ? e.insertBefore(r, l) : e.appendChild(r)
                // }).then(function() {
                //     o.style.display = "none", u.option("disabled", !1)
                // })
            }
        }
        var o = r(i),
            u = null,
            l = null;
        n.observe(".js-pinned-repos-reorder-list", function() {
            u = o["default"].create(this, {
                animation: 150,
                item: ".js-pinned-repo-list-item",
                handle: ".js-pinned-repository-reorder",
                onUpdate: s,
                onStart: a,
                chosenClass: "is-dragging"
            })
        }), e.on("submit", ".js-pinned-repos-reorder-form", function(e) {
            e.preventDefault()
        })
    }), define("github/legacy/pages/users/profile-sidebar", ["../../../typecast", "../../../observe"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e);
        t.observe(".js-user-profile-sticky-fields.is-stuck", function() {
            var e = i["default"](document.querySelector(".js-user-profile-sticky-bar"), HTMLElement);
            return {
                add: function() {
                    e.classList.add("is-stuck")
                },
                remove: function() {
                    e.classList.remove("is-stuck")
                }
            }
        }), t.observe(".js-user-profile-follow-button.is-stuck", function() {
            var e = i["default"](document.querySelector(".js-user-profile-sticky-bar"), HTMLElement);
            return {
                add: function() {
                    e.classList.add("is-follow-stuck")
                },
                remove: function() {
                    e.classList.remove("is-follow-stuck")
                }
            }
        }), t.observe(".js-user-profile-following-toggle .js-toggler-container.on", function() {
            var e = i["default"](document.querySelector(".js-user-profile-following-mini-toggle .js-toggler-container"), HTMLElement);
            return {
                add: function() {
                    e.classList.add("on")
                },
                remove: function() {
                    e.classList.remove("on")
                }
            }
        }), t.observe(".js-user-profile-following-mini-toggle .js-toggler-container.on", function() {
            var e = i["default"](document.querySelector(".js-user-profile-following-toggle .js-toggler-container"), HTMLElement);
            return {
                add: function() {
                    e.classList.add("on")
                },
                remove: function() {
                    e.classList.remove("on")
                }
            }
        })
    }), define("github/legacy/pages/wiki", ["../../fetch", "../../jquery", "../../invariant"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(t);
        r["default"](function() {
            function t() {
                var a = document.getElementById("current-version");
                n.invariant(a instanceof HTMLInputElement);
                var s = a.value;
                s && e.fetchText("_current").then(function(e) {
                    s == e ? setTimeout(t, 5e3) : i || (r["default"]("#gollum-error-message").text("Someone has edited the wiki since you started. Please reload this page and re-apply your changes."), r["default"]("#gollum-error-message").show(), r["default"]("#gollum-editor-submit").attr("disabled", "disabled"), r["default"]("#gollum-editor-submit").attr("value", "Cannot Save, Someone Else Has Edited"))
                })
            }
            var i = !1;
            r["default"]("#gollum-editor-body").each(t), r["default"]("#gollum-editor-submit").click(function() {
                i = !0
            })
        })
    }), define("github/legacy/index", ["./behaviors/ajax-pagination", "./behaviors/ajax_error", "./behaviors/ajax_loading", "./behaviors/analytics", "./behaviors/autocheck", "./behaviors/autocomplete", "./behaviors/autosearch_form", "./behaviors/autosubmit", "./behaviors/billing/addons", "./behaviors/billing/credit_card_fields", "./behaviors/billing/payment_methods", "./behaviors/browser-features-stats", "./behaviors/bundle-download-stats", "./behaviors/buttons", "./behaviors/check_all", "./behaviors/clippable_behavior", "./behaviors/commenting/ajax", "./behaviors/commenting/close", "./behaviors/commenting/edit", "./behaviors/commenting/focus", "./behaviors/commenting/markdown-toolbar", "./behaviors/commenting/preview", "./behaviors/conversation-anchor-stats", "./behaviors/crop_avatar", "./behaviors/dirty_menus", "./behaviors/disable", "./behaviors/facebox", "./behaviors/facebox-button", "./behaviors/filterable", "./behaviors/flash", "./behaviors/focus_delay", "./behaviors/force-push-default-branch", "./behaviors/g-emoji-element", "./behaviors/issue-references", "./behaviors/js-immediate-updates", "./behaviors/labeled_button", "./behaviors/minibutton_accessibility", "./behaviors/notice", "./behaviors/permalink", "./behaviors/pjax", "./behaviors/pjax-loader", "./behaviors/pjax/beforeunload", "./behaviors/pjax/exceptions", "./behaviors/pjax/head", "./behaviors/pjax_timing", "./behaviors/print_popup", "./behaviors/quick_issue", "./behaviors/quick_submit", "./behaviors/quicksearch", "./behaviors/quote-markdown-selection", "./behaviors/quote_selection", "./behaviors/reactions", "./behaviors/removed_contents", "./behaviors/repo-list", "./behaviors/session-resume", "./behaviors/size_to_fit", "./behaviors/social", "./behaviors/socket_channel", "./behaviors/stale_session", "./behaviors/suggester", "./behaviors/survey", "./behaviors/tag_input", "./behaviors/team-members", "./behaviors/timeline_marker", "./behaviors/timeline_progressive_disclosure", "./behaviors/timing_stats", "./behaviors/unread_comments", "./behaviors/unread_item_counter", "./behaviors/user_content", "./behaviors/user_resize", "./behaviors/validation", "./behaviors/will-transition-once", "./graphs/calendar-sample", "./graphs/network", "./pages/account_membership", "./pages/audit_log", "./pages/billing_settings/coupon_redemption", "./pages/billing_settings/survey", "./pages/blob", "./pages/blob/blob_edit", "./pages/blob/csv", "./pages/codesearch/advanced_search", "./pages/commits", "./pages/compare", "./pages/diffs/expander", "./pages/diffs/line-comments", "./pages/diffs/line-highlight", "./pages/diffs/linkable-line-number", "./pages/diffs/prose_diff", "./pages/diffs/split", "./pages/diffs/toggle-file-notes", "./pages/diffs/tr-collapsing", "./pages/directory", "./pages/early_access_tracking", "./pages/edit_repositories/options", "./pages/edit_repositories/repository-collabs", "./pages/edit_repositories/repository-options", "./pages/editors/render", "./pages/explore", "./pages/files/ref_create", "./pages/files/repo_next", "./pages/generated_pages/theme_picker", "./pages/gist/drag_drop", "./pages/gist/gist_edit", "./pages/gist/task_lists", "./pages/header", "./pages/hiring/credits", "./pages/hiring/job_form", "./pages/hiring/job_search", "./pages/hooks", "./pages/integrations", "./pages/issues/filters", "./pages/issues/label_editor", "./pages/issues/labels", "./pages/issues/legacy", "./pages/issues/list", "./pages/issues/replies", "./pages/issues/sidebar", "./pages/issues/triage", "./pages/milestones", "./pages/notifications", "./pages/notifications/subscriptions", "./pages/oauth", "./pages/orgs", "./pages/orgs/invitations/new", "./pages/orgs/invitations/reinstate", "./pages/orgs/members/change-role", "./pages/orgs/members/index", "./pages/orgs/members/show", "./pages/orgs/migration/customize_member_privileges", "./pages/orgs/migration/index", "./pages/orgs/new", "./pages/orgs/per_seat", "./pages/orgs/repositories/index", "./pages/orgs/repositories/permission-select", "./pages/orgs/security_settings/index", "./pages/orgs/settings/change-default-repository-permission", "./pages/orgs/settings/security", "./pages/orgs/team", "./pages/orgs/teams/change-visibility", "./pages/orgs/teams/import", "./pages/orgs/teams/index", "./pages/orgs/teams/new", "./pages/orgs/teams/show", "./pages/orgs/transform", "./pages/pages_composer", "./pages/pull_requests/composer", "./pages/pull_requests/discussion-timeline-regrouping", "./pages/pull_requests/merge", "./pages/pull_requests/merging_error", "./pages/pull_requests/restore_branch", "./pages/pulls/show", "./pages/repositories/fork", "./pages/repositories/pulse", "./pages/repositories/repo_new", "./pages/repositories/side_navigation", "./pages/repository_imports/show", "./pages/sessions/two_factor", "./pages/settings/user/saved-replies", "./pages/settings/user/settings", "./pages/settings/user/user_sessions", "./pages/signup", "./pages/site-search", "./pages/site/contact", "./pages/site/features", "./pages/site/header_notifications", "./pages/site/keyboard_shortcuts", "./pages/site_status", "./pages/stafftools/ldap", "./pages/tree_finder", "./pages/users/contributions", "./pages/users/pinned-repositories", "./pages/users/pinned-repository-reordering", "./pages/users/profile-sidebar", "./pages/wiki"], function() {}), define("github/length-limited-input-with-warning", ["./observe"], function(e) {
        function t() {
            var e = this,
                t = parseInt(e.getAttribute("data-input-max-length"), 10),
                n = e.value,
                i = n.replace(/(\r\n|\n|\r)/g, "\r\n"),
                r = t - i.length;
            0 >= r && (e.value = i.substr(0, t), r = 0);
            var a = e.getAttribute("data-warning-text"),
                s = e.closest(".js-length-limited-input-container"),
                o = s.querySelector(".js-length-limited-input-warning");
            5 >= r ? (o.textContent = a.replace(new RegExp("{{remaining}}", "g"), r), o.classList.remove("d-none")) : (o.textContent = "", o.classList.add("d-none"))
        }
        e.observe(".js-length-limited-input", {
            add: function() {
                this.addEventListener("input", t), this.addEventListener("change", t)
            },
            remove: function() {
                this.removeEventListener("input", t), this.removeEventListener("change", t)
            }
        })
    }), define("github/link-prefetch-viewed", ["./observe"], function(e) {
        e.observe("link[rel=prefetch-viewed]", {
            init: function() {
                requestIdleCallback(function() {
                    fetch(location.href, {
                        method: "HEAD",
                        credentials: "same-origin",
                        headers: {
                            Purpose: "prefetch-viewed"
                        }
                    })
                })
            }
        })
    }), define("github/milestone-dragging", ["./jquery", "sortablejs", "./debounce", "./fetch", "./has-interactions", "./navigation", "./observe", "delegated-events", "./preserve-position", "./form", "./google-analytics"], function(e, t, n, i, r, a, s, o, u, l, c) {
        function d(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function f(e) {
            var t, n;
            return regeneratorRuntime.async(function(a) {
                for (;;) switch (a.prev = a.next) {
                    case 0:
                        if (!r.hasInteractions(e)) {
                            a.next = 2;
                            break
                        }
                        return a.abrupt("return");
                    case 2:
                        return t = e.getAttribute("data-url"), a.next = 5, regeneratorRuntime.awrap(i.fetchSafeDocumentFragment(document, t));
                    case 5:
                        n = a.sent, u.preserveInteractivePosition(function() {
                            e.replaceWith(n)
                        });
                    case 7:
                    case "end":
                        return a.stop()
                }
            }, null, this)
        }

        function h(e, t) {
            return e.querySelectorAll(".js-draggable-issue")[t]
        }

        function m(e, t) {
            w({
                item: t,
                newIndex: Array.from(e.querySelectorAll(".js-draggable-issue")).indexOf(t),
                trackingLabel: "keyboard-shortcut"
            }), a.refocus(t.closest(".js-navigation-container"), t)
        }

        function v() {
            if (!j.has(this)) {
                var e = b["default"].create(this, {
                    animation: 150,
                    item: ".js-draggable-issue",
                    handle: ".js-drag-handle",
                    onUpdate: w,
                    chosenClass: "is-dragging"
                });
                j.set(this, e)
            }
        }

        function p() {
            var e = j.get(this);
            e && e.destroy()
        }
        var g = d(e),
            b = d(t),
            y = d(n),
            j = new WeakMap;
        g["default"](document).on("socket:message", ".js-milestone-issues", function() {
            var e = this.querySelector(".js-draggable-issues-container");
            return "1" === e.getAttribute("data-is-sorting") ? void e.removeAttribute("data-is-sorting") : void f(this)
        }), g["default"](document).on("ajaxSuccess", ".js-milestone-sort-form", function(e, t, n, i) {
            i.error ? this.querySelector(".js-milestone-changed").classList.remove("d-none") : this.querySelector(".js-timestamp").value = i.updated_at
        });
        var w = y["default"](function(e) {
            var t = e.newIndex,
                n = e.item,
                i = n.closest(".js-draggable-issues-container"),
                r = n.getAttribute("data-id"),
                a = h(i, t - 1),
                s = a && a.getAttribute("data-id"),
                o = i.closest(".js-milestone-sort-form");
            o.querySelector(".js-item-id").value = r, o.querySelector(".js-prev-id").value = s || "", c.trackEvent({
                category: "Milestone",
                action: "reorder",
                label: e.trackingLabel || "drag-and-drop"
            }), i.setAttribute("data-is-sorting", "1"), l.submit(o)
        }, 200);
        o.on("navigation:keydown", ".js-draggable-issue", function(e) {
            var t = this.closest(".js-draggable-issues-container");
            if ("J" === e.detail.hotkey) {
                var n = this.nextElementSibling;
                n && (this.parentNode.insertBefore(this, n.nextElementSibling), m(t, this), e.preventDefault(), e.stopPropagation())
            } else "K" === e.detail.hotkey && (this.parentNode.insertBefore(this, this.previousElementSibling), m(t, this), e.preventDefault(), e.stopPropagation())
        }), s.observe(".js-draggable-issues-container", {
            add: v,
            remove: p
        }), s.observe(".js-backfill-status", function() {
            var e = this;
            setTimeout(function() {
                e.setAttribute("src", e.getAttribute("data-xsrc"))
            }, 3e3)
        })
    }), define("github/mobile-preference", ["delegated-events"], function(e) {
        e.on("submit", ".js-mobile-preference-form", function() {
            var e = this.querySelector(".js-mobile-preference-anchor-field");
            e.value = window.location.hash.substr(1)
        })
    }), define("github/capture-keypresses", ["exports"], function(e) {
        function t(e) {
            var t = e.createElement("textarea");
            return t.style.position = "fixed", t.style.top = 0, t.style.left = 0, t.style.opacity = 0, e.body.appendChild(t), t.focus(),
                function() {
                    return t.blur(), t.remove(), t.value
                }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = t
    }), define("github/pjax/capture-keypresses", ["../capture-keypresses", "../typecast", "../form", "delegated-events"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var a = r(e),
            s = r(t),
            o = null;
        i.on("pjax:click", ".js-pjax-capture-input", function() {
            o = a["default"](document)
        }), i.on("pjax:end", "#js-repo-pjax-container", function() {
            if (o) {
                var e = o(),
                    t = s["default"](document.querySelector(".js-pjax-restore-captured-input"), HTMLInputElement);
                t && e && n.changeValue(t, e), o = null
            }
        })
    }), define("github/pjax/history-navigate", ["../history", "delegated-events"], function(e, t) {
        t.on("pjax:click", ".js-pjax-history-navigate", function(t) {
            this.href === e.getBackURL() ? (history.back(), t.detail.relatedEvent.preventDefault(), t.preventDefault()) : this.href === e.getForwardURL() && (history.forward(), t.detail.relatedEvent.preventDefault(), t.preventDefault())
        })
    }), define("github/pjax/link-prefetch", ["../pjax", "../observe", "./prefetch"], function(e, t, n) {
        t.observe("link[rel=pjax-prefetch]", {
            init: function(t) {
                var i = e.fetch(t, {
                    headers: {
                        Purpose: "prefetch"
                    }
                });
                n.setPrefetchResponse(t, i)
            }
        })
    }), define("github/magic-move", ["exports", "./invariant", "./once"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r() {
            return new Promise(window.requestAnimationFrame)
        }

        function a(e) {
            for (var t = new WeakMap, n = 0; n < e.length; n++) {
                var i = e[n];
                t.set(i, i.getBoundingClientRect())
            }
            return t
        }

        function s(e, n, i) {
            var a, s, o, l;
            return regeneratorRuntime.async(function(c) {
                for (;;) switch (c.prev = c.next) {
                    case 0:
                        return a = n.get(e), s = i.get(e), t.invariant(a && s, "Must have old and new positions for the element to animate"), o = a.left - s.left, l = a.top - s.top, c.next = 7, regeneratorRuntime.awrap(r());
                    case 7:
                        return e.style.transform = "translateZ(0) translate(" + o + "px, " + l + "px)", e.style.transition = "transform 0s", c.next = 11, regeneratorRuntime.awrap(r());
                    case 11:
                        return e.style.transform = "", e.style.transition = "", c.abrupt("return", u["default"](e, "transitionend"));
                    case 14:
                    case "end":
                        return c.stop()
                }
            }, null, this)
        }

        function o(e, t) {
            for (var n = a(e), i = [], r = 0; r < e.length; r++) {
                var o = e[r];
                i.push(s(o, t, n))
            }
            return Promise.all(i)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.recordPositions = a, e.animate = o;
        var u = i(n)
    }), define("github/project-updater", ["exports", "./magic-move", "./typecast", "./debounce", "./fetch"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function s(e) {
            if (e) {
                m && clearTimeout(m);
                var t = f["default"](document.querySelector(".js-project-updated-message"), HTMLElement);
                t.textContent = e, t.classList.remove("d-none"), m = setTimeout(function() {
                    t.textContent = "", t.classList.add("d-none")
                }, 3e3)
            }
        }

        function o(e) {
            for (; e.firstChild;) e.removeChild(e.firstChild)
        }

        function u(e, t) {
            var n = "project-column-" + e.id,
                i = document.getElementById(n);
            if (i) return i;
            var r = document.createElement("include-fragment");
            return r.id = n, r.src = t + "/" + e.id, r
        }

        function l(e, t) {
            var n = "card-" + e,
                i = document.getElementById(n);
            if (i) return i;
            var r = function() {
                var i = document.createElement("include-fragment");
                return i.id = n, i.src = t + "/" + e, i.onerror = function() {
                    i.remove()
                }, {
                    v: i
                }
            }();
            return "object" == typeof r ? r.v : void 0
        }

        function c(e, t) {
            var n = Array.from(e.querySelectorAll(".js-project-column")),
                i = n.map(function(e) {
                    return e.getAttribute("data-id")
                }),
                r = t.columns.map(function(e) {
                    return String(e.id)
                });
            return r.join(",") !== i.join(",")
        }

        function d(e, n) {
            var i, a, d, h, m, v, p, g, b, y, j, w, x, S, k, L, _, E, C, q, T, A, M, H, I, D, P, R, O, N;
            return regeneratorRuntime.async(function(F) {
                for (;;) switch (F.prev = F.next) {
                    case 0:
                        if (i = document.activeElement, s(n.message), a = e.querySelectorAll(".js-project-column"), d = t.recordPositions(a), h = e.getAttribute("data-url"),
                            m = e.getAttribute("data-columns-url"), v = e.getAttribute("data-cards-url"), F.t0 = n.state, F.t0) {
                            F.next = 12;
                            break
                        }
                        return F.next = 11, regeneratorRuntime.awrap(r.fetchJSON(h));
                    case 11:
                        F.t0 = F.sent;
                    case 12:
                        if (p = F.t0, !c(e, p)) {
                            F.next = 26;
                            break
                        }
                        for (g = {}, b = document.createDocumentFragment(), y = p.columns, j = 0; j < y.length; j++) w = y[j], x = u(w, m), S = x.querySelector(".js-project-column-cards"), S && (g[S.id] = S.scrollTop), b.appendChild(x);
                        k = e.querySelector(".js-new-project-column-container"), k && k.remove(), o(e), e.appendChild(b), k && e.appendChild(k);
                        for (L in g) S = document.getElementById(L), S.scrollTop = g[L];
                        return F.next = 26, regeneratorRuntime.awrap(t.animate(a, d));
                    case 26:
                        _ = e.querySelectorAll(".js-project-column-card"), E = t.recordPositions(_), C = p.columns, q = 0;
                    case 30:
                        if (!(q < C.length)) {
                            F.next = 48;
                            break
                        }
                        if (T = C[q], A = document.getElementById("project-column-" + T.id)) {
                            F.next = 35;
                            break
                        }
                        return F.abrupt("return");
                    case 35:
                        for (M = A.querySelector(".js-project-column-name"), M && (H = f["default"](A.querySelector(".js-project-column-name-field"), HTMLInputElement), M.textContent = T.name, H.value = T.name, H.setAttribute("value", T.name)), I = A.querySelector(".js-column-card-count"), I && (I.textContent = T.card_ids.length), D = document.createDocumentFragment(), P = T.card_ids, R = 0; R < P.length; R++) O = P[R], D.appendChild(l(O, v));
                        N = f["default"](A.querySelector(".js-project-column-cards"), HTMLElement), o(N), N.appendChild(D);
                    case 45:
                        q++, F.next = 30;
                        break;
                    case 48:
                        return F.next = 50, regeneratorRuntime.awrap(t.animate(_, E));
                    case 50:
                        document.activeElement !== i && i.focus();
                    case 51:
                    case "end":
                        return F.stop()
                }
            }, null, this)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.updateProject = void 0;
        var f = a(n),
            h = a(i),
            m = void 0;
        e.updateProject = h["default"](d, 100)
    }), define("github/projects", ["./throttled-input", "delegated-events", "./jquery", "sortablejs", "./typecast", "./menu", "./fetch", "./focused", "./hash-change", "./hotkey", "./invariant", "./observe", "./form", "./project-updater"], function(e, t, n, i, r, a, s, o, u, l, c, d, f, h) {
        function m(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function v(e) {
            e.classList.add("highlighted"), e.scrollIntoView(), e.closest(".js-project-column").scrollTop = 0, setTimeout(function() {
                e.classList.remove("highlighted")
            }, 4e3)
        }

        function p(e, t) {
            if (!t) return q["default"](e.elements.namedItem("card_id"), HTMLInputElement).value = "", q["default"](e.elements.namedItem("content_id"), HTMLInputElement).value = "", void(q["default"](e.elements.namedItem("content_type"), HTMLInputElement).value = "");
            var n = t.getAttribute("data-card-id");
            n ? (q["default"](e.elements.namedItem("card_id"), HTMLInputElement).value = n, q["default"](e.elements.namedItem("content_id"), HTMLInputElement).value = "", q["default"](e.elements.namedItem("content_type"), HTMLInputElement).value = "") : (q["default"](e.elements.namedItem("card_id"), HTMLInputElement).value = "", q["default"](e.elements.namedItem("content_id"), HTMLInputElement).value = t.getAttribute("data-content-id"), q["default"](e.elements.namedItem("content_type"), HTMLInputElement).value = t.getAttribute("data-content-type")), q["default"](e.elements.namedItem("client_uid"), HTMLInputElement).value = H
        }

        function g(e, t) {
            var n = e.querySelector(".js-column-card-count"),
                i = parseInt(n.textContent.trim());
            n.textContent = i + t
        }

        function b(e) {
            var t = e.item.closest(".js-project-column");
            g(t, 1);
            var n = e.from && e.from.closest(".js-project-column");
            n && g(n, -1)
        }

        function y(e) {
            var t = e.item,
                n = t.closest(".js-project-column");
            if (b(e), n) {
                var i = n.querySelector(".js-project-content-form");
                i.reset(), p(i, t);
                var r = t.previousElementSibling;
                r ? i.elements.namedItem("previous_card_id").value = r.getAttribute("data-card-id") : i.elements.namedItem("previous_card_id").value = "", f.submit(i)
            }
        }

        function j(e) {
            var t = e.item,
                n = q["default"](document.querySelector(".js-reorder-columns-form"), HTMLFormElement);
            q["default"](n.elements.namedItem("column_id"), HTMLInputElement).value = t.getAttribute("data-id");
            var i = t.previousElementSibling;
            i && (q["default"](n.elements.namedItem("previous_column_id"), HTMLInputElement).value = i.getAttribute("data-id")), f.submit(n)
        }

        function w(e) {
            var t = q["default"](document.querySelector(e), HTMLElement);
            t.classList.remove("d-none")
        }

        function x(e) {
            var t = q["default"](document.querySelector(e), HTMLElement);
            t.classList.add("d-none")
        }

        function S() {
            var e = document.querySelector(".js-project-activity-results");
            if (e) {
                var t = e.getAttribute("data-project-activity-url");
                c.invariant(t, "`data-project-activity-url` must exist");
                var n = new URL(t, window.location.origin);
                e.setAttribute("src", n.toString())
            }
        }

        function k() {
            var e = this.querySelector("textarea"),
                t = this.closest(".js-project-note-form"),
                n = t.querySelector("button"),
                i = e.value || "",
                r = Number(e.getAttribute("data-maxlength")),
                a = t.querySelector(".js-note-limit-warning"),
                s = i.match(/\n/g),
                o = s ? i.length + s.length : i.length;
            if (r >= o ? n.removeAttribute("disabled") : n.disabled = !0, o > r - 100) {
                var u = r - o,
                    l = 1 === Math.abs(u) ? "character" : "characters";
                a.textContent = u + " " + l + " remaining.", a.classList.remove("d-none"), a.classList.toggle("text-red", 0 > u)
            } else a.classList.add("d-none")
        }

        function L(e) {
            return "esc" === M["default"](e) ? void this.closest(".js-details-container").classList.remove("open") : void 0
        }

        function _() {
            var e, t, n, i;
            return regeneratorRuntime.async(function(r) {
                for (;;) switch (r.prev = r.next) {
                    case 0:
                        return e = this.getAttribute("data-results-url"), t = this.closest(".js-select-menu"), t.classList.add("is-sending"), r.next = 5, regeneratorRuntime.awrap(s.fetchText(e + "?query=" + this.value));
                    case 5:
                        n = r.sent, t.classList.remove("is-sending"), i = t.querySelector(".js-project-repository-picker-results"), i.innerHTML = n, i.style.display = "block";
                    case 10:
                    case "end":
                        return r.stop()
                }
            }, null, this)
        }
        var E = m(n),
            C = m(i),
            q = m(r),
            T = m(o),
            A = m(u),
            M = m(l),
            H = void 0,
            I = document.querySelector(".js-client-uid");
        I && (H = I.getAttribute("data-uid") || ""), t.on("card:testAction", ".js-project-column-card", function() {
            y({
                item: this
            })
        }), t.on("column:testAction", ".js-project-column", function() {
            j({
                item: this
            })
        }), E["default"](document).on("ajaxSuccess", ".js-project-update-card", function(e, t, n, i) {
            var r = E["default"].parseHTML(i)[0],
                a = r.getAttribute("data-card-id"),
                s = void 0;
            if (a && (s = document.querySelector('[data-card-id="' + a + '"]')), !s) {
                var o = r.getAttribute("data-content-type"),
                    u = r.getAttribute("data-content-id");
                s = document.querySelector('[data-content-type="' + o + '"][data-content-id="' + u + '"]')
            }
            E["default"](s).replaceWith(r)
        }), E["default"](document).on("ajaxSuccess", ".js-convert-note-to-issue-form", function() {
            t.fire(document, "facebox:close")
        }), E["default"](document).on("ajaxSuccess", ".js-create-project-column", function(e, n, i, r) {
            var a = E["default"].parseHTML(r)[0],
                s = a.classList.contains("js-column-form-container");
            if (s) this.closest(".js-column-form-container").replaceWith(a);
            else {
                var o = q["default"](document.querySelector(".js-new-project-column-container"), HTMLElement);
                o.insertAdjacentHTML("beforebegin", r), Array.from(document.querySelectorAll(".js-create-project-column")).forEach(function(e) {
                    c.invariant(e instanceof HTMLFormElement, "Every .js-create-project-column must be a HTMLFormElement"), p(e, null)
                }), t.fire(document, "facebox:close")
            }
        }), E["default"](document).on("ajaxSuccess", ".js-update-project-column", function(e, n, i, r) {
            var a = E["default"].parseHTML(r)[0],
                s = a.classList.contains("js-column-form-container");
            if (s) this.closest(".js-column-form-container").replaceWith(a);
            else {
                var o = this.getAttribute("data-column-id"),
                    u = document.querySelector('.js-project-column[data-id="' + o + '"]');
                u.replaceWith(a), t.fire(document, "facebox:close")
            }
        }), E["default"](document).on("ajaxSuccess", ".js-delete-project-column", function() {
            var e = this.getAttribute("data-column-id");
            if (!e) throw new Error("Unable to get attribute `data-column-id`");
            q["default"](document.querySelector('.js-project-column[data-id="' + e + '"]'), HTMLElement).remove(), t.fire(document, "facebox:close")
        }), d.observe(".js-project-column-card", function() {
            var e = this;
            this.id === document.location.hash.substr(1) && setTimeout(function() {
                v(e)
            }, 1)
        }), E["default"](document).on("ajaxSuccess", ".js-delete-card", function() {
            var e = this.closest(".js-project-column");
            e && g(e, -1), this.closest(".js-project-column-card").remove()
        }), E["default"](document).on("ajaxSuccess", ".js-note-form", function(e, n, i, r) {
            var a = E["default"].parseHTML(r)[0],
                s = a.classList.contains("js-note-form-container");
            if (s) this.closest(".js-note-form-container").replaceWith(a);
            else {
                var o = this.getAttribute("data-card-id"),
                    u = document.getElementById("card-" + o);
                u.replaceWith(a), t.fire(document, "facebox:close")
            }
        }), t.on("click", ".js-card-link-fallback", function() {
            a.deactivate(this.closest(".js-menu-container"))
        }), A["default"](function(e) {
            if (e.target.matches && e.target.matches(".js-project-column-card")) {
                var t = e.target;
                v(t)
            }
        }), t.on("click", ".js-show-project-triage", function() {
            w(".js-project-triage-pane"), w(".js-project-menu-pane")
        }), t.on("click", ".js-hide-project-triage", function() {
            x(".js-project-triage-pane")
        }), t.on("click", ".js-show-project-menu", function() {
            w(".js-project-menu-pane")
        }), t.on("click", ".js-show-project-activity", function() {
            S(), w(".js-project-activity-pane")
        }), t.on("click", ".js-hide-project-activity", function() {
            x(".js-project-activity-pane")
        }), t.on("click", ".js-hide-project-menu", function() {
            var e = Array.from(document.querySelectorAll(".js-project-pane"));
            e.forEach(function(e) {
                e.classList.add("d-none")
            })
        }), E["default"](document).on("ajaxSuccess", ".js-project-search-form", function(e, t, n, i) {
            this.querySelector(".js-project-search-results").innerHTML = i
        }), E["default"](document).on("ajaxSuccess", ".js-project-activity-form", function(e, t, n, i) {
            var r = this.closest(".js-project-activity-pane"),
                a = r.querySelector(".js-project-activity-container");
            a && (c.invariant(a instanceof HTMLElement), a.innerHTML = i), r && (c.invariant(r instanceof HTMLElement), r.classList.remove("Details--on"))
        }), d.observe(".js-project-column-card", function() {
            if (this.getAttribute("data-card-id")) {
                var e = this.getAttribute("data-content-type"),
                    t = this.getAttribute("data-content-id"),
                    n = document.getElementById("card-" + e + "-" + t);
                n && n.remove()
            }
        }), d.observe(".js-project-note-form", {
            add: function() {
                this.addEventListener("input", k), this.addEventListener("keyup", L)
            },
            remove: function() {
                this.removeEventListener("input", k), this.removeEventListener("keyup", L)
            }
        }), T["default"](document, ".js-project-repository-picker-field", {
            focusin: function() {
                e.addThrottledInputEventListener(this, _)
            },
            focusout: function() {
                e.removeThrottledInputEventListener(this, _)
            }
        }), E["default"](document).on("ajaxSend", ".js-project-note-form", function() {
            var e = this.querySelector("textarea");
            this.querySelector("button").disabled = !0, e.disabled = !0
        }), E["default"](document).on("ajaxSuccess", ".js-project-note-form", function(e, t, n, i) {
            var r = this.closest(".js-project-column");
            if (r) {
                var a = r.querySelector(".js-project-column-cards");
                E["default"](a).prepend(i), g(r, 1)
            }
            this.querySelector(".js-note-limit-warning").classList.add("d-none");
            var s = this.querySelector("textarea");
            s.disabled = !1, s.value = "", s.focus()
        }), E["default"](document).on("socket:message", ".js-project-columns-container", function(e, t) {
            if (H !== t.client_uid) {
                h.updateProject(this, t);
                var n = q["default"](document.querySelector(".js-project-search-form"), HTMLFormElement);
                f.submit(n)
            }
        }), E["default"](document).on("socket:message", function(e, t) {
            if (t && t.is_project_activity) {
                var n = document.querySelector(".js-project-activity-pane");
                n && n.classList.add("Details--on")
            }
        }), d.observe(".js-project-columns-drag-container", function() {
            C["default"].create(this, {
                animation: 150,
                item: ".js-project-column",
                group: "project-column",
                onUpdate: j
            })
        }), d.observe(".js-card-drag-container", function() {
            C["default"].create(this, {
                animation: 150,
                item: ".js-project-column-card",
                group: "project-card",
                onAdd: y,
                onUpdate: y
            })
        }), d.observe(".js-project-search-results-drag-container", function() {
            C["default"].create(this, {
                sort: !1,
                animation: 150,
                item: ".js-project-column-card",
                group: {
                    name: "project-card",
                    put: !1,
                    pull: !0
                },
                onAdd: y,
                onUpdate: y
            })
        }), d.observe(".js-project-column-card", function() {
            if (this.getAttribute("data-card-id")) {
                var e = this.getAttribute("data-content-type"),
                    t = this.getAttribute("data-content-id"),
                    n = document.getElementById("card-" + e + "-" + t);
                n && n.remove()
            }
        }), d.observe(".js-client-uid-field", function() {
            this.value = H
        })
    }), define("github/proxy-site-reporting", ["./proxy-site-detection", "./failbot"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e),
            r = "$__",
            a = document.querySelector("meta[name=js-proxy-site-detection-payload]"),
            s = document.querySelector("meta[name=expected-hostname]");
        if (a instanceof HTMLMetaElement && s instanceof HTMLMetaElement && i["default"](document)) {
            var o = {
                    url: window.location.href,
                    expectedHostname: s.content,
                    documentHostname: document.location.hostname,
                    proxyPayload: a.content
                },
                u = new Error,
                l = {};
            l["" + r] = btoa(JSON.stringify(o)), t.reportError(u, l)
        }
    }), define("github/pulls/change-base", ["../jquery", "../menu", "../facebox"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(e),
            a = i(n);
        r["default"](document).on("selectmenu:select", ".js-pull-base-branch-item", function(e) {
            var n = this.closest(".js-select-menu");
            t.deactivate(n), e.preventDefault(), n.querySelector(".js-pull-change-base-branch-field").value = this.getAttribute("data-branch"), a["default"](n.querySelector(".js-change-base-facebox").innerHTML)
        })
    }), define("github/pulls/commits-range-selection", ["../jquery", "../once", "../pjax"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t, n) {
            var i = Array.from(e.querySelectorAll(".js-navigation-item")),
                r = i.indexOf(t),
                a = i.indexOf(n);
            if (-1 === r) throw new Error("Couldn't find startIndex in container");
            if (-1 === a) throw new Error("Couldn't find endItem in container");
            if (s(e), i[a].classList.add("is-last-in-range"), r > a) {
                var u = [a, r];
                r = u[0], a = u[1]
            }
            o["default"](i).addClass("js-navigation-open"), o["default"](i.slice(r, a + 1)).addClass("is-range-selected").removeClass("js-navigation-open")
        }

        function a(e) {
            var t, n;
            return regeneratorRuntime.async(function(i) {
                for (;;) switch (i.prev = i.next) {
                    case 0:
                        return n = function(n) {
                            r(e, t, n.target)
                        }, t = null, t = e.querySelector(".js-navigation-item.navigation-focus"), t && (r(e, t, t), o["default"](e).on("navigation:focus", n)), i.next = 6, regeneratorRuntime.awrap(u["default"](window, "keyup", function(e) {
                            return !e.shiftKey
                        }));
                    case 6:
                        o["default"](e).off("navigation:focus", n), s(e);
                    case 8:
                    case "end":
                        return i.stop()
                }
            }, null, this)
        }

        function s(e) {
            o["default"](e).find(".js-navigation-item").removeClass("is-range-selected is-last-in-range")
        }
        var o = i(e),
            u = i(t),
            l = i(n);
        o["default"](document).on("navigation:open", ".js-diffbar-commits-list .js-navigation-item", function(e) {
            if (e.shiftKey) {
                e.preventDefault();
                var t = this.closest(".js-diffbar-commits-menu");
                if (this.classList.contains("is-range-selected")) {
                    e.stopPropagation();
                    var n = t.querySelectorAll(".js-navigation-item.is-range-selected"),
                        i = n[0],
                        r = n[n.length - 1],
                        s = t.getAttribute("data-range-url"),
                        o = i.getAttribute("data-parent-commit"),
                        u = r.getAttribute("data-commit"),
                        c = o && u ? o + ".." + u : u,
                        d = s.replace("$range", c);
                    l["default"]({
                        url: d,
                        container: "#js-repo-pjax-container"
                    })
                } else e.stopImmediatePropagation(), a(t)
            }
        })
    }), define("github/pulls/reviews", ["../jquery", "../menu", "../hash-change", "delegated-events", "../once", "../inflector"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o(e, t) {
            var n = e.closest(".js-review-state-classes"),
                i = n.querySelectorAll(".js-pending-review-comment").length;
            t && (i += t), n.classList.toggle("is-review-pending", i > 0);
            for (var r = document.querySelectorAll(".js-pending-review-comment-count"), s = 0; s < r.length; s++) {
                var o = r[s];
                o.textContent = i
            }
            for (var u = document.querySelectorAll(".js-pending-comment-count-type"), l = 0; l < u.length; l++) {
                var c = u[l];
                a.pluralizeNode(i, c)
            }
            i > 0 && ! function() {
                var t = e.querySelector(".js-menu-target");
                t.classList.add("anim-pulse-in"), d["default"](t, "animationend").then(function() {
                    return t.classList.remove("anim-pulse-in")
                })
            }()
        }

        function u(e) {
            var t = document.querySelector(".js-reviews-container");
            t && setTimeout(function() {
                return o(t, e)
            })
        }
        var l = s(e),
            c = s(n),
            d = s(r);
        c["default"](function() {
            var e = window.location.hash.slice(1);
            if ("submit-review" === e) {
                var n = document.querySelector(".js-reviews-container");
                t.activate(n)
            }
        }), l["default"](document).on("ajaxSuccess", ".js-inline-comment-form", function() {
            u()
        }), l["default"](document).on("ajaxSuccess", ".js-pending-review-comment .js-comment-delete", function() {
            u(-1)
        }), i.on("click", ".js-review-menu-target", function() {
            var e = this.form.querySelector(".js-review-requests-menu");
            t.activate(e)
        })
    }), define("github/releases", ["exports", "delegated-events", "./jquery", "./typecast", "./fetch", "./pjax", "./observe", "./history"], function(e, t, n, i, r, a, s, o) {
        function u(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function l(e) {
            var n = e.form;
            n.querySelector("#release_draft").value = "1", r.fetchJSON(n.action, {
                method: n.method,
                body: new FormData(n)
            }).then(function(i) {
                c(e, "is-saved"), setTimeout(c, 5e3, e, "is-default"), t.fire(n, "release:saved", {
                    release: i
                })
            })["catch"](function() {
                c(e, "is-failed")
            }), c(e, "is-saving")
        }

        function c(e, t) {
            var n;
            (n = e.classList).remove.apply(n, g), e.classList.add(t), e.disabled = "is-saving" === t
        }

        function d(e) {
            var t, n = document.querySelector(".release-target-wrapper"),
                i = document.querySelector(".js-release-tag");
            if (null != n && null != i) {
                switch (e) {
                    case "is-valid":
                        n.classList.add("d-none");
                        break;
                    case "is-loading":
                        break;
                    default:
                        n.classList.remove("d-none")
                }(t = i.classList).remove.apply(t, b), i.classList.add(e)
            }
        }

        function f(e) {
            if (e.value && e.value !== y.get(e)) {
                d("is-loading"), y.set(e, e.value);
                var t = new URL(e.getAttribute("data-url"), window.location.origin),
                    n = new URLSearchParams(t.search.slice(1));
                n.append("tag_name", e.value), t.search = n.toString(), r.fetchJSON(t).then(function(t) {
                    "duplicate" === t.status && parseInt(e.getAttribute("data-existing-id")) === parseInt(t.release_id) ? d("is-valid") : (p["default"](document.querySelector(".js-release-tag .js-edit-release-link"), HTMLElement).setAttribute("href", t.url), d("is-" + t.status))
                })["catch"](function() {
                    d("is-invalid")
                })
            }
        }

        function h(e, t, n) {
            return t + "/releases/" + e + "/" + n
        }

        function m(e) {
            var t = e.closest("form"),
                n = t.querySelector(".js-previewable-comment-form");
            if (n) {
                var i = n.getAttribute("data-base-preview-url");
                i || (i = n.getAttribute("data-preview-url"), n.setAttribute("data-base-preview-url", i));
                for (var r = e.querySelectorAll('input[name="release[tag_name]"], input[name="release[target_commitish]"]:checked'), a = new URL(i, window.location.origin), s = new URLSearchParams(a.search.slice(1)), o = 0; o < r.length; o++) {
                    var u = r[o];
                    u.value && s.append(u.name, u.value)
                }
                a.search = s.toString(), n.setAttribute("data-preview-url", a.toString())
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.saveDraft = l;
        var v = u(n),
            p = u(i);
        t.on("click", ".js-save-draft", function(e) {
            l(this), e.preventDefault()
        }), t.on("click", ".js-timeline-tags-expander", function() {
            this.closest(".js-timeline-tags").classList.remove("is-collapsed")
        });
        var g = ["is-default", "is-saving", "is-saved", "is-failed"];
        t.on("release:saved", ".js-release-form", function(e) {
            var t = e.detail.release,
                n = this,
                i = n.getAttribute("data-repo-url"),
                r = t.update_url || h("tag", i, t.tag_name);
            if (n.setAttribute("action", r), t.update_authenticity_token) {
                var s = n.querySelector("input[name=authenticity_token]");
                s.value = t.update_authenticity_token
            }
            var u = t.edit_url || h("edit", i, t.tag_name);
            o.replaceState(a.getState(), document.title, u);
            var l = document.querySelector("#delete_release_confirm form");
            if (l) {
                var c = t.delete_url || h("tag", i, t.tag_name);
                if (l.setAttribute("action", c), t.delete_authenticity_token) {
                    var d = p["default"](l.querySelector("input[name=authenticity_token]"), HTMLInputElement);
                    d.value = t.delete_authenticity_token
                }
            }
            var f = n.querySelector("#release_id");
            f.value || (f.value = t.id, v["default"](n).append('<input type="hidden" name="_method" value="put">'))
        }), t.on("click", ".js-publish-release", function() {
            p["default"](document.querySelector("#release_draft"), HTMLInputElement).value = "0"
        });
        var b = ["is-loading", "is-empty", "is-valid", "is-invalid", "is-duplicate", "is-pending"],
            y = new WeakMap;
        s.observe(".js-release-tag-field", function() {
            f(this), this.addEventListener("blur", function() {
                f(this)
            })
        }), t.on("change", ".js-release-tag", function() {
            m(this)
        }), s.observe(".js-release-form .js-previewable-comment-form", function() {
            var e = this.closest("form").querySelector(".js-release-tag");
            m(e)
        })
    }), define("github/repository-search", ["delegated-events", "./form"], function(e, t) {
        e.on("selectmenu:selected", ".js-repo-filter-select-menu", function() {
            t.submit(this.closest("form"))
        })
    }), define("github/select-menu/ajax", ["../jquery", "../menu"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e);
        i["default"](document).on("ajaxSuccess", ".js-select-menu:not([data-multiple])", function() {
            t.deactivate(this)
        }), i["default"](document).on("ajaxSend", ".js-select-menu:not([data-multiple])", function() {
            i["default"](this).addClass("is-loading")
        }), i["default"](document).on("ajaxComplete", ".js-select-menu", function() {
            i["default"](this).removeClass("is-loading")
        }), i["default"](document).on("ajaxError", ".js-select-menu", function() {
            i["default"](this).addClass("has-error")
        }), i["default"](document).on("menu:deactivate", ".js-select-menu", function() {
            i["default"](this).removeClass("is-loading has-error")
        })
    }), define("github/select-menu/base", ["../jquery", "../menu", "delegated-events"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e) {
            var t = new CustomEvent("selectmenu:select", {
                bubbles: !0,
                cancelable: !0
            });
            return e.dispatchEvent(t), t.defaultPrevented
        }
        var a = i(e);
        a["default"](document).on("navigation:open", ".js-select-menu:not([data-multiple]) .js-navigation-item", function() {
            var e = r(this);
            if (!e) {
                var i = a["default"](this),
                    s = this.closest(".js-select-menu");
                a["default"](s).find(".js-navigation-item.selected").removeClass("selected"), i.addClass("selected"), i.removeClass("indeterminate"), i.find("input[type=radio], input[type=checkbox]").prop("checked", !0).change(), n.fire(this, "selectmenu:selected"), a["default"](s).hasClass("is-loading") || t.deactivate(s)
            }
        }), a["default"](document).on("navigation:open", ".js-select-menu[data-multiple] .js-navigation-item", function() {
            var e = r(this);
            if (!e) {
                var t = a["default"](this),
                    i = t.hasClass("selected");
                t.toggleClass("selected", !i), t.removeClass("indeterminate"), t.find("input[type=radio], input[type=checkbox]").prop("checked", !i).change(), n.fire(this, "selectmenu:selected")
            }
        })
    }), define("github/select-menu/button", ["../jquery"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](document).on("selectmenu:selected", ".js-select-menu .js-navigation-item", function() {
            var e = this.closest(".js-select-menu"),
                t = n["default"](this).find(".js-select-button-text");
            t[0] && n["default"](e).find(".js-select-button").html(t.html());
            var i = n["default"](this).find(".js-select-menu-item-gravatar");
            t[0] && n["default"](e).find(".js-select-button-gravatar").html(i.html())
        })
    }), define("github/select-menu/css", ["../jquery", "../visible"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e),
            r = n(t);
        i["default"](document).on("selectmenu:change", ".js-select-menu .select-menu-list", function(e) {
            var t = i["default"](this).find(".js-navigation-item");
            if (t.removeClass("last-visible"), i["default"](Array.from(t).filter(r["default"])).last().addClass("last-visible"), !this.hasAttribute("data-filterable-for")) {
                var n = i["default"](e.target).hasClass("filterable-empty");
                i["default"](this).toggleClass("filterable-empty", n)
            }
        })
    }), define("github/select-menu/filterable", ["../jquery", "delegated-events"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e);
        i["default"](document).on("menu:activated selectmenu:load", ".js-select-menu", function() {
            var e = this.querySelector(".js-filterable-field");
            e && e.focus()
        }), i["default"](document).on("menu:deactivate", ".js-select-menu", function() {
            var e = this.querySelector(".js-filterable-field");
            e && (e.value = "", t.fire(e, "filterable:change"));
            for (var n = this.querySelectorAll(".js-navigation-item.selected"), i = 0; i < n.length; i++) {
                var r = n[i],
                    a = r.querySelector("input[type=radio], input[type=checkbox]");
                a && r.classList.toggle("selected", a.checked)
            }
            if (this.contains(document.activeElement)) try {
                document.activeElement.blur()
            } catch (s) {}
        })
    }), define("github/select-menu/navigation", ["../navigation", "../jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("menu:activate", ".js-select-menu", function() {
            i["default"](this).find(":focus").blur(), i["default"](this).find(".js-menu-target").addClass("selected");
            var t = this.querySelector(".js-navigation-container");
            t && e.push(t)
        }), i["default"](document).on("menu:deactivate", ".js-select-menu", function() {
            i["default"](this).find(".js-menu-target").removeClass("selected");
            var t = this.querySelector(".js-navigation-container");
            t && e.pop(t)
        }), i["default"](document).on("filterable:change selectmenu:tabchange", ".js-select-menu .select-menu-list", function() {
            var t = this.closest(".js-select-menu"),
                n = t.querySelector(".js-navigation-container");
            n && e.refocus(n, this)
        })
    }), define("github/select-menu/new", ["../jquery", "delegated-events"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e, t) {
            for (var n = e.querySelectorAll(".js-select-button-text, .js-select-menu-filter-text"), i = 0, r = n.length; r > i; i++) {
                var a = n[i],
                    s = a.textContent.toLowerCase().trim();
                if (s === t.toLowerCase()) return !0
            }
            return !1
        }
        var r = n(e);
        r["default"](document).on("filterable:change", ".js-select-menu .select-menu-list", function(e) {
            e = e.originalEvent;
            var n = this.querySelector(".js-new-item-form");
            if (n) {
                var a = e.relatedTarget.value;
                if ("" === a || i(this, a)) r["default"](this).removeClass("is-showing-new-item-form");
                else {
                    r["default"](this).addClass("is-showing-new-item-form");
                    var s = n.querySelector(".js-new-item-name");
                    "innerText" in s ? s.innerText = a : s.textContent = a;
                    var o = n.querySelector(".js-new-item-value");
                    o && (o.value = a)
                }
            }
            t.fire(e.target, "selectmenu:change")
        })
    }), define("github/select-menu/tabs", ["../jquery", "delegated-events", "../observe"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, n) {
            for (var i = e.getAttribute("data-tab-filter"), r = e.closest(".js-select-menu"), a = r.querySelectorAll(".js-select-menu-tab-bucket"), s = 0; s < a.length; s++) {
                var o = a[s];
                o.getAttribute("data-tab-filter") === i && (o.classList.toggle("selected", n), n && t.fire(o, "selectmenu:tabchange"))
            }
        }
        var a = i(e);
        a["default"](document).on("menu:activate selectmenu:load", ".js-select-menu", function() {
            var e = a["default"](this).find(".js-select-menu-tab");
            return e.attr("aria-selected", "false").removeClass("selected"), e.first().attr("aria-selected", "true").addClass("selected")
        }), a["default"](document).on("click", ".js-select-menu .js-select-menu-tab", function() {
            var e = this.closest(".js-select-menu"),
                t = e.querySelector(".js-select-menu-tab.selected");
            t && (t.classList.remove("selected"), t.setAttribute("aria-selected", !1)), this.classList.add("selected"), this.setAttribute("aria-selected", !0);
            var n = e.querySelector(".js-filterable-field");
            if (n) {
                var i = this.getAttribute("data-filter-placeholder");
                i && n.setAttribute("placeholder", i), n.focus()
            }
            return !1
        }), n.observe(".js-select-menu .js-select-menu-tab.selected", {
            add: function() {
                r(this, !0)
            },
            remove: function() {
                r(this, !1)
            }
        })
    }), define("github/select-menu", ["./select-menu/ajax", "./select-menu/base", "./select-menu/button", "./select-menu/css", "./select-menu/filterable", "./select-menu/loading", "./select-menu/navigation", "./select-menu/new", "./select-menu/tabs"], function() {}), define("github/site/fillin-blank", ["../typecast", "../observe"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            var e = a["default"](document.querySelector(".js-fillin-blank"), HTMLElement),
                t = this,
                n = document.createTextNode(t.textContent),
                i = a["default"](document.createElement("span"), HTMLSpanElement);
            i.setAttribute("class", "anim-fade-in"), i.appendChild(n), e.innerHTML = "", e.appendChild(i)
        }

        function r() {
            var e = a["default"](document.querySelector(".js-fillin-blank"), HTMLElement),
                t = document.createTextNode("\xa0");
            e.innerHTML = "", e.appendChild(t)
        }
        var a = n(e);
        t.observe(".js-fillin-word", {
            add: function(e) {
                e.addEventListener("mouseover", i)
            },
            remove: function(e) {
                e.removeEventListener("mouseover", i)
            }
        }), t.observe(".js-fillin-word", {
            add: function(e) {
                e.addEventListener("mouseout", r)
            },
            remove: function(e) {
                e.removeEventListener("mouseout", r)
            }
        })
    }), define("github/onfocus", ["exports", "selector-set"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i(e) {
            e.target.nodeType !== Node.DOCUMENT_NODE && s.matches(e.target).forEach(function(t) {
                t.data.call(null, e.target)
            })
        }

        function r(e, t) {
            s || (s = new a["default"], document.addEventListener("focus", i, !0)), s.add(e, t), document.activeElement && document.activeElement.matches(e) && t(document.activeElement)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e["default"] = r;
        var a = n(t),
            s = void 0
    }), define("github/skip-autofill", ["./onfocus"], function(e) {
        function t(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var n = t(e);
        n["default"](".js-skip-password-autofill", function(e) {
            return e.type = "password"
        })
    }), define("github/smooth-scroll-anchor", ["./scrollto", "./typecast", "./fragment-target", "delegated-events"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var a = r(e),
            s = r(t);
        i.on("click", ".js-smoothscroll-anchor", function(e) {
            e.preventDefault();
            var t = this,
                i = t.getAttribute("href"),
                r = s["default"](n.findFragmentTarget(document, t.hash), HTMLElement),
                o = {
                    target: r,
                    duration: 250
                };
            a["default"](i, o)
        })
    }), define("github/sticky", ["./invariant", "./observe"], function(e, t) {
        function n() {
            m.length ? i() : r()
        }

        function i() {
            h || (window.addEventListener("resize", a, {
                passive: !0
            }), document.addEventListener("scroll", a, {
                passive: !0
            }), h = !0)
        }

        function r() {
            window.removeEventListener("resize", a, {
                passive: !0
            }), document.removeEventListener("scroll", a, {
                passive: !0
            }), h = !1
        }

        function a() {
            m.forEach(function(e) {
                if (e.element.offsetHeight > 0) {
                    var t = e.element,
                        n = e.placeholder,
                        i = e.top,
                        r = t.getBoundingClientRect();
                    if (n) {
                        var a = n.getBoundingClientRect();
                        t.classList.contains("is-stuck") ? a.top > parseInt(i) ? u(e) : l(e) : r.top <= parseInt(i) && o(e)
                    } else r.top <= parseInt(i) ? o(e) : u(e)
                }
            })
        }

        function s(e) {
            var t = window.getComputedStyle(e),
                n = t.position;
            return /sticky/.test(n)
        }

        function o(e) {
            var t = e.element,
                n = e.placeholder,
                i = e.top;
            if (n) {
                var r = t.getBoundingClientRect();
                t.style.top = i.toString(), t.style.left = r.left + "px", t.style.width = r.width + "px", t.style.marginTop = "0", t.style.position = "fixed", n.style.display = "block"
            }
            t.classList.add("is-stuck")
        }

        function u(e) {
            var t = e.element,
                n = e.placeholder;
            n && (t.style.position = "static", t.style.marginTop = n.style.marginTop, n.style.display = "none"), t.classList.remove("is-stuck")
        }

        function l(e) {
            var t = e.element,
                n = e.placeholder,
                i = e.offsetParent,
                r = e.top;
            if (n) {
                var a = t.getBoundingClientRect(),
                    s = n.getBoundingClientRect();
                if (t.style.left = s.left + "px", t.style.width = s.width + "px", i) {
                    var o = i.getBoundingClientRect();
                    o.bottom < a.height + parseInt(r) && (t.style.top = o.bottom - a.height + "px")
                }
            }
        }

        function c(t) {
            if (s(t)) return null;
            var n = t.previousElementSibling;
            if (n && n.classList.contains("is-placeholder")) return e.invariant(n instanceof HTMLElement, "previousElement must be an HTMLElement"), n;
            var i = document.createElement("div");
            return i.style.visibility = "hidden", i.style.display = "none", i.style.height = window.getComputedStyle(t).height, i.className = t.className, i.classList.remove("js-sticky"), i.classList.add("is-placeholder"), e.invariant(t.parentNode, "Element must be inserted into the dom"), t.parentNode.insertBefore(i, t)
        }

        function d(e) {
            var t = c(e),
                n = window.getComputedStyle(e).position;
            e.style.position = "static";
            var i = e.offsetParent;
            e.style.position = "fixed";
            var r = window.getComputedStyle(e).top,
                a = {
                    element: e,
                    placeholder: t,
                    offsetParent: i,
                    top: "auto" == r ? 0 : r
                };
            e.style.position = n, m.push(a)
        }

        function f(e) {
            var t = m.map(function(e) {
                return e.element
            }).indexOf(e);
            m.splice(t, 1)
        }
        var h = !1,
            m = [];
        t.observe(".js-sticky", {
            add: function(e) {
                d(e), a(), n()
            },
            remove: function(e) {
                f(e), n()
            }
        }, HTMLElement)
    }), define("github/sudo-required", ["./jquery", "delegated-events", "./observe", "./sudo"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            u || (e.preventDefault(), e.stopImmediatePropagation(), o["default"]().then(function() {
                u = !0, s["default"](e.target)[e.type](), u = !1
            })["catch"](function(n) {
                t.fire(e.target, "sudo:failed", {
                    error: n
                })
            }))
        }
        var s = r(e),
            o = r(i),
            u = !1;
        n.observe("a.js-sudo-required", {
            add: function() {
                s["default"](this).on("click", a)
            },
            remove: function() {
                s["default"](this).off("click", a)
            }
        }), n.observe("form.js-sudo-required", {
            add: function() {
                s["default"](this).on("submit", a)
            },
            remove: function() {
                s["default"](this).off("submit", a)
            }
        })
    }), define("github/task-list", ["jquery", "./observe", "delegated-events", "./form"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            e.target.classList.add("hovered")
        }

        function s(e) {
            e.target.classList.remove("hovered")
        }

        function o(e, t) {
            if (e.parentNode === t.parentNode)
                for (; e;) {
                    if (e === t) return !0;
                    e = e.previousElementSibling
                }
            return !1
        }

        function u(e, t) {
            return e.closest(".js-comment-body") === t.closest(".js-comment-body")
        }

        function l(e) {
            var t = e.parentNode,
                n = Array.from(t.children).filter(function(e) {
                    return "OL" === e.nodeName || "UL" === e.nodeName
                });
            return n.indexOf(e)
        }

        function c(e) {
            e.dataTransfer.setData("text/plain", e.target.textContent.trim()), E = e.target, x = !1, S = e.target, C = S.closest(".contains-task-list"), S.classList.add("is-ghost"), _ = Array.from(S.parentNode.children), L = _.indexOf(S), k = _[L + 1] || null
        }

        function d(e) {
            if (S) {
                var t = e.currentTarget;
                if (!u(S, t)) return void e.stopPropagation();
                e.preventDefault(), e.dataTransfer.dropEffect = "move", E !== t && S && (S.classList.add("is-dragging"), E = t, o(S, t) ? t.before(S) : t.after(S))
            }
        }

        function f(e) {
            if (S) {
                x = !0;
                var t = Array.from(S.parentNode.children).indexOf(S),
                    n = e.currentTarget.closest(".contains-task-list");
                if (L !== t || C !== n) {
                    C === n && t > L && t++;
                    var i = e.target.closest(".js-task-list-container");
                    j(i, "reordered", {
                        operation: "move",
                        src: [l(C), L],
                        dst: [l(n), t]
                    })
                }
            }
        }

        function h() {
            S.classList.remove("is-dragging"), S.classList.remove("is-ghost"), x || C.insertBefore(S, k), S = null, k = null, x = !1, E = null
        }

        function m(e) {
            if (S) {
                var t = e.currentTarget;
                if (!u(S, t)) return void e.stopPropagation();
                e.preventDefault(), e.dataTransfer.dropEffect = "move"
            }
        }

        function v() {
            var e = document.createElement("span"),
                t = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                n = document.createElementNS("http://www.w3.org/2000/svg", "path");
            return e.classList.add("handle"), t.classList.add("drag-handle"), t.setAttribute("aria-hidden", "true"), t.setAttribute("width", "16"), t.setAttribute("height", "15"), t.setAttribute("version", "1.1"), t.setAttribute("viewBox", "0 0 16 15"), n.setAttribute("d", "M12,4V5H4V4h8ZM4,8h8V7H4V8Zm0,3h8V10H4v1Z"), t.appendChild(n), e.appendChild(t), e
        }

        function p() {
            this.closest(".task-list-item").setAttribute("draggable", !0)
        }

        function g() {
            S || this.closest(".task-list-item").setAttribute("draggable", !1)
        }

        function b(e) {
            e.querySelectorAll(".js-task-list-field").length > 0 && (e.classList.add("is-task-list-enabled"), Array.from(e.querySelectorAll(".task-list-item")).forEach(function(e) {
                return e.classList.add("enabled")
            }), Array.from(e.querySelectorAll(".task-list-item-checkbox")).forEach(function(e) {
                return e.disabled = !1
            }))
        }

        function y(e) {
            e.classList.remove("is-task-list-enabled"), Array.from(e.querySelectorAll(".task-list-item")).forEach(function(e) {
                return e.classList.remove("enabled")
            }), Array.from(e.querySelectorAll(".task-list-item-checkbox")).forEach(function(e) {
                return e.disabled = !0
            })
        }

        function j(e, t, n) {
            var r = e.querySelector(".js-comment-update");
            y(e);
            var a = document.createElement("input");
            a.setAttribute("type", "hidden"), a.setAttribute("name", "task_list_track"), a.setAttribute("value", t), r.appendChild(a);
            var s = document.createElement("input");
            if (s.setAttribute("type", "hidden"), s.setAttribute("name", "task_list_operation"), s.setAttribute("value", JSON.stringify(n)), r.appendChild(s), !r.elements.task_list_key) {
                var o = document.createElement("input");
                o.setAttribute("type", "hidden"), o.setAttribute("name", "task_list_key"), o.setAttribute("value", r.querySelector(".js-task-list-field").getAttribute("name").split("[")[0]), r.appendChild(o)
            }
            e.classList.remove("is-comment-stale"), i.submit(r)
        }
        var w = r(e),
            x = !1,
            S = null,
            k = null,
            L = null,
            _ = null,
            E = null,
            C = null;
        t.observe(".contains-task-list", function() {
            var e = this.closest(".js-task-list-container");
            e && b(e)
        }), n.on("change", ".js-comment-body > .contains-task-list, .js-gist-file-update-container .markdown-body > .contains-task-list", function(e) {
            var t = this.closest(".js-task-list-container"),
                n = Array.from(this.querySelectorAll("li")),
                i = e.target,
                r = n.indexOf(i.closest(".task-list-item"));
            j(t, "checked:" + (i.checked ? 1 : 0), {
                operation: "check",
                position: [l(this), r],
                checked: i.checked
            })
        }), t.observe(".js-reorderable-task-lists .js-comment-body > .contains-task-list > .task-list-item", function() {
            if (!(this.closest(".js-comment-body").querySelectorAll(".task-list-item").length <= 1) && this.closest(".is-task-list-enabled")) {
                var e = v();
                this.insertBefore(e, this.firstChild), e.addEventListener("mouseenter", p), e.addEventListener("mouseleave", g), this.addEventListener("dragstart", c), this.addEventListener("dragenter", d), this.addEventListener("dragend", h), this.addEventListener("drop", f), this.addEventListener("dragover", m), this.addEventListener("mouseenter", a), this.addEventListener("mouseleave", s)
            }
        }), w["default"](document).on("ajaxComplete", ".js-comment-update", function(e, t) {
            var n = this.closest(".js-task-list-container");
            if (n) {
                var i = this.elements.task_list_track;
                i && i.remove();
                var r = this.elements.task_list_operation;
                if (r && r.remove(), 200 !== t.status || /^\s*</.test(t.responseText)) {
                    if (422 === t.status && t.stale) {
                        var a = JSON.parse(t.responseText);
                        if (a) {
                            var s = a.updated_markdown,
                                o = a.updated_html,
                                u = a.version;
                            if (s && o && u) {
                                var l = n.querySelector(".js-comment-body"),
                                    c = n.querySelector(".js-task-list-field");
                                l.innerHTML = o, c.value = s, n.dataset.bodyVersion = u
                            }
                        } else window.location.reload()
                    }
                } else {
                    if (r) {
                        var d = JSON.parse(t.responseText);
                        d.source && (n.querySelector(".js-task-list-field").value = d.source)
                    }
                    b(n)
                }
            }
        })
    }), define("github/toggler", ["./jquery", "delegated-events"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e);
        t.on("click", ".js-toggler-container .js-toggler-target", function(e) {
            if (1 === e.which) {
                var t = this.closest(".js-toggler-container");
                t.classList.toggle("on")
            }
        }), i["default"](document).on("ajaxSend", ".js-toggler-container", function() {
            this.classList.remove("success", "error"), this.classList.add("loading")
        }), i["default"](document).on("ajaxComplete", ".js-toggler-container", function() {
            this.classList.remove("loading")
        }), i["default"](document).on("ajaxSuccess", ".js-toggler-container", function() {
            this.classList.add("success")
        }), i["default"](document).on("ajaxError", ".js-toggler-container", function() {
            this.classList.add("error")
        })
    }), define("github/touch-events-observer", ["./observe"], function(e) {
        function t() {}
        e.observe(".js-touch-events", {
            add: function(e) {
                e.addEventListener("click", t)
            },
            remove: function(e) {
                e.removeEventListener("click", t)
            }
        })
    }), define.register("jstimezonedetect"),
    function(e) {
        var t = function() {
            "use strict";
            var e = "s",
                n = {
                    DAY: 864e5,
                    HOUR: 36e5,
                    MINUTE: 6e4,
                    SECOND: 1e3,
                    BASELINE_YEAR: 2014,
                    MAX_SCORE: 864e6,
                    AMBIGUITIES: {
                        "America/Denver": ["America/Mazatlan"],
                        "Europe/London": ["Africa/Casablanca"],
                        "America/Chicago": ["America/Mexico_City"],
                        "America/Asuncion": ["America/Campo_Grande", "America/Santiago"],
                        "America/Montevideo": ["America/Sao_Paulo", "America/Santiago"],
                        "Asia/Beirut": ["Asia/Amman", "Asia/Jerusalem", "Europe/Helsinki", "Asia/Damascus", "Africa/Cairo", "Asia/Gaza", "Europe/Minsk"],
                        "Pacific/Auckland": ["Pacific/Fiji"],
                        "America/Los_Angeles": ["America/Santa_Isabel"],
                        "America/New_York": ["America/Havana"],
                        "America/Halifax": ["America/Goose_Bay"],
                        "America/Godthab": ["America/Miquelon"],
                        "Asia/Dubai": ["Asia/Yerevan"],
                        "Asia/Jakarta": ["Asia/Krasnoyarsk"],
                        "Asia/Shanghai": ["Asia/Irkutsk", "Australia/Perth"],
                        "Australia/Sydney": ["Australia/Lord_Howe"],
                        "Asia/Tokyo": ["Asia/Yakutsk"],
                        "Asia/Dhaka": ["Asia/Omsk"],
                        "Asia/Baku": ["Asia/Yerevan"],
                        "Australia/Brisbane": ["Asia/Vladivostok"],
                        "Pacific/Noumea": ["Asia/Vladivostok"],
                        "Pacific/Majuro": ["Asia/Kamchatka", "Pacific/Fiji"],
                        "Pacific/Tongatapu": ["Pacific/Apia"],
                        "Asia/Baghdad": ["Europe/Minsk", "Europe/Moscow"],
                        "Asia/Karachi": ["Asia/Yekaterinburg"],
                        "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"]
                    }
                },
                i = function(e) {
                    var t = -e.getTimezoneOffset();
                    return null !== t ? t : 0
                },
                r = function() {
                    var t = i(new Date(n.BASELINE_YEAR, 0, 2)),
                        r = i(new Date(n.BASELINE_YEAR, 5, 2)),
                        a = t - r;
                    return 0 > a ? t + ",1" : a > 0 ? r + ",1," + e : t + ",0"
                },
                a = function() {
                    var e, t;
                    if ("undefined" != typeof Intl && "undefined" != typeof Intl.DateTimeFormat && (e = Intl.DateTimeFormat(), "undefined" != typeof e && "undefined" != typeof e.resolvedOptions)) return t = e.resolvedOptions().timeZone, t && (t.indexOf("/") > -1 || "UTC" === t) ? t : void 0
                },
                s = function(e) {
                    for (var t = new Date(e, 0, 1, 0, 0, 1, 0).getTime(), n = new Date(e, 12, 31, 23, 59, 59).getTime(), i = t, r = new Date(i).getTimezoneOffset(), a = null, s = null; n - 864e5 > i;) {
                        var u = new Date(i),
                            l = u.getTimezoneOffset();
                        l !== r && (r > l && (a = u), l > r && (s = u), r = l), i += 864e5
                    }
                    return a && s ? {
                        s: o(a).getTime(),
                        e: o(s).getTime()
                    } : !1
                },
                o = function f(e, t, i) {
                    "undefined" == typeof t && (t = n.DAY, i = n.HOUR);
                    for (var r = new Date(e.getTime() - t).getTime(), a = e.getTime() + t, s = new Date(r).getTimezoneOffset(), o = r, u = null; a - i > o;) {
                        var l = new Date(o),
                            c = l.getTimezoneOffset();
                        if (c !== s) {
                            u = l;
                            break
                        }
                        o += i
                    }
                    return t === n.DAY ? f(u, n.HOUR, n.MINUTE) : t === n.HOUR ? f(u, n.MINUTE, n.SECOND) : u
                },
                u = function(e, t, n, i) {
                    if ("N/A" !== n) return n;
                    if ("Asia/Beirut" === t) {
                        if ("Africa/Cairo" === i.name && 13983768e5 === e[6].s && 14116788e5 === e[6].e) return 0;
                        if ("Asia/Jerusalem" === i.name && 13959648e5 === e[6].s && 14118588e5 === e[6].e) return 0
                    } else if ("America/Santiago" === t) {
                        if ("America/Asuncion" === i.name && 14124816e5 === e[6].s && 1397358e6 === e[6].e) return 0;
                        if ("America/Campo_Grande" === i.name && 14136912e5 === e[6].s && 13925196e5 === e[6].e) return 0
                    } else if ("America/Montevideo" === t) {
                        if ("America/Sao_Paulo" === i.name && 14136876e5 === e[6].s && 1392516e6 === e[6].e) return 0
                    } else if ("Pacific/Auckland" === t && "Pacific/Fiji" === i.name && 14142456e5 === e[6].s && 13961016e5 === e[6].e) return 0;
                    return n
                },
                l = function(e, i) {
                    for (var r = function(t) {
                            for (var r = 0, a = 0; a < e.length; a++)
                                if (t.rules[a] && e[a]) {
                                    if (!(e[a].s >= t.rules[a].s && e[a].e <= t.rules[a].e)) {
                                        r = "N/A";
                                        break
                                    }
                                    if (r = 0, r += Math.abs(e[a].s - t.rules[a].s), r += Math.abs(t.rules[a].e - e[a].e), r > n.MAX_SCORE) {
                                        r = "N/A";
                                        break
                                    }
                                }
                            return r = u(e, i, r, t)
                        }, a = {}, s = t.olson.dst_rules.zones, o = s.length, l = n.AMBIGUITIES[i], c = 0; o > c; c++) {
                        var d = s[c],
                            f = r(s[c]);
                        "N/A" !== f && (a[d.name] = f)
                    }
                    for (var h in a)
                        if (a.hasOwnProperty(h))
                            for (var m = 0; m < l.length; m++)
                                if (l[m] === h) return h;
                    return i
                },
                c = function(e) {
                    var n = function() {
                            for (var e = [], n = 0; n < t.olson.dst_rules.years.length; n++) {
                                var i = s(t.olson.dst_rules.years[n]);
                                e.push(i)
                            }
                            return e
                        },
                        i = function(e) {
                            for (var t = 0; t < e.length; t++)
                                if (e[t] !== !1) return !0;
                            return !1
                        },
                        r = n(),
                        a = i(r);
                    return a ? l(r, e) : e
                },
                d = function() {
                    var e = a();
                    return e || (e = t.olson.timezones[r()], "undefined" != typeof n.AMBIGUITIES[e] && (e = c(e))), {
                        name: function() {
                            return e
                        }
                    }
                };
            return {
                determine: d
            }
        }();
        t.olson = t.olson || {}, t.olson.timezones = {
            "-720,0": "Etc/GMT+12",
            "-660,0": "Pacific/Pago_Pago",
            "-660,1,s": "Pacific/Apia",
            "-600,1": "America/Adak",
            "-600,0": "Pacific/Honolulu",
            "-570,0": "Pacific/Marquesas",
            "-540,0": "Pacific/Gambier",
            "-540,1": "America/Anchorage",
            "-480,1": "America/Los_Angeles",
            "-480,0": "Pacific/Pitcairn",
            "-420,0": "America/Phoenix",
            "-420,1": "America/Denver",
            "-360,0": "America/Guatemala",
            "-360,1": "America/Chicago",
            "-360,1,s": "Pacific/Easter",
            "-300,0": "America/Bogota",
            "-300,1": "America/New_York",
            "-270,0": "America/Caracas",
            "-240,1": "America/Halifax",
            "-240,0": "America/Santo_Domingo",
            "-240,1,s": "America/Asuncion",
            "-210,1": "America/St_Johns",
            "-180,1": "America/Godthab",
            "-180,0": "America/Argentina/Buenos_Aires",
            "-180,1,s": "America/Montevideo",
            "-120,0": "America/Noronha",
            "-120,1": "America/Noronha",
            "-60,1": "Atlantic/Azores",
            "-60,0": "Atlantic/Cape_Verde",
            "0,0": "UTC",
            "0,1": "Europe/London",
            "60,1": "Europe/Berlin",
            "60,0": "Africa/Lagos",
            "60,1,s": "Africa/Windhoek",
            "120,1": "Asia/Beirut",
            "120,0": "Africa/Johannesburg",
            "180,0": "Asia/Baghdad",
            "180,1": "Europe/Moscow",
            "210,1": "Asia/Tehran",
            "240,0": "Asia/Dubai",
            "240,1": "Asia/Baku",
            "270,0": "Asia/Kabul",
            "300,1": "Asia/Yekaterinburg",
            "300,0": "Asia/Karachi",
            "330,0": "Asia/Kolkata",
            "345,0": "Asia/Kathmandu",
            "360,0": "Asia/Dhaka",
            "360,1": "Asia/Omsk",
            "390,0": "Asia/Rangoon",
            "420,1": "Asia/Krasnoyarsk",
            "420,0": "Asia/Jakarta",
            "480,0": "Asia/Shanghai",
            "480,1": "Asia/Irkutsk",
            "525,0": "Australia/Eucla",
            "525,1,s": "Australia/Eucla",
            "540,1": "Asia/Yakutsk",
            "540,0": "Asia/Tokyo",
            "570,0": "Australia/Darwin",
            "570,1,s": "Australia/Adelaide",
            "600,0": "Australia/Brisbane",
            "600,1": "Asia/Vladivostok",
            "600,1,s": "Australia/Sydney",
            "630,1,s": "Australia/Lord_Howe",
            "660,1": "Asia/Kamchatka",
            "660,0": "Pacific/Noumea",
            "690,0": "Pacific/Norfolk",
            "720,1,s": "Pacific/Auckland",
            "720,0": "Pacific/Majuro",
            "765,1,s": "Pacific/Chatham",
            "780,0": "Pacific/Tongatapu",
            "780,1,s": "Pacific/Apia",
            "840,0": "Pacific/Kiritimati"
        }, t.olson.dst_rules = {
            years: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
            zones: [{
                name: "Africa/Cairo",
                rules: [{
                    e: 12199572e5,
                    s: 12090744e5
                }, {
                    e: 1250802e6,
                    s: 1240524e6
                }, {
                    e: 12858804e5,
                    s: 12840696e5
                }, !1, !1, !1, {
                    e: 14116788e5,
                    s: 1406844e6
                }]
            }, {
                name: "Africa/Casablanca",
                rules: [{
                    e: 12202236e5,
                    s: 12122784e5
                }, {
                    e: 12508092e5,
                    s: 12438144e5
                }, {
                    e: 1281222e6,
                    s: 12727584e5
                }, {
                    e: 13120668e5,
                    s: 13017888e5
                }, {
                    e: 13489704e5,
                    s: 1345428e6
                }, {
                    e: 13828392e5,
                    s: 13761e8
                }, {
                    e: 14142888e5,
                    s: 14069448e5
                }]
            }, {
                name: "America/Asuncion",
                rules: [{
                    e: 12050316e5,
                    s: 12243888e5
                }, {
                    e: 12364812e5,
                    s: 12558384e5
                }, {
                    e: 12709548e5,
                    s: 12860784e5
                }, {
                    e: 13024044e5,
                    s: 1317528e6
                }, {
                    e: 1333854e6,
                    s: 13495824e5
                }, {
                    e: 1364094e6,
                    s: 1381032e6
                }, {
                    e: 13955436e5,
                    s: 14124816e5
                }]
            }, {
                name: "America/Campo_Grande",
                rules: [{
                    e: 12032172e5,
                    s: 12243888e5
                }, {
                    e: 12346668e5,
                    s: 12558384e5
                }, {
                    e: 12667212e5,
                    s: 1287288e6
                }, {
                    e: 12981708e5,
                    s: 13187376e5
                }, {
                    e: 13302252e5,
                    s: 1350792e6
                }, {
                    e: 136107e7,
                    s: 13822416e5
                }, {
                    e: 13925196e5,
                    s: 14136912e5
                }]
            }, {
                name: "America/Goose_Bay",
                rules: [{
                    e: 122559486e4,
                    s: 120503526e4
                }, {
                    e: 125704446e4,
                    s: 123648486e4
                }, {
                    e: 128909886e4,
                    s: 126853926e4
                }, {
                    e: 13205556e5,
                    s: 129998886e4
                }, {
                    e: 13520052e5,
                    s: 13314456e5
                }, {
                    e: 13834548e5,
                    s: 13628952e5
                }, {
                    e: 14149044e5,
                    s: 13943448e5
                }]
            }, {
                name: "America/Havana",
                rules: [{
                    e: 12249972e5,
                    s: 12056436e5
                }, {
                    e: 12564468e5,
                    s: 12364884e5
                }, {
                    e: 12885012e5,
                    s: 12685428e5
                }, {
                    e: 13211604e5,
                    s: 13005972e5
                }, {
                    e: 13520052e5,
                    s: 13332564e5
                }, {
                    e: 13834548e5,
                    s: 13628916e5
                }, {
                    e: 14149044e5,
                    s: 13943412e5
                }]
            }, {
                name: "America/Mazatlan",
                rules: [{
                    e: 1225008e6,
                    s: 12074724e5
                }, {
                    e: 12564576e5,
                    s: 1238922e6
                }, {
                    e: 1288512e6,
                    s: 12703716e5
                }, {
                    e: 13199616e5,
                    s: 13018212e5
                }, {
                    e: 13514112e5,
                    s: 13332708e5
                }, {
                    e: 13828608e5,
                    s: 13653252e5
                }, {
                    e: 14143104e5,
                    s: 13967748e5
                }]
            }, {
                name: "America/Mexico_City",
                rules: [{
                    e: 12250044e5,
                    s: 12074688e5
                }, {
                    e: 1256454e6,
                    s: 12389184e5
                }, {
                    e: 12885084e5,
                    s: 1270368e6
                }, {
                    e: 1319958e6,
                    s: 13018176e5
                }, {
                    e: 13514076e5,
                    s: 13332672e5
                }, {
                    e: 13828572e5,
                    s: 13653216e5
                }, {
                    e: 14143068e5,
                    s: 13967712e5
                }]
            }, {
                name: "America/Miquelon",
                rules: [{
                    e: 12255984e5,
                    s: 12050388e5
                }, {
                    e: 1257048e6,
                    s: 12364884e5
                }, {
                    e: 12891024e5,
                    s: 12685428e5
                }, {
                    e: 1320552e6,
                    s: 12999924e5
                }, {
                    e: 13520016e5,
                    s: 1331442e6
                }, {
                    e: 13834512e5,
                    s: 13628916e5
                }, {
                    e: 14149008e5,
                    s: 13943412e5
                }]
            }, {
                name: "America/Santa_Isabel",
                rules: [{
                    e: 12250116e5,
                    s: 1207476e6
                }, {
                    e: 12564612e5,
                    s: 12389256e5
                }, {
                    e: 12885156e5,
                    s: 12703752e5
                }, {
                    e: 13199652e5,
                    s: 13018248e5
                }, {
                    e: 13514148e5,
                    s: 13332744e5
                }, {
                    e: 13828644e5,
                    s: 13653288e5
                }, {
                    e: 1414314e6,
                    s: 13967784e5
                }]
            }, {
                name: "America/Santiago",
                rules: [{
                    e: 1206846e6,
                    s: 1223784e6
                }, {
                    e: 1237086e6,
                    s: 12552336e5
                }, {
                    e: 127035e7,
                    s: 12866832e5
                }, {
                    e: 13048236e5,
                    s: 13138992e5
                }, {
                    e: 13356684e5,
                    s: 13465584e5
                }, {
                    e: 1367118e6,
                    s: 13786128e5
                }, {
                    e: 13985676e5,
                    s: 14100624e5
                }]
            }, {
                name: "America/Sao_Paulo",
                rules: [{
                    e: 12032136e5,
                    s: 12243852e5
                }, {
                    e: 12346632e5,
                    s: 12558348e5
                }, {
                    e: 12667176e5,
                    s: 12872844e5
                }, {
                    e: 12981672e5,
                    s: 1318734e6
                }, {
                    e: 13302216e5,
                    s: 13507884e5
                }, {
                    e: 13610664e5,
                    s: 1382238e6
                }, {
                    e: 1392516e6,
                    s: 14136876e5
                }]
            }, {
                name: "Asia/Amman",
                rules: [{
                    e: 1225404e6,
                    s: 12066552e5
                }, {
                    e: 12568536e5,
                    s: 12381048e5
                }, {
                    e: 12883032e5,
                    s: 12695544e5
                }, {
                    e: 13197528e5,
                    s: 13016088e5
                }, !1, !1, {
                    e: 14147064e5,
                    s: 13959576e5
                }]
            }, {
                name: "Asia/Damascus",
                rules: [{
                    e: 12254868e5,
                    s: 120726e7
                }, {
                    e: 125685e7,
                    s: 12381048e5
                }, {
                    e: 12882996e5,
                    s: 12701592e5
                }, {
                    e: 13197492e5,
                    s: 13016088e5
                }, {
                    e: 13511988e5,
                    s: 13330584e5
                }, {
                    e: 13826484e5,
                    s: 1364508e6
                }, {
                    e: 14147028e5,
                    s: 13959576e5
                }]
            }, {
                name: "Asia/Dubai",
                rules: [!1, !1, !1, !1, !1, !1, !1]
            }, {
                name: "Asia/Gaza",
                rules: [{
                    e: 12199572e5,
                    s: 12066552e5
                }, {
                    e: 12520152e5,
                    s: 12381048e5
                }, {
                    e: 1281474e6,
                    s: 126964086e4
                }, {
                    e: 1312146e6,
                    s: 130160886e4
                }, {
                    e: 13481784e5,
                    s: 13330584e5
                }, {
                    e: 13802292e5,
                    s: 1364508e6
                }, {
                    e: 1414098e6,
                    s: 13959576e5
                }]
            }, {
                name: "Asia/Irkutsk",
                rules: [{
                    e: 12249576e5,
                    s: 12068136e5
                }, {
                    e: 12564072e5,
                    s: 12382632e5
                }, {
                    e: 12884616e5,
                    s: 12697128e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Jerusalem",
                rules: [{
                    e: 12231612e5,
                    s: 12066624e5
                }, {
                    e: 1254006e6,
                    s: 1238112e6
                }, {
                    e: 1284246e6,
                    s: 12695616e5
                }, {
                    e: 131751e7,
                    s: 1301616e6
                }, {
                    e: 13483548e5,
                    s: 13330656e5
                }, {
                    e: 13828284e5,
                    s: 13645152e5
                }, {
                    e: 1414278e6,
                    s: 13959648e5
                }]
            }, {
                name: "Asia/Kamchatka",
                rules: [{
                    e: 12249432e5,
                    s: 12067992e5
                }, {
                    e: 12563928e5,
                    s: 12382488e5
                }, {
                    e: 12884508e5,
                    s: 12696984e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Krasnoyarsk",
                rules: [{
                    e: 12249612e5,
                    s: 12068172e5
                }, {
                    e: 12564108e5,
                    s: 12382668e5
                }, {
                    e: 12884652e5,
                    s: 12697164e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Omsk",
                rules: [{
                    e: 12249648e5,
                    s: 12068208e5
                }, {
                    e: 12564144e5,
                    s: 12382704e5
                }, {
                    e: 12884688e5,
                    s: 126972e7
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Vladivostok",
                rules: [{
                    e: 12249504e5,
                    s: 12068064e5
                }, {
                    e: 12564e8,
                    s: 1238256e6
                }, {
                    e: 12884544e5,
                    s: 12697056e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Yakutsk",
                rules: [{
                    e: 1224954e6,
                    s: 120681e7
                }, {
                    e: 12564036e5,
                    s: 12382596e5
                }, {
                    e: 1288458e6,
                    s: 12697092e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Yekaterinburg",
                rules: [{
                    e: 12249684e5,
                    s: 12068244e5
                }, {
                    e: 1256418e6,
                    s: 1238274e6
                }, {
                    e: 12884724e5,
                    s: 12697236e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Yerevan",
                rules: [{
                    e: 1224972e6,
                    s: 1206828e6
                }, {
                    e: 12564216e5,
                    s: 12382776e5
                }, {
                    e: 1288476e6,
                    s: 12697272e5
                }, {
                    e: 13199256e5,
                    s: 13011768e5
                }, !1, !1, !1]
            }, {
                name: "Australia/Lord_Howe",
                rules: [{
                    e: 12074076e5,
                    s: 12231342e5
                }, {
                    e: 12388572e5,
                    s: 12545838e5
                }, {
                    e: 12703068e5,
                    s: 12860334e5
                }, {
                    e: 13017564e5,
                    s: 1317483e6
                }, {
                    e: 1333206e6,
                    s: 13495374e5
                }, {
                    e: 13652604e5,
                    s: 1380987e6
                }, {
                    e: 139671e7,
                    s: 14124366e5
                }]
            }, {
                name: "Australia/Perth",
                rules: [{
                    e: 12068136e5,
                    s: 12249576e5
                }, !1, !1, !1, !1, !1, !1]
            }, {
                name: "Europe/Helsinki",
                rules: [{
                    e: 12249828e5,
                    s: 12068388e5
                }, {
                    e: 12564324e5,
                    s: 12382884e5
                }, {
                    e: 12884868e5,
                    s: 1269738e6
                }, {
                    e: 13199364e5,
                    s: 13011876e5
                }, {
                    e: 1351386e6,
                    s: 13326372e5
                }, {
                    e: 13828356e5,
                    s: 13646916e5
                }, {
                    e: 14142852e5,
                    s: 13961412e5
                }]
            }, {
                name: "Europe/Minsk",
                rules: [{
                    e: 12249792e5,
                    s: 12068352e5
                }, {
                    e: 12564288e5,
                    s: 12382848e5
                }, {
                    e: 12884832e5,
                    s: 12697344e5
                }, !1, !1, !1, !1]
            }, {
                name: "Europe/Moscow",
                rules: [{
                    e: 12249756e5,
                    s: 12068316e5
                }, {
                    e: 12564252e5,
                    s: 12382812e5
                }, {
                    e: 12884796e5,
                    s: 12697308e5
                }, !1, !1, !1, !1]
            }, {
                name: "Pacific/Apia",
                rules: [!1, !1, !1, {
                    e: 13017528e5,
                    s: 13168728e5
                }, {
                    e: 13332024e5,
                    s: 13489272e5
                }, {
                    e: 13652568e5,
                    s: 13803768e5
                }, {
                    e: 13967064e5,
                    s: 14118264e5
                }]
            }, {
                name: "Pacific/Fiji",
                rules: [!1, !1, {
                    e: 12696984e5,
                    s: 12878424e5
                }, {
                    e: 13271544e5,
                    s: 1319292e6
                }, {
                    e: 1358604e6,
                    s: 13507416e5
                }, {
                    e: 139005e7,
                    s: 1382796e6
                }, {
                    e: 14215032e5,
                    s: 14148504e5
                }]
            }, {
                name: "Europe/London",
                rules: [{
                    e: 12249828e5,
                    s: 12068388e5
                }, {
                    e: 12564324e5,
                    s: 12382884e5
                }, {
                    e: 12884868e5,
                    s: 1269738e6
                }, {
                    e: 13199364e5,
                    s: 13011876e5
                }, {
                    e: 1351386e6,
                    s: 13326372e5
                }, {
                    e: 13828356e5,
                    s: 13646916e5
                }, {
                    e: 14142852e5,
                    s: 13961412e5
                }]
            }]
        }, "undefined" != typeof module && "undefined" != typeof module.exports ? module.exports = t : "undefined" != typeof define && null !== define && null != define.amd ? define([], function() {
            return t
        }) : "undefined" == typeof e ? window.jstz = t : e.jstz = t
    }(), define.registerEnd(), define("github/tz-cookie", ["jstimezonedetect", "./timezone"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function i() {
            try {
                return r["default"].determine().name()
            } catch (e) {
                if (!(e instanceof RangeError)) throw e
            }
        }
        var r = n(e),
            a = n(t);
        requestIdleCallback(function() {
            var e = a["default"]() || i();
            if (e) {
                var t = "https:" === location.protocol ? "secure" : "";
                document.cookie = "tz=" + encodeURIComponent(e) + "; path=/; " + t
            }
        })
    }), define.register("u2f-api-polyfill"),
    function() {
        var e = "chrome" in window && window.navigator.userAgent.indexOf("Edge") < 0;
        if (!("u2f" in window) && e) {
            var t, n = window.u2f = {};
            n.EXTENSION_ID = "kmendfapggjehodndflmmgagdbamhnfd", n.MessageTypes = {
                U2F_REGISTER_REQUEST: "u2f_register_request",
                U2F_REGISTER_RESPONSE: "u2f_register_response",
                U2F_SIGN_REQUEST: "u2f_sign_request",
                U2F_SIGN_RESPONSE: "u2f_sign_response",
                U2F_GET_API_VERSION_REQUEST: "u2f_get_api_version_request",
                U2F_GET_API_VERSION_RESPONSE: "u2f_get_api_version_response"
            }, n.ErrorCodes = {
                OK: 0,
                OTHER_ERROR: 1,
                BAD_REQUEST: 2,
                CONFIGURATION_UNSUPPORTED: 3,
                DEVICE_INELIGIBLE: 4,
                TIMEOUT: 5
            }, n.U2fRequest, n.U2fResponse, n.Error, n.Transport, n.Transports, n.SignRequest, n.SignResponse, n.RegisterRequest, n.RegisterResponse, n.RegisteredKey, n.GetJsApiVersionResponse, n.getMessagePort = function(e) {
                if ("undefined" != typeof chrome && chrome.runtime) {
                    var t = {
                        type: n.MessageTypes.U2F_SIGN_REQUEST,
                        signRequests: []
                    };
                    chrome.runtime.sendMessage(n.EXTENSION_ID, t, function() {
                        chrome.runtime.lastError ? n.getIframePort_(e) : n.getChromeRuntimePort_(e)
                    })
                } else n.isAndroidChrome_() ? n.getAuthenticatorPort_(e) : n.isIosChrome_() ? n.getIosPort_(e) : n.getIframePort_(e)
            }, n.isAndroidChrome_ = function() {
                var e = navigator.userAgent;
                return -1 != e.indexOf("Chrome") && -1 != e.indexOf("Android")
            }, n.isIosChrome_ = function() {
                return ["iPhone", "iPad", "iPod"].indexOf(navigator.platform) > -1
            }, n.getChromeRuntimePort_ = function(e) {
                var t = chrome.runtime.connect(n.EXTENSION_ID, {
                    includeTlsChannelId: !0
                });
                setTimeout(function() {
                    e(new n.WrappedChromeRuntimePort_(t))
                }, 0)
            }, n.getAuthenticatorPort_ = function(e) {
                setTimeout(function() {
                    e(new n.WrappedAuthenticatorPort_)
                }, 0)
            }, n.getIosPort_ = function(e) {
                setTimeout(function() {
                    e(new n.WrappedIosPort_)
                }, 0)
            }, n.WrappedChromeRuntimePort_ = function(e) {
                this.port_ = e
            }, n.formatSignRequest_ = function(e, i, r, a, s) {
                if (void 0 === t || 1.1 > t) {
                    for (var o = [], u = 0; u < r.length; u++) o[u] = {
                        version: r[u].version,
                        challenge: i,
                        keyHandle: r[u].keyHandle,
                        appId: e
                    };
                    return {
                        type: n.MessageTypes.U2F_SIGN_REQUEST,
                        signRequests: o,
                        timeoutSeconds: a,
                        requestId: s
                    }
                }
                return {
                    type: n.MessageTypes.U2F_SIGN_REQUEST,
                    appId: e,
                    challenge: i,
                    registeredKeys: r,
                    timeoutSeconds: a,
                    requestId: s
                }
            }, n.formatRegisterRequest_ = function(e, i, r, a, s) {
                if (void 0 === t || 1.1 > t) {
                    for (var o = 0; o < r.length; o++) r[o].appId = e;
                    for (var u = [], o = 0; o < i.length; o++) u[o] = {
                        version: i[o].version,
                        challenge: r[0],
                        keyHandle: i[o].keyHandle,
                        appId: e
                    };
                    return {
                        type: n.MessageTypes.U2F_REGISTER_REQUEST,
                        signRequests: u,
                        registerRequests: r,
                        timeoutSeconds: a,
                        requestId: s
                    }
                }
                return {
                    type: n.MessageTypes.U2F_REGISTER_REQUEST,
                    appId: e,
                    registerRequests: r,
                    registeredKeys: i,
                    timeoutSeconds: a,
                    requestId: s
                }
            }, n.WrappedChromeRuntimePort_.prototype.postMessage = function(e) {
                this.port_.postMessage(e)
            }, n.WrappedChromeRuntimePort_.prototype.addEventListener = function(e, t) {
                var n = e.toLowerCase();
                "message" == n || "onmessage" == n ? this.port_.onMessage.addListener(function(e) {
                    t({
                        data: e
                    })
                }) : console.error("WrappedChromeRuntimePort only supports onMessage")
            }, n.WrappedAuthenticatorPort_ = function() {
                this.requestId_ = -1, this.requestObject_ = null
            }, n.WrappedAuthenticatorPort_.prototype.postMessage = function(e) {
                var t = n.WrappedAuthenticatorPort_.INTENT_URL_BASE_ + ";S.request=" + encodeURIComponent(JSON.stringify(e)) + ";end";
                document.location = t
            }, n.WrappedAuthenticatorPort_.prototype.getPortType = function() {
                return "WrappedAuthenticatorPort_"
            }, n.WrappedAuthenticatorPort_.prototype.addEventListener = function(e, t) {
                var n = e.toLowerCase();
                if ("message" == n) {
                    var i = this;
                    window.addEventListener("message", i.onRequestUpdate_.bind(i, t), !1)
                } else console.error("WrappedAuthenticatorPort only supports message")
            }, n.WrappedAuthenticatorPort_.prototype.onRequestUpdate_ = function(e, t) {
                var n = JSON.parse(t.data),
                    i = (n.intentURL, n.errorCode, null);
                n.hasOwnProperty("data") && (i = JSON.parse(n.data)), e({
                    data: i
                })
            }, n.WrappedAuthenticatorPort_.INTENT_URL_BASE_ = "intent:#Intent;action=com.google.android.apps.authenticator.AUTHENTICATE", n.WrappedIosPort_ = function() {}, n.WrappedIosPort_.prototype.postMessage = function(e) {
                var t = JSON.stringify(e),
                    n = "u2f://auth?" + encodeURI(t);
                location.replace(n)
            }, n.WrappedIosPort_.prototype.getPortType = function() {
                return "WrappedIosPort_"
            }, n.WrappedIosPort_.prototype.addEventListener = function(e, t) {
                var n = e.toLowerCase();
                "message" !== n && console.error("WrappedIosPort only supports message")
            }, n.getIframePort_ = function(e) {
                var t = "chrome-extension://" + n.EXTENSION_ID,
                    i = document.createElement("iframe");
                i.src = t + "/u2f-comms.html", i.setAttribute("style", "display:none"), document.body.appendChild(i);
                var r = new MessageChannel,
                    a = function(t) {
                        "ready" == t.data ? (r.port1.removeEventListener("message", a), e(r.port1)) : console.error('First event on iframe port was not "ready"')
                    };
                r.port1.addEventListener("message", a), r.port1.start(), i.addEventListener("load", function() {
                    i.contentWindow.postMessage("init", t, [r.port2])
                })
            }, n.EXTENSION_TIMEOUT_SEC = 30, n.port_ = null, n.waitingForPort_ = [], n.reqCounter_ = 0, n.callbackMap_ = {}, n.getPortSingleton_ = function(e) {
                n.port_ ? e(n.port_) : (0 == n.waitingForPort_.length && n.getMessagePort(function(e) {
                    for (n.port_ = e, n.port_.addEventListener("message", n.responseHandler_); n.waitingForPort_.length;) n.waitingForPort_.shift()(n.port_)
                }), n.waitingForPort_.push(e))
            }, n.responseHandler_ = function(e) {
                var t = e.data,
                    i = t.requestId;
                if (!i || !n.callbackMap_[i]) return void console.error("Unknown or missing requestId in response.");
                var r = n.callbackMap_[i];
                delete n.callbackMap_[i], r(t.responseData)
            }, n.sign = function(e, i, r, a, s) {
                void 0 === t ? n.getApiVersion(function(o) {
                    t = void 0 === o.js_api_version ? 0 : o.js_api_version, console.log("Extension JS API Version: ", t), n.sendSignRequest(e, i, r, a, s)
                }) : n.sendSignRequest(e, i, r, a, s)
            }, n.sendSignRequest = function(e, t, i, r, a) {
                n.getPortSingleton_(function(s) {
                    var o = ++n.reqCounter_;
                    n.callbackMap_[o] = r;
                    var u = "undefined" != typeof a ? a : n.EXTENSION_TIMEOUT_SEC,
                        l = n.formatSignRequest_(e, t, i, u, o);
                    s.postMessage(l)
                })
            }, n.register = function(e, i, r, a, s) {
                void 0 === t ? n.getApiVersion(function(o) {
                    t = void 0 === o.js_api_version ? 0 : o.js_api_version, console.log("Extension JS API Version: ", t), n.sendRegisterRequest(e, i, r, a, s)
                }) : n.sendRegisterRequest(e, i, r, a, s)
            }, n.sendRegisterRequest = function(e, t, i, r, a) {
                n.getPortSingleton_(function(s) {
                    var o = ++n.reqCounter_;
                    n.callbackMap_[o] = r;
                    var u = "undefined" != typeof a ? a : n.EXTENSION_TIMEOUT_SEC,
                        l = n.formatRegisterRequest_(e, i, t, u, o);
                    s.postMessage(l)
                })
            }, n.getApiVersion = function(e, t) {
                n.getPortSingleton_(function(i) {
                    if (i.getPortType) {
                        var r;
                        switch (i.getPortType()) {
                            case "WrappedIosPort_":
                            case "WrappedAuthenticatorPort_":
                                r = 1.1;
                                break;
                            default:
                                r = 0
                        }
                        return void e({
                            js_api_version: r
                        })
                    }
                    var a = ++n.reqCounter_;
                    n.callbackMap_[a] = e;
                    var s = {
                        type: n.MessageTypes.U2F_GET_API_VERSION_REQUEST,
                        timeoutSeconds: "undefined" != typeof t ? t : n.EXTENSION_TIMEOUT_SEC,
                        requestId: a
                    };
                    i.postMessage(s)
                })
            }
        }
    }(), define.registerEnd(), define.register("ios-security-key"),
    function(e, t) {
        var n = {
                pingPong: function() {
                    this.whenReady_ = [], this.isReady_ = !1, this.send("ping"), this.receive("pong", this.isReady), this.receive("ping", function() {
                        this.send("pong"), this.isReady()
                    })
                },
                receive: function(e, t) {
                    window.addEventListener("u2f-" + e, function(e) {
                        t.apply(this, e.detail)
                    }.bind(this))
                },
                send: function(e) {
                    var t = Array.from(arguments).slice(1);
                    window.dispatchEvent(new CustomEvent("u2f-" + e, {
                        detail: t
                    }))
                },
                whenReady: function(e) {
                    this.isReady_ ? e.apply(this) : this.whenReady_.push(e)
                },
                isReady: function() {
                    for (this.isReady_ = !0; cb = this.whenReady_.shift();) cb.apply(this)
                }
            },
            i = function() {
                this.rpcRequester("register"), this.rpcRequester("sign"), this.pingPong()
            };
        i.prototype = n, i.prototype.rpcRequester = function(e) {
            this[e] = function() {
                var t = Array.from(arguments);
                t.unshift(e + "-request");
                var n = t.pop();
                this.receive(e + "-response", n), this.whenReady(function() {
                    this.send.apply(this, t)
                })
            }
        }, !t.u2f && navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform) && (t.u2f = new i), t[""] = e
    }({}, function() {
        return this
    }()), define.registerEnd(), define("github/u2f", ["exports", "u2f-api-polyfill", "ios-security-key"], function(e) {
        function t() {
            return !!window.u2f || document.documentElement.classList.contains("is-u2f-enabled")
        }

        function n() {
            for (var e = arguments.length, t = Array(e), n = 0; e > n; n++) t[n] = arguments[n];
            return new Promise(function(e, n) {
                var i;
                (i = window.u2f).sign.apply(i, t.concat([function(t) {
                    if (null != t.errorCode && 0 !== t.errorCode) {
                        var i = new Error("Signing request failed");
                        i.code = t.errorCode, n(i)
                    } else e(t)
                }]))
            })
        }

        function i() {
            for (var e = arguments.length, t = Array(e), n = 0; e > n; n++) t[n] = arguments[n];
            return new Promise(function(e, n) {
                var i;
                (i = window.u2f).register.apply(i, t.concat([function(t) {
                    if (null != t.errorCode && 0 !== t.errorCode) {
                        var i = new Error("Device registration failed");
                        i.code = t.errorCode, n(i)
                    } else e(t)
                }]))
            })
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.u2fEnabledBrowser = t, e.u2fSign = n, e.u2fRegister = i
    }), define("github/u2f-auth-form", ["exports", "./typecast", "delegated-events", "./u2f"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            var e = s["default"](document.querySelector(".js-u2f-auth-form"), HTMLFormElement),
                t = s["default"](e.querySelector(".js-u2f-auth-response"), HTMLInputElement),
                r = e.getAttribute("data-app-id"),
                a = e.getAttribute("data-challenge"),
                o = e.getAttribute("data-sign-requests");
            if (null != o) {
                var u = JSON.parse(o);
                Array.from(document.querySelectorAll(".js-u2f-error")).forEach(function(e) {
                    return e.classList.add("d-none")
                });
                var l = document.querySelector(".js-u2f-login-waiting");
                null != l && l.classList.remove("d-none"), i.u2fSign(r, a, u).then(function(i) {
                    t.value = JSON.stringify(i), n.fire(e, "submit") && e.submit()
                }, function(e) {
                    var t = ".js-u2f-auth-error";
                    switch (e.code) {
                        case 4:
                            t = ".js-u2f-auth-not-registered-error";
                            break;
                        case 5:
                            t = ".js-u2f-auth-timeout"
                    }
                    var n = document.querySelector(t);
                    null != n && n.classList.remove("d-none"), null != l && l.classList.add("d-none")
                })
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.waitForDevice = a;
        var s = r(t)
    }), define("github/u2f-login", ["./observe", "delegated-events", "./u2f", "./u2f-auth-form"], function(e, t, n, i) {
        t.on("click", ".js-u2f-auth-retry", function() {
            i.waitForDevice()
        }), e.observe(".js-u2f-auth-form-body", function() {
            this.classList.toggle("unavailable", !n.u2fEnabledBrowser()), n.u2fEnabledBrowser() && i.waitForDevice()
        })
    }), define("github/u2f-settings", ["./u2f", "./jquery", "./typecast", "./fetch", "./observe", "delegated-events"], function(e, t, n, i, r, a) {
        function s(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o(e, t, n) {
            if (null == n) {
                var i = e.getAttribute(t);
                return null == i ? null : JSON.parse(i)
            }
            e.setAttribute(t, JSON.stringify(n))
        }

        function u(e) {
            var t = g["default"](document.querySelector(".js-add-u2f-registration-form"), HTMLFormElement);
            return o(t, "data-sign-requests", e)
        }

        function l(e) {
            var t = g["default"](document.querySelector(".js-add-u2f-registration-form"), HTMLFormElement);
            return o(t, "data-register-requests", e)
        }

        function c(e) {
            e.register_requests && l(e.register_requests), e.sign_requests && u(e.sign_requests)
        }

        function d(e) {
            var t = document.createElement("div");
            t.innerHTML = e;
            var n = t.firstChild;
            null != n && g["default"](document.querySelector(".js-u2f-registrations"), HTMLElement).appendChild(n)
        }

        function f(e, t) {
            var n = g["default"](document.querySelector(".js-new-u2f-registration"), HTMLElement);
            n.classList.add("is-showing-error"), n.classList.remove("is-sending"), Array.from(n.querySelectorAll(".js-u2f-error")).forEach(function(e) {
                return e.classList.add("d-none")
            });
            var i = g["default"](n.querySelector(e), HTMLElement);
            null != t && (i.textContent = t), i.classList.remove("d-none")
        }

        function h() {
            var e = g["default"](document.querySelector(".js-new-u2f-registration"), HTMLElement);
            e.classList.remove("is-sending", "is-active"), g["default"](document.querySelector(".js-u2f-registration-nickname-field"), HTMLInputElement).value = ""
        }

        function m(e) {
            var t = g["default"](document.querySelector(".js-add-u2f-registration-form"), HTMLFormElement);
            g["default"](t.elements.namedItem("response"), HTMLInputElement).value = JSON.stringify(e), i.fetchJSON(t.action, {
                method: t.method,
                body: new FormData(t)
            }).then(function(e) {
                c(e), h(), d(e.registration)
            })["catch"](function(e) {
                e.response ? e.response.json().then(function(e) {
                    c(e), f(".js-u2f-server-error", e.error)
                }) : f(".js-u2f-network-error")
            })
        }

        function v() {
            var t = g["default"](document.querySelector(".js-new-u2f-registration"), HTMLElement);
            t.classList.add("is-sending"), t.classList.remove("is-showing-error");
            var n = g["default"](document.querySelector(".js-add-u2f-registration-form"), HTMLElement),
                i = n.getAttribute("data-app-id");
            if (null == i) throw new Error("invalid appId");
            e.u2fRegister(i, l(), u()).then(m)["catch"](function(e) {
                var t = ".js-u2f-other-error";
                switch (e.code) {
                    case 4:
                        t = ".js-u2f-registered-error";
                        break;
                    case 5:
                        t = ".js-u2f-timeout-error"
                }
                f(t)
            })
        }
        var p = s(t),
            g = s(n);
        p["default"](document).on("ajaxSend", ".js-u2f-registration-delete", function() {
            this.closest(".js-u2f-registration").classList.add("is-sending")
        }), p["default"](document).on("ajaxSuccess", ".js-u2f-registration-delete", function(e, t) {
            c(t.responseJSON), this.closest(".js-u2f-registration").remove()
        }), a.on("click", ".js-add-u2f-registration-link", function() {
            var e = g["default"](document.querySelector(".js-new-u2f-registration"), HTMLElement);
            e.classList.add("is-active"), e.classList.remove("is-showing-error");
            var t = g["default"](document.querySelector(".js-u2f-registration-nickname-field"), HTMLInputElement);
            t.focus()
        }), a.on("click", ".js-u2f-register-retry", function() {
            v()
        }), a.on("submit", ".js-add-u2f-registration-form", function(e) {
            e.preventDefault(), v()
        }), r.observe(".js-u2f-box", function() {
            this.classList.toggle("available", e.u2fEnabledBrowser())
        })
    }), define("github/updatable-content-observer", ["./jquery", "./updatable-content"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(e);
        i["default"](document).on("socket:message", ".js-updatable-content", function(e) {
            this === e.target && t.updateContent(this)
        })
    }), define("github/upload/avatar", ["../facebox", "../fetch", "delegated-events"], function(e, t, n) {
        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = i(e);
        n.on("upload:setup", ".js-upload-avatar-image", function(e) {
            var t = e.detail.policyRequest,
                n = this.getAttribute("data-alambic-organization"),
                i = this.getAttribute("data-alambic-owner-type"),
                r = this.getAttribute("data-alambic-owner-id");
            n && t.body.append("organization_id", n), i && t.body.append("owner_type", i), r && t.body.append("owner_id", r)
        }), n.on("upload:complete", ".js-upload-avatar-image", function(e) {
            var n = e.detail.result,
                i = "/settings/avatars/" + n.id;
            r["default"](function() {
                t.fetchText(i).then(r["default"])
            })
        })
    }), define("github/png-scanner", ["exports"], function(e) {
        function t(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t
                }
            }(),
            i = 2303741511,
            r = 4,
            a = function() {
                function e(n) {
                    t(this, e), this.dataview = new DataView(n), this.pos = 0
                }
                return n(e, null, [{
                    key: "fromFile",
                    value: function(t) {
                        return new Promise(function(n, i) {
                            var r = new FileReader;
                            r.onload = function() {
                                n(new e(r.result))
                            }, r.onerror = function() {
                                i(r.error)
                            }, r.readAsArrayBuffer(t)
                        })
                    }
                }]), n(e, [{
                    key: "advance",
                    value: function(e) {
                        return this.pos += e
                    }
                }, {
                    key: "readInt",
                    value: function(e) {
                        var t = this,
                            n = function() {
                                switch (e) {
                                    case 1:
                                        return t.dataview.getUint8(t.pos);
                                    case 2:
                                        return t.dataview.getUint16(t.pos);
                                    case 4:
                                        return t.dataview.getUint32(t.pos);
                                    default:
                                        throw new Error("bytes parameter must be 1, 2 or 4")
                                }
                            }();
                        return this.advance(e), n
                    }
                }, {
                    key: "readChar",
                    value: function() {
                        return this.readInt(1)
                    }
                }, {
                    key: "readShort",
                    value: function() {
                        return this.readInt(2)
                    }
                }, {
                    key: "readLong",
                    value: function() {
                        return this.readInt(4)
                    }
                }, {
                    key: "readString",
                    value: function(e) {
                        for (var t = [], n = 0; e > n; n++) t.push(String.fromCharCode(this.readChar()));
                        return t.join("")
                    }
                }, {
                    key: "scan",
                    value: function(e) {
                        if (this.readLong() !== i) throw new Error("invalid PNG");
                        for (this.advance(4);;) {
                            var t = this.readLong(),
                                n = this.readString(4),
                                a = this.pos + t + r;
                            if (e.call(this, n, t) === !1 || "IEND" === n) break;
                            this.pos = a
                        }
                    }
                }]), e
            }();
        e["default"] = a
    }), define("github/image-dimensions", ["exports", "./png-scanner"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(t),
            r = .0254;
        e["default"] = function(e) {
            var t, n, a;
            return regeneratorRuntime.async(function(s) {
                for (;;) switch (s.prev = s.next) {
                    case 0:
                        if ("image/png" === e.type) {
                            s.next = 2;
                            break
                        }
                        return s.abrupt("return", null);
                    case 2:
                        return t = e.slice(0, 10240, e.type), s.next = 5, regeneratorRuntime.awrap(i["default"].fromFile(t));
                    case 5:
                        return n = s.sent, a = {
                            width: 0,
                            height: 0,
                            ppi: 1
                        }, n.scan(function(e) {
                            switch (e) {
                                case "IHDR":
                                    return a.width = this.readLong(), a.height = this.readLong(), !0;
                                case "pHYs":
                                    var t = this.readLong(),
                                        n = this.readLong(),
                                        i = this.readChar(),
                                        s = void 0;
                                    return 1 === i && (s = r), s && (a.ppi = Math.round((t + n) / 2 * s)), !1;
                                case "IDAT":
                                    return !1
                            }
                            return !0
                        }), s.abrupt("return", a);
                    case 9:
                    case "end":
                        return s.stop()
                }
            }, null, this)
        }
    }), define("github/upload/markdown", ["../text", "../image-dimensions", "delegated-events", "../html-validation", "../setimmediate"], function(e, t, n, i, r) {
        function a(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function s(e) {
            return e.toLowerCase().replace(/[^a-z0-9\-_]+/gi, ".").replace(/\.{2,}/g, ".").replace(/^\.|\.$/gi, "")
        }

        function o(e) {
            var t = l(e) ? "!" : "";
            return t + "[Uploading " + e.name + "\u2026]()"
        }

        function u(e) {
            return s(e).replace(/\.[^.]+$/, "").replace(/\./g, " ")
        }

        function l(e) {
            return ["image/gif", "image/png", "image/jpg", "image/jpeg"].indexOf(e.type) > -1
        }

        function c(e) {
            var t = e.split(".").pop().toLowerCase();
            return ["gif", "png", "jpg", "jpeg"].indexOf(t) > -1
        }
        var d = a(t),
            f = a(r),
            h = 144;
        n.on("upload:setup", ".js-upload-markdown-image", function(t) {
            var n = this.querySelector(".js-comment-field");
            e.insertText(n, o(t.detail.file) + "\n"), n.setAttribute("data-upload", ""), i.revalidate(n, !1)
        }), n.on("upload:complete", ".js-upload-markdown-image", function(t) {
            function n(t) {
                var n = "[" + r.file.name + "](" + r.policy.asset.href + ")";
                if (l(r.file)) {
                    var a = u(r.policy.asset.name),
                        o = r.policy.asset.href;
                    if (t && t.ppi === h) {
                        var d = Math.round(t.width / 2);
                        n = '<img width="' + d + '" alt="' + a + '" src="' + o + '">'
                    } else n = "![" + a + "](" + o + ")"
                }
                e.replaceText(s, c, n), s.removeAttribute("data-upload"), i.revalidate(s)
            }
            var r = t.detail,
                a = this,
                s = a.querySelector(".js-comment-field"),
                c = o(r.file);
            d["default"](r.file).then(n, function(e) {
                n(), f["default"](function() {
                    throw e
                })
            })
        }), n.on("upload:error", ".js-upload-markdown-image", function(t) {
            var n = this.querySelector(".js-comment-field"),
                r = o(t.detail.file);
            e.replaceText(n, r, ""), i.revalidate(n)
        }), n.on("upload:invalid", ".js-upload-markdown-image", function(t) {
            var n = this.querySelector(".js-comment-field"),
                r = o(t.detail.file);
            e.replaceText(n, r, ""), i.revalidate(n)
        }), n.on("upload:drop:links", ".js-upload-markdown-image", function(t) {
            var n = this.querySelector(".js-comment-field");
            t.detail.links.forEach(function(t) {
                var i = c(t) ? "\n![](" + t + ")\n" : t;
                e.insertText(n, i)
            })
        }), n.on("upload:drop:text", ".js-upload-markdown-image", function(t) {
            var n = this.querySelector(".js-comment-field");
            e.insertText(n, t.detail.text)
        })
    }), define("github/upload/release-file", ["../typecast", "delegated-events", "../releases", "../setimmediate"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a(e) {
            return e.closest("form").querySelector("#release_id").value
        }
        var s = r(e),
            o = r(i);
        t.on("click", ".js-release-remove-file", function() {
            var e = this.closest(".js-release-file");
            e.classList.add("delete"), e.querySelector("input.destroy").value = "true"
        }), t.on("click", ".js-release-undo-remove-file", function() {
            var e = this.closest(".js-release-file");
            e.classList.remove("delete"), e.querySelector("input.destroy").value = ""
        });
        var u = [];
        t.on("release:saved", ".js-release-form", function() {
            o["default"](function() {
                u.forEach(function(e) {
                    return e()
                }), u.length = 0
            });
            var e = 0;
            Array.from(this.querySelectorAll(".js-releases-field .js-release-file")).forEach(function(t) {
                t.classList.contains("delete") ? t.remove() : t.classList.contains("js-template") || e++
            });
            var t = this.querySelector(".js-releases-field");
            t.classList.toggle("not-populated", !e), t.classList.toggle("is-populated", e)
        }), t.on("upload:setup", ".js-upload-release-file", function(e) {
            function t() {
                r.body.append("release_id", a(l));
                var e = document.querySelectorAll(".js-releases-field .js-release-file.delete .id");
                if (e.length) {
                    var t = Array.from(e).map(function(e) {
                        return s["default"](e, HTMLInputElement).value
                    });
                    r.body.append("deletion_candidates", t.join(","))
                }
            }
            var i = e.detail,
                r = i.policyRequest,
                o = i.preprocess,
                l = this;
            a(l) ? t() : (o.push(new Promise(function(e) {
                return u.push(e)
            }).then(t)), 1 === u.length && n.saveDraft(document.querySelector(".js-save-draft")))
        }), t.on("upload:start", ".js-upload-release-file", function(e) {
            var t = e.detail.policy;
            this.querySelector(".js-upload-meter").classList.remove("d-none");
            var n = t.asset.replaced_asset;
            n && Array.from(document.querySelectorAll(".js-releases-field .js-release-file .id")).forEach(function(e) {
                null != e && e instanceof HTMLInputElement && Number(e.value) === n && s["default"](e.closest(".js-release-file"), HTMLElement).remove()
            })
        }), t.on("upload:complete", ".js-upload-release-file", function(e) {
            var t = e.detail,
                n = t.policy,
                i = s["default"](document.querySelector(".js-releases-field"), HTMLElement),
                r = s["default"](i.querySelector(".js-template"), HTMLElement).cloneNode(!0);
            r.classList.remove("template", "js-template"), s["default"](r.querySelector("input.id"), HTMLInputElement).value = n.asset.id || t.result.id;
            var a = n.asset.name || n.asset.href.split("/").pop();
            Array.from(r.querySelectorAll(".filename")).forEach(function(e) {
                e instanceof HTMLInputElement ? e.value = a : e.textContent = a
            });
            var o = n.asset.size ? "(" + (n.asset.size / 1048576).toFixed(2) + " MB)" : "";
            s["default"](r.querySelector(".filesize"), HTMLElement).textContent = o, i.appendChild(r), i.classList.remove("not-populated"), i.classList.add("is-populated"), this.querySelector(".js-upload-meter").classList.add("d-none")
        }), t.on("upload:progress", ".js-upload-release-file", function(e) {
            var t = this.querySelector(".js-upload-meter");
            t.style.width = e.detail.percent + "%"
        })
    }), define("github/upload/upload-manifest-file", ["../fetch", "../jquery", "../typecast", "../observe", "delegated-events", "../once", "../pjax"], function(e, t, n, i, r, a, s) {
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function u(e, t) {
            var n = e.closest(".js-upload-manifest-file-container"),
                i = n.querySelector(".js-upload-progress");
            i.classList.add("active"), e.classList.add("is-progress-bar");
            var r = i.querySelector(".js-upload-meter-text");
            r.querySelector(".js-upload-meter-range-start").textContent = t.batch.uploaded + 1, r.querySelector(".js-upload-meter-range-end").textContent = t.batch.size
        }

        function l(e) {
            e.classList.remove("is-progress-bar");
            var t = e.closest(".js-upload-manifest-file-container"),
                n = t.querySelector(".js-upload-progress");
            n.classList.remove("active");
            var i = t.querySelector(".js-upload-meter-text");
            i.querySelector(".js-upload-meter-filename").textContent = ""
        }

        function c(e) {
            return e._path ? e._path + "/" + e.name : e.name
        }

        function d() {
            l(this)
        }
        var f = o(t),
            h = o(n),
            m = o(a),
            v = o(s),
            p = [],
            g = new WeakMap;
        r.on("upload:drop:setup", ".js-upload-manifest-file", function(e) {
            var t = e.detail.files,
                n = parseInt(this.getAttribute("data-directory-upload-max-files"), 10);
            t.length > n && (e.preventDefault(), this.classList.add("is-too-many"))
        }), r.on("upload:drop:setup", ".js-upload-manifest-tree-view", function(e) {
            e.preventDefault();
            var t = e.detail.upload,
                n = h["default"](document.querySelector("#js-repo-pjax-container"), HTMLElement);
            m["default"](n, "pjax:success").then(function() {
                t(n.querySelector(".js-uploadable-container"))
            }), v["default"]({
                url: this.getAttribute("data-drop-url"),
                container: n
            })
        }), r.on("upload:setup", ".js-upload-manifest-file", function(t) {
            function n() {
                r.body.append("upload_manifest_id", g.get(s))
            }
            var i = t.detail,
                r = i.policyRequest,
                a = i.preprocess;
            u(this, t.detail);
            var s = this;
            if (g.get(s) ? n() : a.push(new Promise(function(e) {
                    return p.push(e)
                }).then(n)), !(p.length > 1 || g.get(s))) {
                var o = this.closest(".js-upload-manifest-file-container").querySelector(".js-upload-manifest-form");
                e.fetchJSON(o.action, {
                    method: o.method,
                    body: new FormData(o)
                }).then(function(e) {
                    var t = h["default"](document.querySelector(".js-manifest-commit-form"), HTMLFormElement);
                    h["default"](t.elements.namedItem("manifest_id"), HTMLInputElement).value = e.upload_manifest.id, g.set(s, e.upload_manifest.id), p.forEach(function(e) {
                        return e()
                    }), p.length = 0
                })
            }
        }), r.on("upload:start", ".js-upload-manifest-file", function(e) {
            var t = e.detail,
                n = this.closest(".js-upload-manifest-file-container"),
                i = n.querySelector(".js-upload-progress"),
                r = i.querySelector(".js-upload-meter-text");
            r.querySelector(".js-upload-meter-range-start").textContent = t.batch.uploaded + 1, r.querySelector(".js-upload-meter-filename").textContent = c(t.file)
        }), r.on("upload:complete", ".js-upload-manifest-file", function(e) {
            var t = e.detail,
                n = document.querySelector(".js-manifest-commit-file-template"),
                i = n.rows[0].cloneNode(!0);
            i.querySelector(".name").textContent = c(t.file);
            var r = t.policy.asset.id || t.result.id;
            i.querySelector(".js-remove-manifest-file-form").elements.file_id.value = r;
            var a = h["default"](document.querySelector(".js-manifest-file-list"), HTMLElement);
            a.classList.remove("d-none"), this.classList.add("is-file-list");
            var s = h["default"](document.querySelector(".js-upload-progress"), HTMLElement);
            s.classList.add("is-file-list");
            var o = h["default"](a.querySelector(".js-manifest-file-list-root"), HTMLElement);
            o.appendChild(i), t.batch.isFinished() && l(this)
        }), r.on("upload:progress", ".js-upload-manifest-file", function(e) {
            var t = e.detail,
                n = this.closest(".js-upload-manifest-file-container"),
                i = n.querySelector(".js-upload-meter");
            i.style.width = t.batch.percent() + "%"
        }), r.on("upload:error", ".js-upload-manifest-file", d), r.on("upload:invalid", ".js-upload-manifest-file", d), f["default"](document).on("ajaxSuccess", ".js-remove-manifest-file-form", function() {
            var e = this.closest(".js-manifest-file-list-root");
            if (this.closest(".js-manifest-file-entry").remove(), !e.hasChildNodes()) {
                var t = e.closest(".js-manifest-file-list");
                t.classList.add("d-none");
                var n = h["default"](document.querySelector(".js-upload-manifest-file"), HTMLElement);
                n.classList.remove("is-file-list");
                var i = h["default"](document.querySelector(".js-upload-progress"), HTMLElement);
                i.classList.remove("is-file-list")
            }
        }), i.observe(".js-manifest-ready-check", function() {
            var t = this.getAttribute("data-redirect-url");
            e.fetchPoll(this.getAttribute("data-poll-url")).then(function() {
                window.location = t
            })["catch"](function() {
                h["default"](document.querySelector(".js-manifest-ready-check"), HTMLElement).classList.add("d-none"), h["default"](document.querySelector(".js-manifest-ready-check-failed"), HTMLElement).classList.remove("d-none")
            })
        })
    }), define("github/uploads", ["./fetch", "delegated-events", "./observe", "./upload/avatar", "./upload/markdown", "./upload/release-file", "./upload/upload-manifest-file"], function(e, t, n) {
        function i(e) {
            return e.closest("form").elements.authenticity_token.value
        }

        function r(e, t) {
            var n;
            (n = e.classList).remove.apply(n, O), e.classList.add(t)
        }

        function a(n, i) {
            n.files.forEach(function(a) {
                var l = s(a, i),
                    c = [];
                t.fire(i, "upload:setup", {
                    batch: n,
                    file: a,
                    policyRequest: l,
                    preprocess: c
                }) && Promise.all(c).then(function() {
                    return e.fetchJSON(l.url, l)
                }).then(function(e) {
                    var t = u(n, a, e, i);
                    N.upload(a, t)
                })["catch"](function(e) {
                    if (t.fire(i, "upload:invalid", {
                            batch: n,
                            file: a,
                            error: e
                        }), e.response) e.response.text().then(function(t) {
                        var n = e.response.status,
                            s = o({
                                status: n,
                                body: t
                            }, a);
                        r(i, s)
                    });
                    else {
                        var s = o({
                            status: 0
                        });
                        r(i, s)
                    }
                })
            })
        }

        function s(e, t) {
            var n = t.getAttribute("data-upload-policy-url"),
                r = t.getAttribute("data-upload-repository-id"),
                a = t.getAttribute("data-upload-policy-authenticity-token");
            null == a && (a = i(t));
            var s = new FormData;
            return s.append("name", e.name), s.append("size", e.size), s.append("content_type", e.type), s.append("authenticity_token", a), r && s.append("repository_id", r), e._path && s.append("directory", e._path), {
                url: n,
                method: "post",
                body: s,
                headers: {}
            }
        }

        function o(e, t) {
            if (400 === e.status) return "is-bad-file";
            if (422 !== e.status) return "is-failed";
            var n = JSON.parse(e.body);
            if (!n || !n.errors) return "is-failed";
            for (var i = 0, r = n.errors.length; r > i; i++) {
                var a = n.errors[i];
                switch (a.field) {
                    case "size":
                        var s = t ? t.size : null;
                        return null != s && 0 === parseInt(s) ? "is-empty" : "is-too-big";
                    case "file_count":
                        return "is-too-many";
                    case "width":
                    case "height":
                        return "is-bad-dimensions";
                    case "name":
                        return "already_exists" === a.code ? "is-duplicate-filename" : "is-bad-file";
                    case "content_type":
                        return "is-bad-file";
                    case "uploader_id":
                        return "is-bad-permissions";
                    case "repository_id":
                        return "is-repository-required";
                    case "format":
                        return "is-bad-format"
                }
            }
            return "is-failed"
        }

        function u(n, a, s, u) {
            var l = s.upload_authenticity_token;
            null == l && (l = i(u));
            var c = s.asset_upload_authenticity_token;
            return null == c && (c = i(u)), {
                to: s.upload_url,
                form: s.form,
                header: s.header,
                sameOrigin: s.same_origin,
                csrf: l,
                start: function() {
                    r(u, "is-uploading"), t.fire(u, "upload:start", {
                        batch: n,
                        file: a,
                        policy: s
                    })
                },
                progress: function(e) {
                    n.progress(a, e), t.fire(u, "upload:progress", {
                        batch: n,
                        file: a,
                        percent: e
                    })
                },
                complete: function(i) {
                    if (n.completed(a), i && i.href && (s.asset || (s.asset = {}), s.asset.href = i.href), s.asset_upload_url && s.asset_upload_url.length > 0) {
                        var o = new FormData;
                        o.append("authenticity_token", c), e.fetchJSON(s.asset_upload_url, {
                            method: "put",
                            body: o
                        })
                    }
                    t.fire(u, "upload:complete", {
                        batch: n,
                        file: a,
                        policy: s,
                        result: i
                    }), r(u, "is-default")
                },
                error: function(e) {
                    t.fire(u, "upload:error", {
                        batch: n,
                        file: a,
                        policy: s
                    });
                    var i = o(e);
                    r(u, i)
                }
            }
        }

        function l(e) {
            return Array.from(e.types).indexOf("Files") >= 0
        }

        function c(e) {
            return Array.from(e.types).indexOf("text/uri-list") >= 0
        }

        function d(e) {
            return Array.from(e.types).indexOf("text/plain") >= 0
        }

        function f(e) {
            var t = [];
            return e.forEach(function(e) {
                Array.isArray(e) ? t = t.concat(f(e)) : t.push(e)
            }), t
        }

        function h(e) {
            return e.name.startsWith(".")
        }

        function m(e) {
            return Array.from(e).filter(function(e) {
                return !h(e)
            })
        }

        function v(e, t) {
            return t.getFilesAndDirectories ? t.getFilesAndDirectories().then(function(e) {
                var n = m(e).map(function(e) {
                    return v(t.path, e)
                });
                return Promise.all(n)
            }) : (t._path = e, t)
        }

        function p(e) {
            return v("", e).then(f)
        }

        function g(e) {
            return new Promise(function(t, n) {
                e.file(t, n)
            })
        }

        function b(e) {
            return new Promise(function(t, n) {
                e.createReader().readEntries(t, n)
            })
        }

        function y(e, t) {
            return t.isDirectory ? b(t).then(function(e) {
                var n = m(e).map(function(e) {
                    return y(t.fullPath, e)
                });
                return Promise.all(n)
            }) : g(t).then(function(t) {
                return t._path = e, t
            })
        }

        function j(e) {
            return e.items && Array.from(e.items).some(function(e) {
                return e.webkitGetAsEntry && e.webkitGetAsEntry().isDirectory
            })
        }

        function w(e) {
            var t = Array.from(e.items).map(function(e) {
                    return e.webkitGetAsEntry()
                }),
                n = m(t).map(function(e) {
                    return y("", e)
                });
            return Promise.all(n).then(f)
        }

        function x(e, t) {
            var n = new F(e);
            a(n, t)
        }

        function S(e) {
            return l(e) ? "copy" : c(e) ? "link" : d(e) ? "copy" : "none"
        }

        function k(e) {
            switch (e) {
                case "image/gif":
                    return "image.gif";
                case "image/png":
                    return "image.png";
                case "image/jpeg":
                    return "image.jpg"
            }
        }

        function L(e) {
            e.preventDefault()
        }

        function _(e) {
            e.preventDefault()
        }

        function E(e) {
            var t = this;
            if (!U) {
                clearTimeout(B), B = setTimeout(function() {
                    return t.classList.remove("dragover")
                }, 200);
                var n = S(e.dataTransfer);
                e.dataTransfer.dropEffect = n, this.classList.add("dragover"), e.stopPropagation(), e.preventDefault()
            }
        }

        function C(e) {
            e.dataTransfer.dropEffect = "none", this.classList.remove("dragover"), e.stopPropagation(), e.preventDefault()
        }

        function q(e) {
            e.target.classList && e.target.classList.contains("js-document-dropzone") && this.classList.remove("dragover")
        }

        function T(e) {
            var n = this;
            this.classList.remove("dragover"), document.body.classList.remove("dragover");
            var i = e.dataTransfer;
            if (l(i)) ! function() {
                var e = null;
                e = n.hasAttribute("data-directory-upload") && i.getFilesAndDirectories ? p(i) : n.hasAttribute("data-directory-upload") && j(i) ? w(i) : Promise.resolve(m(i.files));
                var a = n;
                e.then(function(e) {
                    if (!e.length) return void r(a, "is-hidden-file");
                    var n = x.bind(null, e),
                        i = !t.fire(a, "upload:drop:setup", {
                            upload: n,
                            files: e
                        });
                    i || x(e, a)
                })
            }();
            else if (c(i)) {
                var a = (i.getData("text/uri-list") || "").split("\r\n");
                a.length && t.fire(this, "upload:drop:links", {
                    links: a
                })
            } else d(i) && t.fire(this, "upload:drop:text", {
                text: i.getData("text/plain")
            });
            e.stopPropagation(), e.preventDefault()
        }

        function A(e) {
            if (e.clipboardData && e.clipboardData.items) {
                var t = Array.from(e.clipboardData.items).map(function(e) {
                    return [e, k(e.type)]
                }).filter(function(e) {
                    return e[1]
                }).shift();
                if (t) {
                    var n = P(t, 2),
                        i = n[0],
                        r = n[1],
                        a = i.getAsFile();
                    a.name = r, x([a], this), e.preventDefault()
                }
            }
        }

        function M(e) {
            e.target.classList.contains("js-manual-file-chooser") && (x(e.target.files, this), e.target.value = "")
        }

        function H() {
            var e = this.querySelector(".js-uploadable-container");
            r(e, "is-default")
        }

        function I() {
            U = !0
        }

        function D() {
            U = !1
        }
        var P = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !i && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            R = function() {
                function e() {
                    this.uploads = [], this.busy = !1
                }
                return e.prototype.upload = function(e, t) {
                    function n() {}
                    this.uploads.push({
                        file: e,
                        to: t.to,
                        sameOrigin: t.sameOrigin,
                        csrf: t.csrf,
                        form: t.form || {},
                        header: t.header || {},
                        start: t.start || n,
                        progress: t.progress || n,
                        complete: t.complete || n,
                        error: t.error || n
                    }), this.process()
                }, e.prototype.process = function() {
                    var e = this;
                    if (!this.busy && 0 !== this.uploads.length) {
                        var t = this.uploads.shift();
                        this.busy = !0;
                        var n = new XMLHttpRequest;
                        n.open("POST", t.to, !0);
                        for (var i in t.header) n.setRequestHeader(i, t.header[i]);
                        n.onloadstart = function() {
                            t.start()
                        }, n.onload = function() {
                            204 === n.status ? t.complete({}) : 201 === n.status ? t.complete(JSON.parse(n.responseText)) : t.error({
                                status: n.status,
                                body: n.responseText
                            }), e.busy = !1, e.process()
                        }, n.onerror = function() {
                            t.error({
                                status: 0,
                                body: ""
                            })
                        }, n.upload.onprogress = function(e) {
                            if (e.lengthComputable) {
                                var n = Math.round(e.loaded / e.total * 100);
                                t.progress(n)
                            }
                        };
                        var r = new FormData;
                        t.sameOrigin && r.append("authenticity_token", t.csrf);
                        for (var a in t.form) r.append(a, t.form[a]);
                        r.append("file", t.file), n.send(r)
                    }
                }, e
            }(),
            O = ["is-default", "is-uploading", "is-bad-file", "is-duplicate-filename", "is-too-big", "is-too-many", "is-hidden-file", "is-failed", "is-bad-dimensions", "is-empty", "is-bad-permissions", "is-repository-required", "is-bad-format"],
            N = new R,
            F = function() {
                function e(e) {
                    this.files = Array.from(e), this.percentages = this.files.map(function() {
                        return 0
                    }), this.size = this.files.length, this.total = this.files.reduce(function(e, t) {
                        return e + t.size
                    }, 0), this.uploaded = 0
                }
                return e.prototype.percent = function() {
                    var e = this,
                        t = this.files.map(function(t, n) {
                            return t.size * e.percentages[n] / 100
                        }).reduce(function(e, t) {
                            return e + t
                        });
                    return Math.round(t / this.total * 100)
                }, e.prototype.progress = function(e, t) {
                    var n = this.files.indexOf(e);
                    return this.percentages[n] = t
                }, e.prototype.completed = function() {
                    return this.uploaded += 1
                }, e.prototype.isFinished = function() {
                    return this.uploaded === this.files.length
                }, e
            }(),
            B = null,
            z = 0,
            U = !1;
        n.observe(".js-document-dropzone", {
            add: function() {
                document.body.addEventListener("dragstart", I), document.body.addEventListener("dragend", D), document.body.addEventListener("dragenter", E), document.body.addEventListener("dragover", E), document.body.addEventListener("dragleave", q), this.addEventListener("drop", T)
            },
            remove: function() {
                document.body.removeEventListener("dragstart", I), document.body.removeEventListener("dragend", D), document.body.removeEventListener("dragenter", E), document.body.removeEventListener("dragover", E), document.body.removeEventListener("dragleave", q), this.removeEventListener("drop", T)
            }
        }), n.observe(".js-uploadable-container", {
            add: function() {
                0 === z++ && (document.addEventListener("drop", L), document.addEventListener("dragover", _)), this.addEventListener("dragenter", E), this.addEventListener("dragover", E), this.addEventListener("dragleave", C), this.addEventListener("drop", T), this.addEventListener("paste", A), this.addEventListener("change", M);
                var e = this.closest("form");
                null != e && e.addEventListener("reset", H)
            },
            remove: function() {
                0 === --z && (document.removeEventListener("drop", L), document.removeEventListener("dragover", _)), this.removeEventListener("dragenter", E), this.removeEventListener("dragover", E), this.removeEventListener("dragleave", C), this.removeEventListener("drop", T), this.removeEventListener("paste", A), this.removeEventListener("change", M);
                var e = this.closest("form");
                null != e && e.removeEventListener("reset", H)
            }
        })
    }), define("github/user-select-contain", ["delegated-events"], function(e) {
        function t() {
            var e = document.createElement("div");
            e.style.cssText = "-ms-user-select: element; user-select: contain;";
            var t = e;
            return "element" === t.msUserSelect || "contain" === t.userSelect
        }!t() && window.getSelection && e.on("click", ".user-select-contain", function() {
            var e = window.getSelection();
            if (e.rangeCount) {
                var t = e.getRangeAt(0).commonAncestorContainer;
                this.contains(t) || e.selectAllChildren(this)
            }
        })
    }), define("github/biztools/showcase", ["../jquery", "../typecast", "delegated-events", "../form"], function(e, t, n, i) {
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function a() {
            var e = o["default"](document.getElementById("showcase_item_name_with_owner"), HTMLInputElement).value,
                t = o["default"](document.getElementById("submit"), HTMLButtonElement),
                n = o["default"](document.getElementsByClassName("js-submit-health-check")[0], HTMLFormElement),
                r = o["default"](document.getElementById("repo_name"), HTMLInputElement);
            document.getElementById("js-health").innerHTML = "Performing health check...", r.value = e, t.disabled = !1, u = !0, i.submit(n)
        }
        var s = r(e),
            o = r(t),
            u = !1;
        n.on("submit", "#new_showcase_item", function(e) {
            u || e.preventDefault()
        }), s["default"](document).on("ajaxSuccess", ".js-health", function(e, t, n, i) {
            this.innerHTML = i
        }), n.on("focusout", "#showcase_item_name_with_owner", function() {
            a()
        }), n.on("focusin", "#showcase_item_body", function() {
            "hidden" === o["default"](document.getElementById("showcase_item_name_with_owner"), HTMLInputElement).type && a()
        })
    }), define("github/remote-submit", ["exports"], function(e) {
        function t(e) {
            return e.querySelector(".is-submit-button-value")
        }

        function n(e) {
            var n = e.closest("form"),
                i = t(n);
            if (e.name) {
                var r = e.matches("input[type=submit]") ? "Submit" : "",
                    a = e.value || r;
                i || (i = document.createElement("input"), i.type = "hidden", i.classList.add("is-submit-button-value"), n.prepend(i)), i.name = e.name, i.value = a
            } else i && i.remove()
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.findPersistedSubmitButtonValue = t, e.persistSubmitButtonValue = n;
        e.submitSelectors = ["form button[type=submit][data-disable-with]", "form input[type=submit][data-disable-with]", "form[data-remote-submit] button:not([type])", "form[data-remote-submit] button[type=submit]", "form[data-remote-submit] input[type=submit]", "form[data-remote] button:not([type])", "form[data-remote] button[type=submit]", "form[data-remote] input[type=submit]"].join(", ")
    }), define("github/remote", ["./remote-submit", "./jquery"], function(e, t) {
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = n(t);
        i["default"](document).on("submit", "form[data-remote]", function(e) {
            var t = i["default"](this),
                n = {};
            n.context = this;
            var r = t.attr("method");
            r && (n.type = r);
            var a = this.action;
            a && (n.url = a);
            var s = t.serializeArray();
            s && (n.data = s);
            var o = t.attr("data-type");
            return o && (n.dataType = o), i["default"].ajax(n), e.preventDefault(), !1
        }), i["default"](document).on("ajaxSend", "[data-remote]", function(e, t) {
            i["default"](this).data("remote-xhr", t)
        }), i["default"](document).on("ajaxComplete", "[data-remote]", function() {
            var e = i["default"](this);
            "function" == typeof e.removeData && e.removeData("remote-xhr")
        }), i["default"](document).on("click", e.submitSelectors, function() {
            e.persistSubmitButtonValue(this)
        }), i["default"](document).on("ajaxComplete", "form", function() {
            var t = e.findPersistedSubmitButtonValue(this);
            t && t.remove()
        })
    }), define("github-bootstrap", ["./github/accessibility-report", "./github/branches", "./github/bulk-actions", "./github/bust-frames", "./github/collector-api", "./github/delegated-account-recovery", "./github/details", "./github/diffs/progressive", "./github/diffs/prose", "./github/dismiss-notice", "./github/feature-detection", "./github/fixed-offset-fragment-navigation-observer", "./github/gfm", "./github/git-clone-help", "./github/google-analytics-tracking", "./github/hash-change", "./github/topics", "./github/homepage/play-video", "./github/legacy/index", "./github/length-limited-input-with-warning", "./github/link-prefetch-viewed", "./github/menu", "./github/milestone-dragging", "./github/mobile-preference", "./github/pjax", "./github/pjax/capture-keypresses", "./github/pjax/history-navigate", "./github/pjax/link-prefetch", "./github/project-updater", "./github/projects", "./github/proxy-site-reporting", "./github/pulls/change-base", "./github/pulls/commits-range-selection", "./github/pulls/reviews", "./github/releases", "./github/repository-search", "./github/select-menu", "./github/site/fillin-blank", "./github/skip-autofill", "./github/smooth-scroll-anchor", "./github/sticky", "./github/sudo-required", "./github/task-list", "./github/toggler", "./github/touch-events-observer", "./github/tz-cookie", "./github/u2f-login", "./github/u2f-settings", "./github/updatable-content-observer", "./github/uploads", "./github/user-select-contain", "./github/biztools/showcase", "./github/remote"], function() {}), require("github-bootstrap");
