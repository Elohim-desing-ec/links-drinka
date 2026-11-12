# DRINKA by Kai Bobba · Tarjeta virtual

Tarjeta interactiva (link en bio) de **DRINKA by Kai Bobba**.

🔗 **https://elohim-desing-ec.github.io/links-drinka/**

## Qué incluye

- Bienvenida animada: el logo se arma solo y hay burbujas de boba que reaccionan al toque.
- Redes conectadas a la perla con pulsos de luz.
- Botón de pedido por WhatsApp, menú, delivery, ubicación y promos.
- **Arma tu Drinka**: eliges sabor, tamaño y toppings, y se abre WhatsApp con el pedido ya escrito.
- Horario en vivo (abierto / cerrado / cierra pronto).
- Guardar contacto y compartir.

## Cómo editar los datos

Todo está al inicio de `script.js`, en el bloque **EDITA AQUÍ**:

- `whatsapp`: número con código de país, sin `+` ni espacios.
- `instagram`, `tiktok`, `facebook`, `menu`, `promos`, `mapa`: enlaces. Si dejas uno vacío (`""`), su botón se oculta.
- `direccion`: texto que aparece en "Cómo llegar".
- `horario`: horas de apertura y cierre por día (`null` = cerrado).
- `sabores` y `toppings`: opciones de "Arma tu Drinka".

Después de editar, haz commit y push: la página se actualiza sola en 1 o 2 minutos.

## Archivos

```
index.html      estructura de la tarjeta
styles.css      diseño y animaciones (paleta del manual de marca)
script.js       datos editables e interacciones
assets/         logos, íconos e imagen para compartir
```
