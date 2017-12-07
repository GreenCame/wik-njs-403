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

    let items = courseListCollection[res.list.id - 1].items || []
    let current_item = find(items, { name : req.body.item });
    let newItem = {};

    if(current_item){
        //change quantity
        remove(items, current_item);
        newItem = { name : current_item.name, quantity: (current_item.quantity || 1) + 1 }

    } else {
        newItem = { name : req.body.item };
        if(req.body.quantity) newItem.quantity = req.body.quantity;
        
    }

    courseListCollection[res.list.id - 1].items = [ ...items, newItem];

    res.json({
        data : { 
            list : res.list.name,
            item : newItem
        }
    })
})

module.exports = router