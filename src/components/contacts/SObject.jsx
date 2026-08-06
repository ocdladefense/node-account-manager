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

    fetchPicklistValues(fieldname, optionalFilter = null) {
        let gross = this.metadata.fields.find((f) => f.name === fieldname).picklistValues;
        if (optionalFilter)
        {
            return gross.filter(optionalFilter);
        }
        return gross;
    }



    getField(fieldname) {
        let field = this.metadata.fields.find((f) => f.name === fieldname);
        if (!field) throw new Error(`Field ${fieldname} not found in metadata`);
        return field;
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
            console.log("metadata:", metadata);
        };

        fetchMetadata();

    }, []);

    // TODO: Delete orderMetadata after testing
    return <>{metadata && <Outlet context={{ client, metadata }} />}</>
}
