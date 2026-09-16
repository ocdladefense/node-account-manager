import ReactDOM from 'react-dom';
import { Children, useState, useEffect, useRef, isValidElement, cloneElement } from 'react';
import Button, { CautionButton, BackButton } from './Button';



export default function Modal({
    isOpen,
    onClose,
    content,
    externalNode,
    children,
}) {

    const containerRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(1);


    // Default "next step getter" just increments the current step by 1.
    let getNextStep = function() {
        return currentStep + 1;
    };


    useEffect(() => {
        if (containerRef.current && externalNode)
        {
            containerRef.current.appendChild(externalNode);
        }

        return () => {
            if (containerRef.current && externalNode && containerRef.current.contains(externalNode))
            {
                containerRef.current.removeChild(externalNode);
            }
        };
    }, [externalNode]);

    if (!isOpen) return null;

    const isMultiStep = Children.count(children) > 1;
    const totalSteps = Children.count(children);





    return ReactDOM.createPortal(
        <div
            id="my-modal"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-11/12 md:w-3/5 max-w-4xl min-h-[360px] max-h-[85vh] flex flex-col bg-white rounded-2xl p-8 shadow-2xl overflow-hidden border border-gray-100"
            >

                <h2>Here's how many kids I have: {children ? Children.count(children) : 0}</h2>

                {
                    currentStep > 0 && (
                        <div className="absolute top-6 left-6 z-20">
                            <BackButton className="px-6 w-25 py-1 cursor-pointer rounded-md bg-white text-black hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150" label="< Back" action={() => setCurrentStep(currentStep - 1)} />
                        </div>
                    )
                }


                {/* transition-transform duration-300 ease-in-out */}
                <div id="multi-step-container" className="overflow-x-hidden overflow-y-auto pr-2 flex-1 w-full">
                    {isMultiStep && (
                        <div
                            className="flex transition-transform duration-300 ease-in-out w-full"
                            style={{
                                width: `${totalSteps * 100}%`,
                                transform: `translateX(-${((currentStep - 1) / totalSteps) * 100}%)`
                            }}
                        >
                            {Children.map(children, (stepNode, index) => {

                                let step = index + 1;

                                let _getNextStep = stepNode.props.getNextStep;

                                if (currentStep == step && _getNextStep)
                                {
                                    getNextStep = _getNextStep;
                                }

                                return (
                                    <div
                                        key={index}
                                        style={{ width: `${100 / totalSteps}%` }}
                                        className="flex flex-col items-center text-center space-y-6 px-4"
                                    >
                                        {stepNode}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!isMultiStep && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            {content}
                        </div>
                    )}

                    <div ref={containerRef} />
                </div>


                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
                    <CautionButton
                        label="Cancel"
                        isCancel={true}
                        action={onClose}
                    />

                    <Button
                        label={isMultiStep && currentStep < totalSteps ? 'Next' : 'Confirm'}
                        action={() => {
                            if (isMultiStep && currentStep < totalSteps)
                            {
                                let formData = new FormData(document.getElementById("batch-action"));
                                let theNextStep = getNextStep(formData);
                                setCurrentStep(theNextStep);
                            } else
                            {
                                onClose();
                            }
                        }}
                    />

                </div>

            </div>
        </div>,
        document.body
    );
}
