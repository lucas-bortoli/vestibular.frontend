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
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

/**
 * @param {number} num 
 * @param {string} singular 
 * @param {string} plural 
 */
export const plural = (num, singular, plural) => {
  return num === 1 ? singular : plural;
}

/**
 * Retorna uma timestamp no formato YYYY-MM-DD
 * @param {string|number|Date} time 
 */
export const timestampToDate = (time) => {
  return new Date(time).toISOString().slice(0, 10);
}

/**
 * Retorna uma timestamp no formato YYYY-MM-DD
 * @param {string|number|Date} time 
 */
export const timestampToTime = (time) => {
  return new Date(time).toISOString().slice(11, -8);
}