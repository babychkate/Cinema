import React from 'react';

const AboutUsPage = () => {
    return (
        <div className="flex flex-col items-center text-center bg-gray-100">
            <div className="w-full py-8">
                <h2 className="text-4xl font-bold text-black">About Us</h2>
            </div>

            <div className="w-full max-w-xl -mt-6">
                <img
                    src="/about-us.jpg"
                    alt="Jeen Studio"
                    className="w-full h-auto rounded-lg shadow-lg"
                />
            </div>

            <div className="max-w-3xl px-6 mt-8 text-gray-700 text-lg leading-relaxed">
                <p>
                    🎬 Welcome to <strong>Jeen Studio</strong> – the place where cinema comes to life!
                    Our theater offers a unique movie-watching experience with high-quality visuals,
                    immersive sound, and a cozy atmosphere. Whether you're a fan of blockbusters or
                    indie films, Jeen Studio is the perfect destination for movie lovers.
                </p>
                <p className="mt-4">
                    With cutting-edge technology and a passion for storytelling, we bring audiences
                    together for unforgettable cinematic moments. Join us for an extraordinary
                    film experience!
                </p>
            </div>

            <footer className="w-full bg-gray-800 text-white mt-12 py-6 px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="text-left">
                    <p className="text-lg font-semibold">📍 Jeen Studio</p>
                    <p>123 Cinema Street, Movie City, 56789</p>
                    <p>📞 +1 (234) 567-890</p>
                    <p>✉️ contact@jeenstudio.com</p>
                    <p className="mt-2 text-sm text-gray-400">&copy; 2025 Jeen Studio. All rights reserved.</p>
                </div>

                <div className="mt-4 md:mt-0">
                    <p className="text-lg font-semibold text-center md:text-left mb-4">Our Developers:</p>
                    <ul className="text-center md:text-left space-y-2">
                    <li>
                            <a
                                href="https://github.com/roksolana-shendiukh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                            >
                                🌐 Roksolana Shendiukh - C# Backend Developer
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/babychkate"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                            >
                                🦄 Katia Babych - C# Backend Developer
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/Jarik13"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                            >
                                ⭐ Yaroslav Guz - Frontend Developer
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default AboutUsPage;
