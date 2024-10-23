import { Carousel } from 'react-bootstrap';

const ProductCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://s3.abcstatics.com/media/gurmesevilla/2012/01/comida-rapida-casera.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Producto 1</h3>
          <p>Descripción del producto 1.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://www.laespanolaaceites.com/wp-content/uploads/2019/06/pizza-con-chorizo-jamon-y-queso-1080x671.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Producto 2</h3>
          <p>Descripción del producto 2.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://img-global.cpcdn.com/recipes/b50037ff34f1eb55/1200x630cq70/photo.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Producto 3</h3>
          <p>Descripción del producto 3.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarousel;
