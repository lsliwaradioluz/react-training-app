exports.reverseDate = (value) => {
  let dateWithoutTime = value.split("T")
  return dateWithoutTime[0].split("-").reverse().join(".")
}

exports.getDayName = (value) => {
  const date = new Date(value)
  const weekDay = date.getDay()
  let dayname

  switch (weekDay) {
    case 1:
      dayname = "Poniedziałek"
      break
    case 2:
      dayname = "Wtorek"
      break
    case 3:
      dayname = "Środa"
      break
    case 4:
      dayname = "Czwartek"
      break
    case 5:
      dayname = "Piątek"
      break
    case 6:
      dayname = "Sobota"
      break
    case 0:
      dayname = "Niedziela"
  }

  return dayname
}

exports.getTime = (value) => {
  const date = new Date(value)
  const hours = date.getHours()
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? `${minutes}0` : minutes
  return `${hours}:${minutes}`
}

exports.getDayAndMonth = (value) => {
  const date = new Date(value)
  let day = date.getDate()
  let month = date.getMonth() + 1
  let dayAndMonth = month < 10 ? `${day}.0${month}` : `${day}.${month}`
  return dayAndMonth
}

exports.convertSecToMin = (value) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60
  const minutesAndSeconds =
    seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`
  return minutesAndSeconds
}

