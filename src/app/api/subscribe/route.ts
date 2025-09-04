// app/api/subscribe/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

// Define the interface for the incoming request body
interface SubscribeRequestBody {
    email: string;
}

export async function POST(request: Request) {
    try {
        // Explicitly cast the parsed JSON to the SubscribeRequestBody type
        const body = await request.json() as SubscribeRequestBody;
        const { email } = body;  // Cast it as SubscribeRequestBody

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const apiKey = process.env.BREVO_API_KEY; // Access the API key from the .env file
        const listId = 3; // Your Brevo List ID

        // Make a request to Brevo to add the email to the list
        const response = await axios.post(
            'https://api.brevo.com/v3/contacts',
            {
                updateEnabled: false, // Add the updateEnabled field
                email: email,
                listIds: [listId], // Add the email to your specified list
            },
            {
                headers: {
                    'accept': 'application/json', // Set accept header for JSON response
                    'api-key': apiKey, // The API key from the .env file
                    'content-type': 'application/json', // Set content-type header
                }
            }
        );

        if (response.status === 200) {
            return NextResponse.json({ message: 'Subscription successful' });
        } else {
            return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
        }
    } catch (error) {
        // Log detailed error information
        if (axios.isAxiosError(error)) {
            console.error('Error response from Brevo:', error.response?.data); // Log Brevo's error message
            console.error('Error status:', error.response?.status);
        } else {
            console.error('Unexpected error:', error);
        }

        return NextResponse.json({ message: 'Unable to subscribe. Please try again.' }, { status: 500 });
    }
}
