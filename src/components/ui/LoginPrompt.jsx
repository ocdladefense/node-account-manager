import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';




export default function LoginPrompt() {
    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <div className="space-y-2">
                    <p>Here's where we explain our purpose to you!</p>
                    <br />
                </div>
            </div>
        </div>
    )
}
