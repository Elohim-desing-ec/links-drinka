# DRINKA by Kai Bobba · Tarjeta virtual

Tarjeta interactiva (link en bio) de **DRINKA by Kai Bobba**.

🔗 **https://elohim-desing-ec.github.io/links-drinka/**

## Qué incluye

- Bienvenida animada: el logo se arma solo y desfilan las bebidas recomendadas con foto y precio.
- Redes conectadas a la perla con pulsos de luz.
- Botón de pedido por WhatsApp, menú, delivery, ubicación y promos.
- **Menú con precios** (Matcha, Taro, Tés, Café): tocas **+** en cada bebida, se calcula el total y el pedido se envía por WhatsApp ya escrito.
- Horario en vivo (abierto / cerrado / cierra pronto).
- Guardar contacto y compartir.

## Cómo editar los datos

Todo está al inicio de `script.js`, en el bloque **EDITA AQUÍ**:

- `whatsappEnlace`: enlace de WhatsApp Business de los botones generales.
- `whatsapp`: número detrás de ese enlace, sin `+` ni espacios. Lo usan el pedido con total, delivery y guardar contacto.
- `instagram`, `tiktok`, `delivery`, `promos`, `mapa`: enlaces. Si dejas uno vacío (`""`), su botón se oculta.
- `direccion`: texto que aparece en "Cómo llegar".
- `horario`: horas de apertura y cierre por día (`null` = cerrado).
- `menu`: categorías, bebidas y precios. `favorito: true` marca la bebida destacada de cada categoría.

Fotos: cada bebida usa `assets/vasos/<foto>.webp` (máx. 520 px de alto) y `assets/vasos/<foto>-mini.webp` (176 px). Los originales de `VASOS/` no se suben.

`404.html` (página de enlace roto) tiene sus propios enlaces de WhatsApp, Instagram y mapa: si cambian, actualízalos también ahí.

Después de editar, haz commit y push: la página se actualiza sola en 1 o 2 minutos.

## Archivos

```
index.html      estructura de la tarjeta
404.html        página para enlaces rotos
styles.css      diseño y animaciones (paleta del manual de marca)
script.js       datos editables e interacciones
assets/         logos, íconos e imagen para compartir
```
