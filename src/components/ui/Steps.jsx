export default function Steps({ steps, currentStep }) {
    let totalSteps = steps.length;
    const invalidCurrent = currentStep > totalSteps || currentStep <= -1;

    if (invalidCurrent) {
        return (
            <div>
                <p className="text-2xl font-bold">Current Step must be between 0 & {steps.length}</p>
            </div>
        )
    }
    return (
        <div>
            <ul className="steps w-full">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;

                    return (
                        <li
                            key={label}
                            data-content={stepNumber}
                            className={`step ${currentStep >= stepNumber ? "step-primary" : ""
                                }`}
                        >
                            {label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
