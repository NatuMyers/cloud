// Data taken from the datasource token.json. Powered by cryptocompare.com
const moment = require('moment')

const Event = function (req, res, data, callback) {
  const rawTokenInfo = data.token
  console.log(rawTokenInfo)
  delete data.token

  const time = rawTokenInfo.Data.map(i => moment.unix(i.time).format('H'))
  const value = rawTokenInfo.Data.map(i => i.close)
  const volume = rawTokenInfo.Data.map(i => i.volumeto)

  const volumeTotal = volume.reduce((total, value) => total + parseFloat(value))

  data.token = {
  	TimeFrom: rawTokenInfo.TimeFrom,
  	TimeTo: rawTokenInfo.TimeTo,
  	time,
  	value,
  	valueNow: value[value.length-1],
  	volume,
  	volumeTotal: volumeTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})
  }

  callback()
}

module.exports = function (req, res, data, callback) {
  return new Event(req, res, data, callback)
}

module.exports.Event = Event
