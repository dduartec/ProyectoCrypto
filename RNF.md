## Requisitos no funcionales

OWSP : Cross-Site Scripting (XSS)
-Utilizar frameworks seguros que, por diseño, automáticamente
codifican el contenido para prevenir XSS, como en Ruby 3.0 o
React JS

OWSP : perdida de control de acceso 
-Implemente los mecanismos de control de acceso una vez y
reutilícelo en toda la aplicación, incluyendo minimizar el control
de acceso HTTP (CORS).

OWSP : Pérdida de Autenticación

-autenticación por token

-servicio OAUTH

-integracioón captcha

- Autenticación a doble factor.

-Cifre todos los datos sensibles cuando sean almacenados.

-Implemente controles contra contraseñas débiles. Cuando el
usuario ingrese una nueva clave, la misma puede verificarse
contra la lista del Top 10.000 de peores contraseñas.

- Limite o incremente el tiempo de respuesta de cada intento fallido
de inicio de sesión. Registre todos los fallos y avise a los
administradores cuando se detecten ataques de fuerza bruta

## link OWSP

https://www.owasp.org/images/5/5e/OWASP-Top-10-2017-es.pdf?fbclid=IwAR3dl28hKCusF_OxbWBky-OjN1zCWybz7VyedbEBfdg0qGTZLO-Y8ES54Ng
