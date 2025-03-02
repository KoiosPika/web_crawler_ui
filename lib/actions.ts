"use server"

import axios from "axios";

export async function getCrawlData(url: string, depth: number) {
    const response = await axios.post("http://13.58.34.251:5000/crawl", {
        start_url: url,
        max_depth: depth,
    });

    return response.data.crawled_pages
}
