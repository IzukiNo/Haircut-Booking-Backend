/**
 * Build Mongoose filter cho Staff, Stylist, Cashier  từ URL query params
 * query = { branchId, position, active, day, start, end }
 */

function buildEmployeeFilter(query) {
  const filter = {};

  // branchId
  if (query.branchId) filter.branchId = query.branchId;

  // position
  if (query.position) {
    const positions = query.position.split(",").map((p) => p.trim());
    filter.position = positions.length > 1 ? { $in: positions } : positions[0];
  }

  // active
  if (query.active !== undefined) {
    filter.active = query.active === "true";
  }

  // schedule
  if (query.day || query.start || query.end) {
    const elemMatch = {};
    if (query.day) elemMatch.day = query.day.toLowerCase();
    if (query.start) elemMatch.startTime = { $lte: query.start };
    if (query.end) elemMatch.endTime = { $gte: query.end };

    if (Object.keys(elemMatch).length > 0)
      filter.schedule = { $elemMatch: elemMatch };
  }

  return filter;
}

module.exports = { buildEmployeeFilter };
