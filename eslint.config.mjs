import js from "@eslint/js";

export default [
  // Aplica as regras recomendadas do JavaScript em todos os arquivos
  js.configs.recommended,

  // Suas regras customizadas e configurações de ambiente
  {
    rules: {
      "no-unused-vars": "warn", // Avisa sobre variáveis que não estão sendo usadas
      "no-console": "off",      // Permite o uso de console.log no código
      "semi": ["error", "always"], // Obriga o uso de ponto e vírgula no final das linhas
      "quotes": ["error", "single"] // Obriga o uso de aspas simples
    }
  }
];