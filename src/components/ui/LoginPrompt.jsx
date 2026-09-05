import { useState, useEffect } from 'react';
import Card from './Card'

export default function LoginPrompt() {
    return (
        <div className="w-full pb-12">
            <div className="px-6 md:px-12 mt-[28px] max-w-5xl">

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xs">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                        Welcome To OCDLA!
                    </h1>

                    <h2 className="text-base font-semibold text-slate-700 mb-3">
                        Supporting, Educating, and Uniting the Oregon Defense Community
                    </h2>

                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-3xl">
                        The Oregon Criminal Defense Lawyers Association provides defense practitioners, public defenders, and legal staff with essential trial tools, legal research, and statewide networking. Below is an overview of the key resources and services available to members.
                    </p>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Member Resources & Exclusive Features
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Card
                        title="Legal Research & Publications"
                        description="Full access to specialized defense manuals, the Criminal Law Formbook, the Library of Defense, and searchable Oregon appellate case reviews to support your motion practice and case preparation."
                        ifButton={false}
                        className="w-full"
                    />

                    <Card
                        title="Continuing Legal Education (CLE) & Video Training"
                        description="On-demand access to accredited Oregon CLE seminars, trial advocacy workshops, and specialty video archives covering emerging case law, forensic defense, and trial skills."
                        ifButton={false}
                        className="w-full"
                    />

                    <Card
                        title="Expert Witness & Member Directories"
                        description="Searchable statewide databases to locate qualified forensic experts, investigators, and trial specialists, as well as direct contact access to defense colleagues across Oregon."
                        ifButton={false}
                        className="w-full"
                    />

                    <Card
                        title="Defense Community & Job Opportunities"
                        description="Stay connected with upcoming statewide criminal defense events, seminars, and current public defense and private litigation career opportunities."
                        ifButton={false}
                        className="w-full"
                    />
                </div>

                <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                        Questions or Support?
                    </h3>
                    <p className="text-sm text-gray-600">
                        Having trouble logging in? Contact support at{" "}
                        <a href="mailto:info@ocdla.org" className="text-blue-600 hover:underline font-medium">
                            info@ocdla.org
                        </a>{" "}
                        or call{" "}
                        <a href="tel:+15416868716" className="text-blue-600 hover:underline font-medium">
                            (541) 686-8716
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}


