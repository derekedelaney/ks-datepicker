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

        function init() {
            if(!ksDatepicker.dates){

            }

            ksDatepicker.dayOptions = {numOfMonths: 3}
        }
        init();

        function setupDays() {

        }
    }
})();