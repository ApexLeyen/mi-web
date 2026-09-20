const https = require('https');

// Lista de temas para rotar cada día (uno diferente según el día del año)
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

// Usar el día del año para no repetir temas
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
const topic = topics[dayOfYear % topics.length];
console.log('📌 Tema seleccionado para hoy:', topic);

// Mapa de imágenes concretas por categoría de tema (NO dependemos de Gemini para esto)
function getImagePrompt(topicStr) {
  const t = topicStr.toLowerCase();
  if (t.includes('seo') || t.includes('velocidad') || t.includes('carga')) {
    return 'Cinematic 3D render of a futuristic web performance dashboard floating in dark space, glowing speed gauges in neon cyan, a rocket launching from a browser window, SEO ranking graph rising, dark background, vibrant neon blue and cyan lighting, 8k octane render, no text, no letters';
  }
  if (t.includes('next.js') || t.includes('react') || t.includes('web')) {
    return 'Cinematic 3D render of a futuristic browser window floating in dark space, Next.js logo glowing neon blue, React atom logo orbiting around it, holographic component tree floating, dark background, neon cyan lighting, 8k octane render, no text, no letters';
  }
  if (t.includes('typescript') || t.includes('javascript') || t.includes('programar') || t.includes('clean code') || t.includes('git')) {
    return 'Cinematic 3D render of a sleek futuristic laptop computer floating in dark space, holographic code windows open glowing neon green and cyan, lines of code flowing like waterfalls, keyboard glowing cyan, octane render 8k, no text, no letters';
  }
  if (t.includes('api') || t.includes('rest') || t.includes('node.js') || t.includes('backend')) {
    return 'Cinematic 3D render of glowing interconnected API server nodes with data packets flying between them as light beams, futuristic server rack with neon cyan lights in dark datacenter, holographic JSON icons floating, octane render 8k, no text, no letters';
  }
  if (t.includes('android') || t.includes('kotlin') || t.includes('app') || t.includes('móvil') || t.includes('ui') || t.includes('ux') || t.includes('play store')) {
    return 'Cinematic 3D render of a sleek modern Android smartphone floating in dark space, surrounded by glowing holographic mobile app interface cards in neon cyan and violet, android robot translucent in background, octane render 8k, no text, no letters';
  }
  if (t.includes('inteligencia artificial') || t.includes('ia') || t.includes('ai')) {
    return 'Cinematic 3D render of a glowing cybernetic AI brain made of neural network nodes and glowing synapses in neon blue and purple, data streams flowing into it, futuristic digital background, octane render 8k, no text, no letters';
  }
  if (t.includes('seguridad') || t.includes('ciberseguridad')) {
    return 'Cinematic 3D render of a massive glowing holographic cyber security shield protecting a server, digital padlock in neon cyan, binary data streams bouncing off the shield, dark background with electric blue grid, octane render 8k, no text, no letters';
  }
  if (t.includes('base de datos') || t.includes('room') || t.includes('sql') || t.includes('bases de datos')) {
    return 'Cinematic 3D render of glowing cylindrical database servers with neon cyan data streams flowing between them, holographic schema diagrams floating above, dark background, octane render 8k, no text, no letters';
  }
  return 'Cinematic 3D render of a futuristic developer workspace with multiple holographic neon cyan screens showing code, glowing keyboard, dark cyberpunk background, high contrast vibrant lighting, octane render 8k, no text, no letters';
}

const coverImagePrompt = getImagePrompt(topic);
console.log('🎨 Prompt de portada:', coverImagePrompt.substring(0, 100) + '...');

const prompt = `Eres un redactor técnico para el blog de Muñeco Tecnology.
Escribe un artículo de blog completo en español sobre el tema: "${topic}".
El artículo debe ser útil, educativo, profesional y tener entre 500 y 700 palabras.
Incluye subtítulos ##, explicaciones claras, ejemplos prácticos o de código y listas. NO incluyas ninguna imagen en el texto.
Responde ÚNICAMENTE con un objeto JSON válido, sin bloques markdown.
Usa exactamente esta estructura:
{
  "title": "título atractivo y profesional",
  "excerpt": "resumen breve de 1 a 2 oraciones para la tarjeta del blog",
  "content": "contenido completo en Markdown con subtítulos ##, párrafos y explicaciones, sin imágenes",
  "tag": "una de estas exactamente: Android, Tutorial, Tecnología, Programación, Web",
  "readTime": "X min de lectura"
}`;

const geminiBody = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  },
});

const geminiModels = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'];

async function callGemini(attempt = 1, modelIndex = 0) {
  const currentModel = geminiModels[modelIndex % geminiModels.length];
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${currentModel}:generateContent?key=` + process.env.GEMINI_API_KEY,
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
              // Alta demanda (503/429): esperar mucho y rotar modelo
              if ((json.error.code === 503 || json.error.code === 429) && attempt < 8) {
                const waitTime = Math.min(30000 + attempt * 15000, 90000); // hasta 90s
                const nextModelIndex = (modelIndex + 1) % geminiModels.length;
                console.warn(`⚠️ Alta demanda en ${currentModel} (${json.error.code}). Esperando ${waitTime / 1000}s y cambiando a ${geminiModels[nextModelIndex]} (intento ${attempt}/7)...`);
                await new Promise((r) => setTimeout(r, waitTime));
                return resolve(await callGemini(attempt + 1, nextModelIndex));
              }
              // Modelo no disponible (404): saltar inmediatamente al siguiente
              if (json.error.code === 404 && modelIndex < geminiModels.length - 1) {
                console.warn(`⚠️ Modelo ${currentModel} no disponible (404). Cambiando a ${geminiModels[modelIndex + 1]}...`);
                return resolve(await callGemini(attempt, modelIndex + 1));
              }
              console.error('❌ Error devuelto por Gemini API:', JSON.stringify(json.error, null, 2));
              process.exit(1);
            }
            if (!json.candidates || !json.candidates[0]) {
              console.error('❌ Error: Gemini no devolvió candidatos. Respuesta:', data);
              process.exit(1);
            }
            console.log(`✨ Respuesta obtenida usando modelo ${currentModel}!`);
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
    console.log('🤖 Consultando a Gemini...');
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

    // Usar el prompt de imagen predefinido por categoría (más confiable que dejárselo a Gemini)
    const techPrompt = coverImagePrompt;

    console.log('🎨 Generando portada temática con Flux...');
    const imgUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(techPrompt) + '?model=flux&width=800&height=450';

    let coverImage = '🤖';
    try {
      console.log('📥 Descargando imagen...');
      const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (imgRes.ok) {
        const arrayBuffer = await imgRes.arrayBuffer();
        const buf = Buffer.from(arrayBuffer);
        if (buf.length > 5000) {
          let finalBuf = buf;
          try {
            const sharp = require('sharp');
            const meta = await sharp(buf).metadata();
            if (meta.height && meta.width && meta.height > 60) {
              finalBuf = await sharp(buf)
                .extract({ left: 0, top: 0, width: meta.width, height: meta.height - 42 })
                .jpeg({ quality: 88 })
                .toBuffer();
              console.log('✂️ Marca de agua recortada con éxito!');
            }
          } catch (sharpErr) {
            console.warn('⚠️ Sharp no disponible:', sharpErr.message);
          }
          coverImage = 'data:image/jpeg;base64,' + finalBuf.toString('base64');
          console.log('🖼️ Ilustración descargada con éxito (' + (finalBuf.length / 1024).toFixed(1) + ' KB)');
        } else {
          console.warn('⚠️ La respuesta no es una imagen válida (' + buf.length + ' bytes), usando emoji');
        }
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
