export interface Content {
    hero: {
        headline: string;
        subheadline: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
    navbar: {
        links: {
            about: string;
            events: string;
            packs: string;
            gallery: string;
            repertoire: string;
        };
        bookNow: string;
    };
    about: {
        title: string;
        subtitle: string;
        description: string;
        badge: string;
        ctaText: string;
        ctaButton: string;
        stats: {
            events: string;
            dedication: string;
        };
        features: {
            title: string;
            description: string;
        }[];
    };
    eventTypes: {
        title: string;
        subtitle: string;
        requestQuote: string;
        items: {
            title: string;
            description: string;
        }[];
    };
    packs: {
        title: string;
        subtitle: string;
        recommended: string;
        bronzePerformanceTitle: string;
        bronzePerformanceNote: string;
        bookingLabel: string;
        extrasTitle: string;
        items: {
            name: string;
            price: string;
            features: string[];
            cta: string;
        }[];
        extras: {
            name: string;
            price: string;
            code?: string;
        }[];
    };
    gallery: {
        title: string;
        subtitle: string;
        description: string;
        backButton: string;
        loading: string;
        empty: string;
        downloadButton: string;
        viewButton: string;
        pagination: {
            page: string;
            of: string;
            items: string;
            previous: string;
            next: string;
        };
        followInstagram: string;
        viewAll: string;
    };
    testimonials: {
        title: string;
        subtitle: string;
        empty: string;
        items: {
            name: string;
            text: string;
            rating: number;
        }[];
    };
    booking: {
        title: string;
        subtitle: string;
        fields: {
            name: string;
            email: string;
            phone: string;
            date: string;
            eventType: string;
            pack: string;
            extras: string;
            message: string;
        };
        submit: string;
        placeholders: {
            message: string;
        };
        availability: string;
        calendarNotice: string;
    };
    faq: {
        title: string;
        subtitle: string;
        items: {
            question: string;
            answer: string;
        }[];
    };
    footer: {
        description: string;
        contacts: string;
        socials: string;
        navigation: string;
        rights: string;
        privacy: string;
        terms: string;
        links: {
            about: string;
            events: string;
            packs: string;
            gallery: string;
        };
    };
    bandMembers: {
        title: string;
        subtitle: string;
        members: {
            id: number;
            name: string;
            role: string;
            img: string;
            instagram: string;
        }[];
    };
    partners: {
        title: string;
        subtitle: string;
        description: string;
        viewInstagram: string;
        items: {
            id: number;
            name: string;
            role: string;
            instagram: string;
        }[];
    };
    repertoire: {
        title: string;
        totalSongs: string;
        searchPlaceholder: string;
        filterAll: string;
        pagination: {
            previous: string;
            next: string;
            pageOf: string;
        };
        empty: string;
    };
    whatsapp: {
        defaultMessage: string;
        header: string;
        button: string;
    };
    calendar: {
        title: string;
        weekDays: string[];
        months: string[];
        legend: {
            booked: string;
            pending: string;
            selected: string;
        };
    };
    shared: {
        loading: string;
        success: string;
        error: string;
        processing: string;
        back: string;
        select: string;
        seeMore: string;
    };
    roles: Record<string, string>;
    packFeatures: Record<string, string>;
}
