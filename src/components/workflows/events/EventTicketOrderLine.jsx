import { useState, useEffect } from "react";
// import CheckBox from "../../ui/form/CheckBox.jsx";
import TicketDropDownMenu from "./TicketDropDownMenu.jsx";



/**
 * Represent a single order line for an event ticket, displaying the contact's name, status, selected product, and price.
 * @param {*} param0 
 * @returns 
 */
export default function EventTicketOrderLine({ id, name, status, selectedTicketId, tickets, handleTicketSelect, price }) {

    // This value didn't work with a useState initial value, but I don't think the useState was necessary for this step? Ask Jose about it.
    const selectedProduct = tickets.find(item => item.Id === selectedTicketId);

    function thingThatGetsDisplayed(product) {

        // let timeLeft = product.timeLeftInDays;
        let timeLeft = 2;

        return `${product.Name} - $${product.EarlyBirdPrice} ($${product.Price} in ${timeLeft} day(s)!)`;
        //product.MemberPrice
        //product.EarlyBirdPrice
    }


    let theLabel = selectedProduct ? `${selectedProduct.Name} - ${price != null ? `$${price}` : "Price unavailable"}` : "Select Product";


    return (
        <tr className="border-b cursor-pointer hover:bg-gray-100">

            {/* <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <CheckBox label="" name="" value={id} defaultValue={false} onChange={addToSelectedContactIds} />
            </td> */}

            <td className="px-4 py-3">{name}</td>


            <td className="px-4 py-3">{status || "-"}</td>

            <td className="px-4 py-3 w-[300px]">
                <TicketDropDownMenu label={theLabel} entries={tickets} handler={(product) => { handleTicketSelect(id, product); }} thingThatGetsDisplayed={thingThatGetsDisplayed} />
            </td>


        </tr>
    )
}
