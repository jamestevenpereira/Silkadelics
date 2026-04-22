const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security Rate Limiter for Bookings
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many booking requests. Please try again later.' }
});

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Resend Client
const resend = new Resend(process.env.RESEND_API_KEY);

// Routes
app.get('/', (req, res) => {
  res.send('WoodPlan Events API is running');
});

// Create Booking
app.post('/api/bookings', bookingLimiter, async (req, res) => {
  try {
    let { name, email, phone, date, eventType, pack, extras, message } = req.body;

    // Backend Validation
    const nameRegex = /^[a-zA-Z\sÀ-ÿ\-\']+$/;
    const phoneRegex = /^\+?[0-9\s\-]{7,20}$/;

    if (!name || !nameRegex.test(name)) {
      return res.status(400).json({ error: 'Invalid name. Only letters and spaces allowed.' });
    }
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number. Use digits and optional + prefix.' });
    }

    // Clean Extras (Remove Travel/Deslocação if present from legacy or client-side manipulation)
    if (extras && typeof extras === 'string') {
      extras = extras.split(', ')
        .filter(e => e !== 'Deslocação' && e !== 'Travel')
        .join(', ');
    }

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

    // Send Email Notification via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Silkadelics <onboarding@resend.dev>',
      to: 'silkadelics@gmail.com',
      subject: 'Novo Pedido de Reserva - Silkadelics',
      html: `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#05010d;font-family:Montserrat,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#05010d">
    <tr>
      <td style="padding:40px 30px 20px;text-align:center;border-bottom:1px solid rgba(255,45,149,0.3)">
        <div style="font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#ff2d95;margin-bottom:6px;">the</div>
        <div style="font-size:28px;font-weight:700;letter-spacing:3px;text-transform:uppercase;background:linear-gradient(135deg,#ff2d95,#9d00ff,#00f3ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Silkadelics</div>
        <div style="font-size:9px;letter-spacing:6px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:6px">Booking Notification</div>
      </td>
    </tr>
    <tr>
      <td style="padding:30px 30px 0">
        <h2 style="margin:0 0 20px;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff">Novo Pedido de Reserva</h2>
        <!-- Client Info -->
        <table width="100%" style="background:rgba(255,45,149,0.05);border:1px solid rgba(255,45,149,0.2);border-radius:12px;margin-bottom:16px" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ff2d95;margin-bottom:4px">Cliente</div>
            <div style="font-size:16px;color:#fff;font-weight:600">${name}</div>
          </td></tr>
          <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ff2d95;margin-bottom:4px">Email</div>
            <div style="font-size:15px;color:rgba(255,255,255,0.85)">${email}</div>
          </td></tr>
          <tr><td style="padding:20px 24px">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ff2d95;margin-bottom:4px">Telefone</div>
            <div style="font-size:15px;color:rgba(255,255,255,0.85)">${phone}</div>
          </td></tr>
        </table>
        <!-- Event Info -->
        <table width="100%" style="background:rgba(0,243,255,0.05);border:1px solid rgba(0,243,255,0.2);border-radius:12px;margin-bottom:16px" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00f3ff;margin-bottom:4px">Data</div>
            <div style="font-size:16px;color:#fff;font-weight:600">${date}</div>
          </td></tr>
          <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00f3ff;margin-bottom:4px">Tipo de Evento / Pack</div>
            <div style="font-size:15px;color:rgba(255,255,255,0.85)">${eventType} — ${pack}</div>
          </td></tr>
          <tr><td style="padding:20px 24px">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00f3ff;margin-bottom:4px">Extras</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.65)">${extras || 'Nenhum'}</div>
          </td></tr>
        </table>
        <!-- Message -->
        ${message ? `
        <table width="100%" style="background:rgba(157,0,255,0.05);border:1px solid rgba(157,0,255,0.25);border-radius:12px;margin-bottom:16px" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 24px">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#9d00ff;margin-bottom:8px">Mensagem</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;font-style:italic">&ldquo;${message}&rdquo;</div>
          </td></tr>
        </table>` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding:24px 30px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.07);margin-top:20px">
        <p style="margin:0;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.25);text-transform:uppercase">Silkadelics &bull; Sistema Automático</p>
      </td>
    </tr>
  </table>
</body>
</html>
            `
    });

    if (emailError) {

      console.error('Error sending email via Resend:', emailError);
    } else {
      console.log('Email sent successfully via Resend:', emailData.id);
    }

    res.status(201).json({ message: 'Booking created successfully', data });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Song Suggestion
app.post('/api/suggestions', async (req, res) => {
  try {
    const { name, email, artist, song, message } = req.body;

    if (!artist || !song) {
      return res.status(400).json({ error: 'Artist and Song are required.' });
    }

    // Send Email Notification via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Silkadelics Suggestions <onboarding@resend.dev>',
      to: 'silkadelics@gmail.com',
      subject: `Nova Sugestão de Música: ${song} - ${artist}`,
      html: `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#05010d;font-family:Montserrat,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#05010d">
    <tr>
      <td style="padding:40px 30px 20px;text-align:center;border-bottom:1px solid rgba(157,0,255,0.3)">
        <div style="font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#9d00ff;margin-bottom:6px;">new</div>
        <div style="font-size:28px;font-weight:700;letter-spacing:3px;text-transform:uppercase;background:linear-gradient(135deg,#ff2d95,#9d00ff,#00f3ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Suggestion</div>
        <div style="font-size:9px;letter-spacing:6px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:6px">Song Recommendation</div>
      </td>
    </tr>
    <tr>
      <td style="padding:30px 30px 0">
        <h2 style="margin:0 0 20px;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff">Nova Sugestão de Música</h2>
        
        <!-- Song Info -->
        <table width="100%" style="background:rgba(157,0,255,0.05);border:1px solid rgba(157,0,255,0.2);border-radius:12px;margin-bottom:16px" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#9d00ff;margin-bottom:4px">Música</div>
            <div style="font-size:18px;color:#fff;font-weight:700">${song}</div>
          </td></tr>
          <tr><td style="padding:20px 24px">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#9d00ff;margin-bottom:4px">Artista</div>
            <div style="font-size:16px;color:rgba(255,255,255,0.85);font-weight:600">${artist}</div>
          </td></tr>
        </table>

        <!-- User Info -->
        <table width="100%" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.1);border-radius:12px;margin-bottom:16px" cellpadding="0" cellspacing="0">
          <tr><td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:4px">Sugerido por</div>
            <div style="font-size:14px;color:#fff">${name || 'Anónimo'}</div>
          </td></tr>
          ${email ? `<tr><td style="padding:16px 24px">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:4px">Contacto</div>
            <div style="font-size:14px;color:#fff">${email}</div>
          </td></tr>` : ''}
        </table>

        <!-- Message -->
        ${message ? `
        <table width="100%" style="background:rgba(0,243,255,0.03);border:1px solid rgba(0,243,255,0.15);border-radius:12px;margin-bottom:16px" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 24px">
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00f3ff;margin-bottom:8px">Nota Adicional</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;font-style:italic">&ldquo;${message}&rdquo;</div>
          </td></tr>
        </table>` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding:24px 30px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.07);margin-top:20px">
        <p style="margin:0;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.25);text-transform:uppercase">Silkadelics &bull; Repertoire Suggestions</p>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    });

    if (emailError) {
      console.error('Error sending suggestion email:', emailError);
      return res.status(500).json({ error: 'Failed to send suggestion email' });
    }

    res.status(200).json({ message: 'Suggestion sent successfully' });
  } catch (error) {
    console.error('Error handling suggestion:', error);
    res.status(500).json({ error: 'Failed to process suggestion' });
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
// Get Songs Count
app.get('/api/songs/count', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('repertoire')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    console.error('SERVER_ERROR [GET /api/songs/count]:', error);
    res.status(500).json({ error: 'Failed to fetch songs count', details: error.message });
  }
});

// Get Testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('SERVER_ERROR [GET /api/testimonials]:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
