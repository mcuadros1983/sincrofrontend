// En tu archivo processBarCode.js
export function processBarCode(codBar) {
  if (codBar.length !== 30) {
    return {
      success: false,
      message: 'El código de barras debe tener exactamente 30 dígitos.',
    };
  }

  const num_media = parseFloat(codBar.slice(2, 13));
  const tropa = parseFloat(codBar.slice(14, 19));
  const kg = parseFloat(codBar.slice(26, 28));

  const result = {
    success: true,
    data: {
      num_media,
      tropa,
      kg,
    },
  };

  return result;
}