"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEmbedConfiguration = exports.default = void 0;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Dictionary of overrides to customize the handling of certain scripts.
 *
 * Most scripts are designed to execute onload, but the better-documented
 * oEmbed scripts (such as Facebook's) can be manually re-initialized in
 * a predictable manner.
 *
 * The keys of this object are substrings that will be matched against
 * any detected script tag URLs.
 */
var embeds = {
  'connect.facebook.net': {
    isLoaded: function isLoaded() {
      // Ensure FB root element
      if (!document.querySelector('body > #fb-root')) {
        // There may be multiple #fb-root elements in a post's content: remove them
        // all in favor of a new body-level div.
        _toConsumableArray(document.querySelectorAll('#fb-root')).forEach(function (n) {
          return n.parentNode.removeChild(n);
        });

        // Prepare and create the fb-root element. We only need one.
        var fbDiv = document.createElement('div');
        fbDiv.id = 'fb-root';
        document.body.appendChild(fbDiv);
      }

      // Now the root element the script requires exists, check for the script iself.
      return window.FB !== undefined;
    },
    reload: function reload(container) {
      return window.FB.XFBML.parse(container);
    }
  },
  'instagram.com': {
    isLoaded: function isLoaded() {
      return window.instgrm !== undefined;
    },
    reload: function reload() {
      return window.instgrm.Embeds.process();
    }
  },
  'twitter.com': {
    isLoaded: function isLoaded() {
      return window.twttr !== undefined && window.twttr.widgets !== undefined;
    },
    reload: function reload() {
      return window.twttr.widgets.load();
    }
  },
  'trellocdn.com': {
    isLoaded: function isLoaded() {
      return window.TrelloCards !== undefined && window.TrelloCards.load !== undefined;
    },
    reload: function reload() {
      return window.TrelloCards.load(document, {
        compact: false,
        allAnchors: false
      });
    }
  }
};

/**
 * Given a script URL, locate a matching embed profile.
 *
 * @param {Src} src A script URL.
 * @returns {Object} An embed profile, or null.
 */
var getEmbedConfiguration = function getEmbedConfiguration(src) {
  return Object.keys(embeds).reduce(function (matchingEmbed, key) {
    return matchingEmbed || src.indexOf(key) > -1 && embeds[key] || null;
  }, null);
};
exports.getEmbedConfiguration = getEmbedConfiguration;
var _default = embeds;
exports.default = _default;