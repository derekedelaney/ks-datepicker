describe('Component: Day picker', function () {
    'use strict';

    var DEFAULT_DAYS;
    var ksDayController;
    var DEFAULT_DAY_OPTIONS;
    var selectedDaysSpy;
    var now = new Date();
    var startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);


    beforeEach(function () {
        module('ks-datepicker');
        inject(function (_$controller_) {
            selectedDaysSpy = jasmine.createSpy('selectedDaysSpy');
            DEFAULT_DAY_OPTIONS = {numOfMonths: 3, modeOptions: ['range', 'secondary'], tableHeader: 'Travel Dates'};
            var bindings = {
                days: DEFAULT_DAYS,
                dayOptions: DEFAULT_DAY_OPTIONS,
                selectedDays: selectedDaysSpy,
            };
            ksDayController = _$controller_('ksDayController', null, bindings);
        });
    });

    describe('Initialization', function () {
        it('should have a valid controller injected', function () {
            expect(ksDayController).toBeDefined();
        });

        it('should set the start date to today if none are passed in', function () {
            expect(ksDayController.startDate.getTime()).toEqual(startDate.getTime());
        });
    });

    describe('Function calls', function () {
        it('should create a new date object when a date and month is passed in', function () {
            spyOn(ksDayController, 'isDateSelected').and.returnValue(false);
            spyOn(ksDayController, 'isDateSecondary').and.returnValue(false);
            spyOn(ksDayController, 'isDateInCurrentMonth').and.returnValue(true);
            spyOn(ksDayController, 'getClassName').and.returnValue(null);
            var expected = {date: now, label: now.getDate(), selected: false, secondary: false, disabled: false, customClass: null};
            var actual = ksDayController.createDateObject(now, 2);
            expect(actual).toEqual(expected);
        });

        it('should create a new month object when a month integer is passed in', function () {
            spyOn(ksDayController, 'getWeeks').and.returnValue([[],[],[],[],[]]);
            var expectedTitle = 'title';
            var expectedWeeks = {weeks: 5};
            var actual = ksDayController.createMonthObject(2);
            expect(actual.hasOwnProperty(expectedTitle)).toBeTruthy();
            expect(actual.hasOwnProperty(Object.keys(expectedWeeks)[0])).toBeTruthy();
            expect(actual.weeks.length).toBe(expectedWeeks.weeks);
        });

        it('should return a class name if the date is in the current month and the date is selected', function () {
            spyOn(ksDayController, 'isDateSelected').and.returnValue(true);
            var expected = 'ks-selected-date';
            var actual = ksDayController.getClassName(now, 1);
            expect(actual).toBe(expected);
        });

        it('should return a class name if the date is in the current month and the date is secondary', function () {
            spyOn(ksDayController, 'isDateSecondary').and.returnValue(true);
            var expected = 'ks-secondary-date';
            var actual = ksDayController.getClassName(now, 1);
            expect(actual).toBe(expected);
        });

        it('should get an array of dates starting with a date and number of days passed in', function () {
            var expected = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 6, 0, 0, 0).getDate();
            var actual = ksDayController.getDates(now, 7);
            expect(actual[actual.length-1].getDate()).toEqual(expected);
        });

        it('should get the number of days in a month when a yeah and month are passed in', function () {
            var expected = 28;
            var actual = ksDayController.getDaysInMonth(2100, 1);
            expect(actual).toBe(expected);

            var expectedLeap = 29;
            var actualLeap = ksDayController.getDaysInMonth(2016, 1);
            expect(actualLeap).toBe(expectedLeap);
        });

        it('should get the number of months and month objects from a number passed in', function () {
            var num = 3;
            spyOn(ksDayController, 'createMonthObject').and.returnValue(new Array(num));
            var expectedMonths = num;
            var actualMonths = ksDayController.getMonthsFromNumber(num);
            expect(actualMonths.length).toBe(expectedMonths);
        });

        it('should get the index of an object of an array', function () {
            var array = [{id:1, name: 'bob1'}, {id:2, name: 'bob2'}, {id:3, name: 'bob3'}, {id:4, name: 'bob4'}];
            var obj = {id:2, name: 'bob2'};
            var expected = 1;
            var actual = ksDayController.getObjectIndexOf(array, obj, 'id');
            expect(actual).toBe(expected);

            var expectedFalsy = -1;
            var actualFalsy = ksDayController.getObjectIndexOf(array, {}, 'id');
            expect(actualFalsy).toBe(expectedFalsy);
        });

        it('should get the weeks of a month given the first day of the month', function () {
            spyOn(ksDayController, 'weekCount').and.returnValue(2);
            spyOn(ksDayController, 'getDates').and.returnValue(new Array(14));
            spyOn(ksDayController, 'createDateObject').and.returnValue({});
            spyOn(ksDayController, 'uniqueId').and.returnValue(1);
            spyOn(ksDayController, 'split').and.returnValue([new Array(7), new Array(7)]);

            var expected = (new Array(2));
            ksDayController.startingDay = now;
            var actual = ksDayController.getWeeks(new Date('2017-01-01'));
            expect(actual.length).toBe(expected.length);
        });

        it('should test the initialization function', function () {
            spyOn(ksDayController, 'setupOptions').and.returnValue(null);
            spyOn(ksDayController, 'getMonthsFromNumber').and.returnValue([]);
            var date = new Date(0,0,0,0,0,0);
            date.setYear(2017);
            date.setUTCMonth(2);
            date.setUTCDate(5);

            ksDayController.days = [date, new Date()];
            ksDayController.init();
            expect(ksDayController.startDate).toEqual(date);
        });

        it('should check if the date is in the current month', function () {
            expect(ksDayController.isDateInCurrentMonth(now, now.getMonth())).toBeTruthy();
            expect(ksDayController.isDateInCurrentMonth(now, now.getMonth()-1)).toBeFalsy();
        });

        it('should check if the date is secondary', function () {
            spyOn(ksDayController, 'getObjectIndexOf').and.returnValue(true);
            spyOn(ksDayController, 'isDateSelected').and.returnValue(false);
            expect(ksDayController.isDateSecondary(now)).toBeTruthy();
        });

        it('should check if the date is secondary', function () {
            spyOn(ksDayController, 'getObjectIndexOf').and.returnValue(false);
            spyOn(ksDayController, 'isDateSelected').and.returnValue(true);
            expect(ksDayController.isDateSecondary(now)).toBeFalsy();
        });

        it('should check if the date is selected', function () {
            ksDayController.days = [{date: now}];
            expect(ksDayController.isDateSelected(now)).toBeTruthy();
            ksDayController.days = [{date: new Date()}];
            expect(ksDayController.isDateSelected(now)).toBeFalsy();
        });

        it('should handle the move click event', function () {
            ksDayController.step = {};
            ksDayController.move(1);
            expect(ksDayController.months.length).toBe(3);
        });

        it('should handle the multi select event', function () {
            var dateObjectSelected = {uid: 1, date: now, selected: true};
            var expectedSelected = [];
            ksDayController.days = [dateObjectSelected];
            ksDayController.multiSelect(dateObjectSelected);
            expect(ksDayController.days).toEqual(expectedSelected);

            var dateObjectSecondary = {uid: 1, date: now, secondary: true};
            var expectedSecondary = [];
            ksDayController.secondaryDays = [dateObjectSecondary];
            ksDayController.multiSelect(dateObjectSecondary);
            expect(ksDayController.secondaryDays).toEqual(expectedSecondary);
            expect(ksDayController.days).toEqual([{ uid: 1, date: now, secondary: false, customClass: 'ks-selected-date', selected: true }]);

            var dateObject = {uid: 1, date: now, selected: false};
            ksDayController.days = [];
            ksDayController.multiSelect(dateObject);
            expect(ksDayController.days).toEqual([{ uid: 1, date: now, selected: true, customClass: 'ks-selected-date' }]);
        });

        it('should push a distinct object to an array', function () {
            var array = [{id:1}, {id:2}];
            var obj = {id:1};
            var distinctObject = {id:3};
            ksDayController.pushDistinctObject(array, obj, 'id');
            expect(array).toEqual(array);
            ksDayController.pushDistinctObject(array, distinctObject, 'id');
            expect(array).toEqual([{id:1}, {id:2}, {id:3}]);
        });

        it('should reset the calendar', function () {
            ksDayController.days = [{id:1}, {id:2}, {id:3}];
            ksDayController.resetCalendar();
            expect(ksDayController.days).toEqual([]);
        });

        it('should handle the secondary select event', function () {
            var dateObjectSelected = {uid: 1, date: now, selected: true};
            var expectedSelected = [];
            ksDayController.days = [dateObjectSelected];
            ksDayController.secondarySelect(dateObjectSelected);
            expect(ksDayController.days).toEqual(expectedSelected);

            var dateObjectSecondary = {uid: 1, date: now, secondary: true};
            var expectedSecondary = [];
            ksDayController.secondaryDays = [dateObjectSecondary];
            ksDayController.secondarySelect(dateObjectSecondary);
            expect(ksDayController.secondaryDays).toEqual(expectedSecondary);
            expect(ksDayController.days).toEqual([{ uid: 1, date: now, secondary: false, customClass: 'ks-selected-date', selected: true }]);

            var dateObject = {uid: 1, date: now, selected: false};
            ksDayController.days = [];
            ksDayController.secondarySelect(dateObject);
            expect(ksDayController.days).toEqual([]);
        });

        it('should call the selected days callback function on selected', function () {
            spyOn(ksDayController, 'selectRange').and.callFake(function(){});
            spyOn(ksDayController, 'secondarySelect').and.callFake(function(){});
            spyOn(ksDayController, 'multiSelect').and.callFake(function(){});

            ksDayController.mode = 'range';
            ksDayController.select();
            expect(selectedDaysSpy).toHaveBeenCalled();

            ksDayController.mode = 'secondary';
            ksDayController.select();
            expect(selectedDaysSpy).toHaveBeenCalled();

            ksDayController.mode = 'multi-select';
            ksDayController.select();
            expect(selectedDaysSpy).toHaveBeenCalled();
        });

        describe('select range event', function () {
            var date = new Date(2017, 1, 28, 0, 0, 0);
            var otherDate = new Date(2017, 2, 3, 0, 0, 0);
            var otherDate2 = new Date(2017, 0, 29, 0, 0, 0);
            var dateObject = { uid: 1, date: date, secondary: false, customClass: null, selected: false };
            var dateObject2 = { uid: 2, date: otherDate, secondary: false, customClass: null, selected: false };
            var dateObject3 = { uid: 2, date: otherDate2, secondary: false, customClass: null, selected: false };
            it('should handle the ranges first click', function () {
                var expectedObject = { uid: 1, date: date, secondary: false, customClass: 'ks-selected-date', selected: true };
                spyOn(ksDayController, 'resetCalendar');
                ksDayController.selectRange(dateObject);
                expect(ksDayController.resetCalendar).toHaveBeenCalled();
                expect(dateObject).toEqual(expectedObject);
                expect(ksDayController.days[0]).toEqual(expectedObject);
            });

            it('should handle the positive ranges second click', function () {
                ksDayController.selectRange(dateObject); //call once to toggle second click
                ksDayController.selectRange(dateObject2);
                expect(ksDayController.days.length).toBe(5);
            });

            it('should handle the negative ranges second click', function () {
                ksDayController.selectRange(dateObject); //call once to toggle second click
                ksDayController.selectRange(dateObject3);
                expect(ksDayController.days.length).toBe(29);
            });
        });

        describe('setting up day options', function () {
            beforeEach(function () {
                inject(function (_$controller_) {
                    selectedDaysSpy = jasmine.createSpy('selectedDaysSpy');
                    DEFAULT_DAY_OPTIONS = {numOfMonths: null, modeOptions: null, tableHeader: 'Travel Dates'};
                    var bindings = {
                        days: DEFAULT_DAYS,
                        dayOptions: DEFAULT_DAY_OPTIONS,
                        selectedDays: selectedDaysSpy,
                    };
                    ksDayController = _$controller_('ksDayController', null, bindings);
                });
            });
            it('should set the day options to default', function () {
                expect(ksDayController.dayOptions.numOfMonths).toBe(1);
                expect(ksDayController.dayOptions.modeOptions).toEqual(['range']);
            });

            it('should handle multi-select, secondary and range mode', function () {
                ksDayController.dayOptions = {numOfMonths: null, modeOptions: ['range', 'secondary', 'blah'], tableHeader: 'Travel Dates'};
                ksDayController.setupOptions();
                expect(ksDayController.modeOptions).toEqual(['range', 'secondary']);
            });
        });
    });
});
