'use strict';

(function(){
    var ksDatepicker = {
        templateUrl: '/ks-datepicker/src/ks-datepicker/ks-datepicker.html',
        controller: 'ksDatepickerController',
        controllerAs: 'ksDatepicker',
        bindings: {
            dates: '<',
            dateOptions: '<',
            selectedDates: '&'
        }
    };
    angular.module('ks-datepicker').component('ksDatepicker', ksDatepicker);
})();
