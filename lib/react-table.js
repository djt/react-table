(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("file-saver"), require("prop-types"), require("react"), require("xlsx"));
	else if(typeof define === 'function' && define.amd)
		define("react-table", ["file-saver", "prop-types", "react", "xlsx"], factory);
	else if(typeof exports === 'object')
		exports["react-table"] = factory(require("file-saver"), require("prop-types"), require("react"), require("xlsx"));
	else
		root["react-table"] = factory(root["file-saver"], root["prop-types"], root["react"], root["xlsx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var invariant = __webpack_require__(6);

var hasOwnProperty = Object.prototype.hasOwnProperty;
var splice = Array.prototype.splice;

var toString = Object.prototype.toString
var type = function(obj) {
  return toString.call(obj).slice(8, -1);
}

var assign = Object.assign || /* istanbul ignore next */ function assign(target, source) {
  getAllKeys(source).forEach(function(key) {
    if (hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  });
  return target;
};

var getAllKeys = typeof Object.getOwnPropertySymbols === 'function' ?
  function(obj) { return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj)) } :
  /* istanbul ignore next */ function(obj) { return Object.keys(obj) };

/* istanbul ignore next */
function copy(object) {
  if (Array.isArray(object)) {
    return assign(object.constructor(object.length), object)
  } else if (type(object) === 'Map') {
    return new Map(object)
  } else if (type(object) === 'Set') {
    return new Set(object)
  } else if (object && typeof object === 'object') {
    var prototype = Object.getPrototypeOf(object);
    return assign(Object.create(prototype), object);
  } else {
    return object;
  }
}

function newContext() {
  var commands = assign({}, defaultCommands);
  update.extend = function(directive, fn) {
    commands[directive] = fn;
  };
  update.isEquals = function(a, b) { return a === b; };

  return update;

  function update(object, spec) {
    if (typeof spec === 'function') {
      spec = { $apply: spec };
    }

    if (!(Array.isArray(object) && Array.isArray(spec))) {
      invariant(
        !Array.isArray(spec),
        'update(): You provided an invalid spec to update(). The spec may ' +
        'not contain an array except as the value of $set, $push, $unshift, ' +
        '$splice or any custom command allowing an array value.'
      );
    }

    invariant(
      typeof spec === 'object' && spec !== null,
      'update(): You provided an invalid spec to update(). The spec and ' +
      'every included key path must be plain objects containing one of the ' +
      'following commands: %s.',
      Object.keys(commands).join(', ')
    );

    var nextObject = object;
    var index, key;
    getAllKeys(spec).forEach(function(key) {
      if (hasOwnProperty.call(commands, key)) {
        var objectWasNextObject = object === nextObject;
        nextObject = commands[key](spec[key], nextObject, spec, object);
        if (objectWasNextObject && update.isEquals(nextObject, object)) {
          nextObject = object;
        }
      } else {
        var nextValueForKey =
          type(object) === 'Map'
            ? update(object.get(key), spec[key])
            : update(object[key], spec[key]);
        var nextObjectValue =
          type(nextObject) === 'Map'
              ? nextObject.get(key)
              : nextObject[key];
        if (!update.isEquals(nextValueForKey, nextObjectValue) || typeof nextValueForKey === 'undefined' && !hasOwnProperty.call(object, key)) {
          if (nextObject === object) {
            nextObject = copy(object);
          }
          if (type(nextObject) === 'Map') {
            nextObject.set(key, nextValueForKey);
          } else {
            nextObject[key] = nextValueForKey;
          }
        }
      }
    })
    return nextObject;
  }

}

var defaultCommands = {
  $push: function(value, nextObject, spec) {
    invariantPushAndUnshift(nextObject, spec, '$push');
    return value.length ? nextObject.concat(value) : nextObject;
  },
  $unshift: function(value, nextObject, spec) {
    invariantPushAndUnshift(nextObject, spec, '$unshift');
    return value.length ? value.concat(nextObject) : nextObject;
  },
  $splice: function(value, nextObject, spec, originalObject) {
    invariantSplices(nextObject, spec);
    value.forEach(function(args) {
      invariantSplice(args);
      if (nextObject === originalObject && args.length) nextObject = copy(originalObject);
      splice.apply(nextObject, args);
    });
    return nextObject;
  },
  $set: function(value, nextObject, spec) {
    invariantSet(spec);
    return value;
  },
  $toggle: function(targets, nextObject) {
    invariantSpecArray(targets, '$toggle');
    var nextObjectCopy = targets.length ? copy(nextObject) : nextObject;

    targets.forEach(function(target) {
      nextObjectCopy[target] = !nextObject[target];
    });

    return nextObjectCopy;
  },
  $unset: function(value, nextObject, spec, originalObject) {
    invariantSpecArray(value, '$unset');
    value.forEach(function(key) {
      if (Object.hasOwnProperty.call(nextObject, key)) {
        if (nextObject === originalObject) nextObject = copy(originalObject);
        delete nextObject[key];
      }
    });
    return nextObject;
  },
  $add: function(value, nextObject, spec, originalObject) {
    invariantMapOrSet(nextObject, '$add');
    invariantSpecArray(value, '$add');
    if (type(nextObject) === 'Map') {
      value.forEach(function(pair) {
        var key = pair[0];
        var value = pair[1];
        if (nextObject === originalObject && nextObject.get(key) !== value) nextObject = copy(originalObject);
        nextObject.set(key, value);
      });
    } else {
      value.forEach(function(value) {
        if (nextObject === originalObject && !nextObject.has(value)) nextObject = copy(originalObject);
        nextObject.add(value);
      });
    }
    return nextObject;
  },
  $remove: function(value, nextObject, spec, originalObject) {
    invariantMapOrSet(nextObject, '$remove');
    invariantSpecArray(value, '$remove');
    value.forEach(function(key) {
      if (nextObject === originalObject && nextObject.has(key)) nextObject = copy(originalObject);
      nextObject.delete(key);
    });
    return nextObject;
  },
  $merge: function(value, nextObject, spec, originalObject) {
    invariantMerge(nextObject, value);
    getAllKeys(value).forEach(function(key) {
      if (value[key] !== nextObject[key]) {
        if (nextObject === originalObject) nextObject = copy(originalObject);
        nextObject[key] = value[key];
      }
    });
    return nextObject;
  },
  $apply: function(value, original) {
    invariantApply(value);
    return value(original);
  }
};

var contextForExport = newContext();

module.exports = contextForExport;
module.exports.default = contextForExport;
module.exports.newContext = newContext;

// invariants

function invariantPushAndUnshift(value, spec, command) {
  invariant(
    Array.isArray(value),
    'update(): expected target of %s to be an array; got %s.',
    command,
    value
  );
  invariantSpecArray(spec[command], command)
}

function invariantSpecArray(spec, command) {
  invariant(
    Array.isArray(spec),
    'update(): expected spec of %s to be an array; got %s. ' +
    'Did you forget to wrap your parameter in an array?',
    command,
    spec
  );
}

function invariantSplices(value, spec) {
  invariant(
    Array.isArray(value),
    'Expected $splice target to be an array; got %s',
    value
  );
  invariantSplice(spec['$splice']);
}

function invariantSplice(value) {
  invariant(
    Array.isArray(value),
    'update(): expected spec of $splice to be an array of arrays; got %s. ' +
    'Did you forget to wrap your parameters in an array?',
    value
  );
}

function invariantApply(fn) {
  invariant(
    typeof fn === 'function',
    'update(): expected spec of $apply to be a function; got %s.',
    fn
  );
}

function invariantSet(spec) {
  invariant(
    Object.keys(spec).length === 1,
    'Cannot have more than one key in an object with $set'
  );
}

function invariantMerge(target, specValue) {
  invariant(
    specValue && typeof specValue === 'object',
    'update(): $merge expects a spec of type \'object\'; got %s',
    specValue
  );
  invariant(
    target && typeof target === 'object',
    'update(): $merge expects a target of type \'object\'; got %s',
    target
  );
}

function invariantMapOrSet(target, command) {
  var typeOfTarget = type(target);
  invariant(
    typeOfTarget === 'Map' || typeOfTarget === 'Set',
    'update(): %s expects a target of type Set or Map; got %s',
    command,
    typeOfTarget
  );
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _xlsx = __webpack_require__(4);

var _xlsx2 = _interopRequireDefault(_xlsx);

var _fileSaver = __webpack_require__(1);

var _fileSaver2 = _interopRequireDefault(_fileSaver);

var _immutabilityHelper = __webpack_require__(0);

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = function (_React$Component) {
    _inherits(Table, _React$Component);

    // Lifecycle Methods

    function Table(p) {
        _classCallCheck(this, Table);

        var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, p));

        _initialiseProps.call(_this);

        return _this;
    }

    _createClass(Table, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'smpl-table' },
                this.state.rows.length && !this.state.collapsed && this.props.excelExport ? _react2.default.createElement(
                    'p',
                    { className: 'excel-export' },
                    _react2.default.createElement(
                        'a',
                        { href: '#', onClick: this.toExcel },
                        'Export to excel'
                    )
                ) : null,
                _react2.default.createElement(
                    'table',
                    { className: this.props.className },
                    this.state.collapsed ? _react2.default.createElement(
                        'thead',
                        { className: 'pointer', onClick: function onClick(e) {
                                return _this2.setState({ collapsed: false });
                            } },
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'th',
                                null,
                                this.state.collapsed
                            )
                        )
                    ) : null,
                    !this.state.collapsed ? _react2.default.createElement(TableHeader, { selected: this.state.selected, applyGlobal: this.applyGlobal, isSelectable: this.props.isMassEditable || this.props.isSelectable, isFilterable: this.props.isFilterable, isMassEditable: this.props.isMassEditable, sort: this.sort, columns: this.state.columns, filter: this.filter }) : null,
                    !this.state.collapsed && _react2.default.createElement(
                        'tbody',
                        null,
                        this.state.rows && this.applyFilters().map(function (r, i) {
                            return true ? _react2.default.createElement(TableRow, { key: 'row-' + (r[_this2.state.primaryKey] || i),
                                id: r[_this2.state.primaryKey] || i,
                                index: i,
                                columns: _this2.state.columns,
                                row: r,
                                onChange: _this2.change,
                                onRowUpdate: _this2.onRowUpdate,
                                isSelectable: _this2.props.isMassEditable || _this2.props.isSelectable,
                                selectClass: _this2.props.rowSelectClass,
                                hasRowUpdate: !!_this2.props.onRowUpdate,
                                updateOnBlur: _this2.props.updateOnBlur }) : null;
                        }),
                        !this.state.rows.length && _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'td',
                                { className: 'align-center', colSpan: this.props.columns.length },
                                'No rows could be found'
                            )
                        )
                    ),
                    !this.state.collapsed && _react2.default.createElement(TableFooter, null)
                ),
                this.props.onSubmit ? _react2.default.createElement(
                    'button',
                    { type: 'button', disabled: this.state.submitDisabled, onClick: function onClick(e) {
                            return _this2.props.onSubmit(_this2.state.rows) && _this2.props.disableOnSubmit && _this2.setState({ submitDisabled: true });
                        } },
                    this.props.buttonSubmitText || 'Submit',
                    ' ',
                    this.props.submitDisabled && _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
                ) : null
            );
        }
    }]);

    return Table;
}(_react2.default.Component);

