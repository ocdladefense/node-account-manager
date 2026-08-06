import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';




export default function LoginPrompt() {

    let userId = getCookie("user_id");

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <div className="space-y-2">
                    <p>Here's where we explain our purpose to you!</p>
                    <br />
                    {userId ? <a href="/logout">Log Out</a> : <a href="/login">Log In</a>}

                </div>
            </div>
        </div>
    )
}
