import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';

export const mockMembers = [
    {
        // 1. Lifetime Member + 3 Add-ons
        username: 'clara_oswald',
        fullName: 'Clara Oswald',
        membershipType: 'lifetime',
        yearsLicensed: 15,
        renewalDate: null,
        hasBooksOnline: true,
        hasClePass: true,
        hasCriminalFormBook: true,
    },
    {
        // 2. Sustaining Member + 2 Add-ons
        username: 'marcus_vance',
        fullName: 'Marcus Vance',
        membershipType: 'sustaining',
        yearsLicensed: 8,
        renewalDate: '2027-04-15',
        hasBooksOnline: true,
        hasClePass: true,
        hasCriminalFormBook: false,
    },
    {
        // 3. Regular Member + 1 Add-on
        username: 'elena_rodriguez',
        fullName: 'Elena Rodriguez',
        membershipType: 'regular',
        yearsLicensed: 3,
        renewalDate: '2027-01-20',
        hasBooksOnline: false,
        hasClePass: false,
        hasCriminalFormBook: true,
    },
    {
        // 4. Academic Member + 0 Add-ons
        username: 'jordan_lee',
        fullName: 'Jordan Lee',
        membershipType: 'academic',
        yearsLicensed: 0,
        renewalDate: '2027-09-01',
        hasBooksOnline: false,
        hasClePass: false,
        hasCriminalFormBook: false,
    },
    {
        // 5. No Subscription (Empty / Guest User)
        username: 'guest_user',
        fullName: 'Guest User',
        membershipType: null,
        yearsLicensed: 0,
        renewalDate: null,
        hasBooksOnline: false,
        hasClePass: false,
        hasCriminalFormBook: false,
    },
];

export function getActiveBadges(member) {
    if (!member || !member.membershipType) {
        return { primaryBadge: null, addonBadges: [] };
    }

    const today = new Date();
    let primaryBadge = null;
    const addonBadges = [];

    const PRIMARY_BADGE_IMAGES = {
        regular: '../../images/badges/RegularBadge.svg',
        lifetime: '../../images/badges/LifetimeBadge.svg',
        sustaining: '../../images/badges/SustainingBadge.svg',
        academic: '../../images/badges/AcademicBadge.svg',
    };

    const isLifetime = member.membershipType.toLowerCase() === 'lifetime';
    const isTermActive = isLifetime || (member.renewalDate && new Date(member.renewalDate) >= today);

    if (isTermActive) {
        primaryBadge = {
            id: member.membershipType,
            imageSrc: PRIMARY_BADGE_IMAGES[member.membershipType.toLowerCase()] || null,
            type: 'primary',
        };
    }

    if (isTermActive) {
        if (member.hasBooksOnline) {
            addonBadges.push({
                id: 'books-online',
                imageSrc: '../../images/badges/BooksOnlineBadge.svg',
                type: 'addon',
            });
        }

        if (member.hasClePass) {
            addonBadges.push({
                id: 'cle-pass',
                imageSrc: '../../images/badges/CLEBadge.svg',
                type: 'addon',
            });
        }

        if (member.hasCriminalFormBook) {
            addonBadges.push({
                id: 'criminal-form-book',
                imageSrc: '../../images/badges/CLFBBadge.svg',
                type: 'addon',
            });
        }
    }

    return { primaryBadge, addonBadges };
}

function getRemainingTimeText(member) {
    if (!member || !member.membershipType) {
        return 'No active subscription';
    }

    if (member.membershipType.toLowerCase() === 'lifetime') {
        return 'Lifetime Membership';
    }

    if (!member.renewalDate) {
        return 'Renewal date not set';
    }

    const today = new Date();
    const expDate = new Date(member.renewalDate);
    const diffTime = expDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
        return 'Expired';
    }

    return `${daysRemaining} days remaining (Renews: ${member.renewalDate})`;
}

export function StatusWidget() {
    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let userId = getCookie("user_id");

    const [currentMember, setCurrentMember] = useState(mockMembers[1]);

    const { primaryBadge, addonBadges } = getActiveBadges(currentMember);

    const displayName = currentMember.fullName || currentMember.username || '';
    const timeRemainingText = getRemainingTimeText(currentMember);

    return (
        <div className="flex flex-col items-start justify-start p-6 text-left">
            {/* Single Horizontal Row for All Badges (Scaled 2x Larger) */}
            {(primaryBadge || addonBadges.length > 0) && (
                <div className="flex flex-row items-center justify-start gap-6 mb-6">
                    {/* Primary Hero Badge (Extra Large) */}
                    {primaryBadge && (
                        <div className="flex items-center justify-center">
                            <img
                                src={primaryBadge.imageSrc}
                                alt={primaryBadge.id}
                                className="w-64 h-64 md:w-72 md:h-72 object-contain"
                            />
                        </div>
                    )}

                    {/* Add-on Badges (Scaled Up to Match Proportion) */}
                    {addonBadges.map((badge) => (
                        <div key={badge.id} className="flex items-center justify-center">
                            <img
                                src={badge.imageSrc}
                                alt={badge.id}
                                className="w-28 h-28 md:w-32 md:h-32 object-contain"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Member Full Name */}
            {displayName && (
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 text-left">
                    {displayName}
                </h2>
            )}

            {/* Time Left */}
            <p className="text-sm font-medium text-gray-600 text-left">
                {timeRemainingText}
            </p>
        </div>
    );
}



