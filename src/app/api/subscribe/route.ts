// app/api/subscribe/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

// Define a type for the incoming request body
interface SubscribeRequestBody {
    email: string;
}

export async function POST(request: Request) {
    try {
        // Explicitly type the response of request.json() to SubscribeRequestBody
        const body = (await request.json()) as SubscribeRequestBody;

        const { email } = body;

        // Validate the email field
        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const apiKey = process.env.BREVO_API_KEY; // Access the API key from the .env file
        const listId = '3'; // Your Brevo List ID

        // Make a request to Brevo to add the email to the list
        const response = await axios.post(
            'https://api.brevo.com/v3/contacts',
            {
                email: email,
                listIds: [listId], // Add the email to your specified list
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey, // The API key from the .env file
                }
            }
        );

        // If the response is successful, return a success message
        if (response.status === 200) {
            return NextResponse.json({ message: 'Subscription successful' });
        } else {
            return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error adding email to Brevo:', error);
        return NextResponse.json({ message: 'Unable to subscribe. Please try again.' }, { status: 500 });
    }
}
