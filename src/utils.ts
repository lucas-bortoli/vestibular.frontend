/**
 * Formata uma string de acordo com a máscara especificada.
 * Cada caractere "d" da máscara é substituído pelo próximo caractere do valor.
 * @param {string} mask
 * @param {string} value
 * @example `format("84139341769", /\d/, "ddd.ddd.ddd-dd") // 841.393.417-69`
 */
export const format = (mask, value) => {
  let finalString = "";
  let valueChars = value.split("");
  let i = 0;

  while (i < mask.length) {
    let char = mask.charAt(i);

    if (char === "d") {
      char = valueChars.shift() || " ";
    }

    finalString += char;
    i++;
  }

  return finalString;
};

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * @param {number} num
 * @param {string} singular
 * @param {string} plural
 */
export const plural = (num, singular, plural) => {
  return num === 1 ? singular : plural;
};

/**
 * Retorna uma timestamp no formato YYYY-MM-DD
 * @param {string|number|Date} time
 * @returns {string}
 */
export const timestampToDate = (time) => {
  const d = new Date(time);

  return [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    .map((s) => s.toString().padStart(2, "0"))
    .join("-");
};

/**
 * Retorna uma timestamp no formato YYYY-MM-DD
 * @param {string|number|Date} time
 * @returns {string}
 */
export const timestampToTime = (time) => {
  const d = new Date(time);
  return [d.getHours(), d.getMinutes()].map((s) => s.toString().padStart(2, "0")).join(":");
};

/**
 * Converte uma quantidade de tempo em milisegundos para formato humano
 * @param {number} ms
 * @returns {string}
 */
export const msParaHumano = (ms) => {
  let segundos = ms / 1000;
  let horas = Math.floor(segundos / 3600);
  segundos = segundos % 3600;
  let minutos = Math.floor(segundos / 60);
  segundos = segundos % 60;

  return [
    [horas, "hora"],
    [minutos, "minuto"],
    [segundos, "segundo"],
  ]
    .map((v) => {
      return v[0] > 0 ? v[0].toString() + " " + plural(v[0], v[1], v[1] + "s") : null;
    })
    .filter((v) => v !== null)
    .join(", ");
};
