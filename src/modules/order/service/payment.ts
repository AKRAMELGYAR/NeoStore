import Stripe from "stripe";



export class Payment {
    constructor() { }

    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    async checkOutSession({
        customer_email,
        metadata,
        line_items,
        discounts
    }) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email,
            metadata,
            line_items,
            discounts,
            success_url: "https://akramelgyar.github.io/NeoStore-FrontEnd/#/orders",
            cancel_url: "https://akramelgyar.github.io/NeoStore-FrontEnd/#/order/cancel"

        })
    }

    async refund({ payment_intent, reason }) {
        return await this.stripe.refunds.create({
            payment_intent,
            reason
        })
    }
}