Table.propTypes = {
    columns: _propTypes2.default.arrayOf(_propTypes2.default.object), //.isRequired,
    rows: _propTypes2.default.array.isRequired,
    onRowChange: _propTypes2.default.func,
    onSubmit: _propTypes2.default.func,
    className: _propTypes2.default.string,
    excelExport: _propTypes2.default.any,
    collapsed: _propTypes2.default.any,
    isFilterable: _propTypes2.default.bool,
    isMassEditable: _propTypes2.default.bool,
    updateOnBlur: _propTypes2.default.bool,
    primary: _propTypes2.default.string
};

Table._s2ab = function (s) {
    var view = new Uint8Array(new ArrayBuffer(s.length));
    for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }return view;
};

var _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.state = {
        // Column format: {name: '', field: '', isFilterable: True, isSortable: True, background: '#FFFFF', editable: 'text/dropdown'}
        columns: this.props.columns,
        rows: this.props.rows,
        sortColumn: null,
        collapsed: this.props.collapsed || false,
        selected: 0,
        primary: this.props.primary
    };

    this.componentWillReceiveProps = function (p) {
        var columns = p.columns;
        if (!columns && p.rows) columns = Object.keys(p.rows[0]).map(function (c) {
            return { name: c, field: c };
        });
        var pk = p.primary || columns.find(function (c) {
            return c.isPrimary;
        });
        _this3.setState({
            columns: columns,
            rows: p.rows,
            primaryKey: pk ? pk.field || pk : null
        });
    };

    this.sort = function (field, e) {
        e.preventDefault();
        var rows = _this3.state.rows;
        if (field == _this3.state.sortColumn) {
            // Sorting on currently sorted column
            rows = rows.reverse();
        } else if (field instanceof Array) {
            // Sorting on deeply nested column
            rows = rows.sort(function (a, b) {
                var av = field.reduce(function (p, c) {
                    return p[c];
                }, a);
                var bv = field.reduce(function (p, c) {
                    return p[c];
                }, b);
                return av > bv ? 1 : bv > av ? -1 : 0;
            });
        } else {
            // Sorting on normal column
            rows = rows.sort(function (a, b) {
                return (a[field] && a[field] instanceof String && a[field].replace(/-/g, '') || a[field]) > (b[field] && b[field] instanceof String && b[field].replace(/-/g, '') || b[field]) ? 1 : (b[field] && b[field] instanceof String && b[field].replace(/-/g, '') || b[field]) > (a[field] && a[field] instanceof String && a[field].replace(/-/g, '') || a[field]) ? -1 : 0;
            });
        }
        _this3.setState({ rows: rows, sortColumn: field });
        e.preventDefault();
    };

    this.change = function (index, row) {
        var rows = _this3.state.rows;
        var sel = _this3.state.selected;
        console.log('Changing index', index);
        rows[index] = Object.assign(rows[index], row);
        rows[index]['delta'] = Object.assign({}, rows[index]['delta'], row);
        if (rows[index]['delta'].selected) delete rows[index]['delta']['selected'];
        if (row.selected !== undefined) {
            sel += row.selected ? 1 : -1;
        }
        var x = Date.now();
        _this3.setState({ rows: (0, _immutabilityHelper2.default)(_this3.state.rows, { index: { $set: rows[index] } }), selected: sel }, function () {
            return console.log('Updated index', (Date.now() - x) / 1000);
        });
        console.log('Edited Row', index, rows[index]);
        // if (this.props.onRowChange) this.props.onRowChange(row)
    };

    this.onRowUpdate = function (r) {
        if (!r.delta || !_this3.props.onRowUpdate) return;
        _this3.props.onRowUpdate(r);
    };

    this.toExcel = function (e) {
        var rows = _this3.state.rows.map(function (r) {
            return _this3.state.columns.reduce(function (p, c) {
                // if (c.excelToRaw) {
                //     p[c.name] = r[c.field]
                // } else
                if (c.ignore) {} else if (c.field instanceof Array) {
                    p[c.name] = c.field.reduce(function (p, x) {
                        return p[x];
                    }, r);
                } else if (c.field instanceof Function) {
                    p[c.name] = c.field(r);
                } else {
                    p[c.name] = r[c.field]; // (c.formatters || []).reduce((p, x) => x(r, true), r[c.field])
                }
                return p;
            }, {});
        });
        var ws = _xlsx2.default.utils.json_to_sheet(rows);
        var wb = _xlsx2.default.utils.book_new();
        _xlsx2.default.utils.book_append_sheet(wb, ws);
        var wbout = _xlsx2.default.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

        _fileSaver2.default.saveAs(new Blob([Table._s2ab(wbout)], { type: "application/octet-stream" }), _this3.props.excelExport || 'Untitled Report.xlsx');

        e.preventDefault();
    };

    this.filter = function (i, v) {
        var c = _this3.state.columns;
        c[i].filter = v;
        _this3.setState({ columns: c });
    };

    this.applyFilters = function (_) {
        var f = _this3.state.columns.filter(function (c) {
            return c.filter;
        });
        if (!f.length) return _this3.state.rows;

        return _this3.state.rows.filter(function (r) {
            return f.every(function (x) {
                return String(r[x.field]).toLowerCase().indexOf(x.filter.toLowerCase()) >= 0;
            });
        });
    };

    this.matchesFilters = function (r) {
        var f = _this3.state.columns.filter(function (c) {
            return c.filter;
        });
        return f.length && f.every(function (x) {
            return String(r[x.field]).indexOf(x.filter) >= 0;
        }) || true;
    };

    this.applyGlobal = function (v) {
        _this3.applyFilters().map(function (r, i) {
            return (v.selected !== undefined || r.selected) && _this3.change(i, v);
        });
    };
};

