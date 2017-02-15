'use strict';

(function() {
    angular.module('ks-datepicker').controller('DemoController', DemoController);

    function DemoController() {
        var demoDate = this;

        demoDate.selectedDates = selectedDates;

        function selectedDates(dates){
            demoDate.dates = dates;
        }
    }
})();