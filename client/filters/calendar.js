import { _meteorAngular } from 'meteor/angular';
import moment from 'moment';

angular
  .module('salephone')
  .filter('calendar', calendar);

function calendar () {
  return function (time) {
    if (!time) return;

    return moment(time).calendar(null, {
      lastDay : '[Hier]',
      sameDay : '[Moins de 24h], LT',
      lastWeek : 'll',
      sameElse : 'll'
    });
  };
}
