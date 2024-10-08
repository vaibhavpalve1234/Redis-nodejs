const { promisify } = require('util');
const { redisClient, addSingleMessageToCache, getSingleMessageFromCache, getRoomFromCache, addMessageToCache, updateMessageStatusInCache } = require('../../helper/redis');
exports.insertData = async (req, res) => {
    try {
        const { key, value } = req.body;

        await addSingleMessageToCache("defaultRoom", key, value);

        res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
};

// Get a single data entry
exports.getData = async (req, res) => {
    try {
        const { key } = req.params;
        const message = await getSingleMessageFromCache("defaultRoom", key);
        if (message) {
            res.status(200).json({ data: message });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
};

// Update an existing data entry
exports.updateData = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const message = await getSingleMessageFromCache("defaultRoom", key);
        if (message) {
            await addSingleMessageToCache("defaultRoom", key, value);
            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating data', error });
    }
};

// Fetch all data entries
exports.findAll = async (req, res) => {
    try {
        // Get all rooms (for simplicity, assuming "defaultRoom" here)
        const data = await getRoomFromCache("defaultRoom");
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all data', error });
    }
};

// Delete a specific data entry
exports.deleteData = async (req, res) => {
    try {
        const { key } = req.params;
        const message = await getSingleMessageFromCache("defaultRoom", key);
        if (message) {
            await redisClient.hDel(`chats:defaultRoom`, key);
            res.status(204).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data', error });
    }
};

// Mark a specific data entry as inactive
exports.markInactive = async (req, res) => {
    try {
        const { key } = req.params;
        const message = await getSingleMessageFromCache("defaultRoom", key);
        if (message) {
            message.isActive = false;
            await addSingleMessageToCache("defaultRoom", key, message);
            res.status(200).json({ message: 'Data marked as inactive', data: message });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error marking data as inactive', error });
    }
};

// New functionality to insert single data with an optional 'isActive' flag
exports.insertSingleData = async (req, res) => {
    try {
        const { key, value, isActive = true } = req.body;

        // Check if the key and value are provided
        if (!key || typeof key !== 'string') {
            return res.status(400).json({ message: 'Key is required and must be a string' });
        }

        if (!value || typeof value !== 'object') {
            return res.status(400).json({ message: 'Value is required and must be an object' });
        }

        // Prepare the data to insert
        const dataToInsert = { ...value, isActive };

        await addSingleMessageToCache("defaultRoom", key, dataToInsert);
        res.status(201).json({ message: 'Single data inserted successfully', data: dataToInsert });
    } catch (error) {
        console.error('Error inserting single data:', error);
        res.status(500).json({ message: 'Error inserting single data', error: error.message });
    }
};

// New functionality to get a single data entry by key and check active status
exports.getSingleData = async (req, res) => {
    try {
        const { key } = req.params;
        const message = await getSingleMessageFromCache("defaultRoom", key);
        if (message) {
            res.status(200).json({ data: message, isActive: message.isActive });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching single data', error });
    }
};

