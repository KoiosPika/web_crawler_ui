"use server"

export async function getCrawlData(url: string, depth: number) {
    const response = await fetch("http://13.58.34.251:5000/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_url: url, max_depth: depth }),
    });

    const data = await response.json();

    return data.crawled_pages
}
