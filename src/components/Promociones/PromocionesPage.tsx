import React, { useEffect, useState } from 'react';
import '../CSS/PromocionesPage.css';
import { Promocion } from '../../Types/Promocion';
import { ImagenPromocion } from '../../Types/ImagenPromocion';

const PromocionesPage = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/promociones") // Cambia la URL si es necesario
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPromociones(data);  // Guardar las promociones en el estado
        } else {
          console.error("Error: El formato de la respuesta no es un array");
        }
      })
      .catch(error => console.error("Error al obtener las promociones:", error));
  }, []);

  const renderCard = (promocion: Promocion) => (
    <div className="card" key={promocion.id}>
      <h3 className="promocion-title">{promocion.denominacion}</h3>
        
      {promocion.imagenes.length > 0 && (
        <div>         
          <img src={promocion.imagenes[0].url} alt={promocion.denominacion} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }} />
        </div>
      )} 
      <p className="promocion-description">{promocion.descripcionDescuento}</p>
      <p>
        <strong>Precio Promocional: </strong>
        {typeof promocion.precioPromocional === 'number'
          ? `$${promocion.precioPromocional.toFixed(2)}`
          : "No disponible"}
      </p>
      
      <p>
        <strong>Horario: </strong>{promocion.horaDesde} - {promocion.horaHasta}
      </p>
      
      <button className="promocion-button">Aprovechar Promoción</button>

      <div style={{ fontSize: '10px', marginTop: '10px' }}>
        <p>
          Desde el {promocion.fechaDesde} hasta el {promocion.fechaHasta}
        </p>
      </div>
    </div>
  );

  return (
    <div className="promociones-container">
      {promociones.length > 0 ? (
        promociones.map(promocion => renderCard(promocion))
      ) : (
        <p>No hay promociones disponibles</p>
      )}
    </div>
  );
};

export default PromocionesPage;
