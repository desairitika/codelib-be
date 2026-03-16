//Response Structure
function getResponseStructure(
  statusCode,
  messageKey,
  message,
  data = [],
  dataKey
) {
  let _dataKey = dataKey ? dataKey : "data";
  let success = statusCode >= 200 && statusCode <= 299;
  return {
    code: statusCode,
    success: success,
    [messageKey]: message,
    [_dataKey]: data,
  };
}

function convertPayloadToLower(data) {
  Object.keys(data).forEach((key) => {
    if ((key === "email" || key === "username") && typeof data[key] === 'string') {
      data[key] = data[key].toLowerCase().trim();
    }
  });

  return data;
}

module.exports = {
  getResponseStructure,
  convertPayloadToLower
};