exports.default = Table;

var TableHeader = function (_React$Component2) {
    _inherits(TableHeader, _React$Component2);

    function TableHeader(p) {
        _classCallCheck(this, TableHeader);

        var _this4 = _possibleConstructorReturn(this, (TableHeader.__proto__ || Object.getPrototypeOf(TableHeader)).call(this, p));

        _this4.state = {
            edits: {}
        };
        _this4._filterTimer = null;

        _this4.applyFilter = function (f, v) {
            clearTimeout(_this4._filterTimer);
            _this4._filterTimer = setTimeout(_this4.props.filter(f, v), 200);
        };

        _this4.queueEdit = function (f, v) {
            var e = _this4.state.edits;
            e[f] = v;
            _this4.setState({ edits: e });
        };

        _this4.applyEdits = function () {
            _this4.props.applyGlobal(_this4.state.edits);
        };

        return _this4;
    }

    _createClass(TableHeader, [{
        key: 'render',
        value: function render() {
            var _this5 = this;

            if (!this.props.columns) return null;

            return _react2.default.createElement(
                'thead',
                null,
                this.props.isMassEditable && _react2.default.createElement(
                    'tr',
                    { className: 'smpl-table-edit' },
                    this.props.isSelectable && _react2.default.createElement(
                        'td',
                        { className: 'align-center' },
                        _react2.default.createElement(
                            'button',
                            { className: 'button-success', disabled: !this.props.selected || Object.keys(this.state.edits).length == 0, type: 'button', onClick: this.applyEdits },
                            _react2.default.createElement('i', { className: 'fa fa-check' })
                        )
                    ),
                    this.props.columns.map(function (c, i) {
                        return _react2.default.createElement(TableChangeCell, _extends({ key: 'change-' + c.name, index: i }, c, { queueEdit: _this5.queueEdit }));
                    })
                ),
                _react2.default.createElement(
                    'tr',
                    null,
                    this.props.isSelectable && _react2.default.createElement(
                        'th',
                        { className: 'align-center', key: 'selected' },
                        _react2.default.createElement('input', { type: 'checkbox', defaultValue: false, onChange: function onChange(e) {
                                return _this5.props.applyGlobal({ selected: e.target.checked });
                            } })
                    ),
                    this.props.columns.map(function (c, i) {
                        return _react2.default.createElement(TableHeaderCell, _extends({ key: 'header-' + c.name, index: i }, c, { sort: _this5.props.sort, applyFilter: _this5.applyFilter, applyGlobal: _this5.props.applyGlobal }));
                    })
                ),
                this.props.isFilterable && _react2.default.createElement(
                    'tr',
                    { className: 'smpl-table-filter' },
                    this.props.isSelectable && _react2.default.createElement(
                        'td',
                        null,
                        '\xA0'
                    ),
                    this.props.columns.map(function (c, i) {
                        return c.isFilterable == false ? _react2.default.createElement(
                            'td',
                            { style: c.style, key: 'filter-' + c.field },
                            '\xA0'
                        ) : _react2.default.createElement(TableFilterCell, _extends({ key: 'filter-' + c.field, index: i }, c, { sort: _this5.props.sort, applyFilter: _this5.applyFilter }));
                    })
                )
            );
        }
    }]);

    return TableHeader;
}(_react2.default.Component);

