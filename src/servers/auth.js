import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";


const router = express.Router(); // Create a new router instance
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// ---!!!--- CHECK THIS FILE FOR ANY NECESSARY SANITIZATION ---!!!---

/**
 * Extracts the Salesforce user ID from an identity URL.
 *
 * Example identity URL:
 * https://test.salesforce.com/id/ORG_ID/USER_ID
 *
 * @param {string} identityUrl
 * @returns {string}
 */
function parseUserId(identityUrl) {
    if (!identityUrl) {
        throw new Error(
            "Cannot parse Salesforce user ID: identity URL is missing."
        );
    }

    const url = new URL(identityUrl);

    const pathParts = url.pathname
        .split("/")
        .filter(Boolean); // removes the empty string at [0]

    const userId = pathParts.at(-1); // Grabs the last item, in this case the user ID

    if (!userId || !userId.startsWith("005")) {
        throw new Error(
            "Salesforce identity URL did not contain a valid user ID."
        );
    }

    return userId;
}








router.get("/login", (req, res) => {
    const state = "some_state";
    // const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const loginUrl = `${process.env.SF_OAUTH_SESSION_URL}?client_id=${process.env.SF_OAUTH_SESSION_CLIENT_ID}&redirect_uri=${process.env.SF_OAUTH_SESSION_CALLBACK_URL}&response_type=code&state=${state}`;//&scope=${scopes}`;
    res.redirect(loginUrl);
});





router.get("/logout", (req, res) => {

    res.cookie('instance_url', '', { expires: new Date(0) }); // Setting expiration to epoch
    res.cookie('access_token', '', { expires: new Date(0) }); // Setting expiration to epoch
    res.cookie('user_id', '', { expires: new Date(0) }); // Setting expiration to epoch

    res.redirect("/");

    // Notify user they have lgged out successfully
    // Remove cookies for secure account related behavior
    // Provide a link back to home or login page
});





router.get("/oauth/api/request", async (req, res) => {

    console.log("auth.js: api request: ", req.query);

    const { code } = req.query;


    const data = new URLSearchParams({
        code,
        client_id: process.env.SF_OAUTH_SESSION_CLIENT_ID,
        client_secret: process.env.SF_OAUTH_SESSION_CLIENT_SECRET,
        redirect_uri: process.env.SF_OAUTH_SESSION_CALLBACK_URL,
        grant_type: "authorization_code"
    });

    // Exchange authorization code for access token & id_token.
    const response = await fetch(process.env.SF_OAUTH_SESSION_TOKEN_URL, {
        method: "POST",
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const access_token_data = await response.json();

    if (!response.ok || access_token_data.error) {
        console.error(
            "Salesforce OAuth error:",
            access_token_data.error,
            access_token_data.error_description
        );

        return res.status(401).json({
            error: "Salesforce login failed."
        });
    }

    const userId = parseUserId(access_token_data.id);

    console.log(
        "Salesforce login response fields:",
        Object.keys(access_token_data)
    );

    console.log("Salesforce identity values:", {
        user_id: access_token_data.user_id,
        id: access_token_data.id,
        hasIdToken: Boolean(access_token_data.id_token)
    });

    let options = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Protects against Cross-Site Request Forgery (CSRF)
        maxAge: 86400000  // Cookie expiry time in milliseconds (e.g., 1 hour)
    };


    const client = new SalesforceRestApi(
        access_token_data.instance_url,
        access_token_data.access_token
    );

    let query = `SELECT ContactId, Contact.AccountId FROM User WHERE Id = '${userId}'`;

    const resp = await client.query(query);

    let record = resp.records[0];

    let contactId = record.ContactId;

    let accountId = record.Contact.AccountId;

    res.cookie('instance_url', access_token_data.instance_url, options); // Cookie expires in 24 hours
    res.cookie('access_token', access_token_data.access_token, options); // Cookie expires in 24 hours
    res.cookie("user_id", userId, options);
    res.cookie("account_id", accountId, options);
    res.cookie("contact_id", contactId, options);

    res.redirect("/");
});




router.get("/connect", async (req, res) => {

    const data = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SF_OAUTH_APPLICATION_CLIENT_ID,
        client_secret: process.env.SF_OAUTH_APPLICATION_CLIENT_SECRET
    });

    console.log("auth.js: connect route: url params: ", data);

    const tokenEndpoint = process.env.SF_OAUTH_APPLICATION_TOKEN_ENDPOINT;
    console.log("auth.js: connect route: Token endpoint:", tokenEndpoint);

    // Exchange authorization code for access token & id_token.
    const resp = await fetch(tokenEndpoint, {
        method: "POST",
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const credentials = await resp.json();

    if (credentials.error) {
        console.error("auth.js: ", credentials.error, credentials.error_description);


        let options = {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Protects against Cross-Site Request Forgery (CSRF)
            maxAge: 86400000  // Cookie expiry time in milliseconds (e.g., 1 hour)
        };
        res.clearCookie('access_token', options);

        res.clearCookie('instance_url', options);

        res.status(500).send({ error: credentials.error });
    }
    else {
        console.log("auth.js: connect route: credentials: ", credentials);
        // 2. Set the cookie
        res.cookie('access_token', credentials.access_token, {
            httpOnly: false,  // Prevents client-side JS (XSS attacks) from reading the cookie
            secure: process.env.NODE_ENV === 'production', // True for HTTPS, false for local HTTP
            sameSite: 'lax', // Protects against Cross-Site Request Forgery (CSRF)
            maxAge: 86400000  // Cookie expiry time in milliseconds (e.g., 1 hour)
        });

        res.cookie('instance_url', credentials.instance_url, {
            httpOnly: false,  // Prevents client-side JS (XSS attacks) from reading the cookie
            secure: process.env.NODE_ENV === 'production', // True for HTTPS, false for local HTTP
            sameSite: 'lax', // Protects against Cross-Site Request Forgery (CSRF)
            maxAge: 86400000  // Cookie expiry time in milliseconds (e.g., 1 hour)
        });

        console.log("auth.js: connect route: access_token: ", credentials.access_token);

        res.json(credentials);
    }
});





// Todo, turn this into a POST endpoint.
router.get("/introspect", async (req, res) => {

    const access_token = req.cookies.access_token;
    const instance_url = req.cookies.instance_url;

    const body = new URLSearchParams({
        token: access_token,
        client_id: process.env.SF_OAUTH_SESSION_CLIENT_ID,
        client_secret: process.env.SF_OAUTH_SESSION_CLIENT_SECRET,
        token_type_hint: "access_token"
    });

    console.log("auth.js: introspect route: fetch body: ", body);

    // Exchange authorization code for access token & id_token.
    const resp = await fetch(instance_url + "/services/oauth2/introspect", {
        method: "POST",
        body: body,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const data = await resp.json();
    console.log("auth.js: introspect route: fetch response: ", data);

    const userId = parseUserId(data.sub);

    const query = `SELECT ContactId FROM User WHERE Id = '${userId}'`;

    const userResponse = await fetch(instance_url + "/services/data/v56.0/query?q=" + encodeURIComponent(query), {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Accept': 'application/json'
        }
    });

    const userData = await userResponse.json();
    console.log("auth.js: introspect route: fetch userData: ", userData);

    res.json(userData);
});








export default router;
