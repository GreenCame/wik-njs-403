const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')
const url = (list) => '/course-lists/'+list+'/items';
const list_toto = "Toto";
const item = 'Pomme de terre';

const courseListFixture = require('../fixtures/courseList')

describe('CourselistItemController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('test the url (GET /course-lists/:string/item)', () => {  
    it('should reject with a 400 when fake name is given', () => {
      return request(app)
        .get(url('btc'))
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
  })

  describe('When I create a item for a courseListItem (POST /course-lists/:string/item)', () => {  
    it('should reject with a 400 when fake name is given', () => {
      return request(app)
        .post(url('btc'))
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
        .post(url(list_toto))
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
        .post(url(list_toto))
        .send({ item })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.item.name.should.equal(item)
          res.body.data.list.should.equal(list_toto)

          const result = find(db.courseList, { name: res.body.data.list } )
          result.items.should.not.be.empty
          result.items[0].should.eql({
            name : item 
          })
        })
    })

    it('should succesfuly create a item with quantity of 2 for the courseList', () => {
      return request(app)
        .post(url(list_toto))
        .send({ item, quantity : 2 })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.item.name.should.equal(item)
          res.body.data.list.should.equal(list_toto)

          const result = find(db.courseList, { name: res.body.data.list } )
          result.items.should.not.be.empty
          result.items[0].should.eql({
            name : item, 
            quantity : 2
          })
      })
    })

    it('should succesfuly create a item with the same name = quantity * 2', () => {
      return request(app)
        .post(url('Ma_liste'))
        .send({ item })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.item.name.should.equal(item)
          res.body.data.list.should.equal('Ma liste')

          const result = find(db.courseList, { name: res.body.data.list } )
          result.items.should.not.be.empty
          result.items[0].should.eql({
            name : item, 
            quantity : 2
          })
      })
    })
  })
  
  describe('When I get a courseListItem (GET /course-lists/:string/item)', () => {
    it('should give me all items in list', () => {
      return request(app)
        .get(url('Ma_liste'))
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.items).to.be.an('array')
          res.body.data.items[0].name.should.equal(item)
        })
    })
  })

  describe('I can get put a flag buy (PATCH /course-lists/:string/item)', () => {
    it('should reject when no item name is given', () => {
      return request(app)
        .patch(url(list_toto))
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

    it('should change flagged item', () => {
      return request(app)
        .patch(url('Ma_liste'))
        .send({ item: 'not_exit', isBuy : true})
        .then((res) => {
          res.status.should.equal(400)
          
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Item name should be valid'
            }
          })
        })
    })


    it('should change flagged item', () => {
      return request(app)
        .patch(url('Ma_liste'))
        .send({ item, isBuy : true})
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.item.name.should.equal(item)
          res.body.data.item.isBuy.should.be.true
          res.body.data.list.should.equal('Ma liste')
        })
    })

    it('should change unflagged item', () => {
      return request(app)
        .patch(url('Ma_liste'))
        .send({ item, isBuy : false})
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.item.name.should.equal(item)
          res.body.data.item.isBuy.should.be.false
          res.body.data.list.should.equal('Ma liste')
        })
    })
  })
})
