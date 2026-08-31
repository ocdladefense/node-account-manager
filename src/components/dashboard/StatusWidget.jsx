import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';

const membershipBadges = {
    'L': { name: 'Lifetime', badge: '../../images/badges/LifetimeBadge.svg' },
    'R': { name: 'Regular', badge: '../../images/badges/RegularBadge.svg' },
    'S': { name: 'Sustaining', badge: '../../images/badges/SustainingBadge.svg' },
    'A': { name: 'Academic', badge: '../../images/badges/AcademicBadge.svg' },
};

export function getActiveBadges(member) {
    if (!member || !member.membershipType) {
        return { primaryBadge: null, addonBadges: [] };
    }

    const today = new Date();
    let primaryBadge = null;
    const addonBadges = [];

    const letter = member.membershipType.toUpperCase();
    const selectedBadge = membershipBadges[letter];

    if (!selectedBadge) {
        return { primaryBadge: null, addonBadges: [] };
    }

    const isLifetime = letter === 'L';
    const isTermActive = isLifetime || (member.renewalDate && new Date(member.renewalDate) >= today);


    if (isTermActive) {
        primaryBadge = {
            id: selectedBadge.name,
            imageSrc: selectedBadge.badge,
            type: 'primary',
        };

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

    const memberLetter = member.membershipType.toUpperCase();

    if (memberLetter === 'L') {
        return 'Lifetime Membership';
    }

    const today = new Date();
    const expDate = new Date(`${member.renewalDate}T00:00:00`);
    const diffTime = expDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 90) {
        // Renewal button option here?
    }

    if (daysRemaining <= 0) {
        return 'Expired';
    }

    return `${daysRemaining} days remaining (Renew By: ${member.renewalDate})`;
}

export function StatusWidget() {
    let { client } = useOutletContext();
    const [currentMember, setCurrentMember] = useState(null);
    const [loading, setLoading] = useState(true);

    const contactId = getCookie("contact_id") || getCookie("user_id");

    useEffect(() => {
        if (!contactId || !client) {
            setLoading(false);
            return;
        }

        async function fetchMember() {
            try {
                setLoading(true);

                const query = `
                    SELECT
                        Id,
                        Name,
                        Ocdla_Member_Status__c,
                        Ocdla_Membership_Expiration_Date__c
                    FROM Contact
                    WHERE Id = '${contactId}'
                    LIMIT 1
                `;

                const response = await client.query(query);
                const record = response?.records?.[0];

                if (record) {
                    let memberData = {
                        fullName: record.Name,
                        membershipType: record.Ocdla_Member_Status__c ? record.Ocdla_Member_Status__c.trim() : null,
                        renewalDate: record.Ocdla_Membership_Expiration_Date__c,
                        hasBooksOnline: false,
                        hasClePass: false,
                        hasCriminalFormBook: false
                    };

                    if (record.Name?.trim().toLowerCase() === "jacqueline rael") {
                        memberData.hasBooksOnline = true;
                        memberData.hasClePass = true;
                        memberData.hasCriminalFormBook = false;
                    }

                    if (record.Name?.trim().toLowerCase() === "jose bernal") {
                        memberData.hasBooksOnline = true;
                        memberData.hasClePass = true;
                        memberData.hasCriminalFormBook = true;
                    }

                    if (record.Name?.trim().toLowerCase() === "jacob dystra") {
                        memberData.hasBooksOnline = false;
                        memberData.hasClePass = true;
                        memberData.hasCriminalFormBook = false;
                    }

                    if (record.Name?.trim().toLowerCase() === "joseph p. teague esq") {
                        memberData.hasBooksOnline = true;
                        memberData.hasClePass = false;
                        memberData.hasCriminalFormBook = false;
                    }


                    setCurrentMember(memberData);
                }
            } catch (err) {
                console.error("Error fetching status widget data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMember();
    }, [contactId, client]);

    if (loading) {
        return <div className="p-6 text-sm text-gray-500">Loading status...</div>;
    }

    if (!currentMember) {
        return null;
    }

    const { primaryBadge, addonBadges } = getActiveBadges(currentMember);
    const displayName = currentMember.fullName || '';
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



