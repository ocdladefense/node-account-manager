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
        regular: '../../images/badges/regularBadge.svg',
        lifetime: '../../images/badges/lifetimeBadge.svg',
        sustaining: '../../images/badges/sustainingBadge.svg',
        academic: '../../images/badges/academicBadge.svg',
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
                imageSrc: '../../images/badges/booksOnlineBadge.svg',
                type: 'addon',
            });
        }

        if (member.hasClePass) {
            addonBadges.push({
                id: 'cle-pass',
                imageSrc: '../../images/badges/cleBadge.svg',
                type: 'addon',
            });
        }

        if (member.hasCriminalFormBook) {
            addonBadges.push({
                id: 'criminal-form-book',
                imageSrc: '../../images/badges/clfbBadge.svg',
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
            {(primaryBadge || addonBadges.length > 0) && (
                <div className="flex flex-row items-end justify-start gap-1.5 mb-4">
                    {primaryBadge && (
                        <div className="flex items-center justify-center">
                            <img
                                src={primaryBadge.imageSrc}
                                alt={primaryBadge.id}
                                className="w-48 h-48 md:w-56 md:h-56 object-contain"
                            />
                        </div>
                    )}

                    {addonBadges.length > 0 && (
                        <div className="flex flex-row items-center gap-1.5 pb-4 ">
                            {addonBadges.map((badge) => (
                                <div key={badge.id} className="flex items-center justify-center">
                                    <img
                                        src={badge.imageSrc}
                                        alt={badge.id}
                                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {displayName && (
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 text-left">
                    {displayName}
                </h2>
            )}

            <p className="text-sm font-medium text-gray-600 text-left">
                {timeRemainingText}
            </p>
        </div>
    );

}



