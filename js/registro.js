const regionSelect = document.getElementById("reg-region");
const comunaSelect = document.getElementById("reg-comuna");

if (regionSelect && comunaSelect) {
    regiones.forEach((region) => {
        const option = document.createElement("option");
        option.value = region.nombre;
        option.textContent = region.nombre;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener("change", () => {
        comunaSelect.replaceChildren(new Option("-- Seleccione la comuna --", ""));
        const regionSeleccionada = regiones.find((region) => region.nombre === regionSelect.value);

        if (!regionSeleccionada) {
            comunaSelect.disabled = true;
            return;
        }

        regionSeleccionada.comunas.forEach((comuna) => {
            comunaSelect.add(new Option(comuna, comuna));
        });
        comunaSelect.disabled = false;
    });
}
