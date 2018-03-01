$(function () {
  var DATE_FORMAT_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var YYYY = 0;
  var MM = 1;
  var DD = 2;

  function splitDateString(dateString) {
    var mmddyyyy = dateString.split('/');
    var month = parseInt(mmddyyyy[0]) - 1;
    var day = parseInt(mmddyyyy[1]);
    var year = parseInt(mmddyyyy[2]);

    return [year, month, day];
  };

  function parseDateString(dateString) {
    var data = splitDateString(dateString);

    return new Date(data[YYYY], data[MM], data[DD]);
  };

  function isValidDateFormat(dateString) {
    return DATE_FORMAT_PATTERN.test(dateString);
  };

  function isValidDate(dateString) {
    var isValid = false;

    if (isValidDateFormat(dateString) === true) {
      var data = splitDateString(dateString);
      var date = new Date(data[YYYY], data[MM], data[DD]);

      if (date.getFullYear() === data[YYYY] && date.getMonth() === data[MM] && date.getDate() == data[DD]) {
        isValid = true;
      }
    }

    return isValid;
  };

  function getFinishDate(startDate, numberOfDays) {
    var finishDate = new Date(startDate);

    finishDate.setDate(finishDate.getDate() + numberOfDays);

    return finishDate;
  };

  function getAllMonths() {
    var months = [];

    for (var i = 0; i < 12; i += 1) {
      months.push(i);
    }

    return months;
  };

  function getMonths(startMonth, finishMonth) {
    var months = [];

    for (var i = startMonth; i <= finishMonth; i += 1) {
      months.push(i);
    }

    return months;
  };

  function calculateCalendars(startDate, finishDate) {
    var calendars = {};
    var years = finishDate.getFullYear() - startDate.getFullYear();

    for (var i = startDate.getFullYear(); i <= finishDate.getFullYear(); i += 1) {
      if (i === startDate.getFullYear()) {
        if (years === 0) {
          calendars[i] = getMonths(startDate.getMonth(), finishDate.getMonth());
        }
        else {
          calendars[i] = getMonths(startDate.getMonth(), 11);
        }
      }
      else if (i === finishDate.getFullYear()) {
        calendars[i] = getMonths(0, finishDate.getMonth());
      }
      else {
        calendars[i] = getAllMonths();
      }
    }

    return calendars;
  };

  function createDatepickersContainers(year, months, displayYear) {
    var html = '<div class="col-md-14 mx-auto">';

    if (displayYear === true) {
      html = html.concat('<div class="text-center"><span>', year, '</span></div>');
    }

    for (var i = 0; i < months.length; i += 1) {
      html = html.concat('<div class="datepicker ', year, MONTHS[months[i]], '"></div>');
    }

    html = html.concat('</div>');

    return html;
  };

  function prepare(startDateString, numberOfDays, countryCode, calendarsContainer) {
    var startDate = parseDateString(startDateString);
    var finishDate = getFinishDate(startDate, numberOfDays);
    var calendars = calculateCalendars(startDate, finishDate);
    var years = Object.keys(calendars);
    var html = '';

    for (var i = 0; i < years.length; i += 1) {
      html = html.concat(createDatepickersContainers(years[i], calendars[years[i]], years.length > 1));
    }

    calendarsContainer.append(html);

    return false;
  };

  $('#createCalendars').on('click', function (event) {
    event.preventDefault();

    var startDateString = $('input#startDate').val();
    var numberOfDays = parseInt($('input#numberOfDays').val());
    var countryCode = $('input#countryCode').val();
    var calendarsContainer = $('div#calendarsContainer');

    if (isValidDate(startDateString) === true) {
      prepare(startDateString, numberOfDays, countryCode, calendarsContainer);
    }
    else {
      alert('You must enter a valid date format.')
    }

    return false;
  });

  return false;
});