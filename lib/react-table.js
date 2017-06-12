(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("prop-types"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define("react-table", ["prop-types", "react"], factory);
	else if(typeof exports === 'object')
		exports["react-table"] = factory(require("prop-types"), require("react"));
	else
		root["react-table"] = factory(root["prop-types"], root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(0);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = function (_React$Component) {
    _inherits(Table, _React$Component);

    // Lifecycle Methods

    function Table(p) {
        _classCallCheck(this, Table);

        var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, p));

        _this.state = {
            // Column format: {name: '', field: '', isFilterable: True, isSortable: True, background: '#FFFFF', editable: 'text/dropdown'}
            meta: _this.props.columns,
            data: _this.props.rows
        };

        _this.componentWillReceiveProps = function () {};

        _this.componentDidMount = function () {};

        _this.componentWillUnmount = function () {};

        return _this;
    }

    _createClass(Table, [{
        key: 'render',


        // Data manipulation


        value: function render() {
            return _react2.default.createElement(
                'table',
                { className: this.props.className },
                _react2.default.createElement(TabularDataHeader, null)
            );
        }
    }]);

    return Table;
}(_react2.default.Component);

Table.propTypes = {
    columns: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    rows: _propTypes2.default.array.isRequired,
    onRowChange: _propTypes2.default.func,
    changeTrigger: _propTypes2.default.oneOf(['focus', 'rowFocus']),
    className: _propTypes2.default.string
};
exports.default = Table;

var TabularDataHeader = function (_React$Component2) {
    _inherits(TabularDataHeader, _React$Component2);

    function TabularDataHeader(props, context) {
        _classCallCheck(this, TabularDataHeader);

        var _this2 = _possibleConstructorReturn(this, (TabularDataHeader.__proto__ || Object.getPrototypeOf(TabularDataHeader)).call(this, props, context));

        _this2.render = function () {
            return _react2.default.createElement('thead', null);
        };

        return _this2;
    }

    return TabularDataHeader;
}(_react2.default.Component);

var TabularDataBody = function (_React$Component3) {
    _inherits(TabularDataBody, _React$Component3);

    function TabularDataBody(props, context) {
        _classCallCheck(this, TabularDataBody);

        var _this3 = _possibleConstructorReturn(this, (TabularDataBody.__proto__ || Object.getPrototypeOf(TabularDataBody)).call(this, props, context));

        _this3.render = function () {
            return _react2.default.createElement('tbody', null);
        };

        return _this3;
    }

    return TabularDataBody;
}(_react2.default.Component);

var TabularDataRow = function (_React$Component4) {
    _inherits(TabularDataRow, _React$Component4);

    function TabularDataRow(props, context) {
        _classCallCheck(this, TabularDataRow);

        var _this4 = _possibleConstructorReturn(this, (TabularDataRow.__proto__ || Object.getPrototypeOf(TabularDataRow)).call(this, props, context));

        _this4.render = function () {
            return _react2.default.createElement('tr', null);
        };

        return _this4;
    }

    return TabularDataRow;
}(_react2.default.Component);

var TabularDataCell = function (_React$Component5) {
    _inherits(TabularDataCell, _React$Component5);

    function TabularDataCell(props, context) {
        _classCallCheck(this, TabularDataCell);

        var _this5 = _possibleConstructorReturn(this, (TabularDataCell.__proto__ || Object.getPrototypeOf(TabularDataCell)).call(this, props, context));

        _this5.render = function () {
            return _react2.default.createElement('td', null);
        };

        return _this5;
    }

    return TabularDataCell;
}(_react2.default.Component);

module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=react-table.js.map