// import { vNode, View } from "@ocdla/view";
import Legal from "@ocdla/global-components/src/Legal";
import Sitemap from "@ocdla/global-components/src/Sitemap";
import SitemapCategory from "@ocdla/global-components/src/SitemapCategory";
import Social from "@ocdla/global-components/src/Social";
import Contacts from "@ocdla/global-components/src/Contacts";
import Logo from "@ocdla/global-components/src/Logo";
import GoogleMaps from "@ocdla/global-components/src/GoogleMaps";

const siteInfo = {
    organization: "Oregon Criminal Defense Lawyers Association",
    taxStatus: "Oregon Criminal Defense Lawyers Association is a 501(c)(3) nonprofit educational association. Contributions to OCDLA may be tax deductible. Check with your tax advisor. Electronic downloads are for the sole use of the purchasing member. Files may not be distributed to others.",
    contact: {
        website: "https://ocdla.org",
        email: "info@ocdla.org",
        phone: "(+1) 541-686-8716",
        phoneHref: "tel:+15416868716",
    },
    socials: [
        { name: "Facebook", href: "https://facebook.com/OregonCriminalDefenseLawyersAssociation", icon: "/images/logo_facebook.png" },
        { name: "X / Twitter", href: "https://x.com/oregondefense", icon: "/images/logo_twitter.png" },
    ],
};

const footerSections = [
    {
        title: "SERVICES",
        links: [
            { label: "Membership Directory", href: "https://pubs.ocdla.org/directory/members" },
            { label: "Expert Directory", href: "https://pubs.ocdla.org/directory/experts" },
            { label: "Online store", href: "/" },
        ]
    },
    {
        title: "RESEARCH",
        links: [
            { label: "Research Criminal Appellate Review", href: "https://pubs.ocdla.org/car/list" },
            { label: "Library of Defense", href: "https://lod.ocdla.org/" },
            { label: "Books Online", href: "https://lod.ocdla.org/Public:Subscriptions" },
        ]
    },
    {
        title: "RESOURCES",
        links: [
            { label: "CLEs", href: "/" },
            { label: "Videos", href: "/" },
            { label: "Seminars & Events", href: "/" },
        ]
    }
];

function FooterLink({ href, children }) {
    return (
        <a
            href={href}
            className="text-blue-400 hover:opacity-70 hover:underline hover:underline-offset-2 transition-opacity"
        >
            {children}
        </a>
    );
}


