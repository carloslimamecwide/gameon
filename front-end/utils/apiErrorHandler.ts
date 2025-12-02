// utils/apiErrorHandler.ts

/**
 * Trata erros de requisições axios e retorna uma mensagem amigável.
 * Pode ser usada em todos os serviços de API.
 */

export function handleApiError(error: any, defaultMessage = "Erro inesperado. Tente novamente.") {
  // Verificação manual, pois axios.isAxiosError pode não estar disponível em algumas versões
  if (error && typeof error === "object" && "isAxiosError" in error && (error as any).isAxiosError) {
    if (error.response) {
      const data = error.response.data;
      // Sempre prioriza a mensagem da API, se existir
      if (typeof data === "object" && data?.message) {
        return data.message;
      }
      // Se não houver mensagem, retorna status genérico
      return `Erro ${error.response.status}`;
    } else if (error.request) {
      return "Sem resposta do servidor. Verifique sua conexão.";
    } else {
      return `Erro na requisição: ${error.message}`;
    }
  }
  return defaultMessage;
}
