import express , {Request , Response} from 'express';
import {body } from 'express-validator';
import {validateRequest, currentUser, BadRequestError, NotAuthorizedError} from "@cloud-wave/common";
import {User} from "../models/user";
import Stripe from 'stripe';
import {UserCreatedPublisher} from "../event/publisher/user-created-publisher";
import {natsWrapper} from "../nats-wrapper";
const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2024-06-20'
});
const router = express.Router();

router.post('/api/users/customer', currentUser,[
        body('email')
            .isEmail()
            .withMessage('email must be valid'),
        body('cardNumber')
            .trim()
            .notEmpty()
            .withMessage('You must add a cardNumber'),
        body("exp_month")
            .trim()
            .notEmpty()
            .withMessage('exp_year'),
        body('cvc')
            .trim()
            .notEmpty()
            .withMessage('You must add a cvc')
    ],validateRequest
    ,async (req: Request, res: Response) =>{
        const email1  = req.currentUser?.email;
        const existingUser = await User.findOne({email1});
        if (!existingUser){
            throw new NotAuthorizedError();
        }
        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: req.body.cardNumber,
                    exp_month: req.body.exp_month,
                    exp_year: req.body.exp_year,
                    cvc: req.body.cvc,
                }
            });
            const customer = await stripe.customers.create({
                email: req.body.email,
                payment_method: paymentMethod.id,
                invoice_settings: {
                    default_payment_method: paymentMethod.id,
                }
            });
            const cardNumber = req.body.cardNumber;
            const lastFourDigits = cardNumber.slice(-4);
            existingUser!.customerId = customer.id;
            existingUser!.active= true;
            existingUser.cardNumber =lastFourDigits;
            existingUser!.save();
            res.status(200).send({existingUser});
            await new UserCreatedPublisher(natsWrapper.client).publish({
                name: existingUser.name,
                email: existingUser.email,
                id: existingUser.id,
                userId: existingUser.id,
                customerId: existingUser.customerId
            });
        }catch (error) {
            throw new BadRequestError("Error in payment");
        }
    });


export {router as createCustomer};