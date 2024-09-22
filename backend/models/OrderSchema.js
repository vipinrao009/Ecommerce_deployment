import { model,Schema,mongoose} from "mongoose";
const orderSchema = new Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: "Product"
    }],
    payment: {  // Changed to 'payment' for consistency
        id: String,  // e.g., transaction ID
        status: String,
        amount: String,
        currency: String,
        // Add other relevant fields from the result object as needed
    },
    buyer: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"]
    }
}, { timestamps: true });

const Order = model("Order", orderSchema);
export default Order;
