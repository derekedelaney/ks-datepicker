'use strict';

(function () {
    angular.module('ks-datepicker').controller('ksDayController', ksDayController);

    /**
     * ks Day component for selecting dates
     * @constructor
     * @ngInject
     */
    function ksDayController($locale) {
        var MONTH_NAMES = $locale.DATETIME_FORMATS.MONTH;
        var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var rangeFirstClick = true;
        var ksDay = this;
        ksDay.step = {months: 1};
        ksDay.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
        ksDay.DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        ksDay.viewedMonths = {};
        ksDay.modeOptions = [];

        ksDay.createDateObject = createDateObject;
        ksDay.createMonthObject = createMonthObject;
        ksDay.getClassName = getClassName;
        ksDay.getDates = getDates;
        ksDay.getDaysInMonth = getDaysInMonth;
        ksDay.getMonthsFromNumber = getMonthsFromNumber;
        ksDay.getObjectIndexOf = getObjectIndexOf;
        ksDay.getWeeks = getWeeks;
        ksDay.init = init;
        ksDay.isDateInCurrentMonth = isDateInCurrentMonth;
        ksDay.isDateSecondary = isDateSecondary;
        ksDay.isDateSelected = isDateSelected;
        ksDay.move = move;
        ksDay.multiSelect = multiSelect;
        ksDay.pushDistinctObject = pushDistinctObject;
        ksDay.resetCalendar = resetCalendar;
        ksDay.secondarySelect = secondarySelect;
        ksDay.select = select;
        ksDay.selectRange = selectRange;
        ksDay.setupOptions = setupOptions;
        ksDay.sortMonths = sortMonths;
        ksDay.split = split;
        ksDay.uniqueId = uniqueId;
        ksDay.weekCount = weekCount;

        ksDay.init();

        /**
         * @name createDateObject
         * @desc Creates a date object to be used with the calendar.
         * @param date - A javascript date to make an object out of.
         * @param month - A number representation on the month <i>0..11</i>.
         * @returns {{date: *, label: (*|number|string), selected: *, secondary: *, disabled: boolean, customClass: *}}
         */
        function createDateObject(date, month) {
            return {
                date: date,
                label: date.getDate(),
                selected: ksDay.isDateSelected(date),
                secondary: ksDay.isDateSecondary(date),
                disabled: !ksDay.isDateInCurrentMonth(date, month),
                customClass: ksDay.getClassName(date, month),
            };
        }

        /**
         * @name createMonthObject
         * @desc Creates a month object for the calendar.
         * @param month - A number representation on the month <i>0..11</i>.
         * @returns {{title: string, weeks: *}}
         */
        function createMonthObject(month) {
            var year = ksDay.startDate.getFullYear(),
                firstDayOfMonth = new Date(ksDay.startDate);
            firstDayOfMonth.setFullYear(year, month, 1);

            return {
                title: MONTH_NAMES[firstDayOfMonth.getMonth()] + ' ' + firstDayOfMonth.getFullYear(),
                weeks: ksDay.getWeeks(firstDayOfMonth),
            };
        }

        /**
         * @name getClassName
         * @desc Gets a class name for the button to display.
         * @param date - The date being created.
         * @param month - The month that the date is in.
         * @returns {*}
         */
        function getClassName(date, month) {
            if (ksDay.isDateInCurrentMonth(date, month)) {
                if (ksDay.isDateSelected(date)) {
                    return 'ks-selected-date';
                }
                if (ksDay.isDateSecondary(date)){
                    return 'ks-secondary-date';
                }
            } else {
                return null;
            }
        }

        /**
         * @name getDates
         * @desc Gets the dates from a start date passed in to a number <i>n</i>
         * @param startDate - The date to start.
         * @param n - The number of dates after.
         * @returns {Array}
         */
        function getDates(startDate, n) {
            var dates = new Array(n), current = new Date(startDate), i = 0, date;
            while (i < n) {
                date = new Date(current);
                dates[i++] = date;
                current.setDate(current.getDate() + 1);
            }
            return dates;
        }

        /**
         * @name getDaysInMonth
         * @desc Gets the number of days in a month given the year and checks for leap year.
         * @param year - The year the month is in.
         * @param month - The month to get the days in.
         * @returns {number}
         */
        function getDaysInMonth(year, month) {
            return month === 1 && year % 4 === 0 &&
            (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
        }

        /**
         * @name getMonthsFromNumber
         * @desc Create the months to show based on a number.
         * @param n - The number of months to create and show.
         * @returns {Array}
         */
        function getMonthsFromNumber(n) {
            var months = new Array(n);
            var startMonth = ksDay.startDate.getMonth();

            for (var i = 0; i < months.length; i++){
                months[i] = (ksDay.createMonthObject(startMonth + i));
            }

            return months;
        }

        /**
         * @name getObjectIndexOf
         * @desc Gets an index of an array with a given key in the object.
         * @param array - The array to find the index of.
         * @param object - The Object to search for.
         * @param key - The key to get the property from the object.
         */
        function getObjectIndexOf(array, object, key) {
            return array.map(function (e) {
                return e[key];
            }).indexOf(object[key]);
        }

        /**
         * @name getWeeks
         * @desc Gets the dates in the weeks of a month.
         * @param firstDayOfMonth - The start of the month.
         * @returns {*}
         */
        function getWeeks(firstDayOfMonth) {
            var NUM_OF_WEEKS = ksDay.weekCount(firstDayOfMonth.getFullYear(), (firstDayOfMonth.getMonth()));

            var difference = ksDay.startingDay - firstDayOfMonth.getDay(),
                numDisplayedFromPreviousMonth = difference > 0 ?
                    7 - difference : -difference,
                firstDate = new Date(firstDayOfMonth);

            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }

            var days = ksDay.getDates(firstDate, (NUM_OF_WEEKS * 7));
            for (var i = 0; i < (NUM_OF_WEEKS * 7); i++) {
                days[i] = angular.extend(ksDay.createDateObject(days[i], firstDayOfMonth.getMonth()), {
                    uid: ksDay.uniqueId(days[i]),
                });
            }
            var weeks = ksDay.split(days, 7);
            ksDay.viewedMonths[firstDayOfMonth.getFullYear() + '-' + firstDayOfMonth.getMonth()] = weeks;
            return weeks;
        }

        /**
         * @name init
         * @desc Initializes the controller.
         */
        function init() {
            ksDay.setupOptions();
            if (ksDay.days && ksDay.days.length > 0) {
                ksDay.startDate = ksDay.days[0];
            } else {
                var now = new Date();
                ksDay.startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
                ksDay.days = [];
            }
            ksDay.secondaryDays = [];
            ksDay.months = ksDay.getMonthsFromNumber(ksDay.dayOptions.numOfMonths);
        }

        /**
         * @name isDateInCurrentMonth
         * @desc Checks if the date is in the current month.
         * @param date - The date being checked.
         * @param currentMonth - The month being checked.
         * @returns {boolean}
         */
        function isDateInCurrentMonth(date, currentMonth) {
            return date.getMonth() === currentMonth;
        }

        /**
         * @name isDateSecondary
         * @desc Checks if the date is secondary.
         * @param date - The date being checked.
         * @returns {boolean}
         */
        function isDateSecondary(date) {
            return (ksDay.getObjectIndexOf(ksDay.secondaryDays, {uid: date.getTime()}, 'uid') > -1) && !ksDay.isDateSelected(date);
        }

        /**
         * @name isDateSelected
         * @desc Checks if the date is selected.
         * @param date - The date being checked.
         * @returns {boolean}
         */
        function isDateSelected(date) {
            return (ksDay.days.map(function (e) {
                return e.date.getTime();
            }).indexOf(date.getTime()) > -1);
        }

        /**
         * @name move
         * @desc Moves the calender in the direction passed in.
         * @param direction - The number of months to move. Positive to move right, negative to move left.
         */
        function move(direction) {
            var year = ksDay.startDate.getFullYear() + direction * (ksDay.step.years || 0),
                month = ksDay.startDate.getMonth() + direction * (ksDay.step.months || 0);
            ksDay.startDate.setFullYear(year, month, 1);
            ksDay.months = ksDay.getMonthsFromNumber(ksDay.dayOptions.numOfMonths);
        }

        /**
         * @name multiSelect
         * @desc Handles the click when multi-select option is selected.
         * @param dateObject - The date object that was selected.
         */
        function multiSelect(dateObject) {
            if (dateObject.selected) {
                dateObject.customClass = null;
                dateObject.selected = !dateObject.selected;
                ksDay.days.splice(getObjectIndexOf(ksDay.days, dateObject, 'uid'), 1);
            } else if (dateObject.secondary) {
                dateObject.customClass = 'ks-selected-date';
                dateObject.selected = !dateObject.selected;
                dateObject.secondary = !dateObject.secondary;
                ksDay.days.push(dateObject);
                ksDay.secondaryDays.splice(getObjectIndexOf(ksDay.secondaryDays, dateObject, 'uid'), 1);
            } else {
                dateObject.customClass = 'ks-selected-date';
                dateObject.selected = !dateObject.selected;
                ksDay.days.push(dateObject);
            }
        }

        /**
         * @name pushDistinctObject
         * @desc Pushes the object to the array if it doesn't exists in the array.
         * @param array - The array the object is being added to.
         * @param object - The object being added to the array.
         * @param key - The key to check if its distinct, usually a unique identification.
         */
        function pushDistinctObject(array, object, key) {
            if (ksDay.getObjectIndexOf(array, object, key) === -1) {
                array.push(object);
            }
        }

        /**
         * @name resetCalender
         * @desc Resets the calendars objects.
         */
        function resetCalendar() {
            ksDay.days = [];
            ksDay.secondaryDays = [];
            angular.forEach(ksDay.months, function (month) {
                angular.forEach(month.weeks, function (week) {
                    angular.forEach(week, function (day) {
                        day.customClass = null;
                        day.selected = false;
                        day.secondary = false;
                    });
                });
            });
        }

        /**
         * @name secondarySelect
         * @desc Handles the click on a secondary click.
         * @param dateObject - The date object that was selected.
         */
        function secondarySelect(dateObject) {
            if (dateObject.selected) {
                dateObject.customClass = 'ks-secondary-date';
                dateObject.selected = !dateObject.selected;
                dateObject.secondary = !dateObject.secondary;
                ksDay.days.splice(getObjectIndexOf(ksDay.days, dateObject, 'uid'), 1);
                ksDay.secondaryDays.push(dateObject);
            } else if (dateObject.secondary) {
                dateObject.customClass = 'ks-selected-date';
                dateObject.selected = !dateObject.selected;
                dateObject.secondary = !dateObject.secondary;
                ksDay.days.push(dateObject);
                ksDay.secondaryDays.splice(getObjectIndexOf(ksDay.secondaryDays, dateObject, 'uid'), 1);
            }
        }

        /**
         * @name select
         * @desc the click event for selecting a day.
         * @param dateObject - The date object that was selected.
         */
        function select(dateObject) {
            switch (ksDay.mode){
                case 'range':
                    ksDay.selectRange(dateObject);
                    break;
                case 'secondary':
                    rangeFirstClick = true;
                    ksDay.secondarySelect(dateObject);
                    break;
                case 'multi-select':
                    rangeFirstClick = true;
                    ksDay.multiSelect(dateObject);
                    break;
            }
            ksDay.selectedDays({selected: ksDay.days, secondary: ksDay.secondaryDays});
        }

        /**
         * @name selectRange
         * @desc Handles the logic for selecting a rang of dates.
         * @param dateObject - The date object that was selected.
         */
        function selectRange(dateObject) {
            if (rangeFirstClick) {
                ksDay.resetCalendar();
                dateObject.customClass = 'ks-selected-date';
                dateObject.selected = !dateObject.selected;
                ksDay.days.push(dateObject);
                rangeFirstClick = !rangeFirstClick;
            } else {
                if (dateObject.date.getTime() > ksDay.days[0].date.getTime()) { // if second selected date is after first date
                    Object.keys(ksDay.viewedMonths).sort(ksDay.sortMonths).forEach(function (key) {
                        var month = ksDay.viewedMonths[key];
                        angular.forEach(month, function (week) {
                            angular.forEach(week, function (day) {
                                if (day.date.getTime() >= ksDay.days[0].date.getTime() && day.date.getTime() <= dateObject.date.getTime()) {
                                    if (!day.disabled) {
                                        day.customClass = 'ks-selected-date';
                                        day.selected = true;
                                        ksDay.pushDistinctObject(ksDay.days, day, 'uid');
                                    }
                                }
                            });
                        });
                    });
                } else {
                    var viewedMonthSorted = Object.keys(ksDay.viewedMonths).sort(ksDay.sortMonths);
                    for (var i = viewedMonthSorted.length - 1; i >= 0; i--) {
                        var key = viewedMonthSorted[i];
                        var month = ksDay.viewedMonths[key];
                        for (var j = month.length - 1; j >= 0; j--) {
                            var week = month[j];
                            for (var k = week.length - 1; k >= 0; k--) {
                                var day = week[k];
                                if (day.date.getTime() <= ksDay.days[0].date.getTime() && day.date.getTime() >= dateObject.date.getTime()) {
                                    if (!day.disabled) {
                                        day.customClass = 'ks-selected-date';
                                        day.selected = true;
                                        ksDay.pushDistinctObject(ksDay.days, day, 'uid');
                                    }
                                }
                            }
                        }
                    }
                    ksDay.days.reverse();
                }
                rangeFirstClick = !rangeFirstClick;
            }
        }

        /**
         * @name setupOptions
         * @desc Sets up the day options and sets defaults when none are passed in.
         */
        function setupOptions() {
            [
                'numOfMonths',
                'modeOptions',
            ].forEach(function (key) {
                switch (key) {
                    case 'numOfMonths':
                        ksDay.dayOptions[key] = ksDay.dayOptions[key] || 1;
                        break;
                    case 'modeOptions':
                        ksDay.modeOptions = ksDay.dayOptions[key] || ['range'];
                        ksDay.dayOptions[key] = ksDay.dayOptions[key] || ['range'];
                        ksDay.modeOptions = ksDay.modeOptions.filter(function (mode) {
                            return (mode === 'multi-select' || mode === 'secondary' || mode === 'range');
                        });
                        ksDay.mode = ksDay.modeOptions[0];
                        break;
                }
            });
        }

        /**
         * @name sortMonths
         * @desc A function to use with javascript sort call that sorts dates by year then month.
         * @param a
         * @param b
         * @returns {number}
         */
        function sortMonths(a, b) {
            var aYear = a.substring(0, 4);
            var aMonth = a.substring(5, a.length);
            var bYear = b.substring(0, 4);
            var bMonth = b.substring(5, b.length);
            return aYear - bYear || aMonth - bMonth;
        }

        /**
         * @name split
         * @desc Splits the array into smaller arrays.
         * @param arr
         * @param size
         * @returns {Array}
         */
        function split(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        }

        /**
         * @name uniqueId
         * @desc gets a uniqueId for the date object.
         * @param date
         * @returns {number}
         */
        function uniqueId(date) {
            return date.getTime();
        }

        /**
         * @name weekCount
         * @desc Gets the number of weeks in a month in a year.
         * @param year
         * @param monthNumber
         * @returns {number}
         */
        function weekCount(year, monthNumber) {
            // month_number is in the range 0..11
            var firstOfMonth = new Date(year, monthNumber, 1);
            var lastOfMonth = new Date(year, monthNumber + 1, 0);

            var used = firstOfMonth.getDay() + lastOfMonth.getDate();

            return Math.ceil(used / 7);
        }
    }
})();