var TableHeaderCell = function (_React$Component3) {
    _inherits(TableHeaderCell, _React$Component3);

    function TableHeaderCell(p) {
        _classCallCheck(this, TableHeaderCell);

        var _this6 = _possibleConstructorReturn(this, (TableHeaderCell.__proto__ || Object.getPrototypeOf(TableHeaderCell)).call(this, p));

        _this6.state = {
            filter: false
        };
        return _this6;
    }

    _createClass(TableHeaderCell, [{
        key: 'render',
        value: function render() {
            var _this7 = this;

            return _react2.default.createElement(
                'th',
                { style: this.props.style },
                !this.props.name && this.props.checkbox ? _react2.default.createElement('input', { type: 'checkbox', defaultValue: false, onChange: function onChange(e) {
                        return _this7.props.applyGlobal(_defineProperty({}, _this7.props.field, e.target.checked));
                    } }) : null,
                !this.props.checkbox && this.props.isSortable !== false ? _react2.default.createElement(
                    'a',
                    { href: '#', onClick: function onClick(e) {
                            return _this7.props.sort(_this7.props.field, e);
                        } },
                    this.props.name
                ) : this.props.name
            );
        }
    }]);

    return TableHeaderCell;
}(_react2.default.Component);

var TableFilterCell = function TableFilterCell(p) {
    return _react2.default.createElement(
        'td',
        { style: p.style },
        p.checkbox && _react2.default.createElement('input', { type: 'checkbox', name: p.field, onChange: function onChange(e) {
                return p.applyFilter(p.field, e.target.checked);
            } }),
        p.choices && _react2.default.createElement(
            'select',
            { className: 'u-full-width', onChange: function onChange(e) {
                    return p.applyFilter(p.field, e.target.value);
                } },
            _react2.default.createElement('option', null),
            p.choices.map(function (c, i) {
                return _react2.default.createElement(
                    'option',
                    { key: 'change-' + p.name + '-' + i, value: c.value },
                    c.name
                );
            })
        ),
        !p.choices && !p.checkbox && _react2.default.createElement('input', { className: 'smpl-filter', type: 'text', name: p.field, onChange: function onChange(e) {
                return p.applyFilter(p.index, e.target.value);
            } })
    );
};

