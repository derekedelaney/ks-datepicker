'use strict';

(function(){
    var ksDay = {
        templateUrl: '/ks-datepicker/src/ks-datepicker/ks-day/ks-day.html',
        controller: 'ksDayController',
        controllerAs: 'ksDay',
        bindings: {
            days: '<',
            dayOptions: '<',
            selectedDays: '&'
        }
    };
    angular.module('ks-datepicker').component('ksDay', ksDay);
})();
