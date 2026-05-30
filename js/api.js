/* 
   api.js
   - API integration (Quote API + optional GitHub profile link)
   - Safe fetch with timeouts and fallbacks
 */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Optional: set your GitHub username here
  const GITHUB_USERNAME = "your-github-username";

  const githubLink = $("#githubLink");
  if (githubLink && GITHUB_USERNAME && GITHUB_USERNAME !== "your-github-username") {
    githubLink.href = `https://github.com/${GITHUB_USERNAME}`;
    githubLink.textContent = `github.com/${GITHUB_USERNAME}`;
  }

  // Quote API (no key): ZenQuotes
  const quoteText = $("#quoteText");
  const quoteMeta = $("#quoteMeta");

  const fetchWithTimeout = async (url, ms = 5000) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      return res;
    } finally {
      clearTimeout(t);
    }
  };

  const setQuoteFallback = () => {
    if (!quoteText || !quoteMeta) return;
    quoteText.textContent = "Electric vehicles aren’t just cars—they’re platforms for cleaner systems and better experiences.";
    quoteMeta.textContent = "— Portfolio mantra";
  };

  const loadQuote = async () => {
    if (!quoteText || !quoteMeta) return;

    try {
      const res = await fetchWithTimeout("https://zenquotes.io/api/random", 5500);
      if (!res.ok) throw new Error("Quote request failed");

      const data = await res.json();
      // ZenQuotes returns [{ q: "...", a: "..." }]
      const q = data?.[0]?.q;
      const a = data?.[0]?.a;

      if (!q) throw new Error("Invalid quote payload");

      quoteText.textContent = `“${q}”`;
      quoteMeta.textContent = a ? `— ${a}` : "";
    } catch {
      setQuoteFallback();
    }
  };

  loadQuote();
})();
