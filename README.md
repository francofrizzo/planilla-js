Script que permite generar planillas a partir de ciertos parámetros de
configuración. Originalmente pensado para generar planillas de alumnxs para
exámenes parciales.

## Requerimientos
- [Node.js](https://nodejs.org/en/).
- [weasyprint](https://weasyprint.org/).

## Instrucciones de instalación
Es necesario ejecutar `npm install` para instalar las dependencias.

## Instrucciones de uso

```
node planilla.js [output_file [config_file]]
```

El comando genera la planilla en formato PDF, y guarda el archivo con el nombre
`output_file` (por defecto, `planilla.pdf`). Los parámetros se leen del archivo
`config_file` (por defecto, `config.json`).
