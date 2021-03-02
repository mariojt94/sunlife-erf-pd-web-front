(function (app) {
    'use strict';
    app.directive('selectOnClick', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    if (!$window.getSelection().toString()) {
                        // Required for mobile Safari
                        this.setSelectionRange(0, this.value.length)
                    }
                });
            }
        };
    }]);

    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    app.directive("customChar", function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^a-zA-Z0-9._-]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });
    app.directive("formatDate", function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attr, modelCtrl) {
                modelCtrl.$formatters.push(function (modelValue) {
                    return new Date(modelValue);
                });
            }
        }
    });

    app.directive("formatNumber", function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;  // or return Number(transformedInput)
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });

    app.directive("formatNilai",
        function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        var transformedInput = text.replace(/[^0-9\.]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput; // or return Number(transformedInput)
                    }

                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        });

    app.directive("valNpwp",
        function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        var transformedInput = text.replace(/(?:[^0-9\.\-]*)/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput; // or return Number(transformedInput)
                    }

                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        });

    app.directive('npwpFormat',
        function () {
            return {
                require: 'ngModel',
                restrict: 'A',
                scope: {
                    npwpFormat: '='
                },
                link: function (scope, elem, attrs, ctrl) {
                    //var text, regReplace = new RegExp('[^0-9]', '');
                    var text, regReplace = new RegExp('[^0-9]', 'ig');

                    var valuenpwp;
                    elem.on('input',
                        function (event) {
                            changeView(elem.val());
                        });
                    scope.$watch('npwpFormat',
                        function (newVal) {
                            changeView(newVal);
                        });

                    function changeView(val) {
                        String.prototype.replaceAt = function (index, replacement) {
                            return this.substr(0, index) + replacement + this.substr(index + replacement.length);
                        }
                        //valuenpwp = val.replace(regReplace, '');
                       valuenpwp = val;
                        text = valuenpwp;
                        try {
                            if (text.length > 2)
                                text = text.replaceAt(2, ".");
                            if (text.length > 6)
                                text = text.replaceAt(6, ".");
                            if (text.length > 10)
                                text = text.replaceAt(10, ".");
                            if (text.length > 12)
                                text = text.replaceAt(12, "-");
                            if (text.length > 16)
                                text = text.replaceAt(16, ".");
                        } catch (err) {
                            text = null;
                            valuenpwp = null;
                        }
                        scope.npwpFormat = valuenpwp;
                        apply(text);
                    }

                    function apply(val) {
                        ctrl.$setViewValue(val);
                        ctrl.$render();
                    }
                }
            }
        });

    app.directive('leftArrow', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 37) {
                    scope.$apply(function () {
                        scope.$eval(attrs.leftArrow);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    app.directive('rightArrow', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 39) {
                    scope.$apply(function () {
                        scope.$eval(attrs.rightArrow);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    app.filter("price", function () {
        return function (val) {
            var price = (typeof val != 'number') ? '' : val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace('.00', '');
            return price;
        }
    });

    app.directive('testpdf', function () {
        return {
            templateUrl: 'testPdf.html'
        };
    });

    app.filter("DDMMYYYY", function () {
        return function (val) {
            var result = val;
            if (val) {
                result = moment(val).format('DD/MM/YYYY');
                if (result == 'Invalid date') {
                    result = moment(val, 'DD/MM/YYYY').format('DD/MM/YYYY');
                }
            }
            return result;
        }
    });

    app.filter("formatDateChat", function () {
        return function (val) {
            var result = val;
            if (val) {
                result = moment(val).format('DD/MM/YYYY HH:mm:ss');
                if (result == 'Invalid date') {
                    result = moment(val, 'DD/MM/YYYY').format('DD/MM/YYYY HH:mm:ss');
                }
            }
            return result;
        }
    });

    app.filter("MMDDYYYY", function () {
        return function (val) {
            var result = val;
            if (val) {
                result = moment(val).format('DD/MM/YYYY');
                if (result == 'Invalid date') {
                    result = moment(val, 'DD/MM/YYYY').format('DD/MM/YYYY');
                }
            }
            return result;
        }
    });

    app.directive('inputThousand', function () {
        return {
            restrict: 'AE',
            scope: { model: '=', id: "@" },
            template: ['<div class="input-custom {{labelClass}}">',
            '<input type="number" id="{{id}}" ng-model="model">',
            '<label for="{{id}}">{{model | price}}</label>',
            '</div>'].join(""),
            link: function (scope) {
                scope.id = scope.id || "id-input-" + Math.random().toString().replace("0.", "");
            }
        }
    });

    app.directive('dateInput', function (dateFilter) {
        return {
            require: 'ngModel',
            template: '<input type="date"></input>',
            replace: true,
            link: function (scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, 'yyyy-MM-dd');
                });

                ngModelCtrl.$parsers.unshift(function (viewValue) {
                    return new Date(viewValue);
                });
            },
        };
    }
    );

    app.directive('thousand', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                backModel: '='
            },
            link: function (scope, elem, attrs, ctrl) {
                var text, regReplace = new RegExp('[^0-9]', 'ig');
                elem.on('input', function () {
                    value = elem.val().replace(regReplace, '');
                    value = parseInt(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1' + attrs.thousand).replace('.00', '');
                    text = parseInt(value.replace(new RegExp(attrs.thousand, 'ig'), ''));
                    if (isNaN(text)) {
                        text = 0;
                        value = "";
                    }
                    scope.backModel = text;
                    ctrl.$setViewValue(value);
                    ctrl.$render();
                });
            }
        }
    });

    app.directive('currencyInput', function ($filter, $browser) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/,/g, '')
                    $element.val($filter('number')(value, false))
                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/,/g, '');
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, false))
                }

                $element.bind('change', listener)
                $element.bind('keydown', function (event) {
                    var key = event.keyCode
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
                        return
                    $browser.defer(listener) // Have to do this or changes don't get picked up properly
                })

                $element.bind('paste cut', function () {
                    $browser.defer(listener)
                })
            }
        }
    });

})(angular.module('SunLifeApp'));