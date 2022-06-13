const mongoose = require('mongoose');
const mongoosePaginate= require('mongoose-paginate');
 
const orderSchema = mongoose.Schema({
    orderCode: Array,
    orderStatus: Array,
    customerName: String,
    brandName: String,
    country: String,
    state: String,
    product: Array,
    fabric: Array,
    color: Array,
    quantity: Array,
    phases: Array,
    orderTimeline: Number,
    startTime: Number,    
    user: String,
});

orderSchema.plugin(mongoosePaginate);

module.exports =  mongoose.model('orders', orderSchema);

