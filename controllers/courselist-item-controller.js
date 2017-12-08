const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find, remove } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

//test if the list exist or not
router.use((req, res, next) => {
    if (!req.baseUrl) {
        return next(new BadRequestError('VALIDATION', 'Should never happened'))
    }
    
    const name = req.baseUrl.replace('/course-lists/', '').replace('/items', '').replace('_', ' ');

    // Check for name
    const result = find(courseListCollection, { name })
    if (!result) {
        return next(new BadRequestError('VALIDATION', 'List name should be valid'))
    }

    res.list = result

    next();
})

router.get('/', (req, res, next) => {
    res.json({
      data: {
          list : res.list.name,
          items : res.list.items
      }
    })
})

router.post('/', (req, res, next) => {
    if (!req.body.item) {
        return next(new BadRequestError('VALIDATION', 'Missing name for the item'))
    }

    let items = res.list.items || []
    let current_item = find(items, { name : req.body.item });

    if(current_item){
        //change quantity
        remove(items, current_item);
        current_item.quantity = (current_item.quantity || 1) + 1

    } else {
        current_item = { name : req.body.item };
        if(req.body.quantity) current_item.quantity = req.body.quantity;
        
    }

    courseListCollection[res.list.id - 1].items = [ current_item, ...items];

    res.json({
        data : { 
            list : res.list.name,
            item : current_item
        }
    })
})

router.patch('/', (req, res, next) => {
    if (!req.body.item) {
        return next(new BadRequestError('VALIDATION', 'Missing name for the item'))
    }

    let current_item = find(res.list.items, { name : req.body.item });
    if (!current_item) {
        return next(new BadRequestError('VALIDATION', 'Item name should be valid'))
    }

    remove(res.list.items, current_item);
    current_item.isBuy = req.body.isBuy 

    courseListCollection[res.list.id - 1].items = [ ...res.list.items, current_item];

    res.json({
        data : { 
            list : res.list.name,
            item : current_item
        }
    })
})

module.exports = router