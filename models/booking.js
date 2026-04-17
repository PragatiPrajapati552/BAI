const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maid: { type: Schema.Types.ObjectId, ref: 'Maid', required: true },
    services: [{ type: String }],
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
