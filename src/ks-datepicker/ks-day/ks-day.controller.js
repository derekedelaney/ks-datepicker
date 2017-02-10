'use strict';

(function () {
    angular.module('ks-datepicker').controller('ksDayController', ksDayController);

    /**
     * ks Day component for selecting dates to be
     * used in creating promotions throughout the application
     * @constructor
     * @ngInject
     */
    function ksDayController($locale) {
        var ksDay = this;
        ksDay.step = {months: 1};
        ksDay.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
        ksDay.DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        ksDay.mode = 'range';
        ksDay.viewedMonths = {};

        var MONTH_NAMES = $locale.DATETIME_FORMATS.MONTH;
        var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var rangeFirstClick = true;


        // ksDay.init = init;
        ksDay.setupDayOptions = setupDayOptions;
        ksDay.getMonthsFromNumber = getMonthsFromNumber;
        ksDay.createMonthObject = createMonthObject;
        ksDay.getWeeks = getWeeks;
        ksDay.getDates = getDates;
        ksDay.getDaysInMonth = getDaysInMonth;
        ksDay.uniqueId = uniqueId;
        ksDay.split = split;
        ksDay.createDateObject = createDateObject;
        ksDay.move = move;
        ksDay.weekCount = weekCount;
        ksDay.select = select;
        ksDay.getClassName = getClassName;
        ksDay.getObjectIndexOf = getObjectIndexOf;
        ksDay.pushDistinctObject = pushDistinctObject;
        ksDay.resetCalender = resetCalender;
        ksDay.selectRange = selectRange;
        ksDay.isDateSecondary = isDateSecondary;
        ksDay.$onChanges = init;
        ksDay.selectAllDays = selectAllDays;


        function init(changesObject) {
            if (changesObject.hasOwnProperty('dayOptions')) {
                if (ksDay.days && ksDay.days.length > 0) {
                    ksDay.startDate = ksDay.days[0];
                } else {
                    ksDay.days = [];
                    var now = new Date();
                    ksDay.startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
                }
                setupDayOptions(changesObject.dayOptions.currentValue);
                ksDay.months = getMonthsFromNumber(changesObject.dayOptions.currentValue.numOfMonths);
            }
        }

        function setupDayOptions(dayOptions) {
            [
                'numOfMonths'
            ].forEach(function (key) {
                switch (key) {
                    case 'numOfMonths':
                        ksDay.dayOptions[key] = dayOptions.hasOwnProperty(key) ? dayOptions[key] : 1;
                        break;
                }
            });
        }

        function getWeeks(firstDayOfMonth) {
            var NUM_OF_WEEKS = ksDay.weekCount(firstDayOfMonth.getFullYear(), (firstDayOfMonth.getMonth()));

            var difference = ksDay.startingDay - firstDayOfMonth.getDay(),
                numDisplayedFromPreviousMonth = difference > 0 ?
                    7 - difference : -difference,
                firstDate = new Date(firstDayOfMonth);

            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }

            for (var num = 0; num < ksDay.dayOptions.numOfMonths; num++) {

            }

            var days = ksDay.getDates(firstDate, (NUM_OF_WEEKS * 7));
            for (var i = 0; i < (NUM_OF_WEEKS * 7); i++) {
                days[i] = angular.extend(ksDay.createDateObject(days[i], firstDayOfMonth.getMonth()), {
                    uid: ksDay.uniqueId() + '-' + i
                });
            }
            var weeks = ksDay.split(days, 7);
            ksDay.viewedMonths[firstDayOfMonth.getFullYear() + '-' + firstDayOfMonth.getMonth()] = weeks;
            return weeks;
        }

        /**********************************
         *
         * Helper functions
         *
         **********************************/

        function getMonthsFromNumber(n) {
            var months = new Array(n);
            var startMonth = ksDay.startDate.getMonth();

            for (var i = 0; i < months.length; i++) {
                months[i] = (ksDay.createMonthObject(startMonth + i));
            }

            return months;
        }

        function createMonthObject(month) {
            var year = ksDay.startDate.getFullYear(),
                firstDayOfMonth = new Date(ksDay.startDate);
            firstDayOfMonth.setFullYear(year, month, 1);

            return {
                title: MONTH_NAMES[firstDayOfMonth.getMonth()] + ' ' + firstDayOfMonth.getFullYear(),
                weeks: getWeeks(firstDayOfMonth),
            }
        }

        function getDaysInMonth(year, month) {
            return month === 1 && year % 4 === 0 &&
            (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
        }

        function getDates(startDate, n) {
            var dates = new Array(n), current = new Date(startDate), i = 0, date;
            while (i < n) {
                date = new Date(current);
                dates[i++] = date;
                current.setDate(current.getDate() + 1);
            }
            return dates;
        }


        function createDateObject(date, month) {
            var day = {
                date: date,
                label: date.getDate(date),
                selected: isDateSelected(date),
                secondary: isDateSecondary(date),
                disabled: !isDateInCurrentMonth(date, month),
                customClass: getClassName(date, month),
            };

            return day;
        }

        function uniqueId() {
            return 'datepicker-day-' + Math.floor(Math.random() * 10000)
        }

        // Split array into smaller arrays
        function split(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        }

        function move(direction) {
            var year = ksDay.startDate.getFullYear() + direction * (ksDay.step.years || 0),
                month = ksDay.startDate.getMonth() + direction * (ksDay.step.months || 0);
            ksDay.startDate.setFullYear(year, month, 1);
            ksDay.months = getMonthsFromNumber(ksDay.dayOptions.numOfMonths);
        }

        function weekCount(year, month_number) {
            // month_number is in the range 0..11
            var firstOfMonth = new Date(year, month_number, 1);
            var lastOfMonth = new Date(year, month_number + 1, 0);

            var used = firstOfMonth.getDay() + lastOfMonth.getDate();

            return Math.ceil(used / 7);
        }

        function isDateInCurrentMonth(date, currentMonth) {
            return date.getMonth() === currentMonth;
        }

        function select(dateObject) {
            if (ksDay.mode === 'range') {
                selectRange(dateObject);
            } else {
                if (dateObject.selected) {
                    dateObject.customClass = 'ks-blackout-date';
                    dateObject.selected = !dateObject.selected;
                    dateObject.secondary = !dateObject.secondary;
                    ksDay.days.splice(getObjectIndexOf(ksDay.days, dateObject, 'uid'), 1);
                } else if (dateObject.secondary) {
                    dateObject.customClass = 'ks-selected-date';
                    dateObject.selected = !dateObject.selected;
                    dateObject.secondary = !dateObject.secondary;
                    ksDay.days.push(dateObject);
                }
            }
        }

        function getClassName(date, month) {
            if (isDateInCurrentMonth(date, month)) {
                if (isDateSelected(date)) {
                    return 'ks-selected-date';
                }
                if (isDateInRange(date)) {
                    return 'ks-blackout-date';
                }
            } else {
                return null;
            }
        }

        function isDateInRange(date) {
            var isInRange = false;
            if (ksDay.days.length > 1) {
                var startDate = ksDay.days[0].date;
                var endDate = ksDay.days[ksDay.days.length - 1].date;
                isInRange = (date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime());
            }

            return isInRange;
        }

        function isDateSecondary(date) {
            return isDateInRange(date) && !isDateSelected(date);
        }

        function isDateSelected(date) {
            return (ksDay.days.map(function (e) {
                return e.date.getTime()
            }).indexOf(date.getTime()) > -1);
        }

        function getObjectIndexOf(array, object, key) {
            return array.map(function (e) {
                return e[key]
            }).indexOf(object[key]);
        }

        function pushDistinctObject(array, object, key) {
            if (getObjectIndexOf(array, object, key) === -1) {
                array.push(object);
            }
        }

        function resetCalender() {
            ksDay.days = [];
            angular.forEach(ksDay.months, function (month) {
                angular.forEach(month.weeks, function (week) {
                    angular.forEach(week, function (day) {
                        day.customClass = null;
                        day.selected = false;
                    });
                });
            });

        }

        function sortMonths(a, b) {
            var aYear = a.substring(0, 4);
            var aMonth = a.substring(5, a.length);
            var bYear = b.substring(0, 4);
            var bMonth = b.substring(5, b.length);
            return aYear - bYear || aMonth - bMonth;
        }

        function selectRange(dateObject) {
            if (rangeFirstClick) {
                ksDay.resetCalender();
                dateObject.customClass = 'ks-selected-date';
                dateObject.selected = !dateObject.selected;
                ksDay.days.push(dateObject);
                rangeFirstClick = !rangeFirstClick;
            } else {
                var isInRange = false;
                if (dateObject.date.getTime() > ksDay.days[0].date.getTime()) { // if second selected date is after first date
                    Object.keys(ksDay.viewedMonths).sort(sortMonths).forEach(function (key) {
                        var month = ksDay.viewedMonths[key];
                        angular.forEach(month, function (week) {
                            angular.forEach(week, function (day) {
                                if (day.date.getTime() === ksDay.days[0].date.getTime()) {
                                    isInRange = true;
                                }
                                if (isInRange && !day.disabled) {
                                    day.customClass = 'ks-selected-date';
                                    day.selected = true;
                                    ksDay.pushDistinctObject(ksDay.days, day, 'uid');
                                }
                                if (day.date.getTime() === dateObject.date.getTime()) {
                                    isInRange = false;
                                }
                            });
                        });
                    });
                } else {
                    var viewedMonthSorted = Object.keys(ksDay.viewedMonths).sort(sortMonths);
                    for (var i = viewedMonthSorted.length - 1; i >= 0; i--) {
                        var key = viewedMonthSorted[i];
                        var month = ksDay.viewedMonths[key];
                        for (var j = month.length - 1; j >= 0; j--) {
                            var week = month[j];
                            for (var k = week.length - 1; k >= 0; k--) {
                                var day = week[k];
                                if (day.date.getTime() === ksDay.days[0].date.getTime()) {
                                    isInRange = true;
                                }
                                if (isInRange && !day.disabled) {
                                    day.customClass = 'ks-selected-date';
                                    day.selected = true;
                                    ksDay.pushDistinctObject(ksDay.days, day, 'uid');
                                }
                                if (day.date.getTime() === dateObject.date.getTime()) {
                                    isInRange = false;
                                }
                            }
                        }
                    }
                    ksDay.days.reverse();
                }
                rangeFirstClick = !rangeFirstClick;
            }
        }

        function selectAllDays(i, month) {
            console.log(i);
            console.log(month);
        }
    }
})();