const fs = require('fs');
const lib = fs.readFileSync('src/app/components/website/repertoire/library/library.component.ts', 'utf8');
const rec = fs.readFileSync('src/app/components/website/repertoire/recommendations/recommendations.component.ts', 'utf8');

let songs = [];

// Extract library
const libMatch = lib.match(/songsByEra[^=]*=\s*({[\s\S]*?});/);
if (libMatch) {
  try {
    const obj = eval('(' + libMatch[1] + ')');
    for (const era in obj) {
      obj[era].forEach(s => {
        songs.push({ title: s.song, artist: s.artist, category: era, tags: s.tags || [], audioUrl: s.audioUrl || null, is_recommended: false });
      });
    }
  } catch(e) { console.error('lib eval error', e); }
}

// Extract recommendations
const recMatch = rec.match(/recommendations[^=]*=\s*(\[[\s\S]*?\]);/);
if (recMatch) {
  try {
    const arr = eval('(' + recMatch[1] + ')');
    arr.forEach(r => {
      // Find existing song to mark as recommended
      const existing = songs.find(s => s.title === r.song && s.artist === r.artist);
      if (existing) {
        existing.is_recommended = true;
        if (r.audioUrl) existing.audioUrl = r.audioUrl;
      } else {
        songs.push({ title: r.song, artist: r.artist, category: 'Pop / Indie', tags: [], audioUrl: r.audioUrl || null, is_recommended: true });
      }
    });
  } catch(e) { console.error('rec eval error', e); }
}

let sql = '-- Inserir musicas no repertorio\n';
songs.forEach((s, i) => {
  const tagsStr = s.tags.length ? `'{${s.tags.map(t => '"' + t + '"').join(',')}}'` : `'{}'`;
  const audioStr = s.audioUrl ? `'${s.audioUrl}'` : 'NULL';
  const title = s.title.replace(/'/g, "''");
  const artist = s.artist.replace(/'/g, "''");
  sql += `INSERT INTO repertoire (title, artist, category, tags, audio_url, is_recommended, display_order) VALUES ('${title}', '${artist}', '${s.category}', ${tagsStr}, ${audioStr}, ${s.is_recommended}, ${i});\n`;
});
fs.writeFileSync('inserts.sql', sql);
console.log('Done writing inserts.sql');
