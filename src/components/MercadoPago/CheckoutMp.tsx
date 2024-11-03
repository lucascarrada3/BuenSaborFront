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

    // Public Key, generalmente utilizada en el frontend
    useEffect(() => {
        initMercadoPago('TEST-a5ae1d64-d199-4315-bd7b-71f56b386d08', { locale: 'es-AR' });

        // Obtener la preferencia de Mercado Pago al cargar el componente
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
            }
        };

        // Llamar a la función para obtener la preferencia de Mercado Pago
        fetchPreferenceMP();
    }, [pedido]); // Dependencia de useEffect para asegurar que se actualice cuando cambia el pedido

    // Si el carrito está vacío, no renderizar el botón
    if (montoCarrito === 0) {
        return null;
    }

    // redirectMode es optativo y puede ser self, blank o modal
    return (
        <div>
            <div className={idPreference ? 'divVisible' : 'divInvisible'}>
                <Wallet initialization={{ preferenceId: idPreference, redirectMode: "self" }} customization={{ texts: { valueProp: 'smart_option' } }} />
            </div>
        </div>
    );
}

export default CheckoutMP;