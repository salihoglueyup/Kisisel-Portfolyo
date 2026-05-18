// Paylaşılan framer-motion preset'leri — sayfalar arası tutarlı giriş
// animasyonu. Her sayfanın kendi opacity/x/y/scale + süre kombinasyonu
// yerine bunlar kullanılır. Bileşenler kademeli olarak buna geçer.
//
// Erişilebilirlik: kullanıcı "reduced motion" tercih ettiyse hareket
// kapatılmalı. Bileşende `useReducedMotion()` (framer-motion) ile
// `getEnter(prefersReduced)` çağrılır.

const EASE_OUT = [0.16, 1, 0.3, 1];

export const transitions = {
    base: { duration: 0.5, ease: EASE_OUT },
    slow: { duration: 0.8, ease: EASE_OUT },
};

// Tek öğe yumuşak yukarı-giriş
export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: transitions.base },
};

// Liste konteyneri — çocukları kademeli göster
export const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const staggerItem = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: transitions.base },
};

// reduced-motion: tüm varyantları anlık (hareketsiz) hale getirir
const STILL = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { duration: 0 } },
};

export const getEnter = (prefersReduced, variant = fadeInUp) =>
    prefersReduced ? STILL : variant;
