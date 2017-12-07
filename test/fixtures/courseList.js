const { courseList } = require('../../data/db')

mockData = [
  { id: 1, name: 'Toto' },
  { id: 2, name: 'Ma liste', items: [{ name: "Pomme de terre" }] }
]

module.exports = {
  up: () => {
    courseList.splice(0)
    courseList.push.apply(courseList, mockData)
  },

  down: () => {
    courseList.splice(0)
  }
}