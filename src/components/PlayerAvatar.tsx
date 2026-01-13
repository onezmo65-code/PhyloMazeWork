import React from 'react';

export type AvatarType = 'boy' | 'girl' | 'cat' | 'car' | 'dog';

interface PlayerAvatarProps {
  className?: string;
  type?: AvatarType;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ className, type = 'boy' }) => {
  const commonProps = {
    viewBox: "0 0 100 100",
    className,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (type) {
    case 'girl':
      return (
        <svg {...commonProps}>
          {/* Body */}
          <path d="M20 85C20 65 35 55 50 55C65 55 80 65 80 85" fill="#EC4899" stroke="white" strokeWidth="3"/>
          {/* Head */}
          <circle cx="50" cy="35" r="20" fill="#FDE047" stroke="white" strokeWidth="3"/>
          {/* Face */}
          <circle cx="43" cy="32" r="2" fill="#1F2937"/>
          <circle cx="57" cy="32" r="2" fill="#1F2937"/>
          <path d="M45 42Q50 45 55 42" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
          {/* Hair (Pigtails) */}
          <circle cx="25" cy="35" r="8" fill="#FDE047" stroke="white" strokeWidth="2"/>
          <circle cx="75" cy="35" r="8" fill="#FDE047" stroke="white" strokeWidth="2"/>
          {/* Bow */}
          <path d="M45 15L55 15L50 20Z" fill="#EC4899"/>
        </svg>
      );
    case 'cat':
      return (
        <svg {...commonProps}>
          {/* Body */}
          <ellipse cx="50" cy="65" rx="25" ry="20" fill="#9CA3AF" stroke="white" strokeWidth="3"/>
          {/* Head */}
          <circle cx="50" cy="40" r="18" fill="#9CA3AF" stroke="white" strokeWidth="3"/>
          {/* Ears */}
          <path d="M35 30L35 15L45 25" fill="#9CA3AF" stroke="white" strokeWidth="2"/>
          <path d="M65 30L65 15L55 25" fill="#9CA3AF" stroke="white" strokeWidth="2"/>
          {/* Face */}
          <circle cx="43" cy="38" r="2" fill="#1F2937"/>
          <circle cx="57" cy="38" r="2" fill="#1F2937"/>
          <path d="M48 45L52 45" stroke="#1F2937" strokeWidth="2"/>
          <path d="M35 42L25 40" stroke="#1F2937" strokeWidth="1"/>
          <path d="M65 42L75 40" stroke="#1F2937" strokeWidth="1"/>
        </svg>
      );
    case 'dog':
      return (
        <svg {...commonProps}>
          {/* Body */}
          <ellipse cx="50" cy="65" rx="25" ry="20" fill="#D97706" stroke="white" strokeWidth="3"/>
          {/* Head */}
          <circle cx="50" cy="40" r="18" fill="#D97706" stroke="white" strokeWidth="3"/>
          {/* Ears (Floppy) */}
          <path d="M32 30C25 30 25 50 32 45" fill="#92400E" stroke="white" strokeWidth="2"/>
          <path d="M68 30C75 30 75 50 68 45" fill="#92400E" stroke="white" strokeWidth="2"/>
          {/* Face */}
          <circle cx="43" cy="38" r="2" fill="#1F2937"/>
          <circle cx="57" cy="38" r="2" fill="#1F2937"/>
          <circle cx="50" cy="45" r="3" fill="#1F2937"/>
        </svg>
      );
    case 'car':
      return (
        <svg {...commonProps}>
          {/* Body */}
          <rect x="20" y="50" width="60" height="20" rx="5" fill="#EF4444" stroke="white" strokeWidth="3"/>
          {/* Top */}
          <path d="M30 50L40 35L60 35L70 50" fill="#3B82F6" stroke="white" strokeWidth="3"/>
          {/* Wheels */}
          <circle cx="35" cy="70" r="8" fill="#1F2937" stroke="white" strokeWidth="2"/>
          <circle cx="65" cy="70" r="8" fill="#1F2937" stroke="white" strokeWidth="2"/>
        </svg>
      );
    case 'boy':
    default:
      return (
        <svg {...commonProps}>
          {/* Body */}
          <path d="M20 85C20 65 35 55 50 55C65 55 80 65 80 85" fill="#3B82F6" stroke="white" strokeWidth="3"/>
          {/* Head */}
          <circle cx="50" cy="35" r="20" fill="#FFD700" stroke="white" strokeWidth="3"/>
          {/* Face */}
          <circle cx="43" cy="32" r="2" fill="#1F2937"/>
          <circle cx="57" cy="32" r="2" fill="#1F2937"/>
          <path d="M45 42Q50 45 55 42" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
          {/* Hat (Adventurer style) */}
          <path d="M25 25L50 10L75 25" fill="#8B4513" stroke="white" strokeWidth="2"/>
          <rect x="25" y="22" width="50" height="5" fill="#8B4513"/>
        </svg>
      );
  }
};
