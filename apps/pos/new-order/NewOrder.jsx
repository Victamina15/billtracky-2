// Módulo Nuevo Pedido - Billtracky 2.0
// Colores oficiales: Fondo #F4F4F5 (gris claro), Contenedores #FFFFFF (blanco)

export default function NewOrder() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F4F5', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Nuevo Pedido
          </h1>
          <p style={{ color: '#6B7280' }}>
            Módulo de facturación POS - Estructura base establecida
          </p>
        </div>
      </div>
    </div>
  );
}
