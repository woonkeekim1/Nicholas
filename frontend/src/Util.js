const Util = {
  convertToDate: function(date) {
    const newDate = new Date(date)
    return new Date(newDate.toDateString().substring(4))
  },
  arrayToDictionary: function(item) {
    return item.reduce((list, item) => { list[item._id] = item; return list; }, {})
  },
  addFieldToDictionary: function(dictionary, field, defaultValue){
    const newDictionary = Object.keys(dictionary).map(item => {
      let row = dictionary[item]
      row[field] = defaultValue
      return row;
    })

    return dictionary
  }

}

module.exports = Util
