import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';

export function SubscriptionsWidget(){
    
    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let userId = getCookie("user_id");

    return(
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
                <div className="card w-96 bg-base-100 card-md shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Medium Card</h2>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="justify-end card-actions">
                            <button className="btn btn-primary">Register</button>
                        </div>
                    </div>
                </div>

                <div className="card w-96 bg-base-100 card-md shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Medium Card</h2>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="justify-end card-actions">
                            <button className="btn btn-primary">Register</button>
                        </div>
                    </div>
                </div>

                <div className="card w-96 bg-base-100 card-md shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Medium Card</h2>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="justify-end card-actions">
                            <button className="btn btn-primary">Register</button>
                        </div>
                    </div>
                </div>
            </div>

            <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
                <div className="card w-96 bg-base-100 card-md shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Medium Card</h2>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="justify-end card-actions">
                            <button className="btn btn-primary">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="card w-96 bg-base-100 card-md shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Medium Card</h2>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="justify-end card-actions">
                            <button className="btn btn-primary">Subscribe</button>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}
