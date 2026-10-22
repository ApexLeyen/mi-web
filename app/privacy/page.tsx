import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-block' }}>
            ← Volver al inicio
          </Link>
        </div>
        
        <h1 className="section-title">Política de <span className="gradient-text">Privacidad</span></h1>
        
        <div className="glass" style={{ padding: '40px', borderRadius: '16px', marginTop: '40px', lineHeight: '1.7' }}>
          <h2 style={{ marginTop: 0 }}>1. Información que recopilamos</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            En Muñeco Tecnology, solo recopilamos la información estrictamente necesaria para brindarte una mejor experiencia en nuestra plataforma (por ejemplo, el nombre que ingresas al dejar un comentario en el blog). No vendemos ni compartimos tu información personal con terceros.
          </p>

          <h2 style={{ marginTop: '30px' }}>2. Uso de la información</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            La información recopilada se utiliza exclusivamente para mantener la interacción en el sitio web (como comentarios y likes) y para responder a las consultas enviadas a través de nuestro correo de soporte.
          </p>

          <h2 style={{ marginTop: '30px' }}>3. Cookies y Publicidad de Terceros (Google AdSense)</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Utilizamos cookies técnicas para el funcionamiento del sitio y servicios de terceros como <strong>Google AdSense</strong> para mostrar anuncios cuando visitas nuestro sitio web.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
            Los proveedores terceros, incluido Google, utilizan cookies (como la cookie de DoubleClick / DART) para mostrar anuncios relevantes basados en las visitas anteriores de un usuario a este sitio web o a otros sitios en Internet. El uso de cookies publicitarias permite a Google y a sus socios mostrar anuncios basados en tus intereses.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
            Los usuarios pueden inhabilitar el uso de la publicidad personalizada en cualquier momento accediendo a la{' '}
            <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
              Configuración de Anuncios de Google
            </a>{' '}
            o visitando{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
              www.aboutads.info
            </a>.
          </p>

          <h2 style={{ marginTop: '30px' }}>4. Contacto</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Si tienes alguna duda sobre nuestra política de privacidad, puedes contactarnos en:
            <br />
            <a href="mailto:munecotecnology@gmail.com" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              munecotecnology@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
