import axios from 'axios'
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY)

export const bookTour = async tourId => {
    //Get checkout session from api
    const session = await axios(`http://127.0.0.1:3000/api/vi/bookings/checkout-session/${tourId}`)
    //use stripe object to create checkout form and charge card
    
}