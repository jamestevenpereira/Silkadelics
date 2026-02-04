const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('WoodPlan Events API is running');
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { name, email, phone, date, eventType, pack, extras, message } = req.body;

        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    name,
                    email,
                    phone,
                    date,
                    event_type: eventType,
                    pack,
                    extras,
                    message,
                    status: 'pending' // Default status for new bookings
                }
            ]);

        if (error) throw error;

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'woodplancontact@gmail.com',
            subject: 'Novo Pedido de Reserva - WoodPlan Events',
            text: `Novo pedido de reserva recebido:\n\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone}\nData: ${date}\nTipo de Evento: ${eventType}\nPack: ${pack}\nExtras: ${extras}\n\nMensagem: ${message || 'N/A'}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({ message: 'Booking created successfully', data });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Get Booked Dates
app.get('/api/bookings/dates', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('date, status');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error fetching booked dates:', error);
        res.status(500).json({ error: 'Failed to fetch booked dates' });
    }
});

// Get Packs (Dynamic content)
app.get('/api/packs', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('packs')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error fetching packs:', error);
        res.status(500).json({ error: 'Failed to fetch packs' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
