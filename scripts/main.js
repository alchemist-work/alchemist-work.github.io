document.addEventListener('DOMContentLoaded', function() {
    function fetchJSONP(url, callbackName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${url}&callback=${callbackName}`;
            document.body.appendChild(script);

            window[callbackName] = (data) => {
                resolve(data);
                document.body.removeChild(script);
                delete window[callbackName];
            };

            script.onerror = () => {
                reject(new Error(`JSONP request to ${url} failed`));
                document.body.removeChild(script);
                delete window[callbackName];
            };
        });
    }

    function generateRandomToken(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return token;
    }

    function generateRandomDigits(length) {
        const digits = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return result;
    }

    function generateRandomClientData(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_/';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    async function fetchSuggestions(searchTerm) {
        const language = document.getElementById('languageSelect').value;
        const region = document.getElementById('regionSelect').value;
        const suggestionsDiv = document.getElementById('suggestions');
        const token = generateRandomToken(22);

        // Clear previous suggestions
        suggestionsDiv.innerHTML = '';

        if (searchTerm) {
            try {
                const apiUrl = `https://suggestqueries-clients6.youtube.com/complete/search?ds=yt&hl=${language}&gl=${region}&client=youtube&gs_ri=youtube&tok=${token}&gs_id=6&q=${encodeURIComponent(searchTerm)}&cp=2`;
                const response = await fetchJSONP(apiUrl, 'handleSuggestions');

                // Parse and display suggestions
                const suggestions = response[1];
                if (suggestions.length > 0) {
                    suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.className = 'suggestion';
                        suggestionItem.textContent = suggestion[0];
                        suggestionItem.addEventListener('click', () => {
                            document.getElementById('searchInput').value = suggestion[0];
                            suggestionsDiv.innerHTML = '';
                        });
                        suggestionsDiv.appendChild(suggestionItem);
                    });
                } else {
                    suggestionsDiv.innerHTML = 'No results found.';
                }
            } catch (error) {
                suggestionsDiv.innerHTML = 'Error fetching search results.';
            }
        }
    }

    async function performSearch() {
        const searchTerm = document.getElementById('searchInput').value;
        const headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-form-factors": "\"Desktop\"",
            "sec-ch-ua-full-version": "\"133.0.6943.55\"",
            "sec-ch-ua-full-version-list": "\"Not(A:Brand\";v=\"99.0.0.0\", \"Google Chrome\";v=\"133.0.6943.55\", \"Chromium\";v=\"133.0.6943.55\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-ch-ua-platform-version": "\"15.2.0\"",
            "sec-ch-ua-wow64": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "service-worker-navigation-preload": "true",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "x-browser-channel": "stable",
            "x-browser-copyright": "Copyright 2025 Google LLC. All rights reserved.",
            "x-browser-validation": generateRandomClientData(28),
            "x-browser-year": "2025",
            "x-client-data": generateRandomClientData(120),
        };

        try {
            const apiUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: headers,
                referrerPolicy: 'strict-origin-when-cross-origin',
                mode: 'cors',
                credentials: 'include'
            });

            const data = await response.text();
            console.log(data);
            // Process the search results here
        } catch (error) {
            console.error('Error performing search:', error);
        }
    }

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value;
        fetchSuggestions(searchTerm);
    });

    document.getElementById('searchButton').addEventListener('click', performSearch);

    // JSONP callback function
    window.handleSuggestions = function (data) {
        return data;
    };
});
