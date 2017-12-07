const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find, remove } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

//test if the list exist or not
router.use((req, res, next) => {
    if (!req.body.list) {
        return next(new BadRequestError('VALIDATION', 'Missing name of the list'))
    }

    const name = req.body.list
    
    // Check for name
    const result = find(courseListCollection, { name })
    if (!result) {
        return next(new BadRequestError('VALIDATION', 'List name should be valid'))
    }

    next();
})

router.get('/', (req, res, next) => {
    const result = find(courseListCollection, { name : req.body.list })
  
    res.json({
      data: result.items
    })
})

router.post('/', (req, res, next) => {
    const result = find(courseListCollection, { name : req.body.list })

    if (!req.body.item) {
        return next(new BadRequestError('VALIDATION', 'Missing name for the item'))
    }

    let items = courseListCollection[result.id - 1].items || []
    let current_item = find(items, { name : req.body.item });

    if(current_item){
        //change quantity
        remove(items, current_item);
        items = [ ...items, { name : current_item.name, quantity: (current_item.quantity || 1) + 1 }];
    } else {
        let newItem = { name : req.body.item };
        if(req.body.quantity) newItem.quantity = req.body.quantity;
        
        items = [ ...items, newItem];
    }

    courseListCollection[result.id - 1].items = [ ...items ];

    res.json({
        data: find(courseListCollection[result.id - 1].items, { name : req.body.item })
    })
})

module.exports = router