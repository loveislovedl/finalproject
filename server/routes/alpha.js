const express = require("express");
const router = express.Router();
const axios = require("axios");

const adminLayout = '../views/layouts/admin';

router.get('/alpha', async (req, res) => {
    try {

        res.render('admin/alpha', {
            title: 'Statistics',
            description: 'Portfolio platform',
            layout: adminLayout
        });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

module.exports = router;