var TableChangeCell = function TableChangeCell(p) {
    return _react2.default.createElement(
        'td',
        { style: p.style },
        p.checkbox && _react2.default.createElement('input', { type: 'checkbox', name: p.field, onChange: function onChange(e) {
                return p.queueEdit(p.field, e.target.checked);
            } }),
        p.choices && _react2.default.createElement(
            'select',
            { className: 'u-full-width', onChange: function onChange(e) {
                    return p.queueEdit(p.field, e.target.value);
                } },
            _react2.default.createElement('option', null),
            p.choices.map(function (c, i) {
                return _react2.default.createElement(
                    'option',
                    { key: 'change-' + p.name + '-' + i, value: c.value },
                    c.name
                );
            })
        ),
        !p.checkbox && !p.choices && p.isEditable && _react2.default.createElement('input', { type: 'text', name: p.field, onChange: function onChange(e) {
                return p.queueEdit(p.field, e.target.value);
            } })
    );
};

var TableRow = function (_React$Component4) {
    _inherits(TableRow, _React$Component4);

    function TableRow(p) {
        _classCallCheck(this, TableRow);

        var _this8 = _possibleConstructorReturn(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, p));

        _initialiseProps2.call(_this8);

        _this8.state = p.row || null;
        return _this8;
    }

    _createClass(TableRow, [{
        key: 'render',
        value: function render() {
            var _this9 = this;

            if (!this.props.row || !this.props.columns) return null;

            return _react2.default.createElement(
                'tr',
                { className: this.state.selectedVisual && this.props.selectClass || '', onClick: function onClick(e) {
                        return e.target.nodeName != 'INPUT' && _this9.setState({ selectedVisual: !!!_this9.state.selectedVisual });
                    } },
                this.props.isSelectable && _react2.default.createElement(
                    'td',
                    { className: 'align-center' },
                    _react2.default.createElement('input', { type: 'checkbox', checked: this.state.selected, onChange: function onChange(e) {
                            return _this9.props.onChange(_this9.props.index, { selected: e.target.checked });
                        } })
                ),
                this.props.columns.map(function (c) {

                    var v = c.field instanceof Array ? c.field.reduce(function (p, c) {
                        return p[c];
                    }, _this9.state) : _this9.state[c.field];

                    v = (c.formatters || []).reduce(function (p, x) {
                        return x(_this9.props.row);
                    }, v);
                    var t = c.alt && c.alt(_this9.props.row);
                    return c.isEditable ? c.choices ? _react2.default.createElement(EditableTableCellDropdown, { updateOnBlur: _this9.props.updateOnBlur, key: _this9.props.id + '-' + c.field, id: _this9.props.id + '-' + c.field, column: c, onChange: _this9.onChange, data: v }) : c.checkbox ? _react2.default.createElement(EditableTableCellCheckbox, { updateOnBlur: _this9.props.updateOnBlur, key: _this9.props.id + '-' + c.field, id: _this9.props.id + '-' + c.field, column: c, onChange: _this9.onChange, data: v }) : _react2.default.createElement(EditableTableCellText, { updateOnBlur: _this9.props.updateOnBlur, key: _this9.props.id + '-' + c.field, id: _this9.props.id + '-' + c.field, column: c, data: v, onChange: _this9.onChange, title: t }) : _react2.default.createElement(TableCell, { updateOnBlur: _this9.props.updateOnBlur, key: _this9.props.id + '-' + c.field, id: _this9.props.id + '-' + c.field, column: c, data: v, row: _this9.props.row, title: t });
                }),
                this.props.hasRowUpdate && this.props.row.delta ? _react2.default.createElement(
                    'td',
                    { className: 'vertical-align-middle', style: { borderBottom: 0 } },
                    _react2.default.createElement(
                        'button',
                        { type: 'button', className: 'button-success margin-bottom-none' },
                        '\u2714'
                    )
                ) : null
            );
        }
    }]);

    return TableRow;
}(_react2.default.Component);

