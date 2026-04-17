const { sampleMaidData } = require("../database/maidData.js");

function filterMaidByServices(services) {
  if (!services) {
    services = [];
  }

  if (!Array.isArray(services)) {
    services = [services];
  }

  const filterMaid = sampleMaidData.filter((maid) =>
    services.some((service) => maid.services.includes(service))
  );

  return filterMaid;
}

module.exports = { filterMaidByServices };
