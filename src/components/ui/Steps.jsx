
export default function Steps({ value, step }) {

    const handleProgressFor = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleProgressBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div>
            <ul className="steps">
                <li data-content=""
                    className={`step ${currentStep >= 1 ? "step-primary" : ""}`}
                >
                    Register
                </li>

                <li data-content=""
                    className={`step ${currentStep >= 2 ? "step-primary" : ""}`}
                >
                    Choose plan
                </li>

                <li data-content=""
                    className={`step ${currentStep >= 3 ? "step-primary" : ""}`}
                >
                    Purchase
                </li>

                <li data-content=""
                    className={`step ${currentStep >= 4 ? "step-primary" : ""}`}
                >
                    Receive Product
                </li>
            </ul>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleProgressBack}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Back
                </button>

                <button
                    onClick={handleProgressFor}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Forward
                </button>
            </div>
        </div>
    );


}
