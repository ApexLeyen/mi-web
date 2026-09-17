const https = require('https');

// Lista de temas para rotar cada día
const topics = [
  'consejos para programar mejor en Android con Kotlin',
  'novedades de inteligencia artificial para desarrolladores en 2026',
  'cómo optimizar el rendimiento y batería de apps Android',
  'herramientas gratuitas imprescindibles para desarrolladores web',
  'cómo crear una API REST moderna con Node.js paso a paso',
  'mejores prácticas de ciberseguridad en aplicaciones móviles',
  'cómo publicar tu app en Google Play Store correctamente',
  'diferencias clave entre desarrollo multiplataforma y Android nativo',
  'tips de UI y UX para diseñar apps Android profesionales',
  'cómo manejar bases de datos locales en Android con Room',
  'introducción a TypeScript para desarrolladores JavaScript',
  'guía práctica de Git y GitHub para proyectos de desarrollo',
  'qué es el Clean Code y por qué debes aplicarlo en tus proyectos',
  'cómo mejorar la velocidad de carga y SEO de tu sitio web',
  'introducción al desarrollo web con Next.js y React',
];

const topic = topics[Math.floor(Math.random() * topics.length)];
console.log('📌 Tema seleccionado para hoy:', topic);

const prompt = `Eres un redactor y diseñador técnico para el blog de Muñeco Tecnology.
Escribe un artículo de blog completo en español sobre el tema: "${topic}".
El artículo debe ser útil, educativo, profesional y tener entre 500 y 700 palabras.
Dentro del contenido en Markdown, incluye subtítulos ##, explicaciones claras y añade exactamente 1 imagen explicativa relevante en medio del texto usando la sintaxis:
![Ilustración conceptual](https://image.pollinations.ai/prompt/<PROMPT_EN_INGLES_CORTO_DEL_TEMA_SEPARADO_CON_GUIONES-dark-neon-blue-no-text-no-watermark>?width=700&height=380&nologo=true)
donde la URL esté limpia y en minúsculas.
Responde ÚNICAMENTE con un objeto JSON válido, sin bloques markdown.
Usa exactamente esta estructura:
{
  "title": "título atractivo y profesional",
  "excerpt": "resumen breve de 1 a 2 oraciones para la tarjeta del blog",
  "content": "contenido completo en Markdown con subtítulos ##, párrafos y la imagen integrada",
  "tag": "una de estas exactamente: Android, Tutorial, Tecnología, Programación, Web",
  "readTime": "X min de lectura",
  "imagePrompt": "Un prompt en inglés para generar SOLO EL FONDO de la imagen, sin texto. Ejemplo: 'Dark high tech neon city background with a glowing cyber shield in the center, electric blue lighting, clean 3d render, octane engine, completely clean, no text, no words, no watermark'",
  "bullets": ["Icono 1 - Descripción corta", "Icono 2 - Descripción corta", "Icono 3 - Descripción corta", "Icono 4 - Descripción corta", "Icono 5 - Descripción corta", "Icono 6 - Descripción corta", "Icono 7 - Descripción corta"]
}`;

const geminiBody = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  },
});

async function callGemini(attempt = 1) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        path: '/v1beta/models/gemini-3.6-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(geminiBody),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', async () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              if ((json.error.code === 503 || json.error.code === 429) && attempt < 4) {
                console.warn(`⚠️ Servidores de Google con alta demanda (${json.error.code}). Reintentando en 8s (intento ${attempt}/3)...`);
                await new Promise((r) => setTimeout(r, 8000));
                return resolve(await callGemini(attempt + 1));
              }
              console.error('❌ Error devuelto por Gemini API:', JSON.stringify(json.error, null, 2));
              process.exit(1);
            }
            if (!json.candidates || !json.candidates[0]) {
              console.error('❌ Error: Gemini no devolvió candidatos. Respuesta:', data);
              process.exit(1);
            }
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', (e) => {
      console.error('Error llamando a Gemini:', e);
      process.exit(1);
    });
    req.write(geminiBody);
    req.end();
  });
}

(async () => {
  try {
    console.log('🤖 Consultando a Gemini 3.6 Flash...');
    const geminiRes = await callGemini();

    let text = geminiRes.candidates[0].content.parts[0].text.trim();

    // Quitar bloques markdown si los hay
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // Extraer bloque JSON entre { y }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    let blogData;
    try {
      blogData = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ Error parseando JSON de Gemini. Texto crudo recibido:');
      console.error(text.substring(0, 500) + '...[recortado]...' + text.substring(text.length - 500));
      throw parseError;
    }
    
    console.log('✅ Contenido generado con éxito:', blogData.title);

    // Guardar las viñetas generadas como comentario HTML dentro del contenido
    if (blogData.bullets && Array.isArray(blogData.bullets)) {
      blogData.content = `<!-- BULLETS: ${JSON.stringify(blogData.bullets)} -->\n\n` + blogData.content;
      delete blogData.bullets;
    }

    // Generar ilustración de portada temática con la estructura y texto especificados
    const topicSubject = blogData.imagePrompt || (blogData.title + ' technology concept');
    const techPrompt = topicSubject + ', dark high tech background, glowing vibrant neon cyan and electric blue lighting, completely clean, no text, no letters, no words, no watermark, pure digital art';

    console.log('🎨 Generando portada temática...');
    console.log('📝 Prompt de portada:', techPrompt);
    const imgUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(techPrompt) + '?width=800&height=450&nologo=true';

    let coverImage = '🤖';
    try {
      console.log('📥 Descargando imagen...');
      const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (imgRes.ok) {
        const arrayBuffer = await imgRes.arrayBuffer();
        const buf = Buffer.from(arrayBuffer);
        coverImage = 'data:image/jpeg;base64,' + buf.toString('base64');
        console.log('🖼️ Ilustración descargada con éxito (' + (buf.length / 1024).toFixed(1) + ' KB)');
      } else {
        console.warn('⚠️ No se pudo generar la imagen (status ' + imgRes.status + '), usando emoji');
      }
    } catch (imgErr) {
      console.warn('⚠️ Error al procesar imagen:', imgErr.message);
    }

    blogData.emoji = coverImage;

    console.log('🚀 Publicando artículo en munecotecnology.uk...');
    const postBody = JSON.stringify(blogData);

    const postReq = https.request(
      {
        hostname: 'munecotecnology.uk',
        path: '/api/auto-post',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.AUTO_POST_SECRET,
          'Content-Length': Buffer.byteLength(postBody),
        },
      },
      (postRes) => {
        let postData = '';
        postRes.on('data', (chunk) => (postData += chunk));
        postRes.on('end', () => {
          if (postRes.statusCode === 201) {
            console.log('✅ ¡Artículo publicado exitosamente en el blog! ID:', JSON.parse(postData).postId);
          } else {
            console.error('❌ Error al publicar. Status:', postRes.statusCode, 'Respuesta:', postData);
            process.exit(1);
          }
        });
      }
    );

    postReq.on('error', (e) => {
      console.error('Error de red al publicar:', e);
      process.exit(1);
    });
    postReq.write(postBody);
    postReq.end();
  } catch (e) {
    console.error('Error general:', e.message);
    process.exit(1);
  }
})();
