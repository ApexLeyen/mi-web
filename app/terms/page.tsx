import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-block' }}>
            ← Volver al inicio
          </Link>
        </div>
        
        <h1 className="section-title">Términos y <span className="gradient-text">Condiciones</span></h1>
        
        <div className="glass" style={{ padding: '40px', borderRadius: '16px', marginTop: '40px', lineHeight: '1.7' }}>
          <h2 style={{ marginTop: 0 }}>1. Aceptación de los términos</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Al acceder y utilizar el sitio web de Muñeco Tecnology, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices nuestro sitio.
          </p>

          <h2 style={{ marginTop: '30px' }}>2. Propiedad Intelectual</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Todo el contenido, diseños, logotipos, aplicaciones y artículos de blog presentados en este sitio web son propiedad intelectual de Muñeco Tecnology, a menos que se indique lo contrario. Queda prohibida la reproducción no autorizada.
          </p>

          <h2 style={{ marginTop: '30px' }}>3. Comentarios de Usuarios</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Los usuarios pueden dejar comentarios en nuestro blog. Nos reservamos el derecho de moderar, editar o eliminar cualquier comentario que consideremos inapropiado, ofensivo, spam o que infrinja los derechos de terceros.
          </p>

          <h2 style={{ marginTop: '30px' }}>4. Modificaciones</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
          </p>
        </div>
      </div>
    </div>
  );
}
