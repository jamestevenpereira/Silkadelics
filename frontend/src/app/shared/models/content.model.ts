export interface Content {
    hero: {
        headline: string;
        subheadline: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
    about: {
        title: string;
        description: string;
        features: {
            title: string;
            description: string;
        }[];
    };
    eventTypes: {
        title: string;
        items: {
            title: string;
            description: string;
        }[];
    };
    packs: {
        title: string;
        items: {
            name: string;
            price: string;
            features: string[];
            cta: string;
        }[];
        extras: {
            name: string;
            price: string;
        }[];
    };
    gallery: {
        title: string;
        subtitle: string;
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
    };
    testimonials: {
        title: string;
        subtitle: string;
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
    };
    faq: {
        title: string;
        items: {
            question: string;
            answer: string;
        }[];
    };
    footer: {
        contacts: string;
        socials: string;
        rights: string;
    };
    bandMembers: {
        title: string;
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
        items: {
            id: number;
            name: string;
            role: string;
            instagram: string;
        }[];
    };
}
