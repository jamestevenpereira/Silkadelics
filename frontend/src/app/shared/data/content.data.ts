import { Content } from '../models/content.model';

export const CONTENT_PT: Content = {
    hero: {
        headline: 'Silkadelics',
        subheadline: 'A experiência synthwave definitiva para o seu evento.',
        ctaPrimary: 'Reservar Agora',
        ctaSecondary: 'Ver Packs',
    },
    navbar: {
        links: {
            about: 'Sobre',
            events: 'Eventos',
            packs: 'Packs',
            gallery: 'Galeria',
            repertoire: 'Repertório'
        },
        bookNow: 'Reservar'
    },
    about: {
        title: 'Sobre Nós',
        subtitle: 'Criamos a banda sonora dos vossos sonhos.',
        description: 'Silkadelics é uma banda ao vivo premium, proporcionando uma experiência inesquecível com uma seleção de grandes sucessos de rock, pop, funk, soul e dance. O nosso repertório recomendado inclui artistas como Coldplay, Linkin Park, Bruno Mars, Oasis e Kings of Leon, garantindo a banda sonora perfeita para qualquer evento. Com energia, técnica e estilo, criamos momentos que os seus convidados nunca irão esquecer.',
        badge: 'Anos de Excelência',
        ctaText: 'Já me conquistaram!',
        ctaButton: 'Garantir a Minha Data',
        stats: {
            events: 'Eventos Realizados',
            dedication: 'Dedicação'
        },
        features: [
            { title: 'Excelência Musical', description: 'Músicos profissionais com anos de experiência.' },
            { title: 'Versatilidade', description: 'Do Jazz ao Pop, adaptamo-nos ao seu gosto.' },
            { title: 'Equipamento Pro', description: 'Som e luz de última geração para o melhor impacto.' },
        ],
    },
    eventTypes: {
        title: 'Eventos',
        subtitle: 'Versatilidade para cada momento especial',
        requestQuote: 'Pedir Orçamento',
        items: [
            { title: 'Casamentos', description: 'Desde a cerimónia até à festa, música para cada momento.', type: 'weddings' },
            { title: 'Corporativos', description: 'Elegância e animação para a sua empresa.', type: 'corporate' },
            { title: 'Festas Privadas', description: 'Aniversários e celebrações exclusivas.', type: 'private' },
        ],
    },
    packs: {
        title: 'Packs',
        subtitle: 'Escolha a experiência ideal',
        recommended: 'Recomendado',
        bronzePerformanceTitle: 'Escolhe 1 das 4 performances:',
        bronzePerformanceNote: '* Apenas uma opção incluída no pack',
        bookingLabel: 'Reservar',
        extrasTitle: 'Personalize com Extras Exclusivos',
        items: [
            { name: 'Bronze', price: 'Desde 750€', features: ['Uma performance à escolha:', '- Igreja', '- Receção dos noivos + Concerto 2h', '- DJ Live Set'], cta: 'Escolher Bronze' },
            { name: 'Prata', price: 'Desde 1200€', features: ['Full Venue:', '- Receção dos noivos', '- Concerto 2h', '- DJ Live Set'], cta: 'Escolher Prata' },
            { name: 'Ouro', price: 'Desde 1700€', features: ['All Inclusive:', '- Igreja', '- Receção dos noivos', '- Concerto 2h', '- DJ Live Set'], cta: 'Escolher Ouro' },
        ],
        extras: [
            { name: 'Violino (Músico Extra)', price: 'Sob Consulta' },
            { name: 'Hora Extra', price: '300€/h' },
            { name: 'Quilómetros Extra', price: '0,40€/km', code: 'extra_miles' },
        ],
    },
    gallery: {
        title: 'Galeria',
        subtitle: 'Momentos Inesquecíveis',
        description: 'Explore todos os nossos momentos, vídeos e fotografias em alta resolução.',
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
        },
        followInstagram: 'Siga-nos no Instagram',
        viewAll: 'Ver Galeria Completa'
    },
    testimonials: {
        title: 'Testemunhos',
        subtitle: 'O que dizem sobre a nossa arte',
        empty: 'Ainda não há testemunhos disponíveis.',
        items: [
            { name: 'Ana & Pedro', text: 'A banda foi incrível! Todos os convidados adoraram a música e a energia.', rating: 5 },
            { name: 'Carlos Silva', text: 'Excelente profissionalismo. Recomendo vivamente para eventos corporativos.', rating: 5 },
        ],
    },
    faq: {
        title: 'Perguntas Frequentes',
        subtitle: 'Esclareça as suas dúvidas',
        items: [
            { question: 'Com quanta antecedência devo reservar?', answer: 'Recomendamos pelo menos 6 a 12 meses de antecedência, especialmente para a época alta.' },
            { question: 'A banda fornece equipamento de som?', answer: 'Sim, fornecemos todo o equipamento de som e luz necessário para atuar.' },
            { question: 'Como funciona a escolha do repertório?', answer: 'Escolha entre <a href="#repertoire" class="text-gold hover:text-white transition-colors underline">as nossas {count} músicas</a>. Criamos um setlist personalizado para o seu evento. No pack Casamentos, há sempre espaço para adicionar 1 música especial à escolha do casal, criando um momento único na celebração.' }
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
        placeholders: {
            message: 'Conte-nos mais sobre o seu evento...'
        },
        availability: 'Disponibilidade',
        calendarNotice: '* Selecione a data no calendário abaixo'
    },
    footer: {
        description: 'Especialistas em criar experiências musicais memoráveis para eventos que exigem o melhor. Elevamos o seu evento a um novo patamar de sofisticação.',
        contacts: 'Contactos',
        socials: 'Redes Sociais',
        navigation: 'Navegação',
        rights: 'Todos os direitos reservados.',
        privacy: 'Política de Privacidade',
        terms: 'Termos e Condições',
        links: {
            about: 'A Banda',
            events: 'Eventos',
            packs: 'Packs',
            gallery: 'Galeria',
        },
    },
    bandMembers: {
        title: 'A Banda',
        subtitle: 'Músicos de excelência',
        members: [
            { id: 1, name: 'James Pereira', role: 'Vocalista', img: 'assets/img/members/vocalist.jpg', instagram: 'https://www.instagram.com/jamesteven_' },
            { id: 2, name: 'Ziig', role: 'Baixista', img: 'assets/img/members/bassist.jpg', instagram: 'https://www.instagram.com/ziig10/' },
            { id: 3, name: 'João Hilário', role: 'Guitarrista', img: 'assets/img/members/guitarist.jpg', instagram: 'https://www.instagram.com/joaohilario91/' },
            { id: 4, name: 'Alex Cabral', role: 'Baterista', img: 'assets/img/members/drummer.jpg', instagram: 'https://www.instagram.com/alex_cabral04/' },
            { id: 5, name: 'Tone', role: 'Técnico de Som', img: 'assets/img/members/sound.jpg', instagram: 'https://www.instagram.com/philipposmathias/' },
        ]
    },
    repertoire: {
        title: 'Repertório',
        totalSongs: 'Seleciona a partir das nossas {count} músicas',
        searchPlaceholder: 'Pesquisar música ou artista...',
        filterAll: 'Todas as Categorias',
        pagination: {
            previous: 'Anterior',
            next: 'Próximo',
            pageOf: 'Página {current} de {total}'
        },
        empty: 'Nenhuma música encontrada.'
    },
    whatsapp: {
        defaultMessage: 'Olá! Gostaria de saber mais sobre Silkadelics.',
        header: 'Fale Connosco',
        button: 'Abrir WhatsApp'
    },
    calendar: {
        title: 'Calendário',
        weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        legend: {
            booked: 'Ocupado',
            pending: 'Pendente',
            selected: 'A sua data'
        }
    },
    shared: {
        loading: 'A carregar...',
        success: 'Pedido enviado com sucesso! Entraremos em contacto em breve.',
        error: 'Ocorreu um erro. Por favor tente novamente.',
        processing: 'A processar...',
        back: 'Voltar',
        select: 'Selecione uma opção',
        seeMore: 'Ver mais'
    },
    partners: {
        title: 'Parceiros',
        subtitle: 'Fotografia & Vídeo',
        description: 'As nossas recomendações de confiança para garantir que os vossos momentos mais íntegros ficam registados com perfeição.',
        viewInstagram: 'Ver Instagram',
        items: [
            { id: 1, name: 'Livi', role: 'Fotógrafo', instagram: 'https://www.instagram.com/photo.by.livi/' },
            { id: 2, name: 'Tiago Pestana', role: 'Fotógrafo e Videógrafo', instagram: 'https://www.instagram.com/tiagopestana98/' },
        ]
    },
    roles: {
        'Vocalista': 'Vocalista',
        'Baixista': 'Baixista',
        'Guitarrista': 'Guitarrista',
        'Baterista': 'Baterista',
        'Técnico de Som': 'Técnico de Som',
        'Fotógrafo': 'Fotógrafo',
        'Fotógrafo e Videógrafo': 'Fotógrafo e Videógrafo'
    },
    packFeatures: {
        'Cerimónia (Igreja ou Civil)': 'Cerimónia (Igreja ou Civil)',
        'Cocktail / Aperitivos': 'Cocktail / Aperitivos',
        'Deslocação até 50km': 'Deslocação até 50km',
        'Copo d\'água (2h Concerto)': 'Copo d\'água (2h Concerto)',
        'DJ Set (Pós-concerto)': 'DJ Set (Pós-concerto)',
        '- Cerimónia (Igreja ou Civil)': '- Cerimónia (Igreja ou Civil)',
        '- Copo d\'água (2h Concerto)': '- Copo d\'água (2h Concerto)',
        '- DJ Set (Pós-concerto)': '- DJ Set (Pós-concerto)',
        '- Church': '- Church',
        '- Reception + 2h Concert': '- Reception + 2h Concert',
        '- DJ Live Set': '- DJ Live Set',
        'Full Venue:': 'Full Venue:',
        'All Inclusive:': 'All Inclusive:'
    }
};