var _initialiseProps2 = function _initialiseProps2() {
    var _this15 = this;

    this.shouldComponentUpdate = function (p) {
        return false;
    };

    this.componentWillReceiveProps = function (p) {

        if (p.row && p.row.delta && p.index == _this15.props.index) {
            _this15.setState(p.row);
            _this15.forceUpdate();
        }
    };

    this.onRowUpdate = function (e) {

        // if (!this.state._changes) return
        // this.props.onChange(this.props.index, this.state._changes)
        // this.props.onRowUpdate(this.props.row)
    };

    this.onChange = function (column, value) {
        // let changes = this.state._changes || []
        // value = (column.field.parsers || []).reduce((p, c) => c(p), value)
        // changes[column.field] = value
        // this.setState({ [column.field]: value, _changes: changes })
        _this15.props.onChange(_this15.props.index, _defineProperty({}, column.field, value));
    };
};

var TableCell = function (_React$Component5) {
    _inherits(TableCell, _React$Component5);

    function TableCell(p) {
        _classCallCheck(this, TableCell);

        var _this10 = _possibleConstructorReturn(this, (TableCell.__proto__ || Object.getPrototypeOf(TableCell)).call(this, p));

        _this10.render = function () {
            return _react2.default.createElement(
                'td',
                { style: _this10.props.column.style, title: _this10.props.title || '' },
                _this10.props.data
            );
        };

        return _this10;
    }

    return TableCell;
}(_react2.default.Component);

