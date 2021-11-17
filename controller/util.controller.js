var moment = require('moment');

exports.convertKeyToLowerCase = (data) => {
    var modData = data.map((item)=>{
        var modItem = {};
        for (key in item) {
            modItem[key.toLowerCase()]=item[key];
        }
        return modItem;
    })
    return modData;
}

exports.groupByResponseObjectToArray = (data, key) => {
    let arr = []
    data.forEach((item, index) => {
        arr.push(item[key]);
    })
    return arr;
}

exports.parseDate1 = (dateString, destFormat) => {
    let formattedDateString = moment(dateString).format(destFormat)
    return formattedDateString;
}

exports.parseDate2 = (dateString, srcFormat, destFormat) => {
    let formattedDateString = moment(dateString, srcFormat).format(destFormat)
    return formattedDateString;
}