const { Users, Booking } = require('../../models/users')
const Providers = require('../../models/providers')
const Venues = require('../../models/venues')
const privatekey = require('../../password')
const jwt = require("jsonwebtoken")
const AppError = require('../../utils/apperror')
const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}
module.exports = {
    dashboard: catchAsync(async (req, res, next) => {
        const page = parseInt(req.query.page, 8) || 1;
        const limit = parseInt(req.query.limit, 8) || 8;
        const startIndex = (page - 1) * limit;
        let response = await Venues.find()
            .populate('provider', 'name')
            .skip(startIndex)
            .limit(limit);
        response = await Promise.all(response.map(async (item) => {
            try {
                delete item.booking
                let booking = await Booking.find({ productId: item._id }).select('date')
                booking = booking.map(item => new Date(item.date).toDateString())
                return { ...item, booking }
            } catch (error) {
                console.log(error.message)
            }
        }))
        response = response.map(item => {
            delete item['$__']
            delete item["$locals"]
            delete item["$op"]
            delete item["$init"]
            return item
        })
        const total = await Venues.find().countDocuments()
        return res.status(200).json({
            total,
            data: response
        })
    }),

    //password reset route for client 
    resetClient: (req, res) => {
        if (req.params.token) {
            res.status(200)
            return res.json({ message: "post your password" })
        }
        return res.send({ message: "invalid link" })
    },

    //password reset route for provider 
    reset: (req, res) => {
        if (req.params.token) {
            res.status(200)
            return res.json({ message: "post your password" })
        }
        return res.send({ message: "invalid link" })
    },
    // account activation link for providers
    activate: (req, res) => {
        try {
            var decoded = jwt.verify(req.params.token, 'secret');
            Providers.updateOne({ name: decoded.data[0], email: decoded.data[1] }, { $set: { status: "active" } })
                .then(() => {
                    res.send({ message: "account activated" })
                })
        } catch (err) {
            res.send({ message: "invalid link" })
        }
    },
    // account activation link for client
    activateClient: (req, res) => {
        try {
            var decoded = jwt.verify(req.params.token, 'secret');
            // res.send(decoded)
            Users.updateOne({ name: decoded.data[0], email: decoded.data[1] }, { $set: { status: "active" } })
                .then(() => {
                    res.status(200).json({ message: "account activated" })
                })
        } catch (err) {
            res.send({ message: "invalid link" })
        }
    },
    admin_user_dashboard: async (req, res) => {
        try {
            console.log(res.payload._id)
            const payload_id = res.payload._id
            console.log(payload_id)
            const admin = await Users.findById({ _id: payload_id })
            if (admin.Isadmin === true) {
                const response = await Users.find({})
                return res.status(200).json(response)
            }
            else {
                res.status(500).json("only for admin")
            }
        }
        catch (error) {
            res.status(400).json(error)
        }

    },
    admin_provider_dashboard: async (req, res) => {
        try {
            const payload_id = res.payload._id
            console.log(payload_id)
            const admin = await Providers.findById({ _id: payload_id })

            if (admin.Isadmin === true) {

                const response = await Providers.find({}).populate({ path: 'venue_id' })
                return res.status(200).json(response)
            }
            else {
                res.status(500).json("only for admin")
            }
        }
        catch (error) {
            res.status(400).json(error)
        }
    },
    order: (req, res) => {
        const auth = req.header('auth-token')
        const something = jwt.verify(auth, privatekey)
        Booking.find({ userid: something })
            .populate("productId")
            .then(data => {
                res.json(data)
                return res.status(200)
            })
    }
}