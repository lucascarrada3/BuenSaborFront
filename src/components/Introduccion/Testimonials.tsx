import React from 'react';
import '../CSS/Testimonials.css'; // Importa el CSS para los estilos

interface Testimonio {
  nombre: string;
  comentario: string;
}

const testimonios: Testimonio[] = [
  { nombre: "Juan Pérez", comentario: "La comida es deliciosa y el servicio excelente." },
  { nombre: "María López", comentario: "Definitivamente mi lugar de pedidos favorito, fue una experiencia increíble." },
  { nombre: "Carlos Gómez", comentario: "Los platos son de gran calidad, ninguna queja!" }
];

const Testimonials: React.FC = () => {
  return (
    <section className="testimonials">
      <h2 className="text-center">Testimonios de Nuestros Clientes</h2>
      <div className="testimonials-container">
        {testimonios.map((testimonio, index) => (
          <div key={index} className="testimonial-card">
            <p>"{testimonio.comentario}"</p>
            <h5>- {testimonio.nombre}</h5>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
