import { Content } from '../models/content.model';

export const CONTENT_PT: Content = {
    hero: {
        headline: 'Silkadelics',
        subheadline: 'A experiência synthwave definitiva para o seu evento.',
        ctaPrimary: 'Reservar Agora',
        ctaSecondary: 'Ver Packs',
    },
    about: {
        title: 'Sobre Nós',
        description: 'Silkadelics são uma banda premium dedicada a fundir a energia vibrante dos anos 80 com a sofisticação moderna. Com uma estética synthwave única e um repertório contagiante, transformamos qualquer evento numa viagem inesquecível.',
        features: [
            { title: 'Excelência Musical', description: 'Músicos profissionais com anos de experiência.' },
            { title: 'Versatilidade', description: 'Do Jazz ao Pop, adaptamo-nos ao seu gosto.' },
            { title: 'Equipamento Pro', description: 'Som e luz de última geração para o melhor impacto.' },
        ],
    },
    eventTypes: {
        title: 'Eventos',
        items: [
            { title: 'Casamentos', description: 'Desde a cerimónia até à festa, música para cada momento.' },
            { title: 'Corporativos', description: 'Elegância e animação para a sua empresa.' },
            { title: 'Festas Privadas', description: 'Aniversários e celebrações exclusivas.' },
        ],
    },
    packs: {
        title: 'Nossos Packs',
        items: [
            { name: 'Bronze', price: 'Desde 750€', features: ['Uma performance à escolha:', '- Igreja', '- Receção dos noivos + Concerto 2h', '- DJ Live Set'], cta: 'Escolher Bronze' },
            { name: 'Prata', price: 'Desde 1200€', features: ['Full Venue:', '- Receção dos noivos', '- Concerto 2h', '- DJ Live Set'], cta: 'Escolher Prata' },
            { name: 'Ouro', price: 'Desde 1700€', features: ['All Inclusive:', '- Igreja', '- Receção dos noivos', '- Concerto 2h', '- DJ Live Set'], cta: 'Escolher Ouro' },
        ],
        extras: [
            { name: 'Violino (Músico Extra)', price: 'Sob Consulta' },
            { name: 'Hora Extra', price: '300€/h' },
        ],
    },
    gallery: {
        title: 'Galeria',
        subtitle: 'Momentos Inesquecíveis',
        backButton: 'Voltar ao Início',
        loading: 'A carregar momentos...',
        empty: 'Ainda não foram adicionados momentos à galeria.',
        downloadButton: 'Download HD',
        viewButton: 'Ver',
        pagination: {
            page: 'Página',
            of: 'de',
            items: 'momentos',
            previous: 'Anterior',
            next: 'Próxima'
        }
    },
    testimonials: {
        title: 'Testemunhos',
        subtitle: 'O que dizem sobre a nossa arte',
        items: [
            { name: 'Ana & Pedro', text: 'A banda foi incrível! Todos os convidados adoraram a música e a energia.', rating: 5 },
            { name: 'Carlos Silva', text: 'Excelente profissionalismo. Recomendo vivamente para eventos corporativos.', rating: 5 },
        ],
    },
    faq: {
        title: 'Perguntas Frequentes',
        items: [
            { question: 'Com quanta antecedência devo reservar?', answer: 'Recomendamos pelo menos 6 a 12 meses de antecedência, especialmente para a época alta.' },
            { question: 'A banda fornece o equipamento de som?', answer: 'Sim, fornecemos todo o equipamento de som e luz necessário para o evento.' },
            { question: 'Como funciona a seleção do repertório?', answer: 'Temos mais de 60 músicas. Para 2h de concerto, selecionamos cerca de 28 músicas em conjunto convosco.' },
            { question: 'Quais são os custos de deslocação?', answer: 'As despesas de deslocação variam conforme a distância. Contacte-nos para um orçamento detalhado.' }
        ],
    },
    booking: {
        title: 'Reserve a sua Data',
        subtitle: 'Entre em contacto connosco para garantir a disponibilidade.',
        fields: {
            name: 'Nome',
            email: 'Email',
            phone: 'Telemóvel',
            date: 'Data do Evento',
            eventType: 'Tipo de Evento',
            pack: 'Pack Pretendido',
            extras: 'Extras',
            message: 'Mensagem',
        },
        submit: 'Enviar Pedido',
    },
    footer: {
        contacts: 'Contactos',
        socials: 'Redes Sociais',
        rights: 'Todos os direitos reservados.',
    },
    bandMembers: {
        title: 'A Banda',
        members: [
            { id: 1, name: 'James Pereira', role: 'Vocalista', img: 'assets/img/members/vocalist.jpg', instagram: 'https://www.instagram.com/jamesteven_' },
            { id: 2, name: 'Ziig', role: 'Baixista', img: 'assets/img/members/bassist.jpg', instagram: 'https://www.instagram.com/ziig10/' },
            { id: 3, name: 'João Hilário', role: 'Guitarrista', img: 'assets/img/members/guitarist.jpg', instagram: 'https://www.instagram.com/joaohilario91/' },
            { id: 4, name: 'Alex Cabral', role: 'Baterista', img: 'assets/img/members/drummer.jpg', instagram: 'https://www.instagram.com/alex_cabral04/' },
            { id: 5, name: 'Tone', role: 'Técnico de Som', img: 'assets/img/members/sound.jpg', instagram: 'https://www.instagram.com/philipposmathias/' },
        ]
    },
    partners: {
        title: 'Parceiros',
        subtitle: 'Fotografia & Vídeo',
        items: [
            { id: 1, name: 'Livi', role: 'Fotógrafo', instagram: 'https://www.instagram.com/photo.by.livi/' },
            { id: 2, name: 'Tiago Pestana', role: 'Fotógrafo e Videógrafo', instagram: 'https://www.instagram.com/tiagopestana98/' },
        ]
    }
};

