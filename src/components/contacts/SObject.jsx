import { Outlet, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getContactQuery, fetchPicklistValues } from "./query.js";

let picklistValues = {
    salutation: [],
    publicDefenseSurvey: [],
};

class MetaData {
    constructor(metadata) {
        this.metadata = metadata;
    }

    fetchPicklistValues(fieldname) {
        return this.metadata.fields.find((f) => f.name === fieldname).picklistValues;
    }

    getField(fieldname) {
        return this.metadata.fields.find((f) => f.name === fieldname)
    }
}

export default function SObject() {

    const { client } = useOutletContext();

    let [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            const metadata = await client.queryObjectMetadata("Order");
            const data = new MetaData(metadata);
            setMetadata(data);
            console.log(metadata);
        };

        fetchMetadata();

    }, []);

    // TODO: Delete orderMetadata after testing
    return <>{metadata && <Outlet context={{ client, metadata }} />}</>
}
