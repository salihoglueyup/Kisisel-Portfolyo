// Komut paleti context'i + hook'u (component DEĞİL — react-refresh
// kuralı gereği Provider bileşeni ayrı dosyada).
import { createContext, useContext } from 'react';

export const CommandPaletteContext = createContext(null);

export const useCommandPalette = () => {
    const ctx = useContext(CommandPaletteContext);
    if (!ctx) {
        throw new Error('useCommandPalette must be used within CommandPaletteProvider');
    }
    return ctx;
};
