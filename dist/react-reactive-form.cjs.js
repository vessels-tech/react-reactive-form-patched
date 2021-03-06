'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Observable = function () {
  function Observable() {
    classCallCheck(this, Observable);

    this.observers = [];
  }

  createClass(Observable, [{
    key: "subscribe",
    value: function subscribe(fn) {
      this.observers.push(fn);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(fn) {
      if (fn) {
        this.observers = this.observers.filter(function (item) {
          if (item !== fn) {
            return item;
          }
          return null;
        });
      } else {
        this.observers = [];
      }
    }
  }, {
    key: "next",
    value: function next(o, thisObj) {
      var scope = thisObj || window;
      this.observers.forEach(function (item) {
        item.call(scope, o);
      });
    }
  }]);
  return Observable;
}();

/** Converts a promise into Observable
 * @param {Promise} r
 * @param {(value: any) => any} cb
 * @returns {Observable}
 */
function fromPromise(r, cb) {
  var observable = new Observable();
  r.then(function (value) {
    var mappedValue = function mappedValue(value) {
      return cb ? cb(value) : value;
    };
    observable.next(mappedValue(value));
  }, function (error) {
    observable.next(error);
  }).then(null, function (error) {
    throw error;
  });
  return observable;
}
/**
 * Checks if an object is a Promise
 * @param {Observable} obj
 * @returns {boolean}
 */
function isPromise(obj) {
  return !!obj && typeof obj.then === 'function';
}
/**
 * Checks if an object is a Function
 * @param {any} obj
 * @returns {boolean}
 */
function isFunction(obj) {
  return 'function' === typeof obj;
}
/**
 * Checks if an object is Observable
 * @param {Observable} obj
 * @returns {boolean}
 */
function isObservable(obj) {
  return !!obj && typeof obj.subscribe === 'function';
}
/**
 * Converts an object into Observable
 * @param {any} r
 * @returns {Observable}
 */
function toObservable(r) {
  var obs = isPromise(r) ? fromPromise(r) : r;
  if (!isObservable(obs)) {
    throw new Error('Expected validator to return Promise or Observable.');
  }
  return obs;
}
var isReactNative = function isReactNative() {
  return typeof window !== 'undefined' && window.navigator && window.navigator.product && window.navigator.product === 'ReactNative';
};
var isEvent = function isEvent(candidate) {
  return !!(candidate && candidate.stopPropagation && candidate.preventDefault);
};

// Common props
var propsToBeMap = {
  value: 'value',
  touched: 'touched',
  untouched: 'untouched',
  disabled: 'disabled',
  enabled: 'enabled',
  invalid: 'invalid',
  valid: 'valid',
  pristine: 'pristine',
  dirty: 'dirty',
  errors: 'errors',
  hasError: 'hasError',
  getError: 'getError',
  status: 'status',
  pending: 'pending',
  pendingValue: '_pendingValue'
};
var controlsToBeMap = {
  ReactNative: {
    switch: {
      value: 'value',
      onValueChange: 'onChange',
      onBlur: 'onBlur',
      onFocus: 'onFocus',
      disabled: 'disabled'
    },
    default: {
      value: 'value',
      onChange: 'onChange',
      onBlur: 'onBlur',
      onFocus: 'onFocus',
      editable: 'enabled'
    }
  },
  default: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur',
    onFocus: 'onFocus',
    disabled: 'disabled'
  }
};
var getAbsoluteValue = function getAbsoluteValue(value) {
  return value === undefined || value === null ? '' : value;
};

var getInputControls = function getInputControls(inputType) {
  return isReactNative() ? controlsToBeMap.ReactNative[inputType] || controlsToBeMap.ReactNative.default : controlsToBeMap.default;
};

function getHandler(inputType, value, control) {
  var controlObject = {};
  var inputControls = getInputControls(inputType);
  Object.keys(inputControls).forEach(function (key) {
    var controlProperty = null;
    if (key === 'value') {
      if (control.updateOn !== 'change') {
        controlProperty = getAbsoluteValue(control._pendingValue);
      } else {
        controlProperty = getAbsoluteValue(control.value);
      }
    } else {
      controlProperty = control[inputControls[key]];
    }
    controlObject[key] = controlProperty;
  });
  var mappedObject = controlObject;
  switch (inputType) {
    case 'checkbox':
      mappedObject['checked'] = !!mappedObject.value;
      mappedObject['type'] = inputType;
      break;
    case 'radio':
      mappedObject['checked'] = mappedObject.value === value;
      mappedObject.value = value;
      mappedObject['type'] = inputType;
      break;
    default:
  }
  return mappedObject;
}
/**
 * Display warning messages
 * @param {condition} any
 * @param {message} string
 * @returns {void}
 */
function warning(condition, message) {
  if (process.env.NODE_ENV !== 'production') {
    if (!condition) {
      console.error('Warning: ' + message);
    }
  }
}
/**
 * Generates the unique key for react elements
 * @param {*} pre
 */
var generateKey = function generateKey(pre) {
  return pre + '_' + new Date().getTime();
};

var FIELD_PROPS = ['strict', 'render', 'name', 'index', 'control', 'formState', 'options', 'parent', 'meta'];

var mapConfigToFieldProps = function mapConfigToFieldProps(config) {
  var props = {};
  if (config) {
    Object.keys(config).forEach(function (configKey) {
      if (FIELD_PROPS.indexOf(configKey) > -1) {
        props[configKey] = config[configKey];
      }
    });
  }
  return props;
};

function isEmptyInputValue(value) {
  return value == null || value.length === 0;
}
function isPresent(o) {
  return o != null;
}
function _mergeErrors(arrayOfErrors) {
  var res = arrayOfErrors.reduce(function (res, errors) {
    return errors != null ? Object.assign({}, res, errors) : res;
  }, {});
  return Object.keys(res).length === 0 ? null : res;
}
function _executeValidators(control, validators) {
  return validators.map(function (v) {
    return v(control);
  });
}
function _executeAsyncValidators(control, validators) {
  return validators.map(function (v) {
    return v(control);
  });
}

var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var Validators = function () {
  function Validators() {
    classCallCheck(this, Validators);
  }

  createClass(Validators, null, [{
    key: 'min',

    /**
     * Validator that requires controls to have a value greater than a number.
     */
    value: function min(_min) {
      return function (control) {
        if (isEmptyInputValue(control.value) || isEmptyInputValue(_min)) {
          return null; // don't validate empty values to allow optional controls
        }
        var parsedValue = parseFloat(control.value);
        return !isNaN(parsedValue) && parsedValue < _min ? { min: { min: _min, actual: parsedValue } } : null;
      };
    }

    /**
     * Validator that requires controls to have a value less than a number.
     */

  }, {
    key: 'max',
    value: function max(_max) {
      return function (control) {
        if (isEmptyInputValue(control.value) || isEmptyInputValue(_max)) {
          return null; // don't validate empty values to allow optional controls
        }
        var parsedValue = parseFloat(control.value);
        return !isNaN(parsedValue) && parsedValue > _max ? { max: { max: _max, actual: parsedValue } } : null;
      };
    }

    /**
     * Validator that requires controls to have a non-empty value.
     */

  }, {
    key: 'required',
    value: function required(control) {
      return isEmptyInputValue(control.value) ? { required: true } : null;
    }

    /**
     * Validator that requires control value to be true.
     */

  }, {
    key: 'requiredTrue',
    value: function requiredTrue(control) {
      return control.value === true ? null : { required: true };
    }

    /**
     * Validator that performs email validation.
     */

  }, {
    key: 'email',
    value: function email(control) {
      if (isEmptyInputValue(control.value)) {
        return null;
      }
      return EMAIL_REGEXP.test(control.value) ? null : { email: true };
    }

    /**
     * Validator that requires controls to have a value of a minimum length.
     */

  }, {
    key: 'minLength',
    value: function minLength(_minLength) {
      return function (control) {
        if (isEmptyInputValue(control.value)) {
          return null; // don't validate empty values to allow optional controls
        }
        var length = control.value ? control.value.length : 0;
        return length < _minLength ? { minLength: { requiredLength: _minLength, actualLength: length } } : null;
      };
    }

    /**
     * Validator that requires controls to have a value of a maximum length.
     */

  }, {
    key: 'maxLength',
    value: function maxLength(_maxLength) {
      return function (control) {
        var length = control.value ? control.value.length : 0;
        return length > _maxLength ? { maxLength: { requiredLength: _maxLength, actualLength: length } } : null;
      };
    }
    /**
     * Validator that requires a control to match a regex to its value.
     */

  }, {
    key: 'pattern',
    value: function pattern(_pattern) {
      if (!_pattern) return null;
      var regex = void 0;
      var regexStr = void 0;
      if (typeof _pattern === 'string') {
        regexStr = '^' + _pattern + '$';
        regex = new RegExp(regexStr);
      } else {
        regexStr = _pattern.toString();
        regex = _pattern;
      }
      return function (control) {
        if (isEmptyInputValue(control.value)) {
          return null; // don't validate empty values to allow optional controls
        }
        return regex.test(control.value) ? null : { pattern: { requiredPattern: regexStr, actualValue: control.value } };
      };
    }
    /**
     * Compose multiple validators into a single function that returns the union
     * of the individual error maps.
     * @param {(Function|null|undefined)[]|null} validators
     * @return {Function|null}
     */

  }, {
    key: 'compose',
    value: function compose(validators) {
      if (!validators) return null;
      var presentValidators = validators.filter(isPresent);
      if (presentValidators.length === 0) return null;
      return function (control) {
        return _mergeErrors(_executeValidators(control, presentValidators));
      };
    }
    /**
     * Compose multiple async validators into a single function that returns the union
     * of the individual error maps.
     * @param {(Function|null|undefined)[]|null} validators
     * @return {Function|null}
     */

  }, {
    key: 'composeAsync',
    value: function composeAsync(validators) {
      if (!validators) return null;
      var presentValidators = validators.filter(isPresent);
      if (presentValidators.length === 0) return null;
      return function (control) {
        var observables = _executeAsyncValidators(control, presentValidators);
        return fromPromise(Promise.all(observables), _mergeErrors);
      };
    }
  }]);
  return Validators;
}();

