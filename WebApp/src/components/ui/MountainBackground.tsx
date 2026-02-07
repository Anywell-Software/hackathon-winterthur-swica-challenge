// ============================================
// Mountain Background Component
// SVG recreation of the mountain path image
// ============================================

export default function MountainBackground() {
    return (
        <svg
            viewBox="0 0 768 1400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Gradients for depth */}
                <linearGradient id="mountainGreen1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2D5F54" />
                    <stop offset="100%" stopColor="#1E4D42" />
                </linearGradient>
                <linearGradient id="mountainGreen2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E4D42" />
                    <stop offset="100%" stopColor="#0F3D32" />
                </linearGradient>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E8D5BC" />
                    <stop offset="50%" stopColor="#D4C4A8" />
                    <stop offset="100%" stopColor="#C9B89A" />
                </linearGradient>
            </defs>

            {/* Background - Beige */}
            <rect width="768" height="1400" fill="#F5E6D3" />

            {/* Left Mountain Mass - Dark Green */}
            <path
                d="M 0 900 Q 150 600 200 400 Q 250 200 300 100 L 350 300 Q 320 500 280 700 L 200 1100 L 0 1400 Z"
                fill="url(#mountainGreen1)"
            />

            {/* Right Mountain Mass - Darker Green */}
            <path
                d="M 768 1000 Q 650 700 600 500 Q 550 250 500 50 L 450 250 Q 480 450 520 650 L 600 1050 L 768 1400 Z"
                fill="url(#mountainGreen2)"
            />

            {/* Center Mountain Peak */}
            <path
                d="M 300 100 L 380 0 L 460 100 L 420 300 L 380 400 L 340 300 Z"
                fill="#2D5F54"
            />

            {/* Snow on left peak */}
            <path
                d="M 290 120 L 320 80 L 350 120 L 340 150 L 300 150 Z"
                fill="white"
                opacity="0.9"
            />

            {/* Snow on right mountain */}
            <path
                d="M 500 60 L 530 30 L 560 70 L 540 110 L 510 100 Z"
                fill="white"
                opacity="0.85"
            />

            {/* Snow patches on left */}
            <ellipse cx="150" cy="650" rx="60" ry="40" fill="#C8E6F5" opacity="0.7" />
            <ellipse cx="100" cy="800" rx="50" ry="35" fill="#D4EBF7" opacity="0.6" />
            <ellipse cx="180" cy="950" rx="70" ry="45" fill="#E0F2F9" opacity="0.7" />
            <ellipse cx="120" cy="1150" rx="55" ry="38" fill="#C8E6F5" opacity="0.6" />

            {/* Snow patches on right */}
            <ellipse cx="620" cy="700" rx="65" ry="42" fill="#C8E6F5" opacity="0.7" />
            <ellipse cx="680" cy="850" rx="58" ry="40" fill="#D4EBF7" opacity="0.65" />
            <ellipse cx="600" cy="1000" rx="72" ry="48" fill="#E0F2F9" opacity="0.7" />
            <ellipse cx="650" cy="1180" rx="60" ry="42" fill="#C8E6F5" opacity="0.6" />

            {/* Additional green mountain details */}
            <path
                d="M 200 500 Q 250 450 280 500 L 270 650 Q 240 700 210 680 Z"
                fill="#1E4D42"
                opacity="0.8"
            />
            <path
                d="M 550 600 Q 520 550 490 580 L 500 720 Q 530 770 560 750 Z"
                fill="#0F3D32"
                opacity="0.8"
            />
        </svg>
    );
}
