## Explicación del ejercicio

### Componenetes

- card-list: Componente utilizado para listar los autos. Dentro de su lógica se cargan los autos desde la API al iniciar el montaje del componente.
- card-edit: Formulario de creación y edición de autos.
- owner-list: Componente utilizado listar los owner, donde se pueden realizar borrados multiples e ir a agregar o editar un nuevo owner.
- owner-edit: Formulario para crear y editar owner.

### Servicios

- car-service: En este servicio se define la lógica para el CRUD de autos.
- owner-service: Se definen las acciones del CRUD y la lógica de cada método, por ejemplo se define que para cuando un owner sea borrado los autos asociados son actualizados dejando un `ownerDni` en `null`.
