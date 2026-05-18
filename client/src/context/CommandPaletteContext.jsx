// Komut paleti açık/kapalı durumu için Provider bileşeni.
// Context + hook ./commandPalette içinde (react-refresh: bu dosya
// yalnızca bileşen export eder).
import { useState, useCallback, useMemo } from 'react';
import { CommandPaletteContext } from './commandPalette';

export const CommandPaletteProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((v) => !v), []);

    const value = useMemo(
        () => ({ isOpen, open, close, toggle }),
        [isOpen, open, close, toggle]
    );

    return (
        <CommandPaletteContext.Provider value={value}>
            {children}
        </CommandPaletteContext.Provider>
    );
};
