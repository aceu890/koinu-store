export const WHATSAPP_E164 = "56973641325";
export const WHATSAPP_DISPLAY = "+56 9 7364 1325";

export function whatsappHref(text = "Hola Koinu Store, quiero concretar una compra.") {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}
