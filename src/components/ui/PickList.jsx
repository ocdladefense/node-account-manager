
const US_COUNTRY_CODE_ID = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA";




export default function PickList({ label, name, defaultValue = "", values, metadata, multiple = true }) {


    name = metadata.name;
    label = metadata.label;
    let specialFields = ["MailingStateCode"];
    let filterFunction = specialFields.includes(name) ? s => s.validFor === US_COUNTRY_CODE_ID : null;



    values = values || (!filterFunction ? metadata.picklistValues : metadata.picklistValues.filter(filterFunction)); // still need to compensate figure out the filter situation here.
    // multiple = true;//multiple || metadata.isMultiSelectPicklist(name);
    defaultValue = defaultValue?.split(';') || ""; // Jose doesn't know this!  

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


