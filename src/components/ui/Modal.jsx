import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import Button, { CautionButton } from './Button';

export default function Modal({
    isOpen,
    onClose,
    confirmAction,
    content,
    steps = null,
    currentStep = 0,
    externalNode,
    defaultButtons = true
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && externalNode) {
            containerRef.current.appendChild(externalNode);
        }

        return () => {
            if (containerRef.current && externalNode && containerRef.current.contains(externalNode)) {
                containerRef.current.removeChild(externalNode);
            }
        };
    }, [externalNode]);

    if (!isOpen) return null;

    const isMultiStep = Array.isArray(steps) && steps.length > 0;
    const totalSteps = isMultiStep ? steps.length : 1;

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
                <div className="overflow-x-hidden overflow-y-auto pr-2 flex-1 w-full">
                    {isMultiStep ? (
                        <div
                            className="flex transition-transform duration-300 ease-in-out w-full"
                            style={{
                                width: `${totalSteps * 100}%`,
                                transform: `translateX(-${(currentStep / totalSteps) * 100}%)`
                            }}
                        >
                            {steps.map((stepNode, index) => (
                                <div
                                    key={index}
                                    style={{ width: `${100 / totalSteps}%` }}
                                    className="flex flex-col items-center text-center space-y-6 px-4"
                                >
                                    {stepNode}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center space-y-6">
                            {content}
                        </div>
                    )}

                    <div ref={containerRef} />
                </div>

                {defaultButtons && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
                        <CautionButton
                            label="Cancel"
                            isCancel={true}
                            action={onClose}
                        />
                        {confirmAction && (
                            <Button
                                label="Confirm"
                                action={confirmAction}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
