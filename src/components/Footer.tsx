import React from 'react';

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-green-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">
          © Copyright 2024{' '}
          <a
            href="https://likelook.wixsite.com/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-200 transition-colors"
          >
            Like Look Solutions
          </a>
          . All Rights Reserved
        </p>
        <a
          href="https://wa.me/+5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-200 hover:text-white transition-colors"
        >
          WhatsApp: Julio Campos Machado
        </a>
      </div>
    </footer>
  );
}