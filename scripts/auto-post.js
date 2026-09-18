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
Dentro del contenido en Markdown, incluye subtítulos ##, explicaciones claras, ejemplos prácticos o de código y listas. NO incluyas ninguna imagen dentro del texto (no uses la sintaxis ![alt](url)), debe ser contenido 100% texto en Markdown.
Responde ÚNICAMENTE con un objeto JSON válido, sin bloques markdown.
Usa exactamente esta estructura:
{
  "title": "título atractivo y profesional",
  "excerpt": "resumen breve de 1 a 2 oraciones para la tarjeta del blog",
  "content": "contenido completo en Markdown con subtítulos ##, párrafos y explicaciones, sin imágenes",
  "tag": "una de estas exactamente: Android, Tutorial, Tecnología, Programación, Web",
  "readTime": "X min de lectura",
  "imagePrompt": "A concrete English visual prompt for a high-tech 3D illustration centered directly on this article's specific topic. Must describe clear, physical, tangible objects in a cyberpunk setting: if Web/Backend/API/Node.js/TypeScript, describe a futuristic high-tech computer workstation desk with curved glowing holographic monitors displaying code and API architecture diagrams, neon cyan and green lighting; if Android/Mobile, describe a futuristic sleek smartphone hovering in center with glowing 3D holographic app cards and icons, neon cyan and violet lighting; if AI, describe a glowing 3D cybernetic neural network brain core with data streams; if Security/Cloud, describe a glowing 3D futuristic holographic security shield vault protecting server hardware; if Git/Clean Code, describe a futuristic glowing glass laptop with holographic code structures. The scene must be full of detailed 3D objects, vibrant neon lighting, high contrast, 8k octane render, cinematic composition, completely clean, no text, no letters, no words"
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
              // Si el modelo está saturado (503) o con límite de peticiones (429)
              if ((json.error.code === 503 || json.error.code === 429) && attempt < 6) {
                const waitTime = Math.min(10000 + attempt * 5000, 30000);
                const nextModelIndex = (modelIndex + 1) % geminiModels.length;
                console.warn(`⚠️ Alta demanda en ${currentModel} (${json.error.code}). Probando con ${geminiModels[nextModelIndex]} en ${waitTime / 1000}s (intento ${attempt}/5)...`);
                await new Promise((r) => setTimeout(r, waitTime));
                return resolve(await callGemini(attempt + 1, nextModelIndex));
              }
              // Si el modelo da 404 (no disponible para esta clave), probar el siguiente inmediatamente
              if (json.error.code === 404 && modelIndex < geminiModels.length - 1) {
                console.warn(`⚠️ Modelo ${currentModel} no habilitado (404). Cambiando a ${geminiModels[modelIndex + 1]}...`);
                return resolve(await callGemini(attempt, modelIndex + 1));
              }
              console.error('❌ Error devuelto por Gemini API:', JSON.stringify(json.error, null, 2));
              process.exit(1);
            }
            if (!json.candidates || !json.candidates[0]) {
              console.error('❌ Error: Gemini no devolvió candidatos. Respuesta:', data);
              process.exit(1);
            }
            console.log(`✨ Respuesta obtenida exitosamente usando modelo ${currentModel}!`);
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

    // Generar ilustración de portada temática detallada y vibrante
    const topicSubject = blogData.imagePrompt || (blogData.title + ' 3d futuristic technology concept');
    const techPrompt = topicSubject + ', vibrant 3d digital illustration, glowing neon cyan and electric blue cinematic lighting, cyberpunk tech aesthetic, high contrast, detailed dynamic composition, octane render 8k, completely clean, no text, no letters, no words, no watermark, pure digital art';

    console.log('🎨 Generando portada temática con Flux...');
    console.log('📝 Prompt de portada:', techPrompt);
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
            console.warn('⚠️ Sharp no disponible, usando imagen completa:', sharpErr.message);
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
