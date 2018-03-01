$(function () {
  var DATE_FORMAT_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var HOLIDAY_API_URL = 'https://holidayapi.com/v1/holidays';
  var HOLIDAY_API_KEY = '77be14b0-5b6f-4589-8306-9b0005fdbd90';
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

  function buildDatepicker(identifier, defaultDate) {
    var selector = '.'.concat(identifier);

    $(selector).datepicker({
      changeMonth: false,
      changeYear: false,
      dateFormat: 'yyyy-mm-dd',
      defaultDate: defaultDate,
      beforeShowDay: function (date) {
        var days = [];
        return days;
      }
    });

    $(selector.concat(' .ui-datepicker-prev')).hide();
    $(selector.concat(' .ui-datepicker-next')).hide();
    $(selector.concat(' .ui-datepicker-year')).hide();
    $(selector.concat(' .ui-datepicker-calendar thead')).hide();
    $(selector.concat(' .ui-datepicker-calendar tbody td')).attr('onclick', '').unbind('click');

    $.each($(selector.concat(' .ui-datepicker-calendar tbody td')), function () {
      $(this).removeClass('ui-state-disabled');

      if ($(this).hasClass('ui-datepicker-other-month') === true) {
        $(this).html('');
        $(this).prepend('<span class="ui-state-default invalid"></span>');
      }
      else if ($(this).hasClass('ui-datepicker-week-end') === true) {
        $(this).addClass('weekend');
      }
      else {
        $(this).addClass('weekday');
      }
    });

    return false;
  };

  function buildDatepickers(year, months) {
    for (var i = 0; i < months.length; i += 1) {
      var identifier = ''.concat(year, MONTHS[months[i]]);
      var defaultDate = new Date(year, months[i], 1);

      buildDatepicker(identifier, defaultDate);
    }

    return false;
  };

  function validateDaysLowerRange(days, startDate) {
    var dayContainer = null;
    var daySpanContainer = null;

    for (var i = 0; i < days.length; i += 1) {
      dayContainer = $(days[i]);
      daySpanContainer = dayContainer.find('span');

      if (parseInt(daySpanContainer.text()) !== startDate.getDate()) {
        daySpanContainer.text('');
        dayContainer.removeClass('weekday').removeClass('weekend');
        daySpanContainer.addClass('invalid');
      }
      else {
        break;
      }
    }

    return false;
  };

  function validateDaysUpperRange(days, finishDate) {
    var dayContainer = null;
    var daySpanContainer = null;

    for (var i = days.length - 1; i >= 0; i -= 1) {
      dayContainer = $(days[i]);
      daySpanContainer = dayContainer.find('span');

      if (parseInt(daySpanContainer.text()) !== finishDate.getDate()) {
        daySpanContainer.text('');
        dayContainer.removeClass('weekday').removeClass('weekend');
        daySpanContainer.addClass('invalid');
      }
      else {
        break;
      }
    }

    return false;
  };

  function validateDatepickerDays(year, month, startDate, finishDate) {
    var selector = '.'.concat(year, MONTHS[month]);
    var days = $(selector.concat(' .ui-datepicker-calendar tbody td')).filter(function (i, e) {
      var value = false;

      if ($(e).hasClass('ui-datepicker-other-month') === false) {
        var dayValue = $(e).find('span').text();
        var id = ''.concat(
          year,
          '-',
          (month < 9 ? '0'.concat(month + 1): month + 1),
          '-',
          (dayValue.length === 1 ? '0'.concat(dayValue) : dayValue));

        $(e).attr('id', id);

        value = true;
      }

      return value;
    });

    if (year === startDate.getFullYear() && month === startDate.getMonth()) {
      validateDaysLowerRange(days, startDate);
    }

    if (year === finishDate.getFullYear() && month === finishDate.getMonth()) {
      validateDaysUpperRange(days, finishDate);
    }

    return false;
  };

  function validateDatepickersDays(year, months, startDate, finishDate) {
    for (var i = 0; i < months.length; i += 1) {
      validateDatepickerDays(year, months[i], startDate, finishDate);
    }

    return false;
  };

  function validateDatepickerWeeks(year, month) {
    var selector = '.'.concat(year, MONTHS[month]);
    var weeks = $(selector.concat(' .ui-datepicker-calendar tbody tr'));

    for (var i = 0; i < weeks.length; i += 1) {
      var days = $(weeks[i]).find('td span').filter(function (i, e) {
        return $(e).text().length === 0;
      });

      if (days.length === 7) {
        $(weeks[i]).hide();
      }
    }

    return false;
  };

  function validateDatepickersWeeks(year, months) {
    for (var i = 0; i < months.length; i += 1) {
      validateDatepickerWeeks(year, months[i]);
    }

    return false;
  };

  function getHolidays(year, month, country) {
    var action = HOLIDAY_API_URL.concat('?key=', HOLIDAY_API_KEY, '&country=', country, '&month=', month + 1, '&year=', year);

    $.get(action)
    .done(function (response) {
      var holidays = response.holidays;
      var selector = '.'.concat(year, MONTHS[month]);

      for (var i = 0; i < holidays.length; i += 1) {
        if (holidays[i].public === true) {
          var dayContainer = $(selector.concat(' #', holidays[i].date));

          if (dayContainer.hasClass('weekday') === true || dayContainer.hasClass('weekend') === true) {
            dayContainer.removeClass('weekday').removeClass('weekend');
            dayContainer.addClass('holiday');
            dayContainer.attr('title', holidays[i].name);
          }
        }
      }

      return false;
    })
    .fail(function (xhr, status, error) {
      var response = xhr.responseJSON;

      console.log(JSON.stringify(response));

      return false;
    });

    return false;
  };

  function getHolidaysByMonth(year, months, countryCode) {
    for (var i = 0; i < months.length; i += 1) {
      getHolidays(year, months[i], countryCode);
    }

    return false;
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

    for (var i = 0; i < years.length; i += 1) {
      buildDatepickers(parseInt(years[i]), calendars[years[i]]);
      validateDatepickersDays(parseInt(years[i]), calendars[years[i]], startDate, finishDate);
      validateDatepickersWeeks(parseInt(years[i]), calendars[years[i]]);
      getHolidaysByMonth(parseInt(years[i]), calendars[years[i]], countryCode);
    }

    return false;
  };

  $('.daysOfWeek').datepicker();
  $('.daysOfWeek .ui-datepicker-header').hide();
  $('.daysOfWeek .ui-datepicker-calendar tbody').hide();

  $('#createCalendars').on('click', function (event) {
    event.preventDefault();

    var startDateString = $('input#startDate').val();
    var numberOfDays = parseInt($('input#numberOfDays').val());
    var countryCode = $('input#countryCode').val();
    var calendarsContainer = $('div#calendarsContainer');

    if (isValidDate(startDateString) === true) {
      var datepickers = $('div#calendarsContainer').children();

      if (datepickers.length > 1) {
        datepickers.slice(1).detach();
      }

      prepare(startDateString, numberOfDays, countryCode, calendarsContainer);

      $('.ui-datepicker').addClass('mx-auto');
      $('div#calendarsContainer').show();
    }
    else {
      alert('You must enter a valid date format.')
    }

    return false;
  });

  return false;
});