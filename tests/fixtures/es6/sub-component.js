"use strict";

System.register(["react"], function (_export, _context) {
    "use strict";

    var React, PropTypes, _createClass, SubComponent;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
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
    }

    return {
        setters: [function (_react) {
            React = _react.default;
            PropTypes = _react.PropTypes;
        }],
        execute: function () {
            _createClass = function () {
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

            _export("PropTypes", PropTypes);

            SubComponent = function (_React$Component) {
                _inherits(SubComponent, _React$Component);

                function SubComponent(props) {
                    _classCallCheck(this, SubComponent);

                    var _this = _possibleConstructorReturn(this, (SubComponent.__proto__ || Object.getPrototypeOf(SubComponent)).call(this, props));

                    _this.state = {
                        tracks: [],
                        hasMoreItems: true,
                        nextHref: null
                    };
                    return _this;
                }

                _createClass(SubComponent, [{
                    key: "render",
                    value: function render() {
                        return React.createElement(
                            "div",
                            null,
                            this.props.title
                        );
                    }
                }]);

                return SubComponent;
            }(React.Component);

            _export("default", SubComponent);

            SubComponent.defaultProps = {
                title: 'Sub '
            };

            SubComponent.propTypes = {
                title: PropTypes.string
            };
        }
    };
});
