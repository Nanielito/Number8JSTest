$(function () {
  $('#createCalendars').on('click', function (event) {
    event.preventDefault();

    var startDateString = $('input#startDate').val();
    var numberOfDays = parseInt($('input#numberOfDays').val());
    var countryCode = $('input#countryCode').val();

    return false;
  });

  return false;
});