export const CONTENT_EN: Content = {
    hero: {
        headline: 'Silkadelics',
        subheadline: 'The ultimate synthwave experience for your event.',
        ctaPrimary: 'Book Now',
        ctaSecondary: 'View Packs',
    },
    navbar: {
        links: {
            about: 'About',
            events: 'Events',
            packs: 'Packs',
            gallery: 'Gallery',
            repertoire: 'Repertoire'
        },
        bookNow: 'Book Now'
    },
    about: {
        title: 'About Us',
        subtitle: 'We create the soundtrack to your dreams.',
        description: 'Silkadelics are a premium live band, delivering an unforgettable performance with a mix of iconic hits from rock, pop, funk, soul, and dance. Our recommended repertoire features artists like Coldplay, Linkin Park, Bruno Mars, Oasis, and Kings of Leon, ensuring the perfect soundtrack for any event. With energy, precision, and style, we create moments your guests will remember forever.',
        badge: 'Years of Excellence',
        ctaText: 'They’ve won me over!',
        ctaButton: 'Secure My Date',
        stats: {
            events: 'Events Performed',
            dedication: 'Dedication'
        },
        features: [
            { title: 'Musical Excellence', description: 'Professional musicians with years of experience.' },
            { title: 'Versatility', description: 'From Jazz to Pop, we adapt to your taste.' },
            { title: 'Pro Equipment', description: 'State-of-the-art sound and light for the best impact.' },
        ],
    },
    eventTypes: {
        title: 'Events',
        subtitle: 'Versatility for every special moment',
        requestQuote: 'Request Quote',
        items: [
            { title: 'Weddings', description: 'From the ceremony to the party, music for every moment.', type: 'weddings' },
            { title: 'Corporate', description: 'Elegance and animation for your company.', type: 'corporate' },
            { title: 'Private Parties', description: 'Birthdays and exclusive celebrations.', type: 'private' },
        ],
    },
    packs: {
        title: 'Packs',
        subtitle: 'Choose the ideal experience',
        recommended: 'Recommended',
        bronzePerformanceTitle: 'Choose 1 of 3 performances:',
        bronzePerformanceNote: '* Only one option included in the pack',
        bookingLabel: 'Book Now',
        extrasTitle: 'Customize with Exclusive Extras',
        items: [
            { name: 'Bronze', price: 'From 750€', features: ['One performance of your choice:', '- Church', '- Reception + 2h Concert', '- DJ Live Set'], cta: 'Choose Bronze' },
            { name: 'Silver', price: 'From 1200€', features: ['Full Venue:', '- Reception + 2h Concert', '- DJ Live Set'], cta: 'Choose Silver' },
            { name: 'Gold', price: 'From 1700€', features: ['All Inclusive:', '- Church', '- Reception + 2h Concert', '- DJ Live Set'], cta: 'Choose Gold' },
        ],
        extras: [
            { name: 'Violin (Extra Musician)', price: 'On Request' },
            { name: 'Extra Hour', price: '300€/h' },
            { name: 'Extra Miles', price: '€0.40/km', code: 'extra_miles' },
        ],
    },
    gallery: {
        title: 'Gallery',
        subtitle: 'Unforgettable Moments',
        description: 'Explore all our moments, videos and high-resolution photographs.',
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
        },
        followInstagram: 'Follow us on Instagram',
        viewAll: 'View Full Gallery'
    },
    testimonials: {
        title: 'Testimonials',
        subtitle: 'What they say about our art',
        empty: 'No testimonials available yet.',
        items: [
            { name: 'Ana & Pedro', text: 'The band was amazing! All the guests loved the music and the energy.', rating: 5 },
            { name: 'Carlos Silva', text: 'Excellent professionalism. Highly recommend for corporate events.', rating: 5 },
        ],
    },
    faq: {
        title: 'FAQ',
        subtitle: 'Clear your doubts',
        items: [
            { question: 'How far in advance should I book?', answer: 'We recommend at least 6 to 12 months in advance, especially for high season.' },
            { question: 'Does the band provide sound equipment?', answer: 'Yes, we provide all necessary sound and light equipment for the event.' },
            { question: 'How does repertoire selection work?', answer: 'Select from <a href="#repertoire" class="text-gold hover:text-white transition-colors underline">our {count} songs</a>. We create a tailored setlist for your event. For the Weddings pack, there is always room to include 1 special song of your choice, giving the couple a unique moment during their celebration.' }
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
        placeholders: {
            message: 'Tell us more about your event...'
        },
        availability: 'Availability',
        calendarNotice: '* Select the date on the calendar below'
    },
    footer: {
        description: 'Specialists in creating memorable musical experiences for events that demand the best. We elevate your event to a new level of sophistication.',
        contacts: 'Contacts',
        socials: 'Social Media',
        navigation: 'Navigation',
        rights: 'All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms and Conditions',
        links: {
            about: 'The Band',
            events: 'Events',
            packs: 'Packs',
            gallery: 'Gallery',
        },
    },
    bandMembers: {
        title: 'The Band',
        subtitle: 'Musicians of excellence',
        members: [
            { id: 1, name: 'James Pereira', role: 'Vocalist', img: 'assets/img/members/vocalist.jpg', instagram: 'https://www.instagram.com/jamesteven_' },
            { id: 2, name: 'Ziig', role: 'Bassist', img: 'assets/img/members/bassist.jpg', instagram: 'https://www.instagram.com/ziig10/' },
            { id: 3, name: 'João Hilário', role: 'Guitarist', img: 'assets/img/members/guitarist.jpg', instagram: 'https://www.instagram.com/joaohilario91/' },
            { id: 4, name: 'Alex Cabral', role: 'Drummer', img: 'assets/img/members/drummer.jpg', instagram: 'https://www.instagram.com/alex_cabral04/' },
            { id: 5, name: 'Tone', role: 'Sound Technician', img: 'assets/img/members/sound.jpg', instagram: 'https://www.instagram.com/philipposmathias/' },
        ]
    },
    repertoire: {
        title: 'Repertoire',
        totalSongs: 'Select from our {count} songs',
        searchPlaceholder: 'Search song or artist...',
        filterAll: 'All Categories',
        pagination: {
            previous: 'Previous',
            next: 'Next',
            pageOf: 'Page {current} of {total}'
        },
        empty: 'No songs found.'
    },
    whatsapp: {
        defaultMessage: 'Hello! I would like to know more about Silkadelics.',
        header: 'Talk to Us',
        button: 'Open WhatsApp'
    },
    calendar: {
        title: 'Calendar',
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        legend: {
            booked: 'Booked',
            pending: 'Pending',
            selected: 'Your Date'
        }
    },
    shared: {
        loading: 'Loading...',
        success: 'Request sent successfully! We will contact you soon.',
        error: 'An error occurred. Please try again.',
        processing: 'Processing...',
        back: 'Back',
        select: 'Please select an option',
        seeMore: 'See more'
    },
    partners: {
        title: 'Partners',
        subtitle: 'Photography & Video',
        description: 'Our trusted recommendations to ensure your most cherished moments are captured perfectly.',
        viewInstagram: 'View Instagram',
        items: [
            { id: 1, name: 'Livi', role: 'Photographer', instagram: 'https://www.instagram.com/photo.by.livi/' },
            { id: 2, name: 'Tiago Pestana', role: 'Photographer and Videographer', instagram: 'https://www.instagram.com/tiagopestana98/' },
        ]
    },
    roles: {
        'Vocalista': 'Vocalist',
        'Baixista': 'Bassist',
        'Guitarrista': 'Guitarist',
        'Baterista': 'Drummer',
        'Técnico de Som': 'Sound Technician',
        'Fotógrafo': 'Photographer',
        'Fotógrafo e Videógrafo': 'Photographer and Videographer'
    },
    packFeatures: {
        'Cerimónia (Igreja ou Civil)': 'Ceremony (Church or Civil)',
        'Cocktail / Aperitivos': 'Cocktail / Appetizers',
        'Deslocação até 50km': 'Travel up to 50km',
        'Copo d\'água (2h Concerto)': 'Reception (2h Concert)',
        'DJ Set (Pós-concerto)': 'DJ Set (Post-concert)',
        '- Cerimónia (Igreja ou Civil)': '- Ceremony (Church or Civil)',
        '- Copo d\'água (2h Concerto)': '- Reception (2h Concert)',
        '- DJ Set (Pós-concerto)': '- DJ Set (Post-concert)',
        '- Church': '- Church',
        '- Reception + 2h Concert': '- Reception + 2h Concert',
        '- DJ Live Set': '- DJ Live Set',
        'Full Venue:': 'Full Venue:',
        'All Inclusive:': 'All Inclusive:'
    }
};
