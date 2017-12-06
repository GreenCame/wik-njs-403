const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')
const url = '/course-lists'

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('When I create a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).post(url).then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when name is not unique', () => {
      return request(app)
        .post(url)
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be unique'
            }
          })
      })
    })

    it('should  succesfuly create a courseList', () => {
      const mockName = 'My New List'

      return request(app)
        .post(url)
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockName)

          const result = find(db.courseList, { name: mockName } )
          result.should.not.be.empty
          result.should.eql({
            id: res.body.data.id,
            name: res.body.data.name
          })
        })
    })
  })

  describe('When I delete a courseList (DELETE /course-lists)', () => {
    it('should reject with a 400 when no ID or name is given', () => {
      return request(app).delete(url).then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing id or name'
          }
        })
      })
    })

    it('should reject when id does not exist', () => {
      return request(app)
        .delete(url)
        .send({ id: 50 })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'ID should be valid'
            }
          })
      })
    })

    it('should reject when name does not exist', () => {
      return request(app)
        .delete(url)
        .send({ name: 'Titi' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be valid'
            }
          })
      })
    })

    it('should succesfuly delete a courseList with a id', () => {
      const courseID = 1;

      return request(app)
        .delete(url)
        .send({ id: courseID })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.result.should.equal("ok")          

          const result = find(db.courseList, { id: courseID } )
          expect(result).to.be.an('undefined')
        })
    })

    it('should succesfuly delete a courseList with a name', () => {
      const courseName = "Toto";

      return request(app)
        .delete(url)
        .send({ name: courseName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.result.should.equal("ok")

          const result = find(db.courseList, { name: courseName } )
          expect(result).to.be.an('undefined')
        })
    })
  })

  describe('When I get a courseList (GET /course-lists)', () => {
    it('should give me all the list', () => {
      return request(app).get(url).then((res) => {
        res.status.should.equal(200)
        res.body.should.eql({
          data: db.courseList
        })
      })
    })
  })
})