var EditableTableCellText = function (_React$Component6) {
    _inherits(EditableTableCellText, _React$Component6);

    function EditableTableCellText(p) {
        _classCallCheck(this, EditableTableCellText);

        var _this11 = _possibleConstructorReturn(this, (EditableTableCellText.__proto__ || Object.getPrototypeOf(EditableTableCellText)).call(this, p));

        _initialiseProps3.call(_this11);

        return _this11;
    }

    // _changeTimer = null
    // applyChange = (f, v) => {
    //     clearTimeout(this._filterTimer)
    //     this._filterTimer = setTimeout(this.props.filter(f, v), 200)
    // }

    return EditableTableCellText;
}(_react2.default.Component);

var _initialiseProps3 = function _initialiseProps3() {
    var _this16 = this;

    this.state = {
        value: this.props.data
    };

    this.onLocalChange = function (e) {
        console.log('local change');
        _this16.setState({ value: e.target.value });
    };

    this.onChange = function (e) {
        console.log('global change');
        // this.setState({ value: e.target.value })
        _this16.props.onChange(_this16.props.column, e.target.value);
    };

    this.componentWillReceiveProps = function (p) {
        if (_this16.props.data != p.data) _this16.setState({ value: p.data });
    };

    this.render = function () {
        return _react2.default.createElement(
            'td',
            { style: _this16.props.column.style, title: _this16.props.title },
            _react2.default.createElement('input', { className: 'u-full-width', type: 'text', title: _this16.props.title, value: _this16.state.value, onChange: _this16.props.updateOnBlur ? _this16.onLocalChange : _this16.onChange, onBlur: _this16.props.updateOnBlur ? _this16.onChange : null })
        );
    };
};

