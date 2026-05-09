const US_COUNTRY_CODE_ID = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA";

export default function PickList({ defaultValue, metadata }) {


    let name = metadata.name;
    let label = metadata.label;
    // metadata.type = "picklist" if regular dropdown; "multipicklist" if multi-select 
    // multiple = true;//multiple || metadata.isMultiSelectPicklist(name);
    let multiple = metadata.type === "multipicklist";
    let specialFields = ["MailingStateCode"];
    let filterFunction = specialFields.includes(name) ? s => s.validFor === US_COUNTRY_CODE_ID : null;



    const values = !filterFunction ? metadata.picklistValues : metadata.picklistValues.filter(filterFunction); // still need to compensate figure out the filter situation here.

    defaultValue = multiple ? defaultValue?.split(';') : defaultValue || ""; // Jose doesn't know this!  

    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={name}>
                {label}
                <select
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full px-3 py-2 border rounded"
                    id={name}
                    multiple={multiple}
                >
                    <option value="">-- None --</option>

                    {values.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}


