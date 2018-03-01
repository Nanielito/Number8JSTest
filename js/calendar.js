$(function () {
  var DATE_FORMAT_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;
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

  $('#createCalendars').on('click', function (event) {
    event.preventDefault();

    var startDateString = $('input#startDate').val();
    var numberOfDays = parseInt($('input#numberOfDays').val());
    var countryCode = $('input#countryCode').val();

    if (isValidDate(startDateString) === true) {

    }
    else {
      alert('You must enter a valid date format.')
    }

    return false;
  });

  return false;
});