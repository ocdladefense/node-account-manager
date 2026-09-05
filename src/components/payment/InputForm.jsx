import React, { useState } from 'react';

export default function InputForm() {
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4 pt-2 text-left bg-white">
            {/* Cardholder Name */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Cardholder Name
                </label>
                <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                />
            </div>

            {/* Card Number */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Card Number
                </label>
                <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="4007 0000 0002 7"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                />
            </div>

            {/* Expiration & CVV */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Exp Date
                    </label>
                    <input
                        type="text"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        CVV
                    </label>
                    <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Billing Address Section */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
                <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Billing Address
                </span>

                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                />

                <div className="grid grid-cols-3 gap-2.5">
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Eugene"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                    />
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="OR"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                    />
                    <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="97401"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}
