const constants = require('../config');
const capitalize = require('./common');

const openingHoursMapper = (days) => {
  const allOptions = constants.DAYS;

  const stringifiedHours = allOptions.reduce((acc, el) => {
    acc[el] = days[el] ? JSON.stringify(days[el]) : JSON.stringify([{ type: 'CLOSED' }]);
    return acc;
  }, {});

  let startDay;
  let currentDay;
  let currentHours;

  const mappedData = allOptions.reduce((acc, el, index) => {
    if (stringifiedHours[el] === stringifiedHours[currentDay]) {
      currentDay = el;
    } else {
      if (startDay && currentDay) {
        acc.push({
          day: startDay === currentDay ? capitalize(startDay) : `${capitalize(startDay)} - ${capitalize(currentDay)}`,
          hours: JSON.parse(currentHours),
        });
      }
      startDay = el;
      currentDay = el;
      currentHours = stringifiedHours[el];
    }
    if (index === allOptions.length - 1) {
      acc.push({
        day: startDay === el ? capitalize(el) : `${capitalize(startDay)} - ${capitalize(el)}`,
        hours: JSON.parse(currentHours),
      });
    }
    return acc;
  }, []);

  return mappedData;
};

module.exports = openingHoursMapper;
