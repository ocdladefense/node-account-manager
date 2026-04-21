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
}

export default function SObject() {

    const { client } = useOutletContext();

    let [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            const metadata = await client.queryObjectMetadata("Contact");
            const data = new MetaData(metadata);
            setMetadata(data);
        };

        fetchMetadata();

    }, []);

    return <>{metadata && <Outlet context={{ client, metadata }} />}</>
}
