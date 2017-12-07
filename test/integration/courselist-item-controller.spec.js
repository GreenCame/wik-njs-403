const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')
const url = '/course-lists/items';
const list = "Toto";
const item = 'Pomme de terre';

const courseListFixture = require('../fixtures/courseList')

describe('CourselistItemController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('When I create a item for a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no list name is given', () => {
      return request(app).post(url).then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name of the list'
          }
        })
      })
    })

    it('should reject with a 400 when fake name is given', () => {
      return request(app)
        .post(url)
        .send({ list : 'btc' })
        .then((res) => {
          res.status.should.equal(400)
          
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'List name should be valid'
            }
          })
        })
    })

    it('should reject when no item name is given', () => {
      return request(app)
        .post(url)
        .send({ list })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing name for the item'
            }
          })
      })
    })

    it('should succesfuly create a item for the courseList', () => {
      return request(app)
        .post(url)
        .send({ list, item })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(item)

          const result = find(db.courseList, { name: list } )
          result.items.should.not.be.empty
          result.items[0].should.eql({
            name : item 
          })
        })
    })

    it('should succesfuly create a item with quantity of 2 for the courseList', () => {
      return request(app)
        .post(url)
        .send({ list, item, quantity : 2 })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(item)

          const result = find(db.courseList, { name: list } )
          result.items.should.not.be.empty
          result.items[0].should.eql({
            name : item, 
            quantity : 2
          })
      })
    })

    it('should succesfuly create a item with the same name = quantity * 2', () => {
      return request(app)
        .post(url)
        .send({ list: 'Ma liste', item })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(item)

          const result = find(db.courseList, { name: list } )
          result.items.should.not.be.empty
          result.items[0].should.eql({
            name : item, 
            quantity : 2
          })
      })
    })
  })
  
  describe('When I get a courseList (GET /course-lists)', () => {
    xit('should give me all item in list', () => {
      return request(app).get(url).then((res) => {
        res.status.should.equal(200)
        res.body.should.eql({
          data: db.courseList
        })
      })
    })
  })
})