var EditableTableCellDropdown = function (_React$Component7) {
    _inherits(EditableTableCellDropdown, _React$Component7);

    function EditableTableCellDropdown(p) {
        _classCallCheck(this, EditableTableCellDropdown);

        var _this12 = _possibleConstructorReturn(this, (EditableTableCellDropdown.__proto__ || Object.getPrototypeOf(EditableTableCellDropdown)).call(this, p));

        _initialiseProps4.call(_this12);

        return _this12;
    }

    return EditableTableCellDropdown;
}(_react2.default.Component);

var _initialiseProps4 = function _initialiseProps4() {
    var _this17 = this;

    this.state = {
        value: this.props.data
    };

    this.onLocalChange = function (e) {
        console.log('local change');
        _this17.setState({ value: e.target.value });
    };

    this.onChange = function (e) {
        console.log('global change');
        _this17.props.onChange(_this17.props.column, e.target.value);
    };

    this.componentWillReceiveProps = function (p) {
        if (_this17.props.data != p.data) _this17.setState({ value: p.data });
    };

    this.render = function () {
        return _react2.default.createElement(
            'td',
            { style: _this17.props.column.style },
            _react2.default.createElement(
                'select',
                { className: 'u-full-width', value: _this17.state.value, onChange: _this17.props.updateOnBlur ? _this17.onLocalChange : _this17.onChange, onBlur: _this17.props.updateOnBlur ? _this17.onChange : null },
                _this17.props.column.choices.map(function (c) {
                    return _react2.default.createElement(
                        'option',
                        { key: _this17.props.id + '-' + c.value, value: c.value },
                        c.name
                    );
                })
            )
        );
    };
};

var EditableTableCellCheckbox = function (_React$Component8) {
    _inherits(EditableTableCellCheckbox, _React$Component8);

    function EditableTableCellCheckbox(p) {
        _classCallCheck(this, EditableTableCellCheckbox);

        var _this13 = _possibleConstructorReturn(this, (EditableTableCellCheckbox.__proto__ || Object.getPrototypeOf(EditableTableCellCheckbox)).call(this, p));

        _initialiseProps5.call(_this13);

        return _this13;
    }

    return EditableTableCellCheckbox;
}(_react2.default.Component);

var _initialiseProps5 = function _initialiseProps5() {
    var _this18 = this;

    this.state = {
        value: this.props.data
    };

    this.componentWillReceiveProps = function (p) {
        if (_this18.props.data != p.data) _this18.setState({ value: p.data });
    };

    this.onLocalChange = function (e) {
        console.log('local change');
        _this18.setState({ value: e.target.checked });
    };

    this.onChange = function (e) {
        console.log('global change');
        _this18.props.onChange(_this18.props.column, e.target.checked);
    };

    this.render = function () {
        return _react2.default.createElement(
            'td',
            { style: _this18.props.column.style },
            _react2.default.createElement('input', { type: 'checkbox', checked: _this18.state.value /*onChange={this.onChange}*/, onChange: _this18.props.updateOnBlur ? _this18.onLocalChange : _this18.onChange, onBlur: _this18.props.updateOnBlur ? _this18.onChange : null })
        );
    };
};

var TableFooter = function (_React$Component9) {
    _inherits(TableFooter, _React$Component9);

    function TableFooter(p) {
        _classCallCheck(this, TableFooter);

        var _this14 = _possibleConstructorReturn(this, (TableFooter.__proto__ || Object.getPrototypeOf(TableFooter)).call(this, p));

        _this14.render = function () {
            return _react2.default.createElement(
                'tfoot',
                null,
                _react2.default.createElement('tr', null)
            );
        };

        return _this14;
    }

    return TableFooter;
}(_react2.default.Component);

module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);
});
//# sourceMappingURL=react-table.js.map