export default function Footer() {


    return (
        <footer className="w-full border-t border-gray-300 mt-4 pt-8 pb-4 lg:pt-12 lg:pb-6">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-20">

                <div className="flex w-full max-w-md flex-col gap-4 lg:w-[320px] lg:flex-shrink-0">
                    <a href="/"><img className="h-16" src="/images/logos/logo.png" alt="OCDLA Logo" />
                    </a>

                    <p className="text-xs text-gray-500 space-y-1 font-light">©{new Date().getFullYear()} {siteInfo.organization}</p>

                    <div className="flex flex-col gap-1 text-sm">
                        <p>
                            Website: <FooterLink href={siteInfo.contact.website}>
                                {siteInfo.contact.website.replace("https://", "")}
                            </FooterLink>
                        </p>
                        <p>
                            Email: <FooterLink href={`mailto:${siteInfo.contact.email}`}>
                                {siteInfo.contact.email}
                            </FooterLink>
                        </p>
                        <p>
                            Number: <FooterLink href={siteInfo.contact.phoneHref}>
                                {siteInfo.contact.phone}
                            </FooterLink>
                        </p>

                        <div className="mt-2 flex flex-row gap-2 mb-4">
                            {siteInfo.socials.map((social) => (
                                <a key={social.name} href={social.href} className="hover:opacity-70">
                                    <img className="w-8 h-8" src={social.icon} alt={`${social.name} logo`} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>



                <div className="flex flex-1 flex-wrap justify-between gap-8 sm:gap-10 lg:justify-start lg:gap-12 xl:gap-16">
                    {footerSections.map((section) => (
                        <div key={section.title} className="flex min-w-[140px] flex-col gap-2 lg:min-w-[160px]">
                            <h3 className="text-sm font-bold tracking-wider text-gray-700">{section.title}</h3>
                            <ul className="flex flex-col gap-1.5 text-sm">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <FooterLink href={link.href}>{link.label}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <p className="mx-auto max-w-3xl text-center text-xs font-light leading-relaxed text-gray-500">
                    {siteInfo.taxStatus}
                </p>
            </div>
        </footer>
    )





    // return (
    //     <footer className="container mx-auto border border-b-0 p-4 pb-16 lg:p-8 lg:pb-32">

    //         <ul id="ul-depth-1" class="flex flex-col gap-4">
    //             <li>

    //                 <ul class="flex flex-col gap-4 lg:flex-row lg:gap-8">
    //                     <li>

    //                         <ul id="ul-depth-2" class="flex flex-col gap-1">
    //                             <li>

    //                                 <ul id="ul-depth-3" class="flex items-center gap-1">
    //                                     <li class=""><a class="" href="/"><img class="h-16" src="/images/logo_ocdla.png" /></a></li>
    //                                     <li><a class="hover:opacity-[67.5%]" href="https://facebook.com/OregonCriminalDefenseLawyersAssociation"><img class="w-8" src="/images/logo_facebook.png" alt="Facebook logo" /></a></li>
    //                                     <li><a class="hover:opacity-[67.5%]" href="https://x.com/oregondefense"><img class="w-8" src="/images/logo_twitter.png" alt="Twitter logo" /></a></li>
    //                                     <li></li>
    //                                 </ul>
    //                             </li>
    //                             <li>

    //                                 <ul id="ul-depth-3" class="text-small font-thin">
    //                                     <li>©2025 Oregon Criminal Defense Lawyers Association</li>
    //                                     <li class="size-full text-wrap">Oregon Criminal Defense Lawyers Association is a 501(c)(3) nonprofit educational association. Contributions to OCDLA may be tax deductible. Check with your tax advisor. Electronic downloads are for the sole use of the purchasing member. Files may not be distributed to others.</li>
    //                                 </ul>
    //                             </li>
    //                             <li>

    //                                 <ul class="text-neutral-300">
    //                                     <li>
    //                                         <a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="https://ocdla.org">ocdla.org</a>
    //                                     </li>
    //                                     <li>
    //                                         <a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="mailto:info@ocdla.org">info@ocdla.org</a>
    //                                     </li>
    //                                     <li>
    //                                         <a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="tel:+15416868716">(+1) 541-686-8716</a>
    //                                     </li>
    //                                 </ul>
    //                             </li>
    //                         </ul>
    //                     </li>
    //                     <li className="size-full">

    //                         <ul className="flex flex-col gap-8 text-nowrap text-[#516490] lg:flex-row lg:gap-16">
    //                             <li>

    //                                 <ul className="flex flex-col gap-1">
    //                                     <li>
    //                                         <p className="text-base font-bold">SERVICES</p>
    //                                     </li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="https://pubs.ocdla.org/directory/members">Membership Directory</a></li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="https://pubs.ocdla.org/directory/experts">Expert Directory</a></li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="/">Online store</a></li>
    //                                 </ul>
    //                             </li>
    //                             <li>

    //                                 <ul className="flex flex-col gap-1">
    //                                     <li>
    //                                         <p className="text-base font-bold">RESEARCH</p>
    //                                     </li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="https://pubs.ocdla.org/car/list">Research Criminal Appellate Review</a></li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="https://lod.ocdla.org/">Library of Defense</a></li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="https://lod.ocdla.org/Public:Subscriptions">Books Online</a></li>
    //                                 </ul>
    //                             </li>
    //                             <li>

    //                                 <ul className="flex flex-col gap-1">
    //                                     <li>
    //                                         <p className="text-base font-bold">RESOURCES</p>
    //                                     </li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="/">CLEs</a></li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="/">Videos</a></li>
    //                                     <li><a className="hover:underline-blue-500 text-blue-400 hover:opacity-[67.5%] hover:underline hover:underline-offset-2" href="/">Seminars &amp; Events</a></li>
    //                                 </ul>
    //                             </li>
    //                         </ul>
    //                     </li>
    //                 </ul>
    //             </li>

    //         </ul>
    //     </footer>
    // );
}

