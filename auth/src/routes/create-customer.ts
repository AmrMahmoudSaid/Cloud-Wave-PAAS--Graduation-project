import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, currentUser, BadRequestError, NotAuthorizedError } from '@cloud-wave/common';
import { User } from '../models/user';
import Stripe from 'stripe';
import { UserCreatedPublisher } from '../event/publisher/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2024-06-20',
});

const router = express.Router();

router.post(
    '/api/users/customer',
    currentUser,
    [
        body('email').isEmail().withMessage('email must be valid'),
        body('token').notEmpty().withMessage('You must provide a token'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const email1 = req.currentUser?.email;

        const existingUser = await User.findOne({
            email: email1,
        });

        if (!existingUser) {
            throw new NotAuthorizedError();
        }

        try {
            const token = req.body.token;
            const customer = await stripe.customers.create({
                email: req.body.email,
                source: token,
            });

            existingUser!.customerId = customer.id;
            existingUser!.active = true;
            existingUser!.save();

            res.status(200).send({ existingUser });

            await new UserCreatedPublisher(natsWrapper.client).publish({
                name: existingUser.name,
                email: existingUser.email,
                id: existingUser.id,
                userId: existingUser.id,
                customerId: existingUser.customerId,
            });
        } catch (error) {
            throw new BadRequestError('Error in payment');
        }
    }
);

export { router as createCustomer };
