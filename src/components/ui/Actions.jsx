import Button from "./Button.jsx";

export default function Actions({ buttons }) {
    let buttonComponents = [];
    for (let id in buttons) {
        let button = buttons[id];
        let action = button.action;
        let type = button.buttonType;
        let label = button.label;
        let comp = < Button action={action} label={label} buttonType={type} />;
        buttonComponents.push(comp);
    }
    return (
        <>
            {buttonComponents}
        </>
    )

}
