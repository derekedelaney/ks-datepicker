'use strict';

(function() {
    angular.module('ks-datepicker').controller('ksDatepickerController', ksDatepickerController);

    /**
     * Datepicker component for selecting dates to be
     * used in creating promotions throughout the application
     * @constructor
     */
    function ksDatepickerController() {
        var ksDatepicker = this;

        ksDatepicker.init = init;
        ksDatepicker.setupDays = setupDays;
        ksDatepicker.handleSelectedDays = handleSelectedDays;

        function init() {
            if(!ksDatepicker.dates){

            }

            ksDatepicker.dayOptions = {numOfMonths: 3, modeOptions: ['range', 'secondary', 'multi-select'], tableHeader: 'Travel Dates'};
        }
        init();

        function setupDays() {

        }

        function handleSelectedDays(selected, secondary) {
            var justSelectedDates = selected.map(function (e) { return e.date; }).sort(function (a, b) { return a.getTime() - b.getTime(); });
            var justSecondaryDates = secondary.map(function (e) { return e.date; }).sort(function (a, b) { return a.getTime() - b.getTime(); });
            var justDates = {selected: justSelectedDates, secondary: justSecondaryDates};
            ksDatepicker.selectedDates({$value: justDates});
        }

    }
})();