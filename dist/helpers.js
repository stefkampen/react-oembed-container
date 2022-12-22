"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectScriptTag = exports.getScripts = exports.INJECTED_SCRIPT = exports.EXTERNAL_SCRIPT = exports.ANY_SCRIPT = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ANY_SCRIPT = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
exports.ANY_SCRIPT = ANY_SCRIPT;
var EXTERNAL_SCRIPT = /<script[^>]+src=(['"])(.*?)\1/i;
exports.EXTERNAL_SCRIPT = EXTERNAL_SCRIPT;
var INJECTED_SCRIPT = /<script[\s\S]*?>[\s\S]*?createElement[\s\S]*?src\s?=\s?(['"])(.*?)\1/i;

/**
 * Find the URI for the external file loaded from a script tag.
 *
 * @param {String} script The string HTML of a <script> tag.
 * @returns {String|null} The URI of the requested external script, otherwise null.
 */
exports.INJECTED_SCRIPT = INJECTED_SCRIPT;
var extractExternalScriptURL = function extractExternalScriptURL(script) {
  var match = script.match(EXTERNAL_SCRIPT);
  // Return null if no match, otherwise return the second capture group.
  return match && match[2];
};

/**
 * Find the URI for a script being injected from inline JS.
 *
 * @param {String} script The string HTML of a <script> tag.
 * @returns {String|null} The URI of a script being injected from inline JS, otherwise null.
 */
var extractInjectedScriptURL = function extractInjectedScriptURL(script) {
  var match = script.match(INJECTED_SCRIPT);
  // Return null if no match, otherwise return the second capture group.
  return match && match[2];
};

/**
 * Match either external or inline-script-injected script tag source URIs.
 *
 * @param {String} script The string HTML of a <script> tag
 * @returns {String|null} The URI of the script file this script tag loads, or null.
 */
var extractScriptURL = function extractScriptURL(script) {
  return extractExternalScriptURL(script) || extractInjectedScriptURL(script);
};

/**
 * Remove duplicate or undefined values from an array of strings.
 *
 * @param {String[]} Array script file URIs.
 */
var uniqueURIs = function uniqueURIs(scripts) {
  return Object.keys(scripts.reduce(function (keys, script) {
    return script ? _objectSpread(_objectSpread({}, keys), {}, _defineProperty({}, script, true)) : keys;
  }, {}));
};

/**
 * Parse a string of HTML and identify the JS files loaded by any contained script tags.
 *
 * @param {String} string String containing HTML markup which may include script tags.
 * @returns {String[]} Array of any script URIs we believe to be loaded in this HTML.
 */
var getScripts = function getScripts(string) {
  var scripts = string.match(/<script[\s\S]*?<\/script>/gi);
  return scripts ? uniqueURIs(scripts.map(extractScriptURL)) : [];
};

/**
 * Create & inject a new <script> tag into the page.
 *
 * @param {String} src A script URL.
 * @returns {HTMLElement} The injected script tag.
 */
exports.getScripts = getScripts;
var injectScriptTag = function injectScriptTag(src) {
  var scriptTag = document.createElement('script');
  // Workaround for HTML-encoded entities in URI (relevant to Facebook)
  scriptTag.src = src.replace('&amp;', '&');
  document.head.appendChild(scriptTag);
  return scriptTag;
};
exports.injectScriptTag = injectScriptTag;