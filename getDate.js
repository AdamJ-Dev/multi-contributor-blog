// Convert date to user-friendly string
getDate = (dateObj) => {
    date = dateObj.toString()
    month = date.slice(3, 7)
    day = date.slice(8, 10)
    day_suffix = "th"
    if (day[0] != 1) {
        switch (day[1]) {
            case "1":
                day_suffix = "st"
            break;
            case "2":
                day_suffix = "nd"
            break;
            case "3":
                day_suffix = "rd"
            break;
        }
        if (day[0] == 0) {
            day = day[1]
        }
    }
 
    year = date.slice(10, 15)
    return `${month} ${day}${day_suffix}, ${year}`
}

getDateWithTime = (dateObj) => {
    const date = getDate(dateObj)
    const time = dateObj.toString().slice(16, 21)
    return `${date} (${time} GMT)`
}

module.exports = { getDate, getDateWithTime }