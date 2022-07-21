const openingHoursMapper = require('./openingHoursMapper');

const businessEntriesMapper = (data) => {
  const mappedPlace = data.map((place) => ({
    id: place.local_entry_id,
    name: place.displayed_what,
    address: place.displayed_where,
    openingHours: openingHoursMapper(place.opening_hours.days),
    phones: place.addresses.reduce((acc, address) => {
      address.contacts.map((el) => {
        if (el.contact_type === 'phone') acc.push(el.formatted_service_code);
        return undefined;
      });
      return acc;
    }, []).filter((f) => f),
    website: place.addresses.reduce((acc, address) => {
      address.contacts.map((el) => {
        if (el.contact_type === 'url') acc.push(el.url);
        return undefined;
      });
      return acc;
    }, []).filter((f) => f),
  }));
  return mappedPlace;
};

module.exports = businessEntriesMapper;
