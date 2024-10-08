const express = require('express');
const router = express.Router();
const controller = require('../../controllers/redis.controller');

/**
 * @api {post} /redis Insert Data
 * @apiDescription Insert data into Redis
 * @apiName InsertData
 * @apiGroup Redis
 *
 * @apiParam {String} key Redis key
 * @apiParam {Object} value Redis value
 *
 * @apiSuccess (201) {String} message Data inserted successfully
 */
router.post('/', controller.insertSingleData);

/**
 * @api {get} /redis/:key Get Data
 * @apiDescription Get data from Redis by key
 * @apiName GetData
 * @apiGroup Redis
 *
 * @apiParam {String} key Redis key
 *
 * @apiSuccess {Object} data Redis data
 */
router.get('/:key', controller.getData);

/**
 * @api {put} /redis/:key Update Data
 * @apiDescription Update data in Redis by key
 * @apiName UpdateData
 * @apiGroup Redis
 *
 * @apiParam {String} key Redis key
 * @apiParam {Object} value Redis value
 *
 * @apiSuccess {String} message Data updated successfully
 */
router.put('/:key', controller.updateData);

/**
 * @api {get} /redis/ Find All Data
 * @apiDescription Find all data in Redis
 * @apiName FindAllData
 * @apiGroup Redis
 *
 * @apiSuccess {Array} data List of all Redis keys and values
 */
router.get('/', controller.findAll);

/**
 * @api {delete} /redis/:key Delete Data
 * @apiDescription Delete data from Redis by key
 * @apiName DeleteData
 * @apiGroup Redis
 *
 * @apiParam {String} key Redis key
 *
 * @apiSuccess (204) {String} message Data deleted successfully
 */
router.delete('/:key', controller.deleteData);

/**
 * @api {patch} /redis/:key/mark-inactive Mark Data as Inactive
 * @apiDescription Mark data as inactive by setting isActive to false
 * @apiName MarkInactive
 * @apiGroup Redis
 *
 * @apiParam {String} key Redis key
 *
 * @apiSuccess {String} message Data marked as inactive
 */
router.patch('/:key/mark-inactive', controller.markInactive);

module.exports = router;
