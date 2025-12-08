/**
 * Système de logging pour les requêtes API
 * Permet de tracer toutes les requêtes HTTP et leurs réponses
 */

export enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000; // Limite pour éviter une surcharge mémoire
  private enabled: boolean = __DEV__; // Actif uniquement en développement par défaut

  /**
   * Active ou désactive le logging
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Méthode privée pour créer une entrée de log
   */
  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  /**
   * Formate les données pour l'affichage console
   */
  private formatForConsole(entry: LogEntry): string {
    const emoji = this.getEmojiForLevel(entry.level);
    let output = `${emoji} [${entry.timestamp}] [${entry.level}] ${entry.message}`;

    if (entry.data) {
      output += `\n${JSON.stringify(entry.data, null, 2)}`;
    }

    return output;
  }

  /**
   * Retourne un emoji selon le niveau de log
   */
  private getEmojiForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.INFO:
        return 'ℹ️';
      case LogLevel.SUCCESS:
        return '✅';
      case LogLevel.WARNING:
        return '⚠️';
      case LogLevel.ERROR:
        return '❌';
      case LogLevel.DEBUG:
        return '🔍';
      default:
        return '📝';
    }
  }

  /**
   * Affiche le log dans la console avec la bonne couleur
   */
  private printToConsole(entry: LogEntry) {
    const formattedMessage = this.formatForConsole(entry);

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARNING:
        console.warn(formattedMessage);
        break;
      case LogLevel.SUCCESS:
      case LogLevel.INFO:
      case LogLevel.DEBUG:
      default:
        console.log(formattedMessage);
        break;
    }
  }

  /**
   * Enregistre un log
   */
  private log(level: LogLevel, message: string, data?: any) {
    if (!this.enabled) return;

    const entry = this.createLogEntry(level, message, data);

    // Ajouter au tableau de logs
    this.logs.push(entry);

    // Limiter la taille du tableau
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Afficher dans la console
    this.printToConsole(entry);
  }

  /**
   * Log une information
   */
  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log un succès
   */
  success(message: string, data?: any) {
    this.log(LogLevel.SUCCESS, message, data);
  }

  /**
   * Log un avertissement
   */
  warn(message: string, data?: any) {
    this.log(LogLevel.WARNING, message, data);
  }

  /**
   * Log une erreur
   */
  error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Log de debug (détails techniques)
   */
  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log spécifique pour les requêtes API
   */
  apiRequest(method: string, url: string, data?: any, headers?: any) {
    this.info(`🌐 API REQUEST: ${method} ${url}`, {
      method,
      url,
      headers,
      body: data,
    });
  }

  /**
   * Log spécifique pour les réponses API (succès)
   */
  apiResponse(method: string, url: string, status: number, data?: any) {
    this.success(`🌐 API RESPONSE: ${method} ${url} - Status ${status}`, {
      method,
      url,
      status,
      response: data,
    });
  }

  /**
   * Log spécifique pour les erreurs API
   */
  apiError(method: string, url: string, error: any) {
    this.error(`🌐 API ERROR: ${method} ${url}`, {
      method,
      url,
      error: error.message || error,
      stack: error.stack,
    });
  }

  /**
   * Récupère tous les logs
   */
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Récupère les logs d'un certain niveau
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Efface tous les logs
   */
  clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }

  /**
   * Exporte les logs au format JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Instance singleton du logger
export const logger = new Logger();

// Export par défaut
export default logger;
