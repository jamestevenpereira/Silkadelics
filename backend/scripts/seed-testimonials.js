require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testimonials = [
  {
    name: 'Ana Farias',
    role: 'Design Gráfico',
    text: 'Procurei os serviços da Beatriz porque queria aproveitar os skills que já tinha para mudar de carreira. Tinha medo de contratar um profissional de RH porque, se eu não sabia que emprego queria, como poderia ela ajudar-me? "Um profissional RH não pode conhecer todas as áreas e todos os nichos!", pensava eu. A Beatriz fez-me um brainstorming extraordinário. Observante e cheia de boas perguntas, tirou cá para fora o que eu sem saber, sabia, e faz a sua magia profissional para transformar essa informação em possibilidades concretas e ajustadas.',
    img: null
  },
  {
    name: 'Murilo Evangelista',
    role: 'Controller de Gestão',
    text: 'A Beatriz me ajudou em um momento muito importante da minha carreira, um momento de transição no qual seu apoio e atenção foi crucial para meu novo desafio. A Beatriz é uma profissional muito dedicada, atenciosa e comprometida com o resultado.',
    img: null
  },
  {
    name: 'Hélia Barros',
    role: 'Fundadora e Nutricionista na HBNutrição',
    text: 'A Beatriz abraçou as necessidades da HBnutrição com uma entrega e um profissionalismo difíceis de encontrar aos dias de hoje. As necessidades eram urgentes e muito específicas, e a sua resposta foi desde o primeiro dia "não há impossíveis". Os procedimentos foram desenvolvidos sempre em grande proximidade com a gerência da clínica, mas com uma autonomia e um mergulho que nos permitiu delegar com confiança!',
    img: null
  }
];

async function run() {
  const { error: delErr } = await supabase.from('testimonials').delete().neq('id', 0);
  if (delErr) { console.error('Erro ao apagar:', delErr); process.exit(1); }
  console.log('Testimonials antigos apagados.');

  const { error: insErr } = await supabase.from('testimonials').insert(testimonials);
  if (insErr) { console.error('Erro ao inserir:', insErr); process.exit(1); }
  console.log('3 testimonials inseridos com sucesso.');
}

run();
