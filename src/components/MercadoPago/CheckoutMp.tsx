import { useEffect, useState } from "react";
import Pedido from "../../Types/Pedido";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import PreferenceMP from "../../Types/PreferenceMP";
import { createPreferenceMP } from "../Services/MercadoPagoService";

interface CheckoutMPProps {
  montoCarrito: number;
  pedido: Pedido;
  onPagoCompleto?: () => void; // Esta función es opcional
}

function CheckoutMP({ montoCarrito, pedido }: CheckoutMPProps) {
  const [idPreference, setIdPreference] = useState<string>('');
  const [loading, setLoading] = useState(true); // Nuevo indicador de carga

  // Inicializa Mercado Pago una sola vez
  useEffect(() => {
    initMercadoPago('TEST-a5ae1d64-d199-4315-bd7b-71f56b386d08', { locale: 'es-AR' });
  }, []);

  // Obtener la preferencia de Mercado Pago solo si no se ha obtenido antes
  useEffect(() => {
    const fetchPreferenceMP = async () => {
      try {
        const response: PreferenceMP = await createPreferenceMP(pedido);
        console.log("Preference id: " + response.id);
        if (response) {
          setIdPreference(response.id);
        } else {
          alert("Agregue al menos un artículo al carrito");
        }
      } catch (error) {
        console.error("Error al obtener la preferencia de Mercado Pago:", error);
        alert("Hubo un error al obtener la preferencia de Mercado Pago");
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    if (loading && montoCarrito > 0) {
      fetchPreferenceMP();
    }
  }, [pedido, loading, montoCarrito]); // Asegúrate de que la preferencia se crea solo una vez

  if (montoCarrito === 0 || loading) {
    return null;
  }

  return (
    <div>
      <div className={idPreference ? 'divVisible' : 'divInvisible'}>
        <Wallet initialization={{ preferenceId: idPreference, redirectMode: "self" }} customization={{ texts: { valueProp: 'smart_option' } }} />
      </div>
    </div>
  );
}

export default CheckoutMP;