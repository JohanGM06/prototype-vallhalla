<h1>Prototipo Vallhalla<img src="https://raw.githubusercontent.com/iampavangandhi/iampavangandhi/master/gifs/Hi.gif" width="30px"> 🌆🌇</h1> </h1>

### Estandar

    - Todo tiene que tener el mismo formato.
    - Las clases tiene que ser en inglés (No Spanglish).
    - Todos los módulos tienen que tener una carpeta.
    - Si hay un Nav, o algun componente que es genérico, se reutliza, no se vuelve a crear.

## Comandos Git-Hub

    - git status = Sirve para el los archivos: Creados, modificados, borrados, etc
    - git add . = Sirve para agregar los cambios que quieres subir
    - git commit -m {Comentario} = Sirve para hacer un comentario sobre los cambios agregados
    - git push = Sube los cambios

    - git branch = Sirve para ver la rama en la que estás parado
    - git branch -a = Sirve para ver todas las ramas
    - git branch -d {nombre de la rama} = Sirve para eliminar una rama
    - git fetch --prune = Sirve para eliminar ramas que no están creadas en el repositorio
    - git reset --hard = Elimina todo lo que modificaste de una rama, hasta el último commit del repositorio

    - git stash = Guarda los cambios localmente
    - git stash pop = Baja los cambios que guardaste localmente
    - git checkout {nombre de la rama} = Sirve para cambiarte de rama

    - git checkout -b {nombre de la rama} = Sirve para crear una rama y pasarte de una vez

#### Importante

    Nota: Si por accidente no te diste cuenta de que no creaste la rama, usa los commandos git stash para retener los cambios, crear la rama y luego si git stash pop, para que los cambios no se pierdan.
    Esto para que no se pierdan los cambios que hiciste.

    - Crear una rama para cada desarrollo partiendo desde main.
        - La rama tiene que ser feature/{su nombre}/{el cambio o lo que agrega}
    - Subir cambios unicamente a la rama propia.
    - Antes de hacer merge, se hace un pull origin dev.
    - Para hacer un merge, se genera un Pull Request desde la rama hacia dev y luego hacer otro de dev hacia prod
    - Hacer merge desde la rama propia hacia dev, y luego hacia prod, para que todo quede actualizado.
    - Se hace pull origin dev para bajar los cambios de dev hacia la rama de una, y si hay conflictos, resolverlos y hacer push.
    - Siempre bajar cambios desde dev.

### Integrantes

    - Alejandra Lozano
    - Sebastian Arturo Sotelo Moreno
    - Aldair José Narváez Vergara
    - Cristian Arboleda
    - Johan Steven González