/**
 * Indicates that a FormControl is valid, i.e. that no errors exist in the input value.
 */
var VALID = "VALID";

/**
 * Indicates that a FormControl is invalid, i.e. that an error exists in the input value.
 */
var INVALID = "INVALID";

/**
 * Indicates that a FormControl is pending, i.e. that async validation is occurring and
 * errors are not yet available for the input value.
 */
var PENDING = "PENDING";

/**
 * Indicates that a FormControl is disabled, i.e. that the control is exempt from ancestor
 * calculations of validity or value.
 */
var DISABLED = "DISABLED";

/**
 * Calculates the control's value according to the input type
 * @param {any} event
 * @return {any}
 */
function getControlValue(event) {
  if (isEvent(event)) {
    switch (event.target.type) {
      case "checkbox":
        return event.target.checked;
      case "select-multiple":
        if (event.target.options) {
          var options = event.target.options;
          var value = [];
          for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
              value.push(options[i].value);
            }
          }
          return value;
        }
        return event.target.value;
      default:
        return isReactNative() ? event.nativeEvent.text : event.target.value;
    }
  }
  return event;
}
/**
 * @param {AbstractControl} control
 * @param {(String|Number)[]|String} path
 * @param {String} delimiter
 */
function _find(control, path, delimiter) {
  if (path == null) return null;
  if (!(path instanceof Array)) {
    path = path.split(delimiter);
  }
  if (path instanceof Array && path.length === 0) return null;
  return path.reduce(function (v, name) {
    if (v instanceof FormGroup) {
      return v.controls[name] || null;
    }
    if (v instanceof FormArray) {
      return v.at(name) || null;
    }
    return null;
  }, control);
}
/**
 * @param {{validators: Function|Function[]|null, asyncValidators: Function|Function[]|null, updateOn: 'change' | 'blur' | 'submit'}} validatorOrOpts
 * @return {Boolean}
 */
function isOptionsObj(validatorOrOpts) {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) && (typeof validatorOrOpts === "undefined" ? "undefined" : _typeof(validatorOrOpts)) === "object";
}
/**
 * @param {Function} validator
 * @return {Function}
 */
function normalizeValidator(validator) {
  if (validator.validate) {
    return function (c) {
      return validator.validate(c);
    };
  }
  return validator;
}
/**
 * @param {Function} validator
 * @return {Function}
 */
function normalizeAsyncValidator(validator) {
  if (validator.validate) {
    return function (c) {
      return validator.validate(c);
    };
  }
  return validator;
}
/**
 * @param {Function[]} validators
 * @return {Function|null}
 */
function composeValidators(validators) {
  return validators != null ? Validators.compose(validators.map(normalizeValidator)) : null;
}
/**
 * @param {Function[]} validators
 * @return {Function|null}
 */
function composeAsyncValidators(validators) {
  return validators != null ? Validators.composeAsync(validators.map(normalizeAsyncValidator)) : null;
}

function coerceToValidator(validatorOrOpts) {
  var validator = isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts;
  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}

function coerceToAsyncValidator(asyncValidator, validatorOrOpts) {
  var origAsyncValidator = isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator;
  return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) : origAsyncValidator || null;
}
/**
 * This is the base class for `FormControl`, `FormGroup`, and
 * `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 */
