import { GameLanguage } from './language-selector';

export interface MenuTranslations {
  pauseMenu: string;
  backToTitle: string;
  resumeGame: string;
}

// 9言語分のポーズ画面用翻訳データ
export const menuTranslations: Record<GameLanguage, MenuTranslations> = {
  ja: { pauseMenu: 'ポーズメニュー', backToTitle: 'タイトル画面に戻る', resumeGame: 'ゲームを再開する' },
  en: { pauseMenu: 'Pause Menu', backToTitle: 'Back to Title', resumeGame: 'Resume Game' },
  zh: { pauseMenu: '暂停菜单', backToTitle: '返回标题画面', resumeGame: '恢复游戏' },
  pt: { pauseMenu: 'Menu de Pausa', backToTitle: 'Voltar ao Título', resumeGame: 'Retomar Jogo' },
  es: { pauseMenu: 'Menú de Pausa', backToTitle: 'Volver al Título', resumeGame: 'Reanudar Juego' },
  ru: { pauseMenu: 'Меню паузы', backToTitle: 'Вернуться в меню', resumeGame: 'Продолжить игру' },
  vi: { pauseMenu: 'Menu Tạm Dừng', backToTitle: 'Về Màn Hình Chính', resumeGame: 'Tiếp Tục Trò Chơi' },
  fr: { pauseMenu: 'Menu Pause', backToTitle: 'Retour au Titre', resumeGame: 'Reprendre le Jeu' },
  fa: { pauseMenu: 'منوی توقف', backToTitle: 'بازگشت به منو', resumeGame: 'ادامه بازی' }
};
