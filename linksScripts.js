// Script original por Ulises Alvarenga https://github.com/Ulysses-Alv

function copyToClipboard(text, elementId, classes, textNode) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  const icono = document.getElementById(elementId);
  icono.textContent = "Copied";

  setTimeout(() => recreate(elementId, classes, textNode), 400)
}

function recreate(_elementId, _classes, _textNode) {
  const miEnlace = document.getElementById(_elementId);
  miEnlace.textContent = "";
  const iconoDiscord = document.createElement("i");
  iconoDiscord.className = _classes;
  const textoEnlace = document.createTextNode(_textNode);
  miEnlace.appendChild(iconoDiscord);
  miEnlace.appendChild(textoEnlace);
}

const cursor = document.querySelector('.cursor');

        document.addEventListener('mousemove', e => {
            cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;")
        })

        document.addEventListener('click', () => {
            cursor.classList.add("expand");

            setTimeout(() => {
                cursor.classList.remove("expand");
            }, 500)
        })