export const CONTENT_EN: Content = {
    hero: {
        headline: 'Silkadelics',
        subheadline: 'The ultimate synthwave experience for your event.',
        ctaPrimary: 'Book Now',
        ctaSecondary: 'View Packs',
    },
    about: {
        title: 'About Us',
        description: 'Silkadelics are a premium band dedicated to merging the vibrant energy of the 80s with modern sophistication. With a unique synthwave aesthetic and a contagious repertoire, we transform any event into an unforgettable journey.',
        features: [
            { title: 'Musical Excellence', description: 'Professional musicians with years of experience.' },
            { title: 'Versatility', description: 'From Jazz to Pop, we adapt to your taste.' },
            { title: 'Pro Equipment', description: 'State-of-the-art sound and light for the best impact.' },
        ],
    },
    eventTypes: {
        title: 'Events',
        items: [
            { title: 'Weddings', description: 'From the ceremony to the party, music for every moment.' },
            { title: 'Corporate', description: 'Elegance and animation for your company.' },
            { title: 'Private Parties', description: 'Birthdays and exclusive celebrations.' },
        ],
    },
    packs: {
        title: 'Our Packs',
        items: [
            { name: 'Bronze', price: 'From 750€', features: ['One performance of your choice:', '- Church', '- Reception + 2h Concert', '- DJ Live Set'], cta: 'Choose Bronze' },
            { name: 'Silver', price: 'From 1200€', features: ['Full Venue:', '- Reception', '- 2h Concert', '- DJ Live Set'], cta: 'Choose Silver' },
            { name: 'Gold', price: 'From 1700€', features: ['All Inclusive:', '- Church', '- Reception', '- 2h Concert', '- DJ Live Set'], cta: 'Choose Gold' },
        ],
        extras: [
            { name: 'Violin (Extra Musician)', price: 'On Request' },
            { name: 'Extra Hour', price: '300€/h' },
            { name: 'Travel Expenses', price: 'Variable' },
        ],
    },
    gallery: {
        title: 'Gallery',
        subtitle: 'Unforgettable Moments',
        backButton: 'Back to Home',
        loading: 'Loading moments...',
        empty: 'No moments have been added to the gallery yet.',
        downloadButton: 'Download HD',
        viewButton: 'View',
        pagination: {
            page: 'Page',
            of: 'of',
            items: 'moments',
            previous: 'Previous',
            next: 'Next'
        }
    },
    testimonials: {
        title: 'Testimonials',
        subtitle: 'What they say about our art',
        items: [
            { name: 'Ana & Pedro', text: 'The band was amazing! All the guests loved the music and the energy.', rating: 5 },
            { name: 'Carlos Silva', text: 'Excellent professionalism. Highly recommend for corporate events.', rating: 5 },
        ],
    },
    faq: {
        title: 'FAQ',
        items: [
            { question: 'How far in advance should I book?', answer: 'We recommend at least 6 to 12 months in advance, especially for high season.' },
            { question: 'Does the band provide sound equipment?', answer: 'Yes, we provide all necessary sound and light equipment for the event.' },
            { question: 'How does repertoire selection work?', answer: 'We have over 60 songs. For a 2h concert, we select about 28 songs together with you.' },
            { question: 'What are the travel costs?', answer: 'Travel expenses vary by distance. Contact us for a detailed quote.' }
        ],
    },
    booking: {
        title: 'Book Your Date',
        subtitle: 'Contact us to guarantee availability.',
        fields: {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            date: 'Event Date',
            eventType: 'Event Type',
            pack: 'Desired Pack',
            extras: 'Extras',
            message: 'Message',
        },
        submit: 'Send Request',
    },
    footer: {
        contacts: 'Contacts',
        socials: 'Social Media',
        rights: 'All rights reserved.',
    },
    bandMembers: {
        title: 'The Band',
        members: [
            { id: 1, name: 'James Pereira', role: 'Vocalist', img: 'assets/img/members/vocalist.jpg', instagram: 'https://www.instagram.com/jamesteven_' },
            { id: 2, name: 'Ziig', role: 'Bassist', img: 'assets/img/members/bassist.jpg', instagram: 'https://www.instagram.com/ziig10/' },
            { id: 3, name: 'João Hilário', role: 'Guitarist', img: 'assets/img/members/guitarist.jpg', instagram: 'https://www.instagram.com/joaohilario91/' },
            { id: 4, name: 'Alex Cabral', role: 'Drummer', img: 'assets/img/members/drummer.jpg', instagram: 'https://www.instagram.com/alex_cabral04/' },
            { id: 5, name: 'Tone', role: 'Sound Technician', img: 'assets/img/members/sound.jpg', instagram: 'https://www.instagram.com/philipposmathias/' },
        ]
    },
    partners: {
        title: 'Partners',
        subtitle: 'Photography & Video',
        items: [
            { id: 1, name: 'Livi', role: 'Photographer', instagram: 'https://www.instagram.com/photo.by.livi/' },
            { id: 2, name: 'Tiago Pestana', role: 'Photographer and Videographer', instagram: 'https://www.instagram.com/tiagopestana98/' },
        ]
    }
};
