import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiLogIn } from 'react-icons/fi';

export default function AuthButton() {
    const [showAuthOptions, setShowAuthOptions] = useState(false);
    const containerRef = useRef(null);

    // Hide menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowAuthOptions(false);
            }
        }
        if (showAuthOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAuthOptions]);

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAuthOptions((v) => !v);
    };

    return (
        <div
            ref={containerRef}
            className="auth-container"
            style={{
                position: 'relative',
                display: 'inline-block',
                zIndex: 9999,
            }}
        >
            <button
                type="button"
                onClick={handleButtonClick}
                className="auth-button"
                style={{
                    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 2px 10px 2px #232526, 0 4px 24px 0 #111112',
                    pointerEvents: 'auto',
                    fontWeight: 1200,
                    width: '48px',
                    height: '48px',
                    transition: 'box-shadow 0.2s, background 0.2s',
                }}
                onMouseOver={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3a3a3a 0%, #232526 100%)';
                    e.currentTarget.style.boxShadow = '0 4px 16px 4px #232526, 0 8px 32px 0 #111112';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #232526 0%, #414345 100%)';
                    e.currentTarget.style.boxShadow = '0 2px 10px 2px #232526, 0 4px 24px 0 #111112';
                }}
            >
                <FiUser size={24} color="#fff" />
            </button>

            {showAuthOptions && (
                <div
                    className="auth-options"
                    style={{
                        position: 'absolute',
                        top: '60px',
                        right: '0',
                        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '10px',
                        padding: '12px 0',
                        width: '200px',
                        boxShadow: '0 8px 32px 4px #232526, 0 16px 48px 0 #111112',
                        border: '1.5px solid #444',
                        pointerEvents: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'box-shadow 0.2s, background 0.2s',
                    }}
                >
                    <Link
                        href="/login"
                        className="auth-option"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '500',
                            fontSize: '1rem',
                            background: 'transparent',
                            transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'linear-gradient(90deg, #444 0%, #232526 100%)';
                            e.currentTarget.style.boxShadow = '0 2px 8px 0 #111112';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <FiLogIn style={{ marginRight: '12px' }} />
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="auth-option"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '500',
                            fontSize: '1rem',
                            background: 'transparent',
                            transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'linear-gradient(90deg, #444 0%, #232526 100%)';
                            e.currentTarget.style.boxShadow = '0 2px 8px 0 #111112';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <FiUser style={{ marginRight: '12px' }} />
                        Sign Up
                    </Link>
                </div>
            )}
        </div>
    );
}
