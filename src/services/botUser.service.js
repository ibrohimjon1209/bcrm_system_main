import api from './api';

const botUserService = {
  /**
   * Get all Telegram bot users
   * @returns {Promise<TelegramBotUser[]>}
   */
  getBotUsers: async () => {
    const response = await api.get('/api/bot-users/');
    return response.data;
  },

  /**
   * Create a new bot user
   * @param {Object} data - { chat_id, ... }
   * @returns {Promise<TelegramBotUser>}
   */
  createBotUser: async (data) => {
    const response = await api.post('/api/bot-users/', data);
    return response.data;
  },

  /**
   * Get bot user by chat_id (checks if allowed)
   * @param {string} chatId
   * @returns {Promise<TelegramBotUserAllowedResponse>}
   */
  getBotUser: async (chatId) => {
    const response = await api.get(`/api/bot-users/${chatId}/`);
    return response.data;
  },

  /**
   * Delete bot user
   * @param {string} chatId
   */
  deleteBotUser: async (chatId) => {
    await api.delete(`/api/bot-users/${chatId}/`);
  },
};

export default botUserService;
