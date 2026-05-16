import Button from "./Button.jsx";
export default function Actions({ foobar }) {
    return (
        <>
            {Object.entries(foobar).map(([label, { value, buttonType }]) => (
                // console.log("Label:", label, "Value:", value, "ButtonType:", buttonType)
                < Button action={value} label={label} buttonType={buttonType} />
            )
            )}
        </>
    )

}
