describe('Component: KS-Datepicker', function () {
    "use strict";

    var DEFAULT_VALUE;
    var ksDatepickerController;
    var datePickerDateOptions;
    var selectedDatesSpy;


    beforeEach(function () {
        DEFAULT_VALUE = new Date();
        datePickerDateOptions = {};

        module('ks-datepicker');

        inject(function (_$controller_) {
            selectedDatesSpy = jasmine.createSpy('selectedDates');
            var bindings = {
                dates: DEFAULT_VALUE,
                selectedDates: selectedDatesSpy,
                dateOptions: datePickerDateOptions
            };
            ksDatepickerController = _$controller_('ksDatepickerController', null, bindings);
        });
    });

    describe('Initialization', function () {
        it('should have a valid controller injected', function () {
            expect(ksDatepickerController).toBeDefined();
        });
    });

    describe('Function calls', function () {
        it('should handle selected days and return date', function () {
            var selected = [{date: new Date(2017, 1, 1)}, {date: new Date(2017, 1, 2)}, {date: new Date(2017, 1, 3)},
                    {date: new Date(2017, 1, 4)}, {date: new Date(2017, 1, 7)}],
                secondary = [{date: new Date(2017, 1, 5)}, {date: new Date(2017, 1, 6)}];
            ksDatepickerController.handleSelectedDays(selected, secondary);
            expect(selectedDatesSpy).toHaveBeenCalled();
        });
    });
});
