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
            { label: "Membership Directory", href: "https://ocdla.app/directory/members" },
            { label: "Expert Witness Directory", href: "https://ocdla.app/directory/experts" },
            { label: "Online store", href: "https://ocdla.my.site.com" },
        ]
    },
    {
        title: "RESEARCH",
        links: [
            { label: "Research Criminal Appellate Review", href: "https://ocdla.app/car/list" },
            { label: "Library of Defense", href: "https://lod.ocdla.org/" },
            { label: "Books Online", href: "https://bon.ocdla.org" },
        ]
    },
    {
        title: "RESOURCES",
        links: [
            { label: "CLEs", href: "https://ocdla.my.site.com" },
            { label: "Videos", href: "https://media.ocdla.org" },
            { label: "Seminars & Events", href: "https://ocdla.my.site.com/OcdlaEvents" },
        ]
    }
];

function FooterLink({ href, children }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
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
}