var AbstractControl = function () {
  /**
   * @param {Function|null} validator
   * @param {Function|null} asyncValidator
   */

  function AbstractControl(validator, asyncValidator) {
    classCallCheck(this, AbstractControl);

    this.validator = validator;
    this.asyncValidator = asyncValidator;
    /**
     * A control is marked `touched` once the user has triggered
     * a `blur` event on it.
     */
    this.touched = false;
    this.submitted = false;
    /**
     * A control is `pristine` if the user has not yet changed
     * the value in the UI.
     *
     * Note that programmatic changes to a control's value will
     * *not* mark it dirty.
     */
    this.pristine = true;
    this.meta = {};
    this._pendingChange = this.updateOn !== "change";
    this._pendingDirty = false;
    this._pendingTouched = false;
    this._onDisabledChange = [];
    this.hasError = this.hasError.bind(this);
    this.getError = this.getError.bind(this);
    this.reset = this.reset.bind(this);
    this.get = this.get.bind(this);
    this.patchValue = this.patchValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }
  /**
   * Returns the update strategy of the `AbstractControl` (i.e.
   * the event on which the control will update itself).
   * Possible values: `'change'` (default) | `'blur'` | `'submit'`
   */


  createClass(AbstractControl, [{
    key: "setInitialStatus",
    value: function setInitialStatus() {
      if (this.disabled) {
        this.status = DISABLED;
      } else {
        this.status = VALID;
      }
    }
    /**
     * Disables the control. This means the control will be exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children will be disabled to maintain the model.
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "disable",
    value: function disable() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.status = DISABLED;
      this.errors = null;
      this._forEachChild(function (control) {
        control.disable({
          onlySelf: true
        });
      });
      this._updateValue();

      if (opts.emitEvent !== false) {
        this.valueChanges.next(this.value);
        this.statusChanges.next(this.status);
        this.stateChanges.next();
      }

      this._updateAncestors(!!opts.onlySelf);
      this._onDisabledChange.forEach(function (changeFn) {
        return changeFn(true);
      });
    }
    /**
     * Enables the control. This means the control will be included in validation checks and
     * the aggregate value of its parent. Its status is re-calculated based on its value and
     * its validators.
     *
     * If the control has children, all children will be enabled.
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "enable",
    value: function enable() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.status = VALID;
      this._forEachChild(function (control) {
        control.enable({
          onlySelf: true
        });
      });
      this.updateValueAndValidity({
        onlySelf: true,
        emitEvent: opts.emitEvent
      });
      this._updateAncestors(!!opts.onlySelf);
      this._onDisabledChange.forEach(function (changeFn) {
        return changeFn(false);
      });
    }
    /**
     * Re-calculates the value and validation status of the control.
     *
     * By default, it will also update the value and validity of its ancestors.
     * @param {{onlySelf: Boolean, emitEvent: Booelan}} options
     */

  }, {
    key: "updateValueAndValidity",
    value: function updateValueAndValidity() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.setInitialStatus();
      this._updateValue();
      var shouldValidate = this.enabled && (this.updateOn !== "submit" || this.submitted);
      if (shouldValidate) {
        this._cancelExistingSubscription();
        this.errors = this._runValidator();
        this.status = this._calculateStatus();
        if (this.status === VALID || this.status === PENDING) {
          this._runAsyncValidator(true);
        }
      }
      if (options.emitEvent !== false) {
        this.valueChanges.next(this.value);
        this.statusChanges.next(this.status);
        this.stateChanges.next();
      }
      if (this.parent && !options.onlySelf) {
        this.parent.updateValueAndValidity(options);
      }
    }
    /**
     * Marks the control as `touched`.
     *
     * This will also mark all direct ancestors as `touched` to maintain
     * the model.
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "markAsTouched",
    value: function markAsTouched() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.touched = true;
      if (this._parent && !opts.onlySelf) {
        this._parent.markAsTouched(opts);
      }
      if (opts.emitEvent) {
        this.stateChanges.next();
      }
    }
    /**
     * Marks the control as `submitted`.
     *
     * If the control has any children, it will also mark all children as `submitted`
     * @param {{emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "markAsSubmitted",
    value: function markAsSubmitted() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.submitted = true;

      this._forEachChild(function (control) {
        control.markAsSubmitted();
      });

      if (opts.emitEvent !== false) {
        this.stateChanges.next();
      }
    }
    /**
     * Marks the control as `unsubmitted`.
     *
     * If the control has any children, it will also mark all children as `unsubmitted`.
     *
     * @param {{emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "markAsUnsubmitted",
    value: function markAsUnsubmitted() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.submitted = false;

      this._forEachChild(function (control) {
        control.markAsUnsubmitted({
          onlySelf: true
        });
      });

      if (opts.emitEvent !== false) {
        this.stateChanges.next();
      }
    }
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, it will also mark all children as `pristine`
     * to maintain the model, and re-calculate the `pristine` status of all parent
     * controls.
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "markAsPristine",
    value: function markAsPristine() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.pristine = true;
      this._pendingDirty = false;
      if (opts.emitEvent) {
        this.stateChanges.next();
      }
      this._forEachChild(function (control) {
        control.markAsPristine({
          onlySelf: true
        });
      });
      if (this._parent && !opts.onlySelf) {
        this._parent._updatePristine(opts);
      }
    }
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, it will also mark all children as `untouched`
     * to maintain the model, and re-calculate the `touched` status of all parent
     * controls.
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "markAsUntouched",
    value: function markAsUntouched() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.touched = false;
      this._pendingTouched = false;
      this._forEachChild(function (control) {
        control.markAsUntouched({
          onlySelf: true
        });
      });
      if (this._parent && !opts.onlySelf) {
        this._parent._updateTouched(opts);
      }
      if (opts.emitEvent) {
        this.stateChanges.next();
      }
    }
    /**
     * Marks the control as `dirty`.
     *
     * This will also mark all direct ancestors as `dirty` to maintain
     * the model.
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "markAsDirty",
    value: function markAsDirty() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.pristine = false;
      if (opts.emitEvent) {
        this.stateChanges.next();
      }
      if (this._parent && !opts.onlySelf) {
        this._parent.markAsDirty(opts);
      }
    }
    /**
     * Marks the control as `pending`.
     * @param {{onlySelf: Boolean}} opts
     * @return {void}
     */

  }, {
    key: "markAsPending",
    value: function markAsPending() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.status = PENDING;

      if (this._parent && !opts.onlySelf) {
        this._parent.markAsPending(opts);
      }
    }
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this will overwrite any existing sync validators.
     * @param {Function|Function[]|null} newValidator
     * @return {void}
     */

  }, {
    key: "setValidators",
    value: function setValidators(newValidator) {
      this.validator = coerceToValidator(newValidator);
    }
    /**
     * Sets the async validators that are active on this control. Calling this
     * will overwrite any existing async validators.
     */

  }, {
    key: "setAsyncValidators",
    value: function setAsyncValidators(newValidator) {
      this.asyncValidator = coerceToAsyncValidator(newValidator);
    }
    /**
     * Sets errors on a form control.
     *
     * This is used when validations are run manually by the user, rather than automatically.
     *
     * Calling `setErrors` will also update the validity of the parent control.
     *
     * ### Example
     *
     * ```
     * const login = new FormControl("someLogin");
     * login.setErrors({
     *   "notUnique": true
     * });
     *
     * ```
     * @param {{onlySelf: boolean}} opts
     * @return {void}
     */

  }, {
    key: "setErrors",
    value: function setErrors(errors) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.errors = errors;
      this._updateControlsErrors(opts.emitEvent !== false);
    }
    /**
     * Retrieves a child control given the control's name or path.
     *
     * Paths can be passed in as an array or a string delimited by a dot.
     *
     * To get a control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     * @param {(String|Number)[]|String} path
     * @return {AbstractControl|null}
     */

  }, {
    key: "get",
    value: function get$$1(path) {
      return _find(this, path, ".");
    }
    /**
     * Returns error data if the control with the given path has the error specified. Otherwise
     * returns null or undefined.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {String} errorCode
     * @param {(String|Number)[]|String} path
     */

  }, {
    key: "getError",
    value: function getError(errorCode, path) {
      var control = path ? this.get(path) : this;
      return control && control.errors ? control.errors[errorCode] : null;
    }
    /**
     * Returns true if the control with the given path has the error specified. Otherwise
     * returns false.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {String} errorCode
     * @param {(String|Number)[]|String} path
     * @return {Booelan}
     */

  }, {
    key: "hasError",
    value: function hasError(errorCode, path) {
      return !!this.getError(errorCode, path);
    }
    /**
     * Empties out the sync validator list.
     */

  }, {
    key: "clearValidators",
    value: function clearValidators() {
      this.validator = null;
    }
    /**
     * Empties out the async validator list.
     */

  }, {
    key: "clearAsyncValidators",
    value: function clearAsyncValidators() {
      this.asyncValidator = null;
    }
    /**
     * @param {FormGroup|FormArray} parent
     * @return {Void}
     */

  }, {
    key: "setParent",
    value: function setParent(parent) {
      this._parent = parent;
    }
    /**
     * @param {Boolean} onlySelf
     */

  }, {
    key: "_updateAncestors",
    value: function _updateAncestors(onlySelf) {
      if (this._parent && !onlySelf) {
        this._parent.updateValueAndValidity();
        this._parent._updatePristine();
        this._parent._updateTouched();
      }
    }
    /**
     * @param {String} status
     * @return {Booelan}
     */

  }, {
    key: "_anyControlsHaveStatus",
    value: function _anyControlsHaveStatus(status) {
      return this._anyControls(function (control) {
        return control.status === status;
      });
    }
    /**
     * @return {String}
     */

  }, {
    key: "_calculateStatus",
    value: function _calculateStatus() {
      if (this._allControlsDisabled()) return DISABLED;
      if (this.errors) return INVALID;
      if (this._anyControlsHaveStatus(PENDING)) return PENDING;
      if (this._anyControlsHaveStatus(INVALID)) return INVALID;
      return VALID;
    }
  }, {
    key: "_runValidator",
    value: function _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    /**
     * @param {Booelan} emitEvent
     * @return {void}
     */

  }, {
    key: "_runAsyncValidator",
    value: function _runAsyncValidator(emitEvent) {
      var _this = this;

      if (this.asyncValidator) {
        this.status = PENDING;
        var obs = toObservable(this.asyncValidator(this));
        this._asyncValidationSubscription = obs.subscribe(function (errors) {
          return _this.setErrors(errors, {
            emitEvent: emitEvent
          });
        });
      }
    }
  }, {
    key: "_cancelExistingSubscription",
    value: function _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
      }
    }
    /**
     * @param {{onlySelf: boolean}} opts
     * @return {void}
     */

  }, {
    key: "_updatePristine",
    value: function _updatePristine() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.pristine = !this._anyControlsDirty();
      if (this._parent && !opts.onlySelf) {
        this._parent._updatePristine(opts);
      }
    }
    /**
     * @param {{onlySelf: boolean}} opts
     * @return {void}
     */

  }, {
    key: "_updateTouched",
    value: function _updateTouched() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.touched = this._anyControlsTouched();
      if (this._parent && !opts.onlySelf) {
        this._parent._updateTouched(opts);
      }
    }
    /**
     * @return {Boolean}
     */

  }, {
    key: "_anyControlsDirty",
    value: function _anyControlsDirty() {
      return this._anyControls(function (control) {
        return control.dirty;
      });
    }
  }, {
    key: "_anyControlsUnsubmitted",
    value: function _anyControlsUnsubmitted() {
      return this._anyControls(function (control) {
        return !control.submitted;
      });
    }
    /**
     * @return {Boolean}
     */

  }, {
    key: "_anyControlsTouched",
    value: function _anyControlsTouched() {
      return this._anyControls(function (control) {
        return control.touched;
      });
    }
    /**
     * @param {Booelan} emitEvent
     * @return {void}
     */

  }, {
    key: "_updateControlsErrors",
    value: function _updateControlsErrors(emitEvent) {
      this.status = this._calculateStatus();
      if (emitEvent) {
        this.statusChanges.next();
        this.stateChanges.next();
      }
      if (this._parent) {
        this._parent._updateControlsErrors(emitEvent);
      }
    }
  }, {
    key: "_initObservables",
    value: function _initObservables() {
      this.valueChanges = new Observable();
      this.statusChanges = new Observable();
      this.stateChanges = new Observable();
    }
    // Abstarct Methods
    /**
     * @param {Function} cb
     * @return {void}
     */

  }, {
    key: "_forEachChild",
    value: function _forEachChild(cb) {}
  }, {
    key: "_updateValue",
    value: function _updateValue() {}
  }, {
    key: "_allControlsDisabled",
    value: function _allControlsDisabled() {}
  }, {
    key: "_anyControls",
    value: function _anyControls() {}
  }, {
    key: "reset",
    value: function reset(value, options) {}
  }, {
    key: "setValue",
    value: function setValue() {}
  }, {
    key: "patchValue",
    value: function patchValue() {}
  }, {
    key: "_registerOnCollectionChange",
    value: function _registerOnCollectionChange(fn) {
      this._onCollectionChange = fn;
    }
    /**
     * @param {{validators: Function|Function[]|null, asyncValidators: Function|Function[]|null, updateOn: 'change' | 'blur' | 'submit'}} opts
     * @return {Void}
     */

  }, {
    key: "_setUpdateStrategy",
    value: function _setUpdateStrategy(opts) {
      if (isOptionsObj(opts) && opts.updateOn != null) {
        this._updateOn = opts.updateOn;
      }
    }
  }, {
    key: "updateOn",
    get: function get$$1() {
      return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change";
    }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * Note that programmatic changes to a control's value will
     * *not* mark it dirty.
     * @return {Boolean}
     */

  }, {
    key: "dirty",
    get: function get$$1() {
      return !this.pristine;
    }
    /**
     * A control is `valid` when its `status === VALID`.
     *
     * In order to have this status, the control must have passed all its
     * validation checks.
     * @return {Boolean}
     */

  }, {
    key: "valid",
    get: function get$$1() {
      return this.status === VALID;
    }
    /**
     * A control is `invalid` when its `status === INVALID`.
     *
     * In order to have this status, the control must have failed
     * at least one of its validation checks.
     * @return {Boolean}
     */

  }, {
    key: "invalid",
    get: function get$$1() {
      return this.status === INVALID;
    }
    /**
     * A control is `pending` when its `status === PENDING`.
     *
     * In order to have this status, the control must be in the
     * middle of conducting a validation check.
     */

  }, {
    key: "pending",
    get: function get$$1() {
      return this.status === PENDING;
    }
    /**
     * The parent control.
     * * @return {FormGroup|FormArray}
     */

  }, {
    key: "parent",
    get: function get$$1() {
      return this._parent;
    }
    /**
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     * @return {Boolean}
     */

  }, {
    key: "untouched",
    get: function get$$1() {
      return !this.touched;
    }
    /**
     * A control is `enabled` as long as its `status !== DISABLED`.
     *
     * In other words, it has a status of `VALID`, `INVALID`, or
     * `PENDING`.
     * @return {Boolean}
     */

  }, {
    key: "enabled",
    get: function get$$1() {
      return this.status !== DISABLED;
    }
    /**
     * A control is disabled if it's status is `DISABLED`
     */

  }, {
    key: "disabled",
    get: function get$$1() {
      return this.status === DISABLED;
    }
    /**
     * Retrieves the top-level ancestor of this control.
     * @return {AbstractControl}
     */

  }, {
    key: "root",
    get: function get$$1() {
      var x = this;
      while (x._parent) {
        x = x._parent;
      }
      return x;
    }
  }]);
  return AbstractControl;
}();
var FormControl = function (_AbstractControl) {
  inherits(FormControl, _AbstractControl);

  function FormControl(formState, validatorOrOpts, asyncValidator) {
    classCallCheck(this, FormControl);

    var _this2 = possibleConstructorReturn(this, (FormControl.__proto__ || Object.getPrototypeOf(FormControl)).call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)));

    _this2.formState = formState;
    _this2.validatorsOrOpts = validatorOrOpts;
    _this2._applyFormState(formState);
    _this2._setUpdateStrategy(validatorOrOpts);
    _this2._pendingChange = true;
    _this2._pendingDirty = false;
    _this2._pendingTouched = false;
    /**
     * A control is `active` when its focused.
     */
    _this2.active = false;
    _this2.onValueChanges = new Observable();
    _this2.onBlurChanges = new Observable();
    _this2.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    });
    _this2._initObservables();
    /**
     * Called whenevers an onChange event triggers.
     * Updates the control value according to the update strategy.
     *
     * @param {any} event
     * @return {void}
     */
    _this2.onChange = function (event) {
      var value = getControlValue(event);
      if (_this2.updateOn !== "change") {
        _this2._pendingValue = value;
        _this2._pendingChange = true;
        if (!_this2._pendingDirty) {
          _this2._pendingDirty = true;
        }
        _this2.stateChanges.next();
      } else {
        if (!_this2.dirty) {
          _this2.markAsDirty();
        }
        _this2.setValue(value);
      }
      _this2.onValueChanges.next(value);
    };
    /**
     * Called whenevers an onBlur event triggers.
     */

    _this2.onBlur = function () {
      _this2.active = false;
      if (_this2.updateOn === "blur") {
        if (!_this2.dirty) {
          _this2.markAsDirty();
        }
        if (!_this2.touched) {
          _this2.markAsTouched();
        }
        _this2.setValue(_this2._pendingValue);
      } else if (_this2.updateOn === "submit") {
        _this2._pendingTouched = true;
        _this2._pendingDirty = true;
      } else {
        var emitChangeToView = !_this2.touched;
        if (!_this2.dirty) {
          _this2.markAsDirty();
        }
        if (!_this2.touched) {
          _this2.markAsTouched();
        }
        if (emitChangeToView) {
          _this2.stateChanges.next();
        }
      }
      _this2.onBlurChanges.next(_this2._pendingValue);
    };
    /**
     * Called whenevers an onFocus event triggers.
     */
    _this2.onFocus = function () {
      _this2.active = true;
      _this2.stateChanges.next();
    };
    /**
     * Returns the required props to bind an input element.
     * @param {string} inputType
     * @param {any} value
     */
    _this2.handler = function (inputType, value) {
      return getHandler(inputType, value, _this2);
    };
    return _this2;
  }
  /**
   * A control is `inactive` when its not focused.
   * @return {Boolean}
   */


  createClass(FormControl, [{
    key: "setValue",

    /**
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
     * @return {void}
     */
    value: function setValue(value) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.value = this._pendingValue = value;
      this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as setValue at this level.
     * It exists for symmetry with patchValue on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     * @param {any} value
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
     * @return {void}
     */

  }, {
    key: "patchValue",
    value: function patchValue(value) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.setValue(value, options);
    }

    /**
     * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
     * @return {void}
     */

  }, {
    key: "reset",
    value: function reset() {
      var formState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._applyFormState(formState);
      this.markAsPristine(options);
      this.markAsUntouched(options);
      this.setValue(this.value, options);
      this._pendingChange = false;
    }
    /**
     * @param {Function} condition
     * @return {Boolean}
     */

  }, {
    key: "_anyControls",
    value: function _anyControls(condition) {
      return false;
    }
    /**
     * @return {Boolean}
     */

  }, {
    key: "_allControlsDisabled",
    value: function _allControlsDisabled() {
      return this.disabled;
    }
    /**
     * @return {Boolean}
     */

  }, {
    key: "_isBoxedValue",
    value: function _isBoxedValue(formState) {
      return (typeof formState === "undefined" ? "undefined" : _typeof(formState)) === "object" && formState !== null && Object.keys(formState).length === 2 && "value" in formState && "disabled" in formState;
    }
  }, {
    key: "_applyFormState",
    value: function _applyFormState(formState) {
      if (this._isBoxedValue(formState)) {
        this.value = this._pendingValue = formState.value;
        if (formState.disabled) {
          this.disable({
            onlySelf: true,
            emitEvent: false
          });
        } else {
          this.enable({
            onlySelf: true,
            emitEvent: false
          });
        }
      } else {
        this.value = this._pendingValue = formState;
      }
    }
  }, {
    key: "_syncPendingControls",
    value: function _syncPendingControls() {
      if (this.updateOn === "submit") {
        if (this._pendingDirty) this.markAsDirty();
        if (this._pendingTouched) this.markAsTouched();
        if (this._pendingChange) {
          this.setValue(this._pendingValue);
          this._pendingChange = false;
          return true;
        }
      }
      return false;
    }
  }, {
    key: "inactive",
    get: function get$$1() {
      return !this.active;
    }
  }]);
  return FormControl;
}(AbstractControl);
var FormGroup = function (_AbstractControl2) {
  inherits(FormGroup, _AbstractControl2);

  function FormGroup(controls, validatorOrOpts, asyncValidator) {
    classCallCheck(this, FormGroup);

    var _this3 = possibleConstructorReturn(this, (FormGroup.__proto__ || Object.getPrototypeOf(FormGroup)).call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)));

    _this3.controls = controls;
    _this3.validatorOrOpts = validatorOrOpts;
    _this3._initObservables();
    _this3._setUpdateStrategy(validatorOrOpts);
    _this3._setUpControls();
    _this3.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    });
    _this3.handleSubmit = function (e) {
      if (e) {
        e.preventDefault();
      }
      if (_this3._anyControlsUnsubmitted()) {
        _this3.markAsSubmitted({
          emitEvent: false
        });
      }
      if (!_this3._syncPendingControls()) {
        _this3.updateValueAndValidity();
      }
    };
    return _this3;
  }
  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * It will return false for disabled controls. If you'd like to check for existence in the group
   * only, use `AbstractControl` get instead.
   * @param {String} controlName
   * @return {Boolean}
   */


  createClass(FormGroup, [{
    key: "contains",
    value: function contains(controlName) {
      return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control, so for most cases you'll want
     * to use addControl instead.
     * @param {String} name
     * @param {AbstractControl} control
     * @return {AbstractControl}
     */

  }, {
    key: "registerControl",
    value: function registerControl(name, control) {
      if (this.controls[name]) return this.controls[name];
      this.controls[name] = control;
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
      return control;
    }

    /**
     * Add a control to this group.
     * @param {String} name
     * @param {AbstractControl} control
     * @return {void}
     */

  }, {
    key: "addControl",
    value: function addControl(name, control) {
      this.registerControl(name, control);
      this.updateValueAndValidity();
      this._onCollectionChange();
    }

    /**
     * Remove a control from this group.
     * @param {String} name
     * @return {void}
     */

  }, {
    key: "removeControl",
    value: function removeControl(name) {
      if (this.controls[name]) this.controls[name]._registerOnCollectionChange(function () {});
      delete this.controls[name];
      this.updateValueAndValidity();
      this._onCollectionChange();
    }

    /**
     * Replace an existing control.
     * @param {String} name
     * @param {AbstractControl} control
     * @return {void}
     */

  }, {
    key: "setControl",
    value: function setControl(name, control) {
      if (this.controls[name]) this.controls[name]._registerOnCollectionChange(function () {});
      delete this.controls[name];
      if (control) this.registerControl(name, control);
      this.updateValueAndValidity();
      this._onCollectionChange();
    }
    /**
     * Sets the value of the FormGroup. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     *  ### Example
     *  form.setValue({first: 'Jon', last: 'Snow'});
     *  console.log(form.value);   // {first: 'Jon', last: 'Snow'}
     * @param {{[key: string]: any}} value
     * @param {{onlySelf: boolean, emitEvent: boolean}} options
     * @return {void}
     */

  }, {
    key: "setValue",
    value: function setValue(value) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._checkAllValuesPresent(value);
      Object.keys(value).forEach(function (name) {
        _this4._throwIfControlMissing(name);
        _this4.controls[name].setValue(value[name], {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      });
      this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormGroup`.
     * @param {any} value
     * @param {{onlySelf: boolean, emitEvent: boolean}} options
     * @return {void}
     */

  }, {
    key: "reset",
    value: function reset() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._forEachChild(function (control, name) {
        control.reset(value[name], {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      });
      this.updateValueAndValidity(options);
      this.markAsUnsubmitted();
      this._updatePristine(options);
      this._updateTouched(options);
    }
    /**
     *  Patches the value of the FormGroup. It accepts an object with control
     *  names as keys, and will do its best to match the values to the correct controls
     *  in the group.
     *
     *  It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     *  ### Example
     *  ```
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.patchValue({first: 'Jon'});
     *  console.log(form.value);   // {first: 'Jon', last: null}
     *
     *  ```
     * @param {{[key: string]: any}} value
     * @param {{onlySelf: boolean, emitEvent: boolean}} options
     * @return {void}
     */

  }, {
    key: "patchValue",
    value: function patchValue(value) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      Object.keys(value).forEach(function (name) {
        if (_this5.controls[name]) {
          _this5.controls[name].patchValue(value[name], {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        }
      });
      this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the FormGroup, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the group.
     */

  }, {
    key: "getRawValue",
    value: function getRawValue() {
      return this._reduceChildren({}, function (acc, control, name) {
        acc[name] = control instanceof FormControl ? control.value : control.getRawValue();
        return acc;
      });
    }
    /**
     * @param {{(v: any, k: String) => void}} callback
     * @return {void}
     */

  }, {
    key: "_forEachChild",
    value: function _forEachChild(callback) {
      var _this6 = this;

      Object.keys(this.controls).forEach(function (k) {
        return callback(_this6.controls[k], k);
      });
    }
  }, {
    key: "_onCollectionChange",
    value: function _onCollectionChange() {}
    /**
     * @param {Function} condition
     * @return {Boolean}
     */

  }, {
    key: "_anyControls",
    value: function _anyControls(condition) {
      var _this7 = this;

      var res = false;
      this._forEachChild(function (control, name) {
        res = res || _this7.contains(name) && condition(control);
      });
      return res;
    }
  }, {
    key: "_updateValue",
    value: function _updateValue() {
      this.value = this._reduceValue();
    }
  }, {
    key: "_reduceValue",
    value: function _reduceValue() {
      var _this8 = this;

      return this._reduceChildren({}, function (acc, control, name) {
        if (control.enabled || _this8.disabled) {
          acc[name] = control.value;
        }
        return acc;
      });
    }
  }, {
    key: "_reduceErrors",
    value: function _reduceErrors() {
      var _this9 = this;

      return this._reduceChildren({}, function (acc, control, name) {
        if (control.enabled || _this9.disabled) {
          acc[name] = control.errors;
        }
        return acc;
      });
    }
    /**
     * @param {Function} fn
     */

  }, {
    key: "_reduceChildren",
    value: function _reduceChildren(initValue, fn) {
      var res = initValue;
      this._forEachChild(function (control, name) {
        res = fn(res, control, name);
      });
      return res;
    }
  }, {
    key: "_setUpControls",
    value: function _setUpControls() {
      var _this10 = this;

      this._forEachChild(function (control) {
        control.setParent(_this10);
        control._registerOnCollectionChange(_this10._onCollectionChange);
      });
    }
    /**
     * @return {Boolean}
     */

  }, {
    key: "_allControlsDisabled",
    value: function _allControlsDisabled() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      console.log("_allControlsDisabled. Will this die?");

      try {
        for (var _iterator = Object.keys(this.controls)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var controlName = _step.value;
 
          if (this.controls[controlName].enabled) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            // throw _iteratorError;
          }
        }
      }

      return Object.keys(this.controls).length > 0 || this.disabled;
    }
  }, {
    key: "_checkAllValuesPresent",
    value: function _checkAllValuesPresent(value) {
      this._forEachChild(function (control, name) {
        if (value[name] === undefined) {
          throw new Error("Must supply a value for form control with name: '" + name + "'.");
        }
      });
    }
  }, {
    key: "_throwIfControlMissing",
    value: function _throwIfControlMissing(name) {
      if (!Object.keys(this.controls).length) {
        throw new Error("\n        There are no form controls registered with this group yet.\n      ");
      }
      if (!this.controls[name]) {
        throw new Error("Cannot find form control with name: " + name + ".");
      }
    }
  }, {
    key: "_syncPendingControls",
    value: function _syncPendingControls() {
      var subtreeUpdated = this._reduceChildren(false, function (updated, child) {
        return child._syncPendingControls() ? true : updated;
      });
      if (subtreeUpdated) this.updateValueAndValidity();
      return subtreeUpdated;
    }
  }]);
  return FormGroup;
}(AbstractControl);
var FormArray = function (_AbstractControl3) {
  inherits(FormArray, _AbstractControl3);

  function FormArray(controls, validatorOrOpts, asyncValidator) {
    classCallCheck(this, FormArray);

    var _this11 = possibleConstructorReturn(this, (FormArray.__proto__ || Object.getPrototypeOf(FormArray)).call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)));

    _this11.controls = controls;
    _this11.validatorOrOpts = validatorOrOpts;
    _this11._initObservables();
    _this11._setUpdateStrategy(validatorOrOpts);
    _this11._setUpControls();
    _this11.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    });
    _this11.handleSubmit = function (e) {
      if (e) {
        e.preventDefault();
      }
      if (_this11._anyControlsUnsubmitted()) {
        _this11.markAsSubmitted({
          emitEvent: false
        });
      }
      if (!_this11._syncPendingControls()) {
        _this11.updateValueAndValidity();
      }
    };
    return _this11;
  }
  /**
   * Get the `AbstractControl` at the given `index` in the array.
   * @param {Number} index
   * @return {AbstractControl}
   */


  createClass(FormArray, [{
    key: "at",
    value: function at(index) {
      return this.controls[index];
    }

    /**
     * Insert a new `AbstractControl` at the end of the array.
     * @param {AbstractControl} control
     * @return {Void}
     */

  }, {
    key: "push",
    value: function push(control) {
      this.controls.push(control);
      this._registerControl(control);
      this.updateValueAndValidity();
      this._onCollectionChange();
    }

    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     * @param {Number} index
     * @param {AbstractControl} control
     */

  }, {
    key: "insert",
    value: function insert(index, control) {
      this.controls.splice(index, 0, control);
      this._registerControl(control);
      this.updateValueAndValidity();
      this._onCollectionChange();
    }

    /**
     * Remove the control at the given `index` in the array.
     * @param {Number} index
     */

  }, {
    key: "removeAt",
    value: function removeAt(index) {
      if (this.controls[index]) this.controls[index]._registerOnCollectionChange(function () {});
      this.controls.splice(index, 1);
      this.updateValueAndValidity();
      this._onCollectionChange();
    }

    /**
     * Replace an existing control.
     * @param {Number} index
     * @param {AbstractControl} control
     */

  }, {
    key: "setControl",
    value: function setControl(index, control) {
      if (this.controls[index]) this.controls[index]._registerOnCollectionChange(function () {});
      this.controls.splice(index, 1);

      if (control) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
      }

      this.updateValueAndValidity();
      this._onCollectionChange();
    }

    /**
     * Length of the control array.
     * @return {Number}
     */

  }, {
    key: "setValue",


    /**
     * Sets the value of the `FormArray`. It accepts an array that matches
     * the structure of the control.
     * @param {any[]} value
     * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
     */
    value: function setValue(value) {
      var _this12 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._checkAllValuesPresent(value);
      value.forEach(function (newValue, index) {
        _this12._throwIfControlMissing(index);
        _this12.at(index).setValue(newValue, {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      });
      this.updateValueAndValidity(options);
    }

    /**
     *  Patches the value of the `FormArray`. It accepts an array that matches the
     *  structure of the control, and will do its best to match the values to the correct
     *  controls in the group.
     * @param {any[]} value
     * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
     */

  }, {
    key: "patchValue",
    value: function patchValue(value) {
      var _this13 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      value.forEach(function (newValue, index) {
        if (_this13.at(index)) {
          _this13.at(index).patchValue(newValue, {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        }
      });
      this.updateValueAndValidity(options);
    }

    /**
     * Resets the `FormArray`.
     * @param {any[]} value
     * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
     */

  }, {
    key: "reset",
    value: function reset() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._forEachChild(function (control, index) {
        control.reset(value[index], {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      });
      this.updateValueAndValidity(options);
      this.markAsUnsubmitted();
      this._updatePristine(options);
      this._updateTouched(options);
    }

    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the array.
     * @return {any[]}
     */

  }, {
    key: "getRawValue",
    value: function getRawValue() {
      return this.controls.map(function (control) {
        return control instanceof FormControl ? control.value : control.getRawValue();
      });
    }
  }, {
    key: "_syncPendingControls",
    value: function _syncPendingControls() {
      var subtreeUpdated = this.controls.reduce(function (updated, child) {
        return child._syncPendingControls() ? true : updated;
      }, false);
      if (subtreeUpdated) this.updateValueAndValidity();
      return subtreeUpdated;
    }
  }, {
    key: "_throwIfControlMissing",
    value: function _throwIfControlMissing(index) {
      if (!this.controls.length) {
        throw new Error("\n        There are no form controls registered with this array yet.\n      ");
      }
      if (!this.at(index)) {
        throw new Error("Cannot find form control at index " + index);
      }
    }
  }, {
    key: "_forEachChild",
    value: function _forEachChild(cb) {
      this.controls.forEach(function (control, index) {
        cb(control, index);
      });
    }
  }, {
    key: "_updateValue",
    value: function _updateValue() {
      var _this14 = this;

      this.value = this.controls.filter(function (control) {
        return control.enabled || _this14.disabled;
      }).map(function (control) {
        return control.value;
      });
    }
  }, {
    key: "_anyControls",
    value: function _anyControls(condition) {
      return this.controls.some(function (control) {
        return control.enabled && condition(control);
      });
    }
  }, {
    key: "_setUpControls",
    value: function _setUpControls() {
      var _this15 = this;

      this._forEachChild(function (control) {
        return _this15._registerControl(control);
      });
    }
  }, {
    key: "_checkAllValuesPresent",
    value: function _checkAllValuesPresent(value) {
      this._forEachChild(function (control, i) {
        if (value[i] === undefined) {
          throw new Error("Must supply a value for form control at index: " + i + ".");
        }
      });
    }
  }, {
    key: "_allControlsDisabled",
    value: function _allControlsDisabled() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.controls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var control = _step2.value;

          if (control.enabled) return false;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this.controls.length > 0 || this.disabled;
    }
  }, {
    key: "_registerControl",
    value: function _registerControl(control) {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    }
  }, {
    key: "_onCollectionChange",
    value: function _onCollectionChange() {}
  }, {
    key: "length",
    get: function get$$1() {
      return this.controls.length;
    }
  }]);
  return FormArray;
}(AbstractControl);

function _createControl(controlConfig) {
  if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup || controlConfig instanceof FormArray) {
    return controlConfig;
  } else if (Array.isArray(controlConfig)) {
    var value = controlConfig[0];
    var validator = controlConfig.length > 1 ? controlConfig[1] : null;
    var asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
    var updateOn = controlConfig.length > 3 ? controlConfig[3] : null;
    return FormBuilder.control(value, validator, asyncValidator, updateOn);
  }
  return FormBuilder.control(controlConfig);
}
function _reduceControls(controlsConfig) {
  var controls = {};
  Object.keys(controlsConfig).forEach(function (controlName) {
    controls[controlName] = _createControl(controlsConfig[controlName]);
  });
  return controls;
}

var FormBuilder = function () {
  function FormBuilder() {
    classCallCheck(this, FormBuilder);
  }

  createClass(FormBuilder, null, [{
    key: 'group',

    /**
     * Construct a new `FormGroup` with the given map of configuration.
     * Valid keys for the `extra` parameter map are `validators`, `asyncValidators` & `updateOn`.
     * @param {{[key: string]: any}} controlsConfig
     * @param {{[key: string]: any}|null} extra
     * @return {FormGroup}
     */
    value: function group(controlsConfig, extra) {
      var controls = _reduceControls(controlsConfig);
      var validators = extra != null ? extra.validators : null;
      var asyncValidators = extra != null ? extra.asyncValidators : null;
      var updateOn = extra != null ? extra.updateOn : null;
      return new FormGroup(controls, { validators: validators, asyncValidators: asyncValidators, updateOn: updateOn });
    }
    /**
     * Construct a `FormArray` from the given `controlsConfig` array of
     * Valid keys for the `extra` parameter map are `validators`, `asyncValidators` & `updateOn`.
     */

  }, {
    key: 'array',
    value: function array(controlsConfig, extra) {
      var controls = controlsConfig.map(function (c) {
        return _createControl(c);
      });
      var validators = extra != null ? extra.validators : null;
      var asyncValidators = extra != null ? extra.asyncValidators : null;
      var updateOn = extra != null ? extra.updateOn : null;
      return new FormArray(controls, { validators: validators, asyncValidators: asyncValidators, updateOn: updateOn });
    }

    /**
     * Construct a new `FormControl` with the given `formState`,`validator`,`asyncValidator`
     * and `updateOn`
     * `formState` can either be a standalone value for the form control or an object
     * that contains both a value and a disabled status.
     * @param {Object} formState
     * @param {Function|Function[]|null} validator
     * @param {Function|Function[]|null} asyncValidator
     * @param {string} updatOn
     * @return {FormControl}
     */

  }, {
    key: 'control',
    value: function control(formState, validators, asyncValidators, updateOn) {
      return new FormControl(formState, { validators: validators, asyncValidators: asyncValidators, updateOn: updateOn });
    }
  }]);
  return FormBuilder;
}();

var Field = function (_React$Component) {
  inherits(Field, _React$Component);

  function Field() {
    classCallCheck(this, Field);
    return possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).apply(this, arguments));
  }

  createClass(Field, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var control = this.props.control;
      // Add listener

      this.addListener(control);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var control = nextProps.control;

      if (this.props.control !== control) {
        this.removeListener(control);
        this.addListener(control);
      }
    }
  }, {
    key: 'addListener',
    value: function addListener(control) {
      var _this2 = this;

      if (control) {
        control.stateChanges.subscribe(function () {
          _this2.forceUpdate();
        });
      }
    }
  }, {
    key: 'removeListener',
    value: function removeListener(control) {
      if (control) {
        if (control.stateChanges.observers) {
          control.stateChanges.observers.forEach(function (observer) {
            control.stateChanges.unsubscribe(observer);
          });
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var control = this.props.control;
      // Remove Listener

      this.removeListener(control);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(props) {
      if (!props.strict) {
        return true;
      }
      return false;
    }
  }, {
    key: 'getComponent',
    value: function getComponent() {
      var _props = this.props,
          render = _props.render,
          children = _props.children,
          control = _props.control;

      warning(control, 'Missing Control.Please make sure that an instance of FormControl, FormGroup or FormArray must be passed as a control prop in the Field component');
      if (control) {
        // Render function as child
        if (isFunction(children)) {
          return children(control);
        }
        // Render function as render prop
        if (isFunction(render)) {
          return render(control);
        }
        return null;
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      return this.getComponent();
    }
  }]);
  return Field;
}(React.Component);


Field.defaultProps = {
  strict: true
};

Field.propTypes = {
  strict: PropTypes.bool,
  control: PropTypes.oneOfType([PropTypes.instanceOf(FormControl), PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)]).isRequired,
  render: PropTypes.func
};

var getControlFromReference = function getControlFromReference(reference, options, formState) {
  switch (reference) {
    case 'FormGroup':
      return new FormGroup({}, options);
    case 'FormArray':
      return new FormArray([], options);
    case 'FormControl':
      return new FormControl(formState, options);
    default:
      return null;
  }
};
var configureControl = function configureControl(props, context, reference) {
  var name = props.name,
      parent = props.parent,
      options = props.options,
      index = props.index,
      control = props.control,
      formState = props.formState,
      meta = props.meta;

  var parentControl = parent || context.parentControl;
  var returnControl = null;
  if (control) {
    if (reference === 'FormGroup' && control instanceof FormGroup) {
      returnControl = control;
    } else if (reference === 'FormArray' && control instanceof FormArray) {
      returnControl = control;
    } else if (reference === 'FormControl' && control instanceof FormControl) {
      returnControl = control;
    } else {
      warning(null, 'Control should be an instance of ' + reference + '.');
    }
  } else {
    if (name) {
      /**
       * The presence of name prop signifies two things:-
       * 1. The group control has to be added as a nested control i.e parent should be present.
       * 2. Parent must be an instance of FormGroup
       */
      warning(parentControl, 'Error in ' + name + ' control: Missing parent control.\n             Please make sure that the component is wrapped in a FieldGroup or\n             you can explicitly pass a parent control as a parent prop.');
      warning(parentControl && parentControl instanceof FormGroup, 'Error in ' + name + ' control: A name prop can only be used if the parent is an instance of FormGroup,\n             You can use the index prop instead of name, if the parent control is an instance of FormArray');
      if (parentControl && parentControl instanceof FormGroup) {
        /**
         * Check the presence of the control, if a control is already present in the parent control
         * then don't add a new control, return the same.
         */
        if (!parentControl.get(name)) {
          parentControl.addControl(name, getControlFromReference(reference, options, formState));
        }
        returnControl = parentControl.get(name);
      }
    } else {
      if (parentControl instanceof FormArray) {
        /**
         * If a index prop is defined then insert the control at a particular index otherwise
         * push the control at the end of FormArray
         */
        var insertAtIndex = index !== undefined ? index : parentControl.controls.length;
        parentControl.insert(insertAtIndex, getControlFromReference(reference, options, formState));
        returnControl = parentControl.at(insertAtIndex);
      } else {
        // Create a new instance and return as control in case of FormArray and FormGroup
        if (reference === 'FormGroup' || reference === 'FormArray') {
          returnControl = getControlFromReference(reference, options, formState);
        }
      }
    }
  }
  // Add the meta data about the control
  if (returnControl && meta) {
    returnControl.meta = meta;
  }
  return returnControl;
};

var FieldGroup = function (_React$Component) {
  inherits(FieldGroup, _React$Component);

  function FieldGroup(props, context) {
    classCallCheck(this, FieldGroup);

    var _this = possibleConstructorReturn(this, (FieldGroup.__proto__ || Object.getPrototypeOf(FieldGroup)).call(this, props, context));

    _this.control = configureControl(props, context, 'FormGroup');
    return _this;
  }

  createClass(FieldGroup, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        parentControl: this.control
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          strict = _props.strict,
          children = _props.children,
          render = _props.render;

      var FieldProps = {
        control: this.control,
        strict: strict,
        render: render || children || null
      };
      return React.createElement(Field, FieldProps);
    }
  }]);
  return FieldGroup;
}(React.Component);

FieldGroup.childContextTypes = {
  parentControl: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)])
};
FieldGroup.contextTypes = {
  parentControl: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)])
};

FieldGroup.defaultProps = {
  strict: true
};

FieldGroup.propTypes = {
  strict: PropTypes.bool,
  render: PropTypes.func,
  name: PropTypes.string,
  index: PropTypes.number,
  control: PropTypes.instanceOf(FormGroup),
  options: PropTypes.shape({
    validators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    asyncValidators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    updateOn: PropTypes.oneOf(['change', 'blur', 'submit'])
  }),
  parent: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)]),
  meta: PropTypes.object
};

var FieldControl = function (_React$Component) {
  inherits(FieldControl, _React$Component);

  function FieldControl(props, context) {
    classCallCheck(this, FieldControl);

    var _this = possibleConstructorReturn(this, (FieldControl.__proto__ || Object.getPrototypeOf(FieldControl)).call(this, props, context));

    _this.control = configureControl(props, context, 'FormControl');
    return _this;
  }

  createClass(FieldControl, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var name = nextProps.name;

      if (this.props.name !== name) {
        this.control = configureControl(nextProps, this.context, 'FormControl');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          strict = _props.strict,
          children = _props.children,
          render = _props.render;

      var FieldProps = {
        control: this.control,
        strict: strict,
        render: render || children || null
      };
      return React.createElement(Field, FieldProps);
    }
  }]);
  return FieldControl;
}(React.Component);


FieldControl.defaultProps = {
  strict: true
};
FieldControl.propTypes = {
  strict: PropTypes.bool,
  render: PropTypes.func,
  name: PropTypes.string,
  index: PropTypes.number,
  control: PropTypes.instanceOf(FormControl),
  formState: PropTypes.oneOfType([PropTypes.shape({
    value: PropTypes.any,
    disabled: PropTypes.bool
  }), PropTypes.any]),
  options: PropTypes.shape({
    validators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    asyncValidators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    updateOn: PropTypes.oneOf(['change', 'blur', 'submit'])
  }),
  parent: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)]),
  meta: PropTypes.object
};
FieldControl.contextTypes = {
  parentControl: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)])
};

var FieldArray = function (_React$Component) {
  inherits(FieldArray, _React$Component);

  function FieldArray(props, context) {
    classCallCheck(this, FieldArray);

    var _this = possibleConstructorReturn(this, (FieldArray.__proto__ || Object.getPrototypeOf(FieldArray)).call(this, props, context));

    _this.control = configureControl(props, context, 'FormArray');
    return _this;
  }

  createClass(FieldArray, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        parentControl: this.control
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          strict = _props.strict,
          children = _props.children,
          render = _props.render;

      var FieldProps = {
        control: this.control,
        strict: strict,
        render: render || children || null
      };
      return React.createElement(Field, FieldProps);
    }
  }]);
  return FieldArray;
}(React.Component);

FieldArray.childContextTypes = {
  parentControl: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)])
};
FieldArray.contextTypes = {
  parentControl: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)])
};
FieldArray.defaultProps = {
  strict: true
};

FieldArray.propTypes = {
  strict: PropTypes.bool,
  render: PropTypes.func,
  name: PropTypes.string,
  index: PropTypes.number,
  control: PropTypes.instanceOf(FormArray),
  options: PropTypes.shape({
    validators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    asyncValidators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    updateOn: PropTypes.oneOf(['change', 'blur', 'submit'])
  }),
  parent: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)]),
  meta: PropTypes.object
};

var FIELD_CONFIG_STRING = '$field_';

var FormGenerator = function (_React$Component) {
  inherits(FormGenerator, _React$Component);

  function FormGenerator(props) {
    classCallCheck(this, FormGenerator);

    // Intiate the form property
    var _this = possibleConstructorReturn(this, (FormGenerator.__proto__ || Object.getPrototypeOf(FormGenerator)).call(this, props));

    _this.form = null;
    return _this;
  }

  createClass(FormGenerator, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.onMount(this.form);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.props.onMount(this.form);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      // Only Re-renders for changes in field config
      if (nextProps.fieldConfig !== this.props.fieldConfig) {
        return true;
      }
      return false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var onUnmount = this.props.onUnmount;

      onUnmount();
    }
    // Create the form instance

  }, {
    key: 'configureForm',
    value: function configureForm() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'FormGroup';
      var fieldConfig = this.props.fieldConfig;

      this.form = configureControl(fieldConfig, {}, type);
    }
    // Creates the control from fieldConfig.

  }, {
    key: 'setControl',
    value: function setControl(configProps, key) {
      var _this2 = this;

      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      // Map the props to be passed in Field
      var propsToBePassed = mapConfigToFieldProps(configProps);
      // Set the key
      propsToBePassed.key = key;
      if (name) {
        propsToBePassed.name = name;
      }
      // Set the component for $field_
      if (name && name.startsWith(FIELD_CONFIG_STRING) || typeof configProps.index === 'string' && configProps.index.startsWith(FIELD_CONFIG_STRING)) {
        // Only subscribe when isStatic is false
        if (configProps.isStatic === false) {
          return React.createElement(Field, Object.assign({}, { control: this.form }, propsToBePassed));
        }
        return propsToBePassed.render();
      }

      if (configProps.controls) {
        if (configProps.controls instanceof Array) {
          // If controls is an array then configure FormArray
          if (!this.form) {
            this.configureForm('FormArray');
            propsToBePassed.control = this.form;
          }
          return React.createElement(FieldArray, Object.assign({}, propsToBePassed, {
            render: function render() {
              return configProps.controls.map(function (config, index) {
                return _this2.setControl(config, key + '_' + index);
              });
            }
          }));
        } else if (configProps.controls instanceof Object) {
          // If controls is an object then configure FormGroup
          if (!this.form) {
            this.configureForm();
            propsToBePassed.control = this.form;
          }
          return React.createElement(FieldGroup, Object.assign({}, propsToBePassed, {
            render: function render() {
              return Object.keys(configProps.controls).map(function (key) {
                return _this2.setControl(configProps.controls[key], key, key);
              });
            }
          }));
        } else {
          warning(false, 'Missing controls in fieldConfig.');
          return null;
        }
      } else {
        return React.createElement(FieldControl, propsToBePassed);
      }
    }
  }, {
    key: 'generateFields',
    value: function generateFields() {
      // Reset the form instance
      this.form = null;
      var fieldConfig = this.props.fieldConfig;

      if (fieldConfig.controls) {
        var fields = this.setControl(fieldConfig, generateKey('my_form'));
        return fields;
      } else {
        // Throw error
        warning(false, 'Missing controls in fieldConfig.');
        return null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var fieldConfig = this.props.fieldConfig;

      if (fieldConfig) {
        return this.generateFields();
      }
      return null;
    }
  }]);
  return FormGenerator;
}(React.Component);


FormGenerator.propTypes = {
  fieldConfig: PropTypes.shape({
    controls: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    strict: PropTypes.bool,
    render: PropTypes.func,
    name: PropTypes.string,
    index: PropTypes.number,
    control: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)]),
    options: PropTypes.shape({
      validators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
      asyncValidators: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
      updateOn: PropTypes.oneOf(['change', 'blur', 'submit'])
    }),
    parent: PropTypes.oneOfType([PropTypes.instanceOf(FormArray), PropTypes.instanceOf(FormGroup)]),
    meta: PropTypes.object
  }).isRequired,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func
};
FormGenerator.defaultProps = {
  onMount: function onMount() {
    return null;
  },
  onUnmount: function onUnmount() {
    return null;
  }
};

/**
 * @param {FormControl|FormGroup|FormArray} control
 */
function mapControlToProps(control) {
  var mappedObject = {};
  Object.keys(propsToBeMap).forEach(function (key) {
    var controlProperty = control[propsToBeMap[key]];
    mappedObject[key] = controlProperty;
  });
  if (control instanceof FormControl) {
    mappedObject['handler'] = function (inputType, value) {
      return getHandler(inputType, value, control);
    };
  }
  return mappedObject;
}
/**
 * @param {FormControl|FormGroup|FormArray} control
 * @param {String} name
 */
function mapNestedControls(control, name) {
  var extraProps = {};
  extraProps[name] = mapControlToProps(control);
  if (control instanceof FormGroup && control.controls) {
    Object.keys(control.controls).forEach(function (childControlName) {
      extraProps[name] = Object.assign(extraProps[name], mapNestedControls(control.controls[childControlName], childControlName));
    });
  } else if (control instanceof FormArray && control.controls) {
    extraProps[name]['controls'] = control.controls;
  }
  return extraProps;
}
function mapProps(formControls) {
  var extraProps = {};
  if (formControls) {
    Object.keys(formControls).forEach(function (controlName) {
      var control = formControls[controlName];
      if (control) {
        extraProps = Object.assign(extraProps, mapNestedControls(control, controlName));
      }
    });
  }
  return extraProps;
}
/**
 * Higher order component
 * @param {Component} ReactComponent
 * @param {FormGroup} formGroup
 * @return {Component} reactiveForm
 */
function reactiveForm(ReactComponent, formGroup) {
  var formControls = formGroup.controls;
  var extraProps = mapProps(formControls);
  mapProps(formControls);

  var ReactiveForm = function (_React$Component) {
    inherits(ReactiveForm, _React$Component);

    function ReactiveForm(props) {
      classCallCheck(this, ReactiveForm);

      var _this = possibleConstructorReturn(this, (ReactiveForm.__proto__ || Object.getPrototypeOf(ReactiveForm)).call(this, props));

      _this.state = {
        extraProps: extraProps
      };
      _this.updateComponent = _this.updateComponent.bind(_this);
      return _this;
    }

    createClass(ReactiveForm, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        // Add listeners
        formGroup.stateChanges.subscribe(function () {
          _this2.updateComponent();
        });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        //Remove listeners
        if (formGroup.stateChanges.observers) {
          formGroup.stateChanges.observers.forEach(function (observer) {
            formGroup.stateChanges.unsubscribe(observer);
          });
        }
      }
    }, {
      key: 'updateComponent',
      value: function updateComponent() {
        this.setState({
          extraProps: mapProps(formControls)
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var props = Object.assign({}, this.props, this.state.extraProps);
        return React.createElement(ReactComponent, props);
      }
    }]);
    return ReactiveForm;
  }(React.Component);

  return ReactiveForm;
}

exports.FormBuilder = FormBuilder;
exports.FormGroup = FormGroup;
exports.FormControl = FormControl;
exports.FormArray = FormArray;
exports.Validators = Validators;
exports.reactiveForm = reactiveForm;
exports.Field = Field;
exports.FieldGroup = FieldGroup;
exports.FieldControl = FieldControl;
exports.FieldArray = FieldArray;
exports.FormGenerator = FormGenerator;
